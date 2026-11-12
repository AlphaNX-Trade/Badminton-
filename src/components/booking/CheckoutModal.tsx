import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Court, TimeSlot, BookingItemAddon, Booking } from '../../types';
import {
  X,
  CreditCard,
  QrCode,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Tag,
  ShieldAlert,
  Printer,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  court: Court;
  date: string;
  slot: TimeSlot;
  onBookingComplete?: (booking: Booking) => void;
}

const AVAILABLE_ADDONS: BookingItemAddon[] = [
  { id: 'addon-racket', name: 'Yonex Astrox 88D Pro Racket Rental (Pair)', price: 10 },
  { id: 'addon-shuttles', name: 'Aerosensa 30 Tournament Feather Shuttles (3-Tube)', price: 15 },
  { id: 'addon-shoes', name: 'Non-Marking Pro Grip Court Shoes (Select Size)', price: 8 },
  { id: 'addon-camera', name: '4K Smart Video Replay & Match Analytics Recording', price: 12 },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  court,
  date,
  slot,
  onBookingComplete,
}) => {
  const { customerProfile, createBooking, settings, setActiveNav } = useApp();

  const [customerName, setCustomerName] = useState(customerProfile.name);
  const [customerEmail, setCustomerEmail] = useState('alex.thorne@vortex.club');
  const [customerPhone, setCustomerPhone] = useState('+1 (555) 492-1108');

  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const [paymentMode, setPaymentMode] = useState<'online' | 'pay_later'>('online');
  const [onlineMethod, setOnlineMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  // Calculate base price with peak hours multiplier if applicable
  const isPeak = slot.startHour >= settings.peakHourStart && slot.startHour < settings.peakHourEnd;
  const rawBase = court.pricePerHour;
  const baseCourtPrice = isPeak ? Math.round(rawBase * settings.peakMultiplier * 100) / 100 : rawBase;

  // Addons total
  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const item = AVAILABLE_ADDONS.find((a) => a.id === addonId);
    return sum + (item ? item.price : 0), 0;
  }, 0);

  // Discount calculation
  const subtotal = baseCourtPrice + addonsTotal;
  const discountAmount = promoApplied ? Math.round(subtotal * (discountPercent / 100) * 100) / 100 : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'SMASH20' || code === 'VORTEX20') {
      setDiscountPercent(20);
      setPromoApplied(true);
      setPromoError('');
    } else if (code === 'VIP10') {
      setDiscountPercent(10);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try "SMASH20" for 20% off demo discount.');
      setPromoApplied(false);
    }
  };

  const handleConfirmBooking = () => {
    setIsProcessing(true);

    const chosenAddons = AVAILABLE_ADDONS.filter((a) => selectedAddons.includes(a.id));

    setTimeout(() => {
      const newBooking = createBooking({
        courtId: court.id,
        courtName: court.name,
        date,
        timeSlot: slot.time,
        startHour: slot.startHour,
        customerName: customerName.trim() || 'Alex Thorne',
        customerEmail: customerEmail.trim() || 'alex.thorne@vortex.club',
        customerPhone: customerPhone.trim() || '+1 (555) 492-1108',
        basePrice: baseCourtPrice,
        addons: chosenAddons,
        discount: discountAmount,
        totalAmount,
        paymentMethod: paymentMode === 'pay_later' ? 'pay_later' : onlineMethod === 'upi' ? 'online_upi' : 'online_card',
        paymentStatus: paymentMode === 'pay_later' ? 'pending' : 'paid',
        bookingStatus: 'confirmed',
      });

      setIsProcessing(false);
      setConfirmedBooking(newBooking);
      if (onBookingComplete) {
        onBookingComplete(newBooking);
      }
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#111519] border border-[#242C33] rounded-2xl max-w-xl w-full p-6 text-left shadow-2xl relative my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242C33] shrink-0">
          <div>
            <span className="text-[11px] font-semibold text-[#C7F464] uppercase tracking-wider">
              {confirmedBooking ? 'Booking Confirmed' : 'Instant Checkout Demo'}
            </span>
            <h3 className="text-lg font-bold text-[#F4F5F3] font-display">
              {confirmedBooking ? 'Your Court Is Reserved' : 'Review & Confirm Reservation'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9BA3A8] hover:text-[#F4F5F3] hover:bg-[#191F24] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {confirmedBooking ? (
            /* Confirmation Receipt View */
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-[#151A20] border border-[#C7F464]/30 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#C7F464]/10 text-[#C7F464] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-[#F4F5F3]">Reservation Reference</h4>
                <p className="text-xl font-mono font-bold text-[#C7F464] tracking-wider">
                  {confirmedBooking.bookingRef}
                </p>
                <div className="inline-flex items-center gap-2 text-xs text-[#9BA3A8]">
                  <span>Status:</span>
                  <span
                    className={`font-semibold uppercase ${
                      confirmedBooking.paymentStatus === 'paid' ? 'text-[#C7F464]' : 'text-amber-400'
                    }`}
                  >
                    {confirmedBooking.paymentStatus === 'paid' ? 'Confirmed & Paid' : 'Confirmed · Payment Pending'}
                  </span>
                </div>
              </div>

              {/* Receipt details */}
              <div className="p-4 rounded-xl bg-[#0E1216] border border-[#242C33] space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#1E252C]">
                  <span className="text-[#9BA3A8]">Facility & Court</span>
                  <span className="text-[#F4F5F3] font-semibold">{confirmedBooking.courtName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E252C]">
                  <span className="text-[#9BA3A8]">Date & Time</span>
                  <span className="text-[#F4F5F3] font-medium">
                    {confirmedBooking.date} · {confirmedBooking.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E252C]">
                  <span className="text-[#9BA3A8]">Player</span>
                  <span className="text-[#F4F5F3] font-medium">{confirmedBooking.customerName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#1E252C]">
                  <span className="text-[#9BA3A8]">Payment Method</span>
                  <span className="text-[#F4F5F3] font-medium uppercase">
                    {confirmedBooking.paymentMethod.replace('_', ' ')}
                  </span>
                </div>
                {confirmedBooking.addons.length > 0 && (
                  <div className="py-1.5 border-b border-[#1E252C]">
                    <span className="text-[#9BA3A8] block mb-1">Equipment Add-ons:</span>
                    {confirmedBooking.addons.map((a) => (
                      <div key={a.id} className="flex justify-between text-[#9BA3A8]">
                        <span>· {a.name}</span>
                        <span>${a.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-between py-1.5 text-sm font-bold text-[#F4F5F3]">
                  <span>Total Amount Paid / Due</span>
                  <span className="text-[#C7F464] font-mono">${confirmedBooking.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* QR Code / Barcode simulation */}
              <div className="p-4 rounded-xl bg-[#151A20] border border-[#242C33] flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#F4F5F3]">Arena Gate Entry QR</p>
                  <p className="text-[11px] text-[#9BA3A8]">
                    Scan this code at the turnstile for automatic court light activation.
                  </p>
                </div>
                <div className="p-2 bg-white rounded-lg shrink-0">
                  <QrCode className="w-12 h-12 text-[#080A0C]" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-2.5 px-4 text-xs font-medium text-[#9BA3A8] hover:text-[#F4F5F3] bg-[#191F24] hover:bg-[#20272D] rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    setActiveNav('customer-dashboard');
                  }}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-[#080A0C] bg-[#C7F464] hover:bg-[#b8e855] rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>View in My Bookings</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <>
              {/* Summary card */}
              <div className="p-4 rounded-xl bg-[#151A20] border border-[#242C33] space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#F4F5F3]">{court.name}</h4>
                    <p className="text-xs text-[#C7F464] mt-0.5">{court.surfaceType}</p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#F4F5F3]">
                    ${baseCourtPrice.toFixed(2)} / hr
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#9BA3A8] pt-1 border-t border-[#1E252C]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C7F464]" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C7F464]" />
                    <span>{slot.time} (60 min)</span>
                  </div>
                  {isPeak && (
                    <span className="text-[11px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      Peak Rate
                    </span>
                  )}
                </div>
              </div>

              {/* Player details */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-[#F4F5F3] uppercase tracking-wider">
                  Player Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#9BA3A8] mb-1">Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-[#151A20] border border-[#242C33] rounded-lg px-3 py-2 text-xs text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
                      placeholder="e.g. Alex Thorne"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#9BA3A8] mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-[#151A20] border border-[#242C33] rounded-lg px-3 py-2 text-xs text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-[#9BA3A8] mb-1">Email Address</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-[#151A20] border border-[#242C33] rounded-lg px-3 py-2 text-xs text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
                      placeholder="alex.thorne@vortex.club"
                    />
                  </div>
                </div>
              </div>

              {/* Equipment Addons */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-[#F4F5F3] uppercase tracking-wider">
                    Equipment & Pro Add-ons
                  </h4>
                  <span className="text-[11px] text-[#9BA3A8]">Optional</span>
                </div>
                <div className="space-y-2">
                  {AVAILABLE_ADDONS.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <button
                        type="button"
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#151A20] border-[#C7F464] text-[#F4F5F3]'
                            : 'bg-[#0E1216] border-[#242C33] text-[#9BA3A8] hover:border-[#38434F]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded accent-[#C7F464]"
                          />
                          <span>{addon.name}</span>
                        </div>
                        <span className="font-mono font-medium text-[#F4F5F3] shrink-0">
                          +${addon.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Discount Promo Code */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#F4F5F3] uppercase tracking-wider">
                  Promo / Member Voucher
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#9BA3A8]" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder='Use code "SMASH20" for 20% off'
                      className="w-full bg-[#151A20] border border-[#242C33] rounded-lg pl-8 pr-3 py-2 text-xs text-[#F4F5F3] uppercase focus:outline-none focus:border-[#C7F464]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-[#191F24] hover:bg-[#20272D] text-[#C7F464] text-xs font-semibold rounded-lg transition-colors border border-[#242C33]"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-xs text-[#C7F464] flex items-center gap-1 mt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Coupon applied! 20% discount granted.</span>
                  </p>
                )}
                {promoError && <p className="text-xs text-rose-400 mt-1">{promoError}</p>}
              </div>

              {/* Payment Mode Selection */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold text-[#F4F5F3] uppercase tracking-wider">
                  Choose Payment Method (Demo)
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMode('online')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMode === 'online'
                        ? 'bg-[#151A20] border-[#C7F464] shadow-[0_0_15px_rgba(199,244,100,0.15)]'
                        : 'bg-[#0E1216] border-[#242C33] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-[#C7F464]" />
                      <span className="text-xs font-bold text-[#F4F5F3]">Pay Online Demo</span>
                    </div>
                    <p className="text-[11px] text-[#9BA3A8]">UPI QR / Credit / Debit / Netbanking</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMode('pay_later')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      paymentMode === 'pay_later'
                        ? 'bg-[#151A20] border-[#C7F464] shadow-[0_0_15px_rgba(199,244,100,0.15)]'
                        : 'bg-[#0E1216] border-[#242C33] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-[#F4F5F3]">Pay Later</span>
                    </div>
                    <p className="text-[11px] text-[#9BA3A8]">Reserve now, pay at reception desk</p>
                  </button>
                </div>

                {/* Online sub-options */}
                {paymentMode === 'online' && (
                  <div className="p-3 rounded-xl bg-[#0E1216] border border-[#242C33] space-y-2">
                    <span className="text-[11px] text-[#9BA3A8] block">Select Simulation Gateway:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setOnlineMethod('upi')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-colors ${
                          onlineMethod === 'upi'
                            ? 'bg-[#191F24] border-[#C7F464] text-[#C7F464]'
                            : 'bg-[#151A20] border-[#242C33] text-[#9BA3A8]'
                        }`}
                      >
                        UPI / Instant QR
                      </button>
                      <button
                        type="button"
                        onClick={() => setOnlineMethod('card')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-colors ${
                          onlineMethod === 'card'
                            ? 'bg-[#191F24] border-[#C7F464] text-[#C7F464]'
                            : 'bg-[#151A20] border-[#242C33] text-[#9BA3A8]'
                        }`}
                      >
                        Credit / Debit Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setOnlineMethod('netbanking')}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-colors ${
                          onlineMethod === 'netbanking'
                            ? 'bg-[#191F24] border-[#C7F464] text-[#C7F464]'
                            : 'bg-[#151A20] border-[#242C33] text-[#9BA3A8]'
                        }`}
                      >
                        Net Banking
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Price summary table */}
              <div className="p-4 rounded-xl bg-[#151A20] border border-[#242C33] space-y-2 text-xs">
                <div className="flex justify-between text-[#9BA3A8]">
                  <span>Court Fee ({slot.time})</span>
                  <span className="font-mono text-[#F4F5F3]">${baseCourtPrice.toFixed(2)}</span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex justify-between text-[#9BA3A8]">
                    <span>Equipment Add-ons</span>
                    <span className="font-mono text-[#F4F5F3]">+${addonsTotal.toFixed(2)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#C7F464]">
                    <span>Discount (20% SMASH20)</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-[#F4F5F3] pt-2 border-t border-[#242C33]">
                  <span>Total Amount</span>
                  <span className="font-mono text-[#C7F464] text-base">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-center gap-2 text-[11px] text-[#9BA3A8]">
                <ShieldAlert className="w-4 h-4 text-[#C7F464] shrink-0" />
                <span>
                  Demo Mode: No real financial charges will occur. State will be updated in real-time.
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        {!confirmedBooking && (
          <div className="pt-4 border-t border-[#242C33] flex gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="py-2.5 px-4 text-xs font-medium text-[#9BA3A8] hover:text-[#F4F5F3] bg-[#191F24] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmBooking}
              disabled={isProcessing}
              className="flex-1 py-2.5 px-4 text-xs font-bold text-[#080A0C] bg-[#C7F464] hover:bg-[#b8e855] rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(199,244,100,0.2)] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#080A0C] border-t-transparent rounded-full animate-spin" />
                  <span>Processing Demo Transaction...</span>
                </>
              ) : (
                <>
                  <span>
                    {paymentMode === 'online'
                      ? `Confirm & Pay $${totalAmount.toFixed(2)} (Demo)`
                      : 'Confirm Demo Booking (Pay Later)'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
