from pydantic import BaseModel
from typing import List, Optional

class User(BaseModel):
    age_group: str
    health_conditions: List[str] = []
    occupation: Optional[str] = None
