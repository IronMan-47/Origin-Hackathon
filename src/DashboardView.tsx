import React, { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Sun, 
  MapPin, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  HeartPulse, 
  ChevronRight,
  Info,
  Shield,
  Activity,
  PhoneCall,
  X,
  Share2,
  Check
} from 'lucide-react';
import { type EnvironmentalData, type RiskCalculationResult, calculatePersonalRisk } from './riskEngine';
import { fetchLiveEnvironment } from './environmentService';
import { translations, type Language } from './translations';

interface DashboardViewProps {
  profile: any;
  onRecalibrate: () => void;
  lang?: Language;
  isDarkMode?: boolean;
}

export default function DashboardView({ profile, onRecalibrate, lang = 'en', isDarkMode = true }: DashboardViewProps) {
  const t = translations[lang];
  const [loading, setLoading] = useState(true);
  const [envData, setEnvData] = useState<EnvironmentalData | null>(null);
  const [riskData, setRiskData] = useState<RiskCalculationResult | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedHour, setSelectedHour] = useState<number>(1); // Default 7 AM
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const lat = profile?.latitude ?? 21.25;
  const lon = profile?.longitude ?? 81.63;
  const locationName = profile?.location_name || 'Raipur, Chhattisgarh';

  const loadEnvironment = async () => {
    setLoading(true);
    try {
      const data = await fetchLiveEnvironment(lat, lon);
      setEnvData(data);

      const calculatedRisk = calculatePersonalRisk(data, {
        age: profile?.age,
        gender: profile?.gender,
        occupation: profile?.occupation,
        medicalConditions: profile?.medical_conditions,
        locationName: locationName
      });
      setRiskData(calculatedRisk);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error("Dashboard environment fetch error, setting fallback:", err);
      const fallbackEnv: EnvironmentalData = {
        temperature: 32,
        feelsLike: 36,
        humidity: 70,
        windSpeed: 12,
        weatherCode: 2,
        weatherDescription: 'Partly cloudy',
        uvIndex: 7,
        aqi: 157,
        aqiCategory: 'Unhealthy',
        pm25: 76.0,
        pm10: 55.0,
        aqiSource: 'open_meteo'
      };
      setEnvData(fallbackEnv);
      setRiskData(calculatePersonalRisk(fallbackEnv, {
        age: profile?.age,
        gender: profile?.gender,
        occupation: profile?.occupation,
        medicalConditions: profile?.medical_conditions,
        locationName: locationName
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnvironment();
  }, [lat, lon, profile]);

  if (loading || !envData || !riskData) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center min-h-[500px] space-y-4 ${
        isDarkMode ? 'text-slate-400' : 'text-slate-600'
      }`}>
        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold animate-pulse">Calibrating live weather & particulate models for {locationName}...</p>
      </div>
    );
  }

  const isHighRisk = riskData.level === 'HIGH' || riskData.level === 'CRITICAL';

  // Safely extract precautions, avoid list, and triggers
  const precautionsList = riskData.precautions || [];
  const avoidList = (riskData as any).activitiesToAvoid || (riskData as any).avoidList || [];
  const triggersList = (riskData as any).primaryFactors || (riskData as any).triggers || [];

  // 24-Hour Schedule Generator
  const hourlySchedule = [
    { hour: '6 AM', status: 'optimal', label: 'Safest Window (Low Exposure)', temp: envData.temperature - 3 },
    { hour: '7 AM', status: 'optimal', label: 'Ideal for Outdoor Exercise', temp: envData.temperature - 2 },
    { hour: '8 AM', status: 'moderate', label: 'Traffic Particulates Rising', temp: envData.temperature - 1 },
    { hour: '9 AM', status: 'moderate', label: 'Moderate UV & Traffic Exhaust', temp: envData.temperature },
    { hour: '10 AM', status: 'hazardous', label: 'High Exertion Caution', temp: envData.temperature + 1 },
    { hour: '11 AM', status: 'hazardous', label: 'Peak Ozone Accumulation', temp: envData.temperature + 2 },
    { hour: '12 PM', status: 'hazardous', label: 'High Thermal & AQI Exposure', temp: envData.temperature + 3 },
    { hour: '1 PM', status: 'hazardous', label: 'Maximum Sun & Heat Index', temp: envData.temperature + 4 },
    { hour: '2 PM', status: 'hazardous', label: 'Stay Indoors / Air Purifier', temp: envData.temperature + 4 },
    { hour: '3 PM', status: 'hazardous', label: 'Heavy Particulate Dispersal', temp: envData.temperature + 3 },
    { hour: '4 PM', status: 'hazardous', label: 'Elevated Ozone Level', temp: envData.temperature + 2 },
    { hour: '5 PM', status: 'moderate', label: 'Evening Transit Commute', temp: envData.temperature + 1 },
    { hour: '6 PM', status: 'moderate', label: 'Cooling Ambient Air', temp: envData.temperature },
    { hour: '7 PM', status: 'optimal', label: 'Moderate Evening Exercise', temp: envData.temperature - 1 },
    { hour: '8 PM', status: 'optimal', label: 'Good Ventilation Window', temp: envData.temperature - 2 },
  ];

  const handleShareReport = () => {
    const text = `WeatherWise Health Digest for ${locationName}:\nRisk Level: ${riskData.level} (${riskData.score}/100)\nAQI: ${envData.aqi} | Temp: ${envData.temperature}°C\nSafest Window: ${riskData.bestTimeWindow}`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const cardBase = isDarkMode 
    ? 'bg-slate-900/40 border-slate-700/50 text-white shadow-2xl backdrop-blur-xl' 
    : 'bg-white/70 border-slate-200/90 text-slate-900 shadow-2xl shadow-slate-200/50 backdrop-blur-xl';

  const cardSubtext = isDarkMode ? 'text-slate-300' : 'text-slate-600';
  const cardHeading = isDarkMode ? 'text-white' : 'text-slate-900';
  const innerBox = isDarkMode ? 'bg-slate-800/40 border-slate-700/50 backdrop-blur-md' : 'bg-slate-100/60 border-slate-200 backdrop-blur-md';

  return (
    <div className="max-w-6xl w-full mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Top Banner: User Context & Live Geolocation Anchor */}
      <div className={`border rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all hover:-translate-y-0.5 duration-300 ${
        isDarkMode 
          ? 'bg-slate-900/50 backdrop-blur-xl border-slate-700/50 text-white' 
          : 'bg-white/70 backdrop-blur-xl border-slate-200/90 text-slate-900'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              {t.liveTelemetrySync}
            </div>
            <h1 className={`text-3xl md:text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Good day, {profile?.display_name || 'User'}
            </h1>
            <div className={`flex items-center gap-2 text-xs md:text-sm mt-2 flex-wrap font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              <span className={`flex items-center gap-1 font-semibold px-3 py-1 rounded-full border ${isDarkMode ? 'text-white bg-slate-800/90 border-slate-700' : 'text-slate-100 bg-slate-800/80 border-slate-700'}`}>
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> {locationName}
              </span>
              <span>•</span>
              <span>Age: <strong className={isDarkMode ? 'text-white' : 'text-black'}>{profile?.age || '25'}</strong></span>
              <span>•</span>
              <span>Routine: <strong className={isDarkMode ? 'text-white' : 'text-black'}>{profile?.occupation?.replace('_', ' ') || 'General'}</strong></span>
              <span>•</span>
              <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>Updated at {lastUpdated}</span>
            </div>
          </div>

          {/* Earth Telemetry Globe Graphic */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <img 
              src="/hero.png" 
              alt="Earth Atmospheric Telemetry Globe" 
              className="w-20 h-20 md:w-24 md:h-24 object-contain filter drop-shadow-[0_10px_20px_rgba(59,130,246,0.5)] hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="px-3.5 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-red-950/20"
              aria-label="Open Emergency Protocol"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" /> Emergency Protocol
            </button>
            <button
              onClick={handleShareReport}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Share Health Digest"
              aria-label="Share Digest"
            >
              {copiedShare ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4 text-blue-400" />}
              <span>{copiedShare ? 'Copied!' : 'Share Digest'}</span>
            </button>
            <button
              onClick={loadEnvironment}
              title="Refresh telemetry"
              aria-label="Refresh telemetry data"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-slate-300 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onRecalibrate}
              className="text-xs font-bold bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-3.5 py-2.5 rounded-2xl transition-all flex items-center gap-1.5"
            >
              Edit Profile <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dual Station Transparency Badge */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold mr-1">
              Active Sensitivities:
            </span>
            {profile?.medical_conditions && profile.medical_conditions.length > 0 ? (
              profile.medical_conditions.map((cond: string) => (
                <span 
                  key={cond} 
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1"
                >
                  <HeartPulse className="w-3 h-3" /> {cond.replace('_', ' ')}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-300">General Vulnerability Profile</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs bg-slate-950/80 px-3 py-1.5 rounded-2xl border border-slate-800">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300">
              Station Transparency: <strong className="text-emerald-400">{envData.stationName ? envData.stationName : 'Regional Sensor'}</strong> ({envData.aqi} AQI Peak)
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Weather Cards (2 cols) + Real-time Risk Engine (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Atmospheric & Particulate Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Temperature */}
            <div className={`border p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardBase}`}>
              <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider ${cardSubtext}`}>
                <span>{t.temp}</span>
                <Thermometer className="w-4 h-4 text-orange-500 animate-bounce" />
              </div>
              <div className="mt-3">
                <div className={`text-3xl sm:text-4xl font-black ${cardHeading}`}>{envData.temperature}°C</div>
                <div className="text-[11px] text-orange-500 font-bold mt-1">{t.feelsLike} {envData.feelsLike}°C</div>
              </div>
            </div>

            {/* AQI */}
            <div className={`border p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardBase}`}>
              <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider ${cardSubtext}`}>
                <span>{t.aqi}</span>
                <Wind className="w-4 h-4 text-red-500 animate-pulse" />
              </div>
              <div className="mt-3">
                <div className={`text-3xl sm:text-4xl font-black ${
                  envData.aqi > 150 ? 'text-red-500' : envData.aqi > 100 ? 'text-orange-500' : 'text-emerald-500'
                }`}>
                  {envData.aqi}
                </div>
                <div className={`text-[11px] font-semibold mt-1 truncate ${cardSubtext}`}>{envData.aqiCategory}</div>
              </div>
            </div>

            {/* PM2.5 */}
            <div className={`border p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardBase}`}>
              <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider ${cardSubtext}`}>
                <span>{t.pm25}</span>
                <Info className="w-4 h-4 text-blue-500" />
              </div>
              <div className="mt-3">
                <div className={`text-2xl sm:text-3xl font-black ${cardHeading}`}>{envData.pm25}</div>
                <div className={`text-[11px] font-medium mt-1 ${cardSubtext}`}>µg/m³ concentration</div>
              </div>
            </div>

            {/* Humidity */}
            <div className={`border p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardBase}`}>
              <div className={`flex items-center justify-between text-xs font-bold uppercase tracking-wider ${cardSubtext}`}>
                <span>{t.humidity}</span>
                <Droplets className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="mt-3">
                <div className={`text-2xl sm:text-3xl font-black ${cardHeading}`}>{envData.humidity}%</div>
                <div className={`text-[11px] font-medium mt-1 ${cardSubtext}`}>{t.wind}: {envData.windSpeed} km/h</div>
              </div>
            </div>
          </div>

          {/* Environmental Breakdown Bar */}
          <div className={`border p-5 rounded-3xl flex flex-wrap items-center justify-between gap-3 text-xs ${cardBase}`}>
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" />
              <span>Sky: <strong className={cardHeading}>{envData.weatherDescription}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>UV Index: <strong className={cardHeading}>{envData.uvIndex ?? 6} / 12</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>Primary Pollutant: <strong className="text-emerald-500">PM 2.5</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>Engine: <strong className="text-blue-500 uppercase tracking-wider">OpenWeather & WAQI</strong></span>
            </div>
          </div>

          {/* 24-Hour Safe Activity Timeline Bar */}
          <div className={`border rounded-3xl p-6 shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${cardBase}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest">
                <Clock className="w-4 h-4" /> 24-Hour Safe Outdoor Timeline
              </div>
              <span className={`text-[11px] ${cardSubtext}`}>Tap hour slot for advice</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-3 scrollbar-thin">
              {hourlySchedule.map((slot, idx) => {
                const isSelected = selectedHour === idx;
                const isOptimal = slot.status === 'optimal';
                const isModerate = slot.status === 'moderate';
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedHour(idx)}
                    className={`flex flex-col items-center justify-between p-2.5 rounded-2xl shrink-0 min-w-[64px] border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-400 scale-105 shadow-lg shadow-blue-600/30 font-bold'
                        : isOptimal
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20'
                        : isModerate
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/30 hover:bg-amber-500/20'
                        : 'bg-red-500/10 text-red-600 border-red-500/30 hover:bg-red-500/20'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase">{slot.hour}</span>
                    <span className="text-xs font-black my-1">{slot.temp}°C</span>
                    <span className={`w-2 h-2 rounded-full ${
                      isOptimal ? 'bg-emerald-500' : isModerate ? 'bg-amber-500' : 'bg-red-500 animate-pulse'
                    }`}></span>
                  </button>
                );
              })}
            </div>

            <div className={`mt-3 p-3.5 rounded-2xl border text-xs flex items-center justify-between ${innerBox}`}>
              <span className={`font-semibold ${cardHeading}`}>
                <strong>{hourlySchedule[selectedHour].hour}:</strong> {hourlySchedule[selectedHour].label}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                hourlySchedule[selectedHour].status === 'optimal'
                  ? 'bg-emerald-500/20 text-emerald-600'
                  : hourlySchedule[selectedHour].status === 'moderate'
                  ? 'bg-amber-500/20 text-amber-600'
                  : 'bg-red-500/20 text-red-600'
              }`}>
                {hourlySchedule[selectedHour].status}
              </span>
            </div>
          </div>

          {/* AI Clinical Recommendation Breakdown */}
          <div className={`border rounded-3xl p-6 md:p-8 shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${cardBase}`}>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4 animate-spin" /> {t.aiAdvisory}
            </div>
            <h2 className={`text-xl font-bold mb-2 ${cardHeading}`}>
              {riskData.summary}
            </h2>
            <p className={`text-sm leading-relaxed ${cardSubtext}`}>
              {riskData.clinicalImpact}
            </p>

            {/* Detailed Precautions vs Avoid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              
              {/* Precautions */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t.recommendedActions}
                </h3>
                <ul className="space-y-2 text-xs">
                  {precautionsList.map((prec, i) => (
                    <li key={i} className={`flex items-start gap-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{prec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Avoid */}
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <XCircle className="w-4 h-4 text-red-600" /> {t.strictlyAvoid}
                </h3>
                <ul className="space-y-2 text-xs">
                  {avoidList.map((av: string, i: number) => (
                    <li key={i} className={`flex items-start gap-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      <span className="text-red-500 font-bold">•</span>
                      <span>{av}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Right 1 Column: Personal Vulnerability Engine */}
        <div className="space-y-6">
          
          {/* Vulnerability Score Card */}
          <div className={`border rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-6 hover:-translate-y-1 transition-all duration-300 ${cardBase}`}>
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-3">
                <span className="flex items-center gap-1.5 text-blue-500">
                  <Activity className="w-4 h-4" /> {t.vulnerabilityScore}
                </span>
                <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  isHighRisk 
                    ? 'bg-red-500/20 text-red-500 border-red-500/30' 
                    : 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30'
                }`}>
                  {riskData.level} RISK
                </span>
              </div>

              {/* Score Gauge */}
              <div className="flex items-baseline gap-2 mt-2">
                <span className={`text-5xl font-black ${
                  riskData.score > 70 ? 'text-red-500' : riskData.score > 40 ? 'text-orange-500' : 'text-emerald-500'
                }`}>
                  {riskData.score}
                </span>
                <span className={`text-sm font-semibold ${cardSubtext}`}>/ 100 Index</span>
              </div>

              {/* Progress bar */}
              <div className={`w-full h-2.5 rounded-full mt-3 overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    riskData.score > 70 ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${riskData.score}%` }}
                />
              </div>

              {/* Safest Window Badge */}
              <div className="mt-5 p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl">
                <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider block">{t.safeWindowBadge}</span>
                <strong className={`text-sm block mt-1 ${cardHeading}`}>{riskData.bestTimeWindow}</strong>
              </div>
            </div>

            {/* Triggers Breakdown */}
            <div className="border-t border-slate-700/50 pt-4 space-y-3">
              <span className={`text-xs font-bold uppercase tracking-wider block ${cardSubtext}`}>{t.primaryTriggers}:</span>
              
              <div className="space-y-2">
                {triggersList.map((trig: any, idx: number) => {
                  const factorName = typeof trig === 'string' ? trig : (trig.factor || 'Environmental Factor');
                  const severityName = typeof trig === 'string' ? 'ELEVATED' : (trig.severity || 'HIGH');
                  const reasonText = typeof trig === 'string' ? `Primary driver influencing ${riskData.level} risk score` : (trig.reason || trig.impact || 'Active atmospheric trigger');
                  
                  return (
                    <div key={idx} className={`p-3 rounded-2xl border text-xs ${innerBox}`}>
                      <div className="flex items-center justify-between font-bold">
                        <span className={`uppercase ${cardHeading}`}>{factorName.replace('_', ' ')}</span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          severityName.toLowerCase().includes('high') || severityName.toLowerCase().includes('critical') 
                            ? 'bg-red-500/20 text-red-500' 
                            : 'bg-amber-500/20 text-amber-500'
                        }`}>
                          {severityName}
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 leading-snug ${cardSubtext}`}>{reasonText}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={onRecalibrate}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{t.recalibrate}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
