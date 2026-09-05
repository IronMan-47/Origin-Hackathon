from fastapi import APIRouter
from pydantic import BaseModel
from ai_service.models.environment import Environment
from ai_service.models.user import User
from ai_service.models.risk import RiskAssessment, DataCompleteness
from ai_service.risk_engine import engine

router = APIRouter(prefix="/risk", tags=["Risk Engine"])

class RiskRequest(BaseModel):
    environment: Environment
    user: User

@router.post("", response_model=RiskAssessment)
async def calculate_risk(request: RiskRequest):
    return engine.calculate_risk(request.environment, request.user)
