# ReLife ♻️
### Circular IT Asset Intelligence & Second-Life Orchestration Platform

[![Python 3.14](https://img.shields.io/badge/Python-3.14-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite 8](https://img.shields.io/badge/Vite-8.2-646CFF.svg?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Pytest Tests](https://img.shields.io/badge/Tests-50%20Passed-brightgreen.svg?style=flat&logo=pytest&logoColor=white)](https://docs.pytest.org/)
[![UN SDG 12](https://img.shields.io/badge/UN%20SDG-12%20Responsible%20Consumption-DDA63A.svg?style=flat)](https://sdgs.un.org/goals/goal12)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Internship Track:** 1M1B – AICTE – IBM SkillsBuild AI for Sustainability Virtual Internship  
> **Student / Author:** Ameer Suhail ([@Ameersuhail799](https://github.com/Ameersuhail799))  
> **Repository:** [Ameersuhail799/RELIFE](https://github.com/Ameersuhail799/RELIFE.git)

---

## 📖 Executive Summary

**ReLife** is an enterprise-grade circular IT asset intelligence and second-life orchestration platform. Designed for universities, educational institutions, and enterprises, it addresses the massive environmental problem of premature corporate IT hardware scrappage under **UN Sustainable Development Goal 12: Responsible Consumption and Production**.

Over **75% to 85%** of a computer's total lifetime carbon footprint is **embodied in manufacturing, silicon fabrication, and chassis assembly**—not in electrical runtime. Yet, institutions routinely decommission thousands of functioning computers simply because of 3-to-4-year accounting depreciation cycles and fear of data leaks.

ReLife de-risks circular hardware redeployment by combining a **deterministic, non-bypassable zero-trust media sanitization security gate** with **hardware capability profiling**, **multi-objective decision optimization**, **institutional demand matching**, and an **append-only Circular IT Asset Passport**.

---

## 🛡️ Core Governance Axiom

ReLife operates strictly under a zero-trust Responsible AI governance model:

$$\textbf{AI RECOMMENDS} \quad\cdot\quad \textbf{RULES ENFORCE SAFETY} \quad\cdot\quad \textbf{HUMANS APPROVE}$$

1. **AI is strictly assistive:** Machine learning and RAG reasoning provide condition interpretation, capability matching, and explainable trade-off summaries. AI **never** makes autonomous or destructive disposition decisions.
2. **Rules enforce safety:** Data security rules, NIST SP 800-88 Rev. 2 sanitization gates, and hardware eligibility constraints are **programmatically deterministic**. They cannot be bypassed by prompts, LLM hallucinations, or human UI overrides.
3. **Humans hold final authority:** Every circular disposition requires explicit human sign-off with recorded officer credentials, decision rationales, and immutable audit logging.

---

## 🔄 The 6 Supported Circular Pathways

```
                            [ Decommissioned IT Asset ]
                                         │
                                         ▼
                        [ Security & Sanitization Gate ]
                                         │
             ┌───────────────────────────┴───────────────────────────┐
             │ (Storage present & sanitization unverified)           │ (Sanitization verified or diskless)
             ▼                                                       ▼
  [ ⛔ BLOCKED FROM DIRECT REUSE ]                        [ Hardware Capability Profiling ]
  (Direct Reuse / Donation blocked with HTTP 403)                     │
             │                                                       ├─► 1. DIRECT REUSE (Internal redeployment)
             ▼                                                       ├─► 2. REPAIR (Technician servicing & repaste)
  [ Sent to Technician Workshop ]                                    ├─► 3. REFURBISH (RAM/SSD hardware upgrade)
  (Eligible for Repair, Refurbish, Harvest, Recycle)                 ├─► 4. REPURPOSE (Linux kiosk, IoT node)
                                                                     ├─► 5. COMPONENT RECOVERY (Parts harvest)
                                                                     └─► 6. RECYCLE (WEEE certified recycler)
```

1. **Direct Reuse / Internal Redeployment:** Immediate reassignment to staff, students, or administrative units (requires Grade A/B condition and verified sanitization).
2. **Repair:** In-house component replacement (keyboard, battery, thermal repasting) with deterministic parts + labor economics.
3. **Refurbish:** Upgrades to solid-state storage or memory to elevate the hardware into a higher compute tier.
4. **Repurpose:** Conversion into dedicated infrastructure roles (headless Linux server, library catalog OPAC kiosk, lab IoT node).
5. **Component Recovery:** Modular parts harvesting (working RAM, NVMe/SATA SSDs, Wi-Fi cards, LCD panels) for the campus repair inventory pool.
6. **Certified Recycling:** Compliant, non-recoverable material disposition through certified WEEE e-waste recyclers.

---

## ✨ Key Platform Features

- 🖥️ **Executive Command Center (`/`):** Real-time fleet triage, circular lifecycle funnel, attention metrics isolating unverified storage drives, and instant access to the intake workflow.
- 📝 **Interactive Asset Intake Modal:** Live onboarding form enabling technicians to register newly decommissioned hardware with automated capability profiling and safe security defaults (`sanitization_verified = false`).
- 🧠 **Asset Intelligence & Capability Profiling (`/assets`):** Dynamic translation of raw hardware specifications into institutional compute tiers, mobility profiles, and OS compatibility tags with read-only side-effect-free evaluation preview.
- 🔬 **Multi-Objective Scenario Lab (`/scenarios`):** Real-time scenario trade-off comparison using Multi-Attribute Utility Theory (MAUT) across 4 distinct organizational strategies:
  - `BALANCED`: Equal harmony between financial spend, carbon avoidance, and readiness.
  - `SUSTAINABILITY_FIRST`: Maximizes embodied carbon preservation and extended service life.
  - `COST_FIRST`: Minimizes direct repair outlay and maximizes residual asset recovery.
  - `UTILIZATION_FIRST`: Maximizes immediate institutional demand fulfillment.
- 🤝 **Institutional Demand Matching (`/demand`):** Algorithmic matching of available surplus devices against active campus requisitions (e.g. Computer Science programming labs, library terminals) with multi-dimensional fit scoring.
- ⚖️ **Human-in-the-Loop Approval Center (`/approvals`):** Formal disposition workstation for authorized officers with decision dossiers, audit justification entry, and authoritative server-side security rejection (`HTTP 403 Forbidden`).
- 🛂 **Circular IT Asset Passport (`/passport`):** Append-only forensic audit trail recording sequential lifecycle events (`ASSET_REGISTERED`, `SECURITY_GATE_EVALUATED`, `RECOMMENDATION_GENERATED`, `HUMAN_DECISION_APPROVED`) with raw JSON evidence inspection.
- 📊 **SDG 12 Circular Impact Center (`/impact`):** Aggregated portfolio ESG analytics showing procurement capital saved, embodied carbon avoided, e-waste diverted, and life extended with full deduplication across repeated asset reviews.
- 🏛️ **Responsible AI & Governance Charter (Global Drawer):** Slide-over governance framework detailing ethical AI boundaries, zero-trust sanitization, and estimation disclaimers.

---

## 📐 System Architecture

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │                         React 19 Frontend SPA                          │
   │      (Vite 8, TypeScript 5.7, Tailwind CSS v4, TanStack React Query)    │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │ HTTP / JSON
                                       ▼
   ┌────────────────────────────────────────────────────────────────────────┐
   │                      FastAPI Application Backend                       │
   │                          (Python 3.14, Uvicorn)                        │
   ├────────────────────────────────────────────────────────────────────────┤
   │  API Endpoints (/api/v1):                                              │
   │    ├── /assets        - Hardware inventory & intake registration       │
   │    ├── /evaluate      - Multi-objective evaluation (preview & persist) │
   │    ├── /demand        - Requisition matching & candidate scoring       │
   │    ├── /approvals     - Human decision dossier & security gate checks  │
   │    ├── /passport      - Append-only event history & raw JSON audit     │
   │    └── /impact        - Deduplicated portfolio ESG analytics           │
   ├────────────────────────────────────────────────────────────────────────┤
   │  Core Domain Services:                                                 │
   │    ├── security_gate.py    - Authoritative sanitization enforcement    │
   │    ├── capability_engine.py - Compute tier & mobility extraction       │
   │    ├── scenario_engine.py  - MAUT multi-objective ranking              │
   │    ├── economics_engine.py - Depreciation & repair catalog pricing     │
   │    ├── impact_engine.py    - Versioned LCA heuristic calculations      │
   │    ├── demand_engine.py    - Multi-attribute capability matching       │
   │    └── ai/                 - LLMProvider (MockGranite / watsonx.ai)    │
   ├────────────────────────────────────────────────────────────────────────┤
   │  Persistence Layer:                                                    │
   │    └── SQLAlchemy 2.0 ORM -> SQLite Database (relife.db)               │
   └────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Calculation Methodologies & Assumptions

### 1. Residual Valuation & Economics
Implemented in [`backend/app/services/economics_engine.py`](file:///C:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/economics_engine.py):

$$\text{Estimated Residual Value} = \text{Reference Value} \times \text{Age Factor} \times \text{Condition Factor} \times \text{Functionality Factor}$$

- **Enterprise Reference Baselines:** ₹52,000 (Laptop) · ₹42,000 (Desktop Workstation).
- **Age Depreciation:** Linear 10% annual depreciation with an 18% floor ($\max(0.18, 1.0 - 0.10 \times \text{age})$).
- **Avoided Procurement Costs:** ₹45,000 (New business laptop procurement baseline) · ₹38,000 (New desktop).

### 2. Embodied Carbon & E-Waste Avoidance
Implemented in [`backend/app/services/impact_engine.py`](file:///C:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/impact_engine.py) backed by [`impact_assumptions_v1.json`](file:///C:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/data/impact_assumptions_v1.json):

$$\text{Avoided Carbon } (\text{kg CO}_2\text{e}) = \text{Extended Operational Life (Years)} \times 45.0\text{ kg CO}_2\text{e/year}$$

- **Operational Life Extension by Pathway:**
  - `DIRECT_REUSE`: +3.0 years $\rightarrow$ $135.0\text{ kg CO}_2\text{e}$
  - `REPAIR` / `REFURBISH`: +2.5 years $\rightarrow$ $112.5\text{ kg CO}_2\text{e}$
  - `REPURPOSE`: +2.0 years $\rightarrow$ $90.0\text{ kg CO}_2\text{e}$
  - `COMPONENT_RECOVERY`: +1.0 year $\rightarrow$ $45.0\text{ kg CO}_2\text{e}$
  - `RECYCLE`: +0.0 years $\rightarrow$ $0.0\text{ kg CO}_2\text{e}$
- **Net E-Waste Diverted:** 2.1 kg (Laptops) · 7.5 kg (Desktop Mini-Towers).
- **Disclosure Standard:** All sustainability and economic metrics are prominently badged in the UI as **`[ESTIMATE ONLY]`** and documented as prototype estimates based on published LCA literature (Fraunhofer IZM, European Commission JRC, Teehan & Kandlikar 2013, Prakash et al. / Öko-Institut 2020).

---

## 🎯 Verified Canonical Demonstration Scenarios

The included simulated dataset (`backend/data/simulated_assets.json`) provides a 30-device institutional fleet. The core demo sequence exercises three canonical assets representing diverse physical conditions:

| Scenario | Asset ID & Model | Physical & Sanitization State | Recommended Pathway | Avoided Procurement | Avoided Carbon | Diverted E-Waste | Life Extension |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **A** | `SIM-LAP-001`<br>Lenovo ThinkPad T490 | Grade A, Fully Functional<br>Sanitization: **Completed & Verified** | **DIRECT REUSE**<br>(Internal Redeployment) | ₹45,000 | 135.0 kg | 2.1 kg | +3.0 yrs |
| **B** | `SIM-LAP-002`<br>Dell Latitude 7490 | Grade B, Sticking Key<br>Sanitization: **Pending / Unverified** | **REPAIR**<br>(Workshop Servicing) | ₹45,000 | 112.5 kg | 2.1 kg | +2.5 yrs |
| **C** | `SIM-DESK-016`<br>HP ProDesk 600 G3 | Damaged, Motherboard Failure<br>Sanitization: **Pending / Unverified** | **COMPONENT RECOVERY**<br>(Modular Parts Harvest) | ₹38,000 | 45.0 kg | 7.5 kg | +1.0 yr |
| **PORTFOLIO** | **3 Evaluated Devices** | **Deduplicated Portfolio Total** | **Circular Retention** | **₹128,000** | **292.5 kg** | **11.7 kg** | **+6.5 yrs** |

> **Negative Security Test:** Attempting to override `SIM-LAP-002` (unverified drive) into Direct Reuse or Internal Redeployment immediately triggers a server-side `SecurityGateViolationError` with an authentic **HTTP 403 Forbidden** response.

---

## 📸 Demonstration Evidence Pack

High-resolution presentation screenshots (1920×1080) are available in [`submission/screenshots/`](submission/screenshots/):

| Step | Screenshot File | Target Interface | Primary Evidence Demonstrated |
| :---: | :--- | :--- | :--- |
| **01** | `01_command_center.png` | `/` (Command Center) | Fleet triage KPIs, attention metrics, lifecycle funnel, simulated dataset notice |
| **02** | `02_add_asset.png` | `/` (Intake Modal) | Modal dialog for registering newly decommissioned hardware with safe defaults |
| **03** | `03_registered_asset.png` | `/assets` | Newly registered asset onboarded with UNVERIFIED security gate badge |
| **04** | `04_asset_intelligence.png` | `/assets` (`SIM-LAP-001`) | Hardware capability profiling, verified sanitization PASS, DIRECT REUSE recommendation |
| **05** | `05_scenario_lab.png` | `/scenarios` | Multi-objective policy switcher (MAUT) & "What Was Gained vs. Sacrificed" cards |
| **06** | `06_demand_matching.png` | `/demand` | Campus requisition matching (`DEMAND-CSE-01`) with 100% fit score |
| **07** | `07_approval_center.png` | `/approvals` | Human-in-the-loop decision dossier with mandatory officer credentials and audit notes |
| **08** | `08_security_block.png` | `/approvals` | Non-bypassable security gate rejecting unsafe direct reuse with HTTP 403 Forbidden |
| **09** | `09_circular_passport.png` | `/passport` | Append-only lifecycle event trail with expandable raw JSON audit inspector |
| **10** | `10_impact_center.png` | `/impact` | Executive sustainability KPI cards (₹128k capital, 292.5kg CO2e, 11.7kg e-waste, +6.5 yrs) |
| **11** | `11_governance.png` | Global Drawer | Responsible AI Charter: AI RECOMMENDS · RULES ENFORCE SAFETY · HUMANS APPROVE |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python:** 3.11, 3.12, 3.13, or 3.14
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Ameersuhail799/RELIFE.git
cd RELIFE
```

### 2. Start the Backend API Server
```bash
# From the project root
python -m pip install -r backend/requirements.txt   # If dependencies not yet installed
python -m uvicorn backend.app.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`
- Healthcheck: `http://localhost:8000/health`

### 3. Start the Frontend Application
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
- Frontend Application URL: `http://localhost:5173`

### 4. (Optional) Seed the Simulated Dataset
To initialize or refresh the 30-device institutional demo dataset:
```bash
curl -X POST http://localhost:8000/api/v1/assets/seed-simulated
```

---

## 🧪 Testing & Quality Assurance

ReLife enforces 100% test pass rates and production build hygiene:

### 1. Run Backend Pytest Suite
```bash
# From project root
python -m pytest -v
```
**Results:** **50 passed, 0 failed** across all test suites:
- `test_security_gate.py` (11 tests): Zero-trust boundaries, unverified storage blocks, diskless clearance.
- `test_vertical_slice.py` (6 tests): End-to-end Scenarios A, B, C, read-only preview, and HTTP 403 security blocks.
- `test_asset_intake.py` (6 tests): Validation rules, duplicate serial rejection, safe intake defaults.
- `test_demand_and_portfolio.py` (16 tests): Capability matching, mobility constraints, portfolio deduplication, and LCA calculations.
- `test_ai_and_scenarios.py` (11 tests): RAG metadata preservation, MAUT ranking behavior, and deterministic economic immutability.

### 2. Run Frontend Production Build
```bash
cd frontend
npm run build
```
**Results:** TypeScript compilation (`tsc -b`) and Vite production bundling succeed with **0 errors**.

### 3. Run Frontend Linter
```bash
cd frontend
npm run lint
```
**Results:** `oxlint` analyzes 21 files across 116 rules with **0 errors**.

---

## 📁 Repository File Structure

```text
RELIFE/
├── backend/
│   ├── app/
│   │   ├── api/v1/             # REST API routers (assets, evaluate, demand, approvals, passport, impact)
│   │   ├── core/               # Enums, database engine, config, security gate validator
│   │   ├── models/             # SQLAlchemy ORM models (Asset, Demand, Recommendation, Passport)
│   │   ├── schemas/            # Pydantic v2 domain schemas (intake, capability, economics, AI, impact)
│   │   └── services/           # Business logic (asset, capability, economics, impact, scenario, demand)
│   │       └── ai/             # Abstract LLMProvider, MockGraniteProvider, watsonx IBMGraniteProvider
│   ├── data/
│   │   ├── impact_assumptions_v1.json  # Versioned lifecycle carbon & e-waste coefficients
│   │   ├── simulated_assets.json       # 30-device university fleet dataset
│   │   ├── simulated_demand.json       # Institutional hardware requisitions
│   │   └── knowledge_base/             # Curated RAG guidelines (NIST SP 800-88 R2, WEEE, iFixit)
│   └── tests/                  # 50 comprehensive pytest unit and integration tests
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI widgets (AssetIntakeModal, GovernanceDrawer, Badges)
│   │   ├── pages/              # 7 dedicated views (CommandCenter, AssetIntelligence, ScenarioLab, etc.)
│   │   ├── services/           # Axios / Fetch API client layer
│   │   └── types/              # TypeScript interfaces mirroring backend Pydantic models
│   ├── package.json
│   └── vite.config.ts
├── docs/                       # Architectural specifications, evaluator Q&A, and evidence matrices
├── submission/
│   ├── final_demo_flow.md      # Step-by-step presenter walkthrough script
│   └── screenshots/            # 11 canonical high-resolution demonstration screenshots
├── README.md                   # Platform documentation
└── LICENSE                     # Open-source MIT License
```

---

## ⚖️ Ethical AI & Transparency Commitments

1. **Simulated Dataset Notice:** The default demonstration fleet runs on realistic simulated data. All related UI views prominently display the **`[SIMULATED DATASET]`** badge.
2. **Provisional Estimates Disclosure:** All environmental and financial figures are calculated using transparent published LCA literature heuristics. They are explicitly marked with **`[ESTIMATE ONLY]`** and must not be confused with certified carbon credits or physical metering.
3. **No Hidden Black Boxes:** Scenario ranking scores are computed deterministically via open Multi-Attribute Utility Theory (MAUT) weighting matrices.
4. **Offline Reproducibility:** Default local execution utilizes `MockGraniteProvider`, ensuring 100% deterministic test pass rates without external cloud API dependencies.

---

## 👤 Author & Acknowledgments

- **Author / Developer:** Ameer Suhail
- **GitHub:** [@Ameersuhail799](https://github.com/Ameersuhail799)
- **Program:** 1M1B – AICTE – IBM SkillsBuild AI for Sustainability Virtual Internship (2026)
- **Special Thanks:** Mentors and evaluators at 1M1B and IBM SkillsBuild for fostering responsible, human-centered artificial intelligence for sustainable development.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
