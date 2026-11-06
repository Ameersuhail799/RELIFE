import pytest
from fastapi import status
from backend.app.core.enums import (
    DemandPriority,
    MobilityRequirement,
    ComputeTier,
    SanitizationStatus,
    SanitizationMethod,
)
from backend.app.models.asset import Asset
from backend.app.models.demand import DemandRequest
from backend.app.services.demand_matcher import evaluate_asset_against_demand, find_matches_for_asset
from backend.app.services.portfolio_service import seed_simulated_data, get_portfolio_impact_summary


def test_1_valid_capability_match(db):
    """Test 1: Asset with sufficient specs gets a high compatibility score for a demanding role."""
    asset = Asset(
        asset_id="TEST-LAP-01",
        serial_number="SN-TEST-01",
        device_type="laptop",
        manufacturer="Dell",
        model="Latitude 7400",
        purchase_year=2021,
        cpu_model="Intel Core i7-8665U",
        cpu_cores=4,
        ram_gb=16,
        storage_gb=512,
        storage_type="nvme_ssd",
        storage_present=True,
        sanitization_method=SanitizationMethod.CRYPTO_ERASE.value,
        sanitization_status=SanitizationStatus.COMPLETED.value,
        sanitization_verified=True,
        battery_health_percent=85.0,
        physical_condition="grade_a",
        functional_status="fully_functional",
        known_issues=[],
        department="CS",
        location="Lab 1",
    )
    demand = DemandRequest(
        demand_id="DEMAND-CSE",
        department="Computer Science",
        role="coding_workstation",
        quantity_needed=5,
        priority=DemandPriority.CRITICAL.value,
        min_compute_tier=ComputeTier.MID.value,
        min_ram_gb=8,
        min_storage_gb=256,
        preferred_storage_type="SSD",
        required_os=["LINUX", "WINDOWS_11_COMPLIANT"],
        required_mobility=MobilityRequirement.ANY.value,
    )
    match = evaluate_asset_against_demand(asset, demand)
    assert match.is_compatible is True
    assert match.compatibility_score >= 85.0
    assert len(match.unmet_requirements) == 0
    assert match.security_eligibility_status == "CLEARED_FOR_IMMEDIATE_REDEPLOYMENT"


def test_2_insufficient_capability(db):
    """Test 2: Asset failing RAM and compute tier minimums is flagged with unmet requirements."""
    asset = Asset(
        asset_id="TEST-LAP-02",
        serial_number="SN-TEST-02",
        device_type="laptop",
        manufacturer="HP",
        model="Stream 11",
        purchase_year=2017,
        cpu_model="Intel Celeron N4000",
        cpu_cores=2,
        ram_gb=4,
        storage_gb=64,
        storage_type="emmc",
        storage_present=True,
        sanitization_method=SanitizationMethod.OVERWRITE_SINGLE_PASS.value,
        sanitization_status=SanitizationStatus.COMPLETED.value,
        sanitization_verified=True,
        battery_health_percent=90.0,
        physical_condition="grade_b",
        functional_status="fully_functional",
        known_issues=[],
        department="General",
        location="Rm 10",
    )
    demand = DemandRequest(
        demand_id="DEMAND-CSE-HEAVY",
        department="Computer Science",
        role="coding_workstation",
        quantity_needed=5,
        priority=DemandPriority.CRITICAL.value,
        min_compute_tier=ComputeTier.MID.value,
        min_ram_gb=16,
        min_storage_gb=256,
        preferred_storage_type="SSD",
        required_os=["WINDOWS_11_COMPLIANT"],
        required_mobility=MobilityRequirement.ANY.value,
    )
    match = evaluate_asset_against_demand(asset, demand)
    assert match.is_compatible is False
    assert any("Insufficient RAM" in u for u in match.unmet_requirements)
    assert any("Insufficient compute tier" in u for u in match.unmet_requirements)
    assert match.compatibility_score < 60.0


