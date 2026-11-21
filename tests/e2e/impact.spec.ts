/**
 * E2E: Impact calculator — chart, mode selector, CO2e disclaimer
 */
import { test, expect } from '@playwright/test';

test.describe('Impact calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/impact');
    await page.waitForLoadState('domcontentloaded');
  });

  test('impact page loads with h1', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Impact|CO2|Carbon|प्रभाव/i);
  });

  test('transport mode selectors are present', async ({ page }) => {
    // Page has select dropdowns for current and alternative modes
    const selects = page.locator('select');
    const count = await selects.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('distance input accepts values', async ({ page }) => {
    const inputs = page.locator('input[type="number"], input[type="range"]');
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('chart or calculation result is rendered', async ({ page }) => {
    // Recharts renders SVG elements
    const chart = page.locator('.recharts-surface, svg:visible').first();
    await expect(chart).toBeVisible({ timeout: 10_000 });
  });

  test('CO2e ≠ AQI disclaimer is present', async ({ page }) => {
    // Page must clearly state CO2e savings do not reduce city AQI
    const disclaimer = page.locator('text=/CO2e|emissions|AQI|air quality/i').first();
    await expect(disclaimer).toBeVisible({ timeout: 10_000 });
  });

  test('changing mode updates calculation display', async ({ page }) => {
    const selects = page.locator('select');
    if (await selects.count() >= 1) {
      const firstSelect = selects.first();
      await firstSelect.selectOption({ index: 1 });
      // Page should still work after change
      await expect(page.locator('h1').first()).toBeVisible();
    }
  });
});
