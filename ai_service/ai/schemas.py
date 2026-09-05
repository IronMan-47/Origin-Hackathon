from typing import Any, Dict
from ai_service.models.advisory import Advisory

def get_advisory_json_schema() -> Dict[str, Any]:
    return Advisory.model_json_schema()
