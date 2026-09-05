import pytest
from fastapi import status
from backend.app.core.enums import (
    CircularPathway,
    DecisionObjective,
    ConfidenceLevel,
    SanitizationStatus,
    SanitizationMethod,
    PhysicalCondition,
    FunctionalStatus,
    ComputeTier,
)
from backend.app.models.asset import Asset
from backend.app.schemas.ai import AIAssessmentResult, ScenarioItem, RAGSourceItem
from backend.app.services.ai.mock_granite import MockGraniteProvider
from backend.app.services.ai.rag_engine import rag_engine
from backend.app.services.scenario_engine import build_scenario_comparison
from backend.app.services.economics_engine import evaluate_economics


def test_1_llm_provider_interface_and_schema():
    """Test 1: LLMProvider interface produces typed AIAssessmentResult and recommendation schema."""
    provider = MockGraniteProvider()
    context = {
        "asset": {
            "asset_id": "TEST-LAP-01",
            "device_type": "laptop",
            "model": "ThinkPad T490",
            "known_issues": ["sticking_key"],
            "functional_status": "minor_defect",
            "physical_condition": "grade_b",
        },
        "capability_profile": type("Cap", (), {"compute_tier": ComputeTier.MID})(),
        "economics": {"economic_viability_flag": "HIGHLY_VIABLE", "estimated_repair_cost": 2100.0},
    }
    assessment = provider.assess_asset(context)
    assert isinstance(assessment, AIAssessmentResult)
    assert assessment.repairability in ("HIGH", "MODERATE", "LOW", "IMPRACTICAL")
    assert assessment.repurpose_potential in ("HIGH", "MODERATE", "LOW")
    assert len(assessment.possible_roles) > 0


def test_2_structured_ai_response_validation(client):
    """Test 2: Full API evaluation returns validated AI assessment structure."""
    asset_payload = {
        "serial_number": "SN-AI-TEST-02",
        "device_type": "laptop",
        "manufacturer": "Dell",
        "model": "Latitude 7490",
        "purchase_year": 2020,
        "cpu_model": "Intel Core i5-8250U",
        "cpu_cores": 4,
        "ram_gb": 16,
        "storage_gb": 512,
        "storage_type": "nvme_ssd",
        "storage_present": True,
        "sanitization_method": "crypto_erase",
        "sanitization_status": "completed",
        "sanitization_verified": True,
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "department": "CS",
        "location": "Lab",
    }
    res = client.post("/api/v1/assets", json=asset_payload)
    asset_id = res.json()["asset_id"]

    eval_res = client.post("/api/v1/evaluate", json={"asset_id": asset_id})
    assert eval_res.status_code == status.HTTP_200_OK
    data = eval_res.json()

    ai_ass = data["ai_assessment"]
    assert ai_ass is not None
    assert "condition_assessment" in ai_ass
    assert "repairability" in ai_ass
    assert "repurpose_potential" in ai_ass
    assert "reasoning_summary" in ai_ass
    assert isinstance(ai_ass["possible_roles"], list)
    assert len(ai_ass["possible_roles"]) >= 1


def test_3_ai_cannot_modify_deterministic_economics(client):
    """Test 3: AI recommendations faithfully reflect exact deterministic formulas without deviation."""
    asset_payload = {
        "serial_number": "SN-AI-TEST-03",
        "device_type": "laptop",
        "manufacturer": "HP",
        "model": "EliteBook 840",
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
        "physical_condition": "grade_b",
        "functional_status": "minor_defect",
        "known_issues": ["sticking_key"],
        "department": "Admin",
        "location": "Office",
    }
    res = client.post("/api/v1/assets", json=asset_payload)
    asset_id = res.json()["asset_id"]

    # Calculate expected deterministic cost
    expected_econ = evaluate_economics(
        device_type="laptop",
        purchase_year=2019,
        physical_condition=PhysicalCondition.GRADE_B,
        functional_status=FunctionalStatus.MINOR_DEFECT,
        known_issues=["sticking_key"],
    )

    eval_res = client.post("/api/v1/evaluate", json={"asset_id": asset_id})
    data = eval_res.json()

    # The returned economics must match the formulaic engine exactly
    assert data["economics"]["estimated_repair_cost"] == expected_econ.estimated_repair_cost
    assert data["economics"]["estimated_residual_value"] == expected_econ.estimated_residual_value
    assert data["economics"]["economic_viability_flag"] == expected_econ.economic_viability_flag


def test_4_rag_source_metadata_preservation():
    """Test 4: RAG retrieval preserves source_title, source_id, excerpt, category, and relevance_score."""
    sources = rag_engine.retrieve_relevant_knowledge(query="keyboard sticking key repair", top_k=2)
    assert len(sources) > 0
    s = sources[0]
    assert isinstance(s, RAGSourceItem)
    assert s.source_id.startswith("REPAIR-") or s.source_id.startswith("NIST-") or s.source_id.startswith("CIRCULAR-")
    assert len(s.source_title) > 0
    assert len(s.excerpt) > 20
    assert s.category in ("repair_guidance", "media_sanitization", "circular_electronics", "ewaste_handling")
    assert 0.0 <= s.relevance_score <= 1.0


