# IBM Granite & AI Implementation Evidence

> **Internship Track:** 1M1B – IBM SkillsBuild AI for Sustainability Virtual Internship (July–September 2026)  
> **Student / Author:** Ameer Suhail ([Ameersuhail799/RELIFE](https://github.com/Ameersuhail799/RELIFE.git))  
> **Topic:** AI Integration Architecture, IBM Granite Model Specifications, Provider Abstraction, and Strict Governance Boundaries

---

## 1. Architectural Role of Artificial Intelligence in ReLife

In ReLife, artificial intelligence is strictly **assistive**. It operates under a zero-trust governance model defined by the axiom:

$$\textbf{AI RECOMMENDS} \quad\cdot\quad \textbf{RULES ENFORCE SAFETY} \quad\cdot\quad \textbf{HUMANS APPROVE}$$

The platform deliberately rejects autonomous decision-making. Decommissioning, wiping, reallocating, or recycling enterprise hardware involves physical liability, proprietary data risks, and capital allocation. Consequently, all calculations and compliance gates are deterministic, and final authority is reserved for qualified personnel.

---

## 2. IBM Granite Model Integration & Provider Architecture

### A. Provider Abstraction (`LLMProvider`)
The AI reasoning engine is decoupled from underlying foundation models via the abstract base class [`backend/app/services/ai/base.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/ai/base.py):

```python
class LLMProvider(ABC):
    @abstractmethod
    def assess_asset(self, context: Dict[str, Any]) -> AIAssessmentResult:
        """Translates hardware specs and defect notes into structured condition assessments."""
        pass

    @abstractmethod
    def generate_recommendation(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Synthesizes RAG evidence, pre-calculated economics, and scenarios into an explainable recommendation."""
        pass
```

### B. IBM Granite Watsonx Implementation (`IBMGraniteProvider`)
Located in [`backend/app/services/ai/granite_provider.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/ai/granite_provider.py):
- **Model Identifier:** `ibm/granite-3-8b-instruct` (supports `ibm/granite-13b-instruct`).
- **Endpoint Target:** IBM watsonx.ai text generation REST API (`https://us-south.ml.cloud.ibm.com`).
- **Authentication:** Configured via environment variables:
  - `WATSONX_API_KEY`: API authentication key.
  - `WATSONX_PROJECT_ID`: IBM Cloud project workspace.
  - `WATSONX_URL`: Watsonx regional service endpoint.

### C. Offline / CI Reproducibility Fallback (`MockGraniteProvider`)
Located in [`backend/app/services/ai/mock_granite.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/ai/mock_granite.py):
- When Watsonx credentials are not present in the runtime environment, the system automatically and gracefully delegates to `MockGraniteProvider`.
- **Engineering Purpose:** Guarantees 100% test reproducibility, eliminates cloud latency during automated testing, and allows full demonstration even in offline or firewalled environments.
- **Verification:** Unit tests in [`backend/tests/test_ai_and_scenarios.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/tests/test_ai_and_scenarios.py) validate that both providers adhere to identical Pydantic response schemas.

---

## 3. Strict Functional Separation of Concerns

To prevent hallucinations and algorithmic drift, ReLife maintains a rigid boundary between deterministic engines and generative components:

| Functional Responsibility | Engine Authority | Mechanism & Guarantees |
| :--- | :--- | :--- |
| **Media Sanitization Compliance** | **Deterministic Security Gate** | Boolean evaluation of 6 audit fields against NIST SP 800-88 Rev. 2. Cannot be overridden by prompt or generative reasoning. |
| **Eligible Circular Pathways** | **Deterministic Eligibility Filter** | Hardware compatibility checks (e.g. non-functional motherboard excludes direct reuse; missing display excludes whole-device reuse). |
| **Repair & Servicing Costs** | **Deterministic Economics Engine** | Formulaic calculation based on component catalog pricing and labor hours ($C_{\text{repair}} = C_{\text{parts}} + H_{\text{labor}} \times R_{\text{rate}}$). |
| **Residual Depreciated Value** | **Deterministic Economics Engine** | Straight-line depreciation based on retail MSRP, purchase year, and physical condition grade. |
| **Embodied $\text{CO}_2\text{e}$ & E-Waste Avoidance** | **Deterministic Impact Engine** | Empirical LCA lookup factors per device class ($247.5\text{ kg } \text{CO}_2\text{e}$ for laptops, $420\text{ kg } \text{CO}_2\text{e}$ for desktops). |
| **Scenario Ranking Scores** | **Deterministic Scenario Engine** | Multi-Attribute Utility Theory (MAUT) mathematical normalization matrix across cost, carbon, demand, and readiness. |
| **Contextual Defect Interpretation** | **IBM Granite (LLM)** | Parses unstructured technician notes (e.g. *"thermal paste dry, fan grinding"*) into structured defect categories. |
| **Creative Repurposing Synthesis** | **IBM Granite (LLM)** | Evaluates under-utilized capabilities to propose secondary use cases (e.g. converting a cracked-screen tower into a headless Linux Docker node). |
| **Trade-off & Rationale Explanations** | **IBM Granite (LLM)** | Generates clear, human-readable explanations of why the top-ranked pathway outperformed alternatives under the selected objective. |
| **Final Disposition Authorization** | **Human-in-the-Loop Officer** | Authorized campus officer explicitly reviews and signs off on the recommendation. |

---

## 4. What IBM Granite Is NOT Allowed to Decide

1. **Granite CANNOT bypass security:** If storage is present and unverified, Granite cannot authorize `DIRECT_REUSE` or `DONATION`.
2. **Granite CANNOT invent financial numbers:** All repair costs, residual values, and replacement cost avoidance numbers are passed into the model prompt as read-only context.
3. **Granite CANNOT fabricate environmental metrics:** Carbon avoidance ($kg\ \text{CO}_2\text{e}$) and e-waste mass ($kg$) are computed prior to LLM invocation.
4. **Granite CANNOT directly transition database states:** The output of Granite is an advisory `PathwayRecommendation` object saved with status `PENDING_APPROVAL`. It requires human sign-off before the asset enters `PROCESSING`.

---

## 5. Retrieval-Augmented Generation (RAG) Architecture

The RAG engine ([`backend/app/services/ai/rag_engine.py`](file:///c:/Users/AMEER%20SUHAIL/OneDrive/Desktop/RELIFE/backend/app/services/ai/rag_engine.py)) provides contextual grounding by injecting verified standards into the Granite reasoning prompt:

```
[ Asset Profile & Defect Notes ] 
             │
             ▼
     [ RAG Engine ] ── Query Keywords ──► [ Knowledge Base JSON Repositories ]
             │                                 ├── NIST SP 800-88 Rev. 2 (Sanitization)
             │                                 ├── iFixit / OEM Manuals (Repair Guides)
             │                                 ├── EU WEEE Directive (Hazardous E-Waste)
             │                                 └── UN SDG 12 (ICT Circular Economy)
             ▼
[ Top-Relevant Knowledge Chunks ]
             │
             ▼
[ Structured Context Prompt ] ────────► [ IBM Granite Model ]
                                               │
                                               ▼
                              [ Grounded Explainable Recommendation ]
```

### Knowledge Base Grounding Sources:
- **`NIST-SP-800-88-R2`**: Published September 2025, defining Clear, Purge, and Destroy protocols, NVMe Cryptographic Erase requirements, and technician sign-off mandates.
- **`REPAIR-KB-001` through `004`**: Modular servicing guidance for keyboard assemblies, thermal subsystem repasting, battery degradation thresholds, and SSD upgrades.
- **`CIRCULAR-SDG12-001`**: UNEP / ITU lifecycle data documenting that extending hardware life from 3 to 6 years avoids ~45% of annualized emissions.
- **`WEEE-DIR-2012-19`**: European WEEE Directive establishing that component harvesting must precede raw material recycling.

---

## 6. Representation of AI Uncertainty & Confidence

Every recommendation emitted by the AI service includes explicit uncertainty fields:
- **Confidence Level (`confidence_level`):** Assigned as `HIGH`, `MEDIUM`, or `LOW`.
  - `HIGH`: Complete hardware specifications, known defect catalog match, verified sanitization, and high demand fit ($> 85\%$).
  - `MEDIUM`: Partial telemetry (e.g. unknown battery cycle count) or marginal repair viability ($0.50 \le \text{Repair} / \text{Residual} \le 0.85$).
  - `LOW`: Severe hardware faults with uncertain internal component integrity.
- **Explicit Assumptions (`assumptions`):** Lists engineering assumptions (e.g. *"Assumes motherboard circuitry is uncorroded; replacement keyboard cost is based on OEM modular assembly"*).
- **Identified Uncertainties (`uncertainties`):** Alerts the human reviewer to unverified factors (e.g. *"Internal battery wear level unmeasured in BIOS; longevity on battery power may vary"*).
- **Provisional Estimate Disclaimers:** All environmental impact metrics carry the required tag `[ESTIMATE ONLY]`, referencing versioned provisional LCA assumptions.
