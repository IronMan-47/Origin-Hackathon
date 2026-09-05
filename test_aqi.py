import asyncio
from app.services import aqi_service

async def main():
    print("--- Testing Live AQI Fetch (Delhi: 28.6139, 77.2090) ---")
    live_aqi = await aqi_service.fetch_live_aqi(28.6139, 77.2090)
    print("Live AQI Result:")
    print(live_aqi)
    
    print("\n--- Testing AQI LLM Summary ---")
    summary = aqi_service.generate_aqi_llm_summary(live_aqi)
    print("LLM Summary Text:", summary)
    
    print("\n--- Testing 7-Day AQI History ---")
    history = await aqi_service.fetch_aqi_history(28.6139, 77.2090, past_days=7)
    print(f"Retrieved {len(history['daily_trends'])} daily trend records:")
    for day in history['daily_trends']:
        print(day)

if __name__ == "__main__":
    asyncio.run(main())
