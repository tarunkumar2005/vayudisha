/**
 * CPCB / data.gov.in OGD AQI Data Client
 *
 * Fetches real-time air quality data from India's Open Government Data platform.
 * Resource: Real-Time Air Quality Index from CPCB monitoring stations.
 *
 * Endpoint: https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69
 * Auth: API key required (free registration at data.gov.in)
 * Rate Limits: Fair-use, no hard published limit
 *
 * IMPORTANT: This is OFFICIAL Indian AQI station data. It must be:
 *   - Displayed with source attribution ("CPCB via data.gov.in")
 *   - Displayed with station name and timestamp
 *   - Never mixed with model forecast data without clear labels
 */

import { z } from 'zod';

// --- Zod schemas for OGD API response validation ---

/**
 * Schema for a single CPCB station record from data.gov.in.
 * Validated against actual observed API response structure.
 * Fields match the OGD resource schema for resource ID 3b01bcb8-...
 */
export const CpcbRecordSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  country: z.string().optional(),
  state: z.string(),
  city: z.string(),
  station: z.string(),
  last_update: z.string(), // e.g., "19-11-2026 09:00:00"
  pollutant_id: z.string(),
  pollutant_min: z
    .union([z.string(), z.number()])
    .nullish()
    .transform((v) => (v != null ? toFiniteNumber(v) : null)),
  pollutant_max: z
    .union([z.string(), z.number()])
    .nullish()
    .transform((v) => (v != null ? toFiniteNumber(v) : null)),
  pollutant_avg: z
    .union([z.string(), z.number()])
    .nullish()
    .transform((v) => (v != null ? toFiniteNumber(v) : null)),
  min_value: z
    .union([z.string(), z.number()])
    .nullish()
    .transform((v) => (v != null ? toFiniteNumber(v) : null)),
  max_value: z
    .union([z.string(), z.number()])
    .nullish()
    .transform((v) => (v != null ? toFiniteNumber(v) : null)),
  avg_value: z
    .union([z.string(), z.number()])
    .nullish()
    .transform((v) => (v != null ? toFiniteNumber(v) : null)),
  pollutant_unit: z.string().optional(),
  latitude: z
    .union([z.string(), z.number()])
    .nullish()
    .transform((v) => (v != null ? toFiniteNumber(v) : null)),
  longitude: z
    .union([z.string(), z.number()])
    .nullish()
    .transform((v) => (v != null ? toFiniteNumber(v) : null)),
});

export type CpcbRecord = z.infer<typeof CpcbRecordSchema>;

export const CpcbApiResponseSchema = z.object({
  status: z.string().optional(),
  message: z.string().optional(),
  total: z.union([z.string(), z.number()]).transform(Number),
  count: z.union([z.string(), z.number()]).transform(Number).optional(),
  limit: z.union([z.string(), z.number()]).optional(),
  offset: z.union([z.string(), z.number()]).optional(),
  records: z.array(CpcbRecordSchema),
});

export type CpcbApiResponse = z.infer<typeof CpcbApiResponseSchema>;

export const CpcbErrorResponseSchema = z.object({
  error: z.string().optional(),
  message: z.string().optional(),
});

// --- Processed types ---

export type CpcbApiStatus =
  | 'authenticated_success'
  | 'unauthorized_or_invalid_key'
  | 'rate_limited'
  | 'upstream_server_error'
  | 'schema_validation_failed'
  | 'timeout'
  | 'network_error';

export interface StationReading {
  station: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  lastUpdate: Date | null;
  lastUpdateRaw: string;
  /** Pollutant ID → average concentration */
  pollutants: Record<string, number>;
  /** Whether this reading is considered fresh (< 6 hours old) */
  isFresh: boolean;
  /** Age of the reading in minutes */
  ageMinutes: number;
}

