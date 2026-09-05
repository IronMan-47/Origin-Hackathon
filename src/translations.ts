export type Language = 'en' | 'hi' | 'bn' | 'mr' | 'ta' | 'te';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  navHome: string;
  navDashboard: string;
  navAdvisor: string;
  navSimulator: string;
  navCompare: string;
  navTrends: string;
  navExplorer: string;
  logout: string;
  recalibrate: string;
  safeWindowBadge: string;
  emergencyAction: string;
  liveTelemetrySync: string;
  temp: string;
  feelsLike: string;
  aqi: string;
  humidity: string;
  wind: string;
  pm25: string;
  uvIndex: string;
  aiAdvisory: string;
  recommendedActions: string;
  strictlyAvoid: string;
  vulnerabilityScore: string;
  primaryTriggers: string;
  chatPlaceholder: string;
  chatSend: string;
  compareTitle: string;
  compareSubtitle: string;
  cityA: string;
  cityB: string;
  verdict: string;
  
  // Simulator strings
  simulatorTitle: string;
  simulatorSubtitle: string;
  exposureDuration: string;
  exertionLevel: string;
  restingLevel: string;
  walkingLevel: string;
  runningLevel: string;
  maskSelection: string;
  noMask: string;
  clothMask: string;
  surgicalMask: string;
  n95Mask: string;
  ffp3Mask: string;
  inhalationImpact: string;
  unprotectedIntake: string;
  filteredIntake: string;
  preventedIntake: string;
  predictedStatus: string;
  
  // Trends strings
  trendsTitle: string;
  trendsSubtitle: string;
  hourlyTitle: string;
  lowerIsCleaner: string;
  dailyTitle: string;
  weeklyAuditTitle: string;
  weeklyPeakHours: string;
  weeklyGear: string;
  
  // Explorer strings
  explorerTitle: string;
  explorerSubtitle: string;
  searchPlaceholder: string;
  inspectedPoint: string;
  monitoringStation: string;

  // Additional UI strings
  healthierChoice: string;
  riskScore: string;
  verdictTitle: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "WeatherWise",
    tagline: "Personalized Environmental Health Intelligence",
    navHome: "Home Overview",
    navDashboard: "Dashboard",
    navAdvisor: "AI Health Advisor",
    navSimulator: "Lung & Mask Simulator",
    navCompare: "City Clash & Compare",
    navTrends: "24h & 7d Trends",
    navExplorer: "Global Map Explorer",
    logout: "Logout",
    recalibrate: "Edit Profile",
    safeWindowBadge: "Safest Window Today",
    emergencyAction: "Emergency Protocol",
    liveTelemetrySync: "Live Telemetry Sync",
    temp: "Temperature",
    feelsLike: "Feels like",
    aqi: "US AQI",
    humidity: "Humidity",
    wind: "Wind Speed",
    pm25: "PM 2.5",
    uvIndex: "UV Index",
    aiAdvisory: "AI Personalized Health Advisory",
    recommendedActions: "Recommended Safe Actions",
    strictlyAvoid: "Highly Advised to Avoid",
    vulnerabilityScore: "Vulnerability Score",
    primaryTriggers: "Primary Triggers",
    chatPlaceholder: "Ask about your breathing, outdoor workouts, or mask requirements...",
    chatSend: "Ask Advisor",
    compareTitle: "Location Comparison & Clash",
    compareSubtitle: "Evaluate dual-city environmental risk tailored to your health profile",
    cityA: "Primary Residence",
    cityB: "Target Destination",
    verdict: "Safety Verdict & Recommendation",

    simulatorTitle: "Mask & Lung Particulate Simulator",
    simulatorSubtitle: "Simulate real-time PM2.5 inhalation volume based on physical exertion, duration, and mask filtration efficiency.",
    exposureDuration: "Outdoor Exposure Duration",
    exertionLevel: "Exertion & Ventilation Rate",
    restingLevel: "Resting / Sitting (8 L/min)",
    walkingLevel: "Brisk Walking (18 L/min)",
    runningLevel: "Running / Heavy Labor (45 L/min)",
    maskSelection: "Protective Respirator Gear",
    noMask: "No Mask (0% Filter)",
    clothMask: "Cloth Mask (25% Filter)",
    surgicalMask: "Surgical Mask (50% Filter)",
    n95Mask: "NIOSH N95 Respirator (95% Filter)",
    ffp3Mask: "FFP3 / HEPA Mask (99% Filter)",
    inhalationImpact: "Inhalation Impact Model",
    unprotectedIntake: "Unprotected PM2.5 Intake",
    filteredIntake: "With Selected Mask",
    preventedIntake: "Prevented Alveolar Intake",
    predictedStatus: "Predicted Respiratory Status",

    trendsTitle: "Chrono-Environmental Telemetry",
    trendsSubtitle: "Predictive diurnal curves to schedule respiratory protection and avoid peak particulate concentration.",
    hourlyTitle: "24-Hour Hourly Particulate (AQI) Progression",
    lowerIsCleaner: "Lower is cleaner",
    dailyTitle: "7-Day Daily Temperature Outlook",
    weeklyAuditTitle: "Weekly Respiratory Exposure Audit",
    weeklyPeakHours: "High-Risk Exposure Windows: ~18 hours/week",
    weeklyGear: "Recommended Gear: NIOSH N95 Respirator for field shifts",

    explorerTitle: "Global Geospatial Live Map",
    explorerSubtitle: "Interactive OpenStreetMap & Open-Meteo visual canvas. Click anywhere on earth or search below to inspect live environmental metrics.",
    searchPlaceholder: "Search any coordinate, city or town...",
    inspectedPoint: "Inspected Geographic Point",
    monitoringStation: "Monitoring Station",

    healthierChoice: "Healthier Choice",
    riskScore: "Risk Score",
    verdictTitle: "Personal Health Safety Verdict"
  },

  hi: {
    appName: "वेदरवाइज़ (WeatherWise)",
    tagline: "व्यक्तिगत पर्यावरणीय स्वास्थ्य सुरक्षा",
    navHome: "होम ओवरव्यू",
    navDashboard: "डैशबोर्ड",
    navAdvisor: "AI स्वास्थ्य सलाहकार",
    navSimulator: "मास्क व फेफड़े सिमुलेटर",
    navCompare: "शहर तुलना (Clash)",
    navTrends: "24 घंटे व 7 दिन रुझान",
    navExplorer: "ग्लोबल मैप एक्सप्लोरर",
    logout: "लॉगआउट",
    recalibrate: "प्रोफ़ाइल बदलें",
    safeWindowBadge: "आज का सबसे सुरक्षित समय",
    emergencyAction: "आपातकालीन प्रोटोकॉल",
    liveTelemetrySync: "लाइव मौसम व वायु गुणवत्ता सिंक",
    temp: "तापमान",
    feelsLike: "महसूस हो रहा है",
    aqi: "वायु गुणवत्ता (AQI)",
    humidity: "नमी (आर्द्रता)",
    wind: "हवा की गति",
    pm25: "PM 2.5 कण",
    uvIndex: "यूवी इंडेक्स",
    aiAdvisory: "AI व्यक्तिगत स्वास्थ्य परामर्श",
    recommendedActions: "सुरक्षित सुझाव",
    strictlyAvoid: "किन चीजों से बचें",
    vulnerabilityScore: "स्वास्थ्य जोखिम स्कोर",
    primaryTriggers: "मुख्य ट्रिगर कारक",
    chatPlaceholder: "दवा, मास्क, दौड़ने या प्रदूषण के बारे में पूछें...",
    chatSend: "पूछें",
    compareTitle: "स्थान तुलना व सुरक्षा विश्लेषण",
    compareSubtitle: "अपनी स्वास्थ्य स्थिति के आधार पर दो शहरों के जोखिम की तुलना करें",
    cityA: "वर्तमान शहर",
    cityB: "गंतव्य शहर",
    verdict: "सुरक्षा निर्णय व सलाह",

    simulatorTitle: "मास्क व फेफड़े प्रदूषण सिमुलेटर",
    simulatorSubtitle: "शारीरिक परिश्रम, समय और मास्क फिल्टर क्षमता के आधार पर फेफड़ों में जाने वाले PM2.5 कणों की गणना करें।",
    exposureDuration: "बाहर रहने की अवधि",
    exertionLevel: "शारीरिक गतिविधि व सांस लेने की दर",
    restingLevel: "विश्राम / बैठना (8 लीटर/मिनट)",
    walkingLevel: "तेज़ चलना (18 लीटर/मिनट)",
    runningLevel: "दौड़ना / भारी काम (45 लीटर/मिनट)",
    maskSelection: "सुरक्षात्मक मास्क का प्रकार",
    noMask: "कोई मास्क नहीं (0% फ़िल्टर)",
    clothMask: "कपड़े का मास्क (25% फ़िल्टर)",
    surgicalMask: "सर्जिकल मास्क (50% फ़िल्टर)",
    n95Mask: "N95 रेस्पिरेटर (95% फ़िल्टर)",
    ffp3Mask: "FFP3 / HEPA मास्क (99% फ़िल्टर)",
    inhalationImpact: "सांस द्वारा प्रदूषण का मॉडल",
    unprotectedIntake: "बिना मास्क के कुल PM2.5 कण",
    filteredIntake: "चयनित मास्क के साथ कण",
    preventedIntake: "फेफड़ों में जाने से बचाए गए कण",
    predictedStatus: "अनुमानित श्वसन जोखिम स्थिति",

    trendsTitle: "मौसम व वायु गुणवत्ता रुझान",
    trendsSubtitle: "सुरक्षित समय चुनने और प्रदूषण के चरम घंटों से बचने के लिए पूर्वानुमान डेटा।",
    hourlyTitle: "24-घंटे का वायु गुणवत्ता (AQI) चक्र",
    lowerIsCleaner: "कम अंक = स्वच्छ हवा",
    dailyTitle: "7-दिवसीय तापमान पूर्वानुमान",
    weeklyAuditTitle: "साप्ताहिक प्रदूषण जोखिम ऑडिट",
    weeklyPeakHours: "उच्च जोखिम समय: ~18 घंटे/सप्ताह",
    weeklyGear: "अनुशंसित सुरक्षा: N95 रेस्पिरेटर मास्क",

    explorerTitle: "ग्लोबल लाइव मैप एक्सप्लोरर",
    explorerSubtitle: "विश्व में कहीं भी क्लिक करें या शहर खोजें और लाइव पर्यावरण डेटा देखें।",
    searchPlaceholder: "कोई भी शहर या स्थान खोजें...",
    inspectedPoint: "चुना गया भौगोलिक स्थान",
    monitoringStation: "मॉनिटरिंग स्टेशन",

    healthierChoice: "अधिक सुरक्षित विकल्प",
    riskScore: "जोखिम स्कोर",
    verdictTitle: "व्यक्तिगत स्वास्थ्य सुरक्षा निर्णय"
  },

  bn: {
    appName: "ওয়েদারওয়াইজ (WeatherWise)",
    tagline: "ব্যক্তিগত পরিবেশগত স্বাস্থ্য সুরক্ষা",
    navHome: "হোম ওভারভিউ",
    navDashboard: "ড্যাশবোর্ড",
    navAdvisor: "এআই স্বাস্থ্য উপদেষ্টা",
    navSimulator: "মাস্ক ও ফুসফুস সিমুলেটর",
    navCompare: "শহর তুলনা (Clash)",
    navTrends: "২৪ ঘণ্টা ও ৭ দিনের ট্রেন্ড",
    navExplorer: "গ্লোবাল ম্যাপ এক্সপ্লোরার",
    logout: "লগআউট",
    recalibrate: "প্রোফাইল পরিবর্তন",
    safeWindowBadge: "আজকের সবচেয়ে নিরাপদ সময়",
    emergencyAction: "জরুরি প্রোটোকল",
    liveTelemetrySync: "লাইভ আবহাওয়া ও বায়ুমান সিঙ্ক",
    temp: "তাপমাত্রা",
    feelsLike: "অনুভূত তাপমাত্রা",
    aqi: "বায়ুমান (AQI)",
    humidity: "আর্দ্রতা",
    wind: "বাতাসের গতি",
    pm25: "PM ২.৫ কণা",
    uvIndex: "ইউভি ইনডেক্স",
    aiAdvisory: "এআই ব্যক্তিগত স্বাস্থ্য পরামর্শ",
    recommendedActions: "নিরাপদ পরামর্শ",
    strictlyAvoid: "যা এড়িয়ে চলবেন",
    vulnerabilityScore: "স্বাস্থ্য ঝুঁকি স্কোর",
    primaryTriggers: "প্রধান ট্রিগার উপাদান",
    chatPlaceholder: "মাস্ক, ব্যায়াম বা বায়ুদূষণ নিয়ে প্রশ্ন করুন...",
    chatSend: "পরামর্শ নিন",
    compareTitle: "স্থান তুলনা ও ঝুঁকি বিশ্লেষণ",
    compareSubtitle: "আপনার স্বাস্থ্য প্রোফাইল অনুযায়ী দুটি শহরের পরিবেশগত ঝুঁকি তুলনা করুন",
    cityA: "বর্তমান বাসস্থান",
    cityB: "গন্তব্য শহর",
    verdict: "সুরক্ষা সিদ্ধান্ত ও পরামর্শ",

    simulatorTitle: "মাস্ক ও ফুসফুস কণা সিমুলেটর",
    simulatorSubtitle: "শারীরিক পরিশ্রম, সময় এবং মাস্কের ফিল্টার দক্ষতার ওপর ভিত্তি করে PM2.5 কণার পরিমাণ হিসাব করুন।",
    exposureDuration: "বাইরে থাকার সময়কাল",
    exertionLevel: "শারীরিক পরিশ্রম ও শ্বাস-প্রশ্বাসের হার",
    restingLevel: "বিশ্রাম / বসা (৮ লি/মিনিট)",
    walkingLevel: "দ্রুত হাঁটা (১৮ লি/মিনিট)",
    runningLevel: "দৌড়ানো / ভারী কাজ (৪৫ লি/মিনিট)",
    maskSelection: "সুরক্ষামূলক মাস্ক নির্বাচন",
    noMask: "মাস্ক ছাড়া (০% ফিল্টার)",
    clothMask: "কাপড়ের মাস্ক (২৫% ফিল্টার)",
    surgicalMask: "সার্জিক্যাল মাস্ক (৫০% ফিল্টার)",
    n95Mask: "N95 রেসপিরেটর (৯৫% ফিল্টার)",
    ffp3Mask: "FFP3 / HEPA মাস্ক (৯৯% ফিল্টার)",
    inhalationImpact: "শ্বাস গ্রহণ প্রভাব মডেল",
    unprotectedIntake: "মাস্ক ছাড়া মোট PM2.5 কণা",
    filteredIntake: "মাস্ক সহ গৃহীত কণা",
    preventedIntake: "ফুসফুসে ঢুকতে বাধা পাওয়া কণা",
    predictedStatus: "আনুমানিক শ্বাসযন্ত্রের ঝুঁকি",

    trendsTitle: "পরিবেশগত সময়ক্রম টেলিমেট্রি",
    trendsSubtitle: "দূষণের সর্বোচ্চ সময় এড়িয়ে চলতে ও সুরক্ষার পরিকল্পনা করতে পূর্বাভাস কার্ভ।",
    hourlyTitle: "২৪ ঘণ্টার বায়ুমান (AQI) পরিবর্তন",
    lowerIsCleaner: "কম সংখ্যা = পরিষ্কার বাতাস",
    dailyTitle: "৭ দিনের তাপমাত্রা পূর্বাভাস",
    weeklyAuditTitle: "সাপ্তাহিক বায়ু এক্সপোজার অডিট",
    weeklyPeakHours: "উচ্চ ঝুঁকির সময়: ~১৮ ঘণ্টা/সপ্তাহ",
    weeklyGear: "সুপারিশকৃত গিয়ার: N95 মাস্ক",

    explorerTitle: "লাইভ ম্যাপ এক্সপ্লোরার",
    explorerSubtitle: "পৃথিবীর যেকোনো স্থানে ক্লিক করুন বা শহর খুঁজুন এবং সরাসরি পরিবেশের তথ্য দেখুন।",
    searchPlaceholder: "যেকোনো শহর বা স্থান খুঁজুন...",
    inspectedPoint: "পরিদর্শিত ভৌগোলিক স্থান",
    monitoringStation: "মনিটরিং স্টেশন",

    healthierChoice: "অপেক্ষাকৃত নিরাপদ পছন্দ",
    riskScore: "ঝুঁকি স্কোর",
    verdictTitle: "ব্যক্তিগত স্বাস্থ্য নিরাপত্তা রায়"
  },

  mr: {
    appName: "वेदरवाईज (WeatherWise)",
    tagline: "व्यक्तिगत पर्यावरणीय आरोग्य बुद्धिमत्ता",
    navHome: "होम ओव्हरव्ह्यू",
    navDashboard: "डॅशबोर्ड",
    navAdvisor: "AI आरोग्य सल्लागार",
    navSimulator: "मास्क व फुफ्फुस सि्युलेटर",
    navCompare: "शहर तुलना (Clash)",
    navTrends: "२४ तास व ७ दिवस ट्रेंड्स",
    navExplorer: "ग्लोबल मॅप एक्सप्लोरर",
    logout: "लॉगआउट",
    recalibrate: "प्रोफाइल बदला",
    safeWindowBadge: "आजची सर्वात सुरक्षित वेळ",
    emergencyAction: "आणीबाणी प्रोटोकॉल",
    liveTelemetrySync: "लाइव्ह हवामान व हवेची गुणवत्ता सिंक",
    temp: "तापमान",
    feelsLike: "जाणवणारे तापमान",
    aqi: "हवेची गुणवत्ता (AQI)",
    humidity: "आर्द्रता (दमटपणा)",
    wind: "वाऱ्याचा वेग",
    pm25: "PM २.५ कण",
    uvIndex: "युव्ही इंडेक्स",
    aiAdvisory: "AI वैयक्तिक आरोग्य सल्ला",
    recommendedActions: "सुरक्षित उपाय",
    strictlyAvoid: "काय टाळावे",
    vulnerabilityScore: "आरोग्य धोका स्कोर",
    primaryTriggers: "मुख्य ट्रिगर घटक",
    chatPlaceholder: "मास्क, व्यायाम किंवा प्रदूषणाबद्दल विचारा...",
    chatSend: "विचारा",
    compareTitle: "स्थान तुलना व सुरक्षा विश्लेषण",
    compareSubtitle: "तुमच्या आरोग्य प्रोफाइलनुसार दोन शहरांमधील धोक्याची तुलना करा",
    cityA: "सध्याचे शहर",
    cityB: "गंतव्य शहर",
    verdict: "सुरक्षा निर्णय व सल्ला",

    simulatorTitle: "मास्क व फुफ्फुस कण सिम्युलेटर",
    simulatorSubtitle: "शारीरिक श्रम, वेळ आणि मास्कच्या फिल्टर क्षमतेनुसार फुफ्फुसात जाणाऱ्या PM2.5 कणांचे गणित करा.",
    exposureDuration: "बाहेर राहण्याचा वेळ",
    exertionLevel: "शारीरिक श्रम व श्वासोच्छवासाचा वेग",
    restingLevel: "विश्रांती / बसणे (८ लि/मि)",
    walkingLevel: "जलद चालणे (१८ लि/मि)",
    runningLevel: "धावणे / कष्टाचे काम (४५ लि/मि)",
    maskSelection: "संरक्षक मास्क प्रकार",
    noMask: "मास्क नाही (०% फिल्टर)",
    clothMask: "कापडी मास्क (२५% फिल्टर)",
    surgicalMask: "सर्जिकल मास्क (५०% फिल्टर)",
    n95Mask: "N95 रेस्पिरेटर (९५% फिल्टर)",
    ffp3Mask: "FFP3 / HEPA मास्क (९९% फिल्टर)",
    inhalationImpact: "श्वासोच्छवास प्रभाव मॉडेल",
    unprotectedIntake: "मास्कशिवाय जाणारे PM2.5 कण",
    filteredIntake: "मास्कसह जाणारे कण",
    preventedIntake: "अडवले गेलेले PM2.5 कण",
    predictedStatus: "अंदाज वर्तवलेली श्वसन स्थिती",

    trendsTitle: "पर्यावरणीय वेळ ट्रेंड्स",
    trendsSubtitle: "प्रदूषणाच्या पीक वेळा टाळण्यासाठी २४ तास व ७ दिवसांचे अंदाज पत्रक.",
    hourlyTitle: "२४ तासांमधील हवेच्या गुणवत्तेचा (AQI) आलेख",
    lowerIsCleaner: "कमी अंक = स्वच्छ हवा",
    dailyTitle: "७ दिवसांचा तापमान अंदाज",
    weeklyAuditTitle: "साप्ताहिक श्वसन संपर्क ऑडिट",
    weeklyPeakHours: "जास्त धोक्याचा वेळ: ~१८ तास/आठवडा",
    weeklyGear: "शिफारस केलेले मास्क: N95 रेस्पिरेटर",

    explorerTitle: "ग्लोबल लाइव्ह मॅप एक्सप्लोरर",
    explorerSubtitle: "जगाच्या नकाशावर कुठेही क्लिक करा किंवा शहर शोधा आणि थेट हवामान पहा.",
    searchPlaceholder: "कुठलेही शहर किंवा ठिकाण शोधा...",
    inspectedPoint: "निवडलेले भौगोलिक ठिकाण",
    monitoringStation: "मॉनिटरिंग स्टेशन",

    healthierChoice: "अधिक सुरक्षित पर्याय",
    riskScore: "धोका स्कोर",
    verdictTitle: "वैयक्तिक आरोग्य सुरक्षा निर्णय"
  },

  ta: {
    appName: "வெதர்வைஸ் (WeatherWise)",
    tagline: "தனிப்பயனாக்கப்பட்ட சுற்றுச்சூழல் சுகாதார நுண்ணறிவு",
    navHome: "முகப்பு மேலோட்டம்",
    navDashboard: "டாஷ்போர்டு",
    navAdvisor: "AI சுகாதார ஆலோசகர்",
    navSimulator: "முகமூடி & நுரையீரல் உருவகப்படுத்துதல்",
    navCompare: "நகர ஒப்பீடு (Clash)",
    navTrends: "24 மணிநேர & 7 நாள் போக்குகள்",
    navExplorer: "உலகளாவிய வரைபடம்",
    logout: "வெளியேறு",
    recalibrate: "சுயவிவரத்தை திருத்து",
    safeWindowBadge: "இன்றைய பாதுகாப்பான நேரம்",
    emergencyAction: "அவசரக்கால நெறிமுறை",
    liveTelemetrySync: "நேரலை வானிலை & காற்றுத் தரம்",
    temp: "வெப்பநிலை",
    feelsLike: "உணரப்படும் வெப்பநிலை",
    aqi: "காற்றின் தரம் (AQI)",
    humidity: "ஈரப்பதம்",
    wind: "காற்றின் வேகம்",
    pm25: "PM 2.5 துகள்கள்",
    uvIndex: "UV குறியீடு",
    aiAdvisory: "AI தனிப்பட்ட சுகாதார ஆலோசனை",
    recommendedActions: "பரிந்துரைக்கப்பட்ட பாதுகாப்பான చర్యகள்",
    strictlyAvoid: "தவிர்க்க வேண்டியவை",
    vulnerabilityScore: "சுகாதார ஆபத்து மதிப்பெண்",
    primaryTriggers: "முக்கிய தூண்டுதல் காரணிகள்",
    chatPlaceholder: "முகமூடி, உடற்பயிற்சி அல்லது மாசுபாடு பற்றி கேட்கவும்...",
    chatSend: "கேட்கவும்",
    compareTitle: "நகர ஒப்பீடு & ஆபத்து பகுப்பாய்வு",
    compareSubtitle: "உங்கள் சுகாதார சுயவிவரத்தின்படி இரண்டு நகரங்களின் சுற்றுச்சூழல் ஆபத்தை ஒப்பிடுங்கள்",
    cityA: "தற்போதைய நகரம்",
    cityB: "இலக்கு நகரம்",
    verdict: "பாதுகாப்பு தீர்ப்பு & பரிந்துரை",

    simulatorTitle: "முகமூடி & நுரையீரல் துகள் மாதிரி",
    simulatorSubtitle: "உடற்பயிற்சி, நேரம் மற்றும் முகமூடியின் வடிகட்டி திறனை அடிப்படையாகக் கொண்டு PM2.5 துகள் உள்ளிழுப்பை கணக்கிடுங்கள்.",
    exposureDuration: "வெளியில் இருக்கும் நேரம்",
    exertionLevel: "உடற்பயிற்சி & சுவாச விகிதம்",
    restingLevel: "ஓய்வு / அமர்வது (8 லி/நிமி)",
    walkingLevel: "வேகமாக நடப்பது (18 லி/நிமி)",
    runningLevel: "ஓடுவது / கடின உழைப்பு (45 லி/நிமி)",
    maskSelection: "பாதுகாப்பு முகமூடி வகை",
    noMask: "முகமூடி இல்லை (0% வடிகட்டி)",
    clothMask: "துணி முகமூடி (25% வடிகட்டி)",
    surgicalMask: "அறுவை சிகிச்சை முகமூடி (50% வடிகட்டி)",
    n95Mask: "N95 முகமூடி (95% வடிகட்டி)",
    ffp3Mask: "FFP3 / HEPA முகமூடி (99% வடிகட்டி)",
    inhalationImpact: "சுவாச தாக்க மாதிரி",
    unprotectedIntake: "முகமூடி இல்லாத PM2.5 உள்ளிழுப்பு",
    filteredIntake: "முகமூடியுடன் உள்ளிழுப்பு",
    preventedIntake: "தடுக்கப்பட்ட PM2.5 துகள்கள்",
    predictedStatus: "கணிக்கப்பட்ட சுவாச ஆபத்து நிலை",

    trendsTitle: "சுற்றுச்சூழல் நேரப் போக்குகள்",
    trendsSubtitle: "அதிக மாசுபாடு நேரங்களைத் தவிர்க்க 24 மணிநேர & 7 நாள் முன்னறிவிப்பு.",
    hourlyTitle: "24 மணிநேர காற்றுத் தர (AQI) வளர்ச்சி",
    lowerIsCleaner: "குறைந்த எண் = சுத்தமான காற்று",
    dailyTitle: "7 நாள் வெப்பநிலை முன்னறிவிப்பு",
    weeklyAuditTitle: "வாராந்திர சுவாச ஆபத்து தணிக்கை",
    weeklyPeakHours: "அதிக ஆபத்துள்ள நேரம்: ~18 மணிநேரம்/வாரம்",
    weeklyGear: "பரிந்துரைக்கப்பட்ட கவசம்: N95 முகமூடி",

    explorerTitle: "உலகளாவிய நேரலை வரைபடம்",
    explorerSubtitle: "உலகின் எந்த இடத்தையும் கிளிக் செய்து நேரலை சுற்றுச்சூழல் தரவைப் பார்க்கவும்.",
    searchPlaceholder: "எந்த நகரத்தையும் தேடுங்கள்...",
    inspectedPoint: "தேர்ந்தெடுக்கப்பட்ட புவியியல் இடம்",
    monitoringStation: "கண்காணிப்பு நிலையம்",

    healthierChoice: "பாதுகாப்பான தேர்வு",
    riskScore: "ஆபத்து மதிப்பெண்",
    verdictTitle: "தனிப்பட்ட சுகாதார பாதுகாப்பு தீர்ப்பு"
  },

  te: {
    appName: "వెదర్‌వైజ్ (WeatherWise)",
    tagline: "వ్యక్తిగత పర్యావరణ ఆరోగ్య భద్రత",
    navHome: "హోమ్ ఓవర్‌వ్యూ",
    navDashboard: "డాష్‌బోర్డ్",
    navAdvisor: "AI ఆరోగ్య సలహాదారు",
    navSimulator: "మాస్క్ & ఊపిరితిత్తుల సిమ్యులేటర్",
    navCompare: "నగరాల పోలిక (Clash)",
    navTrends: "24 గంటలు & 7 రోజుల ట్రెండ్స్",
    navExplorer: "గ్లోబల్ మ్యాప్ ఎక్స్‌ప్లోరర్",
    logout: "లాగౌట్",
    recalibrate: "ప్రొఫైల్ సవరించు",
    safeWindowBadge: "నేటి అత్యంత సురక్షితమైన సమయం",
    emergencyAction: "అత్యవసర ప్రోటోకాల్",
    liveTelemetrySync: "లైవ్ వాతావరణం & గాలి నాణ్యత సింక్",
    temp: "ఉష్ణోగ్రత",
    feelsLike: "అనిపించే ఉష్ణోగ్రత",
    aqi: "గాలి నాణ్యత (AQI)",
    humidity: "ఆర్ద్రత (తేమ)",
    wind: "గాలి వేగం",
    pm25: "PM 2.5 రేణువులు",
    uvIndex: "UV ఇండెక్స్",
    aiAdvisory: "AI వ్యక్తిగత ఆరోగ్య సలహా",
    recommendedActions: "సురక్షితమైన చర్యలు",
    strictlyAvoid: "నివారించాల్సిన విషయాలు",
    vulnerabilityScore: "ఆరోగ్య ప్రమాద స్కోరు",
    primaryTriggers: "ముఖ్యమైన ప్రేరక అంశాలు",
    chatPlaceholder: "మాస్క్, వ్యాయామం లేదా కాలుష్యం గురించి అడగండి...",
    chatSend: "అడగండి",
    compareTitle: "నగరాల పోలిక & ప్రమాద విశ్లేషణ",
    compareSubtitle: "మీ ఆరోగ్య ప్రొఫైల్ ఆధారంగా రెండు నగరాల పర్యావరణ ప్రమాదాన్ని పోల్చండి",
    cityA: "ప్రస్తుత నగరం",
    cityB: "గమ్యస్థాన నగరం",
    verdict: "భద్రతా తీర్పు & సలహా",

    simulatorTitle: "మాస్క్ & ఊపిరితిత్తుల కాలుష్య సిమ్యులేటర్",
    simulatorSubtitle: "శారీరక శ్రమ, సమయం మరియు మాస్క్ ఫిల్టర్ సామర్థ్యం ఆధారంగా ఊపిరితిత్తుల్లోకి వెళ్లే PM2.5 రేణువులను లెక్కించండి.",
    exposureDuration: "బయట గడిపే సమయం",
    exertionLevel: "శారీరక శ్రమ & శ్వాస వేగం",
    restingLevel: "విశ్రాంతి / కూర్చోవడం (8 లీ/ని)",
    walkingLevel: "వేగంగా నడవడం (18 లీ/ని)",
    runningLevel: "పరుగెత్తడం / తీవ్రమైన పని (45 లీ/ని)",
    maskSelection: "రక్షణ మాస్క్ రకం",
    noMask: "మాస్క్ లేదు (0% ఫిల్టర్)",
    clothMask: "గుడ్డ మాస్క్ (25% ఫిల్టర్)",
    surgicalMask: "సర్జికల్ మాస్క్ (50% ఫిల్టర్)",
    n95Mask: "N95 రెస్పిరేటర్ (95% ఫిల్టర్)",
    ffp3Mask: "FFP3 / HEPA మాస్క్ (99% ఫిల్టర్)",
    inhalationImpact: "శ్వాస ప్రభావ మోడల్",
    unprotectedIntake: "మాస్క్ లేకుండా పీల్చే PM2.5 రేణువులు",
    filteredIntake: "మాస్క్‌తో పీల్చే రేణువులు",
    preventedIntake: "అరికట్టిన PM2.5 రేణువులు",
    predictedStatus: "అంచనా వేసిన శ్వాసకోశ ప్రమాద స్థితి",

    trendsTitle: "పర్యావరణ సమయ ట్రెండ్స్",
    trendsSubtitle: "కాలుష్యం ఎక్కువ ఉండే సమయాలను నివారించడానికి 24 గంటలు & 7 రోజుల ముందస్తు అంచనా.",
    hourlyTitle: "24 గంటల గాలి నాణ్యత (AQI) మార్పులు",
    lowerIsCleaner: "తక్కువ సంఖ్య = స్వచ్ఛమైన గాలి",
    dailyTitle: "7 రోజుల ఉష్ణోగ్రత ముందస్తు అంచనా",
    weeklyAuditTitle: "వారంవారీ శ్వాసకోశ ప్రమాద ఆడిట్",
    weeklyPeakHours: "అధిక ప్రమాద సమయం: ~18 గంటలు/వారం",
    weeklyGear: "సిఫార్సు చేసిన మాస్క్: N95 రెస్పిరేటర్",

    explorerTitle: "గ్లోబల్ లైవ్ మ్యాప్ ఎక్స్‌ప్లోరర్",
    explorerSubtitle: "ప్రపంచంలో ఎక్కడైనా క్లిక్ చేయండి లేదా నగరాన్ని శోధించి లైవ్ వాతావరణం చూడండి.",
    searchPlaceholder: "ఏదైనా నగరం లేదా ప్రాంతాన్ని శోధించండి...",
    inspectedPoint: "ఎంచుకున్న భౌగోళిక ప్రాంతం",
    monitoringStation: "మానిటరింగ్ స్టేషన్",

    healthierChoice: "మరింత సురక్షితమైన ఎంపిక",
    riskScore: "ప్రమాద స్కోరు",
    verdictTitle: "వ్యక్తిగత ఆరోగ్య భద్రతా తీర్పు"
  }
};
