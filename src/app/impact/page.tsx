'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { VayuMascot } from '@/components/brand/VayuMascot';
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
  Zap,
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

  const currentAqi = aqiData?.current?.aqi;

  useEffect(() => {
    const res = calculateModalShiftImpact({
      currentMode: currentMode as keyof typeof INDIAN_TRANSPORT_EMISSION_FACTORS,
      alternativeMode: altMode as keyof typeof INDIAN_TRANSPORT_EMISSION_FACTORS,
      oneWayDistanceKm: distanceKm,
      tripsPerWeek,
    });
    setCalcResult(res);
    setInversionGuidance(getThermalInversionGuidance(currentAqi));
  }, [currentMode, altMode, distanceKm, tripsPerWeek, currentAqi]);

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
          fill: '#0F766E',
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#174B36]/10 text-[#174B36] text-xs font-black mb-2">
            <Car className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{isHindi ? 'कार्बन और गतिशीलता' : 'Sustainable Mobility'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#174B36] tracking-tight">
            {isHindi ? 'परिवहन और कार्बन प्रभाव कैलकुलेटर' : 'Sustainable Travel & Carbon Calculator'}
          </h1>
          <p className="text-xs sm:text-sm text-[#2D4A3E] mt-1 font-medium">
            {isHindi
              ? 'भारतीय परिवहन मानकों के आधार पर अपने सफर के कार्बन प्रभाव और बचत की गणना करें।'
              : 'Evaluate verified greenhouse gas reductions and smog exposure shift for your daily commute.'}
          </p>
        </div>

        <VayuMascot
          pose="celebrating"
          size="sm"
          speechBubble={
            isHindi
              ? 'मेट्रो या बस चुनने से हर महीने कई किलो CO2e की बचत होती है!'
              : 'Choosing metro transit saves significant kg CO2e every month!'
          }
        />
      </div>

      {/* Mandatory Impact Rule Callout */}
      <div className="bg-white border border-[#E2DDD1] rounded-3xl p-5 sm:p-6 flex items-start space-x-3.5 text-xs sm:text-sm text-[#174B36] shadow-soft">
        <ShieldCheck className="w-5 h-5 text-[#0F766E] mt-0.5 shrink-0" />
        <div>
          <strong className="font-extrabold text-[#174B36] block">
            {isHindi ? 'वैज्ञानिक प्रभाव पारदर्शिता नियम' : 'Impact Transparency Principles'}
          </strong>
          <p className="mt-1 text-[#2D4A3E] leading-relaxed font-medium">
            {isHindi
              ? 'स्वच्छ परिवहन से आपका व्यक्तिगत कार्बन पदचिह्न (CO2e) कम होता है। व्यक्तिगत विकल्पों से शहर का समग्र AQI तुरंत नहीं बदलता, इसलिए हमने उत्सर्जन बचत और स्वास्थ्य जोखिम को अलग रखा है।'
              : 'Switching to sustainable transit directly lowers personal transport CO2e emissions. Individual actions do not claim to reduce citywide ambient AQI readings. Exposure timing reduces smog inhalation based on thermal inversion physics.'}
          </p>
        </div>
      </div>

      {/* Interactive Modal Shift Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Input Controls */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-[#E2DDD1] p-6 shadow-soft space-y-5">
          <h2 className="text-sm font-black text-[#174B36] flex items-center space-x-2 uppercase tracking-wide">
            <Car className="w-4 h-4 text-[#0F766E]" />
            <span>{isHindi ? 'दैनिक सफर का विवरण' : 'Commute Parameters'}</span>
          </h2>

          {/* Current Mode */}
          <div className="space-y-2">
            <label htmlFor="current-mode-select" className="text-xs font-black uppercase tracking-wider text-[#2D4A3E] block">
              {isHindi ? 'वर्तमान साधन' : 'Current Travel Mode'}
            </label>
            <select
              id="current-mode-select"
              value={currentMode}
              onChange={(e) => setCurrentMode(e.target.value)}
              className="w-full text-xs font-bold bg-[#F6F4EB] border border-[#E2DDD1] rounded-xl p-2.5 text-[#174B36] focus:ring-2 focus:ring-[#0F766E]"
            >
              {Object.values(INDIAN_TRANSPORT_EMISSION_FACTORS).map((mode) => (
                <option key={mode.mode} value={mode.mode}>
                  {isHindi ? mode.label.hi : mode.label.en} ({mode.gCo2ePerPassengerKm} g/km)
                </option>
              ))}
            </select>
          </div>

          {/* Alternative Mode */}
          <div className="space-y-2">
            <label htmlFor="alt-mode-select" className="text-xs font-black uppercase tracking-wider text-[#2D4A3E] block">
              {isHindi ? 'स्वच्छ या साझा विकल्प' : 'Sustainable Alternative'}
            </label>
            <select
              id="alt-mode-select"
              value={altMode}
              onChange={(e) => setAltMode(e.target.value)}
              className="w-full text-xs font-bold bg-[#F6F4EB] border border-[#E2DDD1] rounded-xl p-2.5 text-[#174B36] focus:ring-2 focus:ring-[#0F766E]"
            >
              {Object.values(INDIAN_TRANSPORT_EMISSION_FACTORS).map((mode) => (
                <option key={mode.mode} value={mode.mode}>
                  {isHindi ? mode.label.hi : mode.label.en} ({mode.gCo2ePerPassengerKm} g/km)
                </option>
              ))}
            </select>
          </div>

          {/* One-Way Distance Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#174B36]">
              <label htmlFor="distance-slider" className="font-bold">
                {isHindi ? 'एकतरफा दूरी' : 'One-Way Distance'}
              </label>
              <span className="font-black text-[#0F766E]">{distanceKm} km</span>
            </div>
            <input
              id="distance-slider"
              type="range"
              min={1}
              max={60}
              step={1}
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full accent-[#0F766E] cursor-pointer"
            />
          </div>

          {/* Trips per week */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-[#174B36]">
              <label htmlFor="trips-slider" className="font-bold">
                {isHindi ? 'सप्ताह में फेरे' : 'Trips Per Week'}
              </label>
              <span className="font-black text-[#0F766E]">{tripsPerWeek} trips</span>
            </div>
            <input
              id="trips-slider"
              type="range"
              min={2}
              max={20}
              step={1}
              value={tripsPerWeek}
              onChange={(e) => setTripsPerWeek(Number(e.target.value))}
              className="w-full accent-[#0F766E] cursor-pointer"
            />
            <span className="text-[11px] text-[#2D4A3E] block font-medium">
              {isHindi ? '5 दिन आने-जाने का सफर = 10 फेरे' : 'Standard 5-day round-trip = 10 trips'}
            </span>
          </div>
        </div>

        {/* Right: Results & Recharts Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E2DDD1] p-6 shadow-soft flex flex-col justify-between space-y-6">
          {calcResult && (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                <div className="bg-[#F6F4EB] border border-[#E2DDD1] p-4 rounded-2xl">
                  <span className="text-xs text-[#2D4A3E] font-bold block">
                    {isHindi ? 'मासिक CO₂e बचत' : 'Monthly CO₂e Saved'}
                  </span>
                  <span className="text-2xl font-black text-[#174B36] mt-1 block">
                    {calcResult.monthlySavedCo2eKg} <span className="text-xs font-normal">kg</span>
                  </span>
                  <span className="text-[11px] text-[#0F766E] font-bold">
                    {calcResult.weeklySavedCo2eKg} kg / week
                  </span>
                </div>

                <div className="bg-[#F6F4EB] border border-[#E2DDD1] p-4 rounded-2xl">
                  <span className="text-xs text-[#2D4A3E] font-bold block">
                    {isHindi ? 'वार्षिक CO₂e बचत' : 'Annual CO₂e Saved'}
                  </span>
                  <span className="text-2xl font-black text-[#174B36] mt-1 block">
                    {calcResult.annualSavedCo2eKg} <span className="text-xs font-normal">kg</span>
                  </span>
                  <span className="text-[11px] text-[#2D4A3E] font-medium">
                    ~{(calcResult.annualSavedCo2eKg / 1000).toFixed(1)} metric tons
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-[#174B36] text-[#F6F4EB] p-4 rounded-2xl flex items-center space-x-3.5 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#A7C5A0]">
                    <TreeDeciduous className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-[#A7C5A0] font-bold block">
                      {isHindi ? 'वार्षिक वृक्ष समतुल्य' : 'Trees Equivalent'}
                    </span>
                    <span className="text-xl font-black text-white">
                      ~{calcResult.treesEquivalentAnnual} <span className="text-xs font-normal">trees</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bar Comparison Chart */}
              <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ECE7D8" />
                    <XAxis dataKey="name" stroke="#2D4A3E" fontSize={11} tickLine={false} />
                    <YAxis stroke="#2D4A3E" fontSize={11} unit=" kg" tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#174B36',
                        border: '1px solid #0F766E',
                        borderRadius: '12px',
                        color: '#F6F4EB',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="Weekly CO2e (kg)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Source & Citation Note */}
              <p className="text-[11px] text-[#2D4A3E] font-medium leading-relaxed">
                🔬 {calcResult.currentFactor.source} &amp; {calcResult.alternativeFactor.source}. {calcResult.disclaimer.en}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Atmospheric Inversion & Smog Timing Guidance */}
      {inversionGuidance && (
        <div className="bg-white rounded-3xl border border-[#E2DDD1] p-6 shadow-soft space-y-5">
          <div className="flex items-center space-x-2 border-b border-[#E2DDD1]/70 pb-3">
            <Clock className="w-4 h-4 text-[#0F766E]" />
            <h2 className="text-sm font-black text-[#174B36] uppercase tracking-wide">
              {isHindi ? 'वायुमंडलीय इनवर्जन और सुरक्षित समय' : 'Thermal Inversion & Exposure Avoidance'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-red-50/80 rounded-2xl border border-red-200">
              <span className="text-xs font-black text-[#991B1B] uppercase tracking-wide block">
                ⛔ {isHindi ? 'सर्वाधिक जोखिम वाला समय' : 'Peak Smog Inversion Window'}
              </span>
              <span className="text-base font-black text-[#991B1B] mt-1 block">
                {inversionGuidance.worstHours.timeRange}
              </span>
              <p className="text-xs text-[#991B1B] mt-1.5 leading-relaxed font-medium">
                {isHindi ? inversionGuidance.worstHours.reason.hi : inversionGuidance.worstHours.reason.en}
              </p>
            </div>

            <div className="p-5 bg-[#065F46]/10 rounded-2xl border border-[#065F46]/30">
              <span className="text-xs font-black text-[#065F46] uppercase tracking-wide block">
                ✅ {isHindi ? 'अनुकूल समय (धूप निकलने के बाद)' : 'Preferred Errand Window'}
              </span>
              <span className="text-base font-black text-[#065F46] mt-1 block">
                {inversionGuidance.preferredHours.timeRange}
              </span>
              <p className="text-xs text-[#065F46] mt-1.5 leading-relaxed font-medium">
                {isHindi ? inversionGuidance.preferredHours.reason.hi : inversionGuidance.preferredHours.reason.en}
              </p>
            </div>
          </div>

          <p className="text-xs text-[#2D4A3E] font-medium leading-relaxed">
            ℹ️ {isHindi ? inversionGuidance.disclaimer.hi : inversionGuidance.disclaimer.en}
          </p>
        </div>
      )}

      {/* Published Emission Factors Table with Citations */}
      <div className="bg-white rounded-3xl border border-[#E2DDD1] p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-black text-[#174B36] uppercase tracking-wide">
          {isHindi ? 'प्रमाणित भारतीय परिवहन उत्सर्जन कारक (Baseline Factors)' : 'Published Indian Transport Emission Factors'}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left text-[#2D4A3E] divide-y divide-[#E2DDD1]">
            <thead>
              <tr className="bg-[#F6F4EB] font-black text-[#174B36]">
                <th className="py-3 px-4 rounded-l-xl">Mode</th>
                <th className="py-3 px-4">Emission Factor (g CO₂e / passenger-km)</th>
                <th className="py-3 px-4 rounded-r-xl">Official Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DDD1]/60 font-medium">
              {Object.values(INDIAN_TRANSPORT_EMISSION_FACTORS).map((mode) => (
                <tr key={mode.mode} className="hover:bg-[#F6F4EB]/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#174B36]">
                    {isHindi ? mode.label.hi : mode.label.en}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#0F766E]">
                    {mode.gCo2ePerPassengerKm} g
                  </td>
                  <td className="py-3 px-4 text-[#2D4A3E]">
                    <a
                      href={mode.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-[#174B36] hover:text-[#0F766E] font-bold"
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