def test_5_ineligible_pathway_excluded_before_ai_ranking(client):
    """Test 5: Catastrophically broken asset never has DIRECT_REUSE or REPAIR in evaluated scenarios."""
    asset_payload = {
        "serial_number": "SN-AI-TEST-05",
        "device_type": "desktop",
        "manufacturer": "Dell",
        "model": "OptiPlex",
        "purchase_year": 2015,
        "cpu_model": "Intel Core i3-4150",
        "cpu_cores": 2,
        "ram_gb": 4,
        "storage_gb": 500,
        "storage_type": "hdd",
        "storage_present": True,
        "sanitization_method": "none",
        "sanitization_status": "pending",
        "sanitization_verified": False,
        "physical_condition": "damaged",
        "functional_status": "non_functional",
        "known_issues": ["motherboard_failure", "chassis_cracked"],
        "department": "Store",
        "location": "Basement",
    }
    res = client.post("/api/v1/assets", json=asset_payload)
    asset_id = res.json()["asset_id"]

    eval_res = client.post("/api/v1/evaluate", json={"asset_id": asset_id})
    data = eval_res.json()

    scenario_pathways = [s["pathway"] for s in data["scenario_comparison"]]
    assert "DIRECT_REUSE" not in scenario_pathways
    assert "REPAIR" not in scenario_pathways
    assert data["recommended_pathway"] in ("COMPONENT_RECOVERY", "RECYCLE")


def test_6_security_blocked_pathway_excluded_from_scenarios(client):
    """Test 6: Asset with unverified drive excludes DIRECT_REUSE from scenarios."""
    asset_payload = {
        "serial_number": "SN-AI-TEST-06",
        "device_type": "laptop",
        "manufacturer": "Lenovo",
        "model": "ThinkPad",
        "purchase_year": 2021,
        "cpu_model": "Intel Core i5-1135G7",
        "cpu_cores": 4,
        "ram_gb": 16,
        "storage_gb": 512,
        "storage_type": "nvme_ssd",
        "storage_present": True,
        "sanitization_method": "none",
        "sanitization_status": "pending",
        "sanitization_verified": False,  # UNVERIFIED
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "department": "CS",
        "location": "Lab",
    }
    res = client.post("/api/v1/assets", json=asset_payload)
    asset_id = res.json()["asset_id"]

    eval_res = client.post("/api/v1/evaluate", json={"asset_id": asset_id})
    data = eval_res.json()

    assert data["security_gate"]["direct_reuse_permitted"] is False
    assert "DIRECT_REUSE" not in data["eligible_pathways"]
    scenario_pathways = [s["pathway"] for s in data["scenario_comparison"]]
    assert "DIRECT_REUSE" not in scenario_pathways


def test_7_decision_objective_ranking_behavior(client):
    """Test 7: Comparing BALANCED, COST_FIRST, and SUSTAINABILITY_FIRST produces objective-driven scoring."""
    asset_payload = {
        "serial_number": "SN-AI-TEST-07",
        "device_type": "laptop",
        "manufacturer": "Dell",
        "model": "Latitude 5400",
        "purchase_year": 2019,
        "cpu_model": "Intel Core i5-8265U",
        "cpu_cores": 4,
        "ram_gb": 8,
        "storage_gb": 256,
        "storage_type": "sata_ssd",
        "storage_present": True,
        "sanitization_method": "overwrite_single_pass",
        "sanitization_status": "completed",
        "sanitization_verified": True,
        "physical_condition": "grade_b",
        "functional_status": "minor_defect",
        "known_issues": ["sticking_key"],
        "department": "Civil",
        "location": "Survey",
    }
    res = client.post("/api/v1/assets", json=asset_payload)
    asset_id = res.json()["asset_id"]

    # Evaluate under COST_FIRST
    cost_res = client.post("/api/v1/evaluate", json={"asset_id": asset_id, "decision_objective": "COST_FIRST"})
    cost_data = cost_res.json()

    # Evaluate under SUSTAINABILITY_FIRST
    sust_res = client.post("/api/v1/evaluate", json={"asset_id": asset_id, "decision_objective": "SUSTAINABILITY_FIRST"})
    sust_data = sust_res.json()

    # Scenarios exist for both
    assert len(cost_data["scenario_comparison"]) >= 2
    assert len(sust_data["scenario_comparison"]) >= 2

    # Sustainability-first prioritizes repair or direct reuse life extension over cost minimization
    repair_sust_score = next(s["suitability_score"] for s in sust_data["scenario_comparison"] if s["pathway"] == "REPAIR")
    recycle_sust_score = next(s["suitability_score"] for s in sust_data["scenario_comparison"] if s["pathway"] == "RECYCLE")
    assert repair_sust_score > recycle_sust_score


