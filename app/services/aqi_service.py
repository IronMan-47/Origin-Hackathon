import os
import httpx
from typing import Dict, Any, List
from datetime import datetime

OPEN_METEO_AQ_URL = "https://air-quality-api.open-meteo.com/v1/air-quality"
WAQI_API_TOKEN = os.getenv("WAQI_API_KEY", "ac724915550424c9a4372ed12ebb5c4225bc780e")

AQI_CATEGORIES = [
    {"max": 50, "label": "Good", "color": "#00E400", "implication": "Air quality is satisfactory, and air pollution poses little or no risk."},
    {"max": 100, "label": "Moderate", "color": "#FFFF00", "implication": "Air quality is acceptable. Sensitive individuals may experience minor irritation."},
    {"max": 150, "label": "Unhealthy for Sensitive Groups", "color": "#FF7E00", "implication": "Members of sensitive groups (asthma, elderly, children) may experience health effects."},
    {"max": 200, "label": "Unhealthy", "color": "#FF0000", "implication": "Some members of the general public may experience health effects; sensitive groups may experience more serious effects."},
    {"max": 300, "label": "Very Unhealthy", "color": "#8F3F97", "implication": "Health alert: The risk of health effects is increased for everyone."},
    {"max": 9999, "label": "Hazardous", "color": "#7E0023", "implication": "Health warning of emergency conditions: Everyone is more likely to be affected."}
]

def categorize_aqi(aqi_val: float) -> Dict[str, str]:
    """Map numeric US AQI value to health risk category, color, and implications."""
    for cat in AQI_CATEGORIES:
        if aqi_val <= cat["max"]:
            return {
                "category": cat["label"],
                "color_code": cat["color"],
                "health_implications": cat["implication"]
            }
    return {
        "category": "Hazardous",
        "color_code": "#7E0023",
        "health_implications": AQI_CATEGORIES[-1]["implication"]
    }

def find_dominant_pollutant(pollutants: Dict[str, float]) -> str:
    """Identify the primary pollutant hazard."""
    if not pollutants:
        return "Unknown"
    valid_p = {k: v for k, v in pollutants.items() if v is not None}
    if not valid_p:
        return "PM2.5"
    return max(valid_p, key=valid_p.get).upper().replace("_", ".")

