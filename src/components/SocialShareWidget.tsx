import { useState } from 'react';
import { Share2, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { EVENT_DETAILS } from '../data/eventData';

interface SocialShareWidgetProps {
  className?: string;
}

export default function SocialShareWidget({ className = '' }: SocialShareWidgetProps) {
  const [copied, setCopied] = useState(false);
  const [instagramNotice, setInstagramNotice] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://gaanbristy.com';
  const shareTitle = 'Gaan Bristy Grand Get-Together 2026: Melody at Gulshan Club';
  const shareSummary = `🎉 স্টারমেকার মিউজিক ফ্যামিলি "গান বৃষ্টি"-র জাকজমকপূর্ণ মিলনমেলা!
📅 তারিখ: ২০ সেপ্টেম্বর ২০২৬, সন্ধ্যা ৭:০০ টা
📍 ভেন্যু: গুলশান ক্লাব, ঢাকা
রেজিস্ট্রেশন করুন ও টিকিট নিন:`;

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedSummary = encodeURIComponent(`${shareSummary}\n${currentUrl}`);

  // Social Share URLs
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodedSummary}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(shareSummary)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareSummary}\n${currentUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(`${shareSummary}\n${currentUrl}`);
    setInstagramNotice(true);
    setTimeout(() => {
      window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
      setInstagramNotice(false);
    }, 1500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareSummary,
          url: currentUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className={`bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden ${className}`}>
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        
        {/* Left Side Info */}
        <div className="text-center lg:text-left space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span>ইভেন্ট শেয়ার করুন • Spread the Melody</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center justify-center lg:justify-start gap-2">
            <span>বন্ধু ও মিউজিক প্রেমীদের সাথে শেয়ার করুন</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            ফেসবুক, হোয়াটসঅ্যাপ বা ইনস্টাগ্রামে গান বৃষ্টির ২০২৬ মিলনমেলার আমন্ত্রণ ছড়িয়ে দিন এবং সবাইকে সাথে নিয়ে আসুন।
          </p>
        </div>

        {/* Right Side Buttons */}
        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
          
          {/* Facebook Button */}
          <a
            href={facebookShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1877F2]/20 hover:bg-[#1877F2] border border-[#1877F2]/40 text-blue-200 hover:text-white font-bold rounded-2xl transition duration-200 text-xs sm:text-sm shadow-md group"
          >
            <svg className="w-4 h-4 fill-current text-[#1877F2] group-hover:text-white transition" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span>Facebook</span>
          </a>

          {/* WhatsApp Button */}
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366]/20 hover:bg-[#25D366] border border-[#25D366]/40 text-emerald-200 hover:text-white font-bold rounded-2xl transition duration-200 text-xs sm:text-sm shadow-md group"
          >
            <svg className="w-4 h-4 fill-current text-[#25D366] group-hover:text-white transition" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          {/* Instagram Button */}
          <button
            onClick={handleInstagramShare}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-rose-600/20 hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 border border-pink-500/40 text-pink-200 hover:text-white font-bold rounded-2xl transition duration-200 text-xs sm:text-sm shadow-md group"
          >
            <svg className="w-4 h-4 fill-current text-pink-400 group-hover:text-white transition" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>Instagram</span>
          </button>

          {/* Copy Link / Native Share */}
          <button
            onClick={handleCopyLink}
            type="button"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/40 text-slate-200 font-bold rounded-2xl transition duration-200 text-xs sm:text-sm shadow-md"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-400" />
                <span>লিংক কপি করুন</span>
              </>
            )}
          </button>

        </div>

      </div>

      {/* Instagram Copy Toast Notice */}
      {instagramNotice && (
        <div className="mt-4 p-3 bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-semibold rounded-2xl text-center flex items-center justify-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-pink-400" />
          <span>ক্যাপশন ও লিংক কপি হয়েছে! ইনস্টাগ্রামের মেসেজ বা স্টোরিতে পেস্ট করুন।</span>
        </div>
      )}
    </div>
  );
}
