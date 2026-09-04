from enum import Enum


class AssetLifecycleState(str, Enum):
    REGISTERED = "REGISTERED"
    ASSESSING = "ASSESSING"
    ASSESSED = "ASSESSED"
    PENDING_DECISION = "PENDING_DECISION"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    CLOSED = "CLOSED"


class CircularPathway(str, Enum):
    DIRECT_REUSE = "DIRECT_REUSE"
    REPAIR = "REPAIR"
    REFURBISH = "REFURBISH"
    REPURPOSE = "REPURPOSE"
    COMPONENT_RECOVERY = "COMPONENT_RECOVERY"
    RECYCLE = "RECYCLE"


class DestinationAction(str, Enum):
    INTERNAL_REDEPLOYMENT = "INTERNAL_REDEPLOYMENT"
    DONATION = "DONATION"
    RESALE = "RESALE"
    LAB_DEPLOYMENT = "LAB_DEPLOYMENT"
    COMPONENT_HARVEST = "COMPONENT_HARVEST"
    CERTIFIED_RECYCLER = "CERTIFIED_RECYCLER"


class SanitizationMethod(str, Enum):
    CRYPTO_ERASE = "crypto_erase"
    OVERWRITE_SINGLE_PASS = "overwrite_single_pass"
    OVERWRITE_MULTI_PASS = "overwrite_multi_pass"
    DEGAUSS_DESTROY = "degauss_destroy"
    PHYSICAL_SHRED = "physical_shred"
    NONE = "none"


class SanitizationStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    NOT_REQUIRED = "not_required"


class DeviceType(str, Enum):
    LAPTOP = "laptop"
    DESKTOP = "desktop"


class PhysicalCondition(str, Enum):
    GRADE_A = "grade_a"
    GRADE_B = "grade_b"
    GRADE_C = "grade_c"
    DAMAGED = "damaged"


class FunctionalStatus(str, Enum):
    FULLY_FUNCTIONAL = "fully_functional"
    MINOR_DEFECT = "minor_defect"
    MAJOR_FAULT = "major_fault"
    NON_FUNCTIONAL = "non_functional"


class DecisionObjective(str, Enum):
    BALANCED = "BALANCED"
    SUSTAINABILITY_FIRST = "SUSTAINABILITY_FIRST"
    COST_FIRST = "COST_FIRST"
    UTILIZATION_FIRST = "UTILIZATION_FIRST"


class ComputeTier(str, Enum):
    ENTRY = "ENTRY"
    MID = "MID"
    PERFORMANCE = "PERFORMANCE"
    LEGACY = "LEGACY"


class MobilityProfile(str, Enum):
    PORTABLE = "PORTABLE"
    DESK_BOUND = "DESK_BOUND"


class ConfidenceLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    PROVISIONAL = "PROVISIONAL"


class DemandPriority(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class MobilityRequirement(str, Enum):
    PORTABLE = "PORTABLE"
    DESK_BOUND_OK = "DESK_BOUND_OK"
    STATIONARY_ONLY = "STATIONARY_ONLY"
    ANY = "ANY"

