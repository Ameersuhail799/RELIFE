# IBM BOB Integration & Development Workflow Documentation

## 1. Executive Summary & Internship Context

In alignment with the AI-for-Sustainability internship specification (Primary SDG: **UN SDG 12 — Responsible Consumption and Production**), **IBM BOB** (Build Orchestration & Business-logic / Developer Agent) was genuinely incorporated as an AI pair-architect and development assistant throughout the engineering lifecycle of ReLife.

Rather than delegating autonomous or unverified decisions to external models, IBM BOB was utilized in a disciplined developer-in-the-loop workflow:
- Formulating the architectural boundary separating deterministic compliance gates from generative intelligence.
- Structuring mathematical optimization formulations and data schemas for multi-attribute circular scenario evaluation.
- Curating and formatting authoritative knowledge base references for Retrieval-Augmented Generation (RAG).
- Scaffolding test suites to verify that generative components cannot mutate economic figures, lifecycle states, or security validations.

---

## 2. Granular Development Tasks Involving IBM BOB

### Task 1: Architectural Separation of Concerns & Security Gate (Milestone 1)
- **Development Task**: Define the security gate and lifecycle transitions for decommissioned institutional assets.
- **Why BOB Was Used**: To ensure security sanitization is treated as a non-bypassable entry barrier rather than a subjective or generative rating.
- **What Output / Code / Workflow Was Produced or Refined**:
  - BOB proposed the isolation of 6 distinct data sanitization audit fields: `storage_present`, `sanitization_method`, `sanitization_status`, `sanitization_verified`, `verification_reference`, `verified_at`, and `verified_by`.
  - BOB scaffolded the deterministic gate logic blocking `DIRECT_REUSE`, `DONATION`, and `RESALE` when storage is unverified.
- **What Was Accepted / Modified by Developer**:
  - *Accepted*: The 6-field audit structure and the strict HTTP 403 programmatic rejection of human overrides attempting to bypass unverified storage.
  - *Modified/Corrected by Developer*: BOB initially suggested an enum state `sanitized_nist800_88`. The developer strictly rejected this, requiring clean lifecycle states (`REGISTERED` → `ASSESSING` → `ASSESSED` → `PENDING_DECISION` → `PROCESSING` → `COMPLETED` → `CLOSED`) and establishing that NIST compliance cannot be inferred from a single label.
- **Where Resulting Artifact Exists**:
  - Implementation: `backend/app/services/security_gate.py`, `backend/app/models/asset.py`
  - Verification: `backend/tests/test_security_gate.py`, `backend/tests/test_vertical_slice.py`
  - Specification: `docs/ai_logic_separation.md`

---

### Task 2: Multi-Dimensional Demand Matching & Allocation (Milestone 2)
- **Development Task**: Match decommissioned IT inventory against active institutional demand profiles (departments, computer labs, staff roles).
- **Why BOB Was Used**: To formulate an algorithmic matching function that ranks assets across multiple technical dimensions (compute tier, CPU cores, RAM, storage type, mobility, OS compatibility) with fulfillment priority ordering.
- **What Output / Code / Workflow Was Produced or Refined**:
  - Algorithmic scoring evaluating match fit from 0 to 100%.
  - Demand fulfillment logic that tracks remaining requested quantities and avoids double allocation.
- **What Was Accepted / Modified by Developer**:
  - *Accepted*: Multi-attribute scoring logic and priority-ordered fulfillment (`HIGH` > `MEDIUM` > `LOW`).
  - *Modified/Corrected by Developer*: Enforced strict security and assessment pre-filtering so that matching runs only on assets cleared by the security gate and in `ASSESSED` state, preventing allocation of unverified or broken hardware.
- **Where Resulting Artifact Exists**:
  - Implementation: `backend/app/services/demand_matcher.py`, `backend/app/services/portfolio_service.py`
  - Data: `backend/data/simulated_demand.json`, `backend/data/simulated_assets.json`
  - Verification: `backend/tests/test_demand_and_portfolio.py`

---

### Task 3: Multi-Objective Scenario Optimization Matrix (Milestone 3)
- **Development Task**: Enable institutions to evaluate all eligible circular pathways under different organizational objectives (`BALANCED`, `SUSTAINABILITY_FIRST`, `COST_FIRST`, `UTILIZATION_FIRST`).
- **Why BOB Was Used**: To design a transparent multi-attribute utility theory (MAUT) weighting model so decision trade-offs are explainable and mathematically reproducible rather than prompt-dependent.
- **What Output / Code / Workflow Was Produced or Refined**:
  - The explicit weight matrix:
    $$\text{Suitability Score} = 100 \times \left( w_{\text{cost}} \cdot \text{NormCost} + w_{\text{sustain}} \cdot \text{NormSustain} + w_{\text{demand}} \cdot \text{NormDemand} + w_{\text{readiness}} \cdot \text{NormReadiness} \right)$$
  - Pydantic schema contracts for `ScenarioItem`, `ScenarioComparisonItem`, and `EvaluationResponse`.
- **What Was Accepted / Modified by Developer**:
  - *Accepted*: The 4 objective profiles and mathematical normalization formulas.
  - *Modified/Corrected by Developer*: Bound the scenario calculation strictly to the deterministic formulas (repair costs, residual value, carbon factor lookup) in `scenario_engine.py`, guaranteeing that the LLM cannot alter scores or financial figures.
