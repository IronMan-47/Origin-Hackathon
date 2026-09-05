from pydantic import BaseModel
from typing import List

class Advisory(BaseModel):
    summary: str
    risk_explanation: str
    recommended_actions: List[str]
    avoid: List[str]
    best_time_suggestion: str
    uncertainties: List[str]
    data_disclaimer: str
