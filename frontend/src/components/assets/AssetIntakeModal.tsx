import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Laptop,
  HardDrive,
  ShieldCheck,
  ShieldAlert,
  Building2,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { api } from '../../services/api';
import type {
  Asset,
  AssetCreate,
  PhysicalCondition,
  FunctionalStatus,
  SanitizationMethod,
  SanitizationStatus,
} from '../../types/api';

interface AssetIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newAsset: Asset) => void;
}

const INITIAL_FORM_STATE = {
  asset_id: '',
  serial_number: '',
  device_type: 'laptop' as 'laptop' | 'desktop',
  manufacturer: 'Lenovo',
  model: '',
  purchase_year: new Date().getFullYear() - 3,
  cpu_model: 'Intel Core i5-1135G7',
  cpu_cores: 4,
  ram_gb: 16,
  storage_gb: 512,
  storage_type: 'nvme_ssd',
  storage_present: true,
  sanitization_method: 'none' as SanitizationMethod,
  sanitization_status: 'pending' as SanitizationStatus,
  sanitization_verified: false,
  verification_reference: '',
  verified_by: '',
  battery_health_percent: 88,
  physical_condition: 'grade_a' as PhysicalCondition,
  functional_status: 'fully_functional' as FunctionalStatus,
  known_issues: '',
  department: 'Computer Science & Engineering',
  location: 'Engineering Block A - Lab 101',
};

