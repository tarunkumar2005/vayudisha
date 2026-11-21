import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  checkDistributedRateLimit,
  getAnonymizedClientKey,
  createRateLimitHeaders,
} from '@/lib/rate-limit';
import { getUnifiedAqi } from '@/lib/aqi/aqi-merger';
import {
  evaluateActivitySafety,
  getEligibleRecommendations,
  mapModelCategoryToCanonicalAqiCategory,
} from '@/lib/rules/safety-rules';
import { getCityById } from '@/lib/constants/cities';
import { type AqiCategory } from '@/lib/aqi/aqi-breakpoints';
import { sanitizeProfileForAi } from '@/lib/gemini/sanitizer';
import { generatePersonalizedGuidance } from '@/lib/gemini/client';

export const dynamic = 'force-dynamic';

// Recommendations endpoint: 20 requests per minute per IP (AI calls are expensive)
const RATE_LIMIT = { limit: 20, windowMs: 60_000 };
const MAX_PAYLOAD_BYTES = 32 * 1024; // 32 KB payload cap to prevent memory exhaustion

const RequestSchema = z.object({
  cityName: z.string().max(100).default('delhi'),
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
  // 1. Enforce payload size limit
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { error: 'Payload too large. Maximum allowed size is 32 KB.' },
      { status: 413, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  // 2. Distributed rate limit check (Upstash Redis with memory fallback)
  const clientKey = getAnonymizedClientKey(request, 'rec');
  const rl = await checkDistributedRateLimit(clientKey, RATE_LIMIT);
  const rlHeaders = createRateLimitHeaders(rl);

  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. AI recommendations are rate-limited to protect service quality.' },
      {
        status: 429,
        headers: {
          ...rlHeaders,
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  try {
    const body = await request.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', issues: parsed.error.issues },
        { status: 400, headers: { ...rlHeaders, 'Cache-Control': 'no-store' } }
      );
    }

    const { cityName, language, profile } = parsed.data;

    // Validate city strictly against supported registry to prevent unknown city substitution (H-04)
    // and prevent free-form PII/prompt injection leakage to Gemini (H-05).
    const canonicalCity = getCityById(cityName);
    if (!canonicalCity) {
      return NextResponse.json(
        { error: 'Invalid or unsupported city identifier. Please select a valid supported Indian city.' },
        { status: 400, headers: { ...rlHeaders, 'Cache-Control': 'no-store' } }
      );
    }

    // 1. Fetch official authoritative air quality data using canonical ID
    const aqiData = await getUnifiedAqi(canonicalCity.id);
    const category = mapModelCategoryToCanonicalAqiCategory(aqiData.current.category);

    // 2. Deterministic Safety & Activity Guidance
    const activitySafety = evaluateActivitySafety(category, profile);

    // 3. Deterministic Recommendation Selection
    const eligibleRecs = getEligibleRecommendations(category, profile);
    const allTierRecs = getEligibleRecommendations(category, { ...profile, budgetTier: 'high' });

    // 4. Privacy Sanitization for AI Personalization (using canonical display name)
    const sanitizedContext = sanitizeProfileForAi(
      canonicalCity.name.en,
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

    // 6. Assemble complete response with privacy and rate limit headers
    return NextResponse.json(
      {
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
        allRecommendations: allTierRecs.map((r) => ({
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
      },
      {
        status: 200,
        headers: {
          ...rlHeaders,
          // Security: Personalized health & household recommendations must never be cached in shared caches
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations. Please try again shortly.' },
      { status: 500, headers: { ...rlHeaders, 'Cache-Control': 'no-store' } }
    );
  }
}
