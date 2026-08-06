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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0C1A]/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#1C1730] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F6EFE0] my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#0F0C1A] text-[#B3A6C9] hover:text-[#F6EFE0] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#7A1F3D]/60 text-[#F0D78C] rounded-2xl border border-[#D4AF37]/40">
            <Palette className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold font-serif text-[#F0D78C]">
                ক্যানভা প্রো (Canva Pro) ডিজাইন গাইডলাইন
              </h2>
              <span className="bg-[#7A1F3D] text-[#F0D78C] text-[10px] font-bold px-2 py-0.5 rounded border border-[#D4AF37]/40 font-mono">PRO</span>
            </div>
            <p className="text-xs text-[#B3A6C9] font-mono">
              Gaan Bristy Grand Get-Together 2026 ব্র্যান্ডিং ও ব্যানার মেকিং
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm font-body">
          
          {/* Explanation Box */}
          <div className="p-4 bg-[#7A1F3D]/30 border border-[#D4AF37]/40 rounded-2xl text-xs sm:text-sm text-[#F6EFE0] leading-relaxed">
            <p className="font-semibold text-[#F0D78C] mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>আপনার প্রশ্নের উত্তর ও প্রয়োজনীয় তথ্য:</span>
            </p>
            আপনার অনলাইন ওয়েবসাইটে <strong>স্বয়ংক্রিয়ভাবে লোগো সম্বলিত ডিজিটাল টিকেট ও QR কোড তৈরি হয়ে যাচ্ছে</strong> (কোনো আলাদা ডিজাইনিং অ্যাপ লাগবে না)। তবে আপনি যদি ক্যানভা প্রো (Canva Pro) ব্যবহার করে ফেসবুক কাভার, প্রিন্ট ব্যানার, ফ্লেক্স ব্যাকড্রপ বা ফেসবুক পোস্ট পোস্টার বানাতে চান, তাহলে নিচের প্রিসেট গাইডটি ক্যানভায় ব্যবহার করুন:
          </div>

          {/* Canva Preset Dimensions */}
          <div className="bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-[#F0D78C] font-serif text-sm flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
              <span>১. ক্যানভায় কাস্টম সাইজ (Dimensions):</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#1C1730] rounded-xl border border-[#D4AF37]/20">
                <span className="text-[#F0D78C] font-bold block">ফেসবুক ও ওয়েব ব্যানার (Hero Banner)</span>
                <span className="font-mono text-[#F6EFE0] text-sm">1920 x 1080 Pixels</span>
              </div>

              <div className="p-3 bg-[#1C1730] rounded-xl border border-[#D4AF37]/20">
                <span className="text-[#F0D78C] font-bold block">ফেসবুক পোস্ট / স্কয়ার ব্যানার</span>
                <span className="font-mono text-[#F6EFE0] text-sm">1080 x 1080 Pixels</span>
              </div>

              <div className="p-3 bg-[#1C1730] rounded-xl border border-[#D4AF37]/20">
                <span className="text-[#F0D78C] font-bold block">স্টোরি / রিলস পোস্টার (Vertical)</span>
                <span className="font-mono text-[#F6EFE0] text-sm">1080 x 1920 Pixels</span>
              </div>

              <div className="p-3 bg-[#1C1730] rounded-xl border border-[#D4AF37]/20">
                <span className="text-[#F0D78C] font-bold block">প্রিন্ট টিকিট ও ভিআইপি ব্যাজ (Landscape)</span>
                <span className="font-mono text-[#F6EFE0] text-sm">1200 x 600 Pixels</span>
              </div>
            </div>
          </div>

          {/* Official Color Codes */}
          <div className="bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-[#F0D78C] font-serif text-sm">
              ২. অফিশিয়াল কালার কোড (Color Hex Codes):
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              
              <div 
                onClick={() => copyToClipboard('#D4AF37', 'Gold')}
                className="p-2.5 bg-[#1C1730] rounded-xl border border-[#D4AF37]/30 cursor-pointer hover:border-[#D4AF37] transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37] border border-white/20"></div>
                  <div>
                    <p className="text-[10px] text-[#B3A6C9]">রয়্যাল গোল্ড</p>
                    <p className="font-mono font-bold text-[#F6EFE0]">#D4AF37</p>
                  </div>
                </div>
                {copiedColor === 'Gold' ? <Check className="w-3.5 h-3.5 text-[#F0D78C]" /> : <Copy className="w-3.5 h-3.5 text-[#B3A6C9]" />}
              </div>

              <div 
                onClick={() => copyToClipboard('#7A1F3D', 'Wine')}
                className="p-2.5 bg-[#1C1730] rounded-xl border border-[#D4AF37]/30 cursor-pointer hover:border-[#D4AF37] transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#7A1F3D] border border-white/20"></div>
                  <div>
                    <p className="text-[10px] text-[#B3A6C9]">ওয়াইন / বারগান্ডি</p>
                    <p className="font-mono font-bold text-[#F6EFE0]">#7A1F3D</p>
                  </div>
                </div>
                {copiedColor === 'Wine' ? <Check className="w-3.5 h-3.5 text-[#F0D78C]" /> : <Copy className="w-3.5 h-3.5 text-[#B3A6C9]" />}
              </div>

              <div 
                onClick={() => copyToClipboard('#0F0C1A', 'Midnight')}
                className="p-2.5 bg-[#1C1730] rounded-xl border border-[#D4AF37]/30 cursor-pointer hover:border-[#D4AF37] transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#0F0C1A] border border-white/20"></div>
                  <div>
                    <p className="text-[10px] text-[#B3A6C9]">মিডনাইট ব্যাকগ্রাউন্ড</p>
                    <p className="font-mono font-bold text-[#F6EFE0]">#0F0C1A</p>
                  </div>
                </div>
                {copiedColor === 'Midnight' ? <Check className="w-3.5 h-3.5 text-[#F0D78C]" /> : <Copy className="w-3.5 h-3.5 text-[#B3A6C9]" />}
              </div>

              <div 
                onClick={() => copyToClipboard('#F0D78C', 'LightGold')}
                className="p-2.5 bg-[#1C1730] rounded-xl border border-[#D4AF37]/30 cursor-pointer hover:border-[#D4AF37] transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#F0D78C] border border-white/20"></div>
                  <div>
                    <p className="text-[10px] text-[#B3A6C9]">লাইট গোল্ড</p>
                    <p className="font-mono font-bold text-[#F6EFE0]">#F0D78C</p>
                  </div>
                </div>
                {copiedColor === 'LightGold' ? <Check className="w-3.5 h-3.5 text-[#F0D78C]" /> : <Copy className="w-3.5 h-3.5 text-[#B3A6C9]" />}
              </div>

            </div>
          </div>

          {/* Recommended Fonts & Assets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-2xl p-4">
              <h3 className="font-bold text-[#F0D78C] font-serif text-xs mb-2">
                ৩. ক্যানভার ফন্ট সুপারিশ (Canva Fonts):
              </h3>
              <ul className="text-xs space-y-1 text-[#B3A6C9]">
                <li>• <strong className="text-[#F6EFE0]">বাংলা ফন্ট:</strong> Anek Bangla, Hind Siliguri, Noto Serif Bengali</li>
                <li>• <strong className="text-[#F6EFE0]">ইংরেজি শিরোনাম:</strong> Playfair Display, Cormorant Garamond</li>
              </ul>
            </div>

            <div className="bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-2xl p-4">
              <h3 className="font-bold text-[#F0D78C] font-serif text-xs mb-2">
                ৪. অফিশিয়াল লোগো ডাউনলোড ইউআরএল:
              </h3>
              <p className="text-[11px] text-[#B3A6C9] mb-2">ক্যানভার 'Uploads' সেকশনে আপলোড করতে এই লিংকটি ব্যবহার করুন:</p>
              <a
                href={LOGO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#F0D78C] hover:text-white bg-[#7A1F3D]/60 px-3 py-1.5 rounded-lg border border-[#D4AF37]/40"
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
              className="px-6 py-2.5 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-full text-sm transition cursor-pointer"
            >
              বুঝতে পেরেছি, ধন্যবাদ!
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

