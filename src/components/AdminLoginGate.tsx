import { FormEvent, useState } from 'react';
import { ADMIN_PANEL_PIN } from '../config/adminConfig';
import { setAdminSession } from '../utils/adminStorage';
import { ShieldCheck, Lock } from 'lucide-react';

interface AdminLoginGateProps {
  onAuthenticated: () => void;
}

export default function AdminLoginGate({ onAuthenticated }: AdminLoginGateProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pin.trim() === ADMIN_PANEL_PIN) {
      setAdminSession(true);
      setError('');
      onAuthenticated();
      return;
    }
    setError('ভুল PIN! Super Admin-এর সাথে যোগাযোগ করুন।');
  };

  return (
    <div className="py-8 px-2 text-center font-body">
      <div className="inline-flex p-4 rounded-full bg-[#7A1F3D]/50 border border-[#D4AF37]/40 mb-4">
        <ShieldCheck className="w-10 h-10 text-[#D4AF37]" />
      </div>
      <h3 className="text-lg font-bold text-[#F0D78C] font-serif mb-1">Admin Panel Login</h3>
      <p className="text-xs text-[#B3A6C9] mb-5 max-w-xs mx-auto">
        Admin PIN দিয়ে প্রবেশ করুন। Card Edit ও Admin নিয়োগ করতে পারবেন।
      </p>
      <form onSubmit={handleSubmit} className="max-w-xs mx-auto space-y-3">
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
