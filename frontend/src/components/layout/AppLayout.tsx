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
  Sparkles,
} from 'lucide-react';
import { SimulatedBanner } from '../common/SimulatedBanner';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
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
  const location = useLocation();

  const currentNav = navItems.find((item) =>
    item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
  );

  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-[#090d16] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Sidebar Navigation for Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800/80 bg-[#0c111d]/90 backdrop-blur-sm z-30">
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-950">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white">ReLife</span>
                <span className="rounded bg-emerald-950/80 border border-emerald-800/40 px-1 py-0.2 text-[10px] font-semibold text-emerald-400">
                  SDG 12
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-tight">Circular IT Intelligence</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
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
                  `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-slate-800/90 text-emerald-400 border border-slate-700/60 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/40 hover:text-slate-100'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="shrink-0" />
                  <span>{item.label}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Governance Card */}
        <div className="border-t border-slate-800/80 p-4 space-y-2">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span>Governance Core</span>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-slate-300 text-[10px] leading-relaxed">
              Security gate enforced deterministically. Human review required for all dispositions.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative flex w-64 flex-col bg-[#0c111d] border-r border-slate-800 p-4 z-50">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-lg font-bold text-white">ReLife</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
                aria-label="Close menu"
              >
                <X size={20} />
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
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={18} />
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
        <header className="sticky top-0 z-20 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-md px-3 sm:px-6 lg:px-8 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 shrink-0"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-white truncate">
                {currentNav?.label || 'Platform'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <SimulatedBanner />
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 border border-slate-800/80 bg-slate-900/60 rounded-full px-3 py-1">
              <Server size={13} className="text-emerald-400" />
              <span>Backend API</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            </div>
          </div>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
