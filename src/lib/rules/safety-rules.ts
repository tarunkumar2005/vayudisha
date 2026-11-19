/**
 * Deterministic Safety and Recommendation Rule Engine
 *
 * CRITICAL SCIENTIFIC & SAFETY RULES:
 * 1. Health safety decisions, outdoor activity allowances, and mask guidance
 *    are DETERMINISTIC and aligned with the Government of India's October 2025 MoHFW/NCDC advisory.
 * 2. Exposure reduction (staying indoors with sealed clean air) is the primary line of defense.
 * 3. Mask guidance is CONDITIONAL on properly fitted N95/N99 respirators, with explicit medical
 *    caution for cardiopulmonary patients, elderly, and children. Blanket universal mandates are avoided.
 * 4. Potted plants are categorized as biophilic/psychological wellness features; claims that they
 *    meaningfully filter PM2.5 or purify ambient smog in real rooms are strictly prohibited.
 * 5. Corsi-Rosenthal DIY air cleaners include full safety specifications (2012+ UL/ETL fan, fused plug,
 *    MERV-13+, sealed perimeters, electrical supervision) and are presented as an alternative when commercial
 *    purifiers are unavailable/unaffordable.
 * 6. True HEPA guidance distinguishes particle filtration from gas removal, enforces CADR/ACH room sizing,
 *    and strictly prohibits hazardous ozone-generating air cleaners.
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
  maskRequired: boolean; // Maintained for backwards compatibility; denotes strong conditional recommendation
  maskType?: 'N95' | 'N99' | 'KN95' | 'None';
  maskGuidance: {
    recommended: boolean;
    condition: {
      en: string;
      hi: string;
    };
    properFitNotice: {
      en: string;
      hi: string;
    };
    medicalCaution: {
      en: string;
      hi: string;
    };
  };
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
 * Deterministically evaluate outdoor activity and conditional respirator guidance.
 * Aligned with MoHFW/NCDC October 2025 Air Pollution Health Advisory.
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
        maskType: 'None',
        maskGuidance: {
          recommended: false,
          condition: {
            en: 'Not needed. Ambient air quality meets national ambient air quality standards.',
            hi: 'आवश्यक नहीं। परिवेशी वायु गुणवत्ता राष्ट्रीय मानकों के अनुकूल है।',
          },
          properFitNotice: {
            en: 'No facial protection required.',
            hi: 'किसी चेहरे के मास्क की आवश्यकता नहीं है।',
          },
          medicalCaution: {
            en: 'Standard outdoor activities are safe.',
            hi: 'सामान्य बाहरी गतिविधियाँ सुरक्षित हैं।',
          },
        },
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
          maskType: 'None',
          maskGuidance: {
            recommended: false,
            condition: {
              en: 'Respirators generally not indicated; sensitive persons should monitor respiratory symptoms.',
              hi: 'मास्क आमतौर पर जरूरी नहीं; संवेदनशील व्यक्ति सांस के लक्षणों पर नजर रखें।',
            },
            properFitNotice: {
              en: 'If unusual throat/eye irritation occurs near heavy traffic, consider reducing exertion.',
              hi: 'यदि भारी ट्रैफिक के पास गले में खराश हो, तो बाहरी श्रम कम करें।',
            },
            medicalCaution: {
              en: 'Keep standard quick-relief respiratory medication accessible if previously prescribed by your doctor.',
              hi: 'यदि डॉक्टर ने कोई इनहेलर या दवा लिखी हो, तो उसे पास रखें।',
            },
          },
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
        maskType: 'None',
        maskGuidance: {
          recommended: false,
          condition: {
            en: 'Not needed for general public.',
            hi: 'सामान्य जनता के लिए आवश्यक नहीं।',
          },
          properFitNotice: {
            en: 'No facial protection required.',
            hi: 'किसी चेहरे के मास्क की आवश्यकता नहीं।',
          },
          medicalCaution: {
            en: 'General population is at low health risk.',
            hi: 'सामान्य लोगों के लिए स्वास्थ्य जोखिम कम है।',
          },
        },
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
        maskType: isHighRiskHousehold ? 'N95' : 'None',
        maskGuidance: {
          recommended: isHighRiskHousehold,
          condition: {
            en: isHighRiskHousehold
              ? 'Conditionally recommended for vulnerable members if prolonged outdoor exposure near traffic is unavoidable.'
              : 'Generally not required for healthy adults during brief outdoor errands.',
            hi: isHighRiskHousehold
              ? 'संवेदनशील सदस्यों के लिए ट्रैफिक के पास लंबे समय रहने पर सशर्त अनुशंसित।'
              : 'स्वस्थ वयस्कों के लिए संक्षिप्त बाहरी कामों के दौरान आवश्यक नहीं।',
          },
          properFitNotice: {
            en: 'Must achieve airtight nose and chin seal. Cloth and surgical masks do not filter fine particulates.',
            hi: 'नाक और ठुड्डी पर सील जरूरी है। कपड़े या सर्जिकल मास्क बारीक धूल को नहीं रोकते।',
          },
          medicalCaution: {
            en: 'Consult a physician if you experience increased breathing resistance while wearing a respirator.',
            hi: 'यदि मास्क पहनने पर सांस लेने में भारीपन महसूस हो, तो डॉक्टर से परामर्श लें।',
          },
        },
        headline: {
          en: isHighRiskHousehold
            ? 'Vulnerable family members should limit heavy outdoor exertion'
            : 'Moderate pollution: reduce prolonged intense outdoor workouts',
          hi: isHighRiskHousehold
            ? 'संवेदनशील परिजन बाहर भारी शारीरिक श्रम कम करें'
            : 'मध्यम प्रदूषण: बाहर देर तक भारी कसरत करने से बचें',
        },
        details: {
          en: 'Avoid intense jogging near heavy traffic corridors, especially during morning inversion hours (6–9 AM).',
          hi: 'व्यस्त सड़कों के पास सुबह (6 से 9 बजे) भारी दौड़ या कसरत करने से बचें जब धुआं जमीन के पास जमा रहता है।',
        },
      };

    case 'Poor':
      return {
        level: 'AVOID_PROLONGED_OUTDOORS',
        canExerciseOutdoors: false,
        schoolPlaySafe: false,
        maskRequired: true,
        maskType: 'N95',
        maskGuidance: {
          recommended: true,
          condition: {
            en: 'Exposure reduction is primary: stay indoors. If stepping outside is essential, wear a certified, tight-fitting N95/N99 respirator.',
            hi: 'घर के अंदर रहना प्राथमिक सुरक्षा है। यदि बाहर जाना अनिवार्य हो, तो प्रमाणित और टाइट फिटिंग वाला N95/N99 मास्क पहनें।',
          },
          properFitNotice: {
            en: 'Fit is paramount: ensure metal noseband is contoured and no air leaks around cheeks. Facial hair reduces effectiveness.',
            hi: 'फिटिंग सबसे महत्वपूर्ण है: नाक की क्लिप को दबाएं ताकि किनारों से हवा न घुसे। दाढ़ी होने पर प्रभावशीलता कम हो जाती है।',
          },
          medicalCaution: {
            en: 'Individuals with severe asthma, COPD, or cardiac conditions should consult their physician; tight respirators increase the work of breathing.',
            hi: 'गंभीर अस्थमा, सांस या दिल की बीमारी वाले मरीज डॉक्टर से सलाह लें, क्योंकि टाइट मास्क से सांस लेने में जोर पड़ता है।',
          },
        },
        headline: {
          en: 'Poor air: avoid prolonged outdoor exertion; prioritize indoor shelter',
          hi: 'खराब हवा: बाहर देर तक रहने से बचें; घर के अंदर रहने को प्राथमिकता दें',
        },
        details: {
          en: 'Children, seniors, and cardiopulmonary patients must avoid outdoor exertion. Healthy adults should shift workouts indoors.',
          hi: 'बच्चे, बुजुर्ग और सांस/दिल के मरीज बाहर शारीरिक श्रम न करें। स्वस्थ लोग भी कसरत घर के अंदर करें।',
        },
      };

    case 'Very Poor':
      return {
        level: 'STAY_INDOORS_ESSENTIAL_ONLY',
        canExerciseOutdoors: false,
        schoolPlaySafe: false,
        maskRequired: true,
        maskType: 'N95',
        maskGuidance: {
          recommended: true,
          condition: {
            en: 'MoHFW Advisory: Minimize all outdoor exposure. If transit is unavoidable, a certified N95/N99/FFP2 respirator is strongly recommended.',
            hi: 'स्वास्थ्य मंत्रालय परामर्श: बाहरी गतिविधियों को न्यूनतम करें। यदि बाहर जाना जरूरी हो, तो प्रमाणित N95/N99/FFP2 मास्क पहनें।',
          },
          properFitNotice: {
            en: 'Cloth and loose surgical masks do not protect against PM2.5. Respirator must create a continuous facial seal.',
            hi: 'कपड़े और ढीले सर्जिकल मास्क PM2.5 से नहीं बचाते। मास्क चेहरे पर पूरी तरह सील होना चाहिए।',
          },
          medicalCaution: {
            en: 'Never use tight respirators as a substitute for staying indoors. High-risk patients experiencing discomfort must seek medical care.',
            hi: 'मास्क को घर के अंदर रहने का विकल्प न समझें। सांस में तकलीफ होने पर तुरंत चिकित्सीय परामर्श लें।',
          },
        },
        headline: {
          en: 'Very Poor Air: Keep windows sealed. Step outside only for essential transit.',
          hi: 'अत्यंत खराब हवा: खिड़कियां बंद रखें। केवल आवश्यक काम होने पर ही बाहर निकलें।',
        },
        details: {
          en: 'High health risk for all individuals. Ensure air purifiers or sealed safe rooms are utilized for sleeping.',
          hi: 'सभी के लिए स्वास्थ्य जोखिम अधिक है। सोने के कमरों में एयर प्यूरीफायर चलाएं या कमरा सील रखें।',
        },
      };

    case 'Severe':
      return {
        level: 'HAZARDOUS_SEAL_INDOORS',
        canExerciseOutdoors: false,
        schoolPlaySafe: false,
        maskRequired: true,
        maskType: 'N95',
        maskGuidance: {
          recommended: true,
          condition: {
            en: 'Emergency smog level: Strict indoor shelter is the primary line of defense. Outdoor activities must be avoided. For unavoidable essential transit, wear a certified, properly fitted N95/N99 respirator.',
            hi: 'आपातकालीन धुंध स्तर: घर के अंदर रहना ही मुख्य सुरक्षा है। बाहर की गतिविधियों से पूरी तरह बचें। बहुत जरूरी होने पर ही सही फिटिंग वाला N95/N99 मास्क लगाएं।',
          },
          properFitNotice: {
            en: 'Check seal continuously: pinch the nose-clip with both hands and check for air leaks during exhalation.',
            hi: 'फिटिंग की जांच करें: नाक की क्लिप को दोनों हाथों से दबाएं और देखें कि सांस छोड़ते समय किनारों से हवा तो नहीं निकल रही।',
          },
          medicalCaution: {
            en: 'Patients with existing respiratory/cardiovascular illness should strictly remain in clean indoor air and consult their doctor for symptom management.',
            hi: 'सांस या हृदय रोगी पूरी तरह साफ इनडोर हवा में रहें और लक्षण बढ़ने पर डॉक्टर से संपर्क करें।',
          },
        },
        headline: {
          en: 'Severe Smog Emergency: Strict indoor shelter. Avoid all outdoor exposure.',
          hi: 'गंभीर धुंध आपातकाल: घर के अंदर ही रहें। बाहरी गतिविधियों से पूरी तरह बचें।',
        },
        details: {
          en: 'Hazardous air affects healthy people and severely impacts vulnerable groups. Keep doors/windows sealed. Wet mop to prevent settling dust resuspension.',
          hi: 'जहरीली हवा स्वस्थ लोगों को भी नुकसान पहुंचाती है। दरवाजे-खिड़कियां बंद रखें और धूल रोकने के लिए गीला पोंछा लगाएं।',
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
        'Use a damp microfiber mop twice daily to trap microparticles on floors.',
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
      en: 'Fine winter smog penetrates through floor door gaps and window joints via thermal chimney effects.',
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
      source: 'US EPA Indoor Air Quality Guidelines for Smoke & Winter Inversion',
      url: 'https://www.epa.gov/indoor-air-quality-iaq',
      fact: {
        en: 'Sealing major exterior door clearances prevents up to 50% of ambient particulate infiltration during cold inversion hours.',
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
        'Replace burning coils with window mesh netting or electric vaporizers.',
        'Switch to LED diya/puja lights during severe smog periods.',
        'Avoid scented candles or room aerosol sprays which emit harmful volatile organic compounds (VOCs).',
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
      en: 'Properly Fitted Certified N95/N99 Respirators (MoHFW/NCDC Advisory)',
      hi: 'प्रमाणित N95/N99 मास्क (स्वास्थ्य मंत्रालय परामर्श)',
    },
    summary: {
      en: 'In line with the Government of India October 2025 MoHFW/NCDC advisory, reducing exposure by staying indoors is primary. When stepping outdoors is essential, a properly fitted certified N95/N99/FFP2 respirator reduces fine particulate inhalation.',
      hi: 'भारत सरकार के अक्टूबर 2025 MoHFW/NCDC परामर्श के अनुसार, घर के अंदर रहना ही मुख्य बचाव है। यदि बाहर जाना जरूरी हो, तो प्रमाणित और सही फिटिंग वाला N95/N99 मास्क बारीक कणों से बचाव करता है।',
    },
    actionSteps: {
      en: [
        'Ensure an airtight facial seal around the bridge of your nose and under the chin. Facial hair prevents an effective seal.',
        'Ordinary cloth masks and loose surgical masks do NOT provide adequate filtration against microscopic PM2.5 particulates.',
        'Avoid respirators with exhalation valves when source control is needed or in dusty indoor crowds.',
        'Medical Advisory: Individuals with pre-existing cardiopulmonary disorders (COPD, asthma, heart failure), the frail elderly, and pregnant women should consult their physician before using tight-fitting respirators, as breathing resistance can cause discomfort or respiratory strain.',
      ],
      hi: [
        'मास्क को नाक और ठुड्डी पर अच्छी तरह दबाकर टाइट फिट करें। दाढ़ी होने पर हवा किनारों से लीक हो सकती है।',
        'साधारण कपड़े या सर्जिकल मास्क बारीक PM2.5 कणों को नहीं रोक पाते।',
        'गंभीर सांस या दिल की बीमारी वाले व्यक्ति टाइट मास्क लगाने से पहले डॉक्टर से सलाह लें, क्योंकि इससे सांस खींचने में जोर पड़ता है।',
        'मास्क गंदा होने या सांस लेने में भारीपन लगने पर नया प्रमाणित मास्क इस्तेमाल करें।',
      ],
    },
    evidence: {
      source: 'Government of India MoHFW/NCDC Air Pollution Health Advisory (Oct 2025) & BIS IS 9473',
      url: 'https://ncdc.mohfw.gov.in/',
      fact: {
        en: 'Properly fitted certified N95/N99 respirators filter >=95% of fine particles down to 0.3 microns when an airtight seal is maintained. Cloth masks do not provide PM2.5 protection.',
        hi: 'सही तरह फिट किया गया N95/N99 मास्क 0.3 माइक्रोन तक के 95% से अधिक बारीक कणों को रोकता है, जबकि कपड़े के मास्क PM2.5 को नहीं रोकते।',
      },
    },
    minAqiCategory: 'Poor',
  },
  {
    id: 'diy_box_fan_air_cleaner',
    category: 'indoor',
    budgetTier: 'medium',
    title: {
      en: 'Corsi-Rosenthal DIY Air Cleaner (Alternative Filtration Guidance)',
      hi: 'कॉर्सी-रोज़ेनथल DIY एयर क्लीनर (वैकल्पिक फिल्ट्रेशन दिशा-निर्देश)',
    },
    summary: {
      en: 'When commercial HEPA air cleaners are unavailable or unaffordable, a properly constructed Corsi-Rosenthal DIY box fan unit using a certified MERV-13 filter provides an effective alternative for supplemental indoor particulate reduction when strict electrical and assembly safety protocols are observed.',
      hi: 'जब व्यावसायिक HEPA प्यूरीफायर उपलब्ध या किफायती न हों, तब प्रमाणित MERV-13 फिल्टर और सुरक्षित पंखे से बना कॉर्सी-रोज़ेनथल DIY एयर क्लीनर सुरक्षा नियमों के पालन के साथ एक प्रभावी विकल्प है।',
    },
    actionSteps: {
      en: [
        'Fan Specification: Use only a newer box fan manufactured in 2012 or later that features an integrated thermal fused safety plug and carries UL or ETL safety marks. Older fans lack thermal overload protection and risk motor overheating under filter static resistance.',
        'Filter Specification: Secure a genuine MERV-13 or higher (or equivalent MPR 1900+ / FPR 10) HVAC pleat of matching dimensions (minimum 1-inch, preferably 2-inch thickness).',
        'Airflow Direction: Orient the filter airflow arrow pointing towards the fan intake (pulling air through the filter).',
        'Edge Sealing: Completely tape all perimeter edges and seams with heavy duct or foil tape to eliminate air bypass.',
        'Electrical & Operating Safety: Inspect fan and cord before use; never operate with frayed cords or daisy-chained extension cords. Never operate unattended overnight or in rooms with unsupervised small children or pets. Adhere to fan manufacturer instructions.',
        'Role: Use as an alternative when commercial purifiers are out of reach; do not substitute where certified commercial appliances with automatic safety shut-offs are accessible.',
      ],
      hi: [
        'पंखे का चयन: केवल 2012 या उसके बाद बना UL/ETL प्रमाणित बॉक्स फैन इस्तेमाल करें जिसमें थर्मल फ्यूज सेफ्टी प्लग हो। पुराने पंखे फिल्टर के दबाव से गर्म होकर आग का खतरा बन सकते हैं।',
        'फिल्टर का चयन: प्रमाणित MERV-13 या उससे उच्च रेटिंग वाला HVAC फिल्टर इस्तेमाल करें।',
        'हवा की दिशा: फिल्टर पर बने तीर के निशान को पंखे की तरफ रखें ताकि हवा फिल्टर से होकर ही निकले।',
        'किनारों की सीलिंग: सभी किनारों को डक्ट टेप से अच्छी तरह चिपकाएं ताकि बिना छनी हवा बाहर न निकले।',
        'सुरक्षा नियम: कटे-फटे तारों या खराब एक्सटेंशन कॉर्ड का प्रयोग न करें। इसे रात भर बिना निगरानी के या छोटे बच्चों के पास अकेला न चलाएं।',
        'भूमिका: इसे व्यावसायिक प्यूरीफायर न होने की स्थिति में एक किफायती विकल्प के रूप में अपनाएं।',
      ],
    },
    evidence: {
      source: 'US EPA Indoor Air Research & UC Davis Corsi-Rosenthal Foundation Testing',
      url: 'https://www.epa.gov/air-research/research-diy-air-cleaners-reduce-wildfire-smoke-indoors',
      fact: {
        en: 'Rigorous EPA laboratory testing confirms MERV-13 box fan assemblies achieve meaningful clean air delivery rates for particulates when 2012+ fused fans and sealed perimeters are used safely.',
        hi: 'ईपीए परीक्षणों से साबित हुआ है कि सही पंखे और सीलिंग के साथ MERV-13 फिल्टर हवा से बारीक कणों को हटाने में प्रभावी है।',
      },
    },
    minAqiCategory: 'Poor',
  },
  {
    id: 'air_purifying_indoor_plants',
    category: 'lifestyle',
    budgetTier: 'low',
    title: {
      en: 'Indoor Potted Plants (Biophilic & Psychological Wellness)',
      hi: 'घर के अंदर पौधे (पर्यावरण व मानसिक शांति)',
    },
    summary: {
      en: 'Scientific consensus (EPA and environmental health studies) confirms that potted indoor plants do NOT meaningfully filter PM2.5 particulates or purify hazardous smoggy air in real residential volumes. They provide biophilic, psychological, and aesthetic benefits, but must never be relied upon as an air purification or filtration method.',
      hi: 'वैज्ञानिक अध्ययनों (EPA व पर्यावरण स्वास्थ्य शोध) से यह स्पष्ट है कि गमले वाले पौधे घर के अंदर PM2.5 कणों को साफ करने या जहरीले धुएं को छानने में सक्षम नहीं हैं। ये मानसिक शांति और हरियाली के लिए अच्छे हैं, लेकिन इन्हें एयर प्यूरीफायर का विकल्प न मानें।',
    },
    actionSteps: {
      en: [
        'Maintain indoor plants for aesthetic enjoyment, humidity moderation, and personal well-being.',
        'Do NOT rely on plants for air purification or particulate reduction during smog episodes.',
        'Wipe plant leaves with a damp cloth periodically to remove settling household dust.',
        'Prioritize proven exposure reduction: keep windows closed during smog peaks, wet mop floors, and use mechanical filtration (HEPA or certified DIY).',
      ],
      hi: [
        'घर की सुंदरता और मानसिक सुकून के लिए पौधे लगाएं।',
        'प्रदूषण के दिनों में हवा साफ करने के लिए पौधों पर बिल्कुल निर्भर न रहें।',
        'पत्तों पर जमी धूल को समय-समय पर गीले कपड़े से पोंछें।',
        'हवा की सुरक्षा के लिए खिड़कियां बंद रखने, गीला पोंछा लगाने और मैकेनिकल फिल्टर (HEPA) को प्राथमिकता दें।',
      ],
    },
    evidence: {
      source: 'Cummings & Waring (2020), Journal of Exposure Science & Environmental Epidemiology / US EPA',
      url: 'https://www.nature.com/articles/s41370-019-0175-9',
      fact: {
        en: 'A comprehensive review of reported VOC and particulate removal efficiencies confirmed that potted plants in real building ventilation conditions have negligible impact on air quality compared to mechanical filtration.',
        hi: 'वैज्ञानिक समीक्षा ने पुष्टि की है कि वास्तविक कमरों में गमले वाले पौधों की वायु शोधन क्षमता मैकेनिकल फिल्ट्रेशन की तुलना में नगण्य होती है।',
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
      en: 'True HEPA H13 Purifiers with Activated Carbon (Particle vs. Gas Removal)',
      hi: 'सच्चा HEPA H13 प्यूरीफायर व एक्टिवेटेड कार्बन (कण व गैस शोधन)',
    },
    summary: {
      en: 'True H13/H14 HEPA filters capture at least 99.97% of airborne particulate matter down to 0.3 microns (PM2.5, PM10, combustion soot). However, HEPA does NOT remove hazardous gases (NO2, SO2, CO, VOCs), which require a substantial activated carbon adsorbent bed. Sizing must deliver 4 to 5 Air Changes per Hour (ACH). Ozone-generating air cleaners are strictly prohibited.',
      hi: 'सच्चा H13/H14 HEPA फिल्टर 0.3 माइक्रोन तक के 99.97% महीन कणों (PM2.5, PM10, धुआं) को रोकता है। ध्यान दें कि HEPA फिल्टर जहरीली गैसों (NO2, SO2, CO) को नहीं रोकता; गैसों के लिए एक्टिवेटेड कार्बन जरूरी है। कमरे के अनुसार 4 से 5 एयर चेंज प्रति घंटा (ACH) क्षमता चुनें। ओजोन पैदा करने वाले प्यूरीफायर का प्रयोग बिल्कुल न करें।',
    },
    actionSteps: {
      en: [
        'CADR & Room Sizing: Calculate required Clean Air Delivery Rate (CADR in m³/h) to achieve at least 4 to 5 Air Changes per Hour: Target CADR = Room Area (m²) × Ceiling Height (m) × 4.5.',
        'Particle vs. Gas Distinction: Verify that the purifier combines a True HEPA filter for particulates with an activated carbon filter for odor/gas absorption.',
        'STRICT PROHIBITION OF OZONE GENERATORS: Never purchase ozone-generating air cleaners, ionizers, or electrostatic precipitators that produce ozone as a byproduct. Ozone is a severe lung irritant that damages airway epithelium and exacerbates asthma/COPD. Ensure certification under CARB (ozone emissions < 0.050 ppm).',
        'Placement & Maintenance: Position purifier at least 1–2 feet away from walls in the breathing zone. Replace pre-filters and main HEPA cartridges per manufacturer guidelines.',
      ],
      hi: [
        'कमरे का आकार व CADR: कम से कम 4 से 5 एयर चेंज प्रति घंटा (ACH) पाने के लिए सही क्षमता चुनें (कमरे का आयतन × 4.5 = आवश्यक CADR)।',
        'कण बनाम गैस का अंतर: सुनिश्चित करें कि प्यूरीफायर में धूल के लिए सच्चा HEPA और गैसों के लिए एक्टिवेटेड कार्बन दोनों हों।',
        'ओजोन प्यूरीफायर पर सख्त रोक: ओजोन पैदा करने वाले आयनाइज़र या इलेक्ट्रॉनिक प्यूरीफायर कभी न खरीदें। ओजोन फेफड़ों को गंभीर नुकसान पहुंचाती है। केवल प्रमाणित ओजोन-मुक्त (CARB certified) प्यूरीफायर लें।',
        'रखरखाव: प्यूरीफायर को दीवार से 1-2 फीट दूर रखें और समय पर फिल्टर बदलें।',
      ],
    },
    evidence: {
      source: 'MoHFW/NCDC Air Pollution Advisory & US EPA Air Cleaners in the Home Guidelines',
      url: 'https://www.epa.gov/indoor-air-quality-iaq/air-cleaners-and-air-filters-home',
      fact: {
        en: 'Properly sized True HEPA filtration lowers indoor PM2.5 by 65–85% in sealed rooms. Ozone-generating devices are explicitly warned against by health authorities worldwide as dangerous lung irritants.',
        hi: 'सही आकार का HEPA प्यूरीफायर बंद कमरों में PM2.5 को 65% से 85% तक घटाता है। स्वास्थ्य संस्थाओं द्वारा ओजोन उपकरणों को फेफड़ों के लिए हानिकारक घोषित किया गया है।',
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
      en: 'Indoor pollution often differs drastically from outdoor station data due to cooking, smoking, and air infiltration.',
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
    if (profile.budgetTier === 'low' && rec.budgetTier !== 'low') {
      return false;
    }
    if (profile.budgetTier === 'medium' && rec.budgetTier === 'high') {
      return false;
    }

    return true;
  });
}