def test_3_role_specific_matching(db):
    """Test 3: Lower-tier or legacy hardware matches IoT gateway or basic kiosk role."""
    asset = Asset(
        asset_id="TEST-DESK-03",
        serial_number="SN-TEST-03",
        device_type="desktop",
        manufacturer="Lenovo",
        model="ThinkCentre M700 Tiny",
        purchase_year=2016,
        cpu_model="Intel Core i3-6100T",
        cpu_cores=2,
        ram_gb=4,
        storage_gb=128,
        storage_type="sata_ssd",
        storage_present=True,
        sanitization_method=SanitizationMethod.OVERWRITE_SINGLE_PASS.value,
        sanitization_status=SanitizationStatus.COMPLETED.value,
        sanitization_verified=True,
        battery_health_percent=None,
        physical_condition="grade_b",
        functional_status="fully_functional",
        known_issues=[],
        department="Store",
        location="Shelf A",
    )
    demand_iot = DemandRequest(
        demand_id="DEMAND-IOT",
        department="Robotics Lab",
        role="iot_gateway_or_lab_node",
        quantity_needed=4,
        priority=DemandPriority.HIGH.value,
        min_compute_tier=ComputeTier.ENTRY.value,
        min_ram_gb=4,
        min_storage_gb=128,
        preferred_storage_type="SSD",
        required_os=["LINUX", "LIGHTWEIGHT_LINUX"],
        required_mobility=MobilityRequirement.ANY.value,
    )
    match = evaluate_asset_against_demand(asset, demand_iot)
    assert match.is_compatible is True
    assert match.role == "iot_gateway_or_lab_node"
    assert match.compatibility_score >= 80.0


def test_4_mobility_constraint(db):
    """Test 4: Laptop with degraded battery is classified as DESK_BOUND and fails a PORTABLE requirement."""
    asset = Asset(
        asset_id="TEST-LAP-04",
        serial_number="SN-TEST-04",
        device_type="laptop",
        manufacturer="Dell",
        model="Latitude 5490",
        purchase_year=2018,
        cpu_model="Intel Core i5-8250U",
        cpu_cores=4,
        ram_gb=8,
        storage_gb=256,
        storage_type="nvme_ssd",
        storage_present=True,
        sanitization_method=SanitizationMethod.CRYPTO_ERASE.value,
        sanitization_status=SanitizationStatus.COMPLETED.value,
        sanitization_verified=True,
        battery_health_percent=20.0,  # Dead/degraded battery (<50%)
        physical_condition="grade_b",
        functional_status="fully_functional",
        known_issues=["weak_battery"],
        department="Store",
        location="Shelf B",
    )
    demand_field_work = DemandRequest(
        demand_id="DEMAND-FIELD",
        department="Civil Survey",
        role="mobile_field_laptop",
        quantity_needed=2,
        priority=DemandPriority.HIGH.value,
        min_compute_tier=ComputeTier.ENTRY.value,
        min_ram_gb=8,
        min_storage_gb=128,
        required_mobility=MobilityRequirement.PORTABLE.value,
    )
    demand_fixed_terminal = DemandRequest(
        demand_id="DEMAND-KIOSK",
        department="Library",
        role="public_kiosk_terminal",
        quantity_needed=5,
        priority=DemandPriority.HIGH.value,
        min_compute_tier=ComputeTier.ENTRY.value,
        min_ram_gb=4,
        min_storage_gb=128,
        required_mobility=MobilityRequirement.DESK_BOUND_OK.value,
    )

    match_mobile = evaluate_asset_against_demand(asset, demand_field_work)
    assert match_mobile.is_compatible is False
    assert any("Mobility mismatch" in u for u in match_mobile.unmet_requirements)

    match_fixed = evaluate_asset_against_demand(asset, demand_fixed_terminal)
    assert match_fixed.is_compatible is True
    assert any("Desk-bound form factor is suitable" in r for r in match_fixed.reasons)


def test_5_os_constraint(db):
    """Test 5: Asset lacking required OS compatibility is rejected for that role."""
    asset = Asset(
        asset_id="TEST-LAP-05",
        serial_number="SN-TEST-05",
        device_type="laptop",
        manufacturer="HP",
        model="Stream 11",
        purchase_year=2015,
        cpu_model="Intel Celeron N2840",
        cpu_cores=2,
        ram_gb=2,
        storage_gb=32,
        storage_type="emmc",
        storage_present=True,
        sanitization_method=SanitizationMethod.OVERWRITE_SINGLE_PASS.value,
        sanitization_status=SanitizationStatus.COMPLETED.value,
        sanitization_verified=True,
        battery_health_percent=80.0,
        physical_condition="grade_c",
        functional_status="fully_functional",
        known_issues=[],
        department="Store",
        location="Shelf C",
    )
    demand_win11 = DemandRequest(
        demand_id="DEMAND-WIN11",
        department="Admin",
        role="general_office_workstation",
        quantity_needed=2,
        priority=DemandPriority.MEDIUM.value,
        min_compute_tier=ComputeTier.ENTRY.value,
        min_ram_gb=2,
        min_storage_gb=32,
        required_os=["WINDOWS_11_COMPLIANT"],
    )
    match = evaluate_asset_against_demand(asset, demand_win11)
    assert match.is_compatible is False
    assert any("OS incompatibility" in u for u in match.unmet_requirements)


