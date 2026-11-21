'use client';

import React, { useState } from 'react';
import { Fan, ShieldAlert, Car, Sparkles } from 'lucide-react';

interface HabitsBentoGridProps {
  isHindi: boolean;
}

export function HabitsBentoGrid({ isHindi }: HabitsBentoGridProps) {
  const [filterType, setFilterType] = useState<'diy' | 'commercial'>('diy');

  return (
    <section className="space-y-6">
      <div className="max-w-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174B36]/5 text-xs font-bold text-[#174B36]">
          <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>{isHindi ? 'किफायती आदतें • बड़ा प्रभाव' : 'Practical Habits • Maximum Impact'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#174B36] tracking-tight">
          {isHindi ? 'छोटी आदतें, स्वच्छ हवा' : 'Small Habits, Cleaner Air'}
        </h2>
        <p className="text-sm sm:text-base text-[#2D4A3E] font-medium leading-relaxed">
          {isHindi
            ? 'महंगे एयर प्यूरीफायर पर लाखों खर्च करने की आवश्यकता नहीं है। विज्ञान-सम्मत समाधान घर और सफर दोनों जगह कारगर हैं।'
            : 'Clean indoor air does not require spending fortunes on luxury appliances. Scientifically proven micro-habits protect your lungs.'}
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tile 1: Corsi-Rosenthal DIY Box Fan */}
        <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-4 hover:shadow-card transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E]">
            <Fan className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#174B36]">
            {isHindi ? 'Corsi-Rosenthal DIY प्यूरीफायर' : 'Corsi-Rosenthal DIY Air Box'}
          </h3>
          <p className="text-xs text-[#2D4A3E] leading-relaxed">
            {isHindi
              ? 'एक मानक बॉक्स फैन और 4x MERV-13 फिल्टर। ₹2,000 से कम में ₹20,000 वाले प्यूरीफायर से अधिक क्लीन एयर डिलीवरी।'
              : '1 box fan + 4 MERV-13 filters = 380+ m³/h CADR at 1/10th the cost of commercial units. Proven particle capture.'}
          </p>
          {/* Interactive Toggle */}
          <div className="bg-[#F6F4EB] p-3 rounded-2xl text-xs space-y-2">
            <div className="flex items-center justify-between font-bold text-[#174B36]">
              <span>{filterType === 'diy' ? 'Corsi-Rosenthal DIY' : 'Commercial HEPA'}</span>
              <button
                onClick={() => setFilterType(filterType === 'diy' ? 'commercial' : 'diy')}
                className="text-[11px] text-[#0F766E] underline font-bold"
              >
                {isHindi ? 'बदलें' : 'Toggle Compare'}
              </button>
            </div>
            <div className="text-[11px] text-[#2D4A3E]">
              {filterType === 'diy'
                ? 'Cost: ~₹2,200 | CADR: ~380 m³/h | Filtration: 95%+ PM2.5'
                : 'Cost: ~₹16,000 | CADR: ~280 m³/h | Filtration: 99.9% PM2.5'}
            </div>
          </div>
        </div>

        {/* Tile 2: N95 Respirator Seal Check */}
        <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-4 hover:shadow-card transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#92400E]/10 flex items-center justify-center text-[#92400E]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#174B36]">
            {isHindi ? 'N95 मास्क सील का महत्व' : 'N95 Perimeter Seal Science'}
          </h3>
          <p className="text-xs text-[#2D4A3E] leading-relaxed">
            {isHindi
              ? 'साधारण सर्जिकल मास्क के किनारों से 60%+ हवा बिना छने अंदर जाती है। केवल टाइट फिटेड N95 ही PM2.5 को रोकता है।'
              : 'Loose surgical and cloth masks leak over 60% of inhaled air around cheek edges. Only a tight perimeter N95 seal filters PM2.5.'}
          </p>
          <div className="bg-[#F6F4EB] p-3 rounded-2xl text-xs space-y-1 text-[#174B36] font-semibold">
            <div className="flex items-center gap-1.5 text-rose-700">
              <span>✕</span> <span>Cloth/Surgical: 20-30% effective</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-800">
              <span>✓</span> <span>Fitted N95/N99: 95%+ effective</span>
            </div>
          </div>
        </div>

        {/* Tile 3: Clean Transit Comparison */}
        <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-4 hover:shadow-card transition-all">
          <div className="w-12 h-12 rounded-2xl bg-[#047857]/10 flex items-center justify-center text-[#047857]">
            <Car className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-[#174B36]">
            {isHindi ? 'मेट्रो बनाम कार: 81% कम कार्बन उत्सर्जन' : 'Metro vs Car: 81% CO₂e Emissions Reduction'}
          </h3>
          <p className="text-xs text-[#2D4A3E] leading-relaxed">
            {isHindi
              ? 'सड़क पर ट्रैफिक जाम में बैठने से टेलपाइप धुआं सीधा फेफड़ों में जाता है। मेट्रो के कोच में फिल्टर की गई हवा मिलती है और प्रति यात्री उत्सर्जन 81% कम होता है।'
              : 'Sitting in road congestion exposes passengers to direct tailpipe diesel exhaust. Metro underground rail provides filtered air cabins and cuts per-passenger emissions by 81%.'}
          </p>
          <div className="bg-[#F6F4EB] p-3 rounded-2xl text-xs space-y-1 text-[#174B36] font-semibold">
            <div className="flex justify-between">
              <span>Solo Car Commute (Petrol):</span>
              <span className="font-bold text-rose-700">~150g CO2e/km</span>
            </div>
            <div className="flex justify-between">
              <span>Metro Rail Transit (DMRC):</span>
              <span className="font-bold text-emerald-800">~28g CO2e/km</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
