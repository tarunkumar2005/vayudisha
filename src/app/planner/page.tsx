'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { ActivitySafetyCard } from '@/components/routine/ActivitySafetyCard';
import { VayuMascot } from '@/components/brand/VayuMascot';
import { type ActivityGuidance, type BudgetTier, type DemographicProfile } from '@/lib/rules/safety-rules';
import { type AiPersonalizedResponse } from '@/lib/gemini/sanitizer';
import {
  Users,
  Sparkles,
  ExternalLink,
  Clock,
  CheckCircle2,
  Sliders,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';

interface RecommendationItem {
  id: string;
  category: string;
  budgetTier: BudgetTier;
  title: string;
  summary: string;
  actionSteps: string[];
  evidence: {
    source: string;
    url: string;
    fact: string;
  };
}

export default function PlannerPage() {
  const { language, selectedCity, profile, setProfile, aqiData } = useApp();
  const isHindi = language === 'hi';

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activitySafety, setActivitySafety] = useState<ActivityGuidance | null>(null);
  const [personalization, setPersonalization] = useState<AiPersonalizedResponse | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [allRecommendations, setAllRecommendations] = useState<RecommendationItem[]>([]);
  const [selectedBudgetTab, setSelectedBudgetTab] = useState<'all' | BudgetTier>('all');
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);

  // Fetch recommendations whenever profile, city, or language changes
  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName: selectedCity,
          language,
          profile,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActivitySafety(data.activitySafety);
        setPersonalization(data.personalization?.data);
        setIsAiGenerated(data.personalization?.isAiGenerated ?? false);
        setRecommendations(data.eligibleRecommendations || []);
        setAllRecommendations(data.allRecommendations || data.eligibleRecommendations || []);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCity, language, profile]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const recommendationPool = allRecommendations.length > 0 ? allRecommendations : recommendations;
  const filteredRecs = recommendationPool.filter((r) => {
    if (selectedBudgetTab === 'all') return true;
    return r.budgetTier === selectedBudgetTab;
  });

  const handleBudgetTabClick = (tab: 'all' | BudgetTier) => {
    setSelectedBudgetTab(tab);
    if (tab !== 'all') {
      setProfile((prev) => ({ ...prev, budgetTier: tab }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#174B36]/10 text-[#174B36] text-xs font-black mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{isHindi ? 'सुरक्षा योजना' : 'Evidence-Based Routine'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#174B36] tracking-tight">
            {isHindi ? 'पारिवारिक दिनचर्या और इनडोर सुरक्षा' : 'Family Routine & Indoor Air Planner'}
          </h1>
          <p className="text-xs sm:text-sm text-[#2D4A3E] mt-1 font-medium">
            {isHindi
              ? 'आपके परिवार की स्थिति, बजट और वर्तमान AQI के अनुसार प्रमाणित सुझाव।'
              : 'Evidence-based routines & indoor air quality improvements tailored to your home and budget.'}
          </p>
        </div>

        <VayuMascot
          pose="explaining"
          size="sm"
          speechBubble={
            isHindi
              ? 'अपनी जरूरत के अनुसार बजट और परिवार का चयन करें।'
              : 'Select your budget and household profile for custom advice.'
          }
        />
      </div>

      {/* Household Profile Configuration Panel */}
      <div className="bg-white rounded-3xl border border-[#E2DDD1] p-6 shadow-soft space-y-5">
        <div className="flex items-center space-x-2 border-b border-[#E2DDD1]/70 pb-3">
          <Sliders className="w-4 h-4 text-[#0F766E]" />
          <h2 className="text-sm font-black text-[#174B36] uppercase tracking-wide">
            {isHindi ? 'परिवार व जीवनशैली अनुकूलन' : 'Household Setup & Lifestyle Profile'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Member Checks */}
          <div className="space-y-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-[#2D4A3E] block">
              {isHindi ? 'परिवार के सदस्य' : 'Household Members'}
            </span>
            <label className="flex items-center space-x-2.5 text-xs text-[#174B36] font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={profile.hasInfantsOrToddlers}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, hasInfantsOrToddlers: e.target.checked }))
                }
                className="rounded text-[#0F766E] focus:ring-[#0F766E]"
              />
              <span>{isHindi ? 'छोटे बच्चे (<5 वर्ष)' : 'Infants / Toddlers (<5)'}</span>
            </label>
            <label className="flex items-center space-x-2.5 text-xs text-[#174B36] font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={profile.hasSchoolChildren}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, hasSchoolChildren: e.target.checked }))
                }
                className="rounded text-[#0F766E] focus:ring-[#0F766E]"
              />
              <span>{isHindi ? 'स्कूली बच्चे (5-14 वर्ष)' : 'School Children (5-14)'}</span>
            </label>
            <label className="flex items-center space-x-2.5 text-xs text-[#174B36] font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={profile.hasSeniors}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, hasSeniors: e.target.checked }))
                }
                className="rounded text-[#0F766E] focus:ring-[#0F766E]"
              />
              <span>{isHindi ? 'बुजुर्ग (60+ वर्ष)' : 'Seniors (60+)'}</span>
            </label>
          </div>

          {/* Vulnerability Check */}
          <div className="space-y-2.5">
            <span className="text-xs font-black uppercase tracking-wider text-[#2D4A3E] block">
              {isHindi ? 'संवेदनशील स्वास्थ्य' : 'Respiratory Sensitivity'}
            </span>
            <label className="flex items-start space-x-2.5 text-xs text-[#174B36] font-semibold cursor-pointer select-none">
              <input
                type="checkbox"
                checked={profile.hasSensitiveMembers}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, hasSensitiveMembers: e.target.checked }))
                }
                className="mt-0.5 rounded text-[#0F766E] focus:ring-[#0F766E]"
              />
              <span>
                {isHindi
                  ? 'अस्थमा या सांस की संवेदनशीलता'
                  : 'Asthma or respiratory sensitivity present'}
              </span>
            </label>
            <p className="text-[11px] text-[#2D4A3E] font-medium leading-relaxed">
              {isHindi
                ? 'निजी स्वास्थ्य जानकारी पूरी तरह सुरक्षित रखी जाती है।'
                : 'Zero clinical details or medical records leave your device.'}
            </p>
          </div>

          {/* Commute Mode */}
          <div className="space-y-2.5">
            <label htmlFor="commute-mode-select" className="text-xs font-black uppercase tracking-wider text-[#2D4A3E] block">
              {isHindi ? 'मुख्य आवागमन साधन' : 'Primary Commute Mode'}
            </label>
            <select
              id="commute-mode-select"
              value={profile.commuteMode}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  commuteMode: e.target.value as DemographicProfile['commuteMode'],
                }))
              }
              className="w-full text-xs font-bold bg-[#F6F4EB] border border-[#E2DDD1] rounded-xl p-2.5 text-[#174B36] focus:ring-2 focus:ring-[#0F766E]"
            >
              <option value="car">{isHindi ? 'कार (पेट्रोल/डीजल)' : 'Personal Car'}</option>
              <option value="two_wheeler">{isHindi ? 'दोपहिया (बाइक/स्कूटर)' : 'Two-Wheeler'}</option>
              <option value="metro">{isHindi ? 'मेट्रो रेल' : 'Metro Rail'}</option>
              <option value="bus">{isHindi ? 'सिटी बस' : 'City Bus'}</option>
              <option value="auto_rickshaw">{isHindi ? 'ऑटो रिक्शा' : 'Auto Rickshaw'}</option>
              <option value="cycle_walk">{isHindi ? 'साइकिल / पैदल' : 'Bicycle / Walking'}</option>
            </select>
          </div>

          {/* Budget Tier */}
          <div className="space-y-2.5">
            <label htmlFor="budget-tier-select" className="text-xs font-black uppercase tracking-wider text-[#2D4A3E] block">
              {isHindi ? 'इनडोर सुधार बजट' : 'Indoor Air Budget'}
            </label>
            <select
              id="budget-tier-select"
              value={profile.budgetTier}
              onChange={(e) => {
                const newTier = e.target.value as BudgetTier;
                setProfile((prev) => ({
                  ...prev,
                  budgetTier: newTier,
                }));
                setSelectedBudgetTab(newTier);
              }}
              className="w-full text-xs font-bold bg-[#F6F4EB] border border-[#E2DDD1] rounded-xl p-2.5 text-[#174B36] focus:ring-2 focus:ring-[#0F766E]"
            >
              <option value="low">{isHindi ? 'कम बजट (₹0 – ₹500)' : 'Low Budget (₹0 – ₹500)'}</option>
              <option value="medium">{isHindi ? 'मध्यम बजट (₹500 – ₹5,000)' : 'Medium (₹500 – ₹5,000)'}</option>
              <option value="high">{isHindi ? 'उच्च बजट (₹5,000+)' : 'High Budget (₹5,000+)'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deterministic Activity Safety Evaluation */}
      <ActivitySafetyCard guidance={activitySafety} />

      {/* AI Personalization Banner */}
      {personalization && (
        <div className="bg-[#174B36] text-[#F6F4EB] rounded-3xl p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[#A7C5A0]">
              <Sparkles className="w-4 h-4 text-[#EBA347]" />
              <span className="text-xs font-black uppercase tracking-wider">
                {isAiGenerated
                  ? isHindi
                    ? 'जेमिनी 3.5 फ्लैश लाइट सलाह'
                    : 'Gemini 3.5 Flash Lite Advisory'
                  : isHindi
                    ? 'प्रमाणित सुरक्षा दिनचर्या'
                    : 'Deterministic Evidence-Based Guidance'}
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#F6F4EB] bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10">
              {aqiData?.city.name.en} • {aqiData?.current.category}
            </span>
          </div>

          <p className="text-base sm:text-lg font-bold leading-relaxed text-[#F6F4EB]">
            &ldquo;{personalization.openingEncouragement}&rdquo;
          </p>

          {/* Thermal Inversion Window Tip */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/15 flex items-start space-x-3 text-xs">
            <Clock className="w-4 h-4 text-[#EBA347] mt-0.5 shrink-0" />
            <div>
              <strong className="font-extrabold text-white block">
                {isHindi ? 'वायुमंडलीय इनवर्जन और वेंटिलेशन समय' : 'Atmospheric Dispersion & Inversion Window'}
              </strong>
              <p className="text-[#ECE7D8] mt-1 font-medium leading-relaxed">{personalization.dailySmogWindowTip}</p>
            </div>
          </div>
        </div>
      )}

      {/* Budget Tier Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2DDD1] pb-3">
          <h2 className="text-lg font-black text-[#174B36]">
            {isHindi ? 'प्रमाणित इनडोर एवं जीवनशैली उपाय' : 'Evidence-Backed Interventions'}
          </h2>

          <div className="flex items-center space-x-1 bg-[#EAE5D7] p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
            {(['all', 'low', 'medium', 'high'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleBudgetTabClick(tab)}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  selectedBudgetTab === tab
                    ? 'bg-white text-[#174B36] font-black shadow-sm'
                    : 'text-[#2D4A3E] hover:text-[#174B36]'
                }`}
              >
                {tab === 'all'
                  ? isHindi
                    ? 'सभी'
                    : 'All'
                  : tab === 'low'
                    ? '₹0–500'
                    : tab === 'medium'
                      ? '₹500–5K'
                      : '₹5K+'}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendation Cards Grid */}
        {filteredRecs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E2DDD1] p-8 text-center space-y-3 shadow-soft">
            <p className="text-sm font-bold text-[#174B36]">
              {isHindi
                ? 'इस बजट स्तर के लिए वर्तमान AQI पर कोई सीधा उपाय नहीं मिला।'
                : 'No specific interventions found for this budget tier at current air quality levels.'}
            </p>
            <button
              onClick={() => setSelectedBudgetTab('all')}
              className="px-4 py-2 rounded-xl bg-[#174B36] text-[#F6F4EB] text-xs font-bold shadow-soft hover:bg-[#0E291D] transition"
            >
              {isHindi ? 'सभी बजट उपाय देखें' : 'View All Budget Recommendations'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredRecs.map((rec) => {
            const aiExplanation = personalization?.personalizedAdvice.find((a) => a.id === rec.id);

            let budgetBadgeColor = 'bg-[#065F46]/10 text-[#065F46] border-[#065F46]/30';
            if (rec.budgetTier === 'medium') {
              budgetBadgeColor = 'bg-[#0F766E]/10 text-[#0F766E] border-[#0F766E]/30';
            } else if (rec.budgetTier === 'high') {
              budgetBadgeColor = 'bg-[#174B36]/10 text-[#174B36] border-[#174B36]/20';
            }

            return (
              <div
                key={rec.id}
                className="bg-white rounded-3xl border border-[#E2DDD1] p-6 shadow-soft flex flex-col justify-between space-y-4 hover:border-[#0F766E] transition-all"
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-lg border ${budgetBadgeColor}`}
                    >
                      {rec.budgetTier === 'low'
                        ? 'Low Budget'
                        : rec.budgetTier === 'medium'
                          ? 'Medium Budget'
                          : 'High Budget'}
                    </span>
                    <span className="text-xs text-[#2D4A3E] capitalize font-bold">{rec.category}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#174B36] leading-snug">
                    {aiExplanation?.headline || rec.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#2D4A3E] font-medium leading-relaxed">
                    {aiExplanation?.whyItMattersForYourFamily || rec.summary}
                  </p>

                  {/* Concrete Action Steps */}
                  <div className="bg-[#F6F4EB] p-4 rounded-2xl border border-[#E2DDD1] space-y-2">
                    <span className="text-xs font-black text-[#174B36] block">
                      {isHindi ? 'व्यावहारिक कदम:' : 'Practical Action Steps:'}
                    </span>
                    <ul className="space-y-1.5 text-xs text-[#2D4A3E] font-medium">
                      {rec.actionSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-[#0F766E] mt-0.5 shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Evidence Link */}
                <div className="border-t border-[#E2DDD1]/70 pt-3 text-xs flex items-center justify-between text-[#2D4A3E]">
                  <span className="truncate max-w-[200px] sm:max-w-[280px] font-medium">
                    🔬 {rec.evidence.source}
                  </span>
                  <a
                    href={rec.evidence.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-[#0F766E] hover:text-[#174B36] font-bold"
                  >
                    <span>{isHindi ? 'शोध देखें' : 'Evidence'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
