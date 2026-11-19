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
  const displayAqi = aqi !== null ? Math.min(Math.max(aqi, 0), 500) : 150;
  const strokeDashoffset = 440 - (440 * (displayAqi / 500));

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Screen-reader summary (gauge is decorative SVG) */}
      <p className="sr-only">
        {aqi !== null
          ? `Air Quality Index: ${aqi} out of 500. Category: ${category}.`
          : `Air Quality Index not available. Risk category: ${category}.`}
        {prominentPollutant ? ` Prominent pollutant: ${prominentPollutant}.` : ''}
        {isModelForecast ? ' This is a model estimate, not an official CPCB station reading.' : ''}
      </p>
      {/* SVG Circular Meter */}
      <div className="relative w-48 h-48 flex items-center justify-center">
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
            stroke="#E2E8F0"
            strokeWidth="14"
            fill="transparent"
          />
          {/* Active Meter Fill */}
          <circle
            cx="80"
            cy="80"
            r="70"
            stroke={color}
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
          <span className="text-xs font-semibold tracking-wider text-slate-600 uppercase">
            {isModelForecast ? 'Model Est.' : 'CPCB AQI'}
          </span>
          <span className="text-5xl font-black tracking-tight text-slate-900 my-0.5">
            {aqi !== null ? aqi : '--'}
          </span>
          <span className="text-xs font-medium text-slate-600">
            {aqi !== null ? '/ 500' : 'µg/m³ Model'}
          </span>
        </div>
      </div>

      {/* Category Pill */}
      <div className="mt-4 flex flex-col items-center">
        <span
          style={{ backgroundColor: color }}
          className="px-4 py-1.5 rounded-full text-white font-bold text-sm tracking-wide shadow-sm"
        >
          {language === 'hi' ? categoryHindi || category : category}
        </span>

        {/* Prominent Pollutant */}
        {prominentPollutant && (
          <div className="mt-2 text-xs text-slate-600 flex items-center space-x-1">
            <span className="text-slate-600 font-medium">{UI_STRINGS.aqiLabels.prominentPollutant[language]}:</span>
            <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {prominentPollutant}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
