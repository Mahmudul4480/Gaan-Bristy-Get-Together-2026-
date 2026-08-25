import { useEffect, useState } from 'react';
import { GalleryPhoto } from '../types';
import {
  GALLERY_CATEGORIES,
  GALLERY_CATEGORY_LABELS,
  MAX_GALLERY_BATCH_UPLOAD,
} from '../data/galleryCategories';
import {
  deleteGalleryPhoto,
  subscribeToGalleryPhotos,
  updateGalleryPhotoFeatured,
  uploadGalleryPhoto,
} from '../utils/galleryStorage';
import { validateGalleryPhotoFile } from '../utils/photoUpload';
import PhotoFilePicker from './PhotoFilePicker';
import {
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  X,
  Star,
  Sparkles,
} from 'lucide-react';

interface PendingUpload {
  id: string;
  file: File;
  preview: string;
  title: string;
  category: GalleryPhoto['category'];
  featured: boolean;
}

export default function AdminGalleryManager() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);
  const [zoomedPhoto, setZoomedPhoto] = useState<GalleryPhoto | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToGalleryPhotos(
      (list) => setPhotos(list),
      (err) => setError(err.message)
    );
    return unsubscribe;
  }, []);

  const handleFilesSelected = (files: File[]) => {
    setError('');
    setSuccessMsg('');

    const remainingSlots = MAX_GALLERY_BATCH_UPLOAD - pendingUploads.length;
    if (remainingSlots <= 0) {
      setError(`একবারে সর্বোচ্চ ${MAX_GALLERY_BATCH_UPLOAD}টি ছবি নির্বাচন করা যাবে।`);
      return;
    }

    const nextFiles = files.slice(0, remainingSlots);
    const invalidMessages: string[] = [];
    const validItems: PendingUpload[] = [];

    nextFiles.forEach((file) => {
      const validationError = validateGalleryPhotoFile(file);
      if (validationError) {
        invalidMessages.push(`${file.name}: ${validationError}`);
        return;
      }
      validItems.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        preview: URL.createObjectURL(file),
        title: '',
        category: 'Previous Events',
        featured: false,
      });
    });

    if (invalidMessages.length > 0) {
      setError(invalidMessages.slice(0, 3).join(' | '));
    }

    if (validItems.length > 0) {
      setPendingUploads((prev) => [...prev, ...validItems]);
    }

    if (files.length > remainingSlots) {
      setError(`শুধু ${remainingSlots}টি ছবি যোগ করা হয়েছে — সর্বোচ্চ ${MAX_GALLERY_BATCH_UPLOAD}টি।`);
    }
  };

  const updatePendingItem = (id: string, patch: Partial<PendingUpload>) => {
    setPendingUploads((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const removePendingItem = (id: string) => {
    setPendingUploads((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((item) => item.id !== id);
    });
  };

  const clearPendingUploads = () => {
    pendingUploads.forEach((item) => URL.revokeObjectURL(item.preview));
    setPendingUploads([]);
  };

  const handleBatchUpload = async () => {
    if (pendingUploads.length === 0) {
      setError('আগে এক বা একাধিক ছবি নির্বাচন করুন');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccessMsg('');

    let uploadedCount = 0;
    try {
      for (let i = 0; i < pendingUploads.length; i += 1) {
        const item = pendingUploads[i];
        setUploadProgress(`${i + 1} / ${pendingUploads.length} আপলোড হচ্ছে...`);
        await uploadGalleryPhoto(item.file, item.category, item.title, { featured: item.featured });
        uploadedCount += 1;
      }
      setSuccessMsg(`${uploadedCount}টি ছবি Gallery-তে যুক্ত হয়েছে! ওয়েবসাইটে সাথে সাথে দেখা যাবে।`);
      clearPendingUploads();
    } catch (err) {
      setError(
        err instanceof Error
          ? `${uploadedCount}টি আপলোড হয়েছে, তারপর সমস্যা: ${err.message}`
          : 'ছবি আপলোড করা যায়নি'
      );
    } finally {
      setUploadProgress('');
      setIsUploading(false);
    }
  };

  const handleDelete = async (photo: GalleryPhoto) => {
    setDeletingId(photo.id);
    try {
      await deleteGalleryPhoto(photo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ছবি ডিলিট করা যায়নি');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (photo: GalleryPhoto) => {
    setTogglingFeaturedId(photo.id);
    try {
      await updateGalleryPhotoFeatured(photo.id, !photo.featured);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Featured আপডেট করা যায়নি');
    } finally {
      setTogglingFeaturedId(null);
    }
  };

  const featuredCount = photos.filter((photo) => photo.featured).length;

  return (
    <div className="space-y-5 font-body">
      <p className="text-xs text-[#B3A6C9] bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-xl p-3">
        একবারে সর্বোচ্চ {MAX_GALLERY_BATCH_UPLOAD}টি ছবি বেছে নিন, প্রতিটির ক্যাটাগরি আলাদা করে সেট
        করুন, তারপর আপলোড করুন। Featured চিহ্নিত ছবিগুলো ওয়েবসাইটের গ্যালারিতে বড় স্লাইডারে
        দেখাবে।
      </p>

      {/* Batch upload */}
      <div className="bg-[#0F0C1A] border border-[#D4AF37]/35 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#F0D78C]">নতুন ছবি আপলোড</p>
            <p className="text-[11px] text-[#B3A6C9] mt-0.5">
              {pendingUploads.length} / {MAX_GALLERY_BATCH_UPLOAD}টি নির্বাচিত
            </p>
          </div>
          <PhotoFilePicker
            multiple
            maxFiles={MAX_GALLERY_BATCH_UPLOAD}
            onFilesSelected={handleFilesSelected}
            disabled={isUploading || pendingUploads.length >= MAX_GALLERY_BATCH_UPLOAD}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-[#7A1F3D]/40 border border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-xl text-sm font-semibold text-[#F0D78C] transition cursor-pointer disabled:opacity-60"
            label={
              <>
                <ImagePlus className="w-4 h-4" />
                {pendingUploads.length === 0 ? '১০টি পর্যন্ত ছবি বেছে নিন' : 'আরও ছবি যোগ করুন'}
              </>
            }
          />
        </div>

        {pendingUploads.length > 0 && (
          <div className="space-y-3">
            {pendingUploads.map((item, index) => (
              <div
                key={item.id}
                className="bg-[#1C1730] border border-[#D4AF37]/25 rounded-2xl p-3 sm:p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={item.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border-2 border-[#D4AF37]/40 shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[#F0D78C] truncate">{item.file.name}</p>
                      <button
                        type="button"
                        onClick={() => removePendingItem(item.id)}
                        disabled={isUploading}
                        className="p-1.5 rounded-full text-[#B3A6C9] hover:text-[#F6EFE0] hover:bg-[#0F0C1A] transition cursor-pointer disabled:opacity-60"
                        title="সরান"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#F6EFE0] mb-1 block">
                        শিরোনাম (ঐচ্ছিক)
                      </label>
                      <input
                        value={item.title}
                        onChange={(e) => updatePendingItem(item.id, { title: e.target.value })}
                        placeholder="যেমন: Family Fun Moment"
                        disabled={isUploading}
                        className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-[#F6EFE0] mb-1.5 block">
                        ক্যাটাগরি *
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {GALLERY_CATEGORIES.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => updatePendingItem(item.id, { category })}
                            disabled={isUploading}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer disabled:opacity-60 ${
                              item.category === category
                                ? 'gold-gradient-btn text-[#0F0C1A]'
                                : 'bg-[#0F0C1A] text-[#B3A6C9] border border-[#D4AF37]/30 hover:text-[#F6EFE0]'
                            }`}
                          >
                            {GALLERY_CATEGORY_LABELS[category]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#F0D78C] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.featured}
                        onChange={(e) => updatePendingItem(item.id, { featured: e.target.checked })}
                        disabled={isUploading}
                        className="accent-[#D4AF37]"
                      />
                      <Sparkles className="w-3.5 h-3.5" />
                      Featured স্লাইডারে দেখান
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleBatchUpload}
                disabled={isUploading}
                className="flex-1 py-3 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploading ? uploadProgress || 'আপলোড হচ্ছে...' : `${pendingUploads.length}টি ছবি Gallery-তে আপলোড করুন`}
              </button>
              <button
                type="button"
                onClick={clearPendingUploads}
                disabled={isUploading}
                className="px-4 py-3 bg-[#1C1730] border border-[#D4AF37]/30 text-[#B3A6C9] hover:text-[#F6EFE0] rounded-xl text-sm font-bold cursor-pointer disabled:opacity-60"
              >
                বাতিল
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-2 text-xs text-[#F6EFE0] bg-[#7A1F3D]/40 border border-[#A52C54]/50 rounded-xl px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 text-[#F0D78C] shrink-0" />
          {error}
        </p>
      )}
      {successMsg && (
        <p className="flex items-center gap-2 text-xs text-[#F0D78C] bg-[#7A1F3D]/30 border border-[#D4AF37]/40 rounded-xl px-3 py-2">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          {successMsg}
        </p>
      )}

      {/* Uploaded photos list */}
      <div>
        <p className="text-xs font-semibold text-[#F0D78C] mb-1">
          আপলোড করা ছবি ({photos.length})
        </p>
        <p className="text-[11px] text-[#B3A6C9] mb-3">
          Featured: {featuredCount}টি — ⭐ চাপলে বড় স্লাইডারে যুক্ত/সরানো হবে
        </p>
        {photos.length === 0 ? (
          <p className="text-center text-sm text-[#B3A6C9] py-6 bg-[#0F0C1A] border border-[#D4AF37]/20 rounded-2xl">
            এখনও এখান থেকে কোনো ছবি আপলোড করা হয়নি।
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="relative group rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-[#0F0C1A] cursor-pointer"
                onClick={() => setZoomedPhoto(photo)}
              >
                <img src={photo.url} alt={photo.title} className="w-full h-28 object-cover transition group-hover:scale-105" />
                {photo.featured && (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#D4AF37] text-[#0F0C1A] text-[9px] font-black">
                    FEATURED
                  </span>
                )}
                <div className="absolute inset-0 bg-[#0F0C1A]/0 group-hover:bg-[#0F0C1A]/30 transition flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-[#F0D78C] opacity-0 group-hover:opacity-100 transition" />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-[#0F0C1A]/85 px-2 py-1">
                  <p className="text-[10px] text-[#F0D78C] font-bold truncate">{photo.title}</p>
                  <p className="text-[9px] text-[#B3A6C9] truncate">{GALLERY_CATEGORY_LABELS[photo.category]}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFeatured(photo);
                  }}
                  disabled={togglingFeaturedId === photo.id}
                  className={`absolute top-1.5 right-10 p-1.5 rounded-full border transition cursor-pointer disabled:opacity-60 ${
                    photo.featured
                      ? 'bg-[#D4AF37] text-[#0F0C1A] border-[#F0D78C]'
                      : 'bg-[#0F0C1A]/85 text-[#B3A6C9] border-[#D4AF37]/40 hover:text-[#F0D78C]'
                  }`}
                  title={photo.featured ? 'Featured থেকে সরান' : 'Featured করুন'}
                >
                  {togglingFeaturedId === photo.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Star className={`w-3.5 h-3.5 ${photo.featured ? 'fill-current' : ''}`} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(photo);
                  }}
                  disabled={deletingId === photo.id}
                  className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-[#0F0C1A]/85 text-[#F6EFE0] border border-[#A52C54]/50 hover:bg-[#A52C54] transition cursor-pointer disabled:opacity-60"
                  title="ডিলিট করুন"
                >
                  {deletingId === photo.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {zoomedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setZoomedPhoto(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-[#0F0C1A]/85 text-[#F6EFE0] border border-[#D4AF37]/40 hover:bg-[#A52C54] transition cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={zoomedPhoto.url}
              alt={zoomedPhoto.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl border border-[#D4AF37]/40"
            />
            <div className="mt-3 text-center">
              <p className="text-sm text-[#F0D78C] font-bold">{zoomedPhoto.title}</p>
              <p className="text-xs text-[#B3A6C9]">{GALLERY_CATEGORY_LABELS[zoomedPhoto.category]}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
