import { useEffect, useState } from 'react';
import { GALLERY_PHOTOS } from '../data/eventData';
import { GalleryPhoto } from '../types';
import { subscribeToGalleryPhotos } from '../utils/galleryStorage';
import { Image as ImageIcon, X, ZoomIn } from 'lucide-react';

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Previous Events' | 'Family Meeting' | 'Performance'>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<GalleryPhoto[]>([]);

  // Live sync — any photo an admin uploads via the Admin Panel appears here
  // instantly for everyone, on top of the site's built-in showcase photos.
  useEffect(() => {
    const unsubscribe = subscribeToGalleryPhotos((photos) => setUploadedPhotos(photos));
    return unsubscribe;
  }, []);

  const allPhotos = [...uploadedPhotos, ...GALLERY_PHOTOS];

  const filteredPhotos = allPhotos.filter(photo => {
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
            গান বৃষ্টি ফ্যামিলির বিগত ইভেন্ট, স্পেশাল মিটিং ও আড্ডার অবিস্মরণীয় মুহূর্তসমূহ
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4AF37] to-[#7A1F3D] mx-auto my-4 rounded-full"></div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${selectedCategory === 'All' ? 'gold-gradient-btn text-[#0F0C1A]' : 'bg-[#1C1730] text-[#B3A6C9] border border-[#D4AF37]/30 hover:text-[#F6EFE0]'}`}
          >
            সব ছবি
          </button>
          <button
            onClick={() => setSelectedCategory('Previous Events')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${selectedCategory === 'Previous Events' ? 'gold-gradient-btn text-[#0F0C1A]' : 'bg-[#1C1730] text-[#B3A6C9] border border-[#D4AF37]/30 hover:text-[#F6EFE0]'}`}
          >
            বিগত অনুষ্ঠানসমূহ
          </button>
          <button
            onClick={() => setSelectedCategory('Family Meeting')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${selectedCategory === 'Family Meeting' ? 'gold-gradient-btn text-[#0F0C1A]' : 'bg-[#1C1730] text-[#B3A6C9] border border-[#D4AF37]/30 hover:text-[#F6EFE0]'}`}
          >
            ফ্যামিলি আড্ডা
          </button>
          <button
            onClick={() => setSelectedCategory('Performance')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition ${selectedCategory === 'Performance' ? 'gold-gradient-btn text-[#0F0C1A]' : 'bg-[#1C1730] text-[#B3A6C9] border border-[#D4AF37]/30 hover:text-[#F6EFE0]'}`}
          >
            লাইভ আনপ্লাগড
          </button>
        </div>

        {/* Photo Grid */}
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
              
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                <span className="text-[10px] bg-[#7A1F3D] text-[#F0D78C] font-bold px-2 py-0.5 rounded border border-[#D4AF37]/30">
                  {photo.category}
                </span>
                <h3 className="text-sm font-bold text-[#F6EFE0] font-serif mt-1">{photo.title}</h3>
              </div>

              <div className="absolute top-3 right-3 p-2 bg-[#0F0C1A]/80 rounded-full text-[#F0D78C] border border-[#D4AF37]/40 opacity-0 group-hover:opacity-100 transition">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0C1A]/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-[#1C1730] rounded-3xl overflow-hidden border-2 border-[#D4AF37] p-3 shadow-2xl">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#0F0C1A]/80 text-[#F6EFE0] border border-[#D4AF37]/40 hover:bg-[#7A1F3D] transition"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={activePhoto.url} 
              alt={activePhoto.title} 
              className="w-full max-h-[80vh] object-contain rounded-2xl bg-[#0F0C1A]"
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold text-[#F0D78C] font-serif">{activePhoto.title}</h3>
              <p className="text-xs text-[#B3A6C9] mt-1">Gaan Bristy Grand Family Collection</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

