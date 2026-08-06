import CountdownTimer from './CountdownTimer';
import { LOGO_URL, EVENT_DETAILS } from '../data/eventData';
import { Calendar, Clock, MapPin, Sparkles, AlertTriangle, ArrowRight, Music, Utensils, Award, Smile } from 'lucide-react';
import AddToCalendar from './AddToCalendar';

interface HeroProps {
  onOpenRegister: () => void;
  onExploreSchedule: () => void;
}

export default function Hero({ onOpenRegister, onExploreSchedule }: HeroProps) {
  const remainingSeats = EVENT_DETAILS.totalSeats - EVENT_DETAILS.reservedSeatsCount;
  const percentageFilled = Math.round((EVENT_DETAILS.reservedSeatsCount / EVENT_DETAILS.totalSeats) * 100);

  return (
    <section id="hero" className="relative overflow-hidden bg-[#0F0C1A] text-[#F6EFE0] pt-8 pb-16 md:pt-12 md:pb-20 border-b border-[#D4AF37]/30 midnight-bg-glow">
      
      {/* Musical Rain Effect (Notes Falling Down from Top) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[
          { left: '3%', symbol: '♪', size: 'text-lg', color: 'text-[#D4AF37]', duration: '7s', delay: '0s' },
          { left: '8%', symbol: '♫', size: 'text-2xl', color: 'text-[#F0D78C]', duration: '6s', delay: '2s' },
          { left: '14%', symbol: '♬', size: 'text-xl', color: 'text-[#B3A6C9]', duration: '8s', delay: '4s' },
          { left: '19%', symbol: '♩', size: 'text-sm', color: 'text-[#D4AF37]', duration: '5.5s', delay: '1s' },
          { left: '24%', symbol: '♪', size: 'text-2xl', color: 'text-[#F0D78C]', duration: '7.5s', delay: '3.5s' },
          { left: '76%', symbol: '♫', size: 'text-xl', color: 'text-[#D4AF37]', duration: '6.5s', delay: '0.5s' },
          { left: '81%', symbol: '♬', size: 'text-2xl', color: 'text-[#F0D78C]', duration: '8s', delay: '2.5s' },
          { left: '87%', symbol: '♩', size: 'text-lg', color: 'text-[#B3A6C9]', duration: '5s', delay: '1.5s' },
          { left: '92%', symbol: '♪', size: 'text-2xl', color: 'text-[#D4AF37]', duration: '7s', delay: '3s' },
          { left: '96%', symbol: '♫', size: 'text-xl', color: 'text-[#F0D78C]', duration: '6s', delay: '4.5s' },
          { left: '5%', symbol: '♬', size: 'text-sm', color: 'text-[#F0D78C]', duration: '9s', delay: '5s' },
          { left: '94%', symbol: '♩', size: 'text-xl', color: 'text-[#D4AF37]', duration: '7.5s', delay: '6s' },
        ].map((note, idx) => (
          <span
            key={idx}
            className={`music-rain-note ${note.size} ${note.color}`}
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
        
        {/* INVITATION CARD FRAME WITH DOUBLE GOLD BORDER & CORNER DIAMONDS */}
        <div className="relative bg-[#1C1730]/90 border border-[#D4AF37]/50 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_0_50px_rgba(212,175,55,0.15)] backdrop-blur-md">
          
          {/* Outer Corner Ornaments ✦ */}
          <div className="gold-corner-diamond gold-corner-tl">✦</div>
          <div className="gold-corner-diamond gold-corner-tr">✦</div>
          <div className="gold-corner-diamond gold-corner-bl">✦</div>
          <div className="gold-corner-diamond gold-corner-br">✦</div>

          {/* Inner Double Line Frame */}
          <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/25 rounded-2xl pointer-events-none"></div>

          <div className="relative z-10 text-center space-y-6">

            {/* Logo Highlight with Slow Smooth Animation */}
            <div className="inline-block relative slow-animated-logo">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37] via-[#F0D78C] to-[#7A1F3D] rounded-full blur-md opacity-70 slow-animated-glow"></div>
              <div className="relative p-1 bg-[#0F0C1A] rounded-full border-2 border-[#D4AF37] shadow-2xl transition-transform duration-500 hover:scale-105">
                <img 
                  src={LOGO_URL} 
                  alt="Gaan Bristy Logo" 
                  className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover shadow-inner"
                  onError={(e) => {
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#7A1F3D] to-[#0F0C1A] flex flex-col items-center justify-center text-[#F0D78C] font-serif font-bold p-2 text-center text-xs"><span>গান বৃষ্টি</span><span>২০২৬</span></div>`;
                    }
                  }}
                />
              </div>
            </div>

            {/* Title & Golden Taglines */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-english-heading tracking-tight gold-gradient-text leading-tight drop-shadow-lg">
                Get Together 2026
              </h1>
              <div className="pt-1">
                <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F0D78C] font-bangla tracking-wide drop-shadow-md">
                  "{EVENT_DETAILS.tagline}"
                </span>
              </div>
            </div>

            {/* Seats Urgency Pill */}
            <div className="inline-flex items-center gap-2 bg-[#7A1F3D]/80 border border-[#D4AF37]/60 text-[#F0D78C] px-5 py-2 rounded-full shadow-lg">
              <AlertTriangle className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              <span className="text-xs sm:text-sm font-extrabold tracking-wider font-serif">
                {EVENT_DETAILS.urgencyText} ({remainingSeats} SEATS LEFT)
              </span>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center gap-3 my-2 text-[#D4AF37]">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
              <span>✦</span>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
            </div>

            {/* Date, Time & Venue Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0F0C1A]/80 border border-[#D4AF37]/30 p-4 rounded-2xl text-left">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#7A1F3D]/50 text-[#F0D78C] rounded-xl border border-[#D4AF37]/30">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#B3A6C9] uppercase font-bold tracking-wider">তারিখ (Date)</p>
                  <p className="text-sm font-bold text-[#F6EFE0]">{EVENT_DETAILS.dateBengali}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#7A1F3D]/50 text-[#F0D78C] rounded-xl border border-[#D4AF37]/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-[#B3A6C9] uppercase font-bold tracking-wider">সময় (Time)</p>
                  <p className="text-sm font-bold text-[#F6EFE0]">{EVENT_DETAILS.timeBengali}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#7A1F3D]/50 text-[#F0D78C] rounded-xl border border-[#D4AF37]/30">
                  <MapPin className="w-5 h-5" />
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
                <div className="bg-[#0F0C1A]/60 border border-[#D4AF37]/25 p-3 rounded-xl flex flex-col items-center justify-center space-y-1">
                  <Smile className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-[#F6EFE0]">Red Carpet Welcome</span>
                </div>
                <div className="bg-[#0F0C1A]/60 border border-[#D4AF37]/25 p-3 rounded-xl flex flex-col items-center justify-center space-y-1">
                  <Music className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-[#F6EFE0]">Live Unplugged Music</span>
                </div>
                <div className="bg-[#0F0C1A]/60 border border-[#D4AF37]/25 p-3 rounded-xl flex flex-col items-center justify-center space-y-1">
                  <Utensils className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-[#F6EFE0]">Royal Buffet Dinner</span>
                </div>
                <div className="bg-[#0F0C1A]/60 border border-[#D4AF37]/25 p-3 rounded-xl flex flex-col items-center justify-center space-y-1">
                  <Award className="w-5 h-5 text-[#D4AF37]" />
                  <span className="text-xs font-bold text-[#F6EFE0]">Awards & Recognition</span>
                </div>
              </div>
            </div>

            {/* Registration Fee Box */}
            <div className="p-4 bg-gradient-to-r from-[#7A1F3D]/60 via-[#1C1730] to-[#7A1F3D]/60 border-2 border-[#D4AF37]/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div>
                <p className="text-xs text-[#B3A6C9] font-semibold">রেজিস্ট্রেশন ফি (Registration Fee):</p>
                <p className="text-lg sm:text-xl font-extrabold text-[#F0D78C] font-serif">
                  {EVENT_DETAILS.feeTextEnglish}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs bg-[#D4AF37]/20 text-[#F0D78C] border border-[#D4AF37]/40 px-3 py-1 rounded-full font-bold">
                  অল-ইনক্লুসিভ প্রবেশপত্র
                </span>
              </div>
            </div>

            {/* Countdown Box */}
            <div className="bg-[#0F0C1A]/90 border border-[#D4AF37]/30 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-center gap-2 mb-2 text-xs font-semibold text-[#F0D78C]">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>রেজিস্ট্রেশনের শেষ তারিখ: {EVENT_DETAILS.registrationDeadlineBengali}</span>
              </div>
              <CountdownTimer targetDateISO={EVENT_DETAILS.registrationDeadlineISO} />
            </div>

            {/* Seat Progress Bar */}
            <div className="max-w-md mx-auto bg-[#0F0C1A]/70 border border-[#D4AF37]/20 p-3.5 rounded-xl">
              <div className="flex justify-between items-center text-xs mb-1 font-medium">
                <span className="text-[#B3A6C9]">আসন ফিলআপ:</span>
                <span className="text-[#F0D78C] font-bold">{EVENT_DETAILS.reservedSeatsCount} / {EVENT_DETAILS.totalSeats} বুকড ({percentageFilled}%)</span>
              </div>
              <div className="w-full h-2.5 bg-[#0F0C1A] rounded-full overflow-hidden p-0.5 border border-[#D4AF37]/30">
                <div 
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#7A1F3D] rounded-full transition-all duration-1000"
                  style={{ width: `${percentageFilled}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={onOpenRegister}
                id="hero-book-ticket-btn"
                className="w-full sm:w-auto px-8 py-4 gold-gradient-btn text-[#0F0C1A] font-extrabold text-base rounded-full shadow-2xl transform hover:scale-105 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>রেজিস্ট্রেশন করুন ও টিকিট বুক করুন</span>
                <ArrowRight className="w-5 h-5 text-[#0F0C1A]" />
              </button>

              <button
                onClick={onExploreSchedule}
                id="hero-explore-schedule-btn"
                className="w-full sm:w-auto px-6 py-4 bg-[#0F0C1A] hover:bg-[#1C1730] text-[#F6EFE0] font-semibold text-sm rounded-full border border-[#D4AF37]/40 hover:border-[#D4AF37] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ইভেন্ট শিডিউল</span>
              </button>

              <AddToCalendar variant="compact" />
            </div>

            {/* Footer Credits */}
            <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#B3A6C9] font-accent gap-2">
              <p>Organized by <span className="text-[#F0D78C] font-bold">{EVENT_DETAILS.organizerName}</span></p>
              <p>Designed by <span className="text-[#D4AF37] font-bold">{EVENT_DETAILS.designerName}</span></p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

