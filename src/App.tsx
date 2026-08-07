import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import EventDetails from './components/EventDetails';
import Schedule from './components/Schedule';
import TeamShowcase from './components/TeamShowcase';
import GallerySection from './components/GallerySection';
import DigitalGuestbook from './components/DigitalGuestbook';
import VenueSection from './components/VenueSection';
import RegistrationModal from './components/RegistrationModal';
import CanvaGuideModal from './components/CanvaGuideModal';
import AdminTicketVerifyModal from './components/AdminTicketVerifyModal';
import AgencyFooter from './components/AgencyFooter';
import FallingMusicNotes from './components/FallingMusicNotes';
import { Ticket } from './types';
import { MessageSquare, Ticket as TicketIcon, Sparkles } from 'lucide-react';

export default function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCanvaGuideOpen, setIsCanvaGuideOpen] = useState(false);
  const [isAdminVerifyOpen, setIsAdminVerifyOpen] = useState(false);
  const [registeredTickets, setRegisteredTickets] = useState<Ticket[]>([]);
  const [activeSection] = useState('hero');

  const handleTicketCreated = (newTicket: Ticket) => {
    setRegisteredTickets(prev => [newTicket, ...prev]);
  };

  const handleExploreSchedule = () => {
    const el = document.getElementById('schedule');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenGuestbook = () => {
    const el = document.getElementById('guestbook');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="app-root" className="relative min-h-screen bg-[#0F0C1A] text-[#F6EFE0] font-sans antialiased selection:bg-[#D4AF37] selection:text-[#0F0C1A] midnight-bg-glow overflow-x-hidden">
      
      {/* Top Interactive Guestbook Bar Callout (গেস্ট বুক বার) */}
      <div className="bg-[#7A1F3D] text-[#F6EFE0] py-2 px-4 border-b border-[#D4AF37]/30 text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 shadow-lg z-50 relative">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="bg-[#D4AF37] text-[#0F0C1A] text-[10px] font-black uppercase px-2 py-0.5 rounded-md animate-pulse shrink-0 shadow-sm">
              LIVE
            </span>
            <p className="truncate text-[#F6EFE0] font-medium">
              <span className="text-lighting mr-1">গেস্ট বুক বার:</span> ২০২৬ এর মিলনমেলা উপলক্ষে আপনার মূল্যবান শুভেচ্ছা বার্তা লিখে জানান!
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleOpenGuestbook}
              className="bg-[#1C1730] hover:bg-[#D4AF37] hover:text-[#0F0C1A] text-[#F6EFE0] border border-[#D4AF37]/50 px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md group"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37] group-hover:text-[#0F0C1A]" />
              <span>গেস্টবুকে কল করুন</span>
            </button>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="btn-lighting px-3.5 py-1.5 rounded-full text-xs font-black text-[#0F0C1A] bg-gradient-to-r from-[#F0D78C] via-[#D4AF37] to-[#F0D78C] cursor-pointer hidden md:flex items-center gap-1.5 shadow-[0_0_12px_rgba(212,175,55,0.4)] border border-[#F0D78C]"
            >
              <TicketIcon className="w-3.5 h-3.5 text-[#0F0C1A]" />
              <span className="text-[#0F0C1A] font-black">টিকিট বুকিং</span>
            </button>
          </div>
        </div>
      </div>

      {/* Falling Music Notes Canvas Animation in Logo Theme Colors */}
      <FallingMusicNotes />

      {/* Sticky Header */}
      <Header 
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenAdminVerify={() => setIsAdminVerifyOpen(true)}
        onOpenCanvaGuide={() => setIsCanvaGuideOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main id="main-content">
        
        {/* 1. Hero Section with Live Countdown and Seat Meter */}
        <Hero 
          onOpenRegister={() => setIsRegisterOpen(true)}
          onExploreSchedule={handleExploreSchedule}
        />

        {/* 2. Event Details & Pricing (Adult 2000/-, Kids 1000/-, Urgency 150 Seats) */}
        <EventDetails 
          onOpenRegister={() => setIsRegisterOpen(true)}
        />

        {/* 3. Classy Event Schedule (07:00 PM to 11:00 PM) */}
        <Schedule />

        {/* 4. Family Committee & Leadership Showcase (1 Captain, 6 Co-Captains, 11 Admins, 12 Super Active Members) */}
        <TeamShowcase />

        {/* 5. Memory Gallery of Previous Gatherings */}
        <GallerySection />

        {/* 6. Digital Guestbook & Attendees Messages */}
        <DigitalGuestbook />

        {/* 7. Venue Details & Google Map Embed (Gulshan Club) */}
        <VenueSection />

      </main>

      {/* Footer highlighting SocialMediaCareing.com */}
      <AgencyFooter />

      {/* Interactive Modals */}
      <RegistrationModal 
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onTicketCreated={handleTicketCreated}
      />

      <CanvaGuideModal 
        isOpen={isCanvaGuideOpen}
        onClose={() => setIsCanvaGuideOpen(false)}
      />

      <AdminTicketVerifyModal 
        isOpen={isAdminVerifyOpen}
        onClose={() => setIsAdminVerifyOpen(false)}
        registeredTickets={registeredTickets}
      />

    </div>
  );
}
