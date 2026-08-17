import { PointerEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Move, X, ZoomIn, ZoomOut } from 'lucide-react';
import { cropAndCompressPhoto } from '../utils/photoUpload';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

interface PhotoCropModalProps {
  imageSrc: string;
  onConfirm: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

export default function PhotoCropModal({ imageSrc, onConfirm, onCancel }: PhotoCropModalProps) {
  const [frame] = useState(() =>
    Math.min(280, typeof window !== 'undefined' ? Math.max(220, window.innerWidth - 72) : 280)
  );
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; panX: number; panY: number } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = imageSrc;
  }, [imageSrc]);

  const coverScale = useMemo(() => {
    if (!natural.w || !natural.h) return 1;
    return Math.max(frame / natural.w, frame / natural.h);
  }, [natural, frame]);

  const scale = coverScale * zoom;
  const displayW = natural.w * scale;
  const displayH = natural.h * scale;
  const baseLeft = (frame - displayW) / 2;
  const baseTop = (frame - displayH) / 2;

  const clampPan = (x: number, y: number, nextZoom = zoom) => {
    const nextScale = coverScale * nextZoom;
    const w = natural.w * nextScale;
    const h = natural.h * nextScale;
    const leftBase = (frame - w) / 2;
    const topBase = (frame - h) / 2;
    const minX = frame - w - leftBase;
    const maxX = -leftBase;
    const minY = frame - h - topBase;
    const maxY = -topBase;
    return {
      x: Math.min(maxX, Math.max(minX, x)),
      y: Math.min(maxY, Math.max(minY, y)),
    };
  };

  const left = baseLeft + pan.x;
  const top = baseTop + pan.y;

  const applyZoom = (next: number) => {
    const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next));
    setZoom(z);
    setPan((prev) => clampPan(prev.x, prev.y, z));
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPan(clampPan(dragRef.current.panX + dx, dragRef.current.panY + dy));
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null;
    }
  };

  const handleConfirm = async () => {
    if (!natural.w) return;
    setIsSaving(true);
    setError('');
    try {
      const cropped = await cropAndCompressPhoto(imageSrc, {
        x: -left / scale,
        y: -top / scale,
        size: frame / scale,
      });
      onConfirm(cropped);
    } catch {
      setError('ছবি সেট করা যায়নি। আবার চেষ্টা করুন।');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-[#0F0C1A]/92 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#1C1730] border-2 border-[#D4AF37] rounded-3xl p-5 sm:p-6 text-[#F6EFE0] shadow-2xl">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-3 right-3 p-2 rounded-full bg-[#0F0C1A] border border-[#D4AF37]/40 text-[#B3A6C9] hover:text-[#F6EFE0] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-lg font-black font-serif text-center mb-1">ছবি সেট করুন</h3>
        <p className="text-[11px] text-[#B3A6C9] text-center mb-4 flex items-center justify-center gap-1.5">
          <Move className="w-3.5 h-3.5 text-[#D4AF37]" />
          টেনে মুখ গোল ফ্রেমের মাঝে আনুন, জুম দিয়ে ফিট করুন
        </p>

        <div className="flex justify-center">
          <div
            className="relative overflow-hidden rounded-full border-[3px] border-[#D4AF37] bg-[#0F0C1A] touch-none cursor-grab active:cursor-grabbing"
            style={{ width: frame, height: frame }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <img
              src={imageSrc}
              alt="Crop"
              draggable={false}
              onLoad={(e) => {
                const el = e.currentTarget;
                if (el.naturalWidth) setNatural({ w: el.naturalWidth, h: el.naturalHeight });
              }}
              className="absolute max-w-none select-none pointer-events-none"
              style={{
                width: displayW || undefined,
                height: displayH || undefined,
                left,
                top,
              }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <ZoomOut className="w-4 h-4 text-[#B3A6C9] shrink-0" />
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => applyZoom(Number(e.target.value))}
            className="flex-1 accent-[#D4AF37]"
          />
          <ZoomIn className="w-4 h-4 text-[#B3A6C9] shrink-0" />
        </div>

        {error && <p className="text-xs text-[#A52C54] text-center mt-3">{error}</p>}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-full bg-[#0F0C1A] border border-[#D4AF37]/50 text-[#F6EFE0] text-sm font-bold cursor-pointer"
          >
            বাতিল
          </button>
          <button
            type="button"
            disabled={isSaving || !natural.w}
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-full gold-gradient-btn text-[#0F0C1A] text-sm font-extrabold cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            {isSaving ? 'সেট হচ্ছে...' : 'সেট করুন'}
          </button>
        </div>
      </div>
    </div>
  );
}
