/**
 * Layered persistence for dashboard user location: localStorage (primary), sessionStorage, cookie backup.
 * Keys live in `@/lib/constants` (`STORAGE_KEYS`, `SESSION_KEYS`).
 */

import { STORAGE_KEYS } from '@/lib/constants';
import type { DashboardZone } from '@/config/khatuZone';

const COOKIE_NAME = 'liftngo_dashboard_loc';
const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

export type UserLocationSource = 'geolocation' | 'manual' | 'skipped';

export interface StoredUserLocation {
  city: string;
  state: string;
  zone: DashboardZone;
  lat?: number;
  lng?: number;
  source: UserLocationSource;
  updatedAt: string;
}

function isStoredUserLocation(v: unknown): v is StoredUserLocation {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as StoredUserLocation;
  return (
    typeof o.city === 'string' &&
    typeof o.state === 'string' &&
    (o.zone === 'khatu' || o.zone === 'noida' || o.zone === 'default') &&
    typeof o.source === 'string' &&
    typeof o.updatedAt === 'string'
  );
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function writeCookie(name: string, value: string, maxAgeSec: number) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=${maxAgeSec};SameSite=Lax`;
}

export function getUserLocation(): StoredUserLocation | null {
  if (typeof window === 'undefined') return null;

  const rawLocal = localStorage.getItem(STORAGE_KEYS.DASHBOARD_USER_LOCATION);
  if (rawLocal) {
    try {
      const p = JSON.parse(rawLocal) as unknown;
      if (isStoredUserLocation(p)) return p;
    } catch {
      /* fall through */
    }
  }

  const rawSession = sessionStorage.getItem(STORAGE_KEYS.DASHBOARD_USER_LOCATION);
  if (rawSession) {
    try {
      const p = JSON.parse(rawSession) as unknown;
      if (isStoredUserLocation(p)) return p;
    } catch {
      /* fall through */
    }
  }

  const rawCookie = readCookie(COOKIE_NAME);
  if (rawCookie) {
    try {
      const p = JSON.parse(rawCookie) as unknown;
      if (isStoredUserLocation(p)) return p;
    } catch {
      /* fall through */
    }
  }

  return null;
}

export function saveUserLocation(data: Omit<StoredUserLocation, 'updatedAt'> & { updatedAt?: string }) {
  if (typeof window === 'undefined') return;
  const full: StoredUserLocation = {
    ...data,
    updatedAt: data.updatedAt ?? new Date().toISOString(),
  };
  const json = JSON.stringify(full);
  try {
    localStorage.setItem(STORAGE_KEYS.DASHBOARD_USER_LOCATION, json);
  } catch {
    /* quota / private mode */
  }
  try {
    sessionStorage.setItem(STORAGE_KEYS.DASHBOARD_USER_LOCATION, json);
  } catch {
    /* ignore */
  }
  writeCookie(COOKIE_NAME, json, COOKIE_MAX_AGE_SEC);
}

export function clearUserLocation() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.DASHBOARD_USER_LOCATION);
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.removeItem(STORAGE_KEYS.DASHBOARD_USER_LOCATION);
  } catch {
    /* ignore */
  }
  writeCookie(COOKIE_NAME, '', 0);
}
