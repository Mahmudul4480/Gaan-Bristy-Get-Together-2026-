import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Ticket } from '../types';
import { LOGO_URL, EVENT_DETAILS } from '../data/eventData';
import { Printer, Share2, CheckCircle2, MapPin, Calendar, Clock, User, Phone, Sparkles, FileText, Loader2 } from 'lucide-react';

interface ETicketCardProps {
  ticket: Ticket;
  onClose?: () => void;
}

export default function ETicketCard({ ticket }: ETicketCardProps) {
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!ticketRef.current) return;
    setIsGeneratingPDF(true);

    try {
      const element = ticketRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#0F0C1A',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png', 1.0);

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const pdfWidth = 210;
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`Gaan_Bristy_Ticket_${ticket.ticketId}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('PDF তৈরিতে সাময়িক সমস্যা হয়েছে, দয়া করে পুনরায় চেষ্টা করুন বা প্রিন্ট অপশনটি ব্যবহার করুন।');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `🎉 আমার "Gaan Bristy Grand Get-Together 2026" ইভেন্টের টিকিট কনফার্ম হয়েছে!\n\n🎟️ টিকিট আইডি: ${ticket.ticketId}\n👤 নাম: ${ticket.fullName}\n📍 ভেন্যু: গুলশান ক্লাব, ঢাকা\n📅 তারিখ: ১৯ সেপ্টেম্বর ২০২৬ (সন্ধ্যা ৭:০০)\n\nঅন্যদের সাথে শেয়ার করুন: ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div id="eticket-modal-container" className="max-w-2xl mx-auto my-4 text-[#F6EFE0]">
      
      {/* Printable Card Area */}
      <div 
        ref={ticketRef}
        id="printable-ticket"
        className="relative bg-[#1C1730] text-[#F6EFE0] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden print:border-[#D4AF37] print:text-black print:bg-white"
      >
        {/* Subtle Watermark Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <img src={LOGO_URL} alt="Watermark" className="w-96 h-96 object-contain opacity-5" />
        </div>

        {/* Top VIP Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-[#D4AF37]/30 gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={LOGO_URL} 
              alt="Logo" 
              className="w-16 h-16 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.35)]"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#F0D78C] font-extrabold text-lg font-serif">গান বৃষ্টি ফ্যামিলি</span>
                <span className="bg-[#7A1F3D] text-[#F0D78C] text-[10px] font-bold px-2 py-0.5 rounded border border-[#D4AF37]/40 font-mono">VIP PASS</span>
              </div>
              <h2 className="text-xl font-black font-english-heading text-[#F0D78C] tracking-tight">
                {EVENT_DETAILS.title}
              </h2>
              <p className="text-xs text-[#B3A6C9] font-serif italic">"{EVENT_DETAILS.tagline}"</p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="inline-flex items-center gap-1 bg-[#7A1F3D]/60 text-[#F0D78C] border border-[#D4AF37]/40 text-xs font-bold px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{ticket.status === 'Confirmed' ? 'কনফার্মড টিকিট' : 'পেন্ডিং ভেরিফিকেশন'}</span>
            </div>
            <p className="text-[11px] font-mono text-[#B3A6C9] mt-1">
              আইডি: <span className="text-[#F0D78C] font-bold">{ticket.ticketId}</span>
            </p>
          </div>
        </div>

        {/* Event Schedule & Venue Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5 p-3.5 bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-2xl text-xs font-body">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <div>
              <p className="text-[#B3A6C9]">তারিখ</p>
              <p className="font-bold text-[#F6EFE0]">{EVENT_DETAILS.dateBengali}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <div>
              <p className="text-[#B3A6C9]">সময়</p>
              <p className="font-bold text-[#F6EFE0]">{EVENT_DETAILS.timeBengali}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <div>
              <p className="text-[#B3A6C9]">ভেন্যু</p>
              <p className="font-bold text-[#F0D78C]">{EVENT_DETAILS.venueNameBengali}</p>
            </div>
          </div>
        </div>

        {/* Ticket Holder Details & QR Code Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center my-6">
          
          <div className="md:col-span-2 space-y-2.5 text-sm font-body">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#B3A6C9] font-medium">অতিথির নাম:</span>
              <span className="font-bold text-[#F6EFE0] text-base">{ticket.fullName}</span>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#B3A6C9] font-medium">ফ্যামিলি:</span>
              <span className="font-bold text-[#F0D78C]">{ticket.familyName}</span>
            </div>

            {ticket.starMakerId && (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#B3A6C9] font-medium">স্টারমেকার আইডি:</span>
                <span className="font-bold text-[#F0D78C]">{ticket.starMakerId}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#B3A6C9] font-medium">মোবাইল নম্বর:</span>
              <span className="font-mono text-[#F6EFE0]">{ticket.phone}</span>
            </div>

            <div className="pt-2 border-t border-[#D4AF37]/20 flex flex-wrap gap-4 text-xs">
              <div>
                <span className="text-[#B3A6C9]">Adult (জন): </span>
                <span className="font-bold text-[#F6EFE0]">{ticket.adultCount} x ২০০০ = {ticket.adultCount * 2000} tk</span>
              </div>
              {ticket.kidCount > 0 && (
                <div>
                  <span className="text-[#B3A6C9]">Kid (জন): </span>
                  <span className="font-bold text-[#F6EFE0]">{ticket.kidCount} x ১০০০ = {ticket.kidCount * 1000} tk</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between bg-[#7A1F3D]/40 border border-[#D4AF37]/30 p-2.5 rounded-xl">
              <span className="text-xs text-[#F6EFE0] font-bold">মোট পরিশোধিত টাকা:</span>
              <span className="text-lg font-black text-[#F0D78C] font-serif">{ticket.totalAmount}/- টাকা</span>
            </div>
          </div>

          {/* QR Code & Scan Box */}
          <div className="flex flex-col items-center justify-center bg-[#0F0C1A] border border-[#D4AF37]/30 p-4 rounded-2xl text-center shadow-inner">
            <div className="p-2.5 bg-white rounded-xl shadow-md mb-2 flex flex-col items-center">
              <QRCodeSVG 
                value={ticket.ticketId} 
                size={110}
                level="H"
                includeMargin={false}
              />
              <span className="text-[10px] font-mono font-bold text-[#0F0C1A] mt-1.5 bg-[#D4AF37] px-2 py-0.5 rounded">
                {ticket.ticketId}
              </span>
            </div>
            <p className="text-[10px] text-[#B3A6C9]">গেটে স্ক্যান এর জন্য এই QR কোডটি প্রদর্শন করুন</p>
          </div>

        </div>

        {/* Ticket Footer Instructions */}
        <div className="pt-4 border-t border-dashed border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#B3A6C9] gap-2">
          <p>📌 অনুগ্রহ করে ইভেন্টের দিন সন্ধ্যা ৭:০০ টার মধ্যে লাল গালিচায় উপস্থিত থাকুন।</p>
          <p className="font-mono text-[#F0D78C]">SocialMediaCareing.com</p>
        </div>

      </div>

      {/* Action Buttons for Printing / PDF Download / Sharing */}
      <div id="ticket-actions" className="flex flex-wrap items-center justify-center gap-3 mt-6 print:hidden font-body">
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="flex items-center gap-2 gold-gradient-btn disabled:opacity-70 text-[#0F0C1A] font-black px-6 py-3 rounded-full shadow-xl transition text-sm cursor-pointer"
        >
          {isGeneratingPDF ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#0F0C1A]" />
              <span>PDF তৈরি হচ্ছে...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 text-[#0F0C1A]" />
              <span>PDF ডাউনলোড করুন (Download PDF)</span>
            </>
          )}
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#1C1730] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#F6EFE0] font-bold px-5 py-3 rounded-full shadow-lg transition text-sm cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#D4AF37]" />
          <span>প্রিন্ট করুন</span>
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="flex items-center gap-2 bg-[#7A1F3D] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#F0D78C] font-bold px-5 py-3 rounded-full shadow-lg transition text-sm cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>হোয়াটসঅ্যাপে শেয়ার</span>
        </button>
      </div>

    </div>
  );
}

