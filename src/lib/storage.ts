/**
 * Client-side storage helpers for booking data.
 * Centralizes localStorage keys and parsing; safe for SSR (no-op when window is undefined).
 */

import type { SavedLocation, PersonDetails, ServiceId } from '@/types/booking';
import { ROUTES, SESSION_KEYS, STORAGE_KEYS } from './constants';

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

/** Temporary dummy auth token set after OTP verification (client-only). */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const t = window.localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return t && t.trim() ? t.trim() : null;
}

export function setAuthToken(token: string): void {
  try {
    if (token?.trim()) window?.localStorage?.setItem(STORAGE_KEYS.AUTH_TOKEN, token.trim());
    else window?.localStorage?.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch {
    // ignore
  }
}

export function clearAuthToken(): void {
  try {
    window?.localStorage?.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch {
    // ignore
  }
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

export function clearPickupLocation(): void {
  try {
    window?.localStorage?.removeItem(STORAGE_KEYS.PICKUP_LOCATION);
  } catch {
    // ignore
  }
}

export function clearDropLocation(): void {
  try {
    window?.localStorage?.removeItem(STORAGE_KEYS.DROP_LOCATION);
  } catch {
    // ignore
  }
}

/** True when a saved location is safe to show (non-empty address). */
export function savedLocationHasAddress(loc: SavedLocation | null | undefined): loc is SavedLocation {
  return Boolean(loc && typeof loc.address === 'string' && loc.address.trim().length > 0);
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

/**
 * Landing hero “Enter pickup → login” flow: after OTP, go to /pickup-location.
 * Cleared when opening login from the header (dashboard path).
 */
export function setPostLoginPath(path: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (path === ROUTES.PICKUP_LOCATION) {
      sessionStorage.setItem(SESSION_KEYS.POST_LOGIN_PATH, ROUTES.PICKUP_LOCATION);
    }
  } catch {
    // ignore (private mode / quota)
  }
}

export function clearPostLoginPath(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SESSION_KEYS.POST_LOGIN_PATH);
  } catch {
    // ignore
  }
}

/** Read and remove post-login redirect (one-shot). Unknown values fall back to dashboard. */
export function consumePostLoginPath(): string {
  if (typeof window === 'undefined') return ROUTES.DASHBOARD;
  try {
    const raw = sessionStorage.getItem(SESSION_KEYS.POST_LOGIN_PATH);
    sessionStorage.removeItem(SESSION_KEYS.POST_LOGIN_PATH);
    if (raw === ROUTES.PICKUP_LOCATION) return ROUTES.PICKUP_LOCATION;
    return ROUTES.DASHBOARD;
  } catch {
    return ROUTES.DASHBOARD;
  }
}

/** Restaurant food order for delivery – set when user books delivery from Find Restaurant flow. */
export interface DeliveryGoodsDescription {
  restaurantName: string;
  items: { name: string; quantity: number; price: string }[];
}

function isDeliveryGoodsDescription(v: unknown): v is DeliveryGoodsDescription {
  const o = v as DeliveryGoodsDescription;
  return (
    typeof v === 'object' &&
    v !== null &&
    'restaurantName' in v &&
    'items' in v &&
    typeof o.restaurantName === 'string' &&
    Array.isArray(o.items) &&
    o.items.every(
      (i) =>
        typeof i === 'object' &&
        i !== null &&
        'name' in i &&
        'quantity' in i &&
        'price' in i &&
        typeof (i as { name: string; quantity: number; price: string }).name === 'string' &&
        typeof (i as { name: string; quantity: number; price: string }).quantity === 'number' &&
        typeof (i as { name: string; quantity: number; price: string }).price === 'string'
    )
  );
}

export function getDeliveryGoodsDescription(): DeliveryGoodsDescription | null {
  if (typeof window === 'undefined') return null;
  const raw = safeParse(window.localStorage.getItem(STORAGE_KEYS.DELIVERY_GOODS_DESCRIPTION), isDeliveryGoodsDescription);
  return raw;
}

export function setDeliveryGoodsDescription(data: DeliveryGoodsDescription): void {
  try {
    window?.localStorage?.setItem(STORAGE_KEYS.DELIVERY_GOODS_DESCRIPTION, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function clearDeliveryGoodsDescription(): void {
  try {
    window?.localStorage?.removeItem(STORAGE_KEYS.DELIVERY_GOODS_DESCRIPTION);
  } catch {
    // ignore
  }
}
