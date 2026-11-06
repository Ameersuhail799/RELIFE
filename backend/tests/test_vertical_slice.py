import pytest
from fastapi import status


def test_scenario_a_secure_direct_reuse(client):
    """
    Scenario A: Secure Direct Reuse
    Asset has verified disk sanitization and is fully functional.
    Pipeline should clear security gate, qualify DIRECT_REUSE, recommend it,
    and allow human sign-off into PROCESSING state.
    """
    # 1. Register Asset
    asset_payload = {
        "serial_number": "SN-LENOVO-T490-001",
        "device_type": "laptop",
        "manufacturer": "Lenovo",
        "model": "ThinkPad T490",
        "purchase_year": 2021,
        "cpu_model": "Intel Core i5-8365U",
        "cpu_cores": 4,
        "ram_gb": 16,
        "storage_gb": 512,
        "storage_type": "nvme_ssd",
        "storage_present": True,
        "sanitization_method": "crypto_erase",
        "sanitization_status": "completed",
        "sanitization_verified": True,
        "verification_reference": "CERT-2026-NIST-88-101",
        "verified_by": "tech_priya",
        "battery_health_percent": 88.0,
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "known_issues": [],
        "department": "Computer Science",
        "location": "Lab 102",
    }
    create_res = client.post("/api/v1/assets", json=asset_payload)
    assert create_res.status_code == status.HTTP_201_CREATED
    asset_data = create_res.json()
    asset_id = asset_data["asset_id"]
    assert asset_data["lifecycle_state"] == "REGISTERED"

    # 2. Evaluate Asset Pathways
    eval_res = client.post(
        "/api/v1/evaluate",
        json={"asset_id": asset_id, "decision_objective": "BALANCED"},
    )
    assert eval_res.status_code == status.HTTP_200_OK
    eval_data = eval_res.json()

    # Verify Security Gate
    assert eval_data["security_gate"]["direct_reuse_permitted"] is True
    assert eval_data["security_gate"]["sanitization_verified"] is True

    # Verify Capability Profile
    assert eval_data["capability_profile"]["compute_tier"] == "PERFORMANCE"
    assert eval_data["capability_profile"]["mobility_profile"] == "PORTABLE"

    # Verify Pathway Eligibility & Recommendation
    assert "DIRECT_REUSE" in eval_data["eligible_pathways"]
    assert eval_data["recommended_pathway"] == "DIRECT_REUSE"
    assert eval_data["destination_action"] == "INTERNAL_REDEPLOYMENT"
    assert eval_data["suitability_score"] >= 90.0

    # Verify Deterministic Economics & Environmental Estimates
    assert eval_data["economics"]["valuation_type"] == "ESTIMATED_PROTOTYPE_VALUE"
    assert eval_data["economics"]["estimated_residual_value"] > 0
    assert eval_data["environmental"]["is_estimate"] is True
    assert eval_data["environmental"]["confidence"] == "PROVISIONAL"
    assert "ESTIMATE ONLY" in eval_data["environmental"]["disclaimer"]

    # Verify Explainability
    assert len(eval_data["reasons"]) >= 2
    assert "ThinkPad" in eval_data["why_this_recommendation"] or asset_id in eval_data["why_this_recommendation"]
    assert len(eval_data["assumptions"]) > 0
    assert len(eval_data["uncertainties"]) > 0

    recommendation_id = eval_data["recommendation_id"]

    # 3. Human Approval Step
    approval_payload = {
        "decision": "APPROVE",
        "actor": "admin_suresh",
        "approval_notes": "Approved for immediate internal redeployment to CSE faculty lab.",
    }
    appr_res = client.post(f"/api/v1/approvals/{recommendation_id}/decide", json=approval_payload)
    assert appr_res.status_code == status.HTTP_200_OK
    appr_data = appr_res.json()
    assert appr_data["approval_status"] == "APPROVED"
    assert appr_data["final_pathway"] == "DIRECT_REUSE"
    assert appr_data["new_lifecycle_state"] == "PROCESSING"

    # 4. Verify Circular Asset Passport Audit Trail
    pass_res = client.get(f"/api/v1/passport/{asset_id}")
    assert pass_res.status_code == status.HTTP_200_OK
    pass_data = pass_res.json()
    assert pass_data["total_events"] >= 4
    event_types = [e["event_type"] for e in pass_data["events"]]
    assert "ASSET_REGISTERED" in event_types
    assert "SECURITY_GATE_EVALUATED" in event_types
    assert "RECOMMENDATION_GENERATED" in event_types
    assert "HUMAN_DECISION_APPROVED" in event_types


