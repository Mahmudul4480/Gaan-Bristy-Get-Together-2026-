import { useEffect, useMemo, useRef, useState } from 'react';
import { Ticket } from '../types';
import HonorableGuestCard from './HonorableGuestCard';
import { Award, ChevronLeft, ChevronRight, Clock, QrCode, Search, Sparkles, XCircle } from 'lucide-react';

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
  const confirmedGuests = useMemo(
    () => guests.filter((g) => g.status === 'Confirmed'),
    [guests]
  );
  const selectedGuest = selectedGuestId
    ? guests.find((g) => g.ticketId === selectedGuestId)
    : undefined;
  const selectedConfirmed = selectedGuest?.status === 'Confirmed' ? selectedGuest : undefined;
  const selectedPending = selectedGuest?.status === 'Pending';
  const selectedRejected = selectedGuest?.status === 'Rejected';

  useEffect(() => {
    if ((selectedConfirmed || selectedPending || selectedRejected) && featuredRef.current) {
      featuredRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedConfirmed, selectedPending, selectedRejected]);

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
            পেমেন্ট অ্যাপ্রুভড অতিথিদের কার্ড এখানে স্থায়ীভাবে সংরক্ষিত থাকবে। QR স্ক্যান করলে সরাসরি
            ওই অতিথির কার্ডে নিয়ে যাবে।
          </p>
        </div>

        {selectedConfirmed && (
          <div ref={featuredRef} className="mb-12">
            <p className="text-center text-sm text-[#F0D78C] font-bold mb-4 flex items-center justify-center gap-2">
              <QrCode className="w-4 h-4" />
              আপনার Honorable Guest Card
            </p>
            <HonorableGuestCard ticket={selectedConfirmed} />
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

        {selectedGuestId && (selectedPending || selectedRejected || (!selectedGuest && guests.length > 0)) && (
          <div ref={featuredRef} className="mb-12 max-w-xl mx-auto text-center bg-[#1C1730]/80 border border-[#D4AF37]/40 rounded-3xl px-6 py-8">
            {selectedPending ? (
              <>
                <Clock className="w-10 h-10 text-[#D4AF37] mx-auto mb-3" />
                <p className="text-[#F0D78C] font-bold">পেমেন্ট অ্যাপ্রুভাল পেন্ডিং</p>
                <p className="text-sm text-[#B3A6C9] mt-2">
                  Super Admin আপনার Transaction ID যাচাই করছেন। অ্যাপ্রুভ হলে কার্ড WhatsApp ও SMS-এ পাঠানো হবে।
                </p>
              </>
            ) : selectedRejected ? (
              <>
                <XCircle className="w-10 h-10 text-[#A52C54] mx-auto mb-3" />
                <p className="text-[#F6EFE0] font-bold">এই রেজিস্ট্রেশন অ্যাপ্রুভ হয়নি</p>
                <p className="text-sm text-[#B3A6C9] mt-2">
                  Transaction ID মিলেনি। সঠিক TrxID দিয়ে আবার রেজিস্ট্রেশন করুন, অথবা অ্যাডমিনের সাথে যোগাযোগ করুন।
                </p>
              </>
            ) : (
              <>
                <Search className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-3" />
                <p className="text-[#F6EFE0] font-bold">কার্ড পাওয়া যায়নি</p>
              </>
            )}
            {onSelectGuest && (
              <button
                type="button"
                onClick={() => onSelectGuest(null)}
                className="mt-4 text-xs text-[#B3A6C9] hover:text-[#F0D78C] underline cursor-pointer"
              >
                সব অতিথি দেখুন
              </button>
            )}
          </div>
        )}

        {confirmedGuests.length === 0 && !selectedPending && !selectedRejected ? (
          <div className="text-center py-16 bg-[#1C1730]/60 border border-[#D4AF37]/30 rounded-3xl">
            <Search className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-3" />
            <p className="text-[#F6EFE0] font-bold">এখনও কোনো Honorable Guest যোগ হয়নি</p>
            <p className="text-sm text-[#B3A6C9] mt-2">
              রেজিস্ট্রেশন ও পেমেন্ট অ্যাপ্রুভ হলে আপনার কার্ড এখানে দেখা যাবে।
            </p>
          </div>
        ) : (
          <div>
            {!selectedConfirmed && (
              <div className="text-center mb-6">
                <p className="inline-flex items-center gap-2 bg-[#1C1730] border border-[#D4AF37]/35 rounded-full px-4 py-1.5 text-sm font-bold text-[#F0D78C]">
                  <Sparkles className="w-4 h-4" />
                  মোট {confirmedGuests.length} জন Honorable Guest
                </p>
                <p className="text-xs text-[#B3A6C9] mt-3">
                  কার্ডগুলো নিজে নিজেই স্লাইড হচ্ছে — যেকোনো কার্ডে ট্যাপ করলে সেটি উপরে খুলবে এবং PNG/PDF
                  ডাউনলোড করা যাবে।
                </p>
              </div>
            )}
            <GuestCardSlider
              guests={confirmedGuests.filter((g) => !selectedConfirmed || g.ticketId !== selectedConfirmed.ticketId)}
              onSelectGuest={onSelectGuest}
            />
          </div>
        )}
      </div>
    </section>
  );
}

const SLIDE_INTERVAL_MS = 5500;
const SWIPE_THRESHOLD_PX = 45;
const MAX_DOTS = 12;

function toBengaliDigits(value: number): string {
  return String(value).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);
}

