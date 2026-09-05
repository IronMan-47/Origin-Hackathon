import type { EnvironmentalData } from './riskEngine';

// Weather description mapper for WMO codes from Open-Meteo
export function getWeatherDescription(code: number): string {
  switch (code) {
    case 0: return 'Clear sky';
    case 1: return 'Mainly clear';
    case 2: return 'Partly cloudy';
    case 3: return 'Overcast';
    case 45: case 48: return 'Fog & depositing rime fog';
    case 51: case 53: case 55: return 'Drizzle (Light to Dense)';
    case 61: case 63: case 65: return 'Rain (Slight to Heavy)';
    case 71: case 73: case 75: return 'Snow fall';
    case 80: case 81: case 82: return 'Rain showers';
    case 95: return 'Thunderstorm';
    default: return 'Varied atmospheric conditions';
  }
}

const DEFAULT_WAQI_TOKEN = "ac724915550424c9a4372ed12ebb5c4225bc780e";

// Fetch live weather from Open-Meteo & Air Quality
export async function fetchLiveEnvironment(
  lat: number,
  lon: number,
  waqiToken: string = DEFAULT_WAQI_TOKEN
): Promise<EnvironmentalData> {
  // 1. Fetch Weather from Open-Meteo (100% Free, No key needed)
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m,uv_index&timezone=auto`;
  
  // 2. Fetch Air Quality from Open-Meteo (Global satellite gridded model)
  const openMeteoAqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5&timezone=auto`;

  try {
    const [weatherRes, aqRes] = await Promise.all([
      fetch(weatherUrl).then(r => r.json()),
      fetch(openMeteoAqUrl).then(r => r.json())
    ]);

    const temp = Math.round(weatherRes.current?.temperature_2m ?? 30);
    const feelsLike = Math.round(weatherRes.current?.apparent_temperature ?? temp);
    const humidity = Math.round(weatherRes.current?.relative_humidity_2m ?? 60);
    const windSpeed = Math.round(weatherRes.current?.wind_speed_10m ?? 10);
    const weatherCode = weatherRes.current?.weather_code ?? 0;
    const uvIndex = weatherRes.current?.uv_index ?? 5;

    let aqi = aqRes.current?.us_aqi ?? 110;
    let pm25 = Math.round((aqRes.current?.pm2_5 ?? 45) * 10) / 10;
    let pm10 = Math.round((aqRes.current?.pm10 ?? 70) * 10) / 10;
    let aqiSource: 'waqi' | 'open_meteo' = 'open_meteo';
    let stationName: string | undefined = undefined;
    let dominantPollutant: string | undefined = undefined;

    // 3. WAQI Ground Station Fetch with provided token
    if (waqiToken && waqiToken.trim() !== '') {
      try {
        const waqiRes = await fetch(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=${waqiToken}`).then(r => r.json());
        if (waqiRes.status === 'ok' && waqiRes.data) {
          if (typeof waqiRes.data.aqi === 'number') {
            aqi = waqiRes.data.aqi;
          }
          if (waqiRes.data.iaqi?.pm25?.v) pm25 = Math.round(waqiRes.data.iaqi.pm25.v * 10) / 10;
          if (waqiRes.data.iaqi?.pm10?.v) pm10 = Math.round(waqiRes.data.iaqi.pm10.v * 10) / 10;
          if (waqiRes.data.city?.name) stationName = waqiRes.data.city.name;
          if (waqiRes.data.dominentpol) dominantPollutant = waqiRes.data.dominentpol.toUpperCase();
          aqiSource = 'waqi';
        }
      } catch (waqiErr) {
        console.warn("WAQI station lookup fell back to Open-Meteo model:", waqiErr);
      }
    }

    // Determine category
    let aqiCategory = 'Moderate';
    if (aqi <= 50) aqiCategory = 'Good';
    else if (aqi <= 100) aqiCategory = 'Moderate';
    else if (aqi <= 150) aqiCategory = 'Unhealthy for Sensitive Groups';
    else if (aqi <= 200) aqiCategory = 'Unhealthy';
    else if (aqi <= 300) aqiCategory = 'Very Unhealthy';
    else aqiCategory = 'Hazardous';

    return {
      temperature: temp,
      feelsLike,
      humidity,
      windSpeed,
      weatherCode,
      weatherDescription: getWeatherDescription(weatherCode),
      uvIndex,
      aqi,
      aqiCategory,
      pm25,
      pm10,
      aqiSource
    };
  } catch (err) {
    console.error("Failed to fetch live environment data, using fallback:", err);
    // Safe deterministic fallback
    return {
      temperature: 32,
      feelsLike: 36,
      humidity: 72,
      windSpeed: 12,
      weatherCode: 2,
      weatherDescription: 'Partly cloudy',
      uvIndex: 7,
      aqi: 164,
      aqiCategory: 'Unhealthy',
      pm25: 78.4,
      pm10: 114.2,
      aqiSource: 'open_meteo'
    };
  }
}
