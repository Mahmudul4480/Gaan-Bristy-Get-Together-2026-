import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { GalleryPhoto } from '../types';
import { db, storage } from '../config/firebase';
import { smartCompressImage } from './imageCompression';

const GALLERY_COLLECTION = 'galleryPhotos';
const GALLERY_STORAGE_FOLDER = 'gallery';

export const isGalleryStorageReady = Boolean(db && storage);

interface FirebaseErrorLike {
  code?: string;
  message?: string;
}

function describeUploadError(error: unknown): string {
  const code = (error as FirebaseErrorLike)?.code || '';
  const rawMessage = (error as FirebaseErrorLike)?.message || String(error);

  if (code.includes('storage/unauthorized') || code.includes('storage/unauthenticated')) {
    return 'Firebase Storage Rules Publish করা হয়নি। Firebase Console → Storage → Rules ট্যাবে storage.rules-এর কনটেন্ট Publish করুন।';
  }
  if (code === 'storage/unknown' || code === 'storage/bucket-not-found' || code === 'storage/project-not-found') {
    return 'Firebase Storage এখনও চালু করা হয়নি। Firebase Console → Build → Storage → "Get Started" চেপে চালু করুন, তারপর আবার চেষ্টা করুন।';
  }
  if (code === 'permission-denied' || code.includes('permission-denied')) {
    return 'Firestore Rules Publish করা হয়নি। Firebase Console → Firestore Database → Rules ট্যাবে firestore.rules-এর সর্বশেষ কনটেন্ট Publish করুন।';
  }
  if (code === 'storage/quota-exceeded') {
    return 'Firebase Storage-এর ফ্রি কোটা শেষ হয়ে গেছে।';
  }

  return `ছবি আপলোড করা যায়নি — ${rawMessage || 'অজানা সমস্যা'}${code ? ` (${code})` : ''}`;
}

/**
 * Uploads a photo to Firebase Storage + creates its Firestore record.
 * Every browser subscribed via `subscribeToGalleryPhotos` (the public gallery,
 * any tab, any device) sees it appear live within moments — no redeploy needed.
 */
export async function uploadGalleryPhoto(
  file: File,
  category: GalleryPhoto['category'],
  title: string,
  options?: { featured?: boolean }
): Promise<GalleryPhoto> {
  if (!db || !storage) {
    throw new Error('Firebase কনফিগার করা নেই।');
  }

  // Sharp, gallery-worthy resolution but only as much compression as needed
  // to keep the upload light — quality won't be sacrificed unnecessarily.
  const blob = await smartCompressImage(file, {
    maxDimension: 1920,
    targetBytes: 700 * 1024,
    initialQuality: 0.9,
    minQuality: 0.68,
  });
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
      featured: !!options?.featured,
      storagePath,
      createdAt: new Date().toISOString(),
    });

    return {
      id: docRef.id,
      title: finalTitle,
      url,
      category,
      featured: !!options?.featured,
      storagePath,
    };
  } catch (error) {
    console.error('[Gallery storage] Upload failed:', error);
    throw new Error(describeUploadError(error));
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

export async function updateGalleryPhotoFeatured(photoId: string, featured: boolean): Promise<void> {
  if (!db) throw new Error('Firebase কনফিগার করা নেই।');

  try {
    await updateDoc(doc(db, GALLERY_COLLECTION, photoId), { featured });
  } catch (error) {
    console.error('[Gallery storage] Featured update failed:', error);
    throw new Error(describeUploadError(error));
  }
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
    throw new Error(describeUploadError(error));
  }
}
