import uuid
import datetime
from sqlalchemy.orm import Session

from backend.app.core.enums import (
    AssetLifecycleState,
    CircularPathway,
    DestinationAction,
    DecisionObjective,
    SanitizationStatus,
    SanitizationMethod,
)
from backend.app.core.security_gate import (
    evaluate_security_gate,
    assert_security_gate_for_action,
    SecurityGateViolationError,
)
from backend.app.models.asset import Asset
from backend.app.models.recommendation import PathwayRecommendation
from backend.app.schemas.asset import AssetCreate
from backend.app.schemas.recommendation import (
    EvaluationResponse,
    AlternativeOption,
)
from backend.app.schemas.approval import ApprovalDecisionRequest, ApprovalDecisionResponse
from backend.app.services.capability_service import extract_capability_profile
from backend.app.services.eligibility_service import evaluate_pathway_eligibility
from backend.app.services.economics_engine import evaluate_economics
from backend.app.services.impact_engine import calculate_environmental_impact
from backend.app.services.ai.mock_granite import MockGraniteProvider
from backend.app.services.passport_service import log_passport_event


ai_provider = MockGraniteProvider()


def register_asset(db: Session, asset_in: AssetCreate, actor: str = "system") -> Asset:
    """Creates an asset and logs initial passport event."""
    asset_id = asset_in.asset_id or f"RELIFE-{asset_in.device_type.value[:3].upper()}-{uuid.uuid4().hex[:6].upper()}"

    db_asset = Asset(
        asset_id=asset_id,
        serial_number=asset_in.serial_number,
        device_type=asset_in.device_type.value,
        manufacturer=asset_in.manufacturer,
        model=asset_in.model,
        purchase_year=asset_in.purchase_year,
        cpu_model=asset_in.cpu_model,
        cpu_cores=asset_in.cpu_cores,
        ram_gb=asset_in.ram_gb,
        storage_gb=asset_in.storage_gb,
        storage_type=asset_in.storage_type,
        storage_present=asset_in.storage_present,
        sanitization_method=asset_in.sanitization_method.value,
        sanitization_status=asset_in.sanitization_status.value,
        sanitization_verified=asset_in.sanitization_verified,
        verification_reference=asset_in.verification_reference,
        verified_at=asset_in.verified_at,
        verified_by=asset_in.verified_by,
        battery_health_percent=asset_in.battery_health_percent,
        physical_condition=asset_in.physical_condition.value,
        functional_status=asset_in.functional_status.value,
        known_issues=asset_in.known_issues,
        department=asset_in.department,
        location=asset_in.location,
        lifecycle_state=AssetLifecycleState.REGISTERED.value,
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)

    log_passport_event(
        db=db,
        asset_id=db_asset.asset_id,
        event_type="ASSET_REGISTERED",
        actor=actor,
        details={
            "serial_number": db_asset.serial_number,
            "device": f"{db_asset.manufacturer} {db_asset.model}",
            "lifecycle_state": db_asset.lifecycle_state,
        },
    )

    return db_asset


