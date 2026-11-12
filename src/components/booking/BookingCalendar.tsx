import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Court, TimeSlot, SlotStatus, Booking } from '../../types';
import { TIME_SLOTS, getTodayStr } from '../../data/initialData';
import { CheckoutModal } from './CheckoutModal';
import { WaitlistModal } from './WaitlistModal';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Info,
  Layers,
  Wrench,
  BookOpen,
} from 'lucide-react';

export const BookingCalendar: React.FC = () => {
  const {
    courts,
    selectedDate,
    setSelectedDate,
    selectedCourtId,
    setSelectedCourtId,
    getSlotAvailability,
    settings,
  } = useApp();

  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [selectedSlot, setSelectedSlot] = useState<{ court: Court; slot: TimeSlot } | null>(null);

  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [waitlistTarget, setWaitlistTarget] = useState<{
    courtId: string;
    courtName: string;
    date: string;
    timeSlot: string;
    startHour: number;
  } | null>(null);

  // Filtered slots based on time period
  const filteredSlots = useMemo(() => {
    if (timeFilter === 'all') return TIME_SLOTS;
    return TIME_SLOTS.filter((s) => s.period === timeFilter);
  }, [timeFilter]);

  // Date manipulation helpers
  const handleDateShift = (deltaDays: number) => {
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + deltaDays);
    setSelectedDate(current.toISOString().split('T')[0]);
    setSelectedSlot(null);
  };

  const isToday = selectedDate === getTodayStr(0);
  const isTomorrow = selectedDate === getTodayStr(1);

  // Find next available slot helper
  const handleFindNextAvailable = () => {
    for (const slot of TIME_SLOTS) {
      for (const court of courts) {
        if (court.status === 'active') {
          const avail = getSlotAvailability(court.id, selectedDate, slot.startHour);
          if (avail.status === 'available') {
            setSelectedSlot({ court, slot });
            return;
          }
        }
      }
    }
    // If none today, check tomorrow
    handleDateShift(1);
  };

  const handleSlotClick = (court: Court, slot: TimeSlot) => {
    const avail = getSlotAvailability(court.id, selectedDate, slot.startHour);

    if (avail.status === 'available') {
      if (selectedSlot?.court.id === court.id && selectedSlot?.slot.id === slot.id) {
        setSelectedSlot(null); // deselect
      } else {
        setSelectedSlot({ court, slot });
      }
    } else if (avail.status === 'booked') {
      // Prompt for waitlist
      setWaitlistTarget({
        courtId: court.id,
        courtName: court.name,
        date: selectedDate,
        timeSlot: slot.time,
        startHour: slot.startHour,
      });
    }
  };

  // Courts to render (optionally filtered by court selector)
  const displayedCourts = useMemo(() => {
    if (!selectedCourtId) return courts;
    return courts.filter((c) => c.id === selectedCourtId);
  }, [courts, selectedCourtId]);

  return (
    <div className="space-y-6">
      {/* Top Controls: Date Selector + Filters */}
      <div className="bg-[#111519] border border-[#242C33] rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Date Selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleDateShift(-1)}
              className="p-2 rounded-xl bg-[#151A20] text-[#9BA3A8] hover:text-[#F4F5F3] hover:bg-[#191F24] border border-[#242C33] transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSelectedDate(getTodayStr(0));
                setSelectedSlot(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isToday
                  ? 'bg-[#C7F464] text-[#080A0C] border-[#C7F464]'
                  : 'bg-[#151A20] text-[#9BA3A8] hover:text-[#F4F5F3] border-[#242C33]'
              }`}
            >
              Today
            </button>

            <button
              onClick={() => {
                setSelectedDate(getTodayStr(1));
                setSelectedSlot(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isTomorrow
                  ? 'bg-[#C7F464] text-[#080A0C] border-[#C7F464]'
                  : 'bg-[#151A20] text-[#9BA3A8] hover:text-[#F4F5F3] border-[#242C33]'
              }`}
            >
              Tomorrow
            </button>

            {/* Custom Date Input */}
            <div className="relative flex items-center">
              <CalendarIcon className="w-3.5 h-3.5 text-[#C7F464] absolute left-3 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  if (e.target.value) {
                    setSelectedDate(e.target.value);
                    setSelectedSlot(null);
                  }
                }}
                className="bg-[#151A20] border border-[#242C33] rounded-xl pl-9 pr-3 py-1.5 text-xs font-medium text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
              />
            </div>

            <button
              onClick={() => handleDateShift(1)}
              className="p-2 rounded-xl bg-[#151A20] text-[#9BA3A8] hover:text-[#F4F5F3] hover:bg-[#191F24] border border-[#242C33] transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Time & Court Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Time of day segmented filter */}
            <div className="flex items-center gap-1 bg-[#151A20] p-1 rounded-xl border border-[#242C33] text-xs">
              <button
                onClick={() => setTimeFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  timeFilter === 'all'
                    ? 'bg-[#1E252C] text-[#F4F5F3] shadow-sm'
                    : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
                }`}
              >
                All Hours
              </button>
              <button
                onClick={() => setTimeFilter('morning')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  timeFilter === 'morning'
                    ? 'bg-[#1E252C] text-[#F4F5F3] shadow-sm'
                    : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
                }`}
              >
                Morning
              </button>
              <button
                onClick={() => setTimeFilter('afternoon')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  timeFilter === 'afternoon'
                    ? 'bg-[#1E252C] text-[#F4F5F3] shadow-sm'
                    : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
                }`}
              >
                Afternoon
              </button>
              <button
                onClick={() => setTimeFilter('evening')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  timeFilter === 'evening'
                    ? 'bg-[#1E252C] text-[#F4F5F3] shadow-sm'
                    : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
                }`}
              >
                Evening
              </button>
            </div>

            {/* Smart Next Available CTA */}
            <button
              onClick={handleFindNextAvailable}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#151A20] hover:bg-[#1C232A] text-[#C7F464] border border-[#C7F464]/30 rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next Open Slot</span>
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[#1E252C] text-xs text-[#9BA3A8]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-[#151A20] border border-[#242C33]" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-[#C7F464] border border-[#C7F464]" />
            <span className="text-[#F4F5F3] font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-rose-500/20 border border-rose-500/40" />
            <span>Booked (Click for Waitlist)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-purple-500/20 border border-purple-500/40" />
            <span>Coaching Batch</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-500/20 border border-amber-500/40" />
            <span>Maintenance</span>
          </div>
          <div className="ml-auto text-[11px] text-[#9BA3A8]">
            Operating Hours: {settings.openHour}:00 AM – {settings.closeHour % 12 || 12}:00 PM (60 min sessions)
          </div>
        </div>
      </div>

      {/* Timetable Matrix */}
      <div className="space-y-4">
        {displayedCourts.map((court) => {
          const isCourtMaintenance = court.status === 'maintenance' || court.status === 'inactive';

          return (
            <div
              key={court.id}
              className={`bg-[#111519] border rounded-2xl overflow-hidden transition-all shadow-lg ${
                isCourtMaintenance ? 'border-amber-500/40 opacity-80' : 'border-[#242C33]'
              }`}
            >
              {/* Court header bar */}
              <div className="p-4 bg-[#151A20] border-b border-[#242C33] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#191F24] border border-[#242C33] flex items-center justify-center text-[#C7F464] font-bold text-xs font-display">
                    {court.name.split('—')[0].replace('Court ', 'C')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#F4F5F3]">{court.name}</h4>
                      {court.badge && (
                        <span className="text-[10px] text-[#C7F464] border border-[#C7F464]/30 px-2 py-0.5 rounded-full bg-[#C7F464]/5 font-medium">
                          {court.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#9BA3A8] mt-0.5">
                      {court.surfaceType} · Base rate ${court.pricePerHour}/hr
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isCourtMaintenance ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Court Under Maintenance</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#9BA3A8]">
                      <span className="w-2 h-2 rounded-full bg-[#C7F464]" />
                      <span>Active & Available</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Slot grid */}
              <div className="p-4 overflow-x-auto">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 min-w-[700px] lg:min-w-0">
                  {filteredSlots.map((slot) => {
                    const avail = getSlotAvailability(court.id, selectedDate, slot.startHour);
                    const isSelected =
                      selectedSlot?.court.id === court.id && selectedSlot?.slot.id === slot.id;

                    const isPeak =
                      slot.startHour >= settings.peakHourStart && slot.startHour < settings.peakHourEnd;
                    const price = isPeak
                      ? Math.round(court.pricePerHour * settings.peakMultiplier)
                      : court.pricePerHour;

                    let slotStyle =
                      'bg-[#151A20] border-[#242C33] text-[#F4F5F3] hover:border-[#C7F464] hover:shadow-[0_0_12px_rgba(199,244,100,0.15)] cursor-pointer';
                    let statusLabel = `$${price}`;

                    if (avail.status === 'booked') {
                      slotStyle =
                        'bg-rose-950/20 border-rose-900/40 text-rose-300 hover:border-rose-500 cursor-pointer';
                      statusLabel = 'Booked';
                    } else if (avail.status === 'reserved') {
                      slotStyle =
                        'bg-purple-950/20 border-purple-900/40 text-purple-300 cursor-not-allowed';
                      statusLabel = 'Academy';
                    } else if (avail.status === 'maintenance' || isCourtMaintenance) {
                      slotStyle =
                        'bg-amber-950/20 border-amber-900/40 text-amber-300 cursor-not-allowed';
                      statusLabel = 'Service';
                    }

                    if (isSelected) {
                      slotStyle =
                        'bg-[#C7F464] border-[#C7F464] text-[#080A0C] font-bold shadow-[0_0_20px_rgba(199,244,100,0.3)] scale-[1.02]';
                      statusLabel = 'Selected';
                    }

                    return (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotClick(court, slot)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-150 relative ${slotStyle}`}
                        title={
                          avail.status === 'booked'
                            ? `Booked by ${avail.booking?.customerName}. Click to join waitlist.`
                            : avail.status === 'reserved'
                            ? `Reserved for ${avail.batch?.name}`
                            : `${slot.time} - $${price}/hr`
                        }
                      >
                        <span
                          className={`text-xs font-semibold ${
                            isSelected ? 'text-[#080A0C]' : 'text-[#F4F5F3]'
                          }`}
                        >
                          {slot.label}
                        </span>
                        <span
                          className={`text-[11px] mt-0.5 ${
                            isSelected
                              ? 'text-[#080A0C] font-bold'
                              : avail.status === 'available'
                              ? 'text-[#C7F464]'
                              : 'text-[#9BA3A8]'
                          }`}
                        >
                          {statusLabel}
                        </span>
                        {isPeak && avail.status === 'available' && !isSelected && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Selected Slot Bar */}
      {selectedSlot && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[92%] bg-[#111519]/95 border border-[#C7F464] rounded-2xl p-4 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C7F464] text-[#080A0C] flex items-center justify-center font-bold font-display text-sm">
              ✓
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F4F5F3]">{selectedSlot.court.name}</h4>
              <p className="text-xs text-[#9BA3A8]">
                {selectedDate} · <span className="text-[#C7F464]">{selectedSlot.slot.time}</span> (60 min)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setSelectedSlot(null)}
              className="text-xs text-[#9BA3A8] hover:text-[#F4F5F3] px-3 py-2"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-[#C7F464] hover:bg-[#b8e855] text-[#080A0C] font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(199,244,100,0.3)] transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Book This Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {selectedSlot && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => {
            setIsCheckoutOpen(false);
            setSelectedSlot(null);
          }}
          court={selectedSlot.court}
          date={selectedDate}
          slot={selectedSlot.slot}
        />
      )}

      {/* Waitlist Modal */}
      {waitlistTarget && (
        <WaitlistModal
          isOpen={!!waitlistTarget}
          onClose={() => setWaitlistTarget(null)}
          courtId={waitlistTarget.courtId}
          courtName={waitlistTarget.courtName}
          date={waitlistTarget.date}
          timeSlot={waitlistTarget.timeSlot}
          startHour={waitlistTarget.startHour}
        />
      )}
    </div>
  );
};
