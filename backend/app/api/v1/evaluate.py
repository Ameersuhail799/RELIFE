from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.schemas.recommendation import EvaluationRequest, EvaluationResponse
from backend.app.services.asset_service import evaluate_asset_pathways

router = APIRouter(prefix="/evaluate", tags=["evaluate"])


@router.post("", response_model=EvaluationResponse)
def evaluate_asset(request: EvaluationRequest, db: Session = Depends(get_db)):
    try:
        response = evaluate_asset_pathways(
            db=db,
            asset_id=request.asset_id,
            objective=request.decision_objective,
            actor="analyst_api",
        )
        return response
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
