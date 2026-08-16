import { ChangeEvent, useEffect, useState } from 'react';
import { GalleryPhoto } from '../types';
import { deleteGalleryPhoto, subscribeToGalleryPhotos, uploadGalleryPhoto } from '../utils/galleryStorage';
import { validatePhotoFile } from '../utils/photoUpload';
import { ImagePlus, Loader2, Trash2, Upload, CheckCircle2, AlertTriangle } from 'lucide-react';

const CATEGORIES: GalleryPhoto['category'][] = ['Previous Events', 'Family Meeting', 'Performance'];
const CATEGORY_LABELS: Record<GalleryPhoto['category'], string> = {
  'Previous Events': 'বিগত অনুষ্ঠানসমূহ',
  'Family Meeting': 'ফ্যামিলি আড্ডা',
  Performance: 'লাইভ আনপ্লাগড',
};

export default function AdminGalleryManager() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [category, setCategory] = useState<GalleryPhoto['category']>('Previous Events');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToGalleryPhotos(
      (list) => setPhotos(list),
      (err) => setError(err.message)
    );
    return unsubscribe;
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    const validationError = validatePhotoFile(selected);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const resetUploadForm = () => {
    setFile(null);
    setPreview('');
    setTitle('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('একটি ছবি নির্বাচন করুন');
      return;
    }
    setIsUploading(true);
    setError('');
    setSuccessMsg('');
    try {
      await uploadGalleryPhoto(file, category, title);
      setSuccessMsg('ছবি সফলভাবে Gallery-তে যুক্ত হয়েছে! ওয়েবসাইটে সাথে সাথে দেখা যাবে।');
      resetUploadForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ছবি আপলোড করা যায়নি');
    } finally {
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

  return (
    <div className="space-y-5 font-body">
      <p className="text-xs text-[#B3A6C9] bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-xl p-3">
        এখান থেকে ছবি আপলোড করলেই সেটা সাথে সাথে ওয়েবসাইটের "Memories Gallery"-তে
        (নির্বাচিত ক্যাটাগরিতে) সবার জন্য দেখা যাবে — কোনো কোড পরিবর্তন বা রিডিপ্লয় লাগবে না।
        ফোন থেকেও এই প্যানেল খুলে ছবি আপলোড করা যাবে।
      </p>

      {/* Upload form */}
      <div className="bg-[#0F0C1A] border border-[#D4AF37]/35 rounded-2xl p-4 space-y-4">
        <div>
          <label className="text-xs font-semibold text-[#F6EFE0] mb-2 block">গ্যালারি ক্যাটাগরি *</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  category === c
                    ? 'gold-gradient-btn text-[#0F0C1A]'
                    : 'bg-[#1C1730] text-[#B3A6C9] border border-[#D4AF37]/30 hover:text-[#F6EFE0]'
                }`}
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[#F6EFE0] mb-1.5 block">ছবির শিরোনাম (ঐচ্ছিক)</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="যেমন: Grand Cake Cutting Ceremony"
            className="w-full bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {preview ? (
            <img src={preview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border-2 border-[#D4AF37]/50" />
          ) : (
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-[#D4AF37]/40 bg-[#1C1730] flex items-center justify-center text-[#D4AF37]/60">
              <ImagePlus className="w-8 h-8" />
            </div>
          )}
          <label className="flex-1 w-full cursor-pointer">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <span className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-[#7A1F3D]/40 border border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-xl text-sm font-semibold text-[#F0D78C] transition">
              <ImagePlus className="w-4 h-4" />
              ছবি বেছে নিন
            </span>
          </label>
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

        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || !file}
          className="w-full py-3 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {isUploading ? 'আপলোড হচ্ছে...' : 'Gallery-তে আপলোড করুন'}
        </button>
      </div>

      {/* Uploaded photos list */}
      <div>
        <p className="text-xs font-semibold text-[#F0D78C] mb-3">
          আপলোড করা ছবি ({photos.length})
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
                className="relative group rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-[#0F0C1A]"
              >
                <img src={photo.url} alt={photo.title} className="w-full h-28 object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-[#0F0C1A]/85 px-2 py-1">
                  <p className="text-[10px] text-[#F0D78C] font-bold truncate">{photo.title}</p>
                  <p className="text-[9px] text-[#B3A6C9] truncate">{CATEGORY_LABELS[photo.category]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(photo)}
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
    </div>
  );
}
