# ReLife — Comprehensive Repository Evidence Audit

> **Internship Track:** 1M1B – IBM SkillsBuild AI for Sustainability Virtual Internship (July–September 2026)  
> **Student / Author:** Ameer Suhail ([Ameersuhail799/RELIFE](https://github.com/Ameersuhail799/RELIFE.git))  
> **Primary SDG Alignment:** [UN SDG 12: Responsible Consumption and Production](https://sdgs.un.org/goals/goal12) (Targets 12.2, 12.5)  
> **System Classification:** Explainable, Security-Aware, Demand-Aware AI Orchestration Layer for Institutional Circular IT Asset Decisions  
> **Validated Engineering Baseline:** Git Commit `4a2d058`, Git Tag `milestone-4`, Branch `main`, Clean Working Tree  

---

## 1. Project Overview
- **Core Concept:** ReLife transforms institutional IT hardware retirement from an ad-hoc disposal process into a structured, auditable, and mathematically grounded second-life decision pipeline.
- **Fundamental Paradigm Shift:**
  $$\text{ASSET} \longrightarrow \text{CAPABILITY} \longrightarrow \text{NEED} + \text{SECURITY} + \text{ECONOMICS} + \text{IMPACT} \longrightarrow \text{CIRCULAR DECISION}$$
- **Primary Governance Axiom:**
  $$\text{AI RECOMMENDS} \quad\cdot\quad \text{RULES ENFORCE SAFETY} \quad\cdot\quad \text{HUMANS APPROVE}$$
- **Submission Evidence Inventory:** This evidence pack comprises **12 structured, auditable documents**:
  1. [`docs/final_submission_evidence.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/final_submission_evidence.md): Comprehensive repository evidence audit across 23 sections.
  2. [`docs/ibm_bob_evidence.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/ibm_bob_evidence.md): Genuine IBM BOB development usage log and developer oversight evidence.
  3. [`docs/ai_implementation_evidence.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/ai_implementation_evidence.md): IBM Granite watsonx provider, mock fallback, and safety boundaries.
  4. [`docs/final_demo_scenarios.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/final_demo_scenarios.md): Step-by-step walkthrough of Scenarios A, B (HTTP 403), and C.
  5. [`docs/final_screenshot_plan.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/final_screenshot_plan.md): Visual evidence matrix mapping 11 key screenshots to presentation slides.
  6. [`docs/final_demo_script.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/final_demo_script.md): Timed presenter walkthrough with verbatim narration.
  7. [`docs/responsible_ai_submission.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/responsible_ai_submission.md): Responsible AI defense across Fairness, Transparency, Ethics, and Privacy.
  8. [`docs/impact_submission_evidence.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/impact_submission_evidence.md): Traceable methodology for portfolio carbon, e-waste, and savings.
  9. [`docs/limitations.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/limitations.md): Transparent prototype boundaries, modeling assumptions, and roadmap.
  10. [`docs/final_presentation_outline.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/final_presentation_outline.md): 14-slide presentation deck outline for the 1M1B rubric.
  11. [`docs/evaluator_qna.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/evaluator_qna.md): 20 oral defense questions and evidence-based answers.
  12. [`docs/internship_requirement_matrix.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/internship_requirement_matrix.md): Traceability matrix mapping official 1M1B requirements.
- **Repository Evidence:**
  - System Specification: [`docs/architecture.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/architecture.md)
  - Core Separation Boundary: [`docs/ai_logic_separation.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/ai_logic_separation.md)
  - Application Entry Point: [`backend/app/main.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/main.py)
  - Frontend Application Shell: [`frontend/src/App.tsx`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/frontend/src/App.tsx)

---

## 2. Problem Statement
- **Context:** Higher education institutions, research facilities, and school systems decommission hundreds of desktop towers, laptops, and displays annually due to fixed 3- to 5-year accounting depreciation cycles rather than actual hardware obsolescence.
- **Direct Consequences:**
  1. *Premature E-Waste Generation:* Salvageable machines are scrapped or downcycled prematurely.
  2. *Data Security Vulnerabilities:* Storage drives risk leaking sensitive institutional or student data if reassigned without verified sanitization.
  3. *Redundant Capital Expenditure:* IT departments purchase new entry-level equipment while dormant, salvageable hardware sits in campus storage.
- **Repository Evidence:**
  - Problem framing & rationale: [`README.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/README.md#L10-L19)
  - Simulated campus asset inventory representing common decommissioning issues: [`backend/data/simulated_assets.json`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/data/simulated_assets.json)

---

## 3. Why This Is a Sustainability Problem
- **Embodied Carbon Impact:** Manufacturing, rare-earth mineral extraction, and semiconductor fabrication account for 75% to 85% of a computer's total lifecycle greenhouse gas emissions.
- **Operational Longevity:** Extending an institutional laptop's lifespan from 3 to 6 years reduces annualized lifecycle carbon emissions by ~45% (UNEP/ITU circular electronics data).
- **Hazardous Material Diversion:** Consumer electronics contain lead, brominated flame retardants, and mercury; premature landfilling creates long-term ecotoxicity.
- **Repository Evidence:**
  - Environmental Knowledge Base: [`backend/data/knowledge_base/circular_electronics.json`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/data/knowledge_base/circular_electronics.json) (Source: `CIRCULAR-SDG12-001`)
  - Hazardous E-Waste Handling: [`backend/data/knowledge_base/ewaste_handling.json`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/data/knowledge_base/ewaste_handling.json) (Source: `WEEE-DIR-2012-19`)
  - Environmental Impact Calculator: [`backend/app/services/impact_engine.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/impact_engine.py)

---

## 4. SDG Alignment
- **Primary Goal — UN SDG 12: Responsible Consumption and Production**
  - *Target 12.2:* Sustainable management and efficient use of natural resources (diverting raw semiconductor and copper demand).
  - *Target 12.5:* Substantially reduce waste generation through prevention, reduction, recycling, and reuse.
- **Secondary Alignment:**
  - *SDG 13 (Climate Action):* Avoidance of Scope 3 embodied greenhouse gas emissions.
  - *SDG 9 (Industry, Innovation & Infrastructure):* Resilient institutional infrastructure via refurbished computing capacity.
- **Repository Evidence:**
  - Global badge and SDG definition in UI: [`frontend/src/components/layout/AppLayout.tsx`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/frontend/src/components/layout/AppLayout.tsx#L59-L62)
  - Dedicated sustainability interface: [`frontend/src/pages/ImpactCenter.tsx`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/frontend/src/pages/ImpactCenter.tsx)

---

## 5. Target Users
- **Campus Sustainability & ESG Officers:** Requiring transparent, auditable Scope 3 emission avoidance calculations and circular retention percentages.
- **University IT Asset Managers & Technicians:** Requiring quick triage of physical condition, repair cost viability, and strict data sanitization compliance.
- **Departmental Lab Administrators:** Seeking compatible hardware allocations for teaching labs, Linux workstations, or IoT gateways without capital outlays.
- **Surplus Property & Disposition Approvers:** Responsible officers authorizing final external donations, component harvesting, or certified WEEE recycling.
- **Repository Evidence:**
  - Multi-stakeholder UI layout and filters: [`frontend/src/pages/ApprovalCenter.tsx`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/frontend/src/pages/ApprovalCenter.tsx)
  - Institutional Demand Profiles: [`backend/data/simulated_demand.json`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/data/simulated_demand.json)

---

## 6. Existing / Current Problem Gap
- **Manual Spreadsheet Triage:** Institutional IT disposal relies on unstructured Excel spreadsheets lacking standardized condition models or capability mapping.
- **All-or-Nothing Scrapping:** Devices with minor defects (e.g. sticking keycaps or thermal dust buildup) are classified as "broken" and scrapped entirely.
- **Disconnected Internal Demand:** Surplus IT units remain unaware of active equipment requisitions in adjacent departments or student computer clubs.
- **Opaque Compliance:** Lack of an immutable chronological audit trail linking sanitization certificates to disposal authorizations.
- **Repository Evidence:**
  - Automated Capability Extraction: [`backend/app/services/capability_service.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/capability_service.py)
  - Institutional Demand Matcher: [`backend/app/services/demand_matcher.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/demand_matcher.py)

---

## 7. Why AI Is Useful (And Why Determinism Must Bound It)
- **Where AI Adds High Value:**
  - Translates messy technician notes (e.g. *"fan whines, battery swollen, keyboard missing F4"*) into structured fault severities.
  - Generates creative repurposing concepts (e.g. converting a laptop with a cracked display into a headless Linux IoT gateway).
  - Synthesizes multi-attribute trade-offs into plain-language rationales for institutional approvers.
- **Where AI Must NOT Be Autonomous:**
  - *Data sanitization verification:* Must be evaluated by a strict boolean check, never by an LLM prompt.
  - *Financial and carbon math:* Must be calculated deterministically via validated equations.
  - *Execution authority:* All state changes require human authorization.
- **Repository Evidence:**
  - AI Boundary Specification: [`docs/ai_logic_separation.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/ai_logic_separation.md#L30-L55)
  - Deterministic Calculation Invariance Test: [`backend/tests/test_ai_and_scenarios.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/tests/test_ai_and_scenarios.py#L42-L68) (`test_3_ai_cannot_modify_deterministic_economics`)

---

## 8. AI Components Actually Implemented
1. **Contextual Asset Assessment Engine:** Evaluates hardware specifications, defect severity, physical grade, and maps to repairability rating.
2. **Retrieval-Augmented Generation (RAG) Engine:** Indexes authoritative engineering and circular standards, retrieving top-relevant chunks based on device condition and defect keywords.
3. **Multi-Objective Explainability Generator:** Explains why a specific pathway was ranked #1 under a chosen objective (`BALANCED`, `SUSTAINABILITY_FIRST`, `COST_FIRST`, `UTILIZATION_FIRST`) and identifies explicit trade-offs.
- **Repository Evidence:**
  - Assessment schemas: [`backend/app/schemas/ai.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/schemas/ai.py)
  - Offline Mock Granite Provider: [`backend/app/services/ai/mock_granite.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/ai/mock_granite.py)
  - RAG Retrieval Service: [`backend/app/services/ai/rag_engine.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/ai/rag_engine.py)

---

## 9. IBM Technologies Actually Used
1. **IBM Granite Foundation Model Integration (`ibm/granite-3-8b-instruct`):**
   - Implemented via the `IBMGraniteProvider` class targeting IBM watsonx.ai REST endpoints.
   - Configured with environment variables (`WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, `WATSONX_URL`).
   - Fallback offline provider ensures 100% CI reproducibility and zero dependency on live cloud credentials during testing.
2. **IBM BOB (Build Orchestration & Business-logic Agent):**
   - Used as an AI pair architect and scaffolding assistant during Milestone 1, 2, 3, and 3.1.
- **Repository Evidence:**
  - Granite provider code: [`backend/app/services/ai/granite_provider.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/ai/granite_provider.py)
  - BOB engineering history: [`docs/ibm_bob_workflow.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/ibm_bob_workflow.md)

---

## 10. RAG Implementation
- **Architecture:** Lightweight local keyword and token-overlap retrieval engine indexing structured JSON documents with preserved citation metadata.
- **Knowledge Sources:**
  - `NIST-SP-800-88-R2`: NIST SP 800-88 Rev. 2 Guidelines for Media Sanitization (Sep 2025).
  - `SEC-SOP-002`: Institutional Storage Disposition & Chain of Custody SOP.
  - `CIRCULAR-SDG12-001`: UNEP / ITU Circular Economy Strategies for ICT Equipment.
  - `REPURPOSE-SOP-005`: Open Source Campus Lab Hardware Repurposing Guidelines.
  - `WEEE-DIR-2012-19`: EU WEEE Directive & Basel Convention Compliance Framework.
  - `INST-SURPLUS-003`: University Sustainable Surplus Asset Disposition Policy.
  - `REPAIR-KB-001` through `004`: Modular repair guidance for keyboards, thermal repasting, batteries, and SSDs.
- **Repository Evidence:**
  - Knowledge Base Files: [`backend/data/knowledge_base/`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/data/knowledge_base/)
  - RAG Service: [`backend/app/services/ai/rag_engine.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/ai/rag_engine.py)
  - RAG Source Preservation Test: [`backend/tests/test_ai_and_scenarios.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/tests/test_ai_and_scenarios.py#L70-L84) (`test_4_rag_source_metadata_preservation`)

---

## 11. Granite Integration Details
- **Contract Interface:** [`backend/app/services/ai/base.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/ai/base.py) defines the abstract `LLMProvider` base class with:
  - `assess_asset(context: Dict[str, Any]) -> AIAssessmentResult`
  - `generate_recommendation(context: Dict[str, Any]) -> Dict[str, Any]`
- **Watsonx Provider:** [`backend/app/services/ai/granite_provider.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/ai/granite_provider.py) initializes `ibm/granite-3-8b-instruct`. Checks `is_configured()`, gracefully defaulting to `MockGraniteProvider` if API credentials are absent.
- **Strict Separation:** The provider receives pre-calculated economics and security status as read-only context. It cannot modify these figures.
- **Repository Evidence:**
  - Provider Contract Test: [`backend/tests/test_ai_and_scenarios.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/tests/test_ai_and_scenarios.py#L17-L28) (`test_1_llm_provider_interface_and_schema`)

---

## 12. IBM BOB Evidence
- **Genuine Usage:** IBM BOB was used across 5 distinct milestone tasks:
  1. *Milestone 1:* Designing the 6-field sanitization audit schema and security gate architecture.
  2. *Milestone 2:* Formulating the multi-attribute matching function for institutional demand.
  3. *Milestone 3:* Constructing the Multi-Attribute Utility Theory (MAUT) weighting matrix for scenario ranking.
  4. *Milestone 3 & 3.1:* Structuring the RAG knowledge schemas and upgrading to NIST SP 800-88 Rev. 2.
  5. *Milestone 4:* Designing the human-in-the-loop review state transition schemas.
- **Developer Review & Corrections:** The developer strictly corrected BOB proposals where necessary (e.g. rejecting an oversimplified `sanitized_nist800_88` state and enforcing deterministic security barriers).
- **Repository Evidence:**
  - Complete workflow & task log: [`docs/ibm_bob_workflow.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/ibm_bob_workflow.md)
  - Granular evidence breakdown: [`docs/ibm_bob_evidence.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/ibm_bob_evidence.md)

---

## 13. Deterministic Rule Engine
- **Economics Engine:**
  - Repair cost calculation based on defect type and parts lookup:
    $$\text{Repair Cost} = \text{Parts Outlay} + (\text{Labor Hours} \times \text{Hourly Rate})$$
  - Prototype residual value estimation based on base retail price, purchase year, and functional status.
  - Viability flag (`HIGHLY_VIABLE` if repair cost $< 0.5 \times$ residual value; `MARGINAL` if $< 0.85 \times$; else `UNECONOMIC`).
- **Pathway Eligibility Filter:** Programmatic validation verifying that an asset meets electrical, physical, and security criteria for each of the 6 canonical circular pathways.
- **Repository Evidence:**
  - Implementation: [`backend/app/services/economics_engine.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/economics_engine.py), [`backend/app/services/eligibility_service.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/eligibility_service.py)
  - Exclusion Test: [`backend/tests/test_ai_and_scenarios.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/tests/test_ai_and_scenarios.py#L86-L106) (`test_5_ineligible_pathway_excluded_before_ai_ranking`)

---

## 14. Deterministic Security Gate
- **Guidance Baseline:** NIST SP 800-88 Rev. 2 (Guidelines for Media Sanitization, September 2025).
- **Hard Rule:** If `storage_present == True` and `sanitization_verified == False`, the pathways `DIRECT_REUSE`, `DONATION`, and `RESALE` are unconditionally blocked.
- **Non-Bypassable Override Protection:** If a human user attempts to override an AI recommendation to `DIRECT_REUSE` on an unverified drive, the backend raises `SecurityGateViolationError` and returns **HTTP 403 Forbidden**.
- **Repository Evidence:**
  - Security Gate Implementation: [`backend/app/services/security_gate.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/security_gate.py)
  - API Enforcement in Approvals: [`backend/app/api/v1/approvals.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/api/v1/approvals.py#L36-L47)
  - Dedicated Automated Tests: [`backend/tests/test_security_gate.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/tests/test_security_gate.py) (7 passing tests)
  - Vertical Slice Negative Test: [`backend/tests/test_vertical_slice.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/tests/test_vertical_slice.py#L65-L101) (`test_scenario_b_repair_and_redeploy_with_override_security_gate_block`)

---

## 15. Scenario Comparison & Ranking Engine
- **Multi-Attribute Decision Formulation:**
  $$\text{Score} = 100 \times \left( w_{\text{cost}} \cdot N_{\text{cost}} + w_{\text{sustain}} \cdot N_{\text{sustain}} + w_{\text{demand}} \cdot N_{\text{demand}} + w_{\text{readiness}} \cdot N_{\text{readiness}} \right)$$
- **Supported Objectives:**
  - `BALANCED`: Equal weight distribution ($w_{\text{cost}}=0.30, w_{\text{sustain}}=0.30, w_{\text{demand}}=0.25, w_{\text{readiness}}=0.15$).
  - `SUSTAINABILITY_FIRST`: Prioritizes carbon preservation and life extension ($w_{\text{sustain}}=0.55$).
  - `COST_FIRST`: Minimizes direct financial repair outlay ($w_{\text{cost}}=0.60$).
  - `UTILIZATION_FIRST`: Prioritizes immediate departmental reallocation ($w_{\text{demand}}=0.50$).
- **Repository Evidence:**
  - Scenario Engine: [`backend/app/services/scenario_engine.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/scenario_engine.py)
  - Objective Ranking Test: [`backend/tests/test_ai_and_scenarios.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/tests/test_ai_and_scenarios.py#L129-L151) (`test_7_decision_objective_ranking_behavior`)
  - Interactive UI Surface: [`frontend/src/pages/ScenarioLab.tsx`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/frontend/src/pages/ScenarioLab.tsx)

---

## 16. Demand Matching Engine
- **Dimensionality:** Matches assets against institutional demand across:
  1. Minimum compute tier (`ENTRY`, `MID`, `PERFORMANCE`)
  2. Minimum RAM (GB)
  3. Minimum storage capacity & preferred storage type (NVMe SSD, SATA SSD, HDD)
  4. Mobility constraints (`PORTABLE`, `DESK_BOUND_OK`, `ANY`)
  5. OS compatibility (`WINDOWS_11_COMPLIANT`, `LINUX`, `CHROMEOS_FLEX`)
  6. Deterministic security gate pre-filtering
- **Repository Evidence:**
  - Matcher Implementation: [`backend/app/services/demand_matcher.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/demand_matcher.py)
  - Automated Tests: [`backend/tests/test_demand_and_portfolio.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/tests/test_demand_and_portfolio.py) (11 passing tests)
  - UI Interface: [`frontend/src/pages/DemandMatching.tsx`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/frontend/src/pages/DemandMatching.tsx)

---

## 17. Human Approval Workstation
- **Review Protocol:** Recommendations generated by the AI reasoning layer enter `PENDING_APPROVAL` status.
- **Allowed Actions:**
  - `APPROVE`: Authorizes the AI-recommended pathway and destination.
  - `OVERRIDE`: Allows the officer to select an alternate circular pathway, subject to mandatory backend security validation.
  - `REJECT`: Rejects recommendation back to `PENDING_DECISION`.
- **Mandatory Audit Trail:** Requires technician identification (`actor`) and audit justification notes.
- **Repository Evidence:**
  - Backend Service: [`backend/app/services/asset_service.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/asset_service.py#L296-L390) (`process_human_approval`)
  - API Controller: [`backend/app/api/v1/approvals.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/api/v1/approvals.py)
  - UI Surface: [`frontend/src/pages/ApprovalCenter.tsx`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/frontend/src/pages/ApprovalCenter.tsx)

---

## 18. Circular IT Asset Passport
- **Structure:** Append-only ledger tracking all physical and logical lifecycle transitions for each asset.
- **Chronological Events:**
  - `ASSET_REGISTERED`: Initial physical intake.
  - `SECURITY_GATE_EVALUATED`: Sanitization method, status, technician reference.
  - `RECOMMENDATION_GENERATED`: Proposed pathway, suitability score, confidence level.
  - `HUMAN_DECISION_APPROVED` / `OVERRIDDEN`: Officer identity, timestamp, audit justification.
- **Auditability:** Transparent SHA-256 cryptographic verification identifier and collapsible raw JSON inspection per event.
- **Repository Evidence:**
  - Passport Model: [`backend/app/models/passport.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/models/passport.py)
  - Passport Service: [`backend/app/services/passport_service.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/passport_service.py)
  - UI Surface: [`frontend/src/pages/CircularPassport.tsx`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/frontend/src/pages/CircularPassport.tsx)

---

## 19. SDG 12 Impact Center
- **Key Metrics Tracked (Provisional Estimates):**
  - Avoided Embodied Carbon ($kg\ \text{CO}_2\text{e}$)
  - Electronic Waste Diverted ($kg$)
  - Avoided Procurement Capital (₹)
  - Extended Hardware Operational Life (Years)
- **Portfolio Retention Funnel:** 3-stage funnel: Registered Fleet (30) $\rightarrow$ Assessed (22) $\rightarrow$ Circularly Retained (22).
- **Methodology & Assumptions Disclosure:** Slide-over drawer detailing LCA emission factors (Laptops: 247.5 kg $\text{CO}_2\text{e}$, Desktops: 420 kg $\text{CO}_2\text{e}$) citing Teehan & Kandlikar (2013) and Prakash et al. / Öko-Institut (2020).
- **Repository Evidence:**
  - Engine: [`backend/app/services/impact_engine.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/impact_engine.py)
  - API Controller: [`backend/app/api/v1/impact.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/api/v1/impact.py)
  - UI Surface: [`frontend/src/pages/ImpactCenter.tsx`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/frontend/src/pages/ImpactCenter.tsx)

---

## 20. Responsible AI Architecture
- **Global Governance Drawer:** Accessible globally across all pages, articulating:
  1. *Safety First:* Non-bypassable deterministic security barriers.
  2. *Algorithmic Transparency:* Mathematical MAUT formulas; no hidden scoring weights.
  3. *Privacy by Design:* Zero PII; cryptographic sanitization compliance under NIST SP 800-88 Rev. 2.
  4. *Fair Allocation:* Priority-based institutional allocation eliminating departmental hoarding.
  5. *Uncertainty Awareness:* Explicit confidence metrics (`HIGH`, `MEDIUM`, `LOW`) and identified assumptions.
  6. *Human Oversight:* Final disposition authorization remains strictly with qualified personnel.
- **Repository Evidence:**
  - Governance Component: [`frontend/src/components/common/GovernanceDrawer.tsx`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/frontend/src/components/common/GovernanceDrawer.tsx)
  - Estimate Badge Component: [`frontend/src/components/common/EstimateBadge.tsx`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/frontend/src/components/common/EstimateBadge.tsx)
  - Simulated Banner Component: [`frontend/src/components/common/SimulatedBanner.tsx`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/frontend/src/components/common/SimulatedBanner.tsx)

---

## 21. Automated Testing Evidence
- **Test Suite Status:** 32 passed / 0 failed in 1.40s (`python -m pytest backend/tests/ -v`).
- **Breakdown by Test Module:**
  - `backend/tests/test_security_gate.py`: 7 tests verifying sanitization gate, blocked reuse, cleared diskless units, and unverified donation blocks.
  - `backend/tests/test_vertical_slice.py`: 3 end-to-end scenario tests (A: Direct Reuse, B: Repair with Override Block, C: Repurpose & Component Recovery).
  - `backend/tests/test_demand_and_portfolio.py`: 11 tests verifying capability matching, mobility constraints, OS constraints, priority ordering, and candidate retrieval.
  - `backend/tests/test_ai_and_scenarios.py`: 11 tests verifying LLM provider schemas, economic calculation invariance, RAG source preservation, objective re-ranking, and NIST SP 800-88 Rev. 2 invariance.
- **Frontend Build Status:** Vite production build passes cleanly (`tsc -b && vite build`) in 3.77s with zero errors.
- **Repository Evidence:**
  - Pytest Test Files: [`backend/tests/`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/tests/)

---

## 22. Limitations
1. *Simulated Demonstration Dataset:* Uses a synthetic portfolio of 30 assets and 4 department demands to ensure repeatable evaluations without risking confidential campus records.
2. *Provisional LCA Emission Factors:* Estimates use average embodied carbon heuristics from published academic literature rather than certified factory-level supply chain lifecycle assessments.
3. *Prototype Residual Value Heuristic:* Approximates depreciated value via standard straight-line decay equations rather than real-time eBay or secondary market scraping.
4. *Static Knowledge Base:* Local JSON RAG repository currently covers 10 authoritative documents; dynamic crawling of new manufacturer service manuals is not yet supported.
5. *Single-Node SQLite Architecture:* Designed for lightweight deployment and demonstration; multi-campus clustering would require migration to PostgreSQL and Redis.
- **Repository Evidence:**
  - Documented limitations: [`docs/limitations.md`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/docs/limitations.md)

---

## 23. Future Scope
1. *Automated Network PXE Sanitization Ingestion:* Direct API integration with open-source wiping utilities (e.g. ShredOS, DBAN) to ingest cryptographically signed wipe certificates automatically.
2. *Real-Time Secondary Hardware Market Feeds:* Dynamic API integration with refurbished hardware marketplaces for real-time market value appraisal.
3. *Barcode / QR Code Asset Intake:* Mobile camera scanner utility for campus technicians to intake retired equipment via asset barcodes.
4. *Enterprise ITAM / ERP Integration:* REST webhooks connecting directly to ServiceNow, Snipe-IT, and SAP asset management systems.
5. *Multi-Institutional Surplus Exchange:* Federation protocol allowing regional universities and schools to cross-allocate surplus computing hardware.
