import { Ticket } from '../types';

const STORAGE_KEY = 'gaan-bristy-honorable-guests-2026';

export function loadHonorableGuests(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Ticket[];
    return Array.isArray(parsed)
      ? parsed.map((g) => ({
          ...g,
          familyName: g.familyName || 'Gaan Bristy Family',
          kidCount: g.kidCount ?? 0,
        }))
      : [];
  } catch {
    return [];
  }
}

export function saveHonorableGuest(ticket: Ticket): Ticket[] {
  const guests = loadHonorableGuests();
  const existingIndex = guests.findIndex((g) => g.ticketId === ticket.ticketId);
  const updated =
    existingIndex >= 0
      ? guests.map((g, i) => (i === existingIndex ? ticket : g))
      : [ticket, ...guests];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getHonorableGuestById(ticketId: string): Ticket | undefined {
  return loadHonorableGuests().find((g) => g.ticketId === ticketId);
}

export function getGuestCardUrl(ticketId: string): string {
  const url = new URL(window.location.href);
  url.searchParams.set('guest', ticketId);
  url.hash = 'honorable-guests';
  return `${url.origin}${url.pathname}?guest=${encodeURIComponent(ticketId)}#honorable-guests`;
}
