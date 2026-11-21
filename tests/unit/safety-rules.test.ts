import { describe, it, expect } from 'vitest';
import {
  evaluateActivitySafety,
  getEligibleRecommendations,
  mapCategoryToAdvisorySeverity,
  mapModelCategoryToCanonicalAqiCategory,
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
  it('provides conditional N95 respirator guidance and prioritizes exposure reduction during Severe AQI as per MoHFW/NCDC', () => {
    const guidance = evaluateActivitySafety('Severe', defaultProfile);
    expect(guidance.level).toBe('HAZARDOUS_SEAL_INDOORS');
    expect(guidance.canExerciseOutdoors).toBe(false);
    expect(guidance.maskRequired).toBe(true);
    expect(guidance.maskType).toBe('N95');
    expect(guidance.headline.en).toContain('Severe Smog Emergency');
    expect(guidance.headline.hi).toContain('गंभीर धुंध आपातकाल');

    // MoHFW/NCDC (Oct 2025) conditional respirator safety checks
    expect(guidance.maskGuidance.recommended).toBe(true);
    expect(guidance.maskGuidance.condition.en).toContain('unavoidable');
    expect(guidance.maskGuidance.properFitNotice.en).toContain('leaks');
    expect(guidance.maskGuidance.medicalCaution.en).toContain('doctor');
  });

  it('permits all activities without masks during Good AQI', () => {
    const guidance = evaluateActivitySafety('Good', defaultProfile);
    expect(guidance.level).toBe('SAFE');
    expect(guidance.canExerciseOutdoors).toBe(true);
    expect(guidance.schoolPlaySafe).toBe(true);
    expect(guidance.maskRequired).toBe(false);
    expect(guidance.maskGuidance.recommended).toBe(false);
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
    expect(guidance.maskGuidance.recommended).toBe(true);
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

  it('reframes indoor plants as biophilic/wellness without false PM2.5 purification claims (Item 1)', () => {
    const recs = getEligibleRecommendations('Moderate', {
      ...defaultProfile,
      budgetTier: 'low',
    });
    const plantRec = recs.find((r) => r.id === 'air_purifying_indoor_plants');
    expect(plantRec).toBeDefined();
    expect(plantRec?.category).toBe('lifestyle');
    // Must NOT claim that plants purify smog or filter PM2.5 in homes
    expect(plantRec?.summary.en).not.toContain('purify smog');
    expect(plantRec?.summary.en.toLowerCase()).toContain('biophilic');
    expect(plantRec?.evidence.source).toContain('Cummings & Waring');
    expect(plantRec?.evidence.fact.en).toContain('negligible impact on air quality');
  });

  it('enforces complete Corsi-Rosenthal DIY box fan safety guidance (Item 3)', () => {
    const recs = getEligibleRecommendations('Severe', {
      ...defaultProfile,
      budgetTier: 'medium',
    });
    const diyRec = recs.find((r) => r.id === 'diy_box_fan_air_cleaner');
    expect(diyRec).toBeDefined();
    expect(diyRec?.summary.en).toContain('alternative');
    // Must contain 2012+ UL/ETL and thermal fuse safety
    const actionText = diyRec?.actionSteps.en.join(' ');
    expect(actionText).toContain('2012 or later');
    expect(actionText).toContain('UL');
    expect(actionText).toContain('MERV-13');
    expect(actionText).toContain('fuse');
    expect(actionText).toContain('unsupervised');
  });

  it('enforces true HEPA CADR sizing and strictly prohibits ozone generators (Item 7)', () => {
    const recs = getEligibleRecommendations('Severe', {
      ...defaultProfile,
      budgetTier: 'high',
    });
    const hepaRec = recs.find((r) => r.id === 'true_hepa_purifier_h13');
    expect(hepaRec).toBeDefined();
    const actionText = hepaRec?.actionSteps.en.join(' ');
    expect(actionText).toContain('CADR');
    expect(actionText).toContain('Never purchase ozone-generating');
    expect(hepaRec?.summary.en).toContain('HEPA does NOT remove hazardous gases');
    expect(hepaRec?.evidence.fact.en).toContain('Ozone-generating devices are explicitly warned against');
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

  describe('Source-Neutral Advisory Severity Adapter & CAMS Category Separation', () => {
    it('correctly maps official CPCB AQI categories to source-neutral advisory severity levels', () => {
      expect(mapCategoryToAdvisorySeverity('Good')).toBe('MINIMAL');
      expect(mapCategoryToAdvisorySeverity('Satisfactory')).toBe('LOW');
      expect(mapCategoryToAdvisorySeverity('Moderate')).toBe('MODERATE');
      expect(mapCategoryToAdvisorySeverity('Poor')).toBe('HIGH');
      expect(mapCategoryToAdvisorySeverity('Very Poor')).toBe('VERY_HIGH');
      expect(mapCategoryToAdvisorySeverity('Severe')).toBe('SEVERE');
    });

    it('correctly maps CAMS atmospheric model risk strings without confusing them with official CPCB categories', () => {
      expect(mapCategoryToAdvisorySeverity('Moderate Risk')).toBe('MODERATE');
      expect(mapCategoryToAdvisorySeverity('High Risk')).toBe('HIGH');
      expect(mapCategoryToAdvisorySeverity('Very High Risk')).toBe('VERY_HIGH');
      expect(mapCategoryToAdvisorySeverity('Severe Risk')).toBe('SEVERE');

      expect(mapModelCategoryToCanonicalAqiCategory('Moderate Risk')).toBe('Moderate');
      expect(mapModelCategoryToCanonicalAqiCategory('High Risk')).toBe('Poor');
      expect(mapModelCategoryToCanonicalAqiCategory('Very High Risk')).toBe('Very Poor');
      expect(mapModelCategoryToCanonicalAqiCategory('Severe Risk')).toBe('Severe');
    });

    it('correctly parses Hindi risk strings and fails closed to HIGH / Poor on unknown inputs', () => {
      expect(mapCategoryToAdvisorySeverity('गंभीर जोखिम (मॉडल अनुमान)')).toBe('SEVERE');
      expect(mapCategoryToAdvisorySeverity('खराब जोखिम (मॉडल अनुमान)')).toBe('HIGH');
      expect(mapCategoryToAdvisorySeverity('Unknown Category')).toBe('HIGH');
      expect(mapCategoryToAdvisorySeverity(null)).toBe('MODERATE');
      expect(mapModelCategoryToCanonicalAqiCategory('Unknown String')).toBe('Poor');
    });

    it('seamlessly evaluates activity safety and recommendations for CAMS model risk strings', () => {
      const guidance = evaluateActivitySafety('High Risk', defaultProfile);
      expect(guidance).toBeDefined();
      expect(guidance.level).toBe('AVOID_PROLONGED_OUTDOORS');
      expect(guidance.canExerciseOutdoors).toBe(false);

      const recs = getEligibleRecommendations('High Risk', defaultProfile);
      expect(recs.length).toBeGreaterThan(0);
    });
  });
});
