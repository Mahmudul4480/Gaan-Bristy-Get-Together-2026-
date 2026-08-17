import { getGuestCardUrl } from './guestStorage';

function toWhatsAppPhone(rawPhone: string): string | null {
  const digits = rawPhone.replace(/\D/g, '');
  if (/^01\d{9}$/.test(digits)) return `88${digits}`;
  if (/^8801\d{9}$/.test(digits)) return digits;
  return null;
}

export function getGuestCardWhatsAppUrl(phone: string, ticketId: string, guestName: string): string | null {
  const waPhone = toWhatsAppPhone(phone);
  if (!waPhone) return null;

  const cardUrl = getGuestCardUrl(ticketId);
  const text = [
    'Gaan Bristy Grand Get-Together 2026',
    `${guestName}, আপনার Honorable Guest Card প্রস্তুত।`,
    cardUrl,
  ].join('\n');

  return `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`;
}
