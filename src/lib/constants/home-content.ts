export interface TimelineStep {
  time: string;
  title: string;
  aqiEstimate: number;
  severity: 'severe' | 'poor' | 'moderate';
  vayuPose: 'alert' | 'thinking' | 'greeting' | 'celebrating';
  vayuAdvice: string;
  mechanism: string;
  action: string;
}

export function getTimelineSteps(isHindi: boolean): TimelineStep[] {
  return [
    {
      time: '07:30 AM',
      title: isHindi ? 'सुबह का इनवर्जन व स्कूल बस' : 'Morning Thermal Inversion & School Run',
      aqiEstimate: 360,
      severity: 'severe',
      vayuPose: 'alert',
      vayuAdvice: isHindi
        ? 'ठंडी सतह पर धुआं और धूल जम गई है। बाहर कसरत न करें। बच्चों को सही फिटेड N95 मास्क पहनाएं।'
        : 'Cold surface air traps diesel soot and dust at ground level. Avoid outdoor cardio. Ensure kids wear well-fitted N95 masks.',
      mechanism: isHindi
        ? 'रात की ठंडी हवा गर्म हवा के नीचे दब जाती है (Thermal Inversion)। यह एक ढक्कन की तरह प्रदूषण को जमीन पर रोक लेती है।'
        : 'Radiative surface cooling creates a temperature inversion lid, trapping morning traffic soot and smoke in the first 50 meters of the atmosphere.',
      action: isHindi
        ? 'खिड़कियां बंद रखें, इनडोर HEPA/DIY फिल्टर चलाएं, खुले में दौड़ने से बचें।'
        : 'Keep windows sealed, activate indoor HEPA/DIY air cleaning, shift morning exercise indoors.',
    },
    {
      time: '11:00 AM',
      title: isHindi ? 'सुबह का काम व इनडोर सुरक्षा' : 'Midday Workplace & Classrooms',
      aqiEstimate: 280,
      severity: 'poor',
      vayuPose: 'thinking',
      vayuAdvice: isHindi
        ? 'कमरे में हवा का बहाव बनाए रखें। यदि प्यूरीफायर चालू है तो PM2.5 30 से नीचे बना रहेगा।'
        : 'Classroom and office doors opening frequently cause air exchange. Run high-CADR air cleaning to keep PM2.5 below 30.',
      mechanism: isHindi
        ? 'दिन चढ़ने के साथ तापमान बढ़ता है और इनवर्जन परत थोड़ी ऊपर उठने लगती है, परंतु परिवेशी हवा अब भी हानिकारक है।'
        : 'Solar heating begins breaking the inversion lid, but heavy industrial and residual vehicular soot keeps ambient air in the Poor category.',
      action: isHindi
        ? 'कमरे का दरवाजा बार-बार न खोलें, AC को इनडोर सर्कुलेशन मोड पर रखें।'
        : 'Ensure AC vents are set to recirculate, keep doors closed, and run HEPA filtration continuously.',
    },
    {
      time: '02:00 PM',
      title: isHindi ? 'दोपहर की धूप व त्वरित संवातन' : 'Afternoon Solar Ventilation Window',
      aqiEstimate: 160,
      severity: 'moderate',
      vayuPose: 'greeting',
      vayuAdvice: isHindi
        ? 'सशर्त फैलाव समय — इनडोर CO2 निकालने के लिए केवल तभी 10-15 मिनट वेंटिलेशन करें यदि स्थानीय AQI ≤ 200 हो और घर में कोई गंभीर संवेदनशील सदस्य न हो। मध्यम AQI पूरी तरह सुरक्षित हवा नहीं है। MoHFW परामर्श अनुसार >200 AQI में खिड़कियां पूरी तरह बंद रखें।'
        : 'Conditional dispersion window — brief 10–15 min cross-ventilation to flush indoor CO2 only if local ambient AQI is verified ≤ 200 and household has no acute sensitive members. Moderate AQI still carries particulate risk; it is not universally safe air. Keep windows sealed during Poor to Severe episodes (>200 AQI) as advised by MoHFW/NCDC.',
      mechanism: isHindi
        ? 'दोपहर की धूप से मिक्सिंग ऊंचाई (1,200–1,500 मी) बढ़ने से सुबह की तुलना में सापेक्ष फैलाव मिलता है, परंतु मध्यम AQI भी संवेदनशील लोगों के लिए असुविधाजनक हो सकता है।'
        : 'Peak solar boundary layer elevation (1,200–1,800m) dilutes ground concentrations relative to morning peaks. However, Moderate AQI still affects sensitive individuals and is not universally clean.',
      action: isHindi
        ? 'पहले स्थानीय AQI जांचें: यदि ≤ 200 है तो 10-15 मिनट सीमित वेंटिलेशन करें; यदि AQI > 200 है तो खिड़कियां सील रखकर फिल्ट्रेशन चलाएं।'
        : 'Verify local AQI first: brief 10–15 min ventilation only if verified ≤ 200 without local smoke; if >200 AQI or sensitive members are present, keep sealed and run filtration.',
    },
    {
      time: '06:30 PM',
      title: isHindi ? 'शाम का पीक ट्रैफिक व घर वापसी' : 'Evening Peak Commute Spike',
      aqiEstimate: 340,
      severity: 'severe',
      vayuPose: 'alert',
      vayuAdvice: isHindi
        ? 'तापमान गिरते ही प्रदूषण दोबारा बढ़ गया है। मेट्रो या इलेक्ट्रिक बस चुनें, ऑटो या कैब में खिड़कियां बंद रखें।'
        : 'Rapid surface cooling re-forms the inversion trap. Choose metro rail over idling car or auto-rickshaw transit.',
      mechanism: isHindi
        ? 'शाम के ट्रैफिक का धुआं और गिरता तापमान मिलकर दोबारा गंभीर स्मॉग बनाते हैं। सड़कों पर PM2.5 सामान्य से 5 गुना अधिक होता है।'
        : 'Sun sets, surface rapidly cools, trapping evening rush-hour emissions directly at street breathing height.',
      action: isHindi
        ? 'कार में रीसर्क्युलेशन चालू रखें, मेट्रो का उपयोग करें, सड़क किनारे वॉक न करें।'
        : 'Use metro rail (filtered underground cabins), set car HVAC to internal recirculation, avoid street walks.',
    },
    {
      time: '10:00 PM',
      title: isHindi ? 'रात का बेडरूम व सुरक्षित नींद' : 'Night Bedroom Clean-Air Sanctuary',
      aqiEstimate: 390,
      severity: 'severe',
      vayuPose: 'celebrating',
      vayuAdvice: isHindi
        ? 'सोने के कमरे में HEPA या DIY MERV-13 फिल्टर चालू रखें। सीलबंद बेडरूम में PM2.5 सांद्रता कम (<15 µg/m³) बनाए रखें।'
        : 'Run your sealed bedroom air cleaner overnight to maintain low particulate air (<15 µg/m³ with adequate CADR).',
      mechanism: isHindi
        ? 'रातभर शांत हवा और ठंड के कारण बाहर स्मॉग चरम पर होता है। लेकिन सीलबंद बेडरूम में प्यूरीफायर 95%+ कण हटा देता है।'
        : 'Nighttime atmospheric stagnation creates the daily AQI peak outside, but an indoor sealed room with CADR > 200 achieves clean air.',
      action: isHindi
        ? 'खिड़की-दरवाजे बंद रखें, फिल्टर को मीडियम स्पीड पर चलाएं, आयनाइज़र का प्रयोग कभी न करें।'
        : 'Close room doors, run air purifier on medium whisper mode, never use ozone-generating ionizers.',
    },
  ];
}

