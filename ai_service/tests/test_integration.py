import pytest
from fastapi.testclient import TestClient
from ai_service.main import app

client = TestClient(app)

def test_health_check():
    """Verify the API server is mountable and responsive."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "ORIGIN Intelligence Service"}

def test_end_to_end_pipeline():
    """
    Simulates the Main Backend's interaction with the Intelligence Service.
    Step 1: Hit POST /risk to deterministically calculate environmental danger.
    Step 2: Hit POST /ai to generate the advisory.
    """
    backend_payload = {
        "environment": {
            "temperature": 32.4,
            "feels_like": 35.8,
            "aqi": 164,
            "pm25": 78.4,
            "pm10": 114.2,
            "uv_index": 7.5
        },
        "user": {
            "age_group": "adult",
            "health_conditions": ["asthma"],
            "occupation": "outdoor_worker"
        }
    }

    risk_response = client.post("/risk", json=backend_payload)
    assert risk_response.status_code == 200, "Risk endpoint failed"
    
    risk_assessment = risk_response.json()
    assert risk_assessment["overall_risk"] == "extreme"
    assert risk_assessment["risk_score"] == 100
    assert risk_assessment["confidence"] == "high"
    assert "aqi" in risk_assessment["primary_factors"]

    ai_payload = {
        "environment": backend_payload["environment"],
        "user": backend_payload["user"],
        "risk_assessment": risk_assessment
    }

    ai_response = client.post("/ai", json=ai_payload)
    assert ai_response.status_code == 200, "AI endpoint failed to gracefully degrade"
    
    advisory = ai_response.json()
    assert "summary" in advisory
    assert "risk_explanation" in advisory
    assert isinstance(advisory["recommended_actions"], list)
    assert len(advisory["recommended_actions"]) > 0
    assert "data_disclaimer" in advisory
