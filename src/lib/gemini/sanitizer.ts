/**
 * Privacy Sanitizer & Output Safety Validator for Gemini API
 *
 * CRITICAL PRIVACY & SAFETY RULES:
 * 1. Never send PII (names, phone, email, address coordinates) to Gemini.
 * 2. Never send specific medical conditions, medications, or health records.
 * 3. Never permit medical diagnoses, treatment prescriptions, or false cure claims.
 * 4. Never permit claims that individual actions reduce ambient city AQI.
 */

import { z } from 'zod';
import { type DemographicProfile } from '../rules/safety-rules';

export interface AnonymizedAiPromptContext {
  cityName: string;
  aqiCategory: string;
  householdSummary: {
    hasVulnerableMembers: boolean;
    hasYoungChildren: boolean;
    hasSeniors: boolean;
    commuteType: 'car' | 'two_wheeler' | 'transit_shared' | 'active';
    budgetTier: 'low' | 'medium' | 'high';
  };
  approvedRecommendations: {
    id: string;
    title: string;
    summary: string;
    actionSteps: string[];
    evidenceFact: string;
  }[];
  requestedLanguage: 'en' | 'hi';
}

/**
 * Sanitizes text to strip potential PII and prompt injection tokens.
 */
function stripPiiAndInjections(str: string): string {
  return str
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED_EMAIL]')
    .replace(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, '[REDACTED_PHONE]')
    .replace(
      /\b\d{1,5}\s+[A-Za-z0-9\s.,#-]+(?:Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr|Nagar|Colony|Sector|Marg)\b/gi,
      '[REDACTED_ADDRESS]'
    )
    .replace(/(?:system|assistant|instruction|prompt)\s*:/gi, '')
    .trim();
}

/**
 * Anonymize household profile before sending to Gemini API.
 * Ensures zero PII and zero medical records leak to external services.
 */
export function sanitizeProfileForAi(
  cityName: string,
  aqiCategory: string,
  profile: DemographicProfile,
  approvedRecs: {
    id: string;
    title: string;
    summary: string;
    actionSteps: string[];
    evidenceFact: string;
  }[],
  language: 'en' | 'hi' = 'en'
): AnonymizedAiPromptContext {
  let commuteType: AnonymizedAiPromptContext['householdSummary']['commuteType'] = 'transit_shared';
  if (profile.commuteMode === 'car') commuteType = 'car';
  else if (profile.commuteMode === 'two_wheeler') commuteType = 'two_wheeler';
  else if (profile.commuteMode === 'cycle_walk') commuteType = 'active';

  // Sanitize city name: strip any potential PII or prompt injection tokens (H-05)
  const cleanCity = stripPiiAndInjections(cityName).slice(0, 50);

  return {
    cityName: cleanCity,
    aqiCategory,
    householdSummary: {
      hasVulnerableMembers: profile.hasSensitiveMembers || profile.hasSeniors,
      hasYoungChildren: profile.hasInfantsOrToddlers || profile.hasSchoolChildren,
      hasSeniors: profile.hasSeniors,
      commuteType,
      budgetTier: profile.budgetTier,
    },
    approvedRecommendations: approvedRecs.map((r) => ({
      id: r.id,
      title: r.title,
      summary: r.summary,
      actionSteps: r.actionSteps.slice(0, 4),
      evidenceFact: r.evidenceFact,
    })),
    requestedLanguage: language,
  };
}

// --- Output Schemas for Structured JSON Validation ---

export const AiPersonalizedRecommendationSchema = z.object({
  id: z.string(),
  headline: z.string().max(120),
  whyItMattersForYourFamily: z.string().max(400),
  practicalActionTip: z.string().max(250),
});

export const AiPersonalizedResponseSchema = z.object({
  openingEncouragement: z.string().max(250),
  personalizedAdvice: z.array(AiPersonalizedRecommendationSchema),
  dailySmogWindowTip: z.string().max(300),
  safetyDisclaimer: z.string().max(250),
});

export type AiPersonalizedResponse = z.infer<typeof AiPersonalizedResponseSchema>;

/**
 * Strict regex guards against forbidden claims:
 * - Prescription / diagnostic claims (e.g., "cure", "prescribe", "treatment for asthma")
 * - False ambient AQI reduction claims (e.g., "reduce city AQI by 50 points")
 */
