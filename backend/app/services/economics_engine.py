import datetime
from typing import List, Dict, Any
from backend.app.core.enums import DeviceType, PhysicalCondition, FunctionalStatus
from backend.app.schemas.economics import EconomicEvaluation

# Known component repair costs (parts + standard labor)
ISSUE_COST_CATALOG = {
    "sticking_key": {"part": 1500.0, "labor": 600.0, "name": "Keyboard replacement"},
    "broken_key": {"part": 1500.0, "labor": 600.0, "name": "Keyboard replacement"},
    "keyboard_wear": {"part": 1500.0, "labor": 600.0, "name": "Keyboard replacement"},
    "weak_battery": {"part": 2600.0, "labor": 400.0, "name": "OEM Replacement Battery"},
    "degraded_battery": {"part": 2600.0, "labor": 400.0, "name": "OEM Replacement Battery"},
    "slow_hdd": {"part": 2200.0, "labor": 500.0, "name": "256GB SATA SSD Upgrade"},
    "thermal_throttling": {"part": 350.0, "labor": 650.0, "name": "Thermal fan cleaning & repaste"},
    "broken_hinge": {"part": 1800.0, "labor": 900.0, "name": "Display hinge assembly repair"},
    "cracked_screen": {"part": 5500.0, "labor": 1000.0, "name": "Replacement LCD panel"},
}


from typing import NamedTuple

class RepairCostResult(NamedTuple):
    total: float
    parts: float
    labor: float
    matched: List[str]


class ResidualValuationResult(NamedTuple):
    estimated_value: float
    ref_value: float
    age_factor: float
    condition_factor: float
    functionality_factor: float
    age: int


def calculate_repair_cost(known_issues: List[str], functional_status: FunctionalStatus) -> RepairCostResult:
    total_parts = 0.0
    total_labor = 0.0
    matched_issues = []

    for issue in known_issues:
        key = issue.lower().replace(" ", "_")
        found = False
        for cat_key, cat_val in ISSUE_COST_CATALOG.items():
            if cat_key in key or key in cat_key:
                total_parts += cat_val["part"]
                total_labor += cat_val["labor"]
                matched_issues.append(cat_val["name"])
                found = True
                break
        if not found:
            # Generic minor defect cost
            total_parts += 1000.0
            total_labor += 500.0
            matched_issues.append(f"Generic component repair ({issue})")

    if not known_issues:
        if functional_status == FunctionalStatus.MINOR_DEFECT:
            total_parts = 1200.0
            total_labor = 600.0
            matched_issues.append("Minor maintenance & servicing")
        elif functional_status == FunctionalStatus.MAJOR_FAULT:
            total_parts = 6000.0
            total_labor = 1500.0
            matched_issues.append("Major motherboard / sub-system overhaul")

    return RepairCostResult(
        total=total_parts + total_labor,
        parts=total_parts,
        labor=total_labor,
        matched=matched_issues,
    )


