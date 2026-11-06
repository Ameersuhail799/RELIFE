from typing import Optional
from pydantic import BaseModel

from backend.app.core.enums import CircularPathway, DestinationAction, SanitizationStatus, SanitizationMethod


class SecurityGateViolationError(Exception):
    """Raised when an action or pathway violates mandatory data-sanitization security policies."""
    pass


class SecurityGateResult(BaseModel):
    storage_present: bool
    sanitization_verified: bool
    sanitization_status: SanitizationStatus
    sanitization_method: SanitizationMethod
    verification_reference: Optional[str] = None
    direct_reuse_permitted: bool
    blocking_reasons: list[str]
    notes: str


# Pathways and destinations that represent release/redeployment of storage media
RESTRICTED_PATHWAYS = {
    CircularPathway.DIRECT_REUSE,
}

RESTRICTED_ACTIONS = {
    DestinationAction.INTERNAL_REDEPLOYMENT,
    DestinationAction.DONATION,
    DestinationAction.RESALE,
}


def is_sanitization_fully_cleared(
    storage_present: bool,
    sanitization_verified: bool,
    sanitization_status: Optional[SanitizationStatus] = None,
    sanitization_method: Optional[SanitizationMethod] = None,
) -> tuple[bool, list[str]]:
    """
    Canonical shared security predicate.
    When storage is present, sanitization is ONLY cleared if:
    1. sanitization_verified is True
    2. sanitization_status is SanitizationStatus.COMPLETED
    3. sanitization_method is NOT None and NOT SanitizationMethod.NONE
    When storage is absent (diskless), sanitization is cleared.
    """
    blocking_reasons: list[str] = []

    if storage_present:
        if not sanitization_verified:
            blocking_reasons.append(
                "Storage drive is present but sanitization has NOT been verified by an authorized technician."
            )
        if sanitization_status != SanitizationStatus.COMPLETED:
            current_status = sanitization_status.value if sanitization_status else "unspecified"
            blocking_reasons.append(
                f"Sanitization status is '{current_status}', required 'completed'."
            )
        if sanitization_method in (SanitizationMethod.NONE, None):
            blocking_reasons.append("No valid data sanitization method recorded.")

    return len(blocking_reasons) == 0, blocking_reasons


def evaluate_security_gate(
    storage_present: bool,
    sanitization_status: SanitizationStatus,
    sanitization_verified: bool,
    sanitization_method: SanitizationMethod,
    verification_reference: Optional[str] = None,
) -> SecurityGateResult:
    """
    Evaluates whether an asset's storage sanitization meets strict criteria for direct reuse/release.
    Deterministic rule: If storage is present and any sanitization criteria fail, direct reuse is blocked.
    """
    direct_reuse_permitted, blocking_reasons = is_sanitization_fully_cleared(
        storage_present=storage_present,
        sanitization_verified=sanitization_verified,
        sanitization_status=sanitization_status,
        sanitization_method=sanitization_method,
    )

    notes = (
        "Security gate CLEARED: Storage sanitization verified or drive absent."
        if direct_reuse_permitted
        else "Security gate BLOCKED: Unverified storage prevents direct reuse, redeployment, donation, or resale."
    )

    return SecurityGateResult(
        storage_present=storage_present,
        sanitization_verified=sanitization_verified,
        sanitization_status=sanitization_status,
        sanitization_method=sanitization_method,
        verification_reference=verification_reference,
        direct_reuse_permitted=direct_reuse_permitted,
        blocking_reasons=blocking_reasons,
        notes=notes,
    )


def assert_security_gate_for_action(
    storage_present: bool,
    sanitization_verified: bool,
    pathway: CircularPathway,
    destination_action: Optional[DestinationAction] = None,
    sanitization_status: Optional[SanitizationStatus] = SanitizationStatus.COMPLETED,
    sanitization_method: Optional[SanitizationMethod] = SanitizationMethod.CRYPTO_ERASE,
) -> None:
    """
    Non-bypassable programmatic gate.
    Used during eligibility check AND human approval / override to guarantee that
    unverified storage can NEVER be directly reused, redeployed, donated, or resold.
    All required sanitization conditions (verified=True, status=completed, method!=none)
    must be satisfied when storage is present.
    Repair and Refurbishment workflows are permitted to proceed into the technician lab
    where sanitization and repairs will take place. Component recovery and recycling
    are permitted for material and parts salvage without whole-device storage redeployment.
    """
    cleared, blocking_reasons = is_sanitization_fully_cleared(
        storage_present=storage_present,
        sanitization_verified=sanitization_verified,
        sanitization_status=sanitization_status,
        sanitization_method=sanitization_method,
    )

    if storage_present and not cleared:
        reasons_summary = "; ".join(blocking_reasons)

        if pathway == CircularPathway.DIRECT_REUSE:
            raise SecurityGateViolationError(
                f"MANDATORY SECURITY GATE VIOLATION: Cannot execute or approve pathway 'DIRECT_REUSE' "
                f"while internal storage is present and sanitization is unverified ({reasons_summary}). "
                "Human override is strictly prohibited for unverified storage."
            )

        if destination_action in (DestinationAction.DONATION, DestinationAction.RESALE):
            raise SecurityGateViolationError(
                f"MANDATORY SECURITY GATE VIOLATION: Cannot release asset to '{destination_action.value}' "
                f"while internal storage is present and sanitization is unverified ({reasons_summary}). "
                "Human override is strictly prohibited for unverified storage."
            )

        if destination_action == DestinationAction.INTERNAL_REDEPLOYMENT and pathway not in (
            CircularPathway.REPAIR,
            CircularPathway.REFURBISH,
        ):
            raise SecurityGateViolationError(
                f"MANDATORY SECURITY GATE VIOLATION: Cannot execute direct 'INTERNAL_REDEPLOYMENT' "
                f"while internal storage is present and sanitization is unverified ({reasons_summary}). "
                "Human override is strictly prohibited for unverified storage."
            )
