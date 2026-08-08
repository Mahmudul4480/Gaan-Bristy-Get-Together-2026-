import { FormEvent, useState } from 'react';
import {
  appointCardEditor,
  loadAppointedAdmins,
  removeAppointedAdmin,
} from '../utils/adminStorage';
import { AppointedAdmin } from '../types';
import { UserPlus, Trash2, Shield, Crown } from 'lucide-react';

export default function AdminAssignPanel() {
  const [admins, setAdmins] = useState<AppointedAdmin[]>(() => loadAppointedAdmins());
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleAppoint = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Admin-এর নাম দিন');
      return;
    }
    if (phone.trim().length < 11) {
      setError('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন');
      return;
    }
    if (admins.some((a) => a.phone === phone.trim())) {
      setError('এই নম্বর ইতিমধ্যে Admin হিসেবে আছে');
      return;
    }
    setAdmins(appointCardEditor(name, phone));
    setName('');
    setPhone('');
    setError('');
  };

  const handleRemove = (id: string) => {
    setAdmins(removeAppointedAdmin(id));
  };

  return (
    <div className="space-y-4 font-body">
      <p className="text-xs text-[#B3A6C9] bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-xl p-3">
        Super Admin এখান থেকে Card Editor Admin নিয়োগ করতে পারবেন। নিয়োগপ্রাপ্ত Admin-রা Admin Link + PIN দিয়ে
        Guest Card Edit করতে পারবেন।
      </p>

      <form onSubmit={handleAppoint} className="bg-[#0F0C1A] border border-[#D4AF37]/35 rounded-2xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-[#F0D78C] flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          নতুন Admin নিয়োগ
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Admin নাম"
            className="bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Mobile No (017xxxxxxxx)"
            className="bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] font-mono outline-none"
          />
        </div>
        {error && <p className="text-xs text-[#A52C54]">{error}</p>}
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2.5 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl text-sm cursor-pointer"
        >
          Admin নিয়োগ করুন
        </button>
      </form>

      <div className="rounded-xl border border-[#D4AF37]/30 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0F0C1A] text-[#B3A6C9]">
            <tr>
              <th className="px-3 py-2">নাম</th>
              <th className="px-3 py-2">Mobile / Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-t border-[#D4AF37]/15">
                <td className="px-3 py-2 text-[#F6EFE0] font-semibold">{admin.name}</td>
                <td className="px-3 py-2 font-mono text-[#B3A6C9]">{admin.phone}</td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      admin.role === 'Super Admin'
                        ? 'bg-[#D4AF37] text-[#0F0C1A]'
                        : 'bg-[#7A1F3D] text-[#F0D78C]'
                    }`}
                  >
                    {admin.role === 'Super Admin' ? (
                      <Crown className="w-3 h-3" />
                    ) : (
                      <Shield className="w-3 h-3" />
                    )}
                    {admin.role}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {admin.role !== 'Super Admin' && (
                    <button
                      type="button"
                      onClick={() => handleRemove(admin.id)}
                      className="inline-flex items-center gap-1 text-[#A52C54] hover:text-[#F0D78C] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      সরান
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
