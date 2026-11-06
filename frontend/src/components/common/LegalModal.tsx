import React from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';

export type LegalModalType = 'tos' | 'privacy' | 'compliance' | null;

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl border border-slate-700 bg-[#0c111d] text-slate-200 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-2.5">
            {type === 'tos' && <FileText size={18} className="text-emerald-400" />}
            {type === 'privacy' && <Lock size={18} className="text-sky-400" />}
            {type === 'compliance' && <ShieldCheck size={18} className="text-amber-400" />}
            <h3 className="text-base font-semibold text-white">
              {type === 'tos' && 'Terms of Institutional IT Custody & Platform Use'}
              {type === 'privacy' && 'Enterprise Data Sanitization & Privacy Policy'}
              {type === 'compliance' && 'Regulatory Alignment & NIST SP 800-88 R2 Specification'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-xs leading-relaxed text-slate-300">
          {type === 'tos' && (
            <>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-[11px] text-slate-400">
                Effective: January 2026 · Version 2.4.0 · Institutional Enterprise Agreement
              </div>
              <h4 className="font-semibold text-slate-100 text-sm">1. Custodianship & Chain of Custody</h4>
              <p>
                All hardware assets ingested into ReLife remain the legal property of the operating institution until
                formal transfer or certified disposition. Custodians are required to maintain digital asset passports
                reflecting physical custody transitions, location reassignments, and maintenance logging.
              </p>
              <h4 className="font-semibold text-slate-100 text-sm">2. Deterministic Security Precedence</h4>
              <p>
                Under no circumstances may algorithmic optimization, artificial intelligence recommendation, or human
                administrative override bypass the NIST SP 800-88 Rev. 2 data sanitization verification gate. All drives
                must possess cryptographically verifiable sanitization certificates prior to external donation or open
                redeployment.
              </p>
              <h4 className="font-semibold text-slate-100 text-sm">3. Human-in-the-Loop Dispositions</h4>
              <p>
                Algorithmic evaluations provide advisory decision support. Final second-life pathway assignments
                (redeployment, refurbishment, component harvesting, or certified recycling) require authorized human
                disposition sign-off logged with auditable cryptographic stamps.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-[11px] text-slate-400">
                NIST SP 800-88 Rev. 2 Standard · ISO/IEC 27001 Data Sanitization Governance
              </div>
              <h4 className="font-semibold text-slate-100 text-sm">1. Data Sanitization Protocols</h4>
              <p>
                ReLife enforces strict zero-data-leakage mandates. Assets containing non-volatile magnetic or solid-state
                storage must undergo verified cryptographic erasure (ATA Clear / Purge) or certified degaussing/shredding.
              </p>
              <h4 className="font-semibold text-slate-100 text-sm">2. Audit Logging & Verification</h4>
              <p>
                Verification references, technician IDs, timestamps, and sanitization methods are permanently immutably
                appended to the asset's Circular IT Passport. Unsanitized hardware is automatically quarantined from
                recirculation queues.
              </p>
              <h4 className="font-semibold text-slate-100 text-sm">3. Environmental Metric Calculation Privacy</h4>
              <p>
                Avoided carbon calculations utilize peer-reviewed lifecycle analysis (LCA) coefficients without ingesting
                or transmitting proprietary departmental workload records.
              </p>
            </>
          )}

          {type === 'compliance' && (
            <>
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-[11px] text-slate-400">
                UN SDG 12 Target 12.5 · GHG Protocol Scope 3 Cat. 1 & 2 · E-Waste Rules
              </div>
              <h4 className="font-semibold text-slate-100 text-sm">1. SDG 12 Circular Methodology</h4>
              <p>
                ReLife operationalizes United Nations Sustainable Development Goal 12 (Responsible Consumption and
                Production). Avoided e-waste and emissions metrics follow standardized life cycle assessment (LCA)
                baselines from Fraunhofer IZM and Ecoinvent 3.8.
              </p>
              <h4 className="font-semibold text-slate-100 text-sm">2. E-Waste Recycler Verification</h4>
              <p>
                All end-of-life recycling dispositions require R2v3 or e-Stewards certified downstream processors with
                verified documentation of zero hazardous export to developing economies.
              </p>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-slate-800 px-6 py-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 transition"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
