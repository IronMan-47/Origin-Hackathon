from fastapi import APIRouter, Query, HTTPException
from app.services.weather_service import fetch_weather_by_coordinates, fetch_weather_by_city

router = APIRouter(prefix="/api/v1/weather", tags=["Weather Services"])

@router.get("/live", summary="Fetch Live Weather Data by Coordinates")
async def get_live_weather(
    lat: float = Query(28.6139, description="Latitude"),
    lng: float = Query(77.2090, description="Longitude")
):
    """
    Fetch real-time live weather metrics (temperature, humidity, wind, UV index, feels like)
    by latitude and longitude.
    """
    return await fetch_weather_by_coordinates(lat, lng)

@router.get("/city", summary="Fetch Live Weather Data by City Name")
async def get_weather_by_city(
    name: str = Query("Delhi", description="City Name (e.g. Delhi, London, Tokyo)")
):
    """
    Geocode city name and fetch corresponding real-time weather metrics.
    """
    res = await fetch_weather_by_city(name)
    if res.get("status") == "error":
        raise HTTPException(status_code=404, detail=res.get("message"))
    return res

