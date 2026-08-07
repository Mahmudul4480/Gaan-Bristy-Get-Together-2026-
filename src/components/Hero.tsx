import CountdownTimer from './CountdownTimer';
import { LOGO_URL, EVENT_DETAILS } from '../data/eventData';
import { Calendar, Clock, MapPin, Sparkles, AlertTriangle, ArrowRight, Music, Utensils, Award, Smile } from 'lucide-react';
import AddToCalendar from './AddToCalendar';
import GaanBristyUmbrella from './GaanBristyUmbrella';

interface HeroProps {
  onOpenRegister: () => void;
  onExploreSchedule: () => void;
}

export default function Hero({ onOpenRegister, onExploreSchedule }: HeroProps) {
  const remainingSeats = EVENT_DETAILS.totalSeats - EVENT_DETAILS.reservedSeatsCount;
  const percentageFilled = Math.round((EVENT_DETAILS.reservedSeatsCount / EVENT_DETAILS.totalSeats) * 100);

  return (
    <section id="hero" className="relative overflow-hidden bg-[#0F0C1A] text-[#F6EFE0] pt-8 pb-16 md:pt-12 md:pb-20 border-b border-[#D4AF37]/20 midnight-bg-glow">
      
      {/* Musical Rain Effect (Notes Falling Down in Gold at low opacity) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[
          { left: '3%', symbol: '♪', size: 'text-lg', opacity: 'opacity-25', duration: '7s', delay: '0s' },
          { left: '8%', symbol: '♫', size: 'text-2xl', opacity: 'opacity-35', duration: '6s', delay: '2s' },
          { left: '14%', symbol: '♬', size: 'text-xl', opacity: 'opacity-20', duration: '8s', delay: '4s' },
          { left: '19%', symbol: '♩', size: 'text-sm', opacity: 'opacity-30', duration: '5.5s', delay: '1s' },
          { left: '24%', symbol: '♪', size: 'text-2xl', opacity: 'opacity-25', duration: '7.5s', delay: '3.5s' },
          { left: '76%', symbol: '♫', size: 'text-xl', opacity: 'opacity-30', duration: '6.5s', delay: '0.5s' },
          { left: '81%', symbol: '♬', size: 'text-2xl', opacity: 'opacity-40', duration: '8s', delay: '2.5s' },
          { left: '87%', symbol: '♩', size: 'text-lg', opacity: 'opacity-20', duration: '5s', delay: '1.5s' },
          { left: '92%', symbol: '♪', size: 'text-2xl', opacity: 'opacity-35', duration: '7s', delay: '3s' },
          { left: '96%', symbol: '♫', size: 'text-xl', opacity: 'opacity-25', duration: '6s', delay: '4.5s' },
          { left: '5%', symbol: '♬', size: 'text-sm', opacity: 'opacity-15', duration: '9s', delay: '5s' },
          { left: '94%', symbol: '♩', size: 'text-xl', opacity: 'opacity-30', duration: '7.5s', delay: '6s' },
        ].map((note, idx) => (
          <span
            key={idx}
            className={`music-rain-note ${note.size} ${note.opacity} text-[#D4AF37]`}
            style={{
              left: note.left,
              animationDuration: note.duration,
              animationDelay: note.delay,
            }}
          >
            {note.symbol}
          </span>
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 z-10">
        
        {/* INVITATION CARD FRAME WITH THIN GOLD DOUBLE-LINE BORDER & CORNER DIAMONDS */}
        <div className="relative bg-[#1C1730]/90 border border-[#D4AF37]/60 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_0_50px_rgba(212,175,55,0.15)] backdrop-blur-md">
          
          {/* Umbrella Icons attached at both top ends ("dui mathay") of the Get Together 2026 Card */}
          <div className="absolute -top-6 -left-4 sm:-top-8 sm:-left-6 z-20 w-14 h-14 sm:w-20 sm:h-20 umbrella-spin-slow">
            <GaanBristyUmbrella />
          </div>
          <div className="absolute -top-6 -right-4 sm:-top-8 sm:-right-6 z-20 w-14 h-14 sm:w-20 sm:h-20 umbrella-spin-slow-delayed -scale-x-100">
            <GaanBristyUmbrella />
          </div>

          {/* Outer Corner Ornaments ✦ */}
          <div className="gold-corner-diamond gold-corner-tl">✦</div>
          <div className="gold-corner-diamond gold-corner-tr">✦</div>
          <div className="gold-corner-diamond gold-corner-bl">✦</div>
          <div className="gold-corner-diamond gold-corner-br">✦</div>

          {/* Inner Double Line Frame */}
          <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/30 rounded-2xl pointer-events-none"></div>

          <div className="relative z-10 text-center space-y-6">

            {/* Logo Highlight */}
            <div className="inline-block relative slow-animated-logo">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37] via-[#F0D78C] to-[#D4AF37] rounded-full blur-md opacity-60 slow-animated-glow"></div>
              <div className="relative p-1 bg-[#0F0C1A] rounded-full border-2 border-[#D4AF37] shadow-2xl transition-transform duration-500 hover:scale-105">
                <img 
                  src={LOGO_URL} 
                  alt="Gaan Bristy Logo" 
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover shadow-inner"
                  onError={(e) => {
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#7A1F3D] flex flex-col items-center justify-center text-white font-serif font-bold p-2 text-center text-xs"><span>গান বৃষ্টি</span><span>২০২৬</span></div>`;
                    }
                  }}
                />
              </div>
            </div>

            {/* Headline with Umbrella icons at both ends */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <div className="w-10 h-10 sm:w-16 sm:h-16 shrink-0 umbrella-spin-slow">
                  <GaanBristyUmbrella />
                </div>
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-black font-serif tracking-wider royal-title-effect leading-tight uppercase drop-shadow-[0_4px_20px_rgba(212,175,55,0.3)]">
                  Get Together 2026
                </h1>
                <div className="w-10 h-10 sm:w-16 sm:h-16 shrink-0 umbrella-spin-slow-delayed -scale-x-100">
                  <GaanBristyUmbrella />
                </div>
              </div>
              <div className="pt-1">
                <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F6EFE0] font-bangla tracking-wide drop-shadow-md">
                  "{EVENT_DETAILS.tagline}"
                </span>
              </div>
            </div>

            {/* Urgency Pill: Wine background with Gold Light text and Gold border */}
            <div className="inline-flex items-center gap-2 bg-[#7A1F3D] border border-[#D4AF37] text-[#F0D78C] px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(122,31,61,0.5)] vibrate-pulse-alert">
              <AlertTriangle className="w-5 h-5 text-[#F0D78C] animate-bounce shrink-0" />
              <span className="text-sm sm:text-base font-black tracking-wider font-serif">
                {EVENT_DETAILS.urgencyText} ({remainingSeats} SEATS LEFT)
              </span>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3 my-2 text-[#D4AF37]">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
              <span>✦</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
            </div>

            {/* Date, Time & Venue Bar: Unified Gold-tinted circular badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0F0C1A]/90 border border-[#D4AF37]/30 p-4 rounded-2xl text-left">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#D4AF37]/15 rounded-full border border-[#D4AF37]/40 shrink-0">
                  <Calendar className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#B3A6C9] uppercase font-bold tracking-wider">তারিখ (Date)</p>
                  <p className="text-sm font-bold text-[#F6EFE0]">{EVENT_DETAILS.dateBengali}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#D4AF37]/15 rounded-full border border-[#D4AF37]/40 shrink-0">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#B3A6C9] uppercase font-bold tracking-wider">সময় (Time)</p>
                  <p className="text-sm font-bold text-[#F6EFE0]">{EVENT_DETAILS.timeBengali}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#D4AF37]/15 rounded-full border border-[#D4AF37]/40 shrink-0">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#B3A6C9] uppercase font-bold tracking-wider">ভেন্যু (Venue)</p>
                  <p className="text-sm font-bold text-[#F0D78C]">{EVENT_DETAILS.venueNameBengali}</p>
                </div>
              </div>
            </div>

            {/* Event Highlights (4 Features) */}
            <div>
              <p className="text-xs uppercase tracking-widest text-[#B3A6C9] font-bold mb-3 font-serif">
                EVENT HIGHLIGHTS & EXPERIENCE
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-[#1C1730] border border-[#D4AF37]/30 p-3.5 rounded-xl flex flex-col items-center justify-center space-y-1.5">
                  <div className="p-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10">
                    <Smile className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-xs font-bold text-[#F6EFE0]">Red Carpet Welcome</span>
                </div>
                <div className="bg-[#1C1730] border border-[#D4AF37]/30 p-3.5 rounded-xl flex flex-col items-center justify-center space-y-1.5">
                  <div className="p-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10">
                    <Music className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-xs font-bold text-[#F6EFE0]">Live Unplugged Music</span>
                </div>
                <div className="bg-[#1C1730] border border-[#D4AF37]/30 p-3.5 rounded-xl flex flex-col items-center justify-center space-y-1.5">
                  <div className="p-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10">
                    <Utensils className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-xs font-bold text-[#F6EFE0]">Royal Buffet Dinner</span>
                </div>
                <div className="bg-[#1C1730] border border-[#D4AF37]/30 p-3.5 rounded-xl flex flex-col items-center justify-center space-y-1.5">
                  <div className="p-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10">
                    <Award className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="text-xs font-bold text-[#F6EFE0]">Awards & Recognition</span>
                </div>
              </div>
            </div>

            {/* Registration Fee Box */}
            <div className="p-4 bg-gradient-to-r from-[#7A1F3D]/30 via-[#1C1730] to-[#7A1F3D]/30 border border-[#D4AF37]/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left shadow-lg">
              <div>
                <p className="text-xs text-[#B3A6C9] font-semibold">রেজিস্ট্রেশন ফি (Registration Fee):</p>
                <p className="text-lg sm:text-xl font-extrabold text-[#F6EFE0] font-serif">
                  {EVENT_DETAILS.feeTextEnglish}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs bg-gradient-to-r from-[#D4AF37] to-[#F0D78C] text-[#0F0C1A] border border-[#D4AF37] px-3.5 py-1 rounded-full font-extrabold shadow-md">
                  ALL-INCLUSIVE PASS
                </span>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="bg-[#1C1730] border border-[#D4AF37]/40 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-center gap-2 mb-2 text-xs font-semibold text-[#F6EFE0]">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>রেজিস্ট্রেশনের শেষ তারিখ: {EVENT_DETAILS.registrationDeadlineBengali}</span>
              </div>
              <CountdownTimer targetDateISO={EVENT_DETAILS.registrationDeadlineISO} />
            </div>

            {/* Seat Progress Bar */}
            <div className="max-w-md mx-auto bg-[#1C1730] border border-[#D4AF37]/30 p-3.5 rounded-xl">
              <div className="flex justify-between items-center text-xs mb-1 font-medium">
                <span className="text-[#B3A6C9]">আসন ফিলআপ:</span>
                <span className="text-[#F6EFE0] font-bold">{EVENT_DETAILS.reservedSeatsCount} / {EVENT_DETAILS.totalSeats} বুকড ({percentageFilled}%)</span>
              </div>
              <div className="w-full h-2.5 bg-[#0F0C1A] rounded-full overflow-hidden p-0.5 border border-[#D4AF37]/30">
                <div 
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0D78C] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                  style={{ width: `${percentageFilled}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onOpenRegister}
                id="hero-book-ticket-btn"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#F0D78C] to-[#D4AF37] text-[#0F0C1A] font-black text-base sm:text-lg rounded-full shadow-[0_8px_24px_rgba(212,175,55,0.35)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.5)] transform hover:scale-105 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>রেজিস্ট্রেশন করুন ও টিকিট বুক করুন</span>
                <ArrowRight className="w-5 h-5 text-[#0F0C1A]" />
              </button>

              <button
                onClick={onExploreSchedule}
                id="hero-explore-schedule-btn"
                className="w-full sm:w-auto px-6 py-4 bg-transparent hover:bg-[#1C1730] text-[#F0D78C] font-semibold text-sm rounded-full border border-[#D4AF37] transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>ইভেন্ট শিডিউল</span>
              </button>

              <AddToCalendar variant="compact" />
            </div>

            {/* Footer Credits */}
            <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#B3A6C9] font-accent gap-2">
              <p>Organized by <span className="text-[#F6EFE0] font-bold">{EVENT_DETAILS.organizerName}</span></p>
              <p>Designed by <span className="text-[#D4AF37] font-bold">{EVENT_DETAILS.designerName}</span></p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
