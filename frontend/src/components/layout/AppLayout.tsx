import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  FlaskConical,
  GitPullRequest,
  CheckCircle2,
  FileText,
  Leaf,
  Menu,
  X,
  Server,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { SimulatedBanner } from '../common/SimulatedBanner';
import { GovernanceDrawer } from '../common/GovernanceDrawer';
import { LegalModal, type LegalModalType } from '../common/LegalModal';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Command Center', icon: LayoutDashboard },
  { to: '/assets', label: 'Asset Intelligence', icon: Cpu },
  { to: '/scenarios', label: 'Scenario Lab', icon: FlaskConical },
  { to: '/demand', label: 'Demand Matching', icon: GitPullRequest },
  { to: '/approvals', label: 'Approval Center', icon: CheckCircle2 },
  { to: '/passport', label: 'Circular Passport', icon: FileText },
  { to: '/impact', label: 'Impact Center', icon: Leaf },
];

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [governanceOpen, setGovernanceOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);
  const location = useLocation();

  const currentNav = navItems.find((item) =>
    item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
  );

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-[#090d16] text-slate-100 font-sans antialiased selection:bg-slate-700 selection:text-white">
      {/* Sidebar Navigation for Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800/80 bg-[#0c111d] z-30">
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-900 text-slate-200">
              <RefreshCw size={16} className="text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tracking-tight text-white">ReLife</span>
                <span className="rounded bg-slate-800 border border-slate-700 px-1 py-0.2 text-[9px] font-medium text-slate-300">
                  SDG 12
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-normal">Circular IT Intelligence</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Platform Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white border border-slate-700'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className="shrink-0" />
                  <span>{item.label}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Governance Card */}
        <div className="border-t border-slate-800 p-3 space-y-2">
          <button
            onClick={() => setGovernanceOpen(true)}
            className="w-full text-left rounded-md border border-slate-800 bg-slate-900/60 p-2.5 text-[11px] space-y-1 hover:border-slate-700 hover:bg-slate-800/60 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                Governance Core
              </span>
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Deterministic security gate enforced. Human review required for all dispositions.
            </p>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex w-64 flex-col bg-[#0c111d] border-r border-slate-800 p-4 z-50">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-700 bg-slate-900">
                  <RefreshCw size={14} className="text-emerald-400" />
                </div>
                <span className="text-sm font-bold text-white">ReLife</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="mt-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                        isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-850 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 max-w-full overflow-x-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 flex h-14 w-full shrink-0 items-center justify-between border-b border-slate-800 bg-[#090d16]/95 backdrop-blur-xs px-3 sm:px-6 lg:px-8 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <h1 className="text-xs sm:text-sm font-semibold tracking-tight text-white truncate">
                {currentNav?.label || 'Platform'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setGovernanceOpen(true)}
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md px-2.5 py-1 transition-colors cursor-pointer"
            >
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Governance</span>
            </button>
            <SimulatedBanner />
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 border border-slate-800 bg-slate-900 rounded-md px-2.5 py-1">
              <Server size={12} className="text-emerald-400" />
              <span>API Connected</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            </div>
          </div>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto overflow-x-hidden pt-6">
          <Outlet />

          {/* Institutional Compliance & Legal Footer */}
          <footer className="mt-16 border-t border-slate-800/80 py-6 text-xs text-slate-500">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="font-semibold text-slate-300">ReLife</span>
                <span>·</span>
                <span>Institutional Circular IT Asset Intelligence Platform</span>
                <span>·</span>
                <span>UN SDG 12</span>
              </div>
              <div className="flex items-center gap-4 flex-wrap text-slate-400">
                <button
                  onClick={() => setLegalModalType('tos')}
                  className="hover:text-slate-200 transition underline underline-offset-4 cursor-pointer"
                >
                  Terms of Institutional Custody
                </button>
                <button
                  onClick={() => setLegalModalType('privacy')}
                  className="hover:text-slate-200 transition underline underline-offset-4 cursor-pointer"
                >
                  Data Sanitization & Privacy
                </button>
                <button
                  onClick={() => setLegalModalType('compliance')}
                  className="hover:text-slate-200 transition underline underline-offset-4 cursor-pointer"
                >
                  NIST SP 800-88 R2 Specification
                </button>
              </div>
            </div>
          </footer>
        </main>

        {/* Governance & Responsible AI Drawer */}
        <GovernanceDrawer isOpen={governanceOpen} onClose={() => setGovernanceOpen(false)} />

        {/* Legal & Policy Modals */}
        <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
      </div>
    </div>
  );
};
