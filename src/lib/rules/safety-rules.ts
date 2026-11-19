/**
 * Deterministic Safety and Recommendation Rule Engine
 *
 * CRITICAL RULE:
 * Health safety decisions, outdoor activity allowances, and mask requirements
 * are DETERMINISTIC. They are NEVER left to LLM guesswork.
 *
 * Gemini is ONLY permitted to personalize and explain approved recommendations.
 */

import { type AqiCategory } from '../aqi/aqi-breakpoints';

export type ActivitySafetyLevel =
  | 'SAFE'
  | 'MODERATE_CAUTION'
  | 'SENSITIVE_GROUPS_STAY_INDOORS'
  | 'AVOID_PROLONGED_OUTDOORS'
  | 'STAY_INDOORS_ESSENTIAL_ONLY'
  | 'HAZARDOUS_SEAL_INDOORS';

export type BudgetTier = 'low' | 'medium' | 'high';

export interface DemographicProfile {
  hasInfantsOrToddlers: boolean; // Under 5
  hasSchoolChildren: boolean; // 5-14
  hasSeniors: boolean; // 60+
  hasSensitiveMembers: boolean; // Asthma / respiratory condition boolean (NO medical details)
  commuteMode: 'car' | 'two_wheeler' | 'metro' | 'bus' | 'auto_rickshaw' | 'cycle_walk';
  budgetTier: BudgetTier;
}

export interface ActivityGuidance {
  level: ActivitySafetyLevel;
  canExerciseOutdoors: boolean;
  schoolPlaySafe: boolean;
  maskRequired: boolean;
  maskType?: 'N95' | 'KN95' | 'Surgical' | 'Cloth';
  headline: {
    en: string;
    hi: string;
  };
  details: {
    en: string;
    hi: string;
  };
}

export interface RecommendationTemplate {
  id: string;
  category: 'indoor' | 'outdoor' | 'protection' | 'travel' | 'lifestyle';
  budgetTier: BudgetTier;
  title: {
    en: string;
    hi: string;
  };
  summary: {
    en: string;
    hi: string;
  };
  actionSteps: {
    en: string[];
    hi: string[];
  };
  evidence: {
    source: string;
    url: string;
    fact: {
      en: string;
      hi: string;
    };
  };
  minAqiCategory: AqiCategory;
}

/**
 * Deterministically evaluate outdoor activity and mask safety.
 */
