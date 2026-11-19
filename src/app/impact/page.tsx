'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  calculateModalShiftImpact,
  getThermalInversionGuidance,
  INDIAN_TRANSPORT_EMISSION_FACTORS,
  type ModalShiftCalculationResult,
  type InversionWindowGuidance,
} from '@/lib/impact/emission-factors';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Car,
  TreeDeciduous,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function ImpactPage() {
  const { language, aqiData } = useApp();
  const isHindi = language === 'hi';

  const [currentMode, setCurrentMode] = useState<string>('car_petrol');
  const [altMode, setAltMode] = useState<string>('metro_rail');
  const [distanceKm, setDistanceKm] = useState<number>(14);
  const [tripsPerWeek, setTripsPerWeek] = useState<number>(10);

  const [calcResult, setCalcResult] = useState<ModalShiftCalculationResult | null>(null);
  const [inversionGuidance, setInversionGuidance] = useState<InversionWindowGuidance | null>(null);

  useEffect(() => {
    const res = calculateModalShiftImpact({
      currentMode: currentMode as keyof typeof INDIAN_TRANSPORT_EMISSION_FACTORS,
      alternativeMode: altMode as keyof typeof INDIAN_TRANSPORT_EMISSION_FACTORS,
      oneWayDistanceKm: distanceKm,
      tripsPerWeek,
    });
    setCalcResult(res);
    setInversionGuidance(getThermalInversionGuidance(aqiData?.current?.aqi));
  }, [currentMode, altMode, distanceKm, tripsPerWeek, aqiData?.current?.aqi]);

  const chartData = calcResult
    ? [
        {
          name: isHindi ? 'वर्तमान साधन' : 'Current Mode',
          'Weekly CO2e (kg)': calcResult.currentWeeklyCo2eKg,
          fill: '#EF4444',
        },
        {
          name: isHindi ? 'स्वच्छ विकल्प' : 'Alternative Mode',
          'Weekly CO2e (kg)': calcResult.alternativeWeeklyCo2eKg,
          fill: '#10B981',
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {isHindi ? 'परिवहन और कार्बन प्रभाव कैलकुलेटर' : 'Sustainable Travel & Carbon Calculator'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isHindi
            ? 'भारतीय परिवहन मानकों के आधार पर अपने सफर के कार्बन प्रभाव और बचत की गणना करें।'
            : 'Evaluate verified greenhouse gas reductions and smog exposure shift for your daily commute.'}
        </p>
      </div>

      {/* Mandatory Impact Rule Callout */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3 text-xs sm:text-sm text-blue-900">
        <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <span className="font-bold block">
            {isHindi ? 'वैज्ञानिक प्रभाव पारदर्शिता नियम' : 'Impact Transparency Principles'}
          </span>
          <p className="mt-0.5 text-blue-800 leading-relaxed">
            {isHindi
              ? 'स्वच्छ परिवहन से आपका व्यक्तिगत कार्बन पदचिह्न (CO2e) कम होता है। व्यक्तिगत विकल्पों से शहर का समग्र AQI तुरंत नहीं बदलता, इसलिए हमने उत्सर्जन बचत और स्वास्थ्य जोखिम को अलग रखा है।'
              : 'Switching to sustainable transit directly lowers personal transport CO2e emissions. Individual actions do not claim to reduce citywide ambient AQI readings. Exposure timing reduces smog inhalation based on thermal inversion physics.'}
          </p>
        </div>
      </div>

      {/* Interactive Modal Shift Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input Controls */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Car className="w-4 h-4 text-emerald-600" />
            <span>{isHindi ? 'दैनिक सफर का विवरण' : 'Commute Parameters'}</span>
          </h2>

          {/* Current Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              {isHindi ? 'वर्तमान साधन' : 'Current Travel Mode'}
            </label>
            <select
              value={currentMode}
              onChange={(e) => setCurrentMode(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
            >
              {Object.values(INDIAN_TRANSPORT_EMISSION_FACTORS).map((mode) => (
                <option key={mode.mode} value={mode.mode}>
                  {isHindi ? mode.label.hi : mode.label.en} ({mode.gCo2ePerPassengerKm} g/km)
                </option>
              ))}
            </select>
          </div>

          {/* Alternative Mode */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">
              {isHindi ? 'स्वच्छ या साझा विकल्प' : 'Sustainable Alternative'}
            </label>
            <select
              value={altMode}
              onChange={(e) => setAltMode(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
            >
              {Object.values(INDIAN_TRANSPORT_EMISSION_FACTORS).map((mode) => (
                <option key={mode.mode} value={mode.mode}>
                  {isHindi ? mode.label.hi : mode.label.en} ({mode.gCo2ePerPassengerKm} g/km)
                </option>
              ))}
            </select>
          </div>

          {/* One-Way Distance Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-700">
              <span className="font-semibold">{isHindi ? 'एकतरफा दूरी' : 'One-Way Distance'}</span>
              <span className="font-bold text-emerald-600">{distanceKm} km</span>
            </div>
            <input
              type="range"
              min={1}
              max={60}
              step={1}
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Trips per week */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-700">
              <span className="font-semibold">{isHindi ? 'सप्ताह में फेरे' : 'Trips Per Week'}</span>
              <span className="font-bold text-emerald-600">{tripsPerWeek} trips</span>
            </div>
            <input
              type="range"
              min={2}
              max={20}
              step={1}
              value={tripsPerWeek}
              onChange={(e) => setTripsPerWeek(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              {isHindi ? '5 दिन आने-जाने का सफर = 10 फेरे' : 'Standard 5-day round-trip = 10 trips'}
            </span>
          </div>
        </div>

        {/* Right: Results & Recharts Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between space-y-5">
          {calcResult && (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl">
                  <span className="text-xs text-emerald-700 font-semibold block">
                    {isHindi ? 'मासिक CO₂e बचत' : 'Monthly CO₂e Saved'}
                  </span>
                  <span className="text-2xl font-black text-emerald-950 mt-1 block">
                    {calcResult.monthlySavedCo2eKg} <span className="text-xs font-normal">kg</span>
                  </span>
                  <span className="text-[11px] text-emerald-600">
                    {calcResult.weeklySavedCo2eKg} kg / week
                  </span>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-3.5 rounded-xl">
                  <span className="text-xs text-blue-700 font-semibold block">
                    {isHindi ? 'वार्षिक CO₂e बचत' : 'Annual CO₂e Saved'}
                  </span>
                  <span className="text-2xl font-black text-blue-950 mt-1 block">
                    {calcResult.annualSavedCo2eKg} <span className="text-xs font-normal">kg</span>
                  </span>
                  <span className="text-[11px] text-blue-600">
                    ~{Math.round(calcResult.annualSavedCo2eKg / 1000)} metric ton
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-teal-50 border border-teal-100 p-3.5 rounded-xl flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                    <TreeDeciduous className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-teal-700 font-semibold block">
                      {isHindi ? 'वार्षिक वृक्ष समतुल्य' : 'Trees Equivalent'}
                    </span>
                    <span className="text-lg font-black text-teal-950">
                      ~{calcResult.treesEquivalentAnnual} <span className="text-xs font-normal">trees</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bar Comparison Chart */}
              <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} unit=" kg" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="Weekly CO2e (kg)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Source & Citation Note */}
              <p className="text-[11px] text-slate-400">
                🔬 {calcResult.currentFactor.source} & {calcResult.alternativeFactor.source}. {calcResult.disclaimer.en}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Atmospheric Inversion & Smog Timing Guidance */}
      {inversionGuidance && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Clock className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">
              {isHindi ? 'वायुमंडलीय इनवर्जन और सुरक्षित समय' : 'Thermal Inversion & Exposure Avoidance'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-50/70 rounded-xl border border-red-100">
              <span className="text-xs font-bold text-red-900 uppercase tracking-wide block">
                ⛔ {isHindi ? 'सर्वाधिक जोखिम वाला समय' : 'Peak Smog Inversion Window'}
              </span>
              <span className="text-sm font-black text-red-950 mt-1 block">
                {inversionGuidance.worstHours.timeRange}
              </span>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                {isHindi ? inversionGuidance.worstHours.reason.hi : inversionGuidance.worstHours.reason.en}
              </p>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide block">
                ✅ {isHindi ? 'अनुकूल समय (धूप निकलने के बाद)' : 'Preferred Errand Window'}
              </span>
              <span className="text-sm font-black text-emerald-950 mt-1 block">
                {inversionGuidance.preferredHours.timeRange}
              </span>
              <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                {isHindi ? inversionGuidance.preferredHours.reason.hi : inversionGuidance.preferredHours.reason.en}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            ℹ️ {isHindi ? inversionGuidance.disclaimer.hi : inversionGuidance.disclaimer.en}
          </p>
        </div>
      )}

      {/* Published Emission Factors Table with Citations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          {isHindi ? 'प्रमाणित भारतीय परिवहन उत्सर्जन कारक (Baseline Factors)' : 'Published Indian Transport Emission Factors'}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left text-slate-700 divide-y divide-slate-200">
            <thead>
              <tr className="bg-slate-50 font-bold text-slate-900">
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3">Emission Factor (g CO₂e / passenger-km)</th>
                <th className="py-2.5 px-3">Official Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.values(INDIAN_TRANSPORT_EMISSION_FACTORS).map((mode) => (
                <tr key={mode.mode} className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {isHindi ? mode.label.hi : mode.label.en}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                    {mode.gCo2ePerPassengerKm} g
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    <a
                      href={mode.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-emerald-600 hover:underline"
                    >
                      <span>{mode.source}</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
