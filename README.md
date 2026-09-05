# 🌤️ WeatherWise AI — Air Quality & Personal Health Intelligence Platform

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg?logo=vite)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4.svg?logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Repository:** [https://github.com/IronMan-47/Origin-Hackathon](https://github.com/IronMan-47/Origin-Hackathon)  
> **WeatherWise AI** is an intelligent, real-time hyper-local air quality monitoring, environmental simulation, and personalized health risk mitigation platform built for hackathons and production deployment.

---

## 📌 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Repository Structure](#-repository-structure)
- [Quick Start Guide](#-quick-start-guide)
- [Database Setup (Supabase)](#-database-setup-supabase)
- [AI Engine & Dual Fallback](#-ai-engine--dual-fallback)
- [Localization (6 Indian Regional Languages)](#-localization-6-indian-regional-languages)
- [Testing & Quality Verification](#-testing--quality-verification)
- [Deployment Plan](#-deployment-plan)

---

## 🌟 Overview

Air pollution and environmental fluctuations severely impact individuals with respiratory conditions, asthma, cardiac sensitivities, and general wellbeing. **WeatherWise AI** bridges environmental telemetry with personalized medical risk scoring.

By capturing real-time metrics from the **World Air Quality Index (WAQI)** and **OpenWeatherMap** APIs, WeatherWise correlates environmental telemetry against user health profiles (`age`, `gender`, `medical_conditions`, `location`) stored in Supabase to provide actionable AI-driven health advice and predictive risk modeling.

---

## ✨ Key Features

### 🏠 1. Home & Live Health Dashboard
- **Interactive Telemetry Gauge**: Live AQI score visualization (Good, Moderate, Unhealthy, Severe, Hazardous).
- **Personalized Health Risk Assessment**: Real-time risk level scoring based on user medical background.
- **Activities to Avoid & Mitigation Steps**: Tailored precautions for outdoor exercise, sensitive groups, and mask usage.

### 🤖 2. Conversational AI Health Advisor
- **Multi-Model Intelligence**: Powered by **Google Gemini 2.5 Flash** with an automatic failover to **Groq (Llama 3 70B)**.
- **Context-Aware Recommendations**: Integrates user profile attributes, location data, and active environmental telemetry into every response.

### 🧪 3. Environmental Simulator ("What-If" Analysis)
- Interactively test hypothetical scenarios by adjusting AQI levels, PM2.5/PM10 concentrations, temperature, and humidity.
- Instant recalculation of health risk levels and preventive action triggers.

### 📊 4. Multi-City Comparison & Historic Trends
- Compare AQI, PM2.5, PM10, temperature, and humidity across multiple cities side-by-side.
- Analyze historic trends to detect recurring pollution spikes.

### 🗺️ 5. Interactive AQI Map Explorer
- Leaflet-based global map rendering live air quality monitoring stations, color-coded heatmaps, and pollution hotspots.

### 🌐 6. Pan-UI 6-Language Localization
- Instant one-click language switching across 6 native scripts:
  - 🇺🇸 **English** (`en`)
  - 🇮🇳 **Hindi** (`hi` - हिन्दी)
  - 🇮🇳 **Bengali** (`bn` - বাংলা)
  - 🇮🇳 **Marathi** (`mr` - मराठी)
  - 🇮🇳 **Tamil** (`ta` - தமிழ்)
  - 🇮🇳 **Telugu** (`te` - తెలుగు)

### 🎨 7. Motion-Infused Accessible UI
- Light-mode default with dark-mode toggle options.
- Clean typography using Google's **Plus Jakarta Sans**.
- Accessible keyboard navigation, screen-reader friendly ARIA attributes, and smooth micro-interactions.

---

## 🏗 Architecture & Tech Stack

```
   ┌─────────────────────────────────────────────────────────────┐
   │                  React 18 + Vite Frontend                   │
   │  (Tailwind CSS, Lucide Icons, Recharts, Leaflet, Translations) │
   └──────────────┬──────────────────────────────┬───────────────┘
                  │                              │
                  ▼                              ▼
   ┌──────────────────────────────┐ ┌───────────────────────────┐
   │    Supabase Auth & PostgreSQL│ │  FastAPI Python AI Backend│
   │  (Row Level Security Policies)│ │(Gemini 2.5 Flash + Groq)  │
   └──────────────────────────────┘ └─────────────┬─────────────┘
                                                  │
                                                  ▼
                                    ┌───────────────────────────┐
                                    │ WAQI & OpenWeather APIs   │
                                    └───────────────────────────┘
```

| Layer | Technology Used |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Recharts, Leaflet, Lucide Icons |
| **Backend API** | Python 3.10+, FastAPI, Uvicorn, Pydantic |
| **AI / LLM** | Google Gemini 2.5 Flash, Groq API (Llama 3 70B Fallback) |
| **Database & Auth**| Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS) |
| **Telemetry APIs**| World Air Quality Index (WAQI) API, OpenWeatherMap API |

---

## 📁 Repository Structure

```
Origin-Hackathon/
├── app/                        # FastAPI Router & Core Services
│   ├── routers/                # API routes (weather, aqi, advisory)
│   └── services/               # Weather & AQI telemetry fetchers
├── ai_service/                 # Specialized Risk & AI Reasoning Engine
│   ├── ai/                     # Gemini & Groq LLM clients & prompts
│   ├── models/                 # Pydantic data schemas
│   └── risk_engine/            # Rule-based risk calculation & modifiers
├── src/                        # React Frontend Source Code
│   ├── components/             # Reusable UI components
│   ├── assets/                 # SVGs and public assets
│   ├── AdvisorChat.tsx         # AI Advisor Chat interface
│   ├── App.tsx                 # Main layout & navigation container
│   ├── CompareView.tsx         # City comparison view
│   ├── DashboardView.tsx       # Primary health dashboard
│   ├── environmentService.ts   # Client-side API fetchers
│   ├── LandingHero.tsx         # Product overview hero component
│   ├── MapExplorer.tsx         # Interactive Leaflet map explorer
│   ├── Onboarding.tsx          # User profile modal & attributes editor
│   ├── riskEngine.ts           # Client risk scoring engine
│   ├── SimulatorView.tsx       # Environmental simulator view
│   ├── supabaseClient.ts       # Supabase client setup
│   ├── translations.ts         # Pan-UI 6-language dictionary
│   └── TrendsView.tsx          # Historical AQI charts
├── public/                     # Static icons & assets
├── schema.sql                  # Master Supabase Database setup script
├── BACKEND_HANDOFF_GUIDE.md    # Detailed backend reference guide
├── README_HANDOFF.md           # Handoff notes
├── requirements.txt            # Python dependencies
├── package.json                # Node.js dependencies & scripts
├── vite.config.ts              # Vite configuration
└── index.html                  # HTML entry point
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **Git**: Installed on your system

### 2. Clone the Repository
```bash
git clone https://github.com/IronMan-47/Origin-Hackathon.git
cd Origin-Hackathon
```

### 3. Install Dependencies

#### Frontend (Node.js)
```bash
npm install
```

#### Backend (Python)
```bash
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your API keys:
```bash
cp .env.example .env
```

Set the following variables inside `.env`:
```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
WAQI_API_KEY=your-waqi-token
VITE_WAQI_TOKEN=your-waqi-token
OPENWEATHER_API_KEY=your-openweather-api-key
VITE_OPENWEATHER_API_KEY=your-openweather-api-key
```

### 5. Run the Application

#### Start the Python Backend
```bash
python main.py
```
*(Backend runs at `http://localhost:8000`)*

#### Start the Vite Frontend (in a separate terminal)
```bash
npm run dev
```
*(Frontend runs at `http://localhost:5173`)*

---

## 🗄️ Database Setup (Supabase)

To enable user authentication, profile persistence, and health attributes (`age`, `gender`, `location_name`, `latitude`, `longitude`, `medical_conditions`), execute `schema.sql` in your Supabase project:

1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Copy and paste the contents of [`schema.sql`](./schema.sql).
3. Click **Run**.

This script creates:
- `public.user_profiles` table linked to `auth.users(id)`.
- Automatic user profile creation trigger (`on_auth_user_created`).
- Row Level Security (RLS) policies allowing users to read, update, and insert their own profile data safely.

---

## 🧠 AI Engine & Dual Fallback

WeatherWise utilizes a fault-tolerant multi-provider AI setup:

1. **Primary**: `Google Gemini 2.5 Flash` - Delivers fast, structured, and clinically empathetic health recommendations.
2. **Fallback**: `Groq API (Llama 3 70B)` - If Gemini encounters rate limits or service interruptions, the system seamlessly routes prompts to Groq without user disruption.

---

## 🌐 Localization (6 Indian Regional Languages)

The app features a comprehensive internationalization engine (`src/translations.ts`) covering:
- **English** (`en`)
- **Hindi** (`hi`) - हिन्दी
- **Bengali** (`bn`) - বাংলা
- **Marathi** (`mr`) - मराठी
- **Tamil** (`ta`) - தமிழ்
- **Telugu** (`te`) - తెలుగు

Switching languages dynamically updates the topbar navigation, dashboard cards, modal controls, advisor prompts, and environmental metric labels across the entire app interface.

---

## 🧪 Testing & Quality Verification

### Type Checking & Build Test
```bash
npx tsc --noEmit
npm run build
```

### Integration Test Suite
```bash
python test_integration.py
python test_aqi.py
python test_keys.py
```

---

## 🚀 Deployment Plan

- **Frontend Deployment**: Deployed seamlessly on **Vercel** or **Netlify**. Connect `https://github.com/IronMan-47/Origin-Hackathon` main branch and configure Environment Variables.
- **Backend Deployment**: Hosted on **Render** or **Google Cloud Run** running `uvicorn main:app --host 0.0.0.0 --port 8000`.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p center>
Built with ❤️ for <b>Origin Hackathon</b> by the WeatherWise Team.
</p>
