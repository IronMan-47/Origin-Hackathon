import os
import json
import logging
from google import genai
from google.genai import types
from ai_service.models.advisory import Advisory

logger = logging.getLogger(__name__)

def generate_gemini_advisory(system_prompt: str, context_json: str) -> Advisory:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set.")

    client = genai.Client(api_key=api_key)

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=context_json,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                response_schema=Advisory,
                temperature=0.2
            )
        )
        
        if not response.text:
            raise ValueError("Gemini returned an empty response.")
            
        data = json.loads(response.text)
        return Advisory(**data)
        
    except Exception as e:
        logger.error(f"Gemini provider failed: {str(e)}")
        raise