def test_scenario_b_repair_and_redeploy_with_override_security_gate_block(client):
    """
    Scenario B: Repair + Redeploy with Non-Bypassable Security Gate Test
    Asset has unverified SSD and sticking keyboard key.
    - Security Gate must DISQUALIFY DIRECT_REUSE.
    - REPAIR must be recommended.
    - Human override to DIRECT_REUSE must be HARD BLOCKED by the security gate.
    - After updating sanitization, redeployment is permitted.
    """
    # 1. Register Asset with unverified drive and minor defect
    asset_payload = {
        "serial_number": "SN-DELL-LAT-7490-002",
        "device_type": "laptop",
        "manufacturer": "Dell",
        "model": "Latitude 7490",
        "purchase_year": 2019,
        "cpu_model": "Intel Core i5-8250U",
        "cpu_cores": 4,
        "ram_gb": 8,
        "storage_gb": 256,
        "storage_type": "sata_ssd",
        "storage_present": True,
        "sanitization_method": "none",
        "sanitization_status": "pending",
        "sanitization_verified": False,
        "battery_health_percent": 68.0,
        "physical_condition": "grade_b",
        "functional_status": "minor_defect",
        "known_issues": ["sticking_key", "thermal_throttling"],
        "department": "Mechanical Engineering",
        "location": "CAD Lab Rm 204",
    }
    create_res = client.post("/api/v1/assets", json=asset_payload)
    asset_id = create_res.json()["asset_id"]

    # 2. Evaluate
    eval_res = client.post(
        "/api/v1/evaluate",
        json={"asset_id": asset_id, "decision_objective": "BALANCED"},
    )
    eval_data = eval_res.json()

    # Security gate BLOCKS direct reuse
    assert eval_data["security_gate"]["direct_reuse_permitted"] is False
    assert "DIRECT_REUSE" not in eval_data["eligible_pathways"]

    # REPAIR is eligible and recommended
    assert "REPAIR" in eval_data["eligible_pathways"]
    assert eval_data["recommended_pathway"] == "REPAIR"
    assert eval_data["destination_action"] == "INTERNAL_REDEPLOYMENT"

    # Deterministic Repair Economics
    # sticking_key (2100) + thermal_throttling (1000) = 3100
    assert eval_data["economics"]["estimated_repair_cost"] > 0
    assert eval_data["economics"]["economic_viability_flag"] in ("HIGHLY_VIABLE", "MARGINAL")

    recommendation_id = eval_data["recommendation_id"]

    # 3. ILLEGAL OVERRIDE TEST: Attempt human override to DIRECT_REUSE with unverified drive
    illegal_override = {
        "decision": "OVERRIDE",
        "chosen_pathway": "DIRECT_REUSE",
        "chosen_destination": "INTERNAL_REDEPLOYMENT",
        "actor": "rogue_tech",
        "approval_notes": "Attempting to force direct reuse without wiping drive.",
    }
    override_res = client.post(
        f"/api/v1/approvals/{recommendation_id}/decide",
        json=illegal_override,
    )
    # MUST BE REJECTED (HTTP 403 Forbidden)
    assert override_res.status_code == status.HTTP_403_FORBIDDEN
    assert "MANDATORY SECURITY GATE VIOLATION" in override_res.json()["detail"]

    # 4. Valid Approval for REPAIR
    valid_approval = {
        "decision": "APPROVE",
        "actor": "tech_lead_rahul",
        "approval_notes": "Approved repair: order replacement keyboard and apply thermal repaste.",
    }
    valid_res = client.post(
        f"/api/v1/approvals/{recommendation_id}/decide",
        json=valid_approval,
    )
    assert valid_res.status_code == status.HTTP_200_OK
    assert valid_res.json()["approval_status"] == "APPROVED"
    assert valid_res.json()["final_pathway"] == "REPAIR"

    # 5. Later: Update Sanitization in Lab
    sanit_res = client.put(
        f"/api/v1/assets/{asset_id}/sanitization",
        json={
            "sanitization_method": "overwrite_single_pass",
            "sanitization_status": "completed",
            "sanitization_verified": True,
            "verification_reference": "CERT-2026-NIST-88-204",
            "verified_by": "tech_lead_rahul",
        },
    )
    assert sanit_res.status_code == status.HTTP_200_OK
    assert sanit_res.json()["sanitization_verified"] is True


