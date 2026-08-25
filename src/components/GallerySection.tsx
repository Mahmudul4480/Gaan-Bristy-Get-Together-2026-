import { useEffect, useRef, useState } from 'react';
import { GALLERY_PHOTOS } from '../data/eventData';
import {
  GALLERY_CATEGORIES,
  GALLERY_CATEGORY_LABELS,
  GalleryCategoryFilter,
} from '../data/galleryCategories';
import { GalleryPhoto } from '../types';
import { subscribeToGalleryPhotos } from '../utils/galleryStorage';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Sparkles, X, ZoomIn } from 'lucide-react';

const SLIDE_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD_PX = 45;

function toBengaliDigits(value: number): string {
  return String(value).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)]);
}

function GalleryFeaturedSlider({
  photos,
  onPhotoClick,
}: {
  photos: GalleryPhoto[];
  onPhotoClick: (photo: GalleryPhoto) => void;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = photos.length;

  useEffect(() => {
    setIndex(0);
  }, [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (count === 0) return null;

  const goTo = (next: number) => {
    setIndex((next + count) % count);
  };

  const handleTouchEnd = (endX: number) => {
    const startX = touchStartX.current;
    touchStartX.current = null;
    if (startX === null) return;
    const delta = endX - startX;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    goTo(delta < 0 ? index + 1 : index - 1);
  };

  const activePhoto = photos[index];

  return (
    <div className="mb-10">
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1F3D]/50 border border-[#D4AF37]/40 text-[#F0D78C] text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          Featured Moments
        </div>
        <p className="text-xs text-[#B3A6C9] mt-2">
          নির্বাচিত ছবিগুলো বড় সাইজে স্বয়ংক্রিয় স্লাইড হচ্ছে — ট্যাপ/ক্লিক করলে ফুল স্ক্রিনে দেখুন
        </p>
      </div>

      <div
        className="relative mx-auto w-full max-w-5xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="overflow-hidden rounded-3xl border-2 border-[#D4AF37]/50 shadow-[0_0_40px_rgba(212,175,55,0.2)] bg-[#1C1730]"
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0]?.clientX ?? null;
            setPaused(true);
          }}
          onTouchEnd={(e) => {
            handleTouchEnd(e.changedTouches[0]?.clientX ?? 0);
            setPaused(false);
          }}
        >
          <div
            className="flex transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => onPhotoClick(photo)}
                aria-label={`${photo.title} — বড় করে দেখুন`}
                className={`relative w-full shrink-0 cursor-pointer text-left transition-all duration-700 ${
                  i === index ? 'opacity-100' : 'opacity-70'
                }`}
              >
                <div className="relative h-[280px] sm:h-[380px] md:h-[480px] lg:h-[520px] bg-[#0F0C1A]">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-contain md:object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0C1A] via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <span className="text-[10px] sm:text-xs bg-[#7A1F3D] text-[#F0D78C] font-bold px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40">
                      {GALLERY_CATEGORY_LABELS[photo.category]}
                    </span>
                    <h3 className="text-lg sm:text-2xl font-bold text-[#F0D78C] font-serif mt-2 drop-shadow-lg">
                      {photo.title}
                    </h3>
                  </div>
                  <div className="absolute top-4 right-4 p-2.5 bg-[#0F0C1A]/80 rounded-full text-[#F0D78C] border border-[#D4AF37]/40">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="আগের ছবি"
              onClick={() => goTo(index - 1)}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0F0C1A]/85 border border-[#D4AF37]/50 text-[#F0D78C] hover:bg-[#7A1F3D] transition cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="পরের ছবি"
              onClick={() => goTo(index + 1)}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0F0C1A]/85 border border-[#D4AF37]/50 text-[#F0D78C] hover:bg-[#7A1F3D] transition cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="mt-4 flex items-center justify-center gap-4">
              <p className="text-sm font-bold text-[#F0D78C] tabular-nums">
                {toBengaliDigits(index + 1)} / {toBengaliDigits(count)}
              </p>
            </div>

            <div className="flex justify-center gap-1.5 mt-3 flex-wrap px-4">
              {photos.map((photo, i) => (
                <button
                  key={photo.id}
                  type="button"
                  aria-label={photo.title}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === index ? 'w-6 bg-[#D4AF37]' : 'w-2 bg-[#D4AF37]/35'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {count === 1 && activePhoto && (
          <p className="text-center text-xs text-[#B3A6C9] mt-3">{activePhoto.title}</p>
        )}
      </div>
    </div>
  );
}

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategoryFilter>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<GalleryPhoto[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToGalleryPhotos((photos) => setUploadedPhotos(photos));
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!activePhoto) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActivePhoto(null);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePhoto]);

  const allPhotos = [...uploadedPhotos, ...GALLERY_PHOTOS];
  const featuredPhotos = allPhotos.filter((photo) => photo.featured);

  const filteredPhotos = allPhotos.filter((photo) => {
    if (selectedCategory === 'All') return true;
    return photo.category === selectedCategory;
  });

  return (
    <section id="gallery" className="py-16 bg-[#0F0C1A] text-[#F6EFE0] border-t border-[#D4AF37]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7A1F3D]/60 border border-[#D4AF37]/40 text-[#F0D78C] text-xs font-semibold mb-3">
            <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>স্মৃতি অ্যালবাম (Gallery)</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-english-heading text-[#F0D78C] tracking-tight">
            Memories Gallery
          </h2>
          <p className="text-[#B3A6C9] text-sm mt-1 font-body">
            গান বৃষ্টি ফ্যামিলির বিগত ইভেন্ট, স্পেশাল মিটিং, ফানি মোমেন্ট ও আড্ডার অবিস্মরণীয় মুহূর্তসমূহ
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-[#7A1F3D] mx-auto my-4 rounded-full"></div>
        </div>

        {featuredPhotos.length > 0 && (
          <GalleryFeaturedSlider photos={featuredPhotos} onPhotoClick={setActivePhoto} />
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${selectedCategory === 'All' ? 'gold-gradient-btn text-[#0F0C1A]' : 'bg-[#1C1730] text-[#B3A6C9] border border-[#D4AF37]/30 hover:text-[#F6EFE0]'}`}
          >
            সব ছবি
          </button>
          {GALLERY_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${selectedCategory === category ? 'gold-gradient-btn text-[#0F0C1A]' : 'bg-[#1C1730] text-[#B3A6C9] border border-[#D4AF37]/30 hover:text-[#F6EFE0]'}`}
            >
              {GALLERY_CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-16 bg-[#1C1730]/60 border border-[#D4AF37]/30 rounded-3xl">
            <ImageIcon className="w-10 h-10 text-[#D4AF37]/50 mx-auto mb-3" />
            <p className="text-[#F6EFE0] font-bold">এখনও Gallery-তে কোনো ছবি নেই</p>
            <p className="text-sm text-[#B3A6C9] mt-2">
              Admin Panel → গ্যালারি থেকে ছবি আপলোড করলে এখানে দেখা যাবে।
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-[#D4AF37]/30 hover:border-[#D4AF37] shadow-xl transition-all duration-300 hover:-translate-y-1 bg-[#1C1730]"
            >
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0C1A] via-[#0F0C1A]/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
              
              {photo.featured && (
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0F0C1A] text-[9px] font-black">
                  FEATURED
                </span>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                <span className="text-[10px] bg-[#7A1F3D] text-[#F0D78C] font-bold px-2 py-0.5 rounded border border-[#D4AF37]/30">
                  {GALLERY_CATEGORY_LABELS[photo.category]}
                </span>
                <h3 className="text-sm font-bold text-[#F6EFE0] font-serif mt-1">{photo.title}</h3>
              </div>

              <div className="absolute top-3 right-3 p-2 bg-[#0F0C1A]/80 rounded-full text-[#F0D78C] border border-[#D4AF37]/40 opacity-0 group-hover:opacity-100 transition">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
        )}

      </div>

      {/* Lightbox — full-screen style zoom */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[#0F0C1A]/96 backdrop-blur-lg p-2 sm:p-4"
          onClick={() => setActivePhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
        >
          <button
            type="button"
            onClick={() => setActivePhoto(null)}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 p-2.5 rounded-full bg-[#0F0C1A]/90 text-[#F6EFE0] border border-[#D4AF37]/50 hover:bg-[#7A1F3D] transition cursor-pointer shadow-lg"
            aria-label="বন্ধ করুন"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative flex flex-col items-center justify-center w-full max-w-[min(96vw,1400px)] max-h-[96dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activePhoto.url}
              alt={activePhoto.title}
              className="max-w-full max-h-[88dvh] w-auto h-auto object-contain rounded-xl sm:rounded-2xl border-2 border-[#D4AF37]/60 shadow-[0_0_60px_rgba(212,175,55,0.25)] bg-[#0F0C1A]"
            />
            <div className="mt-3 sm:mt-4 text-center px-4 max-w-2xl">
              <span className="inline-block text-[10px] sm:text-xs bg-[#7A1F3D] text-[#F0D78C] font-bold px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40 mb-2">
                {GALLERY_CATEGORY_LABELS[activePhoto.category]}
              </span>
              <h3 className="text-base sm:text-xl font-bold text-[#F0D78C] font-serif">{activePhoto.title}</h3>
              <p className="text-[11px] sm:text-xs text-[#B3A6C9] mt-1">Gaan Bristy Grand Family Collection</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
