import pytest
from fastapi import status


def test_valid_asset_creation(client):
    """Test 1: Valid asset creation via POST /api/v1/assets returns 201 and persists fields."""
    payload = {
        "asset_id": "INST-LAP-001",
        "serial_number": "SN-INTAKE-TEST-001",
        "device_type": "laptop",
        "manufacturer": "Dell",
        "model": "Latitude 5420",
        "purchase_year": 2022,
        "cpu_model": "Intel Core i5-1145G7",
        "cpu_cores": 4,
        "ram_gb": 16,
        "storage_gb": 512,
        "storage_type": "nvme_ssd",
        "storage_present": True,
        "sanitization_method": "crypto_erase",
        "sanitization_status": "completed",
        "sanitization_verified": True,
        "verification_reference": "CERT-2026-NIST-88-999",
        "verified_by": "lead_technician",
        "battery_health_percent": 92.0,
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "known_issues": ["Minor cosmetic scratch on base"],
        "department": "Computer Science & Engineering",
        "location": "Main Campus - Turing Hall",
    }
    response = client.post("/api/v1/assets", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["asset_id"] == "INST-LAP-001"
    assert data["serial_number"] == "SN-INTAKE-TEST-001"
    assert data["manufacturer"] == "Dell"
    assert data["model"] == "Latitude 5420"
    assert data["lifecycle_state"] == "REGISTERED"
    assert data["sanitization_verified"] is True


def test_duplicate_asset_id_and_serial_rejection(client):
    """Test 2: Reject asset registration if asset_id or serial_number already exists."""
    payload1 = {
        "asset_id": "INST-LAP-002",
        "serial_number": "SN-INTAKE-TEST-002",
        "device_type": "laptop",
        "manufacturer": "Lenovo",
        "model": "ThinkPad T14",
        "purchase_year": 2021,
        "cpu_model": "AMD Ryzen 5 Pro",
        "cpu_cores": 6,
        "ram_gb": 16,
        "storage_gb": 512,
        "storage_type": "nvme_ssd",
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "department": "Mechanical Engineering",
        "location": "Workshop B",
    }
    res1 = client.post("/api/v1/assets", json=payload1)
    assert res1.status_code == status.HTTP_201_CREATED

    # Attempt 2A: Same asset_id with different serial
    payload_dup_id = dict(payload1)
    payload_dup_id["serial_number"] = "SN-INTAKE-DIFFERENT-002"
    res_dup_id = client.post("/api/v1/assets", json=payload_dup_id)
    assert res_dup_id.status_code == status.HTTP_400_BAD_REQUEST
    assert "already exists" in res_dup_id.json()["detail"]
    assert "INST-LAP-002" in res_dup_id.json()["detail"]

    # Attempt 2B: Same serial with different asset_id
    payload_dup_sn = dict(payload1)
    payload_dup_sn["asset_id"] = "INST-LAP-003"
    res_dup_sn = client.post("/api/v1/assets", json=payload_dup_sn)
    assert res_dup_sn.status_code == status.HTTP_400_BAD_REQUEST
    assert "already exists" in res_dup_sn.json()["detail"]
    assert "SN-INTAKE-TEST-002" in res_dup_sn.json()["detail"]


def test_invalid_required_fields(client):
    """Test 3: Reject asset creation if required fields are missing or invalid."""
    # Missing manufacturer, serial_number, ram_gb
    invalid_payload = {
        "device_type": "laptop",
        "model": "Incomplete Model",
    }
    response = client.post("/api/v1/assets", json=invalid_payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # Invalid enum for device_type
    invalid_enum_payload = {
        "serial_number": "SN-INVALID-ENUM",
        "device_type": "smartphone",  # only laptop or desktop allowed
        "manufacturer": "HP",
        "model": "EliteBook",
        "purchase_year": 2020,
        "cpu_model": "Intel Core i7",
        "cpu_cores": 4,
        "ram_gb": 8,
        "storage_gb": 256,
        "storage_type": "nvme_ssd",
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "department": "Library",
        "location": "Floor 2",
    }
    response = client.post("/api/v1/assets", json=invalid_enum_payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_newly_created_asset_appears_in_asset_retrieval(client):
    """Test 4: Newly created asset appears in both list and detail retrieval endpoints."""
    payload = {
        "asset_id": "INST-DESK-010",
        "serial_number": "SN-INTAKE-RETRIEVE-010",
        "device_type": "desktop",
        "manufacturer": "HP",
        "model": "EliteDesk 800 G6",
        "purchase_year": 2021,
        "cpu_model": "Intel Core i7-10700",
        "cpu_cores": 8,
        "ram_gb": 32,
        "storage_gb": 1024,
        "storage_type": "nvme_ssd",
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "department": "AI Research Lab",
        "location": "Research Block C",
    }
    create_res = client.post("/api/v1/assets", json=payload)
    assert create_res.status_code == status.HTTP_201_CREATED

    # Detail GET
    get_res = client.get("/api/v1/assets/INST-DESK-010")
    assert get_res.status_code == status.HTTP_200_OK
    data = get_res.json()
    assert data["asset_id"] == "INST-DESK-010"
    assert data["model"] == "EliteDesk 800 G6"

    # List GET
    list_res = client.get("/api/v1/assets")
    assert list_res.status_code == status.HTTP_200_OK
    asset_ids = [a["asset_id"] for a in list_res.json()]
    assert "INST-DESK-010" in asset_ids


def test_newly_created_unsanitized_asset_remains_security_blocked(client):
    """Test 5: Newly created unsanitized asset is deterministically blocked from direct reuse."""
    payload = {
        "asset_id": "INST-LAP-UNSECURE",
        "serial_number": "SN-UNSECURE-STORAGE-001",
        "device_type": "laptop",
        "manufacturer": "Lenovo",
        "model": "ThinkPad X1 Carbon",
        "purchase_year": 2022,
        "cpu_model": "Intel Core i7-1165G7",
        "cpu_cores": 4,
        "ram_gb": 16,
        "storage_gb": 512,
        "storage_type": "nvme_ssd",
        "storage_present": True,
        "sanitization_status": "pending",
        "sanitization_verified": False,
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "department": "Finance Department",
        "location": "Admin Block - Room 101",
    }
    create_res = client.post("/api/v1/assets", json=payload)
    assert create_res.status_code == status.HTTP_201_CREATED

    # Run decision evaluation on newly registered asset
    eval_res = client.post("/api/v1/evaluate", json={"asset_id": "INST-LAP-UNSECURE"})
    assert eval_res.status_code == status.HTTP_200_OK
    eval_data = eval_res.json()

    # Security gate MUST be blocked for direct reuse
    security_gate = eval_data["security_gate"]
    assert security_gate["direct_reuse_permitted"] is False
    assert len(security_gate["blocking_reasons"]) >= 1
    assert "DIRECT_REUSE" not in eval_data["eligible_pathways"]


def test_default_asset_intake_defaults_to_unverified_and_blocks_direct_reuse(client):
    """
    Task 3 Regression: Newly registered asset with storage defaults to unverified sanitization
    and cannot be approved for DIRECT_REUSE.
    """
    payload = {
        "asset_id": "INST-LAP-DEFAULT-001",
        "serial_number": "SN-INTAKE-DEF-001",
        "device_type": "laptop",
        "manufacturer": "Dell",
        "model": "Latitude 7420",
        "purchase_year": 2022,
        "cpu_model": "Intel Core i7-1185G7",
        "cpu_cores": 4,
        "ram_gb": 16,
        "storage_gb": 512,
        "storage_type": "nvme_ssd",
        "storage_present": True,
        # Omit all sanitization fields to verify defaults
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "department": "Computer Science & Engineering",
        "location": "Main Lab",
    }
    create_res = client.post("/api/v1/assets", json=payload)
    assert create_res.status_code == status.HTTP_201_CREATED
    asset = create_res.json()

    # Verify safe defaults
    assert asset["sanitization_verified"] is False
    assert asset["sanitization_status"] == "pending"
    assert asset["sanitization_method"] == "none"
    assert asset["verification_reference"] is None
    assert asset["verified_by"] is None

    # Evaluate asset
    eval_res = client.post("/api/v1/evaluate", json={"asset_id": "INST-LAP-DEFAULT-001"})
    assert eval_res.status_code == status.HTTP_200_OK
    eval_data = eval_res.json()
    assert eval_data["security_gate"]["direct_reuse_permitted"] is False
    assert "DIRECT_REUSE" not in eval_data["eligible_pathways"]
    rec_id = eval_data["recommendation_id"]

    # Attempt to override to DIRECT_REUSE must fail with HTTP 403
    override_res = client.post(
        f"/api/v1/approvals/{rec_id}/decide",
        json={
            "decision": "OVERRIDE",
            "chosen_pathway": "DIRECT_REUSE",
            "chosen_destination": "INTERNAL_REDEPLOYMENT",
            "actor": "auditor_1",
            "approval_notes": "Attempting unauthorized override without verified sanitization",
        },
    )
    assert override_res.status_code == status.HTTP_403_FORBIDDEN
    assert "MANDATORY SECURITY GATE VIOLATION" in override_res.json()["detail"]
