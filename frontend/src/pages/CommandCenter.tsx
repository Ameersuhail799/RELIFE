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
  RotateCcw,
  Search,
  CheckCircle2,
  SlidersHorizontal,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../services/api';
import { AssetIntakeModal } from '../components/assets/AssetIntakeModal';
import { EstimateBadge } from '../components/common/EstimateBadge';
import { SecurityGateBadge } from '../components/common/SecurityGateBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';

const PATHWAY_CONFIG = {
  direct_reuse: {
    label: 'Direct Reuse',
    color: 'text-emerald-400',
    barColor: '#10b981',
    desc: 'Immediate redeployment with zero overhaul',
  },
  repair: {
    label: 'Repair',
    color: 'text-sky-400',
    barColor: '#0ea5e9',
    desc: 'Component-level servicing & testing',
  },
  refurbish: {
    label: 'Refurbish',
    color: 'text-teal-400',
    barColor: '#14b8a6',
    desc: 'Hardware upgrades & battery overhaul',
  },
  repurpose: {
    label: 'Repurpose',
    color: 'text-indigo-400',
    barColor: '#6366f1',
    desc: 'Secondary tier or laboratory node',
  },
  component_recovery: {
    label: 'Component Recovery',
    color: 'text-amber-400',
    barColor: '#f59e0b',
    desc: 'Harvesting RAM, storage & displays',
  },
  recycle: {
    label: 'Recycle',
    color: 'text-slate-400',
    barColor: '#64748b',
    desc: 'Certified WEEE material extraction',
  },
};