def test_6_priority_ordering(db):
    """Test 6: find_matches_for_asset ranks higher priority demands first."""
    asset = Asset(
        asset_id="TEST-LAP-06",
        serial_number="SN-TEST-06",
        device_type="laptop",
        manufacturer="Lenovo",
        model="ThinkPad T490",
        purchase_year=2021,
        cpu_model="Intel Core i5-8365U",
        cpu_cores=4,
        ram_gb=16,
        storage_gb=512,
        storage_type="nvme_ssd",
        storage_present=True,
        sanitization_method=SanitizationMethod.CRYPTO_ERASE.value,
        sanitization_status=SanitizationStatus.COMPLETED.value,
        sanitization_verified=True,
        battery_health_percent=85.0,
        physical_condition="grade_a",
        functional_status="fully_functional",
        known_issues=[],
        department="CS",
        location="Lab",
    )
    d_low = DemandRequest(
        demand_id="D-LOW",
        department="Dept A",
        role="general_office_workstation",
        quantity_needed=1,
        priority=DemandPriority.LOW.value,
        min_compute_tier=ComputeTier.ENTRY.value,
        min_ram_gb=4,
        min_storage_gb=128,
    )
    d_crit = DemandRequest(
        demand_id="D-CRIT",
        department="Dept B",
        role="coding_workstation",
        quantity_needed=1,
        priority=DemandPriority.CRITICAL.value,
        min_compute_tier=ComputeTier.MID.value,
        min_ram_gb=8,
        min_storage_gb=256,
    )
    d_high = DemandRequest(
        demand_id="D-HIGH",
        department="Dept C",
        role="public_kiosk_terminal",
        quantity_needed=1,
        priority=DemandPriority.HIGH.value,
        min_compute_tier=ComputeTier.ENTRY.value,
        min_ram_gb=4,
        min_storage_gb=128,
    )

    matches = find_matches_for_asset(asset, [d_low, d_crit, d_high])
    assert matches[0].demand_id == "D-CRIT"
    assert matches[1].demand_id == "D-HIGH"
    assert matches[2].demand_id == "D-LOW"


def test_7_quantity_fulfillment(client):
    """Test 7: Demand tracking calculates remaining_quantity correctly."""
    create_res = client.post(
        "/api/v1/demand",
        json={
            "department": "Mechanical Eng",
            "role": "cad_workstation",
            "quantity_needed": 10,
            "priority": "HIGH",
            "min_compute_tier": "PERFORMANCE",
            "min_ram_gb": 16,
            "min_storage_gb": 512,
            "preferred_storage_type": "SSD",
            "required_os": ["WINDOWS_11_COMPLIANT"],
            "notes": "Testing quantity fulfillment calculation.",
        },
    )
    assert create_res.status_code == status.HTTP_201_CREATED
    data = create_res.json()
    assert data["quantity_needed"] == 10
    assert data["quantity_fulfilled"] == 0
    assert data["remaining_quantity"] == 10


