from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from backend.app.core.enums import DemandPriority, MobilityRequirement, ComputeTier


class DemandBase(BaseModel):
    department: str
    role: str
    quantity_needed: int
    priority: DemandPriority = DemandPriority.MEDIUM
    min_compute_tier: ComputeTier = ComputeTier.ENTRY
    min_ram_gb: int = 4
    min_storage_gb: int = 128
    preferred_storage_type: str = "ANY"
    required_os: List[str] = []
    required_mobility: MobilityRequirement = MobilityRequirement.ANY
    required_display: str = "ANY"
    required_network: List[str] = []
    notes: str = ""


class DemandCreate(DemandBase):
    pass


class DemandResponse(DemandBase):
    demand_id: str
    quantity_fulfilled: int
    remaining_quantity: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DemandMatchItem(BaseModel):
    demand_id: str
    department: str
    role: str
    priority: DemandPriority
    compatibility_score: float
    is_compatible: bool
    reasons: List[str]
    unmet_requirements: List[str]
    security_eligibility_status: str
    recommended_action: str


class AssetDemandMatchesResponse(BaseModel):
    asset_id: str
    device_summary: str
    total_demands_evaluated: int
    compatible_matches_count: int
    matches: List[DemandMatchItem]
