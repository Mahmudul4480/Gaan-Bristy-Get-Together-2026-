import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { ProgramLedgerEntry, ProgramLedgerKind, Ticket } from '../types';
import { db } from '../config/firebase';

const LEDGER_COLLECTION = 'programLedger';

function ledgerCol() {
  if (!db) throw new Error('Firebase চালু নেই');
  return collection(db, LEDGER_COLLECTION);
}

export function subscribeToProgramLedger(
  onChange: (entries: ProgramLedgerEntry[]) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db) {
    onChange([]);
    return () => {};
  }

  const ledgerQuery = query(ledgerCol(), orderBy('createdAt', 'desc'));
  return onSnapshot(
    ledgerQuery,
    (snapshot) => {
      const entries = snapshot.docs.map((snap) => ({
        id: snap.id,
        ...(snap.data() as Omit<ProgramLedgerEntry, 'id'>),
      }));
      onChange(entries);
    },
    (error) => {
      console.error('[Program ledger] subscription failed:', error);
      onError?.(error as Error);
    }
  );
}

export async function addProgramLedgerEntry(input: {
  kind: ProgramLedgerKind;
  title: string;
  amount: number;
  note?: string;
  category?: string;
  createdBy: string;
}): Promise<void> {
  if (!db) throw new Error('Firebase কনফিগার করা নেই।');

  const title = input.title.trim();
  if (!title) throw new Error('শিরোনাম লিখুন');
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error('সঠিক পরিমাণ (amount) দিন');
  }

  await addDoc(ledgerCol(), {
    kind: input.kind,
    title,
    amount: Math.round(input.amount),
    note: input.note?.trim() || undefined,
    category: input.category?.trim() || undefined,
    createdBy: input.createdBy.trim() || 'Admin',
    createdAt: new Date().toISOString(),
  });
}

export async function deleteProgramLedgerEntry(entryId: string): Promise<void> {
  if (!db) throw new Error('Firebase কনফিগার করা নেই।');
  await deleteDoc(doc(db, LEDGER_COLLECTION, entryId));
}

export function sumTicketAmounts(tickets: Ticket[]): number {
  return tickets.reduce((total, ticket) => total + (ticket.totalAmount || 0), 0);
}

export function formatBdt(amount: number): string {
  return `${amount.toLocaleString('en-BD')}/-`;
}

export interface ProgramBudgetSummary {
  registrationConfirmedIncome: number;
  registrationPendingIncome: number;
  manualIncome: number;
  manualExpense: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  confirmedCount: number;
  pendingCount: number;
}

export function computeProgramBudget(
  tickets: Ticket[],
  manualEntries: ProgramLedgerEntry[]
): ProgramBudgetSummary {
  const confirmed = tickets.filter((ticket) => ticket.status === 'Confirmed');
  const pending = tickets.filter((ticket) => ticket.status === 'Pending');

  const registrationConfirmedIncome = sumTicketAmounts(confirmed);
  const registrationPendingIncome = sumTicketAmounts(pending);
  const manualIncome = manualEntries
    .filter((entry) => entry.kind === 'income')
    .reduce((total, entry) => total + entry.amount, 0);
  const manualExpense = manualEntries
    .filter((entry) => entry.kind === 'expense')
    .reduce((total, entry) => total + entry.amount, 0);

  const totalIncome = registrationConfirmedIncome + manualIncome;
  const totalExpense = manualExpense;

  return {
    registrationConfirmedIncome,
    registrationPendingIncome,
    manualIncome,
    manualExpense,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    confirmedCount: confirmed.length,
    pendingCount: pending.length,
  };
}
