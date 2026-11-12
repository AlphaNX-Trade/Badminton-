import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoRole } from '../../types';
import { ShieldCheck, User, Users, Store, RotateCcw, HelpCircle, ChevronRight, Sun, Moon } from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const { role, setRole, resetDemoData, setActiveNav, theme, toggleTheme } = useApp();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const roles: { id: DemoRole; label: string; icon: React.ReactNode; desc: string; targetNav: string }[] = [
    {
      id: 'customer',
      label: 'Customer Demo',
      icon: <User className="w-3.5 h-3.5" />,
      desc: 'Browse courts, live booking, checkout demo, customer dashboard',
      targetNav: 'home',
    },
    {
      id: 'admin',
      label: 'Admin Operations',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
      desc: 'Real-time analytics, court manager, bookings table, coaching batches, reports',
      targetNav: 'admin-dashboard',
    },
    {
      id: 'coach',
      label: 'Coach Demo',
      icon: <Users className="w-3.5 h-3.5" />,
      desc: 'Batch rosters, student attendance, schedule, court reservation view',
      targetNav: 'coaching',
    },
    {
      id: 'reception',
      label: 'Reception Desk',
      icon: <Store className="w-3.5 h-3.5" />,
      desc: 'Fast walk-in booking, check-in players, collect pending payments',
      targetNav: 'admin-dashboard',
    },
  ];

  const handleRoleSelect = (r: DemoRole, nav: string) => {
    setRole(r);
    setActiveNav(nav);
  };

  return (
    <>
      <div className="bg-[#0B0F13] border-b border-[#1E252C] text-xs text-[#9BA3A8] px-4 py-1.5 flex items-center justify-between gap-4 flex-wrap select-none">
        {/* Left: Role indicator */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-medium text-[#F4F5F3]">
            <span className="w-2 h-2 rounded-full bg-[#C7F464] animate-pulse" />
            <span className="text-white font-semibold">Interactive Demo Mode:</span>
          </span>
          <div className="hidden sm:flex items-center gap-1 bg-[#151A20] p-0.5 rounded-lg border border-[#242C33]">
            {roles.map((r) => {
              const isActive = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => handleRoleSelect(r.id, r.targetNav)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                    isActive
                      ? 'bg-[#C7F464] text-[#080A0C] shadow-sm font-semibold'
                      : 'text-[#9BA3A8] hover:text-[#F4F5F3] hover:bg-[#191F24]'
                  }`}
                  title={r.desc}
                >
                  {r.icon}
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Mobile role select */}
          <div className="sm:hidden">
            <select
              value={role}
              onChange={(e) => {
                const target = roles.find((r) => r.id === e.target.value);
                if (target) handleRoleSelect(target.id, target.targetNav);
              }}
              className="bg-[#151A20] text-[#F4F5F3] border border-[#242C33] rounded px-2 py-0.5 text-xs"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-1 text-[#9BA3A8] hover:text-[#F4F5F3] transition-colors"
            title="Demo Information"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Demo Guide</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-1 text-[#9BA3A8] hover:text-[#F4F5F3] transition-colors rounded hover:bg-[#151A20]"
            title={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <div className="h-3 w-[1px] bg-[#242C33]" />

          <button
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1 text-xs text-[#9BA3A8] hover:text-rose-400 transition-colors"
            title="Reset mock data to fresh defaults"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Info popover modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111519] border border-[#242C33] rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#242C33] pb-3">
              <h3 className="text-base font-semibold text-[#F4F5F3]">
                Facility Owner Demo Guide
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-[#9BA3A8] hover:text-[#F4F5F3]"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-[#9BA3A8] leading-relaxed">
              This interactive platform was built specifically to show the badminton arena owner the complete operational workflow. All interactions run locally in your browser with zero external database dependencies.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#151A20] border border-[#242C33]">
                <strong className="text-[#C7F464] block">1. Customer Experience</strong>
                Browse the 3 courts (expandable to 4+), book any 60-min slot between 6 AM – 11 PM, select equipment add-ons, try demo UPI or Pay Later, and manage bookings.
              </div>
              <div className="p-2.5 rounded-lg bg-[#151A20] border border-[#242C33]">
                <strong className="text-[#C7F464] block">2. Dynamic Cross-Sync</strong>
                When a customer books Court 01, that slot locks immediately across the entire app. If cancelled in Customer Dashboard, it frees up instantly.
              </div>
              <div className="p-2.5 rounded-lg bg-[#151A20] border border-[#242C33]">
                <strong className="text-[#C7F464] block">3. Administrative SaaS Dashboard</strong>
                Add new courts, toggle maintenance blocks, manage coaching batches, inspect occupancy charts, view registered tournaments, and download live CSV reports.
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowInfo(false)}
                className="px-4 py-2 bg-[#C7F464] text-[#080A0C] font-semibold text-xs rounded-lg hover:bg-[#b8e855] transition-colors"
              >
                Got It, Let's Explore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset confirmation modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111519] border border-[#242C33] rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h4 className="text-base font-semibold text-[#F4F5F3]">Reset Demo Data?</h4>
            <p className="text-xs text-[#9BA3A8] leading-relaxed">
              This will restore all courts, bookings, coaching batches, and settings back to their initial state.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-3.5 py-2 text-xs font-medium text-[#9BA3A8] hover:text-[#F4F5F3] rounded-lg bg-[#191F24]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowConfirmReset(false);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
