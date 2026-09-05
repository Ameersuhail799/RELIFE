import React from 'react';
import { FileText } from 'lucide-react';

export const CircularPassport: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="text-emerald-400" size={22} />
            Circular IT Asset Passport
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Immutable chain-of-custody, sanitization certifications, and disposition decision audit trail.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6">
        <p className="text-sm text-slate-300">
          Circular Passport interactive timeline ledger initializing for Phase D.
        </p>
      </div>
    </div>
  );
};
