export type SurfaceType = 'BWF Synthetic Mat' | 'Birch Hardwood Pro' | 'Hybrid High-Rebound' | 'Cushion Pro Court';

export type CourtStatus = 'active' | 'maintenance' | 'inactive';

export interface Court {
  id: string;
  name: string;
  surfaceType: SurfaceType;
  badge?: string;
  pricePerHour: number;
  status: CourtStatus;
  imageAlt: string;
  amenities: string[];
  rating: number;
  totalBookings: number;
  description: string;
  maintenanceNote?: string;
}

export type SlotStatus = 'available' | 'selected' | 'booked' | 'maintenance' | 'reserved';

export interface TimeSlot {
  id: string;
  time: string; // e.g. "06:00 - 07:00"
  startHour: number; // 6 to 22
  endHour: number; // 7 to 23
  label: string; // "6:00 AM"
  period: 'morning' | 'afternoon' | 'evening';
}

export type PaymentMethod = 'online_upi' | 'online_card' | 'online_netbanking' | 'pay_later';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed';

export interface BookingItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface Booking {
  id: string;
  bookingRef: string;
  courtId: string;
  courtName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  startHour: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  basePrice: number;
  addons: BookingItemAddon[];
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  bookedAt: string;
  checkedIn?: boolean;
}

export type CoachingLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Junior Academy' | 'Pro Training';

export interface BatchStudent {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  attendancePercent: number;
}

export interface CoachingBatch {
  id: string;
  name: string;
  level: CoachingLevel;
  coachName: string;
  coachTitle: string;
  courtId: string;
  courtName: string;
  days: string[]; // ['Mon', 'Wed', 'Fri']
  timeSlot: string; // "06:00 - 07:00"
  startHour: number;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledStudents: BatchStudent[];
  monthlyFee: number;
  status: 'Open' | 'Filling Fast' | 'Full';
}

export type TournamentFormat = 'Singles Knockout' | 'Doubles Knockout' | 'Mixed Doubles' | 'Round Robin League';

export interface BracketMatch {
  id: string;
  round: string; // "Quarter Finals", "Semi Finals", "Finals"
  player1: string;
  player2: string;
  score1?: string;
  score2?: string;
  winner?: string;
  scheduledTime: string;
}

export interface Tournament {
  id: string;
  name: string;
  format: TournamentFormat;
  date: string;
  venue: string;
  entryFee: number;
  prizePool: string;
  totalSlots: number;
  registeredCount: number;
  registrationOpen: boolean;
  skillBracket: string;
  description: string;
  matches: BracketMatch[];
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatarColor: string;
  initials: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Tournament Pro';
  playStyle: string;
  preferredCourt: string;
  preferredTime: string;
  matchesPlayed: number;
  winRate: number;
  loyaltyPoints: number;
  rank: number;
  challenges: {
    id: string;
    fromPlayerId: string;
    fromPlayerName: string;
    date: string;
    status: 'pending' | 'accepted' | 'declined';
  }[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  tier: 'Basic' | 'Premium' | 'Elite Pro';
  price: number;
  period: 'month' | 'quarter' | 'year';
  includedHours: number;
  courtDiscountPercent: number;
  features: string[];
  isPopular?: boolean;
}

export interface FacilitySettings {
  facilityName: string;
  address: string;
  phone: string;
  email: string;
  openHour: number; // 6
  closeHour: number; // 23
  slotDurationMinutes: number; // 60
  baseCourtPrice: number;
  peakHourStart: number; // 18 (6 PM)
  peakHourEnd: number; // 22 (10 PM)
  peakMultiplier: number; // 1.25
  weekendMultiplier: number; // 1.15
  allowPayLater: boolean;
  cancellationCutoffHours: number; // 4
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'booking' | 'reminder' | 'cancellation' | 'tournament' | 'batch' | 'system' | 'waitlist';
}

export interface WaitlistEntry {
  id: string;
  courtId: string;
  courtName: string;
  date: string;
  timeSlot: string;
  startHour: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  status: 'waiting' | 'notified';
}

export type DemoRole = 'customer' | 'admin' | 'coach' | 'reception';
