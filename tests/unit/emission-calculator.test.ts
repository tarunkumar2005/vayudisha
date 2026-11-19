import { describe, it, expect } from 'vitest';
import {
  calculateModalShiftImpact,
  getThermalInversionGuidance,
  INDIAN_TRANSPORT_EMISSION_FACTORS,
} from '@/lib/impact/emission-factors';

describe('Transport Emission Calculator & Impact Rules', () => {
  it('correctly calculates weekly and monthly CO2e savings when shifting from Petrol Car to Metro Rail', () => {
    // 15 km each way, 10 trips per week (5 day round-trip commute)
    // Total weekly km = 150 km
    // Car petrol: 150 g/km * 150 km = 22,500 g = 22.50 kg
    // Metro rail: 28 g/km * 150 km = 4,200 g = 4.20 kg
    // Savings = 18.30 kg / week
    const res = calculateModalShiftImpact({
      currentMode: 'car_petrol',
      alternativeMode: 'metro_rail',
      oneWayDistanceKm: 15,
      tripsPerWeek: 10,
    });

    expect(res.weeklyDistanceKm).toBe(150);
    expect(res.currentWeeklyCo2eKg).toBe(22.5);
    expect(res.alternativeWeeklyCo2eKg).toBe(4.2);
    expect(res.weeklySavedCo2eKg).toBe(18.3);
    // Monthly: (18.3 * 52) / 12 = 79.3 kg
    expect(res.monthlySavedCo2eKg).toBeCloseTo(79.3, 0);
    // Annual trees equivalent: (18.3 * 52) / 20 = 47.58 trees
    expect(res.treesEquivalentAnnual).toBeGreaterThan(45);
  });

  it('guarantees cycling and walking have 0 emissions', () => {
    expect(INDIAN_TRANSPORT_EMISSION_FACTORS.cycling_walking.gCo2ePerPassengerKm).toBe(0);

    const res = calculateModalShiftImpact({
      currentMode: 'two_wheeler_petrol',
      alternativeMode: 'cycling_walking',
      oneWayDistanceKm: 5,
      tripsPerWeek: 6,
    });

    expect(res.alternativeWeeklyCo2eKg).toBe(0);
    expect(res.weeklySavedCo2eKg).toBeGreaterThan(0);
  });

  it('includes mandatory disclaimer distinguishing CO2e footprint from ambient AQI readings', () => {
    const res = calculateModalShiftImpact({
      currentMode: 'car_diesel',
      alternativeMode: 'bus_diesel',
      oneWayDistanceKm: 10,
      tripsPerWeek: 10,
    });

    expect(res.disclaimer.en).toContain('does not represent local ambient AQI changes');
    expect(res.disclaimer.hi).toContain('शहर के AQI को नहीं');
  });

  it('provides thermal inversion timing guidance conditioned on actual AQI and MoHFW/NCDC advisory (Item 6)', () => {
    // Normal / moderate AQI: afternoon dispersion offers relative window
    const inversion = getThermalInversionGuidance(150);
    expect(inversion.worstHours.timeRange).toContain('6:00 AM');
    expect(inversion.preferredHours.timeRange).toContain('1:00 PM');
    expect(inversion.disclaimer.en).toContain('October 2025 MoHFW/NCDC advisory');

    // Severe smog (AQI > 400): afternoon air is NOT clean; MoHFW/NCDC urges staying indoors
    const severeInversion = getThermalInversionGuidance(430);
    expect(severeInversion.preferredHours.timeRange).toContain('Avoid outdoor exposure all day');
    expect(severeInversion.preferredHours.reason.en).toContain('CRITICAL ADVISORY');
    expect(severeInversion.preferredHours.reason.en).toContain('MoHFW/NCDC');
  });

  it('audits Indian transport emission factors, CEA grid mix, and citations (Item 8)', () => {
    // Metro Rail incorporates CEA grid emission factor
    const metro = INDIAN_TRANSPORT_EMISSION_FACTORS.metro_rail;
    expect(metro.gCo2ePerPassengerKm).toBe(28);
    expect(metro.source).toContain('DMRC');
    expect(metro.assumptions.en).toContain('Central Electricity Authority (CEA)');
    expect(metro.assumptions.en).toContain('716 g CO2/kWh');

    // E-Rickshaw incorporates CEA grid emission factor
    const erickshaw = INDIAN_TRANSPORT_EMISSION_FACTORS.e_rickshaw;
    expect(erickshaw.gCo2ePerPassengerKm).toBe(16);
    expect(erickshaw.assumptions.en).toContain('716 g CO2/kWh');
  });
});
