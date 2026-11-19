/**
 * CPCB National AQI Breakpoint Table
 * Source: Central Pollution Control Board, India
 * Reference: https://cpcb.nic.in/National-Air-Quality-Index/
 *
 * Each pollutant has concentration breakpoints mapped to AQI sub-index ranges.
 * The overall AQI = max(all sub-indices).
 * Minimum 3 valid pollutants required, including at least one of PM2.5 or PM10.
 */

export type PollutantId =
  | 'PM2.5'
  | 'PM10'
  | 'NO2'
  | 'SO2'
  | 'CO'
  | 'O3'
  | 'NH3'
  | 'Pb';

export type AqiCategory =
  | 'Good'
  | 'Satisfactory'
  | 'Moderate'
  | 'Poor'
  | 'Very Poor'
  | 'Severe';

export interface AqiCategoryInfo {
  category: AqiCategory;
  range: [number, number];
  color: string;
  textColor: string;
  healthImpact: {
    en: string;
    hi: string;
  };
}

export interface BreakpointEntry {
  aqiLow: number;
  aqiHigh: number;
  concLow: number;
  concHigh: number;
}

export interface PollutantMeta {
  id: PollutantId;
  name: { en: string; hi: string };
  unit: string;
  averagingPeriod: string;
  /** Whether this counts as a PM pollutant for the minimum-data rule */
  isPM: boolean;
  breakpoints: BreakpointEntry[];
}

/**
 * AQI category definitions with WCAG-AA-compliant text colors.
 */
export const AQI_CATEGORIES: AqiCategoryInfo[] = [
  {
    category: 'Good',
    range: [0, 50],
    color: '#00B050',
    textColor: '#FFFFFF',
    healthImpact: {
      en: 'Minimal impact on health.',
      hi: 'स्वास्थ्य पर न्यूनतम प्रभाव।',
    },
  },
  {
    category: 'Satisfactory',
    range: [51, 100],
    color: '#92D050',
    textColor: '#1A1A1A',
    healthImpact: {
      en: 'Minor breathing discomfort to sensitive people.',
      hi: 'संवेदनशील लोगों को मामूली साँस लेने में तकलीफ।',
    },
  },
  {
    category: 'Moderate',
    range: [101, 200],
    color: '#FFFF00',
    textColor: '#1A1A1A',
    healthImpact: {
      en: 'Breathing discomfort to people with lung/heart disease, children, and older adults.',
      hi: 'फेफड़े/हृदय रोग वाले लोगों, बच्चों और बुजुर्गों को साँस लेने में तकलीफ।',
    },
  },
  {
    category: 'Poor',
    range: [201, 300],
    color: '#FF8C00',
    textColor: '#FFFFFF',
    healthImpact: {
      en: 'Breathing discomfort on prolonged exposure. Affects most people.',
      hi: 'लंबे समय तक संपर्क में रहने पर साँस लेने में तकलीफ। अधिकांश लोग प्रभावित।',
    },
  },
  {
    category: 'Very Poor',
    range: [301, 400],
    color: '#FF0000',
    textColor: '#FFFFFF',
    healthImpact: {
      en: 'Respiratory illness on prolonged exposure. Affects everyone.',
      hi: 'लंबे समय तक संपर्क में रहने पर श्वसन रोग। सभी प्रभावित।',
    },
  },
  {
    category: 'Severe',
    range: [401, 500],
    color: '#8B0000',
    textColor: '#FFFFFF',
    healthImpact: {
      en: 'Affects healthy people. Serious impact on those with existing diseases.',
      hi: 'स्वस्थ लोगों को भी प्रभावित करता है। मौजूदा बीमारियों वाले लोगों पर गंभीर प्रभाव।',
    },
  },
];

/**
 * CPCB Breakpoint table for each pollutant.
 * Concentration units match CPCB standard:
 *   PM2.5, PM10, NO2, SO2, O3, NH3 → µg/m³
 *   CO → mg/m³
 *   Pb → µg/m³
 */
