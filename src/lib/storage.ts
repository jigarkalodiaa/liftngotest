/**
 * Client-side storage helpers for booking data.
 * Centralizes localStorage keys and parsing; safe for SSR (no-op when window is undefined).
 */

import type { SavedLocation, PersonDetails, ServiceId, DefaultTrip } from '@/types/booking';
import type { UserProfile } from '@/types/userProfile';
import { ROUTES, SESSION_KEYS, STORAGE_KEYS } from './constants';

const ALLOWED_POST_LOGIN_PATHS = new Set<string>([ROUTES.PICKUP_LOCATION, ROUTES.PICKUP_LOCATION_EDIT]);

function isAllowedFindRestaurantPostLoginPath(pathOnly: string): boolean {
  if (pathOnly === ROUTES.FIND_RESTAURANT) return true;
  const prefix = `${ROUTES.FIND_RESTAURANT}/`;
  if (!pathOnly.startsWith(prefix)) return false;
  const slug = pathOnly.slice(prefix.length);
  if (!slug || slug.includes('/') || slug.includes('..')) return false;
  return /^[a-z0-9-]+$/i.test(slug);
}

/** Allow pickup booking URLs, food menu listing, and `/find-restaurant/[slug]` — no open redirects. */
export function sanitizePostLoginRedirectTarget(raw: string): string | null {
  const t = raw.trim();
  if (t.includes('//') || t.includes('\\')) return null;
  const hashIdx = t.indexOf('#');
  const beforeHash = hashIdx === -1 ? t : t.slice(0, hashIdx);
  const q = beforeHash.indexOf('?');
  const pathOnly = q === -1 ? beforeHash : beforeHash.slice(0, q);
  if (!pathOnly.startsWith('/')) return null;
  if (ALLOWED_POST_LOGIN_PATHS.has(pathOnly)) return t;
  if (isAllowedFindRestaurantPostLoginPath(pathOnly)) return t;
  return null;
}

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

function isDefaultTrip(v: unknown): v is DefaultTrip {
  const o = v as DefaultTrip;
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof o.id === 'string' &&
    typeof o.fromName === 'string' &&
    typeof o.fromAddress === 'string' &&
    typeof o.toName === 'string' &&
    typeof o.toAddress === 'string' &&
    typeof o.contactName === 'string' &&
    typeof o.contactPhone === 'string'
  );
}

export function getCustomDefaultTrips(): DefaultTrip[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.CUSTOM_DEFAULT_TRIPS) || 'null') as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter(isDefaultTrip);
  } catch {
    return [];
  }
}

