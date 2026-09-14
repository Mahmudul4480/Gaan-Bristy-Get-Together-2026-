import { useMemo, useState } from 'react';
import { Ticket } from '../types';
import { checkedInGuests, formatCheckInTime, headcount, invitedGuests, sortByCheckInTimeDesc } from '../utils/checkInStats';
import { getGateAppUrl } from '../config/adminConfig';
import { Users, Bell, BellOff, Copy, Check, ScanLine, Clock } from 'lucide-react';

interface AdminGateLogProps {
  guests: Ticket[];
  notificationPermission: NotificationPermission | 'unsupported';
  onEnableNotifications: () => void;
}

export default function AdminGateLog({ guests, notificationPermission, onEnableNotifications }: AdminGateLogProps) {
  const [linkCopied, setLinkCopied] = useState(false);

  const invited = useMemo(() => invitedGuests(guests), [guests]);
  const entered = useMemo(() => sortByCheckInTimeDesc(checkedInGuests(guests)), [guests]);
  const invitedHeadcount = useMemo(() => headcount(invited), [invited]);
  const enteredHeadcount = useMemo(() => headcount(entered), [entered]);

  const gateLink = getGateAppUrl();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(gateLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  return (
    <div className="space-y-4 font-body">
      <div className="bg-[#0F0C1A] border border-[#D4AF37]/35 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#F0D78C]">
          <ScanLine className="w-4 h-4 text-[#D4AF37]" />
          Gate Scanner Link (গেট স্ক্যানারদের শেয়ার করুন)
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            readOnly
            value={gateLink}
            className="flex-1 bg-[#1C1730] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-[11px] sm:text-xs text-[#F6EFE0] font-mono outline-none"
          />
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#7A1F3D] border border-[#D4AF37]/50 text-[#F0D78C] text-xs font-bold cursor-pointer shrink-0"
          >
            {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {linkCopied ? 'কপি হয়েছে' : 'Link কপি'}
          </button>
        </div>
        <p className="text-[10px] text-[#B3A6C9]">
          এই লিংক খুলে স্ক্যানাররা নাম + Gate PIN দিয়ে লগইন করবেন, তারপর ব্রাউজার মেনু থেকে "Add to Home Screen" করলে
          ফোনে একটা আলাদা অ্যাপ আইকন হয়ে যাবে।
        </p>
      </div>

      {notificationPermission !== 'unsupported' && notificationPermission !== 'granted' && (
        <button
          type="button"
          onClick={onEnableNotifications}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#7A1F3D] border border-[#D4AF37]/50 text-[#F0D78C] text-xs font-bold cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          কেউ গেটে ঢুকলে নোটিফিকেশন চালু করুন
        </button>
      )}
      {notificationPermission === 'granted' && (
        <p className="text-[11px] text-[#B3A6C9] flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-[#D4AF37]" />
          নোটিফিকেশন চালু আছে — এই ট্যাব/অ্যাপ খোলা থাকলে কেউ ঢুকলেই জানতে পারবেন।
        </p>
      )}
      {notificationPermission === 'unsupported' && (
        <p className="text-[11px] text-[#B3A6C9] flex items-center gap-1.5">
          <BellOff className="w-3.5 h-3.5" />
          এই ব্রাউজার নোটিফিকেশন সাপোর্ট করে না — তবু এই তালিকা লাইভ আপডেট হবে।
        </p>
      )}

      <div className="bg-[#1C1730] border border-[#D4AF37]/35 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-[#B3A6C9] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
            প্রবেশ করেছেন
          </span>
          <span className="text-[10px] text-[#B3A6C9]">{entered.length} টি কার্ড</span>
        </div>
        <p className="text-2xl font-black text-[#F0D78C] font-serif">
          {enteredHeadcount}
          <span className="text-sm text-[#B3A6C9] font-body font-normal"> / {invitedHeadcount} জন আমন্ত্রিত</span>
        </p>
        <div className="w-full h-1.5 bg-[#0F0C1A] rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0D78C] rounded-full transition-all"
            style={{ width: `${invitedHeadcount > 0 ? Math.min(100, (enteredHeadcount / invitedHeadcount) * 100) : 0}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#D4AF37]/30 overflow-hidden">
        <div className="bg-[#0F0C1A] text-[#B3A6C9] text-[11px] font-bold px-3 py-2 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
          লাইভ এন্ট্রি লগ (সাম্প্রতিক আগে)
        </div>
        {entered.length === 0 ? (
          <p className="text-center text-xs text-[#B3A6C9] py-6">এখনও কেউ প্রবেশ করেননি</p>
        ) : (
          <div className="max-h-96 overflow-y-auto divide-y divide-[#D4AF37]/10">
            {entered.map((g) => (
              <div key={g.ticketId} className="px-3 py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="text-[#F6EFE0] font-semibold truncate">{g.fullName}</p>
                  <p className="text-[10px] text-[#B3A6C9] font-mono truncate">
                    {g.ticketId} · Adult {g.adultCount} · {g.checkedInBy}
                  </p>
                </div>
                <span className="text-[10px] text-[#F0D78C] font-bold shrink-0 text-right">
                  {formatCheckInTime(g.checkedInAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
