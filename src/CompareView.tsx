import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  MapPin, 
  Search, 
  Thermometer, 
  Wind, 
  Droplets, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { calculatePersonalRisk } from './riskEngine';
import type { EnvironmentalData } from './riskEngine';
import { fetchLiveEnvironment } from './environmentService';
import { translations, type Language } from './translations';

interface CompareViewProps {
  profile: any;
  lang: Language;
}

export default function CompareView({ profile, lang }: CompareViewProps) {
  const t = translations[lang];

  // City A (Default to User's primary residence)
  const [cityAName, setCityAName] = useState(profile?.location_name || 'Raipur, Chhattisgarh');
  const [cityALat, setCityALat] = useState(profile?.latitude ?? 21.25);
  const [cityALon, setCityALon] = useState(profile?.longitude ?? 81.63);
  const [dataA, setDataA] = useState<EnvironmentalData | null>(null);

  // City B (Default destination comparison, e.g. Delhi)
  const [cityBName, setCityBName] = useState('New Delhi, India');
  const [cityBLat, setCityBLat] = useState(28.6139);
  const [cityBLon, setCityBLon] = useState(77.2090);
  const [dataB, setDataB] = useState<EnvironmentalData | null>(null);

  // Search state
  const [searchBQuery, setSearchBQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBoth = async () => {
    setLoading(true);
    try {
      const [resA, resB] = await Promise.all([
        fetchLiveEnvironment(cityALat, cityALon),
        fetchLiveEnvironment(cityBLat, cityBLon)
      ]);
      setDataA(resA);
      setDataB(resB);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoth();
  }, [cityALat, cityALon, cityBLat, cityBLon]);

  const handleSearchB = async (query: string) => {
    setSearchBQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=4&language=en&format=json`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (e) {
      console.error(e);
    }
  };

  const selectCityB = (item: any) => {
    const full = `${item.name}, ${item.country || ''}`.trim();
    setCityBName(full);
    setCityBLat(item.latitude);
    setCityBLon(item.longitude);
    setSearchResults([]);
    setSearchBQuery('');
  };

  // Calculate comparative risks
  const riskA = dataA ? calculatePersonalRisk(dataA, profile) : null;
  const riskB = dataB ? calculatePersonalRisk(dataB, profile) : null;

  // Decide winning safer city
  const isCityASafer = (riskA?.score ?? 50) <= (riskB?.score ?? 50);
  const saferCity = isCityASafer ? cityAName : cityBName;
  const hazardousCity = isCityASafer ? cityBName : cityAName;

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Title Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
          <ArrowLeftRight className="w-4 h-4" /> Dual Telemetry Clash Engine
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white">{t.compareTitle}</h2>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          {t.compareSubtitle} ({profile?.medical_conditions?.join(', ') || 'General'}, {profile?.occupation?.replace('_', ' ') || 'General'}).
        </p>
      </div>

      {/* Destination Selector Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-400 text-xs font-bold uppercase">Comparing:</span>
          <span className="font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/20">{cityAName}</span>
          <span className="text-slate-500 font-bold">VS</span>
          <span className="font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">{cityBName}</span>
        </div>

        {/* Search destination */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchBQuery}
            onChange={(e) => handleSearchB(e.target.value)}
            placeholder="Change destination city..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />

          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-30 overflow-hidden">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => selectCityB(item)}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-slate-700 flex justify-between border-b border-slate-700/50 last:border-none"
                >
                  <span className="font-semibold text-white">{item.name}</span>
                  <span className="text-slate-400">{item.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading || !dataA || !dataB || !riskA || !riskB ? (
        <div className="p-16 text-center text-slate-400 text-sm">
          Fetching parallel dual-satellite telemetry...
        </div>
      ) : (
        <>
          {/* Clash Metric Battle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* City A Card */}
            <div className={`p-6 rounded-3xl border transition-all ${
              isCityASafer ? 'bg-slate-900/90 border-emerald-500/40 shadow-xl shadow-emerald-500/5' : 'bg-slate-900/70 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" /> City A (Residence)
                </span>
                {isCityASafer && (
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Healthier Choice
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-black text-white">{cityAName}</h3>
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="p-3 bg-slate-800/80 rounded-2xl">
                  <div className="text-[11px] text-slate-400">Temperature</div>
                  <div className="text-2xl font-black text-white mt-0.5">{dataA.temperature}°C</div>
                  <div className="text-[10px] text-orange-400">Feels like {dataA.feelsLike}°C</div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-2xl">
                  <div className="text-[11px] text-slate-400">US AQI</div>
                  <div className={`text-2xl font-black mt-0.5 ${dataA.aqi > 150 ? 'text-red-500' : 'text-orange-400'}`}>
                    {dataA.aqi}
                  </div>
                  <div className="text-[10px] text-slate-400">{dataA.aqiCategory}</div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-2xl">
                  <div className="text-[11px] text-slate-400">PM 2.5</div>
                  <div className="text-xl font-bold text-white mt-0.5">{dataA.pm25} µg/m³</div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-2xl">
                  <div className="text-[11px] text-slate-400">Risk Score</div>
                  <div className={`text-xl font-bold mt-0.5 ${riskA.score > 60 ? 'text-red-400' : 'text-green-400'}`}>
                    {riskA.score} / 100
                  </div>
                </div>
              </div>
            </div>

            {/* City B Card */}
            <div className={`p-6 rounded-3xl border transition-all ${
              !isCityASafer ? 'bg-slate-900/90 border-emerald-500/40 shadow-xl shadow-emerald-500/5' : 'bg-slate-900/70 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" /> City B (Destination)
                </span>
                {!isCityASafer && (
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Healthier Choice
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-black text-white">{cityBName}</h3>
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="p-3 bg-slate-800/80 rounded-2xl">
                  <div className="text-[11px] text-slate-400">Temperature</div>
                  <div className="text-2xl font-black text-white mt-0.5">{dataB.temperature}°C</div>
                  <div className="text-[10px] text-orange-400">Feels like {dataB.feelsLike}°C</div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-2xl">
                  <div className="text-[11px] text-slate-400">US AQI</div>
                  <div className={`text-2xl font-black mt-0.5 ${dataB.aqi > 150 ? 'text-red-500' : 'text-orange-400'}`}>
                    {dataB.aqi}
                  </div>
                  <div className="text-[10px] text-slate-400">{dataB.aqiCategory}</div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-2xl">
                  <div className="text-[11px] text-slate-400">PM 2.5</div>
                  <div className="text-xl font-bold text-white mt-0.5">{dataB.pm25} µg/m³</div>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-2xl">
                  <div className="text-[11px] text-slate-400">Risk Score</div>
                  <div className={`text-xl font-bold mt-0.5 ${riskB.score > 60 ? 'text-red-400' : 'text-green-400'}`}>
                    {riskB.score} / 100
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* AI Comparative Safety Verdict Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" /> Personal Health Safety Verdict
            </div>
            
            <h4 className="text-xl font-black text-white">
              {saferCity} is environmentally safer for your condition today.
            </h4>
            
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed mt-2">
              Comparing particulate concentrations: <strong className="text-white">{hazardousCity}</strong> exhibits a risk score of <strong className="text-red-400">{Math.max(riskA.score, riskB.score)}/100</strong> compared to <strong className="text-emerald-400">{Math.min(riskA.score, riskB.score)}/100</strong> in <strong className="text-white">{saferCity}</strong>.
              {profile?.medical_conditions?.length > 0 && (
                <span> For a patient registered with <strong className="text-white">{profile.medical_conditions.join(', ')}</strong>, traveling to {hazardousCity} without an N95 respirator and prescribed bronchodilator carries heightened acute bronchial inflammation risk.</span>
              )}
            </p>
          </div>
        </>
      )}

    </div>
  );
}
