/**
 * CPCB Reference Fixtures & Demonstration Payloads
 * Models real responses from data.gov.in resource 3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69.
 * Located in production source tree so production modules do not depend on tests/ directory.
 */

export const MOCK_DELHI_SMOG_CPCB_RESPONSE = {
  status: 'ok',
  total: 6,
  records: [
    {
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      station: 'Anand Vihar, Delhi - DPCC',
      last_update: '19-11-2026 09:00:00',
      pollutant_id: 'PM2.5',
      pollutant_min: '210',
      pollutant_max: '380',
      pollutant_avg: '315',
      pollutant_unit: 'ug/m3',
      latitude: '28.6476',
      longitude: '77.3158',
    },
    {
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      station: 'Anand Vihar, Delhi - DPCC',
      last_update: '19-11-2026 09:00:00',
      pollutant_id: 'PM10',
      pollutant_min: '310',
      pollutant_max: '490',
      pollutant_avg: '412',
      pollutant_unit: 'ug/m3',
      latitude: '28.6476',
      longitude: '77.3158',
    },
    {
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      station: 'Anand Vihar, Delhi - DPCC',
      last_update: '19-11-2026 09:00:00',
      pollutant_id: 'NO2',
      pollutant_min: '55',
      pollutant_max: '120',
      pollutant_avg: '85',
      pollutant_unit: 'ug/m3',
      latitude: '28.6476',
      longitude: '77.3158',
    },
    {
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      station: 'Anand Vihar, Delhi - DPCC',
      last_update: '19-11-2026 09:00:00',
      pollutant_id: 'SO2',
      pollutant_min: '15',
      pollutant_max: '38',
      pollutant_avg: '24',
      pollutant_unit: 'ug/m3',
      latitude: '28.6476',
      longitude: '77.3158',
    },
    {
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      station: 'Anand Vihar, Delhi - DPCC',
      last_update: '19-11-2026 09:00:00',
      pollutant_id: 'CO',
      pollutant_min: '1.2',
      pollutant_max: '3.4',
      pollutant_avg: '2.3',
      pollutant_unit: 'mg/m3',
      latitude: '28.6476',
      longitude: '77.3158',
    },
    {
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      station: 'Anand Vihar, Delhi - DPCC',
      last_update: '19-11-2026 09:00:00',
      pollutant_id: 'OZONE',
      pollutant_min: '20',
      pollutant_max: '65',
      pollutant_avg: '38',
      pollutant_unit: 'ug/m3',
      latitude: '28.6476',
      longitude: '77.3158',
    },
  ],
};

export const MOCK_CORRUPTED_CPCB_RESPONSE = {
  status: 'ok',
  total: 4,
  records: [
    {
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      station: 'Corrupt Station',
      last_update: 'Invalid Date Format',
      pollutant_id: 'PM2.5',
      pollutant_min: 'NA',
      pollutant_max: '-50', // negative
      pollutant_avg: '-10', // negative
      pollutant_unit: 'ug/m3',
    },
    {
      country: 'India',
      state: 'Delhi',
      city: 'Delhi',
      station: 'Corrupt Station',
      last_update: '19-11-2026 09:00:00',
      pollutant_id: 'PM10',
      pollutant_min: null,
      pollutant_max: null,
      pollutant_avg: '999999', // unreasonable
      pollutant_unit: 'ug/m3',
    },
  ],
};

export const MOCK_STALE_CPCB_RESPONSE = {
  status: 'ok',
  total: 3,
  records: [
    {
      country: 'India',
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      station: 'Talkatora, Lucknow - CPCB',
      last_update: '10-10-2026 09:00:00', // Over a month old
      pollutant_id: 'PM2.5',
      pollutant_avg: '85',
      pollutant_unit: 'ug/m3',
    },
    {
      country: 'India',
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      station: 'Talkatora, Lucknow - CPCB',
      last_update: '10-10-2026 09:00:00',
      pollutant_id: 'PM10',
      pollutant_avg: '140',
      pollutant_unit: 'ug/m3',
    },
    {
      country: 'India',
      state: 'Uttar Pradesh',
      city: 'Lucknow',
      station: 'Talkatora, Lucknow - CPCB',
      last_update: '10-10-2026 09:00:00',
      pollutant_id: 'NO2',
      pollutant_avg: '45',
      pollutant_unit: 'ug/m3',
    },
  ],
};
