import { Ticket } from '../types';

/** Every confirmed card counts as invited, even if paymentKind is due/complimentary. */
export function invitedGuests(guests: Ticket[]): Ticket[] {
  return guests.filter((g) => g.status === 'Confirmed');
}

export function checkedInGuests(guests: Ticket[]): Ticket[] {
  return guests.filter((g) => Boolean(g.checkedInAt));
}

/** Headcount, not card count — a family card with 4 adults counts as 4. */
export function headcount(guests: Ticket[]): number {
  return guests.reduce((sum, g) => sum + Math.max(1, g.adultCount || 1), 0);
}

export function sortByCheckInTimeDesc(guests: Ticket[]): Ticket[] {
  return [...guests].sort((a, b) => (b.checkedInAt || '').localeCompare(a.checkedInAt || ''));
}

export function formatCheckInTime(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' });
}
