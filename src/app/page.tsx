'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { VayuMascot } from '@/components/brand/VayuMascot';
import {
  ShieldAlert,
  Car,
  Users,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { SmoggyTuesdayTimeline } from '@/components/home/SmoggyTuesdayTimeline';
import { HabitsBentoGrid } from '@/components/home/HabitsBentoGrid';
import { IndoorAirCadrWidget } from '@/components/home/IndoorAirCadrWidget';
import { FaqAccordion } from '@/components/home/FaqAccordion';

export default function HomePage() {
  const { language, aqiData } = useApp();
  const isHindi = language === 'hi';
  const current = aqiData?.current;

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* ============================================================== */}
      {/* 1. HERO SECTION: ATMOSPHERIC STORYTELLING & COMPANION */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden pt-4 pb-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Core Brand Narrative */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E2DDD1] shadow-soft">
              <span className="w-2.5 h-2.5 rounded-full bg-[#047857] animate-ping" />
              <span className="text-xs font-extrabold text-[#174B36] uppercase tracking-wider">
                {isHindi ? 'वायुदिशा • बुद्धिमान पर्यावरण साथी' : 'VayuDisha • Intelligent Air Companion'}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-black text-[#174B36] tracking-tight leading-[1.1]">
                {isHindi ? (
                  <>
                    हवा की समझ, <br />
                    <span className="text-[#0F766E]">बेहतर कल।</span>
                  </>
                ) : (
                  <>
                    Know your air. <br />
                    <span className="text-[#0F766E]">Choose a better direction.</span>
                  </>
                )}
              </h1>
              <p className="text-lg sm:text-xl text-[#2D4A3E] font-medium max-w-xl leading-relaxed pt-2">
                {isHindi
                  ? 'भारतीय परिवारों और आरडब्ल्यूए के लिए सीपीसीबी प्रमाणित वायु गुणवत्ता, स्वास्थ्य मंत्रालय की सुरक्षा सलाह, किफायती इनडोर समाधान और टिकाऊ यात्रा सहायक।'
                  : 'An intelligent air-quality and sustainability companion helping Indian families understand local air conditions, reduce pollution exposure, and choose low-carbon transit.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#174B36] text-[#F6F4EB] font-bold text-sm shadow-card hover:bg-[#0E291D] hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                <span>{isHindi ? 'लाइव वायु गुणवत्ता देखें' : 'Explore Live Air Quality'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/planner"
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-white border border-[#E2DDD1] text-[#174B36] font-bold text-sm shadow-soft hover:bg-[#EAE5D7] active:scale-95 transition-all"
              >
                <ShieldAlert className="w-4 h-4 text-[#0F766E]" />
                <span>{isHindi ? 'पारिवारिक सुरक्षा दिनचर्या' : 'Build Family Routine'}</span>
              </Link>

              <Link
                href="/impact"
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-white border border-[#E2DDD1] text-[#174B36] font-bold text-sm shadow-soft hover:bg-[#EAE5D7] active:scale-95 transition-all"
              >
                <Car className="w-4 h-4 text-[#92400E]" />
                <span>{isHindi ? 'सफर व कार्बन बचत' : 'Travel Impact'}</span>
              </Link>
            </div>

            {/* Mascot Hero Welcome Speech */}
            <div className="pt-2">
              <VayuMascot
                pose="greeting"
                size="md"
                speechBubble={
                  isHindi
                    ? 'नमस्ते! मैं वायु हूँ। मैं प्रमाणित सीपीसीबी स्टेशन डेटा ट्रैक करता हूँ और आपको साफ हवा में जीने की सही दिशा दिखाता हूँ।'
                    : 'Hello! I am Vayu. I track verified CPCB station telemetry and guide you toward cleaner indoor air and safer transit.'
                }
              />
            </div>
          </div>

          {/* Right Column: Floating Live Telemetry Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative group bg-white border-2 border-[#174B36]/10 rounded-3xl p-6 sm:p-7 shadow-card hover:border-[#0F766E]/30 transition-all">
              {/* Floating Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2DDD1]">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      current?.isModelForecast ? 'bg-[#0F766E]' : 'bg-[#047857]'
                    } animate-pulse`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#174B36]">
                    {current?.isModelForecast
                      ? isHindi
                        ? 'वायुमंडलीय मॉडल'
                        : 'Atmospheric Model'
                      : isHindi
                        ? 'लाइव ग्राउंड स्टेशन'
                        : 'Live Ground Station'}
                  </span>
                </div>
                <span className="text-xs font-black text-[#0F766E] bg-[#0F766E]/10 px-2.5 py-1 rounded-full">
                  {isHindi ? aqiData?.city.name.hi : aqiData?.city.name.en}
                </span>
              </div>

              {/* AQI Display */}
              <div className="py-6 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#2D4A3E] uppercase tracking-wider">
                    {isHindi ? 'राष्ट्रीय वायु गुणवत्ता सूचकांक' : 'Indian National AQI'}
                  </div>
                  <div className="text-5xl sm:text-6xl font-black text-[#174B36] tracking-tight mt-1">
                    {current?.aqi ?? '--'}
                  </div>
                  <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-black bg-[#EAE5D7] text-[#174B36]">
                    <span>{isHindi ? current?.categoryHindi : current?.category}</span>
                    {current?.prominentPollutant && (
                      <span className="text-[11px] font-bold text-[#174B36]">
                        • {current.prominentPollutant}
                      </span>
                    )}
                  </div>
                </div>

                {/* Companion Micro Art */}
                <div className="w-24 h-24 flex items-center justify-center bg-[#F6F4EB] rounded-2xl border border-[#E2DDD1]">
                  <VayuMascot pose="thinking" size="sm" />
                </div>
              </div>

              {/* Station Info */}
              <div className="bg-[#F6F4EB] rounded-2xl p-3.5 text-xs text-[#2D4A3E] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#174B36]">{isHindi ? 'स्टेशन:' : 'Station:'}</span>
                  <span className="truncate max-w-[200px] font-semibold text-right">
                    {current?.stationName ?? 'CPCB CAAQMS Station'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>{isHindi ? 'डेटा स्रोत:' : 'Source:'}</span>
                  <span className="font-semibold text-[#0F766E]">{current?.dataSourceLabel}</span>
                </div>
              </div>

              {/* CTA Link to Full Dashboard */}
              <div className="pt-4">
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#174B36] text-[#F6F4EB] text-xs font-bold hover:bg-[#0E291D] transition-colors"
                >
                  <span>{isHindi ? 'पूर्ण विश्लेषण डैशबोर्ड खोलें' : 'View Full Telemetry Dashboard'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. "A SMOGGY TUESDAY" — DAILY SCROLL JOURNEY & ATMOSPHERIC INVERSION */}
      {/* ============================================================== */}
      <SmoggyTuesdayTimeline isHindi={isHindi} />

      {/* ============================================================== */}
      {/* 3. "SMALL HABITS, CLEANER AIR" — INTERACTIVE BENTO GRID */}
      {/* ============================================================== */}
      <HabitsBentoGrid isHindi={isHindi} />

      {/* ============================================================== */}
      {/* 4. "TRY IT" — 3 STEPS TO CLEAN INDOOR AIR (INTERACTIVE CALCULATOR) */}
      {/* ============================================================== */}
      <IndoorAirCadrWidget isHindi={isHindi} />

      {/* ============================================================== */}
      {/* 5. "YOUR FAMILY, YOUR ENVIRONMENT" — DEMOGRAPHIC TAILORING */}
      {/* ============================================================== */}
      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174B36]/5 text-xs font-bold text-[#174B36]">
            <Users className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{isHindi ? 'परिवार की देखभाल' : 'Vulnerable Demographics'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#174B36] tracking-tight">
            {isHindi ? 'आपका परिवार, आपका परिवेश' : 'Your Family, Your Environment'}
          </h2>
          <p className="text-sm sm:text-base text-[#2D4A3E] font-medium leading-relaxed">
            {isHindi
              ? 'प्रदूषण का प्रभाव हर व्यक्ति पर एक जैसा नहीं होता। नवजात शिशुओं की सांस दर वयस्कों से दोगुनी होती है।'
              : 'Air pollution affects family members differently. Infants inhale twice as much air per kilogram of body weight compared to adults.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-3">
            <h3 className="text-base font-black text-[#174B36]">
              {isHindi ? 'नवजात व छोटे बच्चे' : 'Infants & Toddlers'}
            </h3>
            <p className="text-xs text-[#2D4A3E] leading-relaxed">
              {isHindi
                ? 'फेफड़ों का विकास जारी रहता है। सोने के कमरे में PM2.5 को 25 µg/m³ से नीचे रखें। सुबह की सैर पूरी तरह टालें।'
                : 'Lungs are still developing. Maintain indoor PM2.5 below 25 µg/m³. Strictly avoid morning stroller walks.'}
            </p>
          </div>

          <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-3">
            <h3 className="text-base font-black text-[#174B36]">
              {isHindi ? 'बुजुर्ग व हृदय रोगी' : 'Seniors & Cardiac Care'}
            </h3>
            <p className="text-xs text-[#2D4A3E] leading-relaxed">
              {isHindi
                ? 'बारीक कण खून में मिलकर हृदय पर दबाव डालते हैं। AQI > 200 पर बाहर की सैर को इनडोर वॉक में बदलें।'
                : 'Ultrafine PM2.5 causes systemic inflammation and cardiovascular strain. Shift walks indoors when AQI > 200.'}
            </p>
          </div>

          <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-3">
            <h3 className="text-base font-black text-[#174B36]">
              {isHindi ? 'अस्थमा व एलर्जी पीड़ित' : 'Asthma & Allergies'}
            </h3>
            <p className="text-xs text-[#2D4A3E] leading-relaxed">
              {isHindi
                ? 'ब्रोंकोस्पाज्म से बचने के लिए इनहेलर पास रखें। केवल यांत्रिक फिल्टर का उपयोग करें, रासायनिक सेंट से बचें।'
                : 'Keep rescue inhalers accessible. Avoid synthetic room fresheners or scented candles that emit volatile organics.'}
            </p>
          </div>

          <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-3">
            <h3 className="text-base font-black text-[#174B36]">
              {isHindi ? 'दैनिक यात्री व कम्यूटर' : 'Daily Commuters'}
            </h3>
            <p className="text-xs text-[#2D4A3E] leading-relaxed">
              {isHindi
                ? 'सड़क पर मास्क का टाइट सील रखें। कार में खिड़कियां बंद कर हमेशा इनडोर रीसर्क्युलेशन चालू रखें।'
                : 'Wear a well-fitted N95 on two-wheelers. In cars, close windows and set ventilation strictly to recirculation.'}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. TRANSPARENCY & SCIENTIFIC STANDARDS */}
      {/* ============================================================== */}
      <section className="bg-[#174B36] text-[#F6F4EB] rounded-3xl p-8 sm:p-12 shadow-card space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-white">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
            <span>{isHindi ? 'वैज्ञानिक पारदर्शिता सिद्धांत' : 'Scientific Transparency Principles'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {isHindi ? 'सत्य डेटा, शून्य झूठ' : 'Verified Data. Zero False Claims.'}
          </h2>
          <p className="text-sm sm:text-base text-[#F6F4EB]/90 leading-relaxed font-medium">
            {isHindi
              ? 'वायुदिशा कभी भी विदेशी सूचकांकों को भारतीय सीपीसीबी नहीं बताती। नासा के पौधों के अध्ययन को गलत तरीके से पेश नहीं करती। और कभी भी हानिकारक ओजोन जनरेटर की सिफारिश नहीं करती।'
              : 'VayuDisha strictly distinguishes official CPCB 24-hour CAAQMS station telemetry from Copernicus atmospheric models. We never label European AQI as Indian CPCB, never promote ozone generators, and debunk misleading houseplant claims.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
          <div>
            <h3 className="text-sm font-black text-white">
              {isHindi ? 'आधिकारिक सीपीसीबी स्टेशन' : 'Official CPCB Ground Data'}
            </h3>
            <p className="text-xs text-[#F6F4EB]/80 mt-1 leading-relaxed">
              {isHindi
                ? 'data.gov.in से लाइव CAAQMS स्टेशनों का 24-घंटे का औसत। स्टेशन नाम और टाइमस्टैम्प सहित।'
                : 'Real CAAQMS monitoring records from data.gov.in with station names and timestamps.'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-black text-white">
              {isHindi ? 'कॉपरनिकस CAMS मॉडल' : 'Copernicus CAMS Forecasts'}
            </h3>
            <p className="text-xs text-[#F6F4EB]/80 mt-1 leading-relaxed">
              {isHindi
                ? '45 किमी ग्रिड पर आधारित वायुमंडलीय रसायन पूर्वानुमान। इसे कभी ग्राउंड स्टेशन नहीं कहा जाता।'
                : '45-km global atmospheric dispersion model. Always labeled clearly as a forecast.'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-black text-white">
              {isHindi ? 'गोपनीयता व शून्य पीआईआई' : 'Zero-PII Privacy Architecture'}
            </h3>
            <p className="text-xs text-[#F6F4EB]/80 mt-1 leading-relaxed">
              {isHindi
                ? 'कोई व्यक्तिगत डेटा स्टोर नहीं किया जाता। सभी गणनाएं डिवाइस और सर्वर मेमोरी में ही होती हैं।'
                : 'No tracking, no cookies, no personal identity storage. Client telemetry stays private.'}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      {/* ============================================================== */}
      <FaqAccordion isHindi={isHindi} />

      {/* ============================================================== */}
      {/* 8. CLOSING CTA BANNER: MEMORABLE VAYU CLOSING */}
      {/* ============================================================== */}
      <section className="relative bg-white border-2 border-[#174B36]/15 rounded-3xl p-8 sm:p-12 text-center shadow-card space-y-6 overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#0F766E]/5 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#EBA347]/10 pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="flex justify-center mb-2">
            <VayuMascot pose="peeking" size="md" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#174B36] tracking-tight">
            {isHindi ? 'हवा की समझ, बेहतर कल।' : 'A better direction starts with understanding the air.'}
          </h2>
          <p className="text-sm sm:text-base text-[#2D4A3E] font-medium leading-relaxed">
            {isHindi
              ? 'आज ही अपने शहर की आधिकारिक सीपीसीबी स्थिति देखें और अपने परिवार के लिए अनुकूलित सुरक्षा दिनचर्या बनाएं।'
              : 'Explore real-time CPCB telemetry for your city and generate an intelligent routine tailored to your family.'}
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-2xl bg-[#174B36] text-[#F6F4EB] font-bold text-sm shadow-soft hover:bg-[#0E291D] active:scale-95 transition-all"
            >
              {isHindi ? 'वायु गुणवत्ता डैशबोर्ड' : 'Explore Air Dashboard'}
            </Link>

            <Link
              href="/planner"
              className="px-6 py-3.5 rounded-2xl bg-[#F6F4EB] border border-[#E2DDD1] text-[#174B36] font-bold text-sm shadow-soft hover:bg-[#EAE5D7] active:scale-95 transition-all"
            >
              {isHindi ? 'दैनिक दिनचर्या बनाएं' : 'Create Family Plan'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
