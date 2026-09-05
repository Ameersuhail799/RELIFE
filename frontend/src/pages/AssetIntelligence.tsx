import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Cpu,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  SlidersHorizontal,
  FileText,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Check,
  Layers,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { SecurityGateBadge } from '../components/common/SecurityGateBadge';
import { EstimateBadge } from '../components/common/EstimateBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import type { DecisionObjective } from '../types/api';

const OBJECTIVES: Array<{ id: DecisionObjective; label: string; desc: string }> = [
  { id: 'BALANCED', label: 'Balanced', desc: 'Equal weight across economics, capability & sustainability' },
  { id: 'SUSTAINABILITY_FIRST', label: 'Sustainability First', desc: 'Prioritizes CO₂e avoidance and useful life extension' },
  { id: 'COST_FIRST', label: 'Cost First', desc: 'Maximizes net capital recovery and minimal repair outlay' },
  { id: 'UTILIZATION_FIRST', label: 'Utilization First', desc: 'Optimizes for immediate institutional demand deployment' },
];

export const AssetIntelligence: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const selectedParam = searchParams.get('selected');
  const [selectedAssetId, setSelectedAssetId] = useState<string>(selectedParam || '');
  const [objective, setObjective] = useState<DecisionObjective>('BALANCED');
  const [expandedRAG, setExpandedRAG] = useState<boolean>(true);
  const [expandedAssumptions, setExpandedAssumptions] = useState<boolean>(false);

  // 1. Fetch Asset Catalog
  const { data: assets = [], isLoading: isAssetsLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: () => api.getAssets(),
    staleTime: 30_000,
  });

  // Default selection to first asset if none chosen
  useEffect(() => {
    if (!selectedAssetId && assets.length > 0) {
      const defaultId = assets[0].asset_id;
      setSelectedAssetId(defaultId);
      setSearchParams({ selected: defaultId }, { replace: true });
    }
  }, [assets, selectedAssetId, setSearchParams]);

  // Update URL when asset selection changes
  const handleSelectAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    setSearchParams({ selected: assetId });
  };

  // 2. Fetch Selected Asset Details
  const { data: asset, isLoading: isAssetLoading, error: assetError } = useQuery({
    queryKey: ['asset', selectedAssetId],
    queryFn: () => api.getAsset(selectedAssetId),
    enabled: !!selectedAssetId,
  });

  // 3. Evaluate Asset with Decision Objective
  const {
    data: evaluation,
    isLoading: isEvaluationLoading,
    error: evalError,
    refetch: refetchEvaluation,
  } = useQuery({
    queryKey: ['evaluation', selectedAssetId, objective],
    queryFn: () => api.evaluateAsset(selectedAssetId, objective),
    enabled: !!selectedAssetId,
  });

  if (isAssetsLoading || (isAssetLoading && !asset)) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  if (assetError) {
    return (
      <ErrorState
        title="Asset Not Found"
        message={`Asset ${selectedAssetId} could not be retrieved from inventory.`}
        onRetry={() => queryClient.invalidateQueries({ queryKey: ['assets'] })}
      />
    );
  }

  const isBlocked = evaluation?.security_gate
    ? !evaluation.security_gate.direct_reuse_permitted
    : (asset?.storage_present && !asset?.sanitization_verified);

  const securityGate = evaluation?.security_gate;
  const capability = evaluation?.capability_profile;
  const economics = evaluation?.economics;
  const environmental = evaluation?.environmental;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header & Asset Selector Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Cpu className="text-emerald-400 shrink-0" size={24} />
              <span>Asset Intelligence & Decision Assessment</span>
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Deep technical capability audit, NIST SP 800-88 Rev. 2 gate enforcement, and explainable multi-objective AI recommendation.
          </p>
        </div>

        {/* Live Asset Dropdown Selector */}
        <div className="flex items-center gap-3 shrink-0">
          <label htmlFor="asset-select" className="text-xs font-medium text-slate-400 hidden sm:inline">
            Active Asset:
          </label>
          <select
            id="asset-select"
            value={selectedAssetId}
            onChange={(e) => handleSelectAsset(e.target.value)}
            aria-label="Active Asset Selector"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-mono font-medium text-white focus:border-emerald-500 focus:outline-none"
          >
            {assets.map((a) => (
              <option key={a.asset_id} value={a.asset_id}>
                {a.asset_id} — {a.manufacturer} {a.model} ({a.department})
              </option>
            ))}
          </select>

          <button
            onClick={() => refetchEvaluation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-xs font-medium text-slate-200 transition"
            title="Re-run assessment with current backend parameters"
          >
            <RotateCcw size={13} className={isEvaluationLoading ? 'animate-spin text-emerald-400' : 'text-slate-400'} />
            <span className="hidden sm:inline">Re-evaluate</span>
          </button>
        </div>
      </div>

      {/* 2. Device Identity Banner */}
      {asset && (
        <section aria-labelledby="device-identity" className="rounded-xl border border-slate-800/80 bg-[#0c111d]/90 p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  {asset.asset_id}
                </span>
                <h3 id="device-identity" className="text-lg font-bold text-white">
                  {asset.manufacturer} {asset.model}
                </h3>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-800/50">
                  {asset.device_type}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Serial: <span className="font-mono text-slate-300">{asset.serial_number}</span> · Purchased: {asset.purchase_year} · Department: {asset.department} ({asset.location})
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex px-2.5 py-1 rounded text-xs font-medium ${
                asset.physical_condition === 'grade_a' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50' :
                asset.physical_condition === 'grade_b' ? 'bg-sky-950/60 text-sky-300 border border-sky-800/50' :
                'bg-amber-950/60 text-amber-300 border border-amber-800/50'
              }`}>
                Physical: {asset.physical_condition.replace('_', ' ').toUpperCase()}
              </span>

              <span className={`inline-flex px-2.5 py-1 rounded text-xs font-medium ${
                asset.functional_status === 'fully_functional' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50' :
                asset.functional_status === 'minor_defect' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50' :
                'bg-rose-950/60 text-rose-300 border border-rose-800/50'
              }`}>
                Functional: {asset.functional_status.replace('_', ' ').toUpperCase()}
              </span>

              <SecurityGateBadge
                status={isBlocked ? 'BLOCKED' : 'CLEARED'}
                directReusePermitted={!isBlocked}
                reasons={securityGate?.blocking_reasons}
              />
            </div>
          </div>
        </section>
      )}

      {/* 3. NIST SP 800-88 Rev. 2 Security Gate Audit Box */}
      <section aria-labelledby="security-gate-audit" className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 id="security-gate-audit" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <ShieldAlert size={14} className={isBlocked ? 'text-rose-400' : 'text-emerald-400'} />
            <span>NIST SP 800-88 Rev. 2 Media Sanitization Hard Gate</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-500">DETERMINISTIC BOUNDARY</span>
        </div>

        {isBlocked ? (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg border border-rose-500/40 bg-rose-900/30 p-2 shrink-0">
                <ShieldX size={22} className="text-rose-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    MANDATORY SECURITY GATE: RESTRICTED CIRCULAR PATHWAYS BLOCKED
                  </span>
                  <span className="text-[10px] font-mono text-rose-400 bg-rose-900/40 px-2 py-0.5 rounded">
                    GATE ENFORCED
                  </span>
                </div>
                <p className="text-xs text-rose-200/90 leading-relaxed">
                  In compliance with <strong>NIST SP 800-88 Rev. 2 (Guidelines for Media Sanitization, September 2025)</strong>,
                  storage media on this device has <strong>not been verified sanitized</strong>. Restricted release pathways
                  (Direct Reuse, Internal Redeployment, Donation, Resale) are hard-blocked by deterministic rules.
                </p>
              </div>
            </div>

            {/* Audit Details */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-rose-900/40">
              <div className="bg-rose-950/40 p-2.5 rounded border border-rose-900/30">
                <span className="text-[11px] text-rose-300/70 block">Drive Present</span>
                <span className="font-semibold text-rose-200">{asset?.storage_present ? 'Yes (Active Media)' : 'No (Diskless)'}</span>
              </div>
              <div className="bg-rose-950/40 p-2.5 rounded border border-rose-900/30">
                <span className="text-[11px] text-rose-300/70 block">Sanitization Status</span>
                <span className="font-semibold text-rose-200 font-mono uppercase">{asset?.sanitization_status || 'PENDING'}</span>
              </div>
              <div className="bg-rose-950/40 p-2.5 rounded border border-rose-900/30">
                <span className="text-[11px] text-rose-300/70 block">Recorded Method</span>
                <span className="font-semibold text-rose-200 font-mono uppercase">{asset?.sanitization_method || 'NONE'}</span>
              </div>
              <div className="bg-rose-950/40 p-2.5 rounded border border-rose-900/30">
                <span className="text-[11px] text-rose-300/70 block">Technician Verification</span>
                <span className="font-semibold text-rose-400 font-mono">UNVERIFIED</span>
              </div>
            </div>

            {/* Blocking Reasons List */}
            {securityGate?.blocking_reasons && securityGate.blocking_reasons.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-rose-300 uppercase tracking-wide">
                  Gate Disqualification Factors:
                </span>
                <ul className="space-y-1 text-xs text-rose-300/90 list-disc list-inside">
                  {securityGate.blocking_reasons.map((reason, idx) => (
                    <li key={idx}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-[11px] text-rose-300/70 italic pt-1">
              Note: AI recommendation algorithms cannot bypass or score around this gate. An authorized IT technician must log
              cryptographic erase or physical sanitization before direct reuse pathways can be unlocked.
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-900/30 p-2 shrink-0">
                <ShieldCheck size={22} className="text-emerald-400" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                    MEDIA SANITIZATION VERIFIED · NIST SP 800-88 REV. 2 COMPLIANT
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-900/40 px-2 py-0.5 rounded">
                    CLEARED
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90">
                  Storage media verified purged. Reference: <span className="font-mono text-white">{asset?.verification_reference || 'CERT-NIST-SP800-88-R2'}</span> · Verified By: {asset?.verified_by || 'IT Security Officer'}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-900/30 px-3 py-1.5 rounded-lg border border-emerald-700/50 shrink-0">
              Direct Reuse Permitted
            </span>
          </div>
        )}
      </section>

      {/* 4. Objective Switcher Bar */}
      <section aria-labelledby="decision-objective" className="space-y-2">
        <h3 id="decision-objective" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-sky-400" />
          <span>Decision Optimization Objective</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {OBJECTIVES.map((obj) => {
            const isSelected = objective === obj.id;
            return (
              <button
                key={obj.id}
                onClick={() => setObjective(obj.id)}
                className={`p-3.5 rounded-xl border text-left transition ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-950/20 text-white shadow-sm'
                    : 'border-slate-800 bg-[#0c111d]/70 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {obj.label}
                  </span>
                  {isSelected && <Check size={14} className="text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{obj.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. Flagship Recommendation Hero Card */}
      {evaluation && (
        <section aria-labelledby="recommendation-hero" className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-[#0e192a] via-[#0c111d] to-[#090d16] p-6 space-y-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  ReLife Circular Recommendation
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {evaluation.decision_objective}
                </span>
              </div>

              {/* Dominant Pathway & Destination */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 id="recommendation-hero" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {evaluation.recommended_pathway.replace('_', ' ')}
                </h3>
                <span className="text-lg sm:text-xl font-semibold text-emerald-400 flex items-center gap-1.5">
                  <ArrowRight size={18} />
                  <span>{evaluation.destination_action.replace('_', ' ')}</span>
                </span>
              </div>

              {/* Explainable Why This Recommendation */}
              <p className="text-sm text-slate-200 leading-relaxed pt-1">
                {evaluation.why_this_recommendation}
              </p>
            </div>

            {/* Suitability Score Box */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-center shrink-0 min-w-[140px]">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
                Suitability Score
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                {evaluation.suitability_score.toFixed(1)}
                <span className="text-xs text-slate-400 font-normal"> / 100</span>
              </div>
              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold mt-2 ${
                evaluation.confidence_level === 'HIGH' ? 'bg-emerald-900/60 text-emerald-300' :
                evaluation.confidence_level === 'MEDIUM' ? 'bg-sky-900/60 text-sky-300' :
                'bg-amber-900/60 text-amber-300'
              }`}>
                {evaluation.confidence_level} CONFIDENCE
              </span>
            </div>
          </div>

          {/* Key Decision Factors */}
          {evaluation.key_factors && evaluation.key_factors.length > 0 && (
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Key Decision Factors:
              </span>
              <div className="flex flex-wrap gap-2">
                {evaluation.key_factors.map((factor, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800/80 border border-slate-700 text-slate-200"
                  >
                    <CheckCircle2 size={12} className="text-emerald-400" />
                    <span>{factor}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Expandable Assumptions & Uncertainties */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setExpandedAssumptions(!expandedAssumptions)}
              className="flex items-center justify-between w-full text-left text-xs font-semibold text-slate-400 hover:text-white py-1"
            >
              <span>Methodology Assumptions & Identified Uncertainties</span>
              {expandedAssumptions ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {expandedAssumptions && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide block mb-1">
                    Underlying Assumptions:
                  </span>
                  <ul className="space-y-1 text-slate-400 list-disc list-inside">
                    {evaluation.assumptions?.map((assump, idx) => (
                      <li key={idx}>{assump}</li>
                    )) || <li>Standard institutional IT lifecycle parameters applied.</li>}
                  </ul>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide block mb-1">
                    Key Uncertainties:
                  </span>
                  <ul className="space-y-1 text-amber-200/80 list-disc list-inside">
                    {evaluation.uncertainties?.map((unc, idx) => (
                      <li key={idx}>{unc}</li>
                    )) || <li>Component availability subject to campus lab harvest inventory.</li>}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {evalError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-400 shrink-0" />
          <span>Evaluation Error: {(evalError as Error).message}. Displaying cached parameters.</span>
        </div>
      )}

      {/* 6. Technical Capability Profile vs Decision Evidence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardware Capability Profile */}
        <section aria-labelledby="capability-profile" className="rounded-xl border border-slate-800/80 bg-[#0c111d]/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 id="capability-profile" className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu size={16} className="text-sky-400" />
              <span>Hardware Capability Profile</span>
            </h3>
            {capability && (
              <span className="text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-800/50 px-2 py-0.5 rounded">
                Tier: {capability.compute_tier}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Processor</span>
              <span className="text-white font-semibold">{asset?.cpu_model}</span>
              <span className="text-[10px] text-slate-400 block">{asset?.cpu_cores} Cores</span>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Memory</span>
              <span className="text-white font-semibold">{asset?.ram_gb} GB</span>
              <span className="text-[10px] text-slate-400 block">DDR Architecture</span>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Storage</span>
              <span className="text-white font-semibold">{asset?.storage_gb} GB</span>
              <span className="text-[10px] text-slate-400 block uppercase">{asset?.storage_type}</span>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Mobility Profile</span>
              <span className="text-white font-semibold">{capability?.mobility_profile || 'PORTABLE_LAPTOP'}</span>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Graphics</span>
              <span className="text-white font-semibold">{capability?.graphics_capability || 'INTEGRATED'}</span>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Display Support</span>
              <span className="text-white font-semibold truncate block">{capability?.display_support || 'INTERNAL + EXTERNAL'}</span>
            </div>
          </div>

          {capability?.os_compatibility && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-wide block">OS Compatibility:</span>
              <div className="flex flex-wrap gap-1.5">
                {capability.os_compatibility.map((os, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                    {os}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Economic & Environmental Decision Evidence */}
        <section aria-labelledby="decision-evidence" className="rounded-xl border border-slate-800/80 bg-[#0c111d]/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 id="decision-evidence" className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span>Decision Evidence & Economic Viability</span>
            </h3>
            <EstimateBadge label="ESTIMATE ONLY" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Avoided Purchase Cost</span>
              <span className="text-emerald-400 font-extrabold text-base">
                ₹{(economics?.estimated_avoided_cost ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block">Replacement avoidance</span>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Estimated Residual Value</span>
              <span className="text-white font-extrabold text-base">
                ₹{(economics?.estimated_residual_value ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block">Current depreciated value</span>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Estimated Repair Outlay</span>
              <span className="text-amber-300 font-extrabold text-base">
                ₹{(economics?.estimated_repair_cost ?? 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block">Servicing requirement</span>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Economic Viability</span>
              <span className="text-emerald-300 font-extrabold text-base">
                {economics?.economic_viability_flag || 'HIGHLY_VIABLE'}
              </span>
              <span className="text-[10px] text-slate-400 block">Viability rating</span>
            </div>
          </div>

          {/* Environmental Evidence */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block">CO₂e Avoided</span>
              <span className="text-sm font-bold text-white">
                {(environmental?.total_estimated_co2e_avoided_kg ?? environmental?.embodied_co2e_kg ?? 0).toFixed(1)} kg
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">E-Waste Diverted</span>
              <span className="text-sm font-bold text-white">
                {(environmental?.ewaste_mass_kg ?? 0).toFixed(1)} kg
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Life Extended</span>
              <span className="text-sm font-bold text-white">
                {(environmental?.estimated_life_extension_years ?? 0).toFixed(1)} yrs
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* 7. Alternatives Considered */}
      {evaluation?.alternatives_considered && evaluation.alternatives_considered.length > 0 && (
        <section aria-labelledby="alternatives-considered" className="rounded-xl border border-slate-800/80 bg-[#0c111d]/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 id="alternatives-considered" className="text-sm font-bold text-white flex items-center gap-2">
                <Layers size={16} className="text-sky-400" />
                <span>Alternatives Evaluated & Ranked Below Recommendation</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every circular pathway evaluated under the {objective} objective with transparent trade-off rationale.
              </p>
            </div>
            <span className="text-xs text-slate-400">
              {evaluation.alternatives_considered.length} alternative options
            </span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-medium">Alternative Pathway</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Destination</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Suitability Score</th>
                  <th scope="col" className="px-4 py-2.5 font-medium">Trade-off & Ranking Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
                {evaluation.alternatives_considered.map((alt, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-2.5 font-semibold text-white whitespace-nowrap">
                      {alt.pathway.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-2.5 text-slate-300 whitespace-nowrap">
                      {alt.destination_action.replace('_', ' ')}
                    </td>
                    <td className="px-4 py-2.5 font-mono font-bold text-sky-400 whitespace-nowrap">
                      {alt.suitability_score.toFixed(1)}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400 leading-relaxed">
                      {alt.trade_off_summary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 8. RAG Knowledge & Standards Citations (NIST SP 800-88 Rev. 2) */}
      {evaluation?.evidence_sources && evaluation.evidence_sources.length > 0 && (
        <section aria-labelledby="rag-evidence" className="rounded-xl border border-slate-800/80 bg-[#0c111d]/90 p-5 space-y-4">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedRAG(!expandedRAG)}>
            <div>
              <h3 id="rag-evidence" className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen size={16} className="text-emerald-400" />
                <span>RAG Knowledge Sources & Standards Citations</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                External technical standards and internal institutional engineering rules retrieved for this recommendation.
              </p>
            </div>
            <button className="text-slate-400 hover:text-white p-1">
              {expandedRAG ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {expandedRAG && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {evaluation.evidence_sources.map((source, idx) => {
                const isExternalStandard = source.source_id.toLowerCase().includes('nist');

                return (
                  <div
                    key={idx}
                    className={`rounded-lg border p-4 space-y-2 ${
                      isExternalStandard
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : 'border-slate-800 bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            isExternalStandard
                              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700/50'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {isExternalStandard ? 'External Standard' : 'ReLife Knowledge Base'}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">{source.source_id}</span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1">{source.source_title}</h4>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        Score: {(source.relevance_score * 100).toFixed(0)}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-2.5 rounded border border-slate-800/80">
                      "{source.excerpt}"
                    </p>

                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                      <span>Category: {source.category}</span>
                      {isExternalStandard && <span className="text-emerald-400 font-medium">NIST SP 800-88 Rev. 2 (Sept 2025)</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 9. Responsible AI Governance & Action Controls */}
      <section aria-labelledby="action-governance" className="rounded-xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-[#0c111d] to-slate-900 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono tracking-wider text-emerald-400 uppercase font-bold">
              Responsible AI Governance Core
            </span>
            <p className="text-xs text-slate-300 max-w-xl">
              <strong>AI RECOMMENDS · RULES ENFORCE SAFETY · HUMANS APPROVE</strong>. Recommendations do not self-execute.
              Every circular disposition must be verified by an authorized institutional authority.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate(`/passport?selected=${selectedAssetId}`)}
              className="px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-200 transition flex items-center gap-1.5"
            >
              <FileText size={14} />
              <span>View Audit Passport</span>
            </button>

            <button
              onClick={() => navigate('/approvals')}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <span>Review in Approval Center</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
