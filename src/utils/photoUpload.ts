import { blobToDataUrl, compressCanvasToBlob, loadImageFromSrc, smartCompressImage } from './imageCompression';

const MAX_PHOTO_BYTES = 3 * 1024 * 1024;
const CARD_PHOTO_SIZE = 640;

export function validatePhotoFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'শুধুমাত্র ছবি (JPG, PNG, WEBP) আপলোড করা যাবে';
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return 'ছবির সাইজ সর্বোচ্চ ৩ MB হতে হবে';
  }
  return null;
}

/**
 * Auto-shrinks the uploaded photo before it's stored on the guest card —
 * quality is only stepped down as far as needed to hit a small file size,
 * so faces stay sharp instead of looking blurry/pixelated.
 */
export async function compressPhotoFile(file: File): Promise<string> {
  const blob = await smartCompressImage(file, {
    maxDimension: CARD_PHOTO_SIZE,
    targetBytes: 160 * 1024,
    initialQuality: 0.9,
    minQuality: 0.65,
  });
  return blobToDataUrl(blob);
}

export interface PhotoCropRect {
  x: number;
  y: number;
  size: number;
}

/** Crops a square region (matching the circular guest-card frame) then compresses. */
export async function cropAndCompressPhoto(imageSrc: string, crop: PhotoCropRect): Promise<string> {
  const img = await loadImageFromSrc(imageSrc);
  const sx = Math.max(0, Math.min(crop.x, Math.max(0, img.width - 1)));
  const sy = Math.max(0, Math.min(crop.y, Math.max(0, img.height - 1)));
  const size = Math.max(1, Math.min(crop.size, img.width - sx, img.height - sy));

  const canvas = document.createElement('canvas');
  canvas.width = CARD_PHOTO_SIZE;
  canvas.height = CARD_PHOTO_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas সাপোর্ট করছে না');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sx, sy, size, size, 0, 0, CARD_PHOTO_SIZE, CARD_PHOTO_SIZE);

  const blob = await compressCanvasToBlob(canvas, {
    targetBytes: 160 * 1024,
    initialQuality: 0.9,
    minQuality: 0.65,
  });
  return blobToDataUrl(blob);
}
