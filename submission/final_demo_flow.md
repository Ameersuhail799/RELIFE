# ReLife — Final Demonstration Flow & Presenter Walkthrough

> **Track:** 1M1B – IBM SkillsBuild AI for Sustainability Virtual Internship (2026)  
> **Project:** ReLife — Circular IT Asset Intelligence & Second-Life Orchestration Platform  
> **Student / Author:** Ameer Suhail ([Ameersuhail799/RELIFE](https://github.com/Ameersuhail799/RELIFE.git))  
> **Format:** 11-Step Presentation Walkthrough mapped 1:1 to `submission/screenshots/`

---

## Step 01: Executive Command Center Overview

- **SCREEN:** `01_command_center.png` (`http://localhost:5173/`)
- **WHAT I CLICK:** Navigate to the Command Center home page from the sidebar navigation.
- **WHAT I SEE:** 
  - Executive KPI summary cards showing 30 registered institutional assets, 3 assessed assets, 3 eligible assets, and 0 pending human approvals.
  - Distinct `[SIMULATED DATASET]` disclaimer banner in the header ensuring research integrity.
  - Active Attention Cards flagging 12 unverified storage drives requiring data sanitization under NIST SP 800-88 Rev. 2.
  - Circular Lifecycle Funnel illustrating the progression from Registered -> Assessed -> Eligible -> Approved.
  - Prominent "+ Add Asset" action button in the top header.
- **WHAT I SAY:**
  > *"Respected evaluators, welcome to ReLife, an enterprise circular IT asset intelligence and second-life orchestration platform addressing UN SDG 12: Responsible Consumption and Production.*  
  >  
  > *Universities and enterprises decommission hundreds of functioning laptops every semester solely due to rigid accounting depreciation schedules rather than hardware failure. Since over 75% of a computer's total lifecycle carbon emissions are embodied in silicon fabrication and assembly, premature scrappage causes massive environmental waste.*  
  >  
  > *We start at the Portfolio Command Center. ReLife is an institutional fleet-scale decision engine, not an isolated single-device toy. Here we see our campus fleet of 30 assets. Notice that our attention metrics immediately isolate 12 unverified drives blocked from redeployment under NIST SP 800-88 Rev. 2."*

---

## Step 02: Interactive Asset Intake Workflow

- **SCREEN:** `02_add_asset.png` (Command Center -> Add Asset Modal open)
- **WHAT I CLICK:** Click the "+ Add Asset" button in the upper right corner of the Command Center.
- **WHAT I SEE:**
  - Modern modal dialog titled "Register New IT Asset" with subtitle "Add a newly decommissioned or surplus device to the institutional circular inventory."
  - Responsive intake form with validated fields: Asset Tag (`DEMO-LAP-031`), Device Type (Laptop), Make/Model (`Dell Latitude 5420`), Department (`Economics Department`), Serial Number (`DL5420-ECO-9921`), Processor (`Intel Core i5-1135G7 (4 cores, 4.20 GHz)`), RAM (16 GB), Storage Type (NVMe SSD), Storage Capacity (512 GB), Functional Condition (Grade A), Working Status (Yes), Purchase Date (`2021-11-15`), Original Cost (₹68,000), Data Sanitization Status (`UNVERIFIED`), and Baseline Notes.
  - Action buttons: "Cancel" and "Register Asset".
- **WHAT I SAY:**
  > *"A critical enterprise requirement is allowing floor technicians and department heads to onboard newly retired hardware directly through the interface rather than relying exclusively on seeded databases.*  
  >  
  > *Clicking '+ Add Asset' opens our structured Asset Intake modal. Here we register `DEMO-LAP-031`, an 11th-Gen Intel Core i5 laptop returned by the Economics Department. We enter its hardware specifications, confirm its Grade A functional condition, and deliberately mark its storage as UNVERIFIED to ensure it enters our zero-trust data protection pipeline."*

---

## Step 03: Inventory Registration Confirmation

- **SCREEN:** `03_registered_asset.png` (`http://localhost:5173/assets`)
- **WHAT I CLICK:** Click "Register Asset" in the modal, which saves the asset to the database and navigates to Asset Intelligence.
- **WHAT I SEE:**
  - The newly registered asset `DEMO-LAP-031` selected and displayed in the Asset Intelligence queue.
  - Hardware specifications dynamically compiled into an institutional capability profile (11th Gen i5, 16GB RAM, 512GB NVMe SSD).
  - Prominent badge: "Storage Sanitization: UNVERIFIED".
  - One-click evaluation trigger: "Run AI Circular Assessment" ready to calculate multi-objective pathway scores and evaluate security constraints.
- **WHAT I SAY:**
  > *"Immediately upon saving, `DEMO-LAP-031` is registered into the institutional database with an auto-generated asset record. Notice that it immediately appears in Asset Intelligence with its complete hardware profile.*  
  >  
  > *The system correctly tags its drive as UNVERIFIED, preventing any premature disposition. The technician can now run an on-demand AI circular assessment whenever ready."*

---

## Step 04: Asset Intelligence & Capability Profiling (Scenario A)

- **SCREEN:** `04_asset_intelligence.png` (`http://localhost:5173/assets` -> `SIM-LAP-001`)
- **WHAT I CLICK:** Select `SIM-LAP-001` (Lenovo ThinkPad T490) from the fleet list.
- **WHAT I SEE:**
  - Complete capability profiling: Performance-tier quad-core Intel i5-8265U, 16 GB DDR4 RAM, 256 GB NVMe SSD, Windows 11 & Linux compatibility verified.
  - Security Gate Status: **GATE: PASS** with verified sanitization certificate `CERT-2026-NIST-88-101`.
  - Recommended Circular Pathway: **DIRECT REUSE** with a Suitability Score of 99.0/100 and High Confidence.
  - Transparent Decision Evidence cards showing Economic Benefit (₹45,000 procurement deferred vs. ₹0 repair cost), Environmental Benefit (135.0 kg CO2e avoided, 2.1 kg e-waste diverted, +3.0 years useful life extended), and Explainable Reasoning narrative.
- **WHAT I SAY:**
  > *"Now let's examine **Scenario A**: `SIM-LAP-001`, an off-lease ThinkPad T490 from Computer Science.*  
  >  
  > *Notice how ReLife abstracts low-level hardware specs into a multidimensional Capability Profile: it identifies performance tiers, multitasking capacity, and OS compatibility.*  
  >  
  > *Look at the NIST SP 800-88 Rev. 2 Media Sanitization Hard Gate: it displays a green PASS badge because an authorized technician completed and logged an immutable sanitization certificate.*  
  >  
  > *With security satisfied, our AI reasoning engine—synthesizing deterministic engineering calculations with RAG best-practice guidelines—recommends DIRECT REUSE with a top suitability score of 99.0/100. It produces an explainable justification highlighting why redeployment yields maximum utility at zero marginal cost."*

---

## Step 05: Multi-Objective Scenario Lab

- **SCREEN:** `05_scenario_lab.png` (`http://localhost:5173/scenarios`)
- **WHAT I CLICK:** Navigate to `/scenarios` in the sidebar and select `SIM-LAP-001`.
- **WHAT I SEE:**
  - Multi-Objective Strategy Switcher with four distinct policies: `BALANCED`, `SUSTAINABILITY_FIRST`, `COST_FIRST`, and `UTILIZATION_FIRST`.
  - Ranked side-by-side cards for all 6 circular pathways (#1 Direct Reuse, #2 Refurbish, #3 Component Recovery, #4 Repair, #5 Repurpose, #6 Recycle).
  - Explicit "What Was Gained vs. What Was Sacrificed" trade-off comparison cards detailing financial, carbon, and hardware utility differentials across policies.
- **WHAT I SAY:**
  > *"Different institutional stakeholders have competing priorities: procurement officers focus on capital preservation, sustainability directors optimize carbon abatement, and lab managers maximize compute availability.*  
  >  
  > *In the Circular Scenario Lab, ReLife evaluates all six circular pathways simultaneously using Multi-Attribute Utility Theory (MAUT). Switching between Balanced, Sustainability-First, and Cost-First dynamically recalculates pathway rankings.*  
  >  
  > *Crucially, our system features dedicated 'What Was Gained vs. What Was Sacrificed' cards. The ranking scores are derived through deterministic mathematical formulas, while the generative AI synthesizes clear strategic narratives for executive decision-makers."*

---

## Step 06: Institutional Demand Matching

- **SCREEN:** `06_demand_matching.png` (`http://localhost:5173/demand`)
- **WHAT I CLICK:** Navigate to `/demand` in the sidebar and select `DEMAND-CSE-01` (Undergraduate Coding Lab Requisition).
- **WHAT I SEE:**
  - Left panel: Departmental Hardware Demand Queue displaying active requisitions across campus departments.
  - Center/Right panel: Ranked Candidate Surplus Assets matched against the requisition requirements.
  - `SIM-LAP-001` ranked as **Match #1** with a **100% Match Score**.
  - Detailed Multi-Dimensional Capability Breakdown showing CPU core headroom (+100%), RAM capacity (+100%), storage speed match, and verified sanitization clearance.
- **WHAT I SAY:**
  > *"A circular recommendation is useless if there is no practical destination for the device. In Demand Matching, ReLife connects decommissioned hardware directly to open departmental requisitions across the institution.*  
  >  
  > *Here, the Computer Science department has logged an urgent requisition for 10 programming workstations. ReLife matches `SIM-LAP-001` with a 100% fit score. Our multi-dimensional capability fit shows exactly why: quad-core CPU and 16GB RAM exceed the lab's minimum threshold.*  
  >  
  > *By fulfilling requisitions internally from existing assets, we eliminate the need for fresh commercial procurement."*

---

## Step 07: Human-in-the-Loop Approval Center

- **SCREEN:** `07_approval_center.png` (`http://localhost:5173/approvals`)
- **WHAT I CLICK:** Navigate to `/approvals` in the sidebar and select recommendation `REC-E0E432B9` (`SIM-LAP-002`, Dell Latitude 7490).
- **WHAT I SEE:**
  - Human Oversight Queue listing pending circular pathway recommendations.
  - Comprehensive Recommendation Dossier displaying asset condition, technical rationale, and security audit status.
  - Disposition Action Form requiring officer credentials (`Officer Name: Dr. Elena Rostova`, `Role: IT Asset Disposition Lead`), decision rationale notes, and action options: "Approve AI Recommendation", "Override Pathway", or "Reject / Flag for Review".
- **WHAT I SAY:**
  > *"Now we demonstrate our foundational governance principle: **AI Recommends, Rules Enforce Safety, Humans Approve**.*  
  >  
  > *In the Approval Center, no AI recommendation is ever executed automatically. An authorized disposition officer must review the evidence dossier, input their organizational credentials, provide an audit rationale, and explicitly record their decision.*  
  >  
  > *This guarantees strict human accountability and institutional oversight for every single asset transaction."*

---

## Step 08: Non-Bypassable Security Gate Enforcement (Negative Test)

- **SCREEN:** `08_security_block.png` (`http://localhost:5173/approvals` showing Security Rejection)
- **WHAT I CLICK:** For `SIM-LAP-002` (which has an unverified storage drive), select "Override Pathway", choose "Direct Reuse / Internal Redeployment", and click "Submit Human Approval".
- **WHAT I SEE:**
  - Prominent red security error banner displaying: **"Security Policy Violation: HTTP 403 Forbidden"**.
  - Detailed rejection message: `"Deterministic Security Boundary: Direct reuse strictly blocked until storage media is verified sanitized under NIST SP 800-88 Rev. 2 guidelines."`
  - The unauthorized redeployment attempt is rejected server-side; the database state remains unchanged.
- **WHAT I SAY:**
  > *"Here is the most critical technical safeguard in ReLife: the **Non-Bypassable Security Hard Gate**.*  
  >  
  > *Asset `SIM-LAP-002` has an unverified storage drive. The AI correctly recommended REPAIR in a secure technical workshop. However, suppose a human technician attempts to cut corners and redeploy the machine directly.*  
  >  
  > *When we attempt to override the pathway to Direct Reuse, the system immediately returns an HTTP 403 Forbidden error!*  
  >  
  > *This demonstrates zero-trust architecture: **no generative model and no human user can override data security rules**. Sensitive student or faculty data can never leak onto campus networks through circular reuse."*

---

## Step 09: Circular IT Asset Passport & Audit Ledger

- **SCREEN:** `09_circular_passport.png` (`http://localhost:5173/passport?asset=SIM-LAP-001`)
- **WHAT I CLICK:** Navigate to `/passport` in the sidebar and view `SIM-LAP-001`.
- **WHAT I SEE:**
  - Digital Circular IT Asset Passport featuring a tamper-evident, vertical chronological audit ledger.
  - Sequential lifecycle milestones with exact timestamps, actors, and event payloads:
    1. `ASSET_REGISTERED` — Intake logged by Department Admin.
    2. `SECURITY_GATE_EVALUATED` — NIST SP 800-88 sanitization verification (`CERT-2026-NIST-88-101`).
    3. `RECOMMENDATION_GENERATED` — Multi-attribute AI suitability assessment.
    4. `HUMAN_DECISION_APPROVED` — Formal sign-off by Dr. Elena Rostova.
  - Expandable Raw JSON Evidence Inspector displaying the immutable backend event schema.
- **WHAT I SAY:**
  > *"Every lifecycle event in ReLife is committed to an append-only **Circular IT Asset Passport**.*  
  >  
  > *Here you see the complete chain of custody for `SIM-LAP-001`: initial registration, drive sanitization verification, AI recommendation generation, and formal sign-off by Dr. Elena Rostova.*  
  >  
  > *Every event records an actor ID, a timestamp, and a structured audit JSON payload. This fulfills both internal university audit mandates and statutory e-waste compliance obligations without relying on superficial blockchain buzzwords."*

---

## Step 10: SDG 12 Circular Impact Center

- **SCREEN:** `10_impact_center.png` (`http://localhost:5173/impact`)
- **WHAT I CLICK:** Navigate to `/impact` in the sidebar.
- **WHAT I SEE:**
  - Top header: "SDG 12 Circular Impact Center" accompanied by the `[ESTIMATE ONLY]` and `[SIMULATED DATASET]` badges.
  - Four executive sustainability KPI cards reflecting the canonical 3-scenario evaluated fleet:
    - **Procurement Capital Saved:** ₹128,000
    - **Avoided Embodied Carbon:** 292.5 kg CO2e
    - **E-Waste Diverted:** 11.7 kg
    - **Useful Life Extended:** +6.5 Years
  - Circular Pathway Allocation breakdown showing direct reuse, repair, and refurbishment distribution.
  - Direct trigger button for "Methodology & Assumptions" drawer.
- **WHAT I SAY:**
  > *"In the **SDG 12 Circular Impact Center**, ReLife aggregates fleet-wide environmental and financial gains.*  
  >  
  > *Across our three evaluated demonstration scenarios, circular orchestration has deferred ₹128,000 in new procurement expenditure, avoided 292.5 kilograms of embodied CO2 equivalent emissions, diverted 11.7 kilograms of toxic e-waste from landfills, and extended hardware operational life by 6.5 collective years.*  
  >  
  > *In full alignment with academic integrity and Responsible AI principles, every metric is explicitly marked [ESTIMATE ONLY]. Clicking the Methodology drawer reveals our peer-reviewed lifecycle carbon factors, citing published research by Teehan & Kandlikar (2013) and Prakash et al. (Öko-Institut 2020)."*

---

## Step 11: Responsible AI Governance Charter

- **SCREEN:** `11_governance.png` (Global Sidebar -> Governance Core Drawer open)
- **WHAT I CLICK:** Click the "Governance Core" button at the bottom of the sidebar navigation.
- **WHAT I SEE:**
  - Slide-over drawer titled "Responsible AI & Governance Charter: Ethical safeguards, zero-trust security & human oversight".
  - Core Axiom Banner prominently displayed:
    **`AI RECOMMENDS · RULES ENFORCE SAFETY · HUMANS APPROVE`**
  - Six operational Responsible AI pillars detailed:
    1. **Safety First & Zero-Trust Security** (NIST SP 800-88 Rev. 2 deterministic gate).
    2. **Algorithmic Transparency** (Multi-Attribute Utility Theory with explicit weights).
    3. **Fair Resource Allocation** (Equitable demand fulfillment preventing departmental hoarding).
    4. **Accountability & Human Agency** (Mandatory human approval with audit trails).
    5. **Scientific Environmental Accounting** (Transparent LCA disclaimers, no greenwashing).
    6. **System Reliability & Fallback** (Deterministic heuristic fallbacks when LLMs are unavailable).
- **WHAT I SAY:**
  > *"To conclude our demonstration, I open the **Responsible AI Governance Charter**.*  
  >  
  > *ReLife was built from the ground up to embody the ethical AI principles championed by 1M1B and IBM SkillsBuild:*  
  >  
  > *1. Safety and Privacy: Sensitive data cannot leak because security gates are deterministic and non-bypassable.*  
  > *2. Transparency: Recommendations are scored through open mathematical formulas, not opaque black boxes.*  
  > *3. Fairness: Surplus devices are matched objectively to academic needs.*  
  > *4. Human Agency: AI recommends, deterministic rules enforce safety, and humans retain final approval authority.*  
  >  
  > *ReLife proves that AI can drive measurable circular economy outcomes while remaining safe, transparent, and strictly accountable. Thank you, and I look forward to your questions."*

---

## Summary Matrix: Screenshots to Demo Script Mapping

| Step # | Screenshot File | Target Interface | Primary Evidence Demonstrated |
|:---:|:---|:---|:---|
| **01** | `01_command_center.png` | `/` (Command Center) | Fleet triage, lifecycle funnel, attention metrics, `[SIMULATED DATASET]` badge |
| **02** | `02_add_asset.png` | `/` (Intake Modal) | Real-time intake form for registering newly decommissioned hardware |
| **03** | `03_registered_asset.png` | `/assets` | Dynamic asset onboarding confirmation (`DEMO-LAP-031`) with UNVERIFIED gate |
| **04** | `04_asset_intelligence.png` | `/assets` (`SIM-LAP-001`) | Capability profiling, NIST sanitization PASS, DIRECT REUSE recommendation |
| **05** | `05_scenario_lab.png` | `/scenarios` | Multi-objective optimization (MAUT) & "What Was Gained vs Sacrificed" cards |
| **06** | `06_demand_matching.png` | `/demand` | Campus requisition matching (`DEMAND-CSE-01`) with 100% capability fit score |
| **07** | `07_approval_center.png` | `/approvals` | Human-in-the-loop decision dossier, officer credentials, audit notes |
| **08** | `08_security_block.png` | `/approvals` | Deterministic security gate block (HTTP 403) on unverified storage drive |
| **09** | `09_circular_passport.png` | `/passport` | Immutable vertical event ledger, structured audit provenance, raw JSON inspector |
| **10** | `10_impact_center.png` | `/impact` | Portfolio ESG metrics (₹128k capital, 292.5kg CO2e, 11.7kg e-waste, +6.5 yrs) |
| **11** | `11_governance.png` | Global Drawer | Responsible AI Charter: AI RECOMMENDS · RULES ENFORCE SAFETY · HUMANS APPROVE |
