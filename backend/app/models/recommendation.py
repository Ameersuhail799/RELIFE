import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, JSON, ForeignKey
from backend.app.core.database import Base


class PathwayRecommendation(Base):
    __tablename__ = "pathway_recommendations"

    recommendation_id = Column(String, primary_key=True, index=True)
    asset_id = Column(String, ForeignKey("assets.asset_id"), nullable=False, index=True)
    decision_objective = Column(String, nullable=False)

    # Separation of pathway and destination action
    recommended_pathway = Column(String, nullable=False)
    destination_action = Column(String, nullable=False)

    suitability_score = Column(Float, nullable=False)

    # Deterministic Economics
    estimated_repair_cost = Column(Float, nullable=False)
    estimated_residual_value = Column(Float, nullable=False)
    estimated_avoided_cost = Column(Float, nullable=False)
    economic_viability = Column(String, nullable=False)

    # Environmental Estimates
    estimated_life_extension_years = Column(Float, nullable=False)
    estimated_ewaste_diverted_kg = Column(Float, nullable=False)
    estimated_co2e_avoided_kg = Column(Float, nullable=False)
    is_estimate = Column(Boolean, default=True, nullable=False)

    # AI Reasoning & Explainability Payload
    confidence_level = Column(String, nullable=False)
    reasons = Column(JSON, default=list, nullable=False)
    key_factors = Column(JSON, default=list, nullable=False)
    alternatives_considered = Column(JSON, default=list, nullable=False)
    assumptions = Column(JSON, default=list, nullable=False)
    uncertainties = Column(JSON, default=list, nullable=False)
    why_this_recommendation = Column(String, nullable=False)

    security_gate_cleared = Column(Boolean, nullable=False)

    # Human Approval Status
    approval_status = Column(String, default="PENDING_APPROVAL", nullable=False)
    approved_by = Column(String, nullable=True)
    approval_notes = Column(String, nullable=True)
    chosen_pathway_override = Column(String, nullable=True)
    chosen_destination_override = Column(String, nullable=True)
    decided_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.datetime.now(datetime.timezone.utc), nullable=False)
