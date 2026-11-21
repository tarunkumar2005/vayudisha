/**
 * CPCB Station and City Registry
 *
 * Authoritative registry of Indian cities, official CPCB continuous ambient air quality
 * monitoring stations (CAAQMS), operating agencies, coordinates, and alias mappings.
 *
 * Provides resilient lookup and query normalization for data.gov.in integration.
 */

export interface CpcbStationInfo {
  id: string;
  stationName: string;
  dataGovFilterName: string;
  aliases?: string[];
  city: string;
  cityId: string;
  state: string;
  agency: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
}

export interface CityRegistryEntry {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  aliases: string[];
  state: string;
  cpcbCityName: string;
  latitude: number;
  longitude: number;
  hasOfficialStations: boolean;
  stations: CpcbStationInfo[];
}

export const CITY_REGISTRY: Record<string, CityRegistryEntry> = {
  delhi: {
    id: 'delhi',
    name: { en: 'Delhi NCR', hi: 'दिल्ली एनसीआर' },
    aliases: ['delhi', 'new delhi', 'delhi ncr', 'ncr', 'dilli', 'राष्ट्रीय राजधानी क्षेत्र'],
    state: 'Delhi',
    cpcbCityName: 'Delhi',
    latitude: 28.6139,
    longitude: 77.209,
    hasOfficialStations: true,
    stations: [
      {
        id: 'delhi-anand-vihar',
        stationName: 'Anand Vihar, Delhi - DPCC',
        dataGovFilterName: 'Anand Vihar, Delhi - DPCC',
        city: 'Delhi',
        cityId: 'delhi',
        state: 'Delhi',
        agency: 'DPCC',
        latitude: 28.6468,
        longitude: 77.316,
        isActive: true,
      },
      {
        id: 'delhi-ito',
        stationName: 'ITO, Delhi - CPCB',
        dataGovFilterName: 'ITO, Delhi - CPCB',
        city: 'Delhi',
        cityId: 'delhi',
        state: 'Delhi',
        agency: 'CPCB',
        latitude: 28.6312,
        longitude: 77.2494,
        isActive: true,
      },
      {
        id: 'delhi-rk-puram',
        stationName: 'R K Puram, Delhi - DPCC',
        dataGovFilterName: 'R K Puram, Delhi - DPCC',
        city: 'Delhi',
        cityId: 'delhi',
        state: 'Delhi',
        agency: 'DPCC',
        latitude: 28.5638,
        longitude: 77.186,
        isActive: true,
      },
      {
        id: 'delhi-punjabi-bagh',
        stationName: 'Punjabi Bagh, Delhi - DPCC',
        dataGovFilterName: 'Punjabi Bagh, Delhi - DPCC',
        city: 'Delhi',
        cityId: 'delhi',
        state: 'Delhi',
        agency: 'DPCC',
        latitude: 28.6723,
        longitude: 77.1311,
        isActive: true,
      },
      {
        id: 'delhi-lodhi-road',
        stationName: 'Lodhi Road, Delhi - IITM',
        dataGovFilterName: 'Lodhi Road, Delhi - IITM',
        city: 'Delhi',
        cityId: 'delhi',
        state: 'Delhi',
        agency: 'IITM',
        latitude: 28.5918,
        longitude: 77.2273,
        isActive: true,
      },
      {
        id: 'delhi-dhyan-chand',
        stationName: 'Major Dhyan Chand National Stadium, Delhi - DPCC',
        dataGovFilterName: 'Major Dhyan Chand National Stadium, Delhi - DPCC',
        city: 'Delhi',
        cityId: 'delhi',
        state: 'Delhi',
        agency: 'DPCC',
        latitude: 28.612,
        longitude: 77.237,
        isActive: true,
      },
    ],
  },
  mumbai: {
    id: 'mumbai',
    name: { en: 'Mumbai', hi: 'मुंबई' },
    aliases: ['mumbai', 'bombay', 'mumbay', 'बॉम्बे', 'बम्बई'],
    state: 'Maharashtra',
    cpcbCityName: 'Mumbai',
    latitude: 19.076,
    longitude: 72.8777,
    hasOfficialStations: true,
    stations: [
      {
        id: 'mumbai-colaba',
        stationName: 'Colaba, Mumbai - MPCB',
        dataGovFilterName: 'Colaba, Mumbai - MPCB',
        city: 'Mumbai',
        cityId: 'mumbai',
        state: 'Maharashtra',
        agency: 'MPCB',
        latitude: 18.9067,
        longitude: 72.8147,
        isActive: true,
      },
      {
        id: 'mumbai-borivali-east',
        stationName: 'Borivali East, Mumbai - MPCB',
        dataGovFilterName: 'Borivali East, Mumbai - MPCB',
        city: 'Mumbai',
        cityId: 'mumbai',
        state: 'Maharashtra',
        agency: 'MPCB',
        latitude: 19.2291,
        longitude: 72.8624,
        isActive: true,
      },
      {
        id: 'mumbai-siddharth-worli',
        stationName: 'Siddharth Nagar-Worli, Mumbai - IITM',
        dataGovFilterName: 'Siddharth Nagar-Worli, Mumbai - IITM',
        city: 'Mumbai',
        cityId: 'mumbai',
        state: 'Maharashtra',
        agency: 'IITM',
        latitude: 19.015,
        longitude: 72.818,
        isActive: true,
      },
      {
        id: 'mumbai-worli',
        stationName: 'Worli, Mumbai - MPCB',
        dataGovFilterName: 'Worli, Mumbai - MPCB',
        city: 'Mumbai',
        cityId: 'mumbai',
        state: 'Maharashtra',
        agency: 'MPCB',
        latitude: 19.0166,
        longitude: 72.8168,
        isActive: true,
      },
      {
        id: 'mumbai-powai',
        stationName: 'Powai, Mumbai - MPCB',
        dataGovFilterName: 'Powai, Mumbai - MPCB',
        city: 'Mumbai',
        cityId: 'mumbai',
        state: 'Maharashtra',
        agency: 'MPCB',
        latitude: 19.124,
        longitude: 72.905,
        isActive: true,
      },
      {
        id: 'mumbai-malad-west',
        stationName: 'Mindspace-Malad West, Mumbai - MPCB',
        dataGovFilterName: 'Mindspace-Malad West, Mumbai - MPCB',
        city: 'Mumbai',
        cityId: 'mumbai',
        state: 'Maharashtra',
        agency: 'MPCB',
        latitude: 19.176,
        longitude: 72.834,
        isActive: true,
      },
    ],
  },
  bengaluru: {
    id: 'bengaluru',
    name: { en: 'Bengaluru', hi: 'बेंगलुरु' },
    aliases: ['bengaluru', 'bangalore', 'blr', 'बंगलौर', 'बैंगलोर'],
    state: 'Karnataka',
    cpcbCityName: 'Bengaluru',
    latitude: 12.9716,
    longitude: 77.5946,
    hasOfficialStations: true,
    stations: [
      {
        id: 'bengaluru-jayanagar',
        stationName: 'Jayanagar 5th Block, Bengaluru - KSPCB',
        dataGovFilterName: 'Jayanagar 5th Block, Bengaluru - KSPCB',
        city: 'Bengaluru',
        cityId: 'bengaluru',
        state: 'Karnataka',
        agency: 'KSPCB',
        latitude: 12.9237,
        longitude: 77.5838,
        isActive: true,
      },
      {
        id: 'bengaluru-hebbal',
        stationName: 'Hebbal, Bengaluru - KSPCB',
        dataGovFilterName: 'Hebbal, Bengaluru - KSPCB',
        city: 'Bengaluru',
        cityId: 'bengaluru',
        state: 'Karnataka',
        agency: 'KSPCB',
        latitude: 13.0358,
        longitude: 77.597,
        isActive: true,
      },
      {
        id: 'bengaluru-hombegowda',
        stationName: 'Hombegowda Nagar, Bengaluru - KSPCB',
        dataGovFilterName: 'Hombegowda Nagar, Bengaluru - KSPCB',
        city: 'Bengaluru',
        cityId: 'bengaluru',
        state: 'Karnataka',
        agency: 'KSPCB',
        latitude: 12.9385,
        longitude: 77.5908,
        isActive: true,
      },
      {
        id: 'bengaluru-rvce',
        stationName: 'RVCE-Mailasandra, Bengaluru - KSPCB',
        dataGovFilterName: 'RVCE-Mailasandra, Bengaluru - KSPCB',
        city: 'Bengaluru',
        cityId: 'bengaluru',
        state: 'Karnataka',
        agency: 'KSPCB',
        latitude: 12.924,
        longitude: 77.498,
        isActive: true,
      },
      {
        id: 'bengaluru-silk-board',
        stationName: 'Silk Board, Bengaluru - KSPCB',
        dataGovFilterName: 'Silk Board, Bengaluru - KSPCB',
        city: 'Bengaluru',
        cityId: 'bengaluru',
        state: 'Karnataka',
        agency: 'KSPCB',
        latitude: 12.917,
        longitude: 77.623,
        isActive: true,
      },
    ],
  },
  patna: {
    id: 'patna',
    name: { en: 'Patna', hi: 'पटना' },
    aliases: ['patna', 'patliputra', 'पाटलिपुत्र'],
    state: 'Bihar',
    cpcbCityName: 'Patna',
    latitude: 25.5941,
    longitude: 85.1376,
    hasOfficialStations: true,
    stations: [
      {
        id: 'patna-rajbansi-nagar',
        stationName: 'Rajbansi Nagar, Patna - BSPCB',
        dataGovFilterName: 'Rajbansi Nagar, Patna - BSPCB',
        city: 'Patna',
        cityId: 'patna',
        state: 'Bihar',
        agency: 'BSPCB',
        latitude: 25.609,
        longitude: 85.118,
        isActive: true,
      },
      {
        id: 'patna-muradpur',
        stationName: 'Muradpur, Patna - BSPCB',
        dataGovFilterName: 'Muradpur, Patna - BSPCB',
        city: 'Patna',
        cityId: 'patna',
        state: 'Bihar',
        agency: 'BSPCB',
        latitude: 25.621,
        longitude: 85.158,
        isActive: true,
      },
      {
        id: 'patna-danapur',
        stationName: 'DRM Office Danapur, Patna - BSPCB',
        dataGovFilterName: 'DRM Office Danapur, Patna - BSPCB',
        city: 'Patna',
        cityId: 'patna',
        state: 'Bihar',
        agency: 'BSPCB',
        latitude: 25.602,
        longitude: 85.042,
        isActive: true,
      },
      {
        id: 'patna-samanpura',
        stationName: 'Samanpura, Patna - BSPCB',
        dataGovFilterName: 'Samanpura, Patna - BSPCB',
        city: 'Patna',
        cityId: 'patna',
        state: 'Bihar',
        agency: 'BSPCB',
        latitude: 25.601,
        longitude: 85.084,
        isActive: true,
      },
    ],
  },
  kolkata: {
    id: 'kolkata',
    name: { en: 'Kolkata', hi: 'कोलकाता' },
    aliases: ['kolkata', 'calcutta', 'ccu', 'कलकत्ता'],
    state: 'West Bengal',
    cpcbCityName: 'Kolkata',
    latitude: 22.5726,
    longitude: 88.3639,
    hasOfficialStations: true,
    stations: [
      {
        id: 'kolkata-victoria',
        stationName: 'Victoria, Kolkata - WBPCB',
        dataGovFilterName: 'Victoria, Kolkata - WBPCB',
        city: 'Kolkata',
        cityId: 'kolkata',
        state: 'West Bengal',
        agency: 'WBPCB',
        latitude: 22.5448,
        longitude: 88.3426,
        isActive: true,
      },
      {
        id: 'kolkata-rbu',
        stationName: 'Rabindra Bharati University, Kolkata - WBPCB',
        dataGovFilterName: 'Rabindra Bharati University, Kolkata - WBPCB',
        city: 'Kolkata',
        cityId: 'kolkata',
        state: 'West Bengal',
        agency: 'WBPCB',
        latitude: 22.627,
        longitude: 88.378,
        isActive: true,
      },
      {
        id: 'kolkata-jadavpur',
        stationName: 'Jadavpur, Kolkata - WBPCB',
        dataGovFilterName: 'Jadavpur, Kolkata - WBPCB',
        city: 'Kolkata',
        cityId: 'kolkata',
        state: 'West Bengal',
        agency: 'WBPCB',
        latitude: 22.498,
        longitude: 88.371,
        isActive: true,
      },
    ],
  },
  hyderabad: {
    id: 'hyderabad',
    name: { en: 'Hyderabad', hi: 'हैदराबाद' },
    aliases: ['hyderabad', 'hyd', 'secunderabad', 'साइबराबाद', 'सिकंदराबाद'],
    state: 'Telangana',
    cpcbCityName: 'Hyderabad',
    latitude: 17.385,
    longitude: 78.4867,
    hasOfficialStations: true,
    stations: [
      {
        id: 'hyderabad-sanathnagar',
        stationName: 'Sanathnagar, Hyderabad - TSPCB',
        dataGovFilterName: 'Sanathnagar, Hyderabad - TSPCB',
        city: 'Hyderabad',
        cityId: 'hyderabad',
        state: 'Telangana',
        agency: 'TSPCB',
        latitude: 17.4578,
        longitude: 78.4414,
        isActive: true,
      },
      {
        id: 'hyderabad-bollaram',
        stationName: 'Bollaram Industrial Area, Hyderabad - TSPCB',
        dataGovFilterName: 'Bollaram Industrial Area, Hyderabad - TSPCB',
        aliases: ['Bollaram, Hyderabad - TSPCB'],
        city: 'Hyderabad',
        cityId: 'hyderabad',
        state: 'Telangana',
        agency: 'TSPCB',
        latitude: 17.556,
        longitude: 78.361,
        isActive: true,
      },
      {
        id: 'hyderabad-zoo-park',
        stationName: 'Zoo Park, Hyderabad - TSPCB',
        dataGovFilterName: 'Zoo Park, Hyderabad - TSPCB',
        city: 'Hyderabad',
        cityId: 'hyderabad',
        state: 'Telangana',
        agency: 'TSPCB',
        latitude: 17.352,
        longitude: 78.451,
        isActive: true,
      },
    ],
  },
  lucknow: {
    id: 'lucknow',
    name: { en: 'Lucknow', hi: 'लखनऊ' },
    aliases: ['lucknow', 'lko', 'अवध'],
    state: 'Uttar Pradesh',
    cpcbCityName: 'Lucknow',
    latitude: 26.8467,
    longitude: 80.9462,
    hasOfficialStations: true,
    stations: [
      {
        id: 'lucknow-gomti-nagar',
        stationName: 'Gomti Nagar, Lucknow - UPPCB',
        dataGovFilterName: 'Gomti Nagar, Lucknow - UPPCB',
        city: 'Lucknow',
        cityId: 'lucknow',
        state: 'Uttar Pradesh',
        agency: 'UPPCB',
        latitude: 26.858,
        longitude: 80.998,
        isActive: true,
      },
      {
        id: 'lucknow-lalbagh',
        stationName: 'Lalbagh, Lucknow - CPCB',
        dataGovFilterName: 'Lalbagh, Lucknow - CPCB',
        city: 'Lucknow',
        cityId: 'lucknow',
        state: 'Uttar Pradesh',
        agency: 'CPCB',
        latitude: 26.848,
        longitude: 80.939,
        isActive: true,
      },
      {
        id: 'lucknow-talkatora',
        stationName: 'Talkatora District Industries Center, Lucknow - CPCB',
        dataGovFilterName: 'Talkatora District Industries Center, Lucknow - CPCB',
        city: 'Lucknow',
        cityId: 'lucknow',
        state: 'Uttar Pradesh',
        agency: 'CPCB',
        latitude: 26.832,
        longitude: 80.902,
        isActive: true,
      },
    ],
  },
  noida: {
    id: 'noida',
    name: { en: 'Noida', hi: 'नोएडा' },
    aliases: ['noida', 'greater noida'],
    state: 'Uttar Pradesh',
    cpcbCityName: 'Noida',
    latitude: 28.5355,
    longitude: 77.391,
    hasOfficialStations: true,
    stations: [
      {
        id: 'noida-sector-62',
        stationName: 'Sector - 62, Noida - IMD',
        dataGovFilterName: 'Sector - 62, Noida - IMD',
        aliases: ['Sector-62, Noida - IITM', 'Sector 62, Noida - IMD'],
        city: 'Noida',
        cityId: 'noida',
        state: 'Uttar Pradesh',
        agency: 'IMD',
        latitude: 28.625,
        longitude: 77.365,
        isActive: true,
      },
      {
        id: 'noida-sector-116',
        stationName: 'Sector-116, Noida - UPPCB',
        dataGovFilterName: 'Sector-116, Noida - UPPCB',
        city: 'Noida',
        cityId: 'noida',
        state: 'Uttar Pradesh',
        agency: 'UPPCB',
        latitude: 28.568,
        longitude: 77.382,
        isActive: true,
      },
    ],
  },
  gurugram: {
    id: 'gurugram',
    name: { en: 'Gurugram', hi: 'गुरुग्राम' },
    aliases: ['gurugram', 'gurgaon', 'गुड़गांव'],
    state: 'Haryana',
    cpcbCityName: 'Gurugram',
    latitude: 28.4595,
    longitude: 77.0266,
    hasOfficialStations: true,
    stations: [
      {
        id: 'gurugram-vikas-sadan',
        stationName: 'Vikas Sadan, Gurugram - HSPCB',
        dataGovFilterName: 'Vikas Sadan, Gurugram - HSPCB',
        city: 'Gurugram',
        cityId: 'gurugram',
        state: 'Haryana',
        agency: 'HSPCB',
        latitude: 28.451,
        longitude: 77.032,
        isActive: true,
      },
      {
        id: 'gurugram-sector-51',
        stationName: 'Sector-51, Gurugram - HSPCB',
        dataGovFilterName: 'Sector-51, Gurugram - HSPCB',
        city: 'Gurugram',
        cityId: 'gurugram',
        state: 'Haryana',
        agency: 'HSPCB',
        latitude: 28.428,
        longitude: 77.072,
        isActive: true,
      },
    ],
  },
  pune: {
    id: 'pune',
    name: { en: 'Pune', hi: 'पुणे' },
    aliases: ['pune', 'poona', 'पुणा'],
    state: 'Maharashtra',
    cpcbCityName: 'Pune',
    latitude: 18.5204,
    longitude: 73.8567,
    hasOfficialStations: true,
    stations: [
      {
        id: 'pune-sp-university',
        stationName: 'Savitribai Phule Pune University, Pune - MPCB',
        dataGovFilterName: 'Savitribai Phule Pune University, Pune - MPCB',
        city: 'Pune',
        cityId: 'pune',
        state: 'Maharashtra',
        agency: 'MPCB',
        latitude: 18.553,
        longitude: 73.824,
        isActive: true,
      },
      {
        id: 'pune-shivajinagar',
        stationName: 'Revenue Colony-Shivajinagar, Pune - IITM',
        dataGovFilterName: 'Revenue Colony-Shivajinagar, Pune - IITM',
        city: 'Pune',
        cityId: 'pune',
        state: 'Maharashtra',
        agency: 'IITM',
        latitude: 18.531,
        longitude: 73.844,
        isActive: true,
      },
      {
        id: 'pune-dhankawadi',
        stationName: 'Dhankawadi, Pune - IITM',
        dataGovFilterName: 'Dhankawadi, Pune - IITM',
        city: 'Pune',
        cityId: 'pune',
        state: 'Maharashtra',
        agency: 'IITM',
        latitude: 18.468,
        longitude: 73.857,
        isActive: true,
      },
      {
        id: 'pune-panchawati-pashan',
        stationName: 'Panchawati_Pashan, Pune - IITM',
        dataGovFilterName: 'Panchawati_Pashan, Pune - IITM',
        city: 'Pune',
        cityId: 'pune',
        state: 'Maharashtra',
        agency: 'IITM',
        latitude: 18.539,
        longitude: 73.805,
        isActive: true,
      },
    ],
  },
  ahmedabad: {
    id: 'ahmedabad',
    name: { en: 'Ahmedabad', hi: 'अहमदाबाद' },
    aliases: ['ahmedabad', 'amdavad', 'अमदावाद'],
    state: 'Gujarat',
    cpcbCityName: 'Ahmedabad',
    latitude: 23.0225,
    longitude: 72.5714,
    hasOfficialStations: true,
    stations: [
      {
        id: 'ahmedabad-maninagar',
        stationName: 'Maninagar, Ahmedabad - GPCB',
        dataGovFilterName: 'Maninagar, Ahmedabad - GPCB',
        city: 'Ahmedabad',
        cityId: 'ahmedabad',
        state: 'Gujarat',
        agency: 'GPCB',
        latitude: 22.996,
        longitude: 72.602,
        isActive: true,
      },
      {
        id: 'ahmedabad-chandkheda',
        stationName: 'Chandkheda, Ahmedabad - IITM',
        dataGovFilterName: 'Chandkheda, Ahmedabad - IITM',
        aliases: ['Chandkheda, Ahmedabad - IITGN'],
        city: 'Ahmedabad',
        cityId: 'ahmedabad',
        state: 'Gujarat',
        agency: 'IITM',
        latitude: 23.111,
        longitude: 72.583,
        isActive: true,
      },
    ],
  },
  chennai: {
    id: 'chennai',
    name: { en: 'Chennai', hi: 'चेन्नई' },
    aliases: ['chennai', 'madras', 'मद्रास'],
    state: 'Tamil Nadu',
    cpcbCityName: 'Chennai',
    latitude: 13.0827,
    longitude: 80.2707,
    hasOfficialStations: true,
    stations: [
      {
        id: 'chennai-perungudi',
        stationName: 'Perungudi, Chennai - TNPCB',
        dataGovFilterName: 'Perungudi, Chennai - TNPCB',
        city: 'Chennai',
        cityId: 'chennai',
        state: 'Tamil Nadu',
        agency: 'TNPCB',
        latitude: 12.961,
        longitude: 80.244,
        isActive: true,
      },
      {
        id: 'chennai-arumbakkam',
        stationName: 'Arumbakkam, Chennai - TNPCB',
        dataGovFilterName: 'Arumbakkam, Chennai - TNPCB',
        city: 'Chennai',
        cityId: 'chennai',
        state: 'Tamil Nadu',
        agency: 'TNPCB',
        latitude: 13.072,
        longitude: 80.207,
        isActive: true,
      },
      {
        id: 'chennai-kodungaiyur',
        stationName: 'Kodungaiyur, Chennai - TNPCB',
        dataGovFilterName: 'Kodungaiyur, Chennai - TNPCB',
        city: 'Chennai',
        cityId: 'chennai',
        state: 'Tamil Nadu',
        agency: 'TNPCB',
        latitude: 13.136,
        longitude: 80.264,
        isActive: true,
      },
      {
        id: 'chennai-manali',
        stationName: 'Manali, Chennai - CPCB',
        dataGovFilterName: 'Manali, Chennai - CPCB',
        city: 'Chennai',
        cityId: 'chennai',
        state: 'Tamil Nadu',
        agency: 'CPCB',
        latitude: 13.167,
        longitude: 80.258,
        isActive: true,
      },
    ],
  },
  jaipur: {
    id: 'jaipur',
    name: { en: 'Jaipur', hi: 'जयपुर' },
    aliases: ['jaipur', 'pink city', 'गुलाबी नगर'],
    state: 'Rajasthan',
    cpcbCityName: 'Jaipur',
    latitude: 26.9124,
    longitude: 75.7873,
    hasOfficialStations: true,
    stations: [
      {
        id: 'jaipur-adarsh-nagar',
        stationName: 'Adarsh Nagar, Jaipur - RSPCB',
        dataGovFilterName: 'Adarsh Nagar, Jaipur - RSPCB',
        city: 'Jaipur',
        cityId: 'jaipur',
        state: 'Rajasthan',
        agency: 'RSPCB',
        latitude: 26.899,
        longitude: 75.828,
        isActive: true,
      },
      {
        id: 'jaipur-police-commissionerate',
        stationName: 'Police Commissionerate, Jaipur - RSPCB',
        dataGovFilterName: 'Police Commissionerate, Jaipur - RSPCB',
        city: 'Jaipur',
        cityId: 'jaipur',
        state: 'Rajasthan',
        agency: 'RSPCB',
        latitude: 26.917,
        longitude: 75.801,
        isActive: true,
      },
    ],
  },
  jamshedpur: {
    id: 'jamshedpur',
    name: { en: 'Jamshedpur', hi: 'जमशेदपुर' },
    aliases: ['jamshedpur', 'tatanagar', 'टाटानगर'],
    state: 'Jharkhand',
    cpcbCityName: 'Jamshedpur',
    latitude: 22.8046,
    longitude: 86.2029,
    hasOfficialStations: false, // No operational continuous CAAQMS station reporting to data.gov.in; preserves transparent CAMS model forecast fallback
    stations: [],
  },
  jorapokhar: {
    id: 'jorapokhar',
    name: { en: 'Jorapokhar', hi: 'जोरापोखर' },
    aliases: ['jorapokhar', 'jharia', 'जोरापोखर'],
    state: 'Jharkhand',
    cpcbCityName: 'Jorapokhar',
    latitude: 23.71,
    longitude: 86.41,
    hasOfficialStations: true,
    stations: [
      {
        id: 'jorapokhar-tata-stadium',
        stationName: 'Tata Stadium, Jorapokhar - JSPCB',
        dataGovFilterName: 'Tata Stadium, Jorapokhar - JSPCB',
        city: 'Jorapokhar',
        cityId: 'jorapokhar',
        state: 'Jharkhand',
        agency: 'JSPCB',
        latitude: 23.71,
        longitude: 86.41,
        isActive: true,
      },
    ],
  },
  shimla: {
    id: 'shimla',
    name: { en: 'Shimla', hi: 'शिमला' },
    aliases: ['shimla', 'simla', 'शमला'],
    state: 'Himachal Pradesh',
    cpcbCityName: 'Shimla',
    latitude: 31.1048,
    longitude: 77.1734,
    hasOfficialStations: false, // Location without continuous CAAQMS station (transparent CAMS forecast fallback)
    stations: [],
  },
};

