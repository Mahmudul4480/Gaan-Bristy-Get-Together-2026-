import { useEffect, useState } from 'react';
import { GuestbookEntry } from '../types';
import {
  addGuestbookEntry,
  deleteGuestbookEntry,
  formatGuestbookTimestamp,
  importGuestbookEntries,
  readLegacyGuestbookFromStorage,
  subscribeToGuestbookEntries,
} from '../utils/guestbookStorage';
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  MessageSquarePlus,
  RefreshCw,
  Trash2,
  Upload,
} from 'lucide-react';

export default function AdminGuestbookManager() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [legacyPreview, setLegacyPreview] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState('');
  const [starMakerId, setStarMakerId] = useState('');
  const [favoriteSong, setFavoriteSong] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const unsubscribe = subscribeToGuestbookEntries(
      (list) => setEntries(list),
      (err) => setError(err.message)
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    setLegacyPreview(readLegacyGuestbookFromStorage());
  }, [entries]);

  const resetForm = () => {
    setName('');
    setStarMakerId('');
    setFavoriteSong('');
    setMessage('');
  };

  const handleRestoreOne = async () => {
    if (!name.trim() || !message.trim()) {
      setError('নাম ও বার্তা লিখুন');
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      await addGuestbookEntry({
        name,
        starMakerId,
        favoriteSong,
        message,
      });
      setSuccessMsg('বার্তাটি গেস্টবুকে restore করা হয়েছে।');
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Restore করা যায়নি');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportLegacyFromBrowser = async () => {
    const legacy = readLegacyGuestbookFromStorage();
    if (legacy.length === 0) {
      setError('এই ব্রাউজার/ফোনে কোনো পুরনো localStorage বার্তা পাওয়া যায়নি।');
      return;
    }

    setIsImporting(true);
    setError('');
    setSuccessMsg('');

    try {
      const imported = await importGuestbookEntries(legacy, entries, {
        clearLegacyStorageOnComplete: true,
      });
      setSuccessMsg(
        imported > 0
          ? `${imported}টি পুরনো বার্তা Firestore-এ restore হয়েছে — এখন সবাই দেখতে পাবে।`
          : 'পুরনো বার্তাগুলো আগেই Firestore-এ ছিল।'
      );
      setLegacyPreview(readLegacyGuestbookFromStorage());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import করা যায়নি');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDelete = async (entry: GuestbookEntry) => {
    setDeletingId(entry.id);
    setError('');
    try {
      await deleteGuestbookEntry(entry.id);
      setSuccessMsg(`"${entry.name}"-এর বার্তা মুছে ফেলা হয়েছে।`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'মুছে ফেলা যায়নি');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-5 font-body">
      <p className="text-xs text-[#B3A6C9] bg-[#0F0C1A] border border-[#D4AF37]/30 rounded-xl p-3 leading-relaxed">
        আগে যারা comment করেছিলেন, তাদের বার্তা শুধু তাদের ফোনে saved ছিল। এখান থেকে manually
        restore করতে পারেন, অথবা কারো ফোন/ব্রাউজারে Admin Panel খুলে <strong>localStorage Import</strong>{' '}
        চাপলে সব পুরনো comment Firestore-এ চলে আসবে।
      </p>

      <div className="bg-[#0F0C1A] border border-[#D4AF37]/35 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#F0D78C]">এই ডিভাইসের পুরনো বার্তা Import</p>
            <p className="text-[11px] text-[#B3A6C9] mt-0.5">
              localStorage-এ পাওয়া বার্তা: {legacyPreview.length}টি
            </p>
          </div>
          <button
            type="button"
            onClick={handleImportLegacyFromBrowser}
            disabled={isImporting || legacyPreview.length === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#7A1F3D]/40 border border-[#D4AF37]/50 text-[#F0D78C] hover:border-[#D4AF37] transition cursor-pointer disabled:opacity-60"
          >
            {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            localStorage থেকে Restore করুন
          </button>
        </div>

        {legacyPreview.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
            {legacyPreview.map((entry) => (
              <div key={entry.id} className="text-[11px] bg-[#1C1730] border border-[#D4AF37]/20 rounded-xl px-3 py-2">
                <p className="font-bold text-[#F0D78C]">{entry.name}</p>
                <p className="text-[#B3A6C9] truncate">{entry.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#0F0C1A] border border-[#D4AF37]/35 rounded-2xl p-4 space-y-3">
        <p className="text-sm font-bold text-[#F0D78C] flex items-center gap-2">
          <MessageSquarePlus className="w-4 h-4" />
          ম্যানুয়াল Restore (একটি বার্তা)
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="নাম *"
            className="bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
          />
          <input
            value={starMakerId}
            onChange={(e) => setStarMakerId(e.target.value)}
            placeholder="StarMaker ID (ঐচ্ছিক)"
            className="bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
          />
        </div>

        <input
          value={favoriteSong}
          onChange={(e) => setFavoriteSong(e.target.value)}
          placeholder="পছন্দের গান (ঐচ্ছিক)"
          className="w-full bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none"
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="শুভেচ্ছা বার্তা *"
          className="w-full bg-[#1C1730] border border-[#D4AF37]/40 rounded-xl px-3 py-2 text-sm text-[#F6EFE0] outline-none resize-none"
        />

        <button
          type="button"
          onClick={handleRestoreOne}
          disabled={isSaving}
          className="w-full py-3 gold-gradient-btn text-[#0F0C1A] font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          গেস্টবুকে Restore করুন
        </button>
      </div>

      {error && (
        <p className="flex items-center gap-2 text-xs text-[#F6EFE0] bg-[#7A1F3D]/40 border border-[#A52C54]/50 rounded-xl px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
      {successMsg && (
        <p className="flex items-center gap-2 text-xs text-[#F0D78C] bg-[#7A1F3D]/30 border border-[#D4AF37]/40 rounded-xl px-3 py-2">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          {successMsg}
        </p>
      )}

      <div>
        <p className="text-xs font-semibold text-[#F0D78C] mb-3">
          Firestore-এ saved অতিথি বার্তা ({entries.length})
        </p>
        {entries.length === 0 ? (
          <p className="text-center text-sm text-[#B3A6C9] py-6 bg-[#0F0C1A] border border-[#D4AF37]/20 rounded-2xl">
            এখনও কোনো অতিথি বার্তা restore হয়নি।
          </p>
        ) : (
          <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-[#0F0C1A] border border-[#D4AF37]/25 rounded-xl p-3 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#F0D78C]">{entry.name}</p>
                  {entry.starMakerId && (
                    <p className="text-[10px] text-[#B3A6C9] font-mono">ID: {entry.starMakerId}</p>
                  )}
                  <p className="text-[11px] text-[#B3A6C9] mt-1">{formatGuestbookTimestamp(entry)}</p>
                  <p className="text-xs text-[#F6EFE0] mt-2 line-clamp-3">"{entry.message}"</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(entry)}
                  disabled={deletingId === entry.id}
                  className="p-2 rounded-full bg-[#1C1730] border border-[#A52C54]/40 text-[#F6EFE0] hover:bg-[#A52C54] transition cursor-pointer disabled:opacity-60 shrink-0"
                  title="মুছুন"
                >
                  {deletingId === entry.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
