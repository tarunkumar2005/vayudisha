import { CITY_REGISTRY, normalizeCityQuery } from '../aqi/cpcb-registry';

export interface CityInfo {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  cpcbCityName?: string;
  state: string;
  latitude: number;
  longitude: number;
  keyStations: string[];
  hasOfficialStations?: boolean;
}

export const SUPPORTED_CITIES: CityInfo[] = Object.values(CITY_REGISTRY).map((entry) => ({
  id: entry.id,
  name: entry.name,
  cpcbCityName: entry.cpcbCityName,
  state: entry.state,
  latitude: entry.latitude,
  longitude: entry.longitude,
  keyStations: entry.stations.map((s) => s.stationName),
  hasOfficialStations: entry.hasOfficialStations,
}));

export function getCityById(id: string): CityInfo | undefined {
  const normalized = normalizeCityQuery(id);
  if (!normalized) return undefined;

  return {
    id: normalized.id,
    name: normalized.name,
    cpcbCityName: normalized.cpcbCityName,
    state: normalized.state,
    latitude: normalized.latitude,
    longitude: normalized.longitude,
    keyStations: normalized.stations.map((s) => s.stationName),
    hasOfficialStations: normalized.hasOfficialStations,
  };
}
