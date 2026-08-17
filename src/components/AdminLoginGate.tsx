import { FormEvent, useState } from 'react';
import { ADMIN_PANEL_PIN } from '../config/adminConfig';
import { setAdminSession } from '../utils/adminStorage';
import { AdminRole } from '../types';
import { ShieldCheck, Lock, Crown, Pencil } from 'lucide-react';

interface AdminLoginGateProps {
  onAuthenticated: () => void;
}

export default function AdminLoginGate({ onAuthenticated }: AdminLoginGateProps) {
  const [pin, setPin] = useState('');
  const [role, setRole] = useState<AdminRole>('Super Admin');
  const [actorName, setActorName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pin.trim() !== ADMIN_PANEL_PIN) {
      setError('ভুল PIN! Super Admin-এর সাথে যোগাযোগ করুন।');
      return;
    }
    if (role === 'Card Editor' && !actorName.trim()) {
      setError('Card Editor হিসেবে নাম লিখুন — ডিলিট রিকোয়েস্টে এই নাম দেখাবে।');
      return;
    }
    setAdminSession(true, role, role === 'Super Admin' ? 'Super Admin' : actorName.trim());
    setError('');
    onAuthenticated();
  };

  return (
    <div className="py-8 px-2 text-center font-body">
      <div className="inline-flex p-4 rounded-full bg-[#7A1F3D]/50 border border-[#D4AF37]/40 mb-4">
        <ShieldCheck className="w-10 h-10 text-[#D4AF37]" />
      </div>
      <h3 className="text-lg font-bold text-[#F0D78C] font-serif mb-1">Admin Panel Login</h3>
      <p className="text-xs text-[#B3A6C9] mb-5 max-w-xs mx-auto">
        Super Admin কার্ড সরাসরি ডিলিট করতে পারবেন। অন্য Admin শুধু ডিলিট রিকোয়েস্ট পাঠাবেন।
      </p>
      <form onSubmit={handleSubmit} className="max-w-xs mx-auto space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole('Super Admin')}
            className={`py-2 rounded-xl text-xs font-bold cursor-pointer border flex items-center justify-center gap-1 ${
              role === 'Super Admin'
                ? 'gold-gradient-btn text-[#0F0C1A] border-[#D4AF37]'
                : 'bg-[#0F0C1A] text-[#B3A6C9] border-[#D4AF37]/30'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            Super Admin
          </button>
          <button
            type="button"
            onClick={() => setRole('Card Editor')}
            className={`py-2 rounded-xl text-xs font-bold cursor-pointer border flex items-center justify-center gap-1 ${
              role === 'Card Editor'
                ? 'gold-gradient-btn text-[#0F0C1A] border-[#D4AF37]'
                : 'bg-[#0F0C1A] text-[#B3A6C9] border-[#D4AF37]/30'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            Card Editor
          </button>
        </div>

        {role === 'Card Editor' && (
          <input
            type="text"
            value={actorName}
            onChange={(e) => setActorName(e.target.value)}
            placeholder="আপনার নাম"
            className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 rounded-xl px-4 py-3 text-sm text-[#F6EFE0] outline-none"
          />
        )}

        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-[#B3A6C9]" />
          <input
            type="password"
            inputMode="numeric"
            maxLength={8}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Admin PIN"
            className="w-full bg-[#0F0C1A] border border-[#D4AF37]/40 focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-3 text-sm text-[#F6EFE0] outline-none text-center tracking-[0.3em] font-mono"
          />
        </div>
        {error && <p className="text-xs text-[#A52C54]">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl text-sm cursor-pointer"
        >
          Admin Panel খুলুন
        </button>
      </form>
    </div>
  );
}
