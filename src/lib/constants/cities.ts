export interface CityInfo {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  /** Official city name used in CPCB / data.gov.in database queries */
  cpcbCityName?: string;
  state: string;
  latitude: number;
  longitude: number;
  keyStations: string[];
}

export const SUPPORTED_CITIES: CityInfo[] = [
  {
    id: 'delhi',
    name: { en: 'Delhi NCR', hi: 'दिल्ली एनसीआर' },
    cpcbCityName: 'Delhi',
    state: 'Delhi',
    latitude: 28.6139,
    longitude: 77.209,
    keyStations: [
      'Anand Vihar, Delhi - DPCC',
      'ITO, Delhi - CPCB',
      'R K Puram, Delhi - DPCC',
      'Punjabi Bagh, Delhi - DPCC',
      'Lodhi Road, Delhi - IITM',
    ],
  },
  {
    id: 'noida',
    name: { en: 'Noida', hi: 'नोएडा' },
    state: 'Uttar Pradesh',
    latitude: 28.5355,
    longitude: 77.391,
    keyStations: ['Sector-62, Noida - IMD', 'Sector-1, Noida - UPPCB'],
  },
  {
    id: 'gurugram',
    name: { en: 'Gurugram', hi: 'गुरुग्राम' },
    state: 'Haryana',
    latitude: 28.4595,
    longitude: 77.0266,
    keyStations: ['Vikas Sadan, Gurugram - HSPCB', 'Sector-51, Gurugram - HSPCB'],
  },
  {
    id: 'mumbai',
    name: { en: 'Mumbai', hi: 'मुंबई' },
    state: 'Maharashtra',
    latitude: 19.076,
    longitude: 72.8777,
    keyStations: ['Bandra, Mumbai - MPCB', 'Colaba, Mumbai - MPCB', 'Kurla, Mumbai - MPCB'],
  },
  {
    id: 'lucknow',
    name: { en: 'Lucknow', hi: 'लखनऊ' },
    state: 'Uttar Pradesh',
    latitude: 26.8467,
    longitude: 80.9462,
    keyStations: ['Lalbagh, Lucknow - UPPCB', 'Talkatora, Lucknow - CPCB', 'Gomti Nagar, Lucknow - IITR'],
  },
  {
    id: 'patna',
    name: { en: 'Patna', hi: 'पटना' },
    state: 'Bihar',
    latitude: 25.5941,
    longitude: 85.1376,
    keyStations: ['Muradpur, Patna - BSPCB', 'IGSC Planetarium Complex, Patna - BSPCB'],
  },
  {
    id: 'kolkata',
    name: { en: 'Kolkata', hi: 'कोलकाता' },
    state: 'West Bengal',
    latitude: 22.5726,
    longitude: 88.3639,
    keyStations: ['Victoria, Kolkata - WBPCB', 'Rabindra Bharati University, Kolkata - WBPCB'],
  },
  {
    id: 'bengaluru',
    name: { en: 'Bengaluru', hi: 'बेंगलुरु' },
    state: 'Karnataka',
    latitude: 12.9716,
    longitude: 77.5946,
    keyStations: ['City Railway Station, Bengaluru - KSPCB', 'BTM Layout, Bengaluru - CPCB'],
  },
  {
    id: 'hyderabad',
    name: { en: 'Hyderabad', hi: 'हैदराबाद' },
    state: 'Telangana',
    latitude: 17.385,
    longitude: 78.4867,
    keyStations: ['Sanathnagar, Hyderabad - TSPCB', 'Bollaram, Hyderabad - TSPCB'],
  },
];

export function getCityById(id: string): CityInfo | undefined {
  return SUPPORTED_CITIES.find((c) => c.id === id.toLowerCase() || c.name.en.toLowerCase() === id.toLowerCase());
}
