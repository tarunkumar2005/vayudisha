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
import {
  RECOMMENDATION_CATALOG,
  type RecommendationTemplate,
  type BudgetTier,
} from './recommendation-catalog';

export {
  RECOMMENDATION_CATALOG,
  type RecommendationTemplate,
  type BudgetTier,
};

export type ActivitySafetyLevel =
  | 'SAFE'
  | 'MODERATE_CAUTION'
  | 'SENSITIVE_GROUPS_STAY_INDOORS'
  | 'AVOID_PROLONGED_OUTDOORS'
  | 'STAY_INDOORS_ESSENTIAL_ONLY'
  | 'HAZARDOUS_SEAL_INDOORS';

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

/**
 * Internal source-neutral advisory severity scale.
 * Keeps CAMS atmospheric model risk classifications cleanly separated from official CPCB AQI categories.
 */
export type AdvisorySeverityLevel =
  | 'MINIMAL' // Corresponds to Good (CPCB) / Minimal Model Risk
  | 'LOW' // Corresponds to Satisfactory (CPCB) / Low Model Risk
  | 'MODERATE' // Corresponds to Moderate (CPCB) / Moderate Risk (CAMS)
  | 'HIGH' // Corresponds to Poor (CPCB) / High Risk (CAMS)
  | 'VERY_HIGH' // Corresponds to Very Poor (CPCB) / Very High Risk (CAMS)
  | 'SEVERE'; // Corresponds to Severe (CPCB) / Severe Risk (CAMS)

export function mapCategoryToAdvisorySeverity(
  rawCategory: string | null | undefined
): AdvisorySeverityLevel {
  if (!rawCategory) return 'MODERATE';
  const normalized = rawCategory.trim().toLowerCase();

  if (
    normalized === 'good' ||
    normalized.includes('good') ||
    normalized.includes('अच्छा') ||
    normalized.includes('अच्छी')
  ) {
    return 'MINIMAL';
  }
  if (
    normalized === 'satisfactory' ||
    normalized.includes('satisfactory') ||
    normalized.includes('संतोषजनक')
  ) {
    return 'LOW';
  }
  if (
    normalized === 'moderate' ||
    normalized === 'moderate risk' ||
    normalized.includes('moderate') ||
    normalized.includes('मध्यम')
  ) {
    return 'MODERATE';
  }
  if (
    normalized === 'severe' ||
    normalized === 'severe risk' ||
    normalized.includes('severe') ||
    normalized.includes('गंभीर')
  ) {
    return 'SEVERE';
  }
  if (
    normalized === 'very poor' ||
    normalized === 'very high risk' ||
    normalized.includes('very high risk') ||
    normalized.includes('बहुत खराब')
  ) {
    return 'VERY_HIGH';
  }
  if (
    normalized === 'poor' ||
    normalized === 'high risk' ||
    normalized.includes('high risk') ||
    normalized.includes('खराब')
  ) {
    return 'HIGH';
  }

  // Fail closed
  return 'HIGH';
}

/**
 * Adapter returning canonical CPCB category for legacy recommendation filtering and API consumers,
 * preserving existing recommendation behaviour while mapping through the source-neutral severity scale.
 */
export function mapModelCategoryToCanonicalAqiCategory(
  rawCategory: string | null | undefined
): AqiCategory {
  const severity = mapCategoryToAdvisorySeverity(rawCategory);
  switch (severity) {
    case 'MINIMAL':
      return 'Good';
    case 'LOW':
      return 'Satisfactory';
    case 'MODERATE':
      return 'Moderate';
    case 'HIGH':
      return 'Poor';
    case 'VERY_HIGH':
      return 'Very Poor';
    case 'SEVERE':
      return 'Severe';
  }
}

/**
 * Deterministically evaluate outdoor activity and conditional respirator guidance.
 * Aligned with MoHFW/NCDC October 2025 Air Pollution Health Advisory.
 */
export function evaluateActivitySafety(
  category: AqiCategory | string,
  profile: DemographicProfile
): ActivityGuidance {
  const canonical = mapModelCategoryToCanonicalAqiCategory(category);
  const isHighRiskHousehold =
    profile.hasInfantsOrToddlers ||
    profile.hasSchoolChildren ||
    profile.hasSeniors ||
    profile.hasSensitiveMembers;

  switch (canonical) {
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

    default:
      // Fail closed: treat unknown/unrecognized category with safe high caution
      return evaluateActivitySafety('Poor', profile);
  }
}

/**
 * Filter and select eligible recommendations based strictly on AQI category,
 * household demographics, and budget preferences.
 */
export function getEligibleRecommendations(
  category: AqiCategory | string,
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

  const canonicalCategory = mapModelCategoryToCanonicalAqiCategory(category);
  const currentLevel = categoryOrder[canonicalCategory] ?? categoryOrder['Moderate'];

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
