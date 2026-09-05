import React from 'react';
import { Database } from 'lucide-react';

interface SimulatedBannerProps {
  className?: string;
}

export const SimulatedBanner: React.FC<SimulatedBannerProps> = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-950/40 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-medium text-sky-400 shrink-0 ${className}`}
      title="Data is sourced from the simulated institutional university IT hardware dataset for testing and portfolio demonstration."
    >
      <Database size={11} className="text-sky-400 shrink-0" />
      <span className="hidden sm:inline tracking-wide">SIMULATED DATASET</span>
      <span className="sm:hidden tracking-wide text-[10px]">SIMULATED</span>
    </div>
  );
};

