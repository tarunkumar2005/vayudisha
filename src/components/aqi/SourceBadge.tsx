'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { UI_STRINGS } from '@/lib/i18n/translations';
import { Building2, CloudRain, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SourceBadgeProps {
  dataSource: string;
  stationName: string;
  timestampFormatted: string;
  isFresh: boolean;
  ageMinutes: number;
  isModelForecast: boolean;
}

export function SourceBadge({
  dataSource,
  stationName,
  timestampFormatted,
  isFresh,
  ageMinutes,
  isModelForecast,
}: SourceBadgeProps) {
  const { language } = useApp();

  const isOfficialCpcb = dataSource === 'cpcb_official';
  const isMock = dataSource === 'mock_demonstration';

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Source Badge */}
        <div className="flex items-center space-x-2">
          {isModelForecast ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-purple-100 text-purple-800 font-semibold border border-purple-200">
              <CloudRain className="w-3.5 h-3.5" />
              <span>{UI_STRINGS.aqiLabels.camsForecast[language]}</span>
            </span>
          ) : isMock ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-semibold border border-blue-200">
              <Building2 className="w-3.5 h-3.5" />
              <span>{UI_STRINGS.aqiLabels.simulatedDemo[language]}</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
              <Building2 className="w-3.5 h-3.5" />
              <span>{UI_STRINGS.aqiLabels.officialCpcb[language]}</span>
            </span>
          )}

          {/* Freshness Badge */}
          {isFresh ? (
            <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" />
              <span>{UI_STRINGS.aqiLabels.freshReading[language]}</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <AlertTriangle className="w-3 h-3" />
              <span>{UI_STRINGS.aqiLabels.delayedReading[language]}</span>
            </span>
          )}
        </div>

        {/* Timestamp */}
        <div className="flex items-center space-x-1.5 text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {UI_STRINGS.aqiLabels.lastUpdated[language]}:{' '}
            <strong className="text-slate-700">{timestampFormatted}</strong>
          </span>
        </div>
      </div>

      {/* Station Name */}
      <div className="mt-2 text-slate-600 flex items-center space-x-1 truncate">
        <span className="font-medium text-slate-700">{UI_STRINGS.aqiLabels.station[language]}:</span>
        <span className="truncate">{stationName}</span>
      </div>

      {/* Model disclaimer if model forecast */}
      {isModelForecast && (
        <p className="mt-2 text-xs text-purple-700 bg-purple-50/60 p-2 rounded border border-purple-100">
          ⚠️ {UI_STRINGS.aqiLabels.modelDisclaimer[language]}
        </p>
      )}
    </div>
  );
}
