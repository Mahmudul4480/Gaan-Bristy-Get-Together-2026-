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
import { GuestbookEntry } from '../types';
import { db } from '../config/firebase';

const GUESTBOOK_COLLECTION = 'guestbookEntries';

const AVATAR_GRADIENTS = [
  'from-[#D4AF37] to-[#7A1F3D]',
  'from-[#7A1F3D] to-[#0F0C1A]',
  'from-[#D4AF37] to-[#1C1730]',
  'from-[#7A1F3D] to-[#D4AF37]',
  'from-[#1C1730] to-[#7A1F3D]',
];

function omitUndefined<T extends Record<string, unknown>>(data: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
}

function pickAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

function sanitizeFavoriteSong(favoriteSong: string | undefined, message: string): string | undefined {
  const song = favoriteSong?.trim();
  if (!song) return undefined;
  if (song === message.trim()) return undefined;
  if (song.length > 200) return undefined;
  return song;
}

function normalizeGuestbookText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function isDuplicateGuestbookEntry(
  existing: GuestbookEntry[],
  candidate: Pick<GuestbookEntry, 'name' | 'message'>
): boolean {
  const name = normalizeGuestbookText(candidate.name);
  const message = normalizeGuestbookText(candidate.message);
  return existing.some(
    (entry) => normalizeGuestbookText(entry.name) === name && normalizeGuestbookText(entry.message) === message
  );
}

const LEGACY_STORAGE_KEY = 'gb_guestbook_entries';
const LEGACY_MIGRATION_FLAG = 'gb_guestbook_legacy_migrated_v1';

export function readLegacyGuestbookFromStorage(): GuestbookEntry[] {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return [];
    const legacy = JSON.parse(raw) as GuestbookEntry[];
    return legacy.filter(
      (entry) =>
        entry?.name?.trim() &&
        entry?.message?.trim() &&
        !entry.id?.startsWith('gb-msg-')
    );
  } catch {
    return [];
  }
}

export function clearLegacyGuestbookStorage(): void {
  localStorage.removeItem(LEGACY_STORAGE_KEY);
  localStorage.removeItem(LEGACY_MIGRATION_FLAG);
}

/**
 * Uploads comments that were saved only in localStorage (pre-Firestore) so
 * every visitor — including admins — sees the same feed.
 */
export async function migrateLegacyGuestbookEntries(existing: GuestbookEntry[]): Promise<number> {
  let legacy: GuestbookEntry[] = [];
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) {
      if (!localStorage.getItem(LEGACY_MIGRATION_FLAG)) {
        localStorage.setItem(LEGACY_MIGRATION_FLAG, '1');
      }
      return 0;
    }
    legacy = JSON.parse(raw) as GuestbookEntry[];
  } catch {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return 0;
  }

  return importGuestbookEntries(
    legacy.filter(
      (entry) =>
        entry?.name?.trim() &&
        entry?.message?.trim() &&
        !entry.id?.startsWith('gb-msg-')
    ),
    existing,
    { clearLegacyStorageOnComplete: true }
  );
}

export async function importGuestbookEntries(
  entries: Array<{
    name: string;
    starMakerId?: string;
    favoriteSong?: string;
    message: string;
    createdAt?: string;
  }>,
  existing: GuestbookEntry[],
  options?: { clearLegacyStorageOnComplete?: boolean; stopOnError?: boolean }
): Promise<number> {
  if (entries.length === 0) return 0;

  let imported = 0;
  let skippedDuplicates = 0;
  let failed = 0;
  const seen = [...existing];

  for (const entry of entries) {
    if (isDuplicateGuestbookEntry(seen, entry)) {
      skippedDuplicates += 1;
      continue;
    }

    try {
      const saved = await addGuestbookEntry({
        name: entry.name,
        starMakerId: entry.starMakerId,
        favoriteSong: entry.favoriteSong,
        message: entry.message,
        createdAt: entry.createdAt,
      });
      seen.unshift(saved);
      imported += 1;
    } catch (error) {
      failed += 1;
      console.error('[Guestbook storage] Import failed:', entry.name, error);
      if (options?.stopOnError) throw error;
    }
  }

  if (
    options?.clearLegacyStorageOnComplete &&
    failed === 0 &&
    imported + skippedDuplicates === entries.length
  ) {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.setItem(LEGACY_MIGRATION_FLAG, '1');
  }

  return imported;
}