def test_8_security_filtering_in_matching(db):
    """Test 8: Asset with unverified storage is flagged as security blocked in match results."""
    asset = Asset(
        asset_id="TEST-LAP-08",
        serial_number="SN-TEST-08",
        device_type="laptop",
        manufacturer="Dell",
        model="Latitude 7490",
        purchase_year=2019,
        cpu_model="Intel Core i5-8250U",
        cpu_cores=4,
        ram_gb=8,
        storage_gb=256,
        storage_type="sata_ssd",
        storage_present=True,
        sanitization_method=SanitizationMethod.NONE.value,
        sanitization_status=SanitizationStatus.PENDING.value,
        sanitization_verified=False,
        battery_health_percent=70.0,
        physical_condition="grade_b",
        functional_status="fully_functional",
        known_issues=[],
        department="Store",
        location="Lab",
    )
    demand = DemandRequest(
        demand_id="DEMAND-CSE",
        department="Computer Science",
        role="coding_workstation",
        quantity_needed=5,
        priority=DemandPriority.HIGH.value,
        min_compute_tier=ComputeTier.MID.value,
        min_ram_gb=8,
        min_storage_gb=256,
    )
    match = evaluate_asset_against_demand(asset, demand)
    assert match.security_eligibility_status == "SECURITY_BLOCKED_UNVERIFIED_STORAGE"
    assert "Direct redeployment blocked by security gate" in match.unmet_requirements[0]
    assert "Requires disk sanitization" in match.recommended_action


def test_9_ineligible_asset_exclusion(db):
    """Test 9: Catastrophically damaged asset is flagged for repair or excluded from computing."""
    asset = Asset(
        asset_id="TEST-DESK-09",
        serial_number="SN-TEST-09",
        device_type="desktop",
        manufacturer="HP",
        model="ProDesk",
        purchase_year=2016,
        cpu_model="Intel Core i5-6500",
        cpu_cores=4,
        ram_gb=16,
        storage_gb=512,
        storage_type="sata_ssd",
        storage_present=True,
        sanitization_method=SanitizationMethod.NONE.value,
        sanitization_status=SanitizationStatus.PENDING.value,
        sanitization_verified=False,
        battery_health_percent=None,
        physical_condition="damaged",
        functional_status="non_functional",
        known_issues=["motherboard_failure", "chassis_cracked"],
        department="Store",
        location="Basement",
    )
    demand = DemandRequest(
        demand_id="DEMAND-CSE",
        department="Computer Science",
        role="coding_workstation",
        quantity_needed=5,
        priority=DemandPriority.CRITICAL.value,
        min_compute_tier=ComputeTier.MID.value,
        min_ram_gb=8,
        min_storage_gb=256,
    )
    match = evaluate_asset_against_demand(asset, demand)
    # Hardware is non-functional; cannot be immediately deployed
    assert match.security_eligibility_status in (
        "SECURITY_BLOCKED_UNVERIFIED_STORAGE",
        "REQUIRES_REPAIR_BEFORE_DEPLOYMENT",
    )


def test_10_impact_aggregation_and_seed_dataset(client):
    """Test 10: Seeding 30 simulated assets, evaluating them, and aggregating portfolio impact."""
    # 1. Call Seed Endpoint
    seed_res = client.post("/api/v1/assets/seed-simulated")
    assert seed_res.status_code == status.HTTP_200_OK
    seed_data = seed_res.json()
    assert seed_data["status"] == "success"
    assert seed_data["assets_seeded"] == 30
    assert seed_data["dataset_tag"] == "[SIMULATED DATASET]"

    # 2. Evaluate a sample of the seeded assets
    eval1 = client.post("/api/v1/evaluate", json={"asset_id": "SIM-LAP-001"})
    assert eval1.status_code == status.HTTP_200_OK

    eval2 = client.post("/api/v1/evaluate", json={"asset_id": "SIM-LAP-002"})
    assert eval2.status_code == status.HTTP_200_OK

    eval3 = client.post("/api/v1/evaluate", json={"asset_id": "SIM-DESK-016"})
    assert eval3.status_code == status.HTTP_200_OK

    # 3. Call Impact Summary Endpoint
    impact_res = client.get("/api/v1/impact/summary")
    assert impact_res.status_code == status.HTTP_200_OK
    impact_data = impact_res.json()

    assert impact_data["total_assets_registered"] >= 30
    assert impact_data["total_assets_assessed"] >= 3
    assert impact_data["is_estimate"] is True
    assert impact_data["confidence"] == "PROVISIONAL"
    assert "ESTIMATE ONLY" in impact_data["disclaimer"]
    assert impact_data["total_estimated_purchase_cost_avoided"] > 0
    assert impact_data["total_estimated_ewaste_diverted_kg"] > 0
    assert impact_data["total_estimated_co2e_avoided_kg"] > 0

    # 4. Check Demand Matching Endpoint for Seeded Asset
    match_res = client.get("/api/v1/demand/matches/SIM-LAP-001")
    assert match_res.status_code == status.HTTP_200_OK
    match_data = match_res.json()
    assert match_data["asset_id"] == "SIM-LAP-001"
    assert match_data["total_demands_evaluated"] >= 4
    assert match_data["compatible_matches_count"] >= 1
    # Check that matches are ranked (first match should be compatible with highest priority)
    assert match_data["matches"][0]["is_compatible"] is True


