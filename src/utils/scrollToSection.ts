export const SITE_SECTION_IDS = [
  'hero',
  'schedule',
  'details',
  'team',
  'gallery',
  'guestbook',
  'honorable-guests',
  'venue',
] as const;

export type SiteSectionId = (typeof SITE_SECTION_IDS)[number];

const SECTION_ID_SET = new Set<string>(SITE_SECTION_IDS);

/** Re-scroll after gallery/images load and shift layout above the target section. */
const STABILIZE_DELAYS_MS = [0, 150, 400, 800, 1400, 2200, 3500];

export function normalizeSectionId(hash: string): string {
  return decodeURIComponent(hash.replace(/^#/, '').trim());
}

export function isSiteSectionId(id: string): id is SiteSectionId {
  return SECTION_ID_SET.has(id);
}

function getScrollOffsetForElement(element: HTMLElement): number {
  const style = window.getComputedStyle(element);
  const scrollMargin = parseFloat(style.scrollMarginTop || '0');
  if (!Number.isNaN(scrollMargin) && scrollMargin > 0) {
    return scrollMargin;
  }

  const header = document.getElementById('main-header');
  return (header?.getBoundingClientRect().height ?? 80) + 12;
}

export function scrollToSectionId(sectionId: string, behavior: ScrollBehavior = 'smooth'): boolean {
  const element = document.getElementById(sectionId);
  if (!element) return false;

  const offset = getScrollOffsetForElement(element);
  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

export function navigateToSection(sectionId: string, behavior: ScrollBehavior = 'smooth'): void {
  if (!isSiteSectionId(sectionId)) return;
  const nextUrl = `${window.location.pathname}${window.location.search}#${sectionId}`;
  window.history.pushState(null, '', nextUrl);
  scrollToSectionId(sectionId, behavior);
}

function resolveHashTarget(fallbackSection?: string): SiteSectionId | null {
  const hash = normalizeSectionId(window.location.hash);
  if (hash && isSiteSectionId(hash)) return hash;
  if (fallbackSection && isSiteSectionId(fallbackSection)) return fallbackSection;
  return null;
}

/**
 * Keeps correcting scroll position while the page layout shifts (e.g. gallery
 * photos loading above #guestbook).
 */
export function scheduleHashScrollStabilization(
  sectionId: SiteSectionId,
  options?: { delaysMs?: number[] }
): () => void {
  const delays = options?.delaysMs ?? STABILIZE_DELAYS_MS;
  const timers = delays.map((delay) =>
    window.setTimeout(() => {
      scrollToSectionId(sectionId, delay === 0 ? 'auto' : 'auto');
    }, delay)
  );

  return () => {
    timers.forEach((timer) => window.clearTimeout(timer));
  };
}

export function scrollToSectionWithRetry(
  sectionId: string,
  options?: { maxAttempts?: number; intervalMs?: number; initialBehavior?: ScrollBehavior }
): () => void {
  if (!isSiteSectionId(sectionId)) {
    return () => {};
  }

  const maxAttempts = options?.maxAttempts ?? 30;
  const intervalMs = options?.intervalMs ?? 100;
  let attempts = 0;
  let retryTimer = 0;
  let cancelStabilize = () => {};

  const finishScroll = () => {
    cancelStabilize();
    cancelStabilize = scheduleHashScrollStabilization(sectionId);
  };

  const tryScroll = () => {
    const behavior = attempts === 0 ? options?.initialBehavior ?? 'auto' : 'auto';
    if (scrollToSectionId(sectionId, behavior)) {
      finishScroll();
      return;
    }

    attempts += 1;
    if (attempts < maxAttempts) {
      retryTimer = window.setTimeout(tryScroll, intervalMs);
    }
  };

  retryTimer = window.setTimeout(tryScroll, 0);

  return () => {
    if (retryTimer) window.clearTimeout(retryTimer);
    cancelStabilize();
  };
}

export function scrollToHashFromLocation(options?: {
  maxAttempts?: number;
  intervalMs?: number;
}): () => void {
  const sectionId = resolveHashTarget();
  if (!sectionId) {
    return () => {};
  }
  return scrollToSectionWithRetry(sectionId, options);
}

/**
 * Wires up initial hash scroll, hashchange, window load, and layout reflows.
 */
export function bindHashNavigation(options?: { fallbackSection?: string }): () => void {
  let cancelActiveScroll = () => {};
  let resizeTimer = 0;
  let resizeObserver: ResizeObserver | null = null;

  const scrollToCurrentTarget = () => {
    const target = resolveHashTarget(options?.fallbackSection);
    if (!target) return;

    cancelActiveScroll();
    cancelActiveScroll = scrollToSectionWithRetry(target, { initialBehavior: 'auto' });
  };

  const onHashChange = () => scrollToCurrentTarget();
  const onLoad = () => scrollToCurrentTarget();

  scrollToCurrentTarget();

  window.addEventListener('hashchange', onHashChange);
  window.addEventListener('load', onLoad);

  const main = document.getElementById('main-content');
  if (main && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      if (!resolveHashTarget(options?.fallbackSection)) return;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const target = resolveHashTarget(options?.fallbackSection);
        if (target) scrollToSectionId(target, 'auto');
      }, 100);
    });
    resizeObserver.observe(main);
  }

  return () => {
    cancelActiveScroll();
    window.clearTimeout(resizeTimer);
    window.removeEventListener('hashchange', onHashChange);
    window.removeEventListener('load', onLoad);
    resizeObserver?.disconnect();
  };
}