export const POLLUTANT_BREAKPOINTS: PollutantMeta[] = [
  {
    id: 'PM2.5',
    name: { en: 'PM2.5', hi: 'पीएम2.5' },
    unit: 'µg/m³',
    averagingPeriod: '24-hour',
    isPM: true,
    breakpoints: [
      { aqiLow: 0, aqiHigh: 50, concLow: 0, concHigh: 30 },
      { aqiLow: 51, aqiHigh: 100, concLow: 31, concHigh: 60 },
      { aqiLow: 101, aqiHigh: 200, concLow: 61, concHigh: 90 },
      { aqiLow: 201, aqiHigh: 300, concLow: 91, concHigh: 120 },
      { aqiLow: 301, aqiHigh: 400, concLow: 121, concHigh: 250 },
      { aqiLow: 401, aqiHigh: 500, concLow: 251, concHigh: 500 },
    ],
  },
  {
    id: 'PM10',
    name: { en: 'PM10', hi: 'पीएम10' },
    unit: 'µg/m³',
    averagingPeriod: '24-hour',
    isPM: true,
    breakpoints: [
      { aqiLow: 0, aqiHigh: 50, concLow: 0, concHigh: 50 },
      { aqiLow: 51, aqiHigh: 100, concLow: 51, concHigh: 100 },
      { aqiLow: 101, aqiHigh: 200, concLow: 101, concHigh: 250 },
      { aqiLow: 201, aqiHigh: 300, concLow: 251, concHigh: 350 },
      { aqiLow: 301, aqiHigh: 400, concLow: 351, concHigh: 430 },
      { aqiLow: 401, aqiHigh: 500, concLow: 431, concHigh: 600 },
    ],
  },
  {
    id: 'NO2',
    name: { en: 'NO₂', hi: 'नाइट्रोजन डाइऑक्साइड' },
    unit: 'µg/m³',
    averagingPeriod: '24-hour',
    isPM: false,
    breakpoints: [
      { aqiLow: 0, aqiHigh: 50, concLow: 0, concHigh: 40 },
      { aqiLow: 51, aqiHigh: 100, concLow: 41, concHigh: 80 },
      { aqiLow: 101, aqiHigh: 200, concLow: 81, concHigh: 180 },
      { aqiLow: 201, aqiHigh: 300, concLow: 181, concHigh: 280 },
      { aqiLow: 301, aqiHigh: 400, concLow: 281, concHigh: 400 },
      { aqiLow: 401, aqiHigh: 500, concLow: 401, concHigh: 800 },
    ],
  },
  {
    id: 'SO2',
    name: { en: 'SO₂', hi: 'सल्फर डाइऑक्साइड' },
    unit: 'µg/m³',
    averagingPeriod: '24-hour',
    isPM: false,
    breakpoints: [
      { aqiLow: 0, aqiHigh: 50, concLow: 0, concHigh: 40 },
      { aqiLow: 51, aqiHigh: 100, concLow: 41, concHigh: 80 },
      { aqiLow: 101, aqiHigh: 200, concLow: 81, concHigh: 380 },
      { aqiLow: 201, aqiHigh: 300, concLow: 381, concHigh: 800 },
      { aqiLow: 301, aqiHigh: 400, concLow: 801, concHigh: 1600 },
      { aqiLow: 401, aqiHigh: 500, concLow: 1601, concHigh: 2400 },
    ],
  },
  {
    id: 'CO',
    name: { en: 'CO', hi: 'कार्बन मोनोऑक्साइड' },
    unit: 'mg/m³',
    averagingPeriod: '8-hour',
    isPM: false,
    breakpoints: [
      { aqiLow: 0, aqiHigh: 50, concLow: 0, concHigh: 1.0 },
      { aqiLow: 51, aqiHigh: 100, concLow: 1.1, concHigh: 2.0 },
      { aqiLow: 101, aqiHigh: 200, concLow: 2.1, concHigh: 10 },
      { aqiLow: 201, aqiHigh: 300, concLow: 10.1, concHigh: 17 },
      { aqiLow: 301, aqiHigh: 400, concLow: 17.1, concHigh: 34 },
      { aqiLow: 401, aqiHigh: 500, concLow: 34.1, concHigh: 68 },
    ],
  },
  {
    id: 'O3',
    name: { en: 'O₃ (Ozone)', hi: 'ओज़ोन' },
    unit: 'µg/m³',
    averagingPeriod: '8-hour',
    isPM: false,
    breakpoints: [
      { aqiLow: 0, aqiHigh: 50, concLow: 0, concHigh: 50 },
      { aqiLow: 51, aqiHigh: 100, concLow: 51, concHigh: 100 },
      { aqiLow: 101, aqiHigh: 200, concLow: 101, concHigh: 168 },
      { aqiLow: 201, aqiHigh: 300, concLow: 169, concHigh: 208 },
      { aqiLow: 301, aqiHigh: 400, concLow: 209, concHigh: 748 },
      { aqiLow: 401, aqiHigh: 500, concLow: 749, concHigh: 1500 },
    ],
  },
  {
    id: 'NH3',
    name: { en: 'NH₃ (Ammonia)', hi: 'अमोनिया' },
    unit: 'µg/m³',
    averagingPeriod: '24-hour',
    isPM: false,
    breakpoints: [
      { aqiLow: 0, aqiHigh: 50, concLow: 0, concHigh: 200 },
      { aqiLow: 51, aqiHigh: 100, concLow: 201, concHigh: 400 },
      { aqiLow: 101, aqiHigh: 200, concLow: 401, concHigh: 800 },
      { aqiLow: 201, aqiHigh: 300, concLow: 801, concHigh: 1200 },
      { aqiLow: 301, aqiHigh: 400, concLow: 1201, concHigh: 1800 },
      { aqiLow: 401, aqiHigh: 500, concLow: 1801, concHigh: 2700 },
    ],
  },
  {
    id: 'Pb',
    name: { en: 'Pb (Lead)', hi: 'सीसा' },
    unit: 'µg/m³',
    averagingPeriod: '24-hour',
    isPM: false,
    breakpoints: [
      { aqiLow: 0, aqiHigh: 50, concLow: 0, concHigh: 0.5 },
      { aqiLow: 51, aqiHigh: 100, concLow: 0.6, concHigh: 1.0 },
      { aqiLow: 101, aqiHigh: 200, concLow: 1.1, concHigh: 2.0 },
      { aqiLow: 201, aqiHigh: 300, concLow: 2.1, concHigh: 3.0 },
      { aqiLow: 301, aqiHigh: 400, concLow: 3.1, concHigh: 3.5 },
      { aqiLow: 401, aqiHigh: 500, concLow: 3.6, concHigh: 7.0 },
    ],
  },
];

