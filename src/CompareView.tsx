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
  isDarkMode?: boolean;
}

export default function CompareView({ profile, lang, isDarkMode = true }: CompareViewProps) {
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

  const cardBase = isDarkMode 
    ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl' 
    : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl shadow-slate-200/50 backdrop-blur-md';

  const cardSubtext = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const cardHeading = isDarkMode ? 'text-white' : 'text-slate-900';
  const innerTile = isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200';

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Title Header */}
      <div className={`border rounded-3xl p-6 md:p-8 shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${cardBase}`}>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">
          <ArrowLeftRight className="w-4 h-4" /> Dual Telemetry Clash Engine
        </div>
        <h2 className={`text-2xl md:text-3xl font-black ${cardHeading}`}>{t.compareTitle}</h2>
        <p className={`text-xs md:text-sm mt-1 ${cardSubtext}`}>
          {t.compareSubtitle} ({profile?.medical_conditions?.join(', ') || 'General'}, {profile?.occupation?.replace('_', ' ') || 'General'}).
        </p>
      </div>

      {/* Destination Selector Bar */}
      <div className={`border rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 ${cardBase}`}>
        <div className="flex items-center gap-3 text-sm flex-wrap">
          <span className={`text-xs font-bold uppercase ${cardSubtext}`}>Comparing:</span>
          <span className="font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/20">{cityAName}</span>
          <span className="text-slate-400 font-bold">VS</span>
          <span className="font-bold text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-xl border border-indigo-500/20">{cityBName}</span>
        </div>

        {/* Search destination */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchBQuery}
            onChange={(e) => handleSearchB(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label="Search destination city"
            className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              isDarkMode 
                ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' 
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />

          {searchResults.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-1 border rounded-xl shadow-2xl z-30 overflow-hidden ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'
            }`}>
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => selectCityB(item)}
                  className={`w-full text-left px-3 py-2 text-xs flex justify-between border-b last:border-none ${
                    isDarkMode ? 'hover:bg-slate-700 border-slate-700/50 text-white' : 'hover:bg-slate-100 border-slate-200 text-slate-900'
                  }`}
                >
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-slate-400">{item.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading || !dataA || !dataB || !riskA || !riskB ? (
        <div className={`p-16 text-center text-sm font-semibold animate-pulse ${cardSubtext}`}>
          Fetching parallel dual-satellite telemetry...
        </div>
      ) : (
        <>
          {/* Clash Metric Battle Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* City A Card */}
            <div className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              isCityASafer 
                ? 'border-emerald-500/50 shadow-xl shadow-emerald-500/10' 
                : 'border-slate-300'
            } ${cardBase}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${cardSubtext}`}>
                  <MapPin className="w-3.5 h-3.5 text-blue-500" /> {t.cityA}
                </span>
                {isCityASafer && (
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                    {t.healthierChoice}
                  </span>
                )}
              </div>

              <h3 className={`text-2xl font-black ${cardHeading}`}>{cityAName}</h3>
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className={`p-3 rounded-2xl border ${innerTile}`}>
                  <div className={`text-[11px] ${cardSubtext}`}>{t.temp}</div>
                  <div className={`text-2xl font-black mt-0.5 ${cardHeading}`}>{dataA.temperature}°C</div>
                  <div className="text-[10px] text-orange-500 font-bold">{t.feelsLike} {dataA.feelsLike}°C</div>
                </div>

                <div className={`p-3 rounded-2xl border ${innerTile}`}>
                  <div className={`text-[11px] ${cardSubtext}`}>{t.aqi}</div>
                  <div className={`text-2xl font-black mt-0.5 ${dataA.aqi > 150 ? 'text-red-500' : 'text-orange-500'}`}>
                    {dataA.aqi}
                  </div>
                  <div className={`text-[10px] truncate ${cardSubtext}`}>{dataA.aqiCategory}</div>
                </div>

                <div className={`p-3 rounded-2xl border ${innerTile}`}>
                  <div className={`text-[11px] ${cardSubtext}`}>{t.pm25}</div>
                  <div className={`text-xl font-bold mt-0.5 ${cardHeading}`}>{dataA.pm25} µg/m³</div>
                </div>

                <div className={`p-3 rounded-2xl border ${innerTile}`}>
                  <div className={`text-[11px] ${cardSubtext}`}>{t.riskScore}</div>
                  <div className={`text-xl font-bold mt-0.5 ${riskA.score > 60 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {riskA.score} / 100
                  </div>
                </div>
              </div>
            </div>

            {/* City B Card */}
            <div className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              !isCityASafer 
                ? 'border-emerald-500/50 shadow-xl shadow-emerald-500/10' 
                : 'border-slate-300'
            } ${cardBase}`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${cardSubtext}`}>
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {t.cityB}
                </span>
                {!isCityASafer && (
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                    {t.healthierChoice}
                  </span>
                )}
              </div>

              <h3 className={`text-2xl font-black ${cardHeading}`}>{cityBName}</h3>
              
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className={`p-3 rounded-2xl border ${innerTile}`}>
                  <div className={`text-[11px] ${cardSubtext}`}>{t.temp}</div>
                  <div className={`text-2xl font-black mt-0.5 ${cardHeading}`}>{dataB.temperature}°C</div>
                  <div className="text-[10px] text-orange-500 font-bold">{t.feelsLike} {dataB.feelsLike}°C</div>
                </div>

                <div className={`p-3 rounded-2xl border ${innerTile}`}>
                  <div className={`text-[11px] ${cardSubtext}`}>{t.aqi}</div>
                  <div className={`text-2xl font-black mt-0.5 ${dataB.aqi > 150 ? 'text-red-500' : 'text-orange-500'}`}>
                    {dataB.aqi}
                  </div>
                  <div className={`text-[10px] truncate ${cardSubtext}`}>{dataB.aqiCategory}</div>
                </div>

                <div className={`p-3 rounded-2xl border ${innerTile}`}>
                  <div className={`text-[11px] ${cardSubtext}`}>{t.pm25}</div>
                  <div className={`text-xl font-bold mt-0.5 ${cardHeading}`}>{dataB.pm25} µg/m³</div>
                </div>

                <div className={`p-3 rounded-2xl border ${innerTile}`}>
                  <div className={`text-[11px] ${cardSubtext}`}>{t.riskScore}</div>
                  <div className={`text-xl font-bold mt-0.5 ${riskB.score > 60 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {riskB.score} / 100
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* AI Comparative Safety Verdict Card */}
          <div className={`border rounded-3xl p-6 md:p-8 shadow-2xl hover:-translate-y-0.5 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/30' 
              : 'bg-gradient-to-r from-white via-indigo-50/60 to-white border-indigo-200 shadow-indigo-100'
          }`}>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" /> {t.verdictTitle}
            </div>
            
            <h4 className={`text-xl font-black ${cardHeading}`}>
              {saferCity} is environmentally safer for your condition today.
            </h4>
            
            <p className={`text-xs md:text-sm leading-relaxed mt-2 ${cardSubtext}`}>
              Comparing particulate concentrations: <strong className={cardHeading}>{hazardousCity}</strong> exhibits a risk score of <strong className="text-red-500">{Math.max(riskA.score, riskB.score)}/100</strong> compared to <strong className="text-emerald-500">{Math.min(riskA.score, riskB.score)}/100</strong> in <strong className={cardHeading}>{saferCity}</strong>.
              {profile?.medical_conditions?.length > 0 && (
                <span> For a patient registered with <strong className={cardHeading}>{profile.medical_conditions.join(', ')}</strong>, traveling to {hazardousCity} without an N95 respirator and prescribed bronchodilator carries heightened acute bronchial inflammation risk.</span>
              )}
            </p>
          </div>
        </>
      )}

    </div>
  );
}
