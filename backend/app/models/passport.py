import datetime
from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from backend.app.core.database import Base


class AssetPassportEvent(Base):
    __tablename__ = "asset_passport_events"

    event_id = Column(String, primary_key=True, index=True)
    asset_id = Column(String, ForeignKey("assets.asset_id"), nullable=False, index=True)
    event_type = Column(String, nullable=False)  # ASSET_REGISTERED, SECURITY_GATE_CHECKED, EVALUATED, DECISION_SUBMITTED, etc.
    timestamp = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)
    actor = Column(String, nullable=False)  # "system", "tech_user_id", etc.
    details = Column(JSON, nullable=False)
