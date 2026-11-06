from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.core.enums import DecisionObjective
from backend.app.schemas.recommendation import EvaluationRequest, EvaluationResponse
from backend.app.services.asset_service import evaluate_asset_pathways

router = APIRouter(prefix="/evaluate", tags=["evaluate"])


@router.get("/{asset_id}", response_model=EvaluationResponse)
def get_asset_evaluation(
    asset_id: str,
    objective: DecisionObjective = DecisionObjective.BALANCED,
    db: Session = Depends(get_db),
):
    """
    Read-only assessment preview for an asset.
    Does not create a new PathwayRecommendation row, log passport events, or mutate lifecycle_state.
    """
    try:
        return evaluate_asset_pathways(
            db=db,
            asset_id=asset_id,
            objective=objective,
            actor="analyst_viewer",
            persist=False,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("", response_model=EvaluationResponse)
def evaluate_asset(request: EvaluationRequest, db: Session = Depends(get_db)):
    try:
        response = evaluate_asset_pathways(
            db=db,
            asset_id=request.asset_id,
            objective=request.decision_objective,
            actor="analyst_api",
            persist=True,
        )
        return response
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

