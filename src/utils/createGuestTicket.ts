import { Ticket } from '../types';
import { EVENT_DETAILS } from '../data/eventData';

export function generateTicketId(): string {
  return `GB2026-${Math.floor(1000 + Math.random() * 9000)}`;
}

export interface GuestTicketInput {
  fullName: string;
  familyName: string;
  starMakerId?: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  adultCount: number;
  paymentMethod: Ticket['paymentMethod'];
  transactionId: string;
  songRequest?: string;
  createdByAdmin?: boolean;
}

export function buildGuestTicket(input: GuestTicketInput): Ticket {
  const randomCode = parseInt(input.fullName.length.toString() + Date.now().toString().slice(-4), 10) % 9000 + 1000;
  const ticketId = generateTicketId();
  const totalAmount = input.adultCount * EVENT_DETAILS.feeAdult;

  return {
    ticketId,
    fullName: input.fullName.trim(),
    familyName: input.familyName.trim(),
    starMakerId: input.starMakerId?.trim() || undefined,
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    photoUrl: input.photoUrl,
    adultCount: input.adultCount,
    kidCount: 0,
    totalAmount,
    paymentMethod: input.paymentMethod,
    transactionId: input.transactionId.trim(),
    status: 'Confirmed',
    issueDate: new Date().toISOString(),
    seatNumbers: Array.from({ length: input.adultCount }, (_, i) => `VIP-${100 + randomCode + i}`),
    songRequest: input.songRequest?.trim() || undefined,
    createdByAdmin: input.createdByAdmin ?? false,
  };
}
