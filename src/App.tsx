import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcherBar } from './components/layout/RoleSwitcherBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/homepage/HeroSection';
import { CourtShowcase } from './components/homepage/CourtShowcase';
import { FeaturesAmenities } from './components/homepage/FeaturesAmenities';
import { BookingCalendar } from './components/booking/BookingCalendar';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CoachingPage } from './components/coaching/CoachingPage';
import { TournamentsPage } from './components/tournaments/TournamentsPage';
import { CommunityPage } from './components/community/CommunityPage';
import { MembershipsPage } from './components/memberships/MembershipsPage';
import { ToastContainer } from './components/shared/ToastContainer';
import { Anatomy3DExperience } from './components/3d/Anatomy3DExperience';
import { Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeNav, setActiveNav, role } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#080A0C] text-[#F4F5F3] font-sans transition-colors selection:bg-[#C7F464] selection:text-[#080A0C]">
      {/* Top Demo Perspective Switcher */}
      <RoleSwitcherBar />

      {/* Primary Top Bar Contract */}
      <Header />

      {/* Main Routed Content */}
      <main className="flex-1">
        {activeNav === 'home' && (
          <div className="space-y-0">
            <HeroSection />
            <Anatomy3DExperience />
            <CourtShowcase />

            {/* Quick interactive booking calendar anchor section on homepage */}
            <section className="py-20 bg-[#080A0C] border-b border-[#1E252C]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
                  <div>
                    <span className="text-xs font-semibold text-[#C7F464] uppercase tracking-wider block">
                      Live Facility Matrix
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F5F3] font-display tracking-tight">
                      BOOK AN HOURLY SESSION.
                    </h2>
                    <p className="text-sm text-[#9BA3A8] mt-1">
                      Select date and court to lock in your 60-minute time slot with instant confirmation.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveNav('book')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C7F464] hover:text-[#d6f87d] uppercase tracking-wider shrink-0"
                  >
                    <span>Full Screen Timetable</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <BookingCalendar />
              </div>
            </section>

            <FeaturesAmenities />
          </div>
        )}

        {activeNav === 'anatomy3d' && (
          <div className="py-6 bg-[#080A0C]">
            <Anatomy3DExperience />
          </div>
        )}

        {activeNav === 'courts' && (
          <div>
            <CourtShowcase />
            <FeaturesAmenities />
          </div>
        )}

        {activeNav === 'book' && (
          <div className="py-12 bg-[#080A0C] min-h-[85vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
              <div>
                <span className="text-xs font-semibold text-[#C7F464] uppercase tracking-wider block">
                  Court Availability Matrix
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F4F5F3] font-display tracking-tight mt-1">
                  RESERVE YOUR COURT
                </h1>
                <p className="text-sm text-[#9BA3A8] mt-1 max-w-2xl">
                  Choose from 17 independent hourly slots (6:00 AM – 11:00 PM). Real-time conflict prevention guarantees zero overlapping reservations.
                </p>
              </div>

              <BookingCalendar />
            </div>
          </div>
        )}

        {activeNav === 'coaching' && <CoachingPage />}

        {activeNav === 'tournaments' && <TournamentsPage />}

        {activeNav === 'community' && <CommunityPage />}

        {activeNav === 'memberships' && <MembershipsPage />}

        {activeNav === 'customer-dashboard' && <CustomerDashboard />}

        {activeNav === 'admin-dashboard' && <AdminDashboard />}

        {activeNav === 'about' && (
          <div>
            <FeaturesAmenities />
          </div>
        )}
      </main>

      {/* Editorial Footer */}
      <Footer />

      {/* Toast Feedback Overlay */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
