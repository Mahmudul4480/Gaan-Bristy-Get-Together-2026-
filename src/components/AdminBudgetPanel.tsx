import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ProgramLedgerEntry, ProgramLedgerKind, Ticket } from '../types';
import {
  addProgramLedgerEntry,
  computeProgramBudget,
  deleteProgramLedgerEntry,
  formatBdt,
  subscribeToProgramLedger,
} from '../utils/programLedgerStorage';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Loader2,
  PlusCircle,
  Trash2,
  Wallet,
} from 'lucide-react';

interface AdminBudgetPanelProps {
  tickets: Ticket[];
  actorName: string;
}

const EXPENSE_CATEGORIES = [
  'ভেন্যু',
  'খাবার',
  'সাজসজ্জা',
  'সাউন্ড',
  'যাতায়াত',
  'অন্যান্য',
] as const;

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' });
}

export default function AdminBudgetPanel({ tickets, actorName }: AdminBudgetPanelProps) {
  const [entries, setEntries] = useState<ProgramLedgerEntry[]>([]);
  const [kind, setKind] = useState<ProgramLedgerKind>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    return subscribeToProgramLedger(setEntries, (err) => setError(err.message));
  }, []);

  const summary = useMemo(() => computeProgramBudget(tickets, entries), [tickets, entries]);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setNote('');
    setCategory(EXPENSE_CATEGORIES[0]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const parsedAmount = Number(amount.replace(/,/g, '').trim());
    if (!title.trim()) {
      setError('শিরোনাম লিখুন');
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('সঠিক টাকার পরিমাণ দিন');
      return;
    }

    setBusy(true);
    try {
      await addProgramLedgerEntry({
        kind,
        title: title.trim(),
        amount: parsedAmount,
        note: note.trim() || undefined,
        category: kind === 'expense' ? category : undefined,
        createdBy: actorName,
      });
      setSuccess(kind === 'income' ? 'ম্যানুয়াল আয় যোগ হয়েছে' : 'খরচ যোগ হয়েছে');
      resetForm();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'সংরক্ষণ করা যায়নি');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (entry: ProgramLedgerEntry) => {
    setDeletingId(entry.id);
    setError('');
    try {
      await deleteProgramLedgerEntry(entry.id);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'মুছে ফেলা যায়নি');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5 font-body">
      <p className="text-xs text-[#B3A6C9] bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-xl p-3">
        শুধুমাত্র <span className="text-[#F0D78C] font-bold">Super Admin</span> এই হিসাব দেখতে
        পারবেন। রেজিস্ট্রেশন থেকে Approved পেমেন্ট অটো আয় হিসেবে যোগ হবে; পেন্ডিং আলাদা
        দেখানো হবে। উপরে সেটার বাইরে ম্যানুয়াল আয়/খরচ এন্ট্রি দিতে পারবেন।
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[#D4AF37]/35 bg-[#0F0C1A] p-4">
          <p className="text-[11px] uppercase tracking-wide text-[#B3A6C9] font-bold flex items-center gap-1.5">
            <ArrowUpCircle className="w-4 h-4 text-[#F0D78C]" />
            মোট আয়
          </p>
          <p className="mt-2 text-2xl font-black text-[#F0D78C]">{formatBdt(summary.totalIncome)}</p>
          <p className="mt-1 text-[10px] text-[#B3A6C9]">
            রেজি: {formatBdt(summary.registrationConfirmedIncome)} · ম্যানুয়াল:{' '}
            {formatBdt(summary.manualIncome)}
          </p>
        </div>
        <div className="rounded-2xl border border-[#A52C54]/35 bg-[#0F0C1A] p-4">
          <p className="text-[11px] uppercase tracking-wide text-[#B3A6C9] font-bold flex items-center gap-1.5">
            <ArrowDownCircle className="w-4 h-4 text-[#FFB4C4]" />
            মোট খরচ
          </p>
          <p className="mt-2 text-2xl font-black text-[#FFB4C4]">{formatBdt(summary.totalExpense)}</p>
          <p className="mt-1 text-[10px] text-[#B3A6C9]">ম্যানুয়াল খরচ এন্ট্রি</p>
        </div>
        <div className="rounded-2xl border border-[#D4AF37]/50 bg-[#7A1F3D]/25 p-4">
          <p className="text-[11px] uppercase tracking-wide text-[#B3A6C9] font-bold flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-[#D4AF37]" />
            ব্যালেন্স
          </p>
          <p
            className={`mt-2 text-2xl font-black ${
              summary.balance >= 0 ? 'text-[#F0D78C]' : 'text-[#FFB4C4]'
            }`}
          >
            {formatBdt(summary.balance)}
          </p>
          <p className="mt-1 text-[10px] text-[#B3A6C9]">আয় − খরচ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#D4AF37]/30 bg-[#0F0C1A] p-4">
          <p className="text-sm font-bold text-[#F0D78C] mb-3">অটো আয় — রেজিস্ট্রেশন</p>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center justify-between bg-[#1C1730] rounded-xl px-3 py-2">
              <span className="text-[#F6EFE0]">Approved ({summary.confirmedCount} জন)</span>
              <span className="font-bold text-[#F0D78C]">{formatBdt(summary.registrationConfirmedIncome)}</span>
            </li>
            <li className="flex items-center justify-between bg-[#1C1730] rounded-xl px-3 py-2">
              <span className="text-[#B3A6C9]">Pending ({summary.pendingCount} জন)</span>
              <span className="font-bold text-[#B3A6C9]">{formatBdt(summary.registrationPendingIncome)}</span>
            </li>
          </ul>
          <p className="text-[10px] text-[#B3A6C9] mt-3">
            Pending টাকা মোট আয়/ব্যালেন্সে যোগ হয় না — Super Admin অ্যাপ্রুভ করলে Approved-এ চলে
            যাবে।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-[#D4AF37]/35 bg-[#0F0C1A] p-4 space-y-3">
          <p className="text-sm font-bold text-[#F0D78C] flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            ম্যানুয়াল আয় / খরচ যোগ
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setKind('income')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border ${
                kind === 'income'
                  ? 'bg-[#7A1F3D] text-[#F0D78C] border-[#D4AF37]'
                  : 'bg-[#1C1730] text-[#B3A6C9] border-[#D4AF37]/30'
              }`}
            >
              আয়
            </button>
            <button
              type="button"
              onClick={() => setKind('expense')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border ${
                kind === 'expense'
                  ? 'bg-[#7A1F3D] text-[#F0D78C] border-[#D4AF37]'
                  : 'bg-[#1C1730] text-[#B3A6C9] border-[#D4AF37]/30'
              }`}
            >
              খরচ
            </button>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={kind === 'income' ? 'যেমন: Sponsor Donation' : 'যেমন: Venue Booking Advance'}
            className="w-full bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
          />

          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="numeric"
            placeholder="টাকার পরিমাণ"
            className="w-full bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] font-mono outline-none"
          />

          {kind === 'expense' && (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
            >
              {EXPENSE_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          )}

          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="নোট (ঐচ্ছিক)"
            className="w-full bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
          />

          {error && <p className="text-xs text-[#FFB4C4]">{error}</p>}
          {success && <p className="text-xs text-[#F0D78C]">{success}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
            {busy ? 'সংরক্ষণ হচ্ছে...' : 'এন্ট্রি যোগ করুন'}
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-[#D4AF37]/30 overflow-hidden">
        <div className="px-3 py-2 bg-[#0F0C1A] text-xs font-bold text-[#F0D78C]">
          ম্যানুয়াল এন্ট্রি ({entries.length})
        </div>
        {entries.length === 0 ? (
          <p className="text-center text-sm text-[#B3A6C9] py-8">এখনও কোনো ম্যানুয়াল এন্ট্রি নেই</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead className="bg-[#1C1730] text-[#B3A6C9] uppercase tracking-wide">
                <tr>
                  <th className="px-3 py-2">ধরন</th>
                  <th className="px-3 py-2">শিরোনাম</th>
                  <th className="px-3 py-2">পরিমাণ</th>
                  <th className="px-3 py-2">তারিখ</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-t border-[#D4AF37]/15 align-top">
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          entry.kind === 'income'
                            ? 'bg-[#7A1F3D] text-[#F0D78C]'
                            : 'bg-[#0F0C1A] text-[#FFB4C4] border border-[#A52C54]/40'
                        }`}
                      >
                        {entry.kind === 'income' ? 'আয়' : 'খরচ'}
                      </span>
                      {entry.category && (
                        <span className="block mt-1 text-[10px] text-[#B3A6C9]">{entry.category}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-[#F6EFE0] font-semibold">{entry.title}</p>
                      {entry.note && <p className="text-[10px] text-[#B3A6C9] mt-0.5">{entry.note}</p>}
                      <p className="text-[10px] text-[#B3A6C9] mt-0.5">{entry.createdBy}</p>
                    </td>
                    <td className="px-3 py-2 font-bold font-mono text-[#F0D78C]">
                      {formatBdt(entry.amount)}
                    </td>
                    <td className="px-3 py-2 text-[#B3A6C9]">{formatDateTime(entry.createdAt)}</td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        disabled={deletingId === entry.id}
                        onClick={() => handleDelete(entry)}
                        className="inline-flex items-center gap-1 text-[#A52C54] hover:text-[#F0D78C] cursor-pointer disabled:opacity-50"
                      >
                        {deletingId === entry.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        মুছুন
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
