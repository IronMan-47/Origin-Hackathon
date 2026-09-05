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
  Info
} from 'lucide-react';
import { type EnvironmentalData, type RiskCalculationResult, calculatePersonalRisk } from './riskEngine';
import { fetchLiveEnvironment } from './environmentService';

interface DashboardViewProps {
  profile: any;
  onRecalibrate: () => void;
}

export default function DashboardView({ profile, onRecalibrate }: DashboardViewProps) {
  const [loading, setLoading] = useState(true);
  const [envData, setEnvData] = useState<EnvironmentalData | null>(null);
  const [riskData, setRiskData] = useState<RiskCalculationResult | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnvironment();
  }, [lat, lon, profile]);

  if (loading || !envData || !riskData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[500px] text-slate-400 space-y-4">
        <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium">Calibrating live weather & particulate models for {locationName}...</p>
      </div>
    );
  }

  // Color schemes based on Risk Level
  const isHighRisk = riskData.level === 'HIGH' || riskData.level === 'CRITICAL';

  return (
    <div className="max-w-6xl w-full mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Top Banner: User Context & Live Geolocation Anchor */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Live Environmental Telemetry Sync
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Good day, {profile?.display_name || 'User'}
            </h1>
            <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400 mt-2 flex-wrap">
              <span className="flex items-center gap-1 text-slate-200 font-semibold bg-slate-800/90 px-3 py-1 rounded-full border border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-blue-400" /> {locationName}
              </span>
              <span>•</span>
              <span>Age: <strong className="text-slate-200">{profile?.age || '25'}</strong></span>
              <span>•</span>
              <span>Routine: <strong className="text-slate-200">{profile?.occupation?.replace('_', ' ') || 'General'}</strong></span>
              <span>•</span>
              <span className="text-slate-500">Updated at {lastUpdated}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadEnvironment}
              title="Refresh telemetry"
              className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-slate-300 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onRecalibrate}
              className="text-xs font-bold bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 px-4 py-3 rounded-2xl transition-all flex items-center gap-1.5"
            >
              Edit Health Profile <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* User's Reported Conditions Chips */}
        {profile?.medical_conditions && profile.medical_conditions.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap relative z-10">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mr-1">
              Active Sensitivities:
            </span>
            {profile.medical_conditions.map((cond: string) => (
              <span 
                key={cond} 
                className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1"
              >
                <HeartPulse className="w-3 h-3" /> {cond.replace('_', ' ')}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid: Weather Cards (2 cols) + Real-time Risk Engine (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Atmospheric & Particulate Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Temperature */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Temp</span>
                <Thermometer className="w-4 h-4 text-orange-400" />
              </div>
              <div className="mt-3">
                <div className="text-3xl sm:text-4xl font-black text-white">{envData.temperature}°C</div>
                <div className="text-[11px] text-orange-400 font-semibold mt-1">Feels like {envData.feelsLike}°C</div>
              </div>
            </div>

            {/* AQI */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>US AQI</span>
                <Wind className="w-4 h-4 text-red-400" />
              </div>
              <div className="mt-3">
                <div className={`text-3xl sm:text-4xl font-black ${
                  envData.aqi > 150 ? 'text-red-500' : envData.aqi > 100 ? 'text-orange-500' : 'text-green-400'
                }`}>
                  {envData.aqi}
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-1 truncate">{envData.aqiCategory}</div>
              </div>
            </div>

            {/* PM2.5 */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>PM 2.5</span>
                <Info className="w-4 h-4 text-blue-400" />
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-white">{envData.pm25}</div>
                <div className="text-[11px] text-slate-400 font-medium mt-1">µg/m³ concentration</div>
              </div>
            </div>

            {/* Humidity */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
                <span>Humidity</span>
                <Droplets className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-white">{envData.humidity}%</div>
                <div className="text-[11px] text-slate-400 font-medium mt-1">Wind: {envData.windSpeed} km/h</div>
              </div>
            </div>
          </div>

          {/* Environmental Breakdown Bar */}
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-400" />
              <span>Sky: <strong className="text-white">{envData.weatherDescription}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>UV Index: <strong className="text-white">{envData.uvIndex ?? 6} / 12</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>Station: <strong className="text-emerald-400">{envData.stationName ? envData.stationName : 'Global Gridded Sensor'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>Source: <strong className="text-blue-400 uppercase tracking-wider">{envData.aqiSource === 'waqi' ? 'WAQI Ground Sensor' : 'Open-Meteo Satellite'}</strong></span>
            </div>
          </div>

          {/* AI Clinical Recommendation Breakdown */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
              <Sparkles className="w-4 h-4" /> AI Personalized Health Advisory
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {riskData.summary}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {riskData.clinicalImpact}
            </p>

            {/* Detailed Precautions vs Avoid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              
              {/* Precautions */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <CheckCircle2 className="w-4 h-4" /> Recommended Safe Actions
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-200">
                  {riskData.precautions.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Avoid */}
              <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <XCircle className="w-4 h-4" /> Highly Advised to Avoid
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-200">
                  {riskData.activitiesToAvoid.map((a, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Best Window suggestion */}
            <div className="mt-5 p-4 bg-slate-800/60 border border-slate-700/70 rounded-2xl flex items-center gap-3 text-xs text-slate-300">
              <Clock className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                <strong>Safest Outdoor Window:</strong> {riskData.bestTimeWindow}
              </span>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Deterministic Risk Meter Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-orange-400" />
                Vulnerability Score
              </span>
              <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                isHighRisk ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}>
                {riskData.level} RISK
              </span>
            </div>

            {/* Circular Gauge */}
            <div className="py-8 flex flex-col items-center justify-center relative">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={isHighRisk ? 'text-red-500' : 'text-blue-500'}
                    strokeWidth="3.2"
                    strokeDasharray={`${riskData.score}, 100`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black text-white">{riskData.score}</span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">/ 100 Index</span>
                </div>
              </div>
            </div>

            {/* Contributing Breakdown Factors */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Primary Triggers:
              </div>
              {riskData.primaryFactors.length > 0 ? (
                riskData.primaryFactors.map((f, i) => (
                  <div key={i} className="p-3 bg-slate-800/60 border border-slate-700/80 rounded-2xl">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                      <span>{f.factor}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        f.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {f.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                      {f.impact}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-slate-800/40 rounded-2xl text-xs text-slate-400">
                  No critical triggers detected for your location today.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-500 leading-tight">
            Deterministic index derived from US-EPA Clean Air Act standards & NOAA Heat Stress indices. Not a substitute for clinical emergency care.
          </div>

        </div>

      </div>

    </div>
  );
}
