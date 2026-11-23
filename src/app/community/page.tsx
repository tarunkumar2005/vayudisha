'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { VayuMascot } from '@/components/brand/VayuMascot';
import {
  Printer,
  Share2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Shield,
  FileText,
  Check,
} from 'lucide-react';

interface CommunityAction {
  id: string;
  category: string;
  costTier: string;
  timeframe: string;
  title: string;
  description: string;
  enforcementNotice: string;
}

export default function CommunityPage() {
  const { language, selectedCity, aqiData } = useApp();
  const isHindi = language === 'hi';

  const [communityName, setCommunityName] = useState<string>('Green Meadows RWA');
  const [actions, setActions] = useState<CommunityAction[]>([]);
  const [quickWins, setQuickWins] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCommunityPlan = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/community', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cityName: selectedCity,
            communityName,
            language,
          }),
          signal: controller.signal,
        });

        if (res.ok) {
          const data = await res.json();
          setActions(data.actions);
          setQuickWins(data.quickWins);
        }
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          console.error('Failed to load community plan:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      void fetchCommunityPlan();
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [selectedCity, communityName, language]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.warn('Clipboard write failed:', err);
        setCopied(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Non-Print Header Controls */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DDD1] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#174B36]/10 text-[#174B36] text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{isHindi ? 'सामुदायिक नेतृत्व' : 'Community Leadership'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#174B36] tracking-tight">
            {isHindi ? 'सामुदायिक स्वच्छ वायु कार्ययोजना' : 'Community Clean-Air Action Plan'}
          </h1>
          <p className="text-xs sm:text-sm text-[#2D4A3E] mt-1 font-medium">
            {isHindi
              ? 'सोसायटी, आरडब्ल्यूए और मोहल्ले के लिए 1-पेज प्रिंटेबल व शेयर करने योग्य योजना।'
              : 'Printable 1-page action plan for Resident Welfare Associations (RWAs) and apartment complexes.'}
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-white hover:bg-[#EAE5D7] text-[#174B36] rounded-xl text-xs font-bold border border-[#E2DDD1] shadow-soft transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#0F766E]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? (isHindi ? 'कॉपी हो गया!' : 'Link Copied!') : isHindi ? 'शेयर करें' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#174B36] hover:bg-[#0E291D] text-[#F6F4EB] rounded-xl text-xs font-bold shadow-soft transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-[#A7C5A0]" />
            <span>{isHindi ? 'प्रिंट / सेव PDF' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>

      {/* Community Name Editor (No-Print) */}
      <div className="no-print bg-white rounded-2xl border border-[#E2DDD1] p-5 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <label htmlFor="community-name-input" className="text-xs font-black uppercase tracking-wider text-[#174B36] flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-[#0F766E]" />
          <span>{isHindi ? 'सोसायटी / कॉलोनी का नाम:' : 'RWA / Society Name:'}</span>
        </label>
        <input
          id="community-name-input"
          type="text"
          value={communityName}
          onChange={(e) => setCommunityName(e.target.value)}
          placeholder="e.g. Green Meadows RWA, Sector 45"
          className="text-xs sm:text-sm bg-[#F6F4EB] border border-[#E2DDD1] rounded-xl px-3.5 py-2 text-[#174B36] w-full sm:w-80 font-bold focus:ring-2 focus:ring-[#0F766E]"
        />
      </div>

      {/* PRINTABLE ONE-PAGE ACTION PLAN DOCUMENT */}
      <div className="printable-card bg-white rounded-3xl border border-[#E2DDD1] p-6 sm:p-8 shadow-soft space-y-6">
        {/* Document Header */}
        <div className="border-b-2 border-[#174B36] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#174B36] bg-[#174B36]/10 px-2.5 py-0.5 rounded-md border border-[#174B36]/20">
                Clean Air Community Charter
              </span>
              <span className="text-xs text-[#2D4A3E] font-semibold">
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#174B36] mt-1.5 tracking-tight">
              {communityName}
            </h2>
            <p className="text-xs text-[#2D4A3E] font-medium mt-0.5">
              {isHindi ? aqiData?.city.name.hi : aqiData?.city.name.en} • {aqiData?.city.state}
            </p>
          </div>

          {/* Current Smog Level Badge */}
          <div className="text-left sm:text-right">
            <span className="text-[11px] font-bold text-[#2D4A3E] block uppercase tracking-wide">
              Current City AQI
            </span>
            <span
              style={{ backgroundColor: aqiData?.current.color || '#EF4444' }}
              className="inline-block mt-1 px-3.5 py-1 rounded-full text-white text-xs font-black shadow-sm"
            >
              {aqiData?.current.category} {aqiData?.current.aqi ? `(${aqiData.current.aqi})` : ''}
            </span>
          </div>
        </div>

        {/* Quick Wins / Priority Directives */}
        {quickWins.length > 0 && (
          <div className="bg-[#F6F4EB] border border-[#E2DDD1] rounded-2xl p-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#174B36] flex items-center space-x-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#D97706]" />
              <span>{isHindi ? 'सोसायटी के लिए 3 त्वरित प्राथमिकताएँ' : 'Top 3 Immediate Society Actions'}</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#174B36] font-semibold">
              {quickWins.map((win, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0F766E] mt-0.5 shrink-0" />
                  <span>{win}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Detailed Interventions Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-[#174B36] uppercase tracking-wider border-b border-[#E2DDD1]/70 pb-2">
            {isHindi ? 'कार्रवाई सूची और क्रियान्वयन' : 'Standard Society Interventions & Guidelines'}
          </h3>

          <div className="space-y-3.5">
            {actions.map((act) => (
              <div
                key={act.id}
                className="p-4 bg-[#F6F4EB] rounded-2xl border border-[#E2DDD1] flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-[#174B36]">{act.title}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#EAE5D7] text-[#174B36]">
                      {act.costTier} cost
                    </span>
                    <span className="text-[10px] text-[#2D4A3E] font-semibold">
                      {act.timeframe.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#2D4A3E] leading-relaxed font-medium">{act.description}</p>
                </div>

                <div className="text-[11px] text-[#2D4A3E] bg-white p-2.5 rounded-xl border border-[#E2DDD1] shrink-0 sm:max-w-[220px]">
                  <span className="font-bold text-[#174B36] block">Guideline / Law:</span>
                  <span className="font-medium">{act.enforcementNotice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Printable Footer / Verification Seal */}
        <div className="border-t border-[#E2DDD1] pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-[#2D4A3E] font-medium">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[#0F766E]" />
            <span>References CPCB Graded Response Action Plan (GRAP) &amp; NGT Directives</span>
          </div>
          <span className="font-bold text-[#174B36]">Generated by VayuDisha (वायुदिशा) • Verified Clean-Air Community Template</span>
        </div>
      </div>
    </div>
  );
}