- **Where Resulting Artifact Exists**:
  - Implementation: `backend/app/services/scenario_engine.py`, `backend/app/schemas/ai.py`
  - Verification: `backend/tests/test_ai_and_scenarios.py` (Tests 7 and 8)

---

### Task 4: Authoritative RAG Knowledge Base & Attribution (Milestone 3 & 3.1)
- **Development Task**: Ground the AI recommendation narratives and technical explanations in authoritative circular economy, sanitization, and hardware repair standards.
- **Why BOB Was Used**: To prevent hallucinations and ensure recommendations cite verified industry guidelines with preserved source attribution metadata.
- **What Output / Code / Workflow Was Produced or Refined**:
  - Structured JSON knowledge schemas under `backend/data/knowledge_base/`:
    - `NIST-SP-800-88-R2`: *NIST SP 800-88 Rev. 2: Guidelines for Media Sanitization (Published September 2025)* (Clear, Purge, Destroy criteria, NVMe/SSD cryptographic erase protocols, technician verification).
    - `REPAIR-KB-001` through `004`: iFixit & enterprise service manual guidance for keyboards, thermal repasting, battery degradation, and SSD upgrades.
    - `CIRCULAR-SDG12-001`: UNEP / ITU ICT embodied carbon avoidance guidelines.
    - `WEEE-DIR-2012-19`: European WEEE Directive and Basel Convention hazardous materials and recycling hierarchy.
  - RAG retrieval engine (`rag_engine.py`) indexing documents and returning structured `RAGSourceItem` objects with relevance scores.
- **What Was Accepted / Modified by Developer**:
  - *Accepted*: Category-based indexing, normalized token overlap scoring, and structured output.
  - *Modified/Corrected by Developer (Milestone 3.1 Hardening)*: Upgraded NIST reference from Rev. 1 to NIST SP 800-88 Rev. 2 (September 2025). Re-verified all source metadata to eliminate ungrounded claims and confirmed that the mere presence of a knowledge source never implies NIST compliance without explicit technician verification (`sanitization_verified == True`).
- **Where Resulting Artifact Exists**:
  - Knowledge Base: `backend/data/knowledge_base/*.json`
  - Engine: `backend/app/services/ai/rag_engine.py`
  - Verification: `backend/tests/test_ai_and_scenarios.py` (Tests 4 and 11)

---

### Task 5: Modular Foundation Model Integration (IBM Granite)
- **Development Task**: Implement the LLM inference provider for IBM Granite (`ibm/granite-3-8b-instruct`) on IBM watsonx.ai, while supporting seamless offline testability.
- **Why BOB Was Used**: To design the provider contract and structured JSON prompt templates for contextual condition interpretation, trade-off articulation, and alternative pathway reasoning.
- **What Output / Code / Workflow Was Produced or Refined**:
  - `LLMProvider` abstract base class defining `assess_asset` and `generate_recommendation`.
  - `IBMGraniteProvider` targeting watsonx.ai endpoints with fallback mechanics.
  - `MockGraniteProvider` providing deterministic, schema-compliant responses for CI test suites.
- **What Was Accepted / Modified by Developer**:
  - *Accepted*: The structured response schema and explainability fields (`why_this_recommendation`, `key_factors`, `alternatives_considered`, `tradeoffs`, `assumptions`, `uncertainties`).
  - *Modified/Corrected by Developer*: Made mock provider completely deterministic and independent of network connectivity, ensuring 100% reproducible testing.
- **Where Resulting Artifact Exists**:
  - Implementation: `backend/app/services/ai/base.py`, `backend/app/services/ai/granite_provider.py`, `backend/app/services/ai/mock_granite.py`
  - Verification: `backend/tests/test_ai_and_scenarios.py` (Tests 1, 2, 3, 9, 10)

---

## 3. Decision-Objective Weight Matrix Summary

| Objective | Cost Weight ($w_{\text{cost}}$) | Sustainability ($w_{\text{sustain}}$) | Demand Fit ($w_{\text{demand}}$) | Readiness ($w_{\text{readiness}}$) | Primary Optimization Target |
|---|---|---|---|---|---|
| **`BALANCED`** | **0.30** | **0.30** | **0.25** | **0.15** | Parity between economic spend, carbon avoided, and campus lab fulfillment. |
| **`SUSTAINABILITY_FIRST`** | **0.15** | **0.55** | **0.20** | **0.10** | Maximizes extended working life and e-waste diversion regardless of repair spend. |
| **`COST_FIRST`** | **0.60** | **0.10** | **0.10** | **0.20** | Minimizes institutional capital expenditure; heavily penalizes component replacements. |
| **`UTILIZATION_FIRST`** | **0.15** | **0.10** | **0.50** | **0.25** | Prioritizes immediate hardware redeployment to satisfy open classroom/lab quotas. |

---

## 4. Verification & Testing Evidence

All BOB-orchestrated components and developer modifications are verified through comprehensive automated pytest suites:
- Security gate verification (`backend/tests/test_security_gate.py`): 7 tests
- End-to-end vertical slice (`backend/tests/test_vertical_slice.py`): 3 tests
- Demand matching & portfolio aggregation (`backend/tests/test_demand_and_portfolio.py`): 10 tests
- AI, RAG, and scenario intelligence (`backend/tests/test_ai_and_scenarios.py`): 11 tests

**Total Test Suite: 31 tests passing (100% pass rate)**.
