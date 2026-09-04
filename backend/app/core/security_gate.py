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


def evaluate_security_gate(
    storage_present: bool,
    sanitization_status: SanitizationStatus,
    sanitization_verified: bool,
    sanitization_method: SanitizationMethod,
    verification_reference: Optional[str] = None,
) -> SecurityGateResult:
    """
    Evaluates whether an asset's storage sanitization meets strict criteria for direct reuse/release.
    Deterministic rule: If storage is present and sanitization is not verified, direct reuse is blocked.
    """
    blocking_reasons = []

    if storage_present:
        if not sanitization_verified:
            blocking_reasons.append(
                "Storage drive is present but sanitization has NOT been verified by an authorized technician."
            )
        if sanitization_status != SanitizationStatus.COMPLETED:
            blocking_reasons.append(
                f"Sanitization status is '{sanitization_status.value}', required 'completed'."
            )
        if sanitization_method in (SanitizationMethod.NONE, None):
            blocking_reasons.append("No valid data sanitization method recorded.")

    direct_reuse_permitted = len(blocking_reasons) == 0

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
) -> None:
    """
    Non-bypassable programmatic gate.
    Used during eligibility check AND human approval / override to guarantee that
    unverified storage can NEVER be directly reused, redeployed, donated, or resold.
    Repair and Refurbishment workflows are permitted to proceed into the technician lab
    where sanitization and repairs will take place.
    """
    if storage_present and not sanitization_verified:
        if pathway == CircularPathway.DIRECT_REUSE:
            raise SecurityGateViolationError(
                "MANDATORY SECURITY GATE VIOLATION: Cannot execute or approve pathway 'DIRECT_REUSE' "
                "while internal storage is present and sanitization is unverified. "
                "Human override is strictly prohibited for unverified storage."
            )

        if destination_action in (DestinationAction.DONATION, DestinationAction.RESALE):
            raise SecurityGateViolationError(
                f"MANDATORY SECURITY GATE VIOLATION: Cannot release asset to '{destination_action.value}' "
                "while internal storage is present and sanitization is unverified. "
                "Human override is strictly prohibited for unverified storage."
            )

        if destination_action == DestinationAction.INTERNAL_REDEPLOYMENT and pathway not in (
            CircularPathway.REPAIR,
            CircularPathway.REFURBISH,
        ):
            raise SecurityGateViolationError(
                "MANDATORY SECURITY GATE VIOLATION: Cannot execute direct 'INTERNAL_REDEPLOYMENT' "
                "while internal storage is present and sanitization is unverified. "
                "Human override is strictly prohibited for unverified storage."
            )
