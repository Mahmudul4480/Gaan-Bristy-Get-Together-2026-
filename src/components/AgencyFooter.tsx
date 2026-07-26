import { EVENT_DETAILS } from '../data/eventData';
import { Globe, Phone, Smartphone, Code, Share2, Sparkles, Heart } from 'lucide-react';

export default function AgencyFooter() {
  return (
    <footer id="agency-footer" className="bg-slate-950 text-slate-100 border-t border-amber-500/20 pt-16 pb-12 relative overflow-hidden">
      
      {/* Background Decorative Element */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950 to-slate-950 opacity-90 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Agency Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>অফিশিয়াল ডিজিটাল অ্যান্ড টেক পার্টনার</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-serif text-white tracking-tight">
                {EVENT_DETAILS.agencyName}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                ওয়েবসাইট, মোবাইল অ্যাপস ডেভেলপমেন্ট, সোশ্যাল মিডিয়া সার্ভিস, ডিজিটাল মার্কেটিং এবং গ্রাফিক্স ব্র্যান্ডিং সংক্রান্ত যেকোনো সেবার জন্য আমাদের সাথে যোগাযোগ করুন।
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
                <a
                  href={EVENT_DETAILS.agencyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 px-4 py-2 rounded-xl transition"
                >
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>www.socialmediacareing.com</span>
                </a>

                <a
                  href={`tel:${EVENT_DETAILS.agencyPhone}`}
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 py-2 rounded-xl transition font-mono"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{EVENT_DETAILS.agencyPhone}</span>
                </a>
              </div>
            </div>

            {/* Right Agency Service Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center gap-2.5">
                <Code className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-white">ওয়েবসাইট সাইট</h4>
                  <p className="text-[10px] text-slate-400">Web Development</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-blue-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-white">মোবাইল অ্যাপস</h4>
                  <p className="text-[10px] text-slate-400">iOS & Android</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center gap-2.5">
                <Share2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-white">সোশ্যাল মিডিয়া</h4>
                  <p className="text-[10px] text-slate-400">Social Careing</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-white">ডিজিটাল সার্ভিস</h4>
                  <p className="text-[10px] text-slate-400">Digital Marketing</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Bottom Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="flex items-center gap-1.5">
            <span>© ২০২৬ Gaan Bristy Family • সর্বস্বত্ব সংরক্ষিত।</span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center gap-1 text-slate-400">
              ভালোবাসায় তৈরি <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </span>
          </p>

          <p className="font-mono text-amber-400/80">
            Powered by <a href={EVENT_DETAILS.agencyUrl} target="_blank" rel="noreferrer" className="underline hover:text-amber-300">SocialMediaCareing.com</a>
          </p>
        </div>

      </div>
    </footer>
  );
}
