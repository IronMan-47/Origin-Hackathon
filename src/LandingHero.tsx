import React, { useState } from 'react';
import { 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  Users, 
  Globe2, 
  Heart, 
  CloudSun, 
  UserCheck, 
  Brain, 
  Sparkles, 
  ChevronRight,
  Sun,
  Wind,
  Thermometer,
  Droplets,
  MapPin,
  X,
  Activity,
  Layers,
  Zap,
  Lock,
  ArrowLeftRight,
  TrendingUp,
  Map,
  CheckCircle2
} from 'lucide-react';
import type { EnvironmentalData } from './riskEngine';

export type PublicNavPage = 'home' | 'features' | 'how-it-works' | 'about';

interface LandingHeroProps {
  currentPage: PublicNavPage;
  onNavigate: (page: PublicNavPage) => void;
  onGetStarted: () => void;
  onSignIn: () => void;
  liveData: EnvironmentalData | null;
  userLocationName: string;
  isDarkMode?: boolean;
}

export default function LandingHero({ 
  currentPage, 
  onNavigate, 
  onGetStarted, 
  onSignIn, 
  liveData, 
  userLocationName,
  isDarkMode = true
}: LandingHeroProps) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const aqi = liveData?.aqi ?? 28;
  const temp = liveData?.temperature ?? 18;
  const feelsLike = liveData?.feelsLike ?? 17;
  const humidity = liveData?.humidity ?? 56;
  const isGood = aqi <= 50;

  return (
    <div className="min-h-screen w-full bg-transparent text-slate-100 relative overflow-x-hidden font-sans select-none flex flex-col justify-between">
      
      {/* Cinematic Background Glow Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-[-10%] w-[900px] h-[900px] bg-gradient-to-b from-blue-600/25 via-cyan-500/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[30%] -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/15 via-blue-600/5 to-transparent rounded-full blur-[120px]" />
      </div>

      {/* Top Navbar */}
      <header className={`relative z-30 w-full px-6 md:px-16 lg:px-24 h-20 flex items-center justify-between border-b backdrop-blur-md sticky top-0 ${isDarkMode ? 'border-white/5 bg-[#060b14]/70' : 'border-slate-200/50 bg-white/70'}`}>
        
        {/* Brand */}
        <div onClick={() => onNavigate('home')} className="flex items-center gap-3 cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <CloudSun className="w-4 h-4 text-white" />
          </div>
          <span className={`text-xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            WeatherWise<span className="text-cyan-400">.</span>
          </span>
        </div>

        {/* Center Nav Items with Dynamic Routing State */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold">
          <button 
            onClick={() => onNavigate('home')} 
            className={`transition-colors ${currentPage === 'home' ? 'text-cyan-400 font-bold' : (isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900')}`}
          >
            Home
          </button>
          <button 
            onClick={() => onNavigate('features')} 
            className={`transition-colors ${currentPage === 'features' ? 'text-cyan-400 font-bold' : (isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900')}`}
          >
            Features
          </button>
          <button 
            onClick={() => onNavigate('how-it-works')} 
            className={`transition-colors ${currentPage === 'how-it-works' ? 'text-cyan-400 font-bold' : (isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900')}`}
          >
            How It Works
          </button>
          <button 
            onClick={() => onNavigate('about')} 
            className={`transition-colors ${currentPage === 'about' ? 'text-cyan-400 font-bold' : (isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900')}`}
          >
            About
          </button>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onSignIn}
            className={`text-xs font-bold transition-colors ${isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Sign in
          </button>
          <button 
            onClick={onGetStarted}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Dynamic Route Content Body */}
      <main className="relative z-20 w-full px-6 md:px-16 lg:px-24 py-12 flex-1 flex flex-col justify-center max-w-[1600px] mx-auto">
        
        {/* ================= ROUTE 1: HOME PAGE ================= */}
        {currentPage === 'home' && (
          <div className="space-y-16 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-7">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-md shadow-inner text-cyan-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Personalized Environmental Intelligence</span>
                </div>

                <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Weather that <br />
                  <span className={`bg-gradient-to-r bg-clip-text text-transparent ${isDarkMode ? 'from-blue-400 via-cyan-300 to-indigo-300' : 'from-blue-500 via-cyan-400 to-indigo-500'}`}>
                    understands you.
                  </span>
                </h1>

                <p className={`text-base md:text-lg max-w-xl leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  WeatherWise combines real-time weather, air quality ($PM_{2.5}$), your unique health context, and clinical AI to explain exactly how the environment affects you personally.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={onGetStarted}
                    className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02]"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowVideoModal(true)}
                    className={`flex items-center gap-2.5 px-6 py-4 rounded-2xl border font-semibold text-sm backdrop-blur transition-all ${
                      isDarkMode 
                        ? 'bg-slate-900/80 hover:bg-slate-800 border-slate-700/80 text-slate-200 hover:text-white' 
                        : 'bg-white/60 hover:bg-white/80 border-slate-300/60 text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </div>
                    <span>Watch Overview</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-800/80 max-w-2xl">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-300 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" /> Free to use
                    </div>
                    <div className="text-[11px] text-slate-500">Get started today</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-300 text-xs font-bold">
                      <Users className="w-4 h-4 text-blue-400" /> Personalized
                    </div>
                    <div className="text-[11px] text-slate-500">Built around you</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-300 text-xs font-bold">
                      <Globe2 className="w-4 h-4 text-indigo-400" /> Global coverage
                    </div>
                    <div className="text-[11px] text-slate-500">Any location, anywhere</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-300 text-xs font-bold">
                      <Heart className="w-4 h-4 text-red-400" /> Health focused
                    </div>
                    <div className="text-[11px] text-slate-500">Actionable insights</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Glassmorphic Alex Card */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end relative w-full">
                
                <div className="hidden xl:block absolute -right-6 top-6 text-right z-30 font-serif italic text-cyan-300/80 text-xs space-y-0.5 pointer-events-none">
                  <p>Real telemetry.</p>
                  <p>Real insights.</p>
                  <p className="font-bold text-cyan-300">For you.</p>
                  <div className="text-cyan-400 text-lg">⤷</div>
                </div>

                <div className={`w-full max-w-lg backdrop-blur-2xl border rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden space-y-6 ${isDarkMode ? 'bg-slate-900/60 border-white/10' : 'bg-white/70 border-slate-200/90'}`}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Floating 3D Earth Telemetry Globe */}
                  <div className="relative flex items-center justify-center -mt-2 -mb-2">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-cyan-400/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" />
                    <img 
                      src="/hero.png" 
                      alt="Earth Atmospheric Telemetry Globe" 
                      className="w-44 h-44 object-contain relative z-10 filter drop-shadow-[0_15px_30px_rgba(14,165,233,0.5)] hover:scale-105 transition-all duration-500"
                    />
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-300 text-xs font-medium mb-1">
                        <Sun className={`w-3.5 h-3.5 ${isDarkMode ? 'text-amber-300' : 'text-amber-500'}`} /> <span className={isDarkMode ? 'text-amber-300' : 'text-amber-600'}>Good day,</span>
                      </div>
                      <h3 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Alex</h3>
                      <div className="flex items-center gap-1 text-xs mt-0.5 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{userLocationName || "New York, USA"}</span>
                      </div>
                    </div>

                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${isDarkMode ? 'bg-slate-800/80 border-slate-700/60 text-slate-400' : 'bg-slate-100/60 border-slate-200 text-slate-500'}`}>
                      <span className="text-xs">•••</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    <div className="sm:col-span-5 flex flex-col items-center justify-center">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className={isDarkMode ? "text-slate-800" : "text-slate-200"}
                            strokeWidth="3.2"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={isGood ? "text-emerald-400" : "text-cyan-400"}
                            strokeWidth="3.2"
                            strokeDasharray={`${aqi}, 100`}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-black text-white">{aqi}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
                          <span className="text-[9px] font-extrabold text-emerald-400 uppercase mt-0.5">LOW RISK</span>
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-7 space-y-2.5">
                      <div className="p-3 bg-slate-800/60 hover:bg-slate-800/80 border border-slate-700/60 rounded-2xl flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                            <Wind className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Air Quality</div>
                            <div className="text-sm font-bold text-white flex items-center gap-1.5">
                              <span>{aqi}</span>
                              <span className="text-emerald-400 text-xs font-semibold">Good</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>

                      <div className="p-3 bg-slate-800/60 hover:bg-slate-800/80 border border-slate-700/60 rounded-2xl flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                            <Thermometer className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Temperature</div>
                            <div className="text-sm font-bold text-white flex items-center gap-1.5">
                              <span>{temp}°C</span>
                              <span className="text-slate-400 text-[10px]">Feels like {feelsLike}°C</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>

                      <div className="p-3 bg-slate-800/60 hover:bg-slate-800/80 border border-slate-700/60 rounded-2xl flex items-center justify-between transition-colors">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                            <Droplets className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Humidity</div>
                            <div className="text-sm font-bold text-white flex items-center gap-1.5">
                              <span>{humidity}%</span>
                              <span className="text-slate-400 text-[10px]">Comfortable</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <div className="text-xs font-bold text-emerald-400">Good conditions today!</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Air quality and weather look favorable for your health profile.</div>
                  </div>

                  <div className="p-3.5 bg-gradient-to-r from-purple-500/10 via-slate-800/80 to-blue-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-white">Great time for outdoor activities</div>
                        <div className="text-[10px] text-slate-400">Low particulate pollution & mild temperature</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline Section */}
            <div className={`w-full backdrop-blur-xl border rounded-[32px] p-8 md:p-10 shadow-2xl ${isDarkMode ? 'bg-slate-900/50 border-slate-800/80' : 'bg-white/70 border-slate-200/90'}`}>
              <div className="mb-8">
                <span className={`text-[11px] uppercase font-black tracking-widest ${isDarkMode ? 'text-cyan-400' : 'text-blue-600'}`}>How It Works</span>
                <h2 className={`text-xl md:text-2xl font-black mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>From environment data to personal insight</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${isDarkMode ? 'bg-blue-600/20 border-blue-500/30 text-blue-400' : 'bg-blue-100 border-blue-200 text-blue-600'}`}>
                    <CloudSun className="w-6 h-6" />
                  </div>
                  <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>1. Environment Data</h4>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Real-time weather, particulate air quality ($PM_{2.5}$), UV, and satellite models at your location.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${isDarkMode ? 'bg-cyan-600/20 border-cyan-500/30 text-cyan-400' : 'bg-cyan-100 border-cyan-200 text-cyan-600'}`}>
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>2. Your Profile</h4>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Age, health context (Asthma, COPD, Cardio), occupation, and exposure sensitivity.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${isDarkMode ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400' : 'bg-indigo-100 border-indigo-200 text-indigo-600'}`}>
                    <Brain className="w-6 h-6" />
                  </div>
                  <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>3. Personal Risk</h4>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    A deterministic risk score that reflects what these conditions mean for you.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${isDarkMode ? 'bg-purple-600/20 border-purple-500/30 text-purple-400' : 'bg-purple-100 border-purple-200 text-purple-600'}`}>
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>4. AI Explanation</h4>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Clear, actionable advice powered by AI — explaining why and what to do.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ROUTE 2: FEATURES PAGE ================= */}
        {currentPage === 'features' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 text-cyan-400 text-xs font-bold border border-blue-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Comprehensive Feature Suite
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                Engineered for Clinical Environmental Accuracy
              </h1>
              <p className="text-slate-400 text-sm md:text-base">
                WeatherWise bridges the gap between raw meteorology and individual human biology with deterministic risk scoring.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-8 rounded-[32px] bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
                <div className="p-3 w-fit rounded-2xl bg-blue-500/20 text-blue-400">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Deterministic Risk Engine</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Calculates vulnerability from 0 to 100 using NOAA heat stress models and US-EPA particulate thresholds customized to your reported illnesses.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-[32px] bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
                <div className="p-3 w-fit rounded-2xl bg-purple-500/20 text-purple-400">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">AI Clinical Health Advisor</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time conversational medical intelligence answering questions like workout safety, mask requirements, and home ventilation windows.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-[32px] bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
                <div className="p-3 w-fit rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <ArrowLeftRight className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">City Clash & Travel Compare</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Compare two cities side-by-side with a personalized safety verdict before commuting or traveling for business.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="p-8 rounded-[32px] bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
                <div className="p-3 w-fit rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">24h Diurnal & 7d Trends</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hourly curves tracking when particulate smog traps and clears throughout the day, providing safe window alerts.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="p-8 rounded-[32px] bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
                <div className="p-3 w-fit rounded-2xl bg-amber-500/20 text-amber-400">
                  <Map className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Global Leaflet Geospatial Map</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Point-and-click interactive vector map fetching live ground station and satellite metrics anywhere on earth.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="p-8 rounded-[32px] bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors">
                <div className="p-3 w-fit rounded-2xl bg-red-500/20 text-red-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Emergency Asthma First-Aid</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  One-tap acute respiratory protocol providing immediate rescue dosage and breathing guidance during smog episodes.
                </p>
              </div>
            </div>

            <div className="text-center pt-6">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-xl hover:scale-105 transition-all"
              >
                Experience All Features Now
              </button>
            </div>
          </div>
        )}

        {/* ================= ROUTE 3: HOW IT WORKS PAGE ================= */}
        {currentPage === 'how-it-works' && (
          <div className="space-y-12 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
                <Layers className="w-3.5 h-3.5" /> Technical Pipeline
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                How WeatherWise Transforms Raw Sensors into Action
              </h1>
              <p className="text-slate-400 text-sm md:text-base">
                A transparent, four-tier architecture designed for latency-free intelligence.
              </p>
            </div>

            <div className="space-y-6">
              {/* Step 1 Card */}
              <div className="p-8 rounded-[32px] bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 font-black text-xl">
                  01
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Multi-Source Atmospheric Ingestion</h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                    WeatherWise simultaneously queries the <strong>World Air Quality Index (WAQI)</strong> physical station network and <strong>Open-Meteo European Copernicus</strong> satellite models to extract high-resolution $PM_{2.5}$, $PM_{10}$, temperature, wind, and humidity.
                  </p>
                </div>
              </div>

              {/* Step 2 Card */}
              <div className="p-8 rounded-[32px] bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center shrink-0 font-black text-xl">
                  02
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Clinical Profile Calibration</h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                    During onboarding, users select verified physiological factors: age bracket, occupation exposure tier (e.g. 6-10hr outdoor field work vs indoor desk), and clinical sensitivities (Asthma, COPD, Cardiovascular history, Allergies).
                  </p>
                </div>
              </div>

              {/* Step 3 Card */}
              <div className="p-8 rounded-[32px] bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 font-black text-xl">
                  03
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Deterministic Vulnerability Synthesis</h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                    Our rule engine calculates non-linear exposure multipliers based on peer-reviewed US-EPA and NOAA medical standards, producing an unambiguous 0–100 Personal Risk Score with primary environmental triggers.
                  </p>
                </div>
              </div>

              {/* Step 4 Card */}
              <div className="p-8 rounded-[32px] bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 font-black text-xl">
                  04
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">Contextual Health Guidance</h3>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                    Clinical AI translates telemetry into actionable life decisions: mask specifications (N95 vs surgical), optimal outdoor exercise hours, room ventilation timing, and instant emergency protocols.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center pt-6">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-xl hover:scale-105 transition-all"
              >
                Create Your Profile Now
              </button>
            </div>
          </div>
        )}

        {/* ================= ROUTE 4: ABOUT PAGE ================= */}
        {currentPage === 'about' && (
          <div className="space-y-12 max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                <Heart className="w-3.5 h-3.5" /> Our Mission
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                Democratizing Preventative Environmental Health
              </h1>
              <p className="text-slate-400 text-sm md:text-base">
                Standard weather forecasts tell you if it will rain. WeatherWise tells you if the air you breathe will trigger respiratory distress.
              </p>
            </div>

            <div className="p-8 md:p-10 rounded-[32px] bg-slate-900/80 border border-slate-800 space-y-6">
              <h3 className="text-2xl font-bold text-white">The Problem We Are Solving</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Over 300 million people worldwide suffer from Asthma, and over 65 million live with COPD. Standard weather apps display raw numbers like "AQI 160" or "34°C" without translating what that means for an outdoor construction worker versus an asthmatic child.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                WeatherWise was created to transform ambient environmental telemetry into a personal shield — helping vulnerable individuals plan their days, protect their lungs, and make informed choices.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="p-4 bg-slate-950 rounded-2xl text-center">
                  <div className="text-2xl font-black text-cyan-400">100%</div>
                  <div className="text-xs text-slate-400 mt-1">Free & Open Access</div>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl text-center">
                  <div className="text-2xl font-black text-blue-400">Zero</div>
                  <div className="text-xs text-slate-400 mt-1">Ad Network Tracking</div>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl text-center">
                  <div className="text-2xl font-black text-purple-400">Global</div>
                  <div className="text-xs text-slate-400 mt-1">Real-time Telemetry</div>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={onGetStarted}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-xl hover:scale-105 transition-all"
              >
                Join WeatherWise Today
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Video Modal (Optional) */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-3">WeatherWise Platform Demo</h3>
            <div className="aspect-video bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center text-slate-500 text-sm">
              <span>Interactive 1-Minute Walkthrough Video</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
