import React from 'react';
import { useApp } from '../../context/AppContext';
import { Court } from '../../types';
import { Check, ArrowRight, Star, Shield, Zap, Wrench } from 'lucide-react';

export const CourtShowcase: React.FC = () => {
  const { courts, setSelectedCourtId, setActiveNav } = useApp();

  const handleBookCourt = (courtId: string) => {
    setSelectedCourtId(courtId);
    setActiveNav('book');
  };

  return (
    <section id="courts-section" className="py-20 bg-[#080A0C] border-b border-[#1E252C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl text-left">
            <span className="text-xs font-semibold text-[#C7F464] uppercase tracking-wider block">
              Tournament Certified Arena Surfaces
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F5F3] font-display tracking-tight">
              ENGINEERED FOR CHAMPIONS.
            </h2>
            <p className="text-sm sm:text-base text-[#9BA3A8] leading-relaxed">
              Every court is meticulously constructed to international badminton standards. Multi-layer shock absorption prevents fatigue, while calibrated diffuse lighting guarantees unbroken shuttlecock tracking.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCourtId(null);
              setActiveNav('book');
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#C7F464] hover:text-[#d6f87d] transition-colors uppercase tracking-wider shrink-0"
          >
            <span>View All Schedules</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Court Grid (3 Initial, supports 4+ seamlessly) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courts.map((court, index) => {
            const isMaintenance = court.status === 'maintenance' || court.status === 'inactive';

            // Custom court background styling based on surface
            const surfaceColors = {
              'BWF Synthetic Mat': 'from-emerald-950/40 via-[#111519] to-[#111519]',
              'Birch Hardwood Pro': 'from-amber-950/30 via-[#111519] to-[#111519]',
              'Hybrid High-Rebound': 'from-sky-950/30 via-[#111519] to-[#111519]',
              'Cushion Pro Court': 'from-purple-950/30 via-[#111519] to-[#111519]',
            };

            const bgGrad = surfaceColors[court.surfaceType] || 'from-[#191F24] via-[#111519] to-[#111519]';

            return (
              <div
                key={court.id}
                className={`rounded-3xl border bg-gradient-to-b ${bgGrad} p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#C7F464]/60 hover:shadow-[0_0_30px_rgba(199,244,100,0.1)] group relative ${
                  isMaintenance ? 'border-amber-500/40 opacity-75' : 'border-[#242C33]'
                }`}
              >
                {/* Court Top Details */}
                <div className="space-y-4">
                  {/* Badge & Number */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#C7F464] px-2.5 py-1 rounded-md bg-[#151A20] border border-[#242C33]">
                      0{index + 1}
                    </span>
                    {court.badge && (
                      <span className="text-xs font-semibold text-[#F4F5F3] bg-[#191F24] px-3 py-1 rounded-full border border-[#242C33]">
                        {court.badge}
                      </span>
                    )}
                  </div>

                  {/* Court Name & Price */}
                  <div>
                    <h3 className="text-xl font-bold text-[#F4F5F3] font-display group-hover:text-white transition-colors">
                      {court.name}
                    </h3>
                    <p className="text-xs text-[#C7F464] font-medium mt-1">
                      {court.surfaceType}
                    </p>
                  </div>

                  <p className="text-xs text-[#9BA3A8] leading-relaxed">
                    {court.description}
                  </p>

                  {/* Court Visual Thumbnail Graphic */}
                  <div className="h-36 rounded-2xl bg-[#080A0C] border border-[#242C33] overflow-hidden relative flex items-center justify-center p-4">
                    {/* Visual pattern representing court lines */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C7F464_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="w-full h-full border border-[#C7F464]/40 rounded-xl relative flex items-center justify-center">
                      <div className="w-full h-[1px] bg-[#C7F464]/50" />
                      <div className="h-full w-[1px] bg-[#C7F464]/30" />
                      <div className="absolute top-2 left-2 text-[10px] text-[#9BA3A8] font-mono">
                        {court.totalBookings} Completed Matches
                      </div>
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[11px] text-[#C7F464]">
                        <Star className="w-3 h-3 fill-[#C7F464]" />
                        <span className="font-bold">{court.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities List */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-semibold text-[#9BA3A8] uppercase tracking-wider block">
                      Court Features & Facilities
                    </span>
                    <ul className="space-y-1.5 text-xs">
                      {court.amenities.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-[#9BA3A8]">
                          <Check className="w-3.5 h-3.5 text-[#C7F464] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Pricing & CTA */}
                <div className="pt-6 border-t border-[#1E252C] mt-6 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-[#9BA3A8] block">Hourly Rate</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold font-mono text-[#F4F5F3]">
                        ₹{court.pricePerHour}
                      </span>
                      <span className="text-xs text-[#9BA3A8]">/ hour</span>
                    </div>
                  </div>

                  {isMaintenance ? (
                    <button
                      disabled
                      className="px-4 py-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-not-allowed"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Maintenance</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBookCourt(court.id)}
                      className="px-5 py-2.5 bg-[#C7F464] hover:bg-[#d6f87d] text-[#080A0C] font-bold text-xs rounded-xl shadow-[0_0_15px_rgba(199,244,100,0.2)] transition-all flex items-center gap-2 active:scale-95 group-hover:shadow-[0_0_20px_rgba(199,244,100,0.35)]"
                    >
                      <span>Book This Court</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
