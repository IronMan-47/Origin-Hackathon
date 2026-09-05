from typing import List
from ai_service.models.environment import Environment
from ai_service.models.user import User
from ai_service.models.risk import RiskAssessment, DataCompleteness
from ai_service.risk_engine import scoring, modifiers

SEVERITY_WEIGHTS = {
    "low": 0,
    "moderate": 20,
    "high": 40,
    "very_high": 60,
    "extreme": 80
}

def _get_overall_risk_label(score: int) -> str:
    if score <= 25: return "low"
    if score <= 50: return "moderate"
    if score <= 75: return "high"
    if score <= 90: return "very_high"
    return "extreme"

def calculate_risk(environment: Environment, user: User) -> RiskAssessment:
    flags = []
    if flag := scoring.evaluate_aqi(environment.aqi): flags.append(flag)
    if flag := scoring.evaluate_pm25(environment.pm25): flags.append(flag)
    if flag := scoring.evaluate_pm10(environment.pm10): flags.append(flag)
    if flag := scoring.evaluate_temperature(environment.temperature, environment.feels_like): flags.append(flag)
    if flag := scoring.evaluate_uv(environment.uv_index): flags.append(flag)

    profile_mods = modifiers.evaluate_user_modifiers(user)
    
    total_multiplier = 1.0
    for mod in profile_mods:
        if mod.multiplier > 1.0:
            total_multiplier += (mod.multiplier - 1.0)
        else:
            total_multiplier *= mod.multiplier
            
    total_multiplier = min(max(total_multiplier, 0.5), 2.5)

    base_score = 0
    if flags:
        weights = [SEVERITY_WEIGHTS.get(f.severity, 0) for f in flags]
        weights.sort(reverse=True)
        base_score = weights[0] + sum(weights[1:]) * 0.2

    final_score = int(base_score * total_multiplier)
    final_score = min(max(final_score, 0), 100)

    primary_factors = list(set([f.factor for f in flags if SEVERITY_WEIGHTS.get(f.severity, 0) >= 40]))
    if not primary_factors and flags:
        weights_and_factors = [(SEVERITY_WEIGHTS.get(f.severity, 0), f.factor) for f in flags]
        weights_and_factors.sort(reverse=True)
        primary_factors = [weights_and_factors[0][1]]

    has_weather = any(v is not None for v in [environment.temperature, environment.humidity, environment.uv_index])
    has_aqi = any(v is not None for v in [environment.aqi, environment.pm25, environment.pm10])
    completeness = DataCompleteness(weather=has_weather, air_quality=has_aqi)
    
    confidence = "high"
    if not has_weather and not has_aqi:
        confidence = "none"
    elif not has_weather or not has_aqi:
        confidence = "medium"
    elif environment.aqi is None or environment.temperature is None:
        confidence = "medium"

    return RiskAssessment(
        overall_risk=_get_overall_risk_label(final_score),
        risk_score=final_score,
        primary_factors=primary_factors,
        environmental_flags=flags,
        profile_modifiers=profile_mods,
        confidence=confidence,
        data_completeness=completeness
    )
