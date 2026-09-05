from fastapi import FastAPI
from ai_service.api import risk, ai

app = FastAPI(
    title="ORIGIN Intelligence Service",
    description="Python API for the Deterministic Risk Engine and AI Controller",
    version="1.0.0"
)

# Include routers
app.include_router(risk.router)
app.include_router(ai.router)

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "ORIGIN Intelligence Service"}