/**
 * Find the AQI category for a given AQI value.
 */
export function getAqiCategory(aqi: number): AqiCategoryInfo | null {
  if (aqi < 0 || !Number.isFinite(aqi)) return null;
  const capped = Math.min(aqi, 500);
  return (
    AQI_CATEGORIES.find(
      (cat) => capped >= cat.range[0] && capped <= cat.range[1]
    ) ?? AQI_CATEGORIES[AQI_CATEGORIES.length - 1]
  );
}

/**
 * Look up the pollutant metadata by its ID (case-insensitive match).
 */
export function getPollutantMeta(id: string): PollutantMeta | undefined {
  const normalized = id.toUpperCase().replace(/\s+/g, '');
  // Handle common variants from CPCB data
  const aliasMap: Record<string, PollutantId> = {
    'PM2.5': 'PM2.5',
    PM25: 'PM2.5',
    PM10: 'PM10',
    NO2: 'NO2',
    SO2: 'SO2',
    CO: 'CO',
    O3: 'O3',
    OZONE: 'O3',
    NH3: 'NH3',
    PB: 'Pb',
    LEAD: 'Pb',
  };
  const mapped = aliasMap[normalized];
  if (!mapped) return undefined;
  return POLLUTANT_BREAKPOINTS.find((p) => p.id === mapped);
}
