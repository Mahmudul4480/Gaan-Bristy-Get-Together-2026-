import { useState, useEffect, FormEvent } from 'react';
import { GuestbookEntry } from '../types';
import { MessageSquarePlus, Heart, Music, Send, Sparkles, User, Search, CheckCircle2, MessageCircle, Star } from 'lucide-react';

const INITIAL_GUESTBOOK_ENTRIES: GuestbookEntry[] = [
  {
    id: 'gb-msg-1',
    name: 'MD SAZZAD HOSSAIN',
    starMakerId: 'SAZZAD_GB_CAPTAIN',
    message: 'গান বৃষ্টি পরিবারের সকলকে গুলশান ক্লাবের এই ঐতিহাসিক মিলনমেলায় অগ্রিম সাদর আমন্ত্রণ জানাচ্ছি! সুহৃদ শিল্পী বন্ধুদের সুর আর আড্ডায় স্মরণীয় এক সন্ধ্যা কাটাতে সবাই সময়মতো চলে আসবেন।',
    favoriteSong: 'এই মেঘলা দিনে একলা',
    timestamp: 'আজ সকাল ১০:৩০',
    likes: 42,
    badge: 'Captain',
    avatarColor: 'from-[#D4AF37] to-[#7A1F3D]'
  },
  {
    id: 'gb-msg-2',
    name: 'নাসরিন আক্তার শুভ্রা',
    starMakerId: 'NASRIN_SHUBHRA',
    message: 'ভার্চুয়াল জীবনের এতদিনের বন্ধন এবার গুলশান ক্লাবে সামনাসামনি প্রাণ পাবে! পুরো ইভেন্ট অর্গানাইজিং টিমের জন্য শুভকামনা। গান বৃষ্টির প্রতিটি সুর বেঁচে থাকুক চিরকাল।',
    favoriteSong: 'যদি হিমালয় আল্পস হয়ে দাঁড়িয়ে',
    timestamp: 'গতকাল রাত ৯:১৫',
    likes: 38,
    badge: 'Co-Captain',
    avatarColor: 'from-[#7A1F3D] to-[#0F0C1A]'
  },
  {
    id: 'gb-msg-3',
    name: 'তানভীর আহমেদ রনি',
    starMakerId: 'TANVIR_RONY_GB',
    message: 'স্টারমেকারে গান বৃষ্টির সাথে যুক্ত হবার পর থেকে মিউজিক জার্নিটা অসাধারণ হয়ে উঠেছে। ২০২৬ এর গেট-টুগেদার হবে আমাদের সেরা আয়োজন! দেখা হচ্ছে ১৯ সেপ্টেম্বর!',
    favoriteSong: 'তুমি আমার প্রথম সকাল',
    timestamp: '২৩ জুলাই ২০২৬',
    likes: 29,
    badge: 'Sub-Admin',
    avatarColor: 'from-[#D4AF37] to-[#1C1730]'
  },
  {
    id: 'gb-msg-4',
    name: 'সাবরিনা সুলতানা বৃষ্টি',
    starMakerId: 'SABRINA_BRISTI_SM',
    message: 'গুলশান ক্লাবের এই মহতী সন্ধ্যায় লাইভ পারফর্ম করার জন্য অধীর আগ্রহে অপেক্ষা করছি। গান বৃষ্টি ফ্যামিলি মানেই এক অকৃত্রিম ভালোবাসার ঠিকানা।',
    favoriteSong: 'যে রাতে মোর দুয়ারগুলি',
    timestamp: '২২ জুলাই ২০২৬',
    likes: 31,
    badge: 'Star Singer',
    avatarColor: 'from-[#7A1F3D] to-[#D4AF37]'
  },
  {
    id: 'gb-msg-5',
    name: 'কাজী আরিফুল ইসলাম',
    starMakerId: 'ARIF_GB_GUEST',
    message: 'এরকম চমৎকার ক্লাসি একটি ভেন্যুতে পরিবারের সবাইকে একসাথে পাওয়া আমাদের জন্য অনেক বড় আনন্দের। আগেই টিকিট বুক করে নিয়েছি!',
    favoriteSong: 'যদি আবার জন্ম নিই',
    timestamp: '২১ জুলাই ২০২৬',
    likes: 24,
    badge: 'GB Member',
    avatarColor: 'from-[#1C1730] to-[#7A1F3D]'
  }
];

