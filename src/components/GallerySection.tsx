import { useState } from 'react';
import { GALLERY_PHOTOS } from '../data/eventData';
import { GalleryPhoto } from '../types';
import { Image as ImageIcon, X, ZoomIn } from 'lucide-react';

export default function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Previous Events' | 'Family Meeting' | 'Performance'>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const filteredPhotos = GALLERY_PHOTOS.filter(photo => {
    if (selectedCategory === 'All') return true;
    return photo.category === selectedCategory;
  });

  return (
    <section id="gallery" className="py-16 bg-slate-950 text-slate-100 border-t border-amber-500/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>স্মৃতি অ্যালবাম</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
            পূর্ববর্তী গেট-টুগেদার ও মিষ্টি স্মৃতি
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            গান বৃষ্টি ফ্যামিলির বিগত ইভেন্ট, টি-শার্ট স্পেশাল মিটিং ও আড্ডার অবিস্মরণীয় মুহূর্তসমূহ
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-red-500 mx-auto my-4 rounded-full"></div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${selectedCategory === 'All' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}
          >
            সব ছবি
          </button>
          <button
            onClick={() => setSelectedCategory('Previous Events')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${selectedCategory === 'Previous Events' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}
          >
            বিগত অনুষ্ঠানসমূহ
          </button>
          <button
            onClick={() => setSelectedCategory('Family Meeting')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${selectedCategory === 'Family Meeting' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}
          >
            ফ্যামিলি আড্ডা
          </button>
          <button
            onClick={() => setSelectedCategory('Performance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${selectedCategory === 'Performance' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-900 text-slate-300 border border-slate-800'}`}
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
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer border border-slate-800 hover:border-amber-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img 
                src={photo.url} 
                alt={photo.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                  {photo.category}
                </span>
                <h3 className="text-sm font-bold text-white font-serif mt-1">{photo.title}</h3>
              </div>

              <div className="absolute top-3 right-3 p-2 bg-slate-950/60 rounded-full text-amber-400 opacity-0 group-hover:opacity-100 transition">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-amber-500/30 p-2 shadow-2xl">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/80 text-white hover:bg-red-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={activePhoto.url} 
              alt={activePhoto.title} 
              className="w-full max-h-[80vh] object-contain rounded-2xl bg-black"
            />
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold text-amber-300 font-serif">{activePhoto.title}</h3>
              <p className="text-xs text-slate-400 mt-1">Gaan Bristy Grand Family Collection</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
