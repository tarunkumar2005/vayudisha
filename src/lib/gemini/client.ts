/**
 * Gemini Developer API Integration
 *
 * Model: gemini-3.8-flash
 * Strategy: Hybrid AI personalization + deterministic fallback
 *
 * CRITICAL SAFETY RULES:
 * 1. Executes strictly on the server-side.
 * 2. Never exposes GEMINI_API_KEY to browser bundles.
 * 3. Enforces structured JSON output validated with Zod.
 * 4. Transparent fallback to static reviewed bilingual recommendations if API fails.
 */

import { GoogleGenAI } from '@google/genai';
import {
  type AnonymizedAiPromptContext,
  type AiPersonalizedResponse,
  validateAndCleanAiResponse,
} from './sanitizer';

const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const FALLBACK_MODEL = 'gemini-3.5-flash-lite';

const SYSTEM_INSTRUCTION = `You are SaansSaathi (साँस साथी - "Breath Companion"), an empathetic, scientifically grounded urban air quality advisor for families in India navigating severe winter smog.

PRIMARY DIRECTIVES:
1. You personalize and explain ONLY the pre-approved recommendations provided in the input prompt. Never invent new health interventions or unsupported statistics.
2. NEVER give medical diagnoses, prescribe drugs or treatments, or tell users to ignore clinical advice.
3. NEVER claim that an individual family's choices will reduce ambient outdoor city AQI. Individual choices reduce inhaled personal exposure and transport CO2e footprint, not citywide weather-inversion smog.
4. Align with Government of India October 2025 MoHFW/NCDC advisory: prioritize exposure reduction indoors; frame N95/N99 respirators as conditional for unavoidable outdoor exposure with airtight seal requirements; note that afternoon boundary layer dispersion provides only relative relief and that afternoon air is NOT clean during severe smog episodes; and never treat indoor plants as air filtration devices.
5. When asked in Hindi ('hi'), write in natural, warm, respectful Devanagari Hindi (e.g. "आपके परिवार के लिए सुझाव").
6. Output MUST be valid JSON adhering strictly to the requested schema.`;

export interface PersonalizationResult {
  isAiGenerated: boolean;
  data: AiPersonalizedResponse;
  modelUsed?: string;
  fallbackReason?: string;
}

/**
 * Generate personalized explanation for approved recommendations.
 * Falls back to deterministic static guidance if API key is missing, network fails, or validation fails.
 */
export async function generatePersonalizedGuidance(
  context: AnonymizedAiPromptContext
): Promise<PersonalizationResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      isAiGenerated: false,
      data: createDeterministicFallback(context),
      fallbackReason: 'GEMINI_API_KEY not configured on server. Used verified static guidance.',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const userPrompt = `
Context:
- City: ${context.cityName}
- Current Air Condition: ${context.aqiCategory}
- Household Demographics:
  * Young Children Present: ${context.householdSummary.hasYoungChildren ? 'Yes' : 'No'}
  * Seniors Present: ${context.householdSummary.hasSeniors ? 'Yes' : 'No'}
  * Sensitive Respiratory Needs: ${context.householdSummary.hasVulnerableMembers ? 'Yes' : 'No'}
  * Commute Style: ${context.householdSummary.commuteType}
  * Budget Preference: ${context.householdSummary.budgetTier}
- Language Requested: ${context.requestedLanguage === 'hi' ? 'Hindi (Devanagari)' : 'English'}

Pre-Approved Interventions to Explain & Personalize:
${context.approvedRecommendations
  .map(
    (r, idx) =>
      `${idx + 1}. [${r.id}] ${r.title}\n   Summary: ${r.summary}\n   Action: ${r.actionSteps.join('; ')}\n   Scientific Fact: ${r.evidenceFact}`
  )
  .join('\n\n')}

TASK:
Produce a warm, practical JSON response matching this schema:
{
  "openingEncouragement": "1-2 reassuring sentences tailored to this family and current AQI in ${context.requestedLanguage === 'hi' ? 'Hindi' : 'English'}",
  "personalizedAdvice": [
    {
      "id": "matching intervention id from above",
      "headline": "Action-oriented headline",
      "whyItMattersForYourFamily": "Why this specifically protects this household setup",
      "practicalActionTip": "One realistic hack or best practice for Indian homes"
    }
  ],
  "dailySmogWindowTip": "Advice on managing morning vs afternoon ventilation based on cold weather smog inversion",
  "safetyDisclaimer": "General air quality guidance, not medical diagnosis or treatment. Consult a physician for acute respiratory distress."
}
`;

    let responseText = '';
    let usedModel = PRIMARY_MODEL;

    try {
      const response = await ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          temperature: 0.2, // Low temperature for factual precision
        },
      });
      responseText = response.text?.trim() || '';
    } catch (primaryErr: unknown) {
      const errObj = primaryErr as { status?: number; code?: number; error?: { code?: number } };
      const status = errObj?.status || errObj?.code || errObj?.error?.code;
      const isTransient = status === 503 || status === 429;

      console.warn(
        `Gemini primary model (${PRIMARY_MODEL}) ${isTransient ? `temporarily unavailable (HTTP ${status})` : 'failed'}. Attempting fallback to ${FALLBACK_MODEL}...`
      );

      try {
        const fallbackRes = await ai.models.generateContent({
          model: FALLBACK_MODEL,
          contents: userPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });
        responseText = fallbackRes.text?.trim() || '';
        usedModel = FALLBACK_MODEL;
      } catch (fallbackErr) {
        console.warn('Gemini fallback model also failed. Engaging deterministic bilingual fallback.');
        return {
          isAiGenerated: false,
          data: createDeterministicFallback(context),
          fallbackReason: `Gemini API temporary capacity spike (HTTP ${status ?? 'error'}). Served verified static guidance.`,
        };
      }
    }

    const validation = validateAndCleanAiResponse(responseText);

    if (validation.success) {
      return {
        isAiGenerated: true,
        data: validation.data,
        modelUsed: usedModel,
      };
    }

    console.warn('Gemini response validation failed:', validation.reason);
    return {
      isAiGenerated: false,
      data: createDeterministicFallback(context),
      fallbackReason: `AI response rejected: ${validation.reason}. Used verified static guidance.`,
    };
  } catch (err) {
    console.error('Gemini API call failed:', err);
    return {
      isAiGenerated: false,
      data: createDeterministicFallback(context),
      fallbackReason: `Gemini API error: ${err instanceof Error ? err.message : String(err)}. Used verified static guidance.`,
    };
  }
}

