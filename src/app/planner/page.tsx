'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ActivitySafetyCard } from '@/components/routine/ActivitySafetyCard';
import { type ActivityGuidance, type BudgetTier, type DemographicProfile } from '@/lib/rules/safety-rules';
import { type AiPersonalizedResponse } from '@/lib/gemini/sanitizer';
import {
  Users,
  Sparkles,
  ExternalLink,
  Clock,
  CheckCircle,
  HelpCircle,
  Sliders,
  DollarSign,
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
  const [selectedBudgetTab, setSelectedBudgetTab] = useState<'all' | BudgetTier>('all');
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);

  // Fetch recommendations whenever profile, city, or language changes
  const fetchRecommendations = async () => {
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
        setRecommendations(data.eligibleRecommendations);
      }
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [selectedCity, language, profile]);

  const filteredRecs = recommendations.filter((r) => {
    if (selectedBudgetTab === 'all') return true;
    return r.budgetTier === selectedBudgetTab;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isHindi ? 'पारिवारिक दिनचर्या और इनडोर सुरक्षा' : 'Family Routine & Indoor Air Planner'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isHindi
            ? 'आपके परिवार की स्थिति, बजट और वर्तमान AQI के अनुसार प्रमाणित सुझाव।'
            : 'Evidence-based routines & indoor air quality improvements tailored to your home and budget.'}
        </p>
      </div>

      {/* Household Profile Configuration Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900">
            {isHindi ? 'परिवार व जीवनशैली अनुकूलन' : 'Household Setup & Lifestyle Profile'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Member Checks */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 block">
              {isHindi ? 'परिवार के सदस्य' : 'Household Members'}
            </span>
            <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasInfantsOrToddlers}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, hasInfantsOrToddlers: e.target.checked }))
                }
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>{isHindi ? 'छोटे बच्चे (<5 वर्ष)' : 'Infants / Toddlers (<5)'}</span>
            </label>
            <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasSchoolChildren}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, hasSchoolChildren: e.target.checked }))
                }
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>{isHindi ? 'स्कूली बच्चे (5-14 वर्ष)' : 'School Children (5-14)'}</span>
            </label>
            <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasSeniors}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, hasSeniors: e.target.checked }))
                }
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>{isHindi ? 'बुजुर्ग (60+ वर्ष)' : 'Seniors (60+)'}</span>
            </label>
          </div>

          {/* Vulnerability Check */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 block">
              {isHindi ? 'संवेदनशील स्वास्थ्य' : 'Respiratory Sensitivity'}
            </span>
            <label className="flex items-start space-x-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.hasSensitiveMembers}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, hasSensitiveMembers: e.target.checked }))
                }
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>
                {isHindi
                  ? 'अस्थमा या सांस की संवेदनशीलता'
                  : 'Asthma or respiratory sensitivity present'}
              </span>
            </label>
            <p className="text-[11px] text-slate-600">
              {isHindi
                ? 'निजी स्वास्थ्य जानकारी पूरी तरह सुरक्षित रखी जाती है।'
                : 'Zero clinical details or medical records leave your device.'}
            </p>
          </div>

          {/* Commute Mode */}
          <div className="space-y-2">
            <label htmlFor="commute-mode-select" className="text-xs font-bold text-slate-600 block">
              {isHindi ? 'मुख्य आवागमन साधन' : 'Primary Commute Mode'}
            </label>
            <select
              id="commute-mode-select"
              aria-label={isHindi ? 'मुख्य आवागमन साधन' : 'Primary Commute Mode'}
              value={profile.commuteMode}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  commuteMode: e.target.value as DemographicProfile['commuteMode'],
                }))
              }
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
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
          <div className="space-y-2">
            <label htmlFor="budget-tier-select" className="text-xs font-bold text-slate-600 block">
              {isHindi ? 'इनडोर सुधार बजट' : 'Indoor Air Budget'}
            </label>
            <select
              id="budget-tier-select"
              aria-label={isHindi ? 'इनडोर सुधार बजट' : 'Indoor Air Budget'}
              value={profile.budgetTier}
              onChange={(e) =>
                setProfile((prev) => ({
                  ...prev,
                  budgetTier: e.target.value as BudgetTier,
                }))
              }
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
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
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-300">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isAiGenerated ? 'Gemini 3.8 Flash Personalization' : 'Verified Clinical Advisory'}
              </span>
            </div>
            <span className="text-[11px] text-slate-300 bg-white/10 px-2 py-0.5 rounded">
              {aqiData?.city.name.en} • {aqiData?.current.category}
            </span>
          </div>

          <p className="text-sm sm:text-base font-medium leading-relaxed text-emerald-50">
            &ldquo;{personalization.openingEncouragement}&rdquo;
          </p>

          {/* Thermal Inversion Window Tip */}
          <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex items-start space-x-2 text-xs">
            <Clock className="w-4 h-4 text-emerald-300 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-white block">
                {isHindi ? 'वायुमंडलीय इनवर्जन और वेंटिलेशन समय' : 'Atmospheric Dispersion & Inversion Window'}
              </span>
              <p className="text-slate-200 mt-0.5">{personalization.dailySmogWindowTip}</p>
            </div>
          </div>
        </div>
      )}

      {/* Budget Tier Filter Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <h2 className="text-lg font-bold text-slate-900">
            {isHindi ? 'प्रमाणित इनडोर एवं जीवनशैली उपाय' : 'Evidence-Backed Interventions'}
          </h2>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
            {(['all', 'low', 'medium', 'high'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedBudgetTab(tab)}
                className={`px-3 py-1.5 rounded-md transition ${
                  selectedBudgetTab === tab
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecs.map((rec) => {
            const aiExplanation = personalization?.personalizedAdvice.find((a) => a.id === rec.id);

            let budgetBadgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
            if (rec.budgetTier === 'medium') {
              budgetBadgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
            } else if (rec.budgetTier === 'high') {
              budgetBadgeColor = 'bg-purple-50 text-purple-800 border-purple-200';
            }

            return (
              <div
                key={rec.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded border ${budgetBadgeColor}`}
                    >
                      {rec.budgetTier === 'low'
                        ? 'Low Budget'
                        : rec.budgetTier === 'medium'
                          ? 'Medium Budget'
                          : 'High Budget'}
                    </span>
                    <span className="text-xs text-slate-600 capitalize font-medium">{rec.category}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {aiExplanation?.headline || rec.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600">
                    {aiExplanation?.whyItMattersForYourFamily || rec.summary}
                  </p>

                  {/* Concrete Action Steps */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <span className="text-xs font-bold text-slate-700 block">
                      {isHindi ? 'व्यावहारिक कदम:' : 'Practical Action Steps:'}
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {rec.actionSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Evidence Link */}
                <div className="border-t border-slate-100 pt-3 text-xs flex items-center justify-between text-slate-500">
                  <span className="truncate max-w-[200px] sm:max-w-[280px]">
                    🔬 {rec.evidence.source}
                  </span>
                  <a
                    href={rec.evidence.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-emerald-700 hover:text-emerald-800 font-semibold"
                  >
                    <span>{isHindi ? 'शोध देखें' : 'Evidence'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
