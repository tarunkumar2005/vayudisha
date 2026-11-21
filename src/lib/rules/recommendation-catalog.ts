import { type AqiCategory } from '../aqi/aqi-breakpoints';

export type BudgetTier = 'low' | 'medium' | 'high';

export interface RecommendationTemplate {
  id: string;
  category: 'indoor' | 'outdoor' | 'protection' | 'travel' | 'lifestyle';
  budgetTier: BudgetTier;
  title: {
    en: string;
    hi: string;
  };
  summary: {
    en: string;
    hi: string;
  };
  actionSteps: {
    en: string[];
    hi: string[];
  };
  evidence: {
    source: string;
    url: string;
    fact: {
      en: string;
      hi: string;
    };
  };
  minAqiCategory: AqiCategory;
}

/**
 * Curated catalog of evidence-backed recommendations by budget tier and AQI threshold.
 */
export const RECOMMENDATION_CATALOG: RecommendationTemplate[] = [
  // --- LOW BUDGET (₹0 - ₹500) ---
  {
    id: 'wet_mopping_protocol',
    category: 'indoor',
    budgetTier: 'low',
    title: {
      en: 'Wet Mopping Instead of Dry Sweeping',
      hi: 'झाड़ू की जगह गीला पोंछा लगाएं',
    },
    summary: {
      en: 'Dry sweeping resuspends deposited toxic PM2.5 and PM10 particles into the indoor breathing zone.',
      hi: 'सूखी झाड़ू लगाने से जमीन पर बैठे जहरीले कण दोबारा हवा में उड़कर सांस में चले जाते हैं।',
    },
    actionSteps: {
      en: [
        'Use a damp microfiber mop twice daily to trap microparticles on floors.',
        'Avoid dry broom sweeping, especially in bedrooms and living rooms.',
        'Keep bathroom doors closed and turn on exhaust during cooking.',
      ],
      hi: [
        'सूक्ष्म कणों को हटाने के लिए दिन में दो बार गीले माइक्रोफाइबर पोंछे का उपयोग करें।',
        'कमरों में सूखी झाड़ू लगाने से पूरी तरह बचें।',
        'खाना बनाते समय रसोई का एग्जॉस्ट फैन चालू रखें और बाकी दरवाजे बंद रखें।',
      ],
    },
    evidence: {
      source: 'Central Pollution Control Board (CPCB) Household Advisory',
      url: 'https://cpcb.nic.in/',
      fact: {
        en: 'Wet cleaning reduces indoor resuspended particulate concentration by up to 40% compared to dry sweeping.',
        hi: 'गीली सफाई से सूखी झाड़ू की तुलना में घर के अंदर उड़ने वाले धूल कण 40% तक कम होते हैं।',
      },
    },
    minAqiCategory: 'Moderate',
  },
  {
    id: 'door_window_towel_seal',
    category: 'indoor',
    budgetTier: 'low',
    title: {
      en: 'Damp Towel Draft Stops for Doors & Windows',
      hi: 'दरवाजों और खिड़कियों के नीचे गीले तौलिये से सीलिंग',
    },
    summary: {
      en: 'Fine winter smog penetrates through floor door gaps and window joints via thermal chimney effects.',
      hi: 'सर्दियों का बारीक धुआं दरवाजों के नीचे की खाली जगह से तेजी से घर के अंदर घुसता है।',
    },
    actionSteps: {
      en: [
        'Roll an old damp towel or bedsheet tightly at the base of exterior-facing doors.',
        'Tape edges of rattling window panes with masking paper tape during peak smog hours (8 PM - 9 AM).',
      ],
      hi: [
        'बाहर खुलने वाले दरवाजों के नीचे पुराने गीले तौलिये को रोल करके लगाएं।',
        'रात और सुबह के समय खिड़की के किनारों को मास्किंग टेप से सील रखें।',
      ],
    },
    evidence: {
      source: 'US EPA Indoor Air Quality Guidelines for Smoke & Winter Inversion',
      url: 'https://www.epa.gov/indoor-air-quality-iaq',
      fact: {
        en: 'Sealing major exterior door clearances prevents up to 50% of ambient particulate infiltration during cold inversion hours.',
        hi: 'दरवाजों के नीचे की खाली जगह बंद करने से बाहर का 50% तक धुआं अंदर आने से रुकता है।',
      },
    },
    minAqiCategory: 'Poor',
  },
  {
    id: 'eliminate_indoor_incense',
    category: 'indoor',
    budgetTier: 'low',
    title: {
      en: 'Pause Incense, Agarbatti, Dhoop & Mosquito Coils',
      hi: 'अगरबत्ती, धूप और मच्छर अगरबत्ती का प्रयोग तुरंत रोकें',
    },
    summary: {
      en: 'Burning one agarbatti or mosquito coil in a closed room emits PM2.5 concentrations exceeding 500 µg/m³.',
      hi: 'बंद कमरे में एक अगरबत्ती या मच्छर अगरबत्ती जलाने से PM2.5 का स्तर 500 µg/m³ के खतरनाक स्तर को पार कर जाता है।',
    },
    actionSteps: {
      en: [
        'Replace burning coils with window mesh netting or electric vaporizers.',
        'Switch to LED diya/puja lights during severe smog periods.',
        'Avoid scented candles or room aerosol sprays which emit harmful volatile organic compounds (VOCs).',
      ],
      hi: [
        'मच्छर कॉइल की जगह मच्छरदानी या लिक्विड वेपोराइजर का प्रयोग करें।',
        'प्रदूषण के दौरान अगरबत्ती की जगह बिना धुएं वाली पूजा करें।',
        'कमरे में रूम फ्रेशनर या खुशबूदार मोमबत्तियों का इस्तेमाल न करें।',
      ],
    },
    evidence: {
      source: 'Indian Council of Medical Research (ICMR) Environmental Health Study',
      url: 'https://main.icmr.nic.in/',
      fact: {
        en: 'A single mosquito coil burning overnight releases particulate matter equivalent to approximately 75–100 cigarettes.',
        hi: 'रात भर जलने वाली एक मच्छर कॉइल लगभग 75 से 100 सिगरेट जितना खतरनाक धुआं छोड़ती है।',
      },
    },
    minAqiCategory: 'Moderate',
  },

  // --- MEDIUM BUDGET (₹500 - ₹5,000) ---
  {
    id: 'certified_n95_respirators',
    category: 'protection',
    budgetTier: 'medium',
    title: {
      en: 'Properly Fitted Certified N95/N99 Respirators (MoHFW/NCDC Advisory)',
      hi: 'प्रमाणित N95/N99 मास्क (स्वास्थ्य मंत्रालय परामर्श)',
    },
    summary: {
      en: 'In line with the Government of India October 2025 MoHFW/NCDC advisory, reducing exposure by staying indoors is primary. When stepping outdoors is essential, a properly fitted certified N95/N99/FFP2 respirator reduces fine particulate inhalation.',
      hi: 'भारत सरकार के अक्टूबर 2025 MoHFW/NCDC परामर्श के अनुसार, घर के अंदर रहना ही मुख्य बचाव है। यदि बाहर जाना जरूरी हो, तो प्रमाणित और सही फिटिंग वाला N95/N99 मास्क बारीक कणों से बचाव करता है।',
    },
    actionSteps: {
      en: [
        'Ensure an airtight facial seal around the bridge of your nose and under the chin. Facial hair prevents an effective seal.',
        'Ordinary cloth masks and loose surgical masks do NOT provide adequate filtration against microscopic PM2.5 particulates.',
        'Avoid respirators with exhalation valves when source control is needed or in dusty indoor crowds.',
        'Medical Advisory: Individuals with pre-existing cardiopulmonary disorders (COPD, asthma, heart failure), the frail elderly, and pregnant women should consult their physician before using tight-fitting respirators, as breathing resistance can cause discomfort or respiratory strain.',
      ],
      hi: [
        'मास्क को नाक और ठुड्डी पर अच्छी तरह दबाकर टाइट फिट करें। दाढ़ी होने पर हवा किनारों से लीक हो सकती है।',
        'साधारण कपड़े या सर्जिकल मास्क बारीक PM2.5 कणों को नहीं रोक पाते।',
        'गंभीर सांस या दिल की बीमारी वाले व्यक्ति टाइट मास्क लगाने से पहले डॉक्टर से सलाह लें, क्योंकि इससे सांस खींचने में जोर पड़ता है।',
        'मास्क गंदा होने या सांस लेने में भारीपन लगने पर नया प्रमाणित मास्क इस्तेमाल करें।',
      ],
    },
    evidence: {
      source: 'Government of India MoHFW/NCDC Air Pollution Health Advisory (Oct 2025) & BIS IS 9473',
      url: 'https://ncdc.mohfw.gov.in/',
      fact: {
        en: 'Properly fitted certified N95/N99 respirators filter >=95% of fine particles down to 0.3 microns when an airtight seal is maintained. Cloth masks do not provide PM2.5 protection.',
        hi: 'सही तरह फिट किया गया N95/N99 मास्क 0.3 माइक्रोन तक के 95% से अधिक बारीक कणों को रोकता है, जबकि कपड़े के मास्क PM2.5 को नहीं रोकते।',
      },
    },
    minAqiCategory: 'Poor',
  },
  {
    id: 'diy_box_fan_air_cleaner',
    category: 'indoor',
    budgetTier: 'medium',
    title: {
      en: 'Corsi-Rosenthal DIY Air Cleaner (Alternative Filtration Guidance)',
      hi: 'कॉर्सी-रोज़ेनथल DIY एयर क्लीनर (वैकल्पिक फिल्ट्रेशन दिशा-निर्देश)',
    },
    summary: {
      en: 'When commercial HEPA air cleaners are unavailable or unaffordable, a properly constructed Corsi-Rosenthal DIY box fan unit using a certified MERV-13 filter provides an effective alternative for supplemental indoor particulate reduction when strict electrical and assembly safety protocols are observed.',
      hi: 'जब व्यावसायिक HEPA प्यूरीफायर उपलब्ध या किफायती न हों, तब प्रमाणित MERV-13 फिल्टर और सुरक्षित पंखे से बना कॉर्सी-रोज़ेनथल DIY एयर क्लीनर सुरक्षा नियमों के पालन के साथ एक प्रभावी विकल्प है।',
    },
    actionSteps: {
      en: [
        'Fan Specification: Use only a newer box fan manufactured in 2012 or later that features an integrated thermal fused safety plug and carries UL or ETL safety marks. Older fans lack thermal overload protection and risk motor overheating under filter static resistance.',
        'Filter Specification: Secure a genuine MERV-13 or higher (or equivalent MPR 1900+ / FPR 10) HVAC pleat of matching dimensions (minimum 1-inch, preferably 2-inch thickness).',
        'Airflow Direction: Orient the filter airflow arrow pointing towards the fan intake (pulling air through the filter).',
        'Edge Sealing: Completely tape all perimeter edges and seams with heavy duct or foil tape to eliminate air bypass.',
        'Electrical & Operating Safety: Inspect fan and cord before use; never operate with frayed cords or daisy-chained extension cords. Never operate unattended overnight or in rooms with unsupervised small children or pets. Adhere to fan manufacturer instructions.',
        'Role: Use as an alternative when commercial purifiers are out of reach; do not substitute where certified commercial appliances with automatic safety shut-offs are accessible.',
      ],
      hi: [
        'पंखे का चयन: केवल 2012 या उसके बाद बना UL/ETL प्रमाणित बॉक्स फैन इस्तेमाल करें जिसमें थर्मल फ्यूज सेफ्टी प्लग हो। पुराने पंखे फिल्टर के दबाव से गर्म होकर आग का खतरा बन सकते हैं।',
        'फिल्टर का चयन: प्रमाणित MERV-13 या उससे उच्च रेटिंग वाला HVAC फिल्टर इस्तेमाल करें।',
        'हवा की दिशा: फिल्टर पर बने तीर के निशान को पंखे की तरफ रखें ताकि हवा फिल्टर से होकर ही निकले।',
        'किनारों की सीलिंग: सभी किनारों को डक्ट टेप से अच्छी तरह चिपकाएं ताकि बिना छनी हवा बाहर न निकले।',
        'सुरक्षा नियम: कटे-फटे तारों या खराब एक्सटेंशन कॉर्ड का प्रयोग न करें। इसे रात भर बिना निगरानी के या छोटे बच्चों के पास अकेला न चलाएं।',
        'भूमिका: इसे व्यावसायिक प्यूरीफायर न होने की स्थिति में एक किफायती विकल्प के रूप में अपनाएं।',
      ],
    },
    evidence: {
      source: 'US EPA Indoor Air Research & UC Davis Corsi-Rosenthal Foundation Testing',
      url: 'https://www.epa.gov/air-research/research-diy-air-cleaners-reduce-wildfire-smoke-indoors',
      fact: {
        en: 'Rigorous EPA laboratory testing confirms MERV-13 box fan assemblies achieve meaningful clean air delivery rates for particulates when 2012+ fused fans and sealed perimeters are used safely.',
        hi: 'ईपीए परीक्षणों से साबित हुआ है कि सही पंखे और सीलिंग के साथ MERV-13 फिल्टर हवा से बारीक कणों को हटाने में प्रभावी है।',
      },
    },
    minAqiCategory: 'Poor',
  },
  {
    id: 'air_purifying_indoor_plants',
    category: 'lifestyle',
    budgetTier: 'low',
    title: {
      en: 'Indoor Potted Plants (Biophilic & Psychological Wellness)',
      hi: 'घर के अंदर पौधे (पर्यावरण व मानसिक शांति)',
    },
    summary: {
      en: 'Scientific consensus (EPA and environmental health studies) confirms that potted indoor plants do NOT meaningfully filter PM2.5 particulates or purify hazardous smoggy air in real residential volumes. They provide biophilic, psychological, and aesthetic benefits, but must never be relied upon as an air purification or filtration method.',
      hi: 'वैज्ञानिक अध्ययनों (EPA व पर्यावरण स्वास्थ्य शोध) से यह स्पष्ट है कि गमले वाले पौधे घर के अंदर PM2.5 कणों को साफ करने या जहरीले धुएं को छानने में सक्षम नहीं हैं। ये मानसिक शांति और हरियाली के लिए अच्छे हैं, लेकिन इन्हें एयर प्यूरीफायर का विकल्प न मानें।',
    },
    actionSteps: {
      en: [
        'Maintain indoor plants for aesthetic enjoyment, humidity moderation, and personal well-being.',
        'Do NOT rely on plants for air purification or particulate reduction during smog episodes.',
        'Wipe plant leaves with a damp cloth periodically to remove settling household dust.',
        'Prioritize proven exposure reduction: keep windows closed during smog peaks, wet mop floors, and use mechanical filtration (HEPA or certified DIY).',
      ],
      hi: [
        'घर की सुंदरता और मानसिक सुकून के लिए पौधे लगाएं।',
        'प्रदूषण के दिनों में हवा साफ करने के लिए पौधों पर बिल्कुल निर्भर न रहें।',
        'पत्तों पर जमी धूल को समय-समय पर गीले कपड़े से पोंछें।',
        'हवा की सुरक्षा के लिए खिड़कियां बंद रखने, गीला पोंछा लगाने और मैकेनिकल फिल्टर (HEPA) को प्राथमिकता दें।',
      ],
    },
    evidence: {
      source: 'Cummings & Waring (2020), Journal of Exposure Science & Environmental Epidemiology / US EPA',
      url: 'https://www.nature.com/articles/s41370-019-0175-9',
      fact: {
        en: 'A comprehensive review of reported VOC and particulate removal efficiencies confirmed that potted plants in real building ventilation conditions have negligible impact on air quality compared to mechanical filtration.',
        hi: 'वैज्ञानिक समीक्षा ने पुष्टि की है कि वास्तविक कमरों में गमले वाले पौधों की वायु शोधन क्षमता मैकेनिकल फिल्ट्रेशन की तुलना में नगण्य होती है।',
      },
    },
    minAqiCategory: 'Satisfactory',
  },

  // --- HIGH BUDGET (₹5,000+) ---
  {
    id: 'true_hepa_purifier_h13',
    category: 'indoor',
    budgetTier: 'high',
    title: {
      en: 'True HEPA H13 Purifiers with Activated Carbon (Particle vs. Gas Removal)',
      hi: 'सच्चा HEPA H13 प्यूरीफायर व एक्टिवेटेड कार्बन (कण व गैस शोधन)',
    },
    summary: {
      en: 'True H13/H14 HEPA filters capture at least 99.97% of airborne particulate matter down to 0.3 microns (PM2.5, PM10, combustion soot). However, HEPA does NOT remove hazardous gases (NO2, SO2, CO, VOCs), which require a substantial activated carbon adsorbent bed. Sizing must deliver 4 to 5 Air Changes per Hour (ACH). Ozone-generating air cleaners are strictly prohibited.',
      hi: 'सच्चा H13/H14 HEPA फिल्टर 0.3 माइक्रोन तक के 99.97% महीन कणों (PM2.5, PM10, धुआं) को रोकता है। ध्यान दें कि HEPA फिल्टर जहरीली गैसों (NO2, SO2, CO) को नहीं रोकता; गैसों के लिए एक्टिवेटेड कार्बन जरूरी है। कमरे के अनुसार 4 से 5 एयर चेंज प्रति घंटा (ACH) क्षमता चुनें। ओजोन पैदा करने वाले प्यूरीफायर का प्रयोग बिल्कुल न करें।',
    },
    actionSteps: {
      en: [
        'CADR & Room Sizing: Calculate required Clean Air Delivery Rate (CADR in m³/h) to achieve at least 4 to 5 Air Changes per Hour: Target CADR = Room Area (m²) × Ceiling Height (m) × 4.5.',
        'Particle vs. Gas Distinction: Verify that the purifier combines a True HEPA filter for particulates with an activated carbon filter for odor/gas absorption.',
        'STRICT PROHIBITION OF OZONE GENERATORS: Never purchase ozone-generating air cleaners, ionizers, or electrostatic precipitators that produce ozone as a byproduct. Ozone is a severe lung irritant that damages airway epithelium and exacerbates asthma/COPD. Ensure certification under CARB (ozone emissions < 0.050 ppm).',
        'Placement & Maintenance: Position purifier at least 1–2 feet away from walls in the breathing zone. Replace pre-filters and main HEPA cartridges per manufacturer guidelines.',
      ],
      hi: [
        'कमरे का आकार व CADR: कम से कम 4 से 5 एयर चेंज प्रति घंटा (ACH) पाने के लिए सही क्षमता चुनें (कमरे का आयतन × 4.5 = आवश्यक CADR)।',
        'कण बनाम गैस का अंतर: सुनिश्चित करें कि प्यूरीफायर में धूल के लिए सच्चा HEPA और गैसों के लिए एक्टिवेटेड कार्बन दोनों हों।',
        'ओजोन प्यूरीफायर पर सख्त रोक: ओजोन पैदा करने वाले आयनाइज़र या इलेक्ट्रॉनिक प्यूरीफायर कभी न खरीदें। ओजोन फेफड़ों को गंभीर नुकसान पहुंचाती है। केवल प्रमाणित ओजोन-मुक्त (CARB certified) प्यूरीफायर लें।',
        'रखरखाव: प्यूरीफायर को दीवार से 1-2 फीट दूर रखें और समय पर फिल्टर बदलें।',
      ],
    },
    evidence: {
      source: 'MoHFW/NCDC Air Pollution Advisory & US EPA Air Cleaners in the Home Guidelines',
      url: 'https://www.epa.gov/indoor-air-quality-iaq/air-cleaners-and-air-filters-home',
      fact: {
        en: 'Properly sized True HEPA filtration lowers indoor PM2.5 by 65–85% in sealed rooms. Ozone-generating devices are explicitly warned against by health authorities worldwide as dangerous lung irritants.',
        hi: 'सही आकार का HEPA प्यूरीफायर बंद कमरों में PM2.5 को 65% से 85% तक घटाता है। स्वास्थ्य संस्थाओं द्वारा ओजोन उपकरणों को फेफड़ों के लिए हानिकारक घोषित किया गया है।',
      },
    },
    minAqiCategory: 'Moderate',
  },
  {
    id: 'realtime_laser_pm25_monitor',
    category: 'indoor',
    budgetTier: 'high',
    title: {
      en: 'Indoor Laser Particle AQI Monitor',
      hi: 'घर के लिए लेजर पार्टिकल AQI मॉनिटर',
    },
    summary: {
      en: 'Indoor pollution often differs drastically from outdoor station data due to cooking, smoking, and air infiltration.',
      hi: 'घर के अंदर की हवा अक्सर बाहर से अलग होती है। मॉनिटर से पता चलता है कि कब खिड़की खोलनी है या प्यूरीफायर चलाना है।',
    },
    actionSteps: {
      en: [
        'Monitor indoor PM2.5 to verify whether air sealing and purifiers are working effectively.',
        'Observe spikes during kitchen frying or external smog infiltration to take prompt corrective action.',
      ],
      hi: [
        'इनडोर PM2.5 पर नजर रखें ताकि यह सुनिश्चित हो सके कि प्यूरीफायर सही काम कर रहा है।',
        'रसोई में खाना बनने या धुआं घुसने पर तुरंत सतर्क होकर बचाव के कदम उठाएं।',
      ],
    },
    evidence: {
      source: 'World Health Organization (WHO) Global Air Quality Guidelines',
      url: 'https://www.who.int/publications/i/item/9789240034228',
      fact: {
        en: 'Laser scattering sensors enable actionable indoor ventilation management without guessing.',
        hi: 'लेजर सेंसर के सटीक आंकड़ों से बिना किसी भ्रम के घर की हवा को नियंत्रित किया जा सकता है।',
      },
    },
    minAqiCategory: 'Moderate',
  },

  // --- TRAVEL & LIFESTYLE ALTERNATIVES ---
  {
    id: 'metro_modal_shift',
    category: 'travel',
    budgetTier: 'low',
    title: {
      en: 'Shift Commute from Solo Car/Cab to Air-Filtered Metro Rail',
      hi: 'कार/कैब की जगह एयर-फिल्टर्ड मेट्रो रेल का उपयोग करें',
    },
    summary: {
      en: 'Sitting in road traffic exposes passengers to 3x higher in-cabin ultra-fine exhaust fumes than riding underground/elevated metro.',
      hi: 'सड़क पर ट्रैफिक में फंसने से मेट्रो की तुलना में 3 गुना अधिक जहरीला धुआं कार के अंदर पहुंचता है।',
    },
    actionSteps: {
      en: [
        'Utilize metro transit for longer legs of your daily commute.',
        'Use e-rickshaws or covered shared transit for first/last-mile connectivity.',
        'If car travel is unavoidable, set vehicle HVAC strictly to recirculate mode with a fresh cabin PM2.5 filter.',
      ],
      hi: [
        'अपने दैनिक सफर के मुख्य हिस्से के लिए मेट्रो का उपयोग करें।',
        'मेट्रो स्टेशन तक आने-जाने के लिए ई-रिक्शा का प्रयोग करें।',
        'अगर कार से जाना जरूरी हो तो एसी को री-सर्कुलेट (Recirculate) मोड पर रखें।',
      ],
    },
    evidence: {
      source: 'Delhi Metro Rail Corporation (DMRC) Environmental Impact Assessment & WRI India',
      url: 'https://www.delhimetrorail.com/',
      fact: {
        en: 'Switching 10 km daily commute to Metro avoids ~2.2 kg of CO2e per day while reducing street-level exhaust exposure.',
        hi: 'दैनिक 10 किमी सफर मेट्रो से करने पर रोज लगभग 2.2 किग्रा कार्बन उत्सर्जन कम होता है और जहरीले धुएं से बचाव होता है।',
      },
    },
    minAqiCategory: 'Satisfactory',
  },
];
