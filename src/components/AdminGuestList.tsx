import { useEffect, useMemo, useState } from 'react';
import { AdminRole, CardDeleteRequest, Ticket } from '../types';
import { downloadGuestsCsv, downloadGuestsJson } from '../utils/guestExport';
import { getGuestCardUrl, saveHonorableGuest } from '../utils/guestStorage';
import { sendRegistrationConfirmationSms } from '../utils/sendConfirmationSms';
import { getGuestCardWhatsAppUrl } from '../utils/whatsappShare';
import {
  approveDeleteRequest,
  deleteCardAsSuperAdmin,
  rejectDeleteRequest,
  requestCardDelete,
  subscribeToDeleteRequests,
} from '../utils/deleteRequestStorage';
import HonorableGuestCard from './HonorableGuestCard';
import {
  FileSpreadsheet,
  FileJson,
  Search,
  Eye,
  X,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Loader2,
  AlertTriangle,
  Trash2,
  Send,
  ShieldAlert,
  ShieldCheck,
  ScrollText,
} from 'lucide-react';

interface AdminGuestListProps {
  guests: Ticket[];
  adminRole: AdminRole;
  actorName: string;
}

type StatusFilter = 'all' | 'Pending' | 'Confirmed' | 'Rejected';
type RowActionState = 'idle' | 'saving' | 'sms-sending' | 'sms-sent' | 'sms-failed';

interface VerificationLogEntry {
  ticketId: string;
  guestName: string;
  action: 'approved' | 'rejected';
  by: string;
  at: string;
}

const STATUS_LABEL: Record<Ticket['status'], string> = {
  Pending: 'Pending',
  Confirmed: 'Approved',
  Rejected: 'Rejected',
};

function statusRank(status: Ticket['status']): number {
  if (status === 'Pending') return 0;
  if (status === 'Confirmed') return 1;
  return 2;
}

function formatLogTime(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('bn-BD', { dateStyle: 'short', timeStyle: 'short' });
}

