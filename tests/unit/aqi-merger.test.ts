import { describe, it, expect, vi } from 'vitest';
import { getUnifiedAqi } from '@/lib/aqi/aqi-merger';
import * as CpcbClient from '@/lib/aqi/cpcb-client';
import * as CamsClient from '@/lib/aqi/open-meteo-client';

describe('Unified AQI Merger & Critical Rules Compliance', () => {
  it('displays official ground station AQI with full attribution when CPCB is available', async () => {
    vi.spyOn(CpcbClient, 'fetchCpcbData').mockResolvedValueOnce({
      source: 'cpcb',
      sourceLabel: 'CPCB via data.gov.in',
      stations: [
        {
          station: 'ITO, Delhi - CPCB',
          city: 'Delhi',
          state: 'Delhi',
          latitude: 28.62,
          longitude: 77.24,
          lastUpdate: new Date(),
          lastUpdateRaw: '19-11-2026 10:00:00',
          pollutants: {
            'PM2.5': 180,
            PM10: 240,
            NO2: 60,
            SO2: 15,
            CO: 1.5,
          },
          isFresh: true,
          ageMinutes: 10,
        },
      ],
      fetchedAt: new Date().toISOString(),
      totalRecords: 5,
      invalidRecords: 0,
      apiAvailable: true,
      apiStatus: 'authenticated_success',
      statusDetails: 'Successfully authenticated and fetched valid records from data.gov.in',
    });

    vi.spyOn(CamsClient, 'fetchCamsForecast').mockResolvedValueOnce({
      source: 'cams_model_forecast',
      sourceLabel: 'Copernicus (CAMS) Model Forecast via Open-Meteo',
      isModelForecast: true,
      latitude: 28.61,
      longitude: 77.2,
      timezone: 'Asia/Kolkata',
      hourly: [],
      dailySummaries: [],
      fetchedAt: new Date().toISOString(),
      apiAvailable: true,
    });

    const result = await getUnifiedAqi('delhi', { cpcbApiKey: 'valid-test-key' });

    expect(result.current.dataSource).toBe('cpcb_official');
    expect(result.current.isModelForecast).toBe(false);
    expect(result.current.aqi).toBeGreaterThan(300); // 180 PM2.5 is Very Poor
    expect(result.current.prominentPollutant).toBe('PM2.5');
    expect(result.current.stationName).toBe('ITO, Delhi - CPCB');
    expect(result.status.officialCpcbAvailable).toBe(true);
    expect(result.status.isFallback).toBe(false);
  });

  it('transparently falls back to CAMS model forecast and leaves aqi as null when CPCB is down', async () => {
    vi.spyOn(CpcbClient, 'fetchCpcbData').mockResolvedValueOnce({
      source: 'cpcb',
      sourceLabel: 'CPCB via data.gov.in',
      stations: [],
      fetchedAt: new Date().toISOString(),
      totalRecords: 0,
      invalidRecords: 0,
      apiAvailable: false,
      apiStatus: 'upstream_server_error',
      statusDetails: 'CPCB downtime error',
      error: 'CPCB downtime error',
    });

    vi.spyOn(CamsClient, 'fetchCamsForecast').mockResolvedValueOnce({
      source: 'cams_model_forecast',
      sourceLabel: 'Copernicus (CAMS) Model Forecast via Open-Meteo',
      isModelForecast: true,
      latitude: 28.61,
      longitude: 77.2,
      timezone: 'Asia/Kolkata',
      hourly: [
        {
          time: '2026-11-19T10:00',
          pm2_5: 95,
          pm10: 120,
          no2: 30,
          so2: 10,
          co_mg_m3: 1.1,
          o3: 25,
          european_aqi: 60,
        },
      ],
      dailySummaries: [],
      fetchedAt: new Date().toISOString(),
      apiAvailable: true,
    });

    const result = await getUnifiedAqi('delhi', { cpcbApiKey: 'key' });

    // CRITICAL RULES VERIFICATION:
    expect(result.current.dataSource).toBe('cams_model_forecast');
    expect(result.current.isModelForecast).toBe(true);
    // Never calculate official Indian AQI from a single hourly model forecast
    expect(result.current.aqi).toBeNull();
    expect(result.status.officialCpcbAvailable).toBe(false);
    expect(result.status.isFallback).toBe(true);
    expect(result.status.notice?.en).toContain('Official CPCB ground station data is currently unavailable');
    expect(result.status.notice?.hi).toContain('आधिकारिक सीपीसीबी स्टेशन डेटा उपलब्ध नहीं है');
  });

  it('provides demonstration mode with realistic telemetry when forceMock is active', async () => {
    const result = await getUnifiedAqi('delhi', { useMockFallback: true });
    expect(result.current.dataSource).toBe('mock_demonstration');
    expect(result.current.aqi).toBeGreaterThan(300);
    expect(result.current.stationName).toContain('Anand Vihar');
    expect(result.status.isFallback).toBe(true);
  });
});
