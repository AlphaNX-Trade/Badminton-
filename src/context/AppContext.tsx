import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  Court,
  Booking,
  CoachingBatch,
  Tournament,
  PlayerProfile,
  MembershipPlan,
  FacilitySettings,
  NotificationItem,
  WaitlistEntry,
  DemoRole,
  CourtStatus,
  SlotStatus,
} from '../types';
import {
  INITIAL_COURTS,
  INITIAL_BOOKINGS,
  INITIAL_BATCHES,
  INITIAL_TOURNAMENTS,
  INITIAL_PLAYERS,
  INITIAL_MEMBERSHIPS,
  INITIAL_SETTINGS,
  INITIAL_NOTIFICATIONS,
  getTodayStr,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // Navigation & Role
  activeNav: string;
  setActiveNav: (nav: string) => void;
  role: DemoRole;
  setRole: (role: DemoRole) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Courts
  courts: Court[];
  addCourt: (court: Omit<Court, 'id' | 'rating' | 'totalBookings'>) => void;
  updateCourt: (id: string, updates: Partial<Court>) => void;
  deleteCourt: (id: string) => void;
  toggleCourtStatus: (id: string, status: CourtStatus, maintenanceNote?: string) => void;

  // Bookings
  bookings: Booking[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedCourtId: string | null;
  setSelectedCourtId: (courtId: string | null) => void;
  createBooking: (newBooking: Omit<Booking, 'id' | 'bookingRef' | 'bookedAt'>) => Booking;
  cancelBooking: (bookingId: string) => void;
  rescheduleBooking: (bookingId: string, newDate: string, newTimeSlot: string, newStartHour: number) => void;
  markBookingPaid: (bookingId: string) => void;
  checkInBooking: (bookingId: string) => void;

  // Availability helper
  getSlotAvailability: (
    courtId: string,
    date: string,
    startHour: number
  ) => {
    status: SlotStatus;
    booking?: Booking;
    batch?: CoachingBatch;
  };

  // Coaching Batches
  coachingBatches: CoachingBatch[];
  createBatch: (batch: Omit<CoachingBatch, 'id' | 'enrolledStudents' | 'status'>) => void;
  addStudentToBatch: (batchId: string, studentName: string, studentEmail: string) => void;
  removeStudentFromBatch: (batchId: string, studentId: string) => void;

  // Tournaments
  tournaments: Tournament[];
  createTournament: (tournament: Omit<Tournament, 'id' | 'registeredCount' | 'matches'>) => void;
  registerForTournament: (tournamentId: string) => void;

  // Community / Players
  players: PlayerProfile[];
  customerProfile: PlayerProfile;
  updateProfile: (updates: Partial<PlayerProfile>) => void;
  sendChallenge: (toPlayerId: string) => void;
  respondToChallenge: (challengeId: string, action: 'accepted' | 'declined') => void;

  // Memberships
  memberships: MembershipPlan[];
  activeMembershipId: string;
  selectMembership: (planId: string) => void;

  // Waitlist
  waitlist: WaitlistEntry[];
  joinWaitlist: (entry: Omit<WaitlistEntry, 'id' | 'createdAt' | 'status'>) => void;

  // Settings
  settings: FacilitySettings;
  updateSettings: (updates: Partial<FacilitySettings>) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (title: string, message: string, type: NotificationItem['type']) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // Reset
  resetDemoData: () => void;
}

const STORAGE_KEY = 'ars_badminton_demo_v4_inr';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from local storage or defaults
  const loadState = <T,>(key: string, defaultVal: T): T => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return saved ? JSON.parse(saved) : defaultVal;
    } catch {
      return defaultVal;
    }
  };

  const [activeNav, setActiveNavState] = useState<string>('home');
  const [role, setRoleState] = useState<DemoRole>('customer');
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  const [courts, setCourts] = useState<Court[]>(() => loadState('courts', INITIAL_COURTS));
  const [bookings, setBookings] = useState<Booking[]>(() => loadState('bookings', INITIAL_BOOKINGS));
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr(0));
  const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);

  const [coachingBatches, setCoachingBatches] = useState<CoachingBatch[]>(() =>
    loadState('batches', INITIAL_BATCHES)
  );
  const [tournaments, setTournaments] = useState<Tournament[]>(() =>
    loadState('tournaments', INITIAL_TOURNAMENTS)
  );
  const [players, setPlayers] = useState<PlayerProfile[]>(() =>
    loadState('players', INITIAL_PLAYERS)
  );
  const [memberships] = useState<MembershipPlan[]>(INITIAL_MEMBERSHIPS);
  const [activeMembershipId, setActiveMembershipId] = useState<string>('mem-premium');
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() => loadState('waitlist', []));
  const [settings, setSettings] = useState<FacilitySettings>(() =>
    loadState('settings', INITIAL_SETTINGS)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadState('notifications', INITIAL_NOTIFICATIONS)
  );

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Current customer profile is the 3rd player ("Alex Thorne")
  const customerProfile = useMemo(() => {
    return players.find((p) => p.id === 'p-3') || players[0];
  }, [players]);

  // Sync dark class on html
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Persist key states
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_courts`, JSON.stringify(courts));
      localStorage.setItem(`${STORAGE_KEY}_bookings`, JSON.stringify(bookings));
      localStorage.setItem(`${STORAGE_KEY}_batches`, JSON.stringify(coachingBatches));
      localStorage.setItem(`${STORAGE_KEY}_tournaments`, JSON.stringify(tournaments));
      localStorage.setItem(`${STORAGE_KEY}_players`, JSON.stringify(players));
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_waitlist`, JSON.stringify(waitlist));
    } catch {
      // storage unavailable
    }
  }, [courts, bookings, coachingBatches, tournaments, players, settings, notifications, waitlist]);

  // Navigation setter with scroll to top
  const setActiveNav = (nav: string) => {
    setActiveNavState(nav);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setRole = (newRole: DemoRole) => {
    setRoleState(newRole);
    showToast(`Switched to ${newRole.toUpperCase()} View`, `Interface updated for ${newRole} capabilities`, 'info');
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toast handlers
  const showToast = (
    title: string,
    message?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Courts
  const addCourt = (courtData: Omit<Court, 'id' | 'rating' | 'totalBookings'>) => {
    const newCourt: Court = {
      ...courtData,
      id: `court-${Date.now()}`,
      rating: 5.0,
      totalBookings: 0,
    };
    setCourts((prev) => [...prev, newCourt]);
    showToast('Court Added Successfully', `${newCourt.name} is now live and bookable.`, 'success');
  };

  const updateCourt = (id: string, updates: Partial<Court>) => {
    setCourts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Court Updated', 'Facility changes saved.', 'info');
  };

  const deleteCourt = (id: string) => {
    setCourts((prev) => prev.filter((c) => c.id !== id));
    showToast('Court Removed', 'Court has been removed from the arena.', 'warning');
  };

  const toggleCourtStatus = (id: string, status: CourtStatus, maintenanceNote?: string) => {
    setCourts((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              maintenanceNote: maintenanceNote !== undefined ? maintenanceNote : c.maintenanceNote,
            }
          : c
      )
    );
    showToast(
      'Court Status Changed',
      `Court is now marked as ${status.toUpperCase()}`,
      status === 'maintenance' ? 'warning' : 'info'
    );
  };

  // Availability helper
  const getSlotAvailability = (
    courtId: string,
    date: string,
    startHour: number
  ): {
    status: SlotStatus;
    booking?: Booking;
    batch?: CoachingBatch;
  } => {
    const targetCourt = courts.find((c) => c.id === courtId);
    if (!targetCourt || targetCourt.status === 'maintenance' || targetCourt.status === 'inactive') {
      return { status: 'maintenance' };
    }

    // Check active booking (not cancelled)
    const existingBooking = bookings.find(
      (b) =>
        b.courtId === courtId &&
        b.date === date &&
        b.startHour === startHour &&
        b.bookingStatus !== 'cancelled'
    );

    if (existingBooking) {
      return { status: 'booked', booking: existingBooking };
    }

    // Check recurring coaching batch
    // Calculate day of week: Mon, Tue, Wed, Thu, Fri, Sat, Sun
    const d = new Date(date + 'T00:00:00');
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDayStr = dayNames[d.getDay()];

    const recurringBatch = coachingBatches.find(
      (batch) =>
        batch.courtId === courtId &&
        batch.days.includes(currentDayStr) &&
        batch.startHour === startHour
    );

    if (recurringBatch) {
      return { status: 'reserved', batch: recurringBatch };
    }

    return { status: 'available' };
  };

  // Bookings
  const createBooking = (newBookingData: Omit<Booking, 'id' | 'bookingRef' | 'bookedAt'>): Booking => {
    const randomRefNum = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `ARS-2026-${randomRefNum}`;
    const newBooking: Booking = {
      ...newBookingData,
      id: `booking-${Date.now()}`,
      bookingRef,
      bookedAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update court booking counter
    setCourts((prev) =>
      prev.map((c) =>
        c.id === newBooking.courtId ? { ...c, totalBookings: c.totalBookings + 1 } : c
      )
    );

    // Add notification
    addNotification(
      `Booking Confirmed: ${newBooking.courtName.split('—')[0]}`,
      `Session booked for ${newBooking.date} at ${newBooking.timeSlot}. Reference: ${bookingRef}`,
      'booking'
    );

    showToast(
      'Demo Booking Confirmed!',
      `${newBooking.courtName.split('—')[0]} reserved for ${newBooking.timeSlot}`,
      'success'
    );

    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, bookingStatus: 'cancelled' } : b))
    );

    // Notify waitlist if someone is waiting for this slot
    const waitlistMatch = waitlist.find(
      (w) =>
        w.courtId === target.courtId &&
        w.date === target.date &&
        w.startHour === target.startHour &&
        w.status === 'waiting'
    );

    if (waitlistMatch) {
      setWaitlist((prev) =>
        prev.map((w) => (w.id === waitlistMatch.id ? { ...w, status: 'notified' } : w))
      );
      addNotification(
        'Waitlist Slot Opened!',
        `A slot on ${target.courtName.split('—')[0]} (${target.date} ${target.timeSlot}) has freed up for ${waitlistMatch.customerName}!`,
        'waitlist'
      );
      showToast('Waitlist Alert Triggered', `Slot released to waiting player ${waitlistMatch.customerName}`, 'info');
    }

    addNotification(
      'Booking Cancelled',
      `Booking ${target.bookingRef} on ${target.courtName} has been cancelled and the slot is released.`,
      'cancellation'
    );

    showToast('Booking Cancelled', 'Slot has been freed and availability updated.', 'warning');
  };

  const rescheduleBooking = (
    bookingId: string,
    newDate: string,
    newTimeSlot: string,
    newStartHour: number
  ) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              date: newDate,
              timeSlot: newTimeSlot,
              startHour: newStartHour,
            }
          : b
      )
    );
    showToast('Booking Rescheduled', `Updated to ${newDate} at ${newTimeSlot}`, 'success');
  };

  const markBookingPaid = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, paymentStatus: 'paid' } : b))
    );
    showToast('Payment Verified', 'Booking marked as Paid.', 'success');
  };

  const checkInBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, checkedIn: true } : b))
    );
    showToast('Player Checked In', 'Court light activation & entrance granted.', 'success');
  };

  // Coaching
  const createBatch = (batchData: Omit<CoachingBatch, 'id' | 'enrolledStudents' | 'status'>) => {
    const newBatch: CoachingBatch = {
      ...batchData,
      id: `batch-${Date.now()}`,
      enrolledStudents: [],
      status: 'Open',
    };
    setCoachingBatches((prev) => [...prev, newBatch]);
    showToast('Coaching Batch Created', `${newBatch.name} is now open for enrollment.`, 'success');
  };

  const addStudentToBatch = (batchId: string, studentName: string, studentEmail: string) => {
    const student = {
      id: `s-${Date.now()}`,
      name: studentName,
      email: studentEmail,
      joinedDate: getTodayStr(0),
      attendancePercent: 100,
    };
    setCoachingBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          const updated = [...b.enrolledStudents, student];
          const isFull = updated.length >= b.capacity;
          return {
            ...b,
            enrolledStudents: updated,
            status: isFull ? 'Full' : updated.length >= b.capacity - 2 ? 'Filling Fast' : 'Open',
          };
        }
        return b;
      })
    );
    showToast('Student Enrolled', `${studentName} added to batch roster.`, 'success');
  };

  const removeStudentFromBatch = (batchId: string, studentId: string) => {
    setCoachingBatches((prev) =>
      prev.map((b) => {
        if (b.id === batchId) {
          const updated = b.enrolledStudents.filter((s) => s.id !== studentId);
          return {
            ...b,
            enrolledStudents: updated,
            status: updated.length >= b.capacity ? 'Full' : 'Open',
          };
        }
        return b;
      })
    );
    showToast('Student Removed', 'Batch roster updated.', 'info');
  };

  // Tournaments
  const createTournament = (
    tournamentData: Omit<Tournament, 'id' | 'registeredCount' | 'matches'>
  ) => {
    const newTrn: Tournament = {
      ...tournamentData,
      id: `trn-${Date.now()}`,
      registeredCount: 0,
      matches: [],
    };
    setTournaments((prev) => [newTrn, ...prev]);
    showToast('Tournament Published', `${newTrn.name} added to schedule.`, 'success');
  };

  const registerForTournament = (tournamentId: string) => {
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id === tournamentId) {
          return {
            ...t,
            registeredCount: Math.min(t.totalSlots, t.registeredCount + 1),
          };
        }
        return t;
      })
    );
    showToast('Tournament Registration Successful', 'You are officially registered for the tournament bracket!', 'success');
  };

  // Profile & Community
  const updateProfile = (updates: Partial<PlayerProfile>) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === 'p-3' ? { ...p, ...updates } : p))
    );
    showToast('Profile Updated', 'Your player preferences have been saved.', 'success');
  };

  const sendChallenge = (toPlayerId: string) => {
    const target = players.find((p) => p.id === toPlayerId);
    if (!target) return;
    showToast('Challenge Sent!', `Match request sent to ${target.name}. They will be notified.`, 'success');
  };

  const respondToChallenge = (challengeId: string, action: 'accepted' | 'declined') => {
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === 'p-3') {
          return {
            ...p,
            challenges: p.challenges.map((c) =>
              c.id === challengeId ? { ...c, status: action } : c
            ),
          };
        }
        return p;
      })
    );
    showToast(
      action === 'accepted' ? 'Challenge Accepted!' : 'Challenge Declined',
      action === 'accepted' ? 'Court booking suggested for the match.' : 'Challenge rejected.',
      action === 'accepted' ? 'success' : 'info'
    );
  };

  const selectMembership = (planId: string) => {
    setActiveMembershipId(planId);
    showToast('Membership Plan Selected', 'Your member perks and discounts have been activated.', 'success');
  };

  const joinWaitlist = (entryData: Omit<WaitlistEntry, 'id' | 'createdAt' | 'status'>) => {
    const newEntry: WaitlistEntry = {
      ...entryData,
      id: `wl-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'waiting',
    };
    setWaitlist((prev) => [newEntry, ...prev]);
    showToast('Added to Waitlist', `You'll be alerted immediately if this slot on ${entryData.courtName.split('—')[0]} opens.`, 'info');
  };

  const updateSettings = (updates: Partial<FacilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Settings Updated', 'Facility & pricing rules updated across all views.', 'success');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Notifications Cleared', 'All notifications marked as read.', 'info');
  };

  const addNotification = (title: string, message: string, type: NotificationItem['type']) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.clear();
    setCourts(INITIAL_COURTS);
    setBookings(INITIAL_BOOKINGS);
    setCoachingBatches(INITIAL_BATCHES);
    setTournaments(INITIAL_TOURNAMENTS);
    setPlayers(INITIAL_PLAYERS);
    setSettings(INITIAL_SETTINGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setWaitlist([]);
    setSelectedDate(getTodayStr(0));
    setSelectedCourtId(null);
    showToast('Demo Data Reset', 'Restored to clean initial facility state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeNav,
        setActiveNav,
        role,
        setRole,
        theme,
        toggleTheme,

        courts,
        addCourt,
        updateCourt,
        deleteCourt,
        toggleCourtStatus,

        bookings,
        selectedDate,
        setSelectedDate,
        selectedCourtId,
        setSelectedCourtId,
        createBooking,
        cancelBooking,
        rescheduleBooking,
        markBookingPaid,
        checkInBooking,
        getSlotAvailability,

        coachingBatches,
        createBatch,
        addStudentToBatch,
        removeStudentFromBatch,

        tournaments,
        createTournament,
        registerForTournament,

        players,
        customerProfile,
        updateProfile,
        sendChallenge,
        respondToChallenge,

        memberships,
        activeMembershipId,
        selectMembership,

        waitlist,
        joinWaitlist,

        settings,
        updateSettings,

        notifications,
        unreadNotificationCount,
        markNotificationRead,
        clearAllNotifications,
        addNotification,

        toasts,
        showToast,
        dismissToast,

        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
