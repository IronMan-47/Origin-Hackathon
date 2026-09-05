# Backend Integration Contract

This document outlines the API contracts for integrating the Main Backend with the Python Intelligence Service.

## Core Principle
The Main Backend is entirely responsible for fetching weather/AQI data from external APIs (like Open-Meteo or WAQI) and fetching user data from the database. 

**DO NOT** attempt to have the Python service fetch this data. The Python service acts purely as a stateless calculation and intelligence engine.

---

## 1. POST `/risk` (Deterministic Risk Engine)

**Purpose:** Evaluates environmental data and user health profiles to generate a deterministic mathematical risk score and extract health severity flags.

### Request Body (JSON)
```json
{
  "environment": {
    "temperature": 32.4,
    "feels_like": 35.8,
    "humidity": 74,
    "precipitation_probability": 40,
    "uv_index": 6.2,
    "aqi": 164,
    "aqi_category": "Unhealthy",
    "pm25": 78.4,
    "pm10": 114.2,
    "o3": null,
    "no2": null,
    "source": "waqi",
    "timestamp": "2026-09-05T12:00:00Z"
  },
  "user": {
    "age_group": "adult",
    "health_conditions": ["asthma"],
    "occupation": "outdoor_worker"
  }
}
```
*Note: Any environmental parameter can be `null` if the data is unavailable. The engine will gracefully ignore missing data.*

### Response (JSON)
```json
{
  "overall_risk": "extreme",
  "risk_score": 100,
  "primary_factors": ["aqi"],
  "environmental_flags": [
    {
      "factor": "aqi",
      "value": 164.0,
      "severity": "very_high",
      "threshold": "151-200",
      "reason": "Some members of the general public may experience health effects..."
    }
  ],
  "profile_modifiers": [
    {
      "factor": "asthma",
      "impact": "Increased respiratory vulnerability",
      "multiplier": 1.4
    }
  ],
  "confidence": "high",
  "data_completeness": {
    "weather": true,
    "air_quality": true
  }
}
```

---

## 2. POST `/ai` (AI Controller)

**Purpose:** Translates the numeric/structured `/risk` assessment into personalized, natural-language advice.

### Request Body (JSON)
Pass the **exact same** `environment` and `user` blocks used in the `/risk` request, and append the complete response you received from `/risk` as the `risk_assessment` block.

```json
{
  "environment": { ... },
  "user": { ... },
  "risk_assessment": { ... }
}
```

### Response (JSON)
```json
{
  "summary": "Air quality is currently hazardous, particularly for individuals with asthma.",
  "risk_explanation": "Your risk level is EXTREME with a score of 100/100. The AQI of 164 is very high and strongly compounds with your asthma, increasing your respiratory vulnerability.",
  "recommended_actions": [
    "Stay in a climate-controlled indoor environment if possible.",
    "Keep your rescue inhaler nearby."
  ],
  "avoid": [
    "Avoid prolonged or heavy physical exertion outdoors."
  ],
  "best_time_suggestion": "Wait until late evening when pollution levels historically settle.",
  "uncertainties": [],
  "data_disclaimer": "This is environmental guidance, not medical advice. Consult a healthcare provider for medical concerns."
}
```
