# WeatherWise — Full Stack Architecture & Frontend Handoff Guide

## 1. Project Overview
WeatherWise is an AI-powered personalized environmental health intelligence platform. It fuses real-time atmospheric telemetry (Temperature, Humidity, Wind, US-EPA AQI, PM2.5, UV Index) with individual health profiles (e.g. Asthma, COPD, age, occupation) through a deterministic risk engine and contextual AI advisory.

---

## 2. Directory Structure (`origin-react/`)

```
origin-react/
├── index.html                 # Leaflet Map CDN & Tailwind configuration
├── package.json               # Vite, React 19, Lucide React, Supabase JS, Recharts
├── src/
│   ├── main.tsx               # Application entry point
│   ├── App.tsx                # Master app shell, Tab router, Auth state & Accessible Topbar
│   ├── supabaseClient.ts      # Cloud Supabase client initialization
│   ├── translations.ts        # EN / HI / ES Multilingual dictionary
│   ├── riskEngine.ts          # Deterministic US-EPA & NOAA Health Risk Engine
│   ├── environmentService.ts  # Open-Meteo & WAQI telemetry aggregator & fallbacks
│   ├── Onboarding.tsx         # 5-step detailed demographic & health condition filler
│   ├── DashboardView.tsx      # Tab 1: Live telemetry, risk meter & clinical action plans
│   ├── AdvisorChat.tsx        # Tab 2: Contextual AI health advisor chatbot
│   ├── CompareView.tsx        # Tab 3: Dual-city clash & safety verdict comparison
│   ├── TrendsView.tsx         # Tab 4: 24h diurnal particulate curves & 7d exposure audit
│   └── MapExplorer.tsx        # Tab 5: Interactive OpenStreetMap with click-to-inspect
```

---

## 3. APIs Inventory & Keys

| API | Key Status | Purpose |
| :--- | :--- | :--- |
| **Open-Meteo Forecast** | 100% Free (No Key) | Temperature, apparent heat index, humidity, wind, weather codes |
| **Open-Meteo Air Quality**| 100% Free (No Key) | European Copernicus satellite model for global AQI, PM2.5 & PM10 |
| **Open-Meteo Geocoding**  | 100% Free (No Key) | Global autocomplete city/town search |
| **OpenStreetMap / Carto** | 100% Free (No Key) | Interactive vector map tiles for Map Explorer |
| **WAQI Ground Sensors**   | Integrated (`ac724915...`) | Real-world physical ground monitoring stations |
| **Supabase Cloud Auth**   | Integrated (`nvkmzywyladeikhxcvos...`) | Authentication, user profiles & session persistence |
| **Google Gemini API**     | Optional (`aistudio.google.com`) | Can be added to `AdvisorChat.tsx` for deeper LLM reasoning |

---

## 4. How to Run Locally
```bash
cd origin-react
npm install
npm run dev
```
Access at: `http://localhost:5174/` (or port assigned by Vite).
