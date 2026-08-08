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
