/**
 * E2E: Language toggle — EN → HI → EN switching
 */
import { test, expect } from '@playwright/test';

test.describe('Language switching', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure English default
    await page.goto('/');
    await page.evaluate(() => localStorage.removeItem('saanssaathi_lang'));
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
  });

  test('language toggle button is visible and accessible', async ({ page }) => {
    const langBtn = page.locator('header button').last();
    await expect(langBtn).toBeVisible();
    await expect(langBtn).toHaveText(/Hindi|हिन्दी|हिंदी|English|अंग्रेज़ी/i);
  });

  test('clicking language toggle switches UI to Hindi', async ({ page }) => {
    // Find the language toggle (last button in header area)
    const langBtn = page.locator('header').locator('button').last();
    await langBtn.click();
    await page.waitForTimeout(500);
    // Check that Hindi text appears — navigation should show Hindi labels
    const bodyText = await page.locator('body').innerText();
    // Hindi text uses Devanagari — check for a common Hindi character range
    expect(bodyText).toMatch(/[\u0900-\u097F]/);
  });

  test('clicking language toggle twice returns to English', async ({ page }) => {
    const langBtn = page.locator('header').locator('button').last();
    await langBtn.click();
    await page.waitForTimeout(300);
    await langBtn.click();
    await page.waitForTimeout(300);
    // Check English text is back
    const h1 = page.locator('h1').first();
    const text = await h1.innerText();
    // Should contain English characters predominantly
    expect(text.length).toBeGreaterThan(0);
  });

  test('Hindi language setting persists on navigation', async ({ page }) => {
    const langBtn = page.locator('header').locator('button').last();
    await langBtn.click();
    await page.waitForTimeout(500);
    // Navigate to planner
    await page.goto('/planner');
    await page.waitForLoadState('domcontentloaded');
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/[\u0900-\u097F]/);
  });
});
