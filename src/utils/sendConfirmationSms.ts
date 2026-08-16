export interface ConfirmationSmsResult {
  success: boolean;
  error?: string;
}

/**
 * Calls the server-side /api/send-sms endpoint (Vercel serverless function in
 * production, Vite dev middleware locally) to send the registration
 * confirmation SMS via Alpha SMS. The SMS API key never reaches the browser.
 */
export async function sendRegistrationConfirmationSms(phone: string): Promise<ConfirmationSmsResult> {
  try {
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    const data = (await response.json().catch(() => null)) as ConfirmationSmsResult | null;

    if (response.ok && data?.success) {
      return { success: true };
    }

    return { success: false, error: data?.error || 'কনফার্মেশন SMS পাঠানো যায়নি' };
  } catch (error) {
    console.warn('[Confirmation SMS] Request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'কনফার্মেশন SMS পাঠাতে নেটওয়ার্ক সমস্যা হয়েছে',
    };
  }
}
