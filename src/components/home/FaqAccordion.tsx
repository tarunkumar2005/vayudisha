'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { getFaqItems } from '@/lib/constants/home-content';

interface FaqAccordionProps {
  isHindi: boolean;
}

export function FaqAccordion({ isHindi }: FaqAccordionProps) {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const faqs = getFaqItems(isHindi);

  return (
    <section className="space-y-6">
      <div className="max-w-2xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174B36]/5 text-xs font-bold text-[#174B36]">
          <HelpCircle className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>{isHindi ? 'सामान्य प्रश्न' : 'Frequently Asked Questions'}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#174B36] tracking-tight">
          {isHindi ? 'अक्सर पूछे जाने वाले सवाल' : 'Clear Answers to Air Questions'}
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isExpanded = expandedFaq === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-[#E2DDD1] rounded-2xl overflow-hidden transition-all shadow-soft"
            >
              <button
                onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#174B36]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#0F766E] transition-transform duration-200 shrink-0 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isExpanded && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-[#2D4A3E] font-medium leading-relaxed border-t border-[#E2DDD1]/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
