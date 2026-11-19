import { describe, it, expect } from 'vitest';
import {
  fetchCamsForecast,
  CamsApiResponseSchema,
} from '@/lib/aqi/open-meteo-client';

const MOCK_CAMS_RESPONSE = {
  latitude: 28.6,
  longitude: 77.2,
  generationtime_ms: 0.2,
  utc_offset_seconds: 19800,
  timezone: 'Asia/Kolkata',
  timezone_abbreviation: 'GMT+5:30',
  elevation: 214,
  hourly_units: {
    time: 'iso8601',
    pm2_5: 'μg/m³',
    pm10: 'μg/m³',
    carbon_monoxide: 'μg/m³',
    nitrogen_dioxide: 'μg/m³',
    sulphur_dioxide: 'μg/m³',
    ozone: 'μg/m³',
    european_aqi: 'EAQI',
  },
  hourly: {
    time: [
      '2026-11-19T00:00',
      '2026-11-19T01:00',
      '2026-11-19T02:00',
    ],
    pm2_5: [78.2, 75.4, 74.3],
    pm10: [80.1, 77.1, 75.4],
    carbon_monoxide: [1431.0, 1227.0, 1069.0], // µg/m³
    nitrogen_dioxide: [42.6, 35.2, 29.7],
    sulphur_dioxide: [20.9, 19.1, 18.0],
    ozone: [35.0, 39.0, 41.0],
    european_aqi: [68, 65, 62],
  },
};

describe('Open-Meteo CAMS Air Quality Client', () => {
  it('validates CAMS API response against Zod schema', () => {
    const parsed = CamsApiResponseSchema.safeParse(MOCK_CAMS_RESPONSE);
    expect(parsed.success).toBe(true);
  });

  it('correctly tags response as a model forecast (NEVER ground station observation)', async () => {
    const mockFetcher = async () =>
      new Response(JSON.stringify(MOCK_CAMS_RESPONSE), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    const orig = global.fetch;
    global.fetch = mockFetcher as unknown as typeof fetch;

    try {
      const res = await fetchCamsForecast(28.6, 77.2, 1);
      expect(res.apiAvailable).toBe(true);
      expect(res.source).toBe('cams_model_forecast');
      expect(res.isModelForecast).toBe(true);
      expect(res.sourceLabel).toContain('Copernicus (CAMS)');

      // Verify conversion of CO from µg/m³ to mg/m³
      // 1431.0 µg/m³ -> 1.43 mg/m³
      expect(res.hourly[0].co_mg_m3).toBe(1.43);

      // Verify daily summaries
      expect(res.dailySummaries.length).toBe(1);
      expect(res.dailySummaries[0].disclaimer).toContain('Not an official CPCB station observation');
      expect(res.dailySummaries[0].avgPm25).toBe(76);
    } finally {
      global.fetch = orig;
    }
  });

  it('handles API failure gracefully with clear error result', async () => {
    const mockFetcher = async () =>
      new Response('Internal Server Error', { status: 500 });

    const orig = global.fetch;
    global.fetch = mockFetcher as unknown as typeof fetch;

    try {
      const res = await fetchCamsForecast(28.6, 77.2, 1);
      expect(res.apiAvailable).toBe(false);
      expect(res.error).toContain('HTTP 500');
      expect(res.hourly).toHaveLength(0);
    } finally {
      global.fetch = orig;
    }
  });
});