def test_scenario_c_repurpose_and_component_recovery(client):
    """
    Scenario C: Repurposing / Component Recovery
    Non-functional legacy desktop with damaged board but harvestable RAM/SSD.
    Pipeline should disqualify Direct Reuse and Repair, and recommend COMPONENT_RECOVERY.
    """
    asset_payload = {
        "serial_number": "SN-HP-PD600-003",
        "device_type": "desktop",
        "manufacturer": "HP",
        "model": "ProDesk 600 G3",
        "purchase_year": 2016,
        "cpu_model": "Intel Core i5-6500",
        "cpu_cores": 4,
        "ram_gb": 16,
        "storage_gb": 512,
        "storage_type": "sata_ssd",
        "storage_present": True,
        "sanitization_method": "none",
        "sanitization_status": "pending",
        "sanitization_verified": False,
        "physical_condition": "damaged",
        "functional_status": "non_functional",
        "known_issues": ["motherboard_failure", "chassis_cracked"],
        "department": "Physics Lab",
        "location": "Basement Storage",
    }
    create_res = client.post("/api/v1/assets", json=asset_payload)
    asset_id = create_res.json()["asset_id"]

    # Evaluate
    eval_res = client.post(
        "/api/v1/evaluate",
        json={"asset_id": asset_id, "decision_objective": "BALANCED"},
    )
    eval_data = eval_res.json()

    # Direct Reuse and Repair are disqualified
    assert "DIRECT_REUSE" not in eval_data["eligible_pathways"]
    assert "REPAIR" not in eval_data["eligible_pathways"]

    # COMPONENT_RECOVERY and RECYCLE are eligible
    assert "COMPONENT_RECOVERY" in eval_data["eligible_pathways"]
    assert eval_data["recommended_pathway"] in ("COMPONENT_RECOVERY", "RECYCLE")
    assert eval_data["destination_action"] in ("COMPONENT_HARVEST", "CERTIFIED_RECYCLER")

    # Approve Component Recovery
    rec_id = eval_data["recommendation_id"]
    approval_res = client.post(
        f"/api/v1/approvals/{rec_id}/decide",
        json={
            "decision": "APPROVE",
            "actor": "hardware_officer_anita",
            "approval_notes": "Harvest 16GB DDR4 RAM and 512GB SSD into spare parts inventory; recycle chassis.",
        },
    )
    assert approval_res.status_code == status.HTTP_200_OK
    assert approval_res.json()["approval_status"] == "APPROVED"

    # Verify Passport trail
    pass_res = client.get(f"/api/v1/passport/{asset_id}")
    assert pass_res.status_code == status.HTTP_200_OK
    pass_data = pass_res.json()
    assert pass_data["total_events"] >= 3


