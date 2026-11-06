# ReLife — Platform Boundaries, Limitations & Engineering Scope

> **Internship Track:** 1M1B – IBM SkillsBuild AI for Sustainability Virtual Internship (July–September 2026)  
> **Student / Author:** Ameer Suhail ([Ameersuhail799/RELIFE](https://github.com/Ameersuhail799/RELIFE.git))  
> **Purpose:** Transparent disclosure of prototype boundaries, modeling assumptions, operational dependencies, and areas reserved for future production hardening.

---

## 1. Prototype Boundary Disclosures

As an academic and internship engineering prototype, ReLife is designed to validate the core paradigm shift:
$$\text{ASSET} \longrightarrow \text{CAPABILITY} \longrightarrow \text{DEMAND} \longrightarrow \text{CIRCULAR DECISION}$$
To ensure academic integrity, the following boundaries are explicitly declared:

### 1. Synthetic Demonstration Dataset
- **Limitation:** The current system operates on a synthetic demonstration dataset comprising 30 enterprise IT assets and 4 departmental demand profiles.
- **Rationale & Context:** Live university IT inventories contain proprietary student/faculty identifiers, network MAC addresses, and confidential serial numbers. A realistic synthetic dataset was engineered to allow reproducible evaluation and CI test automation without privacy violations.
- **Future Hardening:** Ingestion adapters for standard ITAM formats (CSV/JSON exports from ServiceNow, Snipe-IT, and Jamf Pro).

### 2. Prototype-Level Environmental Impact Estimates
- **Limitation:** Carbon avoidance ($kg\ \text{CO}_2\text{e}$) and e-waste diversion figures are provisional estimates calculated from published academic lifecycle assessments (LCA), not real-time physical carbon accounting.
- **Rationale & Context:** A certified ISO 14040/14044 LCA requires factory-level supply chain telemetry (e.g. foundry energy mix, freight transit routes) which is inaccessible for retired off-lease hardware.
- **Future Hardening:** Integration with certified environmental databases (e.g. Ecoinvent, Climatiq API) for dynamic regional grid emission factor adjustments.

### 3. Heuristic-Based Residual Value Modeling
- **Limitation:** Residual hardware values are estimated using straight-line depreciation equations modulated by functional condition, rather than dynamic secondary market pricing.
- **Rationale & Context:** Real-time web scraping of consumer marketplaces (e.g. eBay, CeX) introduces rate limiting, network instability, and noisy consumer-tier price variance unrepresentative of institutional bulk purchasing.
- **Future Hardening:** Direct API integration with commercial enterprise ITAD (IT Asset Disposition) pricing clearinghouses.

### 4. Absence of Custom Model Fine-Tuning
- **Limitation:** ReLife utilizes general-purpose instruction-tuned foundation models (`ibm/granite-3-8b-instruct`) with RAG retrieval, rather than a custom fine-tuned domain LLM.
- **Rationale & Context:** RAG provides immediate provenance, auditable citations, zero model drift, and instant knowledge updates (e.g. updating NIST SP 800-88 Rev. 1 to Rev. 2 in minutes), which is superior to fine-tuning for regulatory compliance.
- **Future Hardening:** Parameter-Efficient Fine-Tuning (PEFT/LoRA) on enterprise hardware repair manuals for enhanced component-level fault diagnostics.

### 5. Dependency on Manual Technician Telemetry
- **Limitation:** Condition grading and defect identification currently rely on initial technician intake inputs.
- **Rationale & Context:** Physical chassis damage (e.g. cracked hinges, liquid ingress) cannot be detected purely through software polling.
- **Future Hardening:** Automated live diagnostic agent (Linux bootable USB / PXE utility) executing automated CPU stress tests, SMART drive diagnostics, and battery cycle analysis.

### 6. Single-Node Database Architecture
- **Limitation:** The backend uses a local SQLite database designed for single-workstation evaluation.
- **Rationale & Context:** Optimized for rapid local setup, zero external infrastructure dependencies, and instant test execution.
- **Future Hardening:** Production migration to PostgreSQL with row-level security and Redis for distributed candidate caching.

---

## 2. Summary Matrix: Current Prototype vs. Future Production

| Platform Feature | Current Baseline Prototype | Future Production Horizon |
| :--- | :--- | :--- |
| **Asset Data Ingestion** | Seeded simulated JSON dataset (30 devices) | Direct API webhooks to ServiceNow / Snipe-IT |
| **Sanitization Audit** | Technician form with NIST SP 800-88 Rev. 2 certificate reference | Automated cryptographic log ingestion via ShredOS / DBAN API |
| **Embodied Carbon** | Static peer-reviewed LCA literature factors (247.5–280 kg / 350–420 kg) | Dynamic Climatiq / Ecoinvent Scope 3 carbon API integration |
| **Market Valuation** | Straight-line depreciation model | Enterprise ITAD clearinghouse pricing feeds |
| **Knowledge Base** | 10 curated JSON standards & manuals | Vector database (pgvector / Milvus) with automated OEM doc ingestion |
| **Infrastructure** | FastAPI + SQLite + React Vite SPA | Distributed PostgreSQL + Kubernetes + Multi-Tenant SSO |
