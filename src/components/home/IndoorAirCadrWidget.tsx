'use client';

import React, { useState } from 'react';
import { Sliders } from 'lucide-react';
import { VayuMascot } from '@/components/brand/VayuMascot';
import {
  getRoomSizes,
  getBudgetOptions,
  type RoomSizeKey,
  type BudgetTierKey,
} from '@/lib/constants/home-content';

interface IndoorAirCadrWidgetProps {
  isHindi: boolean;
}

export function IndoorAirCadrWidget({ isHindi }: IndoorAirCadrWidgetProps) {
  const [roomSize, setRoomSize] = useState<RoomSizeKey>('medium');
  const [budgetTier, setBudgetTier] = useState<BudgetTierKey>('diy');

  const roomSizes = getRoomSizes(isHindi);
  const budgetOptions = getBudgetOptions(isHindi);

  const currentCalc = budgetOptions[budgetTier];
  const currentVolume = roomSizes[roomSize].volumeM3;
  const estimatedAch = currentCalc.cadr > 0 ? (currentCalc.cadr / currentVolume).toFixed(1) : '0';

  return (
    <section className="bg-white border-2 border-[#174B36]/10 rounded-3xl p-6 sm:p-10 shadow-soft space-y-8">
      <div className="max-w-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174B36]/5 text-xs font-bold text-[#174B36]">
          <Sliders className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>{isHindi ? 'इंटरएक्टिव टूल • 3 आसान चरण' : 'Interactive Demo • 3 Simple Steps'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#174B36] tracking-tight">
          {isHindi ? 'करके देखें: 3 चरणों में स्वच्छ इनडोर हवा' : 'Try It: 3 Steps to Clean Indoor Air'}
        </h2>
        <p className="text-sm sm:text-base text-[#2D4A3E] font-medium leading-relaxed">
          {isHindi
            ? 'अपने कमरे का आकार और बजट चुनें। वायुदिशा तुरंत गणना करके बताएगी कि आपका कमरा कितनी बार स्वच्छ हवा बदलेगा।'
            : 'Select your room size and budget. VayuDisha calculates your exact Clean Air Delivery Rate (CADR) and hourly air changes.'}
        </p>
      </div>

      {/* Step Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          {/* Step 1: Room Size */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-[#174B36] block">
              {isHindi ? 'चरण 1: कमरे का आकार चुनें' : 'Step 1: Select Room Size'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['small', 'medium', 'large'] as const).map((sz) => (
                <button
                  key={sz}
                  onClick={() => setRoomSize(sz)}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all border text-center ${
                    roomSize === sz
                      ? 'bg-[#174B36] text-[#F6F4EB] border-[#174B36] shadow-soft'
                      : 'bg-[#F6F4EB] text-[#2D4A3E] border-[#E2DDD1] hover:bg-[#EAE5D7]'
                  }`}
                >
                  {sz === 'small' ? '120 sq ft' : sz === 'medium' ? '200 sq ft' : '350 sq ft'}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Budget Tier */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-[#174B36] block">
              {isHindi ? 'चरण 2: अपना बजट चुनें' : 'Step 2: Choose Budget Tier'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['free', 'diy', 'hepa'] as const).map((bg) => (
                <button
                  key={bg}
                  onClick={() => setBudgetTier(bg)}
                  className={`p-3 rounded-2xl text-xs font-bold transition-all border text-center ${
                    budgetTier === bg
                      ? 'bg-[#174B36] text-[#F6F4EB] border-[#174B36] shadow-soft'
                      : 'bg-[#F6F4EB] text-[#2D4A3E] border-[#E2DDD1] hover:bg-[#EAE5D7]'
                  }`}
                >
                  {bg === 'free' ? '₹0 (Free)' : bg === 'diy' ? 'DIY (~₹2k)' : 'HEPA (~₹9k)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Instant Calculation Output Card */}
        <div className="bg-[#F6F4EB] border-2 border-[#174B36]/15 rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD1]">
            <span className="text-xs font-black uppercase tracking-wider text-[#174B36]">
              {isHindi ? 'गणना परिणाम' : 'Calculated Air Delivery'}
            </span>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#174B36] text-[#F6F4EB]">
              {currentCalc.cost}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-[#174B36]">{currentCalc.title}</h3>
            <p className="text-xs text-[#2D4A3E] mt-1 leading-relaxed">{currentCalc.desc}</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white p-3.5 rounded-2xl border border-[#E2DDD1]">
              <div className="text-[11px] font-bold text-[#2D4A3E]">
                {isHindi ? 'डिलीवरी दर (CADR)' : 'Clean Air Delivery Rate'}
              </div>
              <div className="text-2xl font-black text-[#0F766E] mt-0.5">
                {currentCalc.cadr > 0 ? `${currentCalc.cadr} m³/h` : 'N/A'}
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-[#E2DDD1]">
              <div className="text-[11px] font-bold text-[#2D4A3E]">
                {isHindi ? 'हवा में बदलाव (ACH)' : 'Air Changes Per Hour'}
              </div>
              <div className="text-2xl font-black text-[#174B36] mt-0.5">
                {currentCalc.cadr > 0 ? `${estimatedAch} ACH` : 'Exposure Cut'}
              </div>
            </div>
          </div>

          {/* Engineering Formula & Ceiling Assumption */}
          <p className="text-[11px] text-[#587668] bg-white/70 p-2.5 rounded-xl border border-[#E2DDD1] leading-relaxed">
            📐 {isHindi
              ? `मानक 2.7 मी (9 फीट) छत ऊंचाई मानी गई (${roomSizes[roomSize].volumeM3} m³ आयतन)। सूत्र: ACH = CADR / कमरा आयतन। खिड़की-दरवाजे बंद रहने पर आधारित।`
              : `Assumes standard 2.7m (9 ft) ceiling height (${roomSizes[roomSize].volumeM3} m³ volume). Formula: ACH = CADR / Room Volume. Assumes sealed room enclosure.`}
          </p>

          {/* Vayu Feedback */}
          <div className="pt-2">
            <VayuMascot pose="celebrating" size="sm" speechBubble={currentCalc.vayuTip} />
          </div>
        </div>
      </div>
    </section>
  );
}
