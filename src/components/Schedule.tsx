import { SCHEDULE_DATA } from '../data/eventData';
import { Calendar, Clock, Sparkles, Mic, Music, Utensils, Award, Camera } from 'lucide-react';

export default function Schedule() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#D4AF37]" />;
      case 'Mic': return <Mic className="w-5 h-5 text-[#D4AF37]" />;
      case 'Music': return <Music className="w-5 h-5 text-[#D4AF37]" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-[#D4AF37]" />;
      case 'Award': return <Award className="w-5 h-5 text-[#D4AF37]" />;
      case 'Camera': return <Camera className="w-5 h-5 text-[#D4AF37]" />;
      default: return <Clock className="w-5 h-5 text-[#D4AF37]" />;
    }
  };

  return (
    <section id="schedule" className="py-16 bg-[#0F0C1A] text-[#F6EFE0] border-t border-[#D4AF37]/20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1F3D] border border-[#D4AF37]/50 text-[#F0D78C] text-xs font-bold mb-3 shadow-md">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>অভিজাত সময়সূচী (Schedule)</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-english-heading text-[#F6EFE0] tracking-tight">
            Event Schedule
          </h2>
          <p className="text-[#B3A6C9] text-sm mt-1 font-body">
            গুলশান ক্লাবের রাজকীয় আবহে পরিকল্পিত বিশেষ সময়সূচী
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-[#F0D78C] mx-auto my-4 rounded-full"></div>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-[#D4AF37]/40 ml-4 md:ml-32 space-y-8">
          {SCHEDULE_DATA.map((item, index) => (
            <div key={index} className="relative pl-8 md:pl-10 group">
              
              {/* Timeline Node Bullet */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-[#1C1730] border-2 border-[#D4AF37] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#D4AF37] transition duration-300">
                {getIcon(item.iconName)}
              </div>

              {/* Time Badge */}
              <div className="md:absolute md:-left-36 md:top-2 mb-2 md:mb-0 md:text-right">
                <span className="inline-block bg-[#7A1F3D] border border-[#D4AF37]/50 text-[#F0D78C] font-mono font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                  {item.time}
                </span>
              </div>

              {/* Event Content Box */}
              <div className="bg-[#1C1730] border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-2xl p-5 md:p-6 transition duration-300 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg md:text-xl font-bold text-[#F6EFE0] font-serif">
                    {item.titleBengali}
                  </h3>
                  <span className="text-xs text-[#B3A6C9] font-accent hidden sm:inline">
                    ({item.title})
                  </span>
                </div>
                <p className="text-sm text-[#B3A6C9] leading-relaxed font-body">
                  {item.description}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