async def fetch_live_aqi(lat: float, lng: float) -> Dict[str, Any]:
    """
    Fetch live Air Quality data for latitude & longitude.
    First tries WAQI ground monitoring station API using WAQI_API_KEY.
    Falls back to Open-Meteo Air Quality gridded model if WAQI is unavailable.
    """
    # 1. Primary: Try WAQI Official Ground Station API
    if WAQI_API_TOKEN:
        try:
            waqi_url = f"https://api.waqi.info/feed/geo:{lat};{lng}/?token={WAQI_API_TOKEN}"
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                res = await client.get(waqi_url)
                if res.status_code == 200:
                    payload = res.json()
                    if payload.get("status") == "ok" and "data" in payload and isinstance(payload["data"].get("aqi"), (int, float)):
                        data = payload["data"]
                        aqi_val = round(data.get("aqi", 0))
                        cat_info = categorize_aqi(aqi_val)
                        iaqi = data.get("iaqi", {})
                        pollutants = {
                            "pm2_5": iaqi.get("pm25", {}).get("v"),
                            "pm10": iaqi.get("pm10", {}).get("v"),
                            "no2": iaqi.get("no2", {}).get("v"),
                            "o3": iaqi.get("o3", {}).get("v"),
                            "so2": iaqi.get("so2", {}).get("v")
                        }
                        dominant = (data.get("dominentpol") or "pm25").upper().replace("_", ".")
                        station_name = data.get("city", {}).get("name", "")
                        
                        # Check city-wide peak station to avoid single green-zone station bias
                        city_keyword = ""
                        if "delhi" in station_name.lower():
                            city_keyword = "delhi"
                        elif "mumbai" in station_name.lower():
                            city_keyword = "mumbai"
                        elif "," in station_name:
                            parts = station_name.split(",")
                            if len(parts) >= 2:
                                city_keyword = parts[1].strip()

                        peak_aqi_val = aqi_val
                        peak_station_name = station_name

                        if city_keyword:
                            try:
                                search_url = f"https://api.waqi.info/search/?token={WAQI_API_TOKEN}&keyword={city_keyword}"
                                search_res = await client.get(search_url)
                                if search_res.status_code == 200:
                                    s_data = search_res.json().get("data", [])
                                    valid_stations = [s for s in s_data if isinstance(s.get("aqi"), str) and s["aqi"].isdigit()]
                                    if valid_stations:
                                        top_s = max(valid_stations, key=lambda s: int(s["aqi"]))
                                        s_aqi_val = int(top_s["aqi"])
                                        if s_aqi_val > peak_aqi_val:
                                            peak_aqi_val = s_aqi_val
                                            peak_station_name = top_s.get("station", {}).get("name", station_name)
                            except Exception as search_err:
                                print(f"[AQI Service] City peak station lookup warning: {search_err}")

                        final_aqi = max(aqi_val, peak_aqi_val)
                        cat_info = categorize_aqi(final_aqi)
                        
                        return {
                            "location": {
                                "latitude": lat,
                                "longitude": lng,
                                "local_station": station_name,
                                "peak_station": peak_station_name
                            },
                            "aqi": final_aqi,
                            "local_station_aqi": aqi_val,
                            "peak_station_aqi": peak_aqi_val,
                            "category": cat_info["category"],
                            "color_code": cat_info["color_code"],
                            "dominant_pollutant": dominant,
                            "pollutants": pollutants,
                            "health_implications": cat_info["health_implications"],
                            "timestamp": data.get("time", {}).get("iso", datetime.utcnow().isoformat()),
                            "aqi_source": "waqi_ground_station",
                            "is_fallback": False
                        }
        except Exception as err:
            print(f"[AQI Service] WAQI ground station fetch error: {err}. Falling back to Open-Meteo.")

    # 2. Secondary: Open-Meteo Air Quality Model
    params = {
        "latitude": lat,
        "longitude": lng,
        "current": ["us_aqi", "pm2_5", "pm10", "nitrogen_dioxide", "ozone", "sulphur_dioxide"]
    }
    
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            response = await client.get(OPEN_METEO_AQ_URL, params=params)
            if response.status_code == 200:
                data = response.json().get("current", {})
                aqi_val = round(data.get("us_aqi", 0))
                cat_info = categorize_aqi(aqi_val)
                
                pollutants = {
                    "pm2_5": data.get("pm2_5"),
                    "pm10": data.get("pm10"),
                    "no2": data.get("nitrogen_dioxide"),
                    "o3": data.get("ozone"),
                    "so2": data.get("sulphur_dioxide")
                }
                
                dominant = find_dominant_pollutant(pollutants)
                
                return {
                    "location": {"latitude": lat, "longitude": lng},
                    "aqi": aqi_val,
                    "category": cat_info["category"],
                    "color_code": cat_info["color_code"],
                    "dominant_pollutant": dominant,
                    "pollutants": pollutants,
                    "health_implications": cat_info["health_implications"],
                    "timestamp": data.get("time", datetime.utcnow().isoformat()),
                    "aqi_source": "open_meteo_model",
                    "is_fallback": False
                }
    except Exception as e:
        print(f"[AQI Service Warning] Remote API error: {e}. Utilizing fallback AQI dataset.")

    # Fallback dataset if remote API connection times out or fails
    fallback_aqi = 145
    cat_info = categorize_aqi(fallback_aqi)
    return {
        "location": {"latitude": lat, "longitude": lng},
        "aqi": fallback_aqi,
        "category": cat_info["category"],
        "color_code": cat_info["color_code"],
        "dominant_pollutant": "PM2.5",
        "pollutants": {"pm2_5": 58.5, "pm10": 110.0, "no2": 32.0, "o3": 25.0, "so2": 8.0},
        "health_implications": cat_info["health_implications"],
        "timestamp": datetime.utcnow().isoformat(),
        "is_fallback": True
    }

