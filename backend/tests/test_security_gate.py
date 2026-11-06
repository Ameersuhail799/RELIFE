import pytest
from backend.app.core.enums import (
    CircularPathway,
    DestinationAction,
    SanitizationMethod,
    SanitizationStatus,
)
from backend.app.core.security_gate import (
    evaluate_security_gate,
    assert_security_gate_for_action,
    SecurityGateViolationError,
)


def test_security_gate_blocks_unverified_storage():
    result = evaluate_security_gate(
        storage_present=True,
        sanitization_status=SanitizationStatus.PENDING,
        sanitization_verified=False,
        sanitization_method=SanitizationMethod.NONE,
    )
    assert result.direct_reuse_permitted is False
    assert len(result.blocking_reasons) >= 2


def test_security_gate_clears_verified_storage():
    result = evaluate_security_gate(
        storage_present=True,
        sanitization_status=SanitizationStatus.COMPLETED,
        sanitization_verified=True,
        sanitization_method=SanitizationMethod.CRYPTO_ERASE,
        verification_reference="CERT-NIST-88-0092",
    )
    assert result.direct_reuse_permitted is True
    assert len(result.blocking_reasons) == 0


def test_security_gate_clears_diskless_asset():
    result = evaluate_security_gate(
        storage_present=False,
        sanitization_status=SanitizationStatus.NOT_REQUIRED,
        sanitization_verified=False,
        sanitization_method=SanitizationMethod.NONE,
    )
    assert result.direct_reuse_permitted is True


def test_assert_security_gate_blocks_reuse_when_unverified():
    with pytest.raises(SecurityGateViolationError) as exc_info:
        assert_security_gate_for_action(
            storage_present=True,
            sanitization_verified=False,
            pathway=CircularPathway.DIRECT_REUSE,
            destination_action=DestinationAction.INTERNAL_REDEPLOYMENT,
        )
    assert "MANDATORY SECURITY GATE VIOLATION" in str(exc_info.value)


def test_assert_security_gate_blocks_donation_when_unverified():
    with pytest.raises(SecurityGateViolationError):
        assert_security_gate_for_action(
            storage_present=True,
            sanitization_verified=False,
            pathway=CircularPathway.REPURPOSE,
            destination_action=DestinationAction.DONATION,
        )


def test_assert_security_gate_allows_repair_when_unverified():
    # Repair is permitted because the drive will be sanitized or replaced in lab
    assert_security_gate_for_action(
        storage_present=True,
        sanitization_verified=False,
        pathway=CircularPathway.REPAIR,
        destination_action=None,
    )


def test_assert_security_gate_allows_reuse_when_verified():
    assert_security_gate_for_action(
        storage_present=True,
        sanitization_verified=True,
        pathway=CircularPathway.DIRECT_REUSE,
        destination_action=DestinationAction.INTERNAL_REDEPLOYMENT,
    )


def test_assert_security_gate_blocks_when_status_pending():
    """Regression: sanitization_verified is True, but status is PENDING must be blocked."""
    with pytest.raises(SecurityGateViolationError) as exc_info:
        assert_security_gate_for_action(
            storage_present=True,
            sanitization_verified=True,
            sanitization_status=SanitizationStatus.PENDING,
            sanitization_method=SanitizationMethod.CRYPTO_ERASE,
            pathway=CircularPathway.DIRECT_REUSE,
            destination_action=DestinationAction.INTERNAL_REDEPLOYMENT,
        )
    assert "MANDATORY SECURITY GATE VIOLATION" in str(exc_info.value)
    assert "required 'completed'" in str(exc_info.value)


def test_assert_security_gate_blocks_when_method_none():
    """Regression: sanitization_verified is True, status is COMPLETED, but method is NONE must be blocked."""
    with pytest.raises(SecurityGateViolationError) as exc_info:
        assert_security_gate_for_action(
            storage_present=True,
            sanitization_verified=True,
            sanitization_status=SanitizationStatus.COMPLETED,
            sanitization_method=SanitizationMethod.NONE,
            pathway=CircularPathway.DIRECT_REUSE,
            destination_action=DestinationAction.INTERNAL_REDEPLOYMENT,
        )
    assert "MANDATORY SECURITY GATE VIOLATION" in str(exc_info.value)
    assert "No valid data sanitization method recorded" in str(exc_info.value)


def test_assert_security_gate_allows_when_all_conditions_valid():
    """Regression: verified=True, status=COMPLETED, method=CRYPTO_ERASE permits direct reuse."""
    assert_security_gate_for_action(
        storage_present=True,
        sanitization_verified=True,
        sanitization_status=SanitizationStatus.COMPLETED,
        sanitization_method=SanitizationMethod.CRYPTO_ERASE,
        pathway=CircularPathway.DIRECT_REUSE,
        destination_action=DestinationAction.INTERNAL_REDEPLOYMENT,
    )


def test_assert_security_gate_allows_diskless():
    """Regression: Diskless asset (storage_present=False) allows direct reuse regardless of sanitization fields."""
    assert_security_gate_for_action(
        storage_present=False,
        sanitization_verified=False,
        sanitization_status=SanitizationStatus.NOT_REQUIRED,
        sanitization_method=SanitizationMethod.NONE,
        pathway=CircularPathway.DIRECT_REUSE,
        destination_action=DestinationAction.INTERNAL_REDEPLOYMENT,
    )
