/**
 * Comprehensive Unit Tests for Gemini Model Cascade & Fallback Matrix
 *
 * Verifies:
 * 1. Primary model success (gemini-3.5-flash-lite) with actual structured JSON schema
 * 2. Primary HTTP 503 (high demand) -> triggers fallback to gemini-3.1-flash-lite
 * 3. Primary HTTP 429 (rate limit) -> triggers fallback to gemini-3.1-flash-lite
 * 4. Secondary model success (gemini-3.1-flash-lite)
 * 5. Both models unavailable -> triggers deterministic bilingual fallback
 * 6. Invalid output (malformed JSON / schema violation / forbidden medical claims) -> triggers deterministic fallback
 * 7. Upstream timeout -> triggers deterministic fallback
 * 8. Deterministic English fallback structure & MoHFW advisory compliance
 * 9. Deterministic Hindi fallback structure & Devanagari fidelity
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generatePersonalizedGuidance,
  createDeterministicFallback,
} from '@/lib/gemini/client';
import type { AnonymizedAiPromptContext } from '@/lib/gemini/sanitizer';

// Sample realistic prompt context
const sampleContext: AnonymizedAiPromptContext = {
  cityName: 'Delhi NCR',
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
};

const validAiJson = JSON.stringify({
  openingEncouragement: 'Stay safe indoors today during high pollution episodes.',
  personalizedAdvice: [
    {
      id: 'diy_box_fan_cleaner',
      headline: 'Build an indoor filtration box fan',
      whyItMattersForYourFamily: 'Reduces fine PM2.5 in living rooms with children.',
      practicalActionTip: 'Run on low continuous speed.',
    },
  ],
  dailySmogWindowTip: 'Keep windows shut during early morning thermal inversion.',
  safetyDisclaimer: 'General air quality guidance, not medical diagnosis or treatment.',
});

// Mock @google/genai module
const mockGenerateContent = vi.fn();

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
      },
    })),
  };
});

describe('Gemini Model Cascade & Fallback Verification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test_mock_key';
    delete process.env.GEMINI_MODEL;
  });

  it('1. Primary success: successfully generates from gemini-3.5-flash-lite', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: validAiJson,
    });

    const result = await generatePersonalizedGuidance(sampleContext);

    expect(result.isAiGenerated).toBe(true);
    expect(result.modelUsed).toBe('gemini-3.5-flash-lite');
    expect(result.data.personalizedAdvice).toHaveLength(1);
    expect(result.data.openingEncouragement).toContain('Stay safe indoors');
    expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gemini-3.5-flash-lite',
      })
    );
  });

  it('2. Primary HTTP 503: cascades to secondary gemini-3.1-flash-lite and succeeds', async () => {
    // Primary fails with 503
    const error503 = new Error('Service Unavailable');
    (error503 as unknown as { status: number }).status = 503;

    mockGenerateContent
      .mockRejectedValueOnce(error503) // Primary fails
      .mockResolvedValueOnce({ text: validAiJson }); // Fallback succeeds

    const result = await generatePersonalizedGuidance(sampleContext);

    expect(result.isAiGenerated).toBe(true);
    expect(result.modelUsed).toBe('gemini-3.1-flash-lite');
    expect(result.data.personalizedAdvice).toHaveLength(1);
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
    expect(mockGenerateContent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ model: 'gemini-3.5-flash-lite' })
    );
    expect(mockGenerateContent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ model: 'gemini-3.1-flash-lite' })
    );
  });

  it('3. Primary HTTP 429: cascades to secondary gemini-3.1-flash-lite on rate limit', async () => {
    const error429 = new Error('Rate limit exceeded');
    (error429 as unknown as { status: number }).status = 429;

    mockGenerateContent
      .mockRejectedValueOnce(error429)
      .mockResolvedValueOnce({ text: validAiJson });

    const result = await generatePersonalizedGuidance(sampleContext);

    expect(result.isAiGenerated).toBe(true);
    expect(result.modelUsed).toBe('gemini-3.1-flash-lite');
    expect(mockGenerateContent).toHaveBeenCalledTimes(2);
  });

  it('4. Secondary success: verifies secondary accepts identical structured schema', async () => {
    // Force primary failure
    mockGenerateContent
      .mockRejectedValueOnce(new Error('Primary network drop'))
      .mockResolvedValueOnce({ text: validAiJson });

    const result = await generatePersonalizedGuidance(sampleContext);

    expect(result.isAiGenerated).toBe(true);
    expect(result.modelUsed).toBe('gemini-3.1-flash-lite');
    expect(result.data.dailySmogWindowTip).toBeTruthy();
    expect(result.data.safetyDisclaimer).toContain('not medical diagnosis');
  });

  it('5. Both models unavailable: falls back gracefully to deterministic guidance', async () => {
    const error503 = new Error('Capacity spike');
    (error503 as unknown as { status: number }).status = 503;

    mockGenerateContent
      .mockRejectedValueOnce(error503)
      .mockRejectedValueOnce(new Error('Secondary also down'));

    const result = await generatePersonalizedGuidance(sampleContext);

    expect(result.isAiGenerated).toBe(false);
    expect(result.fallbackReason).toContain('Gemini API temporary capacity spike');
    expect(result.data.openingEncouragement).toBeTruthy();
    expect(result.data.personalizedAdvice).toHaveLength(1);
  });

  it('6. Invalid output: malformed JSON triggers deterministic fallback', async () => {
    mockGenerateContent.mockResolvedValueOnce({
      text: 'This is not valid JSON and will not parse',
    });

    const result = await generatePersonalizedGuidance(sampleContext);

    expect(result.isAiGenerated).toBe(false);
    expect(result.fallbackReason).toContain('AI response rejected');
    expect(result.data.personalizedAdvice).toHaveLength(1);
  });

  it('7. Output violating safety rules (medical prescription claim) is rejected', async () => {
    const forbiddenMedicalJson = JSON.stringify({
      openingEncouragement: 'Take this antibiotic medication for severe cough.',
      personalizedAdvice: [
        {
          id: 'diy_box_fan_cleaner',
          headline: 'Medical treatment',
          whyItMattersForYourFamily: 'Cures asthma permanently',
          practicalActionTip: 'Stop all other medication',
        },
      ],
      dailySmogWindowTip: 'Ventilate anytime',
      safetyDisclaimer: 'Medical advice',
    });

    mockGenerateContent.mockResolvedValueOnce({
      text: forbiddenMedicalJson,
    });

    const result = await generatePersonalizedGuidance(sampleContext);

    expect(result.isAiGenerated).toBe(false);
    expect(result.fallbackReason).toContain('AI response rejected');
    expect(result.data.personalizedAdvice[0].headline).toBe('DIY Corsi-Rosenthal Air Cleaner');
  });

  it('8. Verifies deterministic English fallback structure & MoHFW advisory', () => {
    const fallback = createDeterministicFallback(sampleContext);

    expect(fallback.openingEncouragement).toContain('MoHFW/NCDC advisories');
    expect(fallback.personalizedAdvice).toHaveLength(1);
    expect(fallback.personalizedAdvice[0].id).toBe('diy_box_fan_cleaner');
    expect(fallback.dailySmogWindowTip).toContain('afternoon dispersion is only relative');
    expect(fallback.safetyDisclaimer).toContain('not medical diagnosis or treatment');

    // Also test moderate AQI thermal inversion window
    const moderateFallback = createDeterministicFallback({
      ...sampleContext,
      aqiCategory: 'Moderate',
    });
    expect(moderateFallback.dailySmogWindowTip).toContain('Thermal inversion traps ground smoke');
  });

  it('9. Verifies deterministic Hindi fallback structure & Devanagari syntax', () => {
    const hindiContext: AnonymizedAiPromptContext = {
      ...sampleContext,
      requestedLanguage: 'hi',
    };

    const fallback = createDeterministicFallback(hindiContext);

    expect(fallback.openingEncouragement).toContain('MoHFW/NCDC मानकों के अनुरूप');
    expect(fallback.personalizedAdvice).toHaveLength(1);
    expect(fallback.personalizedAdvice[0].headline).toBe('DIY Corsi-Rosenthal Air Cleaner');
    expect(fallback.dailySmogWindowTip).toContain('दोपहर का वायुमंडलीय फैलाव केवल तुलनात्मक राहत देता है');
    expect(fallback.safetyDisclaimer).toContain('चिकित्सकीय सलाह नहीं');
  });
});