export function evaluateActivitySafety(
  category: AqiCategory,
  profile: DemographicProfile
): ActivityGuidance {
  const isHighRiskHousehold =
    profile.hasInfantsOrToddlers ||
    profile.hasSeniors ||
    profile.hasSensitiveMembers;

  switch (category) {
    case 'Good':
      return {
        level: 'SAFE',
        canExerciseOutdoors: true,
        schoolPlaySafe: true,
        maskRequired: false,
        headline: {
          en: 'Air quality is ideal for all outdoor activities',
          hi: 'सभी बाहरी गतिविधियों के लिए हवा की गुणवत्ता उत्तम है',
        },
        details: {
          en: 'Enjoy outdoor sports, park walks, and natural home ventilation.',
          hi: 'बाहरी खेलों, पार्क में टहलने और घर में प्राकृतिक वेंटिलेशन का आनंद लें।',
        },
      };

    case 'Satisfactory':
      if (profile.hasSensitiveMembers) {
        return {
          level: 'MODERATE_CAUTION',
          canExerciseOutdoors: true,
          schoolPlaySafe: true,
          maskRequired: false,
          headline: {
            en: 'Acceptable for most; sensitive members should monitor symptoms',
            hi: 'अधिकांश लोगों के लिए स्वीकार्य; संवेदनशील सदस्य लक्षणों पर नज़र रखें',
          },
          details: {
            en: 'People with asthma or mild respiratory allergies may experience slight throat irritation during heavy exertion.',
            hi: 'अस्थमा या एलर्जी वाले लोगों को भारी शारीरिक व्यायाम के दौरान हल्की परेशानी हो सकती है।',
          },
        };
      }
      return {
        level: 'SAFE',
        canExerciseOutdoors: true,
        schoolPlaySafe: true,
        maskRequired: false,
        headline: {
          en: 'Satisfactory air quality',
          hi: 'संतोषजनक वायु गुणवत्ता',
        },
        details: {
          en: 'Normal outdoor activities are safe for the general public.',
          hi: 'सामान्य जनता के लिए सामान्य बाहरी गतिविधियाँ सुरक्षित हैं।',
        },
      };

    case 'Moderate':
      return {
        level: isHighRiskHousehold
          ? 'SENSITIVE_GROUPS_STAY_INDOORS'
          : 'MODERATE_CAUTION',
        canExerciseOutdoors: !isHighRiskHousehold,
        schoolPlaySafe: !profile.hasInfantsOrToddlers,
        maskRequired: isHighRiskHousehold,
        maskType: 'N95',
        headline: {
          en: isHighRiskHousehold
            ? 'Vulnerable family members should limit heavy outdoor exertion'
            : 'Moderate pollution: reduce prolonged intense outdoor workouts',
          hi: isHighRiskHousehold
            ? 'संवेदनशील परिजन बाहर भारी शारीरिक श्रम कम करें'
            : 'मध्यम प्रदूषण: बाहर देर तक भारी कसरत करने से बचें',
        },
        details: {
          en: 'Avoid intense jogging near heavy traffic intersections between 6 AM and 9 AM when inversion traps exhaust.',
          hi: 'सुबह 6 से 9 बजे के बीच व्यस्त चौराहों के पास तेज दौड़ने से बचें जब प्रदूषण जमीन के पास जमा रहता है।',
        },
      };

    case 'Poor':
      return {
        level: 'AVOID_PROLONGED_OUTDOORS',
        canExerciseOutdoors: false,
        schoolPlaySafe: false,
        maskRequired: true,
        maskType: 'N95',
        headline: {
          en: 'Avoid prolonged outdoor exertion. Wear an N95 mask outdoors.',
          hi: 'लंबे समय तक बाहर रहने से बचें। बाहर निकलते समय N95 मास्क अवश्य पहनें।',
        },
        details: {
          en: 'Children, seniors, and heart/lung patients must stay indoors. Healthy adults should shift runs/workouts indoors.',
          hi: 'बच्चे, बुजुर्ग और सांस के मरीज घर के अंदर रहें। स्वस्थ वयस्क भी कसरत घर के अंदर ही करें।',
        },
      };

    case 'Very Poor':
      return {
        level: 'STAY_INDOORS_ESSENTIAL_ONLY',
        canExerciseOutdoors: false,
        schoolPlaySafe: false,
        maskRequired: true,
        maskType: 'N95',
        headline: {
          en: 'Very Poor Air: Keep windows sealed. Step outside only if essential.',
          hi: 'अत्यंत खराब हवा: खिड़कियां बंद रखें। केवल बहुत जरूरी होने पर ही बाहर निकलें।',
        },
        details: {
          en: 'Respiratory illness risk increases for all individuals. Ensure air purifiers or DIY filters run in sleeping rooms.',
          hi: 'सभी के लिए सांस की बीमारी का खतरा बढ़ जाता है। सोने के कमरों में एयर प्यूरीफायर या फिल्टर जरूर चलाएं।',
        },
      };

    case 'Severe':
      return {
        level: 'HAZARDOUS_SEAL_INDOORS',
        canExerciseOutdoors: false,
        schoolPlaySafe: false,
        maskRequired: true,
        maskType: 'N95',
        headline: {
          en: 'Emergency Smog Level: Strict indoor shelter. Seal window and door gaps.',
          hi: 'आपातकालीन धुंध स्तर: घर के अंदर ही रहें। खिड़कियों और दरवाजों की दरारों को सील करें।',
        },
        details: {
          en: 'Toxic particulate levels affect everyone. Do not open windows. Wet mop floors instead of sweeping to trap fine settling dust.',
          hi: 'जहरीले कण सभी को प्रभावित करते हैं। खिड़कियां न खोलें। झाड़ू लगाने के बजाय गीला पोंछा लगाएं।',
        },
      };
  }
}

/**
 * Curated catalog of evidence-backed recommendations by budget tier and AQI threshold.
 */
