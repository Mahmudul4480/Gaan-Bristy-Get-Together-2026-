import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Ticket } from '../types';
import GateLoginGate from './GateLoginGate';
import { getGateActorName, isGateSessionActive, setGateSession } from '../utils/gateStorage';
import { saveHonorableGuest } from '../utils/guestStorage';
import { getPaymentKind, paymentKindLabel } from '../utils/paymentKind';
import { checkedInGuests, formatCheckInTime, invitedGuests } from '../utils/checkInStats';
import {
  Camera,
  CameraOff,
  Upload,
  QrCode,
  RefreshCw,
  Search,
  AlertCircle,
  CheckCircle2,
  LogOut,
  Loader2,
  Users,
  ShieldAlert,
  XCircle,
  ScanLine,
} from 'lucide-react';

interface GateScannerAppProps {
  guests: Ticket[];
  guestsLoaded: boolean;
}

export default function GateScannerApp({ guests, guestsLoaded }: GateScannerAppProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isGateSessionActive());
  const [activeTab, setActiveTab] = useState<'camera' | 'manual'>('camera');
  const [searchQuery, setSearchQuery] = useState('');
  const [scannedTicket, setScannedTicket] = useState<Ticket | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [entrySaving, setEntrySaving] = useState(false);
  const [entryError, setEntryError] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const actorName = getGateActorName();

  // Counted per card (ticket), not by adult headcount — a family card with
  // 4 adults still counts as 1 entry here.
  const invited = useMemo(() => invitedGuests(guests), [guests]);
  const enteredList = useMemo(() => checkedInGuests(guests), [guests]);

  const playBeep = (ok: boolean) => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(ok ? 880 : 220, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + (ok ? 0.18 : 0.3));
    } catch {
      // AudioContext unsupported/blocked on this device — silent fallback.
    }
  };

  const lookupTicket = (rawCode: string) => {
    setLookupError('');
    setEntryError('');

    let codeToSearch = rawCode.trim();
    try {
      const parsed = JSON.parse(rawCode);
      if (parsed && parsed.ticketId) codeToSearch = parsed.ticketId;
    } catch {
      // Not JSON — treat as a raw ticket id / phone / StarMaker id.
    }

    const found = guests.find(
      (t) =>
        t.ticketId.toLowerCase() === codeToSearch.toLowerCase() ||
        t.phone === codeToSearch ||
        (t.starMakerId && t.starMakerId.toLowerCase() === codeToSearch.toLowerCase())
    );

    if (!found) {
      setScannedTicket(null);
      setLookupError(`অজানা টিকিট বা কোড: "${codeToSearch}"`);
      playBeep(false);
      return;
    }

    setScannedTicket(found);
    setSearchQuery(found.ticketId);
    playBeep(found.status === 'Confirmed');
  };

  const startCameraScanner = async () => {
    setCameraError('');
    setIsScanning(true);
    try {
      setTimeout(async () => {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode('gate-qr-reader');
        }
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          const backCamera =
            cameras.find(
              (c) => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('rear')
            ) || cameras[cameras.length - 1];

          await scannerRef.current.start(
            backCamera.id,
            { fps: 10, qrbox: { width: 240, height: 240 } },
            (decodedText) => {
              lookupTicket(decodedText);
              stopCameraScanner();
            },
            () => {
              // Ignore per-frame scan failures.
            }
          );
        } else {
          setCameraError('কোনো ক্যামেরা খুঁজে পাওয়া যায়নি।');
          setIsScanning(false);
        }
      }, 100);
    } catch (err) {
      console.error(err);
      setCameraError('ক্যামেরা চালু করা যায়নি — পারমিশন চেক করুন অথবা ছবি আপলোড ব্যবহার করুন।');
      setIsScanning(false);
    }
  };

  const stopCameraScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('Error stopping gate scanner', err);
      }
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('gate-qr-reader-file');
      }
      const decodedText = await scannerRef.current.scanFile(file, true);
      lookupTicket(decodedText);
    } catch (err) {
      console.error(err);
      setLookupError('ছবিতে QR কোড খুঁজে পাওয়া যায়নি — স্পষ্ট ছবি আপলোড করুন।');
    }
  };

  const handleManualSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setLookupError('টিকিট নম্বর বা মোবাইল নম্বর লিখুন');
      return;
    }
    lookupTicket(searchQuery);
  };

  const handleMarkEntrance = async () => {
    if (!scannedTicket) return;
    setEntrySaving(true);
    setEntryError('');
    try {
      const updated: Ticket = {
        ...scannedTicket,
        checkedInAt: new Date().toISOString(),
        checkedInBy: actorName,
      };
      await saveHonorableGuest(updated);
      setScannedTicket(updated);
    } catch (error) {
      setEntryError(error instanceof Error ? error.message : 'এন্ট্রি সেভ করা যায়নি — আবার চেষ্টা করুন');
    } finally {
      setEntrySaving(false);
    }
  };

  const handleNext = () => {
    setScannedTicket(null);
    setLookupError('');
    setEntryError('');
    setSearchQuery('');
    if (activeTab === 'camera') startCameraScanner();
  };

  const handleLogout = () => {
    stopCameraScanner();
    setGateSession(false);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    return () => {
      stopCameraScanner();
    };
  }, []);

  if (!isAuthenticated) {
    return <GateLoginGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#0F0C1A] text-[#F6EFE0] font-sans">
      <div className="max-w-md mx-auto px-4 py-5 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-[#7A1F3D]/60 text-[#D4AF37] rounded-xl border border-[#D4AF37]/40">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[#F0D78C] font-serif leading-tight">গেট স্ক্যানার</h1>
              <p className="text-[10px] text-[#B3A6C9]">{actorName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-full bg-[#1C1730] border border-[#D4AF37]/40 text-[#B3A6C9] cursor-pointer"
            aria-label="লগআউট"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Live stats */}
        <div className="bg-[#1C1730] border border-[#D4AF37]/35 rounded-2xl p-4 mb-4 font-body">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#B3A6C9] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              প্রবেশ করেছে
            </span>
          </div>
          <p className="text-2xl font-black text-[#F0D78C] font-serif">
            {enteredList.length}
            <span className="text-sm text-[#B3A6C9] font-body font-normal"> / {invited.length} টি কার্ড</span>
          </p>
          <div className="w-full h-1.5 bg-[#0F0C1A] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F0D78C] rounded-full transition-all"
              style={{
                width: `${invited.length > 0 ? Math.min(100, (enteredList.length / invited.length) * 100) : 0}%`,
              }}
            />
          </div>
        </div>

        {!guestsLoaded && (
          <div className="flex items-center justify-center gap-2 text-xs text-[#B3A6C9] py-6">
            <Loader2 className="w-4 h-4 animate-spin" />
            গেস্ট লিস্ট লোড হচ্ছে...
          </div>
        )}

        {guestsLoaded && (
          <>
            {/* Sub tabs */}
            <div className="flex bg-[#0F0C1A] p-1.5 rounded-2xl border border-[#D4AF37]/30 mb-4 font-body">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('camera');
                  setLookupError('');
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'camera' ? 'gold-gradient-btn text-[#0F0C1A]' : 'text-[#B3A6C9]'
                }`}
              >
                <Camera className="w-4 h-4" />
                ক্যামেরা স্ক্যান
              </button>
              <button
                type="button"
                onClick={() => {
                  stopCameraScanner();
                  setActiveTab('manual');
                  setLookupError('');
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'manual' ? 'gold-gradient-btn text-[#0F0C1A]' : 'text-[#B3A6C9]'
                }`}
              >
                <Search className="w-4 h-4" />
                ম্যানুয়াল সার্চ
              </button>
            </div>

            {!scannedTicket && activeTab === 'camera' && (
              <div className="bg-[#1C1730] border border-[#D4AF37]/30 rounded-2xl p-4 text-center font-body">
                <div id="gate-qr-reader-file" className="hidden" />
                {!isScanning ? (
                  <div className="py-6 flex flex-col items-center gap-4">
                    <div className="p-4 bg-[#7A1F3D]/40 rounded-full border border-[#D4AF37]/40 text-[#D4AF37]">
                      <QrCode className="w-10 h-10" />
                    </div>
                    <p className="text-xs text-[#B3A6C9] max-w-xs">
                      অতিথির QR কোডটি ক্যামেরার সামনে ধরুন
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={startCameraScanner}
                        className="px-5 py-2.5 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        ক্যামেরা চালু করুন
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2.5 bg-[#0F0C1A] text-[#F6EFE0] rounded-xl text-xs flex items-center gap-2 border border-[#D4AF37]/40 cursor-pointer"
                      >
                        <Upload className="w-4 h-4 text-[#D4AF37]" />
                        ছবি আপলোড
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
                    <div className="relative w-full max-w-xs mx-auto rounded-xl overflow-hidden border-2 border-[#D4AF37] bg-black">
                      <div id="gate-qr-reader" className="w-full" />
                    </div>
                    <button
                      type="button"
                      onClick={stopCameraScanner}
                      className="px-4 py-2 bg-[#7A1F3D] text-[#F0D78C] rounded-xl text-xs flex items-center gap-1.5 mx-auto border border-[#D4AF37]/40 cursor-pointer"
                    >
                      <CameraOff className="w-4 h-4" />
                      ক্যামেরা বন্ধ করুন
                    </button>
                  </div>
                )}
                {cameraError && (
                  <p className="text-xs text-[#F0D78C] bg-[#7A1F3D]/40 p-2.5 rounded-xl border border-[#D4AF37]/30 mt-3">
                    {cameraError}
                  </p>
                )}
              </div>
            )}

            {!scannedTicket && activeTab === 'manual' && (
              <form onSubmit={handleManualSearch} className="space-y-3 font-body">
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#B3A6C9]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ticket ID, ফোন বা StarMaker ID"
                    className="w-full bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl pl-10 pr-4 py-3 text-sm text-[#F6EFE0] font-mono outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  সার্চ করুন
                </button>
              </form>
            )}

            {lookupError && (
              <div className="p-3.5 bg-[#7A1F3D]/60 border border-[#D4AF37]/40 rounded-xl text-xs flex items-center gap-2 mt-4 font-body">
                <AlertCircle className="w-4 h-4 text-[#F0D78C] shrink-0" />
                {lookupError}
              </div>
            )}

            {scannedTicket && (
              <div className="bg-[#1C1730] border-2 border-[#D4AF37] rounded-2xl p-4 mt-4 space-y-3 font-body">
                {scannedTicket.status !== 'Confirmed' ? (
                  <div className="p-3 bg-[#7A1F3D]/60 border border-[#A52C54]/50 rounded-xl flex items-center gap-2 text-xs">
                    <XCircle className="w-4 h-4 text-[#F0D78C] shrink-0" />
                    <span>
                      {scannedTicket.status === 'Pending'
                        ? `এখনো অ্যাপ্রুভ হয়নি (Pending) — ${scannedTicket.ticketId}`
                        : `রিজেক্ট করা হয়েছে — ${scannedTicket.ticketId}`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-[#F0D78C] font-bold pb-2 border-b border-[#D4AF37]/25">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    বৈধ কার্ড (VALID)
                    <span className="ml-auto font-mono text-[10px] bg-[#0F0C1A] px-2 py-0.5 rounded border border-[#D4AF37]/40">
                      {scannedTicket.ticketId}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#B3A6C9] block">নাম:</span>
                    <span className="font-bold text-[#F6EFE0] text-sm">{scannedTicket.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[#B3A6C9] block">Family:</span>
                    <span className="font-bold text-[#F0D78C]">{scannedTicket.familyName}</span>
                  </div>
                  <div>
                    <span className="text-[#B3A6C9] block">মোবাইল:</span>
                    <span className="font-mono text-[#F6EFE0]">{scannedTicket.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#B3A6C9] block">Adult:</span>
                    <span className="font-bold text-[#F6EFE0]">{scannedTicket.adultCount}</span>
                  </div>
                </div>

                {scannedTicket.status === 'Confirmed' && (
                  <div className="p-2.5 bg-[#0F0C1A] border border-[#D4AF37]/20 rounded-xl flex items-center justify-between text-[11px]">
                    <span className="text-[#B3A6C9]">পেমেন্ট:</span>
                    <span className="font-bold text-[#F0D78C]">{paymentKindLabel(getPaymentKind(scannedTicket))}</span>
                  </div>
                )}

                {entryError && (
                  <p className="text-xs text-[#A52C54] font-semibold">{entryError}</p>
                )}

                {scannedTicket.status === 'Confirmed' && (
                  <>
                    {scannedTicket.checkedInAt ? (
                      <div className="p-3 bg-[#7A1F3D]/50 border border-[#D4AF37]/40 rounded-xl text-xs">
                        <p className="flex items-center gap-2 text-[#F0D78C] font-bold mb-1">
                          <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                          প্রবেশ সম্পন্ন হয়েছে
                        </p>
                        <p className="text-[#B3A6C9]">
                          {formatCheckInTime(scannedTicket.checkedInAt)} · {scannedTicket.checkedInBy}
                        </p>
                        <button
                          type="button"
                          disabled={entrySaving}
                          onClick={handleMarkEntrance}
                          className="mt-2 text-[10px] text-[#B3A6C9] underline cursor-pointer disabled:opacity-50"
                        >
                          আবার প্রবেশ সময় আপডেট করুন
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={entrySaving}
                        onClick={handleMarkEntrance}
                        className="w-full py-3.5 gold-gradient-btn text-[#0F0C1A] font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {entrySaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
                        প্রবেশ নিশ্চিত করুন (ALLOW ENTRY)
                      </button>
                    )}
                  </>
                )}

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full py-2.5 bg-[#0F0C1A] border border-[#D4AF37]/40 text-[#F6EFE0] rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                  পরবর্তী স্ক্যান
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
