import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CoachingBatch } from '../../types';
import {
  Users,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const CoachingPage: React.FC = () => {
  const { coachingBatches, addStudentToBatch, customerProfile, setActiveNav } = useApp();
  const [selectedBatchForEnroll, setSelectedBatchForEnroll] = useState<CoachingBatch | null>(null);
  const [studentName, setStudentName] = useState(customerProfile.name);
  const [studentEmail, setStudentEmail] = useState('alex.thorne@arsarena.club');

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchForEnroll) return;
    addStudentToBatch(selectedBatchForEnroll.id, studentName.trim() || 'Alex Thorne', studentEmail.trim() || 'alex.thorne@arsarena.club');
    setSelectedBatchForEnroll(null);
  };

  return (
    <div className="py-16 bg-[#080A0C] min-h-screen text-left transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-semibold text-[#C7F464] uppercase tracking-wider block">
            ARS Badminton Arena Training Academy
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F4F5F3] font-display tracking-tight leading-tight">
            WORLD-CLASS COACHING. <br />
            <span className="text-[#C7F464]">DISCIPLINED TECHNIQUE.</span>
          </h1>
          <p className="text-base text-[#9BA3A8] leading-relaxed">
            Elevate your agility, overhead smash trajectory, deceptive net drops, and tactical rally discipline. Led by certified BWF Level 3 international coaches on our dedicated Olympic-grade courts.
          </p>
        </div>

        {/* Coaches Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#111519] border border-[#242C33] space-y-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#C7F464] text-[#080A0C] font-bold text-lg flex items-center justify-center font-display">
              VR
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F4F5F3]">Coach Vikram Rao</h3>
              <p className="text-xs text-[#C7F464]">Former Commonwealth Games Medalist</p>
            </div>
            <p className="text-xs text-[#9BA3A8] leading-relaxed">
              Specialist in explosive backcourt jump smashes, defensive body blocks, and fast rotational doubles positioning.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111519] border border-[#242C33] space-y-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-[#080A0C] font-bold text-lg flex items-center justify-center font-display">
              SL
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F4F5F3]">Coach Sarah Lindqvist</h3>
              <p className="text-xs text-sky-400">BWF Level 3 High Performance Director</p>
            </div>
            <p className="text-xs text-[#9BA3A8] leading-relaxed">
              Nordic tactical specialist focusing on biomechanical footwork economy, deception slice drops, and high-pressure match psychology.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111519] border border-[#242C33] space-y-3 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-[#080A0C] font-bold text-lg flex items-center justify-center font-display">
              DZ
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F4F5F3]">Coach Daniel Zhang</h3>
              <p className="text-xs text-amber-400">Certified Badminton England Elite Coach</p>
            </div>
            <p className="text-xs text-[#9BA3A8] leading-relaxed">
              Renowned youth developer specializing in grip mechanics, split-step timing, and fundamental wrist snap acceleration.
            </p>
          </div>
        </div>

        {/* Batches Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#F4F5F3] font-display">
                Active Training Batches & Rosters
              </h2>
              <p className="text-xs text-[#9BA3A8]">
                Recurring weekly batches automatically reserve court time slots on the facility booking matrix.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coachingBatches.map((batch) => {
              const spotsLeft = batch.capacity - batch.enrolledStudents.length;

              return (
                <div
                  key={batch.id}
                  className="rounded-3xl bg-[#111519] border border-[#242C33] p-6 flex flex-col justify-between shadow-xl space-y-4 hover:border-[#C7F464]/60 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        {batch.level}
                      </span>
                      <span className="text-xs text-[#9BA3A8]">
                        {spotsLeft > 0 ? (
                          <span className="text-[#C7F464] font-semibold">{spotsLeft} spots available</span>
                        ) : (
                          <span className="text-rose-400 font-semibold">Batch Full</span>
                        )}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#F4F5F3] font-display">{batch.name}</h3>
                    <p className="text-xs text-[#9BA3A8]">
                      Head Coach: <strong className="text-[#F4F5F3]">{batch.coachName}</strong>
                    </p>

                    <div className="p-3 rounded-2xl bg-[#151A20] border border-[#242C33] space-y-1.5 text-xs text-[#9BA3A8]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#C7F464]" />
                          <span>Training Days</span>
                        </span>
                        <span className="text-[#F4F5F3] font-medium">{batch.days.join(', ')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#C7F464]" />
                          <span>Session Time</span>
                        </span>
                        <span className="text-[#C7F464] font-medium">{batch.timeSlot}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#C7F464]" />
                          <span>Assigned Court</span>
                        </span>
                        <span className="text-[#F4F5F3] font-medium">{batch.courtName.split('—')[0]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1E252C] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-[#9BA3A8] block">Academy Tuition</span>
                      <span className="text-xl font-bold font-mono text-[#F4F5F3]">
                        ₹{batch.monthlyFee}
                      </span>
                      <span className="text-xs text-[#9BA3A8]">/ month</span>
                    </div>

                    <button
                      onClick={() => setSelectedBatchForEnroll(batch)}
                      disabled={spotsLeft <= 0}
                      className="px-4 py-2 bg-[#C7F464] hover:bg-[#b8e855] text-[#080A0C] font-bold text-xs rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <span>Join Batch</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enrollment Modal */}
        {selectedBatchForEnroll && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-[#111519] border border-[#242C33] rounded-2xl max-w-md w-full p-6 text-left shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-[#242C33] pb-3">
                <h3 className="text-base font-bold text-[#F4F5F3]">
                  Enroll in {selectedBatchForEnroll.name}
                </h3>
                <button
                  onClick={() => setSelectedBatchForEnroll(null)}
                  className="text-[#9BA3A8] hover:text-[#F4F5F3]"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#151A20] border border-[#242C33] space-y-1 text-xs text-[#9BA3A8]">
                <div className="flex justify-between">
                  <span>Schedule:</span>
                  <span className="text-[#F4F5F3] font-medium">
                    {selectedBatchForEnroll.days.join(', ')} ({selectedBatchForEnroll.timeSlot})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Court:</span>
                  <span className="text-[#C7F464] font-medium">
                    {selectedBatchForEnroll.courtName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tuition:</span>
                  <span className="text-[#F4F5F3] font-bold">₹{selectedBatchForEnroll.monthlyFee}/month</span>
                </div>
              </div>

              <form onSubmit={handleEnrollSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#9BA3A8] mb-1">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                  />
                </div>
                <div>
                  <label className="block text-[#9BA3A8] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="w-full bg-[#151A20] border border-[#242C33] rounded-xl px-3 py-2 text-[#F4F5F3]"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedBatchForEnroll(null)}
                    className="flex-1 py-2 bg-[#191F24] text-[#9BA3A8] rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#C7F464] text-[#080A0C] font-bold rounded-xl"
                  >
                    Confirm Demo Enrollment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
