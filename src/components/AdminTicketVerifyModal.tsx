import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Ticket } from '../types';
import { EVENT_DETAILS } from '../data/eventData';
import { X, Search, ShieldCheck, CheckCircle2, User, Phone, Sparkles, AlertCircle, Camera, CameraOff, Upload, QrCode, RefreshCw } from 'lucide-react';

interface AdminTicketVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  registeredTickets: Ticket[];
}

export default function AdminTicketVerifyModal({ isOpen, onClose, registeredTickets }: AdminTicketVerifyModalProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedTicket, setSearchedTicket] = useState<Ticket | null>(null);
  const [entryChecked, setEntryChecked] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // Camera scanner states
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Demo fallback tickets for verification testing
  const demoTickets: Ticket[] = [
    {
      ticketId: 'GB2026-1001',
      fullName: 'রেজাউল করিম (ক্যাপ্টেন)',
      starMakerId: '@GaanBristy_Captain',
      phone: '01761870650',
      adultCount: 2,
      kidCount: 1,
      totalAmount: 5000,
      paymentMethod: 'bKash',
      transactionId: 'BK109283746',
      status: 'Confirmed',
      issueDate: '2026-07-20',
      seatNumbers: ['VIP-01', 'VIP-02', 'VIP-03']
    },
    {
      ticketId: 'GB2026-2045',
      fullName: 'সামিহা ইসলাম',
      starMakerId: '@Samiha_Melody',
      phone: '01812345678',
      adultCount: 1,
      kidCount: 0,
      totalAmount: 2000,
      paymentMethod: 'Nagad',
      transactionId: 'NG88273615',
      status: 'Confirmed',
      issueDate: '2026-07-22',
      seatNumbers: ['G-12']
    }
  ];

  const allTickets = [...registeredTickets, ...demoTickets];

  const verifyTicketId = (rawCode: string) => {
    setSearchError('');
    setCameraError('');
    setEntryChecked(false);

    let codeToSearch = rawCode.trim();

    // Check if code is JSON formatted
    try {
      const parsed = JSON.parse(rawCode);
      if (parsed && parsed.ticketId) {
        codeToSearch = parsed.ticketId;
      }
    } catch {
      // Raw string code
    }

    const found = allTickets.find(
      t => t.ticketId.toLowerCase() === codeToSearch.toLowerCase() ||
           t.phone === codeToSearch ||
           t.starMakerId.toLowerCase() === codeToSearch.toLowerCase()
    );

    if (found) {
      setSearchedTicket(found);
      setSearchQuery(found.ticketId);
      // Play subtle success feedback sound
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } catch {
        // AudioContext not supported or restricted
      }
    } else {
      setSearchedTicket(null);
      setSearchError(`ইনভ্যালিড বা অজানা টিকিট স্ক্যান করা হয়েছে: "${codeToSearch}"`);
    }
  };

  const startCameraScanner = async () => {
    setCameraError('');
    setIsScanning(true);

    try {
      // Ensure target element is mounted
      setTimeout(async () => {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode("qr-reader");
        }

        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          // Prefer back camera if available
          const backCamera = cameras.find(c => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('rear')) || cameras[cameras.length - 1];

          await scannerRef.current.start(
            backCamera.id,
            {
              fps: 10,
              qrbox: { width: 220, height: 220 }
            },
            (decodedText) => {
              verifyTicketId(decodedText);
              stopCameraScanner();
            },
            () => {
              // Ignore per-frame scan failures
            }
          );
        } else {
          setCameraError('কোনো ক্যামেরা ডিভাইস খুঁজে পাওয়া যায়নি!');
          setIsScanning(false);
        }
      }, 100);
    } catch (err: unknown) {
      console.error(err);
      setCameraError('ক্যামেরা চালু করা সম্ভব হয়নি! ব্রাউজার পারমিশন চেক করুন অথবা ফাইল আপলোড অপশনটি ব্যবহার করুন।');
      setIsScanning(false);
    }
  };

  const stopCameraScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Error stopping scanner", err);
      }
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader-file");
      }
      const decodedText = await scannerRef.current.scanFile(file, true);
      verifyTicketId(decodedText);
    } catch (err) {
      console.error(err);
      setSearchError('ছবিতে কোনো QR কোড খুঁজে পাওয়া যায়নি! স্পষ্ট ছবি আপলোড করুন।');
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError('টিকিট নম্বর বা মোবাইল নম্বর ইনপুট করুন');
      return;
    }
    verifyTicketId(searchQuery);
  };

  const handleModalClose = () => {
    stopCameraScanner();
    onClose();
  };

  useEffect(() => {
    return () => {
      stopCameraScanner();
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F0C1A]/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#1C1730] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 shadow-2xl text-[#F6EFE0] my-8">
        
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#0F0C1A] text-[#B3A6C9] hover:text-[#F6EFE0] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#7A1F3D]/60 text-[#F0D78C] rounded-2xl border border-[#D4AF37]/40">
            <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-[#F0D78C] flex items-center gap-2">
              <span>এন্ট্রি গেট টিকিট যাচাইকরণ</span>
              <span className="bg-[#7A1F3D] text-[#F0D78C] text-[10px] font-mono px-2 py-0.5 rounded border border-[#D4AF37]/40">Admin Gate</span>
            </h2>
            <p className="text-xs text-[#B3A6C9] font-body">
              গুলশান ক্লাব গেটে অতিথির টিকিট লাইভ ক্যামেরা দিয়ে স্ক্যান বা ম্যানুয়াল আইডি দিয়ে সার্চ করুন
            </p>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-[#0F0C1A] p-1.5 rounded-2xl border border-[#D4AF37]/30 mb-6 font-body">
          <button
            onClick={() => {
              setActiveTab('camera');
              setSearchError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'camera'
                ? 'gold-gradient-btn text-[#0F0C1A] shadow-md'
                : 'text-[#B3A6C9] hover:text-[#F6EFE0]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>ক্যামেরা QR স্ক্যানার</span>
          </button>

          <button
            onClick={() => {
              stopCameraScanner();
              setActiveTab('manual');
              setSearchError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'manual'
                ? 'gold-gradient-btn text-[#0F0C1A] shadow-md'
                : 'text-[#B3A6C9] hover:text-[#F6EFE0]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>ম্যানুয়াল সার্চ</span>
          </button>
        </div>

        {/* TAB 1: Camera Scanner */}
        {activeTab === 'camera' && (
          <div className="space-y-4 mb-6 font-body">
            <div className="bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-2xl p-4 text-center relative overflow-hidden">
              
              {/* Hidden file scanner container */}
              <div id="qr-reader-file" className="hidden"></div>

              {!isScanning ? (
                <div className="py-6 flex flex-col items-center space-y-4">
                  <div className="p-4 bg-[#7A1F3D]/40 rounded-full border border-[#D4AF37]/40 text-[#D4AF37]">
                    <QrCode className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#F0D78C]">লাইভ ক্যামেরা স্ক্যানার রেডি</h3>
                    <p className="text-xs text-[#B3A6C9] mt-1 max-w-xs mx-auto">
                      অতিথির ই-টিকিটের QR কোডটি ফ্রন্ট বা ব্যাক ক্যামেরার সামনে ধরুন
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={startCameraScanner}
                      className="px-5 py-2.5 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl text-xs transition flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-[#0F0C1A]" />
                      <span>ক্যামেরা চালু করুন</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2.5 bg-[#1C1730] hover:bg-[#1C1730]/80 text-[#F6EFE0] font-medium rounded-xl text-xs transition flex items-center gap-2 border border-[#D4AF37]/40 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-[#D4AF37]" />
                      <span>টিকিট ইমেজ আপলোড</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative w-full max-w-xs mx-auto rounded-xl overflow-hidden border-2 border-[#D4AF37] shadow-xl bg-black">
                    <div id="qr-reader" className="w-full"></div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={stopCameraScanner}
                      className="px-4 py-2 bg-[#7A1F3D] hover:bg-[#7A1F3D]/80 text-[#F0D78C] font-bold rounded-xl text-xs transition flex items-center gap-1.5 border border-[#D4AF37]/40 cursor-pointer"
                    >
                      <CameraOff className="w-4 h-4" />
                      <span>ক্যামেরা বন্ধ করুন</span>
                    </button>
                  </div>
                </div>
              )}

              {cameraError && (
                <p className="text-xs text-[#F0D78C] bg-[#7A1F3D]/40 p-2.5 rounded-xl border border-[#D4AF37]/30 mt-3">
                  {cameraError}
                </p>
              )}

            </div>
          </div>
        )}

        {/* TAB 2: Manual Search Form */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSearch} className="mb-6 space-y-3 font-body">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#B3A6C9]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="টিকিট আইডি (যেমন: GB2026-1001) বা মোবাইল নম্বর লিখুন..."
                className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-3 text-sm text-[#F6EFE0] font-mono outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl transition text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#0F0C1A]" />
              <span>টিকিট ম্যানুয়ালি সার্চ করুন</span>
            </button>
          </form>
        )}

        {/* Search / Scan Error Message */}
        {searchError && (
          <div className="p-3.5 bg-[#7A1F3D]/60 border border-[#D4AF37]/40 text-[#F6EFE0] rounded-xl text-xs flex items-center gap-2 mb-4 font-body">
            <AlertCircle className="w-4 h-4 text-[#F0D78C] shrink-0" />
            <span>{searchError}</span>
          </div>
        )}

        {/* Searched / Scanned Result Card */}
        {searchedTicket && (
          <div className="bg-[#0F0C1A] border-2 border-[#D4AF37] rounded-2xl p-5 space-y-4 shadow-2xl relative overflow-hidden font-body">
            <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#0F0C1A] font-black text-[10px] px-3 py-1 rounded-bl-xl uppercase font-mono">
              Verified Ticket
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-[#D4AF37]/30">
              <div className="flex items-center gap-1.5 text-xs text-[#F0D78C] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>বৈধ টিকিট (VALID VIP TICKET)</span>
              </div>
              <span className="font-mono text-[#F0D78C] font-bold text-xs bg-[#7A1F3D]/60 px-2.5 py-0.5 rounded border border-[#D4AF37]/40">
                {searchedTicket.ticketId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[#B3A6C9] block">অতিথির নাম:</span>
                <span className="font-bold text-[#F6EFE0] text-sm">{searchedTicket.fullName}</span>
              </div>

              <div>
                <span className="text-[#B3A6C9] block">স্টারমেকার আইডি:</span>
                <span className="font-bold text-[#F0D78C]">{searchedTicket.starMakerId}</span>
              </div>

              <div>
                <span className="text-[#B3A6C9] block">মোবাইল:</span>
                <span className="font-mono text-[#F6EFE0]">{searchedTicket.phone}</span>
              </div>

              <div>
                <span className="text-[#B3A6C9] block">আসন সংখ্যা:</span>
                <span className="font-bold text-[#F6EFE0]">Adult ({searchedTicket.adultCount}), Kid ({searchedTicket.kidCount})</span>
              </div>
            </div>

            <div className="p-3 bg-[#1C1730] border border-[#D4AF37]/20 rounded-xl flex items-center justify-between text-xs">
              <span className="text-[#B3A6C9]">পরিশোধিত টাকা:</span>
              <span className="font-extrabold text-[#F0D78C] font-serif text-sm">{searchedTicket.totalAmount}/- টাকা</span>
            </div>

            {/* Check-in Gate Action */}
            <div className="pt-2 flex gap-3">
              {entryChecked ? (
                <div className="w-full p-3 bg-[#7A1F3D]/60 text-[#F0D78C] border border-[#D4AF37]/50 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                  <span>গেটে প্রবেশ সম্পন্ন হয়েছে! (ENTRY GRANTED)</span>
                </div>
              ) : (
                <button
                  onClick={() => setEntryChecked(true)}
                  className="w-full py-3.5 gold-gradient-btn text-[#0F0C1A] font-black rounded-xl text-xs transition shadow-md cursor-pointer"
                >
                  গেটে প্রবেশ নিশ্চিত করুন (MARK ENTRANCE)
                </button>
              )}

              <button
                onClick={() => {
                  setSearchedTicket(null);
                  if (activeTab === 'camera') startCameraScanner();
                }}
                className="px-3.5 py-3 bg-[#1C1730] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-[#F6EFE0] rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1 cursor-pointer"
                title="পরবর্তী স্ক্যান"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>পরবর্তী</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

