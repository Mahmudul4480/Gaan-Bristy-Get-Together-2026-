import { useState } from 'react';
import { TEAM_MEMBERS } from '../data/eventData';
import { Crown, Shield, Users, Search, Sparkles, Star, Phone } from 'lucide-react';

export default function TeamShowcase() {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'All' | 'Captain' | 'Co-Captain' | 'Sub-Admin'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = TEAM_MEMBERS.filter(member => {
    const matchesRole = selectedRoleFilter === 'All' || member.role === selectedRoleFilter;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (member.starMakerId && member.starMakerId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const captain = TEAM_MEMBERS.find(m => m.role === 'Captain');
  const coCaptains = TEAM_MEMBERS.filter(m => m.role === 'Co-Captain');
  const subAdmins = TEAM_MEMBERS.filter(m => m.role === 'Sub-Admin');

  return (
    <section id="team" className="py-16 bg-slate-900 text-slate-100 border-t border-amber-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>ফ্যামিলি কমিটি ও আয়োজক পরিষদ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
            গান বৃষ্টি ফ্যামিলি মেম্বারস
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            ১ জন ক্যাপ্টেন • ৫ জন কো-ক্যাপ্টেন • ৮ জন সাব-এডমিন এর নেতৃত্ব ও ভালোবাসায় গড়া আয়োজন
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-red-500 mx-auto my-4 rounded-full"></div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedRoleFilter('All')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${selectedRoleFilter === 'All' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-300 border border-slate-800'}`}
            >
              সকল মেম্বার (১৪)
            </button>
            <button
              onClick={() => setSelectedRoleFilter('Captain')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${selectedRoleFilter === 'Captain' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-300 border border-slate-800'}`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              ক্যাপ্টেন (১)
            </button>
            <button
              onClick={() => setSelectedRoleFilter('Co-Captain')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${selectedRoleFilter === 'Co-Captain' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-300 border border-slate-800'}`}
            >
              কো-ক্যাপ্টেন (৫)
            </button>
            <button
              onClick={() => setSelectedRoleFilter('Sub-Admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${selectedRoleFilter === 'Sub-Admin' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-300 border border-slate-800'}`}
            >
              সাব-এডমিন (৮)
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নাম বা আইডি খুঁজুন..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none transition"
            />
          </div>
        </div>

        {/* Highlight Captain if 'All' or 'Captain' selected */}
        {(selectedRoleFilter === 'All' || selectedRoleFilter === 'Captain') && captain && !searchQuery && (
          <div className="mb-12">
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-black text-xs px-4 py-1.5 rounded-bl-2xl shadow-md flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>ফ্যামিলি ক্যাপ্টেন</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-amber-400 shadow-xl overflow-hidden">
                    <img 
                      src={captain.image} 
                      alt={captain.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 rounded-full p-1.5 shadow-lg">
                    <Crown className="w-5 h-5 fill-slate-950" />
                  </div>
                </div>

                <div className="text-center sm:text-left space-y-2">
                  <div className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Gaan Bristy Family Leader</span>
                  </div>
                  <h3 className="text-2xl font-black font-serif text-white">{captain.name}</h3>
                  <p className="text-xs font-mono text-amber-300">{captain.starMakerId}</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{captain.bio}</p>
                  
                  {captain.phone && (
                    <div className="pt-2 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>যোগাযোগ: {captain.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Co-Captains & Sub-Admins Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMembers
            .filter(m => selectedRoleFilter !== 'All' || m.role !== 'Captain') // Don't repeat Captain if already highlighted
            .map((member) => (
              <div 
                key={member.id}
                className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 text-center transition duration-300 hover:-translate-y-1 shadow-lg relative group flex flex-col justify-between"
              >
                <div>
                  {/* Role Badge */}
                  <div className="mb-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full border ${
                      member.role === 'Co-Captain'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-400/30'
                        : 'bg-blue-500/10 text-blue-300 border-blue-400/30'
                    }`}>
                      {member.role === 'Co-Captain' ? <Shield className="w-3 h-3 text-amber-400" /> : <Sparkles className="w-3 h-3 text-blue-400" />}
                      <span>{member.roleBengali}</span>
                    </span>
                  </div>

                  {/* Photo Frame */}
                  <div className="w-24 h-24 mx-auto rounded-full p-1 bg-gradient-to-tr from-amber-500 to-slate-800 mb-3 shadow-md overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full rounded-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Name & ID */}
                  <h4 className="text-base font-bold text-white font-serif">{member.name}</h4>
                  <p className="text-xs font-mono text-amber-400/90 mt-0.5">{member.starMakerId}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900">
                  <p className="text-xs text-slate-400 line-clamp-2">{member.bio}</p>
                </div>
              </div>
            ))}
        </div>

      </div>
    </section>
  );
}
