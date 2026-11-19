import { describe, it, expect } from 'vitest';
import {
  parseCpcbTimestamp,
  CpcbApiResponseSchema,
  fetchCpcbData,
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
});
