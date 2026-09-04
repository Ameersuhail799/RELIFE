# Separation of AI Reasoning & Deterministic Business Logic in ReLife

## 1. Architectural Philosophy

In sustainability and enterprise IT asset disposition, hallucination or stochastic behavior in high-stakes areas (data sanitization, compliance, financial thresholds) is unacceptable. ReLife enforces a **three-tier decision pipeline**:

1. **Deterministic Hard Gates & Filters**:
   - Security sanitization audit.
   - Mechanical / electrical pathway eligibility.
   - Capability-based demand matching.
   - Cannot be bypassed by prompt injection, hallucinations, or even human override.
2. **Deterministic Calculations**:
   - Repair costs, residual values, replacement costs, economic threshold comparisons.
   - Versioned LCA impact estimation formulas (`impact_assumptions_v1.json`).
3. **AI Reasoning, Synthesis & Explanation**:
   - Natural-language defect note interpretation.
   - Repurposing ideation based on device capability profile.
   - Multi-factor ranking among eligible pathways.
   - Transparent, human-oriented explanation ("Why this recommendation?", trade-offs, confidence, assumptions).

```
       ┌────────────────────────────────────────────────────────┐
       │                 Incoming Asset Profile                 │
       └───────────────────────────┬────────────────────────────┘
                                   │
               ┌───────────────────▼───────────────────┐
               │    [DETERMINISTIC SECURITY GATE]      │
               │ Storage present? Sanitization valid?  │
               └───────────────────┬───────────────────┘
                    Passed         │        Failed
               ┌───────────────────┴───────────────────┐
               ▼                                       ▼
      [Clear to Reuse]                       [Block Direct Reuse]
               │                                       │
               └───────────────────┬───────────────────┘
                                   │
               ┌───────────────────▼───────────────────┐
               │  [DETERMINISTIC ELIGIBILITY FILTER]   │
               │  Prunes invalid pathways based on     │
               │  hard hardware & viability criteria   │
               └───────────────────┬───────────────────┘
                                   │
               ┌───────────────────▼───────────────────┐
               │ [DETERMINISTIC ECONOMICS & IMPACT]    │
               │ • Repair cost, residual value         │
               │ • Avoided purchase cost               │
               │ • Versioned LCA estimate formulas     │
               └───────────────────┬───────────────────┘
                                   │
               ┌───────────────────▼───────────────────┐
               │     [AI REASONING & EXPLANATION]      │
               │ • Ranks only ELIGIBLE pathways        │
               │ • Synthesizes trade-offs              │
               │ • Generates "Why this recommendation?"│
               │ • Details confidence & assumptions    │
               └───────────────────┬───────────────────┘
                                   │
               ┌───────────────────▼───────────────────┐
               │     [HUMAN-IN-THE-LOOP APPROVAL]      │
               │ Technician reviews & signs off        │
               │ (Security gate cannot be bypassed!)   │
               └───────────────────────────────────────┘
```

---

## 2. Granular Responsibility Matrix

| Feature / Step | Deterministic Rules | AI / LLM Responsibility | Reason for Separation |
|---|---|---|---|
| **Data Sanitization Gate** | Evaluates 6 audit fields (`storage_present`, `sanitization_method`, `sanitization_status`, `sanitization_verified`, `verification_reference`, `verified_at`, `verified_by`). Disqualifies reuse if storage is unverified. | None. LLM is strictly prohibited from bypassing or evaluating sanitization validity. | Data security (NIST SP 800-88 compliance) cannot tolerate probabilistic model outputs. |
| **Human Override Gate** | Programmatically rejects any human override attempting to select Direct Reuse / Redeployment if the asset failed the sanitization gate. | None. | Prevents human error or coercion from creating an institutional data leak. |
| **Pathway Eligibility Layer** | Hard filters determine which of the 6 pathways are technically and physically feasible. | Operates only on the subset of eligible pathways. | Saves tokens, eliminates hallucinations of impossible actions (e.g. repairing a crushed board). |
| **Role-Based Demand Matcher** | Matches asset multidimensional capability profile against institutional role requirements (compute tier, mobility, OS, ports). | Identifies if a slight downgrade or alternative OS (e.g. ChromeOS Flex) could meet a flexible requirement. | Guaranteed compliance with minimum technical prerequisites. |
| **Repair Economics & Residual Value** | Formulaic: $\text{Part Costs} + (\text{Labor Hours} \times \text{Rate})$. Threshold checks (`repair_cost > 0.5 * residual_value`). | Explains economic feasibility and trade-offs to the human reviewer. | Financial decisions must be auditable and reproducible. |
| **Environmental Impact Estimates** | Formulas driven by versioned configuration (`impact_assumptions_v1.json`) with documented source and confidence metadata. | Articulates the sustainability narrative and trade-offs. | Absolute consistency and auditable citations for all green claims. Labeled as ESTIMATES. |
| **Uncertainty & Assumptions** | N/A | Explicitly lists assumptions (e.g. "assumes replacement fan is readily in stock") and confidence levels. | Full transparency for the human supervisor. |
| **Circular Asset Passport** | Appends tamper-evident audit records to database. | None. | Legal and institutional compliance record keeping. |
