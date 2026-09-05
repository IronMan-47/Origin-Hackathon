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
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { supabase } from './supabaseClient';

interface OnboardingProps {
  userId: string;
  initialName?: string;
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

export default function Onboarding({ userId, initialName = '', onComplete }: OnboardingProps) {
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
        occupation: occupation,
        medical_conditions: selectedConditions,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      };

      // 1. Cache in localStorage so dashboard ALWAYS opens without DB lag
      localStorage.setItem(`weatherwise_profile_${userId}`, JSON.stringify(profilePayload));

      // 2. Try updating Supabase (if columns exist)
      try {
        const { error: updateError } = await supabase
          .from('profiles')
          .update(profilePayload)
          .eq('id', userId);

        if (updateError) {
          console.warn("Supabase update notice (using cached profile fallback):", updateError.message);
        }
      } catch (dbErr) {
        console.warn("DB update skipped:", dbErr);
      }

      onComplete();
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col items-center justify-center p-4 md:p-8 relative bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(6, 11, 20, 0.85), rgba(6, 11, 20, 0.95)), url('/hero-bg.jpeg')`
      }}
    >
      {/* Background radial highlight */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-2xl bg-slate-900/85 border border-white/10 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl relative z-10 flex flex-col">
        
        {/* Progress Tracker */}
        <div className="border-b border-slate-800/80 p-6 pb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-3">
            <span>STEP {step} OF {totalSteps}</span>
            <span className="text-blue-400 font-bold">
              {step === 1 && "Personal Identity"}
              {step === 2 && "Primary Residence"}
              {step === 3 && "Health Profile & Vulnerabilities"}
              {step === 4 && "Daily Exposure Profile"}
              {step === 5 && "Review & Confirmation"}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
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
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-400" /> Basic Demographics
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Age and physiological traits affect how particulate matter ($PM_{2.5}$) and thermal stress impact breathing.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    What should we call you? *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Aarav Sharma"
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Age in Years *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      required
                      value={age}
                      onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="E.g. 26"
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Biological Gender / Sex
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Prefer not to disclose</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other / Non-Binary</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-start gap-2.5 text-xs text-blue-300">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Children and older adults experience higher respiratory rates and reduced thermoregulation under severe AQI.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-blue-400" /> Primary Monitoring Location
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Global location support. Search any city, district, or town worldwide to anchor your default environmental data.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Search Any City or Town Worldwide
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => handleLocationSearch(e.target.value)}
                      placeholder="Type city name (e.g. Delhi, Mumbai, London, Raipur)..."
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  {/* Live geocoding results */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-h-48 overflow-y-auto z-30">
                      {searchResults.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => selectLocation(item)}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-700/70 border-b border-slate-700/50 last:border-none text-xs flex justify-between items-center transition-colors"
                        >
                          <span className="font-semibold text-slate-200">{item.name}, {item.admin1 || ''}</span>
                          <span className="text-slate-400">{item.country}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Location Card */}
                <div className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-lg">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Location Anchor</div>
                      <div className="text-base font-bold text-white mt-0.5">{locationName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">Lat: {latitude.toFixed(4)} | Lon: {longitude.toFixed(4)}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-semibold">
                    Live Synced
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: VAST MEDICAL CONDITIONS DROPDOWN / MULTI-SELECT */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <HeartPulse className="w-6 h-6 text-red-400" /> Medical Conditions & Sensitivities
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Select all that apply. Our Deterministic Risk Engine recalculates your risk index based on peer-reviewed clinical sensitivities.
                </p>
              </div>

              {/* Filter / Search within conditions */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={medicalSearchQuery}
                  onChange={(e) => setMedicalSearchQuery(e.target.value)}
                  placeholder="Filter conditions (e.g. Asthma, Heart, Allergy, COPD)..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Categorized Scrollable List */}
              <div className="max-h-[250px] overflow-y-auto space-y-4 pr-1.5 scrollbar-thin scrollbar-thumb-slate-700">
                {MEDICAL_CONDITIONS_CATEGORIES.map((cat, i) => {
                  const filtered = cat.items.filter(item => 
                    item.label.toLowerCase().includes(medicalSearchQuery.toLowerCase())
                  );
                  if (filtered.length === 0) return null;

                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                        {cat.category}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {filtered.map(cond => {
                          const isSelected = selectedConditions.includes(cond.id);
                          return (
                            <button
                              type="button"
                              key={cond.id}
                              onClick={() => toggleCondition(cond.id)}
                              className={`text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                                  : 'bg-slate-800/50 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                              }`}
                            >
                              <span className="truncate pr-2">{cond.label}</span>
                              {isSelected ? (
                                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
                <span>Selected: <strong className="text-white">{selectedConditions.length} condition(s)</strong></span>
                <span className="text-[11px] text-slate-500">Not shared with any advertising networks</span>
              </div>
            </div>
          )}

          {/* STEP 4: Occupation & Exposure */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-indigo-400" /> Occupation & Routine
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  How many hours of outdoor particulate exposure does your daily work involve?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
                {OCCUPATIONS.map((occ) => {
                  const isSelected = occupation === occ.id;
                  return (
                    <button
                      type="button"
                      key={occ.id}
                      onClick={() => setOccupation(occ.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                          : 'bg-slate-800/50 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-white">{occ.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          occ.badge.includes('High') ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {occ.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{occ.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Final Review */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-400" /> Ready to Calibrate
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Review your profile summary before launching your live environmental dashboard.
                </p>
              </div>

              <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-5 space-y-3.5 text-xs">
                <div className="flex justify-between border-b border-slate-700/60 pb-2.5">
                  <span className="text-slate-400">Name</span>
                  <span className="font-bold text-white">{name || 'User'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/60 pb-2.5">
                  <span className="text-slate-400">Demographics</span>
                  <span className="font-bold text-white">{age ? `${age} years old` : 'Age unspecified'}, {gender || 'Gender unspecified'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/60 pb-2.5">
                  <span className="text-slate-400">Location Anchor</span>
                  <span className="font-bold text-blue-400">{locationName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-700/60 pb-2.5">
                  <span className="text-slate-400">Occupation Exposure</span>
                  <span className="font-bold text-indigo-300">
                    {OCCUPATIONS.find(o => o.id === occupation)?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reported Conditions</span>
                  <span className="font-bold text-red-300 text-right">
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
          <div className="pt-6 flex items-center justify-between border-t border-slate-800 mt-6">
            <button
              type="button"
              disabled={step === 1 || saving}
              onClick={() => setStep(s => Math.max(1, s - 1))}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors ${
                step === 1 ? 'opacity-0 pointer-events-none' : ''
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
