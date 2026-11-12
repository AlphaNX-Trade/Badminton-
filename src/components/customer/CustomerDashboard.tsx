import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  CreditCard,
  User,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Printer,
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const {
    bookings,
    cancelBooking,
    rescheduleBooking,
    markBookingPaid,
    customerProfile,
    updateProfile,
    courts,
    setActiveNav,
    setSelectedDate,
    setSelectedCourtId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled' | 'pending' | 'profile'>('upcoming');
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState<Booking | null>(null);

  // Profile form state
  const [name, setName] = useState(customerProfile.name);
  const [playStyle, setPlayStyle] = useState(customerProfile.playStyle);
  const [skillLevel, setSkillLevel] = useState(customerProfile.skillLevel);
  const [preferredCourt, setPreferredCourt] = useState(customerProfile.preferredCourt);
  const [preferredTime, setPreferredTime] = useState(customerProfile.preferredTime);

  // Filter bookings for Alex Thorne
  const userBookings = useMemo(() => {
    return bookings.filter(
      (b) =>
        b.customerName.toLowerCase().includes('alex') ||
        b.customerEmail.toLowerCase().includes('alex')
    );
  }, [bookings]);

  const upcomingBookings = useMemo(() => {
    return userBookings.filter((b) => b.bookingStatus === 'confirmed');
  }, [userBookings]);

  const completedBookings = useMemo(() => {
    return userBookings.filter((b) => b.bookingStatus === 'completed');
  }, [userBookings]);

  const cancelledBookings = useMemo(() => {
    return userBookings.filter((b) => b.bookingStatus === 'cancelled');
  }, [userBookings]);

  const pendingPayments = useMemo(() => {
    return userBookings.filter(
      (b) => b.paymentStatus === 'pending' && b.bookingStatus !== 'cancelled'
    );
  }, [userBookings]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      playStyle,
      skillLevel,
      preferredCourt,
      preferredTime,
    });
  };

  return (
    <div className="py-12 bg-[#080A0C] min-h-screen text-left transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header & Member Stats */}
        <div className="bg-[#111519] border border-[#242C33] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C7F464]/5 blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#C7F464] text-[#080A0C] font-extrabold text-xl font-display flex items-center justify-center shadow-lg">
                {customerProfile.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F5F3] font-display">
                    {customerProfile.name}
                  </h1>
                  <span className="text-xs font-semibold text-[#C7F464] bg-[#C7F464]/10 border border-[#C7F464]/30 px-2.5 py-0.5 rounded-full">
                    {customerProfile.skillLevel}
                  </span>
                </div>
                <p className="text-xs text-[#9BA3A8] mt-1">
                  Member since Nov 2024 · Vortex Pro Pass Member
                </p>
              </div>
            </div>

            {/* Quick KPI stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t lg:border-t-0 lg:border-l border-[#242C33] pt-4 lg:pt-0 lg:pl-8">
              <div>
                <span className="text-[11px] text-[#9BA3A8] block">Active Bookings</span>
                <span className="text-xl font-bold font-mono text-[#F4F5F3] tabular-nums">
                  {upcomingBookings.length}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#9BA3A8] block">Pending Payment</span>
                <span
                  className={`text-xl font-bold font-mono tabular-nums ${
                    pendingPayments.length > 0 ? 'text-amber-400' : 'text-[#C7F464]'
                  }`}
                >
                  {pendingPayments.length}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#9BA3A8] block">Loyalty Points</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C7F464]" />
                  <span className="text-xl font-bold font-mono text-[#C7F464] tabular-nums">
                    {customerProfile.loyaltyPoints}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[11px] text-[#9BA3A8] block">Arena Ranking</span>
                <span className="text-xl font-bold font-mono text-[#F4F5F3] tabular-nums">
                  #{customerProfile.rank}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#242C33] overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2.5 font-semibold rounded-t-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'upcoming'
                ? 'bg-[#151A20] text-[#C7F464] border-t-2 border-[#C7F464]'
                : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Upcoming Sessions ({upcomingBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2.5 font-semibold rounded-t-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-[#151A20] text-amber-400 border-t-2 border-amber-400'
                : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Pending Pay Later ({pendingPayments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2.5 font-semibold rounded-t-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'completed'
                ? 'bg-[#151A20] text-[#C7F464] border-t-2 border-[#C7F464]'
                : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed Matches ({completedBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-4 py-2.5 font-semibold rounded-t-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'cancelled'
                ? 'bg-[#151A20] text-rose-400 border-t-2 border-rose-400'
                : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled ({cancelledBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 font-semibold rounded-t-xl transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-[#151A20] text-[#C7F464] border-t-2 border-[#C7F464]'
                : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Player Settings</span>
          </button>
        </div>

        {/* Tab 1: Upcoming Bookings */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingBookings.length === 0 ? (
              <div className="p-12 text-center bg-[#111519] border border-[#242C33] rounded-3xl space-y-4">
                <Calendar className="w-10 h-10 text-[#242C33] mx-auto" />
                <h3 className="text-base font-bold text-[#F4F5F3]">No upcoming sessions booked</h3>
                <p className="text-xs text-[#9BA3A8] max-w-sm mx-auto">
                  Reserve a court to practice your smashes and footwork. Slots are open from 6:00 AM to 11:00 PM.
                </p>
                <button
                  onClick={() => setActiveNav('book')}
                  className="px-5 py-2.5 bg-[#C7F464] text-[#080A0C] font-bold text-xs rounded-xl shadow-lg hover:bg-[#b8e855] transition-colors"
                >
                  Book a Court Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-5 rounded-2xl bg-[#111519] border border-[#242C33] hover:border-[#C7F464]/50 transition-all space-y-4 shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[11px] font-mono text-[#C7F464] font-bold">
                          {booking.bookingRef}
                        </span>
                        <h4 className="text-base font-bold text-[#F4F5F3] mt-0.5">
                          {booking.courtName}
                        </h4>
                      </div>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase ${
                          booking.paymentStatus === 'paid'
                            ? 'bg-[#C7F464]/10 text-[#C7F464] border border-[#C7F464]/30'
                            : 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                        }`}
                      >
                        {booking.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#151A20] border border-[#242C33] space-y-1.5 text-xs text-[#9BA3A8]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#C7F464]" />
                          <span>Date</span>
                        </span>
                        <span className="text-[#F4F5F3] font-medium">{booking.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#C7F464]" />
                          <span>Session Time</span>
                        </span>
                        <span className="text-[#F4F5F3] font-medium">{booking.timeSlot}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-[#C7F464]" />
                          <span>Total Fee</span>
                        </span>
                        <span className="text-[#C7F464] font-mono font-bold">
                          ${booking.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Booking actions */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        onClick={() => setSelectedBookingForReceipt(booking)}
                        className="flex items-center gap-1.5 text-xs text-[#9BA3A8] hover:text-[#F4F5F3] transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Receipt</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {booking.paymentStatus === 'pending' && (
                          <button
                            onClick={() => markBookingPaid(booking.id)}
                            className="px-3 py-1.5 bg-[#C7F464] text-[#080A0C] font-semibold text-xs rounded-lg hover:bg-[#b8e855] transition-colors"
                          >
                            Pay Now (${booking.totalAmount.toFixed(2)})
                          </button>
                        )}
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Pending Payments */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingPayments.length === 0 ? (
              <div className="p-12 text-center bg-[#111519] border border-[#242C33] rounded-3xl space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#C7F464] mx-auto" />
                <h3 className="text-base font-bold text-[#F4F5F3]">All bookings are fully paid</h3>
                <p className="text-xs text-[#9BA3A8]">You have zero pending payments at this time.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Pay Later reservations can be cleared here online or settled at the arena reception counter before match kickoff.
                  </span>
                </div>
                {pendingPayments.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-5 rounded-2xl bg-[#111519] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          {booking.bookingRef}
                        </span>
                        <span className="text-xs text-[#9BA3A8]">·</span>
                        <span className="text-xs font-medium text-[#F4F5F3]">
                          {booking.courtName}
                        </span>
                      </div>
                      <p className="text-xs text-[#9BA3A8] mt-1">
                        {booking.date} · {booking.timeSlot}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs text-[#9BA3A8] block">Due Amount</span>
                        <span className="text-lg font-mono font-bold text-[#F4F5F3]">
                          ${booking.totalAmount.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => markBookingPaid(booking.id)}
                        className="px-4 py-2 bg-[#C7F464] text-[#080A0C] font-bold text-xs rounded-xl hover:bg-[#b8e855] transition-colors"
                      >
                        Demo Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Completed Bookings */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            {completedBookings.length === 0 ? (
              <div className="p-12 text-center bg-[#111519] border border-[#242C33] rounded-3xl space-y-2">
                <p className="text-sm text-[#9BA3A8]">No completed matches recorded yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-5 rounded-2xl bg-[#111519] border border-[#242C33] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#9BA3A8]">
                        {booking.bookingRef}
                      </span>
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed Match</span>
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#F4F5F3]">{booking.courtName}</h4>
                    <p className="text-xs text-[#9BA3A8]">
                      {booking.date} · {booking.timeSlot} · ${booking.totalAmount.toFixed(2)}
                    </p>
                    <button
                      onClick={() => setSelectedBookingForReceipt(booking)}
                      className="text-xs text-[#C7F464] hover:underline pt-1 block"
                    >
                      View Past Receipt
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Cancelled Bookings */}
        {activeTab === 'cancelled' && (
          <div className="space-y-4">
            {cancelledBookings.length === 0 ? (
              <div className="p-12 text-center bg-[#111519] border border-[#242C33] rounded-3xl space-y-2">
                <p className="text-sm text-[#9BA3A8]">No cancelled bookings.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cancelledBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-5 rounded-2xl bg-[#111519] border border-rose-900/30 space-y-2 opacity-80"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#9BA3A8]">{booking.bookingRef}</span>
                      <span className="text-xs text-rose-400 font-semibold">Cancelled & Slot Released</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#F4F5F3]">{booking.courtName}</h4>
                    <p className="text-xs text-[#9BA3A8]">
                      {booking.date} · {booking.timeSlot}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Profile Editor */}
        {activeTab === 'profile' && (
          <div className="bg-[#111519] border border-[#242C33] rounded-3xl p-6 sm:p-8 max-w-2xl shadow-xl">
            <h3 className="text-lg font-bold text-[#F4F5F3] font-display mb-4">
              Edit Player Preferences
            </h3>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#9BA3A8] font-medium mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
                />
              </div>

              <div>
                <label className="block text-[#9BA3A8] font-medium mb-1">Playing Style</label>
                <input
                  type="text"
                  value={playStyle}
                  onChange={(e) => setPlayStyle(e.target.value)}
                  className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
                  placeholder="e.g. Aggressive Smasher, Net Specialist"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9BA3A8] font-medium mb-1">Skill Tier</label>
                  <select
                    value={skillLevel}
                    onChange={(e: any) => setSkillLevel(e.target.value)}
                    className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Tournament Pro">Tournament Pro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#9BA3A8] font-medium mb-1">Favourite Court</label>
                  <select
                    value={preferredCourt}
                    onChange={(e) => setPreferredCourt(e.target.value)}
                    className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
                  >
                    {courts.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#9BA3A8] font-medium mb-1">Preferred Time of Play</label>
                <input
                  type="text"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
                  placeholder="e.g. 18:00 - 21:00"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#C7F464] text-[#080A0C] font-bold text-xs rounded-xl hover:bg-[#b8e855] transition-colors"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal Receipt Viewer */}
        {selectedBookingForReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#111519] border border-[#242C33] rounded-2xl max-w-md w-full p-6 text-left shadow-2xl relative space-y-4">
              <button
                onClick={() => setSelectedBookingForReceipt(null)}
                className="absolute top-4 right-4 text-[#9BA3A8] hover:text-[#F4F5F3]"
              >
                ✕
              </button>
              <div className="border-b border-[#242C33] pb-3">
                <span className="text-[11px] font-mono text-[#C7F464]">
                  {selectedBookingForReceipt.bookingRef}
                </span>
                <h4 className="text-base font-bold text-[#F4F5F3]">Demo Booking Receipt</h4>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#9BA3A8]">
                  <span>Court:</span>
                  <span className="text-[#F4F5F3] font-medium">
                    {selectedBookingForReceipt.courtName}
                  </span>
                </div>
                <div className="flex justify-between text-[#9BA3A8]">
                  <span>Date & Time:</span>
                  <span className="text-[#F4F5F3] font-medium">
                    {selectedBookingForReceipt.date} · {selectedBookingForReceipt.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between text-[#9BA3A8]">
                  <span>Payment Mode:</span>
                  <span className="text-[#F4F5F3] font-medium uppercase">
                    {selectedBookingForReceipt.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between text-[#9BA3A8]">
                  <span>Payment Status:</span>
                  <span
                    className={`font-semibold uppercase ${
                      selectedBookingForReceipt.paymentStatus === 'paid'
                        ? 'text-[#C7F464]'
                        : 'text-amber-400'
                    }`}
                  >
                    {selectedBookingForReceipt.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#242C33] text-sm font-bold text-[#F4F5F3]">
                  <span>Total Amount:</span>
                  <span className="text-[#C7F464] font-mono">
                    ${selectedBookingForReceipt.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 text-xs bg-[#191F24] hover:bg-[#20272D] text-[#F4F5F3] rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedBookingForReceipt(null)}
                  className="px-4 py-2 text-xs bg-[#C7F464] text-[#080A0C] font-semibold rounded-lg hover:bg-[#b8e855] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
