import CountdownTimer from './CountdownTimer';
import { LOGO_URL, EVENT_DETAILS } from '../data/eventData';
import { Calendar, Clock, MapPin, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import AddToCalendar from './AddToCalendar';

interface HeroProps {
  onOpenRegister: () => void;
  onExploreSchedule: () => void;
}

export default function Hero({ onOpenRegister, onExploreSchedule }: HeroProps) {
  const remainingSeats = EVENT_DETAILS.totalSeats - EVENT_DETAILS.reservedSeatsCount;
  const percentageFilled = Math.round((EVENT_DETAILS.reservedSeatsCount / EVENT_DETAILS.totalSeats) * 100);

  return (
    <section id="hero" className="relative overflow-hidden bg-slate-950 text-slate-100 pt-10 pb-16 md:pt-16 md:pb-24 border-b border-amber-500/20">
      
      {/* Background Decorative Gradients & Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-600/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[140px]"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Family Logo Highlight */}
        <div className="inline-block mb-6 relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-red-600 rounded-full blur-md opacity-70 animate-pulse"></div>
          <div className="relative p-1 bg-slate-950 rounded-full border-2 border-amber-400/80 shadow-2xl">
            <img 
              src={LOGO_URL} 
              alt="Gaan Bristy Logo" 
              className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-inner"
              onError={(e) => {
                // If logo URL has CORS issue or fails, show stylized text badge fallback
                const parent = (e.target as HTMLElement).parentElement;
                if (parent) {
                  parent.innerHTML = `<div class="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amber-600 to-red-700 flex flex-col items-center justify-center text-white font-serif font-bold p-2 text-center text-xs"><span>গান বৃষ্টি</span><span>২০২৬</span></div>`;
                }
              }}
            />
          </div>
        </div>

        {/* Urgency Badge requested by User */}
        <div className="mb-4 inline-flex items-center gap-2 bg-gradient-to-r from-red-950/90 via-red-900/80 to-amber-950/90 border-2 border-amber-400/80 text-amber-200 px-5 py-2 rounded-full shadow-lg shadow-red-900/30 animate-bounce">
          <AlertTriangle className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-wide font-serif">
            {EVENT_DETAILS.urgencyText}
          </span>
        </div>

        {/* Event Main Titles */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif tracking-tight text-white leading-tight mb-3">
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300 drop-shadow-sm">
            Gaan Bristy Grand Get-Together 2026
          </span>
          <span className="block text-xl sm:text-3xl lg:text-4xl text-slate-200 mt-2 font-sans font-medium">
            Melody at Gulshan Club
          </span>
        </h1>

        {/* Tagline */}
        <div className="my-4 inline-block">
          <span className="text-lg sm:text-2xl font-serif text-amber-300 italic tracking-wider bg-slate-900/60 border-y border-amber-500/30 px-6 py-1.5 rounded-lg">
            "{EVENT_DETAILS.tagline}"
          </span>
        </div>

        {/* Key Event Metadata Cards */}
        <div id="hero-metadata-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto my-6 text-left">
          
          <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 p-3.5 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">অনুষ্ঠানের তারিখ</p>
              <p className="text-sm sm:text-base font-bold text-slate-100">{EVENT_DETAILS.dateBengali}</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 p-3.5 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">সময়সূচী</p>
              <p className="text-sm sm:text-base font-bold text-slate-100">{EVENT_DETAILS.timeBengali}</p>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 p-3.5 rounded-2xl flex items-center gap-3 backdrop-blur-sm">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">ভেন্যু</p>
              <p className="text-sm sm:text-base font-bold text-amber-300">{EVENT_DETAILS.venueNameBengali}</p>
            </div>
          </div>

        </div>

        {/* Countdown Timer Box */}
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 my-6 max-w-2xl mx-auto shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-center gap-2 mb-2 text-xs font-semibold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>রেজিস্ট্রেশনের শেষ সময়: {EVENT_DETAILS.registrationDeadlineBengali}</span>
          </div>
          <CountdownTimer targetDateISO={EVENT_DETAILS.registrationDeadlineISO} />
          <p className="text-xs text-slate-400 mt-2">
            দ্রুত সিদ্ধান্তের জন্য সময় গণনা করা হচ্ছে। শেষ মুহূর্তের ভিড় এড়াতে এখনই আসন নিশ্চিত করুন।
          </p>
        </div>

        {/* Live Seat Occupancy Meter */}
        <div className="max-w-md mx-auto my-6 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
            <span className="text-slate-300">আসন বুকিং অগ্রগতি:</span>
            <span className="text-amber-400 font-bold">{EVENT_DETAILS.reservedSeatsCount} / {EVENT_DETAILS.totalSeats} টি সিট বুকড ({percentageFilled}%)</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-1000"
              style={{ width: `${percentageFilled}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-red-400 font-semibold mt-1.5 text-right">
            🔥 মাত্র {remainingSeats} টি সিট খালি আছে!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <button
            onClick={onOpenRegister}
            id="hero-book-ticket-btn"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold text-base rounded-2xl shadow-xl shadow-amber-500/20 transform hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2"
          >
            <span>রেজিস্ট্রেশন করুন ও টিকিট নিন</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onExploreSchedule}
            id="hero-explore-schedule-btn"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm rounded-2xl border border-slate-700 hover:border-amber-500/40 transition flex items-center justify-center gap-2"
          >
            <span>ইভেন্ট শিডিউল দেখুন</span>
          </button>

          <AddToCalendar variant="compact" />
        </div>

      </div>
    </section>
  );
}
