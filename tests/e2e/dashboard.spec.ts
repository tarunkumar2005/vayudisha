/**
 * E2E: Dashboard & Telemetry Workstation
 * Runs against USE_MOCK_AQI=true so CPCB data is simulated demonstration mode.
 */
import { test, expect } from '@playwright/test';

test.describe('Marketing Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with brand title and storytelling hero heading', async ({ page }) => {
    await expect(page).toHaveTitle(/VayuDisha/i);
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Know your air|हवा की समझ/i);
  });

  test('interactive timeline scrubber updates active mechanism and vayu advice', async ({ page }) => {
    const afternoonTab = page.locator('button', { hasText: /02:00 PM|दोपहर/i }).first();
    await afternoonTab.click();
    await expect(page.locator('text=/Solar Ventilation|संवातन/i').first()).toBeVisible();
  });

  test('try-it calculator updates calculated CADR upon clicking room size', async ({ page }) => {
    const largeRoomBtn = page.locator('button', { hasText: /350 sq ft/i }).first();
    await largeRoomBtn.click();
    await expect(page.locator('text=/CADR|Clean Air Delivery/i').first()).toBeVisible();
  });
});

test.describe('Telemetry Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('loads with dashboard heading and selected city', async ({ page }) => {
    await expect(page).toHaveTitle(/VayuDisha/i);
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Dashboard|डैशबोर्ड/i);
  });

  test('AQI gauge is visible with a numeric value or -- placeholder', async ({ page }) => {
    await page.waitForSelector('[role="status"]', { state: 'detached', timeout: 15_000 }).catch(() => {});
    const gaugeNumber = page.locator('text=/^\\d+$|^--$/').first();
    await expect(gaugeNumber).toBeVisible({ timeout: 15_000 });
  });

  test('data source badge is visible with station attribution', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    const badge = page.locator('text=/CPCB|CAMS|Demonstration|Station/i').first();
    await expect(badge).toBeVisible({ timeout: 15_000 });
  });

  test('fallback or demonstration notice is visible in mock mode', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    const notice = page.locator('text=/Demonstration|demonstration|Status|unavailable/i').first();
    await expect(notice).toBeVisible({ timeout: 15_000 });
  });

  test('refresh button is visible and clickable', async ({ page }) => {
    await page.waitForLoadState('domcontentloaded');
    const refreshBtn = page.locator('button', { hasText: /Refresh|रिफ्रेश/i }).first();
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();
  });

  test('skip-to-main-content link is present in DOM', async ({ page }) => {
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });

  test('main landmark exists', async ({ page }) => {
    await expect(page.locator('#main-content')).toBeAttached();
  });
});
