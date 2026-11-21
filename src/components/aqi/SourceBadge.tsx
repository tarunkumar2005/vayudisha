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
  isDerivedEstimate?: boolean;
  methodologyNote?: string;
}

export function SourceBadge({
  dataSource,
  stationName,
  timestampFormatted,
  isFresh,
  ageMinutes,
  isModelForecast,
  isDerivedEstimate,
  methodologyNote,
}: SourceBadgeProps) {
  const { language } = useApp();
  const isHindi = language === 'hi';

  const isOfficialCpcb = dataSource === 'cpcb_official';
  const isMock = dataSource === 'mock_demonstration';

  return (
    <div className="bg-white border border-[#E2DDD1] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Source Badge */}
        <div className="flex flex-wrap items-center gap-2">
          {isModelForecast ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-900 font-bold border border-purple-200">
              <CloudRain className="w-3.5 h-3.5 text-purple-700" />
              <span>{UI_STRINGS.aqiLabels.camsForecast[language]}</span>
            </span>
          ) : isMock ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-900 font-bold border border-blue-200">
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span>{UI_STRINGS.aqiLabels.simulatedDemo[language]}</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#174B36]/10 text-[#174B36] font-bold border border-[#174B36]/20">
              <Building2 className="w-3.5 h-3.5 text-[#159C89]" />
              <span>
                {isDerivedEstimate
                  ? (isHindi ? 'व्युत्पन्न सीपीसीबी उप-सूचकांक अनुमान' : 'Derived CPCB Sub-Index Estimate')
                  : UI_STRINGS.aqiLabels.officialCpcb[language]}
              </span>
            </span>
          )}

          {/* Freshness Badge */}
          {isFresh ? (
            <span className="inline-flex items-center space-x-1 text-[#174B36] bg-[#A7C5A0]/20 px-2.5 py-1 rounded-xl border border-[#A7C5A0]/50 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#159C89]" />
              <span>{UI_STRINGS.aqiLabels.freshReading[language]}</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{UI_STRINGS.aqiLabels.delayedReading[language]}</span>
            </span>
          )}
        </div>

        {/* Timestamp */}
        <div className="flex items-center space-x-1.5 text-[#587668]">
          <Clock className="w-3.5 h-3.5 text-[#159C89]" />
          <span>
            {UI_STRINGS.aqiLabels.lastUpdated[language]}:{' '}
            <strong className="text-[#174B36] font-bold">{timestampFormatted}</strong>
          </span>
        </div>
      </div>

      {/* Station Name */}
      <div className="mt-3 text-[#587668] flex items-center space-x-1.5 truncate">
        <span className="font-bold text-[#174B36]">{UI_STRINGS.aqiLabels.station[language]}:</span>
        <span className="truncate font-medium">{stationName}</span>
      </div>

      {/* Derived Sub-Index Estimate Regulatory Note */}
      {isDerivedEstimate && !isModelForecast && (
        <p className="mt-2.5 text-[11px] text-[#587668] bg-[#F6F4EB] p-2.5 rounded-xl border border-[#E2DDD1] leading-relaxed">
          ℹ️ {isHindi
            ? 'उपलब्ध प्रति घंटा डेटा से आधिकारिक सीपीसीबी 2014 सूत्रों द्वारा परिकलित। 16/6 घंटे की विनियामक पूर्णता सार्वजनिक फीड से सीधे सत्यापित नहीं की जा सकती।'
            : 'Calculated using official CPCB piecewise linear breakpoints from available hourly telemetry. Regulatory 16h/6h monitoring completeness window cannot be independently verified from public hourly API feeds.'}
        </p>
      )}

      {/* Model disclaimer if model forecast */}
      {isModelForecast && (
        <p className="mt-3 text-xs text-purple-900 bg-purple-50/70 p-2.5 rounded-xl border border-purple-200">
          ⚠️ {UI_STRINGS.aqiLabels.modelDisclaimer[language]}
        </p>
      )}
    </div>
  );
}
export default SourceBadge;
