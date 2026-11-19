/**
 * Live CPCB data.gov.in integration test.
 * Runs against the actual authenticated endpoint if DATA_GOV_IN_API_KEY is configured.
 * Verifies HTTP 200, schema conformance, station parsing, and unified AQI calculation.
 */
import { describe, it, expect } from 'vitest';
import { fetchCpcbData } from '@/lib/aqi/cpcb-client';
import fs from 'fs';

// Read API key from environment or .env.local
let apiKey = process.env.DATA_GOV_IN_API_KEY || '';
if (!apiKey && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/DATA_GOV_IN_API_KEY=([^\s]+)/);
  if (match) apiKey = match[1];
}

const isLiveKeyAvailable = Boolean(apiKey && apiKey !== 'your_data_gov_in_api_key_here');
// Only run network tests when explicitly requested (requires network access)
const shouldRunLive = isLiveKeyAvailable && (process.env.LIVE_INTEGRATION === 'true' || process.env.CI_LIVE === 'true');

describe('Live CPCB data.gov.in Authenticated Integration', () => {
  it.runIf(shouldRunLive)(
    'returns HTTP 200 and valid schema when queried with real API key',
    async () => {
      const result = await fetchCpcbData('Delhi', { apiKey, limit: 10, timeoutMs: 25_000 });
      console.log('Result 1:', {
        apiAvailable: result.apiAvailable,
        apiStatus: result.apiStatus,
        error: result.error,
        statusDetails: result.statusDetails,
      });

      // Must be authenticated and successful
      expect(result.apiAvailable).toBe(true);
      expect(result.apiStatus).toBe('authenticated_success');
      expect(result.totalRecords).toBeGreaterThan(0);
      expect(result.stations.length).toBeGreaterThan(0);

      // Verify at least one station has station name, city, and pollutants
      const firstStation = result.stations[0];
      expect(firstStation.station).toBeTruthy();
      expect(firstStation.city).toBe('Delhi');
      expect(Object.keys(firstStation.pollutants).length).toBeGreaterThan(0);
    },
    30_000 // 30s timeout for government API
  );

  it.runIf(shouldRunLive)(
    'returns official CPCB ground data with valid AQI for delhi via getUnifiedAqi',
    async () => {
      const { getUnifiedAqi } = await import('@/lib/aqi/aqi-merger');

      // Test station-level query
      const stationRes = await fetchCpcbData('Delhi', {
        apiKey: apiKey!,
        station: 'Anand Vihar, Delhi - DPCC',
        timeoutMs: 25_000,
      });

      expect(stationRes.apiAvailable).toBe(true);
      expect(stationRes.apiStatus).toBe('authenticated_success');
      expect(stationRes.stations.length).toBe(1);
      const anandVihar = stationRes.stations[0];
      expect(anandVihar.station).toContain('Anand Vihar');
      expect(Object.keys(anandVihar.pollutants).length).toBeGreaterThanOrEqual(3);
      expect(anandVihar.pollutants['PM2.5']).toBeDefined();

      // Test getUnifiedAqi end-to-end with live API key
      const data = await getUnifiedAqi('delhi', { cpcbApiKey: apiKey! });

      console.log('Live getUnifiedAqi result:', {
        aqi: data.current.aqi,
        category: data.current.category,
        stationName: data.current.stationName,
        isModelForecast: data.current.isModelForecast,
        dataSource: data.current.dataSource,
        statusNotice: data.status.notice,
      });

      // Must be official ground station data, NOT model fallback
      expect(data.current.isModelForecast).toBe(false);
      expect(data.current.dataSource).toBe('cpcb_official');
      expect(data.current.aqi).toBeTypeOf('number');
      expect(data.current.aqi).toBeGreaterThan(0);
      expect(data.status.officialCpcbAvailable).toBe(true);
      expect(data.status.isFallback).toBe(false);
      expect(data.status.notice).toBeUndefined();
    },
    30_000
  );

  it.skipIf(shouldRunLive)('skips live network test during offline/sandbox CI (run with LIVE_INTEGRATION=true)', () => {
    expect(true).toBe(true);
  });
});
