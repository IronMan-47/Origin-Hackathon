import asyncio

from app.services import aqi_service
from ai_service.models.environment import Environment
from ai_service.models.user import User
from ai_service.risk_engine import engine
from ai_service.ai.context import build_ai_context
from ai_service.ai.controller import generate_advisory_orchestrated

async def test_full_pipeline():
    print("=== Testing Integrated Risk & AI Intelligence Pipeline ===")
    
    # 1. Test live AQI
    aqi_data = await aqi_service.fetch_live_aqi(28.6139, 77.2090)
    print("Live AQI Result:", aqi_data['aqi'], "(Category:", aqi_data['category'], ")")
    
    # 2. Test Environment and User models
    env = Environment(
        temperature=34.5,
        feels_like=38.0,
        humidity=70,
        precipitation_probability=30,
        uv_index=7.5,
        aqi=aqi_data['aqi'],
        aqi_category=aqi_data['category'],
        pm25=aqi_data['pollutants']['pm2_5'],
        pm10=aqi_data['pollutants']['pm10']
    )
    
    user = User(
        age_group="adult",
        health_conditions=["asthma"],
        occupation="outdoor_worker"
    )
    
    # 3. Test Risk Engine
    risk_res = engine.calculate_risk(env, user)
    print("\n--- Deterministic Risk Score ---")
    print(f"Overall Risk Level: {risk_res.overall_risk.upper()} (Score: {risk_res.risk_score}/100)")
    print("Primary Factors:", risk_res.primary_factors)
    print("Environmental Flags:", [f.model_dump() for f in risk_res.environmental_flags])
    print("Profile Modifiers:", [m.model_dump() for m in risk_res.profile_modifiers])
    
    # 4. Test AI Controller
    ctx_json = build_ai_context(env, user, risk_res)
    print("\n--- Generating Orchestrated AI Advisory ---")
    advisory = generate_advisory_orchestrated(ctx_json, risk_res)
    print("AI Summary:", advisory.summary)
    print("Risk Explanation:", advisory.risk_explanation)
    print("Recommended Actions:", advisory.recommended_actions)
    print("Avoid List:", advisory.avoid)
    print("\n[SUCCESS] Full integration pipeline test passed cleanly!")

if __name__ == "__main__":
    asyncio.run(test_full_pipeline())
