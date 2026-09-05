# WeatherWise — Full Stack Architecture & Backend Developer Handoff Guide

Welcome! This document provides all the technical context, data schemas, API integrations, and backend requirements needed to complete the backend microservices for **WeatherWise**.

---

## 1. System Architecture Overview

WeatherWise is an AI-powered personalized environmental health intelligence platform. It ingests atmospheric telemetry (Temperature, Humidity, Wind, US-EPA AQI, $PM_{2.5}$, $PM_{10}$, UV Index) and merges it with individual clinical health profiles (Asthma, COPD, Cardio, Age, Occupation Exposure) to calculate deterministic vulnerability scores and provide context-aware preventative medical advice.

```
Frontend (React 19 + TypeScript + Tailwind)
  ├── Landing Hero (4 Dedicated Public Routes: Home, Features, How It Works, About)
  ├── Supabase Cloud Auth & Guest Demo Bypass
  ├── 5-Step Clinical Onboarding Wizard
  ├── Multi-Tab App Shell (Dashboard, AI Advisor, City Clash, 24h Trends, Leaflet Map)
  └── Backend Endpoints & Database (What you need to build/extend)
```

---

## 2. Active APIs & Credentials

The frontend is already configured to communicate with the following services:

| Service | Protocol / URL | Auth Status | Purpose |
| :--- | :--- | :--- | :--- |
| **WAQI Ground Stations** | `https://api.waqi.info/feed/geo:{lat};{lon}/` | Token: `ac724915550424c9a4372ed12ebb5c4225bc780e` | Real-world physical air monitoring ground sensors |
| **Open-Meteo Weather** | `https://api.open-meteo.com/v1/forecast` | Free (No Key Required) | Temperature, apparent heat index, humidity, wind, UV |
| **Open-Meteo Air Quality** | `https://air-quality-api.open-meteo.com/v1/air-quality` | Free (No Key Required) | European Copernicus satellite model for global $PM_{2.5}$, $PM_{10}$, US AQI |
| **Open-Meteo Geocoding** | `https://geocoding-api.open-meteo.com/v1/search` | Free (No Key Required) | Global autocomplete city/town to coordinate converter |
| **Supabase Cloud Project** | `https://nvkmzywyladeikhxcvos.supabase.co` | Anon Key in `src/supabaseClient.ts` | PostgreSQL DB, Auth & Session Management |

---

## 3. Database Schema (`PostgreSQL / Supabase`)

Run the following DDL in the Supabase SQL Editor to set up the `profiles` table:

```sql
-- 1. Profiles Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    age INT,
    gender TEXT DEFAULT 'unspecified',
    location_name TEXT DEFAULT 'Raipur, Chhattisgarh',
    latitude DOUBLE PRECISION DEFAULT 21.25,
    longitude DOUBLE PRECISION DEFAULT 81.63,
    occupation TEXT DEFAULT 'indoor_office',
    medical_conditions TEXT[] DEFAULT '{}',
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE TO authenticated
    USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- 3. Automatic Profile Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'display_name', 'New User')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 4. Backend Microservices Checklist (What You Need to Build)

### 🎯 Task 1: Dedicated Telemetry Aggregator Microservice
- **Route:** `GET /api/v1/telemetry?lat={lat}&lon={lon}`
- **Function:** Query WAQI and Open-Meteo on the server side, cache responses in Redis/Memory for 10 minutes, and return a single unified JSON payload to the client.

### 🎯 Task 2: LLM Health Advisor Completion Endpoint
- **Route:** `POST /api/v1/chat/advisor`
- **Payload:**
  ```json
  {
    "user_message": "Can I go for an outdoor run right now?",
    "telemetry": { "aqi": 164, "pm25": 78.4, "temp": 32, "feels_like": 35 },
    "user_profile": { "age": 26, "medical_conditions": ["asthma"], "occupation": "outdoor_worker" }
  }
  ```
- **Function:** Connect Google Gemini 2.0 Flash (`@google/genai` or Python `google-generativeai`) or Groq Llama 3.3 to stream back physician-style reasoning with guardrails against prescribing medical dosages.

### 🎯 Task 3: Scheduled Proactive Push Alert Worker (Cron)
- **Function:** Run a daily background job (e.g., 6:30 AM user local time) checking if target coordinates exceed AQI > 150.
- If threshold is breached and the patient has registered respiratory sensitivities, trigger a Web Push Notification or Email dispatch.

### 🎯 Task 4: 30-Day Historical Exposure Audit Table
- Create a `daily_exposure_logs` table in PostgreSQL:
  ```sql
  CREATE TABLE public.daily_exposure_logs (
      id BIGSERIAL PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
      log_date DATE NOT NULL DEFAULT CURRENT_DATE,
      avg_aqi INT NOT NULL,
      max_pm25 DOUBLE PRECISION NOT NULL,
      high_risk_hours INT NOT NULL DEFAULT 0
  );
  ```

---

## 5. How to Run Frontend Locally
```bash
cd origin-react
npm install
npm run dev
```
Runs at: `http://localhost:5174/`