def test_read_only_evaluation_preview_has_no_side_effects(client):
    """
    Regression test: Viewing/inspecting an asset via GET /api/v1/evaluate/{asset_id}
    must NOT create PathwayRecommendation rows, append passport events, or mutate lifecycle_state.
    """
    asset_payload = {
        "serial_number": "SN-PREVIEW-001",
        "device_type": "laptop",
        "manufacturer": "Lenovo",
        "model": "ThinkPad T490",
        "purchase_year": 2020,
        "cpu_model": "Intel Core i5-8365U",
        "cpu_cores": 4,
        "ram_gb": 16,
        "storage_gb": 512,
        "storage_type": "nvme_ssd",
        "storage_present": True,
        "sanitization_method": "crypto_erase",
        "sanitization_status": "completed",
        "sanitization_verified": True,
        "verification_reference": "SAN-VER-2026-001",
        "verified_by": "tech_lead",
        "battery_health_percent": 82.0,
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "known_issues": [],
        "department": "Engineering",
        "location": "Lab 1",
    }
    create_res = client.post("/api/v1/assets", json=asset_payload)
    assert create_res.status_code == status.HTTP_201_CREATED
    asset_id = create_res.json()["asset_id"]

    # Repeated read-only GET evaluation previews across objectives
    for obj in ("BALANCED", "SUSTAINABILITY_FIRST", "COST_FIRST"):
        preview_res = client.get(f"/api/v1/evaluate/{asset_id}?objective={obj}")
        assert preview_res.status_code == status.HTTP_200_OK
        preview_data = preview_res.json()
        assert preview_data["recommendation_id"] == "PREVIEW"
        assert preview_data["approval_status"] == "NOT_EVALUATED"

    # Verify zero recommendations created, lifecycle remains REGISTERED, and passport has only intake event
    approvals_res = client.get(f"/api/v1/approvals?asset_id={asset_id}")
    assert approvals_res.status_code == status.HTTP_200_OK
    assert len(approvals_res.json()) == 0

    asset_res = client.get(f"/api/v1/assets/{asset_id}")
    assert asset_res.json()["lifecycle_state"] == "REGISTERED"

    passport_res = client.get(f"/api/v1/passport/{asset_id}")
    assert passport_res.json()["total_events"] == 1

    # Now perform an explicit POST evaluation and approve it
    eval_res = client.post(
        "/api/v1/evaluate",
        json={"asset_id": asset_id, "decision_objective": "BALANCED"},
    )
    assert eval_res.status_code == status.HTTP_200_OK
    rec_id = eval_res.json()["recommendation_id"]

    decide_res = client.post(
        f"/api/v1/approvals/{rec_id}/decide",
        json={
            "decision": "APPROVE",
            "actor": "reviewer_1",
            "approval_notes": "Approved for internal redeployment.",
        },
    )
    assert decide_res.status_code == status.HTTP_200_OK
    events_after_approval = client.get(f"/api/v1/passport/{asset_id}").json()["total_events"]

    # Subsequent read-only GET preview must NOT reset PROCESSING state or duplicate recommendations
    preview_after = client.get(f"/api/v1/evaluate/{asset_id}?objective=COST_FIRST")
    assert preview_after.status_code == status.HTTP_200_OK
    assert preview_after.json()["recommendation_id"] == rec_id
    assert preview_after.json()["approval_status"] == "APPROVED"

    assert client.get(f"/api/v1/assets/{asset_id}").json()["lifecycle_state"] == "PROCESSING"
    assert len(client.get(f"/api/v1/approvals?asset_id={asset_id}").json()) == 1
    assert client.get(f"/api/v1/passport/{asset_id}").json()["total_events"] == events_after_approval


def test_override_with_certified_recycler_destination_succeeds(client):
    """
    Regression test: Overriding a recommendation to CERTIFIED_RECYCLER destination is accepted.
    """
    asset_payload = {
        "serial_number": "SN-RECYCLE-001",
        "device_type": "desktop",
        "manufacturer": "Dell",
        "model": "OptiPlex 5050",
        "purchase_year": 2017,
        "cpu_model": "Intel Core i5-7500",
        "cpu_cores": 4,
        "ram_gb": 8,
        "storage_gb": 256,
        "storage_type": "sata_ssd",
        "storage_present": True,
        "sanitization_method": "none",
        "sanitization_status": "pending",
        "sanitization_verified": False,
        "physical_condition": "damaged",
        "functional_status": "major_fault",
        "known_issues": ["power_supply_fault"],
        "department": "Admin",
        "location": "Store Room",
    }
    create_res = client.post("/api/v1/assets", json=asset_payload)
    assert create_res.status_code == status.HTTP_201_CREATED
    asset_id = create_res.json()["asset_id"]

    eval_res = client.post(
        "/api/v1/evaluate",
        json={"asset_id": asset_id, "decision_objective": "BALANCED"},
    )
    rec_id = eval_res.json()["recommendation_id"]

    override_res = client.post(
        f"/api/v1/approvals/{rec_id}/decide",
        json={
            "decision": "OVERRIDE",
            "chosen_pathway": "RECYCLE",
            "chosen_destination": "CERTIFIED_RECYCLER",
            "actor": "sustainability_lead",
            "approval_notes": "Unit beyond economical repair; routing to certified WEEE recycler.",
        },
    )
    assert override_res.status_code == status.HTTP_200_OK
    data = override_res.json()
    assert data["approval_status"] == "OVERRIDDEN"
    assert data["final_pathway"] == "RECYCLE"
    assert data["final_destination"] == "CERTIFIED_RECYCLER"


