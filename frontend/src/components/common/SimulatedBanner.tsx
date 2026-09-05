import React from 'react';
import { Database } from 'lucide-react';

interface SimulatedBannerProps {
  className?: string;
}

export const SimulatedBanner: React.FC<SimulatedBannerProps> = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-950/40 px-2.5 py-0.5 text-xs font-medium text-sky-400 ${className}`}
      title="Data is sourced from the simulated institutional university IT hardware dataset for testing and portfolio demonstration."
    >
      <Database size={12} className="text-sky-400 shrink-0" />
      <span className="tracking-wide">SIMULATED DATASET</span>
    </div>
  );
};
