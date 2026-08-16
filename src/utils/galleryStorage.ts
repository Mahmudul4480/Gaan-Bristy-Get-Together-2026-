import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { GalleryPhoto } from '../types';
import { db, storage } from '../config/firebase';

const GALLERY_COLLECTION = 'galleryPhotos';
const GALLERY_STORAGE_FOLDER = 'gallery';

export const isGalleryStorageReady = Boolean(db && storage);

function resizeImageToBlob(file: File, maxDimension = 1600, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas সাপোর্ট করছে না'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('ছবি প্রসেস করা যায়নি'))),
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('ছবিটি সঠিক নয়'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('ফাইল পড়া যায়নি'));
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads a photo to Firebase Storage + creates its Firestore record.
 * Every browser subscribed via `subscribeToGalleryPhotos` (the public gallery,
 * any tab, any device) sees it appear live within moments — no redeploy needed.
 */
export async function uploadGalleryPhoto(
  file: File,
  category: GalleryPhoto['category'],
  title: string
): Promise<GalleryPhoto> {
  if (!db || !storage) {
    throw new Error('Firebase কনফিগার করা নেই।');
  }

  const blob = await resizeImageToBlob(file);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const storagePath = `${GALLERY_STORAGE_FOLDER}/${fileName}`;
  const storageRef = ref(storage, storagePath);
  const finalTitle = title.trim() || 'Gaan Bristy Family Moment';

  try {
    await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
    const url = await getDownloadURL(storageRef);

    const docRef = await addDoc(collection(db, GALLERY_COLLECTION), {
      title: finalTitle,
      url,
      category,
      storagePath,
      createdAt: new Date().toISOString(),
    });

    return { id: docRef.id, title: finalTitle, url, category, storagePath };
  } catch (error) {
    console.error('[Gallery storage] Upload failed:', error);
    throw new Error('ছবি আপলোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।');
  }
}

export function subscribeToGalleryPhotos(
  onChange: (photos: GalleryPhoto[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) {
    onChange([]);
    return () => {};
  }

  const galleryQuery = query(collection(db, GALLERY_COLLECTION), orderBy('createdAt', 'desc'));

  return onSnapshot(
    galleryQuery,
    (snapshot) => {
      const photos = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Omit<GalleryPhoto, 'id'>;
        return { ...data, id: docSnap.id };
      });
      onChange(photos);
    },
    (error) => {
      console.error('[Gallery storage] Subscription failed:', error);
      onError?.(error as Error);
    }
  );
}

export async function deleteGalleryPhoto(photo: GalleryPhoto): Promise<void> {
  if (!db) throw new Error('Firebase কনফিগার করা নেই।');

  try {
    await deleteDoc(doc(db, GALLERY_COLLECTION, photo.id));
    if (photo.storagePath && storage) {
      await deleteObject(ref(storage, photo.storagePath)).catch(() => {
        // Storage object might already be gone — not fatal for the user.
      });
    }
  } catch (error) {
    console.error('[Gallery storage] Delete failed:', error);
    throw new Error('ছবি ডিলিট করা যায়নি।');
  }
}
