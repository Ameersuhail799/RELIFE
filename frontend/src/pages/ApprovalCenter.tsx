import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle2,
  ShieldCheck,
  ShieldX,
  Sparkles,
  Clock,
  UserCheck,
  XCircle,
  RotateCcw,
  Check,
  FileCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import type {
  CircularPathway,
  DestinationAction,
  ApprovalDecisionRequest,
} from '../types/api';

const ALL_PATHWAYS: Array<{ id: CircularPathway; label: string }> = [
  { id: 'DIRECT_REUSE', label: 'Direct Reuse' },
  { id: 'REPAIR', label: 'Repair & Restore' },
  { id: 'REFURBISH', label: 'Institutional Refurbish' },
  { id: 'REPURPOSE', label: 'Secondary Repurpose' },
  { id: 'COMPONENT_RECOVERY', label: 'Component Harvesting' },
  { id: 'RECYCLE', label: 'Certified E-Waste Recycling' },
];

const DESTINATIONS: Array<{ id: DestinationAction; label: string }> = [
  { id: 'INTERNAL_REDEPLOYMENT', label: 'Internal Redeployment (Campus Lab / Office)' },
  { id: 'DONATION', label: 'External Community / Educational Donation' },
  { id: 'RESALE', label: 'Authorized Secondary Market Resale' },
  { id: 'COMPONENT_HARVEST', label: 'Internal Component Spares Pool' },
  { id: 'RESPONSIBLE_RECYCLING', label: 'Certified WEEE / R2 Recycling Partner' },
];

const STATUS_TABS = [
  { id: 'PENDING_APPROVAL', label: 'Pending Review' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'REJECTED', label: 'Rejected' },
  { id: 'OVERRIDDEN', label: 'Overridden' },
  { id: 'ALL', label: 'All Dispositions' },
];

