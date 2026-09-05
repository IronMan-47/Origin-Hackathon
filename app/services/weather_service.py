import os
import httpx
from typing import Dict, Any, Optional

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
OPENWEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5/weather"
OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
OPEN_METEO_WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

async def geocode_city_name(city_name: str) -> Optional[Dict[str, Any]]:
    """
    Resolve city name to latitude, longitude, and country.
    Primary: OpenWeatherMap. Fallback: Open-Meteo Geocoding.
    """
    if not city_name or not city_name.strip():
        return None

    city_clean = city_name.strip()

    # 1. Primary: OpenWeatherMap Geocoding & Weather Lookup
    if OPENWEATHER_API_KEY:
        try:
            params = {"q": city_clean, "appid": OPENWEATHER_API_KEY, "units": "metric"}
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(OPENWEATHER_BASE_URL, params=params)
                if res.status_code == 200:
                    data = res.json()
                    return {
                        "city": data.get("name", city_clean),
                        "country": data.get("sys", {}).get("country", ""),
                        "latitude": data["coord"]["lat"],
                        "longitude": data["coord"]["lon"],
                        "source": "openweathermap"
                    }
        except Exception as e:
            print(f"[Geocode Warning] OpenWeatherMap geocoding failed: {e}. Falling back to Open-Meteo.")

    # 2. Fallback: Open-Meteo Geocoding (Free, Keyless)
    try:
        params = {"name": city_clean, "count": 1, "language": "en", "format": "json"}
        async with httpx.AsyncClient(timeout=8.0) as client:
            res = await client.get(OPEN_METEO_GEOCODING_URL, params=params)
            if res.status_code == 200:
                results = res.json().get("results", [])
                if results:
                    first = results[0]
                    return {
                        "city": first.get("name", city_clean),
                        "country": first.get("country", ""),
                        "admin1": first.get("admin1", ""),
                        "latitude": first["latitude"],
                        "longitude": first["longitude"],
                        "source": "open_meteo"
                    }
    except Exception as e:
        print(f"[Geocode Warning] Open-Meteo geocoding failed: {e}")

    return None

async def fetch_weather_by_coordinates(lat: float, lng: float) -> Dict[str, Any]:
    """
    Fetch live weather metrics.
    Primary provider: OpenWeatherMap (using OPENWEATHER_API_KEY).
    Fallback provider: Open-Meteo Weather API.
    """
    # 1. Primary: OpenWeatherMap Weather API
    if OPENWEATHER_API_KEY:
        try:
            params = {
                "lat": lat,
                "lon": lng,
                "appid": OPENWEATHER_API_KEY,
                "units": "metric"
            }
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.get(OPENWEATHER_BASE_URL, params=params)
                if res.status_code == 200:
                    w = res.json()
                    main_data = w.get("main", {})
                    wind_data = w.get("wind", {})
                    weather_arr = w.get("weather", [{}])
                    
                    wind_kmh = round(wind_data.get("speed", 0.0) * 3.6, 1)

                    return {
                        "status": "success",
                        "provider": "openweathermap",
                        "location": {
                            "latitude": lat,
                            "longitude": lng,
                            "city": w.get("name"),
                            "country": w.get("sys", {}).get("country")
                        },
                        "data": {
                            "temperature_celsius": main_data.get("temp", 30.0),
                            "feels_like_celsius": main_data.get("feels_like", 30.0),
                            "humidity_percent": main_data.get("humidity", 60),
                            "pressure_hpa": main_data.get("pressure", 1013),
                            "wind_speed_kmh": wind_kmh,
                            "weather_description": weather_arr[0].get("description", "").capitalize(),
                            "weather_code": weather_arr[0].get("id", 800)
                        }
                    }
        except Exception as e:
            print(f"[Weather Service Warning] OpenWeatherMap call failed: {e}. Falling back to Open-Meteo.")

    # 2. Secondary Fallback: Open-Meteo Weather API
    params = {
        "latitude": lat,
        "longitude": lng,
        "current": ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "wind_speed_10m", "uv_index", "weather_code"],
        "timezone": "auto"
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(OPEN_METEO_WEATHER_URL, params=params)
            if response.status_code == 200:
                cur = response.json().get("current", {})
                return {
                    "status": "success",
                    "provider": "open_meteo",
                    "location": {"latitude": lat, "longitude": lng},
                    "data": {
                        "temperature_celsius": cur.get("temperature_2m", 30.0),
                        "feels_like_celsius": cur.get("apparent_temperature", 30.0),
                        "humidity_percent": cur.get("relative_humidity_2m", 60),
                        "wind_speed_kmh": cur.get("wind_speed_10m", 10.0),
                        "uv_index": cur.get("uv_index", 5.0),
                        "weather_code": cur.get("weather_code", 0)
                    }
                }
    except Exception as e:
        print(f"[Weather Service Warning] Failed to fetch live weather from Open-Meteo: {e}")

    # 3. Offline Deterministic Fallback
    return {
        "status": "fallback",
        "provider": "offline_fallback",
        "location": {"latitude": lat, "longitude": lng},
        "data": {
            "temperature_celsius": 32.5,
            "feels_like_celsius": 35.0,
            "humidity_percent": 65,
            "wind_speed_kmh": 12.4,
            "uv_index": 6.0,
            "weather_code": 2
        }
    }

async def fetch_weather_by_city(city_name: str) -> Dict[str, Any]:
    """
    Geocode city name to lat/lng and fetch corresponding live weather using primary (OWM) or fallback (Open-Meteo).
    """
    geo = await geocode_city_name(city_name)
    if not geo:
        return {
            "status": "error",
            "message": f"City '{city_name}' could not be resolved to coordinates.",
            "data": None
        }

    weather = await fetch_weather_by_coordinates(geo["latitude"], geo["longitude"])
    if not weather["location"].get("city"):
        weather["location"]["city"] = geo["city"]
    if not weather["location"].get("country"):
        weather["location"]["country"] = geo.get("country", "")
    return weather
