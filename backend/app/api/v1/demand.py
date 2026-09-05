import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.core.enums import DemandPriority
from backend.app.models.asset import Asset
from backend.app.models.demand import DemandRequest
from backend.app.schemas.demand import (
    DemandCreate,
    DemandResponse,
    AssetDemandMatchesResponse,
    AssetMatchForDemand,
    DemandCandidatesResponse,
)
from backend.app.services.demand_matcher import (
    find_matches_for_asset,
    evaluate_asset_against_demand,
    PRIORITY_RANKS,
)

router = APIRouter(prefix="/demand", tags=["demand"])


@router.get("", response_model=List[DemandResponse])
def list_demands(
    department: Optional[str] = None,
    priority: Optional[DemandPriority] = None,
    db: Session = Depends(get_db),
):
    query = db.query(DemandRequest)
    if department:
        query = query.filter(DemandRequest.department.ilike(f"%{department}%"))
    if priority:
        query = query.filter(DemandRequest.priority == priority.value)

    demands = query.all()
    # Sort in memory by priority rank
    demands.sort(key=lambda d: PRIORITY_RANKS.get(DemandPriority(d.priority), 0), reverse=True)
    return demands


@router.post("", response_model=DemandResponse, status_code=status.HTTP_201_CREATED)
def create_demand(demand_in: DemandCreate, db: Session = Depends(get_db)):
    demand_id = f"DEMAND-{uuid.uuid4().hex[:6].upper()}"
    db_demand = DemandRequest(
        demand_id=demand_id,
        department=demand_in.department,
        role=demand_in.role,
        quantity_needed=demand_in.quantity_needed,
        quantity_fulfilled=0,
        priority=demand_in.priority.value,
        min_compute_tier=demand_in.min_compute_tier.value,
        min_ram_gb=demand_in.min_ram_gb,
        min_storage_gb=demand_in.min_storage_gb,
        preferred_storage_type=demand_in.preferred_storage_type,
        required_os=demand_in.required_os,
        required_mobility=demand_in.required_mobility.value,
        required_display=demand_in.required_display,
        required_network=demand_in.required_network,
        notes=demand_in.notes,
    )
    db.add(db_demand)
    db.commit()
    db.refresh(db_demand)
    return db_demand


@router.get("/matches/{asset_id}", response_model=AssetDemandMatchesResponse)
def get_demand_matches_for_asset(asset_id: str, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Asset '{asset_id}' not found.")

    demands = db.query(DemandRequest).all()
    matches = find_matches_for_asset(asset=asset, demands=demands)
    compatible_count = sum(1 for m in matches if m.is_compatible)

    summary = f"{asset.manufacturer} {asset.model} ({asset.cpu_model}, {asset.ram_gb}GB, {asset.storage_type})"

    return AssetDemandMatchesResponse(
        asset_id=asset.asset_id,
        device_summary=summary,
        total_demands_evaluated=len(demands),
        compatible_matches_count=compatible_count,
        matches=matches,
    )


@router.get("/{demand_id}/candidates", response_model=DemandCandidatesResponse)
def get_candidates_for_demand(demand_id: str, db: Session = Depends(get_db)):
    demand = db.query(DemandRequest).filter(DemandRequest.demand_id == demand_id).first()
    if not demand:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Demand '{demand_id}' not found.")

    assets = db.query(Asset).all()
    candidates: List[AssetMatchForDemand] = []

    for asset in assets:
        match_item = evaluate_asset_against_demand(asset=asset, demand=demand)
        candidates.append(
            AssetMatchForDemand(
                asset_id=asset.asset_id,
                serial_number=asset.serial_number,
                device_type=asset.device_type,
                manufacturer=asset.manufacturer,
                model=asset.model,
                purchase_year=asset.purchase_year,
                cpu_model=asset.cpu_model,
                cpu_cores=asset.cpu_cores,
                ram_gb=asset.ram_gb,
                storage_gb=asset.storage_gb,
                storage_type=asset.storage_type,
                battery_health_percent=asset.battery_health_percent,
                physical_condition=asset.physical_condition,
                functional_status=asset.functional_status,
                department=asset.department,
                location=asset.location,
                storage_present=asset.storage_present,
                sanitization_verified=asset.sanitization_verified,
                compatibility_score=match_item.compatibility_score,
                is_compatible=match_item.is_compatible,
                reasons=match_item.reasons,
                unmet_requirements=match_item.unmet_requirements,
                security_eligibility_status=match_item.security_eligibility_status,
                recommended_action=match_item.recommended_action,
            )
        )

    # Sort candidates: compatible first, then compatibility_score descending
    candidates.sort(key=lambda c: (1 if c.is_compatible else 0, c.compatibility_score), reverse=True)
    compatible_count = sum(1 for c in candidates if c.is_compatible)

    return DemandCandidatesResponse(
        demand_id=demand.demand_id,
        department=demand.department,
        role=demand.role,
        quantity_needed=demand.quantity_needed,
        quantity_fulfilled=demand.quantity_fulfilled,
        remaining_quantity=demand.remaining_quantity,
        total_assets_evaluated=len(assets),
        compatible_assets_count=compatible_count,
        candidates=candidates,
    )

