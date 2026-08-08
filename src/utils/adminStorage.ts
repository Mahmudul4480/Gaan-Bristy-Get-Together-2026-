import { AppointedAdmin } from '../types';
import { SUPER_ADMIN_EMAIL, ADMIN_URL_KEY } from '../config/adminConfig';

const ADMINS_KEY = 'gaan-bristy-appointed-admins-2026';
const SESSION_KEY = 'gaan-bristy-admin-session';

const DEFAULT_SUPER_ADMIN: AppointedAdmin = {
  id: 'super-admin',
  name: 'Super Admin',
  phone: SUPER_ADMIN_EMAIL,
  role: 'Super Admin',
  appointedAt: new Date(0).toISOString(),
};

export function loadAppointedAdmins(): AppointedAdmin[] {
  try {
    const raw = localStorage.getItem(ADMINS_KEY);
    if (!raw) return [DEFAULT_SUPER_ADMIN];
    const parsed = JSON.parse(raw) as AppointedAdmin[];
    const list = Array.isArray(parsed) ? parsed : [];
    if (!list.some((a) => a.role === 'Super Admin')) {
      return [DEFAULT_SUPER_ADMIN, ...list];
    }
    return list;
  } catch {
    return [DEFAULT_SUPER_ADMIN];
  }
}

export function saveAppointedAdmins(admins: AppointedAdmin[]): AppointedAdmin[] {
  localStorage.setItem(ADMINS_KEY, JSON.stringify(admins));
  return admins;
}

export function appointCardEditor(name: string, phone: string): AppointedAdmin[] {
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();
  if (!trimmedName || trimmedPhone.length < 11) return loadAppointedAdmins();

  const admins = loadAppointedAdmins();
  if (admins.some((a) => a.phone === trimmedPhone)) return admins;

  const next: AppointedAdmin = {
    id: `admin-${Date.now()}`,
    name: trimmedName,
    phone: trimmedPhone,
    role: 'Card Editor',
    appointedAt: new Date().toISOString(),
  };
  return saveAppointedAdmins([...admins, next]);
}

export function removeAppointedAdmin(id: string): AppointedAdmin[] {
  if (id === 'super-admin') return loadAppointedAdmins();
  return saveAppointedAdmins(loadAppointedAdmins().filter((a) => a.id !== id));
}

export function setAdminSession(active: boolean): void {
  if (active) {
    sessionStorage.setItem(SESSION_KEY, '1');
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

export function isAdminSessionActive(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export function isAdminUrlMatch(search: string): boolean {
  const params = new URLSearchParams(search);
  return params.get('admin') === ADMIN_URL_KEY;
}
