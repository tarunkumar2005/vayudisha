import { describe, it, expect } from 'vitest';
import {
  evaluateActivitySafety,
  getEligibleRecommendations,
  type DemographicProfile,
} from '@/lib/rules/safety-rules';

const defaultProfile: DemographicProfile = {
  hasInfantsOrToddlers: false,
  hasSchoolChildren: false,
  hasSeniors: false,
  hasSensitiveMembers: false,
  commuteMode: 'car',
  budgetTier: 'medium',
};

describe('Deterministic Safety Rule Engine', () => {
  it('mandates N95 mask and indoor shelter during Severe AQI regardless of health status', () => {
    const guidance = evaluateActivitySafety('Severe', defaultProfile);
    expect(guidance.level).toBe('HAZARDOUS_SEAL_INDOORS');
    expect(guidance.canExerciseOutdoors).toBe(false);
    expect(guidance.maskRequired).toBe(true);
    expect(guidance.maskType).toBe('N95');
    expect(guidance.headline.en).toContain('Emergency Smog');
    expect(guidance.headline.hi).toContain('आपातकालीन धुंध');
  });

  it('permits all activities without masks during Good AQI', () => {
    const guidance = evaluateActivitySafety('Good', defaultProfile);
    expect(guidance.level).toBe('SAFE');
    expect(guidance.canExerciseOutdoors).toBe(true);
    expect(guidance.schoolPlaySafe).toBe(true);
    expect(guidance.maskRequired).toBe(false);
  });

  it('restricts outdoor activities for households with sensitive/elderly members during Moderate AQI', () => {
    const sensitiveProfile: DemographicProfile = {
      ...defaultProfile,
      hasSensitiveMembers: true,
      hasSeniors: true,
    };

    const guidance = evaluateActivitySafety('Moderate', sensitiveProfile);
    expect(guidance.level).toBe('SENSITIVE_GROUPS_STAY_INDOORS');
    expect(guidance.canExerciseOutdoors).toBe(false);
    expect(guidance.maskRequired).toBe(true);
  });

  it('strictly filters recommendations by user budget tier', () => {
    const lowBudgetProfile: DemographicProfile = {
      ...defaultProfile,
      budgetTier: 'low',
    };
    const recsLow = getEligibleRecommendations('Very Poor', lowBudgetProfile);
    expect(recsLow.length).toBeGreaterThan(0);
    expect(recsLow.every((r) => r.budgetTier === 'low')).toBe(true);

    const highBudgetProfile: DemographicProfile = {
      ...defaultProfile,
      budgetTier: 'high',
    };
    const recsHigh = getEligibleRecommendations('Very Poor', highBudgetProfile);
    expect(recsHigh.some((r) => r.budgetTier === 'high')).toBe(true);
    expect(recsHigh.some((r) => r.budgetTier === 'low')).toBe(true);
  });

  it('ensures all recommendations have valid evidence citations and bilingual texts', () => {
    const recs = getEligibleRecommendations('Severe', {
      ...defaultProfile,
      budgetTier: 'high',
    });
    for (const rec of recs) {
      expect(rec.title.en).toBeTruthy();
      expect(rec.title.hi).toBeTruthy();
      expect(rec.summary.en).toBeTruthy();
      expect(rec.summary.hi).toBeTruthy();
      expect(rec.actionSteps.en.length).toBeGreaterThan(0);
      expect(rec.actionSteps.hi.length).toBeGreaterThan(0);
      expect(rec.evidence.source).toBeTruthy();
      expect(rec.evidence.url).toMatch(/^https?:\/\//);
      expect(rec.evidence.fact.en).toBeTruthy();
      expect(rec.evidence.fact.hi).toBeTruthy();
    }
  });
});
