import { Ticket } from '../types';
import { EVENT_DETAILS, LOGO_URL } from '../data/eventData';
import { getPaymentKind, hasCollectedPayment, paymentKindLabel, visibleTransactionId } from './paymentKind';

const STATUS_LABEL_BN: Record<Ticket['status'], string> = {
  Confirmed: 'কনফার্মড',
  Pending: 'পেন্ডিং',
  Rejected: 'রিজেক্টেড',
};

function escapeHtml(value?: string | number | null): string {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function statusColors(status: Ticket['status']): { bg: string; text: string; border: string } {
  if (status === 'Confirmed') return { bg: '#EAF6EC', text: '#1E7A3B', border: '#8FCB9F' };
  if (status === 'Rejected') return { bg: '#FBEAEA', text: '#A52C2C', border: '#E3A0A0' };
  return { bg: '#FDF3E1', text: '#9A6B00', border: '#E8C874' };
}

function kindColors(kind: ReturnType<typeof getPaymentKind>): { bg: string; text: string; border: string } {
  if (kind === 'paid') return { bg: '#EAF6EC', text: '#1E7A3B', border: '#8FCB9F' };
  if (kind === 'due') return { bg: '#FBEAEA', text: '#A52C2C', border: '#E3A0A0' };
  return { bg: '#F1ECFB', text: '#5B3FA0', border: '#C8B7EA' };
}

function formatDateBn(iso?: string): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('bn-BD', { day: '2-digit', month: 'short', year: 'numeric' });
}

function pill(label: string, colors: { bg: string; text: string; border: string }): string {
  return `<span style="display:inline-block; padding:3px 10px; border-radius:999px; font-size:12px; font-weight:800; background:${colors.bg}; color:${colors.text}; border:1.5px solid ${colors.border}; white-space:nowrap;">${escapeHtml(
    label
  )}</span>`;
}

function buildTableRows(guests: Ticket[]): string {
  return guests
    .map((g, index) => {
      const kind = getPaymentKind(g);
      const zebra = index % 2 === 0 ? '#FFFFFF' : '#FBF6E9';
      const trxId = visibleTransactionId(g.transactionId) ?? '—';
      const sColors = statusColors(g.status);
      const pColors = kindColors(kind);
      const byLine = g.approvedBy
        ? `ভেরিফাই: ${escapeHtml(g.approvedBy)}`
        : g.createdByAdmin
          ? `Admin${g.createdBy ? ' · ' + escapeHtml(g.createdBy) : ''}`
          : 'গেস্ট রেজিস্ট্রেশন';

      return `
        <tr style="background:${zebra};">
          <td style="padding:12px 10px; text-align:center; font-weight:800; color:#7A1F3D; border-bottom:1px solid #EADFC0;">${
            index + 1
          }</td>
          <td style="padding:12px 10px; font-weight:800; color:#7A1F3D; font-family:monospace; border-bottom:1px solid #EADFC0; white-space:nowrap;">${escapeHtml(
            g.ticketId
          )}</td>
          <td style="padding:12px 10px; border-bottom:1px solid #EADFC0;">
            <div style="font-weight:800; font-size:14.5px; color:#1a0a14;">${escapeHtml(g.fullName)}</div>
            <div style="font-size:12px; color:#6b5c4a; margin-top:2px;">${escapeHtml(g.familyName)}${
              g.starMakerId ? ' · SM: ' + escapeHtml(g.starMakerId) : ''
            }</div>
          </td>
          <td style="padding:12px 10px; border-bottom:1px solid #EADFC0;">
            <div style="font-weight:700; font-size:13.5px; color:#1a0a14; font-family:monospace;">${escapeHtml(
              g.phone
            )}</div>
            ${g.email ? `<div style="font-size:11.5px; color:#6b5c4a; margin-top:2px;">${escapeHtml(g.email)}</div>` : ''}
          </td>
          <td style="padding:12px 10px; text-align:center; font-weight:800; font-size:14.5px; color:#1a0a14; border-bottom:1px solid #EADFC0;">${
            g.adultCount
          }</td>
          <td style="padding:12px 10px; font-family:monospace; font-weight:700; font-size:13px; color:#1a0a14; border-bottom:1px solid #EADFC0;">${escapeHtml(
            trxId
          )}<div style="font-size:11px; color:#6b5c4a; margin-top:2px; font-family: inherit;">${escapeHtml(
            g.paymentMethod
          )}</div></td>
          <td style="padding:12px 10px; text-align:center; border-bottom:1px solid #EADFC0;">${pill(
            paymentKindLabel(kind),
            pColors
          )}</td>
          <td style="padding:12px 10px; text-align:right; font-weight:800; font-size:15px; color:#7A1F3D; border-bottom:1px solid #EADFC0; white-space:nowrap;">${
            g.totalAmount
          }/-</td>
          <td style="padding:12px 10px; text-align:center; border-bottom:1px solid #EADFC0;">
            ${pill(STATUS_LABEL_BN[g.status], sColors)}
            <div style="font-size:10.5px; color:#8a7a63; margin-top:4px;">${byLine}</div>
          </td>
          <td style="padding:12px 10px; font-size:12.5px; color:#4a3f33; border-bottom:1px solid #EADFC0; white-space:nowrap;">${formatDateBn(
            g.issueDate
          )}</td>
        </tr>`;
    })
    .join('');
}

