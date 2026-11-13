import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationDrawer } from '../notifications/NotificationDrawer';
import { Bell, Menu, X, User, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeNav, setActiveNav, role, unreadNotificationCount } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'anatomy3d', label: '3D Anatomy' },
    { id: 'courts', label: 'Courts' },
    { id: 'book', label: 'Book Court' },
    { id: 'coaching', label: 'Coaching' },
    { id: 'tournaments', label: 'Tournaments' },
    { id: 'memberships', label: 'Passes' },
  ];

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#080A0C]/90 backdrop-blur-md border-b border-[#1E252C] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-[#F4F5F3] hover:text-white transition-colors whitespace-nowrap shrink-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#151A20] border border-[#242C33] flex items-center justify-center text-[#C7F464] group-hover:border-[#C7F464]/50 transition-colors">
              {/* Shuttlecock SVG icon */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M12 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="currentColor" fillOpacity="0.2" />
                <path d="m14 17 6-12-8 3-8-3 6 12" />
                <path d="M7 11h10" />
                <path d="M8.5 14h7" />
              </svg>
            </div>
            <span className="font-display tracking-wider font-extrabold text-sm sm:text-base">
              ARS <span className="text-[#C7F464]">BADMINTON ARENA</span>
            </span>
          </button>

          {/* Zone 2: 4–5 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#9BA3A8]">
            {navLinks.map((link) => {
              const isActive = activeNav === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-[#F4F5F3] font-semibold'
                      : 'hover:text-[#F4F5F3]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C7F464] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + role/notifications */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notifications button */}
            <button
              onClick={() => setNotifOpen(true)}
              className="relative p-2 rounded-lg text-[#9BA3A8] hover:text-[#F4F5F3] hover:bg-[#151A20] transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C7F464]" />
              )}
            </button>

            {/* Dashboard shortcut based on role */}
            {role === 'admin' || role === 'reception' ? (
              <button
                onClick={() => handleNavClick('admin-dashboard')}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all whitespace-nowrap shrink-0 ${
                  activeNav === 'admin-dashboard'
                    ? 'bg-[#191F24] text-[#C7F464] border-[#C7F464]/40'
                    : 'bg-[#111519] text-[#9BA3A8] border-[#242C33] hover:text-[#F4F5F3]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C7F464]" />
                <span>Admin Suite</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('customer-dashboard')}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all whitespace-nowrap shrink-0 ${
                  activeNav === 'customer-dashboard'
                    ? 'bg-[#191F24] text-[#C7F464] border-[#C7F464]/40'
                    : 'bg-[#111519] text-[#9BA3A8] border-[#242C33] hover:text-[#F4F5F3]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>My Bookings</span>
              </button>
            )}

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('book')}
              className="px-4 py-2 text-xs font-bold text-[#080A0C] bg-[#C7F464] hover:bg-[#d6f87d] rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(199,244,100,0.2)] hover:shadow-[0_0_25px_rgba(199,244,100,0.35)] whitespace-nowrap shrink-0 active:scale-95"
            >
              Book a Court
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#9BA3A8] hover:text-[#F4F5F3] hover:bg-[#151A20] rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#1E252C] bg-[#0E1216] px-4 pt-3 pb-6 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeNav === link.id
                    ? 'bg-[#191F24] text-[#C7F464] font-semibold'
                    : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-[#1E252C] space-y-2">
              <button
                onClick={() => handleNavClick('customer-dashboard')}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-[#9BA3A8] hover:text-[#F4F5F3]"
              >
                <User className="w-4 h-4" />
                <span>Customer Dashboard</span>
              </button>
              <button
                onClick={() => handleNavClick('admin-dashboard')}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-[#9BA3A8] hover:text-[#F4F5F3]"
              >
                <ShieldCheck className="w-4 h-4 text-[#C7F464]" />
                <span>Admin Operations Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Notifications Drawer */}
      <NotificationDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
    </>
  );
};
