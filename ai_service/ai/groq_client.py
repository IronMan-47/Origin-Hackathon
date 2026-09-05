import os
import json
import logging
from groq import Groq
from ai_service.models.advisory import Advisory
from ai_service.ai.schemas import get_advisory_json_schema

logger = logging.getLogger(__name__)

def generate_groq_advisory(system_prompt: str, context_json: str, model_name: str = "groq/compound") -> Advisory:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set.")

    client = Groq(api_key=api_key)
    schema_str = json.dumps(get_advisory_json_schema(), indent=2)
    
    augmented_prompt = (
        f"{system_prompt}\n\n"
        f"IMPORTANT: You must respond ONLY with a valid JSON object that exactly matches this JSON schema. "
        f"Do not include markdown blocks (like ```json), explanations, or any other text outside the JSON.\n\n"
        f"SCHEMA:\n{schema_str}"
    )

    try:
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": augmented_prompt},
                {"role": "user", "content": context_json}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        
        content = response.choices[0].message.content
        if not content:
            raise ValueError("Groq returned an empty response.")
            
        data = json.loads(content)
        return Advisory(**data)
        
    except Exception as e:
        logger.error(f"Groq provider ({model_name}) failed: {str(e)}")
        raise