export default function DigitalGuestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>(() => {
    try {
      const saved = localStorage.getItem('gb_guestbook_entries');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_GUESTBOOK_ENTRIES;
  });

  const [likedMap, setLikedMap] = useState<Record<string, boolean>>(() => {
    try {
      const savedLikes = localStorage.getItem('gb_guestbook_liked_map');
      if (savedLikes) {
        return JSON.parse(savedLikes);
      }
    } catch {
      // Fallback
    }
    return {};
  });

  const [formName, setFormName] = useState('');
  const [formStarMakerId, setFormStarMakerId] = useState('');
  const [formFavoriteSong, setFormFavoriteSong] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('gb_guestbook_entries', JSON.stringify(entries));
    } catch {
      // Ignore
    }
  }, [entries]);

  useEffect(() => {
    try {
      localStorage.setItem('gb_guestbook_liked_map', JSON.stringify(likedMap));
    } catch {
      // Ignore
    }
  }, [likedMap]);

  const handleToggleLike = (id: string) => {
    const isLiked = !!likedMap[id];
    setLikedMap(prev => ({ ...prev, [id]: !isLiked }));
    setEntries(prev =>
      prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            likes: isLiked ? Math.max(0, item.likes - 1) : item.likes + 1
          };
        }
        return item;
      })
    );
  };

  const handleSubmitMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) return;

    const newEntry: GuestbookEntry = {
      id: `gb-msg-${Date.now()}`,
      name: formName.trim(),
      starMakerId: formStarMakerId.trim() || undefined,
      favoriteSong: formFavoriteSong.trim() || undefined,
      message: formMessage.trim(),
      timestamp: 'এইমাত্র',
      likes: 1,
      badge: formStarMakerId.trim() ? 'GB Member' : 'Guest',
      avatarColor: 'from-[#D4AF37] to-[#7A1F3D]'
    };

    setEntries([newEntry, ...entries]);
    setFormName('');
    setFormStarMakerId('');
    setFormFavoriteSong('');
    setFormMessage('');
    setSubmittedSuccess(true);

    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 4000);
  };

  const filteredEntries = entries.filter(item => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.message.toLowerCase().includes(query) ||
      (item.starMakerId && item.starMakerId.toLowerCase().includes(query)) ||
      (item.favoriteSong && item.favoriteSong.toLowerCase().includes(query))
    );
  });

  return (
    <section id="guestbook" className="py-16 bg-[#0F0C1A] text-white relative overflow-hidden border-t border-[#7A1F3D]/30">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1F3D]/20 border border-[#7A1F3D]/50 text-white text-xs font-bold">
            <MessageSquarePlus className="w-4 h-4 text-[#7A1F3D]" />
            <span>Digital Guestbook • গেস্টবুক বার ও শুভেচ্ছা বার্তা</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-english-heading text-white">
            Digital Guestbook
          </h2>
          <p className="text-[#B3A6C9] text-sm sm:text-base font-body">
            ২০২৬ এর গ্র্যান্ড মিলনমেলা উপলক্ষে আপনার মূল্যবান শুভেচ্ছা ও মতামত লিখে গেস্টবুকে পোস্ট করুন।
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#7A1F3D] to-[#D4AF37] mx-auto my-3 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Write Message Form */}
          <div className="lg:col-span-5 bg-[#1C1730] border-2 border-[#7A1F3D] rounded-3xl p-6 sm:p-8 shadow-[0_0_30px_rgba(122,31,61,0.35)] relative">
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#7A1F3D]/30">
              <Sparkles className="w-5 h-5 text-[#7A1F3D]" />
              <h3 className="text-lg font-extrabold text-white font-serif">আপনার শুভেচ্ছা লিখে গেস্টবুকে জানান</h3>
            </div>

            {submittedSuccess && (
              <div className="mb-5 p-3.5 bg-[#7A1F3D]/30 border border-[#7A1F3D] text-white rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="w-5 h-5 text-[#7A1F3D] shrink-0" />
                <span>ধন্যবাদ! আপনার বার্তাটি সফলভাবে গেস্টবুকে যুক্ত হয়েছে।</span>
              </div>
            )}

            <form onSubmit={handleSubmitMessage} className="space-y-4 font-body">
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  আপনার নাম (Full Name) <span className="text-[#7A1F3D]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-[#B3A6C9]" />
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="যেমন: তানজিম রাফাত"
                    className="w-full bg-[#0F0C1A] border border-[#7A1F3D]/40 focus:border-[#7A1F3D] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    স্টারমেকার আইডি (অপশনাল)
                  </label>
                  <input
                    type="text"
                    value={formStarMakerId}
                    onChange={(e) => setFormStarMakerId(e.target.value)}
                    placeholder="যেমন: RAFAT_GB_SM"
                    className="w-full bg-[#0F0C1A] border border-[#7A1F3D]/40 focus:border-[#7A1F3D] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    পছন্দের গান (অপশনাল)
                  </label>
                  <div className="relative">
                    <Music className="absolute left-3 top-3 w-3.5 h-3.5 text-[#B3A6C9]" />
                    <input
                      type="text"
                      value={formFavoriteSong}
                      onChange={(e) => setFormFavoriteSong(e.target.value)}
                      placeholder="যেমন: গান খুঁজে পায় আলো"
                      className="w-full bg-[#0F0C1A] border border-[#7A1F3D]/40 focus:border-[#7A1F3D] rounded-xl pl-8 pr-3 py-2.5 text-sm text-white outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  আপনার শুভেচ্ছা ও অনুভূতি <span className="text-[#7A1F3D]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="গান বৃষ্টি পরিবার ও গুলশান ক্লাবের এই গেট-টুগেদার নিয়ে আপনার অনুভূতি লিখুন..."
                  className="w-full bg-[#0F0C1A] border border-[#7A1F3D]/40 focus:border-[#7A1F3D] rounded-xl p-3.5 text-sm text-white outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="btn-lighting w-full py-3.5 text-white font-extrabold rounded-full text-sm transition shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
                <span className="text-lighting">গেস্টবুকে বার্তা পোস্ট করুন</span>
              </button>
            </form>
          </div>

          {/* RIGHT: Scrollable Feed */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Search & Stats Bar */}
            <div className="bg-[#1C1730] border border-[#7A1F3D]/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-2 text-xs text-white font-semibold w-full sm:w-auto">
                <MessageCircle className="w-4 h-4 text-[#7A1F3D]" />
                <span>মোট শুভেচ্ছা বার্তা: <strong className="text-[#7A1F3D] font-mono text-sm">{entries.length}</strong></span>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#B3A6C9]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="বার্তা বা নাম খুঁজে দেখুন..."
                  className="w-full bg-[#0F0C1A] border border-[#7A1F3D]/40 focus:border-[#7A1F3D] rounded-full pl-8 pr-3 py-1.5 text-xs text-white outline-none transition"
                />
              </div>
            </div>

            {/* Scrollable Container */}
            <div className="max-h-[520px] overflow-y-auto pr-1 space-y-4 custom-scrollbar">
              {filteredEntries.length === 0 ? (
                <div className="bg-[#1C1730]/50 border border-[#7A1F3D]/30 rounded-2xl p-8 text-center text-[#B3A6C9] space-y-2">
                  <p className="text-sm font-semibold">কোনো বার্তা খুঁজে পাওয়া যায়নি!</p>
                  <p className="text-xs text-[#B3A6C9]">আপনার নিজস্ব বার্তা লিখে গেস্টবুকে যুক্ত করুন</p>
                </div>
              ) : (
                filteredEntries.map((entry) => {
                  const isLiked = !!likedMap[entry.id];
                  const initialLetter = entry.name.charAt(0).toUpperCase();

                  return (
                    <div
                      key={entry.id}
                      className="bg-[#1C1730] border border-[#7A1F3D]/30 hover:border-[#7A1F3D] rounded-2xl p-5 shadow-lg transition duration-200 relative group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar Circle */}
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${entry.avatarColor || 'from-[#7A1F3D] to-[#0F0C1A]'} flex items-center justify-center font-bold text-white text-base shadow-md shrink-0 border border-[#7A1F3D]`}>
                            {initialLetter}
                          </div>

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-white font-serif">{entry.name}</h4>
                              {entry.badge && (
                                <span className="bg-[#7A1F3D] text-white border border-white/30 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 font-mono shadow-sm">
                                  <Star className="w-2.5 h-2.5 fill-white" />
                                  {entry.badge}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-[#B3A6C9] mt-0.5">
                              {entry.starMakerId && (
                                <span className="font-mono text-[#7A1F3D] font-bold">
                                  ID: {entry.starMakerId}
                                </span>
                              )}
                              <span>•</span>
                              <span>{entry.timestamp}</span>
                            </div>
                          </div>
                        </div>

                        {/* Like Button */}
                        <button
                          onClick={() => handleToggleLike(entry.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition cursor-pointer ${
                            isLiked
                              ? 'bg-[#7A1F3D] border-white text-white shadow-md'
                              : 'bg-[#0F0C1A] border-[#7A1F3D]/40 text-[#B3A6C9] hover:text-white hover:border-[#7A1F3D]'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-white text-white' : ''}`} />
                          <span className="font-mono">{entry.likes}</span>
                        </button>
                      </div>

                      {/* Message Content */}
                      <p className="text-xs sm:text-sm text-white leading-relaxed pl-1 sm:pl-2 border-l-2 border-[#7A1F3D] my-2 font-body">
                        "{entry.message}"
                      </p>

                      {/* Favorite Song Badge */}
                      {entry.favoriteSong && (
                        <div className="mt-3 pt-2 border-t border-[#7A1F3D]/20 flex items-center gap-1.5 text-[11px] text-[#B3A6C9]">
                          <Music className="w-3 h-3 text-[#7A1F3D]" />
                          <span>পছন্দের গান:</span>
                          <span className="text-[#D4AF37] font-medium italic">"{entry.favoriteSong}"</span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

