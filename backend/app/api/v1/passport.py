from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.schemas.passport import AssetPassportResponse
from backend.app.services.passport_service import get_asset_passport

router = APIRouter(prefix="/passport", tags=["passport"])


@router.get("/{asset_id}", response_model=AssetPassportResponse)
def get_passport(asset_id: str, db: Session = Depends(get_db)):
    try:
        return get_asset_passport(db=db, asset_id=asset_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
