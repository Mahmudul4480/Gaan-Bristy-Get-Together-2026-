import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseSendSmsRequest, sendConfirmationSms, type SendSmsRequestBody, type SendSmsResult } from './_sms';

async function handleSendSms(body: SendSmsRequestBody | undefined): Promise<{ status: number; result: SendSmsResult }> {
  const parsed = parseSendSmsRequest(body);
  if (parsed.error || !parsed.phone || !parsed.message) {
    return { status: 400, result: { success: false, error: parsed.error || 'phone প্রয়োজন' } };
  }

  const env = process.env as Record<string, string | undefined>;
  const result = await sendConfirmationSms(parsed.phone, parsed.message, {
    apiKey: env['SMS_API_KEY'],
    senderId: env['SMS_SENDER_ID'],
  });
  return { status: result.success ? 200 : 502, result };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body) as SendSmsRequestBody;
    const { status, result } = await handleSendSms(body);
    res.status(status).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'SMS সার্ভারে সমস্যা হয়েছে',
    });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json().catch(() => ({}))) as SendSmsRequestBody;
    const { status, result } = await handleSendSms(body);
    return Response.json(result, { status });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'SMS সার্ভারে সমস্যা হয়েছে',
      },
      { status: 500 }
    );
  }
}
