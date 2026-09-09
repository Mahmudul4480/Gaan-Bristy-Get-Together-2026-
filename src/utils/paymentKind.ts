import { Ticket } from '../types';

export type PaymentKind = 'paid' | 'due' | 'complimentary';

export const HONORARY_TRX_PLACEHOLDER = 'HONORARY';
export const DUE_TRX_PLACEHOLDER = 'DUE';

const PLACEHOLDER_TRX_IDS = new Set([
  HONORARY_TRX_PLACEHOLDER.toLowerCase(),
  DUE_TRX_PLACEHOLDER.toLowerCase(),
  'complimentary',
  'n/a',
  'na',
  'none',
]);

export function isPlaceholderTransactionId(transactionId?: string): boolean {
  const value = transactionId?.trim().toLowerCase() ?? '';
  if (!value) return true;
  if (PLACEHOLDER_TRX_IDS.has(value)) return true;
  if (value.startsWith('honorary')) return true;
  if (value === 'due' || value.startsWith('due-') || value.startsWith('due_')) return true;
  return false;
}

export function isRealTransactionId(transactionId?: string): boolean {
  const value = transactionId?.trim() ?? '';
  if (value.length < 4) return false;
  return !isPlaceholderTransactionId(value);
}

export function getPaymentKind(ticket: Pick<Ticket, 'paymentKind' | 'transactionId'>): PaymentKind {
  if (ticket.paymentKind === 'due' || ticket.paymentKind === 'complimentary' || ticket.paymentKind === 'paid') {
    return ticket.paymentKind;
  }
  if (!isRealTransactionId(ticket.transactionId)) {
    const id = ticket.transactionId.trim().toUpperCase();
    if (id === HONORARY_TRX_PLACEHOLDER) return 'complimentary';
    if (id === DUE_TRX_PLACEHOLDER) return 'due';
  }
  return 'paid';
}

export function hasCollectedPayment(ticket: Ticket): boolean {
  return ticket.status === 'Confirmed' && getPaymentKind(ticket) === 'paid' && isRealTransactionId(ticket.transactionId);
}

export function paymentKindLabel(kind: PaymentKind): string {
  if (kind === 'complimentary') return 'সম্মানী';
  if (kind === 'due') return 'ডিউ';
  return 'পেইড';
}

export function placeholderTransactionId(kind: PaymentKind): string {
  if (kind === 'complimentary') return HONORARY_TRX_PLACEHOLDER;
  if (kind === 'due') return DUE_TRX_PLACEHOLDER;
  return '';
}

/** Tag an existing card as due — QR stays, amount is outstanding, collected income does not include it. */
export function applyDueTag(ticket: Ticket, feeAdult: number): Ticket {
  const adultCount = Math.max(1, ticket.adultCount || 1);
  const dueAmount = adultCount * feeAdult;
  return {
    ...ticket,
    paymentKind: 'due',
    adultCount,
    totalAmount: dueAmount > 0 ? dueAmount : ticket.totalAmount || 0,
    transactionId: isRealTransactionId(ticket.transactionId)
      ? ticket.transactionId.trim()
      : DUE_TRX_PLACEHOLDER,
    status: ticket.status === 'Rejected' ? ticket.status : 'Confirmed',
  };
}
