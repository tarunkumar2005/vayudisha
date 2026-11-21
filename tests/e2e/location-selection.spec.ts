/**
 * E2E: City selector changes city; AQI city name updates
 */
import { test, expect } from '@playwright/test';

test.describe('Location selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('city selector is visible with aria-label', async ({ page }) => {
    const citySelect = page.locator('select[aria-label="Select City"]');
    await expect(citySelect).toBeVisible();
  });

  test('changing city updates the page h1 city name', async ({ page }) => {
    const citySelect = page.locator('select[aria-label="Select City"]');
    // Switch to Mumbai
    await citySelect.selectOption('mumbai');
    // h1 should update to show Mumbai
    await expect(page.locator('h1').first()).toContainText(/Mumbai|मुंबई/i, { timeout: 10_000 });
  });

  test('city selection persists on refresh via localStorage', async ({ page }) => {
    const citySelect = page.locator('select[aria-label="Select City"]');
    await citySelect.selectOption('bengaluru');
    // Reload page — localStorage should restore city
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    const selectedValue = await citySelect.inputValue();
    expect(selectedValue).toBe('bengaluru');
  });
});
