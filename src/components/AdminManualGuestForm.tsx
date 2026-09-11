import React, { useState } from 'react';
import { AdminRole, Ticket } from '../types';
import { EVENT_DETAILS } from '../data/eventData';
import { buildGuestTicket } from '../utils/createGuestTicket';
import { findDuplicateTransactionId } from '../utils/guestExport';
import { saveHonorableGuest, getGuestCardUrl } from '../utils/guestStorage';
import {
  paymentKindLabel,
  isRealTransactionId,
  visibleTransactionId,
  type PaymentKind,
} from '../utils/paymentKind';
import { sendRegistrationConfirmationSms } from '../utils/sendConfirmationSms';
import { validatePhotoFile } from '../utils/photoUpload';
import HonorableGuestCard from './HonorableGuestCard';
import PhotoCropModal from './PhotoCropModal';
import PhotoFilePicker from './PhotoFilePicker';
import {
  User,
  Phone,
  Sparkles,
  Users,
  Camera,
  CheckCircle2,
  RotateCcw,
  Save,
  MessageSquare,
  Loader2,
  AlertTriangle,
  Crop,
  ShieldAlert,
  Gift,
  Clock,
  Wallet,
} from 'lucide-react';

interface AdminManualGuestFormProps {
  existingGuests: Ticket[];
  onGuestCreated: (ticket: Ticket) => void;
  adminRole: AdminRole;
  actorName: string;
}

const emptyForm = () => ({
  fullName: '',
  familyName: '',
  starMakerId: '',
  phone: '',
  email: '',
  photoUrl: '',
  photoPreview: '',
  adultCount: 1,
  paymentMethod: 'bKash' as Ticket['paymentMethod'],
  transactionId: '',
  songRequest: '',
  paymentKind: 'paid' as PaymentKind,
});

