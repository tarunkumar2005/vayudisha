/**
 * Indian AQI Sub-Index Calculator
 *
 * Implements the CPCB piecewise linear interpolation formula:
 *   Ip = ((I_HI - I_LO) / (B_HI - B_LO)) * (Cp - B_LO) + I_LO
 *
 * Overall AQI = max(all sub-indices)
 * Minimum 3 valid pollutants required, at least one must be PM2.5 or PM10.
 *
 * Source: CPCB National Air Quality Index (2014)
 */

import {
  type PollutantId,
  type AqiCategory,
  type AqiCategoryInfo,
  type BreakpointEntry,
  POLLUTANT_BREAKPOINTS,
  getPollutantMeta,
  getAqiCategory,
} from './aqi-breakpoints';

export interface SubIndexResult {
  pollutantId: PollutantId;
  concentration: number;
  unit: string;
  subIndex: number;
  category: AqiCategory;
}

export interface AqiResult {
  /** Overall AQI value (max of sub-indices) */
  aqi: number;
  /** AQI category info */
  category: AqiCategoryInfo;
  /** The pollutant with the highest sub-index */
  prominentPollutant: PollutantId;
  /** All computed sub-indices */
  subIndices: SubIndexResult[];
  /** Pollutants with invalid or missing data */
  invalidPollutants: { pollutantId: string; reason: string }[];
  /** Whether this meets the CPCB minimum data requirement */
  meetsMinimumData: boolean;
}

/**
 * Calculate the sub-index for a single pollutant using CPCB breakpoints.
 *
 * @param pollutantId - CPCB pollutant identifier (e.g., 'PM2.5', 'NO2')
 * @param concentration - Measured average concentration
 * @returns Sub-index value (0-500), or null if pollutant not found or value invalid
 */
export function calculateSubIndex(
  pollutantId: string,
  concentration: number
): { subIndex: number; category: AqiCategory } | null {
  const meta = getPollutantMeta(pollutantId);
  if (!meta) return null;

  if (
    concentration < 0 ||
    !Number.isFinite(concentration) ||
    concentration === null ||
    concentration === undefined
  ) {
    return null;
  }

  // Find the matching breakpoint bracket
  const bp = findBreakpoint(meta.breakpoints, concentration);
  if (!bp) {
    // Concentration exceeds all breakpoints — cap at 500
    if (concentration > meta.breakpoints[meta.breakpoints.length - 1].concHigh) {
      return { subIndex: 500, category: 'Severe' };
    }
    return null;
  }

  // Piecewise linear interpolation
  const subIndex = interpolate(bp, concentration);
  const rounded = Math.round(subIndex);
  const catInfo = getAqiCategory(rounded);

  return {
    subIndex: rounded,
    category: catInfo?.category ?? 'Severe',
  };
}

/**
 * Calculate the overall AQI from a set of pollutant readings.
 *
 * @param readings - Map of pollutant ID to concentration value
 * @returns Full AQI result, or null if minimum data requirements are not met
 */
export function calculateOverallAQI(
  readings: Record<string, number | null | undefined>
): AqiResult | null {
  const subIndices: SubIndexResult[] = [];
  const invalidPollutants: { pollutantId: string; reason: string }[] = [];
  let hasPM = false;

  for (const [pollutantId, concentration] of Object.entries(readings)) {
    const meta = getPollutantMeta(pollutantId);
    if (!meta) {
      invalidPollutants.push({
        pollutantId,
        reason: 'Unknown pollutant identifier',
      });
      continue;
    }

    if (concentration === null || concentration === undefined) {
      invalidPollutants.push({
        pollutantId,
        reason: 'Missing reading',
      });
      continue;
    }

    if (!Number.isFinite(concentration) || concentration < 0) {
      invalidPollutants.push({
        pollutantId,
        reason: `Invalid value: ${concentration}`,
      });
      continue;
    }

    // Apply sanity limits (reject clearly erroneous data)
    if (!isReasonableConcentration(meta.id, concentration)) {
      invalidPollutants.push({
        pollutantId,
        reason: `Value ${concentration} ${meta.unit} exceeds reasonable range`,
      });
      continue;
    }

    const result = calculateSubIndex(pollutantId, concentration);
    if (result) {
      subIndices.push({
        pollutantId: meta.id,
        concentration,
        unit: meta.unit,
        subIndex: result.subIndex,
        category: result.category,
      });
      if (meta.isPM) hasPM = true;
    }
  }

  // CPCB minimum data requirement: 3+ valid pollutants, at least one PM
  const meetsMinimumData = subIndices.length >= 3 && hasPM;

  if (subIndices.length === 0) return null;

  // Sort descending by sub-index
  subIndices.sort((a, b) => b.subIndex - a.subIndex);

  const aqi = subIndices[0].subIndex;
  const categoryInfo = getAqiCategory(aqi);
  if (!categoryInfo) return null;

  return {
    aqi,
    category: categoryInfo,
    prominentPollutant: subIndices[0].pollutantId,
    subIndices,
    invalidPollutants,
    meetsMinimumData,
  };
}

// --- Internal helpers ---

function findBreakpoint(
  breakpoints: BreakpointEntry[],
  concentration: number
): BreakpointEntry | null {
  for (const bp of breakpoints) {
    if (concentration >= bp.concLow && concentration <= bp.concHigh) {
      return bp;
    }
  }
  return null;
}

function interpolate(bp: BreakpointEntry, concentration: number): number {
  const range = bp.concHigh - bp.concLow;
  if (range === 0) return bp.aqiLow;
  return (
    ((bp.aqiHigh - bp.aqiLow) / range) * (concentration - bp.concLow) +
    bp.aqiLow
  );
}

/**
 * Reject obviously erroneous readings that would indicate sensor malfunction.
 * These limits are intentionally generous — they only catch clearly broken data.
 */
function isReasonableConcentration(
  pollutantId: PollutantId,
  value: number
): boolean {
  const limits: Record<PollutantId, number> = {
    'PM2.5': 999,  // µg/m³ — even Delhi at its worst is ~500-800
    PM10: 999,     // µg/m³
    NO2: 999,      // µg/m³
    SO2: 2500,     // µg/m³
    CO: 70,        // mg/m³
    O3: 1600,      // µg/m³
    NH3: 3000,     // µg/m³
    Pb: 10,        // µg/m³
  };
  return value <= (limits[pollutantId] ?? 9999);
}
