import { SUPER_ADMIN_EMAIL } from '../config/adminConfig';
import { Ticket } from '../types';
import { getGuestCardUrl } from './guestStorage';

function buildPaymentEmailBody(ticket: Ticket, cardUrl: string): string {
  const lines = [
    'নতুন অনলাইন পেমেন্ট ও Honorable Guest Card তৈরি হয়েছে।',
    '',
    `Ticket ID: ${ticket.ticketId}`,
    `নাম: ${ticket.fullName}`,
    `StarMaker Family: ${ticket.familyName}`,
    `StarMaker ID: ${ticket.starMakerId || '—'}`,
    `মোবাইল: ${ticket.phone}`,
    `ইমেইল: ${ticket.email || '—'}`,
    '',
    `পেমেন্ট মাধ্যম: ${ticket.paymentMethod}`,
    `Transaction ID (TrxID): ${ticket.transactionId}`,
    `Adult সংখ্যা: ${ticket.adultCount}`,
    `মোট টাকা: ${ticket.totalAmount}/-`,
    `গানের অনুরোধ: ${ticket.songRequest || '—'}`,
    '',
    `Guest Card লিংক: ${cardUrl}`,
    `সময়: ${new Date(ticket.issueDate).toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}`,
  ];
  return lines.join('\n');
}

/**
 * Super admin-কে নতুন পেমেন্ট নোটিফিকেশন পাঠায় (নন-ব্লকিং)।
 * FormSubmit.co ব্যবহার করে — প্রথমবার chotan4480@gmail.com এ activation লিংক আসবে।
 */
export async function notifyAdminPaymentComplete(ticket: Ticket): Promise<void> {
  const cardUrl = getGuestCardUrl(ticket.ticketId);
  const subject = `[Gaan Bristy 2026] নতুন পেমেন্ট — ${ticket.fullName} (${ticket.ticketId})`;

  const payload = {
    _subject: subject,
    _captcha: 'false',
    _template: 'box',
    ticket_id: ticket.ticketId,
    guest_name: ticket.fullName,
    family_name: ticket.familyName,
    phone: ticket.phone,
    email: ticket.email || '—',
    star_maker_id: ticket.starMakerId || '—',
    payment_method: ticket.paymentMethod,
    transaction_id: ticket.transactionId,
    total_amount: `${ticket.totalAmount}/-`,
    adult_count: String(ticket.adultCount),
    guest_card_url: cardUrl,
    message: buildPaymentEmailBody(ticket, cardUrl),
  };

  const webhookUrl =
    import.meta.env.VITE_PAYMENT_NOTIFY_WEBHOOK ||
    `https://formsubmit.co/ajax/${encodeURIComponent(SUPER_ADMIN_EMAIL)}`;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn('[Payment notify] Failed:', response.status, await response.text());
    }
  } catch (error) {
    console.warn('[Payment notify] Error:', error);
  }
}
