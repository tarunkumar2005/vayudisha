'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { UI_STRINGS } from '@/lib/i18n/translations';
import { AqiGauge } from '@/components/aqi/AqiGauge';
import { SourceBadge } from '@/components/aqi/SourceBadge';
import { ForecastChart } from '@/components/aqi/ForecastChart';
import { PollutantBreakdown } from '@/components/aqi/PollutantBreakdown';
import {
  ShieldAlert,
  Car,
  Users,
  ArrowRight,
  RefreshCw,
  Building2,
  AlertCircle,
} from 'lucide-react';

export default function DashboardPage() {
  const { language, aqiData, isLoadingAqi, refreshAqi } = useApp();
  const isHindi = language === 'hi';

  if (isLoadingAqi && !aqiData) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] space-y-4"
        role="status"
        aria-live="polite"
        aria-label={isHindi ? 'वायु गुणवत्ता डेटा लोड हो रहा है' : 'Loading air quality data'}
      >
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        <p className="text-sm font-medium text-slate-600">
          {isHindi ? 'वायु गुणवत्ता डेटा प्राप्त किया जा रहा है...' : 'Fetching verified air quality telemetry...'}
        </p>
      </div>
    );
  }

  const current = aqiData?.current;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isHindi ? aqiData?.city.name.hi : aqiData?.city.name.en}{' '}
            <span className="text-slate-600 font-normal">
              {isHindi ? 'वायु गुणवत्ता डैशबोर्ड' : 'Air Quality Overview'}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? 'आधिकारिक सीपीसीबी स्टेशन रीडिंग और कॉपरनिकस CAMS वायुमंडलीय पूर्वानुमान।'
              : 'Official CPCB station monitoring & Copernicus CAMS atmospheric forecast.'}
          </p>
        </div>

        <button
          onClick={() => refreshAqi()}
          disabled={isLoadingAqi}
          className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-sm self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAqi ? 'animate-spin' : ''}`} />
          <span>{isHindi ? 'रिफ्रेश करें' : 'Refresh Telemetry'}</span>
        </button>
      </div>

      {/* Fallback Notice if official data is unavailable */}
      {aqiData?.status.notice && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-xs sm:text-sm text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold block">
              {isHindi ? 'डेटा उपलब्धता सूचना' : 'Telemetry Status Notice'}
            </span>
            <p className="mt-0.5 text-amber-800">
              {isHindi ? aqiData.status.notice.hi : aqiData.status.notice.en}
            </p>
          </div>
        </div>
      )}

      {/* Main AQI Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Gauge */}
        <div className="lg:col-span-1">
          <AqiGauge
            aqi={current?.aqi ?? null}
            category={current?.category ?? 'Moderate'}
            categoryHindi={current?.categoryHindi ?? 'मध्यम'}
            color={current?.color ?? '#FFFF00'}
            prominentPollutant={current?.prominentPollutant ?? 'PM2.5'}
            isModelForecast={current?.isModelForecast ?? false}
          />
        </div>

        {/* Right: Source Metadata & Quick Callout */}
        <div className="lg:col-span-2 flex flex-col justify-between space-y-4">
          <SourceBadge
            dataSource={current?.dataSource ?? 'cpcb_official'}
            stationName={current?.stationName ?? 'CPCB Station'}
            timestampFormatted={current?.timestampFormatted ?? 'Just now'}
            isFresh={current?.isFresh ?? true}
            ageMinutes={current?.ageMinutes ?? 0}
            isModelForecast={current?.isModelForecast ?? false}
          />

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link
              href="/planner"
              className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  {UI_STRINGS.nav.planner[language]}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {isHindi
                    ? 'दैनिक दिनचर्या और बजट के अनुसार इनडोर समाधान।'
                    : 'Personalized routines & indoor air improvements by budget.'}
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 mt-3 inline-flex items-center space-x-1">
                <span>{isHindi ? 'योजना देखें' : 'View Plan'}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </span>
            </Link>

            <Link
              href="/impact"
              className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition">
                  <Car className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  {UI_STRINGS.nav.impact[language]}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {isHindi
                    ? 'मेट्रो व साझा सफर से कार्बन बचत की गणना।'
                    : 'Calculate verified transport CO2e savings and exposure shift.'}
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-600 mt-3 inline-flex items-center space-x-1">
                <span>{isHindi ? 'गणना करें' : 'Calculate'}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </span>
            </Link>

            <Link
              href="/community"
              className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-2 group-hover:bg-purple-600 group-hover:text-white transition">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  {UI_STRINGS.nav.community[language]}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {isHindi
                    ? 'सोसायटी व आरडब्ल्यूए के लिए 1-पेज कार्ययोजना।'
                    : 'Printable 1-page clean-air action plan for your RWA.'}
                </p>
              </div>
              <span className="text-xs font-semibold text-purple-600 mt-3 inline-flex items-center space-x-1">
                <span>{isHindi ? 'प्रिंट करें' : 'Print Plan'}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* 24-Hour Forecast Chart */}
      {aqiData?.forecast && <ForecastChart forecast={aqiData.forecast} />}

      {/* Pollutant Sub-Indices Breakdown */}
      <PollutantBreakdown
        subIndices={current?.subIndices}
        rawPollutants={current?.rawPollutants}
      />

      {/* Multiple Station Readings in City (if available) */}
      {aqiData?.stations && aqiData.stations.length > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <Building2 className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {isHindi ? 'शहर के अन्य CPCB मॉनिटरिंग स्टेशन' : 'Other Monitoring Stations in City'}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {aqiData.stations.map((st) => (
              <div
                key={st.station}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
              >
                <div className="truncate mr-2">
                  <span className="text-xs font-semibold text-slate-800 block truncate">
                    {st.station}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {st.category} • {st.prominentPollutant}
                  </span>
                </div>
                <span className="text-lg font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  {st.aqi}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