export const ApprovalCenter: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const selectedParam = searchParams.get('selected');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING_APPROVAL');
  const [selectedRecId, setSelectedRecId] = useState<string>(selectedParam || '');

  // Form State
  const [actionType, setActionType] = useState<'APPROVE' | 'OVERRIDE' | 'REJECT'>('APPROVE');
  const [overridePathway, setOverridePathway] = useState<CircularPathway>('REPAIR');
  const [overrideDestination, setOverrideDestination] = useState<DestinationAction>('INTERNAL_REDEPLOYMENT');
  const [actorName, setActorName] = useState<string>('Dr. Elena Rostova (Sustainability Officer)');
  const [approvalNotes, setApprovalNotes] = useState<string>('Approved in accordance with institutional circular computing guidelines.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [securityViolationError, setSecurityViolationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Fetch Recommendations
  const {
    data: recommendations = [],
    isLoading: isRecsLoading,
    error: recsError,
  } = useQuery({
    queryKey: ['approvals', statusFilter],
    queryFn: () => api.getApprovals(statusFilter === 'ALL' ? undefined : statusFilter),
    staleTime: 15_000,
  });

  // 2. Fetch Assets for specs context
  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: () => api.getAssets(),
    staleTime: 30_000,
  });

  // Default selection
  useEffect(() => {
    if (!selectedRecId && recommendations.length > 0) {
      const firstId = recommendations[0].recommendation_id;
      setSelectedRecId(firstId);
      setSearchParams({ selected: firstId }, { replace: true });
    }
  }, [recommendations, selectedRecId, setSearchParams]);

  const handleSelectRec = (recId: string) => {
    setSelectedRecId(recId);
    setSearchParams({ selected: recId });
    setSecurityViolationError(null);
    setSuccessMessage(null);
  };

  const selectedRec = recommendations.find((r) => r.recommendation_id === selectedRecId) || recommendations[0];
  const associatedAsset = selectedRec ? assets.find((a) => a.asset_id === selectedRec.asset_id) : null;

  // Handle Human Decision Submission
  const handleSubmitDecision = async () => {
    if (!selectedRec) return;
    setIsSubmitting(true);
    setSecurityViolationError(null);
    setSuccessMessage(null);

    const payload: ApprovalDecisionRequest = {
      decision: actionType,
      chosen_pathway: actionType === 'OVERRIDE' ? overridePathway : null,
      chosen_destination: actionType === 'OVERRIDE' ? overrideDestination : null,
      actor: actorName.trim() || 'Institutional Reviewer',
      approval_notes: approvalNotes.trim() || (actionType === 'APPROVE' ? 'Approved by officer.' : 'Rejected by officer.'),
    };

    try {
      const res = await api.decideApproval(selectedRec.recommendation_id, payload);
      setSuccessMessage(
        `Recommendation ${res.recommendation_id} successfully ${res.approval_status.toLowerCase()}! Resulting asset state: ${res.new_lifecycle_state}. Recorded in Circular Passport.`
      );
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['passport'] });
      queryClient.invalidateQueries({ queryKey: ['impact'] });
    } catch (err: any) {
      if (err?.status === 403 || err?.data?.detail?.includes('Security Gate') || err?.message?.includes('Security Gate')) {
        setSecurityViolationError(
          err?.data?.detail || err?.message || 'MANDATORY SECURITY GATE VIOLATION: Pathway strictly blocked under NIST SP 800-88 Rev. 2 zero-trust sanitization rules.'
        );
      } else {
        setSecurityViolationError(err?.data?.detail || err?.message || 'Decision failed to process.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRecsLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  if (recsError) {
    return (
      <ErrorState
        title="Failed to Load Approval Queue"
        message="Could not retrieve pending recommendation items from the institutional governance registry."
        onRetry={() => queryClient.invalidateQueries({ queryKey: ['approvals'] })}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <CheckCircle2 className="text-emerald-400" size={22} />
              Human-in-the-Loop Approval Center
            </h2>
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              [SIMULATED DATASET]
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review, validate, or override AI recommendations with non-bypassable security gate constraints.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Queue List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Clock size={14} className="text-emerald-400" />
              Disposition Queue ({recommendations.length})
            </span>
          </div>

          {recommendations.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400 text-xs">
              No recommendations found for filter <strong className="text-white">{statusFilter}</strong>.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
              {recommendations.map((rec) => {
                const isSelected = rec.recommendation_id === selectedRecId;
                const recAsset = assets.find((a) => a.asset_id === rec.asset_id);
                const isBlocked = !rec.security_gate_cleared;

                return (
                  <div
                    key={rec.recommendation_id}
                    onClick={() => handleSelectRec(rec.recommendation_id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500/50 shadow-md shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                        : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-[11px] text-emerald-400 font-bold">
                        {rec.asset_id}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          rec.approval_status === 'APPROVED'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50'
                            : rec.approval_status === 'REJECTED'
                            ? 'bg-rose-950/60 text-rose-300 border-rose-800/50'
                            : rec.approval_status === 'OVERRIDDEN'
                            ? 'bg-purple-950/60 text-purple-300 border-purple-800/50'
                            : 'bg-amber-950/60 text-amber-300 border-amber-800/50'
                        }`}
                      >
                        {rec.approval_status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white tracking-wide">
                      {rec.recommended_pathway.replace(/_/g, ' ')}
                    </h4>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {recAsset ? `${recAsset.manufacturer} ${recAsset.model} (${recAsset.department})` : rec.destination_action.replace(/_/g, ' ')}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-300 font-medium">
                        Score: {rec.suitability_score.toFixed(1)}/100
                      </span>
                      <span
                        className={`font-mono text-[10px] px-1.5 py-0.2 rounded ${
                          isBlocked
                            ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        }`}
                      >
                        {isBlocked ? 'GATE: BLOCKED' : 'GATE: CLEARED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Hero Review Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedRec ? (
            <>
              {/* Dossier Header */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-emerald-400 font-bold">{selectedRec.recommendation_id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-sm font-semibold text-white">Asset: {selectedRec.asset_id}</span>
                      {associatedAsset && (
                        <span className="text-xs text-slate-400">({associatedAsset.manufacturer} {associatedAsset.model})</span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      Proposed Pathway: <span className="text-emerald-400">{selectedRec.recommended_pathway.replace(/_/g, ' ')}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Target Destination: <strong className="text-slate-300 font-mono">{selectedRec.destination_action.replace(/_/g, ' ')}</strong> • Objective: <strong className="text-slate-300 font-mono">{selectedRec.decision_objective}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-mono uppercase px-3 py-1 rounded-md border ${
                        selectedRec.approval_status === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          : selectedRec.approval_status === 'REJECTED'
                          ? 'bg-rose-950 text-rose-300 border-rose-700'
                          : selectedRec.approval_status === 'OVERRIDDEN'
                          ? 'bg-purple-950 text-purple-300 border-purple-700'
                          : 'bg-amber-950 text-amber-300 border-amber-700'
                      }`}
                    >
                      {selectedRec.approval_status}
                    </span>
                  </div>
                </div>

                {/* Security Gate Verification Bar */}
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {selectedRec.security_gate_cleared ? (
                      <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                    ) : (
                      <ShieldX size={18} className="text-rose-400 shrink-0" />
                    )}
                    <span className="text-xs text-slate-300">
                      Deterministic Security Gate:{' '}
                      <strong className={selectedRec.security_gate_cleared ? 'text-emerald-400' : 'text-rose-400'}>
                        {selectedRec.security_gate_cleared ? 'CLEARED FOR REUSE' : 'BLOCKED (NIST SP 800-88 Rev. 2)'}
                      </strong>
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    {associatedAsset ? `Drive: ${associatedAsset.storage_present ? 'Present' : 'None'} | Sanitization: ${associatedAsset.sanitization_verified ? 'Verified' : 'Unverified'}` : ''}
                  </div>
                </div>

                {/* Economic & Environmental Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                  <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Suitability Score</span>
                    <span className="font-bold text-white font-mono text-sm mt-0.5 block">{selectedRec.suitability_score.toFixed(1)} / 100</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Est. Repair Cost</span>
                    <span className="font-bold text-white font-mono text-sm mt-0.5 block">₹{selectedRec.estimated_repair_cost.toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Life Extension</span>
                    <span className="font-bold text-sky-400 font-mono text-sm mt-0.5 block">+{selectedRec.estimated_life_extension_years} yrs</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Avoided CO₂e</span>
                    <span className="font-bold text-emerald-400 font-mono text-sm mt-0.5 block">~{selectedRec.estimated_co2e_avoided_kg} kg</span>
                  </div>
                </div>

                {/* Explainable Rationale */}
                <div className="bg-slate-950/40 rounded-lg p-3.5 border border-slate-800/70 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                    <Sparkles size={14} />
                    AI Recommendation Rationale
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedRec.why_this_recommendation || 'Evaluated against multi-attribute criteria including technical condition, component availability, and carbon preservation.'}
                  </p>
                </div>
              </div>

              {/* Security Violation Alert State (Prominent Red Callout) */}
              {securityViolationError && (
                <div className="rounded-xl border border-rose-500/50 bg-rose-950/30 p-5 space-y-3 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500/30">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
                      <ShieldX size={22} />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-rose-300 tracking-wide">
                          SECURITY GATE VIOLATION (HTTP 403: FORBIDDEN)
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/50 text-rose-200 border border-rose-700/60">
                          OVERRIDE REJECTED
                        </span>
                      </div>
                      <p className="text-xs text-rose-200/90 leading-relaxed font-mono">
                        {securityViolationError}
                      </p>
                      <p className="text-[11px] text-rose-300/70 pt-1 leading-relaxed">
                        Deterministic security rules enforce non-bypassable safety under NIST SP 800-88 Rev. 2. Neither AI recommendations nor human overrides can clear an unverified storage media drive for external reuse or donation. The asset remains safely protected in inventory.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message Confirmation */}
              {successMessage && (
                <div className="rounded-xl border border-emerald-500/50 bg-emerald-950/30 p-4 flex items-start gap-3 text-emerald-300 text-xs leading-relaxed">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold text-emerald-200">Decision Successfully Logged</strong>
                    {successMessage}
                  </div>
                </div>
              )}

              {/* 3. Human Review & Decision Panel */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <UserCheck size={16} className="text-emerald-400" />
                    Human Review & Disposition Authorization
                  </span>
                  <span className="text-xs text-slate-500">
                    Authority: Verified Institutional Officer
                  </span>
                </div>

                {/* Decision Type Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setActionType('APPROVE')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      actionType === 'APPROVE'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Check size={14} />
                    Approve AI Recommendation
                  </button>

                  <button
                    onClick={() => setActionType('OVERRIDE')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      actionType === 'OVERRIDE'
                        ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <RotateCcw size={14} />
                    Override Pathway
                  </button>

                  <button
                    onClick={() => setActionType('REJECT')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      actionType === 'REJECT'
                        ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <XCircle size={14} />
                    Reject Recommendation
                  </button>
                </div>

                {/* Override Pathway & Destination Selectors */}
                {actionType === 'OVERRIDE' && (
                  <div className="p-4 bg-slate-950/60 rounded-lg border border-purple-500/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                        Select Alternative Disposition Pathway:
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-slate-400 block mb-1">
                          Override Circular Pathway:
                        </label>
                        <select
                          value={overridePathway}
                          onChange={(e) => setOverridePathway(e.target.value as CircularPathway)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          {ALL_PATHWAYS.map((p) => {
                            const isDirectBlocked = p.id === 'DIRECT_REUSE' && !selectedRec.security_gate_cleared;
                            return (
                              <option key={p.id} value={p.id}>
                                {p.label} {isDirectBlocked ? '— [SECURITY GATE BLOCKED]' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-400 block mb-1">
                          Override Destination:
                        </label>
                        <select
                          value={overrideDestination}
                          onChange={(e) => setOverrideDestination(e.target.value as DestinationAction)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          {DESTINATIONS.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <p className="text-[11px] text-purple-200/70 italic">
                      Note: Overrides are strictly validated by the backend security gate. Blocked security pathways will be rejected by policy.
                    </p>
                  </div>
                )}

                {/* Actor & Approval Notes Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">
                      Authorizing Officer:
                    </label>
                    <input
                      type="text"
                      value={actorName}
                      onChange={(e) => setActorName(e.target.value)}
                      placeholder="Your Name / Officer ID"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">
                      Audit Notes & Justification:
                    </label>
                    <input
                      type="text"
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      placeholder="Notes recorded to immutable audit ledger"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Target: <strong className="text-white">{selectedRec.asset_id}</strong> ({actionType})
                  </span>

                  <button
                    onClick={handleSubmitDecision}
                    disabled={isSubmitting}
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      actionType === 'APPROVE'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/40'
                        : actionType === 'OVERRIDE'
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-950/40'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/40'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <FileCheck size={16} />
                    {isSubmitting
                      ? 'Authorizing...'
                      : actionType === 'APPROVE'
                      ? 'Submit Human Approval'
                      : actionType === 'OVERRIDE'
                      ? 'Authorize Pathway Override'
                      : 'Reject Recommendation'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">
              Select a recommendation to review from the queue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