const FORBIDDEN_MEDICAL_TERMS = [
  /\bdiagnos(is|e|ed|ing)\b/i,
  /\bprescri(be|ption|bing)\b/i,
  /\bcure[s]?\b/i,
  /\bcurative\b/i,
  /\bmedical treatment\b/i,
  /\bdose of medication\b/i,
  /\btreat your (asthma|copd|bronchitis|heart|lungs)\b/i,
  /\bmedication will (cure|treat|prevent)\b/i,
  /\beliminate (asthma|allergies|copd)\b/i,
];

const FORBIDDEN_AQI_CLAIMS = [
  /\b(reduce|lower|drop)s? (the|local|city|ambient) aqi by \d+/i,
  /\baqi will (decrease|drop|reduce) by \d+/i,
  /\byour actions? will (clean|clear) the city('s)? air\b/i,
  /\b(clear|clean|purify) (the )?(entire |whole )?(city|ambient|outdoor)('s)? air\b/i,
  /\bwill (clean|clear|purify) the city\b/i,
];

export function validateAndCleanAiResponse(
  rawJsonString: string,
  allowedRecommendationIds?: string[]
): { success: true; data: AiPersonalizedResponse } | { success: false; reason: string } {
  try {
    const parsed = JSON.parse(rawJsonString);
    const validated = AiPersonalizedResponseSchema.safeParse(parsed);

    if (!validated.success) {
      return {
        success: false,
        reason: `Schema validation failed: ${validated.error.issues.map((i) => i.message).join(', ')}`,
      };
    }

    const data = validated.data;

    // Guard 0: Verify that all returned advice IDs belong to the approved recommendations allowlist (H-06)
    if (allowedRecommendationIds && allowedRecommendationIds.length > 0) {
      const allowedSet = new Set(allowedRecommendationIds);
      for (const advice of data.personalizedAdvice) {
        if (!allowedSet.has(advice.id)) {
          return {
            success: false,
            reason: `Model returned unapproved intervention ID '${advice.id}'. Allowed IDs: ${allowedRecommendationIds.join(', ')}`,
          };
        }
      }
    }

    // Include advice fields, opening, and daily tip in general text check
    const adviceTextToCheck = [
      data.openingEncouragement,
      data.dailySmogWindowTip,
      ...data.personalizedAdvice.map(
        (a) => `${a.headline} ${a.whyItMattersForYourFamily} ${a.practicalActionTip}`
      ),
    ].join(' ');

    // Guard 1: Check for medical prescription or diagnosis claims in generated content
    for (const pattern of FORBIDDEN_MEDICAL_TERMS) {
      if (pattern.test(adviceTextToCheck)) {
        return {
          success: false,
          reason: `Model output contained forbidden medical term matching ${pattern}`,
        };
      }
    }

    // Guard 2: Check for false ambient AQI reduction claims in generated content
    for (const pattern of FORBIDDEN_AQI_CLAIMS) {
      if (pattern.test(adviceTextToCheck) || pattern.test(data.safetyDisclaimer)) {
        return {
          success: false,
          reason: `Model output contained unsupported ambient AQI reduction claim matching ${pattern}`,
        };
      }
    }

    // Guard 3: Check that safetyDisclaimer does NOT contain unapproved medical treatment/cure claims (H-06)
    const FORBIDDEN_DISCLAIMER_CLAIMS = [
      /\bcure[s]?\b/i,
      /\bcurative\b/i,
      /\bdose of medication\b/i,
      /\bprescri(be|ption|bing)\b/i,
      /\btreat your (asthma|copd|bronchitis|heart|lungs)\b/i,
      /\bmedication will (cure|treat|prevent)\b/i,
      /\beliminate (asthma|allergies|copd)\b/i,
    ];
    for (const pattern of FORBIDDEN_DISCLAIMER_CLAIMS) {
      if (pattern.test(data.safetyDisclaimer)) {
        return {
          success: false,
          reason: `Model safety disclaimer contained forbidden medical claim matching ${pattern}`,
        };
      }
    }

    return { success: true, data };
  } catch (e) {
    return {
      success: false,
      reason: `JSON parsing failed: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}
