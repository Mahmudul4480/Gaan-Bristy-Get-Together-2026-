import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AdminRole, CardDeleteRequest, Ticket } from '../types';
import { EVENT_DETAILS } from '../data/eventData';
import { findDuplicateTransactionId } from '../utils/guestExport';
import { saveHonorableGuest } from '../utils/guestStorage';
import { validatePhotoFile } from '../utils/photoUpload';
import {
  deleteCardAsSuperAdmin,
  requestCardDelete,
  subscribeToDeleteRequests,
} from '../utils/deleteRequestStorage';
import HonorableGuestCard from './HonorableGuestCard';
import PhotoCropModal from './PhotoCropModal';
import PhotoFilePicker from './PhotoFilePicker';
import { Search, Save, Camera, User, Users, Phone, Sparkles, CheckCircle2, Crop, Trash2, Send, Loader2 } from 'lucide-react';

interface AdminGuestEditFormProps {
  guests: Ticket[];
  onGuestUpdated: () => void;
  adminRole: AdminRole;
  actorName: string;
  initialTicketId?: string | null;
  onClearInitialEdit?: () => void;
}

export default function AdminGuestEditForm({
  guests,
  onGuestUpdated,
  adminRole,
  actorName,
  initialTicketId,
  onClearInitialEdit,
}: AdminGuestEditFormProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [rawPhotoSrc, setRawPhotoSrc] = useState<string | null>(null);
  const [deleteRequests, setDeleteRequests] = useState<CardDeleteRequest[]>([]);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isSuperAdmin = adminRole === 'Super Admin';

  useEffect(() => {
    return subscribeToDeleteRequests(setDeleteRequests);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter(
      (g) =>
        g.ticketId.toLowerCase().includes(q) ||
        g.fullName.toLowerCase().includes(q) ||
        g.familyName.toLowerCase().includes(q) ||
        g.phone.includes(q) ||
        g.transactionId.toLowerCase().includes(q)
    );
  }, [guests, query]);

  const selectGuest = (ticket: Ticket) => {
    if (rawPhotoSrc?.startsWith('blob:')) URL.revokeObjectURL(rawPhotoSrc);
    setRawPhotoSrc(null);
    setCropSrc(null);
    setSelected({ ...ticket });
    setSaved(false);
    setErrors({});
  };

  useEffect(() => {
    if (!initialTicketId) return;
    const guest = guests.find((g) => g.ticketId === initialTicketId);
    if (!guest) return;
    if (selected?.ticketId === initialTicketId) return;
    selectGuest(guest);
  }, [initialTicketId, guests, selected?.ticketId]);

  const updateField = <K extends keyof Ticket>(key: K, value: Ticket[K]) => {
    if (!selected) return;
    setSelected({ ...selected, [key]: value });
    setSaved(false);
  };

  const handlePhotoChange = (file: File) => {
    if (!selected) return;
    const validationError = validatePhotoFile(file);
    if (validationError) {
      setErrors((prev) => ({ ...prev, photo: validationError }));
      return;
    }
    if (rawPhotoSrc?.startsWith('blob:')) URL.revokeObjectURL(rawPhotoSrc);
    const url = URL.createObjectURL(file);
    setRawPhotoSrc(url);
    setCropSrc(url);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.photo;
      return next;
    });
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;

    const newErrors: Record<string, string> = {};
    if (!selected.fullName.trim()) newErrors.fullName = 'নাম প্রয়োজন';
    if (!selected.familyName.trim()) newErrors.familyName = 'Family Name প্রয়োজন';
    if (!selected.phone.trim() || selected.phone.length < 11) newErrors.phone = 'সঠিক মোবাইল দিন';
    if (!selected.transactionId.trim()) newErrors.transactionId = 'TrxID প্রয়োজন';

    const duplicate = findDuplicateTransactionId(
      guests.filter((g) => g.ticketId !== selected.ticketId),
      selected.transactionId
    );
    if (duplicate) {
      newErrors.transactionId = `TrxID অন্য card-এ আছে (${duplicate.ticketId})`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const adultCount = Math.max(1, selected.adultCount);
    const updated: Ticket = {
      ...selected,
      fullName: selected.fullName.trim(),
      familyName: selected.familyName.trim(),
      starMakerId: selected.starMakerId?.trim() || undefined,
      phone: selected.phone.trim(),
      email: selected.email?.trim() || undefined,
      transactionId: selected.transactionId.trim(),
      songRequest: selected.songRequest?.trim() || undefined,
      adultCount,
      totalAmount: adultCount * EVENT_DETAILS.feeAdult,
      seatNumbers:
        selected.seatNumbers.length >= adultCount
          ? selected.seatNumbers.slice(0, adultCount)
          : [
              ...selected.seatNumbers,
              ...Array.from({ length: adultCount - selected.seatNumbers.length }, (_, i) =>
                `VIP-${100 + i + selected.seatNumbers.length}`
              ),
            ],
    };

    setIsSaving(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.submit;
      return next;
    });

    try {
      await saveHonorableGuest(updated);
      setSelected(updated);
      setSaved(true);
      onGuestUpdated();
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Card আপডেট করা যায়নি',
      }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 font-body">
      <p className="text-xs text-[#B3A6C9] bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-xl p-3">
        যেকোনো Guest Card-এর সব তথ্য এখান থেকে Edit করুন — নাম, Family, StarMaker ID, Mobile, ছবি, TrxID, Payment ইত্যাদি।
      </p>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-[#B3A6C9]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Card খুঁজুন — Ticket ID, নাম, TrxID, ফোন..."
          className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#F6EFE0] outline-none"
        />
      </div>

      {filtered.length > 0 && !selected && (
        <div className="max-h-40 overflow-y-auto rounded-xl border border-[#D4AF37]/25 divide-y divide-[#D4AF37]/10">
          {filtered.map((g) => (
            <button
              key={g.ticketId}
              type="button"
              onClick={() => selectGuest(g)}
              className="w-full text-left px-3 py-2.5 hover:bg-[#0F0C1A] transition cursor-pointer"
            >
              <span className="text-[#F0D78C] font-mono text-xs">{g.ticketId}</span>
              <span className="text-[#F6EFE0] font-semibold text-sm ml-2">{g.fullName}</span>
              <span className="text-[#B3A6C9] text-xs ml-2">— {g.familyName}</span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/25 pb-2 mb-1">
              <p className="text-base font-extrabold text-[#F0D78C] font-serif">
                Card Edit — {selected.ticketId}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelected(null);
                  onClearInitialEdit?.();
                }}
                className="text-xs text-[#B3A6C9] hover:text-[#F6EFE0] cursor-pointer"
              >
                ← অন্য card
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#F6EFE0] mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#D4AF37]" /> Name *
              </label>
              <input
                value={selected.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
              />
              {errors.fullName && <p className="text-xs text-[#A52C54] mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-[#F6EFE0] mb-1 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#D4AF37]" /> StarMaker Family Name *
              </label>
              <input
                value={selected.familyName}
                onChange={(e) => updateField('familyName', e.target.value)}
                className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
              />
              {errors.familyName && <p className="text-xs text-[#A52C54] mt-1">{errors.familyName}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-[#F6EFE0] mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> StarMaker ID No
              </label>
              <input
                value={selected.starMakerId ?? ''}
                onChange={(e) => updateField('starMakerId', e.target.value || undefined)}
                className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#F6EFE0] mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" /> Mobile No *
              </label>
              <input
                value={selected.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] font-mono outline-none"
              />
              {errors.phone && <p className="text-xs text-[#A52C54] mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-[#F6EFE0] mb-1">Email</label>
              <input
                value={selected.email ?? ''}
                onChange={(e) => updateField('email', e.target.value || undefined)}
                className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#F6EFE0] mb-1">Transaction ID (TrxID) *</label>
              <input
                value={selected.transactionId}
                onChange={(e) => updateField('transactionId', e.target.value)}
                className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] font-mono outline-none"
              />
              {errors.transactionId && <p className="text-xs text-[#A52C54] mt-1">{errors.transactionId}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#F6EFE0] mb-1">Payment</label>
                <select
                  value={selected.paymentMethod}
                  onChange={(e) => updateField('paymentMethod', e.target.value as Ticket['paymentMethod'])}
                  className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
                >
                  {(['bKash', 'Nagad', 'Rocket', 'Bank Transfer'] as const).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#F6EFE0] mb-1">Adult Count</label>
                <input
                  type="number"
                  min={1}
                  value={selected.adultCount}
                  onChange={(e) => updateField('adultCount', Math.max(1, Number(e.target.value) || 1))}
                  className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#F6EFE0] mb-1">গানের অনুরোধ</label>
              <input
                value={selected.songRequest ?? ''}
                onChange={(e) => updateField('songRequest', e.target.value || undefined)}
                className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
              />
            </div>

            <div className="bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-xl p-3">
              <label className="text-xs font-semibold text-[#F6EFE0] mb-2 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-[#D4AF37]" /> ছবি (Sommani Card-এ ব্যবহৃত হবে)
              </label>
              <div className="flex items-center gap-3">
                {selected.photoUrl ? (
                  <img src={selected.photoUrl} alt="" className="w-16 h-16 object-cover rounded-full border border-[#D4AF37]/40" />
                ) : null}
                <PhotoFilePicker
                  onFileSelected={handlePhotoChange}
                  className="cursor-pointer px-3 py-2 bg-[#1C1730] border border-[#D4AF37]/40 rounded-lg text-xs text-[#F0D78C] font-semibold"
                  label="ছবি বদলান"
                />
                {(rawPhotoSrc || selected.photoUrl) && (
                  <button
                    type="button"
                    onClick={() => setCropSrc(rawPhotoSrc || selected.photoUrl || null)}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-lg text-xs text-[#F0D78C] font-semibold cursor-pointer"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    সেট করুন
                  </button>
                )}
              </div>
              {errors.photo && <p className="text-xs text-[#A52C54] mt-1">{errors.photo}</p>}
            </div>

            {errors.submit && (
              <p className="text-xs text-[#A52C54] bg-[#7A1F3D]/30 border border-[#A52C54]/50 rounded-xl px-4 py-2.5">
                {errors.submit}
              </p>
            )}

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'Card আপডেট সংরক্ষণ করুন'}
            </button>

            {isSuperAdmin ? (
              confirmDelete ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={deleteBusy}
                    onClick={async () => {
                      if (!selected) return;
                      setDeleteBusy(true);
                      try {
                        await deleteCardAsSuperAdmin(selected.ticketId, deleteRequests);
                        setSelected(null);
                        setConfirmDelete(false);
                        onGuestUpdated();
                      } catch (error) {
                        setErrors((prev) => ({
                          ...prev,
                          submit: error instanceof Error ? error.message : 'ডিলিট করা যায়নি',
                        }));
                      } finally {
                        setDeleteBusy(false);
                      }
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-[#A52C54] text-[#F6EFE0] font-bold text-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {deleteBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    নিশ্চিত — ডিলিট
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#D4AF37]/40 text-[#B3A6C9] text-sm font-bold cursor-pointer"
                  >
                    না
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full py-2.5 rounded-xl bg-[#0F0C1A] border border-[#A52C54]/50 text-[#F6EFE0] font-bold text-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  এই কার্ড ডিলিট করুন
                </button>
              )
            ) : deleteRequests.some((r) => r.ticketId === selected.ticketId && r.status === 'Pending') ? (
              <p className="text-xs text-center text-[#F0D78C] font-bold">এই কার্ডের ডিলিট রিকোয়েস্ট Super Admin-এর অ্যাপ্রুভালে আছে</p>
            ) : (
              <button
                type="button"
                disabled={deleteBusy}
                onClick={async () => {
                  if (!selected) return;
                  setDeleteBusy(true);
                  try {
                    await requestCardDelete(selected, actorName);
                  } catch (error) {
                    setErrors((prev) => ({
                      ...prev,
                      submit: error instanceof Error ? error.message : 'ডিলিট রিকোয়েস্ট পাঠানো যায়নি',
                    }));
                  } finally {
                    setDeleteBusy(false);
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-[#0F0C1A] border border-[#D4AF37]/40 text-[#F0D78C] font-bold text-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {deleteBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Super Admin-কে ডিলিট রিকোয়েস্ট পাঠান
              </button>
            )}

            {saved && (
              <p className="text-xs text-[#F0D78C] flex items-center gap-1 justify-center">
                <CheckCircle2 className="w-4 h-4" />
                Card সফলভাবে আপডেট হয়েছে!
              </p>
            )}
          </div>

          <div className="lg:sticky lg:top-0 lg:self-start">
            <p className="text-sm font-bold text-[#F0D78C] mb-3 text-center tracking-wide">
              Live Preview — Honorable Guest Card
            </p>
            <HonorableGuestCard ticket={selected} showQr />
          </div>
        </form>
      )}

      {!selected && filtered.length === 0 && (
        <p className="text-center text-sm text-[#B3A6C9] py-6">কোনো card পাওয়া যায়নি</p>
      )}

      {cropSrc && selected && (
        <PhotoCropModal
          imageSrc={cropSrc}
          onConfirm={(cropped) => {
            updateField('photoUrl', cropped);
            setCropSrc(null);
          }}
          onCancel={() => setCropSrc(null)}
        />
      )}
    </div>
  );
}
