import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, getClientKey } from '@/lib/rate-limit';
import {
  calculateModalShiftImpact,
  getThermalInversionGuidance,
  INDIAN_TRANSPORT_EMISSION_FACTORS,
} from '@/lib/impact/emission-factors';

export const dynamic = 'force-dynamic';

// Impact calculator: 60 req/min (purely computational, no external API)
const RATE_LIMIT = { limit: 60, windowMs: 60_000 };

const ImpactRequestSchema = z.object({
  currentMode: z.string(),
  alternativeMode: z.string(),
  oneWayDistanceKm: z.number().min(0.5).max(200).default(12),
  tripsPerWeek: z.number().min(1).max(28).default(10),
});

const MAX_PAYLOAD_BYTES = 32 * 1024; // 32 KB payload limit

export async function POST(request: NextRequest) {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { error: 'Payload too large. Maximum allowed size is 32 KB.' },
      { status: 413, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  const clientKey = `impact:${getClientKey(request)}`;
  const rl = checkRateLimit(clientKey, RATE_LIMIT);

  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)), 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const body = await request.json();
    const parsed = ImpactRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid calculation parameters', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { currentMode, alternativeMode, oneWayDistanceKm, tripsPerWeek } = parsed.data;

    const calculation = calculateModalShiftImpact({
      currentMode: currentMode as keyof typeof INDIAN_TRANSPORT_EMISSION_FACTORS,
      alternativeMode: alternativeMode as keyof typeof INDIAN_TRANSPORT_EMISSION_FACTORS,
      oneWayDistanceKm,
      tripsPerWeek,
    });

    const inversionGuidance = getThermalInversionGuidance();

    return NextResponse.json({
      success: true,
      calculation,
      inversionGuidance,
      allAvailableModes: Object.values(INDIAN_TRANSPORT_EMISSION_FACTORS).map((f) => ({
        mode: f.mode,
        label: f.label,
        factor: f.gCo2ePerPassengerKm,
        source: f.source,
      })),
    });
  } catch (error) {
    console.error('Impact calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate impact. Please verify input parameters.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
