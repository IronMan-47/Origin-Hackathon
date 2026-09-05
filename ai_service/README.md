# WeatherWise AI & Intelligence Service

Stateless Python service containing the **Deterministic Risk Engine** and **AI Controller**.

## Features
- **Deterministic Risk Engine:** Evaluates environmental metrics (AQI, PM2.5, PM10, Heat Index, UV Index) against WHO/EPA thresholds and user profile modifiers (asthma, outdoor worker, age).
- **AI Controller:** Orchestrates an LLM provider fallback chain (Gemini 3.6 Flash -> Groq -> Offline Fallback) to return structured natural-language advisories.

## Endpoints
- `POST /risk`: Calculates deterministic risk score (0-100) and extracts severity flags.
- `POST /ai`: Generates personalized health advisories based on risk assessment.
