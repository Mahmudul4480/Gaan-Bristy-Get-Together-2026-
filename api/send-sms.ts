// Serverless function that sends the registration confirmation SMS via Alpha
// SMS (sms.net.bd).
//
// This file must stay dependency-free: package.json sets "type": "module", so
// on Vercel it runs as native Node ESM where a relative import without a file
// extension fails to resolve and crashes the whole function. The Vite dev
// middleware in vite.config.ts imports the helpers below so local and live
// behaviour stay identical.
//
// SMS_API_KEY / SMS_SENDER_ID must be plain (non VITE_-prefixed) env vars so
// they stay server-only and never reach the browser.

const ALPHA_SMS_ENDPOINT = 'https://api.sms.net.bd/sendsms';

export const REGISTRATION_SMS_MESSAGE =
  '"Gaan Bristy Grand Get-Together 2026: Melody at Gulshan Club" এ রেজিস্ট্রেশনের জন্য আপনাকে ধন্যবাদ।';

export const PENDING_SMS_MESSAGE =
  '"Gaan Bristy Grand Get-Together 2026" এ রেজিস্ট্রেশন জমা হয়েছে। পেমেন্ট যাচাইয়ের পর আপনার Honorable Guest Card পাঠানো হবে।';

export const DRESS_CODE_SMS_MESSAGE =
  'Dress Code: Male- Formal (Shirt, Pant, Shoe), Female- Casual.';

export type SmsKind = 'pending' | 'approved';

export interface SendSmsRequestBody {
  phone?: string;
  type?: string;
  cardUrl?: string;
}

export interface SendSmsResult {
  success: boolean;
  error?: string;
}

export function resolveSmsMessage(type: SmsKind, cardUrl?: string): string {
  if (type === 'approved') {
    const url = cardUrl?.trim();
    const thanks = url
      ? `${REGISTRATION_SMS_MESSAGE} আপনার কার্ড: ${url}`
      : REGISTRATION_SMS_MESSAGE;
    return `${thanks} ${DRESS_CODE_SMS_MESSAGE}`;
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

function normalizeBangladeshiPhone(rawPhone: string): string | null {
  const digits = rawPhone.replace(/\D/g, '');
  if (/^01\d{9}$/.test(digits)) return digits;
  if (/^8801\d{9}$/.test(digits)) return digits;
  return null;
}

interface AlphaSmsResponse {
  error?: number | string;
  msg?: string;
  message?: string;
}

function describeAlphaFailure(data: AlphaSmsResponse | null, httpStatus: number): string {
  const code = Number(data?.error);
  const apiMsg = (data?.msg || data?.message || '').trim();

  if (code === 405) {
    return 'Alpha SMS API key ভুল বা অনুমোদিত নয়। Vercel-এ SMS_API_KEY চেক করে Redeploy করুন।';
  }
  if (code === 403) {
    return apiMsg || 'SMS পাঠানোর অনুমতি নেই। Sender ID/মাস্কিং চেক করুন।';
  }
  if (code === 400) {
    return apiMsg || 'SMS রিকোয়েস্টে ভুল প্যারামিটার।';
  }
  if (apiMsg) {
    return apiMsg;
  }
  return `SMS পাঠানো যায়নি (HTTP ${httpStatus})`;
}

async function callAlphaSms(
  url: string,
  init?: { method: string; headers: Record<string, string>; body: string }
): Promise<{ data: AlphaSmsResponse | null; status: number }> {
  const response = await fetch(url, init);
  const text = await response.text();
  let data: AlphaSmsResponse | null = null;
  try {
    data = text ? (JSON.parse(text) as AlphaSmsResponse) : null;
  } catch {
    data = null;
  }
  return { data, status: response.status };
}

function isAlphaSuccess(data: AlphaSmsResponse | null, httpStatus: number): boolean {
  const errorCode = data?.error;
  return httpStatus >= 200 && httpStatus < 300 && (errorCode === 0 || errorCode === '0');
}

export async function sendConfirmationSms(
  phone: string,
  message: string,
  credentials?: { apiKey?: string; senderId?: string }
): Promise<SendSmsResult> {
  const env = process.env as Record<string, string | undefined>;
  const apiKey = (credentials?.apiKey || env['SMS_API_KEY'] || '').trim();
  if (!apiKey) {
    console.warn('[send-sms] SMS_API_KEY is not configured on the server.');
    const onVercel = Boolean(env['VERCEL']);
    return {
      success: false,
      error: onVercel
        ? 'লাইভ সাইটে SMS_API_KEY নেই। Vercel Dashboard → Project → Settings → Environment Variables-এ SMS_API_KEY যোগ করে Production + Preview-এ Redeploy করুন।'
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

  const senderId = (credentials?.senderId || env['SMS_SENDER_ID'] || '').trim();
  if (senderId) params.set('sender_id', senderId);

  try {
    let { data, status } = await callAlphaSms(ALPHA_SMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: params.toString(),
    });

    // Some Alpha SMS edge nodes reject POST bodies; the GET form is the
    // documented fallback and returns the same JSON payload.
    if (!isAlphaSuccess(data, status) && !data) {
      ({ data, status } = await callAlphaSms(`${ALPHA_SMS_ENDPOINT}?${params.toString()}`));
    }

    if (isAlphaSuccess(data, status)) {
      return { success: true };
    }

    return { success: false, error: describeAlphaFailure(data, status) };
  } catch (error) {
    console.error('[send-sms] Alpha SMS request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'SMS পাঠাতে অপ্রত্যাশিত সমস্যা হয়েছে',
    };
  }
}

type NodeRequest = {
  method?: string;
  body?: unknown;
};

type NodeResponse = {
  status: (code: number) => { json: (body: unknown) => void };
};

export default async function handler(req: NodeRequest, res: NodeResponse) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ success: false, error: 'Method not allowed' });
      return;
    }

    let body: SendSmsRequestBody = {};
    if (typeof req.body === 'string') {
      body = JSON.parse(req.body || '{}') as SendSmsRequestBody;
    } else if (req.body && typeof req.body === 'object') {
      body = req.body as SendSmsRequestBody;
    }

    const parsed = parseSendSmsRequest(body);
    if (parsed.error || !parsed.phone || !parsed.message) {
      res.status(400).json({ success: false, error: parsed.error || 'phone প্রয়োজন' });
      return;
    }

    const result = await sendConfirmationSms(parsed.phone, parsed.message);
    res.status(result.success ? 200 : 502).json(result);
  } catch (error) {
    console.error('[send-sms] handler failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'SMS সার্ভারে সমস্যা হয়েছে',
    });
  }
}
