import { useState } from 'react';
import { navigateToSection } from '../utils/scrollToSection';
import { LOGO_URL } from '../data/eventData';
import { Ticket as TicketIcon, Users, Calendar, MapPin, Image as ImageIcon, ShieldCheck, Menu, X, MessageSquare } from 'lucide-react';

interface HeaderProps {
  onOpenRegister: () => void;
  onOpenAdminVerify: () => void;
  onOpenCanvaGuide: () => void;
  activeSection: string;
}

export default function Header({
  onOpenRegister,
  onOpenAdminVerify,
  activeSection,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    navigateToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#0F0C1A]/95 backdrop-blur-md border-b border-[#D4AF37]/30 text-[#F6EFE0] shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Name */}
        <div id="header-brand" className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none shrink min-w-0" onClick={() => scrollToSection('hero')}>
          <img 
            src={LOGO_URL} 
            alt="Gaan Bristy Family Logo" 
            className="w-11 h-11 sm:w-14 sm:h-14 object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.35)] shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="font-extrabold text-xl sm:text-2xl md:text-3xl text-[#F6EFE0] font-bangla tracking-wide drop-shadow-md truncate">
              গান বৃষ্টি
            </span>
            <span className="bg-gradient-to-r from-[#D4AF37] to-[#F0D78C] text-[#0F0C1A] text-[10px] sm:text-xs font-black px-2 sm:px-2.5 py-0.5 rounded-full border border-white/30 shadow-md shrink-0">
              ২০২৬
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center justify-center flex-1 gap-3 md:gap-5 lg:gap-8 xl:gap-10 text-xs md:text-sm lg:text-base font-semibold whitespace-nowrap">
          <a 
            href="#schedule"
            onClick={(e) => { e.preventDefault(); scrollToSection('schedule'); }} 
            className={`shrink-0 cursor-pointer no-underline hover:text-[#F0D78C] transition ${activeSection === 'schedule' ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-0.5' : 'text-[#B3A6C9]'}`}
          >
            শিডিউল
          </a>

          <a 
            href="#details"
            onClick={(e) => { e.preventDefault(); scrollToSection('details'); }} 
            className={`shrink-0 cursor-pointer no-underline hover:text-[#F0D78C] transition ${activeSection === 'details' ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-0.5' : 'text-[#B3A6C9]'}`}
          >
            ইভেন্ট ফি
          </a>

          <a 
            href="#team"
            onClick={(e) => { e.preventDefault(); scrollToSection('team'); }} 
            className={`shrink-0 cursor-pointer no-underline hover:text-[#F0D78C] transition ${activeSection === 'team' ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-0.5' : 'text-[#B3A6C9]'}`}
          >
            ফ্যামিলি টিম
          </a>

          <a 
            href="#gallery"
            onClick={(e) => { e.preventDefault(); scrollToSection('gallery'); }} 
            className={`shrink-0 cursor-pointer no-underline hover:text-[#F0D78C] transition ${activeSection === 'gallery' ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-0.5' : 'text-[#B3A6C9]'}`}
          >
            গ্যালারী
          </a>

          <a 
            href="#guestbook"
            onClick={(e) => { e.preventDefault(); scrollToSection('guestbook'); }} 
            className={`shrink-0 cursor-pointer no-underline hover:text-[#F0D78C] transition ${activeSection === 'guestbook' ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-0.5' : 'text-[#B3A6C9]'}`}
          >
            গেস্টবুক
          </a>

          <a 
            href="#honorable-guests"
            onClick={(e) => { e.preventDefault(); scrollToSection('honorable-guests'); }} 
            className={`shrink-0 cursor-pointer no-underline hover:text-[#F0D78C] transition ${activeSection === 'honorable-guests' ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-0.5' : 'text-[#B3A6C9]'}`}
          >
            Honorable Guest
          </a>

          <a 
            href="#venue"
            onClick={(e) => { e.preventDefault(); scrollToSection('venue'); }} 
            className={`shrink-0 cursor-pointer no-underline hover:text-[#F0D78C] transition ${activeSection === 'venue' ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-0.5' : 'text-[#B3A6C9]'}`}
          >
            ভেন্যু
          </a>
        </nav>

        {/* Header Actions */}
        <div id="header-actions" className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Gate Verification Admin Button */}
          <button
            onClick={onOpenAdminVerify}
            id="admin-verify-btn"
            className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-[#1C1730] hover:bg-[#251F3D] text-[#F6EFE0] border border-[#D4AF37]/50 px-3.5 py-2 rounded-xl transition shadow-md cursor-pointer"
            title="Admin Panel — Gate Verify, Manual Card, Guest List"
          >
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Admin Panel</span>
          </button>

          {/* Primary CTA: Ticket Booking with Lighting Animation Effect */}
          <button
            onClick={onOpenRegister}
            id="header-register-btn"
            className="btn-lighting px-3 sm:px-5 py-2 sm:py-2.5 rounded-full font-black text-[10px] sm:text-sm bg-gradient-to-r from-[#F0D78C] via-[#D4AF37] to-[#F0D78C] shadow-[0_0_20px_rgba(212,175,55,0.5)] flex items-center gap-1.5 sm:gap-2 cursor-pointer border border-[#F0D78C]"
          >
            <TicketIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="tracking-wide font-black font-bangla hidden min-[400px]:inline">রেজিস্ট্রেশন</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            className="md:hidden p-2 text-[#B3A6C9] hover:text-[#F6EFE0]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-[#1C1730] border-b border-[#D4AF37]/30 px-4 pt-3 pb-6 space-y-3">
          <button 
            onClick={() => scrollToSection('schedule')} 
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-[#F6EFE0] hover:bg-[#0F0C1A] rounded-lg font-medium"
          >
            <Calendar className="w-5 h-5 text-[#D4AF37]" />
            ইভেন্ট শিডিউল
          </button>

          <button 
            onClick={() => scrollToSection('details')} 
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-[#F6EFE0] hover:bg-[#0F0C1A] rounded-lg font-medium"
          >
            <TicketIcon className="w-5 h-5 text-[#D4AF37]" />
            ইভেন্ট বিবরণ ও রেজিস্ট্রেশন ফি
          </button>

          <button 
            onClick={() => scrollToSection('team')} 
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-[#F6EFE0] hover:bg-[#0F0C1A] rounded-lg font-medium"
          >
            <Users className="w-5 h-5 text-[#D4AF37]" />
            ফ্যামিলি টিম (ক্যাপ্টেন ও এডমিন)
          </button>

          <button 
            onClick={() => scrollToSection('gallery')} 
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-[#F6EFE0] hover:bg-[#0F0C1A] rounded-lg font-medium"
          >
            <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
            স্মরণীয় ছবির গ্যালারী
          </button>

          <button 
            onClick={() => scrollToSection('guestbook')} 
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-[#F6EFE0] hover:bg-[#0F0C1A] rounded-lg font-medium"
          >
            <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
            ডিজিটাল গেস্টবুক ও বার্তা
          </button>

          <button 
            onClick={() => scrollToSection('honorable-guests')} 
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-[#F6EFE0] hover:bg-[#0F0C1A] rounded-lg font-medium"
          >
            <TicketIcon className="w-5 h-5 text-[#D4AF37]" />
            Honorable Guest 2026
          </button>

          <button 
            onClick={() => scrollToSection('venue')} 
            className="w-full flex items-center gap-3 px-3 py-2 text-left text-[#F6EFE0] hover:bg-[#0F0C1A] rounded-lg font-medium"
          >
            <MapPin className="w-5 h-5 text-[#D4AF37]" />
            ভেন্যু ও গুগল ম্যাপ
          </button>

          <div className="pt-2 border-t border-[#D4AF37]/20 flex flex-col gap-2">
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenAdminVerify(); }} 
              className="w-full flex items-center justify-center gap-2 bg-[#0F0C1A] text-[#F6EFE0] border border-[#D4AF37]/30 py-2.5 rounded-lg text-sm font-semibold"
            >
              <ShieldCheck className="w-4 h-4 text-[#F0D78C]" />
              এন্ট্রি গেট ভেরিফিকেশন (Admin)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
