import { describe, it, expect, beforeEach } from 'vitest';
import {
  parseCpcbTimestamp,
  CpcbApiResponseSchema,
  fetchCpcbData,
  clearCpcbCache,
} from '@/lib/aqi/cpcb-client';
import {
  MOCK_DELHI_SMOG_CPCB_RESPONSE,
  MOCK_CORRUPTED_CPCB_RESPONSE,
  MOCK_STALE_CPCB_RESPONSE,
} from '../fixtures/cpcb-sample';

describe('CPCB Timestamp Parsing', () => {
  it('correctly parses CPCB Indian standard date format DD-MM-YYYY HH:MM:SS', () => {
    const raw = '19-11-2026 09:30:00';
    const date = parseCpcbTimestamp(raw);
    expect(date).not.toBeNull();
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(10); // 0-indexed November
    expect(date?.getDate()).toBe(19);
  });

  it('returns null for unparseable timestamps', () => {
    expect(parseCpcbTimestamp('not-a-date')).toBeNull();
    expect(parseCpcbTimestamp('')).toBeNull();
  });
});

describe('CPCB Response Schema & Processing', () => {
  beforeEach(() => {
    clearCpcbCache();
  });
  it('validates a real Delhi smog CPCB response against Zod schema', () => {
    const parsed = CpcbApiResponseSchema.safeParse(MOCK_DELHI_SMOG_CPCB_RESPONSE);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.records.length).toBe(6);
      expect(parsed.data.records[0].pollutant_avg).toBe(315);
      expect(parsed.data.records[0].city).toBe('Delhi');
    }
  });

  it('processes mock CPCB data into structured station readings with freshness', async () => {
    // Custom mock fetcher
    const mockFetcher = async () =>
      new Response(JSON.stringify(MOCK_DELHI_SMOG_CPCB_RESPONSE), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    // We can test by setting global fetch temporarily
    const originalFetch = global.fetch;
    global.fetch = mockFetcher as unknown as typeof fetch;

    try {
      const result = await fetchCpcbData('Delhi', { apiKey: 'dummy-test-key' });
      expect(result.apiAvailable).toBe(true);
      expect(result.source).toBe('cpcb');
      expect(result.sourceLabel).toBe('CPCB via data.gov.in');
      expect(result.stations.length).toBe(1);

      const station = result.stations[0];
      expect(station.station).toContain('Anand Vihar');
      expect(station.pollutants['PM2.5']).toBe(315);
      expect(station.pollutants['PM10']).toBe(412);
      expect(station.pollutants['CO']).toBe(2.3);
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('rejects negative or invalid values and increments invalidRecords count', async () => {
    const mockFetcher = async () =>
      new Response(JSON.stringify(MOCK_CORRUPTED_CPCB_RESPONSE), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    const originalFetch = global.fetch;
    global.fetch = mockFetcher as unknown as typeof fetch;

    try {
      const result = await fetchCpcbData('Delhi', { apiKey: 'dummy-test-key' });
      expect(result.apiAvailable).toBe(true);
      expect(result.invalidRecords).toBeGreaterThan(0);
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('flags stale records older than 6 hours as isFresh = false', async () => {
    const mockFetcher = async () =>
      new Response(JSON.stringify(MOCK_STALE_CPCB_RESPONSE), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    const originalFetch = global.fetch;
    global.fetch = mockFetcher as unknown as typeof fetch;

    try {
      const result = await fetchCpcbData('Lucknow', { apiKey: 'dummy-test-key' });
      expect(result.apiAvailable).toBe(true);
      expect(result.stations.length).toBe(1);
      expect(result.stations[0].isFresh).toBe(false);
      expect(result.stations[0].ageMinutes).toBeGreaterThan(6 * 60);
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('treats HTTP 403 as an inconclusive authorization result and records diagnostic apiStatus', async () => {
    const mockFetcher = async () =>
      new Response(JSON.stringify({ error: 'Key not authorised' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });

    const originalFetch = global.fetch;
    global.fetch = mockFetcher as unknown as typeof fetch;

    try {
      const result = await fetchCpcbData('Delhi', { apiKey: 'bad-key' });
      expect(result.apiAvailable).toBe(false);
      expect(result.apiStatus).toBe('unauthorized_or_invalid_key');
      expect(result.statusDetails).toContain('Inconclusive authorization result (HTTP 403)');
      expect(result.error).toContain('Key not authorised');
      expect(result.stations).toHaveLength(0);
    } finally {
      global.fetch = originalFetch;
    }
  });

  it('caches HTTP 429 rate limit response for 2 minutes and expires thereafter', async () => {
    let callCount = 0;
    const mockFetcher = async () => {
      callCount++;
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    };

    const originalFetch = global.fetch;
    global.fetch = mockFetcher as unknown as typeof fetch;

    try {
      // First call (bypass progressive backoff in test by passing _retryCount: 2)
      const res1 = await fetchCpcbData('Delhi', { apiKey: 'test-key', _retryCount: 2 });
      expect(res1.apiStatus).toBe('rate_limited');
      expect(callCount).toBe(1);

      // Second call immediately within 2 minutes should hit the rate-limit cache without fetching
      const res2 = await fetchCpcbData('Delhi', { apiKey: 'test-key', _retryCount: 2 });
      expect(res2.apiStatus).toBe('rate_limited');
      expect(callCount).toBe(1); // Cached, no extra network call

      // Advance time beyond 2-minute TTL (e.g. 125,000 ms) by manipulating Date.now or cache
      const originalDateNow = Date.now;
      Date.now = () => originalDateNow() + 125000;

      try {
        const res3 = await fetchCpcbData('Delhi', { apiKey: 'test-key', _retryCount: 2 });
        expect(res3.apiStatus).toBe('rate_limited');
        expect(callCount).toBe(2); // Cache expired after 2 minutes, new fetch triggered
      } finally {
        Date.now = originalDateNow;
      }
    } finally {
      global.fetch = originalFetch;
    }
  });
});
