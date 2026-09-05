import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const ApprovalCenter: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <CheckCircle2 className="text-emerald-400" size={22} />
            Human-in-the-Loop Approval Center
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Review, validate, or override AI recommendations with non-bypassable security gate constraints.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6">
        <p className="text-sm text-slate-300">
          Approval Center review and override queue initializing for Phase D.
        </p>
      </div>
    </div>
  );
};
