import { AppointedAdmin, AdminRole } from '../types';
import { SUPER_ADMIN_EMAIL, ADMIN_URL_KEY } from '../config/adminConfig';

const ADMINS_KEY = 'gaan-bristy-appointed-admins-2026';
const SESSION_KEY = 'gaan-bristy-admin-session';
const ROLE_KEY = 'gaan-bristy-admin-role';
const ACTOR_KEY = 'gaan-bristy-admin-actor';

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

export function setAdminSession(active: boolean, role?: AdminRole, actorName?: string): void {
  if (active) {
    sessionStorage.setItem(SESSION_KEY, '1');
    sessionStorage.setItem(ROLE_KEY, role || 'Super Admin');
    sessionStorage.setItem(ACTOR_KEY, (actorName || (role === 'Card Editor' ? 'Card Editor' : 'Super Admin')).trim());
  } else {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.removeItem(ACTOR_KEY);
  }
}

export function isAdminSessionActive(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

export function getAdminRole(): AdminRole {
  return sessionStorage.getItem(ROLE_KEY) === 'Card Editor' ? 'Card Editor' : 'Super Admin';
}

export function getAdminActorName(): string {
  return sessionStorage.getItem(ACTOR_KEY) || (getAdminRole() === 'Card Editor' ? 'Card Editor' : 'Super Admin');
}

export function isSuperAdminSession(): boolean {
  return isAdminSessionActive() && getAdminRole() === 'Super Admin';
}

export function isAdminUrlMatch(search: string): boolean {
  const params = new URLSearchParams(search);
  return params.get('admin') === ADMIN_URL_KEY;
}
