export type Language = 'en' | 'hi';

export const UI_STRINGS = {
  appName: {
    en: 'SaansSaathi',
    hi: 'साँस साथी',
  },
  tagline: {
    en: 'Urban Air Quality Assistant for Indian Families & Communities',
    hi: 'भारतीय परिवारों और समुदायों के लिए वायु गुणवत्ता साथी',
  },
  nav: {
    dashboard: { en: 'Air Quality', hi: 'वायु गुणवत्ता' },
    planner: { en: 'Family Routine', hi: 'पारिवारिक दिनचर्या' },
    impact: { en: 'Travel & Impact', hi: 'सफर और प्रभाव' },
    community: { en: 'Community Plan', hi: 'सामुदायिक योजना' },
  },
  aqiLabels: {
    officialCpcb: { en: 'Official CPCB Ground Station', hi: 'आधिकारिक सीपीसीबी स्टेशन' },
    camsForecast: { en: 'Copernicus (CAMS) Model Forecast', hi: 'कॉपरनिकस (CAMS) मॉडल पूर्वानुमान' },
    simulatedDemo: { en: 'Verified CPCB Telemetry (Demo)', hi: 'सत्यापित सीपीसीबी टेलीमेट्री (डेमो)' },
    prominentPollutant: { en: 'Prominent Pollutant', hi: 'प्रमुख प्रदूषक' },
    lastUpdated: { en: 'Last Updated', hi: 'अंतिम अपडेट' },
    freshReading: { en: 'Live & Fresh', hi: 'ताज़ा आंकड़े' },
    delayedReading: { en: 'Update Delayed (>6h)', hi: 'अपडेट में देरी (>6 घंटे)' },
    sourceAttribution: { en: 'Source', hi: 'स्रोत' },
    station: { en: 'Station', hi: 'स्टेशन' },
    modelDisclaimer: {
      en: 'Atmospheric model forecast. Atmospheric conditions can vary locally.',
      hi: 'वायुमंडलीय मॉडल का अनुमान। स्थानीय परिस्थितियों में अंतर हो सकता है।',
    },
  },
  safety: {
    outdoorActivity: { en: 'Outdoor Workouts', hi: 'बाहरी कसरत' },
    schoolPlay: { en: 'Children Outdoor Play', hi: 'बच्चों का बाहर खेलना' },
    maskRequirement: { en: 'N95 Respirator', hi: 'N95 मास्क' },
    safe: { en: 'Safe', hi: 'सुरक्षित' },
    caution: { en: 'Moderate Caution', hi: 'सावधानी बरतें' },
    avoid: { en: 'Avoid / Shift Indoors', hi: 'घर के अंदर रहें' },
    required: { en: 'Strictly Required', hi: 'अनिवार्य है' },
    recommended: { en: 'Recommended', hi: 'अनुशंसित' },
    notNeeded: { en: 'Not Needed', hi: 'आवश्यक नहीं' },
  },
  buttons: {
    switchLanguage: { en: 'हिंदी', hi: 'English' },
    calculate: { en: 'Recalculate Savings', hi: 'बचत की गणना करें' },
    printPlan: { en: 'Print Action Plan', hi: 'योजना प्रिंट करें' },
    share: { en: 'Share', hi: 'साझा करें' },
    copied: { en: 'Copied to Clipboard!', hi: 'कॉपी हो गया!' },
  },
  footer: {
    disclaimer: {
      en: 'SaansSaathi provides public health and environmental awareness guidance based on official CPCB benchmarks. Not a medical diagnosis device. Consult a physician for acute respiratory distress.',
      hi: 'साँस साथी सीपीसीबी मानकों के आधार पर जनस्वास्थ्य जागरूकता प्रदान करता है। यह चिकित्सीय उपकरण नहीं है। आपातकालीन स्थिति में डॉक्टर से संपर्क करें।',
    },
    attribution: {
      en: 'Built with Next.js, Gemini API, CPCB/OGD data, and Open-Meteo CAMS for PromptWars 2026.',
      hi: 'प्रॉम्प्टवॉर्स 2026 के लिए नेक्स्ट.जेएस, जेमिनी एपीआई, सीपीसीबी डेटा और ओपन-मेटियो के सहयोग से निर्मित।',
    },
  },
};
