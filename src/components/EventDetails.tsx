import { EVENT_DETAILS } from '../data/eventData';
import { Ticket, Users, Sparkles, AlertCircle, Utensils, Music, Award, CheckCircle2, Calendar, Shirt } from 'lucide-react';
import AddToCalendar from './AddToCalendar';
import SocialShareWidget from './SocialShareWidget';

interface EventDetailsProps {
  onOpenRegister: () => void;
}

export default function EventDetails({ onOpenRegister }: EventDetailsProps) {
  return (
    <section id="details" className="py-16 bg-[#0F0C1A] text-[#F6EFE0] relative overflow-hidden border-b border-[#D4AF37]/20">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1F3D] border border-[#D4AF37]/50 text-[#F0D78C] text-xs font-bold mb-3 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>ইভেন্টের বিবরণ ও রেজিস্ট্রেশন ফি</span>
          </div>
          <h2 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-extrabold font-serif text-[#F6EFE0] tracking-tight leading-snug px-1 drop-shadow-md">
            Gaan Bristy Grand Get-Together 2026: Melody at Gulshan Club
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-[#F0D78C] mx-auto my-4 rounded-full"></div>
        </div>

        {/* Description Card */}
        <div className="relative bg-[#1C1730] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 md:p-10 mb-12 shadow-[0_0_40px_rgba(212,175,55,0.12)] overflow-hidden">
          
          <div className="gold-corner-diamond gold-corner-tl">✦</div>
          <div className="gold-corner-diamond gold-corner-tr">✦</div>
          <div className="gold-corner-diamond gold-corner-bl">✦</div>
          <div className="gold-corner-diamond gold-corner-br">✦</div>

          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <p className="text-base sm:text-lg md:text-xl text-[#F6EFE0] leading-relaxed font-body">
                সঙ্গীতের সুর যেখানে আত্মাকে ছুঁয়ে যায়, সেখানেই গড়ে ওঠে আত্মিক বন্ধন। স্টারমেকারের সুপরিচিত ও জনপ্রিয় মিউজিক পরিবার <span className="text-[#F0D78C] font-black font-serif">"গান বৃষ্টি"</span> আয়োজন করতে যাচ্ছে বছরের সবচেয়ে জাকজমকপূর্ণ ও মার্জিত মিলনমেলা—<span className="text-[#D4AF37] font-extrabold font-serif">"Gaan Bristy Grand Get-Together 2026: Melody at Gulshan Club"</span>। 
              </p>
              <p className="text-sm sm:text-base text-[#B3A6C9] leading-relaxed font-body">
                দিনের পর দিন ভার্চুয়াল জগতে যাদের মিষ্টি সুর ও গানে আমাদের মন জুড়িয়েছে, এবার গুলশান ক্লাবের অভিজাত আবহে তাদের সাথে সামনাসামনি আড্ডা, সুরের ঝংকার, রাজকীয় বুফে নৈশভোজ এবং গুণীজন সম্মাননার এক অবিস্মরণীয় সন্ধ্যা কাটাতে আসুন এক ছাদের নিচে। এটি শুধুই একটি গেট-টুগেদার নয়, এটি আমাদের পরিবারটির ঐক্য, প্রীতি ও ভালোবাসার এক অমর উদ্যাপন।
              </p>
            </div>

            {/* Calendar Reminder Callout Banner */}
            <div className="pt-6 border-t border-[#D4AF37]/20 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0F0C1A]/90 p-4 sm:p-5 rounded-2xl border border-[#D4AF37]/30">
              <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
                <div className="p-3 bg-[#D4AF37]/15 rounded-2xl border border-[#D4AF37]/40 text-[#D4AF37] shrink-0 shadow-inner">
                  <Calendar className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-[#F6EFE0] font-serif flex items-center gap-2">
                    <span>অনুষ্ঠানের তারিখ ও সময় ক্যালেন্ডারে সেভ রাখুন</span>
                    <span className="hidden sm:inline bg-[#7A1F3D] text-[#F0D78C] text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-[#D4AF37]/40">Reminder</span>
                  </h4>
                  <p className="text-xs text-[#B3A6C9] mt-0.5">
                    {EVENT_DETAILS.dateBengali}, {EVENT_DETAILS.timeBengali} | {EVENT_DETAILS.venueNameBengali}
                  </p>
                </div>
              </div>

              <div className="w-full md:w-auto shrink-0 flex justify-center md:justify-end">
                <AddToCalendar variant="primary" />
              </div>
            </div>

          </div>
        </div>

        {/* Social Media Sharing Widget */}
        <SocialShareWidget className="mb-12" />

        {/* Pricing & Seat Urgency Grid - UNIFIED BOTH CARDS WITH CARD BG (#1C1730) & GOLD BORDER (#D4AF37) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* All-Inclusive Ticket Card */}
          <div className="bg-[#1C1730] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col justify-between group transition">
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#D4AF37] to-[#F0D78C] text-[#0F0C1A] text-xs font-black px-3.5 py-1 rounded-full font-serif shadow-md">
              ALL-INCLUSIVE PASS
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3.5 bg-[#D4AF37]/15 text-[#D4AF37] rounded-2xl border border-[#D4AF37]/40">
                  <Users className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#F6EFE0] font-serif">প্রতি জন অতিথি (Per Person)</h3>
                  <p className="text-xs text-[#B3A6C9]">গুলশান ক্লাব গ্র্যান্ড মিলনমেলার অল-ইনক্লুসিভ প্রবেশপত্র</p>
                </div>
              </div>

              <div className="my-6 p-5 bg-[#0F0C1A] rounded-2xl border border-[#D4AF37]/40 text-center shadow-inner">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#F0D78C] font-serif">
                  BDT 2,000/-
                </span>
                <p className="text-xs text-[#B3A6C9] mt-1 font-accent italic">Two Thousand Taka Only</p>
              </div>

              <ul className="space-y-3.5 text-sm text-[#F6EFE0] mb-6 font-body">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>গুলশান ক্লাবে রেড কার্পেট ভিআইপি অভ্যর্থনা (Red Carpet Welcome)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>ঐতিহ্যবাহী রাজকীয় বুফে নৈশভোজ (Royal Buffet Dinner)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>স্টারমেকার লাইভ আনপ্লাগড মিউজিক শো (Live Unplugged Music)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>বিশেষ ক্রেস্ট, ফটো সেশন ও ফ্যামিলি মেমেন্টো (Awards & Recognition)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Shirt className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span>
                    Dress Code — Male: Formal (Shirt, Pant, Shoe) · Female: Casual
                  </span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenRegister}
              className="w-full py-4 bg-gradient-to-r from-[#F0D78C] to-[#D4AF37] text-[#0F0C1A] font-extrabold rounded-full transition shadow-[0_8px_24px_rgba(212,175,55,0.3)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.5)] text-base cursor-pointer"
            >
              <span>রেজিস্ট্রেশন করুন</span>
            </button>
          </div>

          {/* Limited Seats Urgency & Rules - UNIFIED BOTH CARDS WITH CARD BG (#1C1730) & GOLD BORDER (#D4AF37) */}
          <div className="bg-[#1C1730] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#7A1F3D] border border-[#D4AF37]/50 text-[#F0D78C] font-extrabold text-xs px-3.5 py-1.5 rounded-full mb-4 shadow-md">
                <AlertCircle className="w-4 h-4 text-[#F0D78C]" />
                <span>জরুরি নোটিশ (Urgent Notice)</span>
              </div>

              {/* Limited seats highlight */}
              <div className="my-4 p-5 bg-gradient-to-br from-[#7A1F3D] via-[#4a1528] to-[#0F0C1A] border-2 border-[#F0D78C]/70 rounded-2xl text-center shadow-[0_8px_36px_rgba(212,175,55,0.35)]">
                <p className="text-xs uppercase text-[#F0D78C] font-extrabold tracking-widest mb-2">
                  সর্বোচ্চ ধারণক্ষমতা
                </p>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-serif tracking-tight flex items-center justify-center gap-2 flex-wrap">
                  <span className="text-[#FFF6D6] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">সীমিত</span>
                  <span className="urgent-seat-number-pop">১৫০</span>
                  <span className="text-[#FFF6D6] drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">আসন</span>
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#B3A6C9] leading-relaxed mb-6 font-body">
                গুলশান ক্লাবের হল ধারণক্ষমতা ও ডিসিপ্লিন নিশ্চিতকরণে নির্ধারিত আসন সংখ্যার অতিরিক্ত কোনো রেজিস্ট্রেশন গ্রহণ করা হবে না। ১৫ সেপ্টেম্বর ২০২৬ তারিখের পূর্বে রেজিস্ট্রেশন সম্পন্ন করার অনুরোধ রইলো।
              </p>

              <div className="space-y-3 pt-4 border-t border-[#D4AF37]/20 text-xs text-[#F6EFE0]">
                <div className="flex items-center gap-2 font-semibold">
                  <Utensils className="w-4 h-4 text-[#D4AF37]" />
                  <span>রয়্যাল বুফে ডিনার প্যাকেজ অন্তর্ভুক্ত</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Music className="w-4 h-4 text-[#D4AF37]" />
                  <span>লাইভ আনপ্লাগড পারফরম্যান্স</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span>গুণীজন সম্মাননা ও বিশেষ শুভেচ্ছা মেমেন্টো</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D4AF37]/20">
              <button
                onClick={onOpenRegister}
                className="w-full py-4 bg-gradient-to-r from-[#F0D78C] to-[#D4AF37] text-[#0F0C1A] font-extrabold rounded-full transition shadow-[0_8px_24px_rgba(212,175,55,0.3)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.5)] text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket className="w-4 h-4 text-[#0F0C1A]" />
                <span>অবশিষ্ট আসনে রেজিস্ট্রেশন করুন</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
