import React, { useState } from 'react';
import { Ticket } from '../types';
import { EVENT_DETAILS, LOGO_URL } from '../data/eventData';
import { saveHonorableGuest } from '../utils/guestStorage';
import { notifyAdminPaymentComplete } from '../utils/notifyAdminPayment';
import { sendRegistrationConfirmationSms } from '../utils/sendConfirmationSms';
import { findDuplicateTransactionId } from '../utils/guestExport';
import { validatePhotoFile } from '../utils/photoUpload';
import PhotoCropModal from './PhotoCropModal';
import {
  X,
  Ticket as TicketIcon,
  User,
  Phone,
  Sparkles,
  Copy,
  Check,
  ArrowLeft,
  Users,
  Camera,
  ImageIcon,
  MessageSquare,
  Loader2,
  AlertTriangle,
  Clock,
  Crop,
  Shirt,
} from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingGuests: Ticket[];
}

const REQUIRED_FIELD_ORDER = ['fullName', 'familyName', 'phone', 'transactionId'] as const;

const FIELD_LABELS: Record<(typeof REQUIRED_FIELD_ORDER)[number], string> = {
  fullName: 'Name (নাম)',
  familyName: 'StarMaker Family Name',
  phone: 'Mobile No',
  transactionId: 'Transaction ID (TrxID)',
};

function focusInvalidField(fieldKey: string) {
  const el = document.getElementById(`reg-field-${fieldKey}`);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  window.setTimeout(() => {
    if (el instanceof HTMLInputElement) {
      el.focus({ preventScroll: true });
    }
  }, 280);
}

