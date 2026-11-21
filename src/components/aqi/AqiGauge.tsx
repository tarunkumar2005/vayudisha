'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { UI_STRINGS } from '@/lib/i18n/translations';

interface AqiGaugeProps {
  aqi: number | null;
  category: string;
  categoryHindi: string;
  color: string;
  prominentPollutant: string | null;
  isModelForecast: boolean;
}

export function AqiGauge({
  aqi,
  category,
  categoryHindi,
  color,
  prominentPollutant,
  isModelForecast,
}: AqiGaugeProps) {
  const { language } = useApp();

  // Normalize AQI between 0 and 500 for the SVG arc
  // When aqi is null, do NOT simulate a numeric Indian AQI on the arc (H-09, M-22)
  const hasAqi = aqi !== null;
  const displayAqi = hasAqi ? Math.min(Math.max(aqi, 0), 500) : 0;
  const strokeDashoffset = hasAqi ? 440 - 440 * (displayAqi / 500) : 440;

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-7 bg-white rounded-3xl border border-[#E2DDD1] shadow-soft transition-all">
      {/* Screen-reader summary */}
      <p className="sr-only">
        {hasAqi
          ? `Air Quality Index: ${aqi} out of 500. Category: ${category}.`
          : `Air Quality Index not available. Risk category: ${category}.`}
        {prominentPollutant ? ` Prominent pollutant: ${prominentPollutant}.` : ''}
        {isModelForecast ? ' This is a model estimate, not an official CPCB station reading.' : ''}
      </p>

      {/* SVG Circular Meter */}
      <div className="relative w-52 h-52 flex items-center justify-center">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 160 160"
          aria-hidden="true"
        >
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke="#EAE5D7"
            strokeWidth="14"
            fill="transparent"
          />
          {/* Active Meter Fill (only active when official numeric AQI exists) */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke={hasAqi ? color : '#CBD5E1'}
            strokeWidth="14"
            fill="transparent"
            strokeDasharray={440}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all motion-reduce:transition-none duration-1000 ease-out"
          />
        </svg>

        {/* Inner Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-bold tracking-wider text-[#587668] uppercase">
            {isModelForecast
              ? language === 'hi'
                ? 'मॉडल पूर्वानुमान'
                : 'Model Forecast'
              : hasAqi
                ? 'CPCB AQI'
                : language === 'hi'
                  ? 'स्थिति'
                  : 'Status'}
          </span>
          <span className="text-5xl font-black tracking-tight text-[#174B36] my-0.5">
            {hasAqi ? aqi : '--'}
          </span>
          <span className="text-xs font-semibold text-[#587668]">
            {hasAqi
              ? '/ 500'
              : isModelForecast
                ? language === 'hi'
                  ? 'मॉडल जोखिम'
                  : 'Model Risk'
                : language === 'hi'
                  ? 'अनुपलब्ध'
                  : 'Unavailable'}
          </span>
        </div>
      </div>

      {/* Category Pill */}
      <div className="mt-4 flex flex-col items-center">
        <span
          style={{ backgroundColor: color }}
          className="px-5 py-1.5 rounded-full text-white font-extrabold text-sm tracking-wide shadow-sm"
        >
          {language === 'hi' ? categoryHindi || category : category}
        </span>

        {/* Prominent Pollutant */}
        {prominentPollutant && (
          <div className="mt-3 text-xs text-[#587668] flex items-center space-x-1.5 font-medium">
            <span>{UI_STRINGS.aqiLabels.prominentPollutant[language]}:</span>
            <span className="font-bold text-[#174B36] bg-[#F6F4EB] px-2.5 py-0.5 rounded-md border border-[#E2DDD1]">
              {prominentPollutant}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
export default AqiGauge;
