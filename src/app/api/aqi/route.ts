import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedAqi } from '@/lib/aqi/aqi-merger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'delhi';

    const aqiData = await getUnifiedAqi(city);

    return NextResponse.json(aqiData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('AQI API route error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve air quality data', details: String(error) },
      { status: 500 }
    );
  }
}