def estimate_residual_value_prototype(
    device_type: str,
    purchase_year: int,
    physical_condition: PhysicalCondition,
    functional_status: FunctionalStatus,
) -> Tuple_Valuation:
    """
    Deterministic prototype valuation formula:
    Estimated Residual Value = Reference Value × Age Factor × Condition Factor × Functionality Factor.
    Explicitly labeled as an estimated prototype value, not a certified market appraisal.
    """
    current_year = datetime.datetime.now().year

    # 1. Reference Value (Original enterprise class baseline)
    ref_value = 52000.0 if device_type.lower() == DeviceType.LAPTOP.value else 42000.0

    # 2. Age Factor: Realistic enterprise depreciation with an 18% residual floor
    age = max(0, current_year - purchase_year)
    age_factor = max(0.18, 1.0 - (0.10 * age))

    # 3. Condition Factor
    condition_weights = {
        PhysicalCondition.GRADE_A: 1.00,
        PhysicalCondition.GRADE_B: 0.85,
        PhysicalCondition.GRADE_C: 0.65,
        PhysicalCondition.DAMAGED: 0.30,
    }
    condition_factor = condition_weights.get(physical_condition, 0.70)

    # 4. Functionality Factor
    functional_weights = {
        FunctionalStatus.FULLY_FUNCTIONAL: 1.00,
        FunctionalStatus.MINOR_DEFECT: 0.80,
        FunctionalStatus.MAJOR_FAULT: 0.45,
        FunctionalStatus.NON_FUNCTIONAL: 0.15,
    }
    functionality_factor = functional_weights.get(functional_status, 0.70)

    estimated_value = ref_value * age_factor * condition_factor * functionality_factor
    # Round to nearest 100 for clean reporting
    estimated_value = round(estimated_value / 100.0) * 100.0

    return ResidualValuationResult(
        estimated_value=max(1000.0, estimated_value),
        ref_value=ref_value,
        age_factor=round(age_factor, 3),
        condition_factor=condition_factor,
        functionality_factor=functionality_factor,
        age=age,
    )


def evaluate_economics(
    device_type: str,
    purchase_year: int,
    physical_condition: PhysicalCondition,
    functional_status: FunctionalStatus,
    known_issues: List[str],
) -> EconomicEvaluation:
    """
    Executes full deterministic economic calculation.
    """
    repair_res = calculate_repair_cost(known_issues, functional_status)
    repair_cost = repair_res.total

    val_res = estimate_residual_value_prototype(
        device_type=device_type,
        purchase_year=purchase_year,
        physical_condition=physical_condition,
        functional_status=functional_status,
    )
    residual_value = val_res.estimated_value

    # Baseline cost of procuring a new comparable enterprise device
    avoided_purchase_cost = 45000.0 if device_type.lower() == DeviceType.LAPTOP.value else 38000.0

    # Dual-threshold comparison: repair cost vs residual value AND vs avoided new purchase cost
    cost_to_value_ratio = repair_cost / residual_value if residual_value > 0 else 1.0
    cost_to_avoided_ratio = repair_cost / avoided_purchase_cost if avoided_purchase_cost > 0 else 1.0

    if cost_to_value_ratio <= 0.45 or cost_to_avoided_ratio <= 0.12:
        economic_viability_flag = "HIGHLY_VIABLE"
    elif cost_to_value_ratio <= 0.70 or cost_to_avoided_ratio <= 0.25:
        economic_viability_flag = "MARGINAL"
    else:
        economic_viability_flag = "NON_VIABLE"

    methodology = (
        "Calculated using deterministic prototype method: "
        f"Reference(₹{val_res.ref_value:,.0f}) × AgeFactor({val_res.age_factor}) × "
        f"ConditionFactor({val_res.condition_factor}) × FunctionalityFactor({val_res.functionality_factor}). "
        f"Repair cost reflects itemized parts (₹{repair_res.parts:,.0f}) + labor (₹{repair_res.labor:,.0f})."
    )

    breakdown = {
        "reference_value_inr": val_res.ref_value,
        "device_age_years": val_res.age,
        "age_factor": val_res.age_factor,
        "condition_factor": val_res.condition_factor,
        "functionality_factor": val_res.functionality_factor,
        "parts_cost_inr": repair_res.parts,
        "labor_cost_inr": repair_res.labor,
        "matched_repairs": repair_res.matched,
        "repair_to_residual_ratio": round(cost_to_value_ratio, 2),
    }

    return EconomicEvaluation(
        estimated_repair_cost=repair_cost,
        estimated_residual_value=residual_value,
        estimated_avoided_cost=avoided_purchase_cost,
        economic_viability_flag=economic_viability_flag,
        valuation_type="ESTIMATED_PROTOTYPE_VALUE",
        methodology_notes=methodology,
        calculation_breakdown=breakdown,
    )
