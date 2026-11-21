'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UI_STRINGS } from '@/lib/i18n/translations';
import { SUPPORTED_CITIES } from '@/lib/constants/cities';
import { VayuDishaLogo } from '@/components/brand/VayuDishaLogo';
import { Wind, ShieldAlert, Car, Users, Globe } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { language, setLanguage, selectedCity, setSelectedCity } = useApp();

  const navLinks = [
    { href: '/dashboard', label: UI_STRINGS.nav.dashboard[language], icon: Wind },
    { href: '/planner', label: UI_STRINGS.nav.planner[language], icon: ShieldAlert },
    { href: '/impact', label: UI_STRINGS.nav.impact[language], icon: Car },
    { href: '/community', label: UI_STRINGS.nav.community[language], icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F6F4EB]/95 backdrop-blur-md border-b border-[#E2DDD1] transition-colors w-full overflow-x-clip">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 py-2 gap-2">
          {/* Brand Link */}
          <div className="flex items-center shrink-0">
            <Link
              href="/"
              className="group focus:outline-none focus:ring-2 focus:ring-[#0F766E] rounded-xl p-1 -m-1 transition-transform active:scale-95"
            >
              <div className="block sm:hidden">
                <VayuDishaLogo variant="horizontal" size="sm" />
              </div>
              <div className="hidden sm:block">
                <VayuDishaLogo variant="horizontal" size="md" />
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links (Only at lg: 1024px+ to avoid 768px tablet overflow - M-06) */}
          <nav className="hidden lg:flex items-center space-x-1.5" aria-label="Main navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#174B36] text-[#F6F4EB] shadow-sm'
                      : 'text-[#2D4A3E] hover:text-[#174B36] hover:bg-[#EAE5D7]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#A7C5A0]' : 'text-[#0F766E]'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* City Selector & Language Toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            {/* City Picker */}
            <div className="relative">
              <select
                value={selectedCity}
                aria-label="Select City"
                onChange={(e) => setSelectedCity(e.target.value)}
                className="text-xs sm:text-sm font-bold bg-white border border-[#E2DDD1] text-[#174B36] rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 pr-7 sm:pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E] cursor-pointer hover:border-[#0F766E] transition-colors max-w-[115px] sm:max-w-none truncate"
              >
                {SUPPORTED_CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {language === 'hi' ? c.name.hi : c.name.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-bold text-[#174B36] bg-white hover:bg-[#EAE5D7] rounded-xl border border-[#E2DDD1] shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#0F766E] shrink-0"
              title={language === 'en' ? 'Switch to Hindi' : 'अंग्रेज़ी में बदलें'}
            >
              <Globe className="w-3.5 h-3.5 text-[#0F766E]" aria-hidden="true" />
              <span className="hidden sm:inline">{UI_STRINGS.buttons.switchLanguage[language]}</span>
              <span className="inline sm:hidden">{language === 'en' ? 'हिन्दी' : 'EN'}</span>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Navigation bar (lg:hidden) */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-2 border-t border-[#E2DDD1]/60 scrollbar-none">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#174B36] text-[#F6F4EB]'
                    : 'bg-white text-[#2D4A3E] hover:text-[#174B36] border border-[#E2DDD1]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#A7C5A0]' : 'text-[#0F766E]'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
export default Navbar;
