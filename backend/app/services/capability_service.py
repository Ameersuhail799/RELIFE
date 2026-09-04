from backend.app.core.enums import ComputeTier, MobilityProfile, DeviceType
from backend.app.schemas.capability import DeviceCapabilityProfile


def extract_capability_profile(
    device_type: str,
    cpu_model: str,
    cpu_cores: int,
    ram_gb: int,
    storage_type: str,
    battery_health_percent: float = None,
) -> DeviceCapabilityProfile:
    """
    Constructs a multi-dimensional capability profile from hardware specifications.
    Avoids crude CPU/RAM only matching by evaluating architecture, mobility, and OS capability.
    """
    # 1. Compute Tier
    cpu_lower = cpu_model.lower()
    if cpu_cores >= 8 or ram_gb >= 16 or "i7" in cpu_lower or "ryzen 7" in cpu_lower:
        compute_tier = ComputeTier.PERFORMANCE
    elif cpu_cores >= 4 and ram_gb >= 8:
        compute_tier = ComputeTier.MID
    elif cpu_cores >= 2 and ram_gb >= 4:
        compute_tier = ComputeTier.ENTRY
    else:
        compute_tier = ComputeTier.LEGACY

    # 2. Mobility Profile
    if device_type.lower() == DeviceType.LAPTOP.value:
        if battery_health_percent is not None and battery_health_percent >= 50.0:
            mobility_profile = MobilityProfile.PORTABLE
        else:
            # Degraded or missing battery turns laptop into a desk-bound workstation
            mobility_profile = MobilityProfile.DESK_BOUND
    else:
        mobility_profile = MobilityProfile.DESK_BOUND

    # 3. Storage Speed Class
    st_lower = storage_type.lower()
    if "nvme" in st_lower:
        storage_speed = "NVME_SSD"
    elif "sata" in st_lower or "ssd" in st_lower:
        storage_speed = "SATA_SSD"
    elif "hdd" in st_lower:
        storage_speed = "HDD"
    else:
        storage_speed = "NONE"

    # 4. OS Compatibility
    os_compat = ["LINUX", "CHROMEOS_FLEX"]
    if ram_gb >= 8 and cpu_cores >= 4 and ("8" in cpu_lower or "9" in cpu_lower or "10" in cpu_lower or "11" in cpu_lower or "12" in cpu_lower or "13" in cpu_lower or "ryzen" in cpu_lower):
        os_compat.append("WINDOWS_11_COMPLIANT")
    if ram_gb >= 4:
        os_compat.append("WINDOWS_10")
    if compute_tier in (ComputeTier.ENTRY, ComputeTier.LEGACY):
        os_compat.append("LIGHTWEIGHT_LINUX")

    # 5. Display Support
    display_support = (
        "INTERNAL_AND_EXTERNAL"
        if device_type.lower() == DeviceType.LAPTOP.value
        else "EXTERNAL_ONLY"
    )

    # 6. Network Interfaces
    network_interfaces = ["GIGABIT_ETHERNET"]
    if device_type.lower() == DeviceType.LAPTOP.value:
        network_interfaces.extend(["WIFI_5_OR_6", "BLUETOOTH"])

    summary = (
        f"{compute_tier.value} tier ({cpu_cores}c/{ram_gb}GB), "
        f"{mobility_profile.value}, {storage_speed} storage, "
        f"supports {', '.join(os_compat[:3])}."
    )

    return DeviceCapabilityProfile(
        compute_tier=compute_tier,
        mobility_profile=mobility_profile,
        ram_gb=ram_gb,
        storage_speed_class=storage_speed,
        graphics_capability="INTEGRATED",
        os_compatibility=os_compat,
        display_support=display_support,
        network_interfaces=network_interfaces,
        summary=summary,
    )
