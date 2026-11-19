/**
 * Open-Meteo CAMS Air Quality API Client
 *
 * Source: Copernicus Atmosphere Monitoring Service (CAMS) Global / Europe via Open-Meteo.
 * Endpoint: https://air-quality-api.open-meteo.com/v1/air-quality
 *
 * CRITICAL DATA RULES (MANDATORY):
 * 1. Open-Meteo CAMS data is a NUMERICAL MODEL FORECAST, NEVER an observed station reading.
 * 2. It must ALWAYS be labeled as "CAMS Model Forecast" and NEVER as "CPCB AQI" or "Official AQI".
 * 3. Never calculate official Indian CPCB AQI from a single hourly model forecast point.
 * 4. European AQI (european_aqi) is European EAQI, NEVER Indian AQI.
 */

import { z } from 'zod';

export const CamsHourlyDataSchema = z.object({
  time: z.array(z.string()),
  pm2_5: z.array(z.number().nullable()),
  pm10: z.array(z.number().nullable()),
  nitrogen_dioxide: z.array(z.number().nullable()).optional(),
  sulphur_dioxide: z.array(z.number().nullable()).optional(),
  carbon_monoxide: z.array(z.number().nullable()).optional(), // in µg/m³
  ozone: z.array(z.number().nullable()).optional(),
  european_aqi: z.array(z.number().nullable()).optional(),
});

export const CamsApiResponseSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  generationtime_ms: z.number().optional(),
  utc_offset_seconds: z.number().optional(),
  timezone: z.string().optional(),
  timezone_abbreviation: z.string().optional(),
  elevation: z.number().optional(),
  hourly_units: z.record(z.string()).optional(),
  hourly: CamsHourlyDataSchema,
});

export type CamsApiResponse = z.infer<typeof CamsApiResponseSchema>;

export interface HourlyForecastPoint {
  time: string; // ISO string e.g. "2026-11-19T14:00"
  pm2_5: number | null; // µg/m³
  pm10: number | null; // µg/m³
  no2: number | null; // µg/m³
  so2: number | null; // µg/m³
  co_mg_m3: number | null; // Converted from µg/m³ to mg/m³
  o3: number | null; // µg/m³
  european_aqi: number | null; // Stored purely as European AQI reference, never CPCB
}

export interface CamsForecastResult {
  source: 'cams_model_forecast';
  sourceLabel: 'Copernicus (CAMS) Model Forecast via Open-Meteo';
  isModelForecast: true; // Strict flag ensuring consumers know this is NOT a ground station reading
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: HourlyForecastPoint[];
  dailySummaries: DailyForecastSummary[];
  fetchedAt: string;
  apiAvailable: boolean;
  error?: string;
}

export interface DailyForecastSummary {
  date: string; // "YYYY-MM-DD"
  avgPm25: number;
  maxPm25: number;
  avgPm10: number;
  maxPm10: number;
  estimatedRiskCategory: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Severe';
  disclaimer: string;
}

const OPEN_METEO_AQ_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const DEFAULT_TIMEOUT_MS = 10_000;

export interface CamsClientOptions {
  baseUrl?: string;
  timeoutMs?: number;
}

/**
 * Fetch 1-to-5-day air quality forecast for given coordinates using Open-Meteo CAMS Global.
 */