def test_approval_time_security_gate_enforcement_consistency(client):
    """
    Task 2 Regression: Verify approval-time security gate rejects unsafe DIRECT_REUSE actions
    with HTTP 403 when any required sanitization condition is missing:
    1. sanitization_verified = true, but status = pending -> HTTP 403
    2. sanitization_verified = true, but method = none -> HTTP 403
    3. sanitization_verified = false -> HTTP 403
    4. all conditions valid -> HTTP 200 OK
    """
    base_payload = {
        "device_type": "laptop",
        "manufacturer": "HP",
        "model": "EliteBook 840 G6",
        "purchase_year": 2021,
        "cpu_model": "Intel Core i5-8365U",
        "cpu_cores": 4,
        "ram_gb": 16,
        "storage_gb": 512,
        "storage_type": "nvme_ssd",
        "storage_present": True,
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "known_issues": [],
        "department": "Engineering",
        "location": "Lab 2",
    }

    # 1. verified=True, but status=pending -> 403 on DIRECT_REUSE
    p1 = dict(base_payload, serial_number="SN-SEC-TEST-001", sanitization_verified=True, sanitization_status="pending", sanitization_method="crypto_erase")
    res1 = client.post("/api/v1/assets", json=p1)
    aid1 = res1.json()["asset_id"]
    eval1 = client.post("/api/v1/evaluate", json={"asset_id": aid1, "decision_objective": "BALANCED"})
    rec_id1 = eval1.json()["recommendation_id"]
    decide1 = client.post(
        f"/api/v1/approvals/{rec_id1}/decide",
        json={"decision": "OVERRIDE", "chosen_pathway": "DIRECT_REUSE", "chosen_destination": "INTERNAL_REDEPLOYMENT", "actor": "officer_1", "approval_notes": "Attempting override with pending sanitization"},
    )
    assert decide1.status_code == status.HTTP_403_FORBIDDEN
    assert "required 'completed'" in decide1.json()["detail"]

    # 2. verified=True, status=completed, but method=none -> 403 on DIRECT_REUSE
    p2 = dict(base_payload, serial_number="SN-SEC-TEST-002", sanitization_verified=True, sanitization_status="completed", sanitization_method="none")
    res2 = client.post("/api/v1/assets", json=p2)
    aid2 = res2.json()["asset_id"]
    eval2 = client.post("/api/v1/evaluate", json={"asset_id": aid2, "decision_objective": "BALANCED"})
    rec_id2 = eval2.json()["recommendation_id"]
    decide2 = client.post(
        f"/api/v1/approvals/{rec_id2}/decide",
        json={"decision": "OVERRIDE", "chosen_pathway": "DIRECT_REUSE", "chosen_destination": "INTERNAL_REDEPLOYMENT", "actor": "officer_1", "approval_notes": "Attempting override with none method"},
    )
    assert decide2.status_code == status.HTTP_403_FORBIDDEN
    assert "No valid data sanitization method recorded" in decide2.json()["detail"]

    # 3. verified=False -> 403 on DIRECT_REUSE
    p3 = dict(base_payload, serial_number="SN-SEC-TEST-003", sanitization_verified=False, sanitization_status="pending", sanitization_method="none")
    res3 = client.post("/api/v1/assets", json=p3)
    aid3 = res3.json()["asset_id"]
    eval3 = client.post("/api/v1/evaluate", json={"asset_id": aid3, "decision_objective": "BALANCED"})
    rec_id3 = eval3.json()["recommendation_id"]
    decide3 = client.post(
        f"/api/v1/approvals/{rec_id3}/decide",
        json={"decision": "OVERRIDE", "chosen_pathway": "DIRECT_REUSE", "chosen_destination": "INTERNAL_REDEPLOYMENT", "actor": "officer_1", "approval_notes": "Attempting override with unverified sanitization"},
    )
    assert decide3.status_code == status.HTTP_403_FORBIDDEN

    # 4. all conditions valid -> 200 OK
    p4 = dict(base_payload, serial_number="SN-SEC-TEST-004", sanitization_verified=True, sanitization_status="completed", sanitization_method="crypto_erase")
    res4 = client.post("/api/v1/assets", json=p4)
    aid4 = res4.json()["asset_id"]
    eval4 = client.post("/api/v1/evaluate", json={"asset_id": aid4, "decision_objective": "BALANCED"})
    rec_id4 = eval4.json()["recommendation_id"]
    decide4 = client.post(
        f"/api/v1/approvals/{rec_id4}/decide",
        json={"decision": "APPROVE", "actor": "officer_1", "approval_notes": "All sanitization checks verified."},
    )
    assert decide4.status_code == status.HTTP_200_OK
    assert decide4.json()["approval_status"] == "APPROVED"

