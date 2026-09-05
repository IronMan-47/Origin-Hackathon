import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

from ai_service.models.environment import Environment
from ai_service.models.user import User
from ai_service.risk_engine import engine
from ai_service.ai.context import build_ai_context
from ai_service.ai.gemini import generate_gemini_advisory
from ai_service.ai.groq_client import generate_groq_advisory
from ai_service.ai.prompts import SYSTEM_PROMPT

def test_api_keys():
    print("=== Testing Gemini & Groq API Keys ===")
    
    gemini_key = os.getenv("GEMINI_API_KEY")
    groq_key = os.getenv("GROQ_API_KEY")
    
    print(f"Gemini Key Present: {bool(gemini_key and gemini_key.strip())}")
    print(f"Groq Key Present: {bool(groq_key and groq_key.strip())}")
    
    # Sample environment and user payload
    env = Environment(
        temperature=32.0,
        feels_like=35.0,
        humidity=65,
        uv_index=6.0,
        aqi=145,
        aqi_category="Unhealthy for Sensitive Groups",
        pm25=55.0,
        pm10=90.0
    )
    
    user = User(
        age_group="adult",
        health_conditions=["asthma"],
        occupation="outdoor_worker"
    )
    
    risk_assessment = engine.calculate_risk(env, user)
    context_json = build_ai_context(env, user, risk_assessment)
    
    # 1. Test Gemini
    print("\n--- 1. Testing Google Gemini API (gemini-3.6-flash) ---")
    try:
        gemini_res = generate_gemini_advisory(SYSTEM_PROMPT, context_json)
        print("[SUCCESS] Gemini Response Received!")
        print("Summary:", gemini_res.summary)
        print("Risk Explanation:", gemini_res.risk_explanation)
        print("Recommended Actions:", gemini_res.recommended_actions)
        print("Best Time Suggestion:", gemini_res.best_time_suggestion)
    except Exception as e:
        print("[FAILED] Gemini Error:", e)
        
    # 2. Test Groq
    print("\n--- 2. Testing Groq API (groq/compound) ---")
    try:
        groq_res = generate_groq_advisory(SYSTEM_PROMPT, context_json, model_name="groq/compound")
        print("[SUCCESS] Groq Response Received!")
        print("Summary:", groq_res.summary)
        print("Risk Explanation:", groq_res.risk_explanation)
        print("Recommended Actions:", groq_res.recommended_actions)
        print("Best Time Suggestion:", groq_res.best_time_suggestion)
    except Exception as e:
        print("[FAILED] Groq Error:", e)

if __name__ == "__main__":
    test_api_keys()
