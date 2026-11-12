import React from 'react';
import { ShieldCheck, Eye, Video, Wind, Wrench, Sparkles, Check } from 'lucide-react';

export const FeaturesAmenities: React.FC = () => {
  const features = [
    {
      icon: <Eye className="w-5 h-5 text-[#C7F464]" />,
      title: '1,200 Lux Anti-Glare LED System',
      description:
        'Indirect asymmetrical optical diffusers guarantee zero blinding overhead glare when tracking high clears and baseline jump smashes.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#C7F464]" />,
      title: 'BWF Certified 5.0mm Olympic Mats',
      description:
        'Dual-density neoprene sub-layer absorbs up to 62% of abrupt vertical impact, dramatically reducing knee and patellar strain during long sessions.',
    },
    {
      icon: <Video className="w-5 h-5 text-[#C7F464]" />,
      title: 'Automated 4K Match Replay',
      description:
        'High-speed ceiling cameras capture your match highlights automatically. Review rallies, service placement, and footwork on the arena screens or your dashboard.',
    },
    {
      icon: <Wind className="w-5 h-5 text-[#C7F464]" />,
      title: 'Controlled Drift-Free Air Circulation',
      description:
        'High-volume low-velocity HVAC engineering maintains a steady 22°C temperature with zero air drafts that could alter shuttlecock trajectory.',
    },
    {
      icon: <Wrench className="w-5 h-5 text-[#C7F464]" />,
      title: 'Pro Stringing & Yonex Pro Shop',
      description:
        'Certified electronic stringing machine on-site with same-day turnaround, plus tournament feather shuttles, grips, and demo rackets.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#C7F464]" />,
      title: 'VIP Lockers & Recovery Showers',
      description:
        'Dedicated secure digital locker facilities, pressurized hot rain showers, hydration energy bars, and a relaxed viewing mezzanine.',
    },
  ];

  return (
    <section className="py-20 bg-[#06080A] border-b border-[#1E252C] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-left max-w-2xl space-y-3">
          <span className="text-xs font-semibold text-[#C7F464] uppercase tracking-wider block">
            Arena Specifications
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F4F5F3] font-display tracking-tight">
            PRECISION SPORTS INFRASTRUCTURE.
          </h2>
          <p className="text-sm sm:text-base text-[#9BA3A8] leading-relaxed">
            Every architectural detail from lighting angle to subfloor elasticity has been calibrated for pure athletic performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#0E1216] border border-[#242C33] space-y-3 shadow-lg hover:border-[#C7F464]/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#151A20] border border-[#242C33] flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-[#F4F5F3]">{feat.title}</h3>
              <p className="text-xs text-[#9BA3A8] leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
