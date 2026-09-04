import json
from pathlib import Path
from backend.app.core.config import ASSUMPTIONS_PATH
from backend.app.core.enums import DeviceType, ConfidenceLevel, CircularPathway
from backend.app.schemas.economics import EnvironmentalEstimate


def _load_assumptions() -> dict:
    if not ASSUMPTIONS_PATH.exists():
        # Fallback defaults if file missing
        return {
            "version": "1.0.0-fallback",
            "assumptions": {
                "laptop_embodied_co2e_kg": {"value": 280.0},
                "desktop_embodied_co2e_kg": {"value": 350.0},
                "laptop_ewaste_mass_kg": {"value": 2.1},
                "desktop_ewaste_mass_kg": {"value": 7.5},
                "annual_operational_co2e_avoided_kg_per_year": {"value": 45.0},
            },
        }
    with open(ASSUMPTIONS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def calculate_environmental_impact(
    device_type: str,
    pathway: CircularPathway,
) -> EnvironmentalEstimate:
    """
    Computes environmental savings estimates strictly from versioned configuration.
    All returned values are explicitly flagged as PROVISIONAL ESTIMATES.
    """
    config = _load_assumptions()
    assumptions = config.get("assumptions", {})
    version = config.get("version", "1.0.0-provisional")

    is_laptop = device_type.lower() == DeviceType.LAPTOP.value

    # Fetch baseline factors from versioned assumptions
    embodied_key = "laptop_embodied_co2e_kg" if is_laptop else "desktop_embodied_co2e_kg"
    ewaste_key = "laptop_ewaste_mass_kg" if is_laptop else "desktop_ewaste_mass_kg"
    annual_key = "annual_operational_co2e_avoided_kg_per_year"

    embodied_co2e = assumptions.get(embodied_key, {}).get("value", 280.0 if is_laptop else 350.0)
    ewaste_mass = assumptions.get(ewaste_key, {}).get("value", 2.1 if is_laptop else 7.5)
    annual_co2e_rate = assumptions.get(annual_key, {}).get("value", 45.0)

    # Life extension by circular pathway
    if pathway == CircularPathway.DIRECT_REUSE:
        life_extension_years = 3.0
    elif pathway in (CircularPathway.REPAIR, CircularPathway.REFURBISH):
        life_extension_years = 2.5
    elif pathway == CircularPathway.REPURPOSE:
        life_extension_years = 2.0
    elif pathway == CircularPathway.COMPONENT_RECOVERY:
        life_extension_years = 1.0
    else:  # RECYCLE
        life_extension_years = 0.0

    total_co2e_avoided = round(life_extension_years * annual_co2e_rate, 1)

    return EnvironmentalEstimate(
        embodied_co2e_kg=embodied_co2e,
        ewaste_mass_kg=ewaste_mass,
        annual_avoided_co2e_kg=annual_co2e_rate,
        estimated_life_extension_years=life_extension_years,
        total_estimated_co2e_avoided_kg=total_co2e_avoided,
        confidence=ConfidenceLevel.PROVISIONAL,
        is_estimate=True,
        source_version=version,
    )
