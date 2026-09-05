import React from 'react';
import { Cpu } from 'lucide-react';
import { SecurityGateBadge } from '../components/common/SecurityGateBadge';

export const AssetIntelligence: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Cpu className="text-emerald-400" size={22} />
            Asset Intelligence & Decision Assessment
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Deep-dive technical capability evaluation, NIST SP 800-88 Rev. 2 gate audit, and explainable AI recommendations.
          </p>
        </div>
        <SecurityGateBadge status="CLEARED" directReusePermitted={true} />
      </div>

      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-6">
        <p className="text-sm text-slate-300">
          Asset Intelligence flagship workflow view initializing for Phase B.
        </p>
      </div>
    </div>
  );
};
