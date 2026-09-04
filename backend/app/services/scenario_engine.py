from typing import List, Dict, Any, Optional
from backend.app.core.enums import (
    CircularPathway,
    DestinationAction,
    DecisionObjective,
)
from backend.app.schemas.ai import ScenarioItem
from backend.app.schemas.economics import EconomicEvaluation, EnvironmentalEstimate
from backend.app.services.impact_engine import calculate_environmental_impact

OBJECTIVE_WEIGHTS = {
    DecisionObjective.BALANCED: {
        "cost": 0.30,
        "sustainability": 0.30,
        "demand": 0.25,
        "readiness": 0.15,
    },
    DecisionObjective.SUSTAINABILITY_FIRST: {
        "cost": 0.15,
        "sustainability": 0.55,
        "demand": 0.20,
        "readiness": 0.10,
    },
    DecisionObjective.COST_FIRST: {
        "cost": 0.60,
        "sustainability": 0.10,
        "demand": 0.10,
        "readiness": 0.20,
    },
    DecisionObjective.UTILIZATION_FIRST: {
        "cost": 0.15,
        "sustainability": 0.10,
        "demand": 0.50,
        "readiness": 0.25,
    },
}

PATHWAY_DESTINATIONS = {
    CircularPathway.DIRECT_REUSE: DestinationAction.INTERNAL_REDEPLOYMENT,
    CircularPathway.REPAIR: DestinationAction.INTERNAL_REDEPLOYMENT,
    CircularPathway.REFURBISH: DestinationAction.INTERNAL_REDEPLOYMENT,
    CircularPathway.REPURPOSE: DestinationAction.LAB_DEPLOYMENT,
    CircularPathway.COMPONENT_RECOVERY: DestinationAction.COMPONENT_HARVEST,
    CircularPathway.RECYCLE: DestinationAction.CERTIFIED_RECYCLER,
}


def build_scenario_comparison(
    asset_id: str,
    device_type: str,
    eligible_pathways: List[CircularPathway],
    economics: EconomicEvaluation,
    objective: DecisionObjective = DecisionObjective.BALANCED,
    best_demand_role: Optional[str] = None,
    demand_compatibility_score: float = 70.0,
) -> List[ScenarioItem]:
    """
    Evaluates every eligible circular pathway as a distinct scenario.
    Calculates explicit deterministic suitability scores driven by the chosen DecisionObjective.
    """
    weights = OBJECTIVE_WEIGHTS.get(objective, OBJECTIVE_WEIGHTS[DecisionObjective.BALANCED])
    scenarios: List[ScenarioItem] = []

    for pathway in eligible_pathways:
        dest_action = PATHWAY_DESTINATIONS.get(pathway, DestinationAction.INTERNAL_REDEPLOYMENT)
        env = calculate_environmental_impact(device_type=device_type, pathway=pathway)

        # 1. Deterministic Cost & Economic Normalized Score (0.0 to 1.0)
        if pathway == CircularPathway.DIRECT_REUSE:
            cost = 0.0
            norm_cost = 1.0  # Zero spend
            readiness = 1.0
            trade_offs = "Maximizes return on investment with zero expenditure; relies on existing hardware specs."
            risks = ["Hardware will retain current wear level; no warranty renewal."]
        elif pathway == CircularPathway.REPAIR:
            cost = economics.estimated_repair_cost
            norm_cost = max(0.10, 1.0 - (cost / economics.estimated_avoided_cost))
            readiness = 0.75
            trade_offs = f"Incurs ₹{cost:,.0f} servicing expenditure, but yields ~{env.estimated_life_extension_years} years extended service life."
            risks = ["Component availability delays", "Technician servicing labor required"]
        elif pathway == CircularPathway.REFURBISH:
            cost = economics.estimated_repair_cost + 2000.0  # Upgrade cost factor
            norm_cost = max(0.10, 1.0 - (cost / economics.estimated_avoided_cost))
            readiness = 0.70
            trade_offs = "Upgrades memory/storage performance; higher upfront cost than minor repair."
            risks = ["Marginal benefit if base processor architecture is older than 6 years"]
        elif pathway == CircularPathway.REPURPOSE:
            cost = 500.0  # Setup / re-imaging overhead
            norm_cost = 0.95
            readiness = 0.85
            trade_offs = "Re-allocates hardware into dedicated infrastructure (Linux/kiosk); forfeits primary personal workstation role."
            risks = ["Lower user prestige compared to new equipment; dedicated role dependency"]
        elif pathway == CircularPathway.COMPONENT_RECOVERY:
            cost = 300.0  # Teardown labor
            norm_cost = 0.90
            readiness = 0.60
            trade_offs = "Harvests functional modular parts (RAM, SSD) to support other repairs; destroys whole-unit utility."
            risks = ["Salvaged parts must be tested before integration into inventory pool"]
        else:  # RECYCLE
            cost = 0.0
            norm_cost = 0.80
            readiness = 0.90
            trade_offs = "Complies with statutory WEEE environmental recycling; forfeits all residual economic utility."
            risks = ["Permanent material destruction; irreversible decision"]

        # 2. Sustainability Normalized Score (0.0 to 1.0)
        norm_sustain = min(1.0, env.estimated_life_extension_years / 3.0)

        # 3. Demand Match Score (0.0 to 1.0)
        if pathway in (CircularPathway.DIRECT_REUSE, CircularPathway.REPAIR, CircularPathway.REFURBISH):
            norm_demand = demand_compatibility_score / 100.0
            match_str = best_demand_role or "Internal Campus Units"
        elif pathway == CircularPathway.REPURPOSE:
            norm_demand = 0.80
            match_str = "IoT / Campus Lab Infrastructure"
        elif pathway == CircularPathway.COMPONENT_RECOVERY:
            norm_demand = 0.60
            match_str = "Institutional Spare Parts Pool"
        else:
            norm_demand = 0.30
            match_str = "Authorized WEEE Recycler"

        # 4. Multi-Attribute Suitability Calculation
        composite_score = (
            (weights["cost"] * norm_cost)
            + (weights["sustainability"] * norm_sustain)
            + (weights["demand"] * norm_demand)
            + (weights["readiness"] * readiness)
        ) * 100.0

        suitability_score = round(max(10.0, min(99.0, composite_score)), 1)

        scenarios.append(
            ScenarioItem(
                pathway=pathway,
                destination_action=dest_action,
                is_eligible=True,
                suitability_score=suitability_score,
                deterministic_cost=cost,
                estimated_residual_value=economics.estimated_residual_value,
                demand_match=match_str,
                useful_life_extension_years=env.estimated_life_extension_years,
                estimated_co2e_avoided_kg=env.total_estimated_co2e_avoided_kg,
                estimated_ewaste_diverted_kg=env.ewaste_mass_kg,
                trade_offs=trade_offs,
                risks_and_uncertainties=risks,
            )
        )

    # Sort scenarios strictly by suitability score descending
    scenarios.sort(key=lambda s: s.suitability_score, reverse=True)
    return scenarios
