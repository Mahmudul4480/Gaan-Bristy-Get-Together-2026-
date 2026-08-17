export interface ConfirmationSmsResult {
  success: boolean;
  error?: string;
}

export interface SendConfirmationSmsOptions {
  type?: 'pending' | 'approved';
  cardUrl?: string;
}

function looksLikeHtml(text: string): boolean {
  const trimmed = text.trim().slice(0, 200).toLowerCase();
  return trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || trimmed.includes('<div id="root"');
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
    let data: ConfirmationSmsResult | null = null;
    try {
      data = text ? (JSON.parse(text) as ConfirmationSmsResult) : null;
    } catch {
      data = null;
    }

    if (response.ok && data?.success) {
      return { success: true };
    }

    if (!data) {
      if (looksLikeHtml(text) || response.status === 404) {
        return {
          success: false,
          error:
            'লাইভ সাইটে SMS API রুট পাওয়া যায়নি। Redeploy করুন এবং Vercel-এ SMS_API_KEY (Production + Preview) সেট আছে কিনা দেখুন।',
        };
      }
      return {
        success: false,
        error: text.trim().slice(0, 180) || `SMS পাঠানো যায়নি (HTTP ${response.status})`,
      };
    }

    return {
      success: false,
      error: data.error || `SMS পাঠানো যায়নি (HTTP ${response.status})`,
    };
  } catch (error) {
    console.warn('[Confirmation SMS] Request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'SMS পাঠাতে নেটওয়ার্ক সমস্যা হয়েছে',
    };
  }
}
