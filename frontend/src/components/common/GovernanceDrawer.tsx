import React from 'react';
import {
  ShieldCheck,
  UserCheck,
  Scale,
  Eye,
  Lock,
  HeartHandshake,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';

interface GovernanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GovernanceDrawer: React.FC<GovernanceDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative z-50 w-full max-w-lg bg-[#0c111d] border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Responsible AI & Governance Charter
              </h3>
              <p className="text-xs text-slate-400">
                Ethical safeguards, zero-trust security & human oversight
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close governance panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300">
          {/* Core Axiom Banner */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <Sparkles size={14} />
              ReLife Governance Axiom
            </div>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">1. Intelligence</span>
                <span className="text-xs font-bold text-emerald-400">AI RECOMMENDS</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">2. Gatekeeper</span>
                <span className="text-xs font-bold text-sky-400">RULES ENFORCE</span>
              </div>
              <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">3. Authority</span>
                <span className="text-xs font-bold text-indigo-400">HUMANS APPROVE</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              AI models generate candidate recommendations and explainable trade-offs, deterministic security gates strictly enforce regulatory boundaries, and verified human officers hold non-delegable sign-off authority.
            </p>
          </div>

          {/* Pillars List */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Institutional Governance Pillars
            </h4>

            {/* 1. Human Oversight */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <UserCheck size={16} className="text-emerald-400" />
                <span>Non-Autonomous Human-in-the-Loop Oversight</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                No circular disposition, asset destruction, or external donation can occur autonomously. Every pathway recommendation requires explicit human authorization recorded in the immutable passport audit ledger.
              </p>
            </div>

            {/* 2. Zero-Trust Security */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Lock size={16} className="text-rose-400" />
                <span>Deterministic Data Sanitization (NIST SP 800-88 Rev. 2)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Software intelligence and human discretion are strictly subordinate to hardware security gates. If an active storage drive is unverified, direct redeployment or donation is rejected with an HTTP 403 security violation.
              </p>
            </div>

            {/* 3. Transparency & RAG Explainability */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Eye size={16} className="text-sky-400" />
                <span>Explainability & Source Traceability (RAG)</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every AI suggestion is accompanied by explicit decision factors, mathematical trade-offs, and citations from authoritative sources (NIST, IEEE, EPA, European Commission WEEE, Fraunhofer IZM).
              </p>
            </div>

            {/* 4. Fairness & Objective Resource Allocation */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Scale size={16} className="text-amber-400" />
                <span>Equitable & Objective Demand Matching</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Demands from university departments and research laboratories are matched based on validated multi-attribute technical capabilities and priority rankings, eliminating informal rationing.
              </p>
            </div>

            {/* 5. Uncertainty & Honest Estimation */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <AlertCircle size={16} className="text-indigo-400" />
                <span>Honest Disclosure of Estimates</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Embodied carbon and e-waste numbers are explicitly labeled with <strong className="text-slate-300 font-mono text-[10px] bg-slate-800 px-1 py-0.5 rounded">ESTIMATE ONLY</strong> and documented as prototype estimates based on literature LCA factors, never misrepresenting model calculations as measured revenue or billing metrics.
              </p>
            </div>

            {/* 6. Sustainability Ethics (UN SDG 12) */}
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <HeartHandshake size={16} className="text-emerald-400" />
                <span>UN SDG 12 Alignment</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                ReLife is engineered to accelerate United Nations Sustainable Development Goal 12: Ensure sustainable consumption and production patterns by keeping manufactured electronics in active service.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/40 text-[11px] text-slate-400 flex items-center justify-between">
          <span>ReLife Governance Framework v1.0</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
