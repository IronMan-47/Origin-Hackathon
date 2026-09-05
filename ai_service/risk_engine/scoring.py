from typing import Optional
from ai_service.models.risk import EnvironmentalFlag
from ai_service.risk_engine import thresholds

def _evaluate_metric(factor_name: str, value: Optional[float], threshold_list: list) -> Optional[EnvironmentalFlag]:
    if value is None:
        return None
        
    for limit, severity, threshold_str, reason in threshold_list:
        if value <= limit:
            if severity == 'low':
                return None
            
            return EnvironmentalFlag(
                factor=factor_name,
                value=value,
                severity=severity,
                threshold=threshold_str,
                reason=reason
            )
    return None

def evaluate_aqi(aqi: Optional[int]) -> Optional[EnvironmentalFlag]:
    if aqi is None:
        return None
    return _evaluate_metric("aqi", float(aqi), thresholds.AQI_THRESHOLDS)

def evaluate_pm25(pm25: Optional[float]) -> Optional[EnvironmentalFlag]:
    return _evaluate_metric("pm25", pm25, thresholds.PM25_THRESHOLDS)

def evaluate_pm10(pm10: Optional[float]) -> Optional[EnvironmentalFlag]:
    return _evaluate_metric("pm10", pm10, thresholds.PM10_THRESHOLDS)

def evaluate_temperature(temp: Optional[float], feels_like: Optional[float]) -> Optional[EnvironmentalFlag]:
    val = feels_like if feels_like is not None else temp
    return _evaluate_metric("heat_index", val, thresholds.HEAT_INDEX_THRESHOLDS_C)

def evaluate_uv(uv: Optional[float]) -> Optional[EnvironmentalFlag]:
    return _evaluate_metric("uv_index", uv, thresholds.UV_THRESHOLDS)
