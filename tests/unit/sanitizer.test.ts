import { describe, it, expect } from 'vitest';
import {
  sanitizeProfileForAi,
  validateAndCleanAiResponse,
} from '@/lib/gemini/sanitizer';
import { createDeterministicFallback } from '@/lib/gemini/client';

describe('Gemini Privacy Sanitizer & Output Validator', () => {
  it('anonymizes demographic profiles with zero PII or medical diagnosis leakage', () => {
    const rawProfile = {
      hasInfantsOrToddlers: true,
      hasSchoolChildren: false,
      hasSeniors: true,
      hasSensitiveMembers: true,
      commuteMode: 'car' as const,
      budgetTier: 'medium' as const,
    };

    const sanitized = sanitizeProfileForAi(
      'Delhi NCR',
      'Very Poor',
      rawProfile,
      [
        {
          id: 'wet_mopping',
          title: 'Wet Mopping',
          summary: 'Reduces dust',
          actionSteps: ['Mop twice daily'],
          evidenceFact: 'Reduces resuspension by 40%',
        },
      ],
      'hi'
    );

    expect(sanitized.cityName).toBe('Delhi NCR');
    expect(sanitized.aqiCategory).toBe('Very Poor');
    expect(sanitized.householdSummary.hasVulnerableMembers).toBe(true);
    expect(sanitized.householdSummary.hasYoungChildren).toBe(true);
    expect(sanitized.householdSummary.commuteType).toBe('car');
    expect(sanitized.requestedLanguage).toBe('hi');

    // Confirm that no names, addresses, or medical conditions are present
    const serialized = JSON.stringify(sanitized);
    expect(serialized).not.toContain('name');
    expect(serialized).not.toContain('address');
    expect(serialized).not.toContain('asthma');
    expect(serialized).not.toContain('bronchitis');
  });

  it('successfully validates conforming structured JSON response', () => {
    const validRaw = JSON.stringify({
      openingEncouragement: 'Stay safe during high pollution days with these practical steps.',
      personalizedAdvice: [
        {
          id: 'wet_mopping',
          headline: 'Keep floors damp',
          whyItMattersForYourFamily: 'Protects crawling toddlers from ground particulates.',
          practicalActionTip: 'Use warm water and microfiber cloth.',
        },
      ],
      dailySmogWindowTip: 'Ventilate only during sunny afternoons.',
      safetyDisclaimer: 'General air quality guidance, not medical diagnosis or treatment.',
    });

    const res = validateAndCleanAiResponse(validRaw);
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data.personalizedAdvice.length).toBe(1);
      expect(res.data.personalizedAdvice[0].id).toBe('wet_mopping');
    }
  });

  it('rejects AI responses that make forbidden medical claims or prescriptions', () => {
    const forbiddenMedical = JSON.stringify({
      openingEncouragement: 'Take care of your health.',
      personalizedAdvice: [
        {
          id: 'medication',
          headline: 'Medicine tip',
          whyItMattersForYourFamily: 'We diagnose this as severe condition and prescribe this medicine.',
          practicalActionTip: 'Take your dose of medication immediately.',
        },
      ],
      dailySmogWindowTip: 'Stay inside.',
      safetyDisclaimer: 'Notice.',
    });

    const res = validateAndCleanAiResponse(forbiddenMedical);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.reason).toContain('forbidden medical term');
    }
  });

  it('rejects AI responses claiming individual actions reduce city-level ambient AQI', () => {
    const forbiddenAqi = JSON.stringify({
      openingEncouragement: 'Help the city breathe.',
      personalizedAdvice: [
        {
          id: 'transit',
          headline: 'Ride the metro',
          whyItMattersForYourFamily: 'If you ride metro, local aqi will reduce by 50 points.',
          practicalActionTip: 'Take the metro daily.',
        },
      ],
      dailySmogWindowTip: 'Avoid rush hour.',
      safetyDisclaimer: 'Notice.',
    });

    const res = validateAndCleanAiResponse(forbiddenAqi);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.reason).toContain('ambient AQI reduction claim');
    }
  });

  it('creates robust deterministic fallback in both English and Hindi', () => {
    const ctx = sanitizeProfileForAi(
      'Delhi',
      'Severe',
      {
        hasInfantsOrToddlers: false,
        hasSchoolChildren: false,
        hasSeniors: false,
        hasSensitiveMembers: false,
        commuteMode: 'metro',
        budgetTier: 'low',
      },
      [
        {
          id: 'door_seal',
          title: 'Seal Drafts',
          summary: 'Block smoke entrance',
          actionSteps: ['Use damp cloth'],
          evidenceFact: 'Stops 50% smoke',
        },
      ],
      'hi'
    );

    const hiFallback = createDeterministicFallback(ctx);
    expect(hiFallback.openingEncouragement).toContain('वायु गुणवत्ता');
    expect(hiFallback.safetyDisclaimer).toContain('चिकित्सकीय सलाह नहीं');
    expect(hiFallback.personalizedAdvice[0].id).toBe('door_seal');

    ctx.requestedLanguage = 'en';
    const enFallback = createDeterministicFallback(ctx);
    expect(enFallback.openingEncouragement).toContain('air quality');
    expect(enFallback.safetyDisclaimer).toContain('not medical diagnosis');
  });
});
