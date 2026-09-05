from fastapi import APIRouter, Query, HTTPException
from app.services import aqi_service

router = APIRouter(prefix="/api/v1/aqi", tags=["AQI Services"])

@router.get("/live", summary="Fetch Live AQI & Pollutant Levels")
async def get_live_aqi(
    lat: float = Query(..., description="Latitude (e.g. 28.6139)", example=28.6139),
    lng: float = Query(..., description="Longitude (e.g. 77.2090)", example=77.2090)
):
    """
    Returns live AQI, category classification, dominant pollutant, 
    individual pollutant concentrations (PM2.5, PM10, NO2, O3, SO2), and health implications.
    """
    try:
        data = await aqi_service.fetch_live_aqi(lat, lng)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", summary="Fetch Past 7-Days AQI Trends")
async def get_aqi_history(
    lat: float = Query(..., description="Latitude", example=28.6139),
    lng: float = Query(..., description="Longitude", example=77.2090),
    past_days: int = Query(7, ge=1, le=14, description="Number of past days for trend analysis")
):
    """
    Returns aggregated daily trend data (average AQI, peak AQI, dominant pollutant trend)
    for dashboard historical charts.
    """
    try:
        data = await aqi_service.fetch_aqi_history(lat, lng, past_days)
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/summary", summary="Get AQI Text Summary for LLM Context")
async def get_aqi_summary(
    lat: float = Query(..., description="Latitude", example=28.6139),
    lng: float = Query(..., description="Longitude", example=77.2090)
):
    """
    Returns a plain text summary of current AQI designed for easy injection into LLM prompts.
    """
    try:
        data = await aqi_service.fetch_live_aqi(lat, lng)
        summary = aqi_service.generate_aqi_llm_summary(data)
        return {"success": True, "summary": summary, "raw_aqi": data["aqi"], "category": data["category"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
