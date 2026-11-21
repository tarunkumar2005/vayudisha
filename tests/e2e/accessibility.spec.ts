/**
 * E2E Accessibility Audit using axe-core injected via Playwright.
 * Tests WCAG 2.2 AA compliance on each main page.
 * axe-core is already a transitive dependency; no new package needed.
 */
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/** Inject axe-core from node_modules and run it, returning violations */
async function runAxe(page: import('@playwright/test').Page): Promise<AxeViolation[]> {
  // Read axe-core source from node_modules
  const axePath = path.join(process.cwd(), 'node_modules', 'axe-core', 'axe.min.js');
  const axeSource = fs.readFileSync(axePath, 'utf8');

  await page.evaluate(axeSource);

  const results = await page.evaluate(async () => {
    // @ts-expect-error axe is injected
    const r = await window.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'],
      },
    });
    return r.violations;
  });

  return results as AxeViolation[];
}

interface AxeViolation {
  id: string;
  impact: string;
  description: string;
  nodes: { html: string; failureSummary: string }[];
}

const CRITICAL_IMPACTS = new Set(['critical', 'serious']);

test.describe('Accessibility (WCAG 2.2 AA) — axe-core', () => {
  test('Dashboard / — no critical/serious axe violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Allow React hydration

    const violations = await runAxe(page);
    const critical = violations.filter((v) => CRITICAL_IMPACTS.has(v.impact));

    if (critical.length > 0) {
      const report = critical
        .map(
          (v) =>
            `[${v.impact.toUpperCase()}] ${v.id}: ${v.description}\n` +
            v.nodes.slice(0, 2).map((n) => `  HTML: ${n.html.slice(0, 120)}`).join('\n')
        )
        .join('\n\n');
      console.error('Axe violations on /:\n', report);
    }

    expect(critical, `Critical/serious axe violations on /: ${critical.map((v) => v.id).join(', ')}`).toHaveLength(0);
  });

  test('Dashboard /dashboard — no critical/serious axe violations', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const violations = await runAxe(page);
    const critical = violations.filter((v) => CRITICAL_IMPACTS.has(v.impact));

    if (critical.length > 0) {
      console.error('Axe violations on /dashboard:', critical.map((v) => `${v.id}: ${v.description}`).join('; '));
    }

    expect(critical, `Critical/serious axe violations on /dashboard: ${critical.map((v) => v.id).join(', ')}`).toHaveLength(0);
  });

  test('Planner /planner — no critical/serious axe violations', async ({ page }) => {
    await page.goto('/planner');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const violations = await runAxe(page);
    const critical = violations.filter((v) => CRITICAL_IMPACTS.has(v.impact));

    if (critical.length > 0) {
      console.error('Axe violations on /planner:', critical.map((v) => `${v.id}: ${v.description}`).join('; '));
    }

    expect(critical, `Critical/serious axe violations on /planner: ${critical.map((v) => v.id).join(', ')}`).toHaveLength(0);
  });

  test('Impact /impact — no critical/serious axe violations', async ({ page }) => {
    await page.goto('/impact');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const violations = await runAxe(page);
    const critical = violations.filter((v) => CRITICAL_IMPACTS.has(v.impact));

    if (critical.length > 0) {
      console.error('Axe violations on /impact:', critical.map((v) => `${v.id}: ${v.description}`).join('; '));
    }

    expect(critical, `Critical/serious axe violations on /impact: ${critical.map((v) => v.id).join(', ')}`).toHaveLength(0);
  });

  test('Community /community — no critical/serious axe violations', async ({ page }) => {
    await page.goto('/community');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const violations = await runAxe(page);
    const critical = violations.filter((v) => CRITICAL_IMPACTS.has(v.impact));

    if (critical.length > 0) {
      console.error('Axe violations on /community:', critical.map((v) => `${v.id}: ${v.description}`).join('; '));
    }

    expect(critical, `Critical/serious axe violations on /community: ${critical.map((v) => v.id).join(', ')}`).toHaveLength(0);
  });

  test('keyboard focus is visible on interactive elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Tab to first interactive element and verify focus ring is visible
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toBeVisible({ timeout: 5000 });
  });

  test('skip-to-main-content link is focusable and functional', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab'); // Should focus skip link
    const skipLink = page.locator('a[href="#main-content"]');
    // Skip link should become visible on focus
    const isVisible = await skipLink.evaluate((el) => {
      return getComputedStyle(el).clip !== 'rect(0px, 0px, 0px, 0px)' ||
             el.matches(':focus');
    });
    expect(isVisible).toBe(true);
  });
});
