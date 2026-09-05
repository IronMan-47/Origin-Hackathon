import asyncio
import json
import os
from typing import Dict, Any, Optional
from dotenv import load_dotenv

# Load environment variables safely
load_dotenv()

from app.services.weather_service import fetch_weather_by_city
from ai_service.api.risk import calculate_risk
from ai_service.models.environment import Environment
from ai_service.models.user import User
from ai_service.ai.context import build_ai_context
from ai_service.ai.controller import generate_ai_advisory

# Default profile options for quick prototyping / CLI testing
SAMPLE_PROFILE = {
    "age_group": "adult",
    "health_conditions": ["asthma"],
    "occupation": "outdoor_worker"
}

def main():
    print("=" * 60)
    print("  ORIGIN PS-4: WeatherWise Integrated City Risk & AI Engine")
    print("=" * 60)

    city = input("Enter city name (e.g., Delhi, London, Tokyo): ").strip()
    if not city:
        city = "Delhi"

    print(f"\n[1/3] Fetching live data & geocoding for {city}...")
    weather_res = asyncio.run(fetch_weather_by_city(city))
    if weather_res.get("status") == "error" or not weather_res.get("data"):
        print(f"[ERROR] Could not fetch weather for '{city}'.")
        return

    data = weather_res["data"]
    loc = weather_res.get("location", {})

    print(f"[2/3] Executing Unified Risk Engine for {loc.get('city', city)}...")
    env_model = Environment(
        aqi=110,
        temperature=data.get("temperature_celsius", 30),
        feels_like=data.get("feels_like_celsius", 32),
        humidity=data.get("humidity_percent", 60),
        wind_speed=data.get("wind_speed_kmh", 10),
        uv_index=data.get("uv_index", 5)
    )
    user_model = User(
        age_group=SAMPLE_PROFILE["age_group"],
        health_conditions=SAMPLE_PROFILE["health_conditions"],
        occupation=SAMPLE_PROFILE["occupation"]
    )
    risk_summary = calculate_risk(env_model, user_model)

    print("[3/3] Generating AI Advisory Payload...")
    ctx_str = build_ai_context(env_model, user_model, risk_summary)
    advisory = asyncio.run(generate_ai_advisory(ctx_str))

    # Render Clean Output
    print("\n" + "=" * 60)
    print(f"WEATHER & LOCATION ({loc.get('city', city)}, {loc.get('country', '')})")
    print("=" * 60)
    print(json.dumps(weather_res, indent=2))

    print("\n" + "=" * 60)
    print(f"UNIFIED RISK ASSESSMENT (Risk Score: {risk_summary.risk_score}/100 | Level: {risk_summary.overall_risk})")
    print("=" * 60)
    print(f"Primary Drivers: {', '.join(risk_summary.primary_factors)}")

    print("\n--- AI ADVISORY SUMMARY ---")
    print(f" • {advisory.summary}")
    print(f"\nRisk Explanation:\n{advisory.risk_explanation}")
    print("\nRecommended Actions:")
    for act in advisory.recommended_actions:
        print(f" • {act}")
    print("=" * 60)

if __name__ == "__main__":
    main()