async def fetch_aqi_history(lat: float, lng: float, past_days: int = 7) -> Dict[str, Any]:
    """
    Fetch 7-day historical hourly AQI and aggregate into daily stats for dashboard trends.
    """
    params = {
        "latitude": lat,
        "longitude": lng,
        "past_days": past_days,
        "hourly": ["us_aqi", "pm2_5", "pm10"]
    }
    
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            response = await client.get(OPEN_METEO_AQ_URL, params=params)
            if response.status_code == 200:
                hourly = response.json().get("hourly", {})
                times = hourly.get("time", [])
                aqi_series = hourly.get("us_aqi", [])
                pm25_series = hourly.get("pm2_5", [])
                
                daily_map = {}
                for t, aqi_v, pm_v in zip(times, aqi_series, pm25_series):
                    date_str = t.split("T")[0]
                    if date_str not in daily_map:
                        daily_map[date_str] = {"aqi_list": [], "pm25_list": []}
                    if aqi_v is not None:
                        daily_map[date_str]["aqi_list"].append(aqi_v)
                    if pm_v is not None:
                        daily_map[date_str]["pm25_list"].append(pm_v)
                        
                daily_trends = []
                for date_key, vals in daily_map.items():
                    aqis = vals["aqi_list"]
                    pms = vals["pm25_list"]
                    avg_aqi = round(sum(aqis) / len(aqis)) if aqis else 0
                    max_aqi = max(aqis) if aqis else 0
                    avg_pm25 = round(sum(pms) / len(pms), 1) if pms else 0.0
                    
                    daily_trends.append({
                        "date": date_key,
                        "avg_aqi": avg_aqi,
                        "max_aqi": max_aqi,
                        "category": categorize_aqi(avg_aqi)["category"],
                        "avg_pm2_5": avg_pm25
                    })
                    
                return {
                    "location": {"latitude": lat, "longitude": lng},
                    "past_days": past_days,
                    "daily_trends": daily_trends,
                    "raw_hourly": {
                        "timestamps": times[-48:],
                        "aqi": aqi_series[-48:]
                    },
                    "is_fallback": False
                }
    except Exception as e:
        print(f"[AQI Service Warning] History API error: {e}. Utilizing fallback trends.")

    # Fallback trends for offline/timeout resilience
    dummy_trends = [
        {"date": f"2026-08-2{i}", "avg_aqi": 110 + i * 8, "max_aqi": 130 + i * 10, "category": categorize_aqi(110 + i * 8)["category"], "avg_pm2_5": 45.0 + i * 3}
        for i in range(1, 8)
    ]
    return {
        "location": {"latitude": lat, "longitude": lng},
        "past_days": past_days,
        "daily_trends": dummy_trends,
        "is_fallback": True
    }

def generate_aqi_llm_summary(aqi_data: Dict[str, Any]) -> str:
    """Format AQI findings into a concise text snippet for the LLM advisory module."""
    aqi = aqi_data.get("aqi", 0)
    category = aqi_data.get("category", "Unknown")
    dominant = aqi_data.get("dominant_pollutant", "PM2.5")
    p = aqi_data.get("pollutants", {})
    pm25 = p.get("pm2_5", "N/A")
    pm10 = p.get("pm10", "N/A")
    
    return (
        f"AQI: {aqi} ({category}). "
        f"Dominant Pollutant: {dominant}. "
        f"PM2.5: {pm25} µg/m³, PM10: {pm10} µg/m³. "
        f"Health Status: {aqi_data.get('health_implications', '')}"
    )
