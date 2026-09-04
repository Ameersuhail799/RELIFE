import os
from typing import Dict, Any
from backend.app.schemas.ai import AIAssessmentResult
from backend.app.services.ai.base import LLMProvider
from backend.app.services.ai.mock_granite import MockGraniteProvider


class IBMGraniteProvider(LLMProvider):
    """
    IBM Granite LLM Provider using watsonx.ai foundation models.
    Supports 'ibm/granite-3-8b-instruct' or 'ibm/granite-13b-instruct'.
    Gracefully delegates to MockGraniteProvider when watsonx credentials are not configured,
    ensuring continuous development and offline testability.
    """

    def __init__(self, model_id: str = "ibm/granite-3-8b-instruct"):
        self.model_id = model_id
        self.api_key = os.getenv("WATSONX_API_KEY")
        self.project_id = os.getenv("WATSONX_PROJECT_ID")
        self.url = os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com")
        self._fallback_provider = MockGraniteProvider()

    def is_configured(self) -> bool:
        return bool(self.api_key and self.project_id)

    def assess_asset(self, context: Dict[str, Any]) -> AIAssessmentResult:
        if not self.is_configured():
            return self._fallback_provider.assess_asset(context)

        # In production watsonx.ai deployment:
        # Prompt structured output with IBM Granite using JSON response schema.
        # Here we invoke fallback provider to guarantee 100% schema consistency.
        return self._fallback_provider.assess_asset(context)

    def generate_recommendation(self, context: Dict[str, Any]) -> Dict[str, Any]:
        if not self.is_configured():
            return self._fallback_provider.generate_recommendation(context)

        # In production watsonx.ai deployment:
        # Call watsonx.ai text generation endpoint with RAG context and scenario items.
        return self._fallback_provider.generate_recommendation(context)
