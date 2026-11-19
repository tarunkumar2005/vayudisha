'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Printer,
  Share2,
  Users,
  CheckCircle,
  AlertTriangle,
  Building2,
  Shield,
  FileText,
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

  const fetchCommunityPlan = async () => {
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName: selectedCity,
          communityName,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActions(data.actions);
        setQuickWins(data.quickWins);
      }
    } catch (err) {
      console.error('Failed to load community plan:', err);
    }
  };

  useEffect(() => {
    fetchCommunityPlan();
  }, [selectedCity, communityName, language]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Non-Print Header Controls */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isHindi ? 'सामुदायिक स्वच्छ वायु कार्ययोजना' : 'Community Clean-Air Action Plan'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isHindi
              ? 'सोसायटी, आरडब्ल्यूए और मोहल्ले के लिए 1-पेज प्रिंटेबल व शेयर करने योग्य योजना।'
              : 'Printable 1-page action plan for Resident Welfare Associations (RWAs) and apartment complexes.'}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold border border-slate-300 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? (isHindi ? 'कॉपी हो गया!' : 'Link Copied!') : isHindi ? 'शेयर करें' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isHindi ? 'प्रिंट / सेव PDF' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>

      {/* Community Name Editor (No-Print) */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label htmlFor="community-name-input" className="text-xs font-bold text-slate-700 flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-emerald-600" />
          <span>{isHindi ? 'सोसायटी / कॉलोनी का नाम:' : 'RWA / Society Name:'}</span>
        </label>
        <input
          id="community-name-input"
          aria-label={isHindi ? 'सोसायटी / कॉलोनी का नाम' : 'RWA / Society Name'}
          type="text"
          value={communityName}
          onChange={(e) => setCommunityName(e.target.value)}
          placeholder="e.g. Green Meadows RWA, Sector 45"
          className="text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-slate-900 w-full sm:w-80 font-medium focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* PRINTABLE ONE-PAGE ACTION PLAN DOCUMENT */}
      <div className="printable-card bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Clean Air Community Advisory
              </span>
              <span className="text-xs text-slate-600 font-medium">
                {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {communityName}
            </h2>
            <p className="text-xs text-slate-500">
              {isHindi ? aqiData?.city.name.hi : aqiData?.city.name.en} • {aqiData?.city.state}
            </p>
          </div>

          {/* Current Smog Level Badge */}
          <div className="text-left sm:text-right">
            <span className="text-[11px] font-semibold text-slate-600 block uppercase">
              Current City AQI
            </span>
            <span
              style={{ backgroundColor: aqiData?.current.color || '#EF4444' }}
              className="inline-block mt-0.5 px-3 py-1 rounded-full text-white text-xs font-bold"
            >
              {aqiData?.current.category} {aqiData?.current.aqi ? `(${aqiData.current.aqi})` : ''}
            </span>
          </div>
        </div>

        {/* Quick Wins / Priority Directives */}
        {quickWins.length > 0 && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-amber-900 flex items-center space-x-1.5 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? 'सोसायटी के लिए 3 त्वरित प्राथमिकताएँ' : 'Top 3 Immediate Society Actions'}</span>
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-amber-950 font-medium">
              {quickWins.map((win, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <span>{win}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Detailed Interventions Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
            {isHindi ? 'कार्रवाई सूची और क्रियान्वयन' : 'Standard Society Interventions & Guidelines'}
          </h3>

          <div className="space-y-3.5">
            {actions.map((act) => (
              <div
                key={act.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{act.title}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {act.costTier} cost
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {act.timeframe.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
                </div>

                <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200 shrink-0 sm:max-w-[200px]">
                  <span className="font-semibold text-slate-700 block">Guideline / Law:</span>
                  <span>{act.enforcementNotice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Printable Footer / Verification Seal */}
        <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600 font-medium">
          <div className="flex items-center space-x-2">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>References CPCB Graded Response Action Plan (GRAP) & NGT Directives</span>
          </div>
          <span>Generated by SaansSaathi • Verified Clean-Air Community Template</span>
        </div>
      </div>
    </div>
  );
}
