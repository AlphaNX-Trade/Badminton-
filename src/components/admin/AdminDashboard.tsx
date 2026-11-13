import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Court, SurfaceType, CourtStatus, CoachingLevel, TournamentFormat } from '../../types';
import { getTodayStr, TIME_SLOTS } from '../../data/initialData';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Layers,
  Wrench,
  Calendar,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  AlertTriangle,
  Sparkles,
  Settings,
  Trophy,
  BookOpen,
  ArrowUpRight,
  ShieldAlert,
  Trash2,
  Edit2,
  UserCheck,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    courts,
    addCourt,
    updateCourt,
    deleteCourt,
    toggleCourtStatus,
    bookings,
    cancelBooking,
    markBookingPaid,
    checkInBooking,
    coachingBatches,
    createBatch,
    addStudentToBatch,
    removeStudentFromBatch,
    tournaments,
    createTournament,
    settings,
    updateSettings,
    selectedDate,
    setSelectedDate,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'courts' | 'bookings' | 'batches' | 'tournaments' | 'maintenance' | 'reports' | 'settings'
  >('overview');

  // Search & filter for bookings table
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');

  // Modal states
  const [showAddCourtModal, setShowAddCourtModal] = useState(false);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [showCreateTournamentModal, setShowCreateTournamentModal] = useState(false);
  const [selectedBatchForStudents, setSelectedBatchForStudents] = useState<string | null>(null);

  // New Court form state
  const [newCourtName, setNewCourtName] = useState('');
  const [newCourtSurface, setNewCourtSurface] = useState<SurfaceType>('BWF Synthetic Mat');
  const [newCourtPrice, setNewCourtPrice] = useState(700);
  const [newCourtBadge, setNewCourtBadge] = useState('Expansion Court');
  const [newCourtDesc, setNewCourtDesc] = useState('Championship synthetic playing surface.');

  // New Batch form state
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchLevel, setNewBatchLevel] = useState<CoachingLevel>('Intermediate');
  const [newBatchCoach, setNewBatchCoach] = useState('Coach Vikram Rao');
  const [newBatchCoachTitle, setNewBatchCoachTitle] = useState('Head Academy Coach');
  const [newBatchCourtId, setNewBatchCourtId] = useState(courts[0]?.id || 'court-1');
  const [newBatchDays, setNewBatchDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [newBatchStartHour, setNewBatchStartHour] = useState(7);
  const [newBatchFee, setNewBatchFee] = useState(3500);
  const [newBatchCapacity, setNewBatchCapacity] = useState(8);

  // Student addition state
  const [studentNameInput, setStudentNameInput] = useState('');
  const [studentEmailInput, setStudentEmailInput] = useState('');

  // New Tournament form state
  const [newTrnName, setNewTrnName] = useState('');
  const [newTrnFormat, setNewTrnFormat] = useState<TournamentFormat>('Singles Knockout');
  const [newTrnDate, setNewTrnDate] = useState(getTodayStr(14));
  const [newTrnFee, setNewTrnFee] = useState(800);
  const [newTrnPrize, setNewTrnPrize] = useState('₹50,000 Cash Pool');
  const [newTrnSlots, setNewTrnSlots] = useState(32);
  const [newTrnSkill, setNewTrnSkill] = useState('Open Category');

  // Computed Analytics
  const analytics = useMemo(() => {
    const today = getTodayStr(0);
    const activeCourtsCount = courts.filter((c) => c.status === 'active').length;

    const confirmedBookings = bookings.filter((b) => b.bookingStatus !== 'cancelled');
    const todayBookings = confirmedBookings.filter((b) => b.date === today);
    const todayRevenue = todayBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const unpaidBookings = bookings.filter(
      (b) => b.paymentStatus === 'pending' && b.bookingStatus !== 'cancelled'
    );

    const totalAllBookings = bookings.length;
    const cancelledCount = bookings.filter((b) => b.bookingStatus === 'cancelled').length;
    const cancellationRate =
      totalAllBookings > 0 ? Math.round((cancelledCount / totalAllBookings) * 100) : 0;

    // Occupancy % today: total slots across active courts = activeCourts * 17 slots
    const totalSlotsToday = Math.max(1, activeCourtsCount * 17);
    const occupancyPercent = Math.min(100, Math.round((todayBookings.length / totalSlotsToday) * 100));

    // Most popular court
    let popularCourt = courts[0]?.name.split('—')[0] || 'Court 01';
    let maxBookings = -1;
    courts.forEach((c) => {
      if (c.totalBookings > maxBookings) {
        maxBookings = c.totalBookings;
        popularCourt = c.name.split('—')[0];
      }
    });

    return {
      totalCourts: courts.length,
      activeCourtsCount,
      todayBookingsCount: todayBookings.length,
      todayRevenue,
      monthlyBookingsCount: confirmedBookings.length,
      monthlyRevenue: totalRevenue,
      unpaidCount: unpaidBookings.length,
      cancellationRate,
      occupancyPercent,
      popularCourt,
    };
  }, [courts, bookings]);

  // Filtered Bookings for Table
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.bookingRef.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.courtName.toLowerCase().includes(bookingSearch.toLowerCase());

      const matchStatus =
        bookingStatusFilter === 'all'
          ? true
          : bookingStatusFilter === 'paid'
          ? b.paymentStatus === 'paid'
          : bookingStatusFilter === 'pending'
          ? b.paymentStatus === 'pending'
          : bookingStatusFilter === 'cancelled'
          ? b.bookingStatus === 'cancelled'
          : true;

      return matchSearch && matchStatus;
    });
  }, [bookings, bookingSearch, bookingStatusFilter]);

  // CSV Generator
  const handleExportCSV = () => {
    const headers = 'BookingRef,Court,Date,TimeSlot,CustomerName,Amount,PaymentMethod,PaymentStatus,BookingStatus\n';
    const rows = bookings
      .map(
        (b) =>
          `"${b.bookingRef}","${b.courtName}","${b.date}","${b.timeSlot}","${b.customerName}",${b.totalAmount},"${b.paymentMethod}","${b.paymentStatus}","${b.bookingStatus}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ARS_Badminton_Arena_Bookings_${getTodayStr(0)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateCourtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourtName.trim()) return;

    addCourt({
      name: newCourtName.trim(),
      surfaceType: newCourtSurface,
      badge: newCourtBadge,
      pricePerHour: Number(newCourtPrice),
      status: 'active',
      imageAlt: `${newCourtName} playing surface`,
      amenities: [
        'BWF Standard Shock Absorption',
        '1,000 Lux LED Floodlights',
        'Direct Locker Access',
        'Court Camera Feed',
      ],
      description: newCourtDesc,
    });

    setShowAddCourtModal(false);
    setNewCourtName('');
  };

  const handleCreateBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchName.trim()) return;

    const courtObj = courts.find((c) => c.id === newBatchCourtId);
    const startStr = `${newBatchStartHour.toString().padStart(2, '0')}:00`;
    const endStr = `${(newBatchStartHour + 1).toString().padStart(2, '0')}:00`;

    createBatch({
      name: newBatchName.trim(),
      level: newBatchLevel,
      coachName: newBatchCoach,
      coachTitle: newBatchCoachTitle,
      courtId: newBatchCourtId,
      courtName: courtObj?.name || 'Court 01',
      days: newBatchDays,
      timeSlot: `${startStr} - ${endStr}`,
      startHour: newBatchStartHour,
      startDate: getTodayStr(0),
      endDate: getTodayStr(60),
      capacity: Number(newBatchCapacity),
      monthlyFee: Number(newBatchFee),
    });

    setShowAddBatchModal(false);
    setNewBatchName('');
  };

  const handleCreateTournamentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrnName.trim()) return;

    createTournament({
      name: newTrnName.trim(),
      format: newTrnFormat,
      date: newTrnDate,
      venue: 'ARS Badminton Arena — Championship Courts',
      entryFee: Number(newTrnFee),
      prizePool: newTrnPrize,
      totalSlots: Number(newTrnSlots),
      registrationOpen: true,
      skillBracket: newTrnSkill,
      description: 'Official arena tournament with certified referees.',
    });

    setShowCreateTournamentModal(false);
    setNewTrnName('');
  };

  return (
    <div className="py-10 bg-[#080A0C] min-h-screen text-left transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E252C] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#C7F464] uppercase tracking-wider">
                ARS Badminton Arena Control Suite
              </span>
              <span className="text-[10px] text-[#9BA3A8] bg-[#151A20] px-2 py-0.5 rounded border border-[#242C33]">
                Live Browser Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F5F3] font-display mt-1">
              Operations & Facility Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-[#151A20] hover:bg-[#1C232A] text-[#F4F5F3] border border-[#242C33] rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-[#C7F464]" />
              <span>Export Bookings CSV</span>
            </button>
            <button
              onClick={() => setShowAddCourtModal(true)}
              className="px-4 py-2 bg-[#C7F464] hover:bg-[#b8e855] text-[#080A0C] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-[#C7F464]/10"
            >
              <Plus className="w-4 h-4" />
              <span>Add Court</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#242C33] overflow-x-auto pb-1 text-xs">
          {[
            { id: 'overview', label: 'Overview & Charts', icon: <BarChart3 className="w-3.5 h-3.5" /> },
            { id: 'courts', label: `Courts (${courts.length})`, icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'bookings', label: `Bookings Master (${bookings.length})`, icon: <Calendar className="w-3.5 h-3.5" /> },
            { id: 'batches', label: `Coaching Batches (${coachingBatches.length})`, icon: <BookOpen className="w-3.5 h-3.5" /> },
            { id: 'tournaments', label: `Tournaments (${tournaments.length})`, icon: <Trophy className="w-3.5 h-3.5" /> },
            { id: 'settings', label: 'Facility Settings', icon: <Settings className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2.5 font-semibold rounded-t-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                activeAdminTab === tab.id
                  ? 'bg-[#151A20] text-[#C7F464] border-t-2 border-[#C7F464]'
                  : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 1. OVERVIEW & CHARTS */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="p-4 rounded-2xl bg-[#111519] border border-[#242C33] space-y-1">
                <span className="text-[11px] text-[#9BA3A8] uppercase tracking-wider block">
                  Total Courts
                </span>
                <p className="text-2xl font-bold font-mono text-[#F4F5F3] tabular-nums">
                  {analytics.totalCourts}
                </p>
                <span className="text-[11px] text-[#C7F464]">
                  {analytics.activeCourtsCount} Active & Live
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#111519] border border-[#242C33] space-y-1">
                <span className="text-[11px] text-[#9BA3A8] uppercase tracking-wider block">
                  Today's Bookings
                </span>
                <p className="text-2xl font-bold font-mono text-[#F4F5F3] tabular-nums">
                  {analytics.todayBookingsCount}
                </p>
                <span className="text-[11px] text-[#9BA3A8]">60-min slots reserved</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#111519] border border-[#242C33] space-y-1">
                <span className="text-[11px] text-[#9BA3A8] uppercase tracking-wider block">
                  Today's Revenue
                </span>
                <p className="text-2xl font-bold font-mono text-[#C7F464] tabular-nums">
                  ₹{analytics.todayRevenue.toFixed(0)}
                </p>
                <span className="text-[11px] text-[#9BA3A8]">From today's matches</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#111519] border border-[#242C33] space-y-1">
                <span className="text-[11px] text-[#9BA3A8] uppercase tracking-wider block">
                  Monthly Revenue
                </span>
                <p className="text-2xl font-bold font-mono text-[#F4F5F3] tabular-nums">
                  ₹{analytics.monthlyRevenue.toFixed(0)}
                </p>
                <span className="text-[11px] text-[#9BA3A8]">All active bookings</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#111519] border border-[#242C33] space-y-1">
                <span className="text-[11px] text-[#9BA3A8] uppercase tracking-wider block">
                  Court Occupancy
                </span>
                <p className="text-2xl font-bold font-mono text-[#C7F464] tabular-nums">
                  {analytics.occupancyPercent}%
                </p>
                <span className="text-[11px] text-[#9BA3A8]">Based on operating hours</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#111519] border border-[#242C33] space-y-1">
                <span className="text-[11px] text-[#9BA3A8] uppercase tracking-wider block">
                  Unpaid (Pay Later)
                </span>
                <p className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  {analytics.unpaidCount}
                </p>
                <span className="text-[11px] text-[#9BA3A8]">Collect at desk</span>
              </div>
            </div>

            {/* Interactive Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Hourly Court Traffic & Heatmap Curve */}
              <div className="bg-[#111519] border border-[#242C33] rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#F4F5F3]">Peak-Hour Demand Heatmap</h3>
                    <p className="text-xs text-[#9BA3A8]">
                      Hourly booking distribution across all 17 session slots (6:00 AM – 11:00 PM)
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#C7F464] bg-[#151A20] px-2.5 py-1 rounded-md border border-[#242C33]">
                    Peak: 6 PM – 10 PM
                  </span>
                </div>

                {/* SVG Bar Chart */}
                <div className="h-56 w-full pt-4">
                  <svg viewBox="0 0 600 200" className="w-full h-full">
                    {/* Horizontal grid lines */}
                    <line x1="40" y1="20" x2="580" y2="20" stroke="#1E252C" strokeDasharray="3 3" />
                    <line x1="40" y1="70" x2="580" y2="70" stroke="#1E252C" strokeDasharray="3 3" />
                    <line x1="40" y1="120" x2="580" y2="120" stroke="#1E252C" strokeDasharray="3 3" />
                    <line x1="40" y1="170" x2="580" y2="170" stroke="#242C33" />

                    {/* Bars for 17 slots */}
                    {TIME_SLOTS.map((slot, i) => {
                      // Calculate mock density based on current bookings
                      const bookingsInHour = bookings.filter(
                        (b) => b.startHour === slot.startHour && b.bookingStatus !== 'cancelled'
                      ).length;

                      // Simulated weight curve: high in morning (7-9 AM) and evening (6-10 PM)
                      const baseWeight =
                        slot.startHour >= 18 && slot.startHour <= 21
                          ? 4.5
                          : slot.startHour >= 7 && slot.startHour <= 9
                          ? 3.2
                          : 1.5;
                      const finalHeight = Math.min(140, (baseWeight + bookingsInHour) * 22);

                      const x = 50 + i * 31;
                      const y = 170 - finalHeight;

                      const isPeak = slot.startHour >= 18 && slot.startHour <= 22;

                      return (
                        <g key={slot.id} className="group cursor-pointer">
                          <rect
                            x={x}
                            y={y}
                            width="20"
                            height={finalHeight}
                            rx="4"
                            fill={isPeak ? '#C7F464' : '#191F24'}
                            stroke={isPeak ? '#b8e855' : '#242C33'}
                            className="transition-all hover:opacity-80"
                          />
                          <text
                            x={x + 10}
                            y="188"
                            textAnchor="middle"
                            fill="#9BA3A8"
                            fontSize="9"
                            fontFamily="monospace"
                          >
                            {slot.startHour}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <div className="flex justify-between text-[11px] text-[#9BA3A8] px-2">
                  <span>6:00 AM (Early Bird)</span>
                  <span>12:00 PM (Noon)</span>
                  <span>11:00 PM (Night Sessions)</span>
                </div>
              </div>

              {/* Chart 2: Revenue & Court Utilization Breakdown */}
              <div className="bg-[#111519] border border-[#242C33] rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#F4F5F3]">Court Utilization & Share</h3>
                    <p className="text-xs text-[#9BA3A8]">Distribution of completed matches per court</p>
                  </div>
                  <span className="text-xs text-[#9BA3A8]">Top: {analytics.popularCourt}</span>
                </div>

                <div className="space-y-4 pt-2">
                  {courts.map((court) => {
                    const courtBookings = bookings.filter((b) => b.courtId === court.id).length;
                    const totalMatches = Math.max(1, bookings.length);
                    const pct = Math.round((courtBookings / totalMatches) * 100);

                    return (
                      <div key={court.id} className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="font-semibold text-[#F4F5F3]">{court.name}</span>
                          <span className="text-[#C7F464] font-mono font-bold">
                            {courtBookings} bookings ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#151A20] overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C7F464] to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(15, pct)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#1E252C] flex items-center justify-between text-xs text-[#9BA3A8]">
                  <span>Cancellation Rate: {analytics.cancellationRate}%</span>
                  <span>Payment Gateway: Simulation Mode Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. COURTS MANAGEMENT */}
        {activeAdminTab === 'courts' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#F4F5F3]">Facility Courts</h3>
                <p className="text-xs text-[#9BA3A8]">
                  Manage active courts, hourly pricing, and maintenance status. Changes update public booking availability immediately.
                </p>
              </div>
              <button
                onClick={() => setShowAddCourtModal(true)}
                className="px-4 py-2 bg-[#C7F464] text-[#080A0C] font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Court</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courts.map((court) => (
                <div
                  key={court.id}
                  className="p-6 rounded-2xl bg-[#111519] border border-[#242C33] space-y-4 shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-bold text-[#F4F5F3]">{court.name}</h4>
                      <p className="text-xs text-[#C7F464]">{court.surfaceType}</p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase ${
                        court.status === 'active'
                          ? 'bg-[#C7F464]/10 text-[#C7F464] border border-[#C7F464]/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {court.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#9BA3A8]">{court.description}</p>

                  <div className="p-3 rounded-xl bg-[#151A20] border border-[#242C33] space-y-2 text-xs">
                    <div className="flex justify-between text-[#9BA3A8]">
                      <span>Hourly Base Price:</span>
                      <span className="font-mono text-[#F4F5F3] font-bold">
                        ₹{court.pricePerHour}/hr
                      </span>
                    </div>
                    <div className="flex justify-between text-[#9BA3A8]">
                      <span>Completed Matches:</span>
                      <span className="font-mono text-[#F4F5F3]">{court.totalBookings}</span>
                    </div>
                    <div className="flex justify-between text-[#9BA3A8]">
                      <span>Average Rating:</span>
                      <span className="text-[#C7F464] font-bold">★ {court.rating}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    {court.status === 'active' ? (
                      <button
                        onClick={() => toggleCourtStatus(court.id, 'maintenance', 'Routine cleaning & net check')}
                        className="flex-1 py-2 text-xs font-semibold rounded-lg bg-[#191F24] hover:bg-amber-500/10 text-amber-400 border border-amber-500/30 transition-colors"
                      >
                        Set Maintenance
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleCourtStatus(court.id, 'active')}
                        className="flex-1 py-2 text-xs font-semibold rounded-lg bg-[#C7F464] text-[#080A0C] hover:bg-[#b8e855] transition-colors"
                      >
                        Activate Court
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const newPrice = prompt(`Enter new hourly price for ${court.name}:`, court.pricePerHour.toString());
                        if (newPrice && !isNaN(Number(newPrice))) {
                          updateCourt(court.id, { pricePerHour: Number(newPrice) });
                        }
                      }}
                      className="p-2 text-[#9BA3A8] hover:text-[#F4F5F3] hover:bg-[#191F24] rounded-lg transition-colors border border-[#242C33]"
                      title="Edit Price"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {courts.length > 3 && (
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${court.name}?`)) {
                            deleteCourt(court.id);
                          }
                        }}
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/30"
                        title="Delete Expansion Court"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. BOOKINGS MASTER TABLE */}
        {activeAdminTab === 'bookings' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111519] border border-[#242C33] rounded-2xl p-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#9BA3A8] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search customer, ref, court..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full bg-[#151A20] border border-[#242C33] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-[#9BA3A8] whitespace-nowrap">Filter Status:</span>
                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-xs text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
                >
                  <option value="all">All Bookings</option>
                  <option value="paid">Paid Only</option>
                  <option value="pending">Payment Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#111519] border border-[#242C33] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#151A20] border-b border-[#242C33] text-[#9BA3A8] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-4 py-3.5">Ref #</th>
                      <th className="px-4 py-3.5">Customer</th>
                      <th className="px-4 py-3.5">Court</th>
                      <th className="px-4 py-3.5">Date & Time</th>
                      <th className="px-4 py-3.5">Amount</th>
                      <th className="px-4 py-3.5">Payment</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E252C] text-[#F4F5F3]">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-[#9BA3A8]">
                          No bookings match your query.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#151A20]/60 transition-colors">
                          <td className="px-4 py-3.5 font-mono font-bold text-[#C7F464]">
                            {b.bookingRef}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-semibold block">{b.customerName}</span>
                            <span className="text-[11px] text-[#9BA3A8]">{b.customerEmail}</span>
                          </td>
                          <td className="px-4 py-3.5">{b.courtName.split('—')[0]}</td>
                          <td className="px-4 py-3.5">
                            <span>{b.date}</span>
                            <span className="text-[#9BA3A8] block text-[11px]">{b.timeSlot}</span>
                          </td>
                          <td className="px-4 py-3.5 font-mono font-bold">
                            ₹{b.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                b.paymentStatus === 'paid'
                                  ? 'bg-[#C7F464]/10 text-[#C7F464]'
                                  : 'bg-amber-400/10 text-amber-400'
                              }`}
                            >
                              {b.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                b.bookingStatus === 'confirmed'
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : b.bookingStatus === 'completed'
                                  ? 'bg-sky-500/10 text-sky-400'
                                  : 'bg-rose-500/10 text-rose-400'
                              }`}
                            >
                              {b.bookingStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-right space-x-2">
                            {b.bookingStatus === 'confirmed' && (
                              <>
                                {!b.checkedIn ? (
                                  <button
                                    onClick={() => checkInBooking(b.id)}
                                    className="px-2 py-1 rounded bg-[#191F24] hover:bg-[#20272D] text-[#C7F464] border border-[#242C33] text-[11px]"
                                    title="Check In Player"
                                  >
                                    Check In
                                  </button>
                                ) : (
                                  <span className="text-[11px] text-emerald-400 font-medium">Checked-in</span>
                                )}
                                {b.paymentStatus === 'pending' && (
                                  <button
                                    onClick={() => markBookingPaid(b.id)}
                                    className="px-2 py-1 rounded bg-[#C7F464] text-[#080A0C] font-bold text-[11px]"
                                    title="Mark as Paid"
                                  >
                                    Mark Paid
                                  </button>
                                )}
                                <button
                                  onClick={() => cancelBooking(b.id)}
                                  className="px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px]"
                                  title="Cancel Booking & Free Slot"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. COACHING & BATCH MANAGEMENT */}
        {activeAdminTab === 'batches' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#F4F5F3]">Coaching & Academy Batches</h3>
                <p className="text-xs text-[#9BA3A8]">
                  Scheduled recurring sessions automatically reserve mock court slots, preventing conflicting public customer bookings.
                </p>
              </div>
              <button
                onClick={() => setShowAddBatchModal(true)}
                className="px-4 py-2 bg-[#C7F464] text-[#080A0C] font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Batch</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coachingBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="p-6 rounded-2xl bg-[#111519] border border-[#242C33] space-y-4 shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        {batch.level}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#C7F464]">
                        ₹{batch.monthlyFee}/mo
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#F4F5F3]">{batch.name}</h4>
                    <p className="text-xs text-[#9BA3A8]">
                      Coach: <strong className="text-[#F4F5F3]">{batch.coachName}</strong> ({batch.coachTitle})
                    </p>

                    <div className="p-3 rounded-xl bg-[#151A20] border border-[#242C33] space-y-1.5 text-xs text-[#9BA3A8]">
                      <div className="flex justify-between">
                        <span>Court Reserved:</span>
                        <span className="text-[#F4F5F3] font-medium">{batch.courtName.split('—')[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Days & Time:</span>
                        <span className="text-[#C7F464] font-medium">
                          {batch.days.join(', ')} · {batch.timeSlot}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Enrolled Students:</span>
                        <span className="text-[#F4F5F3] font-medium">
                          {batch.enrolledStudents.length} / {batch.capacity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#1E252C] flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedBatchForStudents(batch.id)}
                      className="px-3 py-1.5 bg-[#191F24] hover:bg-[#20272D] text-[#F4F5F3] rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5 text-[#C7F464]" />
                      <span>Roster ({batch.enrolledStudents.length})</span>
                    </button>
                    <button
                      onClick={() => {
                        const sName = prompt(`Enter student name for ${batch.name}:`);
                        if (sName) {
                          addStudentToBatch(batch.id, sName, `${sName.toLowerCase().replace(/\s+/g, '.')}@email.com`);
                        }
                      }}
                      className="px-3 py-1.5 bg-[#C7F464] hover:bg-[#b8e855] text-[#080A0C] font-semibold rounded-lg text-xs transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Student</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. TOURNAMENTS */}
        {activeAdminTab === 'tournaments' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#F4F5F3]">Tournaments & Championships</h3>
                <p className="text-xs text-[#9BA3A8]">
                  Configure tournament dates, prize pools, and interactive knockout visual brackets.
                </p>
              </div>
              <button
                onClick={() => setShowCreateTournamentModal(true)}
                className="px-4 py-2 bg-[#C7F464] text-[#080A0C] font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Tournament</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tournaments.map((trn) => (
                <div
                  key={trn.id}
                  className="p-6 rounded-2xl bg-[#111519] border border-[#242C33] space-y-4 shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#C7F464] uppercase tracking-wider">
                        {trn.format}
                      </span>
                      <h4 className="text-lg font-bold text-[#F4F5F3] mt-0.5">{trn.name}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                      {trn.prizePool}
                    </span>
                  </div>

                  <p className="text-xs text-[#9BA3A8] leading-relaxed">{trn.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#151A20] border border-[#242C33]">
                      <span className="text-[11px] text-[#9BA3A8] block">Date & Venue</span>
                      <span className="text-[#F4F5F3] font-medium">{trn.date}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#151A20] border border-[#242C33]">
                      <span className="text-[11px] text-[#9BA3A8] block">Registration Fee</span>
                      <span className="text-[#C7F464] font-mono font-bold">₹{trn.entryFee} / entry</span>
                    </div>
                  </div>

                  {/* Visual Bracket Preview */}
                  {trn.matches.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-[#0E1216] border border-[#242C33] space-y-2">
                      <span className="text-[11px] font-semibold text-[#C7F464] uppercase tracking-wider block">
                        Live Bracket Preview (Quarter / Semi Finals)
                      </span>
                      <div className="space-y-1.5 text-xs">
                        {trn.matches.slice(0, 3).map((match) => (
                          <div
                            key={match.id}
                            className="flex items-center justify-between p-2 rounded bg-[#151A20] border border-[#242C33]"
                          >
                            <span className="text-[11px] text-[#9BA3A8]">{match.round}:</span>
                            <span className="font-medium text-[#F4F5F3]">
                              {match.player1} vs {match.player2}
                            </span>
                            {match.winner && (
                              <span className="text-[10px] text-[#C7F464] font-bold">
                                Winner: {match.winner}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. SETTINGS */}
        {activeAdminTab === 'settings' && (
          <div className="bg-[#111519] border border-[#242C33] rounded-3xl p-6 sm:p-8 max-w-2xl shadow-xl space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-lg font-bold text-[#F4F5F3] font-display">Facility & Pricing Rules</h3>
              <p className="text-xs text-[#9BA3A8]">
                Changes here dynamically recalculate prices and booking slot parameters throughout the application.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9BA3A8] mb-1">Facility Name</label>
                  <input
                    type="text"
                    value={settings.facilityName}
                    onChange={(e) => updateSettings({ facilityName: e.target.value })}
                    className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                  />
                </div>
                <div>
                  <label className="block text-[#9BA3A8] mb-1">Base Court Price (₹/hr)</label>
                  <input
                    type="number"
                    value={settings.baseCourtPrice}
                    onChange={(e) => updateSettings({ baseCourtPrice: Number(e.target.value) })}
                    className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#9BA3A8] mb-1">Peak Hours Multiplier</label>
                  <input
                    type="number"
                    step="0.05"
                    value={settings.peakMultiplier}
                    onChange={(e) => updateSettings({ peakMultiplier: Number(e.target.value) })}
                    className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                  />
                </div>
                <div>
                  <label className="block text-[#9BA3A8] mb-1">Cancellation Cutoff (Hours)</label>
                  <input
                    type="number"
                    value={settings.cancellationCutoffHours}
                    onChange={(e) => updateSettings({ cancellationCutoffHours: Number(e.target.value) })}
                    className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="allowPayLater"
                  checked={settings.allowPayLater}
                  onChange={(e) => updateSettings({ allowPayLater: e.target.checked })}
                  className="rounded accent-[#C7F464] w-4 h-4"
                />
                <label htmlFor="allowPayLater" className="text-xs text-[#F4F5F3]">
                  Enable "Pay Later at Reception" for customers
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add New Court */}
        {showAddCourtModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#111519] border border-[#242C33] rounded-2xl max-w-md w-full p-6 text-left shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#242C33] pb-3">
                <h3 className="text-base font-bold text-[#F4F5F3]">Add New Badminton Court</h3>
                <button
                  onClick={() => setShowAddCourtModal(false)}
                  className="text-[#9BA3A8] hover:text-[#F4F5F3]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCourtSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#9BA3A8] mb-1">Court Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Court 04 — Championship Arena"
                    value={newCourtName}
                    onChange={(e) => setNewCourtName(e.target.value)}
                    className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#9BA3A8] mb-1">Surface Type</label>
                    <select
                      value={newCourtSurface}
                      onChange={(e: any) => setNewCourtSurface(e.target.value)}
                      className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                    >
                      <option value="BWF Synthetic Mat">BWF Synthetic Mat</option>
                      <option value="Birch Hardwood Pro">Birch Hardwood Pro</option>
                      <option value="Hybrid High-Rebound">Hybrid High-Rebound</option>
                      <option value="Cushion Pro Court">Cushion Pro Court</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#9BA3A8] mb-1">Base Price (₹/hr)</label>
                    <input
                      type="number"
                      required
                      value={newCourtPrice}
                      onChange={(e) => setNewCourtPrice(Number(e.target.value))}
                      className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#9BA3A8] mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={newCourtBadge}
                    onChange={(e) => setNewCourtBadge(e.target.value)}
                    className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                    placeholder="e.g. Olympic Spec"
                  />
                </div>

                <div>
                  <label className="block text-[#9BA3A8] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newCourtDesc}
                    onChange={(e) => setNewCourtDesc(e.target.value)}
                    className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddCourtModal(false)}
                    className="flex-1 py-2 bg-[#191F24] text-[#9BA3A8] rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#C7F464] text-[#080A0C] font-bold rounded-xl"
                  >
                    Publish Court
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Coaching Batch */}
        {showAddBatchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#111519] border border-[#242C33] rounded-2xl max-w-md w-full p-6 text-left shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#242C33] pb-3">
                <h3 className="text-base font-bold text-[#F4F5F3]">Create Coaching Batch</h3>
                <button
                  onClick={() => setShowAddBatchModal(false)}
                  className="text-[#9BA3A8] hover:text-[#F4F5F3]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateBatchSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#9BA3A8] mb-1">Batch Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. High Performance Doubles Mastery"
                    value={newBatchName}
                    onChange={(e) => setNewBatchName(e.target.value)}
                    className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#9BA3A8] mb-1">Skill Level</label>
                    <select
                      value={newBatchLevel}
                      onChange={(e: any) => setNewBatchLevel(e.target.value)}
                      className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Junior Academy">Junior Academy</option>
                      <option value="Pro Training">Pro Training</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#9BA3A8] mb-1">Assign Court</label>
                    <select
                      value={newBatchCourtId}
                      onChange={(e) => setNewBatchCourtId(e.target.value)}
                      className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                    >
                      {courts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name.split('—')[0]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#9BA3A8] mb-1">Start Time (6 AM - 10 PM)</label>
                    <input
                      type="number"
                      min={6}
                      max={22}
                      value={newBatchStartHour}
                      onChange={(e) => setNewBatchStartHour(Number(e.target.value))}
                      className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#9BA3A8] mb-1">Monthly Fee (₹)</label>
                    <input
                      type="number"
                      value={newBatchFee}
                      onChange={(e) => setNewBatchFee(Number(e.target.value))}
                      className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddBatchModal(false)}
                    className="flex-1 py-2 bg-[#191F24] text-[#9BA3A8] rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#C7F464] text-[#080A0C] font-bold rounded-xl"
                  >
                    Create Batch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Student Roster View */}
        {selectedBatchForStudents && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#111519] border border-[#242C33] rounded-2xl max-w-lg w-full p-6 text-left shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#242C33] pb-3">
                <h3 className="text-base font-bold text-[#F4F5F3]">Enrolled Student Roster</h3>
                <button
                  onClick={() => setSelectedBatchForStudents(null)}
                  className="text-[#9BA3A8] hover:text-[#F4F5F3]"
                >
                  ✕
                </button>
              </div>

              {(() => {
                const b = coachingBatches.find((item) => item.id === selectedBatchForStudents);
                if (!b) return null;

                return (
                  <div className="space-y-4">
                    <p className="text-xs text-[#9BA3A8]">
                      Batch: <strong className="text-[#F4F5F3]">{b.name}</strong> ({b.courtName})
                    </p>

                    <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                      {b.enrolledStudents.length === 0 ? (
                        <p className="text-xs text-[#9BA3A8] py-4 text-center">
                          No students currently enrolled in this batch.
                        </p>
                      ) : (
                        b.enrolledStudents.map((st) => (
                          <div
                            key={st.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-[#151A20] border border-[#242C33] text-xs"
                          >
                            <div>
                              <p className="font-semibold text-[#F4F5F3]">{st.name}</p>
                              <p className="text-[11px] text-[#9BA3A8]">{st.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-[#C7F464] font-mono">
                                {st.attendancePercent}% Att.
                              </span>
                              <button
                                onClick={() => removeStudentFromBatch(b.id, st.id)}
                                className="text-rose-400 hover:text-rose-300 text-xs"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#1E252C] flex justify-end">
                      <button
                        onClick={() => setSelectedBatchForStudents(null)}
                        className="px-4 py-2 bg-[#191F24] text-[#F4F5F3] rounded-xl text-xs"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
