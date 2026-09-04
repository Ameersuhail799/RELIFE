from typing import Dict, Any
from pydantic import BaseModel
from backend.app.core.enums import ConfidenceLevel


class EconomicEvaluation(BaseModel):
    estimated_repair_cost: float
    estimated_residual_value: float
    estimated_avoided_cost: float
    economic_viability_flag: str  # "HIGHLY_VIABLE", "MARGINAL", "NON_VIABLE"
    valuation_type: str = "ESTIMATED_PROTOTYPE_VALUE"
    methodology_notes: str
    calculation_breakdown: Dict[str, Any]


class EnvironmentalEstimate(BaseModel):
    embodied_co2e_kg: float
    ewaste_mass_kg: float
    annual_avoided_co2e_kg: float
    estimated_life_extension_years: float
    total_estimated_co2e_avoided_kg: float
    confidence: ConfidenceLevel
    is_estimate: bool = True
    disclaimer: str = (
        "ESTIMATE ONLY: Derived from provisional lifecycle assessment (LCA) assumptions "
        "and not from verified on-site carbon accounting."
    )
    source_version: str
