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
