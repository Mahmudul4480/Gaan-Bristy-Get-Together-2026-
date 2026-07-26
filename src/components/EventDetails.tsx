import { EVENT_DETAILS } from '../data/eventData';
import { Ticket, Users, Sparkles, AlertCircle, Utensils, Music, Award, ShieldCheck, CheckCircle2, Calendar } from 'lucide-react';
import AddToCalendar from './AddToCalendar';

interface EventDetailsProps {
  onOpenRegister: () => void;
}

export default function EventDetails({ onOpenRegister }: EventDetailsProps) {
  return (
    <section id="details" className="py-16 bg-slate-900 text-slate-100 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>ইভেন্টের বিবরণ ও মূল্য তালিকা</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
            স্টারমেকার মিউজিক ফ্যামিলির মহোৎসব
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-red-500 mx-auto my-4 rounded-full"></div>
        </div>

        {/* Attractive Description Paragraph requested by user */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 md:p-10 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-4">
              <p className="text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed font-sans">
                সঙ্গীতের সুর যেখানে আত্মাকে ছুঁয়ে যায়, সেখানেই গড়ে ওঠে আত্মিক বন্ধন। স্টারমেকারের সুপরিচিত ও জনপ্রিয় মিউজিক পরিবার <span className="text-amber-300 font-bold font-serif">"গান বৃষ্টি"</span> আয়োজন করতে যাচ্ছে বছরের সবচেয়ে জাকজমকপূর্ণ ও মার্জিত মিলনমেলা—<span className="text-amber-300 font-bold">"Gaan Bristy Grand Get-Together 2026: Melody at Gulshan Club"</span>। 
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                দিনের পর দিন ভার্চুয়াল জগতে যাদের মিষ্টি সুর ও গানে আমাদের মন জুড়িয়েছে, এবার গুলশান ক্লাবের অভিজাত আবহে তাদের সাথে সামনাসামনি আড্ডা, সুরের ঝংকার, রাজকীয় বুফে নৈশভোজ এবং গুণীজন সম্মাননার এক অবিস্মরণীয় সন্ধ্যা কাটাতে আসুন এক ছাদের নিচে। এটি শুধুই একটি গেট-টুগেদার নয়, এটি আমাদের পরিবারটির ঐক্য, প্রীতি ও ভালোবাসার এক অমর উদ্যাপন।
              </p>
            </div>

            {/* Calendar Reminder Callout Banner */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-amber-500/20">
              <div className="flex items-center gap-3.5 text-left w-full md:w-auto">
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-amber-400 shrink-0 shadow-inner">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-white font-serif flex items-center gap-2">
                    <span>অনুষ্ঠানের তারিখ ও সময় ক্যালেন্ডারে সেভ রাখুন</span>
                    <span className="hidden sm:inline bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded font-mono font-normal">Reminder</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
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

        {/* Pricing Cards & Urgency Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Adult Ticket Card */}
          <div className="bg-slate-950 border-2 border-amber-500/50 hover:border-amber-400 rounded-3xl p-6 sm:p-8 shadow-xl relative flex flex-col justify-between group transition">
            <div className="absolute top-4 right-4 bg-amber-500/10 text-amber-300 border border-amber-400/30 text-xs font-bold px-3 py-1 rounded-full">
              জনপ্রিয়
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/20">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">প্রতি জন (Adult)</h3>
                  <p className="text-xs text-slate-400">প্রাপ্তবয়স্ক অতিথিদের জন্য পূর্ণ এন্ট্রি পাস</p>
                </div>
              </div>

              <div className="my-6 p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-amber-400 font-serif">
                  ২০০০/-
                </span>
                <span className="text-sm text-slate-300 ml-1.5 font-medium">টাকা মাত্র</span>
              </div>

              <ul className="space-y-3 text-sm text-slate-300 mb-6">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>গুলশান ক্লাবে লাল গালিচায় ভিআইপি অভ্যর্থনা</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>ঐতিহ্যবাহী রয়্যাল বুফে নৈশভোজ (Royal Buffet Dinner)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>স্টারমেকার লাইভ আনপ্লাগড গান শো উপভোগ</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>বিশেষ মেমেন্টো, ফটো সেশন ও ফ্যামিলি উপহার</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenRegister}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold rounded-xl transition shadow-lg text-sm"
            >
              Adult টিকিট বুকিং করুন
            </button>
          </div>

          {/* Kids Ticket Card */}
          <div className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between transition">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">শিশু (Kids)</h3>
                  <p className="text-xs text-slate-400">ছোট সোনামণিদের জন্য বিশেষ পাস</p>
                </div>
              </div>

              <div className="my-6 p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
                <span className="text-3xl sm:text-4xl font-extrabold text-blue-400 font-serif">
                  ১০০০/-
                </span>
                <span className="text-sm text-slate-300 ml-1.5 font-medium">টাকা মাত্র</span>
              </div>

              <ul className="space-y-3 text-sm text-slate-300 mb-6">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>বিশেষ চিলড্রেন বুফে মিল ও ডেজার্ট</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>কিডস ফটো সেশন ও সারপ্রাইজ গিফট</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>নিরাপদ ও আরামদায়ক আসন ব্যবস্থা</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenRegister}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl transition border border-slate-700 text-sm"
            >
              Kids টিকিট যোগ করুন
            </button>
          </div>

          {/* Limited Seats Urgency & Privileges */}
          <div className="bg-gradient-to-b from-red-950/40 via-slate-950 to-slate-950 border-2 border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full mb-4 shadow-md animate-pulse">
                <AlertCircle className="w-4 h-4" />
                <span>জরুরি নোটিশ</span>
              </div>

              <h3 className="text-2xl font-bold text-amber-300 font-serif mb-3">
                সীমিত আসন সংখ্যা
              </h3>

              <div className="p-4 bg-red-950/50 border border-red-500/30 rounded-2xl mb-5 text-red-200 text-sm font-semibold">
                "মাত্র ১৫০ জন অতিথির জন্য আসন সংরক্ষিত"
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                গুলশান ক্লাবের হল ধারণক্ষমতা ও শৃঙ্খলা নিশ্চিতকরণে নির্ধারিত আসন সংখ্যার অতিরিক্ত কোনো টিকিট ইস্যু করা সম্ভব হবে না। ১৫ সেপ্টেম্বর ২০২৬ তারিখের পূর্বে রেজিস্ট্রেশন সম্পন্ন করার অনুরোধ রইলো।
              </p>

              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <Utensils className="w-4 h-4 text-amber-400" />
                  <span>রয়্যাল বুফে ডিনার প্যাকেজ অন্তর্ভুক্ত</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <Music className="w-4 h-4 text-amber-400" />
                  <span>লাইভ আনপ্লাগড পারফরম্যান্স</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>গুণীজন সম্মাননা ও বিশেষ শুভেচ্ছা</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={onOpenRegister}
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition shadow-lg text-sm flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>অবশিষ্ট সিট দ্রুত নিশ্চিত করুন</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
