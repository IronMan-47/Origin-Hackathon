export type Language = 'en' | 'hi' | 'es';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  navDashboard: string;
  navAdvisor: string;
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
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appName: "WeatherWise",
    tagline: "Personalized Environmental Health Intelligence",
    navDashboard: "Dashboard",
    navAdvisor: "AI Health Advisor",
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
    verdict: "Safety Verdict & Recommendation"
  },
  hi: {
    appName: "वेदरवाइज़ (WeatherWise)",
    tagline: "व्यक्तिगत पर्यावरणीय स्वास्थ्य सुरक्षा",
    navDashboard: "डैशबोर्ड",
    navAdvisor: "AI स्वास्थ्य सलाहकार",
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
    verdict: "सुरक्षा निर्णय व सलाह"
  },
  es: {
    appName: "WeatherWise",
    tagline: "Inteligencia de Salud Ambiental Personalizada",
    navDashboard: "Panel",
    navAdvisor: "Asesor de Salud IA",
    navCompare: "Comparar Ciudades",
    navTrends: "Tendencias 24h y 7d",
    navExplorer: "Explorador de Mapas",
    logout: "Cerrar sesión",
    recalibrate: "Editar Perfil",
    safeWindowBadge: "Ventana Más Segura Hoy",
    emergencyAction: "Protocolo de Emergencia",
    liveTelemetrySync: "Sincronización en Vivo",
    temp: "Temperatura",
    feelsLike: "Sensación térmica",
    aqi: "Índice ICA",
    humidity: "Humedad",
    wind: "Velocidad del Viento",
    pm25: "PM 2.5",
    uvIndex: "Índice UV",
    aiAdvisory: "Asesoría de Salud Personalizada por IA",
    recommendedActions: "Acciones Recomendadas",
    strictlyAvoid: "Evitar Estrictamente",
    vulnerabilityScore: "Puntaje de Vulnerabilidad",
    primaryTriggers: "Desencadenantes Principales",
    chatPlaceholder: "Pregunte sobre respiración, ejercicio al aire libre o mascarillas...",
    chatSend: "Preguntar",
    compareTitle: "Comparación de Ciudades",
    compareSubtitle: "Evalúe el riesgo ambiental adaptado a su perfil médico",
    cityA: "Residencia Principal",
    cityB: "Ciudad Destino",
    verdict: "Veredicto de Seguridad"
  }
};
