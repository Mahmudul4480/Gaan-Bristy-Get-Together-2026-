// Shared server-side logic for sending confirmation SMS via Alpha SMS (sms.net.bd).
// Used by both the Vercel serverless function (api/send-sms.ts) and the local
// Vite dev-server middleware (vite.config.ts) so behaviour is identical in
// production and local development.
//
// SMS_API_KEY / SMS_SENDER_ID must be set as plain (non VITE_-prefixed) env
// vars so they stay server-only and are never bundled into client JS.

const ALPHA_SMS_ENDPOINT = 'https://api.sms.net.bd/sendsms';

export const REGISTRATION_SMS_MESSAGE =
  '"Gaan Bristy Grand Get-Together 2026: Melody at Gulshan Club" এ রেজিস্ট্রেশনের জন্য আপনাকে ধন্যবাদ।';

export const PENDING_SMS_MESSAGE =
  '"Gaan Bristy Grand Get-Together 2026" এ রেজিস্ট্রেশন জমা হয়েছে। পেমেন্ট যাচাইয়ের পর আপনার Honorable Guest Card পাঠানো হবে।';

export type SmsKind = 'pending' | 'approved';

export interface SendSmsRequestBody {
  phone?: string;
  type?: string;
  cardUrl?: string;
}

export function resolveSmsMessage(type: SmsKind, cardUrl?: string): string {
  if (type === 'approved') {
    const url = cardUrl?.trim();
    return url ? `${REGISTRATION_SMS_MESSAGE} আপনার কার্ড: ${url}` : REGISTRATION_SMS_MESSAGE;
  }
  return PENDING_SMS_MESSAGE;
}

export function parseSendSmsRequest(body: SendSmsRequestBody | undefined): {
  phone?: string;
  message?: string;
  error?: string;
} {
  const phone = body?.phone?.trim();
  if (!phone) {
    return { error: 'phone প্রয়োজন' };
  }

  const type: SmsKind = body?.type === 'approved' ? 'approved' : 'pending';
  const rawUrl = body?.cardUrl?.trim();
  const cardUrl = rawUrl && /^https?:\/\//i.test(rawUrl) ? rawUrl : undefined;

  return { phone, message: resolveSmsMessage(type, cardUrl) };
}

export interface SendSmsResult {
  success: boolean;
  error?: string;
}

function normalizeBangladeshiPhone(rawPhone: string): string | null {
  const digits = rawPhone.replace(/\D/g, '');
  if (/^01\d{9}$/.test(digits)) return digits; // 01XXXXXXXXX
  if (/^8801\d{9}$/.test(digits)) return digits; // 8801XXXXXXXXX
  return null;
}

interface AlphaSmsResponse {
  error?: number | string;
  msg?: string;
  message?: string;
}

export async function sendConfirmationSms(phone: string, message: string): Promise<SendSmsResult> {
  const apiKey = process.env.SMS_API_KEY;
  if (!apiKey) {
    console.warn('[send-sms] SMS_API_KEY is not configured on the server.');
    const onVercel = Boolean(process.env.VERCEL);
    return {
      success: false,
      error: onVercel
        ? 'লাইভ সাইটে SMS_API_KEY নেই। Vercel Dashboard → Project → Settings → Environment Variables-এ SMS_API_KEY যোগ করে Redeploy করুন।'
        : 'লোকাল .env থেকে SMS_API_KEY লোড হয়নি। npm run dev বন্ধ করে আবার চালু করুন।',
    };
  }

  const normalizedPhone = normalizeBangladeshiPhone(phone);
  if (!normalizedPhone) {
    return { success: false, error: 'সঠিক বাংলাদেশী মোবাইল নম্বর প্রয়োজন (01XXXXXXXXX)।' };
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    msg: message,
    to: normalizedPhone,
  });

  const senderId = process.env.SMS_SENDER_ID;
  if (senderId) params.set('sender_id', senderId);

  try {
    const response = await fetch(ALPHA_SMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = (await response.json().catch(() => null)) as AlphaSmsResponse | null;
    const errorCode = data?.error;
    const isSuccess = response.ok && (errorCode === 0 || errorCode === '0');

    if (isSuccess) {
      return { success: true };
    }

    return {
      success: false,
      error: data?.msg || data?.message || `SMS পাঠানো যায়নি (HTTP ${response.status})`,
    };
  } catch (error) {
    console.error('[send-sms] Alpha SMS request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'SMS পাঠাতে অপ্রত্যাশিত সমস্যা হয়েছে',
    };
  }
}
