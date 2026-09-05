import pytest
from ai_service.models.environment import Environment
from ai_service.models.user import User
from ai_service.risk_engine.engine import calculate_risk

def test_calculate_risk_healthy_clean_air():
    env = Environment(temperature=20.0, aqi=25)
    user = User(age_group="adult", health_conditions=[])
    
    assessment = calculate_risk(env, user)
    
    assert assessment.risk_score == 0
    assert assessment.overall_risk == "low"
    assert len(assessment.environmental_flags) == 0
    assert assessment.confidence == "high"
    assert assessment.data_completeness.weather is True
    assert assessment.data_completeness.air_quality is True

def test_calculate_risk_with_modifiers():
    env = Environment(aqi=160)
    user = User(age_group="adult", health_conditions=["asthma"])
    
    assessment = calculate_risk(env, user)
    
    assert assessment.risk_score == 84
    assert assessment.overall_risk == "very_high"
    assert len(assessment.profile_modifiers) == 1
    assert assessment.profile_modifiers[0].factor == "asthma"
    assert assessment.profile_modifiers[0].multiplier == 1.4
    assert "aqi" in assessment.primary_factors

def test_calculate_risk_score_capped_at_100():
    env = Environment(aqi=350)
    user = User(age_group="elderly", health_conditions=["asthma", "copd"])
    
    assessment = calculate_risk(env, user)
    
    assert assessment.risk_score == 100
    assert assessment.overall_risk == "extreme"

def test_calculate_risk_missing_data():
    env = Environment(aqi=None, temperature=None)
    user = User(age_group="adult")
    
    assessment = calculate_risk(env, user)
    assert assessment.confidence == "none"
    assert assessment.data_completeness.weather is False
    assert assessment.data_completeness.air_quality is False
    assert assessment.risk_score == 0

def test_multiple_flags_addition():
    env = Environment(uv_index=12.0, aqi=120)
    user = User(age_group="adult")
    
    assessment = calculate_risk(env, user)
    assert assessment.risk_score == 88
