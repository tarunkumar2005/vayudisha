'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type Language } from '@/lib/i18n/translations';
import { type DemographicProfile } from '@/lib/rules/safety-rules';
import { type UnifiedAqiPayload } from '@/lib/aqi/aqi-merger';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedCity: string;
  setSelectedCity: (cityId: string) => void;
  profile: DemographicProfile;
  setProfile: React.Dispatch<React.SetStateAction<DemographicProfile>>;
  aqiData: UnifiedAqiPayload | null;
  isLoadingAqi: boolean;
  refreshAqi: () => Promise<void>;
}

const DEFAULT_PROFILE: DemographicProfile = {
  hasInfantsOrToddlers: true,
  hasSchoolChildren: false,
  hasSeniors: true,
  hasSensitiveMembers: false,
  commuteMode: 'car',
  budgetTier: 'medium',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [selectedCity, setSelectedCity] = useState<string>('delhi');
  const [profile, setProfile] = useState<DemographicProfile>(DEFAULT_PROFILE);
  const [aqiData, setAqiData] = useState<UnifiedAqiPayload | null>(null);
  const [isLoadingAqi, setIsLoadingAqi] = useState<boolean>(true);

  // Load saved profile & language preferences from localStorage on client
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('saanssaathi_lang') as Language;
      if (savedLang === 'en' || savedLang === 'hi') {
        setLanguage(savedLang);
      }

      const savedCity = localStorage.getItem('saanssaathi_city');
      if (savedCity) {
        setSelectedCity(savedCity);
      }

      const savedProfile = localStorage.getItem('saanssaathi_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch {
      // Local storage disabled or SSR
    }
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem('saanssaathi_lang', language);
    } catch {}
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem('saanssaathi_city', selectedCity);
    } catch {}
  }, [selectedCity]);

  useEffect(() => {
    try {
      localStorage.setItem('saanssaathi_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Fetch unified AQI whenever city changes
  const refreshAqi = useCallback(async () => {
    setIsLoadingAqi(true);
    try {
      const res = await fetch(`/api/aqi?city=${encodeURIComponent(selectedCity)}`);
      if (res.ok) {
        const data = await res.json();
        setAqiData(data);
      }
    } catch (err) {
      console.error('Failed to fetch AQI:', err);
    } finally {
      setIsLoadingAqi(false);
    }
  }, [selectedCity]);

  useEffect(() => {
    refreshAqi();
  }, [refreshAqi]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        selectedCity,
        setSelectedCity,
        profile,
        setProfile,
        aqiData,
        isLoadingAqi,
        refreshAqi,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
