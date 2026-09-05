import logging
from ai_service.models.advisory import Advisory
from ai_service.models.risk import RiskAssessment
from ai_service.ai.gemini import generate_gemini_advisory
from ai_service.ai.groq_client import generate_groq_advisory
from ai_service.ai.prompts import SYSTEM_PROMPT

logger = logging.getLogger(__name__)

def generate_advisory_orchestrated(context_json: str, risk_assessment: RiskAssessment) -> Advisory:
    # Attempt 1: Google Gemini (Primary)
    try:
        logger.info("Attempting Gemini generation...")
        return generate_gemini_advisory(SYSTEM_PROMPT, context_json)
    except Exception as e:
        logger.warning(f"Gemini generation failed: {e}. Falling back to Groq 70B.")

    # Attempt 2: Groq Compound (Fallback 1)
    try:
        logger.info("Attempting Groq Compound generation...")
        return generate_groq_advisory(SYSTEM_PROMPT, context_json, model_name="groq/compound")
    except Exception as e:
        logger.warning(f"Groq Compound generation failed: {e}. Falling back to Groq Compound Mini.")

    # Attempt 3: Groq Compound Mini (Fallback 2 - Ultra fast)
    try:
        logger.info("Attempting Groq Compound Mini generation...")
        return generate_groq_advisory(SYSTEM_PROMPT, context_json, model_name="groq/compound-mini")
    except Exception as e:
        logger.error(f"Groq Mini generation failed: {e}. All AI providers exhausted. Triggering offline fallback.")
        
    # Phase 9: Offline Deterministic Fallback
    from ai_service.ai.fallback import generate_deterministic_advisory
    
    try:
        return generate_deterministic_advisory(risk_assessment)
    except Exception as fallback_err:
        logger.critical(f"Deterministic fallback failed: {fallback_err}")
        raise RuntimeError("Complete AI and offline fallback system failure.")
