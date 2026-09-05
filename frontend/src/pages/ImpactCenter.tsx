import React from 'react';
import { Leaf } from 'lucide-react';
import { EstimateBadge } from '../components/common/EstimateBadge';

export const ImpactCenter: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Leaf className="text-emerald-400" size={22} />
            SDG 12 Circular Impact Center
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Responsible consumption & production analytics, avoided embodied carbon, and e-waste diversion accounting.
          </p>
        </div>
        <EstimateBadge label="ESTIMATE ONLY" />
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6">
        <p className="text-sm text-slate-300">
          Impact Center portfolio sustainability intelligence view initializing for Phase D.
        </p>
      </div>
    </div>
  );
};
