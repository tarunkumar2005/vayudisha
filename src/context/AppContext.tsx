'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { type Language } from '@/lib/i18n/translations';
import { type DemographicProfile } from '@/lib/rules/safety-rules';
import { type UnifiedAqiPayload } from '@/lib/aqi/aqi-merger';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedCity: string;
  setSelectedCity: (cityId: string) => void;
  selectedStation: string | null;
  setSelectedStation: (station: string | null) => void;
  profile: DemographicProfile;
  setProfile: React.Dispatch<React.SetStateAction<DemographicProfile>>;
  aqiData: UnifiedAqiPayload | null;
  isLoadingAqi: boolean;
  refreshAqi: (stationOverride?: string | null) => Promise<void>;
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
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [profile, setProfile] = useState<DemographicProfile>(DEFAULT_PROFILE);
  const [aqiData, setAqiData] = useState<UnifiedAqiPayload | null>(null);
  const [isLoadingAqi, setIsLoadingAqi] = useState<boolean>(true);

  // Load saved profile & language preferences from localStorage on client
  useEffect(() => {
    try {
      const savedLang = (localStorage.getItem('vayudisha_lang') || localStorage.getItem('saanssaathi_lang')) as Language;
      if (savedLang === 'en' || savedLang === 'hi') {
        setLanguage(savedLang);
      }

      const savedCity = localStorage.getItem('vayudisha_city') || localStorage.getItem('saanssaathi_city');
      if (savedCity) {
        setSelectedCity(savedCity);
      }

      const savedProfile = localStorage.getItem('vayudisha_profile') || localStorage.getItem('saanssaathi_profile');
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch {
      // Local storage disabled or SSR
    }
  }, []);

  const latestRequestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSetSelectedCity = useCallback((cityId: string) => {
    // Abort pending requests from previous city immediately (H-03)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setSelectedCity(cityId);
    setSelectedStation(null);
    setAqiData(null); // Clear previous city's stale data immediately (M-05)
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem('vayudisha_lang', language);
      localStorage.setItem('saanssaathi_lang', language);
    } catch {}
  }, [language]);

  useEffect(() => {
    try {
      localStorage.setItem('vayudisha_city', selectedCity);
      localStorage.setItem('saanssaathi_city', selectedCity);
    } catch {}
    // Reset selected station when city changes
    setSelectedStation(null);
  }, [selectedCity]);

  useEffect(() => {
    try {
      localStorage.setItem('vayudisha_profile', JSON.stringify(profile));
      localStorage.setItem('saanssaathi_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Fetch unified AQI whenever city or station changes
  const refreshAqi = useCallback(
    async (stationOverride?: string | null, cityOverride?: string) => {
      // Abort previous in-flight request to prevent race conditions (H-03)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const currentReqId = ++latestRequestIdRef.current;
      const targetCity = cityOverride ?? selectedCity;
      const station = stationOverride !== undefined ? stationOverride : selectedStation;

      setIsLoadingAqi(true);
      try {
        const url = station
          ? `/api/aqi?city=${encodeURIComponent(targetCity)}&station=${encodeURIComponent(station)}`
          : `/api/aqi?city=${encodeURIComponent(targetCity)}`;

        const res = await fetch(url, { signal: controller.signal });

        // Discard response if a newer request has started (H-03)
        if (currentReqId !== latestRequestIdRef.current) return;

        if (res.ok) {
          const data = await res.json();
          // Double-check monotonic request ID and city identity before committing state
          if (
            currentReqId === latestRequestIdRef.current &&
            data.city &&
            data.city.id === targetCity
          ) {
            setAqiData(data);
          }
        } else {
          // Clear prior data on failure to prevent showing stale readings under new city heading (M-05)
          if (currentReqId === latestRequestIdRef.current) {
            setAqiData(null);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Aborted due to newer request - expected behavior
          return;
        }
        console.error('Failed to fetch AQI:', err);
        if (currentReqId === latestRequestIdRef.current) {
          setAqiData(null);
        }
      } finally {
        if (currentReqId === latestRequestIdRef.current) {
          setIsLoadingAqi(false);
        }
      }
    },
    [selectedCity, selectedStation]
  );

  useEffect(() => {
    refreshAqi();
  }, [refreshAqi]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        selectedCity,
        setSelectedCity: handleSetSelectedCity,
        selectedStation,
        setSelectedStation,
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
