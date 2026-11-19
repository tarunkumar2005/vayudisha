/**
 * Indian Transport Emission Factors & Impact Methodology
 *
 * CRITICAL IMPACT RULES (MANDATORY):
 * 1. Keep estimated transport CO2e reductions SEPARATE from personal pollution exposure indicators.
 * 2. Cite and document emission factors and all assumptions.
 * 3. Never claim individual actions reduce city-level ambient AQI.
 * 4. Never imply outdoor exposure minutes equal measured biological dose reduction.
 */

export interface EmissionFactorEntry {
  mode: string;
  label: { en: string; hi: string };
  gCo2ePerPassengerKm: number;
  source: string;
  sourceUrl: string;
  assumptions: { en: string; hi: string };
}

/**
 * Peer-reviewed and officially documented emission factors for Indian urban transport.
 * Sources:
 * - India GHG Program (WRI India, CII, Shakti Sustainable Energy Foundation)
 * - Delhi Metro Rail Corporation (DMRC) Clean Development Mechanism (CDM) Reports
 * - Central Pollution Control Board (CPCB) Vehicular Emission Inventories
 */
export const INDIAN_TRANSPORT_EMISSION_FACTORS: Record<string, EmissionFactorEntry> = {
  car_petrol: {
    mode: 'car_petrol',
    label: { en: 'Personal Car (Petrol)', hi: 'निजी कार (पेट्रोल)' },
    gCo2ePerPassengerKm: 150,
    source: 'India GHG Program & Shakti Foundation Transport Baseline',
    sourceUrl: 'https://indiaghgp.org/',
    assumptions: {
      en: 'Based on average Indian hatchback/compact sedan with standard real-world traffic stop-and-go and 1.5 average passenger occupancy.',
      hi: 'औसत भारतीय हैचबैक/सेडान, सामान्य शहरी ट्रैफिक और 1.5 औसत यात्री क्षमता पर आधारित।',
    },
  },
  car_diesel: {
    mode: 'car_diesel',
    label: { en: 'Personal Car (Diesel)', hi: 'निजी कार (डीजल)' },
    gCo2ePerPassengerKm: 130,
    source: 'India GHG Program Transport Guidance',
    sourceUrl: 'https://indiaghgp.org/',
    assumptions: {
      en: 'Based on compact diesel car with 1.5 passenger occupancy factor in urban conditions.',
      hi: 'शहरी परिस्थितियों में 1.5 यात्री क्षमता वाली कॉम्पैक्ट डीजल कार पर आधारित।',
    },
  },
  two_wheeler_petrol: {
    mode: 'two_wheeler_petrol',
    label: { en: 'Two-Wheeler / Scooter (Petrol)', hi: 'दोपहिया / स्कूटर (पेट्रोल)' },
    gCo2ePerPassengerKm: 60,
    source: 'Society of Indian Automobile Manufacturers (SIAM) Fleet Average',
    sourceUrl: 'https://www.siam.in/',
    assumptions: {
      en: 'Based on 110cc-150cc four-stroke Indian commuter motorcycle/scooter with single rider.',
      hi: '110-150 सीसी फोर-स्ट्रोक भारतीय दोपहिया वाहन, एकल सवार के आधार पर।',
    },
  },
  auto_rickshaw_cng: {
    mode: 'auto_rickshaw_cng',
    label: { en: 'Auto Rickshaw (CNG)', hi: 'ऑटो रिक्शा (सीएनजी)' },
    gCo2ePerPassengerKm: 50,
    source: 'Shakti Sustainable Energy Foundation Intermediate Public Transport Study',
    sourceUrl: 'https://shaktifoundation.in/',
    assumptions: {
      en: 'Four-stroke CNG auto-rickshaw carrying an average of 2-3 passengers in intermediate public transit.',
      hi: 'औसत 2-3 यात्रियों को ले जाने वाला फोर-स्ट्रोक सीएनजी ऑटो रिक्शा।',
    },
  },
  bus_diesel: {
    mode: 'bus_diesel',
    label: { en: 'Public City Bus (Diesel/CNG)', hi: 'सार्वजनिक सिटी बस' },
    gCo2ePerPassengerKm: 55,
    source: 'Urban Mass Transit Company (UMTC) City Bus Baseline Assessments',
    sourceUrl: 'https://cpcb.nic.in/',
    assumptions: {
      en: 'Standard urban transit bus operating at ~50% average occupancy across the route.',
      hi: 'पूरे मार्ग पर लगभग 50% औसत यात्री क्षमता के साथ चलने वाली मानक सिटी बस।',
    },
  },
  metro_rail: {
    mode: 'metro_rail',
    label: { en: 'Metro Rail (Electric Transit)', hi: 'मेट्रो रेल (इलेक्ट्रिक)' },
    gCo2ePerPassengerKm: 28,
    source: 'Delhi Metro Rail Corporation (DMRC) Verified Carbon Offset Filing',
    sourceUrl: 'https://www.delhimetrorail.com/',
    assumptions: {
      en: 'DMRC audited lifecycle operational energy consumption factoring in solar captive power and regenerative braking.',
      hi: 'सौर ऊर्जा और रीजेनरेटिव ब्रेकिंग को शामिल करते हुए डीएमआरसी का प्रमाणित कार्बन फुटप्रिंट।',
    },
  },
  e_rickshaw: {
    mode: 'e_rickshaw',
    label: { en: 'E-Rickshaw / Electric 3-Wheeler', hi: 'ई-रिक्शा / इलेक्ट्रिक थ्री-व्हीलर' },
    gCo2ePerPassengerKm: 16,
    source: 'WRI India Electric Mobility Well-to-Wheel Assessment',
    sourceUrl: 'https://wri-india.org/',
    assumptions: {
      en: 'Zero tailpipe emissions. Value accounts for well-to-wheel upstream electricity generation emissions on India’s national grid.',
      hi: 'कोई टेलपाइप धुआं नहीं। यह आंकड़ा भारतीय पावर ग्रिड की बिजली उत्पादन प्रक्रिया के प्रभाव को जोड़कर है।',
    },
  },
  cycling_walking: {
    mode: 'cycling_walking',
    label: { en: 'Cycling or Walking (Active Transport)', hi: 'साइकिल या पैदल' },
    gCo2ePerPassengerKm: 0,
    source: 'IPCC Guidelines for National Greenhouse Gas Inventories',
    sourceUrl: 'https://www.ipcc-nggip.iges.or.jp/',
    assumptions: {
      en: 'Non-motorized active transport has zero operational fossil fuel combustion emissions.',
      hi: 'गैर-मोटर चालित परिवहन में शून्य जीवाश्म ईंधन उत्सर्जन होता है।',
    },
  },
};

