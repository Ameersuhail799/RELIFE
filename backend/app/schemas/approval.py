from typing import Optional
from datetime import datetime
from pydantic import BaseModel
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
