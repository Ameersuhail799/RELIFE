from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.security_gate import SecurityGateViolationError
from backend.app.models.recommendation import PathwayRecommendation
from backend.app.schemas.approval import (
    ApprovalDecisionRequest,
    ApprovalDecisionResponse,
    RecommendationItemResponse,
)
from backend.app.services.asset_service import process_human_approval

router = APIRouter(prefix="/approvals", tags=["approvals"])


@router.get("", response_model=List[RecommendationItemResponse])
def list_approvals(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(PathwayRecommendation)
    if status:
        query = query.filter(PathwayRecommendation.approval_status == status)
    return query.order_by(PathwayRecommendation.created_at.desc()).offset(skip).limit(limit).all()


@router.post("/{recommendation_id}/decide", response_model=ApprovalDecisionResponse)
def submit_decision(
    recommendation_id: str,
    decision_in: ApprovalDecisionRequest,
    db: Session = Depends(get_db),
):
    try:
        response = process_human_approval(
            db=db,
            recommendation_id=recommendation_id,
            approval_in=decision_in,
        )
        return response
    except SecurityGateViolationError as sge:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(sge),
        )
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )
