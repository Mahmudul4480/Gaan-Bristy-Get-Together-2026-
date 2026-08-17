import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Ticket } from '../types';
import { LOGO_URL, EVENT_DETAILS } from '../data/eventData';
import { getGuestCardUrl } from '../utils/guestStorage';
import { Download, FileText, Loader2, ShieldCheck, Shirt } from 'lucide-react';

interface HonorableGuestCardProps {
  ticket: Ticket;
  compact?: boolean;
  showQr?: boolean;
}

const CARD_NOTES = ['♪', '♫', '♬', '♩'];
const MIN_QR_SIZE = 168;
const MAX_QR_SIZE = 260;

function DressCodeHighlight({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="mt-1 text-[9px] leading-tight text-[#F0D78C] font-bold truncate">
        Dress: Male Formal · Female Casual
      </p>
    );
  }

  return (
    <div className="mt-3 mx-auto w-full rounded-xl border-2 border-[#F0D78C] bg-[#7A1F3D] px-3 py-2.5">
      <p className="inline-flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-[0.28em] text-[#F0D78C]">
        <Shirt className="w-3.5 h-3.5" />
        {EVENT_DETAILS.dressCodeTitle}
      </p>
      <p className="mt-1.5 text-[11px] sm:text-xs font-bold text-[#F6EFE0] leading-snug">
        Male: Formal (Shirt, Pant, Shoe)
      </p>
      <p className="text-[11px] sm:text-xs font-bold text-[#F6EFE0] leading-snug">
        Female: Casual
      </p>
    </div>
  );
}

