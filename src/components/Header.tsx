import { useState, useRef, useEffect } from 'react';
import { LOGO_URL, EVENT_DETAILS } from '../data/eventData';
import { Volume2, VolumeX, Ticket as TicketIcon, Users, Calendar, MapPin, Image as ImageIcon, Palette, ShieldCheck, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenRegister: () => void;
  onOpenAdminVerify: () => void;
  onOpenCanvaGuide: () => void;
  activeSection: string;
}

export default function Header({
  onOpenRegister,
  onOpenAdminVerify,
  onOpenCanvaGuide,
  activeSection,
}: HeaderProps) {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Royalty free ambient guitar/acoustic track for event mood
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=soft-acoustic-guitar-113524.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch(err => {
        console.log("Audio play blocked by browser policies", err);
      });
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-amber-500/20 text-slate-100 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div id="header-brand" className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-red-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
            <img 
              src={LOGO_URL} 
              alt="Gaan Bristy Family Logo" 
              className="relative w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md"
              onError={(e) => {
                // Fallback icon placeholder if image fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-yellow-400 font-serif">
                গান বৃষ্টি
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                ২০২৬
              </span>
            </div>
            <p className="text-xs text-slate-300 hidden sm:block">
              {EVENT_DETAILS.tagline} • গুলশান ক্লাব
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button 
            onClick={() => scrollToSection('schedule')} 
            className={`flex items-center gap-1.5 hover:text-amber-300 transition ${activeSection === 'schedule' ? 'text-amber-400 font-semibold' : 'text-slate-300'}`}
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            শিডিউল
          </button>

          <button 
            onClick={() => scrollToSection('details')} 
            className={`flex items-center gap-1.5 hover:text-amber-300 transition ${activeSection === 'details' ? 'text-amber-400 font-semibold' : 'text-slate-300'}`}
          >
            <TicketIcon className="w-4 h-4 text-amber-400" />
            টিকিট ফি
          </button>

          <button 
            onClick={() => scrollToSection('team')} 
            className={`flex items-center gap-1.5 hover:text-amber-300 transition ${activeSection === 'team' ? 'text-amber-400 font-semibold' : 'text-slate-300'}`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            ফ্যামিলি টিম
          </button>

          <button 
            onClick={() => scrollToSection('gallery')} 
            className={`flex items-center gap-1.5 hover:text-amber-300 transition ${activeSection === 'gallery' ? 'text-amber-400 font-semibold' : 'text-slate-300'}`}
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            গ্যালারী
          </button>

          <button 
            onClick={() => scrollToSection('venue')} 
            className={`flex items-center gap-1.5 hover:text-amber-300 transition ${activeSection === 'venue' ? 'text-amber-400 font-semibold' : 'text-slate-300'}`}
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            ভেন্যু
          </button>

          <button 
            onClick={onOpenCanvaGuide} 
            className="flex items-center gap-1.5 text-xs bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-500/40 px-2.5 py-1.5 rounded-lg transition"
            title="ক্যানভা প্রো ডিজাইন গাইড ও টেক্সচার সাপোর্ট"
          >
            <Palette className="w-3.5 h-3.5 text-purple-300" />
            ক্যানভা গাইড
          </button>
        </nav>

        {/* Header Actions */}
        <div id="header-actions" className="flex items-center gap-2.5">
          {/* Music Toggle */}
          <button
            onClick={toggleMusic}
            id="music-toggle-btn"
            className={`p-2 rounded-full border transition-all ${
              isPlayingMusic 
                ? 'bg-amber-500/20 text-amber-300 border-amber-400 animate-pulse' 
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={isPlayingMusic ? "আবহ সুর বন্ধ করুন" : "আবহ সুর চালু করুন"}
          >
            {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Gate Verification Admin Button */}
          <button
            onClick={onOpenAdminVerify}
            id="admin-verify-btn"
            className="hidden sm:flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg transition"
            title="এন্ট্রি গেটে টিকিট সার্চ ও ভেরিফিকেশন"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            গেট ভেরিফাই
          </button>

          {/* Primary CTA: Ticket Booking */}
          <button
            onClick={onOpenRegister}
            id="header-register-btn"
            className="relative group overflow-hidden rounded-xl p-px font-semibold text-xs sm:text-sm"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 rounded-xl"></span>
            <span className="relative flex items-center gap-1.5 px-4 py-2 bg-slate-950 text-amber-300 rounded-[11px] group-hover:bg-opacity-80 transition duration-300">
              <TicketIcon className="w-4 h-4 text-amber-400" />
              <span>টিকিট বুকিং</span>
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            className="lg:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden bg-slate-900/95 border-b border-amber-500/20 px-4 pt-3 pb-6 space-y-3">
          <button 
            onClick={() => scrollToSection('schedule')} 
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            <Calendar className="w-5 h-5 text-amber-400" />
            ইভেন্ট শিডিউল
          </button>

          <button 
            onClick={() => scrollToSection('details')} 
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            <TicketIcon className="w-5 h-5 text-amber-400" />
            ইভেন্ট বিবরণ ও টিকিট মূল্য
          </button>

          <button 
            onClick={() => scrollToSection('team')} 
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            <Users className="w-5 h-5 text-amber-400" />
            ফ্যামিলি টিম (ক্যাপ্টেন ও এডমিন)
          </button>

          <button 
            onClick={() => scrollToSection('gallery')} 
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            <ImageIcon className="w-5 h-5 text-amber-400" />
            স্মরণীয় ছবির গ্যালারী
          </button>

          <button 
            onClick={() => scrollToSection('venue')} 
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            <MapPin className="w-5 h-5 text-amber-400" />
            ভেন্যু ও গুগল ম্যাপ
          </button>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenCanvaGuide(); }} 
              className="w-full flex items-center justify-center gap-2 bg-purple-900/50 text-purple-200 border border-purple-500/40 py-2.5 rounded-lg text-sm"
            >
              <Palette className="w-4 h-4 text-purple-300" />
              ক্যানভা প্রো ডিজাইন সাহায্য
            </button>

            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenAdminVerify(); }} 
              className="w-full flex items-center justify-center gap-2 bg-slate-800 text-slate-200 border border-slate-700 py-2.5 rounded-lg text-sm"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              এন্ট্রি গেট ভেরিফিকেশন (Admin)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
