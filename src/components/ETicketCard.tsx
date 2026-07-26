import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Ticket } from '../types';
import { LOGO_URL, EVENT_DETAILS } from '../data/eventData';
import { Printer, Share2, CheckCircle2, MapPin, Calendar, Clock, User, Phone, Sparkles } from 'lucide-react';

interface ETicketCardProps {
  ticket: Ticket;
  onClose?: () => void;
}

export default function ETicketCard({ ticket }: ETicketCardProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `🎉 আমার "Gaan Bristy Grand Get-Together 2026" ইভেন্টের টিকিট কনফার্ম হয়েছে!\n\n🎟️ টিকিট আইডি: ${ticket.ticketId}\n👤 নাম: ${ticket.fullName}\n📍 ভেন্যু: গুলশান ক্লাব, ঢাকা\n📅 তারিখ: ২০ সেপ্টেম্বর ২০২৬ (সন্ধ্যা ৭:০০)\n\nঅন্যদের সাথে শেয়ার করুন: ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div id="eticket-modal-container" className="max-w-2xl mx-auto my-4 text-slate-900">
      
      {/* Printable Card Area */}
      <div 
        ref={ticketRef}
        id="printable-ticket"
        className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden print:border-amber-600 print:text-black print:bg-white"
      >
        {/* Subtle Watermark Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <img src={LOGO_URL} alt="Watermark" className="w-96 h-96 object-cover rounded-full" />
        </div>

        {/* Top VIP Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-amber-500/30 gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={LOGO_URL} 
              alt="Logo" 
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-extrabold text-lg font-serif">গান বৃষ্টি ফ্যামিলি</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-400/40">VIP PASS</span>
              </div>
              <h2 className="text-xl font-black font-serif text-white tracking-tight">
                {EVENT_DETAILS.title}
              </h2>
              <p className="text-xs text-amber-300/90 font-serif italic">"{EVENT_DETAILS.tagline}"</p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{ticket.status === 'Confirmed' ? 'কনফার্মড টিকিট' : 'পেন্ডিং ভেরিফিকেশন'}</span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 mt-1">
              আইডি: <span className="text-amber-300 font-bold">{ticket.ticketId}</span>
            </p>
          </div>
        </div>

        {/* Event Schedule & Venue Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5 p-3.5 bg-slate-900/80 border border-amber-500/20 rounded-2xl text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-slate-400">তারিখ</p>
              <p className="font-bold text-slate-100">{EVENT_DETAILS.dateBengali}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-slate-400">সময়</p>
              <p className="font-bold text-slate-100">{EVENT_DETAILS.timeBengali}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-slate-400">ভেন্যু</p>
              <p className="font-bold text-amber-300">{EVENT_DETAILS.venueNameBengali}</p>
            </div>
          </div>
        </div>

        {/* Ticket Holder Details & QR Code Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center my-6">
          
          <div className="md:col-span-2 space-y-2.5 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 font-medium">অতিথির নাম:</span>
              <span className="font-bold text-white text-base">{ticket.fullName}</span>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 font-medium">স্টারমেকার আইডি:</span>
              <span className="font-bold text-amber-300">{ticket.starMakerId}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 font-medium">মোবাইল নম্বর:</span>
              <span className="font-mono text-slate-200">{ticket.phone}</span>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-4 text-xs">
              <div>
                <span className="text-slate-400">Adult (জন): </span>
                <span className="font-bold text-white">{ticket.adultCount} x ২০০০ = {ticket.adultCount * 2000} tk</span>
              </div>
              {ticket.kidCount > 0 && (
                <div>
                  <span className="text-slate-400">Kid (জন): </span>
                  <span className="font-bold text-white">{ticket.kidCount} x ১০০০ = {ticket.kidCount * 1000} tk</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl">
              <span className="text-xs text-amber-200 font-bold">মোট পরিশোধিত টাকা:</span>
              <span className="text-lg font-black text-amber-300 font-serif">{ticket.totalAmount}/- টাকা</span>
            </div>
          </div>

          {/* QR Code & Scan Box */}
          <div className="flex flex-col items-center justify-center bg-slate-900 border border-amber-500/30 p-4 rounded-2xl text-center shadow-inner">
            {/* Real QR Code Generator */}
            <div className="p-2.5 bg-white rounded-xl shadow-md mb-2 flex flex-col items-center">
              <QRCodeSVG 
                value={ticket.ticketId} 
                size={110}
                level="H"
                includeMargin={false}
              />
              <span className="text-[10px] font-mono font-bold text-slate-950 mt-1.5 bg-amber-300 px-2 py-0.5 rounded">
                {ticket.ticketId}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">গেটে স্ক্যান এর জন্য এই QR কোডটি প্রদর্শন করুন</p>
          </div>

        </div>

        {/* Ticket Footer Instructions */}
        <div className="pt-4 border-t border-dashed border-amber-500/30 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>📌 অনুগ্রহ করে ইভেন্টের দিন সন্ধ্যা ৭:০০ টার মধ্যে লাল গালিচায় উপস্থিত থাকুন।</p>
          <p className="font-mono text-amber-300">SocialMediaCareing.com</p>
        </div>

      </div>

      {/* Action Buttons for Printing / Sharing */}
      <div id="ticket-actions" className="flex flex-wrap items-center justify-center gap-3 mt-6 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition text-sm"
        >
          <Printer className="w-4 h-4" />
          <span>প্রিন্ট / ডাউনলোড করুন</span>
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition text-sm"
        >
          <Share2 className="w-4 h-4" />
          <span>হোয়াটসঅ্যাপে শেয়ার করুন</span>
        </button>
      </div>

    </div>
  );
}
