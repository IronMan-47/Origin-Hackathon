from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from app.services import aqi_service
from ai_service.models.environment import Environment
from ai_service.models.user import User
from ai_service.risk_engine import engine
from ai_service.ai.context import build_ai_context
from ai_service.ai.controller import generate_advisory_orchestrated

router = APIRouter(prefix="/api/v1/advisory", tags=["AI Personalized Advisory"])

class UserProfilePayload(BaseModel):
    age_group: str = "adult" # child, adult, elderly
    health_conditions: List[str] = ["asthma"] # asthma, heart_disease, allergies, none
    occupation: str = "outdoor_worker" # outdoor_worker, indoor_worker, athlete

class AdvisoryRequest(BaseModel):
    lat: float = 28.6139
    lng: float = 77.2090
    user_profile: UserProfilePayload
    user_question: Optional[str] = None

from app.services.weather_service import fetch_weather_by_coordinates

async def fetch_weather_telemetry(lat: float, lng: float):
    w_res = await fetch_weather_by_coordinates(lat, lng)
    if w_res.get("data"):
        d = w_res["data"]
        return {
            "temp": d.get("temperature_celsius", 30.0),
            "feels_like": d.get("feels_like_celsius", 32.0),
            "humidity": d.get("humidity_percent", 60),
            "precip_prob": 20,
            "uv_index": d.get("uv_index", 5.0)
        }
    return {"temp": 32.0, "feels_like": 35.0, "humidity": 65, "precip_prob": 20, "uv_index": 6.0}

@router.post("/generate", summary="Generate End-to-End AI Health Advisory")
async def generate_advisory(payload: AdvisoryRequest):
    """
    Fetches live AQI and live Weather telemetry, feeds into the Deterministic Risk Engine, 
    and generates an orchestrated natural-language AI advisory.
    """
    try:
        # 1. Fetch telemetry
        aqi_data = await aqi_service.fetch_live_aqi(payload.lat, payload.lng)
        weather_data = await fetch_weather_telemetry(payload.lat, payload.lng)
        
        # 2. Build Pydantic models for AI Service
        pollutants = aqi_data.get("pollutants", {})
        env_model = Environment(
            temperature=weather_data["temp"],
            feels_like=weather_data["feels_like"],
            humidity=weather_data["humidity"],
            precipitation_probability=weather_data["precip_prob"],
            uv_index=weather_data["uv_index"],
            aqi=aqi_data.get("aqi"),
            aqi_category=aqi_data.get("category"),
            pm25=pollutants.get("pm2_5"),
            pm10=pollutants.get("pm10"),
            o3=pollutants.get("o3"),
            no2=pollutants.get("no2"),
            source="open_meteo"
        )
        
        user_model = User(
            age_group=payload.user_profile.age_group,
            health_conditions=payload.user_profile.health_conditions,
            occupation=payload.user_profile.occupation
        )
        
        # 3. Deterministic Risk Calculation
        risk_assessment = engine.calculate_risk(env_model, user_model)
        
        # 4. Build AI context & generate advisory text (including specific user question)
        context_json = build_ai_context(env_model, user_model, risk_assessment, user_question=payload.user_question)
        advisory_res = generate_advisory_orchestrated(context_json, risk_assessment)
        
        return {
            "status": "success",
            "telemetry": {
                "aqi": aqi_data,
                "weather": weather_data
            },
            "risk_assessment": risk_assessment,
            "advisory": advisory_res
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
