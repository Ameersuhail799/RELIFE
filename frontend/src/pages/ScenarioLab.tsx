import React from 'react';
import { FlaskConical } from 'lucide-react';

export const ScenarioLab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FlaskConical className="text-emerald-400" size={22} />
            Circular Scenario Lab
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Simulate and contrast eligible pathways under multi-attribute institutional decision objectives.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6">
        <p className="text-sm text-slate-300">
          Scenario Lab interactive decision comparison initializing for Phase C.
        </p>
      </div>
    </div>
  );
};
