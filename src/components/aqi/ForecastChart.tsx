'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { type UnifiedAqiPayload } from '@/lib/aqi/aqi-merger';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { CloudRain } from 'lucide-react';

interface ForecastChartProps {
  forecast: UnifiedAqiPayload['forecast'];
}

export function ForecastChart({ forecast }: ForecastChartProps) {
  const { language } = useApp();
  const isHindi = language === 'hi';

  if (!forecast || !forecast.hourlyNext24h || forecast.hourlyNext24h.length === 0) {
    return null;
  }

  // Format hourly data for chart
  const chartData = forecast.hourlyNext24h.map((pt) => {
    // pt.time is "YYYY-MM-DDTHH:00"
    const hour = pt.time.split('T')[1] || pt.time;
    return {
      time: hour,
      'PM2.5': pt.pm2_5,
      PM10: pt.pm10,
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <CloudRain className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {isHindi
                ? '24-घंटे का वायुमंडलीय पूर्वानुमान (CAMS मॉडल)'
                : '24-Hour Atmospheric Forecast (CAMS Global)'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHindi
              ? 'कॉपरनिकस वायुमंडलीय सेवा (CAMS) द्वारा 45 किमी वैश्विक ग्रिड पर अनुमानित PM2.5 / PM10 सांद्रता।'
              : 'Hourly PM2.5 & PM10 concentrations predicted by Copernicus Atmospheric Monitoring Service.'}
          </p>
        </div>

        <span className="text-[11px] font-medium px-2 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200 self-start sm:self-auto">
          {forecast.source}
        </span>
      </div>

      {/* Chart */}
      <div className="w-full h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPm25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B0000" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#FF8C00" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorPm10" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="PM2.5"
              stroke="#8B0000"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPm25)"
              unit=" µg/m³"
            />
            <Area
              type="monotone"
              dataKey="PM10"
              stroke="#4F46E5"
              strokeWidth={1.5}
              fillOpacity={1}
              fill="url(#colorPm10)"
              unit=" µg/m³"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Outlook Cards */}
      {forecast.daily && forecast.daily.length > 0 && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            {isHindi ? '3-दिवसीय पूर्वानुमान सारांश' : '3-Day Atmospheric Risk Outlook'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {forecast.daily.slice(0, 3).map((d) => {
              let badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';
              if (d.estimatedRiskCategory === 'Severe') {
                badgeColor = 'bg-red-50 text-red-800 border-red-200';
              } else if (d.estimatedRiskCategory === 'Very High') {
                badgeColor = 'bg-orange-50 text-orange-800 border-orange-200';
              } else if (d.estimatedRiskCategory === 'High') {
                badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
              }

              return (
                <div key={d.date} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800">{d.date}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                      {d.estimatedRiskCategory}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1 flex justify-between">
                    <span>Avg PM2.5: <strong>{d.avgPm25}</strong></span>
                    <span>Peak: <strong>{d.maxPm25}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mandatory Disclaimer */}
      <p className="mt-3 text-[11px] text-slate-400">
        ℹ️ {forecast.disclaimer}
      </p>
    </div>
  );
}