/**
 * Normalizes user query or URL parameter into a registered CityRegistryEntry.
 * Handles case-insensitivity, leading/trailing spaces, and city aliases.
 */
export function normalizeCityQuery(query: string): CityRegistryEntry | undefined {
  if (!query || typeof query !== 'string') return undefined;

  const clean = query.trim().toLowerCase();

  // 1. Direct key match
  if (CITY_REGISTRY[clean]) {
    return CITY_REGISTRY[clean];
  }

  // 2. Search aliases, names, and CPCB names
  for (const entry of Object.values(CITY_REGISTRY)) {
    if (entry.id.toLowerCase() === clean) return entry;
    if (entry.name.en.toLowerCase() === clean) return entry;
    if (entry.name.hi.toLowerCase() === clean) return entry;
    if (entry.cpcbCityName.toLowerCase() === clean) return entry;
    if (entry.aliases.some((alias) => alias.toLowerCase() === clean)) return entry;
  }

  // 3. Substring or partial match (e.g., "bengaluru south", "delhi-ncr")
  for (const entry of Object.values(CITY_REGISTRY)) {
    if (clean.includes(entry.id) || entry.aliases.some((a) => clean.includes(a.toLowerCase()))) {
      return entry;
    }
  }

  return undefined;
}

/**
 * Look up stations for a given city query or ID.
 */
export function getStationsForCity(cityQuery: string): CpcbStationInfo[] {
  const city = normalizeCityQuery(cityQuery);
  return city?.stations ?? [];
}

/**
 * Find a station in a city by its ID or exact filter name.
 */
export function getStationInCity(
  cityIdOrName: string,
  stationIdOrName: string
): CpcbStationInfo | undefined {
  const city = normalizeCityQuery(cityIdOrName);
  if (!city) return undefined;

  const target = stationIdOrName.trim().toLowerCase();
  return city.stations.find(
    (st) =>
      st.id.toLowerCase() === target ||
      st.stationName.toLowerCase() === target ||
      st.dataGovFilterName.toLowerCase() === target ||
      st.aliases?.some((a) => a.toLowerCase() === target || target.includes(a.toLowerCase())) ||
      st.stationName.toLowerCase().includes(target)
  );
}