export const CommandCenter: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchFilter, setSearchFilter] = useState('');
  const [seedNotice, setSeedNotice] = useState<string | null>(null);
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);

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
      setSeedNotice(`Simulated cohort active: ${data.total_assets_in_db ?? 30} university IT assets loaded.`);
      setTimeout(() => setSeedNotice(null), 5000);
    },
    onError: (err: any) => {
      setSeedNotice(`Initialization notice: ${err.message}`);
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
  const pendingApprovals = approvals.filter((a) => a.approval_status === 'PENDING_APPROVAL').length;
  const approvedCount = approvals.filter(
    (a) => a.approval_status === 'APPROVED' || a.approval_status === 'OVERRIDDEN'
  ).length;

  const awaitingSecurity = assets.filter(
    (a) => a.storage_present && !a.sanitization_verified
  ).length;

  const needingAssessment = assets.filter(
    (a) => a.lifecycle_state === 'REGISTERED' || !a.lifecycle_state
  ).length;

  // Filtered Assets for Inventory Table
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
    <div className="space-y-6 pb-12">
      {/* 1. Page Header & Live Status */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white flex items-center gap-2">
              <LayoutDashboard className="text-slate-400" size={20} />
              <span>Institutional IT Portfolio Command Center</span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise circular asset intelligence, lifecycle progression, and environmental impact tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsIntakeOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 transition"
            title="Register a new institutional IT asset"
          >
            <Plus size={14} className="text-emerald-400" />
            <span>Add Asset</span>
          </button>

          <button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 transition disabled:opacity-50"
            title="Refresh database with standard 30-device institutional IT cohort"
          >
            <RotateCcw size={14} className={seedMutation.isPending ? 'animate-spin text-slate-400' : 'text-slate-400'} />
            <span>{seedMutation.isPending ? 'Loading...' : 'Refresh Cohort'}</span>
          </button>

          <button
            onClick={() => navigate('/assets')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition"
          >
            <Cpu size={14} />
            <span>Evaluate Asset</span>
          </button>
        </div>
      </div>

      {seedNotice && (
        <div className="rounded-md border border-slate-700 bg-slate-900/90 p-3 text-xs text-slate-300 flex items-center justify-between">
          <span>{seedNotice}</span>
          <button onClick={() => setSeedNotice(null)} className="text-slate-400 hover:text-white ml-4">
            ×
          </button>
        </div>
      )}

      {/* Zero State Fallback Banner */}
      {totalRegistered === 0 && (
        <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-medium text-slate-200">
                Institutional IT Cohort Not Yet Initialized
              </p>
              <p className="text-[11px] text-slate-400">
                Populate the live system with the standard 30-device university IT dataset to view valuation and impact.
              </p>
            </div>
          </div>
          <button
            onClick={() => seedMutation.mutate()}
            disabled={seedMutation.isPending}
            className="rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600 px-3 py-1.5 text-xs font-medium text-white transition whitespace-nowrap"
          >
            {seedMutation.isPending ? 'Initializing...' : 'Initialize 30 Assets'}
          </button>
        </div>
      )}

      {/* 2. Portfolio Health & Attention Summary */}
      <section aria-labelledby="portfolio-health">
        <div className="flex items-center justify-between mb-2.5">
          <h3 id="portfolio-health" className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ShieldAlert size={13} className="text-slate-400" />
            <span>Governance & Pipeline Status</span>
          </h3>
          <span className="text-[11px] text-slate-500">Live Telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Needing Assessment */}
          <div
            onClick={() => navigate('/assets')}
            className="cursor-pointer rounded-lg border border-slate-800 bg-[#0c111d] hover:border-slate-700 p-3.5 transition"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Needing Assessment</span>
              <Cpu size={14} className="text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white">{needingAssessment}</span>
              <span className="text-xs text-slate-500">of {totalRegistered} assets</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 hover:text-slate-200 transition">
              <span>Run technical evaluation</span>
              <ArrowRight size={11} />
            </p>
          </div>

          {/* Awaiting Security Gate */}
          <div
            onClick={() => navigate('/assets')}
            className={`cursor-pointer rounded-lg border p-3.5 transition ${
              awaitingSecurity > 0
                ? 'border-amber-900/40 bg-amber-950/10 hover:border-amber-700/50'
                : 'border-slate-800 bg-[#0c111d] hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Unverified Storage</span>
              <ShieldAlert size={14} className={awaitingSecurity > 0 ? 'text-amber-400' : 'text-slate-400'} />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className={`text-xl font-bold ${awaitingSecurity > 0 ? 'text-amber-300' : 'text-white'}`}>
                {awaitingSecurity}
              </span>
              <span className="text-xs text-slate-500">NIST SP 800-88 Gate</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              {awaitingSecurity > 0 ? 'Direct reuse strictly held' : 'All active media verified'}
            </p>
          </div>

          {/* Pending Dispositions */}
          <div
            onClick={() => navigate('/approvals')}
            className="cursor-pointer rounded-lg border border-slate-800 bg-[#0c111d] hover:border-slate-700 p-3.5 transition"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Pending Human Approvals</span>
              <Clock size={14} className="text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-white">{pendingApprovals}</span>
              <span className="text-xs text-slate-500">awaiting decision</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 flex items-center gap-1 hover:text-slate-200 transition">
              <span>Review disposition queue</span>
              <ArrowRight size={11} />
            </p>
          </div>

          {/* Circular Opportunities */}
          <div
            onClick={() => navigate('/impact')}
            className="cursor-pointer rounded-lg border border-slate-800 bg-[#0c111d] hover:border-slate-700 p-3.5 transition"
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Circular Pathways Eligible</span>
              <Leaf size={14} className="text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-emerald-400">{totalEligible}</span>
              <span className="text-xs text-slate-500">second-life opportunities</span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Avoids premature landfilling
            </p>
          </div>
        </div>
      </section>

      {/* 3. Primary Value Realization & Environmental Metrics */}
      <section aria-labelledby="primary-metrics" className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 id="primary-metrics" className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <TrendingUp size={13} className="text-slate-400" />
            <span>Economic & Environmental Realization</span>
          </h3>
          <EstimateBadge label="ESTIMATE ONLY" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Main Hero Card: Cost Avoided */}
          <div className="lg:col-span-2 rounded-lg border border-slate-800 bg-[#0c111d] p-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Capital Preserved via Recirculation
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    ₹{(impactSummary?.total_estimated_purchase_cost_avoided ?? 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">procurement capital saved</span>
                </div>
                <p className="mt-2 text-xs text-slate-400 max-w-xl leading-relaxed">
                  Evaluated against institutional IT procurement baselines. Second-life allocation
                  satisfies demand via internal redeployment, repair, and component harvesting.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Useful Life Extended</span>
                <p className="text-base font-semibold text-slate-200 mt-0.5">
                  {(impactSummary?.total_estimated_useful_life_extension_years ?? 0).toFixed(1)} yrs
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">E-Waste Diverted</span>
                <p className="text-base font-semibold text-slate-200 mt-0.5">
                  {(impactSummary?.total_estimated_ewaste_diverted_kg ?? 0).toFixed(1)} kg
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wide">Avoided CO₂e</span>
                <p className="text-base font-semibold text-slate-200 mt-0.5">
                  {(impactSummary?.total_estimated_co2e_avoided_kg ?? 0).toFixed(1)} kg
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Card: Circular Disposition Rate */}
          <div className="rounded-lg border border-slate-800 bg-[#0c111d] p-5 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Assessment Coverage
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-white">
                  {totalRegistered > 0 ? Math.round((totalAssessed / totalRegistered) * 100) : 0}%
                </span>
                <span className="text-xs text-slate-400">({totalAssessed} of {totalRegistered} profiled)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalRegistered > 0 ? (totalAssessed / totalRegistered) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Approved Dispositions</span>
                <span className="font-medium text-slate-200">{approvedCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assumptions Engine</span>
                <span className="font-mono text-[11px] text-slate-400">v{impactSummary?.assumptions_version || '1.0.0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assurance Model</span>
                <span className="text-slate-300 font-mono text-[11px]">{impactSummary?.confidence || 'PROVISIONAL'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Lifecycle Pipeline */}
      <section aria-labelledby="lifecycle-flow" className="rounded-lg border border-slate-800 bg-[#0c111d] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 id="lifecycle-flow" className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Scale size={14} className="text-slate-400" />
              <span>Institutional IT Lifecycle Progression Pipeline</span>
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500">GOVERNANCE ENFORCED</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {[
            { step: '1. REGISTERED', count: totalRegistered, note: 'Intake in DB' },
            { step: '2. ASSESSED', count: totalAssessed, note: 'Capability profiled' },
            { step: '3. ELIGIBLE', count: totalEligible, note: 'Security & physics ok' },
            { step: '4. RECOMMENDED', count: approvals.length, note: 'Multi-objective AI' },
            { step: '5. APPROVED', count: approvedCount, note: 'Human authorized' },
            { step: '6. SECOND LIFE', count: approvedCount, note: 'Re-deployed / Saved' },
          ].map((item, idx) => (
            <div key={idx} className="rounded-md border border-slate-800 bg-slate-900/60 p-2.5 flex flex-col justify-between">
              <span className="text-[9px] font-semibold tracking-wider text-slate-400 uppercase">{item.step}</span>
              <div className="my-1.5">
                <span className="text-lg font-bold text-white">{item.count}</span>
              </div>
              <span className="text-[10px] text-slate-500 truncate">{item.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Pathway Allocation Breakdown */}
      <section aria-labelledby="pathway-intelligence" className="rounded-lg border border-slate-800 bg-[#0c111d] p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div>
            <h3 id="pathway-intelligence" className="text-xs font-semibold text-white flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-slate-400" />
              <span>Circular Pathway Allocation Distribution</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Evaluated second-life strategies across eligible institutional IT hardware.
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {totalEvaluatedPathways} evaluated recommendations
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2.5 flex overflow-hidden">
          {totalEvaluatedPathways === 0 ? (
            <div className="w-full h-full bg-slate-800 text-[10px] text-slate-500 flex items-center justify-center">
              Awaiting Evaluations
            </div>
          ) : (
            (Object.keys(PATHWAY_CONFIG) as Array<keyof typeof PATHWAY_CONFIG>).map((key) => {
              const count = breakdown[key as keyof typeof breakdown] || 0;
              if (count === 0) return null;
              const pct = (count / totalEvaluatedPathways) * 100;
              return (
                <div
                  key={key}
                  style={{ width: `${pct}%`, backgroundColor: PATHWAY_CONFIG[key].barColor }}
                  className="h-full"
                  title={`${PATHWAY_CONFIG[key].label}: ${count} (${pct.toFixed(1)}%)`}
                />
              );
            })
          )}
        </div>

        {/* Pathway Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {(Object.keys(PATHWAY_CONFIG) as Array<keyof typeof PATHWAY_CONFIG>).map((key) => {
            const config = PATHWAY_CONFIG[key];
            const count = breakdown[key as keyof typeof breakdown] || 0;
            const pct = totalEvaluatedPathways > 0 ? ((count / totalEvaluatedPathways) * 100).toFixed(0) : '0';

            return (
              <div
                key={key}
                className="rounded-md border border-slate-800 bg-slate-900/40 p-3 flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: config.barColor }} />
                    <span className="text-xs font-medium text-slate-200">{config.label}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{config.desc}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-base font-bold ${config.color}`}>{count}</span>
                  <span className="text-[10px] text-slate-500 block">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Institutional Asset Inventory Queue */}
      <section aria-labelledby="asset-queue" className="rounded-lg border border-slate-800 bg-[#0c111d] p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 id="asset-queue" className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Cpu size={14} className="text-slate-400" />
              <span>Institutional IT Inventory Queue</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Active intake repository and individual hardware compliance profiling.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search model, ID, dept..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full rounded-md border border-slate-800 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-slate-600 focus:outline-none"
            />
          </div>
        </div>

        {filteredAssets.length === 0 ? (
          <EmptyState
            title="No Assets Found"
            description={searchFilter ? 'No devices match your query.' : 'Asset inventory is currently empty.'}
          />
        ) : (
          <div className="overflow-x-auto rounded-md border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-slate-900/80 text-[10px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th scope="col" className="px-3 py-2.5 font-medium">Asset ID</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Hardware Model</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Specifications</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Security Gate</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Condition</th>
                  <th scope="col" className="px-3 py-2.5 font-medium">Department</th>
                  <th scope="col" className="px-3 py-2.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/20">
                {filteredAssets.slice(0, 8).map((asset) => {
                  const isBlocked = asset.storage_present && !asset.sanitization_verified;

                  return (
                    <tr key={asset.asset_id} className="hover:bg-slate-850/40 transition">
                      <td className="px-3 py-2 font-mono font-medium text-white whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{asset.asset_id}</span>
                          {asset.asset_id.startsWith('SIM-') ? (
                            <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-1 py-0.2 rounded border border-slate-700">
                              SIM
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-emerald-400 bg-slate-800 px-1 py-0.2 rounded border border-emerald-900">
                              INST
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-200">
                        {asset.manufacturer} {asset.model}
                        <span className="block text-[10px] text-slate-400 uppercase">{asset.device_type}</span>
                      </td>
                      <td className="px-3 py-2 text-slate-400 font-mono text-[11px]">
                        {asset.ram_gb}GB · {asset.storage_gb}GB {asset.storage_type}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <SecurityGateBadge
                          status={isBlocked ? 'BLOCKED' : 'CLEARED'}
                          directReusePermitted={!isBlocked}
                          size="sm"
                        />
                      </td>
                      <td className="px-3 py-2 capitalize text-slate-300">
                        <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          {asset.physical_condition.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-slate-400">
                        {asset.department}
                      </td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/assets?selected=${asset.asset_id}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                        >
                          <span>Assess</span>
                          <ArrowRight size={11} />
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

      {/* 7. Quick Platform Modules */}
      <section aria-labelledby="quick-actions" className="rounded-lg border border-slate-800 bg-[#0c111d] p-4">
        <h3 id="quick-actions" className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
          Platform Decision Navigation
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => navigate('/assets')}
            className="flex items-center justify-between p-2.5 rounded-md border border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:border-slate-700 text-left transition"
          >
            <div>
              <span className="text-xs font-medium text-white block">Asset Intelligence</span>
              <span className="text-[10px] text-slate-400">Deep technical profiling</span>
            </div>
            <Cpu size={14} className="text-slate-400 shrink-0 ml-2" />
          </button>

          <button
            onClick={() => navigate('/scenarios')}
            className="flex items-center justify-between p-2.5 rounded-md border border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:border-slate-700 text-left transition"
          >
            <div>
              <span className="text-xs font-medium text-white block">Scenario Lab</span>
              <span className="text-[10px] text-slate-400">Multi-objective trade-offs</span>
            </div>
            <SlidersHorizontal size={14} className="text-slate-400 shrink-0 ml-2" />
          </button>

          <button
            onClick={() => navigate('/approvals')}
            className="flex items-center justify-between p-2.5 rounded-md border border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:border-slate-700 text-left transition"
          >
            <div>
              <span className="text-xs font-medium text-white block">Approval Center</span>
              <span className="text-[10px] text-slate-400">Authorize dispositions</span>
            </div>
            <CheckCircle2 size={14} className="text-slate-400 shrink-0 ml-2" />
          </button>

          <button
            onClick={() => navigate('/impact')}
            className="flex items-center justify-between p-2.5 rounded-md border border-slate-800 bg-slate-900/40 hover:bg-slate-800 hover:border-slate-700 text-left transition"
          >
            <div>
              <span className="text-xs font-medium text-white block">Impact Center</span>
              <span className="text-[10px] text-slate-400">SDG 12 sustainability audit</span>
            </div>
            <Leaf size={14} className="text-slate-400 shrink-0 ml-2" />
          </button>
        </div>
      </section>

      {/* Asset Intake & Registration Modal */}
      <AssetIntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['assets'] });
          queryClient.invalidateQueries({ queryKey: ['impact-summary'] });
        }}
      />
    </div>
  );
};