export function addCustomDefaultTrip(trip: Omit<DefaultTrip, 'id'>): void {
  try {
    const current = getCustomDefaultTrips();
    const id = `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const nextItem: DefaultTrip = { id, ...trip };
    const deduped = current.filter(
      (t) => !(t.fromAddress === trip.fromAddress && t.toAddress === trip.toAddress)
    );
    window?.localStorage?.setItem(
      STORAGE_KEYS.CUSTOM_DEFAULT_TRIPS,
      JSON.stringify([nextItem, ...deduped].slice(0, 20))
    );
  } catch {
    // ignore
  }
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

/** True if user has session (logged-in flag or auth token). Used for My Details / protected menu items. */
export function isUserAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return getLoggedIn() || Boolean(getAuthToken());
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
  if (v === 'walk' || v === 'twoWheeler' || v === 'threeWheeler' || v === 'fourWheeler') return v;
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

export function clearReceiverDetails(): void {
  try {
    window?.localStorage?.removeItem(STORAGE_KEYS.RECEIVER_DETAILS);
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
 * Store full post-login URL (`/pickup-location` or with `?query`). Validated to prevent open redirects.
 */
export function setPostLoginRedirect(fullPath: string): void {
  if (typeof window === 'undefined') return;
  const safe = sanitizePostLoginRedirectTarget(fullPath);
  if (!safe) return;
  try {
    sessionStorage.setItem(SESSION_KEYS.POST_LOGIN_PATH, safe);
  } catch {
    // ignore (private mode / quota)
  }
}

/** @deprecated Prefer {@link setPostLoginRedirect} for flows that need query params. */
export function setPostLoginPath(path: string): void {
  if (path === ROUTES.PICKUP_LOCATION) setPostLoginRedirect(ROUTES.PICKUP_LOCATION);
}

export function clearPostLoginPath(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SESSION_KEYS.POST_LOGIN_PATH);
  } catch {
    // ignore
  }
}

/** Read post-login target without consuming (e.g. already logged-in user hits `/login`). */
export function peekPostLoginRedirect(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEYS.POST_LOGIN_PATH);
    return raw ? sanitizePostLoginRedirectTarget(raw) : null;
  } catch {
    return null;
  }
}

/** Read and remove post-login redirect (one-shot). Invalid or missing → dashboard. */
export function consumePostLoginRedirect(): string {
  if (typeof window === 'undefined') return ROUTES.DASHBOARD;
  try {
    const raw = sessionStorage.getItem(SESSION_KEYS.POST_LOGIN_PATH);
    sessionStorage.removeItem(SESSION_KEYS.POST_LOGIN_PATH);
    const safe = raw ? sanitizePostLoginRedirectTarget(raw) : null;
    return safe ?? ROUTES.DASHBOARD;
  } catch {
    return ROUTES.DASHBOARD;
  }
}

/** @alias {@link consumePostLoginRedirect} */
export function consumePostLoginPath(): string {
  return consumePostLoginRedirect();
}

export function setLoginContinuationMessage(message: string): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(SESSION_KEYS.LOGIN_CONTINUATION_MESSAGE, message);
  } catch {
    // ignore
  }
}

export function consumeLoginContinuationMessage(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = sessionStorage.getItem(SESSION_KEYS.LOGIN_CONTINUATION_MESSAGE);
    sessionStorage.removeItem(SESSION_KEYS.LOGIN_CONTINUATION_MESSAGE);
    return v && v.trim() ? v.trim() : null;
  } catch {
    return null;
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

/** Food menu cart — survives refresh and login (cleared when cart empty for that restaurant). */
export interface FoodOrderCartDraft {
  restaurantId: string;
  items: { name: string; price: string; quantity: number }[];
  whatsappOpened: boolean;
}

function isFoodOrderCartDraft(v: unknown): v is FoodOrderCartDraft {
  const o = v as FoodOrderCartDraft;
  return (
    typeof o === 'object' &&
    o !== null &&
    typeof o.restaurantId === 'string' &&
    typeof o.whatsappOpened === 'boolean' &&
    Array.isArray(o.items) &&
    o.items.every(
      (i) =>
        typeof i === 'object' &&
        i !== null &&
        typeof (i as FoodOrderCartDraft['items'][0]).name === 'string' &&
        typeof (i as FoodOrderCartDraft['items'][0]).price === 'string' &&
        typeof (i as FoodOrderCartDraft['items'][0]).quantity === 'number'
    )
  );
}

export function getFoodOrderCartDraft(): FoodOrderCartDraft | null {
  if (typeof window === 'undefined') return null;
  return safeParse(window.localStorage.getItem(STORAGE_KEYS.FOOD_ORDER_CART_DRAFT), isFoodOrderCartDraft);
}

export function setFoodOrderCartDraft(data: FoodOrderCartDraft): void {
  try {
    window?.localStorage?.setItem(STORAGE_KEYS.FOOD_ORDER_CART_DRAFT, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function clearFoodOrderCartDraft(): void {
  try {
    window?.localStorage?.removeItem(STORAGE_KEYS.FOOD_ORDER_CART_DRAFT);
  } catch {
    // ignore
  }
}

function isUserProfile(v: unknown): v is UserProfile {
  const o = v as UserProfile;
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof o.fullName === 'string' &&
    typeof o.alternatePhone === 'string' &&
    typeof o.emergencyContactName === 'string' &&
    typeof o.emergencyContactPhone === 'string' &&
    typeof o.accountNumber === 'string' &&
    typeof o.address === 'string' &&
    typeof o.email === 'string'
  );
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  return safeParse(window.localStorage.getItem(STORAGE_KEYS.USER_PROFILE), isUserProfile);
}

export function setUserProfile(profile: UserProfile): void {
  try {
    window?.localStorage?.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function clearUserProfile(): void {
  try {
    window?.localStorage?.removeItem(STORAGE_KEYS.USER_PROFILE);
  } catch {
    // ignore
  }
}
