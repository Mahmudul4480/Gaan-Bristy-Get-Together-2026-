import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Ticket } from '../types';
import { EVENT_DETAILS, LOGO_URL } from '../data/eventData';
import { saveHonorableGuest } from '../utils/guestStorage';
import { notifyAdminPaymentComplete } from '../utils/notifyAdminPayment';
import { compressPhotoFile, validatePhotoFile } from '../utils/photoUpload';
import HonorableGuestCard from './HonorableGuestCard';
import {
  X,
  CheckCircle2,
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
} from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated?: (ticket: Ticket) => void;
}

export default function RegistrationModal({ isOpen, onClose, onTicketCreated }: RegistrationModalProps) {
  const [fullName, setFullName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [starMakerId, setStarMakerId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [adultCount, setAdultCount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer'>('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [songRequest, setSongRequest] = useState('');

  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const totalAmount = adultCount * EVENT_DETAILS.feeAdult;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(EVENT_DETAILS.bkashNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validatePhotoFile(file);
    if (validationError) {
      setErrors((prev) => ({ ...prev, photo: validationError }));
      return;
    }

    try {
      const compressed = await compressPhotoFile(file);
      setPhotoUrl(compressed);
      setPhotoPreview(compressed);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.photo;
        return next;
      });
    } catch {
      setErrors((prev) => ({ ...prev, photo: 'ছবি আপলোড করতে সমস্যা হয়েছে' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'অনুগ্রহ করে আপনার পুরো নাম লিখুন';
    if (!familyName.trim()) newErrors.familyName = 'StarMaker Family Name প্রয়োজন';
    if (!phone.trim() || phone.length < 11) newErrors.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন';
    if (!transactionId.trim()) newErrors.transactionId = 'পেমেন্ট ট্রানজেকশন আইডি প্রদান করুন';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
      status: 'Confirmed',
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

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F0D78C', '#7A1F3D', '#F6EFE0'],
      });

      setCreatedTicket(newTicket);
      onTicketCreated?.(newTicket);
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
                <CheckCircle2 className="w-6 h-6 text-[#F0D78C]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F6EFE0] font-serif">
                অভিনন্দন! Honorable Guest Card তৈরি হয়েছে
              </h2>
              <p className="text-sm text-[#B3A6C9] mt-1 font-body">
                আপনার কার্ড ওয়েবসাইটে স্থায়ীভাবে সংরক্ষিত। QR স্ক্যান করলে সরাসরি এখানে আসবেন।
              </p>
            </div>

            <HonorableGuestCard ticket={createdTicket} showQr />

            <div className="text-center mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    document.getElementById('honorable-guests')?.scrollIntoView({ behavior: 'smooth' });
                  }, 300);
                }}
                className="px-6 py-3 bg-[#7A1F3D] border-2 border-[#D4AF37] text-[#F0D78C] hover:text-[#F6EFE0] rounded-full text-sm font-extrabold transition shadow-md cursor-pointer"
              >
                Honorable Guest Section-এ দেখুন
              </button>
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
                    <label className="block text-xs font-semibold text-[#F6EFE0] mb-1.5">
                      Name (নাম) *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="যেমন: তানভীর আহমেদ"
                      className="w-full bg-[#1C1730] border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-[#F6EFE0] outline-none transition"
                    />
                    {errors.fullName && <p className="text-xs text-[#A52C54] mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F6EFE0] mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                      StarMaker Family Name *
                    </label>
                    <input
                      type="text"
                      value={familyName}
                      onChange={(e) => setFamilyName(e.target.value)}
                      placeholder="যেমন: Gaan Bristy Royals"
                      className="w-full bg-[#1C1730] border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-[#F6EFE0] outline-none transition"
                    />
                    {errors.familyName && <p className="text-xs text-[#A52C54] mt-1">{errors.familyName}</p>}
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
                      <label className="block text-xs font-semibold text-[#F6EFE0] mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Mobile No *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="017xxxxxxxx"
                        className="w-full bg-[#1C1730] border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-[#F6EFE0] outline-none transition font-mono"
                      />
                      {errors.phone && <p className="text-xs text-[#A52C54] mt-1">{errors.phone}</p>}
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
                  ভালো কোয়ালিটির ছবি দিন — পরিষ্কার, সামনের দিকে তাকানো, মুখ স্পষ্ট দেখা যায় এমন।
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-28 h-32 object-cover rounded-xl border-2 border-[#D4AF37]/60 shadow-md" />
                  ) : (
                    <div className="w-28 h-32 rounded-xl border-2 border-dashed border-[#D4AF37]/45 bg-[#1C1730] flex flex-col items-center justify-center text-[#B3A6C9] text-[10px] text-center px-2 gap-1">
                      <ImageIcon className="w-6 h-6 text-[#D4AF37]/60" />
                      <span>কোনো ছবি নেই</span>
                    </div>
                  )}
                  <label className="flex-1 w-full cursor-pointer">
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    <span className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 bg-[#7A1F3D]/40 border border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-xl text-sm font-semibold text-[#F0D78C] transition">
                      <Camera className="w-4 h-4" />
                      ছবি বেছে নিন
                    </span>
                  </label>
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
                  <label className="block text-xs font-semibold text-[#F6EFE0] mb-1">Transaction ID (TrxID) *</label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="যেমন: BK109283746"
                    className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm text-[#F6EFE0] font-mono outline-none transition"
                  />
                  {errors.transactionId && <p className="text-xs text-[#A52C54] mt-1">{errors.transactionId}</p>}
                  <p className="text-[10px] text-[#B3A6C9] mt-1">TrxID দিলে কার্ডে barcode সহ Honorable Guest Card তৈরি হবে</p>
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

              <div className="flex flex-col sm:flex-row gap-3 pt-1 pb-1">
                {errors.submit && (
                  <p className="w-full text-xs text-[#A52C54] bg-[#7A1F3D]/30 border border-[#A52C54]/50 rounded-xl px-4 py-2.5">
                    {errors.submit}
                  </p>
                )}
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
            </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
