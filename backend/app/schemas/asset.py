from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from backend.app.core.enums import (
    AssetLifecycleState,
    DeviceType,
    PhysicalCondition,
    FunctionalStatus,
    SanitizationMethod,
    SanitizationStatus,
)


class AssetBase(BaseModel):
    serial_number: str
    device_type: DeviceType
    manufacturer: str
    model: str
    purchase_year: int
    cpu_model: str
    cpu_cores: int
    ram_gb: int
    storage_gb: int
    storage_type: str
    storage_present: bool = True
    sanitization_method: SanitizationMethod = SanitizationMethod.NONE
    sanitization_status: SanitizationStatus = SanitizationStatus.PENDING
    sanitization_verified: bool = False
    verification_reference: Optional[str] = None
    verified_at: Optional[datetime] = None
    verified_by: Optional[str] = None
    battery_health_percent: Optional[float] = None
    physical_condition: PhysicalCondition
    functional_status: FunctionalStatus
    known_issues: List[str] = []
    department: str
    location: str


class AssetCreate(AssetBase):
    asset_id: Optional[str] = None


class AssetUpdateSanitization(BaseModel):
    sanitization_method: SanitizationMethod
    sanitization_status: SanitizationStatus
    sanitization_verified: bool
    verification_reference: str
    verified_by: str


class AssetResponse(AssetBase):
    asset_id: str
    lifecycle_state: AssetLifecycleState
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
