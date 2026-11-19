/**
 * Indian AQI Sub-Index Calculator
 *
 * Implements the official CPCB piecewise linear interpolation formula:
 *   Ip = ((I_HI - I_LO) / (B_HI - B_LO)) * (Cp - B_LO) + I_LO
 *
 * CRITICAL REGULATORY METHODOLOGY (CPCB 2014):
 * 1. Averaging & Data Completeness:
 *    - 24-hour pollutants (PM2.5, PM10, NO2, SO2, NH3, Pb) require at least 16 hours of valid monitoring.
 *    - 8-hour pollutants (CO, O3) require at least 6 hours of valid monitoring.
 *    - Readings with fewer hours than the threshold are flagged as INSUFFICIENT_HOURS and excluded from regulatory AQI.
 * 2. Minimum Data Requirement for Overall AQI:
 *    - Must monitor at least 3 valid pollutants.
 *    - At least one MUST be a particulate matter pollutant (PM2.5 or PM10).
 *    - If criteria are not met, the overall AQI cannot be determined and is set to NULL ("Data Insufficient").
 * 3. Aggregation:
 *    - The overall AQI is the MAXIMUM (worst) sub-index among the eligible valid pollutants.
 *    - The pollutant yielding the highest sub-index is the Prominent Pollutant.
 * 4. Provenance:
 *    - Distinguishes "Official CPCB Supplied AQI" from "Derived CPCB Sub-Index Estimate".
 *
 * Source: CPCB National Air Quality Index (2014)
 */

import {
  type PollutantId,
  type AqiCategory,
  type AqiCategoryInfo,
  type BreakpointEntry,
  getPollutantMeta,
  getAqiCategory,
} from './aqi-breakpoints';

export interface SubIndexResult {
  pollutantId: PollutantId;
  concentration: number;
  unit: string;
  subIndex: number;
  category: AqiCategory;
  averagingPeriod: '24-hour' | '8-hour';
  hoursMonitored?: number;
  isSufficientHours?: boolean;
}

export interface PollutantInputObject {
  concentration: number | null | undefined;
  hoursMonitored?: number;
}

export type PollutantInput = number | null | undefined | PollutantInputObject;

export interface AqiResult {
  /** Overall AQI value (max of valid sub-indices), or NULL if minimum data requirements are not met */
  aqi: number | null;
  /** AQI category info, or NULL if data insufficient */
  category: AqiCategoryInfo | null;
  /** The pollutant with the highest sub-index, or NULL if data insufficient */
  prominentPollutant: PollutantId | null;
  /** All computed valid sub-indices */
  subIndices: SubIndexResult[];
  /** Pollutants with invalid or missing data or insufficient monitored hours */
  invalidPollutants: { pollutantId: string; reason: string }[];
  /** Whether this meets the CPCB minimum data requirement (>=3 pollutants, >=1 PM) */
  meetsMinimumData: boolean;
  /** Provenance tracking */
  isOfficialSuppliedAqi: boolean;
  isDerivedEstimate: boolean;
  methodologyNote: string;
}

/**
 * Calculate the sub-index for a single pollutant using CPCB breakpoints.
 *
 * @param pollutantId - CPCB pollutant identifier (e.g., 'PM2.5', 'NO2', 'CO')
 * @param concentration - Measured average concentration
 * @param hoursMonitored - Number of hours monitored during the regulatory window (optional)
 * @returns Sub-index value (0-500) and category, or null if value invalid or monitoring hours insufficient
 */
