import { SCHEDULE_DATA } from '../data/eventData';
import { Calendar, Clock, Sparkles, Mic, Music, Utensils, Award, Camera } from 'lucide-react';

export default function Schedule() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Mic': return <Mic className="w-5 h-5 text-amber-400" />;
      case 'Music': return <Music className="w-5 h-5 text-amber-400" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-amber-400" />;
      case 'Award': return <Award className="w-5 h-5 text-amber-400" />;
      case 'Camera': return <Camera className="w-5 h-5 text-amber-400" />;
      default: return <Clock className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section id="schedule" className="py-16 bg-slate-950 text-slate-100 border-t border-amber-500/20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>অভিজাত সময়সূচী</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
            ক্লাসি ইভেন্ট শিডিউল
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            গুলশান ক্লাবের মতো অভিজাত ভেন্যুর জন্য গোছানো ও মার্জিত সময়সূচী
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-red-500 mx-auto my-4 rounded-full"></div>
        </div>

        {/* Timeline Container */}
        <div className="relative border-l-2 border-amber-500/30 ml-4 md:ml-32 space-y-8">
          {SCHEDULE_DATA.map((item, index) => (
            <div key={index} className="relative pl-8 md:pl-10 group">
              
              {/* Timeline Node Bullet */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition duration-300">
                {getIcon(item.iconName)}
              </div>

              {/* Time Badge (Desktop Left Offset / Mobile Inline) */}
              <div className="md:absolute md:-left-36 md:top-2 mb-2 md:mb-0 md:text-right">
                <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                  {item.time}
                </span>
              </div>

              {/* Event Content Box */}
              <div className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 md:p-6 transition duration-300 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg md:text-xl font-bold text-white font-serif">
                    {item.titleBengali}
                  </h3>
                  <span className="text-xs text-slate-400 font-sans hidden sm:inline">
                    ({item.title})
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
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