export default function RegistrationModal({ isOpen, onClose, existingGuests }: RegistrationModalProps) {
  const [fullName, setFullName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [starMakerId, setStarMakerId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [rawPhotoSrc, setRawPhotoSrc] = useState<string | null>(null);
  const [adultCount, setAdultCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer'>('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [songRequest, setSongRequest] = useState('');

  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [smsState, setSmsState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [smsError, setSmsError] = useState('');

  if (!isOpen) return null;

  const totalAmount = adultCount * EVENT_DETAILS.feeAdult;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(EVENT_DETAILS.bkashNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

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

  const closeCropper = (revokeRaw = false) => {
    setCropSrc(null);
    if (revokeRaw && rawPhotoSrc?.startsWith('blob:')) {
      URL.revokeObjectURL(rawPhotoSrc);
      setRawPhotoSrc(null);
    }
  };

  const clearFieldError = (key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const fieldClass = (key: string, extra = '') =>
    `w-full bg-[#1C1730] rounded-xl px-4 py-2.5 text-sm text-[#F6EFE0] outline-none transition ${extra} ${
      errors[key]
        ? 'border-2 border-[#E85A7A] ring-2 ring-[#E85A7A]/40'
        : 'border border-[#D4AF37]/40 focus:border-[#D4AF37]'
    }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    const phoneDigits = phone.replace(/\D/g, '');

    if (!fullName.trim()) newErrors.fullName = 'এই ফিল্ড পূরণ হয়নি — আপনার নাম লিখুন';
    if (!familyName.trim()) newErrors.familyName = 'এই ফিল্ড পূরণ হয়নি — StarMaker Family Name লিখুন';
    if (!phone.trim()) newErrors.phone = 'এই ফিল্ড পূরণ হয়নি — Mobile No লিখুন';
    else if (phoneDigits.length < 11) newErrors.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন';
    if (!transactionId.trim()) newErrors.transactionId = 'এই ফিল্ড পূরণ হয়নি — Transaction ID (TrxID) লিখুন';

    const duplicate = findDuplicateTransactionId(existingGuests, transactionId);
    if (duplicate) {
      newErrors.transactionId = `এই TrxID ইতিমধ্যে ব্যবহার হয়েছে (${duplicate.ticketId})`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstInvalid = REQUIRED_FIELD_ORDER.find((key) => newErrors[key]);
      if (firstInvalid) {
        window.requestAnimationFrame(() => focusInvalidField(firstInvalid));
      }
      return;
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newTicket: Ticket = {
      ticketId: `GB2026-${randomCode}`,
      fullName: fullName.trim(),
      familyName: familyName.trim(),
      starMakerId: starMakerId.trim() || undefined,
      phone: phone.trim(),
      email: email.trim() || undefined,
      photoUrl: photoUrl || undefined,
      adultCount,
      kidCount: 0,
      totalAmount,
      paymentMethod,
      transactionId: transactionId.trim(),
      status: 'Pending',
      issueDate: new Date().toISOString(),
      seatNumbers: Array.from({ length: adultCount }, (_, i) => `VIP-${100 + randomCode + i}`),
      songRequest: songRequest.trim() || undefined,
    };

    setIsSubmitting(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.submit;
      return next;
    });

    try {
      await saveHonorableGuest(newTicket);
      void notifyAdminPaymentComplete(newTicket);

      setCreatedTicket(newTicket);

      setSmsState('sending');
      sendRegistrationConfirmationSms(newTicket.phone, { type: 'pending' }).then((result) => {
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
        submit: error instanceof Error ? error.message : 'রেজিস্ট্রেশন সংরক্ষণ করা যায়নি',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-[#0F0C1A]/92 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[min(96dvh,920px)] flex flex-col bg-[#1C1730] border-2 border-[#D4AF37] rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.25)] text-[#F6EFE0] my-2 sm:my-4 overflow-hidden">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-[#0F0C1A] text-[#B3A6C9] hover:text-[#F6EFE0] border border-[#D4AF37]/40 hover:border-[#D4AF37] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {createdTicket ? (
          <div className="overflow-y-auto p-5 sm:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 p-3 bg-[#7A1F3D] text-[#F0D78C] rounded-full border border-[#D4AF37] mb-3 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                <Clock className="w-6 h-6 text-[#F0D78C]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F6EFE0] font-serif">
                রেজিস্ট্রেশন জমা হয়েছে
              </h2>
              <p className="text-sm text-[#B3A6C9] mt-2 font-body leading-relaxed">
                Super Admin আপনার Transaction ID যাচাই করছেন। অ্যাপ্রুভ হলে Honorable Guest Card
                আপনার WhatsApp ও SMS-এ পাঠানো হবে।
              </p>
            </div>

            <div className="bg-[#0F0C1A]/80 border border-[#D4AF37]/40 rounded-2xl p-4 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-[#B3A6C9]">Ticket ID</span>
                <span className="font-mono text-[#F0D78C] font-bold">{createdTicket.ticketId}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#B3A6C9]">নাম</span>
                <span className="text-[#F6EFE0] font-semibold">{createdTicket.fullName}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#B3A6C9]">TrxID</span>
                <span className="font-mono text-[#F6EFE0]">{createdTicket.transactionId}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[#B3A6C9]">মোট</span>
                <span className="text-[#F0D78C] font-bold">{createdTicket.totalAmount}/-</span>
              </div>
              <p className="text-[11px] text-[#F0D78C] pt-2 border-t border-[#D4AF37]/20 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                স্ট্যাটাস: Pending Approval
              </p>
            </div>

            <div className="text-center mt-5">
              {smsState === 'sending' && (
                <p className="inline-flex items-center gap-2 text-xs text-[#B3A6C9] bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-full px-4 py-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                  কনফার্মেশন SMS পাঠানো হচ্ছে {createdTicket.phone} নম্বরে...
                </p>
              )}
              {smsState === 'sent' && (
                <p className="inline-flex items-center gap-2 text-xs text-[#F0D78C] bg-[#7A1F3D]/30 border border-[#D4AF37]/40 rounded-full px-4 py-2">
                  <MessageSquare className="w-3.5 h-3.5" />
                  রেজিস্ট্রেশন জমার SMS আপনার {createdTicket.phone} নম্বরে পাঠানো হয়েছে
                </p>
              )}
              {smsState === 'failed' && (
                <p className="inline-flex items-center gap-2 text-xs text-[#F6EFE0] bg-[#7A1F3D]/40 border border-[#A52C54]/50 rounded-full px-4 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F0D78C]" />
                  {smsError}
                </p>
              )}
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-[#0F0C1A] border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#F6EFE0] rounded-full text-sm font-bold transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header — GB logo + title (sticky) */}
            <div className="shrink-0 text-center border-b border-[#D4AF37]/25 bg-[#1C1730]/95 backdrop-blur-sm px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
              <img
                src={LOGO_URL}
                alt="Gaan Bristy Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain mx-auto drop-shadow-[0_0_18px_rgba(212,175,55,0.35)]"
              />
              <h2 className="mt-2 text-xl sm:text-2xl font-black font-serif text-[#F6EFE0]">
                অনলাইন রেজিস্ট্রেশন
              </h2>
              <p className="text-[11px] sm:text-xs text-[#B3A6C9] font-mono mt-0.5">
                Gaan Bristy Get Together 2026 • Gulshan Club
              </p>
              <div className="mt-3 mx-auto max-w-md rounded-xl border border-[#F0D78C]/70 bg-[#7A1F3D]/50 px-3 py-2">
                <p className="inline-flex items-center justify-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#F0D78C]">
                  <Shirt className="w-3.5 h-3.5" />
                  Dress Code
                </p>
                <p className="text-[11px] text-[#F6EFE0] mt-1 leading-snug">
                  Male: Formal (Shirt, Pant, Shoe) · Female: Casual
                </p>
              </div>
            </div>

            {/* Scrollable form body */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6 sm:py-5">
            <form onSubmit={handleSubmit} className="space-y-4 font-body">

              {/* Personal info — primary fields */}
              <div className="bg-[#0F0C1A]/80 border border-[#D4AF37]/45 rounded-2xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-[#F0D78C] font-serif flex items-center gap-2">
                  <User className="w-4 h-4" />
                  ব্যক্তিগত তথ্য
                </h3>

                <div className="space-y-3">
                  <div>
                    <label htmlFor="reg-field-fullName" className="block text-xs font-semibold text-[#F6EFE0] mb-1.5">
                      Name (নাম) *
                    </label>
                    <input
                      id="reg-field-fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        clearFieldError('fullName');
                      }}
                      placeholder="যেমন: তানভীর আহমেদ"
                      aria-invalid={Boolean(errors.fullName)}
                      className={fieldClass('fullName')}
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 text-xs font-bold text-[#FFB4C4] flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="reg-field-familyName" className="block text-xs font-semibold text-[#F6EFE0] mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                      StarMaker Family Name *
                    </label>
                    <input
                      id="reg-field-familyName"
                      type="text"
                      value={familyName}
                      onChange={(e) => {
                        setFamilyName(e.target.value);
                        clearFieldError('familyName');
                      }}
                      placeholder="যেমন: Gaan Bristy Royals"
                      aria-invalid={Boolean(errors.familyName)}
                      className={fieldClass('familyName')}
                    />
                    {errors.familyName && (
                      <p className="mt-1.5 text-xs font-bold text-[#FFB4C4] flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        {errors.familyName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#F6EFE0] mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                        StarMaker ID No (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        value={starMakerId}
                        onChange={(e) => setStarMakerId(e.target.value)}
                        placeholder="যেমন: @GB_Tanveer"
                        className="w-full bg-[#1C1730] border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-[#F6EFE0] outline-none transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="reg-field-phone" className="block text-xs font-semibold text-[#F6EFE0] mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Mobile No *
                      </label>
                      <input
                        id="reg-field-phone"
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          clearFieldError('phone');
                        }}
                        placeholder="017xxxxxxxx"
                        aria-invalid={Boolean(errors.phone)}
                        className={fieldClass('phone', 'font-mono')}
                      />
                      {errors.phone && (
                        <p className="mt-1.5 text-xs font-bold text-[#FFB4C4] flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Photo — Honorable Guest Card */}
              <div className="bg-[#0F0C1A]/80 border border-[#D4AF37]/45 rounded-2xl p-4">
                <label className="block text-xs font-semibold text-[#F6EFE0] mb-1 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
                  ছবি আপলোড (ঐচ্ছিক, সর্বোচ্চ ৩ MB)
                </label>
                <p className="text-xs text-[#F0D78C] font-semibold mb-1 font-bangla leading-relaxed">
                  এই ছবি সম্মান কার্ড (Honorable Guest Card)-এর জন্য ব্যবহৃত হবে।
                </p>
                <p className="text-[11px] text-[#B3A6C9] mb-3 font-bangla leading-relaxed">
                  ভালো কোয়ালিটির ছবি দিন। আপলোডের পর মুখ গোল ফ্রেমের মাঝে সেট করতে পারবেন — যাতে চেহারা না কাটে।
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-28 h-28 object-cover rounded-full border-2 border-[#D4AF37]/60 shadow-md" />
                  ) : (
                    <div className="w-28 h-28 rounded-full border-2 border-dashed border-[#D4AF37]/45 bg-[#1C1730] flex flex-col items-center justify-center text-[#B3A6C9] text-[10px] text-center px-2 gap-1">
                      <ImageIcon className="w-6 h-6 text-[#D4AF37]/60" />
                      <span>কোনো ছবি নেই</span>
                    </div>
                  )}
                  <div className="flex-1 w-full flex flex-col sm:flex-row gap-2">
                    <label className="flex-1 w-full cursor-pointer">
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                      <span className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 bg-[#7A1F3D]/40 border border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-xl text-sm font-semibold text-[#F0D78C] transition">
                        <Camera className="w-4 h-4" />
                        ছবি বেছে নিন
                      </span>
                    </label>
                    {(rawPhotoSrc || photoPreview) && (
                      <button
                        type="button"
                        onClick={() => setCropSrc(rawPhotoSrc || photoPreview)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0F0C1A] border border-[#D4AF37]/50 rounded-xl text-sm font-semibold text-[#F0D78C] cursor-pointer"
                      >
                        <Crop className="w-4 h-4" />
                        ছবি সেট করুন
                      </button>
                    )}
                  </div>
                </div>
                {errors.photo && <p className="text-xs text-[#A52C54] mt-2">{errors.photo}</p>}
              </div>

              <div className="bg-[#0F0C1A]/70 border border-[#D4AF37]/30 rounded-2xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-[#F6EFE0] font-serif">রেজিস্ট্রেশন সংখ্যা</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#F6EFE0]">Adult (প্রাপ্তবয়স্ক)</p>
                    <p className="text-xs text-[#B3A6C9]">প্রতি জন {EVENT_DETAILS.feeAdult}/- টাকা</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setAdultCount(Math.max(1, adultCount - 1))} className="w-8 h-8 rounded-lg bg-[#1C1730] border border-[#D4AF37]/40 text-[#F6EFE0] font-bold cursor-pointer hover:bg-[#7A1F3D]">-</button>
                    <span className="text-base font-bold text-[#F0D78C] w-6 text-center">{adultCount}</span>
                    <button type="button" onClick={() => setAdultCount(adultCount + 1)} className="w-8 h-8 rounded-lg bg-[#1C1730] border border-[#D4AF37]/40 text-[#F6EFE0] font-bold cursor-pointer hover:bg-[#7A1F3D]">+</button>
                  </div>
                </div>
                <div className="pt-2 border-t border-[#D4AF37]/20 flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#F6EFE0]">মোট মূল্য:</span>
                  <span className="text-lg font-extrabold text-[#F0D78C] font-serif">{totalAmount}/- টাকা</span>
                </div>
              </div>

              <div className="bg-[#7A1F3D]/25 border border-[#D4AF37]/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-[#F6EFE0] uppercase">পেমেন্ট</span>
                  <div className="flex items-center gap-2">
                    {(['bKash', 'Nagad', 'Rocket'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`px-2.5 py-1 text-xs rounded-lg font-bold cursor-pointer ${paymentMethod === method ? 'bg-[#7A1F3D] text-[#F0D78C] border border-[#D4AF37]' : 'bg-[#0F0C1A] text-[#B3A6C9]'}`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-[#0F0C1A] rounded-xl border border-[#D4AF37]/40 flex items-center justify-between text-xs sm:text-sm gap-2">
                  <div>
                    <span className="text-[#B3A6C9]">নম্বর: </span>
                    <span className="font-bold text-[#F0D78C] font-mono">{EVENT_DETAILS.bkashNumber}</span>
                  </div>
                  <button type="button" onClick={handleCopyNumber} className="flex items-center gap-1 bg-[#1C1730] border border-[#D4AF37]/40 px-2.5 py-1 rounded-lg text-xs cursor-pointer">
                    {isCopied ? <Check className="w-3.5 h-3.5 text-[#F0D78C]" /> : <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />}
                    <span>{isCopied ? 'কপি হয়েছে' : 'কপি'}</span>
                  </button>
                </div>

                <div>
                  <label htmlFor="reg-field-transactionId" className="block text-xs font-semibold text-[#F6EFE0] mb-1">Transaction ID (TrxID) *</label>
                  <input
                    id="reg-field-transactionId"
                    type="text"
                    value={transactionId}
                    onChange={(e) => {
                      setTransactionId(e.target.value);
                      clearFieldError('transactionId');
                    }}
                    placeholder="যেমন: BK109283746"
                    aria-invalid={Boolean(errors.transactionId)}
                    className={fieldClass('transactionId', 'bg-[#0F0C1A] font-mono')}
                  />
                  {errors.transactionId && (
                    <p className="mt-1.5 text-xs font-bold text-[#FFB4C4] flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      {errors.transactionId}
                    </p>
                  )}
                  <p className="text-[10px] text-[#B3A6C9] mt-1">
                    সঠিক TrxID দিন। Super Admin যাচাই করে অ্যাপ্রুভ করলে তবেই কার্ড তৈরি হবে।
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B3A6C9] mb-1">ইমেইল (ঐচ্ছিক)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full bg-[#0F0C1A] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-sm text-[#F6EFE0] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B3A6C9] mb-1">গানের অনুরোধ (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={songRequest}
                  onChange={(e) => setSongRequest(e.target.value)}
                  placeholder="আপনার প্রিয় গান..."
                  className="w-full bg-[#0F0C1A] border border-[#D4AF37]/30 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-sm text-[#F6EFE0] outline-none transition"
                />
              </div>

              <div className="flex flex-col gap-3 pt-1 pb-1">
                {REQUIRED_FIELD_ORDER.some((key) => errors[key]) && (
                  <div className="w-full rounded-xl border-2 border-[#E85A7A] bg-[#7A1F3D]/50 px-4 py-3">
                    <p className="text-sm font-bold text-[#FFB4C4] flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      বাধ্যতামূলক ফিল্ড পূরণ হয়নি — তাই রেজিস্ট্রেশন নেওয়া যায়নি
                    </p>
                    <ul className="mt-2 space-y-1">
                      {REQUIRED_FIELD_ORDER.filter((key) => errors[key]).map((key) => (
                        <li key={key}>
                          <button
                            type="button"
                            onClick={() => focusInvalidField(key)}
                            className="text-xs font-semibold text-[#F6EFE0] underline underline-offset-2 cursor-pointer"
                          >
                            {FIELD_LABELS[key]} — {errors[key]}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {errors.submit && (
                  <p className="w-full text-xs font-bold text-[#FFB4C4] bg-[#7A1F3D]/30 border border-[#A52C54]/50 rounded-xl px-4 py-2.5">
                    {errors.submit}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={onClose} className="sm:w-auto px-6 py-3.5 bg-[#0F0C1A] border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#F0D78C] font-bold text-sm rounded-full flex items-center justify-center gap-2 cursor-pointer">
                  <ArrowLeft className="w-5 h-5" />
                  <span>ফিরে যান</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-gradient-to-r from-[#F0D78C] to-[#D4AF37] text-[#0F0C1A] font-extrabold text-sm sm:text-base rounded-full shadow-[0_8px_24px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <TicketIcon className="w-5 h-5" />
                  <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : `রেজিস্ট্রেশন কনফার্ম করুন (টাকা ${totalAmount}/-)`}</span>
                </button>
                </div>
              </div>
            </form>
            </div>
          </>
        )}
      </div>

      {cropSrc && (
        <PhotoCropModal
          imageSrc={cropSrc}
          onConfirm={(cropped) => {
            setPhotoUrl(cropped);
            setPhotoPreview(cropped);
            closeCropper();
          }}
          onCancel={() => closeCropper(!photoPreview)}
        />
      )}
    </div>
  );
}
