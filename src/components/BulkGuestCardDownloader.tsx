import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal, flushSync } from 'react-dom';
import { Archive, Loader2, X } from 'lucide-react';
import { Ticket } from '../types';
import HonorableGuestCard, { type HonorableGuestCardHandle } from './HonorableGuestCard';
import { buildZipBlob, triggerBlobDownload } from '../utils/zipStore';

interface BulkGuestCardDownloaderProps {
  guests: Ticket[];
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function dateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function BulkGuestCardDownloader({ guests }: BulkGuestCardDownloaderProps) {
  const cardHandleRef = useRef<HonorableGuestCardHandle>(null);
  const cancelledRef = useRef(false);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, name: '' });
  const [exportError, setExportError] = useState('');
  const [exportNote, setExportNote] = useState('');

  const confirmedGuests = useMemo(
    () => guests.filter((guest) => guest.status === 'Confirmed'),
    [guests]
  );

  useEffect(() => {
    if (!exportError && !exportNote) return;
    const timer = window.setTimeout(() => {
      setExportError('');
      setExportNote('');
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [exportError, exportNote]);

  const handleCancel = () => {
    cancelledRef.current = true;
  };

  const saveZip = (zipFiles: { name: string; data: Uint8Array }[], failed: string[]) => {
    if (failed.length > 0) {
      zipFiles.push({
        name: 'failed_cards.txt',
        data: new TextEncoder().encode(
          `এই কার্ডগুলো ZIP-এ যোগ করা যায়নি:\n${failed.map((item) => `- ${item}`).join('\n')}\n`
        ),
      });
    }

    const zip = buildZipBlob(zipFiles);
    triggerBlobDownload(zip, `Gaan_Bristy_Guest_Cards_${dateStamp()}.zip`);
  };

  const handleDownloadAll = async () => {
    if (confirmedGuests.length === 0 || isExporting) return;

    cancelledRef.current = false;
    setExportError('');
    setExportNote('');
    setIsExporting(true);
    setProgress({ done: 0, total: confirmedGuests.length, name: confirmedGuests[0]?.fullName || '' });

    const zipFiles: { name: string; data: Uint8Array }[] = [];
    const failed: string[] = [];

    try {
      for (let index = 0; index < confirmedGuests.length; index++) {
        if (cancelledRef.current) break;

        const guest = confirmedGuests[index];
        setProgress({ done: index, total: confirmedGuests.length, name: guest.fullName });
        flushSync(() => setCurrentTicket(guest));
        await delay(150);

        try {
          const blob = await cardHandleRef.current?.capturePngBlob({ skipScroll: true, scale: 2 });
          if (!blob) {
            throw new Error('কার্ড তৈরি হয়নি');
          }
          zipFiles.push({
            name: `${String(index + 1).padStart(3, '0')}_${guest.ticketId}.png`,
            data: new Uint8Array(await blob.arrayBuffer()),
          });
        } catch (error) {
          console.error(`[Bulk guest cards] Failed ${guest.ticketId}:`, error);
          failed.push(`${guest.ticketId} (${guest.fullName})`);
        }

        setProgress({ done: index + 1, total: confirmedGuests.length, name: guest.fullName });
        await delay(40);
      }

      if (zipFiles.length === 0) {
        throw new Error(
          cancelledRef.current ? 'ডাউনলোড বাতিল করা হয়েছে' : 'কোনো কার্ড PNG তৈরি করা যায়নি'
        );
      }

      saveZip(zipFiles, failed);

      const pngCount = failed.length > 0 ? zipFiles.length - 1 : zipFiles.length;
      if (cancelledRef.current) {
        setExportNote(`${pngCount} টি কার্ড ZIP-এ সেভ হয়েছে, বাকি বাতিল`);
      } else if (failed.length > 0) {
        setExportNote(`${pngCount} টি কার্ড ডাউনলোড হয়েছে, ${failed.length} টি যায়নি`);
      } else {
        setExportNote(`${pngCount} টি Guest Card ZIP-এ ডাউনলোড হয়েছে`);
      }
    } catch (error) {
      console.error('[Bulk guest cards] ZIP export failed:', error);
      setExportError(error instanceof Error ? error.message : 'সব কার্ড ডাউনলোড করা যায়নি');
    } finally {
      setCurrentTicket(null);
      setIsExporting(false);
    }
  };

  const percent =
    progress.total > 0 ? Math.min(100, Math.round((progress.done / progress.total) * 100)) : 0;

  const overlay =
    typeof document === 'undefined'
      ? null
      : createPortal(
          <>
            {(exportError || exportNote) && !isExporting && (
              <div className="fixed bottom-4 left-1/2 z-[120] w-[min(92vw,28rem)] -translate-x-1/2 rounded-xl border border-[#D4AF37]/40 bg-[#1C1730] px-4 py-3 text-xs text-[#F6EFE0] shadow-lg font-body">
                {exportError || exportNote}
              </div>
            )}

            {isExporting && (
              <div className="fixed inset-0 z-[120] bg-[#0F0C1A]/95 backdrop-blur-sm flex items-center justify-center px-4 font-body">
                <div className="w-full max-w-md rounded-2xl border border-[#D4AF37]/50 bg-[#1C1730] p-5 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-[#F0D78C]">সব Guest Card ZIP তৈরি হচ্ছে</p>
                      <p className="text-xs text-[#B3A6C9] mt-1">
                        {progress.done}/{progress.total} — {progress.name || 'প্রস্তুত হচ্ছে...'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="p-1.5 rounded-full bg-[#0F0C1A] border border-[#A52C54]/50 text-[#F6EFE0] cursor-pointer"
                      aria-label="বাতিল করুন"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-[#0F0C1A] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#F0D78C] to-[#D4AF37] transition-[width] duration-200"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="mt-3 text-[11px] text-[#B3A6C9] leading-relaxed">
                    {confirmedGuests.length} টি কার্ড একটা ZIP ফাইলে আসবে। ট্যাব বন্ধ করবেন না — ২ থেকে ৫
                    মিনিট লাগতে পারে।
                  </p>
                </div>
              </div>
            )}

            {currentTicket && (
              <div
                className="fixed top-0 left-0 w-[420px] pointer-events-none"
                style={{ zIndex: 110 }}
                aria-hidden
              >
                <HonorableGuestCard
                  key={currentTicket.ticketId}
                  ref={cardHandleRef}
                  ticket={currentTicket}
                  showQr
                  showActions={false}
                />
              </div>
            )}
          </>,
          document.body
        );

  return (
    <>
      <button
        type="button"
        disabled={confirmedGuests.length === 0 || isExporting}
        onClick={handleDownloadAll}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-[#F0D78C] to-[#D4AF37] text-[#0F0C1A] text-xs font-black cursor-pointer disabled:opacity-40"
      >
        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
        {isExporting
          ? `কার্ড তৈরি হচ্ছে ${progress.done}/${progress.total}`
          : `সব Card ZIP ডাউনলোড (${confirmedGuests.length})`}
      </button>
      {overlay}
    </>
  );
}
