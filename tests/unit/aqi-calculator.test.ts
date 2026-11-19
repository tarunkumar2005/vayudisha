import { describe, it, expect } from 'vitest';
import {
  calculateSubIndex,
  calculateOverallAQI,
} from '@/lib/aqi/aqi-calculator';
import {
  getAqiCategory,
  getPollutantMeta,
} from '@/lib/aqi/aqi-breakpoints';

describe('CPCB Breakpoints & Metadata', () => {
  it('correctly maps pollutant aliases to canonical CPCB IDs', () => {
    expect(getPollutantMeta('PM2.5')?.id).toBe('PM2.5');
    expect(getPollutantMeta('PM25')?.id).toBe('PM2.5');
    expect(getPollutantMeta('ozone')?.id).toBe('O3');
    expect(getPollutantMeta('O3')?.id).toBe('O3');
    expect(getPollutantMeta('CO')?.unit).toBe('mg/m³');
    expect(getPollutantMeta('PM2.5')?.isPM).toBe(true);
    expect(getPollutantMeta('NO2')?.isPM).toBe(false);
  });

  it('correctly categorizes AQI levels', () => {
    expect(getAqiCategory(25)?.category).toBe('Good');
    expect(getAqiCategory(50)?.category).toBe('Good');
    expect(getAqiCategory(75)?.category).toBe('Satisfactory');
    expect(getAqiCategory(100)?.category).toBe('Satisfactory');
    expect(getAqiCategory(150)?.category).toBe('Moderate');
    expect(getAqiCategory(250)?.category).toBe('Poor');
    expect(getAqiCategory(350)?.category).toBe('Very Poor');
    expect(getAqiCategory(450)?.category).toBe('Severe');
    expect(getAqiCategory(600)?.category).toBe('Severe'); // Capped
    expect(getAqiCategory(-5)).toBeNull();
  });
});

describe('calculateSubIndex (Piecewise Linear Interpolation)', () => {
  it('calculates PM2.5 = 75 µg/m³ correctly', () => {
    // 75 falls in Moderate (61 - 90), AQI range (101 - 200)
    // Sub-index = ((200 - 101) / (90 - 61)) * (75 - 61) + 101
    // ((99) / 29) * 14 + 101 = 47.79 + 101 = 148.79 -> 149
    // Wait, let's verify breakpoint:
    // In our table: 101-200 is concLow: 61, concHigh: 90
    const res = calculateSubIndex('PM2.5', 75);
    expect(res).not.toBeNull();
    expect(res?.category).toBe('Moderate');
    expect(res?.subIndex).toBeGreaterThanOrEqual(145);
    expect(res?.subIndex).toBeLessThanOrEqual(155);
  });

  it('calculates PM2.5 boundary cases', () => {
    expect(calculateSubIndex('PM2.5', 0)?.subIndex).toBe(0);
    expect(calculateSubIndex('PM2.5', 30)?.subIndex).toBe(50);
    expect(calculateSubIndex('PM2.5', 60)?.subIndex).toBe(100);
  });

  it('calculates CO sub-index with mg/m³ unit', () => {
    // CO: 1.5 mg/m³ is Satisfactory (1.1 - 2.0 mg/m³ -> 51 - 100)
    const res = calculateSubIndex('CO', 1.5);
    expect(res).not.toBeNull();
    expect(res?.category).toBe('Satisfactory');
    expect(res?.subIndex).toBeGreaterThanOrEqual(51);
    expect(res?.subIndex).toBeLessThanOrEqual(100);
  });

  it('handles negative or invalid values gracefully', () => {
    expect(calculateSubIndex('PM2.5', -10)).toBeNull();
    expect(calculateSubIndex('PM2.5', NaN)).toBeNull();
    expect(calculateSubIndex('NON_EXISTENT_POLLUTANT', 50)).toBeNull();
  });

  it('caps extreme concentrations at 500 (Severe)', () => {
    const res = calculateSubIndex('PM2.5', 750);
    expect(res?.subIndex).toBe(500);
    expect(res?.category).toBe('Severe');
  });
});

