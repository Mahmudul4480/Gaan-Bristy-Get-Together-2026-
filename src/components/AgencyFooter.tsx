import { EVENT_DETAILS } from '../data/eventData';
import { Globe, Phone, Smartphone, Code, Share2, Sparkles, Heart } from 'lucide-react';

export default function AgencyFooter() {
  return (
    <footer id="agency-footer" className="bg-[#0F0C1A] text-[#F6EFE0] border-t border-[#D4AF37]/30 pt-16 pb-12 relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-[#7A1F3D]/20 via-transparent to-transparent pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Agency Banner */}
        <div className="bg-[#1C1730] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-3 font-body">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7A1F3D]/60 border border-[#D4AF37]/40 text-[#F0D78C] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>অফিশিয়াল ডিজিটাল অ্যান্ড টেক পার্টনার</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-english-heading text-[#F0D78C] tracking-tight">
                {EVENT_DETAILS.agencyName}
              </h3>

              <p className="text-sm text-[#B3A6C9] leading-relaxed">
                ওয়েবসাইট, মোবাইল অ্যাপস ডেভেলপমেন্ট, সোশ্যাল মিডিয়া সার্ভিস, ডিজিটাল মার্কেটিং এবং গ্রাফিক্স ব্র্যান্ডিং সংক্রান্ত যেকোনো সেবার জন্য আমাদের সাথে যোগাযোগ করুন।
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
                <a
                  href={EVENT_DETAILS.agencyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-[#7A1F3D]/50 hover:bg-[#7A1F3D] text-[#F0D78C] border border-[#D4AF37]/40 px-4 py-2 rounded-xl transition"
                >
                  <Globe className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-mono">www.socialmediacareing.com</span>
                </a>

                <a
                  href={`tel:${EVENT_DETAILS.agencyPhone}`}
                  className="flex items-center gap-2 bg-[#0F0C1A] hover:bg-[#0F0C1A]/80 text-[#F6EFE0] border border-[#D4AF37]/40 px-4 py-2 rounded-xl transition font-mono"
                >
                  <Phone className="w-4 h-4 text-[#D4AF37]" />
                  <span>{EVENT_DETAILS.agencyPhone}</span>
                </a>
              </div>
            </div>

            {/* Right Agency Service Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs font-body">
              <div className="p-3 bg-[#0F0C1A] rounded-2xl border border-[#D4AF37]/30 flex items-center gap-2.5">
                <Code className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#F6EFE0]">ওয়েবসাইট সাইট</h4>
                  <p className="text-[10px] text-[#B3A6C9]">Web Development</p>
                </div>
              </div>

              <div className="p-3 bg-[#0F0C1A] rounded-2xl border border-[#D4AF37]/30 flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#F6EFE0]">মোবাইল অ্যাপস</h4>
                  <p className="text-[10px] text-[#B3A6C9]">iOS & Android</p>
                </div>
              </div>

              <div className="p-3 bg-[#0F0C1A] rounded-2xl border border-[#D4AF37]/30 flex items-center gap-2.5">
                <Share2 className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#F6EFE0]">সোশ্যাল মিডিয়া</h4>
                  <p className="text-[10px] text-[#B3A6C9]">Social Careing</p>
                </div>
              </div>

              <div className="p-3 bg-[#0F0C1A] rounded-2xl border border-[#D4AF37]/30 flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <h4 className="font-bold text-[#F6EFE0]">ডিজিটাল সার্ভিস</h4>
                  <p className="text-[10px] text-[#B3A6C9]">Digital Marketing</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Bottom Copyright */}
        <div className="pt-8 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#B3A6C9] gap-4 font-body">
          <p className="flex items-center gap-1.5">
            <span>© ২০২৬ Gaan Bristy Family • সর্বস্বত্ব সংরক্ষিত।</span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center gap-1 text-[#F6EFE0]">
              ভালোবাসায় তৈরি <Heart className="w-3.5 h-3.5 text-[#7A1F3D] fill-[#7A1F3D]" />
            </span>
          </p>

          <p className="font-mono text-[#F0D78C]">
            Powered by <a href={EVENT_DETAILS.agencyUrl} target="_blank" rel="noreferrer" className="underline hover:text-[#F6EFE0]">SocialMediaCareing.com</a>
          </p>
        </div>

      </div>
    </footer>
  );
}

