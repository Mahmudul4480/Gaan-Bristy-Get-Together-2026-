import { parseSendSmsRequest, sendConfirmationSms, type SendSmsRequestBody } from './_sms';

type NodeRequest = {
  method?: string;
  body?: unknown;
};

type NodeResponse = {
  status: (code: number) => { json: (body: unknown) => void };
};

export default async function handler(req: NodeRequest, res: NodeResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
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

    const env = process.env as Record<string, string | undefined>;
    const result = await sendConfirmationSms(parsed.phone, parsed.message, {
      apiKey: env['SMS_API_KEY'],
      senderId: env['SMS_SENDER_ID'],
    });
    res.status(result.success ? 200 : 502).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'SMS সার্ভারে সমস্যা হয়েছে',
    });
  }
}
