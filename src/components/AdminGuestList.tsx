import { useMemo, useState } from 'react';
import { Ticket } from '../types';
import { downloadGuestsCsv, downloadGuestsJson } from '../utils/guestExport';
import { getGuestCardUrl } from '../utils/guestStorage';
import HonorableGuestCard from './HonorableGuestCard';
import { FileSpreadsheet, FileJson, Search, Eye, X } from 'lucide-react';

interface AdminGuestListProps {
  guests: Ticket[];
}

export default function AdminGuestList({ guests }: AdminGuestListProps) {
  const [query, setQuery] = useState('');
  const [previewTicket, setPreviewTicket] = useState<Ticket | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter(
      (g) =>
        g.ticketId.toLowerCase().includes(q) ||
        g.fullName.toLowerCase().includes(q) ||
        g.familyName.toLowerCase().includes(q) ||
        g.phone.includes(q) ||
        g.transactionId.toLowerCase().includes(q) ||
        (g.starMakerId && g.starMakerId.toLowerCase().includes(q))
    );
  }, [guests, query]);

  return (
    <div className="space-y-4 font-body">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <p className="text-sm text-[#B3A6C9]">
          মোট <span className="text-[#F0D78C] font-bold">{guests.length}</span> টি Honorable Guest Card
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
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-[#0F0C1A] text-[#B3A6C9] uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2">Ticket ID</th>
                <th className="px-3 py-2">নাম</th>
                <th className="px-3 py-2">Family</th>
                <th className="px-3 py-2">TrxID</th>
                <th className="px-3 py-2">ফোন</th>
                <th className="px-3 py-2">উৎস</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.ticketId} className="border-t border-[#D4AF37]/15 hover:bg-[#0F0C1A]/50">
                  <td className="px-3 py-2 font-mono text-[#F0D78C]">{g.ticketId}</td>
                  <td className="px-3 py-2 text-[#F6EFE0] font-semibold">{g.fullName}</td>
                  <td className="px-3 py-2 text-[#B3A6C9]">{g.familyName}</td>
                  <td className="px-3 py-2 font-mono text-[#F6EFE0]">{g.transactionId}</td>
                  <td className="px-3 py-2 font-mono">{g.phone}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${g.createdByAdmin ? 'bg-[#7A1F3D] text-[#F0D78C]' : 'bg-[#1C1730] text-[#B3A6C9]'}`}>
                      {g.createdByAdmin ? 'Admin' : 'Online'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTicket(g)}
                      className="inline-flex items-center gap-1 text-[#D4AF37] hover:text-[#F0D78C] font-bold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Card
                    </button>
                  </td>
                </tr>
              ))}
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
