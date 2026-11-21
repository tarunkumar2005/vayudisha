import { describe, it, expect } from 'vitest';
import { GET as getAqiHandler } from '@/app/api/aqi/route';
import { POST as postRecommendationsHandler } from '@/app/api/recommendations/route';
import { POST as postImpactHandler } from '@/app/api/impact/route';
import { POST as postCommunityHandler } from '@/app/api/community/route';
import { NextRequest } from 'next/server';

describe('Next.js API Route Handlers Integration', () => {
  it('GET /api/aqi returns unified AQI payload with caching headers', async () => {
    const req = new NextRequest('http://localhost:3000/api/aqi?city=delhi');
    const res = await getAqiHandler(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.city).toBeDefined();
    expect(json.current).toBeDefined();
    expect(json.current.dataSource).toBeDefined();
    expect(res.headers.get('Cache-Control')).toContain('s-maxage=300');
  });

  it('GET /api/aqi?city=shimla handles CAMS model forecast without error', async () => {
    const req = new NextRequest('http://localhost:3000/api/aqi?city=shimla');
    const res = await getAqiHandler(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.city.id).toBe('shimla');
    expect(json.current.isModelForecast).toBe(true);
    expect(json.current.dataSource).toBe('cams_model_forecast');
  });

  it('GET /api/aqi?city=unknown rejects unsupported city with HTTP 400 (H-04)', async () => {
    const req = new NextRequest('http://localhost:3000/api/aqi?city=definitely-not-a-supported-city');
    const res = await getAqiHandler(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('Unknown or unsupported city');
    expect(res.headers.get('Cache-Control')).toContain('no-store');
  });

  it('POST /api/recommendations rejects unsupported city with HTTP 400 (H-04, H-05)', async () => {
    const req = new NextRequest('http://localhost:3000/api/recommendations', {
      method: 'POST',
      body: JSON.stringify({
        cityName: 'unknown-city-test@example.com',
        language: 'en',
        profile: {
          hasInfantsOrToddlers: false,
          hasSchoolChildren: false,
          hasSeniors: false,
          hasSensitiveMembers: false,
          commuteMode: 'car',
          budgetTier: 'low',
        },
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await postRecommendationsHandler(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('unsupported city');
  });

  it('POST /api/recommendations validates payload and returns personalized guidance', async () => {
    const req = new NextRequest('http://localhost:3000/api/recommendations', {
      method: 'POST',
      body: JSON.stringify({
        cityName: 'delhi',
        language: 'hi',
        profile: {
          hasInfantsOrToddlers: true,
          hasSchoolChildren: false,
          hasSeniors: false,
          hasSensitiveMembers: false,
          commuteMode: 'metro',
          budgetTier: 'low',
        },
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await postRecommendationsHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.activitySafety).toBeDefined();
    expect(json.personalization).toBeDefined();
    expect(json.eligibleRecommendations.length).toBeGreaterThan(0);
  });

  it('POST /api/impact calculates verified modal shift CO2e savings', async () => {
    const req = new NextRequest('http://localhost:3000/api/impact', {
      method: 'POST',
      body: JSON.stringify({
        currentMode: 'car_petrol',
        alternativeMode: 'metro_rail',
        oneWayDistanceKm: 15,
        tripsPerWeek: 10,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await postImpactHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.calculation.weeklySavedCo2eKg).toBeGreaterThan(15);
    expect(json.inversionGuidance).toBeDefined();
  });

  it('POST /api/community generates an anonymized shareable clean-air plan', async () => {
    const req = new NextRequest('http://localhost:3000/api/community', {
      method: 'POST',
      body: JSON.stringify({
        cityName: 'delhi',
        communityName: 'Green Park RWA',
        language: 'en',
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    const res = await postCommunityHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.planMetadata.communityName).toBe('Green Park RWA');
    expect(json.planMetadata.hasNoPii).toBe(true);
    expect(json.actions.length).toBeGreaterThan(3);
  });
});