def test_11_get_candidates_for_demand(client):
    """Test 11: GET /api/v1/demand/{demand_id}/candidates returns ranked candidate assets."""
    client.post("/api/v1/assets/seed-simulated")
    
    # List demands to pick an active demand_id
    demands_res = client.get("/api/v1/demand")
    assert demands_res.status_code == status.HTTP_200_OK
    demands = demands_res.json()
    assert len(demands) > 0
    target_demand = demands[0]
    demand_id = target_demand["demand_id"]

    # Query candidates for this demand
    candidates_res = client.get(f"/api/v1/demand/{demand_id}/candidates")
    assert candidates_res.status_code == status.HTTP_200_OK
    data = candidates_res.json()

    assert data["demand_id"] == demand_id
    assert data["department"] == target_demand["department"]
    assert data["total_assets_evaluated"] >= 30
    assert "candidates" in data
    assert len(data["candidates"]) == data["total_assets_evaluated"]

    # Verify first candidate has reasons and score
    first_candidate = data["candidates"][0]
    assert "compatibility_score" in first_candidate
    assert "reasons" in first_candidate
    assert "security_eligibility_status" in first_candidate


def test_12_deduplicated_portfolio_impact_on_repeated_evaluation(client):
    """
    Test 12: Evaluating the same physical asset multiple times does NOT double-count impact.
    Different assets each contribute once. Passport history remains intact.
    """
    client.post("/api/v1/assets/seed-simulated")

    # 1. First evaluation of SIM-LAP-001
    eval1 = client.post("/api/v1/evaluate", json={"asset_id": "SIM-LAP-001", "decision_objective": "BALANCED"})
    assert eval1.status_code == status.HTTP_200_OK

    imp1 = client.get("/api/v1/impact/summary").json()
    assert imp1["total_assets_assessed"] == 1
    assert imp1["total_estimated_purchase_cost_avoided"] == 45000.0
    assert imp1["total_estimated_ewaste_diverted_kg"] == 2.1
    assert imp1["total_estimated_co2e_avoided_kg"] == 135.0
    assert imp1["pathway_breakdown"]["direct_reuse"] == 1

    # 2. Second evaluation of SIM-LAP-001 (same physical asset)
    eval2 = client.post("/api/v1/evaluate", json={"asset_id": "SIM-LAP-001", "decision_objective": "BALANCED"})
    assert eval2.status_code == status.HTTP_200_OK

    imp2 = client.get("/api/v1/impact/summary").json()
    # Must NOT double count: still 1 physical asset assessed
    assert imp2["total_assets_assessed"] == 1
    assert imp2["total_estimated_purchase_cost_avoided"] == 45000.0
    assert imp2["total_estimated_ewaste_diverted_kg"] == 2.1
    assert imp2["total_estimated_co2e_avoided_kg"] == 135.0
    assert imp2["pathway_breakdown"]["direct_reuse"] == 1

    # 3. Third evaluation of SIM-LAP-001
    eval3 = client.post("/api/v1/evaluate", json={"asset_id": "SIM-LAP-001", "decision_objective": "BALANCED"})
    assert eval3.status_code == status.HTTP_200_OK

    imp3 = client.get("/api/v1/impact/summary").json()
    assert imp3["total_assets_assessed"] == 1
    assert imp3["total_estimated_purchase_cost_avoided"] == 45000.0

    # 4. Now evaluate a DIFFERENT physical asset (SIM-LAP-002)
    eval_other = client.post("/api/v1/evaluate", json={"asset_id": "SIM-LAP-002", "decision_objective": "BALANCED"})
    assert eval_other.status_code == status.HTTP_200_OK

    imp4 = client.get("/api/v1/impact/summary").json()
    # Two distinct physical assets
    assert imp4["total_assets_assessed"] == 2
    assert imp4["total_estimated_purchase_cost_avoided"] == 90000.0
    assert imp4["total_estimated_ewaste_diverted_kg"] == 4.2
    assert imp4["pathway_breakdown"]["direct_reuse"] == 1
    assert imp4["pathway_breakdown"]["repair"] == 1

    # 5. Verify passport for SIM-LAP-001 retains all 3 evaluation events in audit history
    pass_res = client.get("/api/v1/passport/SIM-LAP-001")
    assert pass_res.status_code == status.HTTP_200_OK
    events = pass_res.json()["events"]
    eval_events = [e for e in events if e["event_type"] == "RECOMMENDATION_GENERATED"]
    assert len(eval_events) == 3, "Historical passport evaluation events must be preserved"


