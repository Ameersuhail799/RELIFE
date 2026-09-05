import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Leaf,
  DollarSign,
  Trash2,
  Clock,
  Layers,
  BookOpen,
  Scale,
  Info,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import { EstimateBadge } from '../components/common/EstimateBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import type { ImpactSummaryResponse } from '../types/api';

export const ImpactCenter: React.FC = () => {
  const queryClient = useQueryClient();
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  // 1. Fetch Impact Summary
  const {
    data: impact,
    isLoading,
    error,
  } = useQuery<ImpactSummaryResponse>({
    queryKey: ['impact'],
    queryFn: () => api.getImpactSummary(),
    staleTime: 30_000,
  });

  if (isLoading) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  if (error || !impact) {
    return (
      <ErrorState
        title="Failed to Load Sustainability Analytics"
        message="Could not retrieve portfolio circular impact data from the reporting engine."
        onRetry={() => queryClient.invalidateQueries({ queryKey: ['impact'] })}
      />
    );
  }

  const pb = impact.pathway_breakdown || {
    direct_reuse: 0,
    repair: 0,
    refurbish: 0,
    repurpose: 0,
    component_recovery: 0,
    recycle: 0,
  };

  const totalAssessed = impact.total_assets_assessed || 1;
  const directReusePct = Math.round((pb.direct_reuse / totalAssessed) * 100);
  const repairPct = Math.round((pb.repair / totalAssessed) * 100);
  const refurbishPct = Math.round((pb.refurbish / totalAssessed) * 100);
  const repurposePct = Math.round((pb.repurpose / totalAssessed) * 100);
  const componentPct = Math.round((pb.component_recovery / totalAssessed) * 100);
  const recyclePct = Math.round((pb.recycle / totalAssessed) * 100);

  const circularCount =
    pb.direct_reuse + pb.repair + pb.refurbish + pb.repurpose + pb.component_recovery;
  const circularRatePct = Math.round((circularCount / totalAssessed) * 100);

  return (
    <div className="space-y-6">
      {/* 1. Header & Methodology Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Leaf className="text-emerald-400" size={22} />
              SDG 12 Circular Impact Center
            </h2>
            <EstimateBadge />
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              [SIMULATED DATASET]
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Responsible consumption & production analytics, avoided embodied carbon, and e-waste diversion accounting.
          </p>
        </div>

        <button
          onClick={() => setMethodologyOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <BookOpen size={14} className="text-emerald-400" />
          <span>Methodology & Assumptions</span>
        </button>
      </div>

      {/* 2. Top Executive Sustainability KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Capital Saved */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Procurement Capital Saved
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              ₹{(impact.total_estimated_purchase_cost_avoided || 0).toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Avoided institutional procurement costs through second-life redeployment and component harvesting.
          </p>
        </div>

        {/* Card 2: CO2e Avoided */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Avoided Embodied Carbon
              </span>
              <EstimateBadge />
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Leaf size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              ~{(impact.total_estimated_co2e_avoided_kg || 0).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-mono">kg CO₂e</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Preserved manufacturing emissions by deferring replacement hardware manufacturing cycles.
          </p>
        </div>

        {/* Card 3: E-Waste Diverted */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                E-Waste Diverted
              </span>
              <EstimateBadge />
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Trash2 size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">
              ~{(impact.total_estimated_ewaste_diverted_kg || 0).toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-mono">kg</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Hazardous electronic materials and functional components kept out of municipal landfills.
          </p>
        </div>

        {/* Card 4: Life Extension */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Useful Life Extended
              </span>
              <EstimateBadge />
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Clock size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              +{(impact.total_estimated_useful_life_extension_years || 0).toFixed(1)}
            </span>
            <span className="text-xs text-slate-400 font-mono">Years</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Aggregated operational longevity restored to university IT computing inventory.
          </p>
        </div>
      </div>

      {/* 3. Portfolio Lifecycle Funnel & Circular Eligibility */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Layers size={16} className="text-emerald-400" />
              Portfolio Circular Eligibility Funnel
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Stage progression from initial intake registration to verified circular retention.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            {circularRatePct}% Circular Retention Rate
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-slate-400 text-xs font-medium block">1. Total Registered Fleet</span>
            <span className="text-2xl font-bold text-white font-mono">{impact.total_assets_registered}</span>
            <p className="text-[11px] text-slate-500">Decommissioned devices ingested in platform.</p>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-slate-400 text-xs font-medium block">2. Capability & Security Assessed</span>
            <span className="text-2xl font-bold text-sky-400 font-mono">{impact.total_assets_assessed}</span>
            <p className="text-[11px] text-slate-500">Profiled through security gate & technical heuristics.</p>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-emerald-500/30 bg-emerald-950/10 space-y-1">
            <span className="text-emerald-300 text-xs font-medium block">3. Circularly Retained (Eligible)</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono">{impact.total_assets_eligible_circular}</span>
            <p className="text-[11px] text-emerald-400/80">Saved from immediate downcycling or premature disposal.</p>
          </div>
        </div>
      </div>

      {/* 4. Pathway Allocation Breakdown */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Scale size={16} className="text-emerald-400" />
              Circular Pathway Allocation Distribution
            </h3>
            <span className="text-xs text-slate-400">
              {impact.total_assets_assessed} evaluated dispositions
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Portfolio distribution across ReLife standardized circular IT pathways.
          </p>
        </div>

        {/* Visual Multi-Segment Distribution Bar */}
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
          <div style={{ width: `${directReusePct}%` }} className="bg-emerald-500" title={`Direct Reuse: ${pb.direct_reuse}`} />
          <div style={{ width: `${repairPct}%` }} className="bg-sky-500" title={`Repair: ${pb.repair}`} />
          <div style={{ width: `${refurbishPct}%` }} className="bg-indigo-500" title={`Refurbish: ${pb.refurbish}`} />
          <div style={{ width: `${repurposePct}%` }} className="bg-purple-500" title={`Repurpose: ${pb.repurpose}`} />
          <div style={{ width: `${componentPct}%` }} className="bg-amber-500" title={`Component Recovery: ${pb.component_recovery}`} />
          <div style={{ width: `${recyclePct}%` }} className="bg-rose-500" title={`Recycle: ${pb.recycle}`} />
        </div>

        {/* Cards Grid for all 6 pathways */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Direct Reuse */}
          <div className="p-3.5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-white">Direct Reuse</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">{pb.direct_reuse} units</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Zero servicing outlay; immediate redeployment to active staff or laboratory stations.
            </p>
          </div>

          {/* Repair */}
          <div className="p-3.5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-500"></span>
                <span className="text-xs font-bold text-white">Repair & Restore</span>
              </div>
              <span className="text-xs font-mono font-bold text-sky-400">{pb.repair} units</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Targeted battery, keyboard, or drive servicing restoring full primary workstation utility.
            </p>
          </div>

          {/* Refurbish */}
          <div className="p-3.5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-xs font-bold text-white">Institutional Refurbish</span>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-400">{pb.refurbish} units</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Deep overhaul, cosmetic restoration, and internal memory/storage expansion.
            </p>
          </div>

          {/* Repurpose */}
          <div className="p-3.5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span>
                <span className="text-xs font-bold text-white">Secondary Repurpose</span>
              </div>
              <span className="text-xs font-mono font-bold text-purple-400">{pb.repurpose} units</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Re-allocated into lightweight infrastructure (Linux node, IoT gateway, public catalog kiosk).
            </p>
          </div>

          {/* Component Recovery */}
          <div className="p-3.5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                <span className="text-xs font-bold text-white">Component Harvesting</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">{pb.component_recovery} units</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Extraction of modular RAM, SSDs, screens, and power supplies for internal spares inventory.
            </p>
          </div>

          {/* Recycle */}
          <div className="p-3.5 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                <span className="text-xs font-bold text-white">Certified Recycling</span>
              </div>
              <span className="text-xs font-mono font-bold text-rose-400">{pb.recycle} units</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Final disposition with R2/e-Stewards compliant material shredding and critical mineral extraction.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Methodology & Assumptions Slide-over Drawer / Modal */}
      {methodologyOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMethodologyOpen(false)}
          />

          <div className="relative z-50 w-full max-w-lg bg-[#0c111d] border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-900/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Methodology & LCA Assumptions
                  </h3>
                  <p className="text-xs text-slate-400">
                    Version: {impact.assumptions_version || 'v1.0.0-provisional'} • Confidence: {impact.confidence || 'PROVISIONAL'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMethodologyOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close methodology panel"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-300">
              {/* Mandatory Estimate Disclaimer */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <Info size={16} />
                  <span>Mandatory Disclosure Notice</span>
                </div>
                <p className="text-xs text-amber-200/90 leading-relaxed font-mono">
                  {impact.disclaimer ||
                    'ESTIMATE ONLY: Aggregated from provisional lifecycle assessment (LCA) assumptions and not from verified on-site carbon accounting.'}
                </p>
                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                  These calculations represent engineering model estimates derived from peer-reviewed LCA literature. They must never be treated as certified carbon credits or audited financial figures.
                </p>
              </div>

              {/* LCA Coefficients & Factors */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Standard Lifecycle Assessment (LCA) Coefficients
                </h4>

                <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 space-y-2 text-xs">
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Laptop Embodied Carbon:</span>
                    <span className="font-mono text-white font-bold">~250.0 kg CO₂e / unit</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Desktop Workstation Embodied:</span>
                    <span className="font-mono text-white font-bold">~350.0 kg CO₂e / unit</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Enterprise Server Node Embodied:</span>
                    <span className="font-mono text-white font-bold">~800.0 kg CO₂e / unit</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-slate-400">Average Laptop Mass (E-Waste):</span>
                    <span className="font-mono text-white font-bold">~2.1 kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Average Desktop Mass (E-Waste):</span>
                    <span className="font-mono text-white font-bold">~8.5 kg</span>
                  </div>
                </div>
              </div>

              {/* Authoritative Sources Cited */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Primary Data Sources & References
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-900/40 rounded border border-slate-800 space-y-0.5">
                    <span className="font-semibold text-white block">Fraunhofer IZM (2021)</span>
                    <p className="text-[11px] text-slate-400">
                      Study on the impact of circular economy approaches on the carbon footprint of electronic devices.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded border border-slate-800 space-y-0.5">
                    <span className="font-semibold text-white block">Ecoinvent 3.8 Database</span>
                    <p className="text-[11px] text-slate-400">
                      Life cycle inventories for consumer electronics and semiconductor fabrication emissions.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded border border-slate-800 space-y-0.5">
                    <span className="font-semibold text-white block">EPA WARM v15</span>
                    <p className="text-[11px] text-slate-400">
                      Waste Reduction Model for electronics management and material recovery carbon offsets.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/40 text-[11px] text-slate-400 flex items-center justify-between">
              <span>LCA Model v1.0</span>
              <button
                onClick={() => setMethodologyOpen(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
