import { Ticket } from '../types';
import { getGuestCardUrl } from './guestStorage';

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadGuestsCsv(guests: Ticket[]): void {
  const headers = [
    'Ticket ID',
    'Full Name',
    'Family Name',
    'StarMaker ID',
    'Phone',
    'Email',
    'Transaction ID',
    'Payment Method',
    'Adult Count',
    'Total Amount',
    'Issue Date',
    'Created By Admin',
    'Card URL',
  ];

  const rows = guests.map((g) =>
    [
      g.ticketId,
      g.fullName,
      g.familyName,
      g.starMakerId ?? '',
      g.phone,
      g.email ?? '',
      g.transactionId,
      g.paymentMethod,
      String(g.adultCount),
      String(g.totalAmount),
      g.issueDate,
      g.createdByAdmin ? 'Yes' : 'No',
      getGuestCardUrl(g.ticketId),
    ]
      .map(escapeCsv)
      .join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `Gaan_Bristy_Honorable_Guests_${dateStamp()}.csv`);
}

export function downloadGuestsJson(guests: Ticket[]): void {
  const exportData = guests.map((g) => ({
    ...g,
    cardUrl: getGuestCardUrl(g.ticketId),
  }));
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  triggerDownload(blob, `Gaan_Bristy_Honorable_Guests_${dateStamp()}.json`);
}

function dateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function findDuplicateTransactionId(guests: Ticket[], transactionId: string, excludeTicketId?: string): Ticket | undefined {
  const normalized = transactionId.trim().toLowerCase();
  return guests.find(
    (g) =>
      g.transactionId.trim().toLowerCase() === normalized &&
      g.ticketId !== excludeTicketId
  );
}
