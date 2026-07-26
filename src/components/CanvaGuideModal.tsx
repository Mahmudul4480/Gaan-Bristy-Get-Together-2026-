import { LOGO_URL } from '../data/eventData';
import { X, Palette, Copy, Check, Download, ExternalLink, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface CanvaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CanvaGuideModal({ isOpen, onClose }: CanvaGuideModalProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(label);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-500/20 text-purple-300 rounded-2xl border border-purple-500/40">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-serif text-white">
                ক্যানভা প্রো (Canva Pro) ডিজাইন গাইডলাইন
              </h2>
              <span className="bg-purple-500/30 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-400/30">PRO</span>
            </div>
            <p className="text-xs text-slate-400">
              Gaan Bristy Grand Get-Together 2026 ব্র্যান্ডিং ও ব্যানার মেকিং
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm">
          
          {/* Explanation Box */}
          <div className="p-4 bg-purple-950/30 border border-purple-500/30 rounded-2xl text-xs sm:text-sm text-purple-200 leading-relaxed">
            <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>আপনার প্রশ্নের উত্তর ও প্রয়োজনীয় তথ্য:</span>
            </p>
            আপনার অনলাইন ওয়েবসাইটে <strong>স্বয়ংক্রিয়ভাবে লোগো সম্বলিত ডিজিটাল টিকেট ও QR কোড তৈরি হয়ে যাচ্ছে</strong> (কোনো আলাদা ডিজাইনিং অ্যাপ লাগবে না)। তবে আপনি যদি ক্যানভা প্রো (Canva Pro) ব্যবহার করে ফেসবুক কাভার, প্রিন্ট ব্যানার, ফ্লেক্স ব্যাকড্রপ বা ফেসবুক পোস্ট পোস্টার বানাতে চান, তাহলে নিচের প্রিসেট গাইডটি ক্যানভায় ব্যবহার করুন:
          </div>

          {/* Canva Preset Dimensions */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-amber-300 font-serif text-sm flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" />
              <span>১. ক্যানভায় কাস্টম সাইজ (Dimensions):</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block">ফেসবুক ও ওয়েব ব্যানার (Hero Banner)</span>
                <span className="font-mono text-white text-sm">1920 x 1080 Pixels</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block">ফেসবুক পোস্ট / স্কয়ার ব্যানার</span>
                <span className="font-mono text-white text-sm">1080 x 1080 Pixels</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block">স্টোরি / রিলস পোস্টার (Vertical)</span>
                <span className="font-mono text-white text-sm">1080 x 1920 Pixels</span>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block">প্রিন্ট টিকিট ও ভিআইপি ব্যাজ (LandScape)</span>
                <span className="font-mono text-white text-sm">1200 x 600 Pixels</span>
              </div>
            </div>
          </div>

          {/* Official Color Codes */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-amber-300 font-serif text-sm">
              ২. অফিশিয়াল কালার কোড (Color Hex Codes):
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              
              <div 
                onClick={() => copyToClipboard('#D4AF37', 'Gold')}
                className="p-2.5 bg-slate-900 rounded-xl border border-amber-500/30 cursor-pointer hover:bg-slate-800 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37] border border-white/20"></div>
                  <div>
                    <p className="text-[10px] text-slate-400">রয়্যাল গোল্ড</p>
                    <p className="font-mono font-bold text-white">#D4AF37</p>
                  </div>
                </div>
                {copiedColor === 'Gold' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </div>

              <div 
                onClick={() => copyToClipboard('#DC2626', 'Crimson')}
                className="p-2.5 bg-slate-900 rounded-xl border border-red-500/30 cursor-pointer hover:bg-slate-800 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#DC2626] border border-white/20"></div>
                  <div>
                    <p className="text-[10px] text-slate-400">ক্রিমসন রেড</p>
                    <p className="font-mono font-bold text-white">#DC2626</p>
                  </div>
                </div>
                {copiedColor === 'Crimson' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </div>

              <div 
                onClick={() => copyToClipboard('#0F172A', 'Navy')}
                className="p-2.5 bg-slate-900 rounded-xl border border-slate-700 cursor-pointer hover:bg-slate-800 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#0F172A] border border-white/20"></div>
                  <div>
                    <p className="text-[10px] text-slate-400">ডিপ ব্যাকগ্রাউন্ড</p>
                    <p className="font-mono font-bold text-white">#0F172A</p>
                  </div>
                </div>
                {copiedColor === 'Navy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </div>

              <div 
                onClick={() => copyToClipboard('#F59E0B', 'Amber')}
                className="p-2.5 bg-slate-900 rounded-xl border border-yellow-500/30 cursor-pointer hover:bg-slate-800 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#F59E0B] border border-white/20"></div>
                  <div>
                    <p className="text-[10px] text-slate-400">ওয়ার্ম টেক্সট</p>
                    <p className="font-mono font-bold text-white">#F59E0B</p>
                  </div>
                </div>
                {copiedColor === 'Amber' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </div>

            </div>
          </div>

          {/* Recommended Fonts & Assets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <h3 className="font-bold text-amber-300 font-serif text-xs mb-2">
                ৩. ক্যানভার ফন্ট সুপারিশ (Canva Fonts):
              </h3>
              <ul className="text-xs space-y-1 text-slate-300">
                <li>• <strong>বাংলা ফন্ট:</strong> Hind Siliguri, Noto Serif Bengali, Kalpurush</li>
                <li>• <strong>ইংরেজি শিরোনাম:</strong> Playfair Display, Cinzel, Montserrat</li>
              </ul>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <h3 className="font-bold text-amber-300 font-serif text-xs mb-2">
                ৪. অফিশিয়াল লোগো ডাউনলোড ইউআরএল:
              </h3>
              <p className="text-[11px] text-slate-400 mb-2">ক্যানভার 'Uploads' সেকশনে আপলোড করতে এই লিংকটি ব্যবহার করুন:</p>
              <a
                href={LOGO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200 bg-purple-900/40 px-3 py-1.5 rounded-lg border border-purple-500/40"
              >
                <Download className="w-3.5 h-3.5" />
                <span>লোগো হাই-রেস ছবি ডাউনলোড/ওপেন করুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

          {/* Action Close */}
          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-purple-800 hover:bg-purple-700 text-white font-bold rounded-xl text-sm transition"
            >
              বুঝতে পেরেছি, ধন্যবাদ!
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
