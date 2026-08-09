import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import EventDetails from './components/EventDetails';
import Schedule from './components/Schedule';
import TeamShowcase from './components/TeamShowcase';
import GallerySection from './components/GallerySection';
import DigitalGuestbook from './components/DigitalGuestbook';
import HonorableGuestSection from './components/HonorableGuestSection';
import VenueSection from './components/VenueSection';
import RegistrationModal from './components/RegistrationModal';
import CanvaGuideModal from './components/CanvaGuideModal';
import AdminTicketVerifyModal from './components/AdminTicketVerifyModal';
import AgencyFooter from './components/AgencyFooter';
import FallingMusicNotes from './components/FallingMusicNotes';
import { Ticket } from './types';
import { loadHonorableGuestsWithPhotos, GUEST_STORAGE_KEY, GUEST_UPDATED_EVENT } from './utils/guestStorage';
import { isAdminUrlMatch } from './utils/adminStorage';
import { MessageSquare, Ticket as TicketIcon } from 'lucide-react';

function getGuestIdFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get('guest');
}

export default function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCanvaGuideOpen, setIsCanvaGuideOpen] = useState(false);
  const [isAdminVerifyOpen, setIsAdminVerifyOpen] = useState(false);
  const [honorableGuests, setHonorableGuests] = useState<Ticket[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(() => getGuestIdFromUrl());
  const [activeSection] = useState('hero');

  const refreshGuests = useCallback(async () => {
    const guests = await loadHonorableGuestsWithPhotos();
    setHonorableGuests(guests);
  }, []);

  useEffect(() => {
    void refreshGuests();
  }, [refreshGuests]);

  useEffect(() => {
    const onGuestsUpdated = (event: Event) => {
      const detail = (event as CustomEvent<Ticket[]>).detail;
      if (Array.isArray(detail)) {
        setHonorableGuests(detail);
      } else {
        void refreshGuests();
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === GUEST_STORAGE_KEY) {
        void refreshGuests();
      }
    };

    window.addEventListener(GUEST_UPDATED_EVENT, onGuestsUpdated);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(GUEST_UPDATED_EVENT, onGuestsUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, [refreshGuests]);

  useEffect(() => {
    const guestId = getGuestIdFromUrl();
    if (guestId) {
      setSelectedGuestId(guestId);
      setTimeout(() => {
        document.getElementById('honorable-guests')?.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }

    if (isAdminUrlMatch(window.location.search)) {
      setIsAdminVerifyOpen(true);
    }
  }, []);

  const handleSelectGuest = (ticketId: string | null) => {
    setSelectedGuestId(ticketId);
    const url = new URL(window.location.href);
    if (ticketId) {
      url.searchParams.set('guest', ticketId);
      url.hash = 'honorable-guests';
    } else {
      url.searchParams.delete('guest');
    }
    window.history.replaceState({}, '', url.toString());
  };

  const handleTicketCreated = (newTicket: Ticket, updatedGuests?: Ticket[]) => {
    if (updatedGuests) {
      setHonorableGuests(updatedGuests);
    } else {
      void refreshGuests();
    }
    setSelectedGuestId(newTicket.ticketId);
    const url = new URL(window.location.href);
    url.searchParams.set('guest', newTicket.ticketId);
    url.hash = 'honorable-guests';
    window.history.replaceState({}, '', url.toString());
  };

  const handleExploreSchedule = () => {
    document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenGuestbook = () => {
    document.getElementById('guestbook')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="app-root" className="relative min-h-screen bg-[#0F0C1A] text-[#F6EFE0] font-sans antialiased selection:bg-[#D4AF37] selection:text-[#0F0C1A] midnight-bg-glow overflow-x-hidden">

      <div className="bg-[#7A1F3D] text-[#F6EFE0] py-2 px-3 sm:px-4 border-b border-[#D4AF37]/30 text-xs sm:text-sm font-semibold flex items-center justify-between gap-2 shadow-lg z-50 relative">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden min-w-0 flex-1">
            <span className="bg-[#D4AF37] text-[#0F0C1A] text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-md animate-pulse shrink-0 shadow-sm">LIVE</span>
            <p className="truncate text-[#F6EFE0] font-medium text-[11px] sm:text-sm">
              <span className="text-lighting mr-1">গেস্ট বুক বার:</span> ২০২৬ এর মিলনমেলা উপলক্ষে আপনার মূল্যবান শুভেচ্ছা বার্তা লিখে জানান!
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={handleOpenGuestbook} className="bg-[#1C1730] hover:bg-[#D4AF37] hover:text-[#0F0C1A] text-[#F6EFE0] border border-[#D4AF37]/50 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold transition flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-md group shrink-0">
              <MessageSquare className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] group-hover:text-[#0F0C1A]" />
              <span className="hidden sm:inline">গেস্টবুকে কল করুন</span>
              <span className="sm:hidden">গেস্টবুক</span>
            </button>
            <button onClick={() => setIsRegisterOpen(true)} className="btn-lighting px-3.5 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-[#F0D78C] via-[#D4AF37] to-[#F0D78C] cursor-pointer hidden md:flex items-center gap-1.5 shadow-[0_0_12px_rgba(212,175,55,0.4)] border border-[#F0D78C]">
              <TicketIcon className="w-3.5 h-3.5" />
              <span className="font-black font-bangla">রেজিস্ট্রেশন</span>
            </button>
          </div>
        </div>
      </div>

      <FallingMusicNotes />

      <Header
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenAdminVerify={() => setIsAdminVerifyOpen(true)}
        onOpenCanvaGuide={() => setIsCanvaGuideOpen(true)}
        activeSection={activeSection}
      />

      <main id="main-content">
        <Hero onOpenRegister={() => setIsRegisterOpen(true)} onExploreSchedule={handleExploreSchedule} />
        <EventDetails onOpenRegister={() => setIsRegisterOpen(true)} />
        <Schedule />
        <TeamShowcase />
        <GallerySection />
        <DigitalGuestbook />
        <HonorableGuestSection
          guests={honorableGuests}
          selectedGuestId={selectedGuestId}
          onSelectGuest={handleSelectGuest}
        />
        <VenueSection />
      </main>

      <AgencyFooter />

      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onTicketCreated={handleTicketCreated}
      />

      <CanvaGuideModal isOpen={isCanvaGuideOpen} onClose={() => setIsCanvaGuideOpen(false)} />

      <AdminTicketVerifyModal
        isOpen={isAdminVerifyOpen}
        onClose={() => setIsAdminVerifyOpen(false)}
        registeredTickets={honorableGuests}
        onGuestsUpdated={refreshGuests}
      />
    </div>
  );
}
