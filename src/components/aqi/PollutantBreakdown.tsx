'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { type SubIndexResult } from '@/lib/aqi/aqi-calculator';
import { getPollutantMeta } from '@/lib/aqi/aqi-breakpoints';

interface PollutantBreakdownProps {
  subIndices?: SubIndexResult[];
  rawPollutants?: Record<string, number>;
}

export function PollutantBreakdown({ subIndices, rawPollutants }: PollutantBreakdownProps) {
  const { language } = useApp();

  const isHindi = language === 'hi';

  if (!subIndices || subIndices.length === 0) {
    if (!rawPollutants || Object.keys(rawPollutants).length === 0) {
      return null;
    }

    // Display raw pollutant concentrations from model forecast
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          {isHindi ? 'वायुमंडलीय प्रदूषक सांद्रता (मॉडल ग्रिड)' : 'Atmospheric Pollutant Concentrations (Model)'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(rawPollutants).map(([pollutant, val]) => {
            const meta = getPollutantMeta(pollutant);
            return (
              <div key={pollutant} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 block">
                  {meta ? (isHindi ? meta.name.hi : meta.name.en) : pollutant}
                </span>
                <span className="text-lg font-bold text-slate-900 mt-1 block">
                  {val} <span className="text-xs font-normal text-slate-500">{meta?.unit ?? 'µg/m³'}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {isHindi ? 'सीपीसीबी उप-सूचकांक विश्लेषण (Sub-Indices)' : 'CPCB Pollutant Sub-Indices'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHindi
              ? 'अधिकतम उप-सूचकांक समग्र वायु गुणवत्ता (AQI) निर्धारित करता है।'
              : 'The highest individual sub-index determines the overall official AQI.'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {subIndices.map((item) => {
          const meta = getPollutantMeta(item.pollutantId);
          const percent = Math.min(Math.round((item.subIndex / 500) * 100), 100);

          let barColor = 'bg-emerald-500';
          if (item.subIndex > 400) barColor = 'bg-red-900';
          else if (item.subIndex > 300) barColor = 'bg-red-600';
          else if (item.subIndex > 200) barColor = 'bg-orange-500';
          else if (item.subIndex > 100) barColor = 'bg-amber-400';
          else if (item.subIndex > 50) barColor = 'bg-lime-500';

          return (
            <div key={item.pollutantId} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-800">
                  {meta ? (isHindi ? meta.name.hi : meta.name.en) : item.pollutantId}
                  <span className="ml-2 font-normal text-slate-500">
                    ({item.concentration} {item.unit})
                  </span>
                </span>
                <span className="font-semibold text-slate-700">
                  {item.isSufficientHours === false ? (
                    <span className="text-amber-600 font-normal mr-1 text-[11px]">
                      ({item.hoursMonitored}h &lt; {item.averagingPeriod === '24-hour' ? '16h' : '6h'}: Incomplete)
                    </span>
                  ) : null}
                  Sub-Index: <strong className="text-slate-900">{item.subIndex}</strong> ({item.category})
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