/**
 * Deterministic fallback generator using pre-reviewed bilingual templates.
 */
export function createDeterministicFallback(
  context: AnonymizedAiPromptContext
): AiPersonalizedResponse {
  const isHindi = context.requestedLanguage === 'hi';
  const isHighSmog =
    context.aqiCategory.toLowerCase().includes('severe') ||
    context.aqiCategory.toLowerCase().includes('very poor');

  const advice = context.approvedRecommendations.map((rec) => ({
    id: rec.id,
    headline: rec.title,
    whyItMattersForYourFamily: rec.summary,
    practicalActionTip: rec.actionSteps[0] || rec.evidenceFact,
  }));

  if (isHindi) {
    return {
      openingEncouragement: `वायु गुणवत्ता (${context.aqiCategory}) को देखते हुए, आपके परिवार की सुरक्षा के लिए यहाँ MoHFW/NCDC मानकों के अनुरूप प्रमाणित सुझाव दिए गए हैं।`,
      personalizedAdvice: advice,
      dailySmogWindowTip: isHighSmog
        ? 'गंभीर स्मॉग के दिनों में दोपहर का वायुमंडलीय फैलाव केवल तुलनात्मक राहत देता है; हवा तब भी खतरनाक रहती है। MoHFW/NCDC सलाह के अनुसार बाहर की शारीरिक गतिविधियों से पूरी तरह बचें।'
        : 'सुबह और देर शाम इनवर्जन से धुआं जमीन के पास जमा रहता है। यदि बाहर जाना जरूरी हो, तो वास्तविक AQI जांचें और दोपहर (1-4 बजे) का समय चुनें।',
      safetyDisclaimer:
        'यह सामान्य वायु गुणवत्ता जागरूकता सुझाव हैं, चिकित्सकीय सलाह नहीं। सांस की समस्या होने पर डॉक्टर से परामर्श लें।',
    };
  }

  return {
    openingEncouragement: `With current air quality at ${context.aqiCategory}, here are evidence-backed routines tailored to protect your household in line with MoHFW/NCDC advisories.`,
    personalizedAdvice: advice,
    dailySmogWindowTip: isHighSmog
      ? 'During severe smog episodes, afternoon dispersion is only relative; air remains hazardous. The MoHFW/NCDC advisory urges avoiding non-essential outdoor exposure entirely.'
      : 'Thermal inversion traps ground smoke in early mornings and late evenings. If outdoor transit is necessary, check real-time AQI and prefer afternoon hours (1–4 PM) when atmospheric mixing is relatively better.',
    safetyDisclaimer:
      'General air quality guidance, not medical diagnosis or treatment. Consult a qualified healthcare professional for acute respiratory symptoms.',
  };
}
