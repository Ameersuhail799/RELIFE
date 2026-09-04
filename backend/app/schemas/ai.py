from typing import List, Optional
from pydantic import BaseModel
from backend.app.core.enums import (
    CircularPathway,
    DestinationAction,
    ConfidenceLevel,
)


class RAGSourceItem(BaseModel):
    source_id: str
    source_title: str
    excerpt: str
    category: str
    relevance_score: float


class AIAssessmentResult(BaseModel):
    condition_assessment: str
    repairability: str  # HIGH, MODERATE, LOW, IMPRACTICAL
    repurpose_potential: str  # HIGH, MODERATE, LOW
    possible_roles: List[str]
    reasoning_summary: str
    confidence_level: ConfidenceLevel
    assumptions: List[str]
    uncertainties: List[str]


class ScenarioItem(BaseModel):
    pathway: CircularPathway
    destination_action: DestinationAction
    is_eligible: bool
    suitability_score: float
    deterministic_cost: float
    estimated_residual_value: float
    demand_match: Optional[str] = None
    useful_life_extension_years: float
    estimated_co2e_avoided_kg: float
    estimated_ewaste_diverted_kg: float
    trade_offs: str
    risks_and_uncertainties: List[str]
