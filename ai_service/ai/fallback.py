from ai_service.models.advisory import Advisory
from ai_service.models.risk import RiskAssessment

def generate_deterministic_advisory(risk: RiskAssessment) -> Advisory:
    risk_messages = {
        "low": "Conditions are currently optimal for most outdoor activities.",
        "moderate": "Conditions are acceptable, but sensitive individuals should monitor how they feel.",
        "high": "Environmental conditions pose a health risk. Limit prolonged outdoor exposure.",
        "very_high": "Conditions are hazardous. Stay indoors if possible and avoid heavy exertion.",
        "extreme": "Extreme environmental hazard. Seek shelter and avoid all outdoor activities."
    }
    
    summary = risk_messages.get(risk.overall_risk, "Environmental conditions are currently unverified.")
    
    if risk.environmental_flags:
        factor_names = [f.factor.replace('_', ' ') for f in risk.environmental_flags]
        factors_str = " and ".join(factor_names)
    elif risk.primary_factors:
        factors_str = " and ".join(risk.primary_factors).replace('_', ' ')
    else:
        factors_str = "unspecified environmental factors"
        
    risk_explanation = f"Your risk level is {risk.overall_risk.upper()} with a score of {risk.risk_score}/100. This is primarily driven by {factors_str}."
    
    recommended_actions = ["Monitor local official weather and air quality alerts."]
    avoid = []
    
    if risk.risk_score >= 50:
        recommended_actions.append("Stay in a climate-controlled indoor environment if possible.")
        avoid.append("Avoid prolonged or heavy physical exertion outdoors.")
    else:
        recommended_actions.append("Enjoy standard outdoor activities.")
        
    return Advisory(
        summary=summary,
        risk_explanation=risk_explanation,
        recommended_actions=recommended_actions,
        avoid=avoid,
        best_time_suggestion="Monitor conditions and check back when conditions stabilize.",
        uncertainties=[
            "WARNING: Live AI generation is currently offline. This is a generic offline safety advisory.",
            f"Sensor confidence is rated as {risk.confidence}."
        ],
        data_disclaimer="This is automated fallback environmental guidance, not medical advice. Consult a healthcare provider for medical concerns."
    )