export default function AdminManualGuestForm({
  existingGuests,
  onGuestCreated,
  adminRole,
  actorName,
}: AdminManualGuestFormProps) {
  const isSuperAdmin = adminRole === 'Super Admin';
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smsState, setSmsState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [smsError, setSmsError] = useState('');
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [rawPhotoSrc, setRawPhotoSrc] = useState<string | null>(null);

  const feeAmount = form.adultCount * EVENT_DETAILS.feeAdult;
  const totalAmount = form.paymentKind === 'complimentary' ? 0 : feeAmount;
  // Every entry an Admin makes is saved, but only a Super Admin can issue the card.
  const issuesCardNow = isSuperAdmin;

  const resetForm = () => {
    if (rawPhotoSrc?.startsWith('blob:')) URL.revokeObjectURL(rawPhotoSrc);
    setForm(emptyForm());
    setErrors({});
    setCreatedTicket(null);
    setSmsState('idle');
    setSmsError('');
    setCropSrc(null);
    setRawPhotoSrc(null);
  };

  const handlePhotoChange = (file: File) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) newErrors.fullName = 'পূর্ণ নাম প্রয়োজন';
    if (!form.familyName.trim()) newErrors.familyName = 'Family Name প্রয়োজন';
    if (!form.phone.trim() || form.phone.length < 11) newErrors.phone = 'সঠিক মোবাইল নম্বর দিন';
    if (form.paymentKind === 'paid') {
      if (!isRealTransactionId(form.transactionId)) {
        newErrors.transactionId = 'আসল Transaction ID দিন';
      } else {
        const duplicate = findDuplicateTransactionId(existingGuests, form.transactionId);
        if (duplicate) {
          newErrors.transactionId = `এই TrxID ইতিমধ্যে ব্যবহার হয়েছে (${duplicate.ticketId})`;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const baseTicket = buildGuestTicket({
      fullName: form.fullName,
      familyName: form.familyName,
      starMakerId: form.starMakerId || undefined,
      phone: form.phone,
      email: form.email || undefined,
      photoUrl: form.photoUrl || undefined,
      adultCount: form.adultCount,
      paymentMethod: form.paymentMethod,
      transactionId: form.transactionId,
      songRequest: form.songRequest || undefined,
      createdByAdmin: true,
      paymentKind: form.paymentKind,
    });

    const ticket: Ticket = issuesCardNow
      ? {
          ...baseTicket,
          createdBy: actorName,
          approvedBy: actorName,
          approvedAt: new Date().toISOString(),
        }
      : { ...baseTicket, status: 'Pending', createdBy: actorName };

    setIsSubmitting(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.submit;
      return next;
    });

    try {
      await saveHonorableGuest(ticket);
      setCreatedTicket(ticket);
      onGuestCreated(ticket);

      setSmsState('sending');
      sendRegistrationConfirmationSms(
        ticket.phone,
        ticket.status === 'Confirmed'
          ? { type: 'approved', cardUrl: getGuestCardUrl(ticket.ticketId) }
          : { type: 'pending' }
      ).then((result) => {
        if (result.success) {
          setSmsState('sent');
        } else {
          setSmsState('failed');
          setSmsError(result.error || 'কনফার্মেশন SMS পাঠানো যায়নি');
        }
      });
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Card সংরক্ষণ করা যায়নি',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdTicket) {
    return (
      <div className="space-y-4 font-body">
        <div className="flex items-center gap-2 text-[#F0D78C] text-sm font-bold">
          <CheckCircle2 className="w-5 h-5" />
          {createdTicket.status === 'Confirmed'
            ? `${paymentKindLabel(createdTicket.paymentKind ?? 'paid')} কার্ড তৈরি হয়েছে — ${createdTicket.ticketId}`
            : `এন্ট্রি সংরক্ষিত হয়েছে — ${createdTicket.ticketId}`}
        </div>

        {createdTicket.status === 'Confirmed' ? (
          <HonorableGuestCard ticket={createdTicket} showQr />
        ) : (
          <div className="bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-2xl p-4">
            <p className="text-sm font-bold text-[#F6EFE0] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
              Super Admin অ্যাপ্রুভাল পেন্ডিং
            </p>
            <p className="text-xs text-[#B3A6C9] mt-2">
              এন্ট্রি যাচাই করবেন শুধুমাত্র Super Admin। অ্যাপ্রুভ হলে অতিথির Honorable Guest Card তৈরি হবে
              এবং কার্ড লিংক SMS-এ চলে যাবে।
            </p>
            <p className="text-xs text-[#B3A6C9] mt-2">
              অতিথি: <span className="text-[#F0D78C] font-bold">{createdTicket.fullName}</span> ·{' '}
              {paymentKindLabel(createdTicket.paymentKind ?? 'paid')}
              {visibleTransactionId(createdTicket.transactionId) && (
                <>
                  {' '}· TrxID:{' '}
                  <span className="font-mono text-[#F0D78C]">
                    {visibleTransactionId(createdTicket.transactionId)}
                  </span>
                </>
              )}
            </p>
          </div>
        )}

        {smsState === 'sending' && (
          <p className="inline-flex items-center gap-2 text-xs text-[#B3A6C9] bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-full px-4 py-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
            কনফার্মেশন SMS পাঠানো হচ্ছে {createdTicket.phone} নম্বরে...
          </p>
        )}
        {smsState === 'sent' && (
          <p className="inline-flex items-center gap-2 text-xs text-[#F0D78C] bg-[#7A1F3D]/30 border border-[#D4AF37]/40 rounded-full px-4 py-2">
            <MessageSquare className="w-3.5 h-3.5" />
            কনফার্মেশন SMS ডেলিগেটের {createdTicket.phone} নম্বরে পাঠানো হয়েছে
          </p>
        )}
        {smsState === 'failed' && (
          <p className="inline-flex items-center gap-2 text-xs text-[#F6EFE0] bg-[#7A1F3D]/40 border border-[#A52C54]/50 rounded-full px-4 py-2">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F0D78C]" />
            {smsError}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7A1F3D] border border-[#D4AF37] text-[#F0D78C] font-bold text-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            আরেকটি কার্ড তৈরি করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-body">
      <p className="text-xs text-[#B3A6C9] bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-xl p-3">
        তিন ধরনের কার্ড তৈরি করা যায়: <span className="text-[#F0D78C] font-semibold">পেইড</span> (আসল TrxID —
        হিসাবে টাকা যোগ হবে), <span className="text-[#F0D78C] font-semibold">ডিউ</span> (আসবে কিন্তু পরে দিবে —
        QR কার্ড যাবে, টাকা ডিউ থাকবে), আর <span className="text-[#F0D78C] font-semibold">সম্মানী</span> (টাকা
        যোগ হবে না, সম্মানী QR কার্ড)।
        {!isSuperAdmin && (
          <span className="block mt-2 text-[#F0D78C] font-semibold">
            আপনার এন্ট্রি সংরক্ষিত হবে, তবে তিন ধরনের কার্ডেই এখন থেকে Super Admin অ্যাপ্রুভাল লাগবে। অ্যাপ্রুভ হলে
            QR কার্ড তৈরি হবে ও অতিথিকে SMS যাবে।
          </span>
        )}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {(
          [
            { id: 'paid' as const, label: 'পেইড কার্ড', hint: 'আসল TrxID', Icon: Wallet },
            { id: 'due' as const, label: 'ডিউ কার্ড', hint: 'পরে দিবে', Icon: Clock },
            { id: 'complimentary' as const, label: 'সম্মানী কার্ড', hint: 'টাকা ০/-', Icon: Gift },
          ] as const
        ).map(({ id, label, hint, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setForm({ ...form, paymentKind: id, transactionId: id === 'paid' ? form.transactionId : '' })}
            className={`rounded-xl border px-3 py-3 text-left cursor-pointer ${
              form.paymentKind === id
                ? 'bg-[#7A1F3D] border-[#D4AF37] text-[#F0D78C]'
                : 'bg-[#0F0C1A] border-[#D4AF37]/30 text-[#B3A6C9]'
            }`}
          >
            <span className="flex items-center gap-1.5 text-sm font-bold">
              <Icon className="w-4 h-4" />
              {label}
            </span>
            <span className="block text-[10px] mt-1 opacity-80">{hint}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-[#F6EFE0] mb-1 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-[#D4AF37]" /> পূর্ণ নাম *
          </label>
          <input
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
          />
          {errors.fullName && <p className="text-xs text-[#A52C54] mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-[#F6EFE0] mb-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#D4AF37]" /> StarMaker Family Name *
          </label>
          <input
            value={form.familyName}
            onChange={(e) => setForm({ ...form, familyName: e.target.value })}
            className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
          />
          {errors.familyName && <p className="text-xs text-[#A52C54] mt-1">{errors.familyName}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-[#F6EFE0] mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> StarMaker ID (ঐচ্ছিক)
          </label>
          <input
            value={form.starMakerId}
            onChange={(e) => setForm({ ...form, starMakerId: e.target.value })}
            className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#F6EFE0] mb-1 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" /> মোবাইল *
          </label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] font-mono outline-none"
          />
          {errors.phone && <p className="text-xs text-[#A52C54] mt-1">{errors.phone}</p>}
        </div>

        {form.paymentKind === 'paid' && (
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-[#F6EFE0] mb-1">Transaction ID (TrxID) *</label>
          <input
            value={form.transactionId}
            onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
            placeholder="bKash/Nagad/Rocket TrxID"
            className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] font-mono outline-none"
          />
          {errors.transactionId && <p className="text-xs text-[#A52C54] mt-1">{errors.transactionId}</p>}
        </div>
        )}
      </div>

      <div className="bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-xl p-3">
        <label className="text-xs font-semibold text-[#F6EFE0] mb-2 flex items-center gap-1">
          <Camera className="w-3.5 h-3.5 text-[#D4AF37]" /> ছবি (১৫ MB পর্যন্ত, ঐচ্ছিক)
        </label>
        <div className="flex items-center gap-3">
          {form.photoPreview ? (
            <img src={form.photoPreview} alt="" className="w-16 h-16 object-cover rounded-full border border-[#D4AF37]/40" />
          ) : null}
          <PhotoFilePicker
            onFileSelected={handlePhotoChange}
            className="cursor-pointer px-3 py-2 bg-[#1C1730] border border-[#D4AF37]/40 rounded-lg text-xs text-[#F0D78C] font-semibold"
            label="ছবি বেছে নিন"
          />
          {(rawPhotoSrc || form.photoPreview) && (
            <button
              type="button"
              onClick={() => setCropSrc(rawPhotoSrc || form.photoPreview)}
              className="inline-flex items-center gap-1 px-3 py-2 bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-lg text-xs text-[#F0D78C] font-semibold cursor-pointer"
            >
              <Crop className="w-3.5 h-3.5" />
              সেট করুন
            </button>
          )}
        </div>
        {errors.photo && <p className="text-xs text-[#A52C54] mt-1">{errors.photo}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-[#B3A6C9]">Adult:</span>
          <button type="button" onClick={() => setForm({ ...form, adultCount: Math.max(1, form.adultCount - 1) })} className="w-7 h-7 rounded bg-[#1C1730] border border-[#D4AF37]/40 cursor-pointer">-</button>
          <span className="font-bold text-[#F0D78C]">{form.adultCount}</span>
          <button type="button" onClick={() => setForm({ ...form, adultCount: form.adultCount + 1 })} className="w-7 h-7 rounded bg-[#1C1730] border border-[#D4AF37]/40 cursor-pointer">+</button>
        </div>
        {form.paymentKind === 'paid' && (
        <div className="flex items-center gap-2">
          <span className="text-[#B3A6C9]">Payment:</span>
          {(['bKash', 'Nagad', 'Rocket'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setForm({ ...form, paymentMethod: m })}
              className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${form.paymentMethod === m ? 'bg-[#7A1F3D] text-[#F0D78C] border border-[#D4AF37]' : 'bg-[#0F0C1A] text-[#B3A6C9]'}`}
            >
              {m}
            </button>
          ))}
        </div>
        )}
        <span className="font-bold text-[#F0D78C]">
          {form.paymentKind === 'complimentary'
            ? 'সম্মানী — ০/- (হিসাবে যোগ হবে না)'
            : form.paymentKind === 'due'
              ? `ডিউ: ${feeAmount}/- (পরে দিবে, এখন হিসাবে যোগ নয়)`
              : `মোট: ${totalAmount}/-`}
        </span>
      </div>

      {errors.submit && (
        <p className="text-xs text-[#A52C54] bg-[#7A1F3D]/30 border border-[#A52C54]/50 rounded-xl px-4 py-2.5">
          {errors.submit}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Save className="w-5 h-5" />
        {isSubmitting
          ? 'সংরক্ষণ হচ্ছে...'
          : !issuesCardNow
            ? 'এন্ট্রি জমা দিন — Super Admin অ্যাপ্রুভ করবেন'
            : form.paymentKind === 'complimentary'
              ? 'সম্মানী কার্ড তৈরি করুন'
              : form.paymentKind === 'due'
                ? 'ডিউ কার্ড তৈরি করুন'
                : 'Manual Card তৈরি করুন'}
      </button>

      {cropSrc && (
        <PhotoCropModal
          imageSrc={cropSrc}
          onConfirm={(cropped) => {
            setForm((prev) => ({ ...prev, photoUrl: cropped, photoPreview: cropped }));
            setCropSrc(null);
          }}
          onCancel={() => {
            setCropSrc(null);
            if (!form.photoPreview && rawPhotoSrc?.startsWith('blob:')) {
              URL.revokeObjectURL(rawPhotoSrc);
              setRawPhotoSrc(null);
            }
          }}
        />
      )}
    </form>
  );
}
