import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  HeartPulse, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { supabase } from './supabaseClient';

interface OnboardingProps {
  userId: string;
  initialName?: string;
  isDarkMode?: boolean;
  onCancel?: () => void;
  onComplete: () => void;
}

// Comprehensive categorized list of medical conditions
const MEDICAL_CONDITIONS_CATEGORIES = [
  {
    category: "Respiratory",
    items: [
      { id: "asthma", label: "Asthma (Mild / Moderate / Severe)", severity: "high" },
      { id: "copd", label: "COPD / Chronic Bronchitis", severity: "critical" },
      { id: "allergic_rhinitis", label: "Allergic Rhinitis (Hay Fever)", severity: "moderate" },
      { id: "sinusitis", label: "Chronic Sinusitis", severity: "low" },
      { id: "pulmonary_fibrosis", label: "Pulmonary Fibrosis", severity: "critical" },
      { id: "emphysema", label: "Emphysema", severity: "high" }
    ]
  },
  {
    category: "Cardiovascular",
    items: [
      { id: "hypertension", label: "Hypertension (High BP)", severity: "moderate" },
      { id: "coronary_artery", label: "Coronary Artery Disease", severity: "high" },
      { id: "heart_failure", label: "Congestive Heart Failure", severity: "critical" },
      { id: "arrhythmia", label: "Arrhythmia / Irregular Heartbeat", severity: "high" },
      { id: "stroke_history", label: "Past Stroke / TIA", severity: "high" }
    ]
  },
  {
    category: "Immunological & Metabolic",
    items: [
      { id: "diabetes_t1", label: "Type 1 Diabetes", severity: "moderate" },
      { id: "diabetes_t2", label: "Type 2 Diabetes", severity: "moderate" },
      { id: "autoimmune", label: "Autoimmune Disorders (Lupus, RA)", severity: "moderate" },
      { id: "immunocompromised", label: "Immunocompromised State", severity: "high" }
    ]
  },
  {
    category: "Other Environmental Vulnerabilities",
    items: [
      { id: "dust_allergy", label: "Severe Dust / Pollen Allergy", severity: "moderate" },
      { id: "migraines", label: "Weather/Pressure Triggered Migraines", severity: "low" },
      { id: "heat_sensitivity", label: "Heat Sensitivity / Anhidrosis", severity: "moderate" },
      { id: "eye_irritation", label: "Chronic Dry Eyes / Ocular Irritation", severity: "low" },
      { id: "none", label: "None / No Known Pre-existing Conditions", severity: "none" }
    ]
  }
];

const OCCUPATIONS = [
  { id: "outdoor_worker", title: "Outdoor Construction / Field Worker", desc: "Highest air & heat exposure (6-10 hrs outdoors)", badge: "High Exposure" },
  { id: "delivery_transport", title: "Delivery / Traffic Driver / Courier", desc: "Constant exposure to vehicular exhaust & pollutants", badge: "High Exposure" },
  { id: "athlete_fitness", title: "Athlete / Sports Trainer / Runner", desc: "Deep respiratory intake & high ventilation rate", badge: "Elevated Intake" },
  { id: "indoor_office", title: "Corporate / Office / Desk Worker", desc: "Mostly climate-controlled environment with occasional transit", badge: "Low Exposure" },
  { id: "student_academic", title: "Student / Campus Resident", desc: "Mixed indoor/outdoor transit between classes", badge: "Moderate Exposure" },
  { id: "remote_home", title: "Remote / Work From Home", desc: "Minimal involuntary outdoor exposure", badge: "Low Exposure" },
  { id: "senior_retired", title: "Retired / Senior Citizen", desc: "Reduced physical resilience to sudden weather extremes", badge: "Vulnerable" },
  { id: "other", title: "Other / General", desc: "Standard general daily exposure profile", badge: "General" }
];

