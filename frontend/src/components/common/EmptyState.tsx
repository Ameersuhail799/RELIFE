import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'There are no records matching the current selection.',
  actionLabel,
  onAction,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-10 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 mb-3">
        {icon || <Inbox size={22} />}
      </div>
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-400">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-500"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
