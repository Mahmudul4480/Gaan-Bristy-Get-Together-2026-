import { blobToDataUrl, smartCompressImage } from './imageCompression';

const MAX_PHOTO_BYTES = 3 * 1024 * 1024;

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
    maxDimension: 640,
    targetBytes: 160 * 1024,
    initialQuality: 0.9,
    minQuality: 0.65,
  });
  return blobToDataUrl(blob);
}
