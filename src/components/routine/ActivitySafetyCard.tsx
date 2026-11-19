'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { UI_STRINGS } from '@/lib/i18n/translations';
import { type ActivityGuidance } from '@/lib/rules/safety-rules';
import { Dumbbell, Baby, ShieldCheck, AlertCircle, Info } from 'lucide-react';

interface ActivitySafetyCardProps {
  guidance: ActivityGuidance | null;
}

export function ActivitySafetyCard({ guidance }: ActivitySafetyCardProps) {
  const { language } = useApp();
  const isHindi = language === 'hi';

  if (!guidance) return null;

  let bannerBg = 'bg-slate-900 text-white';
  if (guidance.level === 'HAZARDOUS_SEAL_INDOORS') {
    bannerBg = 'bg-red-950 text-red-50 border-red-800';
  } else if (guidance.level === 'STAY_INDOORS_ESSENTIAL_ONLY') {
    bannerBg = 'bg-red-900 text-red-50 border-red-700';
  } else if (guidance.level === 'AVOID_PROLONGED_OUTDOORS') {
    bannerBg = 'bg-amber-900 text-amber-50 border-amber-700';
  }

  const isMaskRecommended = guidance.maskGuidance?.recommended ?? guidance.maskRequired;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Top Alert Banner */}
      <div className={`p-4 sm:p-5 border-b ${bannerBg}`}>
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-bold text-sm sm:text-base leading-snug">
              {isHindi ? guidance.headline.hi : guidance.headline.en}
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed">
              {isHindi ? guidance.details.hi : guidance.details.en}
            </p>
          </div>
        </div>
      </div>

      {/* Grid of 3 Actionable Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 p-4 sm:p-5">
        {/* 1. Outdoor Workout */}
        <div className="py-2 sm:py-0 sm:px-3 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <Dumbbell className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">
              {UI_STRINGS.safety.outdoorActivity[language]}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded inline-block mt-0.5 ${
                guidance.canExerciseOutdoors
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {guidance.canExerciseOutdoors
                ? UI_STRINGS.safety.safe[language]
                : UI_STRINGS.safety.avoid[language]}
            </span>
          </div>
        </div>

        {/* 2. Children Play */}
        <div className="py-2 sm:py-0 sm:px-3 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <Baby className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">
              {UI_STRINGS.safety.schoolPlay[language]}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded inline-block mt-0.5 ${
                guidance.schoolPlaySafe
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {guidance.schoolPlaySafe
                ? UI_STRINGS.safety.safe[language]
                : UI_STRINGS.safety.avoid[language]}
            </span>
          </div>
        </div>

        {/* 3. Conditional Respirator Guidance (MoHFW Oct 2025 Advisory) */}
        <div className="py-2 sm:py-0 sm:px-3 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <span className="text-xs text-slate-500 block">
              {UI_STRINGS.safety.maskRequirement[language]}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded inline-block mt-0.5 ${
                isMaskRecommended
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {isMaskRecommended
                ? UI_STRINGS.safety.required[language]
                : UI_STRINGS.safety.notNeeded[language]}
            </span>
          </div>
        </div>
      </div>

      {/* Conditional Respirator Fit & Medical Advisory Footer */}
      {isMaskRecommended && guidance.maskGuidance && (
        <div className="bg-amber-50/70 border-t border-amber-100 p-3.5 sm:px-5 text-xs text-amber-900 space-y-1">
          <div className="flex items-start space-x-1.5">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">
                {isHindi ? guidance.maskGuidance.condition.hi : guidance.maskGuidance.condition.en}
              </span>
              <p className="text-[11px] text-amber-800 mt-0.5">
                • {isHindi ? guidance.maskGuidance.properFitNotice.hi : guidance.maskGuidance.properFitNotice.en}
              </p>
              <p className="text-[11px] text-amber-800">
                • {isHindi ? guidance.maskGuidance.medicalCaution.hi : guidance.maskGuidance.medicalCaution.en}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
