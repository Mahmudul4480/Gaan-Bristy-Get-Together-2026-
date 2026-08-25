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

export function normalizeSectionId(hash: string): string {
  return hash.replace(/^#/, '').trim();
}

export function isSiteSectionId(id: string): id is SiteSectionId {
  return SECTION_ID_SET.has(id);
}

export function scrollToSectionId(sectionId: string, behavior: ScrollBehavior = 'smooth'): boolean {
  const element = document.getElementById(sectionId);
  if (!element) return false;
  element.scrollIntoView({ behavior, block: 'start' });
  return true;
}

export function navigateToSection(sectionId: string, behavior: ScrollBehavior = 'smooth'): void {
  if (!isSiteSectionId(sectionId)) return;
  const nextUrl = `${window.location.pathname}${window.location.search}#${sectionId}`;
  window.history.pushState(null, '', nextUrl);
  scrollToSectionId(sectionId, behavior);
}

/**
 * Retries scrolling until React has mounted the target section — needed for
 * direct links like https://gaanbristy.site/#guestbook
 */
export function scrollToSectionWithRetry(
  sectionId: string,
  options?: { maxAttempts?: number; intervalMs?: number; initialBehavior?: ScrollBehavior }
): () => void {
  const maxAttempts = options?.maxAttempts ?? 25;
  const intervalMs = options?.intervalMs ?? 100;
  let attempts = 0;
  let timer = 0;

  const tryScroll = () => {
    const behavior = attempts === 0 ? options?.initialBehavior ?? 'auto' : 'smooth';
    if (scrollToSectionId(sectionId, behavior)) return;

    attempts += 1;
    if (attempts < maxAttempts) {
      timer = window.setTimeout(tryScroll, intervalMs);
    }
  };

  timer = window.setTimeout(tryScroll, 0);

  return () => {
    if (timer) window.clearTimeout(timer);
  };
}

export function scrollToHashFromLocation(options?: {
  maxAttempts?: number;
  intervalMs?: number;
}): () => void {
  const sectionId = normalizeSectionId(window.location.hash);
  if (!sectionId || !isSiteSectionId(sectionId)) {
    return () => {};
  }
  return scrollToSectionWithRetry(sectionId, options);
}
