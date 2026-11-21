'use client';

import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { VayuMascot } from '@/components/brand/VayuMascot';
import { getTimelineSteps } from '@/lib/constants/home-content';

interface SmoggyTuesdayTimelineProps {
  isHindi: boolean;
}

export function SmoggyTuesdayTimeline({ isHindi }: SmoggyTuesdayTimelineProps) {
  const [activeTimeIndex, setActiveTimeIndex] = useState<number>(0);
  const timelineSteps = getTimelineSteps(isHindi);
  const activeStep = timelineSteps[activeTimeIndex] ?? timelineSteps[0];

  return (
    <section className="bg-white border-2 border-[#174B36]/10 rounded-3xl p-6 sm:p-10 shadow-soft space-y-8">
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174B36]/5 text-xs font-bold text-[#174B36]">
          <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>{isHindi ? 'दैनिक विज्ञान • 24 घंटे का चक्र' : 'Atmospheric Science • Daily Smog Cycle'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#174B36] tracking-tight">
          {isHindi ? 'स्मॉग भरा मंगलवार: वायुदिशा के साथ एक दिन' : 'A Smoggy Tuesday: A Day with VayuDisha'}
        </h2>
        <p className="text-sm sm:text-base text-[#2D4A3E] font-medium leading-relaxed">
          {isHindi
            ? 'सर्दियों में प्रदूषण पूरे दिन एक जैसा नहीं रहता। तापमान इनवर्जन (Thermal Inversion) के कारण सुबह और शाम प्रदूषण चरम पर होता है, जबकि दोपहर में प्राकृतिक राहत मिलती है।'
            : 'Air pollution is not static throughout the day. Ground-level thermal inversion traps smoke in the early morning and late evening, while afternoon sunlight creates a brief ventilation window.'}
        </p>
      </div>

      {/* Timeline Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {timelineSteps.map((step, idx) => (
          <button
            key={step.time}
            onClick={() => setActiveTimeIndex(idx)}
            className={`flex-shrink-0 px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
              activeTimeIndex === idx
                ? 'bg-[#174B36] text-[#F6F4EB] border-[#174B36] shadow-soft'
                : 'bg-[#F6F4EB] text-[#2D4A3E] border-[#E2DDD1] hover:bg-[#EAE5D7]'
            }`}
          >
            <div className="text-[11px] opacity-75">{step.time}</div>
            <div className="font-extrabold truncate max-w-[150px]">{step.title}</div>
          </button>
        ))}
      </div>

      {/* Selected Timeline Card with Vayu Reaction */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#F6F4EB]/70 border border-[#E2DDD1] rounded-3xl p-6 sm:p-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#174B36] text-[#F6F4EB]">
              {activeStep.time}
            </span>
            <span className="text-xs font-extrabold text-[#92400E] bg-[#92400E]/10 px-3 py-1 rounded-full">
              {isHindi ? `अनुमानित AQI: ${activeStep.aqiEstimate}` : `Estimated AQI: ${activeStep.aqiEstimate}`}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-[#174B36]">{activeStep.title}</h3>

          <div className="space-y-2 text-sm text-[#2D4A3E]">
            <p className="font-bold text-[#174B36]">
              {isHindi ? 'वायुमंडलीय विज्ञान:' : 'Atmospheric Mechanism:'}
            </p>
            <p className="leading-relaxed bg-white p-3.5 rounded-2xl border border-[#E2DDD1]">
              {activeStep.mechanism}
            </p>
          </div>

          <div className="space-y-2 text-sm text-[#2D4A3E]">
            <p className="font-bold text-[#0F766E]">
              {isHindi ? 'सुरक्षा कार्ययोजना:' : 'Actionable Guidance:'}
            </p>
            <p className="leading-relaxed bg-white p-3.5 rounded-2xl border border-[#E2DDD1] font-semibold text-[#174B36]">
              {activeStep.action}
            </p>
          </div>
        </div>

        {/* Companion Reaction Box */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-[#E2DDD1] shadow-soft">
          <VayuMascot pose={activeStep.vayuPose} size="md" speechBubble={activeStep.vayuAdvice} />
        </div>
      </div>
    </section>
  );
}
