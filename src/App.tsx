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
import { Ticket } from './types';

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

  return (
    <div id="app-root" className="min-h-screen bg-[#0F0C1A] text-[#F6EFE0] font-sans antialiased selection:bg-[#D4AF37] selection:text-[#0F0C1A] midnight-bg-glow">
      
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

        {/* 4. Family Committee & Leadership Showcase (1 Captain, 6 Co-Captains, 8 Sub-Admins) */}
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
