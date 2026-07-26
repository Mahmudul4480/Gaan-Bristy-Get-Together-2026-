import { EVENT_DETAILS } from '../data/eventData';
import { MapPin, Navigation, Phone, Shield, Car, CheckCircle2 } from 'lucide-react';

export default function VenueSection() {
  return (
    <section id="venue" className="py-16 bg-slate-900 text-slate-100 border-t border-amber-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>অভিজাত ভেন্যু নির্দেশিকা</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
            ভেন্যু পরিচিতি ও গুগল ম্যাপ লোকেশন
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            ঢাকার প্রাণকেন্দ্র গুলশান-১ এ অবস্থিত ঐতিহাসিক ও স্বনামধন্য গুলশান ক্লাব
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-red-500 mx-auto my-4 rounded-full"></div>
        </div>

        {/* Venue Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-2xl font-bold font-serif text-amber-300 mb-2">
                গুলশান ক্লাব (Gulshan Club)
              </h3>
              <p className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{EVENT_DETAILS.venueAddress}</span>
              </p>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                ঢাকার অন্যতম শীর্ষ ও আন্তর্জাতিক মানের সামাজিক ক্লাব 'গুলশান ক্লাব'। দৃষ্টিনন্দন আধুনিক স্থাপত্য, লাল গালিচা রিসেপশন হল, সুসজ্জিত মাল্টি-কুইজিন বুফে ডাইনিং এবং পর্যাপ্ত কার পার্কিং ব্যবস্থার জন্য এটি বিশ্বমানের।
              </p>

              <div className="space-y-3 border-t border-slate-800 pt-4 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <Car className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>বিনামূল্যে সিকিউরড কার ও বাইক পার্কিং ব্যবস্থা</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>ভিআইপি প্রবেশদ্বার ও ৩-স্তর বিশিষ্ট সিকিউরিটি চেক</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>ড্রেস কোড: ক্লাসি মার্জিত পোশাক বা ট্র্যাডিশনাল এথনিক অটফায়ার</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 bg-amber-500/10 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-amber-300 font-bold uppercase">ভেন্যু হেল্পলাইন</p>
                  <p className="text-base font-bold text-white font-mono">{EVENT_DETAILS.agencyPhone}</p>
                </div>
                <a
                  href={`tel:${EVENT_DETAILS.agencyPhone}`}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>কল করুন</span>
                </a>
              </div>
            </div>

            {/* Transport Directions */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-2">
              <h4 className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                <Navigation className="w-4 h-4" />
                <span>যাতায়াত সুবিধা:</span>
              </h4>
              <p>• <strong className="text-white">উত্তরা / এয়ারপোর্ট থেকে:</strong> প্রগতি সরণি হয়ে গুলশান-১ গোলচত্বরে নেমে মাত্র ২ মিনিট হাঁটার দূরত্ব।</p>
              <p>• <strong className="text-white">মিরপুর / ধানমন্ডি থেকে:</strong> মহাখালী ফ্লাইওভার বা বাড্ডা লিংক রোড দিয়ে সহজেই পৌঁছানো সম্ভব।</p>
            </div>
          </div>

          {/* Map Column */}
          <div className="lg:col-span-7 bg-slate-950 border border-amber-500/30 rounded-3xl p-2 shadow-2xl overflow-hidden h-[450px]">
            <iframe
              title="Gulshan Club Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.058348827926!2d90.41328907533682!3d23.780936778652416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a02b740521%3A0xb351dbf1f5fae98f!2sGulshan%20Club!5e0!3m2!1sen!2sbd!4v1711200000000!5m2!1sen!2sbd"
              className="w-full h-full rounded-2xl border-0 grayscale hover:grayscale-0 transition duration-500"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>

      </div>
    </section>
  );
}
