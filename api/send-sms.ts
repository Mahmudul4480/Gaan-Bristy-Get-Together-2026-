import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendConfirmationSms, REGISTRATION_SMS_MESSAGE } from './_sms';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body) as
    | { phone?: string }
    | undefined;

  const phone = body?.phone;
  if (!phone) {
    res.status(400).json({ success: false, error: 'phone প্রয়োজন' });
    return;
  }

  const result = await sendConfirmationSms(phone, REGISTRATION_SMS_MESSAGE);
  res.status(result.success ? 200 : 502).json(result);
}
