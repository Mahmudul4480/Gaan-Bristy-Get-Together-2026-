export const GALLERY_CATEGORIES = [
  'Previous Events',
  'Family Meeting',
  'Performance',
  'Family Funny Moment',
] as const;

export type GalleryPhotoCategory = (typeof GALLERY_CATEGORIES)[number];

export type GalleryCategoryFilter = 'All' | GalleryPhotoCategory;

export const GALLERY_CATEGORY_LABELS: Record<GalleryPhotoCategory, string> = {
  'Previous Events': 'বিগত অনুষ্ঠানসমূহ',
  'Family Meeting': 'ফ্যামিলি আড্ডা',
  Performance: 'লাইভ আনপ্লাগড',
  'Family Funny Moment': 'ফ্যামিলি ফানি মোমেন্ট',
};

export const MAX_GALLERY_BATCH_UPLOAD = 10;
