'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UI_STRINGS } from '@/lib/i18n/translations';
import { SUPPORTED_CITIES } from '@/lib/constants/cities';
import { Wind, ShieldAlert, Car, Users, Globe } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, selectedCity, setSelectedCity } = useApp();

  const navLinks = [
    { href: '/', label: UI_STRINGS.nav.dashboard[language], icon: Wind },
    { href: '/planner', label: UI_STRINGS.nav.planner[language], icon: ShieldAlert },
    { href: '/impact', label: UI_STRINGS.nav.impact[language], icon: Car },
    { href: '/community', label: UI_STRINGS.nav.community[language], icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30">
                <Wind className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Saans<span className="text-emerald-600">Saathi</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  साँस साथी
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* City Selector & Language Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* City Picker */}
            <select
              value={selectedCity}
              aria-label="Select City"
              onChange={(e) => setSelectedCity(e.target.value)}
              className="text-xs sm:text-sm font-medium bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {SUPPORTED_CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {language === 'hi' ? c.name.hi : c.name.en}
                </option>
              ))}
            </select>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
              title={language === 'en' ? 'Switch to Hindi' : 'अंग्रेज़ी में बदलें'}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
              <span>{UI_STRINGS.buttons.switchLanguage[language]}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-2 border-t border-slate-100 scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
