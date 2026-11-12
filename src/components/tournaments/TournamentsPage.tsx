import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tournament } from '../../types';
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';

export const TournamentsPage: React.FC = () => {
  const { tournaments, registerForTournament, customerProfile } = useApp();
  const [selectedTournament, setSelectedTournament] = useState<Tournament>(tournaments[0]);

  const handleRegister = (id: string) => {
    registerForTournament(id);
  };

  return (
    <div className="py-16 bg-[#080A0C] min-h-screen text-left transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-semibold text-[#C7F464] uppercase tracking-wider block">
            Competitive Badminton Arena
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F4F5F3] font-display tracking-tight leading-tight">
            TOURNAMENTS & <br />
            <span className="text-[#C7F464]">CHAMPIONSHIP BRACKETS.</span>
          </h1>
          <p className="text-base text-[#9BA3A8] leading-relaxed">
            Compete against the region's elite players. BWF certified line umpires, automated live stream camera feeds, official Yonex feather shuttles, and cash prize pools.
          </p>
        </div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {tournaments.map((trn) => {
            const isSelected = selectedTournament.id === trn.id;
            const openSlots = trn.totalSlots - trn.registeredCount;

            return (
              <div
                key={trn.id}
                className={`p-7 rounded-3xl bg-[#111519] border transition-all duration-200 shadow-xl space-y-5 flex flex-col justify-between ${
                  isSelected ? 'border-[#C7F464] shadow-[0_0_25px_rgba(199,244,100,0.15)]' : 'border-[#242C33]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold text-[#C7F464] uppercase tracking-wider">
                        {trn.format}
                      </span>
                      <h3 className="text-xl font-bold text-[#F4F5F3] font-display mt-0.5">
                        {trn.name}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-xl border border-amber-400/20">
                      {trn.prizePool}
                    </span>
                  </div>

                  <p className="text-xs text-[#9BA3A8] leading-relaxed">{trn.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#151A20] border border-[#242C33]">
                      <span className="text-[11px] text-[#9BA3A8] block">Date</span>
                      <span className="text-[#F4F5F3] font-medium">{trn.date}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#151A20] border border-[#242C33]">
                      <span className="text-[11px] text-[#9BA3A8] block">Entry Fee</span>
                      <span className="text-[#C7F464] font-mono font-bold">${trn.entryFee} / player</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#151A20] border border-[#242C33] col-span-2 sm:col-span-1">
                      <span className="text-[11px] text-[#9BA3A8] block">Bracket Slots</span>
                      <span className="text-[#F4F5F3] font-medium">
                        {trn.registeredCount} / {trn.totalSlots} Registered
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1E252C] flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedTournament(trn)}
                    className="text-xs text-[#9BA3A8] hover:text-[#C7F464] font-medium transition-colors"
                  >
                    {isSelected ? '✓ Viewing Bracket' : 'View Tournament Bracket'}
                  </button>

                  <button
                    onClick={() => handleRegister(trn.id)}
                    disabled={openSlots <= 0}
                    className="px-5 py-2.5 bg-[#C7F464] hover:bg-[#d6f87d] text-[#080A0C] font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                  >
                    <span>Register Demo Team ({openSlots} left)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Visual Knockout Bracket */}
        {selectedTournament && (
          <div className="bg-[#111519] border border-[#242C33] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E252C] pb-4">
              <div>
                <span className="text-xs font-semibold text-[#C7F464] uppercase tracking-wider block">
                  Knockout Elimination Tree
                </span>
                <h3 className="text-xl font-bold text-[#F4F5F3] font-display">
                  {selectedTournament.name} — Live Bracket
                </h3>
              </div>
              <span className="text-xs text-[#9BA3A8]">
                Court allocation: Championship Court 01 & 02
              </span>
            </div>

            {/* Bracket Visual Representation */}
            <div className="overflow-x-auto py-6">
              <div className="min-w-[760px] grid grid-cols-3 gap-8">
                {/* Column 1: Quarter Finals */}
                <div className="space-y-4">
                  <div className="text-xs font-bold text-[#C7F464] uppercase tracking-wider mb-2">
                    Quarter Finals
                  </div>
                  {selectedTournament.matches.slice(0, 4).map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-2xl bg-[#151A20] border border-[#242C33] space-y-1.5 text-xs shadow-md"
                    >
                      <div className="flex justify-between text-[11px] text-[#9BA3A8]">
                        <span>{m.scheduledTime}</span>
                        {m.winner && <span className="text-[#C7F464] font-medium">Final</span>}
                      </div>

                      <div className="space-y-1 pt-1">
                        <div
                          className={`flex justify-between px-2 py-1 rounded-lg ${
                            m.winner === m.player1 ? 'bg-[#191F24] font-bold text-[#C7F464]' : 'text-[#F4F5F3]'
                          }`}
                        >
                          <span>{m.player1}</span>
                          <span className="font-mono">{m.score1 || '—'}</span>
                        </div>
                        <div
                          className={`flex justify-between px-2 py-1 rounded-lg ${
                            m.winner === m.player2 ? 'bg-[#191F24] font-bold text-[#C7F464]' : 'text-[#9BA3A8]'
                          }`}
                        >
                          <span>{m.player2}</span>
                          <span className="font-mono">{m.score2 || '—'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Column 2: Semi Finals */}
                <div className="space-y-12 pt-6">
                  <div className="text-xs font-bold text-[#C7F464] uppercase tracking-wider mb-2">
                    Semi Finals
                  </div>
                  {selectedTournament.matches.slice(4, 6).map((m) => (
                    <div
                      key={m.id}
                      className="p-4 rounded-2xl bg-[#151A20] border border-[#242C33] space-y-2 text-xs shadow-md"
                    >
                      <div className="flex justify-between text-[11px] text-[#9BA3A8]">
                        <span>Centre Court · {m.scheduledTime}</span>
                      </div>
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between px-2.5 py-1.5 rounded-lg bg-[#191F24] text-[#F4F5F3] font-semibold">
                          <span>{m.player1}</span>
                          <span className="font-mono text-[#C7F464]">Ready</span>
                        </div>
                        <div className="flex justify-between px-2.5 py-1.5 rounded-lg bg-[#191F24] text-[#F4F5F3] font-semibold">
                          <span>{m.player2}</span>
                          <span className="font-mono text-[#C7F464]">Ready</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Column 3: Championship Final */}
                <div className="space-y-20 pt-16">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Grand Championship Final</span>
                  </div>
                  {selectedTournament.matches.slice(6, 7).map((m) => (
                    <div
                      key={m.id}
                      className="p-5 rounded-2xl bg-gradient-to-b from-[#151A20] to-[#111519] border-2 border-amber-400/40 space-y-3 text-xs shadow-2xl relative overflow-hidden"
                    >
                      <div className="flex justify-between text-[11px] text-[#9BA3A8]">
                        <span className="text-amber-400 font-bold">Championship Trophy Match</span>
                        <span>05:30 PM</span>
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <div className="p-2.5 rounded-xl bg-[#191F24] border border-[#242C33] text-[#F4F5F3] font-bold">
                          {m.player1}
                        </div>
                        <div className="text-center text-[10px] text-[#9BA3A8] font-mono">VS</div>
                        <div className="p-2.5 rounded-xl bg-[#191F24] border border-[#242C33] text-[#F4F5F3] font-bold">
                          {m.player2}
                        </div>
                      </div>
                      <div className="text-center pt-2 text-xs font-mono font-bold text-[#C7F464]">
                        Prize: {selectedTournament.prizePool}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
