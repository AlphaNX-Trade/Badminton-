import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Sparkles, Star, Trophy, Gift, ArrowRight } from 'lucide-react';

export const MembershipsPage: React.FC = () => {
  const {
    memberships,
    activeMembershipId,
    selectMembership,
    customerProfile,
    showToast,
  } = useApp();

  const rewards = [
    { id: 'rew-1', name: 'Free 60-Min Off-Peak Court Hour', points: 500, icon: '🏸' },
    { id: 'rew-2', name: 'Yonex Super Grap Grip Replacement', points: 300, icon: '🎾' },
    { id: 'rew-3', name: 'Aerosensa 30 Tournament Feather Tube', points: 800, icon: '🪶' },
    { id: 'rew-4', name: '1-on-1 45-Min Coach Video Analysis', points: 1500, icon: '🎥' },
  ];

  const handleRedeem = (name: string, pts: number) => {
    if (customerProfile.loyaltyPoints >= pts) {
      showToast('Reward Redeemed!', `${name} credited to your player account.`, 'success');
    } else {
      showToast('Insufficient Points', `You need ${pts} points to claim this reward.`, 'warning');
    }
  };

  return (
    <div className="py-16 bg-[#080A0C] min-h-screen text-left transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-semibold text-[#C7F464] uppercase tracking-wider block">
            Arena Memberships & Loyalty
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F4F5F3] font-display tracking-tight leading-tight">
            UNLIMITED PASSES. <br />
            <span className="text-[#C7F464]">EXCLUSIVE PLAYER PRIVILEGES.</span>
          </h1>
          <p className="text-base text-[#9BA3A8] leading-relaxed">
            Gain priority 14-day advance booking access, complimentary high-performance racket rentals, and up to 30% discount on all court reservations.
          </p>
        </div>

        {/* Membership Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {memberships.map((plan) => {
            const isActive = activeMembershipId === plan.id;

            return (
              <div
                key={plan.id}
                className={`p-7 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative shadow-xl ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-[#151A20] via-[#111519] to-[#0E1216] border-[#C7F464] shadow-[0_0_30px_rgba(199,244,100,0.15)] scale-[1.02]'
                    : 'bg-[#111519] border-[#242C33]'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C7F464] text-[#080A0C] font-extrabold text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Most Popular Pass
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <span className="text-xs font-semibold text-[#C7F464] uppercase tracking-wider">
                      {plan.tier} Tier
                    </span>
                    <h3 className="text-2xl font-bold text-[#F4F5F3] font-display mt-0.5">
                      {plan.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold font-mono text-[#F4F5F3]">
                      ₹{plan.price}
                    </span>
                    <span className="text-xs text-[#9BA3A8]">/ month</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#151A20] border border-[#242C33] space-y-1 text-xs">
                    <div className="flex justify-between text-[#9BA3A8]">
                      <span>Included Hours:</span>
                      <span className="text-[#C7F464] font-bold">{plan.includedHours} hrs / mo</span>
                    </div>
                    <div className="flex justify-between text-[#9BA3A8]">
                      <span>Court Booking Discount:</span>
                      <span className="text-[#F4F5F3] font-bold">{plan.courtDiscountPercent}% off</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#9BA3A8]">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#C7F464] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-[#1E252C] mt-6">
                  <button
                    onClick={() => selectMembership(plan.id)}
                    className={`w-full py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
                      isActive
                        ? 'bg-[#151A20] text-[#C7F464] border border-[#C7F464]/50'
                        : plan.isPopular
                        ? 'bg-[#C7F464] hover:bg-[#b8e855] text-[#080A0C] shadow-lg shadow-[#C7F464]/20'
                        : 'bg-[#191F24] hover:bg-[#20272D] text-[#F4F5F3]'
                    }`}
                  >
                    <span>{isActive ? '✓ Current Plan Active' : 'Select Demo Plan'}</span>
                    {!isActive && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loyalty Points & Rewards Store */}
        <div className="bg-[#111519] border border-[#242C33] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E252C] pb-6">
            <div>
              <span className="text-xs font-semibold text-[#C7F464] uppercase tracking-wider block">
                Player Reward Store
              </span>
              <h3 className="text-2xl font-bold text-[#F4F5F3] font-display">
                ARS Loyalty Points & Rewards
              </h3>
              <p className="text-xs text-[#9BA3A8] mt-1">
                Earn 50 points per completed match and 100 points for tournament participation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#151A20] border border-[#242C33] flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#C7F464]" />
              <div>
                <span className="text-[11px] text-[#9BA3A8] block">Your Balance</span>
                <span className="text-2xl font-bold font-mono text-[#C7F464] tabular-nums">
                  {customerProfile.loyaltyPoints} PTS
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rewards.map((rew) => (
              <div
                key={rew.id}
                className="p-5 rounded-2xl bg-[#151A20] border border-[#242C33] flex flex-col justify-between space-y-4 shadow-md"
              >
                <div className="space-y-2">
                  <span className="text-3xl block">{rew.icon}</span>
                  <h4 className="text-sm font-bold text-[#F4F5F3]">{rew.name}</h4>
                  <span className="text-xs font-mono font-bold text-[#C7F464] block">
                    {rew.points} Points
                  </span>
                </div>

                <button
                  onClick={() => handleRedeem(rew.name, rew.points)}
                  className="w-full py-2 bg-[#191F24] hover:bg-[#20272D] text-[#C7F464] border border-[#242C33] hover:border-[#C7F464]/40 rounded-xl text-xs font-semibold transition-colors"
                >
                  Redeem Reward
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
