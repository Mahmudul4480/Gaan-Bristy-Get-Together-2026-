import { GATE_URL_KEY, GATE_URL_PARAM } from '../config/adminConfig';

// Deliberately separate sessionStorage keys from the main Admin Panel
// session, so a gate scanner's login never grants (or borrows) Super
// Admin / Card Editor access, and vice versa.
const GATE_SESSION_KEY = 'gaan-bristy-gate-session';
const GATE_ACTOR_KEY = 'gaan-bristy-gate-actor';

export function isGateUrlMatch(search: string): boolean {
  const params = new URLSearchParams(search);
  return params.get(GATE_URL_PARAM) === GATE_URL_KEY;
}

export function setGateSession(active: boolean, actorName?: string): void {
  if (active) {
    sessionStorage.setItem(GATE_SESSION_KEY, '1');
    sessionStorage.setItem(GATE_ACTOR_KEY, (actorName || 'Gate Scanner').trim());
  } else {
    sessionStorage.removeItem(GATE_SESSION_KEY);
    sessionStorage.removeItem(GATE_ACTOR_KEY);
  }
}

export function isGateSessionActive(): boolean {
  return sessionStorage.getItem(GATE_SESSION_KEY) === '1';
}

export function getGateActorName(): string {
  return sessionStorage.getItem(GATE_ACTOR_KEY) || 'Gate Scanner';
}
