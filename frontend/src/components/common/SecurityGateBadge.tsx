import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface SecurityGateBadgeProps {
  status: 'CLEARED' | 'WARNING' | 'BLOCKED';
  directReusePermitted?: boolean;
  reasons?: string[];
  warnings?: string[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SecurityGateBadge: React.FC<SecurityGateBadgeProps> = ({
  status,
  directReusePermitted = false,
  reasons = [],
  warnings = [],
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  if (status === 'CLEARED' && directReusePermitted) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 ${sizeClasses[size]} ${className}`}
        title="Security Gate: Cleared. Storage wiped and verified according to NIST SP 800-88 Rev. 2."
      >
        <ShieldCheck size={iconSizes[size]} className="text-emerald-400 shrink-0" />
        <span>GATE: CLEARED</span>
      </div>
    );
  }

  if (status === 'WARNING' || (status === 'CLEARED' && !directReusePermitted)) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-950/40 text-amber-400 ${sizeClasses[size]} ${className}`}
        title={warnings.length > 0 ? warnings.join('; ') : 'Storage unverified: Reuse restricted to internal non-sensitive or physical repair.'}
      >
        <ShieldAlert size={iconSizes[size]} className="text-amber-400 shrink-0" />
        <span>GATE: WARNING</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-md border border-rose-500/40 bg-rose-950/50 text-rose-400 ${sizeClasses[size]} ${className}`}
      title={reasons.length > 0 ? reasons.join('; ') : 'MANDATORY GATE: Storage unverified. Direct reuse/donation strictly blocked.'}
    >
      <ShieldX size={iconSizes[size]} className="text-rose-400 shrink-0" />
      <span>GATE: BLOCKED</span>
    </div>
  );
};
