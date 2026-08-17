import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseSendSmsRequest, sendConfirmationSms } from './_sms';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body) as
    | { phone?: string; type?: string; cardUrl?: string }
    | undefined;

  const parsed = parseSendSmsRequest(body);
  if (parsed.error || !parsed.phone || !parsed.message) {
    res.status(400).json({ success: false, error: parsed.error || 'phone প্রয়োজন' });
    return;
  }

  const result = await sendConfirmationSms(parsed.phone, parsed.message);
  res.status(result.success ? 200 : 502).json(result);
}
