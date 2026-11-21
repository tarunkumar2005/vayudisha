import { describe, it, expect, beforeEach } from 'vitest';
import { getUnifiedAqi } from '@/lib/aqi/aqi-merger';
import fs from 'fs';

let apiKey = process.env.DATA_GOV_IN_API_KEY || '';
if (!apiKey && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/DATA_GOV_IN_API_KEY=([^\s]+)/);
  if (match) apiKey = match[1];
}

const isLiveKeyAvailable = Boolean(apiKey && apiKey !== 'your_data_gov_in_api_key_here');
const shouldRunLive = isLiveKeyAvailable && (process.env.LIVE_INTEGRATION === 'true' || process.env.CI_LIVE === 'true');

describe('Multi-City CPCB Integration and Fallback Matrix', () => {
  describe('Mock / Offline Demonstration Mode', () => {
    it('returns official CPCB data for Delhi in simulated demonstration mode', async () => {
      const result = await getUnifiedAqi('delhi', { useMockFallback: true });
      expect(result.current.aqi).toBeTypeOf('number');
      expect(result.current.dataSource).toBe('mock_demonstration');
      expect(result.current.stationName).toContain('Anand Vihar');
      expect(result.status.isFallback).toBe(true);
    });

    it('handles locations without continuous stations transparently as State B (Copernicus CAMS atmospheric forecast)', async () => {
      const result = await getUnifiedAqi('shimla', { useMockFallback: true });
      expect(result.current.isModelForecast).toBe(true);
      expect(result.current.dataSource).toBe('cams_model_forecast');
      expect(result.status.officialCpcbAvailable).toBe(false);
      expect(result.status.isFallback).toBe(true);
      expect(result.status.notice).toBeDefined();
      expect(result.status.notice?.en).toContain('Copernicus (CAMS)');
    });

    it('handles Jamshedpur transparently as State B (Copernicus CAMS atmospheric forecast)', async () => {
      const result = await getUnifiedAqi('jamshedpur', { useMockFallback: true });
      expect(result.current.isModelForecast).toBe(true);
      expect(result.current.dataSource).toBe('cams_model_forecast');
      expect(result.status.officialCpcbAvailable).toBe(false);
      expect(result.status.isFallback).toBe(true);
      expect(result.status.notice).toBeDefined();
      expect(result.status.notice?.en).toContain('Copernicus (CAMS)');
    });
  });

  describe('Live Multi-City CAAQMS Authenticated Integration', () => {
    // Small inter-test delay to prevent triggering data.gov.in burst rate limit
    beforeEach(async () => {
      await new Promise((r) => setTimeout(r, 1000));
    });

    it.runIf(shouldRunLive)(
      'resolves Mumbai official CPCB ground telemetry via Colaba station without dropping to CAMS',
      async () => {
        const result = await getUnifiedAqi('mumbai', { cpcbApiKey: apiKey });
        expect(result.city.id).toBe('mumbai');
        expect(result.current.dataSource).toBe('cpcb_official');
        expect(result.current.isModelForecast).toBe(false);
        expect(result.current.aqi).toBeTypeOf('number');
        expect(result.current.aqi).toBeGreaterThan(0);
        expect(result.current.stationName).toContain('Mumbai');
        expect(result.status.officialCpcbAvailable).toBe(true);
      },
      30_000
    );

    it.runIf(shouldRunLive)(
      'resolves Bengaluru official CPCB ground telemetry via Jayanagar station without dropping to CAMS',
      async () => {
        const result = await getUnifiedAqi('bengaluru', { cpcbApiKey: apiKey });
        console.log('Bengaluru live result:', {
          dataSource: result.current.dataSource,
          isModelForecast: result.current.isModelForecast,
          aqi: result.current.aqi,
          stationName: result.current.stationName,
          cpcbApiStatus: result.status.cpcbApiStatus,
          cpcbStatusDetails: result.status.cpcbStatusDetails,
          notice: result.status.notice,
          stationsCount: result.stations.length,
        });
        expect(result.city.id).toBe('bengaluru');
        expect(result.current.dataSource).toBe('cpcb_official');
        expect(result.current.isModelForecast).toBe(false);
        expect(result.current.aqi).toBeTypeOf('number');
        expect(result.current.aqi).toBeGreaterThan(0);
        expect(result.current.stationName).toContain('Bengaluru');
        expect(result.status.officialCpcbAvailable).toBe(true);
      },
      30_000
    );

    it.runIf(shouldRunLive)(
      'resolves alias "bangalore" and returns Bengaluru official ground data',
      async () => {
        const result = await getUnifiedAqi('bangalore', { cpcbApiKey: apiKey });
        expect(result.city.id).toBe('bengaluru');
        expect(result.city.name.en).toBe('Bengaluru');
        expect(result.current.dataSource).toBe('cpcb_official');
        expect(result.status.officialCpcbAvailable).toBe(true);
      },
      30_000
    );

    it.runIf(shouldRunLive)(
      'resolves Delhi official ground telemetry with sub-indices and multi-station data',
      async () => {
        const result = await getUnifiedAqi('delhi', { cpcbApiKey: apiKey });
        expect(result.city.id).toBe('delhi');
        expect(result.current.dataSource).toBe('cpcb_official');
        expect(result.current.aqi).toBeGreaterThan(0);
        expect(result.current.subIndices).toBeDefined();
        expect(result.current.subIndices!.length).toBeGreaterThanOrEqual(3);
      },
      30_000
    );

    it.runIf(shouldRunLive)(
      'resolves Pune official CPCB ground telemetry via Savitribai Phule Pune University',
      async () => {
        const result = await getUnifiedAqi('pune', { cpcbApiKey: apiKey });
        expect(result.city.id).toBe('pune');
        expect(result.current.dataSource).toBe('cpcb_official');
        expect(result.current.isModelForecast).toBe(false);
        expect(result.current.aqi).toBeTypeOf('number');
        expect(result.current.aqi).toBeGreaterThan(0);
        expect(result.current.stationName).toContain('Pune');
      },
      30_000
    );

    it.runIf(shouldRunLive)(
      'resolves Chennai official CPCB ground telemetry via Perungudi station',
      async () => {
        const result = await getUnifiedAqi('chennai', { cpcbApiKey: apiKey });
        expect(result.city.id).toBe('chennai');
        expect(result.current.dataSource).toBe('cpcb_official');
        expect(result.current.isModelForecast).toBe(false);
        expect(result.current.aqi).toBeTypeOf('number');
        expect(result.current.aqi).toBeGreaterThan(0);
        expect(result.current.stationName).toContain('Chennai');
      },
      30_000
    );

    it.runIf(shouldRunLive)(
      'resolves Jorapokhar official CPCB ground telemetry via Tata Stadium continuous station',
      async () => {
        const result = await getUnifiedAqi('jorapokhar', { cpcbApiKey: apiKey });
        expect(result.city.id).toBe('jorapokhar');
        expect(result.current.dataSource).toBe('cpcb_official');
        expect(result.current.isModelForecast).toBe(false);
        expect(result.current.aqi).toBeTypeOf('number');
        expect(result.current.aqi).toBeGreaterThan(0);
        expect(result.current.stationName).toBe('Tata Stadium, Jorapokhar - JSPCB');
      },
      30_000
    );

    it.runIf(shouldRunLive)(
      'preserves transparent CAMS model forecast fallback (State B) for Jamshedpur even with live API key',
      async () => {
        const result = await getUnifiedAqi('jamshedpur', { cpcbApiKey: apiKey });
        expect(result.city.id).toBe('jamshedpur');
        expect(result.current.isModelForecast).toBe(true);
        expect(result.current.dataSource).toBe('cams_model_forecast');
        expect(result.status.officialCpcbAvailable).toBe(false);
        expect(result.status.isFallback).toBe(true);
        expect(result.status.notice).toBeDefined();
        expect(result.status.notice?.en).toContain('Copernicus (CAMS)');
      },
      30_000
    );
  });
});
