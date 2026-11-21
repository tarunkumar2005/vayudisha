import { NextRequest, NextResponse } from 'next/server';
import { getUnifiedAqi } from '@/lib/aqi/aqi-merger';
import { getCityById } from '@/lib/constants/cities';
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
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const rawCity = searchParams.get('city') || 'delhi';
    const rawStation = searchParams.get('station');
    // Validate and sanitize parameters to prevent injection or cache key pollution
    const cityParam = rawCity.slice(0, 50).replace(/[^a-zA-Z0-9_\-\s]/g, '').trim() || 'delhi';
    const station = rawStation ? rawStation.slice(0, 100).trim() : undefined;

    // Reject unknown cities with HTTP 400 instead of silently substituting Delhi (H-04)
    const canonicalCity = getCityById(cityParam);
    if (!canonicalCity) {
      return NextResponse.json(
        { error: `Unknown or unsupported city '${cityParam}'. Please request a supported Indian city identifier.` },
        {
          status: 400,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'X-RateLimit-Limit': String(RATE_LIMIT.limit),
            'X-RateLimit-Remaining': String(rl.remaining),
          },
        }
      );
    }

    const aqiData = await getUnifiedAqi(canonicalCity.id, { preferredStation: station });

    // Outage and fallback responses must NEVER be cached publicly by CDN (H-02, M-15)
    const isOutageOrUnavailable =
      aqiData.current.dataSource === 'unavailable' ||
      (!aqiData.status.officialCpcbAvailable && !aqiData.status.camsForecastAvailable);

    const cacheHeader = isOutageOrUnavailable
      ? 'no-store, no-cache, must-revalidate'
      : 'public, s-maxage=300, stale-while-revalidate=600';

    return NextResponse.json(aqiData, {
      status: 200,
      headers: {
        'Cache-Control': cacheHeader,
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
