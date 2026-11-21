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
      <div className="bg-white rounded-3xl border border-[#E2DDD1] p-6 shadow-soft">
        <h3 className="text-base font-extrabold text-[#174B36] mb-3">
          {isHindi ? 'वायुमंडलीय प्रदूषक सांद्रता (मॉडल ग्रिड)' : 'Atmospheric Pollutant Concentrations (Model Grid)'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(rawPollutants).map(([pollutant, val]) => {
            const meta = getPollutantMeta(pollutant);
            return (
              <div key={pollutant} className="bg-[#F6F4EB] p-3.5 rounded-2xl border border-[#E2DDD1]">
                <span className="text-xs font-bold text-[#587668] block">
                  {meta ? (isHindi ? meta.name.hi : meta.name.en) : pollutant}
                </span>
                <span className="text-xl font-black text-[#174B36] mt-1 block">
                  {val} <span className="text-xs font-medium text-[#587668]">{meta?.unit ?? 'µg/m³'}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-[#E2DDD1] p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-extrabold text-[#174B36]">
            {isHindi ? 'सीपीसीबी उप-सूचकांक विश्लेषण (Sub-Indices)' : 'CPCB Pollutant Sub-Indices'}
          </h3>
          <p className="text-xs text-[#587668] mt-0.5 font-medium">
            {isHindi
              ? 'अधिकतम उप-सूचकांक समग्र वायु गुणवत्ता (AQI) निर्धारित करता है।'
              : 'The highest individual sub-index determines the overall official AQI.'}
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {subIndices.map((item) => {
          const meta = getPollutantMeta(item.pollutantId);
          const percent = Math.min(Math.round((item.subIndex / 500) * 100), 100);

          let barColor = 'bg-[#10B981]';
          if (item.subIndex > 400) barColor = 'bg-[#7F1D1D]';
          else if (item.subIndex > 300) barColor = 'bg-[#EF4444]';
          else if (item.subIndex > 200) barColor = 'bg-[#F97316]';
          else if (item.subIndex > 100) barColor = 'bg-[#FBBF24]';
          else if (item.subIndex > 50) barColor = 'bg-[#84CC16]';

          return (
            <div key={item.pollutantId} className="p-3.5 bg-[#F6F4EB] rounded-2xl border border-[#E2DDD1]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-extrabold text-[#174B36]">
                  {meta ? (isHindi ? meta.name.hi : meta.name.en) : item.pollutantId}
                  <span className="ml-2 font-normal text-[#587668]">
                    ({item.concentration} {item.unit})
                  </span>
                </span>
                <span className="font-bold text-[#587668]">
                  {item.isSufficientHours === false ? (
                    <span className="text-amber-700 font-semibold mr-1.5 text-[11px]">
                      ({item.hoursMonitored}h &lt; {item.averagingPeriod === '24-hour' ? '16h' : '6h'}: Incomplete)
                    </span>
                  ) : null}
                  Sub-Index: <strong className="text-[#174B36] font-black">{item.subIndex}</strong> ({item.category})
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#EAE5D7] rounded-full h-2.5 overflow-hidden">
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
export default PollutantBreakdown;