export async function fetchCamsForecast(
  latitude: number,
  longitude: number,
  days: number = 3,
  options: CamsClientOptions = {}
): Promise<CamsForecastResult> {
  const baseUrl = options.baseUrl ?? OPEN_METEO_AQ_URL;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const url = new URL(baseUrl);
  url.searchParams.set('latitude', latitude.toFixed(4));
  url.searchParams.set('longitude', longitude.toFixed(4));
  url.searchParams.set(
    'hourly',
    'pm2_5,pm10,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide,ozone,european_aqi'
  );
  url.searchParams.set('domains', 'cams_global');
  url.searchParams.set('forecast_days', Math.min(Math.max(days, 1), 7).toString());
  url.searchParams.set('timezone', 'auto');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return makeErrorForecastResult(`Open-Meteo API returned HTTP ${res.status}`);
    }

    const json = await res.json();
    const parsed = CamsApiResponseSchema.safeParse(json);
    if (!parsed.success) {
      return makeErrorForecastResult(
        `Open-Meteo response schema invalid: ${parsed.error.issues.map((i) => i.message).join(', ')}`
      );
    }

    const data = parsed.data;
    const hourly = data.hourly;
    const points: HourlyForecastPoint[] = [];

    for (let i = 0; i < hourly.time.length; i++) {
      const co_raw = hourly.carbon_monoxide ? hourly.carbon_monoxide[i] : null;
      // Convert µg/m³ to mg/m³ for CO
      const co_mg_m3 = co_raw !== null && co_raw !== undefined ? Number((co_raw / 1000).toFixed(2)) : null;

      points.push({
        time: hourly.time[i],
        pm2_5: hourly.pm2_5[i] ?? null,
        pm10: hourly.pm10[i] ?? null,
        no2: hourly.nitrogen_dioxide ? hourly.nitrogen_dioxide[i] ?? null : null,
        so2: hourly.sulphur_dioxide ? hourly.sulphur_dioxide[i] ?? null : null,
        co_mg_m3,
        o3: hourly.ozone ? hourly.ozone[i] ?? null : null,
        european_aqi: hourly.european_aqi ? hourly.european_aqi[i] ?? null : null,
      });
    }

    const dailySummaries = computeDailySummaries(points);

    return {
      source: 'cams_model_forecast',
      sourceLabel: 'Copernicus (CAMS) Model Forecast via Open-Meteo',
      isModelForecast: true,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone ?? 'Asia/Kolkata',
      hourly: points,
      dailySummaries,
      fetchedAt: new Date().toISOString(),
      apiAvailable: true,
    };
  } catch (err) {
    return makeErrorForecastResult(
      `Open-Meteo request failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

function computeDailySummaries(points: HourlyForecastPoint[]): DailyForecastSummary[] {
  const groups = new Map<string, HourlyForecastPoint[]>();

  for (const pt of points) {
    const date = pt.time.split('T')[0];
    if (!groups.has(date)) {
      groups.set(date, []);
    }
    groups.get(date)!.push(pt);
  }

  const summaries: DailyForecastSummary[] = [];

  for (const [date, pts] of groups.entries()) {
    const validPm25 = pts.map((p) => p.pm2_5).filter((v): v is number => v !== null && Number.isFinite(v));
    const validPm10 = pts.map((p) => p.pm10).filter((v): v is number => v !== null && Number.isFinite(v));

    const avgPm25 = validPm25.length ? Math.round(validPm25.reduce((a, b) => a + b, 0) / validPm25.length) : 0;
    const maxPm25 = validPm25.length ? Math.round(Math.max(...validPm25)) : 0;
    const avgPm10 = validPm10.length ? Math.round(validPm10.reduce((a, b) => a + b, 0) / validPm10.length) : 0;
    const maxPm10 = validPm10.length ? Math.round(Math.max(...validPm10)) : 0;

    let estimatedRiskCategory: DailyForecastSummary['estimatedRiskCategory'] = 'Low';
    if (avgPm25 > 250) estimatedRiskCategory = 'Severe';
    else if (avgPm25 > 120) estimatedRiskCategory = 'Very High';
    else if (avgPm25 > 90) estimatedRiskCategory = 'High';
    else if (avgPm25 > 60) estimatedRiskCategory = 'Moderate';

    summaries.push({
      date,
      avgPm25,
      maxPm25,
      avgPm10,
      maxPm10,
      estimatedRiskCategory,
      disclaimer: 'CAMS atmospheric model forecast. Not an official CPCB station observation.',
    });
  }

  return summaries;
}

function makeErrorForecastResult(error: string): CamsForecastResult {
  return {
    source: 'cams_model_forecast',
    sourceLabel: 'Copernicus (CAMS) Model Forecast via Open-Meteo',
    isModelForecast: true,
    latitude: 0,
    longitude: 0,
    timezone: 'Asia/Kolkata',
    hourly: [],
    dailySummaries: [],
    fetchedAt: new Date().toISOString(),
    apiAvailable: false,
    error,
  };
}

/**
 * Generate synthetic CAMS forecast for offline/mock demonstration testing.
 * Runs synchronously without external network requests.
 */
export function getMockCamsForecast(latitude: number, longitude: number): CamsForecastResult {
  const points: HourlyForecastPoint[] = [];
  const now = new Date();
  for (let i = 0; i < 72; i++) {
    const d = new Date(now.getTime() + i * 3600 * 1000);
    points.push({
      time: d.toISOString(),
      pm2_5: Math.round(180 + 80 * Math.sin(i / 6)),
      pm10: Math.round(280 + 100 * Math.sin(i / 6)),
      no2: 45,
      so2: 12,
      co_mg_m3: 1.8,
      o3: 35,
      european_aqi: null,
    });
  }
  return {
    source: 'cams_model_forecast',
    sourceLabel: 'Copernicus (CAMS) Model Forecast via Open-Meteo',
    isModelForecast: true,
    latitude,
    longitude,
    timezone: 'Asia/Kolkata',
    hourly: points,
    dailySummaries: computeDailySummaries(points),
    fetchedAt: new Date().toISOString(),
    apiAvailable: true,
  };
}
