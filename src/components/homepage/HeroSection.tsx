import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, ArrowRight, Sparkles, Shield, ChevronDown } from 'lucide-react';
import { getTodayStr } from '../../data/initialData';

export const HeroSection: React.FC = () => {
  const { setActiveNav, setSelectedDate, setSelectedCourtId, courts } = useApp();

  const [quickDate, setQuickDate] = useState(getTodayStr(0));
  const [quickCourt, setQuickCourt] = useState<string>('all');
  const [activeZone, setActiveZone] = useState<'net' | 'mid' | 'rear'>('mid');

  const handleQuickBook = () => {
    setSelectedDate(quickDate);
    if (quickCourt !== 'all') {
      setSelectedCourtId(quickCourt);
    } else {
      setSelectedCourtId(null);
    }
    setActiveNav('book');
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#080A0C] border-b border-[#1E252C] transition-colors">
      {/* Background atmospheric gradient lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-[#C7F464]/10 via-[#191F24]/20 to-transparent blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-emerald-500/5 blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-[#C7F464]/5 blur-3xl pointer-events-none -z-0" />

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 w-full z-10 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Editorial Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#151A20] border border-[#242C33] text-xs font-semibold text-[#C7F464]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>International Badminton Technology Facility</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F4F5F3] font-display leading-[1.08] text-balance">
              PLAY YOUR GAME. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F4F5F3] via-[#C7F464] to-[#C7F464]">
                OWN THE COURT.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#9BA3A8] max-w-xl font-normal leading-relaxed">
              Your game deserves a better court. Discover, book and experience badminton without limits. Olympic-standard BWF synthetic surfaces, 1,200 Lux glare-free arena lighting, and instant 60-minute automated reservations.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => setActiveNav('book')}
                className="px-6 py-3.5 bg-[#C7F464] hover:bg-[#d6f87d] text-[#080A0C] font-bold text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(199,244,100,0.3)] hover:shadow-[0_0_35px_rgba(199,244,100,0.45)] flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>BOOK YOUR COURT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveNav('anatomy3d')}
                className="px-6 py-3.5 bg-[#151A20] hover:bg-[#1C232A] text-[#F4F5F3] hover:text-[#C7F464] border border-[#242C33] hover:border-[#C7F464]/50 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#C7F464]" />
                <span>3D ANATOMY</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Cinematic Court Schematic Visualizer */}
          <div className="lg:col-span-5 relative">
            <div className="bg-[#111519] border border-[#242C33] rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
              {/* Subtle top spotlight glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-[#C7F464] blur-md opacity-80" />

              <div className="flex items-center justify-between pb-4 border-b border-[#1E252C]">
                <div>
                  <span className="text-[11px] font-semibold text-[#C7F464] uppercase tracking-wider block">
                    Interactive Arena Schematic
                  </span>
                  <h3 className="text-sm font-bold text-[#F4F5F3]">Court 01 — Centre Arena View</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#9BA3A8]">
                  <span className="w-2 h-2 rounded-full bg-[#C7F464] animate-pulse" />
                  <span>1,200 Lux Live</span>
                </div>
              </div>

              {/* Bespoke Isometric Badminton Court SVG Graphic */}
              <div className="relative py-6 flex justify-center items-center">
                <svg
                  viewBox="0 0 400 280"
                  className="w-full max-w-[380px] h-auto drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]"
                >
                  <defs>
                    <linearGradient id="courtFloorGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0B4228" />
                      <stop offset="100%" stopColor="#062918" />
                    </linearGradient>
                    <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#9BA3A8" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>

                  {/* Outer Court Boundary with perspective */}
                  <polygon
                    points="50,40 350,40 380,240 20,240"
                    fill="url(#courtFloorGrad)"
                    stroke="#1D7344"
                    strokeWidth="2"
                  />

                  {/* Doubles Side Lines */}
                  <polygon
                    points="65,48 335,48 360,232 40,232"
                    fill="none"
                    stroke="#F4F5F3"
                    strokeWidth="1.5"
                    strokeOpacity="0.85"
                  />

                  {/* Singles Side Lines */}
                  <polygon
                    points="85,48 315,48 338,232 62,232"
                    fill="none"
                    stroke="#F4F5F3"
                    strokeWidth="1.2"
                    strokeOpacity="0.7"
                  />

                  {/* Short Service Lines (Front) */}
                  <line x1="85" y1="120" x2="315" y2="120" stroke="#F4F5F3" strokeWidth="1.5" />
                  <line x1="72" y1="160" x2="328" y2="160" stroke="#F4F5F3" strokeWidth="1.5" />

                  {/* Center Line */}
                  <line x1="200" y1="48" x2="200" y2="120" stroke="#F4F5F3" strokeWidth="1.2" />
                  <line x1="200" y1="160" x2="200" y2="232" stroke="#F4F5F3" strokeWidth="1.2" />

                  {/* Back Service Line for Doubles */}
                  <line x1="68" y1="62" x2="332" y2="62" stroke="#F4F5F3" strokeWidth="1.2" />
                  <line x1="50" y1="218" x2="350" y2="218" stroke="#F4F5F3" strokeWidth="1.2" />

                  {/* Net Posts and Net */}
                  <polygon
                    points="45,138 355,138 355,142 45,142"
                    fill="#151A20"
                    stroke="#242C33"
                    strokeWidth="1"
                  />
                  <line x1="45" y1="140" x2="355" y2="140" stroke="#FFFFFF" strokeWidth="2.5" />
                  <polygon
                    points="45,140 355,140 355,152 45,152"
                    fill="url(#netGrad)"
                    stroke="none"
                  />

                  {/* Net Posts */}
                  <line x1="45" y1="124" x2="45" y2="152" stroke="#C7F464" strokeWidth="3" />
                  <line x1="355" y1="124" x2="355" y2="152" stroke="#C7F464" strokeWidth="3" />

                  {/* Interactive Hotspot: Net Kill Zone */}
                  <circle
                    cx="200"
                    cy="130"
                    r="9"
                    fill={activeZone === 'net' ? '#C7F464' : '#111519'}
                    stroke="#C7F464"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:scale-125"
                    onClick={() => setActiveZone('net')}
                  />

                  {/* Interactive Hotspot: Midcourt Drive Zone */}
                  <circle
                    cx="200"
                    cy="185"
                    r="9"
                    fill={activeZone === 'mid' ? '#C7F464' : '#111519'}
                    stroke="#C7F464"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:scale-125"
                    onClick={() => setActiveZone('mid')}
                  />

                  {/* Interactive Hotspot: Rear Smash Baseline */}
                  <circle
                    cx="280"
                    cy="218"
                    r="9"
                    fill={activeZone === 'rear' ? '#C7F464' : '#111519'}
                    stroke="#C7F464"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:scale-125"
                    onClick={() => setActiveZone('rear')}
                  />

                  {/* Simulated Shuttlecock in flight with motion dash */}
                  <path
                    d="M 120 75 Q 160 110 200 130"
                    fill="none"
                    stroke="#C7F464"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                    opacity="0.8"
                  />
                  <circle cx="120" cy="75" r="4" fill="#FFFFFF" />
                </svg>
              </div>

              {/* Dynamic Zone Analysis Card */}
              <div className="bg-[#151A20] rounded-2xl p-3 border border-[#242C33] text-xs">
                {activeZone === 'net' && (
                  <div className="space-y-1">
                    <span className="text-[#C7F464] font-semibold">Front Net Zone (Spin Tumbling & Net Kill)</span>
                    <p className="text-[11px] text-[#9BA3A8]">
                      Tensioned BWF standard net (1.55m height) with zero sag. Anti-glare overhead light placement prevents blinded eyesight during tight net taps.
                    </p>
                  </div>
                )}
                {activeZone === 'mid' && (
                  <div className="space-y-1">
                    <span className="text-[#C7F464] font-semibold">Midcourt Transition (Fast Drives & Defense)</span>
                    <p className="text-[11px] text-[#9BA3A8]">
                      High-friction cross-weave mat texture provides explosive lateral push-offs and zero shoe slide during rapid doubles exchanges.
                    </p>
                  </div>
                )}
                {activeZone === 'rear' && (
                  <div className="space-y-1">
                    <span className="text-[#C7F464] font-semibold">Rear Baseline (Jump Smashes & Clears)</span>
                    <p className="text-[11px] text-[#9BA3A8]">
                      5-layer neoprene elastomer absorbs 62% of landing shock, preserving player knees and ankles during maximum height jump smashes.
                    </p>
                  </div>
                )}
                <div className="flex gap-2 pt-2 border-t border-[#1E252C] mt-2">
                  <button
                    onClick={() => setActiveZone('net')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      activeZone === 'net' ? 'bg-[#C7F464] text-[#080A0C]' : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
                    }`}
                  >
                    Front Net
                  </button>
                  <button
                    onClick={() => setActiveZone('mid')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      activeZone === 'mid' ? 'bg-[#C7F464] text-[#080A0C]' : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
                    }`}
                  >
                    Midcourt
                  </button>
                  <button
                    onClick={() => setActiveZone('rear')}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      activeZone === 'rear' ? 'bg-[#C7F464] text-[#080A0C]' : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
                    }`}
                  >
                    Rear Baseline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Booking Strip below hero */}
        <div className="mt-12 bg-[#111519] border border-[#242C33] rounded-2xl p-4 sm:p-5 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Date Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#9BA3A8] uppercase tracking-wider block">
                Select Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#C7F464] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="date"
                  value={quickDate}
                  onChange={(e) => setQuickDate(e.target.value)}
                  className="w-full bg-[#151A20] border border-[#242C33] rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
                />
              </div>
            </div>

            {/* Court Select */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#9BA3A8] uppercase tracking-wider block">
                Preferred Court
              </label>
              <select
                value={quickCourt}
                onChange={(e) => setQuickCourt(e.target.value)}
                className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-xs font-medium text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
              >
                <option value="all">All Available Courts</option>
                {courts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name.split('—')[0]} (₹{c.pricePerHour}/hr)
                  </option>
                ))}
              </select>
            </div>

            {/* Operating Hours Info */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#9BA3A8] uppercase tracking-wider block">
                Session Window
              </label>
              <div className="flex items-center gap-2 bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-xs text-[#F4F5F3]">
                <Clock className="w-4 h-4 text-[#C7F464]" />
                <span>6:00 AM – 11:00 PM (17 Slots)</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 sm:pt-0">
              <button
                onClick={handleQuickBook}
                className="w-full py-2.5 px-4 bg-[#C7F464] hover:bg-[#d6f87d] text-[#080A0C] font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(199,244,100,0.25)] transition-all flex items-center justify-center gap-2 active:scale-95 mt-auto"
              >
                <span>Check Live Availability</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quantified Proof Strip adjacent to hero */}
      <div className="bg-[#0B0F13] border-t border-[#1E252C] py-5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="space-y-0.5">
              <p className="text-xl sm:text-2xl font-bold font-display text-[#F4F5F3] tabular-nums">
                3 Olympic Courts
              </p>
              <p className="text-xs text-[#9BA3A8]">BWF Standard Synthetic Mats</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xl sm:text-2xl font-bold font-display text-[#C7F464] tabular-nums">
                1,200 Lux
              </p>
              <p className="text-xs text-[#9BA3A8]">Calibrated Anti-Glare LED System</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xl sm:text-2xl font-bold font-display text-[#F4F5F3] tabular-nums">
                99.4%
              </p>
              <p className="text-xs text-[#9BA3A8]">Player Satisfaction (2,400+ Matches)</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xl sm:text-2xl font-bold font-display text-[#C7F464] tabular-nums">
                4K Replay
              </p>
              <p className="text-xs text-[#9BA3A8]">Automated Motion Video Tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
