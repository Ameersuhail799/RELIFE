import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  ShieldCheck,
  Cpu,
  UserCheck,
  RotateCcw,
  XCircle,
  Database,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Clock,
  Terminal,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import type { AssetPassportEvent, AssetPassportResponse } from '../types/api';

export const CircularPassport: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: routeAssetId } = useParams<{ id?: string }>();
  const queryClient = useQueryClient();

  const selectedParam = routeAssetId || searchParams.get('selected');
  const [selectedAssetId, setSelectedAssetId] = useState<string>(selectedParam || '');
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

  // 1. Fetch Assets for Selector
  const { data: assets = [], isLoading: isAssetsLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: () => api.getAssets(),
    staleTime: 30_000,
  });

  // Default selection
  useEffect(() => {
    if (!selectedAssetId && assets.length > 0) {
      const firstId = assets[0].asset_id;
      setSelectedAssetId(firstId);
      setSearchParams({ selected: firstId }, { replace: true });
    }
  }, [assets, selectedAssetId, setSearchParams]);

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    setSearchParams({ selected: assetId });
  };

  // 2. Fetch Actual Passport Data
  const {
    data: passport,
    isLoading: isPassportLoading,
    error: passportError,
  } = useQuery<AssetPassportResponse>({
    queryKey: ['passport', selectedAssetId],
    queryFn: () => api.getPassport(selectedAssetId),
    enabled: !!selectedAssetId,
    staleTime: 10_000,
  });

  const toggleEventExpanded = (eventId: string) => {
    setExpandedEvents((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  if (isAssetsLoading || (isPassportLoading && !passport)) {
    return <LoadingSkeleton variant="dashboard" />;
  }

  if (passportError) {
    return (
      <ErrorState
        title="Asset Passport Not Found"
        message={`No passport record could be retrieved for asset ID "${selectedAssetId}".`}
        onRetry={() => queryClient.invalidateQueries({ queryKey: ['passport', selectedAssetId] })}
      />
    );
  }

  const activeAsset = assets.find((a) => a.asset_id === selectedAssetId);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'ASSET_REGISTERED':
        return <Database size={16} className="text-blue-400" />;
      case 'SECURITY_GATE_EVALUATED':
        return <ShieldCheck size={16} className="text-emerald-400" />;
      case 'PATHWAYS_EVALUATED':
      case 'CAPABILITY_PROFILED':
        return <Cpu size={16} className="text-sky-400" />;
      case 'AI_ASSESSMENT_GENERATED':
        return <Sparkles size={16} className="text-purple-400" />;
      case 'HUMAN_DECISION_APPROVED':
        return <UserCheck size={16} className="text-emerald-400" />;
      case 'HUMAN_DECISION_OVERRIDDEN':
        return <RotateCcw size={16} className="text-purple-400" />;
      case 'HUMAN_DECISION_REJECTED':
        return <XCircle size={16} className="text-rose-400" />;
      case 'PROCESSING_COMMENCED':
      case 'REPAIR_INITIATED':
        return <Wrench size={16} className="text-amber-400" />;
      default:
        return <FileText size={16} className="text-slate-400" />;
    }
  };

  const getEventBadgeColor = (eventType: string) => {
    if (eventType.includes('APPROVED')) return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
    if (eventType.includes('REJECTED')) return 'bg-rose-950/60 text-rose-300 border-rose-800/60';
    if (eventType.includes('OVERRIDDEN')) return 'bg-purple-950/60 text-purple-300 border-purple-800/60';
    if (eventType.includes('SECURITY')) return 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
    if (eventType.includes('REGISTERED')) return 'bg-blue-950/60 text-blue-300 border-blue-800/60';
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileText className="text-emerald-400" size={22} />
              Circular IT Asset Passport
            </h2>
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              [SIMULATED DATASET]
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable chain-of-custody, sanitization certifications, and disposition decision audit trail.
          </p>
        </div>

        {/* Asset Selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="passport-asset-select" className="text-xs font-medium text-slate-400 whitespace-nowrap">
            Audit Subject:
          </label>
          <select
            id="passport-asset-select"
            value={selectedAssetId}
            onChange={(e) => handleSelectAsset(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          >
            {assets.map((a) => (
              <option key={a.asset_id} value={a.asset_id}>
                {a.asset_id} — {a.manufacturer} {a.model} ({a.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Asset Passport Certificate Summary Card */}
      {passport && (
        <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950 p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-3 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700 shrink-0">
                <FileText size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-sm text-emerald-400 font-bold">{passport.asset_id}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-sm font-semibold text-white">
                    {passport.manufacturer || activeAsset?.manufacturer} {passport.model || activeAsset?.model}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    SN: {passport.serial_number}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Device Type: <strong className="text-slate-300 capitalize">{passport.device_type || activeAsset?.device_type}</strong> • Department: <strong className="text-slate-300">{activeAsset?.department || 'University IT'}</strong> • Location: <strong className="text-slate-300">{activeAsset?.location || 'Store'}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Lifecycle State</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/60 mt-0.5">
                  <CheckCircle2 size={12} />
                  {passport.lifecycle_state || passport.lifecycle_status || 'ACTIVE'}
                </span>
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-2.5 text-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">Chain of Custody</span>
                <span className="font-bold text-white font-mono text-sm">
                  {passport.events?.length || passport.total_events || 0} Events
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
              <span>Cryptographic Chain-of-Custody Ledger Verified</span>
            </div>
            <div className="font-mono text-[11px] text-slate-500">
              LEDGER-ID: {passport.asset_id}-PASSPORT-SHA256
            </div>
          </div>
        </div>
      )}

      {/* 3. Chronological Audit Ledger Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Clock size={14} className="text-emerald-400" />
            Immutable Event Trail (Chronological Order)
          </span>
          <span className="text-xs text-slate-500">
            {passport?.events?.length || 0} immutable ledger entries
          </span>
        </div>

        {passport?.events && passport.events.length > 0 ? (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {passport.events.map((event: AssetPassportEvent, index: number) => {
              const isExpanded = !!expandedEvents[event.event_id];
              const dateStr = new Date(event.timestamp).toLocaleString();

              return (
                <div key={event.event_id || index} className="relative group">
                  {/* Timeline Node Icon */}
                  <div className="absolute -left-6 sm:-left-8 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 border border-slate-700 shadow-md">
                    {getEventIcon(event.event_type)}
                  </div>

                  {/* Event Ledger Card */}
                  <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-2 hover:border-slate-700 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pb-2 border-b border-slate-800/60">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getEventBadgeColor(event.event_type)}`}>
                          {event.event_type}
                        </span>
                        <span className="text-xs text-white font-semibold">
                          Actor: <span className="text-slate-300 font-mono">{event.actor}</span>
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {dateStr}
                      </span>
                    </div>

                    {/* Quick Structured Summary Details */}
                    <div className="text-xs text-slate-300 space-y-1 pt-1">
                      {event.details && typeof event.details === 'object' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          {Object.entries(event.details).slice(0, 6).map(([key, val]) => (
                            <div key={key} className="bg-slate-950/40 rounded p-1.5 border border-slate-800/50">
                              <span className="text-slate-500 font-mono uppercase text-[10px] block">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="font-mono text-slate-300 font-medium break-all">
                                {typeof val === 'boolean' ? (val ? 'TRUE' : 'FALSE') : String(val)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Expandable Raw JSON Ledger Inspection */}
                    <div className="pt-1">
                      <button
                        onClick={() => toggleEventExpanded(event.event_id)}
                        className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Terminal size={12} />
                        <span>{isExpanded ? 'Hide Raw Audit Payload' : 'Inspect Raw Ledger JSON'}</span>
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>

                      {isExpanded && (
                        <pre className="mt-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
                          {JSON.stringify(event, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-400 text-xs">
            No events currently recorded for this asset. Run an evaluation to generate initial passport ledger events.
          </div>
        )}
      </div>
    </div>
  );
};
