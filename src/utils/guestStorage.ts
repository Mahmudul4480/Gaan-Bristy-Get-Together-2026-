import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { Ticket } from '../types';
import { db, isFirebaseConfigured } from '../config/firebase';

const GUESTS_COLLECTION = 'honorableGuests';

export { isFirebaseConfigured };

function normalizeGuest(g: Ticket): Ticket {
  return {
    ...g,
    familyName: g.familyName || 'Gaan Bristy Family',
    kidCount: g.kidCount ?? 0,
  };
}

function guestDocRef(ticketId: string) {
  if (!db) throw new Error('Firebase চালু নেই');
  return doc(db, GUESTS_COLLECTION, ticketId);
}

/**
 * Saves (creates or updates) a guest's Honorable Guest Card in Firestore.
 * Every admin/browser subscribed via `subscribeToHonorableGuests` receives
 * this update in real time — no manual refresh needed.
 */
export async function saveHonorableGuest(ticket: Ticket): Promise<void> {
  if (!db) {
    throw new Error('Firebase কনফিগার করা নেই। .env ফাইলে Firebase key যোগ করুন এবং সাইট রিস্টার্ট করুন।');
  }

  try {
    await setDoc(guestDocRef(ticket.ticketId), ticket, { merge: true });
  } catch (error) {
    console.error('[Guest storage] Firestore save failed:', error);
    throw new Error('Guest card সংরক্ষণ করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।');
  }
}

/**
 * Subscribes to the live Honorable Guest list. Fires immediately with the
 * current data, then again whenever any device creates/edits a card —
 * this is what keeps Admin Panel and the public gallery in sync everywhere.
 */
export function subscribeToHonorableGuests(
  onChange: (guests: Ticket[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) {
    onChange([]);
    return () => {};
  }

  const guestsQuery = query(collection(db, GUESTS_COLLECTION), orderBy('issueDate', 'desc'));

  return onSnapshot(
    guestsQuery,
    (snapshot) => {
      const guests = snapshot.docs.map((docSnap) => normalizeGuest(docSnap.data() as Ticket));
      onChange(guests);
    },
    (error) => {
      console.error('[Guest storage] Firestore subscription failed:', error);
      onError?.(error as Error);
    }
  );
}

export async function getHonorableGuestById(ticketId: string): Promise<Ticket | undefined> {
  if (!db) return undefined;
  try {
    const snap = await getDoc(guestDocRef(ticketId));
    return snap.exists() ? normalizeGuest(snap.data() as Ticket) : undefined;
  } catch (error) {
    console.error('[Guest storage] Firestore fetch failed:', error);
    return undefined;
  }
}

export function getGuestCardUrl(ticketId: string): string {
  const url = new URL(window.location.href);
  url.searchParams.set('guest', ticketId);
  url.hash = 'honorable-guests';
  return `${url.origin}${url.pathname}?guest=${encodeURIComponent(ticketId)}#honorable-guests`;
}