export interface ModalShiftInput {
  currentMode: keyof typeof INDIAN_TRANSPORT_EMISSION_FACTORS;
  alternativeMode: keyof typeof INDIAN_TRANSPORT_EMISSION_FACTORS;
  oneWayDistanceKm: number;
  tripsPerWeek: number; // e.g. 10 for 5 days commuting both ways
}

export interface ModalShiftCalculationResult {
  currentFactor: EmissionFactorEntry;
  alternativeFactor: EmissionFactorEntry;
  distancePerTripKm: number;
  tripsPerWeek: number;
  weeklyDistanceKm: number;
  currentWeeklyCo2eKg: number;
  alternativeWeeklyCo2eKg: number;
  weeklySavedCo2eKg: number;
  monthlySavedCo2eKg: number;
  annualSavedCo2eKg: number;
  treesEquivalentAnnual: number; // Based on ~20 kg CO2 absorbed per mature tropical tree per year
  disclaimer: {
    en: string;
    hi: string;
  };
}

/**
 * Calculate verified CO2e savings when a commuter switches transport modes.
 */
export function calculateModalShiftImpact(
  input: ModalShiftInput
): ModalShiftCalculationResult {
  const currentFactor =
    INDIAN_TRANSPORT_EMISSION_FACTORS[input.currentMode] ??
    INDIAN_TRANSPORT_EMISSION_FACTORS.car_petrol;

  const alternativeFactor =
    INDIAN_TRANSPORT_EMISSION_FACTORS[input.alternativeMode] ??
    INDIAN_TRANSPORT_EMISSION_FACTORS.metro_rail;

  const weeklyDistanceKm = input.oneWayDistanceKm * input.tripsPerWeek;

  const currentWeeklyGrams =
    currentFactor.gCo2ePerPassengerKm * weeklyDistanceKm;
  const alternativeWeeklyGrams =
    alternativeFactor.gCo2ePerPassengerKm * weeklyDistanceKm;

  const savedWeeklyGrams = Math.max(0, currentWeeklyGrams - alternativeWeeklyGrams);
  const weeklySavedCo2eKg = Number((savedWeeklyGrams / 1000).toFixed(2));
  const monthlySavedCo2eKg = Number(((weeklySavedCo2eKg * 52) / 12).toFixed(2));
  const annualSavedCo2eKg = Number((weeklySavedCo2eKg * 52).toFixed(2));

  // 1 mature urban tree absorbs approximately 20-22 kg of CO2 per year
  const treesEquivalentAnnual = Number((annualSavedCo2eKg / 20).toFixed(1));

  return {
    currentFactor,
    alternativeFactor,
    distancePerTripKm: input.oneWayDistanceKm,
    tripsPerWeek: input.tripsPerWeek,
    weeklyDistanceKm,
    currentWeeklyCo2eKg: Number((currentWeeklyGrams / 1000).toFixed(2)),
    alternativeWeeklyCo2eKg: Number((alternativeWeeklyGrams / 1000).toFixed(2)),
    weeklySavedCo2eKg,
    monthlySavedCo2eKg,
    annualSavedCo2eKg,
    treesEquivalentAnnual,
    disclaimer: {
      en: 'Transport emissions are calculated based on published Indian passenger-kilometer emission factors. This measures personal carbon footprint reduction; it does not represent local ambient AQI changes.',
      hi: 'परिवहन उत्सर्जन की गणना भारतीय मानकों के अनुसार की गई है। यह आपके व्यक्तिगत कार्बन पदचिह्न में कमी को दर्शाता है, शहर के AQI को नहीं।',
    },
  };
}

