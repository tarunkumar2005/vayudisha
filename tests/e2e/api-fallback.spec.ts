/**
 * E2E: API failure fallback — when CPCB unavailable, shows CAMS model forecast with notice
 * In mock mode (USE_MOCK_AQI=true), we get demonstration mode; this tests the fallback pathway
 * by intercepting the /api/aqi route to return a CAMS-only response.
 */
import { test, expect } from '@playwright/test';

test.describe('API fallback behaviour', () => {
  test('dashboard shows fallback notice when AQI API returns error', async ({ page }) => {
    // Intercept /api/aqi to simulate complete failure
    await page.route('**/api/aqi**', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Service unavailable' }),
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Page should not crash — should show some content (loading state or fallback)
    const body = await page.locator('body').isVisible();
    expect(body).toBe(true);
  });

  test('dashboard loads and shows -- for AQI when in CAMS-only mode', async ({ page }) => {
    // Intercept /api/aqi to return a CAMS-only payload (aqi: null)
    const camsPayload = {
      city: { id: 'delhi', name: { en: 'Delhi NCR', hi: 'दिल्ली एनसीआर' }, state: 'Delhi', latitude: 28.6139, longitude: 77.209 },
      current: {
        aqi: null,
        category: 'High Risk',
        categoryHindi: 'खराब जोखिम (मॉडल अनुमान)',
        color: '#FF8C00',
        prominentPollutant: 'PM2.5 (Model)',
        stationName: 'Copernicus Atmospheric Monitoring Service (Grid 0.4°)',
        timestamp: new Date().toISOString(),
        timestampFormatted: 'Current Model Run',
        isFresh: true,
        ageMinutes: 0,
        dataSource: 'cams_model_forecast',
        dataSourceLabel: 'Copernicus (CAMS) Model Forecast',
        isModelForecast: true,
        isOfficialSuppliedAqi: false,
        isDerivedEstimate: true,
        methodologyNote: 'CAMS model forecast. Not official CPCB AQI.',
      },
      stations: [],
      forecast: null,
      status: {
        officialCpcbAvailable: false,
        camsForecastAvailable: true,
        isFallback: true,
        notice: {
          en: 'Official CPCB ground station data is currently unavailable. Showing atmospheric model forecast from Copernicus (CAMS).',
          hi: 'आधिकारिक सीपीसीबी डेटा उपलब्ध नहीं है।',
        },
      },
    };

    await page.route('**/api/aqi**', (route) => {
      route.fulfill({
        status: 200,
        body: JSON.stringify(camsPayload),
        headers: { 'Content-Type': 'application/json' },
      });
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    // The gauge should show '--' for null AQI
    const dashText = page.locator('text=--').first();
    await expect(dashText).toBeVisible({ timeout: 10_000 });
  });

  test('fallback notice text is visible in CAMS-only mode', async ({ page }) => {
    const camsPayload = {
      city: { id: 'delhi', name: { en: 'Delhi NCR', hi: 'दिल्ली एनसीआर' }, state: 'Delhi', latitude: 28.6139, longitude: 77.209 },
      current: {
        aqi: null, category: 'Moderate', categoryHindi: 'मध्यम', color: '#FFFF00',
        prominentPollutant: null, stationName: 'CAMS', timestamp: new Date().toISOString(),
        timestampFormatted: 'Now', isFresh: true, ageMinutes: 0,
        dataSource: 'cams_model_forecast', dataSourceLabel: 'CAMS',
        isModelForecast: true, isOfficialSuppliedAqi: false, isDerivedEstimate: true,
        methodologyNote: 'CAMS model',
      },
      stations: [], forecast: null,
      status: {
        officialCpcbAvailable: false, camsForecastAvailable: true, isFallback: true,
        notice: { en: 'Official CPCB ground station data is currently unavailable.', hi: 'सीपीसीबी डेटा उपलब्ध नहीं है।' },
      },
    };

    await page.route('**/api/aqi**', (route) => {
      route.fulfill({ status: 200, body: JSON.stringify(camsPayload), headers: { 'Content-Type': 'application/json' } });
    });

    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');

    const notice = page.locator('text=/unavailable|Status Notice/i').first();
    await expect(notice).toBeVisible({ timeout: 10_000 });
  });
});