def test_13_portfolio_impact_uses_latest_differing_recommendation_and_preserves_passport(client):
    """
    Test 13: When an asset's latest recommendation differs from its previous one,
    the portfolio uses the latest recommendation without inflating asset counts.
    Human override is also respected in the pathway breakdown.
    """
    client.post("/api/v1/assets/seed-simulated")

    # 1. Evaluate SIM-LAP-002 under BALANCED -> REPAIR
    res1 = client.post("/api/v1/evaluate", json={"asset_id": "SIM-LAP-002", "decision_objective": "BALANCED"})
    assert res1.status_code == status.HTTP_200_OK
    assert res1.json()["recommended_pathway"] == "REPAIR"

    imp1 = client.get("/api/v1/impact/summary").json()
    assert imp1["total_assets_assessed"] == 1
    assert imp1["pathway_breakdown"]["repair"] == 1
    assert imp1["pathway_breakdown"]["repurpose"] == 0
    assert imp1["total_estimated_co2e_avoided_kg"] == 112.5  # 2.5 yrs * 45.0

    # 2. Re-evaluate SIM-LAP-002 under COST_FIRST -> REPURPOSE
    res2 = client.post("/api/v1/evaluate", json={"asset_id": "SIM-LAP-002", "decision_objective": "COST_FIRST"})
    assert res2.status_code == status.HTTP_200_OK
    rec2_data = res2.json()
    assert rec2_data["recommended_pathway"] == "REPURPOSE"
    rec2_id = rec2_data["recommendation_id"]

    imp2 = client.get("/api/v1/impact/summary").json()
    # Count is still 1 physical asset, but pathway breakdown now reflects REPURPOSE
    assert imp2["total_assets_assessed"] == 1
    assert imp2["pathway_breakdown"]["repair"] == 0
    assert imp2["pathway_breakdown"]["repurpose"] == 1
    assert imp2["total_estimated_purchase_cost_avoided"] == 45000.0

    # 3. Test Human Override on latest recommendation (rec2)
    # Admin overrides pathway from REPURPOSE to REPAIR
    override_res = client.post(
        f"/api/v1/approvals/{rec2_id}/decide",
        json={
            "decision": "OVERRIDE",
            "chosen_pathway": "REPAIR",
            "chosen_destination": "INTERNAL_REDEPLOYMENT",
            "actor": "lead_tech",
            "approval_notes": "Authorizing authorized repair attempt in campus lab.",
        },
    )
    assert override_res.status_code == status.HTTP_200_OK

    imp3 = client.get("/api/v1/impact/summary").json()
    assert imp3["total_assets_assessed"] == 1
    assert imp3["pathway_breakdown"]["repurpose"] == 0
    assert imp3["pathway_breakdown"]["repair"] == 1

    # 4. Verify complete passport event trail
    pass_res = client.get("/api/v1/passport/SIM-LAP-002")
    assert pass_res.status_code == status.HTTP_200_OK
    event_types = [e["event_type"] for e in pass_res.json()["events"]]
    assert "ASSET_REGISTERED" in event_types
    assert event_types.count("RECOMMENDATION_GENERATED") == 2
    assert "HUMAN_DECISION_OVERRIDDEN" in event_types


