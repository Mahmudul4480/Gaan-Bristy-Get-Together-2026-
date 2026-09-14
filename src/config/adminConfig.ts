export const SUPER_ADMIN_EMAIL = 'chotan4480@gmail.com';

/** URL query key — e.g. ?admin=gb2026 */
export const ADMIN_URL_PARAM = 'admin';

/** Secret value in URL to open admin panel */
export const ADMIN_URL_KEY = 'gb2026';

/** PIN to access admin panel */
export const ADMIN_PANEL_PIN = '2026';

export function getAdminPanelUrl(): string {
  const url = new URL(window.location.href);
  url.search = `${ADMIN_URL_PARAM}=${ADMIN_URL_KEY}`;
  url.hash = '';
  return url.toString();
}

/** URL query key — e.g. ?gate=gbgate2026 — opens the standalone Gate Scanner app. */
export const GATE_URL_PARAM = 'gate';

/** Secret value in URL to open the Gate Scanner app. Kept separate from
 * ADMIN_URL_KEY so the gate scanner link doesn't need to reveal the full
 * admin link, and the manifest swap in index.html matches this exact value. */
export const GATE_URL_KEY = 'gbgate2026';

/** PIN for the two gate scanners — separate from ADMIN_PANEL_PIN so they
 * cannot use it to open the full Admin Panel. */
export const GATE_SCANNER_PIN = '1909';

export function getGateAppUrl(): string {
  const url = new URL(window.location.href);
  url.search = `${GATE_URL_PARAM}=${GATE_URL_KEY}`;
  url.hash = '';
  return url.toString();
}
