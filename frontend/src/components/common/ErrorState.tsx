import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while communicating with the ReLife backend.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-rose-900/40 bg-rose-950/20 p-8 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-900/30 text-rose-400 mb-3">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-base font-semibold text-slate-100">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-400">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
        >
          <RefreshCw size={14} />
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
};
