import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
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
  showActions?: boolean;
}

const CARD_NOTES = ['♪', '♫', '♬', '♩'];
const MIN_QR_SIZE = 168;
const MAX_QR_SIZE = 260;

async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          const finish = () => resolve();
          img.addEventListener('load', finish, { once: true });
          img.addEventListener('error', finish, { once: true });
        })
    )
  );
}

function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function prepareCardClone(clonedDoc: Document): void {
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
  clonedDoc.querySelectorAll<HTMLElement>('.honorable-guest-photo-ring').forEach((el) => {
    el.style.setProperty('background', '#D4AF37');
    el.style.setProperty('background-image', 'none');
  });
  clonedDoc.querySelectorAll<HTMLElement>('.card-floating-note').forEach((el) => {
    el.style.setProperty('animation', 'none');
    el.style.setProperty('opacity', '0.35');
  });
}

function DressCodeHighlight({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="mt-1 text-[9px] leading-tight text-[#F0D78C] font-bold truncate">
        Dress: Male Formal · Female Casual
      </p>
    );
  }

  return (
    <div className="mt-3 mx-auto w-full rounded-xl border-2 border-[#F0D78C] bg-[#7A1F3D] px-3 py-2.5 text-center">
      <p className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-[0.28em] text-[#F0D78C]">
        <Shirt className="w-3.5 h-3.5" />
        {EVENT_DETAILS.dressCodeTitle}
      </p>
      <div className="mt-2 space-y-1.5">
        <p className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#F6EFE0] leading-snug">
          <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#0F0C1A] border border-[#F0D78C] text-[12px] text-[#F0D78C] font-black leading-none" aria-hidden>
            ♂
          </span>
          <span>Male: Formal (Shirt, Pant, Shoe)</span>
        </p>
        <p className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs font-bold text-[#F6EFE0] leading-snug">
          <span className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-[#0F0C1A] border border-[#F0D78C] text-[12px] text-[#F0D78C] font-black leading-none" aria-hidden>
            ♀
          </span>
          <span>Female: Casual</span>
        </p>
      </div>
    </div>
  );
}

export default function HonorableGuestCard({
  ticket,
  compact = false,
  showQr = false,
  showActions = true,
}: HonorableGuestCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const qrWrapRef = useRef<HTMLDivElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const qrImageUrlRef = useRef('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [qrSize, setQrSize] = useState(MIN_QR_SIZE);
  const [qrImageUrl, setQrImageUrl] = useState('');

  const cardUrl = getGuestCardUrl(ticket.ticketId);

  useEffect(() => {
    if (compact || !showQr) return;
    const el = qrWrapRef.current;
    if (!el) return;

    const updateSize = () => {
      const availableWidth = el.clientWidth - 32;
      const nextSize = Math.round(
        Math.min(MAX_QR_SIZE, Math.max(MIN_QR_SIZE, availableWidth || MIN_QR_SIZE))
      );
      setQrSize(nextSize);
    };

    updateSize();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateSize) : null;
    observer?.observe(el);
    window.addEventListener('resize', updateSize);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [compact, showQr]);

  useEffect(() => {
    if (!showQr || compact) {
      setQrImageUrl('');
      return;
    }

    const syncQrImage = () => {
      const canvas = qrCanvasRef.current;
      if (!canvas || canvas.width === 0 || canvas.height === 0) return;
      const nextUrl = canvas.toDataURL('image/png');
      qrImageUrlRef.current = nextUrl;
      setQrImageUrl(nextUrl);
    };

    syncQrImage();
    const retryTimers = [0, 50, 150, 350].map((delay) => window.setTimeout(syncQrImage, delay));
    return () => retryTimers.forEach((timer) => window.clearTimeout(timer));
  }, [showQr, compact, cardUrl, qrSize]);

  const captureCard = async () => {
    if (!cardRef.current) return null;

    if (showQr && !qrImageUrlRef.current) {
      const canvas = qrCanvasRef.current;
      if (canvas && canvas.width > 0 && canvas.height > 0) {
        const nextUrl = canvas.toDataURL('image/png');
        qrImageUrlRef.current = nextUrl;
        setQrImageUrl(nextUrl);
        await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
      } else {
        throw new Error('QR কোড লোড হচ্ছে — এক সেকেন্ড পর আবার চেষ্টা করুন');
      }
    }

    cardRef.current.scrollIntoView({ block: 'center', behavior: 'auto' });
    await waitForImages(cardRef.current);
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
    });

    const rect = cardRef.current.getBoundingClientRect();
    let scale = 3;
    while ((rect.height * scale > 12000 || rect.width * scale > 12000) && scale > 1) {
      scale -= 0.5;
    }

    const sourceRoot = cardRef.current;

    return html2canvas(sourceRoot, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#1a0a14',
      logging: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        prepareCardClone(clonedDoc);
      },
    });
  };

  const handleDownloadPNG = async () => {
    setIsGenerating(true);
    setDownloadError('');
    try {
      const canvas = await captureCard();
      if (!canvas) {
        throw new Error('কার্ড খুঁজে পাওয়া যায়নি');
      }

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((result) => resolve(result), 'image/png', 1);
      });
      if (!blob) {
        throw new Error('PNG তৈরি করা যায়নি');
      }

      triggerFileDownload(blob, `Honorable_Guest_${ticket.ticketId}.png`);
    } catch (error) {
      console.error('[Guest card] PNG download failed:', error);
      setDownloadError(
        error instanceof Error ? error.message : 'PNG ডাউনলোড করা যায়নি — আবার চেষ্টা করুন'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    setDownloadError('');
    try {
      const canvas = await captureCard();
      if (!canvas) {
        throw new Error('কার্ড খুঁজে পাওয়া যায়নি');
      }

      const imgData = canvas.toDataURL('image/png', 1);
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfWidth, pdfHeight] });
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`Honorable_Guest_${ticket.ticketId}.pdf`);
    } catch (error) {
      console.error('[Guest card] PDF download failed:', error);
      setDownloadError(
        error instanceof Error ? error.message : 'PDF ডাউনলোড করা যায়নি — আবার চেষ্টা করুন'
      );
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
    <div className="relative max-w-md mx-auto">
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

          <div className="flex justify-center mt-4">
            <div className="flex items-center justify-center bg-[#7A1F3D] border border-[#D4AF37]/50 text-[#F0D78C] px-5 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide text-center leading-none">
              VIP Honorable Guest Pass
            </div>
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
                {qrImageUrl ? (
                  <img
                    src={qrImageUrl}
                    alt="Guest card QR code"
                    width={qrSize}
                    height={qrSize}
                    className="block"
                    style={{ width: qrSize, height: qrSize }}
                  />
                ) : (
                  <div
                    className="bg-[#FFF9E6] animate-pulse rounded-lg"
                    style={{ width: qrSize, height: qrSize }}
                    aria-hidden
                  />
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-[#F0D78C] font-bold mt-3 font-mono tracking-wide">
                gaanbristy.site
              </p>
              <p className="text-[11px] sm:text-xs text-[#B3A6C9] mt-1 max-w-[280px] leading-relaxed">
                QR স্ক্যান করলে সাথে সাথে ওয়েবসাইটে এই কার্ড স্থায়ীভাবে খুলবে
              </p>
            </div>
          ) : (
            <div className="flex justify-center mt-5">
              <div className="flex items-center justify-center gap-1.5 bg-[#0F0C1A] border border-[#D4AF37]/40 text-[#F0D78C] px-4 py-2 rounded-full text-[10px] font-semibold text-center leading-none">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>Verified Honorable Guest</span>
              </div>
            </div>
          )}

          <p className="text-[10px] text-[#B3A6C9] mt-4 italic">
            Organized by Gaan Bristy Family
          </p>
          <p className="text-[9px] text-[#B3A6C9]/70 mt-1">Designed by Social Media Care</p>
        </div>
      </div>

      <div className={`flex-wrap justify-center gap-3 mt-5 print:hidden ${showActions ? 'flex' : 'hidden'}`}>
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
      {downloadError && (
        <p className="mt-3 text-center text-xs text-[#F6EFE0] bg-[#7A1F3D]/60 border border-[#A52C54]/50 rounded-xl px-3 py-2">
          {downloadError}
        </p>
      )}

      {showQr && !compact && (
        <div className="absolute w-0 h-0 overflow-hidden" aria-hidden>
          <QRCodeCanvas
            ref={qrCanvasRef}
            value={cardUrl}
            size={qrSize}
            level="H"
            bgColor="#FFF9E6"
            fgColor="#1a0a14"
          />
        </div>
      )}
    </div>
  );
}
