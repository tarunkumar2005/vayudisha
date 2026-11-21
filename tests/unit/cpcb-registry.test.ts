import { describe, it, expect } from 'vitest';
import {
  CITY_REGISTRY,
  normalizeCityQuery,
  getStationsForCity,
  getStationInCity,
} from '@/lib/aqi/cpcb-registry';

describe('CPCB Station & City Registry', () => {
  it('contains verified active entries for major Indian metros', () => {
    expect(CITY_REGISTRY.delhi).toBeDefined();
    expect(CITY_REGISTRY.mumbai).toBeDefined();
    expect(CITY_REGISTRY.bengaluru).toBeDefined();
    expect(CITY_REGISTRY.patna).toBeDefined();
    expect(CITY_REGISTRY.kolkata).toBeDefined();
    expect(CITY_REGISTRY.hyderabad).toBeDefined();
    expect(CITY_REGISTRY.jamshedpur).toBeDefined();
  });

  describe('City query normalization and alias resolution', () => {
    it('normalizes common English and regional aliases', () => {
      expect(normalizeCityQuery('bangalore')?.id).toBe('bengaluru');
      expect(normalizeCityQuery('Bangalore')?.id).toBe('bengaluru');
      expect(normalizeCityQuery('BLR')?.id).toBe('bengaluru');

      expect(normalizeCityQuery('bombay')?.id).toBe('mumbai');
      expect(normalizeCityQuery('Bombay')?.id).toBe('mumbai');

      expect(normalizeCityQuery('New Delhi')?.id).toBe('delhi');
      expect(normalizeCityQuery('delhi ncr')?.id).toBe('delhi');

      expect(normalizeCityQuery('calcutta')?.id).toBe('kolkata');
      expect(normalizeCityQuery('gurgaon')?.id).toBe('gurugram');
      expect(normalizeCityQuery('tatanagar')?.id).toBe('jamshedpur');
    });

    it('handles Hindi name aliases', () => {
      expect(normalizeCityQuery('बंगलौर')?.id).toBe('bengaluru');
      expect(normalizeCityQuery('बॉम्बे')?.id).toBe('mumbai');
      expect(normalizeCityQuery('कलकत्ता')?.id).toBe('kolkata');
      expect(normalizeCityQuery('गुड़गांव')?.id).toBe('gurugram');
    });

    it('returns undefined for non-existent or blank queries', () => {
      expect(normalizeCityQuery('')).toBeUndefined();
      expect(normalizeCityQuery('atlantis')).toBeUndefined();
    });
  });

  describe('Station lookup and multi-station coverage', () => {
    it('provides verified CAAQMS stations for Mumbai', () => {
      const stations = getStationsForCity('mumbai');
      expect(stations.length).toBeGreaterThanOrEqual(3);
      const names = stations.map((s) => s.stationName);
      expect(names).toContain('Colaba, Mumbai - MPCB');
      expect(names).toContain('Borivali East, Mumbai - MPCB');
    });

    it('provides verified CAAQMS stations for Bengaluru', () => {
      const stations = getStationsForCity('bengaluru');
      expect(stations.length).toBeGreaterThanOrEqual(3);
      const names = stations.map((s) => s.stationName);
      expect(names).toContain('Jayanagar 5th Block, Bengaluru - KSPCB');
      expect(names).toContain('Hebbal, Bengaluru - KSPCB');
    });

    it('provides verified CAAQMS stations for Delhi', () => {
      const stations = getStationsForCity('delhi');
      expect(stations.length).toBeGreaterThanOrEqual(4);
      const names = stations.map((s) => s.stationName);
      expect(names).toContain('Anand Vihar, Delhi - DPCC');
      expect(names).toContain('ITO, Delhi - CPCB');
    });

    it('provides verified CAAQMS stations for Pune', () => {
      const stations = getStationsForCity('pune');
      expect(stations.length).toBeGreaterThanOrEqual(3);
      const names = stations.map((s) => s.stationName);
      expect(names).toContain('Savitribai Phule Pune University, Pune - MPCB');
      expect(names).toContain('Revenue Colony-Shivajinagar, Pune - IITM');
    });

    it('provides verified CAAQMS stations for Chennai', () => {
      const stations = getStationsForCity('chennai');
      expect(stations.length).toBeGreaterThanOrEqual(3);
      const names = stations.map((s) => s.stationName);
      expect(names).toContain('Perungudi, Chennai - TNPCB');
      expect(names).toContain('Arumbakkam, Chennai - TNPCB');
    });

    it('correctly identifies Jamshedpur as having no live continuous CAAQMS station for transparent CAMS fallback', () => {
      const city = normalizeCityQuery('jamshedpur');
      expect(city).toBeDefined();
      expect(city?.hasOfficialStations).toBe(false);
      expect(city?.stations.length).toBe(0);
    });

    it('registers Jorapokhar under its own distinct geographical identity', () => {
      const city = normalizeCityQuery('jorapokhar');
      expect(city).toBeDefined();
      expect(city?.hasOfficialStations).toBe(true);
      expect(city?.stations.length).toBe(1);
      expect(city?.stations[0].stationName).toBe('Tata Stadium, Jorapokhar - JSPCB');
    });

    it('looks up specific stations by id or partial name', () => {
      const colaba = getStationInCity('mumbai', 'Colaba');
      expect(colaba).toBeDefined();
      expect(colaba?.id).toBe('mumbai-colaba');
      expect(colaba?.agency).toBe('MPCB');

      const jayanagar = getStationInCity('bengaluru', 'jayanagar');
      expect(jayanagar).toBeDefined();
      expect(jayanagar?.agency).toBe('KSPCB');
    });
  });
});
