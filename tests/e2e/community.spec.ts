/**
 * E2E: Community page — action plan loads, print button, Hindi/English content
 */
import { test, expect } from '@playwright/test';

test.describe('Community action plan', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/community');
    await page.waitForLoadState('domcontentloaded');
  });

  test('community page loads with h1', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Community|Action|समुदाय|योजना/i);
  });

  test('print/download button is visible', async ({ page }) => {
    // Look for print-related button
    const printBtn = page.locator('button', { hasText: /Print|प्रिंट|Download|Share/i }).first();
    await expect(printBtn).toBeVisible({ timeout: 10_000 });
  });

  test('community name input is present', async ({ page }) => {
    const input = page.locator('input[type="text"]').first();
    await expect(input).toBeVisible({ timeout: 10_000 });
  });

  test('action plan content renders with at least one action item', async ({ page }) => {
    // Actions are displayed as cards with title text
    await page.waitForTimeout(3000);
    // Look for community action categories
    const content = page.locator('text=/burning|Burning|dust|Dust|mask|Mask|carpool|Carpool|जलाने|धूल|मास्क/i').first();
    await expect(content).toBeVisible({ timeout: 15_000 });
  });

  test('community plan renders correctly in Hindi', async ({ page }) => {
    // Switch to Hindi via language toggle
    const langBtn = page.locator('header').locator('button').last();
    await langBtn.click();
    await page.waitForTimeout(1000);
    // Plan should contain Devanagari text
    const bodyText = await page.locator('body').innerText();
    expect(bodyText).toMatch(/[\u0900-\u097F]/);
  });

  test('disclaimer text is visible', async ({ page }) => {
    const disclaimer = page.locator('text=/CPCB|NGT|GRAP|disclaimer/i').first();
    await expect(disclaimer).toBeVisible({ timeout: 15_000 });
  });
});