def test_14_laptop_vs_desktop_impact_calculation_factors():
    """
    Task 4 Regression: Environmental calculations use device-specific factors
    from versioned assumptions (laptop: 280 kg embodied / 2.1 kg mass; desktop: 350 kg embodied / 7.5 kg mass).
    """
    from backend.app.services.impact_engine import calculate_environmental_impact
    from backend.app.core.enums import CircularPathway

    laptop_res = calculate_environmental_impact("laptop", CircularPathway.DIRECT_REUSE)
    assert laptop_res.embodied_co2e_kg == 280.0
    assert laptop_res.ewaste_mass_kg == 2.1
    assert laptop_res.annual_avoided_co2e_kg == 45.0
    assert laptop_res.estimated_life_extension_years == 3.0
    assert laptop_res.total_estimated_co2e_avoided_kg == 135.0
    assert laptop_res.is_estimate is True

    desktop_res = calculate_environmental_impact("desktop", CircularPathway.COMPONENT_RECOVERY)
    assert desktop_res.embodied_co2e_kg == 350.0
    assert desktop_res.ewaste_mass_kg == 7.5
    assert desktop_res.annual_avoided_co2e_kg == 45.0
    assert desktop_res.estimated_life_extension_years == 1.0
    assert desktop_res.total_estimated_co2e_avoided_kg == 45.0
    assert desktop_res.is_estimate is True


def test_15_useful_life_extension_and_co2e_proportionality():
    """
    Task 4 Regression: Useful life extension across all circular pathways maps
    consistently and proportionally to avoided carbon (years * 45.0 kg CO2e/year).
    """
    from backend.app.services.impact_engine import calculate_environmental_impact
    from backend.app.core.enums import CircularPathway

    expected_mappings = [
        (CircularPathway.DIRECT_REUSE, 3.0, 135.0),
        (CircularPathway.REPAIR, 2.5, 112.5),
        (CircularPathway.REFURBISH, 2.5, 112.5),
        (CircularPathway.REPURPOSE, 2.0, 90.0),
        (CircularPathway.COMPONENT_RECOVERY, 1.0, 45.0),
        (CircularPathway.RECYCLE, 0.0, 0.0),
    ]

    for pathway, exp_years, exp_co2e in expected_mappings:
        result = calculate_environmental_impact("laptop", pathway)
        assert result.estimated_life_extension_years == exp_years
        assert result.total_estimated_co2e_avoided_kg == exp_co2e
        assert result.total_estimated_co2e_avoided_kg == round(exp_years * 45.0, 1)


def test_16_portfolio_impact_three_asset_canonical_baseline(client):
    """
    Task 4 Regression: Three canonical demonstration assets aggregate exactly to
    ₹128,000 capital, 292.5 kg CO2e, 11.7 kg e-waste, 6.5 years life extended,
    and repeated evaluations do not duplicate physical asset contributions.
    """
    client.post("/api/v1/assets/seed-simulated")

    # Evaluate the 3 canonical assets
    e1 = client.post("/api/v1/evaluate", json={"asset_id": "SIM-LAP-001", "decision_objective": "BALANCED"})
    assert e1.status_code == status.HTTP_200_OK

    e2 = client.post("/api/v1/evaluate", json={"asset_id": "SIM-LAP-002", "decision_objective": "BALANCED"})
    assert e2.status_code == status.HTTP_200_OK

    e3 = client.post("/api/v1/evaluate", json={"asset_id": "SIM-DESK-016", "decision_objective": "BALANCED"})
    assert e3.status_code == status.HTTP_200_OK

    summary = client.get("/api/v1/impact/summary").json()
    assert summary["total_assets_assessed"] == 3
    assert summary["total_assets_eligible_circular"] == 3
    assert summary["total_estimated_purchase_cost_avoided"] == 128000.0
    assert summary["total_estimated_ewaste_diverted_kg"] == 11.7
    assert summary["total_estimated_co2e_avoided_kg"] == 292.5
    assert summary["total_estimated_useful_life_extension_years"] == 6.5
    assert summary["is_estimate"] is True
    assert "ESTIMATE ONLY" in summary["disclaimer"]

    # Re-evaluate all 3 under COST_FIRST -> physical asset count must remain 3
    client.post("/api/v1/evaluate", json={"asset_id": "SIM-LAP-001", "decision_objective": "COST_FIRST"})
    client.post("/api/v1/evaluate", json={"asset_id": "SIM-LAP-002", "decision_objective": "COST_FIRST"})
    client.post("/api/v1/evaluate", json={"asset_id": "SIM-DESK-016", "decision_objective": "COST_FIRST"})

    summary_after = client.get("/api/v1/impact/summary").json()
    assert summary_after["total_assets_assessed"] == 3