function GuestCardSlider({
  guests,
  onSelectGuest,
}: {
  guests: Ticket[];
  onSelectGuest?: (ticketId: string | null) => void;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = guests.length;

  useEffect(() => {
    setIndex(0);
  }, [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (count === 0) return null;

  const goTo = (next: number) => {
    setIndex((next + count) % count);
  };

  const handleTouchEnd = (endX: number) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null) return;
    const delta = endX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    goTo(delta < 0 ? index + 1 : index - 1);
  };

  return (
    <div
      className="relative mx-auto w-full max-w-md sm:max-w-lg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="overflow-hidden rounded-[28px] p-1 sm:p-2"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
          setPaused(true);
        }}
        onTouchEnd={(e) => {
          handleTouchEnd(e.changedTouches[0]?.clientX ?? 0);
          setPaused(false);
        }}
      >
        <div
          className="flex transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {guests.map((guest, i) => (
            <div
              key={guest.ticketId}
              className={`w-full shrink-0 px-1.5 transition-all duration-700 ${
                i === index ? 'opacity-100 scale-100' : 'opacity-40 scale-[0.94]'
              }`}
              aria-hidden={i !== index}
            >
              <button
                type="button"
                tabIndex={i === index ? 0 : -1}
                onClick={() => onSelectGuest?.(guest.ticketId)}
                aria-label={`${guest.fullName} — কার্ড বড় করে দেখুন`}
                className="block w-full cursor-pointer rounded-3xl text-left transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                <HonorableGuestCard ticket={guest} showActions={false} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <>
          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              type="button"
              aria-label="আগের কার্ড"
              onClick={() => goTo(index - 1)}
              className="p-2.5 rounded-full bg-[#1C1730] border border-[#D4AF37]/50 text-[#F0D78C] hover:bg-[#7A1F3D] transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <p className="text-sm font-bold text-[#F0D78C] tabular-nums">
              {toBengaliDigits(index + 1)} / {toBengaliDigits(count)}
            </p>
            <button
              type="button"
              aria-label="পরের কার্ড"
              onClick={() => goTo(index + 1)}
              className="p-2.5 rounded-full bg-[#1C1730] border border-[#D4AF37]/50 text-[#F0D78C] hover:bg-[#7A1F3D] transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {count <= MAX_DOTS && (
            <div className="flex justify-center gap-1.5 mt-3">
              {guests.map((guest, i) => (
                <button
                  key={guest.ticketId}
                  type="button"
                  aria-label={`${guest.fullName} কার্ড`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === index ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-[#D4AF37]/35'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