def evaluate_asset_pathways(
    db: Session,
    asset_id: str,
    objective: DecisionObjective = DecisionObjective.BALANCED,
    actor: str = "system",
) -> EvaluationResponse:
    """
    Executes the full decision-support pipeline for an asset:
    Security Gate -> Capability Profile -> Eligibility Filter -> Economics/Impact -> AI Ranking & Explanation.
    """
    asset = db.query(Asset).filter(Asset.asset_id == asset_id).first()
    if not asset:
        raise ValueError(f"Asset '{asset_id}' not found.")

    # 1. Update lifecycle state: ASSESSING
    asset.lifecycle_state = AssetLifecycleState.ASSESSING.value
    db.commit()

    # 2. Evaluate Deterministic Security Gate
    security_result = evaluate_security_gate(
        storage_present=asset.storage_present,
        sanitization_status=SanitizationStatus(asset.sanitization_status),
        sanitization_verified=asset.sanitization_verified,
        sanitization_method=SanitizationMethod(asset.sanitization_method),
        verification_reference=asset.verification_reference,
    )

    log_passport_event(
        db=db,
        asset_id=asset.asset_id,
        event_type="SECURITY_GATE_EVALUATED",
        actor=actor,
        details=security_result.model_dump(),
    )

    # 3. Extract Capability Profile
    capability_profile = extract_capability_profile(
        device_type=asset.device_type,
        cpu_model=asset.cpu_model,
        cpu_cores=asset.cpu_cores,
        ram_gb=asset.ram_gb,
        storage_type=asset.storage_type,
        battery_health_percent=asset.battery_health_percent,
    )

    # 4. Deterministic Pathway Eligibility Filter
    from backend.app.core.enums import FunctionalStatus, PhysicalCondition
    eligible_pathways, disqualifications = evaluate_pathway_eligibility(
        security_gate=security_result,
        functional_status=FunctionalStatus(asset.functional_status),
        physical_condition=PhysicalCondition(asset.physical_condition),
        storage_present=asset.storage_present,
        storage_type=asset.storage_type,
    )

    # 5. Deterministic Economics Engine
    economics = evaluate_economics(
        device_type=asset.device_type,
        purchase_year=asset.purchase_year,
        physical_condition=PhysicalCondition(asset.physical_condition),
        functional_status=FunctionalStatus(asset.functional_status),
        known_issues=asset.known_issues,
    )

    # 6. Deterministic Impact Estimation Engine
    environmental = calculate_environmental_impact(
        device_type=asset.device_type,
        pathway=eligible_pathways[0] if eligible_pathways else CircularPathway.RECYCLE,
    )

    # 7. Match against Institutional Demands
    from backend.app.models.demand import DemandRequest
    from backend.app.services.demand_matcher import find_matches_for_asset
    from backend.app.services.scenario_engine import build_scenario_comparison
    from backend.app.schemas.ai import RAGSourceItem

    demands = db.query(DemandRequest).all()
    demand_matches = find_matches_for_asset(asset=asset, demands=demands)
    best_match = demand_matches[0] if demand_matches else None
    best_role = best_match.role if best_match and best_match.is_compatible else None
    match_score = best_match.compatibility_score if best_match and best_match.is_compatible else 70.0

    # 8. Scenario Evaluation & Decision Objective Scoring
    scenarios = build_scenario_comparison(
        asset_id=asset.asset_id,
        device_type=asset.device_type,
        eligible_pathways=eligible_pathways,
        economics=economics,
        objective=objective,
        best_demand_role=best_role,
        demand_compatibility_score=match_score,
    )

    # 9. AI Assessment & Structured RAG Reasoning Layer (IBM Granite)
    ai_context = {
        "asset": {
            "asset_id": asset.asset_id,
            "device_type": asset.device_type,
            "manufacturer": asset.manufacturer,
            "model": asset.model,
            "known_issues": asset.known_issues,
            "ram_gb": asset.ram_gb,
            "storage_type": asset.storage_type,
            "functional_status": asset.functional_status,
            "physical_condition": asset.physical_condition,
        },
        "capability_profile": capability_profile,
        "security_gate": security_result,
        "eligible_pathways": eligible_pathways,
        "disqualifications": disqualifications,
        "economics": economics.model_dump(),
        "environmental": environmental,
        "decision_objective": objective,
        "scenarios": scenarios,
    }

    ai_assessment = ai_provider.assess_asset(ai_context)
    ai_context["ai_assessment"] = ai_assessment
    ai_output = ai_provider.generate_recommendation(ai_context)

    # 10. Persist Recommendation to Database
    recommendation_id = f"REC-{uuid.uuid4().hex[:8].upper()}"
    db_rec = PathwayRecommendation(
        recommendation_id=recommendation_id,
        asset_id=asset.asset_id,
        decision_objective=objective.value,
        recommended_pathway=ai_output["recommended_pathway"].value,
        destination_action=ai_output["destination_action"].value,
        suitability_score=ai_output["suitability_score"],
        estimated_repair_cost=economics.estimated_repair_cost,
        estimated_residual_value=economics.estimated_residual_value,
        estimated_avoided_cost=economics.estimated_avoided_cost,
        economic_viability=economics.economic_viability_flag,
        estimated_life_extension_years=environmental.estimated_life_extension_years,
        estimated_ewaste_diverted_kg=environmental.ewaste_mass_kg,
        estimated_co2e_avoided_kg=environmental.total_estimated_co2e_avoided_kg,
        is_estimate=True,
        confidence_level=ai_output["confidence_level"].value,
        reasons=ai_output["reasons"],
        key_factors=ai_output["key_factors"],
        alternatives_considered=ai_output["alternatives_considered"],
        assumptions=ai_output["assumptions"],
        uncertainties=ai_output["uncertainties"],
        why_this_recommendation=ai_output["why_this_recommendation"],
        security_gate_cleared=security_result.direct_reuse_permitted,
        approval_status="PENDING_APPROVAL",
    )
    db.add(db_rec)

    # 11. Update Asset Lifecycle State -> PENDING_DECISION
    asset.lifecycle_state = AssetLifecycleState.PENDING_DECISION.value
    db.commit()

    log_passport_event(
        db=db,
        asset_id=asset.asset_id,
        event_type="RECOMMENDATION_GENERATED",
        actor=actor,
        details={
            "recommendation_id": recommendation_id,
            "recommended_pathway": db_rec.recommended_pathway,
            "destination_action": db_rec.destination_action,
            "confidence": db_rec.confidence_level,
            "suitability_score": db_rec.suitability_score,
            "decision_objective": objective.value,
        },
    )

    alternatives = [
        AlternativeOption(
            pathway=a["pathway"],
            destination_action=a["destination_action"],
            suitability_score=a["suitability_score"],
            trade_off_summary=a["trade_off_summary"],
        )
        for a in ai_output["alternatives_considered"]
    ]

    evidence_items = [
        RAGSourceItem(**s) for s in ai_output.get("evidence_sources", [])
    ]

    return EvaluationResponse(
        recommendation_id=recommendation_id,
        asset_id=asset.asset_id,
        decision_objective=objective,
        security_gate=security_result,
        capability_profile=capability_profile,
        eligible_pathways=eligible_pathways,
        recommended_pathway=ai_output["recommended_pathway"],
        destination_action=ai_output["destination_action"],
        suitability_score=ai_output["suitability_score"],
        economics=economics,
        environmental=environmental,
        ai_assessment=ai_assessment,
        scenario_comparison=scenarios,
        tradeoffs=ai_output.get("tradeoffs"),
        evidence_sources=evidence_items,
        confidence_level=ai_output["confidence_level"],
        reasons=ai_output["reasons"],
        key_factors=ai_output["key_factors"],
        alternatives_considered=alternatives,
        assumptions=ai_output["assumptions"],
        uncertainties=ai_output["uncertainties"],
        why_this_recommendation=ai_output["why_this_recommendation"],
        approval_status="PENDING_APPROVAL",
    )


