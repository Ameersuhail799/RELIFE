// ReLife TypeScript Domain Contracts — Strictly aligned with FastAPI Backend Models

export type CircularPathway =
  | 'DIRECT_REUSE'
  | 'REPAIR'
  | 'REFURBISH'
  | 'REPURPOSE'
  | 'COMPONENT_RECOVERY'
  | 'RECYCLE';

export type DestinationAction =
  | 'INTERNAL_REDEPLOYMENT'
  | 'DONATION'
  | 'RESALE'
  | 'COMPONENT_HARVEST'
  | 'RESPONSIBLE_RECYCLING';

export type DecisionObjective =
  | 'BALANCED'
  | 'SUSTAINABILITY_FIRST'
  | 'COST_FIRST'
  | 'UTILIZATION_FIRST';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'PROVISIONAL';

export type AssetLifecycleState =
  | 'REGISTERED'
  | 'ASSESSING'
  | 'ASSESSED'
  | 'PENDING_DECISION'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CLOSED';

export type PhysicalCondition = 'grade_a' | 'grade_b' | 'grade_c' | 'damaged';

export type FunctionalStatus =
  | 'fully_functional'
  | 'minor_defect'
  | 'major_fault'
  | 'non_functional';

export type SanitizationMethod =
  | 'crypto_erase'
  | 'overwrite_single_pass'
  | 'overwrite_multi_pass'
  | 'degauss_destroy'
  | 'physical_shred'
  | 'none';

export type SanitizationStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'not_required';

export type ComputeTier = 'ENTRY' | 'MID' | 'PERFORMANCE' | 'LEGACY';

export interface SecurityGateResult {
  storage_present: boolean;
  sanitization_verified: boolean;
  sanitization_status: SanitizationStatus;
  sanitization_method: SanitizationMethod;
  verification_reference?: string | null;
  direct_reuse_permitted: boolean;
  blocking_reasons: string[];
  notes: string;
  cleared?: boolean;
}

export interface DeviceCapabilityProfile {
  compute_tier: ComputeTier;
  mobility_profile: string;
  ram_gb: number;
  storage_speed_class: string;
  graphics_capability: string;
  os_compatibility: string[];
  display_support: string;
  network_interfaces: string[];
  summary: string;
}

export interface EconomicEvaluation {
  estimated_repair_cost: number;
  estimated_residual_value: number;
  estimated_avoided_cost: number;
  economic_viability_flag: string;
  valuation_type?: string;
  methodology_notes?: string;
  calculation_breakdown?: Record<string, any>;
  is_estimate?: boolean;
}

export interface EnvironmentalEstimate {
  embodied_co2e_kg: number;
  ewaste_mass_kg: number;
  annual_avoided_co2e_kg: number;
  estimated_life_extension_years: number;
  total_estimated_co2e_avoided_kg: number;
  confidence: ConfidenceLevel;
  is_estimate: boolean;
  disclaimer: string;
  source_version: string;
}

export interface RAGSourceItem {
  source_id: string;
  source_title: string;
  excerpt: string;
  category: string;
  relevance_score: number;
}

export interface ScenarioItem {
  pathway: CircularPathway;
  destination_action: DestinationAction;
  is_eligible: boolean;
  suitability_score: number;
  deterministic_cost: number;
  estimated_residual_value: number;
  demand_match?: string | null;
  useful_life_extension_years: number;
  estimated_co2e_avoided_kg: number;
  estimated_ewaste_diverted_kg: number;
  trade_offs: string;
  risks_and_uncertainties: string[];
  rank?: number;
  is_recommended?: boolean;
  // Legacy aliases
  estimated_repair_cost?: number;
  net_economic_value?: number;
  estimated_co2e_savings_kg?: number;
  economic_viability?: string;
}

export interface AlternativeOption {
  pathway: CircularPathway;
  destination_action: DestinationAction;
  suitability_score: number;
  trade_off_summary: string;
}

export interface AIAssessmentResult {
  condition_assessment: string;
  repairability: 'HIGH' | 'MODERATE' | 'LOW' | 'IMPRACTICAL';
  repurpose_potential: 'HIGH' | 'MODERATE' | 'LOW';
  possible_roles: string[];
  recommended_upgrades: string[];
  reasoning_summary: string;
}

export interface Asset {
  asset_id: string;
  serial_number: string;
  device_type: string;
  manufacturer: string;
  model: string;
  purchase_year: number;
  cpu_model: string;
  cpu_cores: number;
  ram_gb: number;
  storage_gb: number;
  storage_type: string;
  storage_present: boolean;
  sanitization_method: SanitizationMethod;
  sanitization_status: SanitizationStatus;
  sanitization_verified: boolean;
  verification_reference?: string | null;
  verified_by?: string | null;
  verified_at?: string | null;
  physical_condition: PhysicalCondition;
  functional_status: FunctionalStatus;
  battery_health_percent?: number | null;
  known_issues: string[];
  department: string;
  location: string;
  lifecycle_state: AssetLifecycleState;
  lifecycle_status?: AssetLifecycleState;
  created_at: string;
  updated_at: string;
}