export interface CpcbDataResult {
  source: 'cpcb';
  sourceLabel: 'CPCB via data.gov.in';
  stations: StationReading[];
  fetchedAt: string;
  /** Number of records returned by the API */
  totalRecords: number;
  /** Number of records that failed validation */
  invalidRecords: number;
  /** Whether the API responded successfully with valid records */
  apiAvailable: boolean;
  /** Diagnostic API status */
  apiStatus: CpcbApiStatus;
  /** Diagnostic status message */
  statusDetails: string;
  /** Error message if API failed */
  error?: string;
}

// --- Configuration ---

const CPCB_RESOURCE_ID = '3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69';
const CPCB_BASE_URL = `https://api.data.gov.in/resource/${CPCB_RESOURCE_ID}`;
const MAX_RECORDS_PER_REQUEST = 500;
const STALE_THRESHOLD_HOURS = 6;
const REQUEST_TIMEOUT_MS = 15_000;

// --- Client ---

export interface CpcbClientOptions {
  apiKey: string;
  /** Override base URL for testing */
  baseUrl?: string;
  /** Override timeout for testing */
  timeoutMs?: number;
  /** Override maximum record limit */
  limit?: number;
}

/**
 * Fetch CPCB station readings for a given city.
 *
 * @param city - City name (e.g., "Delhi", "Mumbai")
 * @param options - Client configuration
 * @returns Processed station readings with validation metadata
 */
export async function fetchCpcbData(
  city: string,
  options: CpcbClientOptions
): Promise<CpcbDataResult> {
  const baseUrl = options.baseUrl ?? CPCB_BASE_URL;
  const timeout = options.timeoutMs ?? REQUEST_TIMEOUT_MS;

  const url = new URL(baseUrl);
  url.searchParams.set('api-key', options.apiKey);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', (options.limit ?? MAX_RECORDS_PER_REQUEST).toString());
  url.searchParams.set('filters[city]', city);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      let errorMsg = `CPCB API returned HTTP ${response.status}`;

      // Parse known error format
      try {
        const parsed = CpcbErrorResponseSchema.parse(JSON.parse(errorBody));
        errorMsg = parsed.error ?? parsed.message ?? errorMsg;
      } catch {
        // Keep generic error message
      }

      if (response.status === 403) {
        return makeErrorResult(
          errorMsg,
          'unauthorized_or_invalid_key',
          'Inconclusive authorization result (HTTP 403): The data.gov.in API rejected authorization. An unauthenticated 403 confirms access control, but does not prove authenticated query success or valid resource schema.'
        );
      }

      if (response.status === 429) {
        return makeErrorResult(
          errorMsg,
          'rate_limited',
          'Rate limit exceeded on data.gov.in endpoint (HTTP 429).'
        );
      }

      return makeErrorResult(
        errorMsg,
        'upstream_server_error',
        `data.gov.in upstream server error (HTTP ${response.status}).`
      );
    }

    const json = await response.json();

    // Validate the response envelope
    const parseResult = CpcbApiResponseSchema.safeParse(json);
    if (!parseResult.success) {
      return makeErrorResult(
        `CPCB API response schema mismatch: ${parseResult.error.issues.map((i) => i.message).join(', ')}`,
        'schema_validation_failed',
        'Response structure from data.gov.in did not match expected CPCB schema.'
      );
    }

    const apiData = parseResult.data;

    // Process and group records by station
    return processRecords(apiData);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return makeErrorResult(
        `CPCB API request timed out after ${timeout}ms`,
        'timeout',
        'Network timeout contacting data.gov.in'
      );
    }
    return makeErrorResult(
      `CPCB API request failed: ${err instanceof Error ? err.message : String(err)}`,
      'network_error',
      'Network connectivity failure reaching data.gov.in'
    );
  }
}

// --- Processing ---

