from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.asset import Asset
from backend.app.schemas.asset import AssetCreate, AssetResponse, AssetUpdateSanitization
from backend.app.schemas.recommendation import EvaluationResponse
from backend.app.services.asset_service import register_asset, evaluate_asset_pathways
from backend.app.services.passport_service import log_passport_event
from backend.app.core.enums import DecisionObjective
import datetime

router = APIRouter(prefix="/assets", tags=["assets"])


@router.get("", response_model=List[AssetResponse])
def list_assets(
    status: Optional[str] = None,
    department: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(Asset)
    if status:
        query = query.filter(Asset.lifecycle_state == status)
    if department:
        query = query.filter(Asset.department.ilike(f"%{department}%"))
    return query.offset(skip).limit(limit).all()


@router.post("", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
def create_asset(asset_in: AssetCreate, db: Session = Depends(get_db)):
    existing = db.query(Asset).filter(Asset.serial_number == asset_in.serial_number).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Asset with serial number '{asset_in.serial_number}' already exists.",
        )
    return register_asset(db=db, asset_in=asset_in, actor="api_user")


@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(asset_id: str, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Asset '{asset_id}' not found.",
        )
    return asset


@router.post("/{asset_id}/evaluate", response_model=EvaluationResponse)
def evaluate_specific_asset(
    asset_id: str,
    objective: Optional[DecisionObjective] = DecisionObjective.BALANCED,
    db: Session = Depends(get_db),
):
    try:
        return evaluate_asset_pathways(
            db=db,
            asset_id=asset_id,
            objective=objective,
            actor="analyst_api",
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/{asset_id}/sanitization", response_model=AssetResponse)
def update_sanitization(
    asset_id: str,
    sanitization_in: AssetUpdateSanitization,
    db: Session = Depends(get_db),
):
    asset = db.query(Asset).filter(Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Asset '{asset_id}' not found.",
        )

    asset.sanitization_method = sanitization_in.sanitization_method.value
    asset.sanitization_status = sanitization_in.sanitization_status.value
    asset.sanitization_verified = sanitization_in.sanitization_verified
    asset.verification_reference = sanitization_in.verification_reference
    asset.verified_by = sanitization_in.verified_by
    asset.verified_at = datetime.datetime.now(datetime.timezone.utc)

    db.commit()
    db.refresh(asset)

    log_passport_event(
        db=db,
        asset_id=asset.asset_id,
        event_type="SANITIZATION_LOGGED",
        actor=sanitization_in.verified_by,
        details={
            "sanitization_method": asset.sanitization_method,
            "sanitization_status": asset.sanitization_status,
            "sanitization_verified": asset.sanitization_verified,
            "verification_reference": asset.verification_reference,
        },
    )

    return asset


@router.post("/seed-simulated", status_code=status.HTTP_200_OK)
def seed_simulated_assets(db: Session = Depends(get_db)):
    from backend.app.services.portfolio_service import seed_simulated_data
    result = seed_simulated_data(db)
    return result

