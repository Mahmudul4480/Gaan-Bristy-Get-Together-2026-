import { Ticket } from '../types';
import { deleteGuestPhoto, persistGuestPhoto, readGuestPhoto } from './guestPhotoStorage';

export const GUEST_STORAGE_KEY = 'gaan-bristy-honorable-guests-2026';
export const GUEST_UPDATED_EVENT = 'gb-guests-updated';

type StoredTicket = Ticket & { hasPhoto?: boolean };

function isQuotaError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === 'QuotaExceededError' || error.code === 22)
  );
}

function normalizeGuest(g: Ticket): StoredTicket {
  return {
    ...g,
    familyName: g.familyName || 'Gaan Bristy Family',
    kidCount: g.kidCount ?? 0,
  };
}

function stripPhotoForStorage(ticket: Ticket): StoredTicket {
  if (ticket.photoUrl) {
    const { photoUrl: _removed, ...rest } = ticket;
    return { ...rest, hasPhoto: true };
  }
  return ticket;
}

function notifyGuestUpdate(guests: Ticket[]) {
  window.dispatchEvent(new CustomEvent(GUEST_UPDATED_EVENT, { detail: guests }));
}

export function loadHonorableGuests(): Ticket[] {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Ticket[];
    return Array.isArray(parsed) ? parsed.map(normalizeGuest) : [];
  } catch {
    return [];
  }
}

export async function hydrateGuestPhotos(guests: Ticket[]): Promise<Ticket[]> {
  return Promise.all(
    guests.map(async (guest) => {
      if (guest.photoUrl) return guest;
      if (guest.hasPhoto) {
        const photo = await readGuestPhoto(guest.ticketId);
        return photo ? { ...guest, photoUrl: photo } : guest;
      }
      return guest;
    })
  );
}

export async function loadHonorableGuestsWithPhotos(): Promise<Ticket[]> {
  return hydrateGuestPhotos(loadHonorableGuests());
}

export async function saveHonorableGuest(ticket: Ticket): Promise<Ticket[]> {
  const photoUrl = ticket.photoUrl;

  if (photoUrl) {
    try {
      await persistGuestPhoto(ticket.ticketId, photoUrl);
    } catch (error) {
      console.warn('[Guest storage] Photo save failed:', error);
    }
  } else if (!ticket.hasPhoto) {
    await deleteGuestPhoto(ticket.ticketId);
  }

  const guests = loadHonorableGuests();
  const storedTicket = stripPhotoForStorage(ticket);
  const existingIndex = guests.findIndex((g) => g.ticketId === ticket.ticketId);

  const updatedStored: StoredTicket[] =
    existingIndex >= 0
      ? guests.map((g, i) => (i === existingIndex ? storedTicket : stripPhotoForStorage(g)))
      : [storedTicket, ...guests.map(stripPhotoForStorage)];

  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updatedStored));
  } catch (error) {
    if (isQuotaError(error)) {
      throw new Error('ব্রাউজার স্টোরেজ পূর্ণ — Admin থেকে পুরনো card export করে পরিষ্কার করুন');
    }
    throw new Error('Guest card সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।');
  }

  const updated = await hydrateGuestPhotos(
    existingIndex >= 0
      ? guests.map((g, i) => (i === existingIndex ? ticket : g))
      : [ticket, ...guests]
  );

  notifyGuestUpdate(updated);
  return updated;
}

export async function getHonorableGuestById(ticketId: string): Promise<Ticket | undefined> {
  const guest = loadHonorableGuests().find((g) => g.ticketId === ticketId);
  if (!guest) return undefined;
  const [hydrated] = await hydrateGuestPhotos([guest]);
  return hydrated;
}

export function getGuestCardUrl(ticketId: string): string {
  const url = new URL(window.location.href);
  url.searchParams.set('guest', ticketId);
  url.hash = 'honorable-guests';
  return `${url.origin}${url.pathname}?guest=${encodeURIComponent(ticketId)}#honorable-guests`;
}
