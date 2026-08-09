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

export function compressPhotoFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSize = 480;
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => reject(new Error('Invalid image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
