import { useState } from 'react';
import { TEAM_MEMBERS } from '../data/eventData';
import { Crown, Shield, Users, Search, Sparkles, Star, Phone, Mic } from 'lucide-react';

export default function TeamShowcase() {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'All' | 'Captain' | 'Co-Captain' | 'Admin' | 'Super Active Member'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = TEAM_MEMBERS.filter(member => {
    const matchesRole = selectedRoleFilter === 'All' || member.role === selectedRoleFilter;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (member.starMakerId && member.starMakerId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const captain = TEAM_MEMBERS.find(m => m.role === 'Captain');

  return (
    <section id="team" className="py-16 bg-[#0F0C1A] text-[#F6EFE0] border-t border-[#D4AF37]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1F3D]/60 border border-[#D4AF37]/40 text-[#F0D78C] text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>ফ্যামিলি কমিটি ও আয়োজক পরিষদ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-english-heading text-[#F0D78C] tracking-tight">
            Gaan Bristy Family Team
          </h2>
          <p className="text-[#B3A6C9] text-sm mt-1 font-body">
            ১ জন ক্যাপ্টেন • ৬ জন কো-ক্যাপ্টেন • ১১ জন এডমিন • সুপার অ্যাক্টিভ মেম্বার পরিষদ
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-[#7A1F3D] mx-auto my-4 rounded-full"></div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedRoleFilter('All')}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all duration-200 cursor-pointer ${
                selectedRoleFilter === 'All' 
                  ? 'gold-gradient-btn text-[#0F0C1A] shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                  : 'bg-[#1C1730] text-[#F6EFE0] border border-[#D4AF37]/50 hover:bg-[#7A1F3D] hover:text-[#FFFFFF] hover:border-[#F0D78C] hover:shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              }`}
            >
              সকল মেম্বার ({TEAM_MEMBERS.length})
            </button>
            <button
              onClick={() => setSelectedRoleFilter('Captain')}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                selectedRoleFilter === 'Captain' 
                  ? 'gold-gradient-btn text-[#0F0C1A] shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                  : 'bg-[#1C1730] text-[#F6EFE0] border border-[#D4AF37]/50 hover:bg-[#7A1F3D] hover:text-[#FFFFFF] hover:border-[#F0D78C] hover:shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              }`}
            >
              <Crown className={`w-3.5 h-3.5 ${selectedRoleFilter === 'Captain' ? 'text-[#0F0C1A]' : 'text-[#F0D78C]'}`} />
              ক্যাপ্টেন (১)
            </button>
            <button
              onClick={() => setSelectedRoleFilter('Co-Captain')}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all duration-200 cursor-pointer ${
                selectedRoleFilter === 'Co-Captain' 
                  ? 'gold-gradient-btn text-[#0F0C1A] shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                  : 'bg-[#1C1730] text-[#F6EFE0] border border-[#D4AF37]/50 hover:bg-[#7A1F3D] hover:text-[#FFFFFF] hover:border-[#F0D78C] hover:shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              }`}
            >
              কো-ক্যাপ্টেন (৬)
            </button>
            <button
              onClick={() => setSelectedRoleFilter('Admin')}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all duration-200 cursor-pointer ${
                selectedRoleFilter === 'Admin' 
                  ? 'gold-gradient-btn text-[#0F0C1A] shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                  : 'bg-[#1C1730] text-[#F6EFE0] border border-[#D4AF37]/50 hover:bg-[#7A1F3D] hover:text-[#FFFFFF] hover:border-[#F0D78C] hover:shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              }`}
            >
              এডমিন ({TEAM_MEMBERS.filter(m => m.role === 'Admin').length})
            </button>
            <button
              onClick={() => setSelectedRoleFilter('Super Active Member')}
              className={`px-4 py-2 rounded-full text-xs font-black transition-all duration-200 cursor-pointer ${
                selectedRoleFilter === 'Super Active Member' 
                  ? 'gold-gradient-btn text-[#0F0C1A] shadow-[0_0_15px_rgba(212,175,55,0.4)]' 
                  : 'bg-[#1C1730] text-[#F6EFE0] border border-[#D4AF37]/50 hover:bg-[#7A1F3D] hover:text-[#FFFFFF] hover:border-[#F0D78C] hover:shadow-[0_0_12px_rgba(212,175,55,0.4)]'
              }`}
            >
              সুপার অ্যাক্টিভ মেম্বার ({TEAM_MEMBERS.filter(m => m.role === 'Super Active Member').length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#B3A6C9]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নাম বা আইডি খুঁজুন..."
              className="w-full bg-[#1C1730] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-full pl-9 pr-4 py-2 text-xs text-[#F6EFE0] outline-none transition"
            />
          </div>
        </div>

        {/* Highlight Captain if 'All' or 'Captain' selected */}
        {(selectedRoleFilter === 'All' || selectedRoleFilter === 'Captain') && captain && !searchQuery && (
          <div className="mb-12">
            <div className="max-w-2xl mx-auto bg-[#1C1730] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(212,175,55,0.2)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-[#7A1F3D] text-[#F0D78C] font-black text-xs px-4 py-1.5 rounded-bl-2xl shadow-md flex items-center gap-1.5 border-b border-l border-[#D4AF37]/40">
                <Crown className="w-4 h-4 text-[#F0D78C] fill-[#F0D78C]" />
                <span>ফ্যামিলি ক্যাপ্টেন</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] overflow-hidden animate-pulse">
                    <img 
                      src={captain.image} 
                      alt={captain.name} 
                      className={`w-full h-full rounded-full object-cover transition duration-300 group-hover:scale-110 ${captain.imageClass || 'scale-[1.3] object-top'}`}
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-[#0F0C1A] rounded-full p-1.5 shadow-lg">
                    <Crown className="w-5 h-5 fill-[#0F0C1A]" />
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-2">
                  <div className="inline-flex items-center gap-1 text-xs text-[#F0D78C] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#F0D78C]" />
                    <span>Captain</span>
                  </div>
                  <h3 className="text-2xl font-black font-serif text-[#F0D78C]">{captain.name}</h3>
                  <div className="pt-0.5 pb-1 flex items-center justify-center sm:justify-start">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0F0C1A] text-[#F0D78C] border border-[#D4AF37]/50 rounded-full text-xs font-mono shadow-sm">
                      <Mic className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>ID: {captain.starMakerId}</span>
                    </span>
                  </div>
                  {captain.bio && (
                  <p className="text-sm text-[#B3A6C9] leading-relaxed font-body">{captain.bio}</p>
                  )}
                  
                  {captain.phone && (
                    <div className="pt-2 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#B3A6C9]">
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>যোগাযোগ: {captain.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Co-Captains Section */}
        {(selectedRoleFilter === 'All' || selectedRoleFilter === 'Co-Captain') && (
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-6 border-b border-[#D4AF37]/20 pb-3">
              <div className="p-2 bg-[#7A1F3D]/60 border border-[#D4AF37]/50 rounded-xl">
                <Shield className="w-5 h-5 text-[#F0D78C]" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#F0D78C] flex items-center gap-2">
                  <span>কো-ক্যাপ্টেন পরিষদ</span>
                  <span className="text-xs font-sans bg-[#7A1F3D] text-[#F0D78C] border border-[#D4AF37]/40 px-2.5 py-0.5 rounded-full font-bold">
                    {TEAM_MEMBERS.filter(m => m.role === 'Co-Captain').length} জন
                  </span>
                </h3>
                <p className="text-xs text-[#B3A6C9]">ইভেন্ট কালচারাল, রেজিস্টেশন ও ওভারঅল কো-অর্ডিনেশন টিম</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredMembers
                .filter(m => m.role === 'Co-Captain')
                .map((member) => (
                  <div 
                    key={member.id}
                    className="bg-[#1C1730] border border-[#D4AF37]/40 hover:border-[#D4AF37] rounded-2xl p-5 text-center transition duration-300 hover:-translate-y-1 shadow-xl relative group flex flex-col justify-between"
                  >
                    <div>
                      {/* Role Badge */}
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full border bg-[#7A1F3D]/60 text-[#F0D78C] border-[#D4AF37]/40">
                          <Shield className="w-3 h-3 text-[#D4AF37]" />
                          <span>{member.roleBengali}</span>
                        </span>
                      </div>

                      {/* Photo Frame with Gold Border & Glow */}
                      <div className="w-28 h-28 mx-auto rounded-full p-1 border-2 border-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.35)] mb-3 overflow-hidden bg-[#0F0C1A]">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className={`w-full h-full rounded-full object-cover transition duration-300 group-hover:scale-125 ${member.imageClass || 'scale-[1.4] object-top'}`}
                        />
                      </div>

                      {/* Name & ID */}
                      <h4 className="text-lg font-bold text-[#F6EFE0] font-serif">{member.name}</h4>
                      <div className="mt-1.5 flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#0F0C1A] text-[#F0D78C] border border-[#D4AF37]/40 rounded-full text-xs font-mono shadow-sm">
                          <Mic className="w-3 h-3 text-[#D4AF37] shrink-0" />
                          <span>ID: {member.starMakerId}</span>
                        </span>
                      </div>
                    </div>

                    {member.bio && (
                      <div className="mt-4 pt-3 border-t border-[#D4AF37]/20">
                        <p className="text-xs text-[#B3A6C9] line-clamp-2 font-body">{member.bio}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Admins Section */}
        {(selectedRoleFilter === 'All' || selectedRoleFilter === 'Admin') && (
          <div>
            <div className="flex items-center gap-3 mb-6 border-b border-[#D4AF37]/20 pb-3">
              <div className="p-2 bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#F0D78C] flex items-center gap-2">
                  <span>এডমিন পরিষদ</span>
                  <span className="text-xs font-sans bg-[#0F0C1A] text-[#F0D78C] border border-[#D4AF37]/40 px-2.5 py-0.5 rounded-full font-bold">
                    {TEAM_MEMBERS.filter(m => m.role === 'Admin').length} জন
                  </span>
                </h3>
                <p className="text-xs text-[#B3A6C9]">আইটি, ভেরিফিকেশন, ডিজিটাল প্রমোশন, লজিস্টিকস ও সিকিউরিটি টিম</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMembers
                .filter(m => m.role === 'Admin')
                .map((member) => (
                  <div 
                    key={member.id}
                    className="bg-[#1C1730] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-2xl p-5 text-center transition duration-300 hover:-translate-y-1 shadow-xl relative group flex flex-col justify-between"
                  >
                    <div>
                      {/* Role Badge */}
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full border bg-[#7A1F3D]/40 text-[#F0D78C] border-[#D4AF37]/40">
                          <Sparkles className="w-3 h-3 text-[#F0D78C]" />
                          <span>{member.roleBengali}</span>
                        </span>
                      </div>

                      {/* Photo Frame with Gold Border */}
                      <div className="w-24 h-24 mx-auto rounded-full p-1 border-2 border-[#D4AF37]/70 shadow-[0_0_12px_rgba(212,175,55,0.2)] mb-3 overflow-hidden bg-[#0F0C1A]">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className={`w-full h-full rounded-full object-cover transition duration-300 group-hover:scale-125 ${member.imageClass || 'scale-[1.4] object-top'}`}
                        />
                      </div>

                      {/* Name & ID */}
                      <h4 className="text-base font-bold text-[#F6EFE0] font-serif">{member.name}</h4>
                      <div className="mt-1.5 flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#0F0C1A] text-[#F0D78C] border border-[#D4AF37]/30 rounded-full text-xs font-mono shadow-sm">
                          <Mic className="w-3 h-3 text-[#D4AF37] shrink-0" />
                          <span>ID: {member.starMakerId}</span>
                        </span>
                      </div>
                    </div>

                    {member.bio && (
                      <div className="mt-4 pt-3 border-t border-[#D4AF37]/20">
                        <p className="text-xs text-[#B3A6C9] line-clamp-2 font-body">{member.bio}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Super Active Members Section */}
        {(selectedRoleFilter === 'All' || selectedRoleFilter === 'Super Active Member') && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6 border-b border-[#D4AF37]/20 pb-3">
              <div className="p-2 bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl">
                <Star className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#F0D78C] flex items-center gap-2">
                  <span>সুপার অ্যাক্টিভ মেম্বার পরিষদ</span>
                  <span className="text-xs font-sans bg-[#0F0C1A] text-[#F0D78C] border border-[#D4AF37]/40 px-2.5 py-0.5 rounded-full font-bold">
                    {TEAM_MEMBERS.filter(m => m.role === 'Super Active Member').length} জন
                  </span>
                </h3>
                <p className="text-xs text-[#B3A6C9]">গান বৃষ্টি ফ্যামিলির সবচেয়ে সক্রিয় ও নিবেদিতপ্রাণ মেম্বারবৃন্দ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMembers
                .filter(m => m.role === 'Super Active Member')
                .map((member) => (
                  <div 
                    key={member.id}
                    className="bg-[#1C1730] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-2xl p-5 text-center transition duration-300 hover:-translate-y-1 shadow-xl relative group flex flex-col justify-between"
                  >
                    <div>
                      {/* Role Badge */}
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full border bg-[#D4AF37]/20 text-[#F0D78C] border-[#D4AF37]/50">
                          <Star className="w-3 h-3 text-[#F0D78C]" />
                          <span>{member.roleBengali}</span>
                        </span>
                      </div>

                      {/* Photo Frame with Gold Border */}
                      <div className="w-24 h-24 mx-auto rounded-full p-1 border-2 border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.3)] mb-3 overflow-hidden bg-[#0F0C1A]">
                        <img 
                          src={member.image} 
                          alt={member.name} 
                          className={`w-full h-full rounded-full object-cover transition duration-300 group-hover:scale-110 ${member.imageClass || 'scale-[1.3] object-center'}`}
                        />
                      </div>

                      {/* Name & ID */}
                      <h4 className="text-base font-bold text-[#F6EFE0] font-serif">{member.name}</h4>
                      <div className="mt-1.5 flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#0F0C1A] text-[#F0D78C] border border-[#D4AF37]/30 rounded-full text-xs font-mono shadow-sm">
                          <Mic className="w-3 h-3 text-[#D4AF37] shrink-0" />
                          <span>ID: {member.starMakerId}</span>
                        </span>
                      </div>
                    </div>

                    {member.bio && (
                      <div className="mt-4 pt-3 border-t border-[#D4AF37]/20">
                        <p className="text-xs text-[#B3A6C9] line-clamp-2 font-body">{member.bio}</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