function buildReportHtml(guests: Ticket[]): string {
  const total = guests.length;
  const confirmed = guests.filter((g) => g.status === 'Confirmed').length;
  const pending = guests.filter((g) => g.status === 'Pending').length;
  const rejected = guests.filter((g) => g.status === 'Rejected').length;
  const paid = guests.filter((g) => getPaymentKind(g) === 'paid').length;
  const due = guests.filter((g) => getPaymentKind(g) === 'due').length;
  const complimentary = guests.filter((g) => getPaymentKind(g) === 'complimentary').length;
  const totalCollected = guests.filter(hasCollectedPayment).reduce((sum, g) => sum + (g.totalAmount || 0), 0);
  const generatedAt = new Date().toLocaleString('bn-BD', { dateStyle: 'long', timeStyle: 'short' });

  const statCard = (label: string, value: string | number, color = '#7A1F3D') => `
    <div style="flex:1; min-width:140px; background:#FFFFFF; border:2px solid #EADFC0; border-radius:14px; padding:12px 16px; text-align:center;">
      <p style="margin:0; font-size:11.5px; font-weight:700; color:#8a7a63; text-transform:uppercase; letter-spacing:0.5px;">${escapeHtml(
        label
      )}</p>
      <p style="margin:4px 0 0; font-size:24px; font-weight:900; color:${color};">${escapeHtml(String(value))}</p>
    </div>`;

  return `
  <div id="gb-guest-list-pdf-report" style="width:1700px; background:#FFFFFF; font-family: 'Hind Siliguri', 'Noto Sans Bengali', 'Segoe UI', sans-serif; color:#1a0a14;">
    <div style="background:linear-gradient(135deg,#1a0a14,#3a0f1f 60%,#7A1F3D); padding:34px 50px; display:flex; align-items:center; gap:26px; border-bottom:7px solid #D4AF37;">
      <img src="${LOGO_URL}" width="86" height="86" style="border-radius:50%; border:3px solid #D4AF37; object-fit:cover; background:#fff;" />
      <div style="flex:1;">
        <p style="margin:0; font-size:13px; font-weight:800; letter-spacing:2.5px; color:#D4AF37; text-transform:uppercase;">${escapeHtml(
          EVENT_DETAILS.organizerNameBengali
        )}</p>
        <h1 style="margin:4px 0 0; font-size:38px; font-weight:900; color:#F0D78C; line-height:1.15;">${escapeHtml(
          EVENT_DETAILS.fullTitle
        )}</h1>
        <p style="margin:8px 0 0; font-size:15.5px; color:#F6EFE0; font-weight:600;">${escapeHtml(
          EVENT_DETAILS.tagline
        )} &nbsp;·&nbsp; ${escapeHtml(EVENT_DETAILS.dateBengali)}, ${escapeHtml(
          EVENT_DETAILS.timeBengali
        )} &nbsp;·&nbsp; ${escapeHtml(EVENT_DETAILS.venueNameBengali)}</p>
      </div>
      <div style="text-align:right;">
        <p style="margin:0; font-size:22px; font-weight:900; color:#F0D78C;">অতিথি তালিকা</p>
        <p style="margin:6px 0 0; font-size:12.5px; color:#C9BBD9;">তৈরি হয়েছে: ${escapeHtml(generatedAt)}</p>
      </div>
    </div>

    <div style="display:flex; gap:14px; padding:22px 50px; background:#FBF6E9; border-bottom:2px solid #D4AF37; flex-wrap:wrap;">
      ${statCard('মোট রেজিস্ট্রেশন', total)}
      ${statCard('কনফার্মড', confirmed, '#1E7A3B')}
      ${statCard('পেন্ডিং', pending, '#9A6B00')}
      ${statCard('রিজেক্টেড', rejected, '#A52C2C')}
      ${statCard('পেইড', paid, '#1E7A3B')}
      ${statCard('ডিউ', due, '#A52C2C')}
      ${statCard('সম্মানী', complimentary, '#5B3FA0')}
      ${statCard('মোট আদায় (টাকা)', totalCollected.toLocaleString('bn-BD'), '#7A1F3D')}
    </div>

    <table style="width:100%; border-collapse:collapse; font-size:13.5px;">
      <thead>
        <tr style="background:#7A1F3D;">
          <th style="padding:14px 10px; text-align:center; color:#F0D78C; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:0.4px; border-bottom:3px solid #D4AF37;">ক্রম</th>
          <th style="padding:14px 10px; text-align:left; color:#F0D78C; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:0.4px; border-bottom:3px solid #D4AF37;">Ticket ID</th>
          <th style="padding:14px 10px; text-align:left; color:#F0D78C; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:0.4px; border-bottom:3px solid #D4AF37;">নাম / পরিবার</th>
          <th style="padding:14px 10px; text-align:left; color:#F0D78C; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:0.4px; border-bottom:3px solid #D4AF37;">যোগাযোগ</th>
          <th style="padding:14px 10px; text-align:center; color:#F0D78C; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:0.4px; border-bottom:3px solid #D4AF37;">Adult</th>
          <th style="padding:14px 10px; text-align:left; color:#F0D78C; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:0.4px; border-bottom:3px solid #D4AF37;">Transaction ID / মেথড</th>
          <th style="padding:14px 10px; text-align:center; color:#F0D78C; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:0.4px; border-bottom:3px solid #D4AF37;">পেমেন্ট</th>
          <th style="padding:14px 10px; text-align:right; color:#F0D78C; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:0.4px; border-bottom:3px solid #D4AF37;">পরিমাণ</th>
          <th style="padding:14px 10px; text-align:center; color:#F0D78C; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:0.4px; border-bottom:3px solid #D4AF37;">স্ট্যাটাস</th>
          <th style="padding:14px 10px; text-align:left; color:#F0D78C; font-weight:900; font-size:13px; text-transform:uppercase; letter-spacing:0.4px; border-bottom:3px solid #D4AF37;">ইস্যু তারিখ</th>
        </tr>
      </thead>
      <tbody>
        ${buildTableRows(guests)}
      </tbody>
    </table>

    <div style="padding:22px 50px; text-align:center; color:#8a7a63; font-size:12.5px; border-top:3px solid #D4AF37; background:#FBF6E9;">
      Organized by <strong style="color:#7A1F3D;">${escapeHtml(EVENT_DETAILS.organizerNameBengali)}</strong>
      &nbsp;·&nbsp; Powered by <strong style="color:#7A1F3D;">${escapeHtml(EVENT_DETAILS.agencyName)}</strong>
      &nbsp;·&nbsp; ${escapeHtml(EVENT_DETAILS.fullTitle)} Admin Panel
    </div>
  </div>`;
}

async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          const finish = () => resolve();
          img.addEventListener('load', finish, { once: true });
          img.addEventListener('error', finish, { once: true });
          window.setTimeout(finish, 4000);
        })
    )
  );
}

export async function downloadGuestsPdf(guests: Ticket[]): Promise<void> {
  if (guests.length === 0) return;

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.zIndex = '-1';
  container.innerHTML = buildReportHtml(guests);
  document.body.appendChild(container);

  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);

    const reportRoot = container.querySelector('#gb-guest-list-pdf-report') as HTMLElement;
    await waitForImages(reportRoot);
    await document.fonts?.ready?.catch(() => undefined);
    await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));

    const canvas = await html2canvas(reportRoot, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      logging: false,
      imageTimeout: 15000,
    });

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL('image/png', 1);

    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0.5) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(120, 100, 80);
      pdf.text(`Page ${i} / ${pageCount}`, pageWidth - 22, pageHeight - 6);
    }

    const dateStamp = new Date().toISOString().slice(0, 10);
    pdf.save(`Gaan_Bristy_Guest_List_${dateStamp}.pdf`);
  } finally {
    container.remove();
  }
}
