import { Users } from 'lucide-react';
import { FAMILY_STORY_BN, FAMILY_STORY_EN, NOTABLE_MEMBERS } from '../data/seoData';

export default function AboutFamilySection() {
  return (
    <section id="about" className="py-16 bg-[#0F0C1A] text-[#F6EFE0] border-t border-[#D4AF37]/30 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1F3D]/60 border border-[#D4AF37]/40 text-[#F0D78C] text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>StarMaker Music Family · Bangladesh</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-english-heading text-[#F0D78C] tracking-tight">
            Gaan Bristy কারা?
          </h2>
          <p className="text-[#B3A6C9] text-sm mt-2 font-body">
            গানপ্রিয় মানুষদের নিয়ে গঠিত StarMaker ফ্যামিলি — ঢাকা ও বাংলাদেশজুড়ে
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-[#7A1F3D] mx-auto my-4 rounded-full" />
        </div>

        <article className="bg-[#1C1730] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 space-y-5">
          <p className="text-[15px] sm:text-base leading-relaxed text-[#F6EFE0] font-body">{FAMILY_STORY_BN}</p>
          <p className="text-sm leading-relaxed text-[#B3A6C9] font-body">{FAMILY_STORY_EN}</p>
        </article>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {NOTABLE_MEMBERS.map((member) => (
            <article
              key={member.name}
              className="real-world-star-card overflow-hidden rounded-2xl border border-[#D4AF37]/40 bg-[#1C1730]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#0F0C1A]">
                <img
                  src={member.image}
                  alt={`${member.name} — ${member.roleBengali}`}
                  className="h-full w-full object-cover object-top"
                />
                <div className="real-world-star-ribbon" aria-hidden="true">
                  <span className="real-world-star-ribbon-text">Real World Star</span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#D4AF37]">
                  {member.roleBengali}
                </p>
                <h3 className="mt-1 text-lg font-black leading-snug text-[#F6EFE0]">{member.nameBengali}</h3>
                <p className="text-sm font-semibold text-[#F0D78C]">{member.name}</p>
                {member.starMakerId && (
                  <p className="mt-2 text-xs font-mono text-[#B3A6C9]">
                    StarMaker ID: <span className="text-[#F0D78C]">{member.starMakerId}</span>
                  </p>
                )}
                <p className="mt-2 text-xs leading-relaxed text-[#B3A6C9]">{member.note}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
