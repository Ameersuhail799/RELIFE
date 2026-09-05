import React from 'react';

export interface LoadingSkeletonProps {
  className?: string;
  variant?: 'dashboard' | 'card' | 'table' | 'default';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = 'h-6 w-full',
  variant = 'default',
}) => {
  if (variant === 'dashboard') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 bg-slate-800/40 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 bg-slate-800/40 rounded-xl" />
          <div className="h-28 bg-slate-800/40 rounded-xl" />
          <div className="h-28 bg-slate-800/40 rounded-xl" />
          <div className="h-28 bg-slate-800/40 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-64 bg-slate-800/40 rounded-xl" />
          <div className="h-64 bg-slate-800/40 rounded-xl" />
        </div>
        <div className="h-72 bg-slate-800/40 rounded-xl" />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-4 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-800 rounded w-1/3" />
          <div className="h-5 bg-slate-800 rounded w-20" />
        </div>
        <div className="h-10 bg-slate-800 rounded w-1/2" />
        <div className="space-y-2 pt-2">
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-5/6" />
        </div>
      </div>
    );
  }

  return <div className={`animate-pulse rounded bg-slate-800/60 ${className}`} />;
};

export const CardSkeleton: React.FC = () => {
  return <LoadingSkeleton variant="card" />;
};
