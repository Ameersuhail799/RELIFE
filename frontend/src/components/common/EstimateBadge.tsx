import React from 'react';
import { Info } from 'lucide-react';

interface EstimateBadgeProps {
  label?: string;
  source?: string;
  className?: string;
}

export const EstimateBadge: React.FC<EstimateBadgeProps> = ({
  label = 'ESTIMATE ONLY',
  source = 'Provisional prototype calculation based on literature LCA factors (e.g. Fraunhofer IZM / Ecoinvent 3.8). Not measured carbon accounts.',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border border-slate-700/60 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-slate-400 uppercase ${className}`}
      title={source}
    >
      <Info size={10} className="text-slate-400 shrink-0" />
      <span>{label}</span>
    </span>
  );
};
