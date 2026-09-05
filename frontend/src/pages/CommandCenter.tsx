import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  ShieldAlert,
  Clock,
  ArrowRight,
  TrendingUp,
  Leaf,
  Scale,
  DollarSign,
  RotateCcw,
  Search,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { api } from '../services/api';
import { EstimateBadge } from '../components/common/EstimateBadge';
import { SecurityGateBadge } from '../components/common/SecurityGateBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';

const PATHWAY_CONFIG = {
  direct_reuse: {
    label: 'Direct Reuse',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500',
    border: 'border-emerald-500/30',
    desc: 'Immediate redeployment with zero overhaul',
  },
  repair: {
    label: 'Repair',
    color: 'text-sky-400',
    bg: 'bg-sky-500',
    border: 'border-sky-500/30',
    desc: 'Component-level servicing & testing',
  },
  refurbish: {
    label: 'Refurbish',
    color: 'text-teal-400',
    bg: 'bg-teal-500',
    border: 'border-teal-500/30',
    desc: 'Hardware upgrades, battery/cosmetic overhaul',
  },
  repurpose: {
    label: 'Repurpose',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500',
    border: 'border-indigo-500/30',
    desc: 'Secondary institutional tier / lab node',
  },
  component_recovery: {
    label: 'Component Recovery',
    color: 'text-amber-400',
    bg: 'bg-amber-500',
    border: 'border-amber-500/30',
    desc: 'Harvesting RAM, storage & working displays',
  },
  recycle: {
    label: 'Recycle',
    color: 'text-slate-400',
    bg: 'bg-slate-500',
    border: 'border-slate-700',
    desc: 'Certified WEEE material extraction',
  },
};

