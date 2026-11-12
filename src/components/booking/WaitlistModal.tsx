import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, BellRing, Sparkles, Check } from 'lucide-react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  courtId: string;
  courtName: string;
  date: string;
  timeSlot: string;
  startHour: number;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  courtId,
  courtName,
  date,
  timeSlot,
  startHour,
}) => {
  const { customerProfile, joinWaitlist } = useApp();
  const [name, setName] = useState(customerProfile.name);
  const [email, setEmail] = useState('alex.thorne@vortex.club');
  const [phone, setPhone] = useState('+1 (555) 492-1108');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    joinWaitlist({
      courtId,
      courtName,
      date,
      timeSlot,
      startHour,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#111519] border border-[#242C33] rounded-2xl max-w-md w-full p-6 text-left shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#9BA3A8] hover:text-[#F4F5F3] hover:bg-[#191F24] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#C7F464]/10 text-[#C7F464] mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#F4F5F3]">You're on the Waitlist!</h3>
            <p className="text-xs text-[#9BA3A8] max-w-xs mx-auto">
              If this slot is cancelled, you will be notified immediately via the notification center.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#191F24] text-[#C7F464]">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F4F5F3]">Join Slot Waitlist</h3>
                <p className="text-xs text-[#9BA3A8]">Get notified if this court slot frees up</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#151A20] border border-[#242C33] space-y-1 text-xs">
              <div className="flex justify-between text-[#9BA3A8]">
                <span>Court:</span>
                <span className="text-[#F4F5F3] font-medium">{courtName}</span>
              </div>
              <div className="flex justify-between text-[#9BA3A8]">
                <span>Date & Time:</span>
                <span className="text-[#C7F464] font-medium">{date} · {timeSlot}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#9BA3A8] mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#151A20] border border-[#242C33] rounded-lg px-3 py-2 text-xs text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9BA3A8] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#151A20] border border-[#242C33] rounded-lg px-3 py-2 text-xs text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9BA3A8] mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#151A20] border border-[#242C33] rounded-lg px-3 py-2 text-xs text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 text-xs font-medium text-[#9BA3A8] hover:text-[#F4F5F3] bg-[#191F24] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-xs font-bold text-[#080A0C] bg-[#C7F464] hover:bg-[#b8e855] rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Join Waitlist</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
