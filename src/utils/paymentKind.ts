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

/**
 * Real bKash / Nagad / Rocket TrxIDs only.
 * Rejects notes and names: "shomaaaa", "Naz_apa_Guest", "Mahmud420".
 */
export function isRealTransactionId(transactionId?: string): boolean {
  const value = transactionId?.trim() ?? '';
  if (value.length < 8 || value.length > 14) return false;
  if (isPlaceholderTransactionId(value)) return false;
  if (!/^[A-Za-z0-9]+$/.test(value)) return false;
  if (/([A-Za-z])\1{3,}/.test(value)) return false;

  const digits = (value.match(/\d/g) || []).length;
  const letters = (value.match(/[A-Za-z]/g) || []).length;

  if (letters === 0 && digits >= 8) return true;
  if (letters >= 2 && digits >= 2) {
    if (/^[A-Za-z]{5,}\d{1,4}$/.test(value)) return false;
    return true;
  }
  return false;
}

export function visibleTransactionId(transactionId?: string): string | null {
  const value = transactionId?.trim() ?? '';
  if (!value || isPlaceholderTransactionId(value)) return null;
  return value;
}

export function getPaymentKind(ticket: Pick<Ticket, 'paymentKind' | 'transactionId'>): PaymentKind {
  const trx = ticket.transactionId?.trim() ?? '';
  const idUpper = trx.toUpperCase();

  if (
    ticket.paymentKind === 'complimentary' ||
    idUpper === HONORARY_TRX_PLACEHOLDER ||
    idUpper.startsWith('HONORARY')
  ) {
    return 'complimentary';
  }

  if (isRealTransactionId(trx)) return 'paid';
  return 'due';
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

/** Tag a card as due — QR stays, amount is outstanding. Real TrxIDs are not cleared here. */
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
