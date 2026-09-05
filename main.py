import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from app.routers import aqi, weather, advisory
from ai_service.api import risk, ai

app = FastAPI(
    title="WeatherWise Unified Backend & AI Intelligence API",
    description="Backend service providing real-time AQI metrics, 7-day trend analysis, weather aggregation, deterministic risk scoring, and personalized AI health advisories.",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(aqi.router)
app.include_router(weather.router)
app.include_router(advisory.router)

# Include AI Service Routers directly
app.include_router(risk.router)
app.include_router(ai.router)

@app.get("/", tags=["Health Check"])
async def root():
    return {
        "status": "online",
        "service": "WeatherWise Unified Health Intelligence Engine",
        "documentation": "/docs",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("main:app", host=host, port=port, reload=True)
