from typing import List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class PassportEventResponse(BaseModel):
    event_id: str
    asset_id: str
    event_type: str
    timestamp: datetime
    actor: str
    details: Dict[str, Any]

    model_config = ConfigDict(from_attributes=True)


class AssetPassportResponse(BaseModel):
    asset_id: str
    serial_number: str
    device_type: str
    manufacturer: str
    model: str
    lifecycle_state: str
    total_events: int
    events: List[PassportEventResponse]
