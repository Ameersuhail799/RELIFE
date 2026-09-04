from pydantic import BaseModel


class PathwayBreakdown(BaseModel):
    direct_reuse: int = 0
    repair: int = 0
    refurbish: int = 0
    repurpose: int = 0
    component_recovery: int = 0
    recycle: int = 0


class ImpactSummaryResponse(BaseModel):
    total_assets_registered: int
    total_assets_assessed: int
    total_assets_eligible_circular: int
    pathway_breakdown: PathwayBreakdown
    total_estimated_purchase_cost_avoided: float
    total_estimated_ewaste_diverted_kg: float
    total_estimated_co2e_avoided_kg: float
    total_estimated_useful_life_extension_years: float
    is_estimate: bool = True
    confidence: str = "PROVISIONAL"
    disclaimer: str = (
        "ESTIMATE ONLY: Aggregated from provisional lifecycle assessment (LCA) "
        "assumptions and not from verified on-site carbon accounting."
    )
    assumptions_version: str
