# ReLife ♻️
### Circular IT Asset Intelligence & Second-Life Orchestration Platform

> **AI-for-Sustainability Portfolio & Internship Project**  
> **Primary SDG Alignment:** [UN SDG 12: Responsible Consumption and Production](https://sdgs.un.org/goals/goal12)  
> **Core Focus:** Decision-support for circular IT asset disposition across universities, colleges, schools, and SMEs.

---

## 🌍 The Problem

Institutions accumulate hundreds of dormant, decommissioned, or retired IT hardware assets (laptops, desktops, monitors). Many of these machines are not immediate waste: some can be securely reused, repaired, refurbished, repurposed, or harvested for valuable components before final recycling.

However, organizations lack an intelligent, secure, and auditable system to evaluate circular next-life pathways. Decisions are often made ad-hoc, leading to:
- Premature disposal of salvageable computers.
- Severe data-security risks (assets redistributed without verified disk sanitization).
- Wasteful new hardware procurement when internal departments (e.g. basic labs, kiosks, IoT projects) could utilize existing assets.

---

## 💡 The Solution: ReLife

**ReLife** is an AI-assisted decision-support platform that evaluates decommissioned IT assets and orchestrates the optimal circular next-life pathway.

> ⚠️ **Core Design Principle:**  
> ReLife is a **decision-support tool**, **NOT** an autonomous system making irreversible actions.  
> **Hard security gates** (e.g. NIST 800-88 sanitization verification) and **technical minimums** are strictly deterministic. AI (LLM / RAG) is used for contextual condition interpretation, creative repurposing suggestions, and explainable trade-off summaries. Every circular pathway requires **Human-in-the-Loop approval**.

---

## 🔄 The 6 Supported Circular Pathways

```
[ Dormant Asset ] 
       │
       ▼
[ Security & Sanitization Gate ] ── (Fails/Unverified) ──► [ Blocked from Reuse ]
       │ (Cleared)
       ├──► 1. Direct Reuse / Internal Redeployment (Meets active institutional demand)
       ├──► 2. Repair (Minor fault, economically & technically viable)
       ├──► 3. Refurbishment (Cleaning, thermal repasting, RAM/SSD upgrade)
       ├──► 4. Repurposing (Alternative role: IoT gateway, HomeAssistant lab, Linux kiosk)
       ├──► 5. Component Recovery (Harvest functional RAM, SSD, Wi-Fi card, panel)
       └──► 6. Responsible Recycling (WEEE compliant certified e-waste partner)
```

---

## 🚀 Signature Features

1. **AI Asset Profiling & Assessment:** Multi-factor analysis of hardware specs, physical condition, battery health, and functional faults.
2. **Secure Reuse Gate (Deterministic):** Non-negotiable programmatic block on reuse/redeployment if storage is present and sanitization is unverified.
3. **Circular Pathway Decision Engine:** Comprehensive evaluation across all 6 circular pathways with clear scoring.
4. **Institutional Demand Matching:** Matches asset capabilities against open organizational requests (e.g., CSE coding lab, Library public catalog, IoT lab).
5. **Second-Life Scenario Comparison:** Side-by-side trade-off matrix: cost vs. useful-life extension vs. estimated environmental benefit.
6. **Explainable Recommendations:** Transparent narrative explaining why a pathway was chosen, alternatives considered, assumptions, and uncertainties.
7. **Impact Dashboard:** Transparent metrics tracking estimated e-waste diverted (kg), estimated CO2e avoided (kg), and procurement costs saved *(clearly labeled as estimates)*.
8. **Circular Asset Passport:** Complete lifecycle event trail from intake to final approved disposition.

---

## 🛠️ Technology Stack

- **Backend:** Python 3.11+, FastAPI, SQLAlchemy, SQLite (production ready for PostgreSQL)
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **AI & RAG:** Modular `LLMProvider` interface (IBM Granite / watsonx.ai, fallback offline mock, lightweight RAG)
- **Agent Workflow:** IBM BOB integration throughout developer orchestration and architectural planning

---

## 📂 Repository Structure

```text
RELIFE/
├── docs/                   # Architecture, threat model, data dictionary, AI boundary
├── backend/                # FastAPI application, SQLAlchemy models, deterministic engines, AI services
│   ├── app/
│   ├── data/               # Realistic simulated institutional dataset & RAG knowledge base
│   └── tests/              # Security gate, matcher, and impact tests
├── frontend/               # React + Vite application
└── README.md
```

---

## 🔬 Ethical AI & Data Transparency

- **Simulated Data Notice:** The initial prototype runs on a realistic simulated dataset representing university hardware. It is explicitly labeled as `[SIMULATED DATASET]` and never misrepresented as collected institutional records.
- **Environmental Claims:** Carbon avoided and e-waste diverted are calculated based on transparent heuristics from peer-reviewed lifecycle analyses (LCA) and are prominently labeled as **ESTIMATES**.
