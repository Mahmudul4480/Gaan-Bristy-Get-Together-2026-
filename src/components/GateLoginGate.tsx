import { FormEvent, useState } from 'react';
import { GATE_SCANNER_PIN } from '../config/adminConfig';
import { setGateSession } from '../utils/gateStorage';
import { ShieldCheck, Lock, ScanLine } from 'lucide-react';

interface GateLoginGateProps {
  onAuthenticated: () => void;
}

export default function GateLoginGate({ onAuthenticated }: GateLoginGateProps) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('আপনার নাম লিখুন — এন্ট্রি লগে এই নাম দেখাবে।');
      return;
    }
    if (pin.trim() !== GATE_SCANNER_PIN) {
      setError('ভুল PIN! Super Admin-এর সাথে যোগাযোগ করুন।');
      return;
    }
    setGateSession(true, name.trim());
    setError('');
    onAuthenticated();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0C1A] px-4 py-10 font-body">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex p-4 rounded-full bg-[#7A1F3D]/50 border border-[#D4AF37]/40 mb-4">
          <ScanLine className="w-10 h-10 text-[#D4AF37]" />
        </div>
        <h3 className="text-lg font-bold text-[#F0D78C] font-serif mb-1">Gate Scanner Login</h3>
        <p className="text-xs text-[#B3A6C9] mb-5">
          গেটে অতিথির QR স্ক্যান করে প্রবেশ নিশ্চিত করার জন্য নাম ও PIN দিয়ে লগইন করুন।
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-3.5 w-4 h-4 text-[#B3A6C9]" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="আপনার নাম"
              className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl pl-10 pr-4 py-3 text-sm text-[#F6EFE0] outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-4 h-4 text-[#B3A6C9]" />
            <input
              type="password"
              inputMode="numeric"
              maxLength={8}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Gate PIN"
              className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-3 text-sm text-[#F6EFE0] outline-none text-center tracking-[0.3em] font-mono"
            />
          </div>
          {error && <p className="text-xs text-[#A52C54]">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl text-sm cursor-pointer"
          >
            গেট স্ক্যানার চালু করুন
          </button>
        </form>
      </div>
    </div>
  );
}