export const AssetIntakeModal: React.FC<AssetIntakeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredAsset, setRegisteredAsset] = useState<Asset | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setFormData(INITIAL_FORM_STATE);
    setErrorMessage(null);
    setRegisteredAsset(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validation for required fields
    if (!formData.serial_number.trim()) {
      setErrorMessage('Serial number is required.');
      return;
    }
    if (!formData.manufacturer.trim()) {
      setErrorMessage('Manufacturer is required.');
      return;
    }
    if (!formData.model.trim()) {
      setErrorMessage('Hardware model is required.');
      return;
    }
    if (!formData.cpu_model.trim()) {
      setErrorMessage('CPU / Processor model is required.');
      return;
    }
    if (!formData.department.trim()) {
      setErrorMessage('Department is required.');
      return;
    }
    if (!formData.location.trim()) {
      setErrorMessage('Location is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: AssetCreate = {
        serial_number: formData.serial_number.trim(),
        device_type: formData.device_type,
        manufacturer: formData.manufacturer.trim(),
        model: formData.model.trim(),
        purchase_year: Number(formData.purchase_year),
        cpu_model: formData.cpu_model.trim(),
        cpu_cores: Number(formData.cpu_cores),
        ram_gb: Number(formData.ram_gb),
        storage_gb: Number(formData.storage_gb),
        storage_type: formData.storage_type,
        storage_present: formData.storage_present,
        sanitization_method: formData.sanitization_method,
        sanitization_status: formData.sanitization_status,
        sanitization_verified: formData.sanitization_verified,
        verification_reference: formData.verification_reference.trim() || undefined,
        verified_by: formData.verified_by.trim() || undefined,
        verified_at: formData.sanitization_verified ? new Date().toISOString() : undefined,
        battery_health_percent:
          formData.device_type === 'laptop' && formData.battery_health_percent
            ? Number(formData.battery_health_percent)
            : undefined,
        physical_condition: formData.physical_condition,
        functional_status: formData.functional_status,
        known_issues: formData.known_issues
          ? formData.known_issues.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        department: formData.department.trim(),
        location: formData.location.trim(),
      };

      if (formData.asset_id.trim()) {
        payload.asset_id = formData.asset_id.trim();
      }

      const created = await api.createAsset(payload);
      setRegisteredAsset(created);
      onSuccess(created);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to register asset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-700/80 bg-[#0c111d] shadow-2xl z-10 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <PlusCircle size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Asset Intake & Registration</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  INSTITUTIONAL
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Register a new physical IT asset into inventory for circular triage and AI assessment.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3.5 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Registration Error</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {registeredAsset ? (
            /* Success State View */
            <div className="space-y-6 py-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">Asset Registered Successfully</h4>
                <p className="text-xs text-slate-400 mt-1">
                  New physical asset record created and initialized in the ReLife inventory queue.
                </p>
              </div>

              {/* Asset Summary Card */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-left max-w-lg mx-auto space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs text-slate-400">Assigned Asset ID</span>
                  <span className="font-mono text-sm font-bold text-emerald-400 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700">
                    {registeredAsset.asset_id}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Hardware Model</span>
                  <span className="font-medium text-white">
                    {registeredAsset.manufacturer} {registeredAsset.model}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Specifications</span>
                  <span className="font-mono text-slate-300">
                    {registeredAsset.ram_gb}GB RAM · {registeredAsset.storage_gb}GB {registeredAsset.storage_type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Security Gate State</span>
                  <span
                    className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                      registeredAsset.sanitization_verified
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                        : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                    }`}
                  >
                    {registeredAsset.sanitization_verified ? 'CLEARED (WIPE VERIFIED)' : 'BLOCKED (AUDIT REQUIRED)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Department</span>
                  <span className="text-slate-300">{registeredAsset.department}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-200 transition"
                >
                  <RotateCcw size={14} />
                  <span>Register Another</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    window.location.href = `/assets?selected=${registeredAsset.asset_id}`;
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-sm"
                >
                  <span>Assess Asset</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            /* Intake Form */
            <form id="asset-intake-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Group 1: Asset Identity */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <Laptop size={14} className="text-emerald-400" />
                  <span>1. Asset Identity</span>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Asset ID <span className="text-slate-500 text-[10px]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. INST-LAP-031"
                      value={formData.asset_id}
                      onChange={(e) => setFormData({ ...formData, asset_id: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Serial Number <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SN-L14-2026-09"
                      value={formData.serial_number}
                      onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Device Type <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      value={formData.device_type}
                      onChange={(e) => setFormData({ ...formData, device_type: e.target.value as 'laptop' | 'desktop' })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="laptop">Laptop</option>
                      <option value="desktop">Desktop</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Manufacturer <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lenovo, Dell, HP"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Hardware Model <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ThinkPad L14 Gen 2"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Purchase Year <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={2010}
                      max={2030}
                      value={formData.purchase_year}
                      onChange={(e) => setFormData({ ...formData, purchase_year: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Group 2: Hardware & Capability */}
              <fieldset className="space-y-3 pt-2 border-t border-slate-800/80">
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <Cpu size={14} className="text-sky-400" />
                  <span>2. Hardware Specifications & Capability</span>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Processor (CPU) Model <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Intel Core i5-1135G7"
                      value={formData.cpu_model}
                      onChange={(e) => setFormData({ ...formData, cpu_model: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      CPU Cores <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={64}
                      value={formData.cpu_cores}
                      onChange={(e) => setFormData({ ...formData, cpu_cores: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      RAM (GB) <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={2}
                      max={256}
                      value={formData.ram_gb}
                      onChange={(e) => setFormData({ ...formData, ram_gb: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Storage Capacity (GB) <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={16384}
                      value={formData.storage_gb}
                      onChange={(e) => setFormData({ ...formData, storage_gb: Number(e.target.value) })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Storage Drive Type <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      value={formData.storage_type}
                      onChange={(e) => setFormData({ ...formData, storage_type: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="nvme_ssd">NVMe SSD</option>
                      <option value="sata_ssd">SATA SSD</option>
                      <option value="hdd">HDD</option>
                      <option value="none">None (Diskless)</option>
                    </select>
                  </div>

                  {formData.device_type === 'laptop' && (
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Battery Health (%) <span className="text-slate-500 text-[10px]">(Optional)</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={formData.battery_health_percent}
                        onChange={(e) => setFormData({ ...formData, battery_health_percent: Number(e.target.value) })}
                        className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </fieldset>

              {/* Group 3: Physical & Functional Condition */}
              <fieldset className="space-y-3 pt-2 border-t border-slate-800/80">
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <ShieldCheck size={14} className="text-teal-400" />
                  <span>3. Condition & Health</span>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Physical Condition <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      value={formData.physical_condition}
                      onChange={(e) => setFormData({ ...formData, physical_condition: e.target.value as PhysicalCondition })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none capitalize"
                    >
                      <option value="grade_a">Grade A — Like New</option>
                      <option value="grade_b">Grade B — Minor Wear</option>
                      <option value="grade_c">Grade C — Heavy Wear</option>
                      <option value="damaged">Damaged / Cracked</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Functional Status <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      value={formData.functional_status}
                      onChange={(e) => setFormData({ ...formData, functional_status: e.target.value as FunctionalStatus })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none capitalize"
                    >
                      <option value="fully_functional">Fully Functional</option>
                      <option value="minor_defect">Minor Defect (e.g. port issue)</option>
                      <option value="major_fault">Major Fault (e.g. motherboard issue)</option>
                      <option value="non_functional">Non-Functional / Dead</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Known Issues <span className="text-slate-500 text-[10px]">(Comma separated, optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. minor scratches on top cover, worn trackpad"
                    value={formData.known_issues}
                    onChange={(e) => setFormData({ ...formData, known_issues: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </fieldset>

              {/* Group 4: Security & Sanitization Audit */}
              <fieldset className="space-y-3 pt-2 border-t border-slate-800/80">
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <HardDrive size={14} className="text-amber-400" />
                  <span>4. Data Security & Storage Sanitization</span>
                </legend>

                {/* NIST SP 800-88 Policy Notice */}
                <div className="rounded-lg border border-amber-500/30 bg-amber-950/30 p-3 text-[11px] text-amber-300/90 leading-relaxed flex items-start gap-2">
                  <ShieldAlert size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>NIST SP 800-88 Rev. 2 Governance Gate:</strong> Unsanitized storage is deterministically blocked
                    from direct internal redeployment or donation until technician verification is recorded (aligned with NIST SP 800-88 Rev. 2 guidance).
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.storage_present}
                      onChange={(e) => setFormData({ ...formData, storage_present: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                    />
                    <span className="text-xs text-slate-300">Internal Storage Drive Present</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={formData.sanitization_verified}
                      onChange={(e) => setFormData({ ...formData, sanitization_verified: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-0"
                    />
                    <span className="text-xs text-slate-300">Sanitization Verified</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Sanitization Status</label>
                    <select
                      value={formData.sanitization_status}
                      onChange={(e) => setFormData({ ...formData, sanitization_status: e.target.value as SanitizationStatus })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none capitalize"
                    >
                      <option value="pending">Pending Audit</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed & Verified</option>
                      <option value="not_required">Not Required (Diskless)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Sanitization Method</label>
                    <select
                      value={formData.sanitization_method}
                      onChange={(e) => setFormData({ ...formData, sanitization_method: e.target.value as SanitizationMethod })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none capitalize"
                    >
                      <option value="crypto_erase">Cryptographic Erase (NIST Clear)</option>
                      <option value="overwrite_single_pass">Single-Pass Overwrite</option>
                      <option value="overwrite_multi_pass">Multi-Pass Overwrite</option>
                      <option value="degauss_destroy">Degauss & Destroy</option>
                      <option value="physical_shred">Physical Shred (Purge)</option>
                      <option value="none">None / Unsanitized</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Verification Reference
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SAN-VER-2026-X1"
                      value={formData.verification_reference}
                      onChange={(e) => setFormData({ ...formData, verification_reference: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Verified By (Technician / Auditor)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Lead IT Auditor"
                      value={formData.verified_by}
                      onChange={(e) => setFormData({ ...formData, verified_by: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Group 5: Department & Location */}
              <fieldset className="space-y-3 pt-2 border-t border-slate-800/80">
                <legend className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                  <Building2 size={14} className="text-indigo-400" />
                  <span>5. Location & Ownership</span>
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Department <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science & Engineering"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Location / Campus Building <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Engineering Block A - Lab 101"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </fieldset>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        {!registeredAsset && (
          <div className="border-t border-slate-800/80 px-6 py-3.5 bg-slate-900/50 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="asset-intake-form"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition disabled:opacity-50 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Registering Asset...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={14} />
                  <span>Register Asset</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
