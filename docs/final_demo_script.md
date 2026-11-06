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
4. Maximize the window for a clean 1920x1080 desktop view.
5. Ensure clean demo database state (30 simulated assets, 4 demand records, 3 canonical assessed assets).

---

## Timed Demonstration Flow

```
[0:00 - 0:45]  Step 1: Introduction & Problem Context (Command Center)
[0:45 - 1:30]  Step 2: Interactive Asset Intake Workflow (Add Asset Modal)
[1:30 - 2:00]  Step 3: Real-Time Inventory Reflection (DEMO-LAP-031)
[2:00 - 3:00]  Step 4: Asset Intelligence & Capability Profiling (SIM-LAP-001)
[3:00 - 3:45]  Step 5: Scenario Lab & Multi-Objective Optimization
[3:45 - 4:30]  Step 6: Institutional Demand Matching (DEMAND-CSE-01)
[4:30 - 5:15]  Step 7: Human-in-the-Loop Approval Center
[5:15 - 6:00]  Step 8: Non-Bypassable Security Hard Gate (SIM-LAP-002 / HTTP 403)
[6:00 - 6:45]  Step 9: Circular IT Asset Passport & Audit Ledger
[6:45 - 7:30]  Step 10: SDG 12 Circular Impact Center & LCA Disclosures
[7:30 - 8:00]  Step 11: Conclusion & Responsible AI Governance Core
```

---

## Detailed Step-by-Step Script with Exact Narration

### Step 1: Opening & Portfolio Command Center (0:00 – 0:45)
- **Screen:** `http://localhost:5173/` (`01_command_center.png`)
- **Action:** Point out total fleet triage, attention cards, lifecycle funnel, and `[SIMULATED DATASET]` badge.
- **Presenter Narration:**
  > *"Good morning, respected evaluators and mentors. Today I am presenting **ReLife**, a circular IT asset intelligence and second-life orchestration platform developed for UN SDG 12: Responsible Consumption and Production.*  
  >  
  > *Every semester, universities and enterprises decommission hundreds of functioning computers due to routine 3-year accounting cycles, not hardware failure. Over 75% of a computer's lifecycle carbon emissions are embodied in silicon manufacturing. Scrapping them prematurely causes massive e-waste and squanders valuable embodied energy.*  
  >  
  > *We begin at the **Institutional Command Center**. ReLife is a portfolio-scale decision engine. Notice our fleet overview: 30 registered assets, lifecycle triage funnel, and attention cards highlighting **12 unverified storage drives** quarantined under NIST SP 800-88 Rev. 2."*

---

### Step 2: Interactive Asset Intake Workflow (0:45 – 1:30)
- **Screen:** Command Center $ightarrow$ Add Asset Modal (`02_add_asset.png`)
- **Action:** Click "+ Add Asset" button in top header. Populate form with `DEMO-LAP-031` details.
- **Presenter Narration:**
  > *"Rather than relying only on pre-loaded simulated data, ReLife provides a seamless enterprise **Asset Intake Workflow**.*  
  >  
  > *Clicking '+ Add Asset' allows on-site IT technicians to register surplus equipment in real time. Here, we register `DEMO-LAP-031`, an 11th-Gen Intel Core i5 laptop returned by the Economics Department. We enter its hardware specifications, Grade A working condition, and set its drive status to UNVERIFIED to enforce data protection."*

---

### Step 3: Real-Time Inventory Reflection (1:30 – 2:00)
- **Screen:** `/assets` showing `DEMO-LAP-031` (`03_registered_asset.png`)
- **Action:** Click "Register Asset" and show immediate appearance in inventory.
- **Presenter Narration:**
  > *"Upon submission, `DEMO-LAP-031` is immediately persisted to the SQLite database and reflected in our inventory with its dynamic capability profile.*  
  >  
  > *Notice the red UNVERIFIED drive badge: the machine cannot be redeployed until sanitization is logged. It is now ready for circular evaluation."*

---

### Step 4: Asset Intelligence & Capability Profiling (2:00 – 3:00)
- **Screen:** `/assets` $ightarrow$ `SIM-LAP-001` (`04_asset_intelligence.png`)
- **Action:** Select `SIM-LAP-001` (Lenovo ThinkPad T490). Review capability profile, security gate, and recommendation.
- **Presenter Narration:**
  > *"Now let's examine **Scenario A**: `SIM-LAP-001`, an off-lease ThinkPad T490.*  
  >  
  > *Notice how ReLife abstracts low-level hardware specs into a multidimensional **Hardware Capability Profile**: quad-core i5, 16GB RAM, fast NVMe storage, and Windows 11 compatibility.*  
  >  
  > *Look at the **NIST SP 800-88 Rev. 2 Hard Gate**: it displays a green PASS status with verified sanitization certificate `CERT-2026-NIST-88-101`.*  
  >  
  > *Our AI reasoning layer synthesizes deterministic economics with RAG guidelines to recommend **DIRECT REUSE** with a Suitability Score of 99.0/100 and clear explainability notes."*

---