const PATHWAY_COLORS: Record<string, string> = {
  direct_reuse: '#10b981',
  repair: '#0ea5e9',
  refurbish: '#14b8a6',
  repurpose: '#6366f1',
  component_recovery: '#f59e0b',
  recycle: '#64748b',
};

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchFilter, setSearchFilter] = useState('');
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  // Queries
  const {
    data: impactSummary,
    isLoading: isImpactLoading,
    error: impactError,
    refetch: refetchImpact,
  } = useQuery({
    queryKey: ['impact-summary'],
    queryFn: () => api.getImpactSummary(),
    staleTime: 10_000,
  });

  const {
    data: assets = [],
    isLoading: isAssetsLoading,
    error: assetsError,
    refetch: refetchAssets,
  } = useQuery({
    queryKey: ['assets'],
    queryFn: () => api.getAssets(),
    staleTime: 10_000,
  });

  const { data: approvals = [] } = useQuery({
    queryKey: ['approvals'],
    queryFn: () => api.getApprovals(),
    staleTime: 10_000,
  });

  // Seed Simulated Data Mutation
  const seedMutation = useMutation({
    mutationFn: () => api.seedSimulatedData(),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['impact-summary'] });
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
      setSeedNotice(`Simulated dataset refreshed: ${data.total_assets_in_db ?? 30} assets active.`);
      setTimeout(() => setSeedNotice(null), 5000);
    },
    onError: (err: any) => {
      setSeedNotice(`Seed error: ${err.message}`);
      setTimeout(() => setSeedNotice(null), 5000);
    },
  });

  if (isImpactLoading || isAssetsLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  if (impactError || assetsError) {
    return (
      <ErrorState
        title="Failed to Load Portfolio Command Center"
        message={((impactError || assetsError) as Error)?.message || 'Could not connect to ReLife API.'}
        onRetry={() => {
          refetchImpact();
          refetchAssets();
        }}
      />
    );
  }

  // Derived Operational Metrics
  const totalRegistered = impactSummary?.total_assets_registered ?? assets.length;
  const totalAssessed = impactSummary?.total_assets_assessed ?? 0;
  const totalEligible = impactSummary?.total_assets_eligible_circular ?? 0;
  const pendingApprovals = approvals.filter((a) => a.approval_status === 'PENDING_DECISION').length;
  const approvedCount = approvals.filter((a) => a.approval_status === 'APPROVED' || a.approval_status === 'OVERRIDDEN').length;

  const awaitingSecurity = assets.filter(
    (a) => a.storage_present && !a.sanitization_verified
  ).length;

  const needingAssessment = assets.filter(
    (a) => a.lifecycle_state === 'REGISTERED' || !a.lifecycle_state
  ).length;

  // Filtered Assets for Recent Table
  const filteredAssets = assets.filter((asset) => {
    const q = searchFilter.toLowerCase();
    return (
      asset.asset_id.toLowerCase().includes(q) ||
      asset.manufacturer.toLowerCase().includes(q) ||
      asset.model.toLowerCase().includes(q) ||
      asset.department.toLowerCase().includes(q)
    );
  });

  const breakdown = impactSummary?.pathway_breakdown || {
    direct_reuse: 0,
    repair: 0,
    refurbish: 0,
    repurpose: 0,
    component_recovery: 0,
    recycle: 0,
  };

  const totalEvaluatedPathways = Object.values(breakdown).reduce((acc, v) => acc + v, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Page Header & Live Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <LayoutDashboard className="text-emerald-400 shrink-0" size={24} />
              <span>Institutional IT Portfolio Command Center</span>
            </h2>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time circular asset allocation, lifecycle progress, and environmental avoidance metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-xs font-medium text-slate-200 hover:text-white transition disabled:opacity-50"
            title="Reset database with standard 30-device institutional IT cohort"
          >
            <RotateCcw size={14} className={seedMutation.isPending ? 'animate-spin text-sky-400' : 'text-slate-400'} />
            <span>{seedMutation.isPending ? 'Seeding Cohort...' : 'Refresh Simulated Data'}</span>
          </button>

          <button
            onClick={() => navigate('/assets')}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition shadow-sm"
          >
            <Cpu size={14} />
            <span>Evaluate Asset</span>
          </button>
        </div>
      </div>

      {seedNotice && (
        <div className="rounded-lg border border-sky-500/30 bg-sky-950/40 p-3 text-xs text-sky-300 flex items-center justify-between">
          <span>{seedNotice}</span>
          <button onClick={() => setSeedNotice(null)} className="text-sky-400 hover:text-white ml-4">
            ×
          </button>
        </div>
      )}

      {/* 2. Portfolio Health & Attention Summary */}
      <section aria-labelledby="portfolio-health">
        <h3 id="portfolio-health" className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <ShieldAlert size={14} className="text-amber-400" />
          <span>Portfolio Attention & Governance Status</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Needing Assessment */}
          <div
            onClick={() => navigate('/assets')}
            className="group cursor-pointer rounded-xl border border-slate-800/80 bg-[#0c111d]/80 hover:border-slate-700 p-4 transition"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Needing Assessment</span>
              <Cpu size={16} className="text-sky-400 group-hover:scale-110 transition" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{needingAssessment}</span>
              <span className="text-xs text-slate-500">of {totalRegistered} assets</span>
            </div>
            <p className="mt-2 text-xs text-slate-400 flex items-center gap-1 group-hover:text-emerald-400 transition">
              <span>Run technical evaluation</span>
              <ArrowRight size={12} />
            </p>
          </div>

          {/* Awaiting Security Gate */}
          <div
            onClick={() => navigate('/assets')}
            className="group cursor-pointer rounded-xl border border-rose-900/30 bg-rose-950/10 hover:border-rose-700/50 p-4 transition"
          >
            <div className="flex items-center justify-between text-xs text-rose-300">
              <span>Unverified Storage Drives</span>
              <ShieldAlert size={16} className="text-rose-400 group-hover:scale-110 transition" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-rose-200">{awaitingSecurity}</span>
              <span className="text-xs text-rose-400/70">NIST SP 800-88 Gate</span>
            </div>
            <p className="mt-2 text-xs text-rose-300/80 group-hover:text-rose-200 transition">
              Direct reuse strictly blocked until sanitized
            </p>
          </div>

          {/* Pending Dispositions */}
          <div
            onClick={() => navigate('/approvals')}
            className="group cursor-pointer rounded-xl border border-slate-800/80 bg-[#0c111d]/80 hover:border-slate-700 p-4 transition"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Pending Human Approvals</span>
              <Clock size={16} className="text-amber-400 group-hover:scale-110 transition" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-300">{pendingApprovals}</span>
              <span className="text-xs text-slate-500">awaiting decision</span>
            </div>
            <p className="mt-2 text-xs text-slate-400 flex items-center gap-1 group-hover:text-amber-300 transition">
              <span>Review disposition queue</span>
              <ArrowRight size={12} />
            </p>
          </div>

          {/* Circular Opportunities */}
          <div
            onClick={() => navigate('/impact')}
            className="group cursor-pointer rounded-xl border border-emerald-900/30 bg-emerald-950/10 hover:border-emerald-700/50 p-4 transition"
          >
            <div className="flex items-center justify-between text-xs text-emerald-300">
              <span>Eligible Circular Assets</span>
              <Leaf size={16} className="text-emerald-400 group-hover:scale-110 transition" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-300">{totalEligible}</span>
              <span className="text-xs text-emerald-400/70">second-life pathways</span>
            </div>
            <p className="mt-2 text-xs text-emerald-400/80 group-hover:text-emerald-300 transition">
              Avoids premature electronic waste
            </p>
          </div>
        </div>
      </section>

      {/* 3. Primary KPIs & Environmental Avoidance Metrics */}
      <section aria-labelledby="primary-metrics" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 id="primary-metrics" className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <TrendingUp size={14} className="text-emerald-400" />
            <span>Portfolio Intelligence & Value Generation</span>
          </h3>
          <EstimateBadge label="ESTIMATE ONLY" />
        </div>

        {/* Hero Dominant Metric Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Hero Card: Cost Avoided */}
          <div className="lg:col-span-2 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-[#0e1726] to-[#090d16] p-6 relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Primary Institutional Economic Impact
                </span>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                    ₹{(impactSummary?.total_estimated_purchase_cost_avoided ?? 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-300/80 font-medium">procurement capital saved</span>
                </div>
                <p className="mt-2 text-sm text-slate-400 max-w-xl">
                  Calculated against standard university institutional IT replacement cycles. Second-life allocation
                  replaces new purchases via internal redeployment, repair, and component harvesting.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 shrink-0">
                <DollarSign size={28} className="text-emerald-400" />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wide">Useful Life Extended</span>
                <p className="text-lg font-bold text-slate-200 mt-0.5">
                  {(impactSummary?.total_estimated_useful_life_extension_years ?? 0).toFixed(1)} yrs
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wide">E-Waste Diverted</span>
                <p className="text-lg font-bold text-slate-200 mt-0.5">
                  {(impactSummary?.total_estimated_ewaste_diverted_kg ?? 0).toFixed(1)} kg
                </p>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 uppercase tracking-wide">Avoided CO₂e</span>
                <p className="text-lg font-bold text-slate-200 mt-0.5">
                  {(impactSummary?.total_estimated_co2e_avoided_kg ?? 0).toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Hero Card: Circular Disposition Rate */}
          <div className="rounded-xl border border-slate-800/80 bg-[#0c111d]/90 p-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Portfolio Assessment Status
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">
                  {totalRegistered > 0 ? Math.round((totalAssessed / totalRegistered) * 100) : 0}%
                </span>
                <span className="text-xs text-slate-400">assessed ({totalAssessed}/{totalRegistered})</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 mt-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${totalRegistered > 0 ? (totalAssessed / totalRegistered) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Approved Dispositions</span>
                <span className="font-semibold text-emerald-400">{approvedCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Assumptions Engine</span>
                <span className="font-mono text-[11px] text-slate-400">v{impactSummary?.assumptions_version || '1.0.0-provisional'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Confidence Metric</span>
                <span className="text-amber-400 font-medium">{impactSummary?.confidence || 'PROVISIONAL'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Lifecycle Flow Visualization */}
      <section aria-labelledby="lifecycle-flow" className="rounded-xl border border-slate-800/80 bg-[#0c111d]/90 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 id="lifecycle-flow" className="text-sm font-bold text-white flex items-center gap-2">
              <Scale size={16} className="text-emerald-400" />
              <span>Institutional IT Lifecycle Progression</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Deterministic progression pipeline from intake registration to verified second-life disposition.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">GOVERNANCE ENFORCED</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {[
            { step: '1. REGISTERED', count: totalRegistered, note: 'Intake in DB', color: 'text-slate-200' },
            { step: '2. ASSESSED', count: totalAssessed, note: 'Capability profiled', color: 'text-sky-300' },
            { step: '3. ELIGIBLE', count: totalEligible, note: 'Security & physics ok', color: 'text-teal-300' },
            { step: '4. RECOMMENDED', count: approvals.length, note: 'Multi-objective AI', color: 'text-indigo-300' },
            { step: '5. APPROVED', count: approvedCount, note: 'Human authorized', color: 'text-emerald-300' },
            { step: '6. SECOND LIFE', count: approvedCount, note: 'Re-deployed / Saved', color: 'text-emerald-400 font-bold' },
          ].map((item, idx) => (
            <div key={idx} className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">{item.step}</span>
              <div className="my-2">
                <span className={`text-xl font-extrabold ${item.color}`}>{item.count}</span>
              </div>
              <span className="text-[10px] text-slate-500 truncate">{item.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Pathway Intelligence */}
      <section aria-labelledby="pathway-intelligence" className="rounded-xl border border-slate-800/80 bg-[#0c111d]/90 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 id="pathway-intelligence" className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-emerald-400" />
              <span>Circular Pathway Allocation Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Distribution across standard ReLife circular strategies evaluated by deterministic rules and AI ranking.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {totalEvaluatedPathways} evaluated recommendations
          </span>
        </div>

        {/* Multi-segment distribution progress bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-800/80 rounded-full h-3 flex overflow-hidden">
            {totalEvaluatedPathways === 0 ? (
              <div className="w-full h-full bg-slate-800 text-[10px] text-slate-500 flex items-center justify-center">
                Awaiting Asset Evaluations
              </div>
            ) : (
              (Object.keys(PATHWAY_CONFIG) as Array<keyof typeof PATHWAY_CONFIG>).map((key) => {
                const count = breakdown[key as keyof typeof breakdown] || 0;
                if (count === 0) return null;
                const pct = (count / totalEvaluatedPathways) * 100;
                return (
                  <div
                    key={key}
                    style={{ width: `${pct}%`, backgroundColor: PATHWAY_COLORS[key] }}
                    className="h-full transition-all duration-300"
                    title={`${PATHWAY_CONFIG[key].label}: ${count} (${pct.toFixed(1)}%)`}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Pathway Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(Object.keys(PATHWAY_CONFIG) as Array<keyof typeof PATHWAY_CONFIG>).map((key) => {
            const config = PATHWAY_CONFIG[key];
            const count = breakdown[key as keyof typeof breakdown] || 0;
            const pct = totalEvaluatedPathways > 0 ? ((count / totalEvaluatedPathways) * 100).toFixed(0) : '0';

            return (
              <div
                key={key}
                className={`rounded-lg border ${config.border} bg-slate-900/40 p-3.5 flex items-start justify-between`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${config.bg}`} />
                    <span className="text-xs font-semibold text-slate-200">{config.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{config.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-lg font-bold ${config.color}`}>{count}</span>
                  <span className="text-[10px] text-slate-500 block">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Recent Asset Intake Queue & Direct Evaluation Access */}
      <section aria-labelledby="asset-queue" className="rounded-xl border border-slate-800/80 bg-[#0c111d]/90 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 id="asset-queue" className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu size={16} className="text-emerald-400" />
              <span>Institutional Asset Inventory Queue</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any asset to launch the full Asset Intelligence decision assessment.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search model, ID, dept..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/80 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {filteredAssets.length === 0 ? (
          <EmptyState
            title="No Assets Found"
            description={searchFilter ? 'No devices match your search query.' : 'Asset inventory is currently empty.'}
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">Asset ID</th>
                  <th scope="col" className="px-4 py-3 font-medium">Hardware Model</th>
                  <th scope="col" className="px-4 py-3 font-medium">Specifications</th>
                  <th scope="col" className="px-4 py-3 font-medium">Security Gate</th>
                  <th scope="col" className="px-4 py-3 font-medium">Condition</th>
                  <th scope="col" className="px-4 py-3 font-medium">Department</th>
                  <th scope="col" className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
                {filteredAssets.slice(0, 8).map((asset) => {
                  const isBlocked = asset.storage_present && !asset.sanitization_verified;

                  return (
                    <tr key={asset.asset_id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3 font-mono font-medium text-white whitespace-nowrap">
                        {asset.asset_id}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-200">
                        {asset.manufacturer} {asset.model}
                        <span className="block text-[10px] text-slate-400 uppercase">{asset.device_type}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                        {asset.ram_gb}GB RAM · {asset.storage_gb}GB {asset.storage_type}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <SecurityGateBadge
                          status={isBlocked ? 'BLOCKED' : 'CLEARED'}
                          directReusePermitted={!isBlocked}
                          reasons={isBlocked ? ['Unverified drive - pending technician wipe audit'] : []}
                        />
                      </td>
                      <td className="px-4 py-3 capitalize text-slate-300">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${
                          asset.physical_condition === 'grade_a' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50' :
                          asset.physical_condition === 'grade_b' ? 'bg-sky-950/60 text-sky-300 border border-sky-800/50' :
                          'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                        }`}>
                          {asset.physical_condition.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {asset.department}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/assets?selected=${asset.asset_id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-xs font-medium transition"
                        >
                          <span>Assess</span>
                          <ArrowRight size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 7. Quick Platform Actions */}
      <section aria-labelledby="quick-actions" className="rounded-xl border border-slate-800/80 bg-[#0c111d]/90 p-5">
        <h3 id="quick-actions" className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Quick Decision Navigation
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => navigate('/assets')}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 hover:border-slate-700 text-left transition"
          >
            <div>
              <span className="text-xs font-medium text-white block">Asset Intelligence</span>
              <span className="text-[10px] text-slate-400">Deep technical assessment</span>
            </div>
            <Cpu size={16} className="text-emerald-400 shrink-0 ml-2" />
          </button>

          <button
            onClick={() => navigate('/scenarios')}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 hover:border-slate-700 text-left transition"
          >
            <div>
              <span className="text-xs font-medium text-white block">Scenario Lab</span>
              <span className="text-[10px] text-slate-400">Evaluate multi-objectives</span>
            </div>
            <SlidersHorizontal size={16} className="text-sky-400 shrink-0 ml-2" />
          </button>

          <button
            onClick={() => navigate('/approvals')}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 hover:border-slate-700 text-left transition"
          >
            <div>
              <span className="text-xs font-medium text-white block">Approval Center</span>
              <span className="text-[10px] text-slate-400">Authorize dispositions</span>
            </div>
            <CheckCircle2 size={16} className="text-amber-400 shrink-0 ml-2" />
          </button>

          <button
            onClick={() => navigate('/impact')}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-800/80 hover:border-slate-700 text-left transition"
          >
            <div>
              <span className="text-xs font-medium text-white block">Impact Center</span>
              <span className="text-[10px] text-slate-400">Verified sustainability metrics</span>
            </div>
            <Leaf size={16} className="text-emerald-400 shrink-0 ml-2" />
          </button>
        </div>
      </section>
    </div>
  );
};
