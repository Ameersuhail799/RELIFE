import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  GitPullRequest,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Sparkles,
  Check,
  Building,
  ChevronRight,
  Search,
} from 'lucide-react';
import { api } from '../services/api';
import { EstimateBadge } from '../components/common/EstimateBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import type {
  DemandCandidatesResponse,
  AssetMatchForDemand,
} from '../types/api';

export const DemandMatching: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const selectedDemandParam = searchParams.get('demand');
  const [selectedDemandId, setSelectedDemandId] = useState<string>(selectedDemandParam || '');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [departmentSearch, setDepartmentSearch] = useState<string>('');

  // 1. Fetch All Demands
  const { data: demands = [], isLoading: isDemandsLoading, error: demandsError } = useQuery({
    queryKey: ['demands'],
    queryFn: () => api.getDemands(),
    staleTime: 30_000,
  });

  // Default selection to first demand if none chosen
  useEffect(() => {
    if (!selectedDemandId && demands.length > 0) {
      const firstId = demands[0].demand_id;
      setSelectedDemandId(firstId);
      setSearchParams({ demand: firstId }, { replace: true });
    }
  }, [demands, selectedDemandId, setSearchParams]);

  const handleSelectDemand = (demandId: string) => {
    setSelectedDemandId(demandId);
    setSearchParams({ demand: demandId });
  };

  // 2. Fetch Candidates for the Selected Demand
  const {
    data: candidatesData,
    isLoading: isCandidatesLoading,
    error: candidatesError,
  } = useQuery<DemandCandidatesResponse>({
    queryKey: ['demand-candidates', selectedDemandId],
    queryFn: () => api.getDemandCandidates(selectedDemandId),
    enabled: !!selectedDemandId,
    staleTime: 20_000,
  });

  if (isDemandsLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  if (demandsError) {
    return (
      <ErrorState
        title="Failed to Load Institutional Demands"
        message="Could not retrieve departmental hardware requirements from the institutional registry."
        onRetry={() => queryClient.invalidateQueries({ queryKey: ['demands'] })}
      />
    );
  }

  // Filter demands by priority and department search
  const filteredDemands = demands.filter((d) => {
    const matchesPriority = priorityFilter === 'ALL' || d.priority.toUpperCase() === priorityFilter;
    const matchesDept =
      !departmentSearch ||
      d.department.toLowerCase().includes(departmentSearch.toLowerCase()) ||
      d.role.toLowerCase().includes(departmentSearch.toLowerCase());
    return matchesPriority && matchesDept;
  });

  const selectedDemand = demands.find((d) => d.demand_id === selectedDemandId) || demands[0];

  // Aggregate stats
  const totalUnitsNeeded = demands.reduce((acc, d) => acc + d.quantity_needed, 0);
  const totalUnitsFulfilled = demands.reduce((acc, d) => acc + d.quantity_fulfilled, 0);
  const remainingTotal = totalUnitsNeeded - totalUnitsFulfilled;

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-rose-950/60 text-rose-300 border-rose-800/60';
      case 'HIGH':
        return 'bg-amber-950/60 text-amber-300 border-amber-800/60';
      case 'MEDIUM':
        return 'bg-sky-950/60 text-sky-300 border-sky-800/60';
      case 'LOW':
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getSecurityBadge = (status: string) => {
    switch (status) {
      case 'CLEARED_FOR_IMMEDIATE_REDEPLOYMENT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
            <ShieldCheck size={12} className="text-emerald-400" />
            CLEARED FOR REDEPLOYMENT
          </span>
        );
      case 'SECURITY_BLOCKED_UNVERIFIED_STORAGE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/50">
            <ShieldX size={12} className="text-rose-400" />
            BLOCKED: UNVERIFIED STORAGE
          </span>
        );
      case 'REQUIRES_REPAIR_BEFORE_DEPLOYMENT':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50">
            <ShieldAlert size={12} className="text-amber-400" />
            REQUIRES SERVICING
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <GitPullRequest className="text-emerald-400" size={22} />
              Institutional Demand Matching
            </h2>
            <EstimateBadge />
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              [SIMULATED DATASET]
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Map decommissioned hardware to active departmental requests across campus laboratories and administration.
          </p>
        </div>

        {/* Global Fulfillment Metrics */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Total Demands</span>
            <span className="text-sm font-bold text-white font-mono">{demands.length} Requests</span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Fulfillment</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {totalUnitsFulfilled} / {totalUnitsNeeded} ({Math.round((totalUnitsFulfilled / (totalUnitsNeeded || 1)) * 100)}%)
            </span>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 text-center">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Pending Gap</span>
            <span className="text-sm font-bold text-amber-400 font-mono">{remainingTotal} Units</span>
          </div>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Institutional Demands List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Building size={14} className="text-emerald-400" />
              Active Demands ({filteredDemands.length})
            </span>
          </div>

          {/* Search & Filter bar */}
          <div className="space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={departmentSearch}
                onChange={(e) => setDepartmentSearch(e.target.value)}
                placeholder="Search department or role..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Priority Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-2.5 py-0.5 rounded-full border transition-colors whitespace-nowrap ${
                    priorityFilter === p
                      ? 'bg-slate-700 text-white border-slate-500 font-semibold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Demand Cards List */}
          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredDemands.map((demand) => {
              const isSelected = demand.demand_id === selectedDemandId;
              const remaining = demand.quantity_needed - demand.quantity_fulfilled;
              const percent = Math.min(100, Math.round((demand.quantity_fulfilled / demand.quantity_needed) * 100));

              return (
                <div
                  key={demand.demand_id}
                  onClick={() => handleSelectDemand(demand.demand_id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/50 shadow-md shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono text-[11px] text-emerald-400 font-bold">
                      {demand.demand_id}
                    </span>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getPriorityBadgeClass(demand.priority)}`}>
                      {demand.priority}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white tracking-wide">
                    {demand.department}
                  </h4>
                  <div className="text-xs text-slate-400 mt-0.5 font-medium">
                    {demand.role.replace(/_/g, ' ')}
                  </div>

                  {/* Requirements summary chip */}
                  <div className="mt-2 text-[11px] text-slate-400 bg-slate-950/40 rounded p-1.5 border border-slate-800/60 font-mono flex items-center justify-between">
                    <span>Min {demand.min_compute_tier} • {demand.min_ram_gb}GB</span>
                    <span className="text-slate-500">{demand.required_mobility}</span>
                  </div>

                  {/* Fulfillment bar */}
                  <div className="mt-2.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Fulfilled: {demand.quantity_fulfilled} / {demand.quantity_needed}</span>
                      <span className="font-mono text-emerald-400">{remaining} needed</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Best Candidate Assets for Selected Demand (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Selected Demand Header Details */}
          {selectedDemand && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-emerald-400 font-bold">{selectedDemand.demand_id}</span>
                    <span className="text-slate-500">•</span>
                    <h3 className="text-base font-bold text-white">
                      {selectedDemand.department} — {selectedDemand.role.replace(/_/g, ' ')}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedDemand.notes || 'Institutional hardware requirement for educational laboratories and departmental computing.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono uppercase px-2.5 py-1 rounded-md border ${getPriorityBadgeClass(selectedDemand.priority)}`}>
                    {selectedDemand.priority} PRIORITY
                  </span>
                </div>
              </div>

              {/* Multi-Dimensional Technical Specifications Required */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Compute Tier</span>
                  <span className="font-bold text-white font-mono mt-0.5 block">≥ {selectedDemand.min_compute_tier}</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Min Memory</span>
                  <span className="font-bold text-white font-mono mt-0.5 block">≥ {selectedDemand.min_ram_gb} GB RAM</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Min Storage</span>
                  <span className="font-bold text-white font-mono mt-0.5 block">≥ {selectedDemand.min_storage_gb} GB</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Mobility Profile</span>
                  <span className="font-bold text-white font-mono mt-0.5 block">{selectedDemand.required_mobility}</span>
                </div>
              </div>
            </div>
          )}

          {/* Candidate Assets List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-400" />
                Ranked Candidate Assets ({candidatesData?.compatible_assets_count || 0} Compatible of {candidatesData?.total_assets_evaluated || 0} Evaluated)
              </span>
              <span className="text-xs text-slate-500">
                Multi-dimensional match score
              </span>
            </div>

            {isCandidatesLoading ? (
              <LoadingSkeleton variant="card" />
            ) : candidatesError ? (
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-xl text-center text-slate-400 text-xs">
                Could not retrieve candidates for this demand.
              </div>
            ) : (
              <div className="space-y-3">
                {candidatesData?.candidates?.map((candidate: AssetMatchForDemand, index: number) => {
                  const isTopMatch = index === 0 && candidate.is_compatible;

                  return (
                    <div
                      key={candidate.asset_id}
                      className={`rounded-xl border p-4 transition-all relative ${
                        candidate.is_compatible
                          ? isTopMatch
                            ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500/30'
                            : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-900/30 border-slate-800/50 opacity-75'
                      }`}
                    >
                      {/* Candidate Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                              candidate.is_compatible
                                ? isTopMatch
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            MATCH #{index + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs text-white font-bold">{candidate.asset_id}</span>
                              <span className="text-slate-500">•</span>
                              <span className="text-sm font-semibold text-white">
                                {candidate.manufacturer} {candidate.model}
                              </span>
                              <span className="text-xs text-slate-400 font-mono">({candidate.purchase_year})</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {candidate.cpu_model} • {candidate.ram_gb}GB RAM • {candidate.storage_gb}GB {candidate.storage_type} • Location: {candidate.location}
                            </p>
                          </div>
                        </div>

                        {/* Compatibility Score Pill */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Match Score</span>
                            <span
                              className={`text-sm font-black font-mono ${
                                candidate.compatibility_score >= 80
                                  ? 'text-emerald-400'
                                  : candidate.compatibility_score >= 60
                                  ? 'text-amber-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              {candidate.compatibility_score.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge & Security Clearance */}
                      <div className="py-2.5 flex items-center justify-between gap-2 flex-wrap border-b border-slate-800/60">
                        <div className="flex items-center gap-2 flex-wrap">
                          {getSecurityBadge(candidate.security_eligibility_status)}
                          <span className="text-xs text-slate-400">
                            Physical: <strong className="text-slate-200 capitalize">{candidate.physical_condition.replace('_', ' ')}</strong>
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs text-slate-400">
                            Status: <strong className="text-slate-200 capitalize">{candidate.functional_status.replace('_', ' ')}</strong>
                          </span>
                        </div>

                        <button
                          onClick={() => navigate(`/asset-intelligence?selected=${candidate.asset_id}`)}
                          className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                        >
                          View in Intelligence
                          <ChevronRight size={14} />
                        </button>
                      </div>

                      {/* "Why does this asset fit?" Breakdown Box */}
                      <div className="pt-3 space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Multi-Dimensional Fit Analysis:
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          {/* Satisfied Requirements */}
                          <div className="bg-slate-950/50 rounded-lg p-2.5 border border-slate-800/80 space-y-1">
                            <span className="text-[10px] font-semibold uppercase text-emerald-400 flex items-center gap-1">
                              <Check size={12} />
                              Satisfied Capabilities ({candidate.reasons.length})
                            </span>
                            <ul className="space-y-1 text-[11px] text-slate-300">
                              {candidate.reasons.map((r, i) => (
                                <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                                  <span className="text-emerald-400 mt-0.5">•</span>
                                  <span>{r}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Unmet Requirements / Blockers */}
                          <div className="bg-slate-950/50 rounded-lg p-2.5 border border-slate-800/80 space-y-1">
                            <span className={`text-[10px] font-semibold uppercase flex items-center gap-1 ${
                              candidate.unmet_requirements.length > 0 ? 'text-amber-400' : 'text-slate-500'
                            }`}>
                              <AlertCircle size={12} />
                              Gaps & Limitations ({candidate.unmet_requirements.length})
                            </span>
                            {candidate.unmet_requirements.length > 0 ? (
                              <ul className="space-y-1 text-[11px] text-slate-300">
                                {candidate.unmet_requirements.map((u, i) => (
                                  <li key={i} className="flex items-start gap-1.5 leading-relaxed">
                                    <span className="text-amber-400 mt-0.5">•</span>
                                    <span>{u}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-[11px] text-slate-400 italic">
                                Zero technical or mobility gaps identified for this role.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Recommended Action */}
                        <div className="bg-slate-950/30 rounded p-2 border border-slate-800/60 text-[11px] text-slate-400 flex items-center justify-between gap-2">
                          <div>
                            <strong className="text-slate-300">Orchestration Action: </strong>
                            <span>{candidate.recommended_action}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

