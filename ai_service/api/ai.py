from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from ai_service.models.environment import Environment
from ai_service.models.user import User
from ai_service.models.risk import RiskAssessment
from ai_service.models.advisory import Advisory
from ai_service.ai.context import build_ai_context
from ai_service.ai.controller import generate_advisory_orchestrated

router = APIRouter(prefix="/ai", tags=["AI Controller"])

class AIRequest(BaseModel):
    environment: Environment
    user: User
    risk_assessment: RiskAssessment
    user_question: Optional[str] = None

@router.post("", response_model=Advisory)
async def generate_advisory(request: AIRequest):
    try:
        context_json = build_ai_context(
            request.environment, 
            request.user, 
            request.risk_assessment,
            user_question=request.user_question
        )
        return generate_advisory_orchestrated(context_json, request.risk_assessment)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
