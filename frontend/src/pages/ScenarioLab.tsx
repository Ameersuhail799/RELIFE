import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FlaskConical,
  Scale,
  Leaf,
  DollarSign,
  Cpu,
  ArrowUpDown,
  CheckCircle2,
  ShieldAlert,
  ShieldX,
  Sparkles,
  Layers,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';
import { SecurityGateBadge } from '../components/common/SecurityGateBadge';
import { EstimateBadge } from '../components/common/EstimateBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import type { DecisionObjective, CircularPathway, ScenarioItem } from '../types/api';

const OBJECTIVES: Array<{
  id: DecisionObjective;
  label: string;
  desc: string;
  icon: React.ElementType;
  badgeColor: string;
  accentBorder: string;
}> = [
  {
    id: 'BALANCED',
    label: 'Balanced',
    desc: 'Harmonizes economic viability, technical capability, and environmental impact equally.',
    icon: Scale,
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    accentBorder: 'border-indigo-500/40',
  },
  {
    id: 'SUSTAINABILITY_FIRST',
    label: 'Sustainability First',
    desc: 'Maximizes embodied carbon preservation (CO₂e avoided) and maximum useful life extension.',
    icon: Leaf,
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    accentBorder: 'border-emerald-500/40',
  },
  {
    id: 'COST_FIRST',
    label: 'Cost First',
    desc: 'Prioritizes minimal direct repair outlay and maximizes net residual salvage recovery.',
    icon: DollarSign,
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    accentBorder: 'border-amber-500/40',
  },
  {
    id: 'UTILIZATION_FIRST',
    label: 'Utilization First',
    desc: 'Favors immediate redeployment to fill pending institutional laboratory and departmental demands.',
    icon: Cpu,
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    accentBorder: 'border-sky-500/40',
  },
];

const ALL_POSSIBLE_PATHWAYS: Array<{
  id: CircularPathway;
  label: string;
  description: string;
}> = [
  { id: 'DIRECT_REUSE', label: 'Direct Reuse', description: 'Redeploy immediately without hardware modification or component servicing.' },
  { id: 'REPAIR', label: 'Repair & Restore', description: 'Replace failing subcomponents (battery, keyboard, drive) to restore full utility.' },
  { id: 'REFURBISH', label: 'Institutional Refurbish', description: 'Thorough overhaul, cosmetic restoration, and internal memory/storage expansion.' },
  { id: 'REPURPOSE', label: 'Secondary Repurpose', description: 'Downcycle into dedicated low-overhead workload (Linux lab node, kiosk, gateway).' },
  { id: 'COMPONENT_RECOVERY', label: 'Component Harvesting', description: 'Extract salvageable RAM, SSD, wireless cards, and power supplies for spares inventory.' },
  { id: 'RECYCLE', label: 'Certified E-Waste Recycling', description: 'Decommission with verified R2/e-Stewards compliant material shredding and recovery.' },
];

