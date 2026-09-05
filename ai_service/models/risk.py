from pydantic import BaseModel
from typing import List, Optional

class EnvironmentalFlag(BaseModel):
    factor: str
    value: float
    severity: str
    threshold: str
    reason: str

class ProfileModifier(BaseModel):
    factor: str
    impact: str
    multiplier: float

class DataCompleteness(BaseModel):
    weather: bool
    air_quality: bool

class RiskAssessment(BaseModel):
    overall_risk: str
    risk_score: int
    primary_factors: List[str]
    environmental_flags: List[EnvironmentalFlag]
    profile_modifiers: List[ProfileModifier]
    confidence: str
    data_completeness: DataCompleteness