describe('calculateOverallAQI (CPCB Multi-Pollutant Aggregation)', () => {
  it('identifies the prominent pollutant as the highest sub-index', () => {
    const readings = {
      'PM2.5': 140, // Very Poor (> 300)
      PM10: 120, // Moderate (~113)
      NO2: 40, // Good (50)
      SO2: 20, // Good (25)
      CO: 1.2, // Satisfactory (~56)
    };

    const result = calculateOverallAQI(readings);
    expect(result).not.toBeNull();
    expect(result?.meetsMinimumData).toBe(true);
    expect(result?.prominentPollutant).toBe('PM2.5');
    expect(result?.category?.category).toBe('Very Poor');
    expect(result?.aqi).toBeGreaterThanOrEqual(301);
    expect(result?.isDerivedEstimate).toBe(true);
  });

  it('enforces CPCB minimum data requirement: at least 3 pollutants, at least 1 PM; returns null AQI if insufficient', () => {
    // Only 2 pollutants
    const twoPollutants = {
      'PM2.5': 80,
      NO2: 40,
    };
    const res2 = calculateOverallAQI(twoPollutants);
    expect(res2?.meetsMinimumData).toBe(false);
    expect(res2?.aqi).toBeNull();
    expect(res2?.category).toBeNull();

    // 3 pollutants but NO PM pollutant
    const noPm = {
      NO2: 40,
      SO2: 20,
      CO: 1.0,
    };
    const resNoPm = calculateOverallAQI(noPm);
    expect(resNoPm?.meetsMinimumData).toBe(false);
    expect(resNoPm?.aqi).toBeNull();
    expect(resNoPm?.category).toBeNull();

    // 3 pollutants WITH PM
    const valid = {
      PM10: 150,
      NO2: 40,
      SO2: 20,
    };
    const resValid = calculateOverallAQI(valid);
    expect(resValid?.meetsMinimumData).toBe(true);
    expect(resValid?.aqi).not.toBeNull();
    expect(resValid?.category).not.toBeNull();
  });

  it('enforces 16-hour data completeness rule for 24h pollutants and 6h for 8h pollutants', () => {
    // PM2.5 with only 12 hours monitored (< 16h) should be rejected
    const pollutantInputs = [
      { pollutantId: 'PM2.5', concentration: 150, hoursMonitored: 12 }, // Incomplete (< 16h)
      { pollutantId: 'PM10', concentration: 180, hoursMonitored: 20 },  // Complete (>= 16h)
      { pollutantId: 'NO2', concentration: 45, hoursMonitored: 18 },    // Complete (>= 16h)
      { pollutantId: 'CO', concentration: 1.2, hoursMonitored: 4 },     // Incomplete (< 6h)
      { pollutantId: 'SO2', concentration: 25, hoursMonitored: 19 },    // Complete (>= 16h)
    ];

    const result = calculateOverallAQI(pollutantInputs);
    expect(result).not.toBeNull();
    // PM2.5 (12h) and CO (4h) should be flagged in invalidPollutants as INSUFFICIENT_HOURS
    expect(
      result?.invalidPollutants.some(
        (p) => p.pollutantId === 'PM2.5' && p.reason === 'INSUFFICIENT_HOURS'
      )
    ).toBe(true);
    expect(
      result?.invalidPollutants.some(
        (p) => p.pollutantId === 'CO' && p.reason === 'INSUFFICIENT_HOURS'
      )
    ).toBe(true);

    // Remaining valid: PM10, NO2, SO2 (3 pollutants with at least 1 PM -> meets minimum data)
    expect(result?.meetsMinimumData).toBe(true);
    expect(result?.prominentPollutant).toBe('PM10');
  });

  it('distinguishes official supplied AQI from derived estimate', () => {
    const derived = calculateOverallAQI({ 'PM2.5': 120, PM10: 150, NO2: 40 });
    expect(derived?.isOfficialSuppliedAqi).toBe(false);
    expect(derived?.isDerivedEstimate).toBe(true);
    expect(derived?.methodologyNote).toContain('Derived');

    const official = calculateOverallAQI(
      { 'PM2.5': 120, PM10: 150, NO2: 40 },
      { isOfficialSuppliedAqi: true }
    );
    expect(official?.isOfficialSuppliedAqi).toBe(true);
    expect(official?.isDerivedEstimate).toBe(false);
    expect(official?.methodologyNote).toContain('Official');
  });

  it('discards unreasonable / sensor glitch readings', () => {
    const readingsWithGlitch = {
      'PM2.5': 85,
      PM10: 99999, // glitch!
      NO2: 50,
      SO2: 20,
    };

    const result = calculateOverallAQI(readingsWithGlitch);
    expect(result).not.toBeNull();
    expect(result?.invalidPollutants.some((p) => p.pollutantId === 'PM10')).toBe(true);
    // Overall AQI should be based on PM2.5, not 99999
    expect(result?.prominentPollutant).toBe('PM2.5');
  });
});
