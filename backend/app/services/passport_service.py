import uuid
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.models.passport import AssetPassportEvent
from backend.app.models.asset import Asset
from backend.app.schemas.passport import AssetPassportResponse, PassportEventResponse


def log_passport_event(
    db: Session,
    asset_id: str,
    event_type: str,
    actor: str,
    details: Dict[str, Any],
) -> AssetPassportEvent:
    """Appends an immutable audit event to the Circular Asset Passport."""
    event = AssetPassportEvent(
        event_id=f"EVT-{uuid.uuid4().hex[:8].upper()}",
        asset_id=asset_id,
        event_type=event_type,
        actor=actor,
        details=details,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def get_asset_passport(db: Session, asset_id: str) -> AssetPassportResponse:
    asset = db.query(Asset).filter(Asset.asset_id == asset_id).first()
    if not asset:
        raise ValueError(f"Asset '{asset_id}' not found.")

    events = (
        db.query(AssetPassportEvent)
        .filter(AssetPassportEvent.asset_id == asset_id)
        .order_by(AssetPassportEvent.timestamp.asc())
        .all()
    )

    return AssetPassportResponse(
        asset_id=asset.asset_id,
        serial_number=asset.serial_number,
        device_type=asset.device_type,
        manufacturer=asset.manufacturer,
        model=asset.model,
        lifecycle_state=asset.lifecycle_state,
        total_events=len(events),
        events=[PassportEventResponse.model_validate(e) for e in events],
    )
