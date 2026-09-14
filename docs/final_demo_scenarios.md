# Canonical Demonstration Scenarios & Evaluation Walkthrough

> **Internship Track:** 1M1B – IBM SkillsBuild AI for Sustainability Virtual Internship (July–September 2026)  
> **Student / Author:** Ameer Suhail ([Ameersuhail799/RELIFE](https://github.com/Ameersuhail799/RELIFE.git))  
> **Purpose:** Scripted, reproducible demonstration scenarios showcasing end-to-end capabilities, deterministic security barriers, demand matching, and human-in-the-loop governance.

---

## Scenario Overview

| Scenario | Target Asset | Primary Purpose | Key Verification Point |
| :--- | :--- | :--- | :--- |
| **Scenario A** | Lenovo ThinkPad T490 (`SIM-LAP-001`) | **Secure Direct Reuse** | High-spec functional laptop with verified cryptographic sanitization is cleared through the security gate and approved for internal CS lab redeployment. |
| **Scenario B** | Dell Latitude 7490 (`SIM-LAP-002`) | **Repair + Redeploy with Security Gate Block** | Hardware has an unverified storage drive. User attempts to override to direct reuse $\rightarrow$ blocked with **HTTP 403 Forbidden**. Valid repair pathway proceeds safely. |
| **Scenario C** | HP ProDesk 600 G3 (`SIM-DESK-016`) | **Repurpose & Component Recovery** | Desktop with severe motherboard/display failure is diverted from landfill into secondary campus Linux infrastructure and internal RAM/SSD harvesting. |

---

## Scenario A: Secure Direct Reuse

### 1. Starting State
- **Asset ID:** `SIM-LAP-001`
- **Device Details:** Lenovo ThinkPad T490 (Intel Core i5-8365U, 16GB RAM, 512GB NVMe SSD, Grade A physical condition, fully functional).
- **Sanitization Status:** `sanitization_verified = True`, `sanitization_method = "crypto_erase"`, `verification_reference = "CERT-2026-NIST-88-101"`, `verified_by = "tech_priya"`.
- **Lifecycle State:** `ASSESSED` (queued for recommendation).

### 2. User Action
1. Navigate to `/assets` and select `SIM-LAP-001`.
2. Inspect the **NIST SP 800-88 Rev. 2 Media Sanitization Hard Gate** badge (shows `CLEARED`).
3. Click **"Evaluate Asset"** under the `BALANCED` objective.
4. Navigate to `/demand` and observe that `SIM-LAP-001` ranks as Match #1 (100% fit) for the **Computer Science & Engineering — coding workstation** demand.
5. Navigate to `/approvals`, locate `SIM-LAP-001`, and click **"Submit Human Approval"** as Dr. Elena Rostova.

### 3. System Processing
- Security Gate validates that `sanitization_verified == True`, permitting `DIRECT_REUSE`.
- Eligibility Engine confirms all hardware checks pass for immediate redeployment.
- Scenario Engine calculates suitability score ($99.0 / 100$).
- Demand Matcher assigns the unit to satisfy 1 unit of `DEMAND-CSE-01`.
- Approval Engine advances lifecycle state to `PROCESSING` and logs immutable event to passport.

### 4. AI Contribution
- Contextual condition profiler determines the hardware is in pristine functional condition.
- Generates transparent explainability narrative: *"The asset has satisfied all data sanitization security gates, retains full functional capability, and immediately fulfills institutional demand with zero capital spend."*
- Identifies explicit trade-offs and key decision factors.

### 5. Deterministic Rule Contribution
- Deterministic Security Gate checks `sanitization_verified` and unlocks reuse.
- Economics engine computes direct servicing cost: ₹0.
- Avoided procurement calculation: ₹45,000.
- Avoided carbon lookup: $\sim 135.0\text{ kg } \text{CO}_2\text{e}$.

### 6. Result
- Recommendation approved.
- Asset lifecycle state advances from `PENDING_DECISION` to `PROCESSING`.
- Circular Asset Passport records `HUMAN_DECISION_APPROVED` event.

### 7. What Evaluator Should Observe
- Green `GATE: CLEARED` badge with NIST SP 800-88 Rev. 2 compliance reference.
- Clean 100% match score against CSE demand request.
- Chronological audit ledger showing complete chain of custody in `/passport?asset=SIM-LAP-001`.

### 8. Exact Routes to Open
- Asset Intelligence: `http://localhost:5173/assets`
- Demand Matching: `http://localhost:5173/demand`
- Approval Center: `http://localhost:5173/approvals`
- Circular Passport: `http://localhost:5173/passport?asset=SIM-LAP-001`

---

## Scenario B: Repair + Redeploy with Non-Bypassable Security Block

### 1. Starting State
- **Asset ID:** `SIM-LAP-002`
- **Device Details:** Dell Latitude 7490 (Intel Core i5-8250U, 8GB RAM, 256GB SATA SSD, Grade B, functional with sticking key and thermal throttling).
- **Sanitization Status:** `storage_present = True`, `sanitization_verified = False`, `sanitization_status = "unverified"`.
- **Security Status:** `GATE: BLOCKED` (NIST SP 800-88 Rev. 2).

### 2. User Action
1. Open `/assets` and select `SIM-LAP-002`.
2. Notice prominent red warning: `DETERMINISTIC BOUNDARY — Direct reuse strictly blocked until sanitized`.
3. Open `/approvals` where AI recommends `REPAIR` with target destination `INTERNAL_REDEPLOYMENT`.
4. Switch action mode to **"Override Pathway"**.
5. Attempt to select **Pathway: Direct Reuse** and click **"Submit Human Approval"**.

### 3. System Processing
- The frontend sends `POST /api/v1/approvals/{recommendation_id}/decide` with `decision: "OVERRIDE"` and `chosen_pathway: "DIRECT_REUSE"`.
- Backend executes `assert_security_gate_for_action()`.
- Discovers `storage_present == True` and `sanitization_verified == False`.
- Halts execution immediately and raises `SecurityGateViolationError`.
- Returns **HTTP 403 Forbidden** with message:
  `"MANDATORY SECURITY GATE VIOLATION: Cannot execute or approve pathway 'DIRECT_REUSE' while internal storage is present and sanitization is unverified. Human override is strictly prohibited for unverified storage."`

### 4. AI Contribution
- Identifies repair feasibility: keyboard servicing and thermal repasting have low parts costs (₹3,100) relative to residual value (₹10,600).
- RAG engine retrieves `REPAIR-KB-001` (keyboard scissor servicing) and `REPAIR-KB-002` (thermal repasting).

### 5. Deterministic Rule Contribution
- Enforces non-bypassable security boundary: **Zero human or generative override can bypass unverified storage**.
- Programmatically catches unsafe override and returns HTTP 403.

### 6. Result (Subsequent Valid Action)
- User switches back to **"Approve AI Recommendation"** (`REPAIR`).
- Since `REPAIR` takes place in the secure institutional maintenance shop, the security gate allows the action.
- Approval succeeds with **HTTP 200 OK**, advancing lifecycle to `PROCESSING`.

### 7. What Evaluator Should Observe
- Prominent red alert banner in the Approval Center displaying the exact HTTP 403 security violation error when the unsafe override is attempted.
- Demonstration that security policies are enforced at the server API layer, not merely in the client UI.

### 8. Exact Routes to Open
- Asset Intelligence: `http://localhost:5173/assets`
- Approval Center: `http://localhost:5173/approvals`

---

## Scenario C: Repurpose & Component Recovery (Hardware with Structural Defect)

### 1. Starting State
- **Asset ID:** `SIM-DESK-016`
- **Device Details:** HP ProDesk 600 G3 Desktop (Intel Core i5-6500, 16GB RAM, 512GB SATA SSD, Grade Damaged, non-functional motherboard failure / chassis cracked).
- **Condition:** Non-functional for primary desktop workstation use.

### 2. User Action
1. Open `/scenarios` and select `SIM-DESK-016`.
2. Inspect the **Eligible Pathway Scenarios** list.
3. Observe that `DIRECT_REUSE` is disqualified and excluded by the deterministic eligibility filter.
4. Toggle objective from `BALANCED` to `SUSTAINABILITY_FIRST`.
5. Observe that **Repurposing (Secondary Campus Node)** ranks #1, avoiding total disposal.
6. Toggle objective to `COST_FIRST`.
7. Observe that **Component Recovery (Harvesting RAM & NVMe SSD)** rises in rank to supply the campus spare-parts inventory at zero procurement cost.

### 3. System Processing
- Eligibility engine prunes whole-device reuse due to display/board faults.
- Scenario engine ranks remaining eligible pathways (`REPURPOSE`, `COMPONENT_RECOVERY`, `RECYCLE`).
- Dynamically recalculates scores across objective weight matrices.

### 4. AI Contribution
- RAG engine retrieves `REPURPOSE-SOP-005` (Repurposing Decommissioned Hardware for Campus Infrastructure) and `WEEE-DIR-2012-19` (Mandatory Component Harvesting before Scrap).
- AI synthesizes creative secondary deployment: converting the headless desktop into a campus network DNS sinkhole, HomeAssistant server, or Docker lab node.

### 5. Deterministic Rule Contribution
- Prevents invalid pathways from being suggested by filtering out ineligible actions before AI ranking.
- Calculates modular component salvage value: 16GB DDR4 RAM (₹3,200) + 512GB NVMe SSD (₹2,800) = ₹6,000 in spare parts inventory.

### 6. Result
- Demonstrates that ReLife is not a simplistic binary "reuse or scrap" classifier.
- Salvages functional components and diverts e-waste even when whole-device redeployment is impossible.

### 7. What Evaluator Should Observe
- Automatic pruning of disqualified pathways.
- Dynamic re-ranking in Scenario Lab when switching objectives.
- Practical component harvesting and repurposing recommendations grounded in campus IT realities.

### 8. Exact Routes to Open
- Scenario Lab: `http://localhost:5173/scenarios`
- Asset Intelligence: `http://localhost:5173/assets`
