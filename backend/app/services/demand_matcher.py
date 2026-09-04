from typing import List, Tuple, Dict, Any
from backend.app.core.enums import (
    ComputeTier,
    MobilityProfile,
    MobilityRequirement,
    DemandPriority,
    FunctionalStatus,
    PhysicalCondition,
    SanitizationStatus,
    SanitizationMethod,
)
from backend.app.core.security_gate import evaluate_security_gate
from backend.app.models.asset import Asset
from backend.app.models.demand import DemandRequest
from backend.app.schemas.demand import DemandMatchItem
from backend.app.services.capability_service import extract_capability_profile
from backend.app.services.eligibility_service import evaluate_pathway_eligibility

TIER_RANKS = {
    ComputeTier.LEGACY: 1,
    ComputeTier.ENTRY: 2,
    ComputeTier.MID: 3,
    ComputeTier.PERFORMANCE: 4,
}

PRIORITY_RANKS = {
    DemandPriority.CRITICAL: 4,
    DemandPriority.HIGH: 3,
    DemandPriority.MEDIUM: 2,
    DemandPriority.LOW: 1,
}


def evaluate_asset_against_demand(
    asset: Asset,
    demand: DemandRequest,
) -> DemandMatchItem:
    """
    Evaluates an asset against a specific institutional demand using multi-dimensional
    capabilities (compute tier, RAM, storage, mobility, OS, network) and enforces
    security gate and pathway eligibility rules.
    """
    capability = extract_capability_profile(
        device_type=asset.device_type,
        cpu_model=asset.cpu_model,
        cpu_cores=asset.cpu_cores,
        ram_gb=asset.ram_gb,
        storage_type=asset.storage_type,
        battery_health_percent=asset.battery_health_percent,
    )

    reasons: List[str] = []
    unmet: List[str] = []
    score = 100.0

    # 1. Compute Tier Evaluation
    demand_tier_val = demand.min_compute_tier or ComputeTier.ENTRY.value
    demand_tier = ComputeTier(demand_tier_val)
    asset_tier = capability.compute_tier
    if TIER_RANKS[asset_tier] < TIER_RANKS[demand_tier]:
        unmet.append(
            f"Insufficient compute tier: asset has '{asset_tier.value}', demand requires at least '{demand_tier.value}'."
        )
        score -= 30.0
    else:
        tier_diff = TIER_RANKS[asset_tier] - TIER_RANKS[demand_tier]
        if tier_diff > 0:
            reasons.append(f"Exceeds compute tier: '{asset_tier.value}' (minimum required '{demand_tier.value}').")
        else:
            reasons.append(f"Satisfies compute tier: '{asset_tier.value}'.")

    # 2. RAM Evaluation
    if asset.ram_gb < demand.min_ram_gb:
        unmet.append(f"Insufficient RAM: asset has {asset.ram_gb}GB, demand requires at least {demand.min_ram_gb}GB.")
        score -= 25.0
    else:
        if asset.ram_gb > demand.min_ram_gb:
            reasons.append(f"Generous memory: {asset.ram_gb}GB RAM exceeds {demand.min_ram_gb}GB minimum requirement.")
        else:
            reasons.append(f"Memory: {asset.ram_gb}GB RAM matches requirement.")

    # 3. Storage Capacity
    if asset.storage_gb < demand.min_storage_gb:
        unmet.append(
            f"Insufficient storage: asset has {asset.storage_gb}GB, demand requires at least {demand.min_storage_gb}GB."
        )
        score -= 20.0
    else:
        reasons.append(f"Storage capacity: {asset.storage_gb}GB satisfies {demand.min_storage_gb}GB minimum.")

    # 4. Storage Type Preference
    storage_class = capability.storage_speed_class
    if demand.preferred_storage_type in ("SSD", "NVME_SSD"):
        if storage_class in ("NVME_SSD", "SATA_SSD"):
            reasons.append(f"Fast storage: {storage_class} aligns with preferred SSD requirement.")
        elif storage_class == "HDD":
            # For fast roles, HDD is penalized
            if demand.role in ("coding_workstation", "general_office_workstation"):
                unmet.append("Mechanical HDD storage does not meet preferred solid-state (SSD) speed requirements.")
                score -= 15.0
            else:
                score -= 5.0
                reasons.append(f"Usable storage: {storage_class} present, though SSD was preferred.")

    # 5. Mobility Constraint Evaluation
    req_mobility_val = demand.required_mobility or MobilityRequirement.ANY.value
    req_mobility = MobilityRequirement(req_mobility_val)
    asset_mobility = capability.mobility_profile

    if req_mobility == MobilityRequirement.PORTABLE:
        if asset_mobility != MobilityProfile.PORTABLE:
            unmet.append(
                "Mobility mismatch: demand requires PORTABLE laptop with functional battery, but asset is DESK_BOUND."
            )
            score -= 30.0
        else:
            reasons.append(f"Mobile ready: Functional battery ({asset.battery_health_percent}%) satisfies portable requirement.")
    elif req_mobility in (MobilityRequirement.DESK_BOUND_OK, MobilityRequirement.STATIONARY_ONLY, MobilityRequirement.ANY):
        if asset_mobility == MobilityProfile.DESK_BOUND:
            reasons.append("Desk-bound form factor is suitable for this fixed terminal or lab station.")
        else:
            reasons.append("Form factor is fully compatible.")

    # 6. Operating System Compatibility
    if demand.required_os:
        matching_os = [os for os in demand.required_os if os in capability.os_compatibility]
        if not matching_os:
            unmet.append(
                f"OS incompatibility: Asset compatible with {capability.os_compatibility}, but demand requires one of {demand.required_os}."
            )
            score -= 20.0
        else:
            reasons.append(f"OS compatible: Supports required target environment ({', '.join(matching_os)}).")

    # 7. Security Gate & Pathway Eligibility Evaluation
    sec_gate = evaluate_security_gate(
        storage_present=asset.storage_present,
        sanitization_status=SanitizationStatus(asset.sanitization_status),
        sanitization_verified=asset.sanitization_verified,
        sanitization_method=SanitizationMethod(asset.sanitization_method),
        verification_reference=asset.verification_reference,
    )

    eligible_pathways, _ = evaluate_pathway_eligibility(
        security_gate=sec_gate,
        functional_status=FunctionalStatus(asset.functional_status),
        physical_condition=PhysicalCondition(asset.physical_condition),
        storage_present=asset.storage_present,
        storage_type=asset.storage_type,
    )

    # Determine security & eligibility status
    if not sec_gate.direct_reuse_permitted:
        sec_status = "SECURITY_BLOCKED_UNVERIFIED_STORAGE"
        recommended_action = "Requires disk sanitization and technician verification before deployment."
        score -= 10.0  # Minor score adjustment reflecting setup work needed
        unmet_warning = "Direct redeployment blocked by security gate until drive is wiped and verified."
        if unmet_warning not in unmet:
            unmet.append(unmet_warning)
    elif asset.functional_status != FunctionalStatus.FULLY_FUNCTIONAL.value:
        sec_status = "REQUIRES_REPAIR_BEFORE_DEPLOYMENT"
        recommended_action = f"Requires servicing of known defects ({', '.join(asset.known_issues)}) prior to lab assignment."
        score -= 10.0
    else:
        sec_status = "CLEARED_FOR_IMMEDIATE_REDEPLOYMENT"
        recommended_action = "Eligible for immediate allocation and internal redeployment."
        reasons.append("Security Gate CLEARED: Data sanitization verified; hardware fully functional.")

    # Bound score between 0 and 100
    compatibility_score = max(0.0, min(100.0, score))
    is_compatible = len(unmet) == 0 or (len(unmet) == 1 and "Direct redeployment blocked" in unmet[0])

    priority_val = demand.priority or DemandPriority.MEDIUM.value
    return DemandMatchItem(
        demand_id=demand.demand_id,
        department=demand.department,
        role=demand.role,
        priority=DemandPriority(priority_val),
        compatibility_score=round(compatibility_score, 1),
        is_compatible=is_compatible and compatibility_score >= 60.0,
        reasons=reasons,
        unmet_requirements=unmet,
        security_eligibility_status=sec_status,
        recommended_action=recommended_action,
    )


def find_matches_for_asset(
    asset: Asset,
    demands: List[DemandRequest],
) -> List[DemandMatchItem]:
    """
    Evaluates an asset against all active institutional demands and ranks matches
    by priority and compatibility score.
    """
    matches = []
    for demand in demands:
        match_item = evaluate_asset_against_demand(asset, demand)
        matches.append(match_item)

    # Sort matches: Priority first (CRITICAL > HIGH > MEDIUM > LOW), then compatibility score descending
    matches.sort(
        key=lambda m: (
            1 if m.is_compatible else 0,
            PRIORITY_RANKS[m.priority],
            m.compatibility_score,
        ),
        reverse=True,
    )
    return matches