export type RoomSizeKey = 'small' | 'medium' | 'large';
export type BudgetTierKey = 'free' | 'diy' | 'hepa';

export interface RoomSizeConfig {
  label: string;
  areaM2: number;
  volumeM3: number;
}

export function getRoomSizes(isHindi: boolean): Record<RoomSizeKey, RoomSizeConfig> {
  return {
    small: {
      label: isHindi ? 'छोटा कमरा (120 sq ft)' : 'Small Bedroom (120 sq ft)',
      areaM2: 11,
      volumeM3: 31,
    },
    medium: {
      label: isHindi ? 'मास्टर बेडरूम (200 sq ft)' : 'Master Bedroom (200 sq ft)',
      areaM2: 19,
      volumeM3: 53,
    },
    large: {
      label: isHindi ? 'लिविंग रूम (350 sq ft)' : 'Living Room (350 sq ft)',
      areaM2: 33,
      volumeM3: 92,
    },
  };
}

export interface BudgetOptionConfig {
  cost: string;
  title: string;
  cadr: number;
  achText: string;
  desc: string;
  vayuTip: string;
}

export function getBudgetOptions(isHindi: boolean): Record<BudgetTierKey, BudgetOptionConfig> {
  return {
    free: {
      cost: '₹0 (Free)',
      title: isHindi ? 'शून्य लागत: संपर्क कटौती' : 'Zero-Cost: Exposure Reduction',
      cadr: 0,
      achText: isHindi ? 'प्राकृतिक निस्पंदन' : 'Behavioral Protection',
      desc: isHindi
        ? 'दोपहर 1:30 से 2:30 के बीच ही सीमित संवातन करें। गीले सूती पर्दे की परत लगाएं। सुबह 6 से 9 बजे खिड़कियां सील रखें।'
        : 'Seal door and window gaps with rolled damp towels. Time ventilation strictly to solar afternoon (1:30 PM). Keep sleep area closed.',
      vayuTip: isHindi
        ? 'स्मार्ट समय प्रबंधन और सही सीलिंग से आप बिना किसी खर्च के 40% तक एक्सपोज़र घटा सकते हैं!'
        : 'Timing ventilation and sealing drafts cuts indoor exposure by up to 40% with zero spending!',
    },
    diy: {
      cost: '₹1,500 – ₹2,500',
      title: isHindi ? 'Corsi-Rosenthal DIY बॉक्स फैन' : 'Corsi-Rosenthal DIY Air Cleaner',
      cadr: 380,
      achText: '5.2 to 8.5 ACH',
      desc: isHindi
        ? 'एक आधुनिक 2012+ बॉक्स फैन (थर्मल फ्यूज युक्त) और 4x MERV-13 फिल्टर। यह ₹18,000 के महंगे कमर्शियल प्यूरीफायर से अधिक स्वच्छ हवा देता है।'
        : 'Standard box fan + 4 MERV-13 furnace filters taped into a cube. Delivers 380+ m³/h CADR, exceeding commercial units costing 10x more.',
      vayuTip: isHindi
        ? 'यह वैज्ञानिक रूप से सिद्ध, किफायती और बेहद प्रभावी है। बच्चों के बेडरूम के लिए सर्वोत्तम!'
        : 'Validated in published studies: effective high-CADR particle filtration at a fraction of the commercial price!',
    },
    hepa: {
      cost: '₹6,500 – ₹14,000',
      title: isHindi ? 'मानक HEPA H13 एयर प्यूरीफायर' : 'Standard True HEPA H13 Purifier',
      cadr: 300,
      achText: '4.8 to 6.2 ACH',
      desc: isHindi
        ? 'सच्चा HEPA H13 फिल्टर (0.3 माइक्रोन के 99.97% कण रोकता है)। ध्यान रहे: आयनाइज़र, यूवी लैंप या ओजोन वाले फीचर्स बंद रखें।'
        : 'True HEPA H13 mechanical filtration capturing 99.97% of fine PM2.5. Whisper-quiet for light sleepers. Always disable optional ionizers.',
      vayuTip: isHindi
        ? 'सर्टिफाइड H13 मैकेनिकल फिल्टर हमेशा सुरक्षित है। ओजोन या आयनाइज़र कभी चालू न करें।'
        : 'Quiet, compact, and highly reliable. Remember to replace pre-filters every 3 months during North Indian smog season.',
    },
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

export function getFaqItems(isHindi: boolean): FaqItem[] {
  return [
    {
      q: isHindi
        ? 'क्या घर के पौधे (NASA Clean Air Study) कमरे का प्रदूषण साफ कर सकते हैं?'
        : 'Can houseplants (NASA clean-air study) filter indoor room smog?',
      a: isHindi
        ? 'वैज्ञानिक रूप से नहीं। 1989 का नासा अध्ययन छोटे सीलबंद एक घन मीटर के कक्षों में किया गया था। वास्तविक कमरों में हवा लगातार बाहर-भीतर बदलती रहती है (1-2 Air Changes Per Hour)। वास्तविक कमरे की हवा को साफ करने के लिए प्रति वर्ग मीटर 10 से 1000 पौधों की आवश्यकता होगी। पौधे मानसिक शांति और घर की सुंदरता के लिए बहुत अच्छे हैं, परंतु वे एयर प्यूरीफायर का विकल्प नहीं हैं।'
        : 'Scientifically, no. The 1989 NASA study evaluated sealed 1 m³ Plexiglas chambers over days. In real Indian homes with normal air exchange rates (1-2 ACH), potted plants achieve negligible clean air delivery (CADR < 0.1 m³/h). You would need 10 to 1,000 plants per square meter to equal one standard air purifier. Keep plants for wellness and aesthetics, not particulate filtration.',
    },
    {
      q: isHindi
        ? 'Corsi-Rosenthal DIY एयर प्यूरीफायर क्या सुरक्षित है?'
        : 'Is a Corsi-Rosenthal DIY box fan air cleaner safe to run at home?',
      a: isHindi
        ? 'हाँ, बशर्ते इसे सही सुरक्षा नियमों के साथ बनाया जाए: 2012 या उसके बाद निर्मित बॉक्स फैन (जिसमें थर्मल फ्यूज लगा हो), MERV-13 या उच्चतर फिल्टर, सीलबंद डक्ट टेप असेंबली, और हवा का सही बहाव (पंखे से बाहर)। कभी भी पुराने/टूटे पंखे, असुरक्षित एक्सटेंशन कॉर्ड या बिना निगरानी के इसका उपयोग न करें। यह व्यावसायिक प्यूरीफायर का एक किफायती और वैज्ञानिक विकल्प है।'
        : 'Yes, provided safety rules are followed: Use a modern 2012-or-later box fan with thermal fuse motor protection, MERV-13 or higher rated pleated filters, airtight duct-tape sealing, and proper outward airflow. Never use damaged motors or ungrounded extension cords. DIY filtration is an affordable, peer-reviewed alternative endorsed by environmental scientists.',
    },
    {
      q: isHindi
        ? 'स्वास्थ्य मंत्रालय (MoHFW) की अक्टूबर 2025 एडवाइजरी मास्क के बारे में क्या कहती है?'
        : 'What does the Ministry of Health (MoHFW/NCDC) October 2025 advisory recommend regarding masks?',
      a: isHindi
        ? 'स्वास्थ्य मंत्रालय की एडवाइजरी के अनुसार प्राथमिक बचाव प्रदूषण के संपर्क को कम करना (Exposure Reduction) है। जब AQI बहुत खराब या गंभीर हो और बाहर निकलना अनिवार्य हो, केवल तभी चेहरे पर कसकर फिट होने वाले N95 या N99 रेस्पिरेटर का सशर्त उपयोग करने की सलाह दी जाती है। साधारण कपड़े का मास्क या ढीला सर्जिकल मास्क PM2.5 को नहीं रोकता।'
        : 'The October 2025 MoHFW/NCDC advisory emphasizes that exposure reduction (staying indoors during peak smog) is the primary defense. When outdoor transit is unavoidable during Poor to Severe AQI, conditionally wear a properly fitted N95 or N99 respirator with a tight perimeter seal. Cloth masks and loose surgical masks offer negligible protection against fine PM2.5.',
    },
    {
      q: isHindi
        ? 'CPCB स्टेशन डेटा और CAMS वायुमंडलीय मॉडल में क्या अंतर है?'
        : 'What is the difference between CPCB ground station data and CAMS atmospheric models?',
      a: isHindi
        ? 'CPCB डेटा वास्तविक जमीनी CAAQMS स्टेशनों द्वारा मापा गया प्रमाणित 24-घंटे का औसत है। CAMS (कॉपरनिकस) एक 45 किमी वैश्विक वायुमंडलीय मॉडल है जो उपग्रह और मौसम डेटा से पूर्वानुमान लगाता है। वायुदिशा हमेशा आधिकारिक CPCB को प्राथमिकता देती है और मॉडल डेटा को स्पष्ट रूप से दर्शाती है।'
        : 'CPCB telemetry comes from official continuous ambient air quality monitoring stations (CAAQMS) on the ground using 24-hour pollutant averages. Copernicus CAMS is a 45-km global atmospheric chemistry model predicting regional concentrations. VayuDisha prioritizes real CPCB ground data and clearly labels model estimates when station data is temporarily unavailable.',
    },
  ];
}
