import React from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Phone, Mail, Clock, RotateCcw } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveNav, settings, resetDemoData } = useApp();

  return (
    <footer className="bg-[#06080A] border-t border-[#1E252C] text-[#9BA3A8] text-xs pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1E252C]">
          {/* Brand & mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#151A20] border border-[#242C33] flex items-center justify-center text-[#C7F464]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5"
                >
                  <path d="M12 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                  <path d="m14 17 6-12-8 3-8-3 6 12" />
                  <path d="M7 11h10" />
                </svg>
              </div>
              <span className="font-display font-bold text-sm tracking-wider text-[#F4F5F3]">
                VORTEX <span className="text-[#C7F464]">ARENA</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#9BA3A8]">
              International tournament-grade indoor badminton facility. Built with BWF shock-absorbing synthetic mats, calibrated anti-glare floodlights, and automated high-frame match replay.
            </p>
            <div className="pt-1">
              <span className="inline-block text-[11px] text-[#C7F464] border border-[#C7F464]/30 px-2.5 py-1 rounded-md bg-[#C7F464]/5">
                BWF Certified Flooring Standard
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#F4F5F3] uppercase tracking-wider">
              Facility Experience
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveNav('courts')}
                  className="hover:text-[#F4F5F3] transition-colors"
                >
                  Court Showcase & Specs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveNav('book')}
                  className="hover:text-[#F4F5F3] transition-colors"
                >
                  Hourly Slot Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveNav('coaching')}
                  className="hover:text-[#F4F5F3] transition-colors"
                >
                  Academy & Training Batches
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveNav('tournaments')}
                  className="hover:text-[#F4F5F3] transition-colors"
                >
                  Open Tournaments & Brackets
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveNav('community')}
                  className="hover:text-[#F4F5F3] transition-colors"
                >
                  Player Matchmaking Community
                </button>
              </li>
            </ul>
          </div>

          {/* Dashboards & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#F4F5F3] uppercase tracking-wider">
              Demo Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveNav('customer-dashboard')}
                  className="hover:text-[#F4F5F3] transition-colors"
                >
                  Customer Member Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveNav('admin-dashboard')}
                  className="hover:text-[#F4F5F3] transition-colors"
                >
                  Administrative SaaS Control Suite
                </button>
              </li>
              <li>
                <button
                  onClick={resetDemoData}
                  className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 transition-colors pt-2"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore Initial Mock Data</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Facility Location & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#F4F5F3] uppercase tracking-wider">
              Arena Location & Hours
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C7F464] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C7F464] shrink-0" />
                <span>
                  Mon – Sun: {settings.openHour}:00 AM – {settings.closeHour % 12 || 12}:00 PM
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C7F464] shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C7F464] shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom line: Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9BA3A8]/80">
          <p>© {new Date().getFullYear()} Vortex Badminton Arena. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-[#C7F464]/80 bg-[#151A20] px-2.5 py-1 rounded border border-[#242C33]">
              INTERACTIVE DEMO PLATFORM · ZERO BACKEND · NO REAL TRANSACTIONS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