export default function Onboarding({ userId, initialName = '', isDarkMode = true, onCancel, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Form State
  const [name, setName] = useState(initialName);
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<string>('');
  
  // Location
  const [locationName, setLocationName] = useState('Raipur, Chhattisgarh');
  const [latitude, setLatitude] = useState(21.25);
  const [longitude, setLongitude] = useState(81.63);
  const [locationSearching, setLocationSearching] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Medical conditions
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [medicalSearchQuery, setMedicalSearchQuery] = useState('');

  // Occupation
  const [occupation, setOccupation] = useState('indoor_office');

  // Saving state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Toggle condition
  const toggleCondition = (id: string) => {
    if (id === 'none') {
      setSelectedConditions(['none']);
      return;
    }
    
    let updated = selectedConditions.filter(c => c !== 'none');
    if (updated.includes(id)) {
      updated = updated.filter(c => c !== id);
    } else {
      updated.push(id);
    }
    setSelectedConditions(updated);
  };

  // Location search using Open-Meteo Geocoding
  const handleLocationSearch = async (query: string) => {
    setLocationQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setLocationSearching(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLocationSearching(false);
    }
  };

  const selectLocation = (loc: any) => {
    const full = `${loc.name}, ${loc.admin1 || ''} ${loc.country || ''}`.trim();
    setLocationName(full);
    setLatitude(loc.latitude);
    setLongitude(loc.longitude);
    setSearchResults([]);
    setLocationQuery('');
  };

  const handleFinish = async () => {
    setSaving(true);
    setError(null);

    try {
      const profilePayload = {
        display_name: name || 'User',
        age: age ? Number(age) : null,
        gender: gender || 'unspecified',
        location_name: locationName,
        latitude: latitude,
        longitude: longitude,
        medical_conditions: selectedConditions,
        occupation: occupation,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      };

      // Save locally to immediate localStorage cache
      localStorage.setItem(`weatherwise_profile_${userId}`, JSON.stringify({
        id: userId,
        ...profilePayload
      }));

      // Persist to Supabase Database (Try direct update first, then upsert fallback)
      try {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(profilePayload)
          .eq('id', userId);

        if (updateError) {
          console.warn("Direct update notice, attempting upsert fallback:", updateError.message);
          const { error: upsertError } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              ...profilePayload
            });
          if (upsertError) {
            console.warn("Supabase upsert notice:", upsertError.message);
          }
        }
      } catch (dbErr) {
        console.warn("DB sync notice:", dbErr);
      }

      onComplete();
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Background radial highlight */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      <div className={`w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden backdrop-blur relative z-10 flex flex-col border transition-all ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200 shadow-slate-200/50'
      }`}>
        
        {/* Progress Tracker with Cancel Button */}
        <div className={`border-b p-6 pb-4 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between text-xs font-semibold mb-3">
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>STEP {step} OF {totalSteps}</span>
            
            <div className="flex items-center gap-3">
              <span className="text-blue-500 font-bold">
                {step === 1 && "Personal Identity"}
                {step === 2 && "Primary Residence"}
                {step === 3 && "Health Profile & Vulnerabilities"}
                {step === 4 && "Daily Exposure Profile"}
                {step === 5 && "Review & Confirmation"}
              </span>

              {/* Explicit Cancel / Close Button */}
              {onCancel && (
                <button
                  onClick={onCancel}
                  type="button"
                  className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                    isDarkMode 
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
                  }`}
                  title="Cancel and return to Dashboard"
                  aria-label="Close Profile Editor"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          </div>

          <div className={`h-2 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8 flex-1 min-h-[420px] flex flex-col justify-between">
          
          {/* STEP 1: Name, Age, Gender */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-2xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  <User className="w-6 h-6 text-blue-500" /> Basic Demographics
                </h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Age and physiological traits affect how particulate matter (PM2.5) and thermal stress impact breathing.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    What should we call you? *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className={`w-full px-4 py-3 border rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Age (Years) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
                      placeholder="e.g. 28"
                      className={`w-full px-4 py-3 border rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other / Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-2xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  <MapPin className="w-6 h-6 text-blue-500" /> Primary Residence & Location
                </h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Search your city or region to anchor hyper-local satellite weather and air quality telemetry.
                </p>
              </div>

              <div className="relative">
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  Search City or Coordinates
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => handleLocationSearch(e.target.value)}
                    placeholder="e.g. Raipur, Delhi, Mumbai, London..."
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                </div>

                {searchResults.length > 0 && (
                  <div className={`absolute top-full left-0 right-0 mt-1 border rounded-xl shadow-2xl z-30 overflow-hidden ${
                    isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-300'
                  }`}>
                    {searchResults.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectLocation(loc)}
                        className={`w-full text-left px-4 py-2.5 text-xs flex justify-between border-b last:border-none ${
                          isDarkMode ? 'hover:bg-slate-700 border-slate-700/50 text-white' : 'hover:bg-slate-100 border-slate-200 text-slate-900'
                        }`}
                      >
                        <span className="font-semibold">{loc.name}, {loc.admin1}</span>
                        <span className="text-slate-400">{loc.country}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                <div className="text-xs text-slate-400 font-semibold uppercase">Currently Selected Location:</div>
                <div className={`text-base font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{locationName}</div>
                <div className="text-xs text-blue-500 font-medium mt-0.5">
                  Lat: {latitude.toFixed(4)} | Lon: {longitude.toFixed(4)}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Medical Conditions */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-2xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  <HeartPulse className="w-6 h-6 text-red-500" /> Health Conditions & Triggers
                </h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Select any pre-existing conditions so WeatherWise can calibrate custom risk weights for PM2.5, ozone, and humidity.
                </p>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                {MEDICAL_CONDITIONS_CATEGORIES.map((cat, idx) => (
                  <div key={idx} className="space-y-2">
                    <h4 className="text-xs font-bold text-blue-500 uppercase tracking-wider">{cat.category}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cat.items.map((item) => {
                        const isSelected = selectedConditions.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleCondition(item.id)}
                            className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                                : isDarkMode
                                ? 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{item.label}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-1" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Occupation & Exertion */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-2xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  <Briefcase className="w-6 h-6 text-indigo-500" /> Occupation & Exposure Profile
                </h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Different daily routines expose you to varying levels of outdoor air pollutants and ventilation demands.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {OCCUPATIONS.map((occ) => {
                  const isSelected = occupation === occ.id;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setOccupation(occ.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-600/20 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                          : isDarkMode
                          ? 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <strong className={`text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{occ.title}</strong>
                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                          {occ.badge}
                        </span>
                      </div>
                      <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{occ.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Review */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-2xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  <ShieldCheck className="w-6 h-6 text-emerald-500" /> Confirmation & Calibration
                </h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Verify your profile settings before building your personal environmental health baseline.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border space-y-3 text-xs ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}>
                <div className="flex justify-between border-b border-slate-700/50 pb-2.5">
                  <span className="text-slate-400">Display Name</span>
                  <span className="font-bold">{name || 'Not provided'} ({age} yrs, {gender || 'Unspecified'})</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/50 pb-2.5">
                  <span className="text-slate-400">Anchored Residence</span>
                  <span className="font-bold text-blue-500">{locationName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/50 pb-2.5">
                  <span className="text-slate-400">Occupation Exposure</span>
                  <span className="font-bold text-indigo-500">
                    {OCCUPATIONS.find(o => o.id === occupation)?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reported Conditions</span>
                  <span className="font-bold text-red-500 text-right">
                    {selectedConditions.length > 0 ? selectedConditions.join(', ') : 'None reported'}
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className={`pt-6 flex items-center justify-between border-t mt-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              type="button"
              disabled={step === 1 || saving}
              onClick={() => setStep(s => Math.max(1, s - 1))}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                step === 1 ? 'opacity-0 pointer-events-none' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < totalSteps ? (
              <button
                type="button"
                disabled={step === 1 && (!name || !age)}
                onClick={() => setStep(s => Math.min(totalSteps, s + 1))}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/25 transition-all"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={saving}
                onClick={handleFinish}
                className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-xl shadow-blue-600/30 transition-all"
              >
                {saving ? "Saving to Supabase..." : "Finish & View Dashboard"}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
