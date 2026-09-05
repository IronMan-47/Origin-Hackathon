import json
from ai_service.models.environment import Environment
from ai_service.models.user import User
from ai_service.models.risk import RiskAssessment

def build_ai_context(environment: Environment, user: User, risk_assessment: RiskAssessment, user_question: str = None) -> str:
    env_dict = environment.model_dump(exclude_none=True)
    env_clean = {k: v for k, v in env_dict.items() if k not in ["source", "timestamp"]}

    user_clean = {
        "age_group": user.age_group,
    }
    if user.health_conditions:
        user_clean["health_conditions"] = user.health_conditions
    if user.occupation:
        user_clean["occupation"] = user.occupation

    risk_clean = {
        "overall_risk": risk_assessment.overall_risk,
        "risk_score": risk_assessment.risk_score,
        "primary_factors": risk_assessment.primary_factors,
        "confidence": risk_assessment.confidence,
        "environmental_flags": [
            {
                "factor": f.factor,
                "value": f.value,
                "severity": f.severity,
                "reason": f.reason
            } for f in risk_assessment.environmental_flags
        ],
        "profile_modifiers": [
            {
                "factor": m.factor,
                "impact": m.impact
            } for m in risk_assessment.profile_modifiers
        ]
    }

    context = {
        "user_context": user_clean,
        "environmental_context": env_clean,
        "risk_assessment": risk_clean
    }
    if user_question:
        context["user_question"] = user_question

    return json.dumps(context, indent=2)
