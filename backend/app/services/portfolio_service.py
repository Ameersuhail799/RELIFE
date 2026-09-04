import json
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.app.core.config import DATA_DIR, ASSUMPTIONS_PATH
from backend.app.core.enums import (
    AssetLifecycleState,
    CircularPathway,
    SanitizationMethod,
    SanitizationStatus,
    PhysicalCondition,
    FunctionalStatus,
    DemandPriority,
    MobilityRequirement,
    ComputeTier,
)
from backend.app.models.asset import Asset
from backend.app.models.demand import DemandRequest
from backend.app.models.recommendation import PathwayRecommendation
from backend.app.schemas.impact import ImpactSummaryResponse, PathwayBreakdown
from backend.app.services.passport_service import log_passport_event


def seed_simulated_data(db: Session) -> dict:
    """
    Seeds the realistic simulated university IT dataset and institutional demands.
    Clearly marks all ingested records as simulated data.
    """
    assets_file = DATA_DIR / "simulated_assets.json"
    demand_file = DATA_DIR / "simulated_demand.json"

    assets_created = 0
    demands_created = 0

    # 1. Seed Assets
    if assets_file.exists():
        with open(assets_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            assets_list = data.get("assets", [])

        for item in assets_list:
            existing = db.query(Asset).filter(Asset.serial_number == item["serial_number"]).first()
            if not existing:
                db_asset = Asset(
                    asset_id=item["asset_id"],
                    serial_number=item["serial_number"],
                    device_type=item["device_type"],
                    manufacturer=item["manufacturer"],
                    model=item["model"],
                    purchase_year=item["purchase_year"],
                    cpu_model=item["cpu_model"],
                    cpu_cores=item["cpu_cores"],
                    ram_gb=item["ram_gb"],
                    storage_gb=item["storage_gb"],
                    storage_type=item["storage_type"],
                    storage_present=item.get("storage_present", True),
                    sanitization_method=item.get("sanitization_method", SanitizationMethod.NONE.value),
                    sanitization_status=item.get("sanitization_status", SanitizationStatus.PENDING.value),
                    sanitization_verified=item.get("sanitization_verified", False),
                    verification_reference=item.get("verification_reference"),
                    verified_by=item.get("verified_by"),
                    battery_health_percent=item.get("battery_health_percent"),
                    physical_condition=item["physical_condition"],
                    functional_status=item["functional_status"],
                    known_issues=item.get("known_issues", []),
                    department=item["department"],
                    location=item["location"],
                    lifecycle_state=AssetLifecycleState.REGISTERED.value,
                )
                db.add(db_asset)
                assets_created += 1

                log_passport_event(
                    db=db,
                    asset_id=db_asset.asset_id,
                    event_type="ASSET_REGISTERED",
                    actor="seeder_script",
                    details={
                        "tag": "[SIMULATED DATASET]",
                        "serial_number": db_asset.serial_number,
                        "device": f"{db_asset.manufacturer} {db_asset.model}",
                    },
                )
        db.commit()

    # 2. Seed Institutional Demands
    if demand_file.exists():
        with open(demand_file, "r", encoding="utf-8") as f:
            d_data = json.load(f)
            demands_list = d_data.get("demands", [])

        for d in demands_list:
            existing_d = db.query(DemandRequest).filter(DemandRequest.demand_id == d["demand_id"]).first()
            if not existing_d:
                db_demand = DemandRequest(
                    demand_id=d["demand_id"],
                    department=d["department"],
                    role=d["role"],
                    quantity_needed=d["quantity_needed"],
                    quantity_fulfilled=d.get("quantity_fulfilled", 0),
                    priority=d.get("priority", DemandPriority.MEDIUM.value),
                    min_compute_tier=d.get("min_compute_tier", ComputeTier.ENTRY.value),
                    min_ram_gb=d.get("min_ram_gb", 4),
                    min_storage_gb=d.get("min_storage_gb", 128),
                    preferred_storage_type=d.get("preferred_storage_type", "ANY"),
                    required_os=d.get("required_os", []),
                    required_mobility=d.get("required_mobility", MobilityRequirement.ANY.value),
                    required_display=d.get("required_display", "ANY"),
                    required_network=d.get("required_network", []),
                    notes=d.get("notes", ""),
                )
                db.add(db_demand)
                demands_created += 1
        db.commit()

    return {
        "status": "success",
        "dataset_tag": "[SIMULATED DATASET]",
        "assets_seeded": assets_created,
        "demands_seeded": demands_created,
        "total_assets_in_db": db.query(Asset).count(),
        "total_demands_in_db": db.query(DemandRequest).count(),
    }


def get_portfolio_impact_summary(db: Session) -> ImpactSummaryResponse:
    """
    Calculates aggregated portfolio environmental and economic metrics across all assessed assets.
    Strictly flags all metrics as provisional estimates.
    """
    total_assets = db.query(Asset).count()
    recommendations = db.query(PathwayRecommendation).all()
    total_assessed = len(recommendations)

    breakdown = PathwayBreakdown()
    total_avoided_cost = 0.0
    total_ewaste = 0.0
    total_co2e = 0.0
    total_life_years = 0.0
    eligible_circular_count = 0

    for rec in recommendations:
        pathway = rec.recommended_pathway

        if pathway == CircularPathway.DIRECT_REUSE.value:
            breakdown.direct_reuse += 1
            eligible_circular_count += 1
        elif pathway == CircularPathway.REPAIR.value:
            breakdown.repair += 1
            eligible_circular_count += 1
        elif pathway == CircularPathway.REFURBISH.value:
            breakdown.refurbish += 1
            eligible_circular_count += 1
        elif pathway == CircularPathway.REPURPOSE.value:
            breakdown.repurpose += 1
            eligible_circular_count += 1
        elif pathway == CircularPathway.COMPONENT_RECOVERY.value:
            breakdown.component_recovery += 1
            eligible_circular_count += 1
        elif pathway == CircularPathway.RECYCLE.value:
            breakdown.recycle += 1

        total_avoided_cost += rec.estimated_avoided_cost or 0.0
        total_ewaste += rec.estimated_ewaste_diverted_kg or 0.0
        total_co2e += rec.estimated_co2e_avoided_kg or 0.0
        total_life_years += rec.estimated_life_extension_years or 0.0

    # Load version string from assumptions file
    version = "1.0.0-provisional"
    if ASSUMPTIONS_PATH.exists():
        try:
            with open(ASSUMPTIONS_PATH, "r", encoding="utf-8") as f:
                cfg = json.load(f)
                version = cfg.get("version", version)
        except Exception:
            pass

    return ImpactSummaryResponse(
        total_assets_registered=total_assets,
        total_assets_assessed=total_assessed,
        total_assets_eligible_circular=eligible_circular_count,
        pathway_breakdown=breakdown,
        total_estimated_purchase_cost_avoided=round(total_avoided_cost, 2),
        total_estimated_ewaste_diverted_kg=round(total_ewaste, 2),
        total_estimated_co2e_avoided_kg=round(total_co2e, 2),
        total_estimated_useful_life_extension_years=round(total_life_years, 1),
        is_estimate=True,
        confidence="PROVISIONAL",
        disclaimer=(
            "ESTIMATE ONLY: Aggregated from provisional lifecycle assessment (LCA) "
            "assumptions and not from verified on-site carbon accounting."
        ),
        assumptions_version=version,
    )
