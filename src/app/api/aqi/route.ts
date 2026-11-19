import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedAqi } from '@/lib/aqi/aqi-merger';
import { checkRateLimit, getClientKey } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

// AQI endpoint: 60 requests per minute per IP (generous; data updates hourly)
const RATE_LIMIT = { limit: 60, windowMs: 60_000 };

export async function GET(request: NextRequest) {
  const clientKey = `aqi:${getClientKey(request)}`;
  const rl = checkRateLimit(clientKey, RATE_LIMIT);

  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait before retrying.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(RATE_LIMIT.limit),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const rawCity = searchParams.get('city') || 'delhi';
    // Validate and sanitize city parameter to prevent cache key pollution
    const city = rawCity.slice(0, 50).replace(/[^a-zA-Z0-9_\-\s]/g, '').trim() || 'delhi';

    const aqiData = await getUnifiedAqi(city);

    return NextResponse.json(aqiData, {
      status: 200,
      headers: {
        // AQI data updates hourly at CPCB. Serve fresh for 5 min, stale-while-revalidate for 10 min.
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-RateLimit-Limit': String(RATE_LIMIT.limit),
        'X-RateLimit-Remaining': String(rl.remaining),
      },
    });
  } catch (error) {
    console.error('AQI API route error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve air quality data. Please try again shortly.' },
      {
        status: 500,
        headers: {
          // Errors must NEVER be cached by the CDN
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'X-RateLimit-Limit': String(RATE_LIMIT.limit),
          'X-RateLimit-Remaining': String(rl.remaining),
        },
      }
    );
  }
}
