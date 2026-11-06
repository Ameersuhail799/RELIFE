# ReLife — Final Presentation Slide Deck Outline (14 Slides)

> **Internship Track:** 1M1B – IBM SkillsBuild AI for Sustainability Virtual Internship (July–September 2026)  
> **Student / Author:** Ameer Suhail  
> **College Name:** [PLACEHOLDER: Student College / University Name]  
> **Project Repository:** [github.com/Ameersuhail799/RELIFE](https://github.com/Ameersuhail799/RELIFE.git)  
> **Target Deck Duration:** 8–10 Minutes  
> **Storyline Progression:** Problem $\rightarrow$ Circular Insight $\rightarrow$ AI Role $\rightarrow$ Decision Workflow $\rightarrow$ Safety $\rightarrow$ Human Control $\rightarrow$ Sustainability Impact

---

## Slide 1: Title Slide (Cover)
- **Slide Title:** ReLife: Circular IT Asset Intelligence & Second-Life Orchestration Platform
- **Subtitle:** An Explainable, Security-Aware, Demand-Aware AI Decision Support Layer for Institutional Hardware Disposition
- **Track & Program:** 1M1B – IBM SkillsBuild AI for Sustainability Virtual Internship (July–September 2026)
- **Primary SDG Alignment:** UN SDG 12: Responsible Consumption and Production
- **Student Details:**
  - **Name:** Ameer Suhail
  - **College:** [PLACEHOLDER: Student College / University Name]
  - **Department/Roll:** [PLACEHOLDER: Department / Roll Number]
- **Visuals:** ReLife logo, SDG 12 badge, clean enterprise dark-mode graphic.

---

## Slide 2: The Problem: The Hidden E-Waste Crisis in Campus IT
- **Key Message:** Enterprise IT hardware is scrapped due to routine calendar depreciation, not actual equipment failure.
- **Problem Bullet Points:**
  - Universities and enterprises decommission millions of computing assets every 3–5 years purely based on accounting cycles.
  - Up to 80% of a computer's total lifetime carbon footprint is embodied in semiconductor fabrication and mineral extraction.
  - Over 50 million metric tons of global e-waste are generated annually, containing lead, mercury, and critical rare-earth metals.
- **The Core Paradox:** Decommissioned laptops often retain 80%+ useful computing life, yet are sent to recyclers while adjacent campus departments purchase brand-new entry-level machines.

---

## Slide 3: Why Existing Asset Disposal Fails
- **Key Message:** Institutional IT disposition is trapped between data paranoia and manual spreadsheet chaos.
- **Current Structural Gaps:**
  1. *Manual & Ad-Hoc Evaluation:* Technicians rely on unstructured Excel sheets without standardized condition or capability profiling.
  2. *All-or-Nothing Scrapping:* A laptop with a single sticking key or dry thermal paste is classified as "broken" and scrapped entirely.
  3. *Severe Data Security Fears:* Fear of data leaks drives blanket destruction of functional drives rather than cryptographically verified sanitization.
  4. *Disconnected Demand:* Surplus IT teams have zero visibility into open equipment requisitions in teaching labs or community schools.

---

## Slide 4: UN SDG 12 Alignment: Responsible Consumption & Production
- **Key Message:** ReLife directly operationalizes targets 12.2 and 12.5 through high-retention circular economy loops.
- **Target Mapping:**
  - **Target 12.2 (Sustainable Management of Natural Resources):** Extending hardware lifespan from 3 to 6 years reduces annualized mineral and semiconductor extraction by ~45%.
  - **Target 12.5 (Substantial Waste Reduction):** Diverts functional components and complete devices from landfills into productive second-life roles.
  - **Secondary Alignment:** SDG 13 (Climate Action — avoiding Scope 3 manufacturing emissions) and SDG 9 (Industry, Innovation & Infrastructure).
- **Visual:** UN SDG 12 official icon alongside the 6 canonical circular pathways (Direct Reuse, Repair, Refurbish, Repurpose, Component Harvest, Recycle).

---

## Slide 5: Solution Overview: ReLife
- **Key Message:** Transforming IT asset disposal into an intelligent, secure, and auditable second-life orchestration pipeline.
- **The Fundamental Paradigm Shift:**
  $$\textbf{ASSET} \longrightarrow \textbf{CAPABILITY} \longrightarrow \textbf{NEED} + \textbf{SECURITY} + \textbf{ECONOMICS} \longrightarrow \textbf{CIRCULAR DECISION}$$
- **The 6 Standardized Circular Pathways:**
  1. *Direct Reuse:* Immediate redeployment to active departmental demand.
  2. *Repair:* Targeted minor servicing (keyboard, thermal repaste) restoring full utility.
  3. *Refurbishment:* Hardware upgrades (RAM, SSD) and cosmetic restoration.
  4. *Repurposing:* Re-allocating hardware to secondary roles (Linux lab node, IoT gateway).
  5. *Component Recovery:* Harvesting functional modular parts for internal spare pools.
  6. *Certified Recycling:* WEEE/R2 compliant material extraction as an absolute last resort.
- **Visual:** `submission/screenshots/01_command_center.png` showing fleet triage and lifecycle progression.

---

## Slide 6: How ReLife Works: Intake, Profiling & Decision Pipeline
- **Key Message:** An end-to-end pipeline connecting physical hardware onboarding to institutional demand.
- **Step-by-Step Flow:**
  1. **Interactive Asset Intake:** Technicians register surplus devices via modal form (`DEMO-LAP-031`), immediately compiling hardware specifications.
  2. **Deterministic Security Gate:** Enforces NIST SP 800-88 Rev. 2; strictly blocks unverified storage from reuse.
  3. **Capability Profiler:** Evaluates compute tiers, multitasking limits, and OS compatibility.
  4. **Economics & Impact Engine:** Calculates repair costs, residual value, and avoided carbon via validated equations.
  5. **AI Reasoning & Scenario Engine:** Compares trade-offs across 4 institutional objectives.
  6. **Demand Matcher:** Ranks compatible campus requests.
  7. **Human Approval:** Authorized officer signs off on final disposition.
  8. **Circular Passport:** Appends immutable audit event to the ledger.
- **Visual:** `submission/screenshots/02_add_asset.png` and `submission/screenshots/03_registered_asset.png`.

---

## Slide 7: Where AI Is Used (And Where It Is Strictly Bounded)
- **Key Message:** AI is assistive, contextual, and explainable — never autonomous or unconstrained.
- **The Zero-Trust Division of Responsibility:**
  - **What IBM Granite & RAG Do:**
    - Contextual interpretation of technician defect notes into structured severities.
    - Creative repurposing brainstorming for non-standard hardware.
    - Multi-attribute trade-off synthesis and plain-language recommendation rationales.
  - **What Deterministic Engines Do:**
    - Non-bypassable media sanitization gate enforcement.
    - Mathematical repair cost and residual value arithmetic.
    - Embodied $\text{CO}_2\text{e}$ and e-waste mass calculations.
    - Final state transitions and audit logging.
- **Governance Axiom:**
  $$\textbf{AI RECOMMENDS} \quad\cdot\quad \textbf{RULES ENFORCE SAFETY} \quad\cdot\quad \textbf{HUMANS APPROVE}$$
- **Visual:** `submission/screenshots/04_asset_intelligence.png` showing capability profile and recommendation dossier.

---

## Slide 8: Security & Responsible AI Architecture
- **Key Message:** Enterprise data privacy and ethical AI principles embedded directly into system code.
- **The 4 Core Ethical Pillars:**
  1. **Privacy & Safety First:** NIST SP 800-88 Rev. 2 compliance. Unverified storage is blocked from reuse by backend code (**HTTP 403 Forbidden** on unsafe override).
  2. **Algorithmic Transparency:** Transparent Multi-Attribute Utility Theory (MAUT) equations; zero hidden scoring weights.
  3. **Fair Allocation:** Objective capability matching eliminates departmental hoarding.
  4. **Human Oversight:** Human officers have final sign-off; models cannot unilaterally dispose of hardware.
- **Visual:** `submission/screenshots/08_security_block.png` (HTTP 403 security boundary) and `submission/screenshots/11_governance.png` (Responsible AI Charter).

---

## Slide 9: Scenario Lab & Institutional Demand Matching
- **Key Message:** Optimizing hardware allocation to meet institutional strategic goals and active campus needs.
- **Key Capabilities Highlighted:**
  - **Scenario Lab:** Multi-objective switcher (`BALANCED`, `SUSTAINABILITY_FIRST`, `COST_FIRST`, `UTILIZATION_FIRST`). Explains "What Was Gained vs. What Was Sacrificed".
  - **Demand Matching:** Connects decommissioned assets to active departmental requisitions across 6 technical dimensions (compute tier, RAM, storage, mobility, OS, security).
- **Visual:** `submission/screenshots/05_scenario_lab.png` and `submission/screenshots/06_demand_matching.png`.

---

## Slide 10: Human Approval Workstation & Circular IT Asset Passport
- **Key Message:** Complete institutional accountability and forensic-level audit trails.
- **Key Capabilities Highlighted:**
  - **Approval Center:** Technicians review AI dossiers, verify security certificates, and authorize actions (Approve, Override, Reject).
  - **Circular Passport:** Append-only lifecycle ledger recording complete chain of custody with structured event records and expandable raw JSON inspection.
- **Visual:** `submission/screenshots/07_approval_center.png` and `submission/screenshots/09_circular_passport.png`.

---

## Slide 11: SDG 12 Impact Center & Environmental Accounting
- **Key Message:** Concrete, quantifiable sustainability metrics grounded in transparent scientific literature.
- **Demonstration Metrics:**
  - **Live 3-Scenario Demonstration Fleet:**
    - **Procurement Capital Saved:** **₹128,000** in deferred new equipment purchases.
    - **Avoided Embodied Carbon:** **292.5 kg $\text{CO}_2\text{e}$** [ESTIMATE ONLY].
    - **Electronic Waste Diverted:** **11.7 kg** of hazardous electronics kept out of landfills [ESTIMATE ONLY].
    - **Operational Longevity Extended:** **+6.5 Years** of restored computing service [ESTIMATE ONLY].
  - **Full 22-Asset Assessed Portfolio Potential:** ₹990,000 capital, ~2,722.5 kg $\text{CO}_2\text{e}$, ~46.2 kg e-waste, +60.5 years.
- **Academic Integrity:** Emission factors cite Teehan & Kandlikar (2013) and Prakash et al. (Öko-Institut 2020), accessible via the interactive Methodology Drawer.
- **Visual:** `submission/screenshots/10_impact_center.png`.

---

## Slide 12: Prototype Implementation & Verification Evidence
- **Key Message:** A fully functional, tested, and verifiable full-stack software application.
- **Engineering Baseline:**
  - **Backend:** FastAPI, Python 3.11+, SQLite, SQLAlchemy, Pydantic v2.
  - **Frontend:** React, TypeScript, Vite, Tailwind CSS.
  - **AI Integration:** IBM Granite (`ibm/granite-3-8b-instruct`), IBM watsonx.ai, offline fallback mock, local RAG engine.
  - **Workflow Capabilities:** On-demand Asset Intake workflow, Multi-objective MAUT, NIST SP 800-88 hard gate.
  - **Automated Verification:** **39 passed / 0 failed** pytest test suite; clean production build.
- **Visual:** Terminal verification evidence showing 39 passed pytest tests and Vite build success.

---

## Slide 13: Prototype Boundaries & Future Roadmap
- **Key Message:** Honest academic disclosures and a clear path toward enterprise production.
- **Current Prototype Boundaries:**
  - Tested on a synthetic demonstration dataset (30 assets) to protect institutional privacy.
  - Environmental figures are provisional estimates based on published academic LCA heuristics.
  - Static RAG repository of 10 core standards and repair guides.
- **Future Production Roadmap:**
  1. Automated PXE network booting for automated disk wipe certificate ingestion (ShredOS / DBAN).
  2. Enterprise ITAM integration webhooks (ServiceNow, Snipe-IT, Jamf).
  3. Dynamic Scope 3 carbon API feeds (Climatiq, Ecoinvent).
  4. Multi-campus surplus hardware exchange federation.

---

## Slide 14: Conclusion & Final Impact Statement
- **Closing Takeaway:**
  > *"ReLife proves that AI can transform institutional IT sustainability from an ad-hoc disposal problem into an intelligent, transparent, and auditable second-life orchestration platform.*  
  >  
  > *By grounding generative models in deterministic security gates and empowering human decision-makers, we can keep functional computers out of landfills, save valuable institutional capital, and genuinely advance UN SDG 12."*
- **Call to Action / Submission Details:**
  - GitHub Repository: [github.com/Ameersuhail799/RELIFE](https://github.com/Ameersuhail799/RELIFE.git)
  - Release Baseline: `milestone-4` (Commit `4a2d058`)
  - Thank You & Q&A Open.
