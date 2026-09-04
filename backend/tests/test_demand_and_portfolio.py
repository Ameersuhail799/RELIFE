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
