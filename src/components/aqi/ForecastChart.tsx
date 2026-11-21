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
import { CloudRain, Sunrise, AlertCircle } from 'lucide-react';

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
    const hour = pt.time.split('T')[1] || pt.time;
    return {
      time: hour,
      'PM2.5': pt.pm2_5,
      PM10: pt.pm10,
    };
  });

  return (
    <div className="bg-white rounded-3xl border border-[#E2DDD1] p-6 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#159C89]/10 flex items-center justify-center text-[#159C89]">
              <CloudRain className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-[#174B36]">
              {isHindi
                ? '24-घंटे का वायुमंडलीय पूर्वानुमान (CAMS मॉडल)'
                : '24-Hour Atmospheric Forecast & Inversion Curve'}
            </h3>
          </div>
          <p className="text-xs text-[#587668] mt-1 font-medium">
            {isHindi
              ? 'कॉपरनिकस वायुमंडलीय सेवा (CAMS) द्वारा 45 किमी वैश्विक ग्रिड पर अनुमानित PM2.5 / PM10 सांद्रता।'
              : 'Hourly PM2.5 & PM10 concentrations predicted by Copernicus Atmospheric Monitoring Service.'}
          </p>
        </div>

        <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-[#174B36]/10 text-[#174B36] border border-[#174B36]/20 self-start sm:self-auto">
          {forecast.source}
        </span>
      </div>

      {/* Atmospheric Inversion Callout Banner */}
      <div className="mb-4 bg-[#F6F4EB] border border-[#E2DDD1] rounded-2xl p-3.5 flex items-start space-x-2.5 text-xs text-[#174B36]">
        <Sunrise className="w-4 h-4 text-[#EBA347] shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">
            {isHindi ? 'शीतकालीन तापीय व्युत्क्रमण (Winter Inversion Alert):' : 'Winter Thermal Inversion Pattern:'}
          </strong>{' '}
          <span className="text-[#587668]">
            {isHindi
              ? 'सर्दियों की सुबह 5 से 9 बजे के बीच सतह पर प्रदूषक फंस जाते हैं। बाहरी कसरत और स्कूली खेलों को दोपहर बाद (12 से 4 बजे) स्थानांतरित करें जब धूप से हवा फैलती है।'
              : 'Between 5:00 AM – 9:00 AM, cold ground air traps surface particulates. Shift vigorous exertion to afternoon hours (12:00 PM – 4:00 PM) when thermal mixing opens atmospheric ventilation.'}
          </span>
        </div>
      </div>

      {/* Chart Container with Screen Reader Table */}
      <div
        className="w-full h-64 mt-2"
        role="region"
        aria-label={isHindi ? '24 घंटे का वायुमंडलीय पूर्वानुमान चार्ट' : '24-hour atmospheric forecast trend chart'}
      >
        <div className="sr-only">
          <table>
            <caption>{isHindi ? '24 घंटे का प्रति घंटा पूर्वानुमान डेटा' : '24-Hour Hourly Forecast Data'}</caption>
            <thead>
              <tr>
                <th scope="col">{isHindi ? 'समय' : 'Time'}</th>
                <th scope="col">PM2.5 (µg/m³)</th>
                <th scope="col">PM10 (µg/m³)</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((d, i) => (
                <tr key={i}>
                  <td>{d.time}</td>
                  <td>{d['PM2.5']}</td>
                  <td>{d.PM10}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPm25" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#159C89" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#159C89" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorPm10" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EBA347" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#EBA347" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ECE7D8" />
            <XAxis dataKey="time" stroke="#587668" fontSize={11} tickLine={false} />
            <YAxis stroke="#587668" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#174B36',
                border: '1px solid #159C89',
                borderRadius: '12px',
                color: '#F6F4EB',
                fontSize: '12px',
                boxShadow: '0 8px 24px rgba(23, 75, 54, 0.2)',
              }}
            />
            <Area
              type="monotone"
              dataKey="PM2.5"
              stroke="#159C89"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorPm25)"
              unit=" µg/m³"
            />
            <Area
              type="monotone"
              dataKey="PM10"
              stroke="#EBA347"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPm10)"
              unit=" µg/m³"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-end space-x-6 mt-3 text-xs font-bold">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#159C89]" />
          <span className="text-[#174B36]">PM2.5 (Fine particulate)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#EBA347]" />
          <span className="text-[#174B36]">PM10 (Coarse particulate)</span>
        </div>
      </div>
    </div>
  );
}
export default ForecastChart;
