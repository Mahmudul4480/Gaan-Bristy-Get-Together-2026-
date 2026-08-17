export interface ConfirmationSmsResult {
  success: boolean;
  error?: string;
}

export interface SendConfirmationSmsOptions {
  type?: 'pending' | 'approved';
  cardUrl?: string;
}

const SERVER_UNAVAILABLE_MESSAGE =
  'আপনার রেজিস্ট্রেশন সংরক্ষিত হয়েছে, তবে এখন SMS পাঠানো যাচ্ছে না। অ্যাডমিন যাচাই করে আপনাকে জানাবেন।';

function looksLikeHtml(text: string): boolean {
  const trimmed = text.trim().slice(0, 200).toLowerCase();
  return trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || trimmed.includes('<div id="root"');
}

function readApiError(data: unknown, rawText: string, status: number): string {
  if (data && typeof data === 'object') {
    const payload = data as { error?: unknown; message?: unknown };
    if (typeof payload.error === 'string' && payload.error.trim()) {
      return payload.error;
    }
    if (payload.error && typeof payload.error === 'object') {
      const nested = payload.error as { message?: unknown; code?: unknown };
      const code = typeof nested.code === 'string' ? nested.code : '';
      if (code === 'FUNCTION_INVOCATION_FAILED' || String(nested.message || '').includes('FUNCTION_INVOCATION')) {
        return SERVER_UNAVAILABLE_MESSAGE;
      }
      if (typeof nested.message === 'string' && nested.message.trim()) {
        return nested.message;
      }
    }
    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
  }

  if (looksLikeHtml(rawText) || status === 404) {
    return 'লাইভ সাইটে SMS API রুট পাওয়া যায়নি। Redeploy করুন এবং Vercel-এ SMS_API_KEY সেট আছে কিনা দেখুন।';
  }

  if (/FUNCTION_INVOCATION_FAILED/i.test(rawText)) {
    return SERVER_UNAVAILABLE_MESSAGE;
  }

  return rawText.trim().slice(0, 180) || `SMS পাঠানো যায়নি (HTTP ${status})`;
}

/**
 * Calls the server-side /api/send-sms endpoint (Vercel serverless function in
 * production, Vite dev middleware locally) to send the registration
 * confirmation SMS via Alpha SMS. The SMS API key never reaches the browser.
 */
export async function sendRegistrationConfirmationSms(
  phone: string,
  options?: SendConfirmationSmsOptions
): Promise<ConfirmationSmsResult> {
  try {
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        type: options?.type || 'pending',
        cardUrl: options?.cardUrl,
      }),
    });

    const text = await response.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (response.ok && data && typeof data === 'object' && (data as ConfirmationSmsResult).success) {
      return { success: true };
    }

    return {
      success: false,
      error: readApiError(data, text, response.status),
    };
  } catch (error) {
    console.warn('[Confirmation SMS] Request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'SMS পাঠাতে নেটওয়ার্ক সমস্যা হয়েছে',
    };
  }
}

