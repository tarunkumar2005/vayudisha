'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { VayuMascot } from '@/components/brand/VayuMascot';
import {
  ShieldAlert,
  Car,
  Users,
  ArrowRight,
  Wind,
  CheckCircle2,
  AlertTriangle,
  Fan,
  Layers,
  ChevronDown,
  Info,
  Clock,
  Sparkles,
  HelpCircle,
  Activity,
  Sliders,
  Check,
} from 'lucide-react';

export default function HomePage() {
  const { language, aqiData, selectedCity } = useApp();
  const isHindi = language === 'hi';

  // Interactive Daily Timeline State
  const [activeTimeIndex, setActiveTimeIndex] = useState<number>(0);

  // Interactive Try It Widget State
  const [roomSize, setRoomSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [budgetTier, setBudgetTier] = useState<'free' | 'diy' | 'hepa'>('diy');

  // Interactive Bento Tile State (Corsi-Rosenthal vs Commercial)
  const [filterType, setFilterType] = useState<'diy' | 'commercial'>('diy');

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const current = aqiData?.current;

  // Timeline Data ("A Smoggy Tuesday")
  const timelineSteps = [
    {
      time: '07:30 AM',
      title: isHindi ? 'सुबह का इनवर्जन व स्कूल बस' : 'Morning Thermal Inversion & School Run',
      aqiEstimate: 360,
      severity: 'severe',
      vayuPose: 'alert' as const,
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
      vayuPose: 'thinking' as const,
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
      vayuPose: 'greeting' as const,
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
      vayuPose: 'alert' as const,
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
      vayuPose: 'celebrating' as const,
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

  // Try-It Calculation
  const roomSizes = {
    small: { label: isHindi ? 'छोटा कमरा (120 sq ft)' : 'Small Bedroom (120 sq ft)', areaM2: 11, volumeM3: 31 },
    medium: { label: isHindi ? 'मास्टर बेडरूम (200 sq ft)' : 'Master Bedroom (200 sq ft)', areaM2: 19, volumeM3: 53 },
    large: { label: isHindi ? 'लिविंग रूम (350 sq ft)' : 'Living Room (350 sq ft)', areaM2: 33, volumeM3: 92 },
  };

  const budgetOptions = {
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

  const currentCalc = budgetOptions[budgetTier];
  const currentVolume = roomSizes[roomSize].volumeM3;
  const estimatedAch = currentCalc.cadr > 0 ? (currentCalc.cadr / currentVolume).toFixed(1) : '0';

  // FAQ Data
  const faqs = [
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

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* ============================================================== */}
      {/* 1. HERO SECTION: ATMOSPHERIC STORYTELLING & COMPANION */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden pt-4 pb-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Core Brand Narrative */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E2DDD1] shadow-soft">
              <span className="w-2.5 h-2.5 rounded-full bg-[#047857] animate-ping" />
              <span className="text-xs font-extrabold text-[#174B36] uppercase tracking-wider">
                {isHindi ? 'वायुदिशा • बुद्धिमान पर्यावरण साथी' : 'VayuDisha • Intelligent Air Companion'}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-black text-[#174B36] tracking-tight leading-[1.1]">
                {isHindi ? (
                  <>
                    हवा की समझ, <br />
                    <span className="text-[#0F766E]">बेहतर कल।</span>
                  </>
                ) : (
                  <>
                    Know your air. <br />
                    <span className="text-[#0F766E]">Choose a better direction.</span>
                  </>
                )}
              </h1>
              <p className="text-lg sm:text-xl text-[#2D4A3E] font-medium max-w-xl leading-relaxed pt-2">
                {isHindi
                  ? 'भारतीय परिवारों और आरडब्ल्यूए के लिए सीपीसीबी प्रमाणित वायु गुणवत्ता, स्वास्थ्य मंत्रालय की सुरक्षा सलाह, किफायती इनडोर समाधान और टिकाऊ यात्रा सहायक।'
                  : 'An intelligent air-quality and sustainability companion helping Indian families understand local air conditions, reduce pollution exposure, and choose low-carbon transit.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-[#174B36] text-[#F6F4EB] font-bold text-sm shadow-card hover:bg-[#0E291D] hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                <span>{isHindi ? 'लाइव वायु गुणवत्ता देखें' : 'Explore Live Air Quality'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/planner"
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-white border border-[#E2DDD1] text-[#174B36] font-bold text-sm shadow-soft hover:bg-[#EAE5D7] active:scale-95 transition-all"
              >
                <ShieldAlert className="w-4 h-4 text-[#0F766E]" />
                <span>{isHindi ? 'पारिवारिक सुरक्षा दिनचर्या' : 'Build Family Routine'}</span>
              </Link>

              <Link
                href="/impact"
                className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-white border border-[#E2DDD1] text-[#174B36] font-bold text-sm shadow-soft hover:bg-[#EAE5D7] active:scale-95 transition-all"
              >
                <Car className="w-4 h-4 text-[#92400E]" />
                <span>{isHindi ? 'सफर व कार्बन बचत' : 'Travel Impact'}</span>
              </Link>
            </div>

            {/* Mascot Hero Welcome Speech */}
            <div className="pt-2">
              <VayuMascot
                pose="greeting"
                size="md"
                speechBubble={
                  isHindi
                    ? 'नमस्ते! मैं वायु हूँ। मैं प्रमाणित सीपीसीबी स्टेशन डेटा ट्रैक करता हूँ और आपको साफ हवा में जीने की सही दिशा दिखाता हूँ।'
                    : 'Hello! I am Vayu. I track verified CPCB station telemetry and guide you toward cleaner indoor air and safer transit.'
                }
              />
            </div>
          </div>

          {/* Right Column: Floating Live Telemetry Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative group bg-white border-2 border-[#174B36]/10 rounded-3xl p-6 sm:p-7 shadow-card hover:border-[#0F766E]/30 transition-all">
              {/* Floating Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2DDD1]">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      current?.isModelForecast ? 'bg-[#0F766E]' : 'bg-[#047857]'
                    } animate-pulse`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#174B36]">
                    {current?.isModelForecast
                      ? isHindi
                        ? 'वायुमंडलीय मॉडल'
                        : 'Atmospheric Model'
                      : isHindi
                        ? 'लाइव ग्राउंड स्टेशन'
                        : 'Live Ground Station'}
                  </span>
                </div>
                <span className="text-xs font-black text-[#0F766E] bg-[#0F766E]/10 px-2.5 py-1 rounded-full">
                  {isHindi ? aqiData?.city.name.hi : aqiData?.city.name.en}
                </span>
              </div>

              {/* AQI Display */}
              <div className="py-6 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#2D4A3E] uppercase tracking-wider">
                    {isHindi ? 'राष्ट्रीय वायु गुणवत्ता सूचकांक' : 'Indian National AQI'}
                  </div>
                  <div className="text-5xl sm:text-6xl font-black text-[#174B36] tracking-tight mt-1">
                    {current?.aqi ?? '--'}
                  </div>
                  <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-black bg-[#EAE5D7] text-[#174B36]">
                    <span>{isHindi ? current?.categoryHindi : current?.category}</span>
                    {current?.prominentPollutant && (
                      <span className="text-[11px] font-bold text-[#174B36]">
                        • {current.prominentPollutant}
                      </span>
                    )}
                  </div>
                </div>

                {/* Companion Micro Art */}
                <div className="w-24 h-24 flex items-center justify-center bg-[#F6F4EB] rounded-2xl border border-[#E2DDD1]">
                  <VayuMascot pose="thinking" size="sm" />
                </div>
              </div>

              {/* Station Info */}
              <div className="bg-[#F6F4EB] rounded-2xl p-3.5 text-xs text-[#2D4A3E] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#174B36]">{isHindi ? 'स्टेशन:' : 'Station:'}</span>
                  <span className="truncate max-w-[200px] font-semibold text-right">
                    {current?.stationName ?? 'CPCB CAAQMS Station'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>{isHindi ? 'डेटा स्रोत:' : 'Source:'}</span>
                  <span className="font-semibold text-[#0F766E]">{current?.dataSourceLabel}</span>
                </div>
              </div>

              {/* CTA Link to Full Dashboard */}
              <div className="pt-4">
                <Link
                  href="/dashboard"
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#174B36] text-[#F6F4EB] text-xs font-bold hover:bg-[#0E291D] transition-colors"
                >
                  <span>{isHindi ? 'पूर्ण विश्लेषण डैशबोर्ड खोलें' : 'View Full Telemetry Dashboard'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. "A SMOGGY TUESDAY" — DAILY SCROLL JOURNEY & ATMOSPHERIC INVERSION */}
      {/* ============================================================== */}
      <section className="bg-white border-2 border-[#174B36]/10 rounded-3xl p-6 sm:p-10 shadow-soft space-y-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174B36]/5 text-xs font-bold text-[#174B36]">
            <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{isHindi ? 'दैनिक विज्ञान • 24 घंटे का चक्र' : 'Atmospheric Science • Daily Smog Cycle'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#174B36] tracking-tight">
            {isHindi ? 'स्मॉग भरा मंगलवार: वायुदिशा के साथ एक दिन' : 'A Smoggy Tuesday: A Day with VayuDisha'}
          </h2>
          <p className="text-sm sm:text-base text-[#2D4A3E] font-medium leading-relaxed">
            {isHindi
              ? 'सर्दियों में प्रदूषण पूरे दिन एक जैसा नहीं रहता। तापमान इनवर्जन (Thermal Inversion) के कारण सुबह और शाम प्रदूषण चरम पर होता है, जबकि दोपहर में प्राकृतिक राहत मिलती है।'
              : 'Air pollution is not static throughout the day. Ground-level thermal inversion traps smoke in the early morning and late evening, while afternoon sunlight creates a brief ventilation window.'}
          </p>
        </div>

        {/* Timeline Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
          {timelineSteps.map((step, idx) => (
            <button
              key={step.time}
              onClick={() => setActiveTimeIndex(idx)}
              className={`flex-shrink-0 px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                activeTimeIndex === idx
                  ? 'bg-[#174B36] text-[#F6F4EB] border-[#174B36] shadow-soft'
                  : 'bg-[#F6F4EB] text-[#2D4A3E] border-[#E2DDD1] hover:bg-[#EAE5D7]'
              }`}
            >
              <div className="text-[11px] opacity-75">{step.time}</div>
              <div className="font-extrabold truncate max-w-[150px]">{step.title}</div>
            </button>
          ))}
        </div>

        {/* Selected Timeline Card with Vayu Reaction */}
        {(() => {
          const activeStep = timelineSteps[activeTimeIndex];
          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#F6F4EB]/70 border border-[#E2DDD1] rounded-3xl p-6 sm:p-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-[#174B36] text-[#F6F4EB]">
                    {activeStep.time}
                  </span>
                  <span className="text-xs font-extrabold text-[#92400E] bg-[#92400E]/10 px-3 py-1 rounded-full">
                    {isHindi ? `अनुमानित AQI: ${activeStep.aqiEstimate}` : `Estimated AQI: ${activeStep.aqiEstimate}`}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#174B36]">{activeStep.title}</h3>

                <div className="space-y-2 text-sm text-[#2D4A3E]">
                  <p className="font-bold text-[#174B36]">
                    {isHindi ? 'वायुमंडलीय विज्ञान:' : 'Atmospheric Mechanism:'}
                  </p>
                  <p className="leading-relaxed bg-white p-3.5 rounded-2xl border border-[#E2DDD1]">
                    {activeStep.mechanism}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-[#2D4A3E]">
                  <p className="font-bold text-[#0F766E]">
                    {isHindi ? 'सुरक्षा कार्ययोजना:' : 'Actionable Guidance:'}
                  </p>
                  <p className="leading-relaxed bg-white p-3.5 rounded-2xl border border-[#E2DDD1] font-semibold text-[#174B36]">
                    {activeStep.action}
                  </p>
                </div>
              </div>

              {/* Companion Reaction Box */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-[#E2DDD1] shadow-soft">
                <VayuMascot pose={activeStep.vayuPose} size="md" speechBubble={activeStep.vayuAdvice} />
              </div>
            </div>
          );
        })()}
      </section>

      {/* ============================================================== */}
      {/* 3. "SMALL HABITS, CLEANER AIR" — INTERACTIVE BENTO GRID */}
      {/* ============================================================== */}
      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174B36]/5 text-xs font-bold text-[#174B36]">
            <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{isHindi ? 'किफायती आदतें • बड़ा प्रभाव' : 'Practical Habits • Maximum Impact'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#174B36] tracking-tight">
            {isHindi ? 'छोटी आदतें, स्वच्छ हवा' : 'Small Habits, Cleaner Air'}
          </h2>
          <p className="text-sm sm:text-base text-[#2D4A3E] font-medium leading-relaxed">
            {isHindi
              ? 'महंगे एयर प्यूरीफायर पर लाखों खर्च करने की आवश्यकता नहीं है। विज्ञान-सम्मत समाधान घर और सफर दोनों जगह कारगर हैं।'
              : 'Clean indoor air does not require spending fortunes on luxury appliances. Scientifically proven micro-habits protect your lungs.'}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tile 1: Corsi-Rosenthal DIY Box Fan */}
          <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-4 hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#0F766E]/10 flex items-center justify-center text-[#0F766E]">
              <Fan className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#174B36]">
              {isHindi ? 'Corsi-Rosenthal DIY प्यूरीफायर' : 'Corsi-Rosenthal DIY Air Box'}
            </h3>
            <p className="text-xs text-[#2D4A3E] leading-relaxed">
              {isHindi
                ? 'एक मानक बॉक्स फैन और 4x MERV-13 फिल्टर। ₹2,000 से कम में ₹20,000 वाले प्यूरीफायर से अधिक क्लीन एयर डिलीवरी।'
                : '1 box fan + 4 MERV-13 filters = 380+ m³/h CADR at 1/10th the cost of commercial units. Proven particle capture.'}
            </p>
            {/* Interactive Toggle */}
            <div className="bg-[#F6F4EB] p-3 rounded-2xl text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-[#174B36]">
                <span>{filterType === 'diy' ? 'Corsi-Rosenthal DIY' : 'Commercial HEPA'}</span>
                <button
                  onClick={() => setFilterType(filterType === 'diy' ? 'commercial' : 'diy')}
                  className="text-[11px] text-[#0F766E] underline font-bold"
                >
                  {isHindi ? 'बदलें' : 'Toggle Compare'}
                </button>
              </div>
              <div className="text-[11px] text-[#2D4A3E]">
                {filterType === 'diy'
                  ? 'Cost: ~₹2,200 | CADR: ~380 m³/h | Filtration: 95%+ PM2.5'
                  : 'Cost: ~₹16,000 | CADR: ~280 m³/h | Filtration: 99.9% PM2.5'}
              </div>
            </div>
          </div>

          {/* Tile 2: N95 Respirator Seal Check */}
          <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-4 hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#92400E]/10 flex items-center justify-center text-[#92400E]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#174B36]">
              {isHindi ? 'N95 मास्क सील का महत्व' : 'N95 Perimeter Seal Science'}
            </h3>
            <p className="text-xs text-[#2D4A3E] leading-relaxed">
              {isHindi
                ? 'साधारण सर्जिकल मास्क के किनारों से 60%+ हवा बिना छने अंदर जाती है। केवल टाइट फिटेड N95 ही PM2.5 को रोकता है।'
                : 'Loose surgical and cloth masks leak over 60% of inhaled air around cheek edges. Only a tight perimeter N95 seal filters PM2.5.'}
            </p>
            <div className="bg-[#F6F4EB] p-3 rounded-2xl text-xs space-y-1 text-[#174B36] font-semibold">
              <div className="flex items-center gap-1.5 text-rose-700">
                <span>✕</span> <span>Cloth/Surgical: 20-30% effective</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-800">
                <span>✓</span> <span>Fitted N95/N99: 95%+ effective</span>
              </div>
            </div>
          </div>

          {/* Tile 3: Clean Transit Comparison */}
          <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-4 hover:shadow-card transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#047857]/10 flex items-center justify-center text-[#047857]">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-[#174B36]">
              {isHindi ? 'मेट्रो बनाम कार: 81% कम कार्बन उत्सर्जन' : 'Metro vs Car: 81% CO₂e Emissions Reduction'}
            </h3>
            <p className="text-xs text-[#2D4A3E] leading-relaxed">
              {isHindi
                ? 'सड़क पर ट्रैफिक जाम में बैठने से टेलपाइप धुआं सीधा फेफड़ों में जाता है। मेट्रो के कोच में फिल्टर की गई हवा मिलती है और प्रति यात्री उत्सर्जन 81% कम होता है।'
                : 'Sitting in road congestion exposes passengers to direct tailpipe diesel exhaust. Metro underground rail provides filtered air cabins and cuts per-passenger emissions by 81%.'}
            </p>
            <div className="bg-[#F6F4EB] p-3 rounded-2xl text-xs space-y-1 text-[#174B36] font-semibold">
              <div className="flex justify-between">
                <span>Solo Car Commute (Petrol):</span>
                <span className="font-bold text-rose-700">~150g CO2e/km</span>
              </div>
              <div className="flex justify-between">
                <span>Metro Rail Transit (DMRC):</span>
                <span className="font-bold text-emerald-800">~28g CO2e/km</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. "TRY IT" — 3 STEPS TO CLEAN INDOOR AIR (INTERACTIVE CALCULATOR) */}
      {/* ============================================================== */}
      <section className="bg-white border-2 border-[#174B36]/10 rounded-3xl p-6 sm:p-10 shadow-soft space-y-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174B36]/5 text-xs font-bold text-[#174B36]">
            <Sliders className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{isHindi ? 'इंटरएक्टिव टूल • 3 आसान चरण' : 'Interactive Demo • 3 Simple Steps'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#174B36] tracking-tight">
            {isHindi ? 'करके देखें: 3 चरणों में स्वच्छ इनडोर हवा' : 'Try It: 3 Steps to Clean Indoor Air'}
          </h2>
          <p className="text-sm sm:text-base text-[#2D4A3E] font-medium leading-relaxed">
            {isHindi
              ? 'अपने कमरे का आकार और बजट चुनें। वायुदिशा तुरंत गणना करके बताएगी कि आपका कमरा कितनी बार स्वच्छ हवा बदलेगा।'
              : 'Select your room size and budget. VayuDisha calculates your exact Clean Air Delivery Rate (CADR) and hourly air changes.'}
          </p>
        </div>

        {/* Step Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            {/* Step 1: Room Size */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-[#174B36] block">
                {isHindi ? 'चरण 1: कमरे का आकार चुनें' : 'Step 1: Select Room Size'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['small', 'medium', 'large'] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setRoomSize(sz)}
                    className={`p-3 rounded-2xl text-xs font-bold transition-all border text-center ${
                      roomSize === sz
                        ? 'bg-[#174B36] text-[#F6F4EB] border-[#174B36] shadow-soft'
                        : 'bg-[#F6F4EB] text-[#2D4A3E] border-[#E2DDD1] hover:bg-[#EAE5D7]'
                    }`}
                  >
                    {sz === 'small' ? '120 sq ft' : sz === 'medium' ? '200 sq ft' : '350 sq ft'}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Budget Tier */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-wider text-[#174B36] block">
                {isHindi ? 'चरण 2: अपना बजट चुनें' : 'Step 2: Choose Budget Tier'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['free', 'diy', 'hepa'] as const).map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setBudgetTier(bg)}
                    className={`p-3 rounded-2xl text-xs font-bold transition-all border text-center ${
                      budgetTier === bg
                        ? 'bg-[#174B36] text-[#F6F4EB] border-[#174B36] shadow-soft'
                        : 'bg-[#F6F4EB] text-[#2D4A3E] border-[#E2DDD1] hover:bg-[#EAE5D7]'
                    }`}
                  >
                    {bg === 'free' ? '₹0 (Free)' : bg === 'diy' ? 'DIY (~₹2k)' : 'HEPA (~₹9k)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: Instant Calculation Output Card */}
          <div className="bg-[#F6F4EB] border-2 border-[#174B36]/15 rounded-3xl p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DDD1]">
              <span className="text-xs font-black uppercase tracking-wider text-[#174B36]">
                {isHindi ? 'गणना परिणाम' : 'Calculated Air Delivery'}
              </span>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#174B36] text-[#F6F4EB]">
                {currentCalc.cost}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-[#174B36]">{currentCalc.title}</h3>
              <p className="text-xs text-[#2D4A3E] mt-1 leading-relaxed">{currentCalc.desc}</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-2xl border border-[#E2DDD1]">
                <div className="text-[11px] font-bold text-[#2D4A3E]">
                  {isHindi ? 'डिलीवरी दर (CADR)' : 'Clean Air Delivery Rate'}
                </div>
                <div className="text-2xl font-black text-[#0F766E] mt-0.5">
                  {currentCalc.cadr > 0 ? `${currentCalc.cadr} m³/h` : 'N/A'}
                </div>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#E2DDD1]">
                <div className="text-[11px] font-bold text-[#2D4A3E]">
                  {isHindi ? 'हवा में बदलाव (ACH)' : 'Air Changes Per Hour'}
                </div>
                <div className="text-2xl font-black text-[#174B36] mt-0.5">
                  {currentCalc.cadr > 0 ? `${estimatedAch} ACH` : 'Exposure Cut'}
                </div>
              </div>
            </div>

            {/* Engineering Formula & Ceiling Assumption */}
            <p className="text-[11px] text-[#587668] bg-white/70 p-2.5 rounded-xl border border-[#E2DDD1] leading-relaxed">
              📐 {isHindi
                ? `मानक 2.7 मी (9 फीट) छत ऊंचाई मानी गई (${roomSizes[roomSize].volumeM3} m³ आयतन)। सूत्र: ACH = CADR / कमरा आयतन। खिड़की-दरवाजे बंद रहने पर आधारित।`
                : `Assumes standard 2.7m (9 ft) ceiling height (${roomSizes[roomSize].volumeM3} m³ volume). Formula: ACH = CADR / Room Volume. Assumes sealed room enclosure.`}
            </p>

            {/* Vayu Feedback */}
            <div className="pt-2">
              <VayuMascot pose="celebrating" size="sm" speechBubble={currentCalc.vayuTip} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. "YOUR FAMILY, YOUR ENVIRONMENT" — DEMOGRAPHIC TAILORING */}
      {/* ============================================================== */}
      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174B36]/5 text-xs font-bold text-[#174B36]">
            <Users className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{isHindi ? 'परिवार की देखभाल' : 'Vulnerable Demographics'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#174B36] tracking-tight">
            {isHindi ? 'आपका परिवार, आपका परिवेश' : 'Your Family, Your Environment'}
          </h2>
          <p className="text-sm sm:text-base text-[#2D4A3E] font-medium leading-relaxed">
            {isHindi
              ? 'प्रदूषण का प्रभाव हर व्यक्ति पर एक जैसा नहीं होता। नवजात शिशुओं की सांस दर वयस्कों से दोगुनी होती है।'
              : 'Air pollution affects family members differently. Infants inhale twice as much air per kilogram of body weight compared to adults.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-3">
            <h3 className="text-base font-black text-[#174B36]">
              {isHindi ? 'नवजात व छोटे बच्चे' : 'Infants & Toddlers'}
            </h3>
            <p className="text-xs text-[#2D4A3E] leading-relaxed">
              {isHindi
                ? 'फेफड़ों का विकास जारी रहता है। सोने के कमरे में PM2.5 को 25 µg/m³ से नीचे रखें। सुबह की सैर पूरी तरह टालें।'
                : 'Lungs are still developing. Maintain indoor PM2.5 below 25 µg/m³. Strictly avoid morning stroller walks.'}
            </p>
          </div>

          <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-3">
            <h3 className="text-base font-black text-[#174B36]">
              {isHindi ? 'बुजुर्ग व हृदय रोगी' : 'Seniors & Cardiac Care'}
            </h3>
            <p className="text-xs text-[#2D4A3E] leading-relaxed">
              {isHindi
                ? 'बारीक कण खून में मिलकर हृदय पर दबाव डालते हैं। AQI > 200 पर बाहर की सैर को इनडोर वॉक में बदलें।'
                : 'Ultrafine PM2.5 causes systemic inflammation and cardiovascular strain. Shift walks indoors when AQI > 200.'}
            </p>
          </div>

          <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-3">
            <h3 className="text-base font-black text-[#174B36]">
              {isHindi ? 'अस्थमा व एलर्जी पीड़ित' : 'Asthma & Allergies'}
            </h3>
            <p className="text-xs text-[#2D4A3E] leading-relaxed">
              {isHindi
                ? 'ब्रोंकोस्पाज्म से बचने के लिए इनहेलर पास रखें। केवल यांत्रिक फिल्टर का उपयोग करें, रासायनिक सेंट से बचें।'
                : 'Keep rescue inhalers accessible. Avoid synthetic room fresheners or scented candles that emit volatile organics.'}
            </p>
          </div>

          <div className="bg-white border border-[#E2DDD1] rounded-3xl p-6 shadow-soft space-y-3">
            <h3 className="text-base font-black text-[#174B36]">
              {isHindi ? 'दैनिक यात्री व कम्यूटर' : 'Daily Commuters'}
            </h3>
            <p className="text-xs text-[#2D4A3E] leading-relaxed">
              {isHindi
                ? 'सड़क पर मास्क का टाइट सील रखें। कार में खिड़कियां बंद कर हमेशा इनडोर रीसर्क्युलेशन चालू रखें।'
                : 'Wear a well-fitted N95 on two-wheelers. In cars, close windows and set ventilation strictly to recirculation.'}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. TRANSPARENCY & SCIENTIFIC STANDARDS */}
      {/* ============================================================== */}
      <section className="bg-[#174B36] text-[#F6F4EB] rounded-3xl p-8 sm:p-12 shadow-card space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-white">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
            <span>{isHindi ? 'वैज्ञानिक पारदर्शिता सिद्धांत' : 'Scientific Transparency Principles'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {isHindi ? 'सत्य डेटा, शून्य झूठ' : 'Verified Data. Zero False Claims.'}
          </h2>
          <p className="text-sm sm:text-base text-[#F6F4EB]/90 leading-relaxed font-medium">
            {isHindi
              ? 'वायुदिशा कभी भी विदेशी सूचकांकों को भारतीय सीपीसीबी नहीं बताती। नासा के पौधों के अध्ययन को गलत तरीके से पेश नहीं करती। और कभी भी हानिकारक ओजोन जनरेटर की सिफारिश नहीं करती।'
              : 'VayuDisha strictly distinguishes official CPCB 24-hour CAAQMS station telemetry from Copernicus atmospheric models. We never label European AQI as Indian CPCB, never promote ozone generators, and debunk misleading houseplant claims.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
          <div>
            <h3 className="text-sm font-black text-white">
              {isHindi ? 'आधिकारिक सीपीसीबी स्टेशन' : 'Official CPCB Ground Data'}
            </h3>
            <p className="text-xs text-[#F6F4EB]/80 mt-1 leading-relaxed">
              {isHindi
                ? 'data.gov.in से लाइव CAAQMS स्टेशनों का 24-घंटे का औसत। स्टेशन नाम और टाइमस्टैम्प सहित।'
                : 'Real CAAQMS monitoring records from data.gov.in with station names and timestamps.'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-black text-white">
              {isHindi ? 'कॉपरनिकस CAMS मॉडल' : 'Copernicus CAMS Forecasts'}
            </h3>
            <p className="text-xs text-[#F6F4EB]/80 mt-1 leading-relaxed">
              {isHindi
                ? '45 किमी ग्रिड पर आधारित वायुमंडलीय रसायन पूर्वानुमान। इसे कभी ग्राउंड स्टेशन नहीं कहा जाता।'
                : '45-km global atmospheric dispersion model. Always labeled clearly as a forecast.'}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-black text-white">
              {isHindi ? 'गोपनीयता व शून्य पीआईआई' : 'Zero-PII Privacy Architecture'}
            </h3>
            <p className="text-xs text-[#F6F4EB]/80 mt-1 leading-relaxed">
              {isHindi
                ? 'कोई व्यक्तिगत डेटा स्टोर नहीं किया जाता। सभी गणनाएं डिवाइस और सर्वर मेमोरी में ही होती हैं।'
                : 'No tracking, no cookies, no personal identity storage. Client telemetry stays private.'}
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      {/* ============================================================== */}
      <section className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174B36]/5 text-xs font-bold text-[#174B36]">
            <HelpCircle className="w-3.5 h-3.5 text-[#0F766E]" />
            <span>{isHindi ? 'सामान्य प्रश्न' : 'Frequently Asked Questions'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#174B36] tracking-tight">
            {isHindi ? 'अक्सर पूछे जाने वाले सवाल' : 'Clear Answers to Air Questions'}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#E2DDD1] rounded-2xl overflow-hidden transition-all shadow-soft"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#174B36]"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#0F766E] transition-transform duration-200 shrink-0 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isExpanded && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#2D4A3E] font-medium leading-relaxed border-t border-[#E2DDD1]/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. CLOSING CTA BANNER: MEMORABLE VAYU CLOSING */}
      {/* ============================================================== */}
      <section className="relative bg-white border-2 border-[#174B36]/15 rounded-3xl p-8 sm:p-12 text-center shadow-card space-y-6 overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#0F766E]/5 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#EBA347]/10 pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-3 relative z-10">
          <div className="flex justify-center mb-2">
            <VayuMascot pose="peeking" size="md" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#174B36] tracking-tight">
            {isHindi ? 'हवा की समझ, बेहतर कल।' : 'A better direction starts with understanding the air.'}
          </h2>
          <p className="text-sm sm:text-base text-[#2D4A3E] font-medium leading-relaxed">
            {isHindi
              ? 'आज ही अपने शहर की आधिकारिक सीपीसीबी स्थिति देखें और अपने परिवार के लिए अनुकूलित सुरक्षा दिनचर्या बनाएं।'
              : 'Explore real-time CPCB telemetry for your city and generate an intelligent routine tailored to your family.'}
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Link
              href="/dashboard"
              className="px-6 py-3.5 rounded-2xl bg-[#174B36] text-[#F6F4EB] font-bold text-sm shadow-soft hover:bg-[#0E291D] active:scale-95 transition-all"
            >
              {isHindi ? 'वायु गुणवत्ता डैशबोर्ड' : 'Explore Air Dashboard'}
            </Link>

            <Link
              href="/planner"
              className="px-6 py-3.5 rounded-2xl bg-[#F6F4EB] border border-[#E2DDD1] text-[#174B36] font-bold text-sm shadow-soft hover:bg-[#EAE5D7] active:scale-95 transition-all"
            >
              {isHindi ? 'दैनिक दिनचर्या बनाएं' : 'Create Family Plan'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
