# ReLife — Final Presentation Screenshot Evidence Plan

> **Internship Track:** 1M1B – IBM SkillsBuild AI for Sustainability Virtual Internship (July–September 2026)  
> **Student / Author:** Ameer Suhail ([Ameersuhail799/RELIFE](https://github.com/Ameersuhail799/RELIFE.git))  
> **Purpose:** Minimum high-value visual evidence matrix for the final internship slide deck and submission dossier. Every screenshot corresponds to an actual validated interface running on the local engineering baseline.

---

## 1. High-Value Screenshot Evidence Matrix

All screenshots are captured at 1920x1080 (16:9) and stored in `submission/screenshots/`:

| # | Filename | Target Surface | Route & State | What the Screenshot Proves | Slide Deck Mapping |
|---|---|---|---|---|---|
| **01** | `01_command_center.png` | **Executive Command Center** | `/` (Fleet Overview) | Shows total fleet triage (30 registered, 3 assessed, 3 eligible), lifecycle funnel, attention cards (12 unverified drives), and `[SIMULATED DATASET]` badge. | Slide 5 (Solution Overview) |
| **02** | `02_add_asset.png` | **Asset Intake Workflow** | `/` (Modal Open) | Interactive intake form for registering newly retired devices (`DEMO-LAP-031`), demonstrating real-world usability beyond static mock data. | Slide 6 (Enterprise Workflow & Onboarding) |
| **03** | `03_registered_asset.png` | **Inventory Registration Confirmation** | `/assets` (Active: `DEMO-LAP-031`) | Newly registered asset immediately reflected in inventory with UNVERIFIED security gate status, ready for circular assessment. | Slide 6 (Asset Lifecycle Progression) |
| **04** | `04_asset_intelligence.png` | **Asset Intelligence (Scenario A)** | `/assets` (Active: `SIM-LAP-001`) | Demonstrates capability profiling (Intel i5, 16GB RAM, NVMe SSD), verified sanitization badge (`CERT-2026-NIST-88-101`), and AI recommendation for `DIRECT_REUSE` (99.0/100). | Slide 7 (AI Decision Pipeline) |
| **05** | `05_scenario_lab.png` | **Scenario Lab & Trade-Off Analysis** | `/scenarios` (Active: `SIM-LAP-001`) | Displays side-by-side eligible pathways ranked #1 to #6, multi-objective switcher (`BALANCED`, `SUSTAINABILITY_FIRST`, `COST_FIRST`, `UTILIZATION_FIRST`), and "What Was Gained vs What Was Sacrificed" cards. | Slide 8 (Multi-Objective Optimization) |
| **06** | `06_demand_matching.png` | **Institutional Demand Matching** | `/demand` (Selected: `DEMAND-CSE-01`) | Shows departmental hardware demand queue on the left, ranked candidate assets on the right (`SIM-LAP-001` at 100% fit), and multi-dimensional capability fit breakdown. | Slide 9 (Demand Matching) |
| **07** | `07_approval_center.png` | **Human-in-the-Loop Approval Center** | `/approvals` (Active: `SIM-LAP-002`) | Shows pending disposition queue, recommendation dossier, security gate audit status, and disposition action panel (Approve, Override, Reject) requiring officer identity and notes. | Slide 10 (Human-in-the-Loop Governance) |
| **08** | `08_security_block.png` | **Security Gate Boundary (Negative Test)** | `/approvals` (Attempted Override) | Displays prominent red security banner: `HTTP 403 Forbidden - Deterministic Security Boundary: Direct reuse strictly blocked until storage media is cryptographically sanitized under NIST SP 800-88 Rev. 2 guidelines.` | Slide 10 (Zero-Trust Security Gate) |
| **09** | `09_circular_passport.png` | **Circular IT Asset Passport** | `/passport?asset=SIM-LAP-001` | Displays immutable vertical audit ledger with timestamps, actors, and events (`ASSET_REGISTERED`, `SECURITY_GATE_EVALUATED`, `RECOMMENDATION_GENERATED`, `HUMAN_DECISION_APPROVED`), plus raw JSON inspector. | Slide 11 (Digital Product Passport & Audit) |
| **10** | `10_impact_center.png` | **SDG 12 Circular Impact Center** | `/impact` (Portfolio Summary) | Executive KPI cards for canonical 3-scenario evaluated fleet: ₹128,000 procurement capital saved, 292.5 kg CO2e avoided, 11.7 kg e-waste diverted, +6.5 years life extended; marked `[ESTIMATE ONLY]`. | Slide 12 (SDG 12 Environmental Impact) |
| **11** | `11_governance.png` | **Responsible AI Governance Core** | Global Slide-over Drawer | Shows the ReLife Governance Axiom: *"AI RECOMMENDS · RULES ENFORCE SAFETY · HUMANS APPROVE"* and details the 6 ethical AI pillars. | Slide 13 (Responsible AI & Ethics) |

---

## 2. Screenshot Generation & Location Guide

All visual assets are stored directly in `submission/screenshots/` and can be embedded in markdown, PPTX, or PDF dossiers:

- `submission/screenshots/01_command_center.png`
- `submission/screenshots/02_add_asset.png`
- `submission/screenshots/03_registered_asset.png`
- `submission/screenshots/04_asset_intelligence.png`
- `submission/screenshots/05_scenario_lab.png`
- `submission/screenshots/06_demand_matching.png`
- `submission/screenshots/07_approval_center.png`
- `submission/screenshots/08_security_block.png`
- `submission/screenshots/09_circular_passport.png`
- `submission/screenshots/10_impact_center.png`
- `submission/screenshots/11_governance.png`

---

## 3. Presentation Slide Mapping

- **Slide 5 (Solution Architecture & Fleet View):** Screenshot 01 (Command Center)
- **Slide 6 (Enterprise Usability & Intake):** Screenshot 02 (Add Asset Modal) + Screenshot 03 (Registered Asset)
- **Slide 7 (AI Decision Pipeline):** Screenshot 04 (Asset Intelligence)
- **Slide 8 (Multi-Objective Optimization):** Screenshot 05 (Scenario Lab)
- **Slide 9 (Demand-Aware Circularity):** Screenshot 06 (Demand Matching)
- **Slide 10 (Zero-Trust Security & Human Approval):** Screenshot 07 (Approval Center) + Screenshot 08 (Security Gate Rejection)
- **Slide 11 (Digital Product Passport & Auditability):** Screenshot 09 (Circular Passport)
- **Slide 12 (UN SDG 12 Environmental Accounting):** Screenshot 10 (Impact Center)
- **Slide 13 (Responsible AI Governance Charter):** Screenshot 11 (Governance Core Drawer)
