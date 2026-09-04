import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, JSON
from backend.app.core.database import Base
from backend.app.core.enums import AssetLifecycleState, SanitizationStatus, SanitizationMethod


class Asset(Base):
    __tablename__ = "assets"

    asset_id = Column(String, primary_key=True, index=True)
    serial_number = Column(String, nullable=False, unique=True, index=True)
    device_type = Column(String, nullable=False)  # laptop, desktop
    manufacturer = Column(String, nullable=False)
    model = Column(String, nullable=False)
    purchase_year = Column(Integer, nullable=False)

    # Hardware Specs
    cpu_model = Column(String, nullable=False)
    cpu_cores = Column(Integer, nullable=False)
    ram_gb = Column(Integer, nullable=False)
    storage_gb = Column(Integer, nullable=False)
    storage_type = Column(String, nullable=False)  # nvme_ssd, sata_ssd, hdd, none

    # Data Security & Sanitization Audit
    storage_present = Column(Boolean, default=True, nullable=False)
    sanitization_method = Column(String, default=SanitizationMethod.NONE.value, nullable=False)
    sanitization_status = Column(String, default=SanitizationStatus.PENDING.value, nullable=False)
    sanitization_verified = Column(Boolean, default=False, nullable=False)
    verification_reference = Column(String, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    verified_by = Column(String, nullable=True)

    # Condition & Health
    battery_health_percent = Column(Float, nullable=True)
    physical_condition = Column(String, nullable=False)
    functional_status = Column(String, nullable=False)
    known_issues = Column(JSON, default=list, nullable=False)

    # Institutional Metadata & Lifecycle
    department = Column(String, nullable=False)
    location = Column(String, nullable=False)
    lifecycle_state = Column(String, default=AssetLifecycleState.REGISTERED.value, nullable=False, index=True)

    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), onupdate=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)