export default function HonorableGuestCard({ ticket, compact = false, showQr = false }: HonorableGuestCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const qrWrapRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrSize, setQrSize] = useState(MAX_QR_SIZE);

  const cardUrl = getGuestCardUrl(ticket.ticketId);

  useEffect(() => {
    if (compact || !showQr) return;
    const el = qrWrapRef.current;
    if (!el) return;

    const updateSize = () => {
      const availableWidth = el.clientWidth - 32;
      const nextSize = Math.round(
        Math.min(MAX_QR_SIZE, Math.max(MIN_QR_SIZE, availableWidth))
      );
      setQrSize(nextSize);
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [compact, showQr]);

  const captureCard = async () => {
    if (!cardRef.current) return null;
    return html2canvas(cardRef.current, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#1a0a14',
      onclone: (clonedDoc) => {
        // html2canvas can't render `background-clip: text` gradients — it draws
        // the gradient box but not the clipped/transparent text, leaving a
        // solid block behind invisible text. Swap to a plain solid gold color
        // in the cloned DOM used only for the screenshot.
        clonedDoc.querySelectorAll<HTMLElement>('.royal-title-effect').forEach((el) => {
          el.style.setProperty('background', 'none');
          el.style.setProperty('background-image', 'none');
          el.style.setProperty('-webkit-background-clip', 'unset');
          el.style.setProperty('background-clip', 'unset');
          el.style.setProperty('-webkit-text-fill-color', '#F0D78C');
          el.style.setProperty('color', '#F0D78C');
          el.style.setProperty('filter', 'none');
          el.style.setProperty('animation', 'none');
        });
      },
    });
  };

  const handleDownloadPNG = async () => {
    setIsGenerating(true);
    try {
      const canvas = await captureCard();
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `Honorable_Guest_${ticket.ticketId}.png`;
      link.href = canvas.toDataURL('image/png', 1);
      link.click();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const canvas = await captureCard();
      if (!canvas) return;
      const imgData = canvas.toDataURL('image/png', 1);
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfWidth, pdfHeight] });
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`Honorable_Guest_${ticket.ticketId}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (compact) {
    return (
      <div className="w-full">
        <div
          ref={cardRef}
          className="honorable-guest-invite-card relative overflow-hidden rounded-2xl border border-[#D4AF37]/50 p-3"
        >
          <div className="relative z-10 flex items-center gap-3">
            <img src={LOGO_URL} alt="Umbrella" className="w-14 h-14 object-contain shrink-0 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]" />
            <div className="honorable-guest-photo-ring shrink-0">
              {ticket.photoUrl ? (
                <img src={ticket.photoUrl} alt={ticket.fullName} className="w-12 h-12 rounded-full object-cover border-2 border-[#1a0a14]" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#2a0f1f] border-2 border-[#1a0a14] flex items-center justify-center text-[#D4AF37] font-black">
                  {ticket.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-wider">Honorable Guest</p>
              <p className="font-bold text-[#F0D78C] text-sm truncate">{ticket.familyName}</p>
              <p className="text-xs text-[#F6EFE0] truncate">{ticket.fullName}</p>
              <p className="text-[10px] font-mono text-[#B3A6C9]">{ticket.ticketId}</p>
              <DressCodeHighlight compact />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div
        ref={cardRef}
        className="honorable-guest-invite-card relative overflow-hidden rounded-3xl border-2 border-[#D4AF37]/70 shadow-[0_0_50px_rgba(212,175,55,0.25)]"
      >
        {/* Floating notes */}
        {[
          { top: '8%', left: '6%', note: 0 },
          { top: '14%', right: '8%', note: 1 },
          { top: '42%', left: '4%', note: 2 },
          { top: '55%', right: '5%', note: 3 },
          { top: '78%', left: '10%', note: 1 },
          { top: '85%', right: '12%', note: 0 },
        ].map((n, i) => (
          <span key={i} className="card-floating-note" style={{ top: n.top, left: n.left, right: n.right }}>
            {CARD_NOTES[n.note]}
          </span>
        ))}

        <div className="gold-corner-diamond gold-corner-tl">✦</div>
        <div className="gold-corner-diamond gold-corner-tr">✦</div>
        <div className="gold-corner-diamond gold-corner-bl">✦</div>
        <div className="gold-corner-diamond gold-corner-br">✦</div>

        <div className="honorable-guest-invite-inner relative m-3 sm:m-4 rounded-2xl p-5 sm:p-6 text-center">
          {/* Umbrella logo — same as site animation */}
          <div className="flex justify-center mb-3">
            <img
              src={LOGO_URL}
              alt="Gaan Bristy Umbrella"
              className="w-28 sm:w-32 h-auto object-contain drop-shadow-[0_0_30px_rgba(212,175,55,0.45)]"
            />
          </div>

          <p className="text-[10px] sm:text-xs tracking-[0.35em] text-[#D4AF37] font-black uppercase mb-1">
            Honorable Guest
          </p>
          <h3 className="text-xl sm:text-2xl font-black font-serif royal-title-effect leading-tight px-2">
            Gaan Bristy Grand Get Together 2026
          </h3>
          <p className="text-xs sm:text-sm text-[#F0D78C] font-accent italic mt-1">
            Melody at Gulshan Club
          </p>

          {/* Guest photo from form */}
          <div className="flex justify-center my-5">
            <div className="honorable-guest-photo-ring">
              {ticket.photoUrl ? (
                <img
                  src={ticket.photoUrl}
                  alt={ticket.fullName}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-[3px] border-[#1a0a14]"
                />
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#2a0f1f] border-[3px] border-[#1a0a14] flex items-center justify-center text-4xl text-[#D4AF37] font-black">
                  {ticket.fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <p className="text-lg sm:text-xl font-extrabold text-[#F0D78C] font-bangla leading-snug">
            {ticket.familyName}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-[#B3A6C9] mt-0.5 mb-2">
            StarMaker Family Name
          </p>

          <p className="text-base sm:text-lg font-bold text-[#F6EFE0]">{ticket.fullName}</p>
          {ticket.starMakerId && (
            <>
              <div className="flex items-center justify-center gap-2 mt-2 text-[#D4AF37]">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#D4AF37]" />
                <span className="text-[9px] uppercase tracking-widest text-[#B3A6C9] whitespace-nowrap">
                  Starmaker ID No
                </span>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#D4AF37]" />
              </div>
              <p className="text-xs sm:text-sm text-[#F0D78C] font-mono font-bold mt-1">
                {ticket.starMakerId}
              </p>
            </>
          )}

          <div className="inline-flex items-center gap-2 mt-4 bg-[#7A1F3D]/80 border border-[#D4AF37]/50 text-[#F0D78C] px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide">
            VIP Honorable Guest Pass
          </div>

          <div className="flex items-center justify-center gap-3 my-4 text-[#D4AF37]">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span>✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <p className="text-sm font-bold text-[#F6EFE0]">
            {EVENT_DETAILS.dateBengali} • {EVENT_DETAILS.timeBengali}
          </p>
          <p className="text-xs text-[#B3A6C9] mt-1">{EVENT_DETAILS.venueNameBengali}</p>
          <p className="text-[10px] font-mono text-[#F0D78C] mt-2">{ticket.ticketId}</p>

          <DressCodeHighlight />

          {/* QR — only shown to the registered guest themselves & Admin (not public gallery) */}
          {showQr ? (
            <div ref={qrWrapRef} className="mt-5 flex flex-col items-center w-full">
              <div className="bg-[#FFF9E6] p-4 sm:p-5 rounded-2xl shadow-lg border-2 border-[#D4AF37]/50 inline-flex">
                <QRCodeSVG value={cardUrl} size={qrSize} level="H" bgColor="#FFF9E6" fgColor="#1a0a14" />
              </div>
              <p className="text-[11px] sm:text-xs text-[#F0D78C] font-bold mt-3 font-mono tracking-wide">
                gaanbristy.site
              </p>
              <p className="text-[11px] sm:text-xs text-[#B3A6C9] mt-1 max-w-[280px] leading-relaxed">
                QR স্ক্যান করলে সাথে সাথে ওয়েবসাইটে এই কার্ড স্থায়ীভাবে খুলবে
              </p>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 mt-5 bg-[#0F0C1A]/60 border border-[#D4AF37]/30 text-[#B3A6C9] px-3.5 py-1.5 rounded-full text-[10px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              Verified Honorable Guest
            </div>
          )}

          <p className="text-[10px] text-[#B3A6C9] mt-4 italic">
            Organized by Gaan Bristy Family
          </p>
          <p className="text-[9px] text-[#B3A6C9]/70 mt-1">Designed by Social Media Care</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-5 print:hidden">
        <button
          type="button"
          onClick={handleDownloadPNG}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#F0D78C] to-[#D4AF37] text-[#0F0C1A] font-black text-sm cursor-pointer disabled:opacity-60"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          PNG ডাউনলোড
        </button>
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#1C1730] border border-[#D4AF37]/50 text-[#F0D78C] font-bold text-sm cursor-pointer disabled:opacity-60"
        >
          <FileText className="w-4 h-4" />
          PDF ডাউনলোড
        </button>
      </div>
    </div>
  );
}
