import React from 'react';

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className = 'h-6 w-full' }) => {
  return <div className={`animate-pulse rounded bg-slate-800/60 ${className}`} />;
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-4">
      <div className="flex justify-between items-center">
        <LoadingSkeleton className="h-5 w-1/3" />
        <LoadingSkeleton className="h-5 w-20" />
      </div>
      <LoadingSkeleton className="h-10 w-1/2" />
      <div className="space-y-2 pt-2">
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
};
