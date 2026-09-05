type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function getGaMeasurementId(): string {
  return (
    import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ||
    import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim() ||
    ''
  );
}

export function getSearchConsoleVerification(): string {
  return import.meta.env.VITE_GSC_VERIFICATION?.trim() || '';
}

export function isAnalyticsReady(): boolean {
  return Boolean(getGaMeasurementId() && typeof window !== 'undefined' && window.gtag);
}

export function trackPageView(path?: string): void {
  if (!isAnalyticsReady() || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: path || `${window.location.pathname}${window.location.search}${window.location.hash}`,
  });
}

export function trackEvent(name: string, params: AnalyticsEventParams = {}): void {
  if (!isAnalyticsReady() || !window.gtag) return;
  window.gtag('event', name, params);
}

export function trackSectionView(sectionId: string): void {
  trackEvent('view_section', { section_id: sectionId });
}

export function trackRegisterOpen(source: string): void {
  trackEvent('begin_checkout', { source, currency: 'BDT' });
  trackEvent('register_open', { source });
}

export function trackGuestbookOpen(source: string): void {
  trackEvent('guestbook_open', { source });
}

export function installAnalytics(): void {
  const measurementId = getGaMeasurementId();
  if (!measurementId || typeof document === 'undefined') return;
  if (document.getElementById('gaanbristy-gtag')) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true,
    send_page_view: true,
  });

  const script = document.createElement('script');
  script.id = 'gaanbristy-gtag';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}
