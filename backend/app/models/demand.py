import datetime
from sqlalchemy import Column, String, Integer, DateTime, JSON
from backend.app.core.database import Base
from backend.app.core.enums import DemandPriority, MobilityRequirement, ComputeTier


class DemandRequest(Base):
    __tablename__ = "demand_requests"

    demand_id = Column(String, primary_key=True, index=True)
    department = Column(String, nullable=False, index=True)
    role = Column(String, nullable=False, index=True)  # e.g. coding_workstation, public_kiosk_terminal
    quantity_needed = Column(Integer, nullable=False)
    quantity_fulfilled = Column(Integer, default=0, nullable=False)
    priority = Column(String, default=DemandPriority.MEDIUM.value, nullable=False, index=True)

    # Multi-dimensional Capability Requirements
    min_compute_tier = Column(String, default=ComputeTier.ENTRY.value, nullable=False)
    min_ram_gb = Column(Integer, default=4, nullable=False)
    min_storage_gb = Column(Integer, default=128, nullable=False)
    preferred_storage_type = Column(String, default="ANY", nullable=False)  # ANY, SSD, NVME_SSD
    required_os = Column(JSON, default=list, nullable=False)  # e.g. ["LINUX", "WINDOWS_11_COMPLIANT"]
    required_mobility = Column(String, default=MobilityRequirement.ANY.value, nullable=False)
    required_display = Column(String, default="ANY", nullable=False)  # ANY, INTERNAL_OR_EXTERNAL, DUAL_EXTERNAL
    required_network = Column(JSON, default=list, nullable=False)  # e.g. ["GIGABIT_ETHERNET"]

    notes = Column(String, default="", nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)

    @property
    def remaining_quantity(self) -> int:
        return max(0, self.quantity_needed - self.quantity_fulfilled)