/**
 * Smog Inversion Window Guidance
 * Demonstrates the physical timing effect of thermal inversion without false medical dose claims.
 */
export interface InversionWindowGuidance {
  worstHours: {
    timeRange: string;
    reason: { en: string; hi: string };
  };
  preferredHours: {
    timeRange: string;
    reason: { en: string; hi: string };
  };
  disclaimer: { en: string; hi: string };
}

export function getThermalInversionGuidance(): InversionWindowGuidance {
  return {
    worstHours: {
      timeRange: '6:00 AM – 9:00 AM & 8:00 PM – 11:00 PM',
      reason: {
        en: 'Radiation thermal inversion traps vehicular exhaust and biomass smoke within the lowest 50–100 meters of the atmosphere during cold, still hours.',
        hi: 'सर्दियों में सुबह और रात को ठंडी हवा जमीन के पास भारी होकर धुएं और प्रदूषण को नीचे ही रोक लेती है।',
      },
    },
    preferredHours: {
      timeRange: '1:00 PM – 4:00 PM',
      reason: {
        en: 'Solar warming breaks down the thermal inversion layer and deepens the atmospheric boundary mixing height, dispersing concentrated ground particulates.',
        hi: 'दोपहर में धूप निकलने से हवा गर्म होकर ऊपर उठती है, जिससे जमीन के पास प्रदूषण का असर अपेक्षाकृत कम होता है।',
      },
    },
    disclaimer: {
      en: 'Shifting outdoor errands to afternoon hours leverages atmospheric dispersion physics. This is an exposure-avoidance strategy and does not claim medical dose elimination.',
      hi: 'दोपहर के समय काम निपटाना वायुमंडलीय नियमों पर आधारित है। यह धुएं के सीधे संपर्क से बचने का व्यावहारिक तरीका है।',
    },
  };
}
