import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Onboarding from './Onboarding';
import DashboardView from './DashboardView';
import AdvisorChat from './AdvisorChat';
import CompareView from './CompareView';
import TrendsView from './TrendsView';
import MapExplorer from './MapExplorer';
import SimulatorView from './SimulatorView';
import LandingHero, { type PublicNavPage } from './LandingHero';
import { fetchLiveEnvironment } from './environmentService';
import type { EnvironmentalData } from './riskEngine';
import { translations, type Language } from './translations';
import { 
  ShieldCheck, 
  ArrowRight, 
  User, 
  LogOut, 
  AlertCircle, 
  RotateCw,
  LayoutDashboard,
  MessageSquare,
  ArrowLeftRight,
  TrendingUp,
  Map,
  Moon,
  Sun,
  Globe,
  Clock,
  ShieldAlert,
  Sparkles,
  Sliders,
  X,
  Home
} from 'lucide-react';

type Tab = 'home' | 'dashboard' | 'advisor' | 'simulator' | 'compare' | 'trends' | 'explorer';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  // Global App States: Navigation Tab, Accessibility Theme & Language
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [publicPage, setPublicPage] = useState<PublicNavPage>('home');
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to clean, modern Light Mode
  const [language, setLanguage] = useState<Language>('en');
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [envTelemetry, setEnvTelemetry] = useState<EnvironmentalData | null>(null);

  // Auth Form State
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  const t = translations[language];

  // Fetch user profile from Supabase or cached localStorage
  const loadProfile = async (userId: string) => {
    setLoadingProfile(true);
    try {
      const cached = localStorage.getItem(`weatherwise_profile_${userId}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.onboarding_completed) {
            setProfile(parsed);
            setIsOnboarding(false);
            setLoadingProfile(false);
            setCheckingSession(false);
            // Fetch telemetry for global safe-window badge
            fetchLiveEnvironment(parsed.latitude ?? 21.25, parsed.longitude ?? 81.63).then(setEnvTelemetry);
            return;
          }
        } catch (e) {
          console.warn("Cached profile parse error:", e);
        }
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn("Profile fetch error:", error);
      }

      if (data && data.onboarding_completed) {
        setProfile(data);
        setIsOnboarding(false);
        fetchLiveEnvironment(data.latitude ?? 21.25, data.longitude ?? 81.63).then(setEnvTelemetry);
      } else {
        setIsOnboarding(true);
      }
    } catch (e) {
      console.error(e);
      setIsOnboarding(true);
    } finally {
      setLoadingProfile(false);
      setCheckingSession(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadProfile(session.user.id);
      } else {
        setCheckingSession(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setIsOnboarding(false);
        setCheckingSession(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: { display_name: name.trim() || email.split('@')[0] }
          }
        });
        if (error) throw error;
        if (data.session) {
          setMessage({ text: 'Account created successfully!', type: 'success' });
        } else {
          setMessage({ text: 'Account created! Please check your email to confirm.', type: 'success' });
        }
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Authentication failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Instant Guest Evaluator Demo Access
  const handleGuestDemo = () => {
    const demoUser = {
      id: 'demo_evaluator_001',
      email: 'evaluator@weatherwise.ai'
    };
    const demoProfile = {
      id: demoUser.id,
      display_name: 'Evaluator Guest',
      age: 28,
      gender: 'specified',
      location_name: 'Raipur, Chhattisgarh',
      latitude: 21.25,
      longitude: 81.63,
      medical_conditions: ['asthma', 'dust_allergy'],
      occupation: 'outdoor_worker',
      onboarding_completed: true
    };
    
    setSession({ user: demoUser });
    setProfile(demoProfile);
    setIsOnboarding(false);
    fetchLiveEnvironment(21.25, 81.63).then(setEnvTelemetry);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setIsOnboarding(false);
  };

  if (checkingSession) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center space-y-4 font-sans bg-cover bg-center bg-fixed bg-no-repeat ${
        isDarkMode ? 'text-slate-100' : 'text-slate-900'
      }`} style={{ backgroundImage: `url('${isDarkMode ? '/Bg.png' : '/lbg.png'}')` }}>
        <div className={`absolute inset-0 -z-10 ${isDarkMode ? 'bg-slate-950/60' : 'bg-white/40'}`}></div>
        <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold tracking-wide animate-pulse">Initializing WeatherWise Medical Telemetry Engine...</p>
      </div>
    );
  }

  // 1. Public Landing Page (Unauthenticated Users)
  if (!session) {
    return (
      <div className={`min-h-screen relative font-sans bg-app-wallpaper bg-cover bg-center bg-fixed bg-no-repeat ${isDarkMode ? 'text-slate-100' : 'text-slate-900 light-mode'}`}
           style={{ backgroundImage: `url('${isDarkMode ? '/Bg.png' : '/lbg.png'}')` }}>
        <div className={`absolute inset-0 -z-10 ${isDarkMode ? 'bg-slate-950/40' : 'bg-white/30 backdrop-blur-[2px]'}`}></div>
        <LandingHero 
          currentPage={publicPage}
          onNavigate={setPublicPage}
          onGetStarted={() => setShowAuthModal(true)} 
          onSignIn={() => setShowAuthModal(true)}
          liveData={envTelemetry}
          userLocationName="Raipur, Chhattisgarh"
          isDarkMode={isDarkMode}
        />

        {/* Modal Auth Dialog */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className={`max-w-md w-full rounded-3xl p-6 md:p-8 border shadow-2xl relative animate-in fade-in zoom-in duration-300 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <button
                onClick={() => setShowAuthModal(false)}
                aria-label="Close modal"
                className="absolute top-5 right-5 p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-black">{isLogin ? 'Welcome Back' : 'Create Profile'}</h3>
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isLogin ? 'Sign in to access live environmental telemetry & risk engine' : 'Sign up to build your personal asthma & particulate exposure model'}
                </p>
              </div>

              {message && (
                <div className={`p-3 rounded-2xl text-xs font-semibold mb-4 border flex items-center gap-2 ${
                  message.type === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-green-500/10 text-green-500 border-green-500/30'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-80">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Alex Vance"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs ${
                        isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-80">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-80">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  {loading ? 'Processing...' : (
                    <>
                      {isLogin ? 'Log In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 text-center text-xs opacity-80">
                <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage(null);
                  }}
                  className="text-blue-500 font-bold hover:underline"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </div>

              {/* Instant 1-Click Demo Evaluator Access */}
              <div className="mt-5 pt-3.5 border-t border-slate-300/30 text-center">
                <button
                  type="button"
                  onClick={handleGuestDemo}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                    isDarkMode 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                  <span>Instant Guest / Demo Mode</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. User Logged In BUT hasn't completed Onboarding -> Show Onboarding Flow
  if (isOnboarding) {
    return (
      <Onboarding 
        userId={session.user.id}
        initialName={profile?.display_name || session.user.user_metadata?.display_name || ''}
        isDarkMode={isDarkMode}
        onCancel={() => setIsOnboarding(false)}
        onComplete={() => {
          setIsOnboarding(false);
          loadProfile(session.user.id);
        }}
      />
    );
  }

  // 3. Authenticated App Shell with Multi-Tab Navigation & Accessibility Controls
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 relative overflow-hidden font-sans bg-app-wallpaper bg-cover bg-center bg-fixed bg-no-repeat ${
      isDarkMode ? 'text-slate-100' : 'text-slate-900 light-mode'
    }`} style={{ backgroundImage: `url('${isDarkMode ? '/Bg.png' : '/lbg.png'}')` }}>
      {/* Dynamic overlay to ensure readability */}
      <div className={`absolute inset-0 -z-10 ${isDarkMode ? 'bg-slate-950/40' : 'bg-white/30'}`}></div>
      {/* Ambient Flowing Background Mesh */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>
      
      {/* Persistent Accessible Topbar */}
      <header className={`h-16 border-b px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur transition-colors ${
        isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/85 border-slate-200 shadow-sm'
      }`}>
        
        {/* Brand & Safest Window Badge */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <span className="text-xl md:text-2xl font-black tracking-tight">{t.appName}<span className="text-blue-500">.</span></span>
          
          {/* Smart Safe Window Indicator Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.safeWindowBadge}: <strong>6:00 AM - 8:30 AM</strong></span>
          </div>
        </div>

        {/* Action Controls: Emergency Action, Language, Dark Mode, Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Emergency Asthma Protocol Trigger */}
          <button
            onClick={() => setShowEmergencyModal(true)}
            aria-label="Immediate Emergency Protocol"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-full transition-all animate-pulse"
            title="Immediate Respiratory First Aid Protocol"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.emergencyAction}</span>
          </button>

          {/* Regional Indian Language Selector */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <Globe className="w-3.5 h-3.5 opacity-70" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label="Select Language"
              className="bg-transparent focus:outline-none cursor-pointer text-xs font-bold"
            >
              <option value="en" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'}>EN (English)</option>
              <option value="hi" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'}>हिन्दी (Hindi)</option>
              <option value="bn" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'}>বাংলা (Bengali)</option>
              <option value="mr" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'}>मराठी (Marathi)</option>
              <option value="ta" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'}>தமிழ் (Tamil)</option>
              <option value="te" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'}>తెలుగు (Telugu)</option>
            </select>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle Light and Dark Mode"
            className={`p-2 rounded-full border transition-all ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800' : 'bg-slate-100 border-slate-300 text-amber-600 hover:bg-slate-200'
            }`}
            title="Toggle Accessible Dark / Light Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Recalibrate Profile */}
          <button
            onClick={() => setIsOnboarding(true)}
            className={`hidden md:flex items-center gap-1 text-xs font-semibold transition-opacity ml-1 ${
              isDarkMode ? 'opacity-80 hover:opacity-100 text-slate-300' : 'opacity-90 hover:opacity-100 text-slate-700'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" /> {t.recalibrate}
          </button>

          {/* User Badge & Logout */}
          <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border font-semibold ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-800'
          }`}>
            <User className="w-3.5 h-3.5 text-blue-500" />
            <span className="max-w-[100px] truncate">{profile?.display_name || session.user.email}</span>
          </div>

          <button
            onClick={handleLogout}
            aria-label="Logout of application"
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
            title={t.logout}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Persistent Multi-Tab Navigation Bar */}
      <nav 
        role="navigation"
        aria-label="Main Application Tabs"
        className={`border-b px-4 md:px-8 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none sticky top-16 z-20 backdrop-blur transition-colors ${
          isDarkMode ? 'bg-slate-950/90 border-slate-800/80' : 'bg-white/90 border-slate-200/90 shadow-sm'
        }`}
      >
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'home'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : isDarkMode ? 'opacity-70 hover:opacity-100 hover:bg-slate-800/30 text-slate-300' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Home className="w-4 h-4 text-cyan-400" /> {t.navHome}
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : isDarkMode ? 'opacity-70 hover:opacity-100 hover:bg-slate-800/30 text-slate-300' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> {t.navDashboard}
        </button>

        <button
          onClick={() => setActiveTab('advisor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'advisor'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : isDarkMode ? 'opacity-70 hover:opacity-100 hover:bg-slate-800/30 text-slate-300' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> {t.navAdvisor}
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'simulator'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : isDarkMode ? 'opacity-70 hover:opacity-100 hover:bg-slate-800/30 text-slate-300' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4 text-purple-500" /> {t.navSimulator}
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'compare'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : isDarkMode ? 'opacity-70 hover:opacity-100 hover:bg-slate-800/30 text-slate-300' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" /> {t.navCompare}
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'trends'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : isDarkMode ? 'opacity-70 hover:opacity-100 hover:bg-slate-800/30 text-slate-300' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> {t.navTrends}
        </button>

        <button
          onClick={() => setActiveTab('explorer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'explorer'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : isDarkMode ? 'opacity-70 hover:opacity-100 hover:bg-slate-800/30 text-slate-300' : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Map className="w-4 h-4" /> {t.navExplorer}
        </button>
      </nav>

      {/* Active Tab View Body */}
      <main className="flex-1 p-4 md:p-8">
        {activeTab === 'home' && (
          <LandingHero 
            currentPage={publicPage}
            onNavigate={setPublicPage}
            onGetStarted={() => setActiveTab('dashboard')} 
            onSignIn={() => setActiveTab('dashboard')}
            liveData={envTelemetry}
            userLocationName={profile?.location_name || "Raipur, Chhattisgarh"}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView 
            profile={profile} 
            onRecalibrate={() => setIsOnboarding(true)} 
            lang={language}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'advisor' && (
          <AdvisorChat 
            profile={profile} 
            envData={envTelemetry}
            lang={language} 
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'simulator' && (
          <SimulatorView 
            profile={profile} 
            envData={envTelemetry}
            lang={language} 
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'compare' && (
          <CompareView 
            profile={profile} 
            lang={language} 
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'trends' && (
          <TrendsView 
            profile={profile} 
            lang={language} 
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === 'explorer' && (
          <MapExplorer 
            profile={profile} 
            lang={language} 
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {/* Accessible Emergency Asthma Protocol Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-lg w-full rounded-3xl p-6 md:p-8 border shadow-2xl relative ${
            isDarkMode ? 'bg-slate-900 border-red-500/40 text-white' : 'bg-white border-red-300 text-slate-900'
          }`}>
            <button
              onClick={() => setShowEmergencyModal(false)}
              aria-label="Close emergency protocol dialog"
              className="absolute top-5 right-5 p-2 rounded-full opacity-70 hover:opacity-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-wider text-xs mb-3">
              <ShieldAlert className="w-5 h-5" /> Acute Environmental First-Aid Action Plan
            </div>

            <h3 className="text-xl font-bold mb-3">Severe Airway Constriction Protocol</h3>
            
            <ol className="space-y-3 text-xs md:text-sm leading-relaxed list-decimal list-inside opacity-90 font-medium">
              <li><strong>Immediate Reliever:</strong> Administer 2 to 4 puffs of your prescribed rapid-acting bronchodilator (Salbutamol / Albuterol) through a spacer device.</li>
              <li><strong>Positioning:</strong> Sit upright immediately. Do not lie flat on your back. Loosen tight clothing around your collar.</li>
              <li><strong>Environmental Barrier:</strong> Move inside an air-conditioned or HEPA-filtered enclosed room immediately. Close all external windows.</li>
              <li><strong>Pursed-Lip Breathing:</strong> Inhale slowly through your nose and exhale gently through pursed lips to keep small airway branches patent.</li>
              <li><strong>Emergency Escalation:</strong> If shortness of breath continues past 15 minutes or lips turn bluish, immediately dial national emergency medical services (112 / 911 / 108).</li>
            </ol>

            <div className="mt-6 pt-4 border-t border-slate-300/30 flex justify-end">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-colors"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
