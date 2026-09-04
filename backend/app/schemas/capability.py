from typing import List
from pydantic import BaseModel
from backend.app.core.enums import ComputeTier, MobilityProfile


class DeviceCapabilityProfile(BaseModel):
    compute_tier: ComputeTier
    mobility_profile: MobilityProfile
    ram_gb: int
    storage_speed_class: str  # NVME_SSD, SATA_SSD, HDD, NONE
    graphics_capability: str  # INTEGRATED, DISCRETE
    os_compatibility: List[str]  # e.g. ["LINUX", "WINDOWS_11_COMPLIANT", "CHROMEOS_FLEX"]
    display_support: str  # INTERNAL_AND_EXTERNAL, EXTERNAL_ONLY
    network_interfaces: List[str]
    summary: str
