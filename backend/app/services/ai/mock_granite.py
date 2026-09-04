from typing import Dict, Any, List
from backend.app.core.enums import (
    CircularPathway,
    DestinationAction,
    DecisionObjective,
    ConfidenceLevel,
    FunctionalStatus,
    PhysicalCondition,
    ComputeTier,
)
from backend.app.schemas.ai import AIAssessmentResult, ScenarioItem, RAGSourceItem
from backend.app.services.ai.base import LLMProvider
from backend.app.services.ai.rag_engine import rag_engine


class MockGraniteProvider(LLMProvider):
    """
    High-fidelity offline IBM Granite circular reasoning & assessment engine.
    Fully integrated with the RAG Knowledge Retrieval Layer and Scenario Engine.
    Respects strict architectural boundaries:
    - Never modifies deterministic calculations or security gates.
    - Assesses conditions and explains scenario rankings based on DecisionObjective.
    """

    def assess_asset(self, context: Dict[str, Any]) -> AIAssessmentResult:
        asset = context["asset"]
        capability = context["capability_profile"]
        economics = context.get("economics", {})
        known_issues = asset.get("known_issues", [])
        functional_status = asset.get("functional_status", "fully_functional")
        physical_condition = asset.get("physical_condition", "grade_a")

        # 1. Condition Assessment
        if functional_status == FunctionalStatus.FULLY_FUNCTIONAL.value:
            cond_text = f"Hardware operates in full functional order. Physical condition is {physical_condition}."
        elif functional_status == FunctionalStatus.MINOR_DEFECT.value:
            cond_text = f"Hardware operational with minor defects: {', '.join(known_issues) if known_issues else 'minor wear'}."
        elif functional_status == FunctionalStatus.MAJOR_FAULT.value:
            cond_text = f"Significant structural or electrical faults: {', '.join(known_issues)}."
        else:
            cond_text = "Severe non-functional failure; primary system board does not boot."

        # 2. Repairability Assessment
        economic_flag = economics.get("economic_viability_flag", "HIGHLY_VIABLE")
        if functional_status == FunctionalStatus.FULLY_FUNCTIONAL.value:
            repairability = "HIGH"
        elif functional_status == FunctionalStatus.MINOR_DEFECT.value:
            repairability = "HIGH" if economic_flag in ("HIGHLY_VIABLE", "MARGINAL") else "MODERATE"
        elif functional_status == FunctionalStatus.MAJOR_FAULT.value:
            repairability = "MODERATE" if economic_flag == "MARGINAL" else "LOW"
        else:
            repairability = "IMPRACTICAL"

        # 3. Repurpose Potential
        if capability.compute_tier in (ComputeTier.PERFORMANCE, ComputeTier.MID):
            repurpose_pot = "HIGH"
        elif capability.compute_tier == ComputeTier.ENTRY:
            repurpose_pot = "HIGH"
        else:
            repurpose_pot = "MODERATE" if functional_status != FunctionalStatus.NON_FUNCTIONAL.value else "LOW"

        # 4. Possible Second-Life Roles
        possible_roles = []
        if capability.compute_tier in (ComputeTier.PERFORMANCE, ComputeTier.MID) and functional_status in (
            FunctionalStatus.FULLY_FUNCTIONAL.value,
            FunctionalStatus.MINOR_DEFECT.value,
        ):
            possible_roles.extend(["coding_workstation", "general_office_workstation"])
        if functional_status != FunctionalStatus.NON_FUNCTIONAL.value:
            possible_roles.extend(["public_kiosk_terminal", "iot_gateway_or_lab_node", "headless_linux_server"])
        if functional_status == FunctionalStatus.NON_FUNCTIONAL.value:
            possible_roles.append("modular_spare_parts_donor")

        confidence = ConfidenceLevel.HIGH if len(known_issues) > 0 else ConfidenceLevel.MEDIUM
        assumptions = [
            "Component diagnostic tests accurately reflect persistent silicon health.",
            "Display panel and logic board connectors remain uncorroded.",
        ]
        uncertainties = [
            "Latent solder micro-fractures under high thermal cycles have not been evaluated with X-ray inspection.",
        ]

        summary = (
            f"Asset {asset.get('asset_id')} assessed as {repairability} repairability with {repurpose_pot} repurposing potential. "
            f"Hardware tier ({capability.compute_tier.value}) supports {len(possible_roles)} viable second-life operational roles."
        )

        return AIAssessmentResult(
            condition_assessment=cond_text,
            repairability=repairability,
            repurpose_potential=repurpose_pot,
            possible_roles=possible_roles,
            reasoning_summary=summary,
            confidence_level=confidence,
            assumptions=assumptions,
            uncertainties=uncertainties,
        )

    def generate_recommendation(self, context: Dict[str, Any]) -> Dict[str, Any]:
        asset = context["asset"]
        capability = context["capability_profile"]
        scenarios: List[ScenarioItem] = context["scenarios"]
        objective: DecisionObjective = context.get("decision_objective", DecisionObjective.BALANCED)
        economics = context.get("economics", {})
        known_issues = asset.get("known_issues", [])

        # 1. RAG Knowledge Retrieval: Query using asset condition & defects
        query_terms = [
            asset.get("device_type", ""),
            asset.get("model", ""),
            "sanitization",
            "sdg12",
        ] + known_issues
        query_str = " ".join(query_terms)
        evidence_sources: List[RAGSourceItem] = rag_engine.retrieve_relevant_knowledge(query=query_str, top_k=3)

        # 2. Select Winning Scenario (Top-ranked by deterministic scenario engine)
        best_scenario = scenarios[0]
        best_pathway = best_scenario.pathway
        destination = best_scenario.destination_action
        score = best_scenario.suitability_score

        # 3. Construct Explainable "Why this recommendation?" Narrative
        obj_name = objective.value.replace("_", " ").title()
        device_label = f"{asset.get('manufacturer', '')} {asset.get('model', 'Asset')} ({asset.get('asset_id', '')})"
        if best_pathway == CircularPathway.DIRECT_REUSE:
            why_text = (
                f"For {device_label}, under the {obj_name} objective, DIRECT REUSE is the highest-ranking circular pathway "
                f"(Suitability Score: {score}/100). The asset has satisfied all data sanitization security gates, "
                f"retains full functional capability, and immediately fulfills institutional demand with zero capital spend."
            )
            key_factors = [
                "Zero repair cost incurred (₹0).",
                f"Prevents ~{best_scenario.estimated_ewaste_diverted_kg} kg of immediate electronic waste.",
                f"Saves ~₹{economics.get('estimated_avoided_cost', 45000):,.0f} in new equipment procurement.",
                "Mandatory data sanitization security gate verified.",
            ]
        elif best_pathway == CircularPathway.REPAIR:
            why_text = (
                f"For {device_label}, under the {obj_name} objective, REPAIR is recommended (Suitability Score: {score}/100). "
                f"Required servicing ({', '.join(known_issues) if known_issues else 'servicing'}) has an estimated cost of "
                f"₹{best_scenario.deterministic_cost:,.0f}, which is highly viable relative to the asset's estimated residual "
                f"value (₹{best_scenario.estimated_residual_value:,.0f}). Servicing extends useful life by ~{best_scenario.useful_life_extension_years} years."
            )
            key_factors = [
                f"Deterministic repair expenditure: ₹{best_scenario.deterministic_cost:,.0f}.",
                f"Life extension: {best_scenario.useful_life_extension_years} years.",
                f"Estimated CO2e avoided: {best_scenario.estimated_co2e_avoided_kg} kg (provisional LCA estimate).",
                f"Economic viability rating: {economics.get('economic_viability_flag', 'HIGHLY_VIABLE')}.",
            ]
        elif best_pathway == CircularPathway.REPURPOSE:
            why_text = (
                f"Under the {obj_name} objective, REPURPOSING into {destination.value} is recommended "
                f"(Suitability Score: {score}/100). The compute architecture is well-suited for dedicated campus "
                f"infrastructure (e.g. IoT edge node, library terminal, or headless server) avoiding expensive workstation overhaul."
            )
            key_factors = [
                "Extracts secondary utility without requiring high-cost cosmetic or workstation repair.",
                f"Extends active operational lifespan by ~{best_scenario.useful_life_extension_years} years.",
                "Fully utilizes existing processing silicon for campus digital infrastructure.",
            ]
        elif best_pathway == CircularPathway.COMPONENT_RECOVERY:
            why_text = (
                f"Under the {obj_name} objective, COMPONENT RECOVERY is recommended (Suitability Score: {score}/100). "
                "The asset chassis or primary board is beyond economical repair, but valuable modular subassemblies "
                "(RAM, solid-state drive) can be harvested for the campus repair inventory before recycling the chassis."
            )
            key_factors = [
                "Salvages critical modular components for internal maintenance pool.",
                "Diverts hazardous elements from immediate disposal.",
                "Inert remaining materials routed to certified e-waste partner.",
            ]
        else:  # RECYCLE
            why_text = (
                f"Under the {obj_name} objective, RECYCLING is the appropriate pathway (Suitability Score: {score}/100). "
                "All higher-level circular reuse, repair, and repurposing options are disqualified due to severe hardware failure. "
                "Material recovery through certified WEEE recycling ensures compliant closed-loop disposal."
            )
            key_factors = [
                "Full compliance with statutory e-waste and environmental disposal standards.",
                "Safe handling of hazardous battery and solder materials.",
            ]

        # 4. Alternatives Considered
        alternatives = []
        for sc in scenarios[1:]:
            alternatives.append(
                {
                    "pathway": sc.pathway,
                    "destination_action": sc.destination_action,
                    "suitability_score": sc.suitability_score,
                    "trade_off_summary": sc.trade_offs,
                }
            )

        assumptions = [
            "Replacement parts and consumables conform to OEM or certified third-party specifications.",
            "Institutional technicians adhere to ESD safe handling and NIST SP 800-88 sanitization protocols.",
            "Environmental metrics are provisional prototype estimates based on literature LCA averages, not measured carbon accounts.",
        ]

        uncertainties = [
            f"Market availability and lead times for {', '.join(known_issues) if known_issues else 'components'}.",
            "Long-term motherboard capacitor aging under continuous campus power fluctuations.",
        ]

        return {
            "recommended_pathway": best_pathway,
            "destination_action": destination,
            "suitability_score": score,
            "confidence_level": ConfidenceLevel.HIGH if len(evidence_sources) > 0 else ConfidenceLevel.MEDIUM,
            "reasons": [
                f"Ranked #1 out of {len(scenarios)} eligible scenarios under {obj_name} weighting.",
                f"Suitability score of {score}/100 outperforms alternative pathways.",
                best_scenario.trade_offs,
            ],
            "key_factors": key_factors,
            "alternatives_considered": alternatives,
            "tradeoffs": best_scenario.trade_offs,
            "assumptions": assumptions,
            "uncertainties": uncertainties,
            "why_this_recommendation": why_text,
            "evidence_sources": [s.model_dump() for s in evidence_sources],
        }
