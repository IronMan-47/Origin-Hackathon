import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Onboarding from './Onboarding';
import DashboardView from './DashboardView';
import AdvisorChat from './AdvisorChat';
import CompareView from './CompareView';
import TrendsView from './TrendsView';
import MapExplorer from './MapExplorer';
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
  X
} from 'lucide-react';

type Tab = 'dashboard' | 'advisor' | 'compare' | 'trends' | 'explorer';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  // Global App States: Navigation Tab, Accessibility Theme & Language
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [publicPage, setPublicPage] = useState<PublicNavPage>('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
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
            data: { display_name: name.trim() || 'User' }
          }
        });
        if (error) throw error;

        // If session didn't auto-create due to Supabase confirmation settings, try instant password login
        if (!data.session) {
          const { error: autoSignInError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim()
          });
          if (autoSignInError) {
            setMessage({ 
              text: 'Account created! (Note: In Supabase dashboard -> Auth -> Providers -> Email, turn off "Confirm email" for instant login).', 
              type: 'success' 
            });
          }
        }
      }
    } catch (err: any) {
      console.error("Supabase Auth Error:", err);
      setMessage({ text: err.message || 'Authentication error. Please check credentials.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Instant Guest / Demo Bypass Mode for seamless testing across any laptop
  const handleGuestDemo = () => {
    const mockUser = {
      id: 'demo-user-' + Math.floor(Math.random() * 10000),
      email: 'demo.evaluator@weatherwise.app',
      user_metadata: { display_name: 'Demo Evaluator' }
    };
    setSession({ user: mockUser });
    loadProfile(mockUser.id);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // 0. Initial Session Check Loader
  if (checkingSession) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-sm ${
        isDarkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Connecting to WeatherWise...</span>
        </div>
      </div>
    );
  }

  // 1. If user is NOT logged in -> Show Premium Landing Hero with Auth Overlay
  if (!session) {
    return (
      <div className="relative">
        {/* Cinematic Landing Hero with Dedicated Public Routes */}
        <LandingHero 
          currentPage={publicPage}
          onNavigate={setPublicPage}
          onGetStarted={() => {
            setIsLogin(false);
            setShowAuthModal(true);
          }}
          onSignIn={() => {
            setIsLogin(true);
            setShowAuthModal(true);
          }}
          liveData={envTelemetry}
          userLocationName={profile?.location_name || "New York, USA"}
        />

        {/* Elegant Modal Auth Dialog */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-md backdrop-blur-2xl border p-8 md:p-10 rounded-[32px] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-300 ${
              isDarkMode ? 'bg-slate-900/95 border-slate-700 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
            }`}>
              
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" /> Supabase Cloud Auth
                </div>
                <h2 className="text-3xl font-black tracking-tight">{t.appName}<span className="text-cyan-400">.</span></h2>
                <p className="text-xs mt-1.5 opacity-70">
                  {isLogin ? 'Sign in to access environmental health intelligence' : 'Create your account to personalize advisories'}
                </p>
              </div>

              {message && (
                <div className={`mb-5 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 border ${
                  message.type === 'error' 
                    ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                    : 'bg-green-500/10 border-green-500/30 text-green-400'
                }`}>
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-3.5">
                {!isLogin && (
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider opacity-75 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Parker"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-xs transition-all ${
                        isDarkMode ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider opacity-75 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-xs transition-all ${
                      isDarkMode ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider opacity-75 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-xs transition-all ${
                      isDarkMode ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 text-xs"
                >
                  {loading ? 'Processing...' : (
                    <>
                      {isLogin ? 'Log In' : 'Create Account'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 text-center text-xs opacity-75">
                <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setMessage(null);
                  }}
                  className="text-cyan-400 font-semibold hover:underline"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </div>

              {/* Instant 1-Click Demo Evaluator Access */}
              <div className="mt-5 pt-3.5 border-t border-slate-700/50 text-center">
                <button
                  type="button"
                  onClick={handleGuestDemo}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                    isDarkMode 
                      ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
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
        onComplete={() => {
          setIsOnboarding(false);
          loadProfile(session.user.id);
        }}
      />
    );
  }

  // 3. Authenticated App Shell with Multi-Tab Navigation & Accessibility Controls
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Persistent Accessible Topbar */}
      <header className={`h-16 border-b px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur ${
        isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200 shadow-sm'
      }`}>
        
        {/* Brand & Safest Window Badge */}
        <div className="flex items-center gap-3">
          <span className="text-xl md:text-2xl font-black tracking-tight">{t.appName}<span className="text-blue-500">.</span></span>
          
          {/* Smart Safe Window Indicator Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.safeWindowBadge}: <strong>6:00 AM - 8:30 AM</strong></span>
          </div>
        </div>

        {/* Action Controls: Emergency Action, Language, Dark Mode, Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Emergency Asthma Protocol Trigger */}
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-full transition-all animate-pulse"
            title="Immediate Respiratory First Aid Protocol"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.emergencyAction}</span>
          </button>

          {/* Language Selector */}
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <Globe className="w-3.5 h-3.5 opacity-60" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent focus:outline-none cursor-pointer text-xs"
            >
              <option value="en" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'}>EN</option>
              <option value="hi" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'}>हिन्दी</option>
              <option value="es" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-black'}>ES</option>
            </select>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full border transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-yellow-400 hover:bg-slate-800' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="Toggle Accessible Dark / Light Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Recalibrate Profile */}
          <button
            onClick={() => setIsOnboarding(true)}
            className="hidden md:flex items-center gap-1 text-xs opacity-75 hover:opacity-100 transition-opacity ml-1"
          >
            <RotateCw className="w-3.5 h-3.5" /> {t.recalibrate}
          </button>

          {/* User Badge & Logout */}
          <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <User className="w-3.5 h-3.5 text-blue-500" />
            <span className="max-w-[100px] truncate">{profile?.display_name || session.user.email}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
            title={t.logout}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Persistent Multi-Tab Navigation Bar */}
      <nav className={`border-b px-4 md:px-8 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none sticky top-16 z-20 backdrop-blur ${
        isDarkMode ? 'bg-slate-950/90 border-slate-800/80' : 'bg-white/90 border-slate-200'
      }`}>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'opacity-70 hover:opacity-100 hover:bg-slate-800/30'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> {t.navDashboard}
        </button>

        <button
          onClick={() => setActiveTab('advisor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'advisor'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'opacity-70 hover:opacity-100 hover:bg-slate-800/30'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> {t.navAdvisor}
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'compare'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'opacity-70 hover:opacity-100 hover:bg-slate-800/30'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" /> {t.navCompare}
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'trends'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'opacity-70 hover:opacity-100 hover:bg-slate-800/30'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> {t.navTrends}
        </button>

        <button
          onClick={() => setActiveTab('explorer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'explorer'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'opacity-70 hover:opacity-100 hover:bg-slate-800/30'
          }`}
        >
          <Map className="w-4 h-4" /> {t.navExplorer}
        </button>
      </nav>

      {/* Active Tab View Body */}
      <main className="flex-1 p-4 md:p-8">
        {activeTab === 'dashboard' && (
          <DashboardView 
            profile={profile} 
            onRecalibrate={() => setIsOnboarding(true)} 
          />
        )}

        {activeTab === 'advisor' && (
          <AdvisorChat 
            profile={profile} 
            envData={envTelemetry}
            lang={language} 
          />
        )}

        {activeTab === 'compare' && (
          <CompareView 
            profile={profile} 
            lang={language} 
          />
        )}

        {activeTab === 'trends' && (
          <TrendsView 
            profile={profile} 
            lang={language} 
          />
        )}

        {activeTab === 'explorer' && (
          <MapExplorer 
            profile={profile} 
            lang={language} 
          />
        )}
      </main>

      {/* Accessible Emergency Asthma Protocol Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`max-w-lg w-full rounded-3xl p-6 md:p-8 border shadow-2xl relative ${
            isDarkMode ? 'bg-slate-900 border-red-500/40 text-white' : 'bg-white border-red-300 text-slate-900'
          }`}>
            <button
              onClick={() => setShowEmergencyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full opacity-70 hover:opacity-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-wider text-xs mb-3">
              <ShieldAlert className="w-5 h-5" /> Acute Environmental First-Aid Action Plan
            </div>

            <h3 className="text-xl font-bold mb-3">Severe Airway Constriction Protocol</h3>
            
            <ol className="space-y-3 text-xs md:text-sm leading-relaxed list-decimal list-inside opacity-90">
              <li><strong>Immediate Reliever:</strong> Administer 2 to 4 puffs of your prescribed rapid-acting bronchodilator (Salbutamol / Albuterol) through a spacer device.</li>
              <li><strong>Positioning:</strong> Sit upright immediately. Do not lie flat on your back. Loosen tight clothing around your collar.</li>
              <li><strong>Environmental Barrier:</strong> Move inside an air-conditioned or HEPA-filtered enclosed room immediately. Close all external windows.</li>
              <li><strong>Pursed-Lip Breathing:</strong> Inhale slowly through your nose and exhale gently through pursed lips to keep small airway branches patent.</li>
              <li><strong>Emergency Escalation:</strong> If shortness of breath continues past 15 minutes or lips turn bluish, immediately dial national emergency medical services (112 / 911 / 108).</li>
            </ol>

            <div className="mt-6 pt-4 border-t border-slate-700/50 flex justify-end">
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
