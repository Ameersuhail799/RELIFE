# ReLife — Final Demonstration Script & Presenter Walkthrough

> **Internship Track:** 1M1B – IBM SkillsBuild AI for Sustainability Virtual Internship (July–September 2026)  
> **Presenter / Author:** Ameer Suhail ([Ameersuhail799/RELIFE](https://github.com/Ameersuhail799/RELIFE.git))  
> **Estimated Demo Duration:** 6–8 minutes  
> **Target Audience:** Technical Mentors, Sustainability Evaluators, Institutional IT Directors

---

## Technical Preparation Checklist (Before Starting Demo)

1. Ensure the FastAPI backend is running:
   ```powershell
   python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
   ```
2. Ensure the Vite frontend is running:
   ```powershell
   cd frontend && npm run dev
   ```
3. Open browser at `http://localhost:5173`.
4. Maximize the window for a clean 1440px desktop view.

---

## Timed Demonstration Flow

```
[0:00 - 1:00]  Introduction & Sustainability Problem (SDG 12)
[1:00 - 2:00]  Command Center: Institutional Fleet Overview
[2:00 - 3:00]  Scenario A: Asset Intelligence & Capability Profiling (SIM-LAP-001)
[3:00 - 4:00]  Scenario Lab & Multi-Objective Optimization
[4:00 - 4:45]  Institutional Demand Matching
[4:45 - 5:45]  Approval Center & The Non-Bypassable Security Gate (SIM-LAP-002 / HTTP 403)
[5:45 - 6:30]  Circular IT Asset Passport: Immutable Audit Ledger
[6:30 - 7:15]  Impact Center & LCA Methodology Disclosures
[7:15 - 8:00]  Conclusion & Responsible AI Governance Core
```

---

## Detailed Step-by-Step Script with Exact Narration

### Step 1: Opening & Problem Context (0:00 – 1:00)
- **Screen:** Open `http://localhost:5173/` (Command Center).
- **Presenter Narration:**
  > *"Good morning, respected evaluators and mentors. Today I am presenting **ReLife**, a circular IT asset intelligence and second-life orchestration platform developed for UN SDG 12: Responsible Consumption and Production.*  
  >  
  > *Every year, universities and colleges decommission hundreds of desktop towers and laptops due to routine 3-year accounting cycles, not hardware failure. Over 75% of a computer's total lifecycle carbon emissions are embodied in its semiconductor manufacturing. When we scrap these machines prematurely, we waste immense embodied energy and generate hazardous e-waste.*  
  >  
  > *Existing disposal methods are ad-hoc spreadsheets. ReLife introduces a structured paradigm shift: **ASSET to CAPABILITY, CAPABILITY to DEMAND, and DEMAND plus SECURITY and ECONOMICS to an explainable CIRCULAR DECISION**.*  
  >  
  > *Crucially, our governance axiom is: **AI RECOMMENDS · RULES ENFORCE SAFETY · HUMANS APPROVE**."*

---

### Step 2: Portfolio Command Center (1:00 – 2:00)
- **Screen:** Hover over the Attention Cards and Lifecycle Progression funnel.
- **Action:** Point out the Attention Metrics and Lifecycle Funnel.
- **Presenter Narration:**
  > *"We begin in the **Institutional IT Portfolio Command Center**. ReLife is an institutional portfolio system, not an isolated single-device toy.*  
  >  
  > *Here we see our simulated campus fleet of 30 assets. Notice our attention metrics immediately highlight **12 Unverified Storage Drives** blocked under NIST SP 800-88 Rev. 2 guidelines.*  
  >  
  > *In the lifecycle progression bar, notice we strictly distinguish registered, assessed, eligible, and approved assets. Seeded assets are never collapsed into an inflated 'success' metric. Below, our circular pathway breakdown shows that out of evaluated units, 11 are cleared for direct reuse, 11 for repair, and 1 for repurposing."*

---

### Step 3: Asset Intelligence & Capability Profiling (2:00 – 3:00)
- **Screen:** Click on `/assets` (Asset Intelligence). Select `SIM-LAP-001` (Lenovo ThinkPad T490).
- **Action:** Scroll down through the Hardware Capability Profile and Decision Evidence cards.
- **Presenter Narration:**
  > *"Let's examine **Scenario A**: `SIM-LAP-001`, an off-lease ThinkPad T490 from the Computer Science department.*  
  >  
  > *Notice how ReLife abstracts raw specifications into a multidimensional **Hardware Capability Profile**: it identifies a Performance-tier quad-core i5, 16GB RAM, fast NVMe storage, and confirms Windows 11 and Linux compatibility.*  
  >  
  > *Look at the **NIST SP 800-88 Rev. 2 Media Sanitization Hard Gate**: it shows a verified green status because an authorized technician logged a cryptographic erase certificate (`CERT-2026-NIST-88-101`).*  
  >  
  > *Under the Balanced objective, the AI reasoning layer—powered by our modular IBM Granite integration—synthesizes pre-calculated deterministic economics with RAG guidelines to recommend **DIRECT REUSE** with a Suitability Score of 99.0/100 and High Confidence. Notice the clear explainability narrative explaining why direct reuse outperforms alternatives."*

---

### Step 4: Scenario Lab & Multi-Objective Optimization (3:00 – 4:00)
- **Screen:** Click on `/scenarios` (Scenario Lab).
- **Action:** Toggle between `BALANCED`, `SUSTAINABILITY_FIRST`, and `COST_FIRST`.
- **Presenter Narration:**
  > *"Different institutions have different strategic priorities. In the **Circular Scenario Lab**, we evaluate all 6 circular pathways side-by-side using Multi-Attribute Utility Theory.*  
  >  
  > *Under the `BALANCED` objective, Direct Reuse ranks #1. Now, let's switch the objective to `COST_FIRST`. Watch the ranking re-balance: pathways with zero capital spend are prioritized, and high-cost refurbishments are penalized.*  
  >  
  > *Notice the dedicated card explaining **'What Was Gained vs. What Was Sacrificed'**. The rankings and suitability scores are calculated deterministically in our backend math engine; the AI interprets and articulates the strategic trade-offs for the decision-maker."*

---

### Step 5: Institutional Demand Matching (4:00 – 4:45)
- **Screen:** Click on `/demand` (Demand Matching). Select `DEMAND-CSE-01`.
- **Action:** Show the ranked candidates and the "Why Does This Asset Fit?" analysis.
- **Presenter Narration:**
  > *"Circular IT only works if there is a real recipient. In **Demand Matching**, ReLife connects surplus inventory to open departmental hardware requisitions across campus.*  
  >  
  > *The Computer Science department needs 10 coding workstations with at least 8GB RAM and quad-core CPUs. Look at our ranked candidates: `SIM-LAP-001` ranks as Match #1 with a **100% Match Score**.*  
  >  
  > *Our multi-dimensional fit analysis articulates exactly why it fits: quad-core CPU exceeds requirements, 16GB RAM provides headroom, and fast NVMe storage ensures high productivity. Circular reuse directly saves the department from procuring new machines."*

---

### Step 6: Approval Center & The Non-Bypassable Security Gate (4:45 – 5:45)
- **Screen:** Click on `/approvals` (Approval Center). Select `REC-E0E432B9` (`SIM-LAP-002`, Dell Latitude 7490).
- **Action:** Attempt to override pathway to `DIRECT_REUSE` and click Submit.
- **Presenter Narration:**
  > *"Now we arrive at the most critical architectural demonstration of ReLife: **Human-in-the-Loop Approval and our Non-Bypassable Security Gate**.*  
  >  
  > *Here is `SIM-LAP-002`. Notice its security status: **GATE: BLOCKED**. Its storage drive is unverified under NIST SP 800-88 Rev. 2. The AI correctly recommended **REPAIR** because repair in a secure shop is physically safe.*  
  >  
  > *Now, imagine a human technician attempts to cut corners. I switch to **'Override Pathway'**, select **Direct Reuse / Internal Redeployment**, and click **Submit Human Approval**.*  
  >  
  > *Look at the result: **HTTP 403 FORBIDDEN**. A prominent red security violation banner appears!*  
  >  
  > *Our backend security service programmatically enforces the policy: **No human, and no generative model, can bypass data sanitization**. If storage is unverified, direct redeployment is strictly forbidden.*  
  >  
  > *When we revert the decision to **Approve AI Recommendation (REPAIR)**, the action succeeds immediately with HTTP 200 OK because servicing is compliant."*

---

### Step 7: Circular Asset Passport (5:45 – 6:30)
- **Screen:** Click on `/passport?asset=SIM-LAP-001` (Circular Passport).
- **Action:** Scroll through the vertical audit trail and expand a raw JSON ledger snippet.
- **Presenter Narration:**
  > *"Every lifecycle action is logged to the **Circular IT Asset Passport**. This is an append-only audit trail providing cryptographic chain-of-custody verification.*  
  >  
  > *Notice the chronological progression: initial asset registration, sanitization gate check with technician certificate, AI recommendation generation, and final human decision approval by Dr. Elena Rostova.*  
  >  
  > *Every event includes timestamp, actor identity, and an expandable raw JSON audit snippet. This satisfies internal university governance and external WEEE environmental compliance without making inflated blockchain claims."*

---

### Step 8: SDG 12 Impact Center & LCA Methodology (6:30 – 7:15)
- **Screen:** Click on `/impact` (Impact Center). Click **"Methodology & Assumptions"** button.
- **Action:** Highlight the `[ESTIMATE ONLY]` tags and the slide-over methodology drawer.
- **Presenter Narration:**
  > *"In the **SDG 12 Circular Impact Center**, we aggregate institutional sustainability gains across the portfolio.*  
  >  
  > *For our 30-asset fleet, circular redeployment has achieved **₹990,000 in deferred procurement capital**, **~2,722.5 kg of avoided embodied $\text{CO}_2\text{e}$**, and **~46.2 kg of e-waste diverted**.*  
  >  
  > *In accordance with rigorous academic and Responsible AI principles, every figure is clearly marked **[ESTIMATE ONLY]**.*  
  >  
  > *Opening our **Methodology & Assumptions drawer**, we fully disclose our lifecycle emission factors—such as 247.5 kg $\text{CO}_2\text{e}$ per laptop—citing peer-reviewed research by Teehan & Kandlikar (2013) and Prakash et al. (Öko-Institut 2020). We never claim to be certified carbon accounting."*

---

### Step 9: Conclusion & Responsible AI Governance Core (7:15 – 8:00)
- **Screen:** Click the **"Governance"** button in the top navbar to open `GovernanceDrawer`.
- **Action:** Display the 6 Responsible AI pillars.
- **Presenter Narration:**
  > *"To conclude, I click our global **Governance Core**. ReLife exemplifies Responsible AI in sustainability across all four required dimensions:*  
  >  
  > 1. ***Safety First & Privacy by Design:** Data sanitization is non-bypassable under NIST SP 800-88 Rev. 2.*  
  > 2. ***Algorithmic Transparency:** Clear Multi-Attribute Utility formulas with zero hidden weights.*  
  > 3. ***Fair Allocation:** Departmental requests fulfilled by objective capability fit rather than institutional hoarding.*  
  > 4. ***Human Oversight:** AI recommends, rules enforce safety, and humans approve.*  
  >  
  > *ReLife proves that AI can drive circular economy outcomes while remaining safe, explainable, and accountable. Thank you, and I welcome your questions."*