export const ScenarioLab: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const selectedParam = searchParams.get('selected');
  const [selectedAssetId, setSelectedAssetId] = useState<string>(selectedParam || '');
  const [objective, setObjective] = useState<DecisionObjective>('BALANCED');

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

  // Determine blocked pathways (all pathways not in eligible_pathways)
  const eligibleSet = new Set(evaluation?.eligible_pathways || []);
  const blockedPathways = ALL_POSSIBLE_PATHWAYS.filter((p) => !eligibleSet.has(p.id));

  // Determine trade-off explanation text based on objective
  const getObjectiveRationale = (obj: DecisionObjective) => {
    switch (obj) {
      case 'SUSTAINABILITY_FIRST':
        return {
          gain: 'Maximized operational longevity and highest CO₂e embodied emissions avoided through lifecycle extension.',
          sacrifice: 'Higher upfront repair or refurbishment expenditure accepted over immediate low-cost liquidation.',
          explanation:
            'Sustainability weighting elevates pathways that retain manufactured components in active institutional use the longest. Direct reuse and component-level refurbishing rank higher than scrap recycling.',
        };
      case 'COST_FIRST':
        return {
          gain: 'Lowest out-of-pocket servicing expenditure, immediate cost containment, and maximal cash salvage value.',
          sacrifice: 'Accepts shorter useful life extensions and foregoes circular value retention where component replacement cost exceeds economic threshold.',
          explanation:
            'Cost optimization enforces strict capital conservation. Pathways requiring minor outlays (or yielding high salvage/repurpose utility) ascend above intensive overhauls.',
        };
      case 'UTILIZATION_FIRST':
        return {
          gain: 'Rapid redeployment into verified campus laboratories, coding workstations, and active administrative requests.',
          sacrifice: 'May prioritize secondary repurpose or quick internal transfer even if external resale value was theoretically higher.',
          explanation:
            'Utilization prioritizing aligns hardware capabilities against immediate active institutional demands, promoting pathways that eliminate external procurement lag.',
        };
      case 'BALANCED':
      default:
        return {
          gain: 'Equitable equilibrium balancing repair budget, carbon preservation, and institutional department compatibility.',
          sacrifice: 'Does not maximize any single attribute at the expense of fiscal prudence or regulatory compliance.',
          explanation:
            'Standard multi-objective scoring synthesizes technical condition, sanitization gate compliance, residual value recovery, and life-cycle extension into a consensus score.',
        };
    }
  };

  const rationale = getObjectiveRationale(objective);
  const currentObjConfig = OBJECTIVES.find((o) => o.id === objective) || OBJECTIVES[0];

  return (
    <div className="space-y-6">
      {/* 1. Header & Asset Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <FlaskConical className="text-emerald-400" size={22} />
              Circular Scenario Lab
            </h2>
            <EstimateBadge />
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              [SIMULATED DATASET]
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Simulate and contrast eligible pathways under multi-attribute institutional decision objectives.
          </p>
        </div>

        {/* Asset Selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="asset-select" className="text-xs font-medium text-slate-400 whitespace-nowrap">
            Evaluated Asset:
          </label>
          <select
            id="asset-select"
            value={selectedAssetId}
            onChange={(e) => handleSelectAsset(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            {assets.map((a) => (
              <option key={a.asset_id} value={a.asset_id}>
                {a.asset_id} — {a.manufacturer} {a.model} ({a.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Active Asset Context Header */}
      {asset && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700">
              <Cpu size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-emerald-400 font-semibold">{asset.asset_id}</span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-sm font-medium text-white">
                  {asset.manufacturer} {asset.model}
                </span>
                <span className="text-xs text-slate-400 font-mono">({asset.purchase_year})</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {asset.cpu_model} • {asset.ram_gb}GB RAM • {asset.storage_gb}GB {asset.storage_type} • Condition: {asset.physical_condition.replace('_', ' ')} • Status: {asset.functional_status.replace('_', ' ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {(() => {
              const isBlocked = asset.storage_present && !asset.sanitization_verified;
              return (
                <SecurityGateBadge
                  status={isBlocked ? 'BLOCKED' : 'CLEARED'}
                  directReusePermitted={!isBlocked}
                  reasons={isBlocked ? ['Unverified physical drive - pending technician wipe audit'] : []}
                />
              );
            })()}
          </div>
        </div>
      )}

      {/* 3. Decision Objective Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Institutional Decision Objective
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Re-ranking powered by ReLife Multi-Attribute Engine
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {OBJECTIVES.map((obj) => {
            const Icon = obj.icon;
            const isSelected = objective === obj.id;
            return (
              <button
                key={obj.id}
                onClick={() => setObjective(obj.id)}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? `bg-slate-800/90 ${obj.accentBorder} shadow-lg shadow-black/40 ring-1 ring-emerald-500/20`
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1.5">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-md ${
                        isSelected ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {obj.label}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400 mt-1">
                  {obj.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. "Why did the ranking change?" Dynamic Insight Callout */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-800/40 border border-slate-700/70 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
            <Sparkles size={18} />
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                  Objective Trade-off Analysis
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-white font-medium">
                  {currentObjConfig.label} Strategy Rationale
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Top Recommendation: <strong className="text-emerald-300">{evaluation?.recommended_pathway.replace('_', ' ')}</strong>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {evaluation?.tradeoffs || rationale.explanation}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
              <div className="flex items-start gap-2 bg-slate-950/40 border border-emerald-500/20 rounded-lg p-3">
                <TrendingUp size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                    What Was Gained
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {rationale.gain}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-950/40 border border-amber-500/20 rounded-lg p-3">
                <Scale size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
                    What Was Sacrificed (Trade-Off)
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {rationale.sacrifice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Scenario Comparison Cards (Eligible Pathways Only) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Eligible Pathway Scenarios (Ranked #{1} to #{evaluation?.scenario_comparison?.length || 0})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Showing <strong className="text-emerald-400">{evaluation?.scenario_comparison?.length || 0}</strong> strictly eligible pathways
          </span>
        </div>

        {isEvaluationLoading ? (
          <div className="p-12 text-center text-slate-400">
            <LoadingSkeleton variant="card" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {evaluation?.scenario_comparison?.map((scenario: ScenarioItem, index: number) => {
              const isRecommended = index === 0 || scenario.is_recommended;
              return (
                <div
                  key={scenario.pathway}
                  className={`rounded-xl border transition-all duration-200 relative flex flex-col justify-between overflow-hidden ${
                    isRecommended
                      ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Header Strip */}
                  <div
                    className={`px-4 py-3 border-b flex items-center justify-between ${
                      isRecommended
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-slate-800/40 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isRecommended
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        RANK #{scenario.rank || index + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white tracking-wide">
                        {scenario.pathway.replace(/_/g, ' ')}
                      </h4>
                    </div>

                    {isRecommended ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 size={12} />
                        RECOMMENDED
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 font-mono">
                        Alternative
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-4">
                    {/* Suitability Score & Destination */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Suitability Score
                        </span>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                          <span
                            className={`text-2xl font-black font-mono ${
                              isRecommended ? 'text-emerald-400' : 'text-slate-200'
                            }`}
                          >
                            {scenario.suitability_score.toFixed(1)}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">/ 100</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Destination Action
                        </span>
                        <div className="text-xs font-medium text-slate-200 mt-1 font-mono">
                          {scenario.destination_action?.replace(/_/g, ' ') || 'REDEPLOY_INTERNAL'}
                        </div>
                      </div>
                    </div>

                    {/* Financial & Environmental Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                      <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">
                          Direct Cost
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-white font-mono mt-1">
                          {scenario.deterministic_cost !== undefined
                            ? `₹${scenario.deterministic_cost.toLocaleString()}`
                            : '₹0'}
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">
                          Residual Value
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-emerald-400 font-mono mt-1">
                          {scenario.estimated_residual_value !== undefined
                            ? `₹${scenario.estimated_residual_value.toLocaleString()}`
                            : '—'}
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">
                          Life Extension
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-sky-400 font-mono mt-1">
                          +{scenario.useful_life_extension_years || 1.5} yrs
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">
                          Avoided CO₂e
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-emerald-400 font-mono mt-1">
                          ~{scenario.estimated_co2e_avoided_kg || 45} kg
                        </div>
                      </div>
                    </div>

                    {/* Demand Compatibility & Role Fit */}
                    <div className="bg-slate-950/40 rounded-lg p-3 border border-slate-800/60 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Demand Compatibility:</span>
                        <span className="font-mono text-slate-200 text-[11px]">
                          {scenario.demand_match || 'Internal Institutional Laboratory'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 leading-relaxed pt-1">
                        <strong>Trade-off: </strong>
                        {scenario.trade_offs ||
                          'Balancing upfront parts replacement vs extended departmental service life.'}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 pt-0">
                    <button
                      onClick={() =>
                        navigate(`/asset-intelligence?selected=${selectedAssetId}`)
                      }
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 ${
                        isRecommended
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {isRecommended ? 'Inspect in Asset Intelligence' : 'Review Scenario Details'}
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Regulatory Exclusions & Security-Blocked Pathways */}
      {blockedPathways.length > 0 && (
        <div className="rounded-xl border border-rose-900/30 bg-rose-950/10 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0 mt-0.5">
              <ShieldX size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-300 tracking-wide">
                Regulatory Exclusions & Security Gate Disqualifications
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Under ReLife Zero-Trust and NIST SP 800-88 Rev. 2 guidelines, these pathways are strictly prohibited by deterministic safety checks and cannot be selected.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {blockedPathways.map((blocked) => {
              const isSecurityBlocked =
                blocked.id === 'DIRECT_REUSE' &&
                asset &&
                asset.storage_present &&
                !asset.sanitization_verified;

              return (
                <div
                  key={blocked.id}
                  className="bg-slate-900/60 border border-rose-900/40 rounded-lg p-3.5 flex flex-col justify-between space-y-2 opacity-80"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">
                      {blocked.label}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/40 text-rose-300 border border-rose-700/50">
                      DISQUALIFIED
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {isSecurityBlocked
                      ? 'Blocked by NIST SP 800-88 Rev. 2 Security Gate: Active physical storage present without certified sanitization.'
                      : `${blocked.description} Ineligible due to hardware functional grading or component requirements.`}
                  </p>

                  <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <ShieldAlert size={12} className="text-rose-400" />
                    Cannot be recommended until gate conditions are resolved.
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

