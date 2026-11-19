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

  it('provides thermal inversion timing guidance with physics-based dispersion rationale', () => {
    const inversion = getThermalInversionGuidance();
    expect(inversion.worstHours.timeRange).toContain('6:00 AM');
    expect(inversion.preferredHours.timeRange).toContain('1:00 PM');
    expect(inversion.disclaimer.en).toContain('does not claim medical dose elimination');
  });
});