export function shouldShowFavoriteSong(entry: GuestbookEntry): boolean {
  if (!entry.favoriteSong?.trim()) return false;
  return sanitizeFavoriteSong(entry.favoriteSong, entry.message) !== undefined;
}

export function getDisplayFavoriteSong(entry: GuestbookEntry): string | undefined {
  return sanitizeFavoriteSong(entry.favoriteSong, entry.message);
}

export function formatGuestbookTimestamp(entry: GuestbookEntry): string {
  if (entry.createdAt) {
    const date = new Date(entry.createdAt);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString('bn-BD', {
        timeZone: 'Asia/Dhaka',
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    }
  }
  return entry.timestamp;
}

export function subscribeToGuestbookEntries(
  onChange: (entries: GuestbookEntry[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) {
    onChange([]);
    return () => {};
  }

  const guestbookQuery = query(collection(db, GUESTBOOK_COLLECTION), orderBy('createdAt', 'desc'));

  return onSnapshot(
    guestbookQuery,
    (snapshot) => {
      const entries = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Omit<GuestbookEntry, 'id'>;
        return { ...data, id: docSnap.id };
      });
      onChange(entries);
    },
    (error) => {
      console.error('[Guestbook storage] Subscription failed:', error);
      onError?.(error as Error);
    }
  );
}

export async function addGuestbookEntry(input: {
  name: string;
  starMakerId?: string;
  favoriteSong?: string;
  message: string;
  createdAt?: string;
}): Promise<GuestbookEntry> {
  if (!db) {
    throw new Error('Firebase কনফিগার করা নেই।');
  }

  const trimmedName = input.name.trim();
  const trimmedMessage = input.message.trim();
  const starMakerId = input.starMakerId?.trim();
  const favoriteSong = sanitizeFavoriteSong(input.favoriteSong, trimmedMessage);
  const createdAt = input.createdAt?.trim() || new Date().toISOString();

  const payload = omitUndefined({
    name: trimmedName,
    starMakerId: starMakerId || undefined,
    favoriteSong: favoriteSong || undefined,
    message: trimmedMessage,
    likes: 0,
    badge: starMakerId ? 'GB Member' : 'Guest',
    avatarColor: pickAvatarColor(trimmedName),
    createdAt,
  });

  try {
    const docRef = await addDoc(collection(db, GUESTBOOK_COLLECTION), payload);
    return {
      id: docRef.id,
      name: trimmedName,
      starMakerId,
      favoriteSong,
      message: trimmedMessage,
      timestamp: 'এইমাত্র',
      likes: 0,
      badge: starMakerId ? 'GB Member' : 'Guest',
      avatarColor: pickAvatarColor(trimmedName),
      createdAt,
    };
  } catch (error) {
    console.error('[Guestbook storage] Create failed:', error);
    const code = (error as { code?: string })?.code || '';
    if (code === 'permission-denied') {
      throw new Error(
        'Firestore Rules Publish করা হয়নি। Firebase Console → Firestore Database → Rules ট্যাবে firestore.rules Publish করুন।'
      );
    }
    throw new Error('বার্তা পোস্ট করা যায়নি — আবার চেষ্টা করুন।');
  }
}

export async function deleteGuestbookEntry(entryId: string): Promise<void> {
  if (!db) throw new Error('Firebase কনফিগার করা নেই।');

  try {
    await deleteDoc(doc(db, GUESTBOOK_COLLECTION, entryId));
  } catch (error) {
    console.error('[Guestbook storage] Delete failed:', error);
    throw new Error('গেস্টবুক বার্তা মুছে ফেলা যায়নি।');
  }
}

export async function updateGuestbookLikes(entryId: string, likes: number): Promise<void> {
  if (!db) {
    throw new Error('Firebase কনফিগার করা নেই।');
  }

  try {
    await updateDoc(doc(db, GUESTBOOK_COLLECTION, entryId), { likes: Math.max(0, likes) });
  } catch (error) {
    console.error('[Guestbook storage] Like update failed:', error);
    throw new Error('লাইক আপডেট করা যায়নি।');
  }
}