export interface EvaluationResponse {
  recommendation_id: string;
  asset_id: string;
  decision_objective: DecisionObjective;
  security_gate: SecurityGateResult;
  capability_profile: DeviceCapabilityProfile;
  eligible_pathways: CircularPathway[];
  recommended_pathway: CircularPathway;
  destination_action: DestinationAction;
  suitability_score: number;
  economics: EconomicEvaluation;
  environmental: EnvironmentalEstimate;
  ai_assessment?: AIAssessmentResult | null;
  scenario_comparison: ScenarioItem[];
  tradeoffs?: string | null;
  evidence_sources: RAGSourceItem[];
  confidence_level: ConfidenceLevel;
  reasons: string[];
  key_factors: string[];
  alternatives_considered: AlternativeOption[];
  assumptions: string[];
  uncertainties: string[];
  why_this_recommendation: string;
  approval_status: string;
}

export interface DemandMatch {
  demand_id: string;
  department: string;
  role: string;
  priority: string;
  compatibility_score: number;
  is_compatible: boolean;
  met_requirements: string[];
  unmet_requirements: string[];
  notes: string;
}

export interface AssetDemandMatchesResponse {
  asset_id: string;
  device_summary: string;
  total_demands_evaluated: number;
  compatible_matches_count: number;
  matches: DemandMatch[];
}

export interface DemandItem {
  demand_id: string;
  department: string;
  role: string;
  quantity_needed: number;
  quantity_fulfilled: number;
  remaining_quantity?: number;
  priority: string;
  min_compute_tier: string;
  min_ram_gb: number;
  min_storage_gb: number;
  preferred_storage_type?: string | null;
  required_os?: string[] | string;
  required_mobility: string;
  required_display?: string | null;
  required_network?: string[] | string;
  notes?: string | null;
  created_at?: string;
}

export interface AssetMatchForDemand {
  asset_id: string;
  serial_number: string;
  device_type: string;
  manufacturer: string;
  model: string;
  purchase_year: number;
  cpu_model: string;
  cpu_cores: number;
  ram_gb: number;
  storage_gb: number;
  storage_type: string;
  battery_health_percent?: number | null;
  physical_condition: string;
  functional_status: string;
  department: string;
  location: string;
  storage_present: boolean;
  sanitization_verified: boolean;
  compatibility_score: number;
  is_compatible: boolean;
  reasons: string[];
  unmet_requirements: string[];
  security_eligibility_status: string;
  recommended_action: string;
}

export interface DemandCandidatesResponse {
  demand_id: string;
  department: string;
  role: string;
  quantity_needed: number;
  quantity_fulfilled: number;
  remaining_quantity: number;
  total_assets_evaluated: number;
  compatible_assets_count: number;
  candidates: AssetMatchForDemand[];
}

export interface RecommendationItem {
  recommendation_id: string;
  asset_id: string;
  decision_objective: string;
  recommended_pathway: CircularPathway;
  destination_action: DestinationAction;
  suitability_score: number;
  estimated_repair_cost: number;
  estimated_residual_value: number;
  estimated_avoided_cost: number;
  economic_viability: string;
  estimated_life_extension_years: number;
  estimated_ewaste_diverted_kg: number;
  estimated_co2e_avoided_kg: number;
  is_estimate: boolean;
  confidence_level: string;
  reasons: string[];
  key_factors: string[];
  alternatives_considered: AlternativeOption[];
  assumptions: string[];
  uncertainties: string[];
  why_this_recommendation: string;
  security_gate_cleared: boolean;
  approval_status: string;
  approved_by?: string | null;
  approval_notes?: string | null;
  chosen_pathway_override?: string | null;
  chosen_destination_override?: string | null;
  decided_at?: string | null;
  created_at: string;
}

export interface ApprovalDecisionRequest {
  decision: 'APPROVE' | 'OVERRIDE' | 'REJECT';
  chosen_pathway?: CircularPathway | null;
  chosen_destination?: DestinationAction | null;
  actor: string;
  approval_notes: string;
}

export interface ApprovalDecisionResponse {
  recommendation_id: string;
  asset_id: string;
  approval_status: string;
  final_pathway: CircularPathway;
  final_destination: DestinationAction;
  decided_at: string;
  decided_by: string;
  new_lifecycle_state: AssetLifecycleState;
  notes: string;
}

export interface AssetPassportEvent {
  event_id: string;
  asset_id: string;
  event_type: string;
  timestamp: string;
  actor: string;
  details: Record<string, any>;
}

export interface AssetPassportResponse {
  asset_id: string;
  serial_number: string;
  device_summary: string;
  lifecycle_status: string;
  total_events_logged: number;
  created_at: string;
  events: AssetPassportEvent[];
}

export interface PathwayBreakdown {
  direct_reuse: number;
  repair: number;
  refurbish: number;
  repurpose: number;
  component_recovery: number;
  recycle: number;
}

export interface ImpactSummaryResponse {
  total_assets_registered: number;
  total_assets_assessed: number;
  total_assets_eligible_circular: number;
  pathway_breakdown: PathwayBreakdown;
  total_estimated_purchase_cost_avoided: number;
  total_estimated_ewaste_diverted_kg: number;
  total_estimated_co2e_avoided_kg: number;
  total_estimated_useful_life_extension_years: number;
  is_estimate: boolean;
  confidence: string;
  disclaimer: string;
  assumptions_version: string;
  // Fallbacks for legacy references
  total_avoided_purchase_cost_inr?: number;
  total_ewaste_diverted_kg?: number;
  total_co2e_avoided_kg?: number;
  total_operational_life_extension_years?: number;
}
