'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { UI_STRINGS } from '@/lib/i18n/translations';
import { type ActivityGuidance } from '@/lib/rules/safety-rules';
import { Dumbbell, Baby, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ActivitySafetyCardProps {
  guidance: ActivityGuidance | null;
}

export function ActivitySafetyCard({ guidance }: ActivitySafetyCardProps) {
  const { language } = useApp();
  const isHindi = language === 'hi';

  if (!guidance) return null;

  let bannerBg = 'bg-[#174B36] text-[#F6F4EB]';
  if (guidance.level === 'HAZARDOUS_SEAL_INDOORS') {
    bannerBg = 'bg-[#7F1D1D] text-red-50 border-red-900';
  } else if (guidance.level === 'STAY_INDOORS_ESSENTIAL_ONLY') {
    bannerBg = 'bg-[#B91C1C] text-white border-red-700';
  } else if (guidance.level === 'AVOID_PROLONGED_OUTDOORS') {
    bannerBg = 'bg-[#D97706] text-white border-amber-700';
  }

  const isMaskRecommended = guidance.maskGuidance?.recommended ?? guidance.maskRequired;

  return (
    <div className="bg-white rounded-3xl border border-[#E2DDD1] overflow-hidden shadow-soft">
      {/* Top Alert Banner */}
      <div className={`p-5 sm:p-6 border-b ${bannerBg}`}>
        <div className="flex items-start space-x-3.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-white/90" />
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider block opacity-90">
              {isHindi ? 'MoHFW / NCDC परामर्श स्तर' : 'Official Health Directive'}
            </span>
            <h3 className="font-black text-base sm:text-lg leading-snug mt-0.5">
              {isHindi ? guidance.headline.hi : guidance.headline.en}
            </h3>
            <p className="text-xs sm:text-sm mt-1.5 leading-relaxed opacity-95 font-medium">
              {isHindi ? guidance.details.hi : guidance.details.en}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 3 Actionable Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E2DDD1]/60 p-5 sm:p-6">
        {/* 1. Outdoor Workout */}
        <div className="py-2.5 sm:py-0 sm:px-4 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F6F4EB] border border-[#E2DDD1] flex items-center justify-center shrink-0">
            <Dumbbell className="w-5 h-5 text-[#174B36]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#2D4A3E] block">
              {UI_STRINGS.safety.outdoorActivity[language]}
            </span>
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-lg inline-block mt-1 ${
                guidance.canExerciseOutdoors
                  ? 'bg-[#065F46]/10 text-[#065F46] border border-[#065F46]/30'
                  : 'bg-red-50 text-[#991B1B] border border-red-200'
              }`}
            >
              {guidance.canExerciseOutdoors
                ? UI_STRINGS.safety.safe[language]
                : UI_STRINGS.safety.avoid[language]}
            </span>
          </div>
        </div>

        {/* 2. Children Play */}
        <div className="py-2.5 sm:py-0 sm:px-4 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F6F4EB] border border-[#E2DDD1] flex items-center justify-center shrink-0">
            <Baby className="w-5 h-5 text-[#174B36]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#2D4A3E] block">
              {UI_STRINGS.safety.schoolPlay[language]}
            </span>
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-lg inline-block mt-1 ${
                guidance.schoolPlaySafe
                  ? 'bg-[#065F46]/10 text-[#065F46] border border-[#065F46]/30'
                  : 'bg-red-50 text-[#991B1B] border border-red-200'
              }`}
            >
              {guidance.schoolPlaySafe
                ? UI_STRINGS.safety.safe[language]
                : UI_STRINGS.safety.avoid[language]}
            </span>
          </div>
        </div>

        {/* 3. Conditional Respirator Guidance */}
        <div className="py-2.5 sm:py-0 sm:px-4 flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#F6F4EB] border border-[#E2DDD1] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[#0F766E]" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#2D4A3E] block">
              {UI_STRINGS.safety.maskRequirement[language]}
            </span>
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-lg inline-block mt-1 ${
                isMaskRecommended
                  ? 'bg-amber-50 text-[#92400E] border border-amber-200'
                  : 'bg-[#065F46]/10 text-[#065F46] border border-[#065F46]/30'
              }`}
            >
              {isMaskRecommended
                ? isHindi
                  ? 'सशर्त — लंबे समय तक बाहर रहने पर टाइट सील के साथ अनुशंसित'
                  : 'Conditional — Recommended during prolonged unavoidable outdoor exposure with proper seal'
                : UI_STRINGS.safety.notNeeded[language]}
            </span>
          </div>
        </div>
      </div>

      {/* Exposure Reduction Disclaimer Callout */}
      <div className="bg-[#F6F4EB] border-t border-[#E2DDD1] px-5 py-3.5 flex items-center space-x-2 text-xs text-[#174B36] font-semibold">
        <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
        <span>{UI_STRINGS.safety.exposureReductionPrimary[language]}</span>
      </div>
    </div>
  );
}
export default ActivitySafetyCard;
