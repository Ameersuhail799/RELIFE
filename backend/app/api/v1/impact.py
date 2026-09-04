from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.schemas.impact import ImpactSummaryResponse
from backend.app.services.portfolio_service import get_portfolio_impact_summary

router = APIRouter(prefix="/impact", tags=["impact"])


@router.get("/summary", response_model=ImpactSummaryResponse)
def get_impact_summary(db: Session = Depends(get_db)):
    return get_portfolio_impact_summary(db)
