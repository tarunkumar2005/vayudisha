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
    source: 'Delhi Metro Rail Corporation (DMRC) Verified Carbon Offset Filing & CEA CO2 Database',
    sourceUrl: 'https://www.delhimetrorail.com/',
    assumptions: {
      en: 'DMRC audited lifecycle operational energy consumption. Incorporates Central Electricity Authority (CEA) national grid emission factor (~716 g CO2/kWh), captive rooftop solar power, and regenerative train braking.',
      hi: 'केंद्रीय विद्युत प्राधिकरण (सीईए) के राष्ट्रीय ग्रिड उत्सर्जन कारक (~716 ग्राम CO2/kWh), सौर ऊर्जा और रीजेनरेटिव ब्रेकिंग को शामिल करते हुए डीएमआरसी का प्रमाणित कार्बन फुटप्रिंट।',
    },
  },
  e_rickshaw: {
    mode: 'e_rickshaw',
    label: { en: 'E-Rickshaw / Electric 3-Wheeler', hi: 'ई-रिक्शा / इलेक्ट्रिक थ्री-व्हीलर' },
    gCo2ePerPassengerKm: 16,
    source: 'WRI India Electric Mobility Well-to-Wheel Assessment (CEA Grid Baseline)',
    sourceUrl: 'https://wri-india.org/',
    assumptions: {
      en: 'Zero direct tailpipe emissions. Well-to-wheel calculation accounts for Indian Central Electricity Authority grid factor (~716 g CO2/kWh) for battery charging.',
      hi: 'कोई प्रत्यक्ष टेलपाइप धुआं नहीं। यह आंकड़ा भारतीय सीईए ग्रिड उत्सर्जन कारक (~716 ग्राम CO2/kWh) से बैटरी चार्जिंग के प्रभाव को जोड़कर है।',
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
 * Demonstrates the physical timing effect of thermal inversion without false medical claims.
 * Conditioned on actual/current AQI severity in accordance with the October 2025 MoHFW/NCDC advisory.
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

export function getThermalInversionGuidance(currentAqi?: number | null): InversionWindowGuidance {
  const isSevere = currentAqi != null && currentAqi > 400;
  const isVeryPoor = currentAqi != null && currentAqi > 300;

  return {
    worstHours: {
      timeRange: '6:00 AM – 9:00 AM & 8:00 PM – 11:00 PM',
      reason: {
        en: 'Radiation thermal inversion traps vehicular exhaust, road dust, and smoke within a shallow surface boundary layer (50–100 m) during cold, stagnant hours.',
        hi: 'सर्दियों में सुबह और रात को ठंडी हवा जमीन के पास भारी होकर धुएं और प्रदूषण को नीचे ही रोक लेती है (थर्मल इनवर्जन)।',
      },
    },
    preferredHours: {
      timeRange: isSevere
        ? 'Avoid outdoor exposure all day (MoHFW/NCDC)'
        : '1:00 PM – 4:00 PM (Subject to real-time AQI check)',
      reason: {
        en: isSevere
          ? 'CRITICAL ADVISORY (Severe Smog): While solar heating deepens boundary layer mixing in the afternoon, ambient AQI remains hazardous. The MoHFW/NCDC advisory urges vulnerable groups (children, elderly, respiratory/cardiac patients) to avoid all non-essential outdoor exposure regardless of the hour.'
          : isVeryPoor
            ? 'CAUTION (Very Poor AQI): Solar heating improves vertical mixing, offering relative dispersion compared to dawn/night peaks. However, pollution levels remain elevated. Keep any unavoidable outdoor transit brief and verify local station readings.'
            : 'Solar warming breaks down nocturnal surface inversion and deepens atmospheric boundary mixing height, offering relatively lower particulate concentration compared to early morning and late night. Check real-time AQI before planning outdoor transit.',
        hi: isSevere
          ? 'महत्वपूर्ण सलाह (गंभीर स्मॉग): दोपहर में धूप से प्रदूषण थोड़ा बिखरता है, लेकिन हवा फिर भी खतरनाक स्तर पर बनी रहती है। MoHFW/NCDC सलाह के अनुसार कमजोर वर्गों को दिन भर बाहर जाने से बचना चाहिए।'
          : isVeryPoor
            ? 'सावधानी (बहुत खराब वायु गुणवत्ता): दोपहर में सुबह की तुलना में प्रदूषण का दबाव कुछ कम होता है, लेकिन स्तर अब भी हानिकारक रहता है। केवल जरूरी काम ही करें और स्थानीय AQI जांचें।'
            : 'दोपहर में धूप निकलने से इनवर्जन लेयर टूटती है और प्रदूषण ऊपर उठता है, जिससे जमीन के पास सांद्रता अपेक्षाकृत कम होती है। बाहर जाने से पहले वास्तविक समय का AQI जरूर जांचें।',
      },
    },
    disclaimer: {
      en: 'Afternoon boundary-layer dispersion provides relative dilution, not absolute clean air. In severe winter smog episodes, afternoon air can remain heavily polluted. Always cross-reference real-time AQI data and prioritize exposure reduction as per the October 2025 MoHFW/NCDC advisory.',
      hi: 'दोपहर का वायुमंडलीय फैलाव केवल तुलनात्मक राहत देता है, यह हवा के पूरी तरह स्वच्छ होने की गारंटी नहीं है। MoHFW/NCDC सलाह के अनुसार हमेशा वास्तविक AQI जांचें और धुएं के संपर्क से बचें।',
    },
  };
}
