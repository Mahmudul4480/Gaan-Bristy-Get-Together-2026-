import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Ticket } from '../types';
import { EVENT_DETAILS } from '../data/eventData';
import ETicketCard from './ETicketCard';
import { X, CheckCircle2, Ticket as TicketIcon, User, Phone, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated?: (ticket: Ticket) => void;
}

export default function RegistrationModal({ isOpen, onClose, onTicketCreated }: RegistrationModalProps) {
  const [fullName, setFullName] = useState('');
  const [starMakerId, setStarMakerId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [adultCount, setAdultCount] = useState(1);
  const [kidCount, setKidCount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer'>('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [songRequest, setSongRequest] = useState('');
  
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const totalAmount = (adultCount * EVENT_DETAILS.feeAdult) + (kidCount * EVENT_DETAILS.feeKid);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(EVENT_DETAILS.bkashNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'অনুগ্রহ করে আপনার পুরো নাম লিখুন';
    if (!starMakerId.trim()) newErrors.starMakerId = 'স্টারমেকার আইডি প্রয়োজন';
    if (!phone.trim() || phone.length < 11) newErrors.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন';
    if (!transactionId.trim()) newErrors.transactionId = 'পেমেন্ট ট্রানজেকশন আইডি প্রদান করুন';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate random Ticket ID
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newTicket: Ticket = {
      ticketId: `GB2026-${randomCode}`,
      fullName,
      starMakerId,
      phone,
      email,
      adultCount,
      kidCount,
      totalAmount,
      paymentMethod,
      transactionId,
      status: 'Confirmed',
      issueDate: new Date().toISOString(),
      seatNumbers: Array.from({ length: adultCount + kidCount }, (_, i) => `VIP-${100 + randomCode + i}`),
    };

    // Confetti effect!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    setCreatedTicket(newTicket);
    if (onTicketCreated) {
      onTicketCreated(newTicket);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If ticket generated, show E-Ticket */}
        {createdTicket ? (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 p-3 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-400/40 mb-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
                অভিনন্দন! আপনার টিকিট বুকিং সফল হয়েছে
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                নিচে আপনার অফিসিয়াল ভিআইপি এন্ট্রি টিকিট ডাউনলোড বা প্রিন্ট করে রাখুন।
              </p>
            </div>

            <ETicketCard ticket={createdTicket} onClose={onClose} />

            <div className="text-center mt-6">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/30">
                <TicketIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-serif text-white">
                  অনলাইন টিকিট রেজিস্ট্রেশন
                </h2>
                <p className="text-xs text-slate-400">
                  Gaan Bristy Grand Get-Together 2026 • Gulshan Club
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>পূর্ণ নাম (Full Name) *</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="যেমন: তানভীর আহমেদ"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition"
                  />
                  {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>স্টারমেকার নাম / আইডি (StarMaker ID) *</span>
                  </label>
                  <input
                    type="text"
                    value={starMakerId}
                    onChange={(e) => setStarMakerId(e.target.value)}
                    placeholder="যেমন: @GB_Tanveer"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition"
                  />
                  {errors.starMakerId && <p className="text-xs text-red-400 mt-1">{errors.starMakerId}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>মোবাইল নম্বর (হোয়াটসঅ্যাপ সহ) *</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition font-mono"
                  />
                  {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition"
                  />
                </div>
              </div>

              {/* Ticket Quantity Counters */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-4">
                <h3 className="text-sm font-bold text-amber-300 font-serif">টিকিট সংখ্যা নির্বাচন</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Adult (প্রাপ্তবয়স্ক)</p>
                    <p className="text-xs text-slate-400">প্রতি জন {EVENT_DETAILS.feeAdult}/- টাকা</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-base font-bold text-amber-400 w-6 text-center">{adultCount}</span>
                    <button
                      type="button"
                      onClick={() => setAdultCount(adultCount + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-900">
                  <div>
                    <p className="text-sm font-semibold text-white">Kid (শিশু)</p>
                    <p className="text-xs text-slate-400">প্রতি শিশু {EVENT_DETAILS.feeKid}/- টাকা</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setKidCount(Math.max(0, kidCount - 1))}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-base font-bold text-blue-400 w-6 text-center">{kidCount}</span>
                    <button
                      type="button"
                      onClick={() => setKidCount(kidCount + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-300">মোট মূল্য:</span>
                  <span className="text-xl font-extrabold text-amber-400 font-serif">{totalAmount}/- টাকা</span>
                </div>
              </div>

              {/* Payment Instructions & Transaction ID */}
              <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 uppercase">পেমেন্ট করার নিয়ম</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bKash')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${paymentMethod === 'bKash' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      bKash
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Nagad')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${paymentMethod === 'Nagad' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Nagad
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Rocket')}
                      className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${paymentMethod === 'Rocket' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                    >
                      Rocket
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-amber-500/20 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400">বিকাশ/নগদ/রকেট নম্বর: </span>
                    <span className="font-bold text-amber-300 font-mono text-base">{EVENT_DETAILS.bkashNumber}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg text-xs"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    পেমেন্ট ট্রানজেকশন আইডি (TrxID) *
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="যেমন: BK109283746"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none transition"
                  />
                  {errors.transactionId && <p className="text-xs text-red-400 mt-1">{errors.transactionId}</p>}
                </div>
              </div>

              {/* Song Request */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  আনপ্লাগড সেশনে আপনার পছন্দের গান গাওয়ার অনুরোধ বা বার্তা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={songRequest}
                  onChange={(e) => setSongRequest(e.target.value)}
                  placeholder="আপনার প্রিয় গানের নাম লিখুন..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-base rounded-2xl transition shadow-xl flex items-center justify-center gap-2"
              >
                <TicketIcon className="w-5 h-5" />
                <span>বুকিং কনফার্ম করুন (টাকা {totalAmount}/-)</span>
              </button>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
