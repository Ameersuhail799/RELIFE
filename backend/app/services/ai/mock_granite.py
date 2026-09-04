from typing import Dict, Any, List
from backend.app.core.enums import (
    CircularPathway,
    DestinationAction,
    DecisionObjective,
    ConfidenceLevel,
)
from backend.app.services.ai.base import LLMProvider


class MockGraniteProvider(LLMProvider):
    """
    High-fidelity offline implementation of IBM Granite circular reasoning.
    Adheres strictly to the architectural boundary:
    - Only chooses among pre-filtered ELIGIBLE pathways.
    - Uses deterministic economics as factual constraints.
    - Generates structured, explainable trade-offs.
    """

    def generate_recommendation(self, context: Dict[str, Any]) -> Dict[str, Any]:
        eligible: List[CircularPathway] = context["eligible_pathways"]
        objective: DecisionObjective = context.get("decision_objective", DecisionObjective.BALANCED)
        economics = context["economics"]
        asset = context["asset"]
        capability = context["capability_profile"]
        known_issues = asset.get("known_issues", [])

        # Priority selection among ELIGIBLE pathways based on objective
        if CircularPathway.DIRECT_REUSE in eligible and objective != DecisionObjective.SUSTAINABILITY_FIRST:
            best_pathway = CircularPathway.DIRECT_REUSE
            destination = DestinationAction.INTERNAL_REDEPLOYMENT
            score = 94.0
            reasons = [
                "Device passed all security sanitization checks with verified certificate.",
                "Hardware is in fully functional working order with zero defect flags.",
                "Direct redeployment delivers immediate institutional utility with zero capital expenditure.",
            ]
            key_factors = [
                "Zero repair cost incurred (₹0).",
                f"Saves ~{context['environmental'].ewaste_mass_kg} kg of immediate electronic waste.",
                "High performance capability profile satisfies campus productivity needs.",
            ]
            why_text = (
                f"Asset {asset['asset_id']} is cleared from data sanitization risks and is physically sound. "
                "Direct redeployment yields the highest cost-to-benefit ratio without requiring component replacement."
            )
            confidence = ConfidenceLevel.HIGH

        elif CircularPathway.REPAIR in eligible and economics["economic_viability_flag"] in ("HIGHLY_VIABLE", "MARGINAL"):
            best_pathway = CircularPathway.REPAIR
            destination = DestinationAction.INTERNAL_REDEPLOYMENT
            score = 88.5 if objective in (DecisionObjective.BALANCED, DecisionObjective.SUSTAINABILITY_FIRST) else 82.0
            reasons = [
                f"Economic viability is rated {economics['economic_viability_flag']}: "
                f"estimated repair cost (₹{economics['estimated_repair_cost']:,.0f}) is only "
                f"{economics['calculation_breakdown']['repair_to_residual_ratio'] * 100:.0f}% of residual value (₹{economics['estimated_residual_value']:,.0f}).",
                f"Extends useful working life by ~{context['environmental'].estimated_life_extension_years} years.",
                "Avoids purchasing a new equivalent enterprise machine (saving ~₹45,000).",
            ]
            key_factors = [
                f"Identified defect(s): {', '.join(known_issues) if known_issues else 'general wear'}.",
                f"Estimated repair expenditure: ₹{economics['estimated_repair_cost']:,.0f}.",
                f"Estimated CO2e avoided: {context['environmental'].total_estimated_co2e_avoided_kg} kg (provisional estimate).",
            ]
            why_text = (
                f"Repair is strongly recommended for {asset['asset_id']} because the required servicing "
                f"({', '.join(economics['calculation_breakdown']['matched_repairs'])}) is economically sound "
                f"relative to its estimated residual value (₹{economics['estimated_residual_value']:,.0f}), "
                f"preventing premature disposal and yielding an estimated {context['environmental'].estimated_life_extension_years} years of further utility."
            )
            confidence = ConfidenceLevel.HIGH if len(known_issues) > 0 else ConfidenceLevel.MEDIUM

        elif CircularPathway.REPURPOSE in eligible:
            best_pathway = CircularPathway.REPURPOSE
            destination = DestinationAction.LAB_DEPLOYMENT
            score = 79.0
            reasons = [
                "Primary workstation repair is either economically unviable or device compute tier is better suited for dedicated roles.",
                f"Hardware capability ({capability.compute_tier.value}) is ideal for lightweight Linux headless services, campus kiosks, or IoT edge nodes.",
                "Zero repair cost needed if redeployed as a stationary server or dedicated appliance.",
            ]
            key_factors = [
                "Repurposing extends lifecycle by ~2.0 years without new component procurement.",
                "Eliminates reliance on battery runtime by utilizing desk-bound infrastructure.",
            ]
            why_text = (
                f"Asset {asset['asset_id']} is recommended for Repurposing into a {destination.value}. "
                "This extracts high utility from functioning compute hardware while circumventing expensive workstation repairs."
            )
            confidence = ConfidenceLevel.MEDIUM

        elif CircularPathway.COMPONENT_RECOVERY in eligible:
            best_pathway = CircularPathway.COMPONENT_RECOVERY
            destination = DestinationAction.COMPONENT_HARVEST
            score = 72.0
            reasons = [
                "Device chassis or mainboard is beyond economical repair, but valuable modular subcomponents remain salvageable.",
                f"Modular parts (e.g. {asset['ram_gb']}GB RAM, {asset['storage_type']} drive) can be harvested for the institutional spare-parts pool.",
            ]
            key_factors = [
                "High harvest value for internal repair operations.",
                "Remaining non-functional chassis routed to certified e-waste recycler.",
            ]
            why_text = (
                f"Component recovery is the optimal path for {asset['asset_id']} to harvest functional "
                "modular assemblies (RAM/storage) before sending inert structural materials for recycling."
            )
            confidence = ConfidenceLevel.HIGH

        else:
            best_pathway = CircularPathway.RECYCLE
            destination = DestinationAction.CERTIFIED_RECYCLER
            score = 65.0
            reasons = [
                "No viable higher circular recovery pathways passed the eligibility and safety filters.",
                "Device has reached end of serviceable life and requires compliant WEEE recycling.",
            ]
            key_factors = [
                "Environmentally responsible material recovery by authorized recyclers.",
                "Permanent disposal of hazardous materials.",
            ]
            why_text = (
                f"Recycling is recommended for {asset['asset_id']} as all higher circular pathways are disqualified "
                "due to severe defects or complete hardware obsolescence."
            )
            confidence = ConfidenceLevel.HIGH

        # Construct alternatives considered from remaining eligible pathways
        alternatives = []
        for p in eligible:
            if p != best_pathway:
                if p == CircularPathway.REPURPOSE:
                    alternatives.append({
                        "pathway": p,
                        "destination_action": DestinationAction.LAB_DEPLOYMENT,
                        "suitability_score": 75.0,
                        "trade_off_summary": "Viable alternative as a lightweight lab server, but yields lower user satisfaction than primary workstation repair.",
                    })
                elif p == CircularPathway.COMPONENT_RECOVERY:
                    alternatives.append({
                        "pathway": p,
                        "destination_action": DestinationAction.COMPONENT_HARVEST,
                        "suitability_score": 68.0,
                        "trade_off_summary": "Salvages modular RAM and storage, but sacrifices potential whole-device life extension.",
                    })
                elif p == CircularPathway.RECYCLE:
                    alternatives.append({
                        "pathway": p,
                        "destination_action": DestinationAction.CERTIFIED_RECYCLER,
                        "suitability_score": 50.0,
                        "trade_off_summary": "Baseline fallback; complies with environmental disposal but foregoes economic reuse value.",
                    })

        assumptions = [
            "Replacement parts (e.g. keyboards, batteries) are available from verified OEM or authorized third-party supply channels.",
            "Institutional technicians have standard anti-static toolkits and test benches for hardware servicing.",
            "Environmental metrics are provisional prototype estimates based on literature LCA averages, not measured carbon accounts.",
        ]

        uncertainties = [
            "Motherboard stress-testing under prolonged thermal load has not been verified.",
            "Actual market salvage value may fluctuate depending on local e-waste vendor procurement agreements.",
        ]

        return {
            "recommended_pathway": best_pathway,
            "destination_action": destination,
            "suitability_score": score,
            "confidence_level": confidence,
            "reasons": reasons,
            "key_factors": key_factors,
            "alternatives_considered": alternatives,
            "assumptions": assumptions,
            "uncertainties": uncertainties,
            "why_this_recommendation": why_text,
        }
