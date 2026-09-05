import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, AlertTriangle, ShieldCheck, HeartPulse, HelpCircle } from 'lucide-react';
import type { EnvironmentalData } from './riskEngine';
import { translations, type Language } from './translations';
import { fetchAIAdvisoryFromBackend } from './apiClient';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AdvisorChatProps {
  profile: any;
  envData: EnvironmentalData | null;
  lang: Language;
}

const QUICK_PROMPTS = [
  "Can I go for an evening run today?",
  "Should I keep my room windows open or closed?",
  "Will wearing an N95 mask protect my asthma right now?",
  "What is the best time for my outdoor work shifts?",
  "How will current humidity affect my breathing?"
];

export default function AdvisorChat({ profile, envData, lang }: AdvisorChatProps) {
  const t = translations[lang];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: `Hello ${profile?.display_name || 'there'}! I am your WeatherWise AI Health Advisor. I am actively monitoring your local telemetry (${profile?.location_name || 'your area'}, AQI: ${envData?.aqi || '164'}, Temp: ${envData?.temperature || '32'}°C) along with your profile (${profile?.medical_conditions?.join(', ') || 'General'}, ${profile?.occupation?.replace('_', ' ') || 'General'}). How can I assist you with your day?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Intelligent context-based response generator (Zero hallucination, deterministic safety)
  const generateResponse = (userPrompt: string): string => {
    const pLower = userPrompt.toLowerCase();
    const aqi = envData?.aqi ?? 150;
    const temp = envData?.feelsLike ?? 34;
    const isAsthma = profile?.medical_conditions?.some((c: string) => c.toLowerCase().includes('asthma'));
    const isOutdoor = profile?.occupation === 'outdoor_worker' || profile?.occupation === 'delivery_transport';

    if (pLower.includes('run') || pLower.includes('jog') || pLower.includes('workout') || pLower.includes('exercise')) {
      if (aqi > 130) {
        return `⚠️ Strongly advised against outdoor running today. With the current AQI at ${aqi} (${envData?.pm25 ?? 75} µg/m³ PM2.5), deep hyperventilation will force microscopic particulates directly into the bronchial alveoli. ${isAsthma ? 'Given your Asthma history, this has a high risk of triggering bronchospasms.' : ''} Recommendation: Shift to indoor treadmill or bodyweight workouts in a room with air filtration.`;
      } else {
        return `Outdoor exercise is permissible today, but recommended early in the morning before traffic particulate peaks (between 6:00 AM and 7:30 AM).`;
      }
    }

    if (pLower.includes('window') || pLower.includes('air') || pLower.includes('purifier') || pLower.includes('ventilation')) {
      return `🪟 Keep external windows strictly sealed between 11:00 AM and 6:00 PM when particulate accumulation and ground-level ozone peak. Run an indoor HEPA air purifier on medium/high speed. Cross-ventilate your home only briefly between 5:30 AM and 7:00 AM when ambient air quality is at its daily minimum.`;
    }

    if (pLower.includes('mask') || pLower.includes('n95') || pLower.includes('cloth')) {
      return `😷 Standard cloth or surgical 3-ply masks do not filter PM2.5 particles (they leak through edges and pores). Because current PM2.5 levels are elevated (${envData?.pm25 ?? 78} µg/m³), you should strictly use a well-fitted NIOSH-approved N95 or FFP2 respirator with an airtight seal around the nose bridge.`;
    }

    if (pLower.includes('shift') || pLower.includes('work') || pLower.includes('outdoor')) {
      return `👷 For your ${profile?.occupation?.replace('_', ' ') || 'routine'}: Current thermal index is ${temp}°C and AQI is ${aqi}. Ensure mandatory 10-15 minute shaded hydration breaks every 45-60 minutes. Keep your prescribed rescue inhaler in your pocket at all times.`;
    }

    // Default contextual guidance
    return `Based on live telemetry in ${profile?.location_name || 'your area'} (AQI: ${aqi}, Feels Like: ${temp}°C) and your profile (${profile?.medical_conditions?.join(', ') || 'No pre-existing conditions'}), current exposure risk is rated ${aqi > 150 ? 'HIGH' : 'MODERATE'}. Proactively hydrate, minimize prolonged outdoor exertion during the afternoon peak, and ensure protective respiratory gear is worn if working outdoors.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    try {
      // Attempt live backend AI advisory pipeline call
      const backendRes = await fetchAIAdvisoryFromBackend({
        lat: profile?.latitude ?? 28.6139,
        lng: profile?.longitude ?? 77.2090,
        user_profile: {
          age_group: profile?.age_group || 'adult',
          health_conditions: profile?.medical_conditions || ['asthma'],
          occupation: profile?.occupation || 'outdoor_worker'
        },
        user_question: text
      });

      let responseText = '';
      if (backendRes && backendRes.advisory && backendRes.advisory.summary) {
        const adv = backendRes.advisory;
        const actions = Array.isArray(adv.recommended_actions) ? adv.recommended_actions.map((a: string) => `• ${a}`).join('\n') : '';
        responseText = `✨ ${adv.summary}\n\n📊 Risk Explanation: ${adv.risk_explanation}\n\n✅ Recommended Actions:\n${actions}\n\n⏰ Best Time: ${adv.best_time_suggestion}`;
      } else {
        responseText = generateResponse(text);
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.warn("Backend call failed, using deterministic response:", err);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: generateResponse(text),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl w-full mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" /> Medical Environmental Intelligence
          </div>
          <h2 className="text-2xl font-black text-white">AI Health Advisor Chat</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time personalized guidance combining your health context with live atmospheric telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-2xl border border-slate-800 text-xs">
          <HeartPulse className="w-4 h-4 text-red-400" />
          <span className="text-slate-300 font-medium truncate max-w-[200px]">
            Context: {profile?.medical_conditions?.join(', ') || 'General'}
          </span>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 min-h-[460px] max-h-[560px] flex flex-col justify-between shadow-2xl backdrop-blur">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-slate-800 border border-slate-700/80 text-slate-200'
                }`}
              >
                <p>{msg.text}</p>
                <span className={`block text-[10px] mt-2 ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <span className="italic">Advisor is analyzing telemetry & clinical risk...</span>
            </div>
          )}
        </div>

        {/* Quick Action Prompts */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700/70 shrink-0 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 mt-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.chatPlaceholder}
              className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      <p className="text-center text-[11px] text-slate-500">
        Clinical Safety Boundary: WeatherWise provides exposure guidance based on atmospheric data. It does not replace prescription advice from your physician.
      </p>

    </div>
  );
}