### Step 5: Scenario Lab & Multi-Objective Optimization (3:00 – 3:45)
- **Screen:** `/scenarios` $ightarrow$ `SIM-LAP-001` (`05_scenario_lab.png`)
- **Action:** Toggle between `BALANCED`, `SUSTAINABILITY_FIRST`, and `COST_FIRST`. Highlight trade-off cards.
- **Presenter Narration:**
  > *"In the **Circular Scenario Lab**, ReLife evaluates all six circular pathways side-by-side using Multi-Attribute Utility Theory.*  
  >  
  > *Switching the objective policy from `BALANCED` to `COST_FIRST` dynamically re-ranks the pathways, penalizing expensive repairs while prioritizing zero-cost redeployment.*  
  >  
  > *Our dedicated **'What Was Gained vs. What Was Sacrificed'** cards explain the financial and environmental trade-offs, enabling transparent, data-driven executive decisions."*

---

### Step 6: Institutional Demand Matching (3:45 – 4:30)
- **Screen:** `/demand` $ightarrow$ `DEMAND-CSE-01` (`06_demand_matching.png`)
- **Action:** Select `DEMAND-CSE-01` (Undergraduate Coding Lab Requisition). Show candidate match.
- **Presenter Narration:**
  > *"Circular IT only works if surplus hardware meets real internal demand. In **Demand Matching**, ReLife connects idle machines to active departmental requisitions.*  
  >  
  > *The Computer Science department needs 10 coding workstations. ReLife matches `SIM-LAP-001` with a **100% Match Score**. Our capability fit breakdown demonstrates why: CPU cores and 16GB RAM exceed requirements, eliminating the need to buy brand new hardware."*

---

### Step 7: Human-in-the-Loop Approval Center (4:30 – 5:15)
- **Screen:** `/approvals` $ightarrow$ `REC-E0E432B9` (`07_approval_center.png`)
- **Action:** Select `SIM-LAP-002` (Dell Latitude 7490). Review decision dossier and officer form.
- **Presenter Narration:**
  > *"Now we demonstrate our foundational governance principle: **AI RECOMMENDS · RULES ENFORCE SAFETY · HUMANS APPROVE**.*  
  >  
  > *In the Approval Center, AI recommendations never execute autonomously. An authorized disposition officer must review the evidence dossier, provide their credentials, input review notes, and explicitly log their decision."*

---

### Step 8: Non-Bypassable Security Gate Enforcement (5:15 – 6:00)
- **Screen:** `/approvals` showing HTTP 403 banner (`08_security_block.png`)
- **Action:** Select "Override Pathway", choose "Direct Reuse", and click "Submit Human Approval".
- **Presenter Narration:**
  > *"Here is ReLife's critical safety boundary in action: the **Non-Bypassable Security Gate**.*  
  >  
  > *`SIM-LAP-002` has an unverified storage drive. Suppose a human officer attempts to override safety rules and redeploy the machine directly. When I click Submit, the backend strictly rejects the request with **HTTP 403 Forbidden**!*  
  >  
  > *Under our zero-trust architecture, **no human and no generative model can bypass data sanitization**. Sensitive institutional data is provably protected."*

---

### Step 9: Circular IT Asset Passport & Audit Ledger (6:00 – 6:45)
- **Screen:** `/passport?asset=SIM-LAP-001` (`09_circular_passport.png`)
- **Action:** Scroll through vertical chronological event timeline and expand raw JSON audit inspector.
- **Presenter Narration:**
  > *"Every lifecycle milestone is recorded in the **Circular IT Asset Passport**.*  
  >  
  > *Here is the verifiable chain of custody for `SIM-LAP-001`: asset registration, NIST sanitization verification, AI recommendation generation, and formal human approval by Dr. Elena Rostova.*  
  >  
  > *Each event includes an immutable timestamp, actor signature, and structured audit JSON payload, guaranteeing statutory compliance and institutional accountability."*

---

### Step 10: SDG 12 Circular Impact Center (6:45 – 7:30)
- **Screen:** `/impact` (`10_impact_center.png`)
- **Action:** Review executive sustainability KPI cards and open Methodology drawer.
- **Presenter Narration:**
  > *"In the **SDG 12 Circular Impact Center**, ReLife aggregates fleet-wide environmental and financial gains [ESTIMATE ONLY].*  
  >  
  > *Across our canonical demonstration scenarios, circular orchestration has achieved **₹128,000 in avoided procurement costs**, **292.5 kg of avoided embodied CO2 equivalent**, and **11.7 kg of e-waste diverted**.*  
  >  
  > *In full accordance with Responsible AI standards, every metric is clearly marked **[ESTIMATE ONLY]**. Opening our Methodology drawer discloses our life-cycle emission factors citing peer-reviewed studies by Teehan & Kandlikar (2013) and Prakash et al. (Öko-Institut 2020)."*

---

### Step 11: Conclusion & Responsible AI Governance Core (7:30 – 8:00)
- **Screen:** Global Sidebar $ightarrow$ Governance Core Drawer (`11_governance.png`)
- **Action:** Click "Governance Core" in the sidebar to open the Responsible AI Charter drawer.
- **Presenter Narration:**
  > *"To conclude, I open our **Responsible AI Governance Charter**.*  
  >  
  > *ReLife proves that AI in sustainability can be:  
  > 1. **Safe & Zero-Trust:** Non-bypassable media sanitization gates.  
  > 2. **Transparent:** Explainable multi-attribute formulas with zero black-box weights.  
  > 3. **Fair:** Objective hardware allocation based on verified campus need.  
  > 4. **Accountable:** Human-in-the-loop oversight for every disposition.*  
  >  
  > *Thank you, and I look forward to your questions."*
