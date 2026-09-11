import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Ticket } from '../types';
import { LOGO_URL, EVENT_DETAILS } from '../data/eventData';
import { getGuestCardUrl } from '../utils/guestStorage';
import { getPaymentKind } from '../utils/paymentKind';
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
/** Past ~4.5 megapixels the PNG encode alone costs seconds on a phone. */
const MAX_EXPORT_PIXELS = 4_500_000;

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

function describeExportError(error: unknown, fallback: string): string {
  const message = error instanceof Error ? error.message : String(error ?? '');
  if (/createPattern|width or height of 0/i.test(message)) {
    return 'কার্ডের ছবি তৈরি করা যায়নি (ব্রাউজার রেন্ডার সমস্যা)। পেজ রিফ্রেশ করে আবার চেষ্টা করুন।';
  }
  if (/tainted|SecurityError/i.test(message)) {
    return 'গেস্টের ছবিটি ব্লক হয়েছে — ছবিটি আবার আপলোড করে চেষ্টা করুন।';
  }
  if (message.trim()) return message;
  return fallback;
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

type CaptureMode = 'rich' | 'safe';

/** Lets us match a cloned node back to its live counterpart inside `onclone`. */
const EXPORT_ID_ATTR = 'data-gb-export-id';

function tagSourceElements(root: HTMLElement): Map<string, HTMLElement> {
  const sourceById = new Map<string, HTMLElement>();
  [root, ...Array.from(root.querySelectorAll<HTMLElement>('*'))].forEach((el, index) => {
    const id = String(index);
    el.setAttribute(EXPORT_ID_ATTR, id);
    sourceById.set(id, el);
  });
  return sourceById;
}

function untagSourceElements(sourceById: Map<string, HTMLElement>): void {
  sourceById.forEach((el) => el.removeAttribute(EXPORT_ID_ATTR));
}

/**
 * html2canvas copies the whole page into an offscreen iframe before it draws the
 * card, so a heavy page (gallery, guest list, quiz) makes the export crawl.
 * Keeping only <head>, the card and its ancestors cuts that copy down to the
 * card itself — html2canvas measures the clone, so the crop still lines up.
 */
function buildCloneFilter(sourceRoot: HTMLElement): (element: Element) => boolean {
  const keep = new Set<Element>();
  for (let el: Element | null = sourceRoot; el; el = el.parentElement) keep.add(el);
  const head = sourceRoot.ownerDocument.head;

  return (element: Element) => {
    if (keep.has(element)) return false;
    if (head && (element === head || head.contains(element))) return false;
    return !sourceRoot.contains(element);
  };
}

/** Dropping the siblings can let a flex/grid ancestor resize, so lock the widths. */
function pinCloneWidths(clonedCard: HTMLElement, sourceRoot: HTMLElement): void {
  let clone: HTMLElement | null = clonedCard;
  let source: HTMLElement | null = sourceRoot;

  while (clone && source && source.tagName !== 'HTML') {
    const width = source.getBoundingClientRect().width;
    if (width > 0) {
      clone.style.setProperty('width', `${width}px`);
      clone.style.setProperty('min-width', '0');
      clone.style.setProperty('max-width', 'none');
      clone.style.setProperty('flex', 'none');
    }
    clone = clone.parentElement;
    source = source.parentElement;
  }
}

/** Solid stand-ins used when a gradient/background image can't be rasterized. */
const SOLID_BACKGROUND_FALLBACKS: Array<[string, string]> = [
  ['honorable-guest-invite-card', '#1a0a14'],
  ['honorable-guest-invite-inner', 'transparent'],
  ['honorable-guest-photo-ring', '#D4AF37'],
  ['midnight-bg-glow', '#0F0C1A'],
];

function exportScaleFor(rect: DOMRect): number {
  let scale = 3;
  while (
    (rect.height * scale > 12000 ||
      rect.width * scale > 12000 ||
      rect.width * rect.height * scale * scale > MAX_EXPORT_PIXELS) &&
    scale > 1.5
  ) {
    scale -= 0.5;
  }
  return scale;
}

/** Guards the isolated capture: a resized clone would export a cropped card. */
function matchesSourceSize(canvas: HTMLCanvasElement, rect: DOMRect, scale: number): boolean {
  if (!canvas.width || !canvas.height) return false;
  const widthDrift = Math.abs(canvas.width / scale - rect.width) / Math.max(rect.width, 1);
  const heightDrift = Math.abs(canvas.height / scale - rect.height) / Math.max(rect.height, 1);
  return widthDrift < 0.05 && heightDrift < 0.15;
}

function solidFallbackFor(el: HTMLElement): string {
  const match = SOLID_BACKGROUND_FALLBACKS.find(([className]) => el.classList.contains(className));
  if (match) return match[1];
  return '#D4AF37';
}

/**
 * html2canvas rasterizes background images itself, and a background whose
 * source image has no intrinsic size makes it build a 0×0 canvas — which then
 * throws `createPattern ... width or height of 0`. Stripping those backgrounds
 * (all of them in `safe` mode) keeps the export working.
 */
function prepareCardClone(
  clonedCard: HTMLElement,
  sourceById: Map<string, HTMLElement>,
  mode: CaptureMode
): void {
  const clonedElements = [clonedCard, ...Array.from(clonedCard.querySelectorAll<HTMLElement>('*'))];

  clonedElements.forEach((clonedEl) => {
    clonedEl.style.setProperty('animation', 'none');
    clonedEl.style.setProperty('transition', 'none');

    const exportId = clonedEl.getAttribute(EXPORT_ID_ATTR);
    const sourceEl = exportId ? sourceById.get(exportId) : undefined;
    if (!sourceEl) return;

    const computed = window.getComputedStyle(sourceEl);
    const backgroundImage = computed.backgroundImage;
    const hasBackgroundImage = Boolean(backgroundImage) && backgroundImage !== 'none';

    if (clonedEl.classList.contains('royal-title-effect')) {
      clonedEl.style.setProperty('background', 'none');
      clonedEl.style.setProperty('background-image', 'none');
      clonedEl.style.setProperty('-webkit-background-clip', 'unset');
      clonedEl.style.setProperty('background-clip', 'unset');
      clonedEl.style.setProperty('-webkit-text-fill-color', '#F0D78C');
      clonedEl.style.setProperty('color', '#F0D78C');
      clonedEl.style.setProperty('filter', 'none');
      return;
    }

    if (clonedEl.classList.contains('honorable-guest-pass-badge')) {
      clonedEl.style.setProperty('display', 'inline-block');
      clonedEl.style.setProperty('text-align', 'center');
      clonedEl.style.setProperty('letter-spacing', '0');
      clonedEl.style.setProperty('text-transform', 'none');
      clonedEl.style.setProperty('line-height', '1.2');
      clonedEl.style.setProperty('padding-left', '20px');
      clonedEl.style.setProperty('padding-right', '20px');
      clonedEl.style.setProperty('white-space', 'nowrap');
    }

    if (!hasBackgroundImage) return;

    const rect = sourceEl.getBoundingClientRect();
    const isUnrenderable = backgroundImage.includes('url(') || rect.width < 1 || rect.height < 1;

    if (mode === 'safe' || isUnrenderable) {
      clonedEl.style.setProperty('background-image', 'none');
      const currentColor = computed.backgroundColor;
      const isTransparent = !currentColor || currentColor === 'rgba(0, 0, 0, 0)' || currentColor === 'transparent';
      if (isTransparent) {
        clonedEl.style.setProperty('background-color', solidFallbackFor(clonedEl));
      }
    }
  });

  clonedCard.querySelectorAll<HTMLElement>('.card-floating-note').forEach((el) => {
    el.style.setProperty('opacity', '0.35');
  });
}

/** Swaps live canvases for PNG snapshots so html2canvas never reads a 0×0 canvas. */
function replaceCanvasesWithImages(clonedCard: HTMLElement, sourceCard: HTMLElement): void {
  const sourceCanvases = Array.from(sourceCard.querySelectorAll('canvas'));
  const clonedCanvases = Array.from(clonedCard.querySelectorAll('canvas'));

  clonedCanvases.forEach((clonedCanvas, index) => {
    const sourceCanvas = sourceCanvases[index];
    if (!sourceCanvas || sourceCanvas.width === 0 || sourceCanvas.height === 0) {
      clonedCanvas.remove();
      return;
    }

    const img = clonedCanvas.ownerDocument.createElement('img');
    img.src = sourceCanvas.toDataURL('image/png');
    img.width = sourceCanvas.width;
    img.height = sourceCanvas.height;
    img.style.display = 'block';
    img.style.width = `${sourceCanvas.clientWidth || sourceCanvas.width}px`;
    img.style.height = `${sourceCanvas.clientHeight || sourceCanvas.height}px`;
    clonedCanvas.replaceWith(img);
  });
}

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

/**
 * html2canvas mis-places letter-spaced / flex / uppercase text inside pills.
 * Paint the pass badge ourselves so PNG and PDF both get true centered text.
 */
function rasterizePassBadges(clonedCard: HTMLElement, sourceById: Map<string, HTMLElement>): void {
  clonedCard.querySelectorAll<HTMLElement>('.honorable-guest-pass-badge').forEach((clonedBadge) => {
    const exportId = clonedBadge.getAttribute(EXPORT_ID_ATTR);
    const sourceBadge = exportId ? sourceById.get(exportId) : undefined;
    const measureEl = sourceBadge ?? clonedBadge;
    const rect = measureEl.getBoundingClientRect();
    const text = (clonedBadge.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return;

    const width = Math.max(Math.round(rect.width) || clonedBadge.offsetWidth, 200);
    const height = Math.max(Math.round(rect.height) || clonedBadge.offsetHeight, 32);
    const dpr = 2;
    const sourceStyle = sourceBadge ? window.getComputedStyle(sourceBadge) : null;
    const fontSize = sourceStyle?.fontSize || '11px';
    const fontFamily = sourceStyle?.fontFamily || 'sans-serif';
    const font = `700 ${fontSize} ${fontFamily}`;

    const canvas = clonedBadge.ownerDocument.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.font = font;
    const drawWidth = Math.max(width, Math.ceil(ctx.measureText(text).width + 44));
    canvas.width = Math.round(drawWidth * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    roundRectPath(ctx, 0, 0, drawWidth, height, height / 2);
    ctx.fillStyle = '#7A1F3D';
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
    ctx.lineWidth = 1;
    roundRectPath(ctx, 0.5, 0.5, drawWidth - 1, height - 1, Math.max(0, height / 2 - 0.5));
    ctx.stroke();

    ctx.fillStyle = '#F0D78C';
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, drawWidth / 2, height / 2);

    const img = clonedBadge.ownerDocument.createElement('img');
    img.src = canvas.toDataURL('image/png');
    img.alt = text;
    img.width = drawWidth;
    img.height = height;
    img.style.display = 'block';
    img.style.margin = '0 auto';
    img.style.width = `${drawWidth}px`;
    img.style.height = `${height}px`;
    clonedBadge.replaceWith(img);
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
  const paymentKind = getPaymentKind(ticket);
  const passLabel =
    paymentKind === 'complimentary' ? 'VIP সম্মানী অতিথি পাস' : 'VIP HONORABLE GUEST PASS';
  const compactLabel = paymentKind === 'complimentary' ? 'সম্মানী অতিথি' : 'Honorable Guest';

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

  const renderCardCanvas = async (mode: CaptureMode, isolate: boolean) => {
    const sourceRoot = cardRef.current;
    if (!sourceRoot) return null;

    const rect = sourceRoot.getBoundingClientRect();
    const scale = exportScaleFor(rect);

    const sourceById = tagSourceElements(sourceRoot);
    try {
      const canvas = await html2canvas(sourceRoot, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#1a0a14',
        logging: false,
        imageTimeout: 8000,
        ignoreElements: isolate ? buildCloneFilter(sourceRoot) : undefined,
        onclone: (_clonedDoc, clonedCard) => {
          const clonedElement = clonedCard as HTMLElement;
          if (isolate) pinCloneWidths(clonedElement, sourceRoot);
          prepareCardClone(clonedElement, sourceById, mode);
          replaceCanvasesWithImages(clonedElement, sourceRoot);
          rasterizePassBadges(clonedElement, sourceById);
        },
      });

      if (isolate && !matchesSourceSize(canvas, rect, scale)) return null;
      return canvas;
    } finally {
      untagSourceElements(sourceById);
    }
  };

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
    await document.fonts?.ready?.catch(() => undefined);
    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
    });

    try {
      const isolated = await renderCardCanvas('rich', true);
      if (isolated) return isolated;
      console.warn('[Guest card] Isolated capture came out the wrong size, using the full page.');
    } catch (error) {
      console.warn('[Guest card] Isolated capture failed, using the full page:', error);
    }

    try {
      return await renderCardCanvas('rich', false);
    } catch (error) {
      console.warn('[Guest card] Rich capture failed, retrying without backgrounds:', error);
      return renderCardCanvas('safe', false);
    }
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
      setDownloadError(describeExportError(error, 'PNG ডাউনলোড করা যায়নি — আবার চেষ্টা করুন'));
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

      // JPEG encodes several times faster than PNG and the card has no
      // transparency, so the PDF looks identical at a fraction of the wait.
      const imgData = canvas.toDataURL('image/jpeg', 0.94);
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [pdfWidth, pdfHeight] });
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`Honorable_Guest_${ticket.ticketId}.pdf`);
    } catch (error) {
      console.error('[Guest card] PDF download failed:', error);
      setDownloadError(describeExportError(error, 'PDF ডাউনলোড করা যায়নি — আবার চেষ্টা করুন'));
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
              <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-wider">{compactLabel}</p>
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
            {paymentKind === 'complimentary' ? 'সম্মানী অতিথি' : 'Honorable Guest'}
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

          <div className="mt-4 w-full" style={{ textAlign: 'center' }}>
            <span className="honorable-guest-pass-badge">{passLabel}</span>
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
