import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  deleteDoc,
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
    status: g.status === 'Pending' || g.status === 'Rejected' ? g.status : 'Confirmed',
  };
}

export function isConfirmedGuest(ticket: Ticket): boolean {
  return ticket.status === 'Confirmed';
}

interface FirebaseErrorLike {
  code?: string;
  message?: string;
}

function omitUndefined<T extends Record<string, unknown>>(data: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
}

function describeGuestSaveError(error: unknown): string {
  const code = (error as FirebaseErrorLike)?.code || '';
  const rawMessage = (error as FirebaseErrorLike)?.message || (error instanceof Error ? error.message : String(error));

  if (code === 'permission-denied' || code.includes('permission-denied')) {
    return 'Firestore Rules Publish করা হয়নি অথবা লেখা ব্লক হয়েছে। Firebase Console → Firestore Database → Rules ট্যাবে firestore.rules-এর সর্বশেষ কনটেন্ট Publish করুন।';
  }
  if (rawMessage.includes('undefined')) {
    return 'Guest card-এ খালি ফিল্ড সেভ করা যায়নি। আবার চেষ্টা করুন।';
  }
  if (code === 'unavailable' || code.includes('unavailable') || rawMessage.toLowerCase().includes('network')) {
    return 'ইন্টারনেট সংযোগ নেই অথবা Firebase-এ পৌঁছানো যায়নি। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।';
  }
  if (rawMessage.includes('exceed') || rawMessage.toLowerCase().includes('too large') || code.includes('invalid-argument')) {
    return `Guest card সংরক্ষণ করা যায়নি — ${rawMessage}`;
  }

  return `Guest card সংরক্ষণ করা যায়নি — ${rawMessage}${code ? ` (${code})` : ''}`;
}

function guestDocRef(ticketId: string) {
  if (!db) throw new Error('Firebase চালু নেই');
  return doc(db, GUESTS_COLLECTION, ticketId);
}

/** Generates a ticket id that is unlikely to collide with existing cards. */
export function generateUniqueTicketId(existingIds?: Iterable<string>): string {
  const taken = new Set(existingIds);
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const timePart = Date.now().toString().slice(-3);
    const candidate = attempt < 10 ? `GB2026-${randomPart}` : `GB2026-${timePart}${randomPart.toString().slice(-1)}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `GB2026-${Date.now().toString().slice(-6)}`;
}

function buildSeatNumbers(ticketId: string, adultCount: number): string[] {
  const base = Number.parseInt(ticketId.replace(/\D/g, '').slice(-4), 10) || 100;
  return Array.from({ length: adultCount }, (_, i) => `VIP-${base + i}`);
}

/**
 * Creates a brand-new public registration (status Pending). Uses a create-only
 * write so an accidental ticket-id collision cannot overwrite an existing card.
 */
export async function createHonorableGuestRegistration(
  ticket: Ticket,
  options?: { existingIds?: Iterable<string> }
): Promise<Ticket> {
  if (!db) {
    throw new Error('Firebase কনফিগার করা নেই। .env ফাইলে Firebase key যোগ করুন এবং সাইট রিস্টার্ট করুন।');
  }

  let nextTicket: Ticket = {
    ...ticket,
    status: 'Pending',
    kidCount: ticket.kidCount ?? 0,
    seatNumbers: ticket.seatNumbers?.length ? ticket.seatNumbers : buildSeatNumbers(ticket.ticketId, ticket.adultCount),
  };

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const ref = guestDocRef(nextTicket.ticketId);
    try {
      const existing = await getDoc(ref);
      if (existing.exists()) {
        const newId = generateUniqueTicketId(options?.existingIds);
        nextTicket = {
          ...nextTicket,
          ticketId: newId,
          seatNumbers: buildSeatNumbers(newId, nextTicket.adultCount),
        };
        continue;
      }

      await setDoc(ref, omitUndefined({ ...nextTicket }));
      return nextTicket;
    } catch (error) {
      console.error('[Guest storage] Registration create failed:', error);
      throw new Error(describeGuestSaveError(error));
    }
  }

  throw new Error('নতুন টিকিট আইডি তৈরি করা যায়নি — আবার চেষ্টা করুন।');
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
    // Firestore rejects `undefined` field values — omit optional empties instead.
    await setDoc(guestDocRef(ticket.ticketId), omitUndefined({ ...ticket }), { merge: true });
  } catch (error) {
    console.error('[Guest storage] Firestore save failed:', error);
    throw new Error(describeGuestSaveError(error));
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

export async function deleteHonorableGuest(ticketId: string): Promise<void> {
  if (!db) {
    throw new Error('Firebase কনফিগার করা নেই।');
  }
  try {
    await deleteDoc(guestDocRef(ticketId));
  } catch (error) {
    console.error('[Guest storage] Firestore delete failed:', error);
    throw new Error(describeGuestSaveError(error));
  }
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
