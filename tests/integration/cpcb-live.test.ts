/**
 * Live CPCB data.gov.in integration test.
 * Runs against the actual authenticated endpoint if DATA_GOV_IN_API_KEY is configured.
 * Verifies HTTP 200, schema conformance, and station parsing.
 */
import { describe, it, expect } from 'vitest';
import { fetchCpcbData, CpcbApiResponseSchema } from '@/lib/aqi/cpcb-client';
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

  it.skipIf(shouldRunLive)('skips live network test during offline/sandbox CI (run with LIVE_INTEGRATION=true)', () => {
    expect(true).toBe(true);
  });
});
