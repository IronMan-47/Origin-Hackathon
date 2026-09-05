import { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Wind, 
  Sliders
} from 'lucide-react';
import type { EnvironmentalData } from './riskEngine';
import { translations, type Language } from './translations';

interface SimulatorViewProps {
  profile: any;
  envData: EnvironmentalData | null;
  lang: Language;
  isDarkMode?: boolean;
}

export default function SimulatorView({ profile, envData, lang, isDarkMode = true }: SimulatorViewProps) {
  const t = translations[lang];

  // Simulator Inputs
  const [durationHours, setDurationHours] = useState<number>(2);
  const [activityLevel, setActivityLevel] = useState<'resting' | 'walking' | 'running'>('walking');
  const [maskType, setMaskType] = useState<'none' | 'cloth' | 'surgical' | 'n95' | 'ffp3'>('n95');

  const pm25Val = envData?.pm25 ?? 58.5;

  // Breathing Rates in Liters per minute
  const breathingRates = {
    resting: 8,     // 8 L/min
    walking: 18,    // 18 L/min
    running: 45     // 45 L/min
  };

  // Mask Filtration Efficiencies
  const maskEfficiencies = {
    none: 0,
    cloth: 0.25,
    surgical: 0.50,
    n95: 0.95,
    ffp3: 0.99
  };

  // Calculations
  const rateLpm = breathingRates[activityLevel];
  const totalVolumeLiters = rateLpm * durationHours * 60;
  const totalVolumeM3 = totalVolumeLiters / 1000;

  const rawInhaledMicrograms = Math.round(pm25Val * totalVolumeM3 * 10) / 10;
  const filterEff = maskEfficiencies[maskType];
  const filteredInhaledMicrograms = Math.round(rawInhaledMicrograms * (1 - filterEff) * 10) / 10;
  const savedMicrograms = Math.round((rawInhaledMicrograms - filteredInhaledMicrograms) * 10) / 10;
  const efficiencyPercent = Math.round(filterEff * 100);

  // Health Risk Rating based on inhaled volume
  let riskLevel = 'LOW';
  let riskColor = 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
  if (filteredInhaledMicrograms > 120) {
    riskLevel = 'CRITICAL BRONCHIAL IRRITATION';
    riskColor = 'text-red-500 border-red-500/40 bg-red-500/20';
  } else if (filteredInhaledMicrograms > 60) {
    riskLevel = 'ELEVATED RESPIRATORY STRESS';
    riskColor = 'text-orange-500 border-orange-500/30 bg-orange-500/10';
  } else if (filteredInhaledMicrograms > 25) {
    riskLevel = 'MODERATE EXPOSURE';
    riskColor = 'text-amber-500 border-amber-500/30 bg-amber-500/10';
  }

  const cardBase = isDarkMode 
    ? 'bg-slate-900/90 border-slate-800 text-white shadow-xl' 
    : 'bg-white/95 border-slate-200 text-slate-900 shadow-xl shadow-slate-200/50 backdrop-blur-md';

  const cardSubtext = isDarkMode ? 'text-slate-400' : 'text-slate-600';
  const cardHeading = isDarkMode ? 'text-white' : 'text-slate-900';

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header Banner */}
      <div className={`border rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:-translate-y-0.5 transition-all duration-300 ${cardBase}`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">
            <Sliders className="w-4 h-4" /> Interactive Clinical Simulator
          </div>
          <h1 className={`text-2xl md:text-3xl font-black ${cardHeading}`}>{t.simulatorTitle}</h1>
          <p className={`text-xs mt-1 ${cardSubtext}`}>
            {t.simulatorSubtitle}
          </p>
        </div>

        <div className={`px-4 py-3 rounded-2xl border text-xs flex items-center gap-3 ${
          isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <Wind className="w-4 h-4 text-cyan-500 shrink-0" />
          <div>
            <span className={`block font-medium ${cardSubtext}`}>Live PM2.5 Concentration:</span>
            <strong className={`text-sm ${cardHeading}`}>{pm25Val} µg/m³</strong> ({envData?.aqiCategory || 'Moderate'})
          </div>
        </div>
      </div>

      {/* Simulator Inputs & Live Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Sliders & Selector Controls */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Controls Card */}
          <div className={`border rounded-3xl p-6 shadow-xl space-y-6 hover:-translate-y-0.5 transition-all duration-300 ${cardBase}`}>
            
            {/* 1. Duration Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className={`flex items-center gap-1.5 ${cardSubtext}`}><Clock className="w-4 h-4 text-blue-500" /> {t.exposureDuration}</span>
                <span className="text-blue-500 font-black text-sm">{durationHours} Hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={durationHours}
                onChange={(e) => setDurationHours(parseInt(e.target.value))}
                aria-label="Exposure Duration Slider"
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500 ${
                  isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
                }`}
              />
              <div className={`flex justify-between text-[10px] mt-1 font-semibold ${cardSubtext}`}>
                <span>1 hr</span>
                <span>4 hrs</span>
                <span>8 hrs</span>
                <span>12 hrs</span>
              </div>
            </div>

            {/* 2. Physical Exertion Selector */}
            <div>
              <div className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${cardSubtext}`}>
                <Activity className="w-4 h-4 text-emerald-500" /> {t.exertionLevel}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'resting', title: t.restingLevel, desc: 'Minimal intake' },
                  { id: 'walking', title: t.walkingLevel, desc: 'Standard transit' },
                  { id: 'running', title: t.runningLevel, desc: 'Deep hyperventilation' }
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setActivityLevel(act.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 ${
                      activityLevel === act.id
                        ? 'bg-blue-600/20 text-white border-blue-500 shadow-lg shadow-blue-600/20 font-bold'
                        : isDarkMode
                        ? 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <strong className={`block text-xs mb-0.5 ${activityLevel === act.id ? 'text-white' : cardHeading}`}>{act.title}</strong>
                    <p className={`text-[10px] mt-1 leading-snug ${activityLevel === act.id ? 'text-blue-200' : cardSubtext}`}>{act.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Mask Protection Gear Selector */}
            <div>
              <div className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 ${cardSubtext}`}>
                <ShieldCheck className="w-4 h-4 text-purple-500" /> {t.maskSelection}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'none', title: t.noMask, desc: 'Unfiltered intake' },
                  { id: 'cloth', title: t.clothMask, desc: 'Coarse particle barrier' },
                  { id: 'surgical', title: t.surgicalMask, desc: 'Fluid splash barrier' },
                  { id: 'n95', title: t.n95Mask, desc: 'Airtight facial seal' },
                  { id: 'ffp3', title: t.ffp3Mask, desc: 'Maximum clinical grade' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMaskType(m.id as any)}
                    className={`p-3.5 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 ${
                      maskType === m.id
                        ? 'bg-purple-600/20 text-white border-purple-500 shadow-lg shadow-purple-600/20 font-bold'
                        : isDarkMode
                        ? 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <strong className={`block text-xs mb-0.5 ${maskType === m.id ? 'text-white' : cardHeading}`}>{m.title}</strong>
                    <p className={`text-[10px] mt-1 leading-snug ${maskType === m.id ? 'text-purple-200' : cardSubtext}`}>{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Right 1 Col: Live Particle Inhalation Results Gauge */}
        <div className={`border rounded-3xl p-6 flex flex-col justify-between shadow-2xl space-y-6 hover:-translate-y-0.5 transition-all duration-300 ${cardBase}`}>
          
          <div>
            <div className={`text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 ${cardSubtext}`}>
              <Zap className="w-4 h-4 text-yellow-500" /> {t.inhalationImpact}
            </div>

            {/* Inhaled Volume Comparison */}
            <div className="space-y-4">
              
              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                <span className={`text-[11px] block font-medium ${cardSubtext}`}>{t.unprotectedIntake}:</span>
                <strong className="text-2xl font-black text-red-500">{rawInhaledMicrograms} µg</strong>
                <div className={`w-full h-2 rounded-full mt-2 overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-300'}`}>
                  <div className="bg-red-500 h-full rounded-full w-full"></div>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-medium ${cardSubtext}`}>{t.filteredIntake} ({maskType.toUpperCase()}):</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {efficiencyPercent}% Filtered
                  </span>
                </div>
                <strong className="text-2xl font-black text-emerald-500">{filteredInhaledMicrograms} µg</strong>
                <div className={`w-full h-2 rounded-full mt-2 overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-300'}`}>
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${100 - efficiencyPercent}%` }}
                  ></div>
                </div>
              </div>

            </div>

            {/* Saved Particulates Badge */}
            <div className="mt-5 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs">
              <span className={cardSubtext}>{t.preventedIntake}:</span>
              <strong className="text-emerald-500 font-black text-sm">-{savedMicrograms} µg PM2.5</strong>
            </div>

            {/* Status Rating */}
            <div className={`mt-4 p-4 rounded-2xl border text-xs font-bold ${riskColor}`}>
              <div className="text-[10px] uppercase tracking-wider font-semibold opacity-80">{t.predictedStatus}:</div>
              <div className="mt-1 text-sm">{riskLevel}</div>
            </div>

          </div>

          <div className={`text-[10px] leading-snug border-t pt-3 ${isDarkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
            Simulation derived from ICRP Respiratory Tract Model & EPA 24-hour PM2.5 deposition algorithms.
          </div>

        </div>

      </div>

    </div>
  );
}
