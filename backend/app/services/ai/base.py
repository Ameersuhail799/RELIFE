from abc import ABC, abstractmethod
from typing import Dict, Any
from backend.app.schemas.ai import AIAssessmentResult


class LLMProvider(ABC):
    """Abstract interface for LLM reasoning, asset assessment, and recommendation engines (e.g. IBM Granite)."""

    @abstractmethod
    def assess_asset(self, context: Dict[str, Any]) -> AIAssessmentResult:
        """
        Takes raw asset specs, defect notes, and capability profile and produces
        structured qualitative condition assessment, repairability rating, and possible roles.
        """
        pass

    @abstractmethod
    def generate_recommendation(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Takes structured context (asset specs, capability, scenarios, economics, RAG sources)
        and returns structured recommendation reasoning and trade-off explanations.
        """
        pass