export function calculateSubIndex(
  pollutantId: string,
  concentration: number,
  hoursMonitored?: number
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

  // Check CPCB minimum data completeness hours if specified
  if (
    hoursMonitored !== undefined &&
    hoursMonitored < meta.minimumDataCompletenessHours
  ) {
    return null; // Insufficient monitoring hours for regulatory average
  }

  // Find matching breakpoint bracket
  const bp = findBreakpoint(meta.breakpoints, concentration);
  if (!bp) {
    // Concentration exceeds all breakpoints — cap at 500 (Severe)
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
 * Calculate the overall AQI from a set of pollutant readings according to official CPCB methodology.
 *
 * @param readings - Map of pollutant ID to concentration value or { concentration, hoursMonitored }
 * @param options - Optional flags (e.g. official supplied AQI)
 * @returns Full AQI result with strict null handling if minimum criteria are not met
 */
export function calculateOverallAQI(
  readings:
    | Record<string, PollutantInput>
    | (PollutantInputObject & { pollutantId: string })[],
  options: { officialSuppliedAqi?: number | null; isOfficialSuppliedAqi?: boolean } = {}
): AqiResult {
  const subIndices: SubIndexResult[] = [];
  const invalidPollutants: { pollutantId: string; reason: string }[] = [];
  let hasPM = false;

  const entries: [string, PollutantInput][] = Array.isArray(readings)
    ? readings.map((item) => [item.pollutantId, item])
    : Object.entries(readings);

  for (const [pollutantId, input] of entries) {
    const meta = getPollutantMeta(pollutantId);
    if (!meta) {
      invalidPollutants.push({
        pollutantId,
        reason: 'Unknown pollutant identifier',
      });
      continue;
    }

    let conc: number | null | undefined;
    let hours: number | undefined;

    if (typeof input === 'object' && input !== null) {
      conc = input.concentration;
      hours = input.hoursMonitored;
    } else {
      conc = input;
    }

    if (conc === null || conc === undefined) {
      invalidPollutants.push({
        pollutantId: meta.id,
        reason: 'Missing reading',
      });
      continue;
    }

    if (!Number.isFinite(conc) || conc < 0) {
      invalidPollutants.push({
        pollutantId: meta.id,
        reason: `Invalid concentration value: ${conc}`,
      });
      continue;
    }

    // Apply sanity limits (reject clearly erroneous sensor data)
    if (!isReasonableConcentration(meta.id, conc)) {
      invalidPollutants.push({
        pollutantId: meta.id,
        reason: `Value ${conc} ${meta.unit} exceeds plausible atmospheric physical limit`,
      });
      continue;
    }

    // Check CPCB 16-hour (24h avg) or 6-hour (8h avg) data completeness rule
    if (hours !== undefined && hours < meta.minimumDataCompletenessHours) {
      invalidPollutants.push({
        pollutantId: meta.id,
        reason: 'INSUFFICIENT_HOURS',
      });
      continue;
    }

    const result = calculateSubIndex(pollutantId, conc, hours);
    if (result) {
      subIndices.push({
        pollutantId: meta.id,
        concentration: conc,
        unit: meta.unit,
        subIndex: result.subIndex,
        category: result.category,
        averagingPeriod: meta.averagingPeriod,
        hoursMonitored: hours ?? meta.requiredAveragingHours,
        isSufficientHours: true,
      });
      if (meta.isPM) hasPM = true;
    }
  }

  // CPCB minimum data requirement: at least 3 valid pollutants, at least one PM
  const meetsMinimumData = subIndices.length >= 3 && hasPM;

  // Sort descending by sub-index
  subIndices.sort((a, b) => b.subIndex - a.subIndex);

  // If official supplied AQI is directly provided by CPCB feed, we record it
  const isOfficial =
    options.isOfficialSuppliedAqi === true ||
    (options.officialSuppliedAqi !== undefined && options.officialSuppliedAqi !== null);

  if (isOfficial) {
    const officialAqi =
      options.officialSuppliedAqi !== undefined && options.officialSuppliedAqi !== null
        ? options.officialSuppliedAqi
        : subIndices.length > 0
          ? subIndices[0].subIndex
          : null;
    const cat = officialAqi !== null ? getAqiCategory(officialAqi) : null;
    return {
      aqi: officialAqi,
      category: cat,
      prominentPollutant: subIndices.length > 0 ? subIndices[0].pollutantId : null,
      subIndices,
      invalidPollutants,
      meetsMinimumData,
      isOfficialSuppliedAqi: true,
      isDerivedEstimate: false,
      methodologyNote:
        'Official CPCB station AQI directly supplied in CPCB data bulletin/telemetry feed.',
    };
  }

  // If minimum CPCB data criteria are NOT met, official AQI cannot be determined
  if (!meetsMinimumData || subIndices.length === 0) {
    return {
      aqi: null, // Strictly null when criteria not met
      category: null,
      prominentPollutant: null,
      subIndices,
      invalidPollutants,
      meetsMinimumData,
      isOfficialSuppliedAqi: false,
      isDerivedEstimate: false,
      methodologyNote: `Data Insufficient under CPCB methodology: requires at least 3 valid pollutants including at least one PM pollutant (PM2.5 or PM10) with >=16h valid monitoring. Available: ${subIndices.length} valid pollutants, hasPM: ${hasPM}.`,
    };
  }

  // Derived CPCB Sub-Index Estimate (Maximum Sub-Index)
  const aqi = subIndices[0].subIndex;
  const categoryInfo = getAqiCategory(aqi);

  return {
    aqi,
    category: categoryInfo,
    prominentPollutant: subIndices[0].pollutantId,
    subIndices,
    invalidPollutants,
    meetsMinimumData: true,
    isOfficialSuppliedAqi: false,
    isDerivedEstimate: true,
    methodologyNote: `Derived CPCB Sub-Index Estimate: calculated as maximum sub-index across ${subIndices.length} eligible pollutants with valid regulatory averaging. Prominent pollutant: ${subIndices[0].pollutantId}.`,
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
  const concRange = bp.concHigh - bp.concLow;
  if (concRange === 0) return bp.aqiLow;
  return (
    ((bp.aqiHigh - bp.aqiLow) / concRange) * (concentration - bp.concLow) +
    bp.aqiLow
  );
}

/**
 * Reject sensor glitches and unphysical electronic noise.
 */
function isReasonableConcentration(
  pollutantId: PollutantId,
  value: number
): boolean {
  const limits: Record<PollutantId, number> = {
    'PM2.5': 999,  // µg/m³
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
