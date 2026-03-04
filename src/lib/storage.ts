/**
 * Client-side storage helpers for booking data.
 * Centralizes localStorage keys and parsing; safe for SSR (no-op when window is undefined).
 */

import type { SavedLocation, PersonDetails, ServiceId } from '@/types/booking';
import { STORAGE_KEYS } from './constants';

function safeParse<T>(raw: string | null, guard: (v: unknown) => v is T): T | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return guard(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function isSavedLocation(v: unknown): v is SavedLocation & { contact?: string } {
  const o = v as SavedLocation & { contact?: string };
  return (
    typeof v === 'object' &&
    v !== null &&
    'name' in v &&
    'address' in v &&
    typeof o.name === 'string' &&
    typeof o.address === 'string' &&
    (typeof o.contact === 'string' || o.contact === undefined)
  );
}

function normalizeSavedLocation(o: SavedLocation & { contact?: string }): SavedLocation {
  return { name: o.name, address: o.address, contact: o.contact ?? '' };
}

function isPersonDetails(v: unknown): v is PersonDetails {
  return (
    typeof v === 'object' &&
    v !== null &&
    'name' in v &&
    'mobile' in v &&
    typeof (v as PersonDetails).name === 'string' &&
    typeof (v as PersonDetails).mobile === 'string'
  );
}

export function getPickupLocation(): SavedLocation | null {
  if (typeof window === 'undefined') return null;
  const raw = safeParse(window.localStorage.getItem(STORAGE_KEYS.PICKUP_LOCATION), isSavedLocation);
  return raw ? normalizeSavedLocation(raw) : null;
}

export function getDropLocation(): SavedLocation | null {
  if (typeof window === 'undefined') return null;
  const raw = safeParse(window.localStorage.getItem(STORAGE_KEYS.DROP_LOCATION), isSavedLocation);
  return raw ? normalizeSavedLocation(raw) : null;
}

export function getStopLocation(): SavedLocation | null {
  if (typeof window === 'undefined') return null;
  const raw = safeParse(window.localStorage.getItem(STORAGE_KEYS.STOP_LOCATION), isSavedLocation);
  return raw ? normalizeSavedLocation(raw) : null;
}

export function getSenderDetails(): PersonDetails | null {
  if (typeof window === 'undefined') return null;
  return safeParse(window.localStorage.getItem(STORAGE_KEYS.SENDER_DETAILS), isPersonDetails);
}

export function getReceiverDetails(): PersonDetails | null {
  if (typeof window === 'undefined') return null;
  return safeParse(window.localStorage.getItem(STORAGE_KEYS.RECEIVER_DETAILS), isPersonDetails);
}

export function getStopDetails(): PersonDetails | null {
  if (typeof window === 'undefined') return null;
  return safeParse(window.localStorage.getItem(STORAGE_KEYS.STOP_DETAILS), isPersonDetails);
}

export function getLandingPickupLocation(): string | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(STORAGE_KEYS.LANDING_PICKUP_LOCATION);
  return v && v.trim() ? v.trim() : null;
}

export function getStoredPhone(): string {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem(STORAGE_KEYS.PHONE) || '';
}

export function setStoredPhone(phone: string): void {
  try {
    if (phone?.trim()) window?.localStorage?.setItem(STORAGE_KEYS.PHONE, phone.trim());
    else window?.localStorage?.removeItem(STORAGE_KEYS.PHONE);
  } catch {
    // ignore
  }
}

export function setLoggedIn(value: boolean): void {
  try {
    if (value) window?.localStorage?.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
    else window?.localStorage?.removeItem(STORAGE_KEYS.LOGGED_IN);
  } catch {
    // ignore
  }
}

/** Returns whether the user is logged in (client-only). */
export function getLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true';
}

export function getSelectedService(): ServiceId | null {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(STORAGE_KEYS.SELECTED_SERVICE);
  if (v === 'walk' || v === 'twoWheeler' || v === 'threeWheeler') return v;
  return null;
}

export function setSelectedService(id: ServiceId): void {
  try {
    window?.localStorage?.setItem(STORAGE_KEYS.SELECTED_SERVICE, id);
  } catch {
    // ignore
  }
}

export function setPickupLocation(loc: SavedLocation): void {
  try {
    window?.localStorage?.setItem(STORAGE_KEYS.PICKUP_LOCATION, JSON.stringify(loc));
  } catch {
    // ignore
  }
}

export function setDropLocation(loc: SavedLocation): void {
  try {
    window?.localStorage?.setItem(STORAGE_KEYS.DROP_LOCATION, JSON.stringify(loc));
  } catch {
    // ignore
  }
}

export function setStopLocation(loc: SavedLocation | null): void {
  try {
    if (loc) window?.localStorage?.setItem(STORAGE_KEYS.STOP_LOCATION, JSON.stringify(loc));
    else window?.localStorage?.removeItem(STORAGE_KEYS.STOP_LOCATION);
  } catch {
    // ignore
  }
}

export function setSenderDetails(d: PersonDetails): void {
  try {
    window?.localStorage?.setItem(STORAGE_KEYS.SENDER_DETAILS, JSON.stringify(d));
  } catch {
    // ignore
  }
}

export function setReceiverDetails(d: PersonDetails): void {
  try {
    window?.localStorage?.setItem(STORAGE_KEYS.RECEIVER_DETAILS, JSON.stringify(d));
  } catch {
    // ignore
  }
}

export function setStopDetails(d: PersonDetails): void {
  try {
    window?.localStorage?.setItem(STORAGE_KEYS.STOP_DETAILS, JSON.stringify(d));
  } catch {
    // ignore
  }
}

/** Clear stop details (call when stop location is removed to keep storage consistent). */
export function clearStopDetails(): void {
  try {
    window?.localStorage?.removeItem(STORAGE_KEYS.STOP_DETAILS);
  } catch {
    // ignore
  }
}

export function setLandingPickupLocation(value: string | null): void {
  try {
    if (value?.trim()) window?.localStorage?.setItem(STORAGE_KEYS.LANDING_PICKUP_LOCATION, value.trim());
    else window?.localStorage?.removeItem(STORAGE_KEYS.LANDING_PICKUP_LOCATION);
  } catch {
    // ignore
  }
}
