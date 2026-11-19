import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientKey } from '@/lib/rate-limit';
import { getUnifiedAqi } from '@/lib/aqi/aqi-merger';
import {
  evaluateActivitySafety,
  getEligibleRecommendations,
  type DemographicProfile,
} from '@/lib/rules/safety-rules';
import { type AqiCategory } from '@/lib/aqi/aqi-breakpoints';
import { sanitizeProfileForAi } from '@/lib/gemini/sanitizer';
import { generatePersonalizedGuidance } from '@/lib/gemini/client';

export const dynamic = 'force-dynamic';

// Recommendations endpoint: 20 requests per minute per IP (AI calls are expensive)
const RATE_LIMIT = { limit: 20, windowMs: 60_000 };

const RequestSchema = z.object({
  cityName: z.string().default('delhi'),
  language: z.enum(['en', 'hi']).default('en'),
  profile: z.object({
    hasInfantsOrToddlers: z.boolean().default(false),
    hasSchoolChildren: z.boolean().default(false),
    hasSeniors: z.boolean().default(false),
    hasSensitiveMembers: z.boolean().default(false),
    commuteMode: z
      .enum(['car', 'two_wheeler', 'metro', 'bus', 'auto_rickshaw', 'cycle_walk'])
      .default('metro'),
    budgetTier: z.enum(['low', 'medium', 'high']).default('medium'),
  }),
});

export async function POST(request: NextRequest) {
  const clientKey = `rec:${getClientKey(request)}`;
  const rl = checkRateLimit(clientKey, RATE_LIMIT);

  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. AI recommendations are rate-limited to protect service quality.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) },
      }
    );
  }

  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { cityName, language, profile } = parsed.data;

    // 1. Fetch official authoritative air quality data
    const aqiData = await getUnifiedAqi(cityName);
    const category = (aqiData.current.category as AqiCategory) || 'Moderate';

    // 2. Deterministic Safety & Activity Guidance
    const activitySafety = evaluateActivitySafety(category, profile);

    // 3. Deterministic Recommendation Selection
    const eligibleRecs = getEligibleRecommendations(category, profile);

    // 4. Privacy Sanitization for AI Personalization
    const sanitizedContext = sanitizeProfileForAi(
      cityName,
      category,
      profile,
      eligibleRecs.map((r) => ({
        id: r.id,
        title: language === 'hi' ? r.title.hi : r.title.en,
        summary: language === 'hi' ? r.summary.hi : r.summary.en,
        actionSteps: language === 'hi' ? r.actionSteps.hi : r.actionSteps.en,
        evidenceFact: language === 'hi' ? r.evidence.fact.hi : r.evidence.fact.en,
      })),
      language
    );

    // 5. AI Personalization (gemini-3.8-flash with fallback)
    const personalization = await generatePersonalizedGuidance(sanitizedContext);

    // 6. Assemble complete response
    return NextResponse.json({
      success: true,
      city: aqiData.city,
      aqiSnapshot: {
        aqi: aqiData.current.aqi,
        category: aqiData.current.category,
        categoryHindi: aqiData.current.categoryHindi,
        color: aqiData.current.color,
        dataSource: aqiData.current.dataSource,
        stationName: aqiData.current.stationName,
        isModelForecast: aqiData.current.isModelForecast,
      },
      activitySafety,
      personalization,
      eligibleRecommendations: eligibleRecs.map((r) => ({
        id: r.id,
        category: r.category,
        budgetTier: r.budgetTier,
        title: language === 'hi' ? r.title.hi : r.title.en,
        summary: language === 'hi' ? r.summary.hi : r.summary.en,
        actionSteps: language === 'hi' ? r.actionSteps.hi : r.actionSteps.en,
        evidence: {
          source: r.evidence.source,
          url: r.evidence.url,
          fact: language === 'hi' ? r.evidence.fact.hi : r.evidence.fact.en,
        },
      })),
    });
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations', details: String(error) },
      { status: 500 }
    );
  }
}
