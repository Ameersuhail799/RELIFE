# ReLife — Responsible AI & Governance Submission Dossier

> **Internship Track:** 1M1B – IBM SkillsBuild AI for Sustainability Virtual Internship (July–September 2026)  
> **Student / Author:** Ameer Suhail ([Ameersuhail799/RELIFE](https://github.com/Ameersuhail799/RELIFE.git))  
> **Primary SDG Alignment:** [UN SDG 12: Responsible Consumption and Production](https://sdgs.un.org/goals/goal12)  
> **Core Governance Axiom:**  
> $$\textbf{AI RECOMMENDS} \quad\cdot\quad \textbf{RULES ENFORCE SAFETY} \quad\cdot\quad \textbf{HUMANS APPROVE}$$

---

## 1. Executive Summary: Why Responsible AI is Foundational to ReLife

In enterprise and higher-education IT asset disposition, irresponsible automation introduces catastrophic risks:
1. **Severe Privacy & Security Breaches:** An unvetted generative model authorizing the reuse of a laptop containing confidential student records or proprietary research data.
2. **Economic Waste & Fraud:** Generative hallucinations fabricating repair costs or overestimating residual values.
3. **Greenwashing & False Claims:** Presenting rough heuristics as certified corporate carbon accounting.

ReLife prevents these failure modes through an architectural zero-trust model. Generative AI is strictly confined to advisory, contextual, and explainability tasks, while deterministic algorithms enforce security policies, compute economic costs, and aggregate environmental estimates.

---

## 2. Core Ethical Dimensions (1M1B / IBM SkillsBuild Rubric)

### Dimension 1: Fairness
- **Equitable Institutional Hardware Allocation:** In academic institutions, premium decommissioned hardware is frequently hoarded by well-funded departments, while underfunded units receive obsolete machinery. ReLife's Demand Matching Engine matches hardware based on objective multidimensional capability fit and transparent priority queues (`CRITICAL` > `HIGH` > `MEDIUM` > `LOW`), eliminating departmental bias.
- **Objective Multi-Attribute Scoring:** The Multi-Attribute Utility Theory (MAUT) formulation uses transparent, normalized mathematical functions ($N_{\text{cost}}, N_{\text{sustain}}, N_{\text{demand}}, N_{\text{readiness}}$), ensuring all eligible pathways are evaluated impartially without hidden weighting.

### Dimension 2: Transparency & Explainability
- **Explainable Recommendation Dossier:** Every recommendation provides a structured explainability payload detailing:
  - *Why This Recommendation:* Concrete reasoning connecting hardware capabilities to the top-ranked pathway.
  - *Key Decision Factors:* Bulleted factual drivers (e.g. zero repair spend, verified sanitization certificate).
  - *Alternatives Considered:* Explicit tabular comparison against pathways ranked #2 through #5.
  - *Trade-off Analysis:* Clear identification of what was gained versus what was sacrificed.
- **Traceable Scientific Lineage:** All lifecycle emission factors cite published academic research (Teehan & Kandlikar 2013, Prakash et al. / Öko-Institut 2020) and are accessible directly inside the UI via the interactive Methodology & Assumptions drawer.

### Dimension 3: Ethics & Environmental Integrity
- **Anti-Greenwashing Guarantees:** All carbon avoidance, e-waste diversion, and financial savings numbers carry mandatory `[ESTIMATE ONLY]` disclaimers. The platform strictly prohibits claiming that provisional LCA calculations constitute certified Scope 3 carbon accounting.
- **Honest Data Disclosure:** Demonstration records are explicitly flagged as `[SIMULATED DATASET]`, ensuring evaluators and users are never misled into believing the platform is currently integrated into a live production inventory.

### Dimension 4: Privacy & Data Security by Design
- **Non-Bypassable Media Sanitization Gate:** Programmatic compliance with **NIST SP 800-88 Rev. 2 (Guidelines for Media Sanitization, September 2025)**. If an asset contains persistent storage, the pathways `DIRECT_REUSE`, `DONATION`, and `RESALE` are unconditionally blocked unless an authorized technician records a verified wipe method (e.g. Cryptographic Erase, Purge, Clear) and audit certificate.
- **Server-Side API Security Enforcement:** Security checks are enforced inside backend service layers. Even if a user attempts to manually forge an approval override via direct API calls, the backend halts execution with an **HTTP 403 Forbidden** `SecurityGateViolationError`.
- **Zero Personally Identifiable Information (PII):** The platform stores only anonymized hardware serial numbers, technician operator IDs, and hardware telemetry. No student, faculty, or institutional private data is ingested or stored.

---

## 3. ReLife's Six Core Governance Pillars

The ReLife application integrates a persistent global slide-over interface ([`frontend/src/components/common/GovernanceDrawer.tsx`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/frontend/src/components/common/GovernanceDrawer.tsx)) detailing the six pillars:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        RELIFE GOVERNANCE CORE                          │
│        "AI RECOMMENDS · RULES ENFORCE SAFETY · HUMANS APPROVE"         │
└────────────────────────────────────────────────────────────────────────┘
          │                   │                   │
   ┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐
   │ Safety First│     │ Algorithmic │     │ Privacy by  │
   │ Deterministic│    │ Transparency│     │   Design    │
   │  Gateways   │     │  Clear MAUT │     │ NIST 800-88 │
   └─────────────┘     └─────────────┘     └─────────────┘
          │                   │                   │
   ┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐
   │    Fair     │     │ Uncertainty │     │    Human    │
   │ Allocation  │     │  Awareness  │     │  Oversight  │
   │ Objective   │     │ Explicit    │     │ Final Sign- │
   │ Demand Fit  │     │ Confidence  │     │     Off     │
   └─────────────┘     └─────────────┘     └─────────────┘
```

1. **Safety First (Deterministic Gateways):** Sanitization compliance is a hard boolean condition. Generative models cannot modify security states or authorize direct reuse of unsanitized storage.
2. **Algorithmic Transparency (Explainable Utility):** Decision objective rankings are calculated via deterministic Multi-Attribute Utility Theory with published weights; AI provides narrative interpretation.
3. **Privacy by Design (NIST SP 800-88 Rev. 2):** Clear, Purge, and Destroy criteria require explicit cryptographic verification references before reuse or donation pathways unlock.
4. **Fair Allocation (Institutional Equity):** Automated matching prioritizes departmental needs based on verified capability requirements rather than arbitrary departmental budgets.
5. **Uncertainty Awareness (Confidence Metrics):** Outputs explicitly declare confidence (`HIGH`, `MEDIUM`, `LOW`), engineering assumptions, and unverified parameters.
6. **Human Oversight (Human-in-the-Loop):** Every circular pathway remains in `PENDING_APPROVAL` until a verified human officer enters an audit note and authorizes disposition.

---

## 4. Verification & Testing Evidence for Responsible AI

Responsible AI principles are backed by automated tests:

- **Security Override Rejection:** [`backend/tests/test_vertical_slice.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/tests/test_vertical_slice.py#L65-L101) (`test_scenario_b_repair_and_redeploy_with_override_security_gate_block`) tests that attempting to override an unverified drive to direct reuse returns HTTP 403.
- **Economic Invariance Under AI:** [`backend/tests/test_ai_and_scenarios.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/tests/test_ai_and_scenarios.py#L42-L68) (`test_3_ai_cannot_modify_deterministic_economics`) proves that the LLM cannot alter calculated repair costs or residual values.
- **RAG Metadata Grounding:** [`backend/tests/test_ai_and_scenarios.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/tests/test_ai_and_scenarios.py#L70-L84) (`test_4_rag_source_metadata_preservation`) verifies that knowledge citations preserve source IDs and publication metadata.
- **NIST SP 800-88 Rev. 2 Invariance:** [`backend/tests/test_ai_and_scenarios.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/tests/test_ai_and_scenarios.py#L182-L200) (`test_11_nist_sp_800_88_r2_metadata_and_security_gate_invariance`) proves that citing NIST guidance never bypasses the requirement for explicit technician verification.
