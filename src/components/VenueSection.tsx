import { EVENT_DETAILS } from '../data/eventData';
import { MapPin, Navigation, Phone, Shield, Car, CheckCircle2 } from 'lucide-react';

export default function VenueSection() {
  return (
    <section id="venue" className="py-16 bg-[#0F0C1A] text-[#F6EFE0] border-t border-[#D4AF37]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1F3D]/60 border border-[#D4AF37]/40 text-[#F0D78C] text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>অভিজাত ভেন্যু নির্দেশিকা</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-english-heading text-[#F0D78C] tracking-tight">
            Venue Location
          </h2>
          <p className="text-[#B3A6C9] text-sm mt-1 font-body">
            ঢাকার প্রাণকেন্দ্র গুলশান-১ এ অবস্থিত স্বনামধন্য গুলশান ক্লাব
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-[#7A1F3D] mx-auto my-4 rounded-full"></div>
        </div>

        {/* Venue Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1C1730] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <h3 className="text-2xl font-bold font-serif text-[#F0D78C] mb-2">
                গুলশান ক্লাব (Gulshan Club)
              </h3>
              <p className="text-xs text-[#B3A6C9] mb-4 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>{EVENT_DETAILS.venueAddress}</span>
              </p>

              <p className="text-sm text-[#F6EFE0] leading-relaxed mb-6 font-body">
                ঢাকার অন্যতম শীর্ষ ও আন্তর্জাতিক মানের সামাজিক ক্লাব 'গুলশান ক্লাব'। দৃষ্টিনন্দন আধুনিক স্থাপত্য, লাল গালিচা রিসেপশন হল, সুসজ্জিত মাল্টি-কুইজিন বুফে ডাইনিং এবং পর্যাপ্ত কার পার্কিং ব্যবস্থার জন্য এটি বিশ্বমানের।
              </p>

              <div className="space-y-3 border-t border-[#D4AF37]/20 pt-4 text-xs font-body">
                <div className="flex items-center gap-2 text-[#F6EFE0]">
                  <Car className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>বিনামূল্যে সিকিউরড কার ও বাইক পার্কিং ব্যবস্থা</span>
                </div>
                <div className="flex items-center gap-2 text-[#F6EFE0]">
                  <Shield className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>ভিআইপি প্রবেশদ্বার ও সিকিউরিটি চেক ব্যবস্থা</span>
                </div>
                <div className="flex items-center gap-2 text-[#F6EFE0]">
                  <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>ড্রেস কোড: ক্লাসি মার্জিত পোশাক বা ট্র্যাডিশনাল এথনিক অটফায়ার</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 bg-[#7A1F3D]/50 p-4 rounded-2xl flex items-center justify-between border border-[#D4AF37]/30">
                <div>
                  <p className="text-[11px] text-[#F0D78C] font-bold uppercase">ভেন্যু হেল্পলাইন</p>
                  <p className="text-base font-bold text-[#F6EFE0] font-mono">{EVENT_DETAILS.agencyPhone}</p>
                </div>
                <a
                  href={`tel:${EVENT_DETAILS.agencyPhone}`}
                  className="px-4 py-2 gold-gradient-btn text-[#0F0C1A] font-bold text-xs rounded-full transition flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>কল করুন</span>
                </a>
              </div>
            </div>

            {/* Transport Directions */}
            <div className="bg-[#1C1730] border border-[#D4AF37]/30 rounded-2xl p-5 text-xs text-[#B3A6C9] space-y-2 font-body">
              <h4 className="font-bold text-[#F0D78C] flex items-center gap-1.5 text-sm font-serif">
                <Navigation className="w-4 h-4 text-[#D4AF37]" />
                <span>যাতায়াত সুবিধা:</span>
              </h4>
              <p>• <strong className="text-[#F6EFE0]">উত্তরা / এয়ারপোর্ট থেকে:</strong> প্রগতি সরণি হয়ে গুলশান-১ গোলচত্বরে নেমে মাত্র ২ মিনিট হাঁটার দূরত্ব।</p>
              <p>• <strong className="text-[#F6EFE0]">মিরপুর / ধানমন্ডি থেকে:</strong> মহাখালী ফ্লাইওভার বা বাড্ডা লিংক রোড দিয়ে সহজেই পৌঁছানো সম্ভব।</p>
            </div>
          </div>

          {/* Map Column */}
          <div className="lg:col-span-7 bg-[#1C1730] border-2 border-[#D4AF37] rounded-3xl p-2 shadow-2xl overflow-hidden h-[450px]">
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

