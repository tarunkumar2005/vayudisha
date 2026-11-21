/**
 * Live Gemini Developer API integration test.
 * Runs against the actual authenticated Google Gemini endpoint if GEMINI_API_KEY is configured.
 */
import { describe, it, expect } from 'vitest';
import { generatePersonalizedGuidance } from '@/lib/gemini/client';
import fs from 'fs';

let apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/GEMINI_API_KEY=([^\s]+)/);
  if (match) apiKey = match[1];
}

const isLiveKeyAvailable = Boolean(apiKey && apiKey.startsWith('AQ.'));
const shouldRunLive = isLiveKeyAvailable && (process.env.LIVE_INTEGRATION === 'true' || process.env.CI_LIVE === 'true');

describe('Live Gemini Developer API Integration', () => {
  it.runIf(shouldRunLive)(
    'successfully generates personalized AI advice using the user API key',
    async () => {
      process.env.GEMINI_API_KEY = apiKey;

      const result = await generatePersonalizedGuidance({
        cityName: 'Delhi',
        aqiCategory: 'Severe',
        requestedLanguage: 'en',
        householdSummary: {
          hasYoungChildren: true,
          hasSeniors: false,
          hasVulnerableMembers: true,
          commuteType: 'transit_shared',
          budgetTier: 'medium',
        },
        approvedRecommendations: [
          {
            id: 'diy_box_fan_cleaner',
            title: 'DIY Corsi-Rosenthal Air Cleaner',
            summary: 'Build a low-cost high-CADR indoor particulate filtration unit.',
            actionSteps: [
              'Use a 2012-or-later UL/ETL box fan and MERV-13 filter',
              'Seal all edges with duct tape',
            ],
            evidenceFact: 'Provides CADR comparable to commercial purifiers at a fraction of the cost.',
          },
        ],
      });

      console.log('Gemini Live Result:', {
        isAiGenerated: result.isAiGenerated,
        modelUsed: result.modelUsed,
        fallbackReason: result.fallbackReason,
        openingEncouragement: result.data.openingEncouragement,
        adviceCount: result.data.personalizedAdvice.length,
      });

      expect(result.data.openingEncouragement).toBeTruthy();
      expect(result.data.personalizedAdvice.length).toBeGreaterThan(0);
      expect(result.data.dailySmogWindowTip).toBeTruthy();
      expect(result.data.safetyDisclaimer).toBeTruthy();
      expect(result.isAiGenerated).toBe(true);
      expect(['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.8-flash']).toContain(result.modelUsed);
    },
    30_000
  );

  it.skipIf(shouldRunLive)('skips live network test during offline/sandbox CI (run with LIVE_INTEGRATION=true)', () => {
    expect(true).toBe(true);
  });
});
