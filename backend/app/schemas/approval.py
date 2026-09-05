from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from backend.app.core.enums import CircularPathway, DestinationAction, AssetLifecycleState


class ApprovalDecisionRequest(BaseModel):
    decision: str  # "APPROVE", "OVERRIDE", "REJECT"
    chosen_pathway: Optional[CircularPathway] = None
    chosen_destination: Optional[DestinationAction] = None
    actor: str
    approval_notes: str


class ApprovalDecisionResponse(BaseModel):
    recommendation_id: str
    asset_id: str
    approval_status: str
    final_pathway: CircularPathway
    final_destination: DestinationAction
    decided_at: datetime
    decided_by: str
    new_lifecycle_state: AssetLifecycleState
    notes: str


class RecommendationItemResponse(BaseModel):
    recommendation_id: str
    asset_id: str
    decision_objective: str
    recommended_pathway: str
    destination_action: str
    suitability_score: float
    estimated_repair_cost: float
    estimated_residual_value: float
    estimated_avoided_cost: float
    economic_viability: str
    estimated_life_extension_years: float
    estimated_ewaste_diverted_kg: float
    estimated_co2e_avoided_kg: float
    is_estimate: bool
    confidence_level: str
    reasons: list = []
    key_factors: list = []
    alternatives_considered: list = []
    assumptions: list = []
    uncertainties: list = []
    why_this_recommendation: str
    security_gate_cleared: bool
    approval_status: str
    approved_by: Optional[str] = None
    approval_notes: Optional[str] = None
    chosen_pathway_override: Optional[str] = None
    chosen_destination_override: Optional[str] = None
    decided_at: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