export const RECOMMENDATION_CATALOG: RecommendationTemplate[] = [
  // --- LOW BUDGET (₹0 - ₹500) ---
  {
    id: 'wet_mopping_protocol',
    category: 'indoor',
    budgetTier: 'low',
    title: {
      en: 'Wet Mopping Instead of Dry Sweeping',
      hi: 'झाड़ू की जगह गीला पोंछा लगाएं',
    },
    summary: {
      en: 'Dry sweeping resuspends deposited toxic PM2.5 and PM10 particles into the indoor breathing zone.',
      hi: 'सूखी झाड़ू लगाने से जमीन पर बैठे जहरीले कण दोबारा हवा में उड़कर सांस में चले जाते हैं।',
    },
    actionSteps: {
      en: [
        'Use a damp microfiber mop twice daily to trap microparticles.',
        'Avoid dry broom sweeping, especially in bedrooms and living rooms.',
        'Keep bathroom doors closed and turn on exhaust during cooking.',
      ],
      hi: [
        'सूक्ष्म कणों को हटाने के लिए दिन में दो बार गीले माइक्रोफाइबर पोंछे का उपयोग करें।',
        'कमरों में सूखी झाड़ू लगाने से पूरी तरह बचें।',
        'खाना बनाते समय रसोई का एग्जॉस्ट फैन चालू रखें और बाकी दरवाजे बंद रखें।',
      ],
    },
    evidence: {
      source: 'Central Pollution Control Board (CPCB) Household Advisory',
      url: 'https://cpcb.nic.in/',
      fact: {
        en: 'Wet cleaning reduces indoor resuspended particulate concentration by up to 40% compared to dry sweeping.',
        hi: 'गीली सफाई से सूखी झाड़ू की तुलना में घर के अंदर उड़ने वाले धूल कण 40% तक कम होते हैं।',
      },
    },
    minAqiCategory: 'Moderate',
  },
  {
    id: 'door_window_towel_seal',
    category: 'indoor',
    budgetTier: 'low',
    title: {
      en: 'Damp Towel Draft Stops for Doors & Windows',
      hi: 'दरवाजों और खिड़कियों के नीचे गीले तौलिये से सीलिंग',
    },
    summary: {
      en: 'Fine winter smog penetrates through floor door gaps and window joints via chimney thermal effects.',
      hi: 'सर्दियों का बारीक धुआं दरवाजों के नीचे की खाली जगह से तेजी से घर के अंदर घुसता है।',
    },
    actionSteps: {
      en: [
        'Roll an old damp towel or bedsheet tightly at the base of exterior-facing doors.',
        'Tape edges of rattling window panes with masking paper tape during peak smog hours (8 PM - 9 AM).',
      ],
      hi: [
        'बाहर खुलने वाले दरवाजों के नीचे पुराने गीले तौलिये को रोल करके लगाएं।',
        'रात और सुबह के समय खिड़की के किनारों को मास्किंग टेप से सील रखें।',
      ],
    },
    evidence: {
      source: 'US EPA Indoor Air Quality Guidelines for Wildfire & Winter Smoke',
      url: 'https://www.epa.gov/indoor-air-quality-iaq',
      fact: {
        en: 'Sealing major exterior door clearances prevents up to 50% of ambient infiltration during temperature inversions.',
        hi: 'दरवाजों के नीचे की खाली जगह बंद करने से बाहर का 50% तक धुआं अंदर आने से रुकता है।',
      },
    },
    minAqiCategory: 'Poor',
  },
  {
    id: 'eliminate_indoor_incense',
    category: 'indoor',
    budgetTier: 'low',
    title: {
      en: 'Pause Incense, Agarbatti, Dhoop & Mosquito Coils',
      hi: 'अगरबत्ती, धूप और मच्छर अगरबत्ती का प्रयोग तुरंत रोकें',
    },
    summary: {
      en: 'Burning one agarbatti or mosquito coil in a closed room emits PM2.5 concentrations exceeding 500 µg/m³.',
      hi: 'बंद कमरे में एक अगरबत्ती या मच्छर अगरबत्ती जलाने से PM2.5 का स्तर 500 µg/m³ के खतरनाक स्तर को पार कर जाता है।',
    },
    actionSteps: {
      en: [
        'Replace burning coils with electric vaporizers or window mesh netting.',
        'Switch to LED diya/puja lights during severe smog periods.',
        'Avoid scented candles or room sprays which emit harmful volatile organic compounds (VOCs).',
      ],
      hi: [
        'मच्छर कॉइल की जगह मच्छरदानी या लिक्विड वेपोराइजर का प्रयोग करें।',
        'प्रदूषण के दौरान अगरबत्ती की जगह बिना धुएं वाली पूजा करें।',
        'कमरे में रूम फ्रेशनर या खुशबूदार मोमबत्तियों का इस्तेमाल न करें।',
      ],
    },
    evidence: {
      source: 'Indian Council of Medical Research (ICMR) Environmental Health Study',
      url: 'https://main.icmr.nic.in/',
      fact: {
        en: 'A single mosquito coil burning overnight releases particulate matter equivalent to approximately 75–100 cigarettes.',
        hi: 'रात भर जलने वाली एक मच्छर कॉइल लगभग 75 से 100 सिगरेट जितना खतरनाक धुआं छोड़ती है।',
      },
    },
    minAqiCategory: 'Moderate',
  },

  // --- MEDIUM BUDGET (₹500 - ₹5,000) ---
  {
    id: 'certified_n95_respirators',
    category: 'protection',
    budgetTier: 'medium',
    title: {
      en: 'ISI/NIOSH Certified N95 Respirators (Proper Fit)',
      hi: 'प्रमाणित N95 मास्क (सही फिटिंग के साथ)',
    },
    summary: {
      en: 'Cloth and simple surgical masks do NOT filter microscopic PM2.5 aerosols. Only tight-fitting N95/FFP2 masks work.',
      hi: 'कपड़े और साधारण सर्जिकल मास्क बारीक PM2.5 कणों को नहीं रोक पाते। केवल N95 मास्क ही प्रभावी हैं।',
    },
    actionSteps: {
      en: [
        'Ensure the mask creates a tight seal around the bridge of your nose and under the chin.',
        'Do not use masks with exhalation valves if protecting others or in dusty indoor crowds.',
        'Replace masks every 40-50 cumulative hours of wear or when breathing resistance increases.',
      ],
      hi: [
        'मास्क को नाक और ठुड्डी पर अच्छी तरह दबाकर टाइट फिट करें।',
        'अगर मास्क में सांस लेने में भारीपन लगे या गंदा हो जाए तो नया मास्क इस्तेमाल करें।',
      ],
    },
    evidence: {
      source: 'WHO Guidelines on Air Pollution & Personal Respiratory Protection',
      url: 'https://www.who.int/health-topics/air-pollution',
      fact: {
        en: 'Well-fitted N95 masks filter at least 95% of airborne particles down to 0.3 microns, reducing inhaled dose significantly.',
        hi: 'सही तरह पहना गया N95 मास्क 0.3 माइक्रोन तक के कम से कम 95% हानिकारक कणों को रोकता है।',
      },
    },
    minAqiCategory: 'Poor',
  },
  {
    id: 'diy_box_fan_air_cleaner',
    category: 'indoor',
    budgetTier: 'medium',
    title: {
      en: 'DIY Box-Fan MERV-13 Air Cleaner (Corsi-Rosenthal Method)',
      hi: 'किफायती DIY एयर क्लीनर (पंखे और MERV-13 फिल्टर के साथ)',
    },
    summary: {
      en: 'A high-efficiency MERV-13 / HEPA filter strapped to an exhaust/box fan cleans indoor air at 1/5th the cost of commercial purifiers.',
      hi: 'एक अच्छे फिल्टर को साधारण पंखे पर टेप से लगाकर महंगे प्यूरीफायर जैसा स्वच्छ वातावरण बनाया जा सकता है।',
    },
    actionSteps: {
      en: [
        'Acquire a 14-inch to 20-inch box fan or exhaust fan and a MERV-13 HVAC filter of matching dimensions.',
        'Duct tape the filter to the intake side of the fan with arrow pointing in the direction of airflow.',
        'Run on medium speed in closed bedrooms for 45 minutes before sleep.',
      ],
      hi: [
        'फैन के पीछे की तरफ फिल्टर को अच्छी तरह टेप से चिपकाएं ताकि हवा फिल्टर होकर निकले।',
        'सोने से 45 मिनट पहले कमरे को बंद करके इसे मध्यम गति पर चलाएं।',
      ],
    },
    evidence: {
      source: 'Harvard T.H. Chan School of Public Health Air Quality Intervention Trials',
      url: 'https://www.hsph.harvard.edu/',
      fact: {
        en: 'DIY MERV-13 box fan units achieve clean air delivery rates (CADR) comparable to ₹15,000 commercial purifiers.',
        hi: 'यह DIY तकनीक 15,000 रुपये के व्यावसायिक प्यूरीफायर के बराबर स्वच्छ हवा देने में सक्षम पाई गई है।',
      },
    },
    minAqiCategory: 'Poor',
  },
  {
    id: 'air_purifying_indoor_plants',
    category: 'indoor',
    budgetTier: 'medium',
    title: {
      en: 'NASA-Studied Natural Indoor Plants (Sansevieria & Areca)',
      hi: 'घर के अंदर हवा शुद्ध करने वाले पौधे (स्नेक प्लांट, अरेका पाम)',
    },
    summary: {
      en: 'Mother-in-law’s Tongue (Sansevieria) converts CO2 to Oxygen at night while filtering common toxic household VOCs.',
      hi: 'स्नेक प्लांट रात में भी ऑक्सीजन छोड़ता है और घर में मौजूद हानिकारक गैसों को सोखने में मदद करता है।',
    },
    actionSteps: {
      en: [
        'Place 2-3 Snake plants in each bedroom and Areca palms in common living spaces.',
        'Wipe plant leaves with a moist cloth weekly to prevent dust from blocking pore transpiration.',
      ],
      hi: [
        'सोने के कमरे में 2-3 स्नेक प्लांट और बैठक में अरेका पाम रखें।',
        'हफ्ते में एक बार पत्तों पर जमी धूल को गीले कपड़े से साफ करें।',
      ],
    },
    evidence: {
      source: 'NASA Clean Air Study (Wolverton et al.) & Paharpur Business Centre Delhi Study',
      url: 'https://ntrs.nasa.gov/citations/19930072988',
      fact: {
        en: 'A combination of Areca Palm, Sansevieria, and Money Plant demonstrably reduces indoor VOC levels and refreshes oxygen.',
        hi: 'अरेका पाम और स्नेक प्लांट का संयोजन घर के अंदर ऑक्सीजन का संतुलन बनाए रखने में मददगार है।',
      },
    },
    minAqiCategory: 'Satisfactory',
  },

  // --- HIGH BUDGET (₹5,000+) ---
  {
    id: 'true_hepa_purifier_h13',
    category: 'indoor',
    budgetTier: 'high',
    title: {
      en: 'True HEPA H13 Purifier with Activated Carbon',
      hi: 'सच्चा HEPA H13 एयर प्यूरीफायर (एक्टिवेटेड कार्बन के साथ)',
    },
    summary: {
      en: 'True H13 medical-grade HEPA filters trap 99.97% of fine combustion particles, while granular carbon absorbs NO2 and SO2 gases.',
      hi: 'सच्चा HEPA H13 फिल्टर 99.97% महीन कणों को रोकता है, और कार्बन फिल्टर जहरीली गैसों को सोखता है।',
    },
    actionSteps: {
      en: [
        'Size the purifier Clean Air Delivery Rate (CADR) to match your room volume (at least 4 to 5 air changes per hour).',
        'Keep purifier positioned at least 1 foot away from walls in the center of living/sleeping areas.',
        'Inspect pre-filter monthly and replace main HEPA element every 6-9 months during North Indian winter.',
      ],
      hi: [
        'कमरे के आकार के अनुसार सही क्षमता (CADR) वाला प्यूरीफायर चुनें।',
        'प्यूरीफायर को दीवार से कम से कम 1 फीट दूर रखें ताकि चारों तरफ से हवा खींच सके।',
        'हर महीने प्री-फिल्टर को साफ करें और सर्दियों के बाद मुख्य फिल्टर बदलें।',
      ],
    },
    evidence: {
      source: 'Ministry of Environment, Forest and Climate Change (MoEFCC) Advisory',
      url: 'https://moef.gov.in/',
      fact: {
        en: 'Operating a properly sized HEPA air cleaner inside sealed Indian apartments lowers indoor PM2.5 levels by 65–85%.',
        hi: 'बंद कमरों में सही आकार का HEPA प्यूरीफायर चलाने से घर के अंदर PM2.5 में 65% से 85% तक की कमी आती है।',
      },
    },
    minAqiCategory: 'Moderate',
  },
  {
    id: 'realtime_laser_pm25_monitor',
    category: 'indoor',
    budgetTier: 'high',
    title: {
      en: 'Indoor Laser Particle AQI Monitor',
      hi: 'घर के लिए लेजर पार्टिकल AQI मॉनिटर',
    },
    summary: {
      en: 'Indoor pollution often differs drastically from outdoor station data due to cooking, smoking, and air leaks.',
      hi: 'घर के अंदर की हवा अक्सर बाहर से अलग होती है। मॉनिटर से पता चलता है कि कब खिड़की खोलनी है या प्यूरीफायर चलाना है।',
    },
    actionSteps: {
      en: [
        'Monitor indoor PM2.5 to verify whether air sealing and purifiers are working effectively.',
        'Observe spikes during kitchen frying or external smog infiltration to take prompt corrective action.',
      ],
      hi: [
        'इनडोर PM2.5 पर नजर रखें ताकि यह सुनिश्चित हो सके कि प्यूरीफायर सही काम कर रहा है।',
        'रसोई में खाना बनने या धुआं घुसने पर तुरंत सतर्क होकर बचाव के कदम उठाएं।',
      ],
    },
    evidence: {
      source: 'World Health Organization (WHO) Global Air Quality Guidelines',
      url: 'https://www.who.int/publications/i/item/9789240034228',
      fact: {
        en: 'Laser scattering sensors enable actionable indoor ventilation management without guessing.',
        hi: 'लेजर सेंसर के सटीक आंकड़ों से बिना किसी भ्रम के घर की हवा को नियंत्रित किया जा सकता है।',
      },
    },
    minAqiCategory: 'Moderate',
  },

  // --- TRAVEL & LIFESTYLE ALTERNATIVES ---
  {
    id: 'metro_modal_shift',
    category: 'travel',
    budgetTier: 'low',
    title: {
      en: 'Shift Commute from Solo Car/Cab to Air-Filtered Metro Rail',
      hi: 'कार/कैब की जगह एयर-फिल्टर्ड मेट्रो रेल का उपयोग करें',
    },
    summary: {
      en: 'Sitting in road traffic exposes passengers to 3x higher in-cabin ultra-fine exhaust fumes than riding underground/elevated metro.',
      hi: 'सड़क पर ट्रैफिक में फंसने से मेट्रो की तुलना में 3 गुना अधिक जहरीला धुआं कार के अंदर पहुंचता है।',
    },
    actionSteps: {
      en: [
        'Utilize metro transit for longer legs of your daily commute.',
        'Use e-rickshaws or covered shared transit for first/last-mile connectivity.',
        'If car travel is unavoidable, set vehicle HVAC strictly to recirculate mode with a fresh cabin PM2.5 filter.',
      ],
      hi: [
        'अपने दैनिक सफर के मुख्य हिस्से के लिए मेट्रो का उपयोग करें।',
        'मेट्रो स्टेशन तक आने-जाने के लिए ई-रिक्शा का प्रयोग करें।',
        'अगर कार से जाना जरूरी हो तो एसी को री-सर्कुलेट (Recirculate) मोड पर रखें।',
      ],
    },
    evidence: {
      source: 'Delhi Metro Rail Corporation (DMRC) Environmental Impact Assessment & WRI India',
      url: 'https://www.delhimetrorail.com/',
      fact: {
        en: 'Switching 10 km daily commute to Metro avoids ~2.2 kg of CO2e per day while reducing street-level exhaust exposure.',
        hi: 'दैनिक 10 किमी सफर मेट्रो से करने पर रोज लगभग 2.2 किग्रा कार्बन उत्सर्जन कम होता है और जहरीले धुएं से बचाव होता है।',
      },
    },
    minAqiCategory: 'Satisfactory',
  },
];

/**
 * Filter and select eligible recommendations based strictly on AQI category,
 * household demographics, and budget preferences.
 */
export function getEligibleRecommendations(
  category: AqiCategory,
  profile: DemographicProfile
): RecommendationTemplate[] {
  const categoryOrder: Record<AqiCategory, number> = {
    Good: 0,
    Satisfactory: 1,
    Moderate: 2,
    Poor: 3,
    'Very Poor': 4,
    Severe: 5,
  };

  const currentLevel = categoryOrder[category];

  return RECOMMENDATION_CATALOG.filter((rec) => {
    // 1. Must meet the minimum AQI threshold for that intervention
    if (categoryOrder[rec.minAqiCategory] > currentLevel) {
      return false;
    }

    // 2. Filter by budget tier compatibility
    // If user selected 'low', only show low budget recommendations
    // If 'medium', show low and medium
    // If 'high', show all tiers
    if (profile.budgetTier === 'low' && rec.budgetTier !== 'low') {
      return false;
    }
    if (
      profile.budgetTier === 'medium' &&
      rec.budgetTier === 'high'
    ) {
      return false;
    }

    return true;
  });
}
