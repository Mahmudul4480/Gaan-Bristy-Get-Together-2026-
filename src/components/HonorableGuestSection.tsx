import { useEffect, useRef } from 'react';
import { Ticket } from '../types';
import HonorableGuestCard from './HonorableGuestCard';
import { Award, QrCode, Search } from 'lucide-react';

interface HonorableGuestSectionProps {
  guests: Ticket[];
  selectedGuestId?: string | null;
  onSelectGuest?: (ticketId: string | null) => void;
}

export default function HonorableGuestSection({
  guests,
  selectedGuestId,
  onSelectGuest,
}: HonorableGuestSectionProps) {
  const featuredRef = useRef<HTMLDivElement>(null);
  const selectedGuest = selectedGuestId
    ? guests.find((g) => g.ticketId === selectedGuestId)
    : undefined;

  useEffect(() => {
    if (selectedGuest && featuredRef.current) {
      featuredRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedGuest]);

  return (
    <section
      id="honorable-guests"
      className="relative py-16 md:py-20 bg-[#0F0C1A] border-t border-[#D4AF37]/20 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#7A1F3D]/60 border border-[#D4AF37]/40 text-[#F0D78C] px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-4">
            <Award className="w-4 h-4" />
            Honorable Guest 2026
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-[#F6EFE0] royal-title-effect">
            Get Together Guest Gallery
          </h2>
          <p className="text-[#B3A6C9] mt-3 max-w-2xl mx-auto text-sm sm:text-base">
            টিকিট বুকিং সম্পন্ন অতিথিদের কার্ড এখানে স্থায়ীভাবে সংরক্ষিত থাকবে। QR স্ক্যান করলে সরাসরি
            ওই অতিথির কার্ডে নিয়ে যাবে।
          </p>
        </div>

        {selectedGuest && (
          <div ref={featuredRef} className="mb-12">
            <p className="text-center text-sm text-[#F0D78C] font-bold mb-4 flex items-center justify-center gap-2">
              <QrCode className="w-4 h-4" />
              আপনার Honorable Guest Card
            </p>
            <HonorableGuestCard ticket={selectedGuest} />
            {onSelectGuest && (
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => onSelectGuest(null)}
                  className="text-xs text-[#B3A6C9] hover:text-[#F0D78C] underline cursor-pointer"
                >
                  সব অতিথি দেখুন
                </button>
              </div>
            )}
          </div>
        )}

        {guests.length === 0 ? (
          <div className="text-center py-16 bg-[#1C1730]/60 border border-[#D4AF37]/30 rounded-3xl">
            <Search className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-3" />
            <p className="text-[#F6EFE0] font-bold">এখনও কোনো Honorable Guest যোগ হয়নি</p>
            <p className="text-sm text-[#B3A6C9] mt-2">
              টিকিট বুকিং ও পেমেন্ট সম্পন্ন করলে আপনার কার্ড এখানে দেখা যাবে।
            </p>
          </div>
        ) : (
          <div>
            {!selectedGuest && (
              <p className="text-sm text-[#B3A6C9] text-center mb-6">
                মোট {guests.length} জন Honorable Guest
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guests
                .filter((g) => !selectedGuestId || g.ticketId !== selectedGuestId)
                .map((guest) => (
                  <button
                    key={guest.ticketId}
                    type="button"
                    onClick={() => onSelectGuest?.(guest.ticketId)}
                    className="text-left cursor-pointer transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 rounded-3xl"
                  >
                    <HonorableGuestCard ticket={guest} compact />
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
