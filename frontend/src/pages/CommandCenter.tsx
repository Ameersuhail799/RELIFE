import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { EstimateBadge } from '../components/common/EstimateBadge';

export const CommandCenter: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-2 flex-wrap">
            <LayoutDashboard className="text-emerald-400 shrink-0" size={20} />
            <span>Institutional IT Portfolio Command Center</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time circular asset allocation, lifecycle progress, and environmental avoidance metrics.
          </p>
        </div>
        <EstimateBadge label="ESTIMATE ONLY" />
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6">
        <p className="text-sm text-slate-300">
          Command Center metrics and portfolio analytics view initializing for Phase B.
        </p>
      </div>
    </div>
  );
};
