from typing import List, Optional
from pydantic import BaseModel
from backend.app.core.enums import (
    CircularPathway,
    DestinationAction,
    DecisionObjective,
    ConfidenceLevel,
)
from backend.app.core.security_gate import SecurityGateResult
from backend.app.schemas.capability import DeviceCapabilityProfile
from backend.app.schemas.economics import EconomicEvaluation, EnvironmentalEstimate


class EvaluationRequest(BaseModel):
    asset_id: str
    decision_objective: DecisionObjective = DecisionObjective.BALANCED


class AlternativeOption(BaseModel):
    pathway: CircularPathway
    destination_action: DestinationAction
    suitability_score: float
    trade_off_summary: str


class EvaluationResponse(BaseModel):
    recommendation_id: str
    asset_id: str
    decision_objective: DecisionObjective
    security_gate: SecurityGateResult
    capability_profile: DeviceCapabilityProfile
    eligible_pathways: List[CircularPathway]

    # Selected recommendation
    recommended_pathway: CircularPathway
    destination_action: DestinationAction
    suitability_score: float

    # Deterministic calculation packages
    economics: EconomicEvaluation
    environmental: EnvironmentalEstimate

    # AI Reasoning & Explainability Output
    confidence_level: ConfidenceLevel
    reasons: List[str]
    key_factors: List[str]
    alternatives_considered: List[AlternativeOption]
    assumptions: List[str]
    uncertainties: List[str]
    why_this_recommendation: str

    approval_status: str
