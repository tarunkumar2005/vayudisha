'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { SUPPORTED_CITIES } from '@/lib/constants/cities';
import { AqiGauge } from '@/components/aqi/AqiGauge';
import { SourceBadge } from '@/components/aqi/SourceBadge';
import { ForecastChart } from '@/components/aqi/ForecastChart';
import { PollutantBreakdown } from '@/components/aqi/PollutantBreakdown';
import { VayuMascot, type MascotPose } from '@/components/brand/VayuMascot';
import {
  ShieldAlert,
  Car,
  Users,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  MapPin,
  Radio,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';

interface DashboardMascotState {
  pose: MascotPose;
  message: string;
}

function getDashboardMascotState(
  current: { aqi: number | null; category: string; dataSource: string } | undefined,
  isHindi: boolean
): DashboardMascotState {
  const isDataAvailable = Boolean(
    current &&
    current.dataSource !== 'unavailable' &&
    current.category !== 'Data Unavailable' &&
    current.category !== 'Unavailable'
  );

  if (!isDataAvailable || !current) {
    return {
      pose: 'thinking',
      message: isHindi
        ? 'डेटा लोड हो रहा है या अस्थायी रूप से अनुपलब्ध है। कृपया प्रतीक्षा करें।'
        : 'Telemetry is updating or temporarily unavailable. Please standby.',
    };
  }

  const currentAqi =
    current.aqi ??
    (current.category?.includes('Severe')
      ? 350
      : current.category?.includes('Very High')
        ? 250
        : current.category?.includes('High')
          ? 150
          : current.category?.includes('Moderate')
            ? 110
            : 40);

  if (currentAqi > 300) {
    return {
      pose: 'alert',
      message: isHindi
        ? 'सावधान! गंभीर वायु प्रदूषण है। केवल आपात स्थिति में बाहर निकलें और अच्छी तरह फिटेड N95 मास्क पहनें।'
        : 'Severe smog detected. Thermal inversion is trapping toxic particulates. Avoid outdoor cardio and use N95 respirators.',
    };
  }
  if (currentAqi > 200) {
    return {
      pose: 'alert',
      message: isHindi
        ? 'वायु गुणवत्ता बहुत खराब है। बच्चों और बुजुर्गों को इनडोर रखें।'
        : 'Very poor air quality. Keep infants and elders indoors. Run indoor air filtration.',
    };
  }
  if (currentAqi > 100) {
    return {
      pose: 'thinking',
      message: isHindi
        ? 'मध्यम प्रदूषण है। दोपहर में धूप निकलने पर ही संवातन करें।'
        : 'Moderate particulate levels. Limit prolonged morning outdoor exposure.',
    };
  }
  if (currentAqi <= 50) {
    return {
      pose: 'celebrating',
      message: isHindi
        ? 'हवा साफ और ताज़ी है! बाहरी गतिविधियों और ताज़ी हवा का पूरा आनंद लें।'
        : 'Clean, fresh air! Outdoor sports and natural ventilation are safe and refreshing.',
    };
  }
  return {
    pose: 'greeting',
    message: isHindi
      ? 'वायु गुणवत्ता ठीक है। आप बाहर सामान्य गतिविधियाँ कर सकते हैं।'
      : 'Air quality is within manageable limits. Outdoor activity is suitable.',
  };
}

export default function DashboardPage() {
  const {
    language,
    selectedCity,
    setSelectedCity,
    selectedStation,
    setSelectedStation,
    aqiData,
    isLoadingAqi,
    refreshAqi,
  } = useApp();

  const isHindi = language === 'hi';
  const current = aqiData?.current;
  const { pose: mascotPose, message: mascotMessage } = getDashboardMascotState(current, isHindi);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Top Header & Workstation Bar */}
      <div className="bg-white border-2 border-[#174B36]/10 rounded-3xl p-6 sm:p-8 shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174B36]/5 text-xs font-bold text-[#174B36]">
              <Radio className="w-3.5 h-3.5 text-[#047857] animate-pulse" />
              <span>
                {isHindi
                  ? 'लाइव सीपीसीबी और कॉपरनिकस टेलीमेट्री'
                  : 'Live Ground & Atmospheric Telemetry'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#174B36] tracking-tight">
              <span>{isHindi ? aqiData?.city.name.hi : aqiData?.city.name.en}</span>{' '}
              <span className="text-[#0F766E] font-medium">
                {isHindi ? 'वायु गुणवत्ता डैशबोर्ड' : 'Air Quality Dashboard'}
              </span>
            </h1>
            <p className="text-sm text-[#2D4A3E] font-medium max-w-2xl">
              {isHindi
                ? 'आधिकारिक CAAQMS ग्राउंड स्टेशन डेटा, प्रदूषक उप-सूचकांक और 24-घंटे का वायुमंडलीय पूर्वानुमान।'
                : 'Official CPCB CAAQMS ground station readings, pollutant sub-indices, and 24-hour boundary-layer dispersion forecast.'}
            </p>
          </div>

          {/* Controls: City & Station Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            {/* City Selector */}
            <div className="flex flex-col">
              <label
                htmlFor="city-select-dashboard"
                className="text-xs font-bold text-[#174B36] mb-1 flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>{isHindi ? 'शहर चुनें' : 'Select City'}</span>
              </label>
              <select
                id="city-select-dashboard"
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedStation(null);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-[#F6F4EB] border border-[#E2DDD1] text-sm font-bold text-[#174B36] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              >
                {SUPPORTED_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {isHindi ? c.name.hi : c.name.en} ({c.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Station Selector (if multiple stations available) */}
            {aqiData && aqiData.stations && aqiData.stations.length > 1 && (
              <div className="flex flex-col">
                <label
                  htmlFor="station-select-dashboard"
                  className="text-xs font-bold text-[#174B36] mb-1 flex items-center gap-1"
                >
                  <Radio className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{isHindi ? 'स्टेशन चुनें' : 'Select Station'}</span>
                </label>
                <select
                  id="station-select-dashboard"
                  value={selectedStation || current?.stationName || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedStation(val);
                    void refreshAqi(val);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-[#F6F4EB] border border-[#E2DDD1] text-xs font-bold text-[#174B36] focus:outline-none focus:ring-2 focus:ring-[#0F766E] max-w-[220px] truncate"
                >
                  {aqiData.stations.map((st) => (
                    <option key={st.station} value={st.station}>
                      {st.station.split(',')[0]} (AQI {st.aqi ?? 'N/A'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Refresh Button */}
            <div className="flex flex-col justify-end">
              <span className="text-xs opacity-0 mb-1 select-none">Action</span>
              <button
                onClick={() => refreshAqi()}
                disabled={isLoadingAqi}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#174B36] text-[#F6F4EB] text-xs font-bold shadow-soft hover:bg-[#0E291D] active:scale-95 transition disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAqi ? 'animate-spin' : ''}`} />
                <span>{isHindi ? 'रिफ्रेश' : 'Refresh'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Telemetry Section */}
      <section aria-labelledby="telemetry-heading">
        <h2 id="telemetry-heading" className="sr-only">
          {isHindi ? 'वर्तमान वायु गुणवत्ता और विस्तृत पूर्वानुमान' : 'Current Air Quality & Detailed Forecast'}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Gauge & Source Verification */}
        <div className="lg:col-span-5 space-y-6">
          <AqiGauge
            aqi={current?.aqi ?? null}
            category={current?.category ?? 'Moderate'}
            categoryHindi={current?.categoryHindi ?? 'मध्यम'}
            color={current?.color ?? '#FFFF00'}
            prominentPollutant={current?.prominentPollutant ?? 'PM2.5'}
            isModelForecast={current?.isModelForecast ?? false}
          />

          {/* Telemetry Status Notice */}
          {aqiData?.status.notice && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-xs text-amber-900">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <strong className="font-bold block">
                  {isHindi ? 'टेलीमेट्री स्थिति सूचना' : 'Telemetry Status Notice'}
                </strong>
                <p className="mt-0.5 leading-relaxed">
                  {isHindi ? aqiData.status.notice.hi : aqiData.status.notice.en}
                </p>
              </div>
            </div>
          )}

          {/* Source Attribution Badge */}
          {current && (
            <SourceBadge
              dataSource={current.dataSource}
              stationName={current.stationName}
              timestampFormatted={current.timestampFormatted}
              isFresh={current.isFresh}
              ageMinutes={current.ageMinutes}
              isModelForecast={current.isModelForecast}
              isDerivedEstimate={current.isDerivedEstimate}
              methodologyNote={current.methodologyNote}
            />
          )}

          {/* Companion Guidance Callout */}
          <div className="bg-[#EAE5D7]/50 border border-[#E2DDD1] rounded-3xl p-5">
            <VayuMascot pose={mascotPose} size="sm" speechBubble={mascotMessage} />
          </div>
        </div>

        {/* Right Column: Other Stations, Forecast & Pollutants */}
        <div className="lg:col-span-7 space-y-6">
          {/* Multi-Station Telemetry Grid if available */}
          {aqiData && aqiData.stations && aqiData.stations.length > 1 && (
            <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-[#174B36] flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#0F766E]" />
                  <span>
                    {isHindi
                      ? `${aqiData.city.name.hi} के अन्य सक्रिय स्टेशन`
                      : `Active Monitoring Stations in ${aqiData.city.name.en}`}
                  </span>
                </h2>
                <span className="text-xs text-[#2D4A3E] font-medium">
                  {aqiData.stations.length} {isHindi ? 'स्टेशन' : 'stations'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {aqiData.stations.map((st) => {
                  const isCurrent = current?.stationName === st.station;
                  return (
                    <button
                      key={st.station}
                      onClick={() => {
                        setSelectedStation(st.station);
                        void refreshAqi(st.station);
                      }}
                      className={`text-left p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-[#174B36] text-[#F6F4EB] border-[#174B36] shadow-soft'
                          : 'bg-[#F6F4EB]/60 hover:bg-[#EAE5D7] border-[#E2DDD1] text-[#174B36]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold truncate max-w-[160px]">
                          {st.station.split(',')[0]}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-black ${
                            isCurrent
                              ? 'bg-white/20 text-[#F6F4EB]'
                              : 'bg-white border border-[#E2DDD1] text-[#174B36]'
                          }`}
                        >
                          AQI {st.aqi ?? 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px] opacity-80">
                        <span>{st.category}</span>
                        <span>{st.prominentPollutant ? `Main: ${st.prominentPollutant}` : ''}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Forecast Chart */}
          <ForecastChart forecast={aqiData?.forecast ?? null} />

          {/* Pollutant Sub-Indices Breakdown */}
          <PollutantBreakdown
            subIndices={current?.subIndices}
            rawPollutants={current?.rawPollutants}
          />
        </div>
      </div>
      </section>

      {/* Action Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Link
          href="/planner"
          className="group block p-6 bg-white border border-[#E2DDD1] rounded-3xl shadow-soft hover:shadow-card hover:-translate-y-1 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E] mb-4 group-hover:scale-110 transition-transform">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-[#174B36] mb-1">
            {isHindi ? 'दैनिक सुरक्षा दिनचर्या' : 'Personal Routine Planner'}
          </h2>
          <p className="text-xs text-[#2D4A3E] leading-relaxed mb-4">
            {isHindi
              ? 'बच्चों, बुजुर्गों और संवेदनशील सदस्यों के लिए समय-आधारित दिनचर्या और इनडोर वेंटिलेशन शेड्यूल।'
              : 'AI-guided schedule factoring in inversion windows, school runs, and bedroom air filtration.'}
          </p>
          <span className="inline-flex items-center text-xs font-bold text-[#0F766E] group-hover:underline">
            <span>{isHindi ? 'दिनचर्या बनाएं' : 'Open Routine Planner'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          href="/impact"
          className="group block p-6 bg-white border border-[#E2DDD1] rounded-3xl shadow-soft hover:shadow-card hover:-translate-y-1 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#92400E]/10 flex items-center justify-center text-[#92400E] mb-4 group-hover:scale-110 transition-transform">
            <Car className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-[#174B36] mb-1">
            {isHindi ? 'सफर व कार्बन बचत' : 'Travel & Carbon Savings'}
          </h2>
          <p className="text-xs text-[#2D4A3E] leading-relaxed mb-4">
            {isHindi
              ? 'कार बनाम मेट्रो में अपनी वास्तविक CO2e बचत और कम प्रदूषण के संपर्क की गणना करें।'
              : 'Calculate personal emissions saved and pollution exposure avoided using clean public transit.'}
          </p>
          <span className="inline-flex items-center text-xs font-bold text-[#0F766E] group-hover:underline">
            <span>{isHindi ? 'गणना करें' : 'Calculate Travel Impact'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>

        <Link
          href="/community"
          className="group block p-6 bg-white border border-[#E2DDD1] rounded-3xl shadow-soft hover:shadow-card hover:-translate-y-1 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#047857]/10 flex items-center justify-center text-[#047857] mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-[#174B36] mb-1">
            {isHindi ? 'सोसायटी कार्ययोजना' : 'Community Action Charter'}
          </h2>
          <p className="text-xs text-[#2D4A3E] leading-relaxed mb-4">
            {isHindi
              ? 'अपार्टमेंट और आरडब्ल्यूए के लिए प्रिंटेबल नोटिस बोर्ड और सामूहिक प्रदूषण कटौती योजना।'
              : 'Download printable RWA advisories to reduce DG sets, curb waste burning, and coordinate carpools.'}
          </p>
          <span className="inline-flex items-center text-xs font-bold text-[#0F766E] group-hover:underline">
            <span>{isHindi ? 'चार्टर देखें' : 'View Community Charter'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </Link>
      </div>
    </div>
  );
}
