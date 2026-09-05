import pytest
from ai_service.risk_engine import scoring
from ai_service.models.risk import EnvironmentalFlag

def test_evaluate_aqi_good():
    assert scoring.evaluate_aqi(45) is None
    
def test_evaluate_aqi_very_high():
    flag = scoring.evaluate_aqi(160)
    assert flag is not None
    assert flag.severity == "very_high"
    assert flag.factor == "aqi"
    assert flag.threshold == "151-200"

def test_evaluate_missing_data():
    assert scoring.evaluate_aqi(None) is None
    assert scoring.evaluate_pm25(None) is None
    assert scoring.evaluate_temperature(None, None) is None

def test_evaluate_temperature_prefers_feels_like():
    flag1 = scoring.evaluate_temperature(temp=35.0, feels_like=None)
    assert flag1 is not None
    assert flag1.severity == "high"
    
    flag2 = scoring.evaluate_temperature(temp=35.0, feels_like=40.0)
    assert flag2 is not None
    assert flag2.severity == "very_high"

def test_evaluate_uv_extreme():
    flag = scoring.evaluate_uv(12.5)
    assert flag is not None
    assert flag.severity == "extreme"
