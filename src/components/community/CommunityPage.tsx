import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { PlayerProfile } from '../../types';
import {
  Users,
  Trophy,
  Swords,
  Star,
  MapPin,
  Clock,
  Filter,
  Check,
  X,
  Sparkles,
  Search,
} from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const { players, sendChallenge, respondToChallenge, customerProfile } = useApp();

  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      const matchSkill = skillFilter === 'all' ? true : p.skillLevel === skillFilter;
      const matchQuery =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.playStyle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.preferredCourt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSkill && matchQuery;
    });
  }, [players, skillFilter, searchQuery]);

  return (
    <div className="py-16 bg-[#080A0C] min-h-screen text-left transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-semibold text-[#C7F464] uppercase tracking-wider block">
            ARS Player Network
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F4F5F3] font-display tracking-tight leading-tight">
            COMMUNITY & <br />
            <span className="text-[#C7F464]">MATCHMAKING CHALLENGES.</span>
          </h1>
          <p className="text-base text-[#9BA3A8] leading-relaxed">
            Find sparring partners at your exact rating tier, send match challenges, and climb the arena rankings leaderboard.
          </p>
        </div>

        {/* Incoming Challenges for Current User (Alex Thorne) */}
        {customerProfile.challenges && customerProfile.challenges.length > 0 && (
          <div className="bg-[#111519] border border-[#C7F464]/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-[#C7F464]" />
              <h3 className="text-base font-bold text-[#F4F5F3]">
                Incoming Match Challenges For You
              </h3>
            </div>

            <div className="space-y-3">
              {customerProfile.challenges.map((ch) => (
                <div
                  key={ch.id}
                  className="p-4 rounded-2xl bg-[#151A20] border border-[#242C33] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#F4F5F3]">
                      <strong className="text-[#C7F464]">{ch.fromPlayerName}</strong> sent you a match challenge
                    </p>
                    <p className="text-xs text-[#9BA3A8] mt-0.5">
                      Proposed match date: {ch.date} · Advanced Singles
                    </p>
                  </div>

                  {ch.status === 'pending' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => respondToChallenge(ch.id, 'accepted')}
                        className="px-4 py-2 bg-[#C7F464] hover:bg-[#b8e855] text-[#080A0C] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept Challenge</span>
                      </button>
                      <button
                        onClick={() => respondToChallenge(ch.id, 'declined')}
                        className="px-4 py-2 bg-[#191F24] hover:bg-[#20272D] text-[#9BA3A8] hover:text-[#F4F5F3] text-xs font-semibold rounded-xl transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold uppercase text-[#C7F464]">
                      Challenge {ch.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Player Search & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111519] border border-[#242C33] rounded-2xl p-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#9BA3A8] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by player name or playstyle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#151A20] border border-[#242C33] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F4F5F3] focus:outline-none focus:border-[#C7F464]"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#151A20] p-1 rounded-xl border border-[#242C33] text-xs w-full sm:w-auto overflow-x-auto">
            {['all', 'Beginner', 'Intermediate', 'Advanced', 'Tournament Pro'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSkillFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  skillFilter === lvl
                    ? 'bg-[#1E252C] text-[#F4F5F3] font-semibold shadow-sm'
                    : 'text-[#9BA3A8] hover:text-[#F4F5F3]'
                }`}
              >
                {lvl === 'all' ? 'All Skill Tiers' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player) => {
            const isMe = player.id === customerProfile.id;

            return (
              <div
                key={player.id}
                className="p-6 rounded-3xl bg-[#111519] border border-[#242C33] space-y-4 shadow-xl flex flex-col justify-between hover:border-[#C7F464]/60 transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl ${player.avatarColor} font-bold text-base flex items-center justify-center font-display shadow-md`}
                      >
                        {player.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#F4F5F3]">{player.name}</h3>
                          {isMe && (
                            <span className="text-[10px] text-[#C7F464] border border-[#C7F464]/30 px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#C7F464] font-medium">{player.skillLevel}</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#9BA3A8]">
                      Rank #{player.rank}
                    </span>
                  </div>

                  <p className="text-xs text-[#9BA3A8] italic">"{player.playStyle}"</p>

                  <div className="p-3 rounded-2xl bg-[#151A20] border border-[#242C33] space-y-1.5 text-xs text-[#9BA3A8]">
                    <div className="flex justify-between">
                      <span>Preferred Court:</span>
                      <span className="text-[#F4F5F3] font-medium">{player.preferredCourt.split('—')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Matches / Win Rate:</span>
                      <span className="text-[#F4F5F3] font-medium">
                        {player.matchesPlayed} matches · <strong className="text-[#C7F464]">{player.winRate}% Win</strong>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Preferred Slot:</span>
                      <span className="text-[#F4F5F3] font-medium">{player.preferredTime}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1E252C] flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-[#9BA3A8]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C7F464]" />
                    <span className="font-mono text-[#F4F5F3]">{player.loyaltyPoints}</span>
                    <span>pts</span>
                  </div>

                  {!isMe && (
                    <button
                      onClick={() => sendChallenge(player.id)}
                      className="px-4 py-2 bg-[#191F24] hover:bg-[#20272D] text-[#C7F464] border border-[#242C33] hover:border-[#C7F464]/40 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5"
                    >
                      <Swords className="w-3.5 h-3.5" />
                      <span>Send Challenge</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-[#111519] border border-[#242C33] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-xl font-bold text-[#F4F5F3] font-display">
                ARS Badminton Arena Championship Leaderboard
              </h3>
              <p className="text-xs text-[#9BA3A8]">
                Rankings computed from verified match win records and attendance loyalty points.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#151A20] text-[#9BA3A8] uppercase tracking-wider font-semibold border-b border-[#242C33]">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3">Skill Tier</th>
                  <th className="px-4 py-3">Matches</th>
                  <th className="px-4 py-3">Win Rate</th>
                  <th className="px-4 py-3">ARS Points</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E252C] text-[#F4F5F3]">
                {players.map((pl) => (
                  <tr key={pl.id} className="hover:bg-[#151A20]/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#C7F464]">#{pl.rank}</td>
                    <td className="px-4 py-3 font-semibold">{pl.name}</td>
                    <td className="px-4 py-3 text-[#9BA3A8]">{pl.skillLevel}</td>
                    <td className="px-4 py-3 font-mono">{pl.matchesPlayed}</td>
                    <td className="px-4 py-3 font-mono font-bold text-[#C7F464]">{pl.winRate}%</td>
                    <td className="px-4 py-3 font-mono">{pl.loyaltyPoints}</td>
                    <td className="px-4 py-3 text-right">
                      {pl.id !== customerProfile.id && (
                        <button
                          onClick={() => sendChallenge(pl.id)}
                          className="text-xs text-[#C7F464] hover:underline"
                        >
                          Challenge
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