def test_8_scenario_comparison_includes_all_eligible_pathways(client):
    """Test 8: Scenario comparison evaluates all eligible circular pathways for an asset."""
    asset_payload = {
        "serial_number": "SN-AI-TEST-08",
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
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "department": "CS",
        "location": "Lab",
    }
    res = client.post("/api/v1/assets", json=asset_payload)
    asset_id = res.json()["asset_id"]

    eval_res = client.post("/api/v1/evaluate", json={"asset_id": asset_id})
    data = eval_res.json()

    scenarios = data["scenario_comparison"]
    assert len(scenarios) == len(data["eligible_pathways"])
    for sc in scenarios:
        assert sc["pathway"] in data["eligible_pathways"]
        assert sc["suitability_score"] > 0
        assert sc["destination_action"] is not None
        assert sc["useful_life_extension_years"] >= 0.0
        assert sc["trade_offs"] is not None


def test_9_explanation_fields_complete(client):
    """Test 9: Output includes transparent 'Why this recommendation?', tradeoffs, and alternatives."""
    asset_payload = {
        "serial_number": "SN-AI-TEST-09",
        "device_type": "laptop",
        "manufacturer": "Asus",
        "model": "ExpertBook",
        "purchase_year": 2022,
        "cpu_model": "Intel Core i5-1135G7",
        "cpu_cores": 4,
        "ram_gb": 16,
        "storage_gb": 512,
        "storage_type": "nvme_ssd",
        "storage_present": True,
        "sanitization_method": "crypto_erase",
        "sanitization_status": "completed",
        "sanitization_verified": True,
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "department": "Library",
        "location": "Reading",
    }
    res = client.post("/api/v1/assets", json=asset_payload)
    asset_id = res.json()["asset_id"]

    eval_res = client.post("/api/v1/evaluate", json={"asset_id": asset_id})
    data = eval_res.json()

    assert len(data["why_this_recommendation"]) > 30
    assert len(data["key_factors"]) >= 2
    assert len(data["alternatives_considered"]) >= 1
    assert data["tradeoffs"] is not None
    assert len(data["evidence_sources"]) >= 1


def test_10_confidence_and_uncertainty_fields_present(client):
    """Test 10: Confidence level, explicit assumptions, and uncertainties are populated."""
    asset_payload = {
        "serial_number": "SN-AI-TEST-10",
        "device_type": "desktop",
        "manufacturer": "HP",
        "model": "EliteDesk",
        "purchase_year": 2019,
        "cpu_model": "Intel Core i7-8700",
        "cpu_cores": 6,
        "ram_gb": 32,
        "storage_gb": 512,
        "storage_type": "nvme_ssd",
        "storage_present": True,
        "sanitization_method": "crypto_erase",
        "sanitization_status": "completed",
        "sanitization_verified": True,
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "department": "Physics",
        "location": "Lab 4",
    }
    res = client.post("/api/v1/assets", json=asset_payload)
    asset_id = res.json()["asset_id"]

    eval_res = client.post("/api/v1/evaluate", json={"asset_id": asset_id})
    data = eval_res.json()

    assert data["confidence_level"] in ("HIGH", "MEDIUM", "LOW", "PROVISIONAL")
    assert isinstance(data["assumptions"], list) and len(data["assumptions"]) > 0
    assert isinstance(data["uncertainties"], list) and len(data["uncertainties"]) > 0


def test_11_nist_sp_800_88_r2_metadata_and_security_gate_invariance(client):
    """Test 11: RAG retrieves updated NIST SP 800-88 Rev. 2 (Sept 2025) metadata, but knowledge presence never bypasses security gate."""
    # 1. Verify RAG retrieval of updated NIST Rev. 2 metadata
    rag_engine.load_knowledge_base()
    sources = rag_engine.retrieve_relevant_knowledge(query="nist_sp_800_88_r2 sanitization purge crypto_erase", category="media_sanitization", top_k=2)
    assert len(sources) >= 1
    nist_doc = next((s for s in sources if s.source_id == "NIST-SP-800-88-R2"), None)
    assert nist_doc is not None
    assert "NIST SP 800-88 Rev. 2" in nist_doc.source_title
    assert "September 2025" in nist_doc.source_title
    assert "Clear, Purge, and Destroy" in nist_doc.excerpt
    assert nist_doc.category == "media_sanitization"

    # 2. Invariance check: presence of NIST guidance in RAG does NOT grant sanitization clearance
    asset_payload = {
        "serial_number": "SN-NIST-R2-GATE",
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
        "sanitization_method": "none",
        "sanitization_status": "pending",
        "sanitization_verified": False,  # UNVERIFIED
        "physical_condition": "grade_a",
        "functional_status": "fully_functional",
        "department": "CS",
        "location": "Lab 1",
    }
    res = client.post("/api/v1/assets", json=asset_payload)
    asset_id = res.json()["asset_id"]

    eval_res = client.post("/api/v1/evaluate", json={"asset_id": asset_id})
    data = eval_res.json()

    # Verify that security gate strictly blocks reuse despite NIST RAG source presence
    assert data["security_gate"]["direct_reuse_permitted"] is False
    assert "DIRECT_REUSE" not in data["eligible_pathways"]
    assert "DIRECT_REUSE" not in [s["pathway"] for s in data["scenario_comparison"]]

