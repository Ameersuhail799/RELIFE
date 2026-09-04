from abc import ABC, abstractmethod
from typing import Dict, Any


class LLMProvider(ABC):
    """Abstract interface for LLM reasoning and recommendation engines (e.g. IBM Granite)."""

    @abstractmethod
    def generate_recommendation(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Takes structured context (asset specs, capability, eligible pathways, economics)
        and returns structured recommendation reasoning conforming to EvaluationResponse.
        """
        pass