function processRecords(apiData: CpcbApiResponse): CpcbDataResult {
  const now = new Date();
  const stationMap = new Map<string, StationReading>();
  let invalidRecords = 0;

  for (const record of apiData.records) {
    // Validate the pollutant average is usable (supports both pollutant_avg and avg_value)
    const rawAvg = record.pollutant_avg ?? record.avg_value;
    if (rawAvg === null || rawAvg === undefined) {
      invalidRecords++;
      continue;
    }

    const avg = rawAvg;
    if (avg < 0 || !Number.isFinite(avg)) {
      invalidRecords++;
      continue;
    }

    // Parse the timestamp
    const lastUpdate = parseCpcbTimestamp(record.last_update);
    const ageMs = lastUpdate ? now.getTime() - lastUpdate.getTime() : Infinity;
    const ageMinutes = Math.round(ageMs / 60_000);
    const isFresh = ageMs < STALE_THRESHOLD_HOURS * 3600_000;

    // Build or update the station entry
    const stationKey = `${record.station}|${record.city}`;
    let station = stationMap.get(stationKey);

    if (!station) {
      station = {
        station: record.station,
        city: record.city,
        state: record.state,
        latitude: record.latitude ?? null,
        longitude: record.longitude ?? null,
        lastUpdate,
        lastUpdateRaw: record.last_update,
        pollutants: {},
        isFresh,
        ageMinutes,
      };
      stationMap.set(stationKey, station);
    }

    // Normalize pollutant ID and store the reading
    const pollutantId = normalizePollutantId(record.pollutant_id);
    station.pollutants[pollutantId] = avg;

    // Use the most recent timestamp for the station
    if (lastUpdate && station.lastUpdate && lastUpdate > station.lastUpdate) {
      station.lastUpdate = lastUpdate;
      station.lastUpdateRaw = record.last_update;
      station.ageMinutes = ageMinutes;
      station.isFresh = isFresh;
    }
  }

  return {
    source: 'cpcb',
    sourceLabel: 'CPCB via data.gov.in',
    stations: Array.from(stationMap.values()),
    fetchedAt: now.toISOString(),
    totalRecords: apiData.records.length,
    invalidRecords,
    apiAvailable: true,
    apiStatus: 'authenticated_success',
    statusDetails: 'Successfully authenticated and fetched valid records from data.gov.in',
  };
}

// --- Helpers ---

function makeErrorResult(
  error: string,
  apiStatus: CpcbApiStatus = 'upstream_server_error',
  statusDetails?: string
): CpcbDataResult {
  return {
    source: 'cpcb',
    sourceLabel: 'CPCB via data.gov.in',
    stations: [],
    fetchedAt: new Date().toISOString(),
    totalRecords: 0,
    invalidRecords: 0,
    apiAvailable: false,
    apiStatus,
    statusDetails: statusDetails ?? error,
    error,
  };
}

/**
 * Parse CPCB timestamp format: "DD-MM-YYYY HH:MM:SS"
 * Returns null if the timestamp is unparseable.
 */
export function parseCpcbTimestamp(raw: string): Date | null {
  if (!raw || typeof raw !== 'string') return null;

  // Expected: "19-11-2026 09:00:00"
  const match = raw.match(
    /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/
  );
  if (!match) {
    // Try ISO format as fallback
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  const [, dd, mm, yyyy, hh, min, ss] = match;
  // Construct in IST (UTC+5:30)
  const isoString = `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}+05:30`;
  const d = new Date(isoString);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Normalize pollutant ID strings from CPCB data to our standard format.
 */
function normalizePollutantId(raw: string): string {
  const upper = raw.toUpperCase().trim();
  const map: Record<string, string> = {
    'PM2.5': 'PM2.5',
    PM25: 'PM2.5',
    PM10: 'PM10',
    NO2: 'NO2',
    SO2: 'SO2',
    CO: 'CO',
    OZONE: 'O3',
    O3: 'O3',
    NH3: 'NH3',
    PB: 'Pb',
    LEAD: 'Pb',
  };
  return map[upper] ?? raw;
}

/**
 * Transform helper for Zod: convert string or number to finite number or null.
 */
function toFiniteNumber(val: string | number): number | null {
  if (typeof val === 'number') return Number.isFinite(val) ? val : null;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '' || trimmed === 'NA' || trimmed === '-') return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}
