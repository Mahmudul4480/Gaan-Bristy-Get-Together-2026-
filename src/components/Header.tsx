import { useState } from 'react';
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
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#0F0C1A]/95 backdrop-blur-md border-b border-[#D4AF37]/30 text-[#F6EFE0] shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div id="header-brand" className="flex items-center gap-3 cursor-pointer select-none shrink-0" onClick={() => scrollToSection('hero')}>
          <div className="relative group slow-animated-logo">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] to-[#7A1F3D] rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300 slow-animated-glow"></div>
            <img 
              src={LOGO_URL} 
              alt="Gaan Bristy Family Logo" 
              className="relative w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37] shadow-lg"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-2xl sm:text-3xl text-[#F0D78C] font-bangla tracking-wide drop-shadow-md whitespace-nowrap">
              গান বৃষ্টি
            </span>
            <span className="bg-[#7A1F3D]/80 text-[#F0D78C] text-xs font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/50 shadow-sm whitespace-nowrap">
              ২০২৬
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center justify-center flex-1 gap-3 md:gap-5 lg:gap-8 xl:gap-10 text-xs md:text-sm lg:text-base font-semibold whitespace-nowrap">
          <button 
            onClick={() => scrollToSection('schedule')} 
            className={`shrink-0 hover:text-[#F0D78C] transition ${activeSection === 'schedule' ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-0.5' : 'text-[#B3A6C9]'}`}
          >
            <span>শিডিউল</span>
          </button>

          <button 
            onClick={() => scrollToSection('details')} 
            className={`shrink-0 hover:text-[#F0D78C] transition ${activeSection === 'details' ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-0.5' : 'text-[#B3A6C9]'}`}
          >
            <span>ইভেন্ট ফি</span>
          </button>

          <button 
            onClick={() => scrollToSection('team')} 
            className={`shrink-0 hover:text-[#F0D78C] transition ${activeSection === 'team' ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-0.5' : 'text-[#B3A6C9]'}`}
          >
            <span>ফ্যামিলি টিম</span>
          </button>

          <button 
            onClick={() => scrollToSection('gallery')} 
            className={`shrink-0 hover:text-[#F0D78C] transition ${activeSection === 'gallery' ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-0.5' : 'text-[#B3A6C9]'}`}
          >
            <span>গ্যালারী</span>
          </button>

          <button 
            onClick={() => scrollToSection('guestbook')} 
            className={`shrink-0 hover:text-[#F0D78C] transition ${activeSection === 'guestbook' ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-0.5' : 'text-[#B3A6C9]'}`}
          >
            <span>গেস্টবুক</span>
          </button>

          <button 
            onClick={() => scrollToSection('venue')} 
            className={`shrink-0 hover:text-[#F0D78C] transition ${activeSection === 'venue' ? 'text-[#D4AF37] font-bold border-b-2 border-[#D4AF37] pb-0.5' : 'text-[#B3A6C9]'}`}
          >
            <span>ভেন্যু</span>
          </button>
        </nav>

        {/* Header Actions */}
        <div id="header-actions" className="flex items-center gap-3 shrink-0">
          {/* Gate Verification Admin Button */}
          <button
            onClick={onOpenAdminVerify}
            id="admin-verify-btn"
            className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-[#1C1730] hover:bg-[#251f3e] text-[#F6EFE0] border border-[#D4AF37]/40 px-3.5 py-2 rounded-xl transition shadow-md"
            title="এন্ট্রি গেটে টিকিট সার্চ ও ভেরিফিকেশন"
          >
            <ShieldCheck className="w-4 h-4 text-[#F0D78C]" />
            <span>গেট ভেরিফাই</span>
          </button>

          {/* Primary CTA: Ticket Booking */}
          <button
            onClick={onOpenRegister}
            id="header-register-btn"
            className="relative group overflow-hidden rounded-full p-px font-semibold text-xs sm:text-sm shadow-lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] via-[#F0D78C] to-[#D4AF37] rounded-full"></span>
            <span className="relative flex items-center gap-1.5 px-4 sm:px-5 py-2 bg-[#0F0C1A] text-[#F0D78C] rounded-full group-hover:bg-opacity-80 transition duration-300 font-extrabold">
              <TicketIcon className="w-4 h-4 text-[#D4AF37]" />
              <span>টিকিট বুকিং</span>
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            className="lg:hidden p-2 text-[#B3A6C9] hover:text-[#F6EFE0]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden bg-[#1C1730] border-b border-[#D4AF37]/30 px-4 pt-3 pb-6 space-y-3">
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
            ইভেন্ট বিবরণ ও টিকিট মূল্য
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
