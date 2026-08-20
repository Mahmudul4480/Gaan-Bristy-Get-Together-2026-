export interface CompressOptions {
  /** Longest side is scaled down to this, aspect ratio preserved. Never upscales. */
  maxDimension: number;
  /** Try to land at or under this file size. */
  targetBytes: number;
  /** Quality to try first — kept high so sharp photos stay sharp. */
  initialQuality?: number;
  /** Never go below this quality — beyond this point compression hurts more than it helps. */
  minQuality?: number;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('ছবিটি খোলা যায়নি। JPG/PNG ফরম্যাটে সেভ করে আবার চেষ্টা করুন।'));
    };
    img.src = objectUrl;
  });
}

async function loadImageBitmapScaled(file: File, maxDimension: number): Promise<ImageBitmap | null> {
  if (typeof createImageBitmap !== 'function') return null;

  try {
    const source = await createImageBitmap(file);
    const longestSide = Math.max(source.width, source.height);
    if (longestSide <= maxDimension) return source;

    const scale = maxDimension / longestSide;
    const resizeWidth = Math.max(1, Math.round(source.width * scale));
    const resizeHeight = Math.max(1, Math.round(source.height * scale));
    const resized = await createImageBitmap(source, {
      resizeWidth,
      resizeHeight,
      resizeQuality: 'high',
    });
    source.close();
    return resized;
  } catch {
    return null;
  }
}

function drawBitmapToCanvas(bitmap: ImageBitmap): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas সাপোর্ট করছে না');
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('ছবি প্রসেস করা যায়নি'))),
      'image/jpeg',
      quality
    );
  });
}

export function loadImageFromSrc(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('ছবিটি সঠিক নয়'));
    img.src = src;
  });
}

export async function compressCanvasToBlob(
  canvas: HTMLCanvasElement,
  options: { targetBytes: number; initialQuality?: number; minQuality?: number }
): Promise<Blob> {
  const { targetBytes, initialQuality = 0.92, minQuality = 0.62 } = options;
  let quality = initialQuality;
  let blob = await canvasToBlob(canvas, quality);

  while (blob.size > targetBytes && quality > minQuality) {
    quality = Math.max(minQuality, quality - 0.08);
    blob = await canvasToBlob(canvas, quality);
    if (quality === minQuality) break;
  }

  return blob;
}

/**
 * Resizes + compresses an image, only reducing quality as far as needed to
 * approach `targetBytes` — so a photo that's already small stays crisp at
 * high quality, while a huge phone-camera photo gets stepped down just
 * enough to shrink the upload without turning visibly blurry/blocky.
 */
export async function smartCompressImage(file: File, options: CompressOptions): Promise<Blob> {
  const { maxDimension, targetBytes, initialQuality = 0.92, minQuality = 0.62 } = options;

  const bitmap = await loadImageBitmapScaled(file, maxDimension);
  if (bitmap) {
    const canvas = drawBitmapToCanvas(bitmap);
    return compressCanvasToBlob(canvas, { targetBytes, initialQuality, minQuality });
  }

  const img = await loadImage(file);
  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const width = Math.round(img.width * scale);
  const height = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas সাপোর্ট করছে না');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  return compressCanvasToBlob(canvas, { targetBytes, initialQuality, minQuality });
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('ছবি রূপান্তর করা যায়নি'));
    reader.readAsDataURL(blob);
  });
}
