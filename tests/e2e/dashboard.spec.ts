/**
 * E2E: Dashboard loading, AQI gauge, source badge, fallback notice
 * Runs against USE_MOCK_AQI=true so CPCB data is simulated demonstration mode.
 */
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with page title and h1', async ({ page }) => {
    await expect(page).toHaveTitle(/SaansSaathi/i);
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('AQI gauge is visible with a numeric value or -- placeholder', async ({ page }) => {
    // Wait for AQI data to load (spinner disappears)
    await page.waitForSelector('[role="status"]', { state: 'detached', timeout: 15_000 }).catch(() => {});
    // The gauge shows either a number or '--'
    const gaugeNumber = page.locator('text=/^\\d+$|^--$/').first();
    await expect(gaugeNumber).toBeVisible({ timeout: 15_000 });
  });

  test('data source badge is visible with station attribution', async ({ page }) => {
    // SourceBadge should be present with text referencing data source
    await page.waitForLoadState('domcontentloaded');
    const badge = page.locator('text=/CPCB|CAMS|Demonstration|Station/i').first();
    await expect(badge).toBeVisible({ timeout: 15_000 });
  });

  test('fallback or demonstration notice is visible in mock mode', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    // In mock mode: either the demonstration notice or a telemetry status notice appears
    const notice = page.locator('text=/Demonstration|demonstration|Status|unavailable/i').first();
    await expect(notice).toBeVisible({ timeout: 15_000 });
  });

  test('refresh button is visible and clickable', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    const refreshBtn = page.locator('button', { hasText: /Refresh/i }).first();
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();
    // Should not throw; loading state may briefly re-appear
  });

  test('skip-to-main-content link is present in DOM', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });

  test('main landmark exists', async ({ page }) => {
    await expect(page.locator('#main-content')).toBeAttached();
  });
});
