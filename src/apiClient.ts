// API Client for connecting React Frontend to WeatherWise Unified FastAPI Backend

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export interface UserProfilePayload {
  age_group: string;
  health_conditions: string[];
  occupation: string;
}

export interface EndToEndAdvisoryRequest {
  lat: number;
  lng: number;
  user_profile: UserProfilePayload;
  user_question?: string;
}

export async function fetchLiveAQIFromBackend(lat: number, lng: number) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/v1/aqi/live?lat=${lat}&lng=${lng}`);
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend AQI lookup fell back to local service:", err);
    return null;
  }
}

export async function fetchAQIHistoryFromBackend(lat: number, lng: number, pastDays: number = 7) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/v1/aqi/history?lat=${lat}&lng=${lng}&past_days=${pastDays}`);
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend AQI history lookup failed:", err);
    return null;
  }
}

export async function fetchAIAdvisoryFromBackend(payload: EndToEndAdvisoryRequest) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/v1/advisory/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`Backend returned status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend AI Advisory lookup failed:", err);
    return null;
  }
}
