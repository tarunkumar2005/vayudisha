import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  calculateModalShiftImpact,
  getThermalInversionGuidance,
  INDIAN_TRANSPORT_EMISSION_FACTORS,
} from '@/lib/impact/emission-factors';

export const dynamic = 'force-dynamic';

const ImpactRequestSchema = z.object({
  currentMode: z.string(),
  alternativeMode: z.string(),
  oneWayDistanceKm: z.number().min(0.5).max(200).default(12),
  tripsPerWeek: z.number().min(1).max(28).default(10),
});

export async function POST(request: NextRequest) {
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
      { error: 'Failed to calculate impact', details: String(error) },
      { status: 500 }
    );
  }
}