def process_human_approval(
    db: Session,
    recommendation_id: str,
    approval_in: ApprovalDecisionRequest,
) -> ApprovalDecisionResponse:
    """
    Submits a human approval decision.
    CRITICAL: Validates that an override CANNOT bypass mandatory security gate policies.
    """
    rec = db.query(PathwayRecommendation).filter(PathwayRecommendation.recommendation_id == recommendation_id).first()
    if not rec:
        raise ValueError(f"Recommendation '{recommendation_id}' not found.")

    asset = db.query(Asset).filter(Asset.asset_id == rec.asset_id).first()
    if not asset:
        raise ValueError(f"Asset '{rec.asset_id}' not found.")

    now = datetime.datetime.now(datetime.timezone.utc)
    decision_type = approval_in.decision.upper()

    if decision_type == "APPROVE":
        final_pathway = CircularPathway(rec.recommended_pathway)
        final_destination = DestinationAction(rec.destination_action)

        # Enforce security gate for recommended action
        assert_security_gate_for_action(
            storage_present=asset.storage_present,
            sanitization_verified=asset.sanitization_verified,
            pathway=final_pathway,
            destination_action=final_destination,
        )

        rec.approval_status = "APPROVED"
        rec.approved_by = approval_in.actor
        rec.approval_notes = approval_in.approval_notes
        rec.decided_at = now
        asset.lifecycle_state = AssetLifecycleState.PROCESSING.value

        event_type = "HUMAN_DECISION_APPROVED"

    elif decision_type == "OVERRIDE":
        if not approval_in.chosen_pathway or not approval_in.chosen_destination:
            raise ValueError("Chosen pathway and destination action are required for an OVERRIDE.")

        final_pathway = approval_in.chosen_pathway
        final_destination = approval_in.chosen_destination

        # MANDATORY SECURITY GATE: Human override CANNOT bypass unverified storage block!
        assert_security_gate_for_action(
            storage_present=asset.storage_present,
            sanitization_verified=asset.sanitization_verified,
            pathway=final_pathway,
            destination_action=final_destination,
        )

        rec.approval_status = "OVERRIDDEN"
        rec.approved_by = approval_in.actor
        rec.chosen_pathway_override = final_pathway.value
        rec.chosen_destination_override = final_destination.value
        rec.approval_notes = approval_in.approval_notes
        rec.decided_at = now
        asset.lifecycle_state = AssetLifecycleState.PROCESSING.value

        event_type = "HUMAN_DECISION_OVERRIDDEN"

    elif decision_type == "REJECT":
        final_pathway = CircularPathway(rec.recommended_pathway)
        final_destination = DestinationAction(rec.destination_action)

        rec.approval_status = "REJECTED"
        rec.approved_by = approval_in.actor
        rec.approval_notes = approval_in.approval_notes
        rec.decided_at = now
        asset.lifecycle_state = AssetLifecycleState.PENDING_DECISION.value

        event_type = "HUMAN_DECISION_REJECTED"

    else:
        raise ValueError(f"Invalid decision '{approval_in.decision}'. Must be APPROVE, OVERRIDE, or REJECT.")

    db.commit()

    log_passport_event(
        db=db,
        asset_id=asset.asset_id,
        event_type=event_type,
        actor=approval_in.actor,
        details={
            "decision": decision_type,
            "final_pathway": final_pathway.value,
            "final_destination": final_destination.value,
            "notes": approval_in.approval_notes,
            "new_lifecycle_state": asset.lifecycle_state,
        },
    )

    return ApprovalDecisionResponse(
        recommendation_id=rec.recommendation_id,
        asset_id=asset.asset_id,
        approval_status=rec.approval_status,
        final_pathway=final_pathway,
        final_destination=final_destination,
        decided_at=now,
        decided_by=approval_in.actor,
        new_lifecycle_state=AssetLifecycleState(asset.lifecycle_state),
        notes=approval_in.approval_notes,
    )
