from pydantic import BaseModel
from typing import Optional

class Environment(BaseModel):
    temperature: Optional[float] = None
    feels_like: Optional[float] = None
    humidity: Optional[int] = None
    precipitation_probability: Optional[int] = None
    uv_index: Optional[float] = None
    aqi: Optional[int] = None
    aqi_category: Optional[str] = None
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    o3: Optional[float] = None
    no2: Optional[float] = None
    source: Optional[str] = None
    timestamp: Optional[str] = None