export default function AdminGuestList({ guests, adminRole, actorName }: AdminGuestListProps) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [previewTicket, setPreviewTicket] = useState<Ticket | null>(null);
  const [rowState, setRowState] = useState<Record<string, RowActionState>>({});
  const [rowError, setRowError] = useState<Record<string, string>>({});
  const [deleteRequests, setDeleteRequests] = useState<CardDeleteRequest[]>([]);
  const [showAllLog, setShowAllLog] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [requestBusyId, setRequestBusyId] = useState<string | null>(null);

  const isSuperAdmin = adminRole === 'Super Admin';

  useEffect(() => {
    return subscribeToDeleteRequests(setDeleteRequests);
  }, []);

  const pendingCount = guests.filter((g) => g.status === 'Pending').length;
  const pendingDeleteRequests = deleteRequests.filter((r) => r.status === 'Pending');
  const pendingDeleteByTicket = useMemo(() => {
    const map = new Map<string, CardDeleteRequest>();
    pendingDeleteRequests.forEach((r) => {
      if (!map.has(r.ticketId)) map.set(r.ticketId, r);
    });
    return map;
  }, [pendingDeleteRequests]);

  const verificationLog = useMemo<VerificationLogEntry[]>(() => {
    const entries: VerificationLogEntry[] = [];
    guests.forEach((g) => {
      if (g.status === 'Confirmed' && (g.approvedAt || g.approvedBy)) {
        entries.push({
          ticketId: g.ticketId,
          guestName: g.fullName,
          action: 'approved',
          by: g.approvedBy || 'অজানা',
          at: g.approvedAt || '',
        });
      } else if (g.status === 'Rejected' && (g.rejectedAt || g.rejectedBy)) {
        entries.push({
          ticketId: g.ticketId,
          guestName: g.fullName,
          action: 'rejected',
          by: g.rejectedBy || 'অজানা',
          at: g.rejectedAt || '',
        });
      }
    });
    return entries.sort((a, b) => b.at.localeCompare(a.at));
  }, [guests]);

  const visibleLog = showAllLog ? verificationLog : verificationLog.slice(0, 5);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return guests
      .filter((g) => (statusFilter === 'all' ? true : g.status === statusFilter))
      .filter((g) => {
        if (!q) return true;
        return (
          g.ticketId.toLowerCase().includes(q) ||
          g.fullName.toLowerCase().includes(q) ||
          g.familyName.toLowerCase().includes(q) ||
          g.phone.includes(q) ||
          g.transactionId.toLowerCase().includes(q) ||
          (g.starMakerId && g.starMakerId.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => statusRank(a.status) - statusRank(b.status));
  }, [guests, query, statusFilter]);

  const setStateFor = (ticketId: string, state: RowActionState, error?: string) => {
    setRowState((prev) => ({ ...prev, [ticketId]: state }));
    setRowError((prev) => {
      const next = { ...prev };
      if (error) next[ticketId] = error;
      else delete next[ticketId];
      return next;
    });
  };

  const handleApprove = async (guest: Ticket) => {
    if (!isSuperAdmin) return;
    setStateFor(guest.ticketId, 'saving');
    const approved: Ticket = {
      ...guest,
      status: 'Confirmed',
      approvedBy: actorName,
      approvedAt: new Date().toISOString(),
    };
    try {
      await saveHonorableGuest(approved);
      setStateFor(guest.ticketId, 'sms-sending');
      const sms = await sendRegistrationConfirmationSms(guest.phone, {
        type: 'approved',
        cardUrl: getGuestCardUrl(guest.ticketId),
      });
      if (sms.success) {
        setStateFor(guest.ticketId, 'sms-sent');
      } else {
        setStateFor(guest.ticketId, 'sms-failed', sms.error || 'SMS পাঠানো যায়নি');
      }
    } catch (error) {
      setStateFor(
        guest.ticketId,
        'idle',
        error instanceof Error ? error.message : 'অ্যাপ্রুভ করা যায়নি'
      );
    }
  };

  const handleReject = async (guest: Ticket) => {
    if (!isSuperAdmin) return;
    setStateFor(guest.ticketId, 'saving');
    try {
      await saveHonorableGuest({
        ...guest,
        status: 'Rejected',
        rejectedBy: actorName,
        rejectedAt: new Date().toISOString(),
      });
      setStateFor(guest.ticketId, 'idle');
    } catch (error) {
      setStateFor(
        guest.ticketId,
        'idle',
        error instanceof Error ? error.message : 'রিজেক্ট করা যায়নি'
      );
    }
  };

  const handleDeleteCard = async (guest: Ticket) => {
    setRequestBusyId(guest.ticketId);
    try {
      await deleteCardAsSuperAdmin(guest.ticketId, deleteRequests);
      setConfirmDeleteId(null);
    } catch (error) {
      setStateFor(
        guest.ticketId,
        'idle',
        error instanceof Error ? error.message : 'ডিলিট করা যায়নি'
      );
    } finally {
      setRequestBusyId(null);
    }
  };

  const handleRequestDelete = async (guest: Ticket) => {
    if (pendingDeleteByTicket.has(guest.ticketId)) return;
    setRequestBusyId(guest.ticketId);
    try {
      await requestCardDelete(guest, actorName);
    } catch (error) {
      setStateFor(
        guest.ticketId,
        'idle',
        error instanceof Error ? error.message : 'ডিলিট রিকোয়েস্ট পাঠানো যায়নি'
      );
    } finally {
      setRequestBusyId(null);
    }
  };

  const handleApproveDeleteRequest = async (request: CardDeleteRequest) => {
    setRequestBusyId(request.id);
    try {
      await approveDeleteRequest(request);
    } catch (error) {
      setStateFor(
        request.ticketId,
        'idle',
        error instanceof Error ? error.message : 'অ্যাপ্রুভ করা যায়নি'
      );
    } finally {
      setRequestBusyId(null);
    }
  };

  const handleRejectDeleteRequest = async (request: CardDeleteRequest) => {
    setRequestBusyId(request.id);
    try {
      await rejectDeleteRequest(request.id);
    } catch (error) {
      setStateFor(
        request.ticketId,
        'idle',
        error instanceof Error ? error.message : 'রিজেক্ট করা যায়নি'
      );
    } finally {
      setRequestBusyId(null);
    }
  };

  return (
    <div className="space-y-4 font-body">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <p className="text-sm text-[#B3A6C9]">
          মোট <span className="text-[#F0D78C] font-bold">{guests.length}</span> টি রেজিস্ট্রেশন
          {pendingCount > 0 && (
            <>
              {' '}
              · <span className="text-[#F0D78C] font-bold">{pendingCount}</span> টি Pending Approval
            </>
          )}
          {pendingDeleteRequests.length > 0 && (
            <>
              {' '}
              · <span className="text-[#F0D78C] font-bold">{pendingDeleteRequests.length}</span> টি Delete Request
            </>
          )}
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={guests.length === 0}
            onClick={() => downloadGuestsCsv(guests)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#7A1F3D] border border-[#D4AF37]/50 text-[#F0D78C] text-xs font-bold cursor-pointer disabled:opacity-40"
          >
            <FileSpreadsheet className="w-4 h-4" />
            সব List CSV ডাউনলোড
          </button>
          <button
            type="button"
            disabled={guests.length === 0}
            onClick={() => downloadGuestsJson(guests)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1C1730] border border-[#D4AF37]/50 text-[#F6EFE0] text-xs font-bold cursor-pointer disabled:opacity-40"
          >
            <FileJson className="w-4 h-4 text-[#D4AF37]" />
            সব List JSON ডাউনলোড
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F0C1A] border border-[#D4AF37]/40 text-[#F0D78C] font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          লগইন: {actorName} ({adminRole})
        </span>
        {!isSuperAdmin && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#7A1F3D]/40 border border-[#A52C54]/50 text-[#F6EFE0] font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37]" />
            পেমেন্ট ভেরিফিকেশন (অ্যাপ্রুভ/রিজেক্ট) শুধুমাত্র Super Admin করতে পারবেন
          </span>
        )}
      </div>

      <div className="bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-2xl p-4">
        <p className="text-sm font-bold text-[#F0D78C] flex items-center gap-2">
          <ScrollText className="w-4 h-4" />
          পেমেন্ট ভেরিফিকেশন লগ — কে অ্যাপ্রুভ/রিজেক্ট করেছে
        </p>
        {verificationLog.length === 0 ? (
          <p className="text-xs text-[#B3A6C9] mt-2">এখনও কোনো ভেরিফিকেশন হয়নি।</p>
        ) : (
          <>
            <ul className="mt-3 space-y-1.5">
              {visibleLog.map((entry) => (
                <li
                  key={`${entry.ticketId}-${entry.action}`}
                  className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs bg-[#1C1730] border border-[#D4AF37]/20 rounded-xl px-3 py-2"
                >
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      entry.action === 'approved'
                        ? 'bg-[#7A1F3D] text-[#F0D78C]'
                        : 'bg-[#0F0C1A] text-[#B3A6C9] border border-[#A52C54]/40'
                    }`}
                  >
                    {entry.action === 'approved' ? 'Approved' : 'Rejected'}
                  </span>
                  <span className="text-[#F6EFE0] font-semibold">{entry.guestName}</span>
                  <span className="font-mono text-[#F0D78C]">{entry.ticketId}</span>
                  <span className="text-[#B3A6C9]">
                    — {entry.by}
                    {formatLogTime(entry.at) ? ` · ${formatLogTime(entry.at)}` : ''}
                  </span>
                </li>
              ))}
            </ul>
            {verificationLog.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllLog((prev) => !prev)}
                className="mt-2 text-xs text-[#F0D78C] underline underline-offset-2 font-semibold cursor-pointer"
              >
                {showAllLog ? 'কম দেখুন' : `সব ${verificationLog.length} টি লগ দেখুন`}
              </button>
            )}
          </>
        )}
      </div>

      {isSuperAdmin && pendingDeleteRequests.length > 0 && (
        <div className="bg-[#0F0C1A] border border-[#A52C54]/50 rounded-2xl p-4 space-y-3">
          <p className="text-sm font-bold text-[#F0D78C]">ডিলিট রিকোয়েস্ট — Super Admin অ্যাপ্রুভ করুন</p>
          {pendingDeleteRequests.map((req) => (
            <div key={req.id} className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between bg-[#1C1730] border border-[#D4AF37]/25 rounded-xl px-3 py-2">
              <div className="text-xs">
                <p className="text-[#F6EFE0] font-semibold">{req.guestName} <span className="font-mono text-[#F0D78C]">({req.ticketId})</span></p>
                <p className="text-[#B3A6C9]">রিকোয়েস্ট: {req.requestedBy} · {new Date(req.createdAt).toLocaleString('bn-BD')}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={requestBusyId === req.id}
                  onClick={() => handleApproveDeleteRequest(req)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#7A1F3D] border border-[#D4AF37]/50 text-[#F0D78C] text-[11px] font-bold cursor-pointer disabled:opacity-50"
                >
                  {requestBusyId === req.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  অ্যাপ্রুভ ও ডিলিট
                </button>
                <button
                  type="button"
                  disabled={requestBusyId === req.id}
                  onClick={() => handleRejectDeleteRequest(req)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0F0C1A] border border-[#A52C54]/50 text-[#F6EFE0] text-[11px] font-bold cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  রিজেক্ট
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {([
          { id: 'all', label: 'সব' },
          { id: 'Pending', label: 'Pending' },
          { id: 'Confirmed', label: 'Approved' },
          { id: 'Rejected', label: 'Rejected' },
        ] as const).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setStatusFilter(item.id)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold cursor-pointer border ${
              statusFilter === item.id
                ? 'bg-[#7A1F3D] text-[#F0D78C] border-[#D4AF37]'
                : 'bg-[#0F0C1A] text-[#B3A6C9] border-[#D4AF37]/30'
            }`}
          >
            {item.label}
            {item.id === 'Pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-[#B3A6C9]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="নাম, TrxID, ফোন, Ticket ID দিয়ে খুঁজুন..."
          className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F6EFE0] outline-none"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[#B3A6C9] py-8">কোনো card পাওয়া যায়নি</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#D4AF37]/30">
          <table className="w-full text-left text-xs min-w-[980px]">
            <thead className="bg-[#0F0C1A] text-[#B3A6C9] uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2">Ticket ID</th>
                <th className="px-3 py-2">নাম</th>
                <th className="px-3 py-2">TrxID</th>
                <th className="px-3 py-2">পেমেন্ট</th>
                <th className="px-3 py-2">ফোন</th>
                <th className="px-3 py-2">স্ট্যাটাস</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => {
                const action = rowState[g.ticketId] || 'idle';
                const busy = action === 'saving' || action === 'sms-sending';
                const whatsappUrl = g.status === 'Confirmed' ? getGuestCardWhatsAppUrl(g.phone, g.ticketId, g.fullName) : null;

                return (
                  <tr key={g.ticketId} className="border-t border-[#D4AF37]/15 hover:bg-[#0F0C1A]/50 align-top">
                    <td className="px-3 py-2 font-mono text-[#F0D78C]">{g.ticketId}</td>
                    <td className="px-3 py-2">
                      <p className="text-[#F6EFE0] font-semibold">{g.fullName}</p>
                      <p className="text-[10px] text-[#B3A6C9]">{g.familyName}</p>
                    </td>
                    <td className="px-3 py-2 font-mono text-[#F6EFE0]">{g.transactionId}</td>
                    <td className="px-3 py-2 text-[#B3A6C9]">
                      {g.paymentMethod}
                      <span className="block text-[#F0D78C] font-bold">{g.totalAmount}/-</span>
                    </td>
                    <td className="px-3 py-2 font-mono">{g.phone}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          g.status === 'Pending'
                            ? 'bg-[#7A1F3D] text-[#F0D78C]'
                            : g.status === 'Confirmed'
                              ? 'bg-[#1C1730] text-[#F0D78C] border border-[#D4AF37]/50'
                              : 'bg-[#0F0C1A] text-[#B3A6C9] border border-[#A52C54]/40'
                        }`}
                      >
                        {STATUS_LABEL[g.status]}
                      </span>
                      {g.createdByAdmin && (
                        <span className="block mt-1 text-[9px] text-[#B3A6C9]">
                          Admin{g.createdBy ? ` · ${g.createdBy}` : ''}
                        </span>
                      )}
                      {g.status === 'Confirmed' && (
                        <span className="block mt-1 text-[9px] leading-tight text-[#B3A6C9]">
                          {g.approvedBy ? (
                            <>
                              ভেরিফাই: <span className="text-[#F0D78C] font-bold">{g.approvedBy}</span>
                              {formatLogTime(g.approvedAt) && (
                                <span className="block">{formatLogTime(g.approvedAt)}</span>
                              )}
                            </>
                          ) : (
                            'ভেরিফাই লগ নেই (পুরনো এন্ট্রি)'
                          )}
                        </span>
                      )}
                      {g.status === 'Rejected' && g.rejectedBy && (
                        <span className="block mt-1 text-[9px] leading-tight text-[#B3A6C9]">
                          রিজেক্ট: <span className="text-[#F0D78C] font-bold">{g.rejectedBy}</span>
                          {formatLogTime(g.rejectedAt) && (
                            <span className="block">{formatLogTime(g.rejectedAt)}</span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1.5">
                        {g.status === 'Pending' &&
                          (isSuperAdmin ? (
                            <>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleApprove(g)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#7A1F3D] border border-[#D4AF37]/50 text-[#F0D78C] font-bold cursor-pointer disabled:opacity-50"
                              >
                                {action === 'saving' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                                অ্যাপ্রুভ
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleReject(g)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0F0C1A] border border-[#A52C54]/50 text-[#F6EFE0] font-bold cursor-pointer disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                রিজেক্ট
                              </button>
                            </>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0F0C1A] border border-[#D4AF37]/30 text-[10px] text-[#B3A6C9] font-semibold">
                              <ShieldAlert className="w-3.5 h-3.5 text-[#D4AF37]" />
                              Super Admin ভেরিফাই করবেন
                            </span>
                          ))}
                        {g.status === 'Confirmed' && (
                          <>
                            <button
                              type="button"
                              onClick={() => setPreviewTicket(g)}
                              className="inline-flex items-center gap-1 text-[#D4AF37] hover:text-[#F0D78C] font-bold cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Card
                            </button>
                            {whatsappUrl && (
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#128C7E] text-white font-bold"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                WhatsApp
                              </a>
                            )}
                          </>
                        )}
                        {isSuperAdmin ? (
                          confirmDeleteId === g.ticketId ? (
                            <span className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                disabled={requestBusyId === g.ticketId}
                                onClick={() => handleDeleteCard(g)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#A52C54] text-[#F6EFE0] font-bold cursor-pointer disabled:opacity-50"
                              >
                                {requestBusyId === g.ticketId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                নিশ্চিত
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 text-[#B3A6C9] font-bold cursor-pointer"
                              >
                                না
                              </button>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(g.ticketId)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0F0C1A] border border-[#A52C54]/50 text-[#F6EFE0] font-bold cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              ডিলিট
                            </button>
                          )
                        ) : pendingDeleteByTicket.has(g.ticketId) ? (
                          <span className="text-[10px] text-[#F0D78C] font-bold">ডিলিট রিকোয়েস্ট পেন্ডিং</span>
                        ) : (
                          <button
                            type="button"
                            disabled={requestBusyId === g.ticketId}
                            onClick={() => handleRequestDelete(g)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0F0C1A] border border-[#D4AF37]/40 text-[#F0D78C] font-bold cursor-pointer disabled:opacity-50"
                          >
                            {requestBusyId === g.ticketId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            ডিলিট রিকোয়েস্ট
                          </button>
                        )}
                      </div>
                      {action === 'sms-sending' && (
                        <p className="mt-1 text-[10px] text-[#B3A6C9] flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          কার্ড লিংক SMS পাঠানো হচ্ছে...
                        </p>
                      )}
                      {action === 'sms-sent' && (
                        <p className="mt-1 text-[10px] text-[#F0D78C]">SMS-এ কার্ড লিংক পাঠানো হয়েছে</p>
                      )}
                      {(action === 'sms-failed' || rowError[g.ticketId]) && (
                        <p className="mt-1 text-[10px] text-[#F6EFE0] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-[#F0D78C]" />
                          {rowError[g.ticketId] || 'SMS যায়নি — WhatsApp থেকে পাঠান'}
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {previewTicket && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0F0C1A]/95 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8">
            <button
              type="button"
              onClick={() => setPreviewTicket(null)}
              className="absolute -top-2 -right-2 z-10 p-2 rounded-full bg-[#1C1730] border border-[#D4AF37] text-[#F6EFE0] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <HonorableGuestCard ticket={previewTicket} showQr />
            <p className="text-center text-xs text-[#B3A6C9] mt-3 break-all">
              Card Link: {getGuestCardUrl(previewTicket.ticketId)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
