from typing import Tuple, List, Dict
from backend.app.core.enums import CircularPathway, FunctionalStatus, PhysicalCondition
from backend.app.core.security_gate import SecurityGateResult


def evaluate_pathway_eligibility(
    security_gate: SecurityGateResult,
    functional_status: FunctionalStatus,
    physical_condition: PhysicalCondition,
    storage_present: bool,
    storage_type: str,
) -> Tuple[List[CircularPathway], Dict[str, str]]:
    """
    Deterministic hard constraints filter.
    Eliminates invalid pathways before AI ranking so AI only reasons among feasible options.
    """
    eligible: List[CircularPathway] = []
    disqualifications: Dict[str, str] = {}

    # 1. DIRECT_REUSE
    if not security_gate.direct_reuse_permitted:
        disqualifications[CircularPathway.DIRECT_REUSE.value] = (
            "Disqualified by mandatory Security Gate: internal storage sanitization is unverified."
        )
    elif functional_status != FunctionalStatus.FULLY_FUNCTIONAL:
        disqualifications[CircularPathway.DIRECT_REUSE.value] = (
            f"Disqualified: Device has functional issues ({functional_status.value}) and cannot be deployed directly."
        )
    elif physical_condition == PhysicalCondition.DAMAGED:
        disqualifications[CircularPathway.DIRECT_REUSE.value] = (
            "Disqualified: Severe physical chassis damage prevents immediate direct redeployment."
        )
    else:
        eligible.append(CircularPathway.DIRECT_REUSE)

    # 2. REPAIR
    if functional_status in (FunctionalStatus.MINOR_DEFECT, FunctionalStatus.MAJOR_FAULT):
        eligible.append(CircularPathway.REPAIR)
    elif functional_status == FunctionalStatus.FULLY_FUNCTIONAL:
        disqualifications[CircularPathway.REPAIR.value] = (
            "Disqualified: Device is already fully functional; repair is unnecessary."
        )
    elif functional_status == FunctionalStatus.NON_FUNCTIONAL and physical_condition == PhysicalCondition.DAMAGED:
        disqualifications[CircularPathway.REPAIR.value] = (
            "Disqualified: Catastrophic damage/failure makes repair economically and technically infeasible."
        )
    else:
        eligible.append(CircularPathway.REPAIR)

    # 3. REFURBISH
    if functional_status in (FunctionalStatus.FULLY_FUNCTIONAL, FunctionalStatus.MINOR_DEFECT):
        eligible.append(CircularPathway.REFURBISH)
    else:
        disqualifications[CircularPathway.REFURBISH.value] = (
            "Disqualified: Device has major structural or electrical faults requiring repair before refurbishment."
        )

    # 4. REPURPOSE
    if functional_status != FunctionalStatus.NON_FUNCTIONAL:
        eligible.append(CircularPathway.REPURPOSE)
    else:
        disqualifications[CircularPathway.REPURPOSE.value] = (
            "Disqualified: Hardware cannot boot or execute alternative operating system workloads."
        )

    # 5. COMPONENT_RECOVERY
    # Viable if there are modular components (RAM, storage, Wi-Fi)
    if storage_present or storage_type != "none":
        eligible.append(CircularPathway.COMPONENT_RECOVERY)
    else:
        disqualifications[CircularPathway.COMPONENT_RECOVERY.value] = (
            "Disqualified: No salvageable modular sub-assemblies identified."
        )

    # 6. RECYCLE
    # Always eligible as the baseline compliant fallback
    eligible.append(CircularPathway.RECYCLE)

    return eligible, disqualifications
