/**
 * Client-side storage helpers for booking data.
 * Centralizes sessionStorage keys and parsing; safe for SSR (no-op when window is undefined).
 */

import type {
  SavedLocation,
  PersonDetails,
  ServiceId,
  DefaultTrip,
  BookingStopWaypoint,
  HotelBookingDraft,
  HotelHistoryItem,
  FoodDeliveryHistoryItem,
  MarketplaceOrderHistoryItem,
  SalasarRideHistoryItem,
} from '@/types/booking';
import type { SavedKhatuRideBooking } from '@/lib/khatuSessionStorage';
import type { UserProfile } from '@/types/userProfile';
import { ROUTES, SESSION_KEYS, STORAGE_KEYS } from './constants';

const ALLOWED_POST_LOGIN_PATHS = new Set<string>([ROUTES.PICKUP_LOCATION, ROUTES.PICKUP_LOCATION_EDIT]);

/** Product / plans / Noida entry paths — allowlisted for `/login?redirect=` (no open redirects). */
const ALLOWED_PRODUCT_POST_LOGIN_PATHS = new Set<string>([
  ROUTES.DASHBOARD,
  ROUTES.NOIDA,
  ROUTES.PICKUP_LOCATION,
  ROUTES.PICKUP_LOCATION_EDIT,
  ROUTES.BOOK_DELIVERY,
  ROUTES.PLANS,
  ROUTES.PLANS_SUBSCRIPTION,
  ROUTES.PLANS_SUBSCRIPTION_CHECKOUT,
  ROUTES.PLANS_LEASE,
  ROUTES.PLANS_LEASE_CHECKOUT,
  ROUTES.PLANS_RENT,
  ROUTES.PLANS_RENT_CHECKOUT,
  ROUTES.PLANS_CUSTOM,
  ROUTES.PLANS_CUSTOM_CHECKOUT,
  ROUTES.PLANS_GST,
  ROUTES.GROW_WITH_LIFTNGO,
]);

function isAllowedFindRestaurantPostLoginPath(pathOnly: string): boolean {
  if (pathOnly === ROUTES.FIND_RESTAURANT || pathOnly === ROUTES.FIND_RESTAURANT_CART) return true;
  const prefix = `${ROUTES.FIND_RESTAURANT}/`;
  if (!pathOnly.startsWith(prefix)) return false;
  const slug = pathOnly.slice(prefix.length);
  if (!slug || slug.includes('/') || slug.includes('..')) return false;
  return /^[a-z0-9-]+$/i.test(slug);
}

/** Allow pickup booking URLs, plans, dashboard entry, food menu listing, and `/find-restaurant/[slug]` — no open redirects. */
export function sanitizePostLoginRedirectTarget(raw: string): string | null {
  const t = raw.trim();
  if (t.includes('//') || t.includes('\\')) return null;
  const hashIdx = t.indexOf('#');
  const beforeHash = hashIdx === -1 ? t : t.slice(0, hashIdx);
  const q = beforeHash.indexOf('?');
  const pathOnly = q === -1 ? beforeHash : beforeHash.slice(0, q);
  if (!pathOnly.startsWith('/')) return null;
  if (ALLOWED_POST_LOGIN_PATHS.has(pathOnly)) return t;
  if (ALLOWED_PRODUCT_POST_LOGIN_PATHS.has(pathOnly)) return t;
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
  return {
    name: o.name,
    address: o.address,
    contact: o.contact ?? '',
    ...(typeof o.latitude === 'number' ? { latitude: o.latitude } : {}),
    ...(typeof o.longitude === 'number' ? { longitude: o.longitude } : {}),
  };
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

function isBookingStopWaypoint(v: unknown): v is BookingStopWaypoint {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as BookingStopWaypoint;
  return typeof o.id === 'string' && isSavedLocation(o.location) && isPersonDetails(o.contact);
}

function makeStopId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `st-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const LEGACY_SINGLE_STOP_ID = 'liftngo-legacy-stop';

function normalizeWaypoint(w: BookingStopWaypoint): BookingStopWaypoint {
  return {
    id: w.id,
    location: normalizeSavedLocation(w.location as SavedLocation & { contact?: string }),
    contact: {
      name: w.contact.name.trim(),
      mobile: (w.contact.mobile || '').replace(/\D/g, ''),
    },
  };
}

function parseStopWaypointsFromStorage(raw: string | null): BookingStopWaypoint[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isBookingStopWaypoint).map((w) => normalizeWaypoint(w));
  } catch {
    return [];
  }
}

function buildLegacyWaypointFromKeys(): BookingStopWaypoint | null {
  if (typeof window === 'undefined') return null;
  const rawLoc = safeParse(window.sessionStorage.getItem(STORAGE_KEYS.STOP_LOCATION), isSavedLocation);
  if (!savedLocationHasAddress(rawLoc)) return null;
  const details = safeParse(window.sessionStorage.getItem(STORAGE_KEYS.STOP_DETAILS), isPersonDetails);
  return {
    id: LEGACY_SINGLE_STOP_ID,
    location: normalizeSavedLocation(rawLoc),
    contact: details ? { name: details.name, mobile: details.mobile.replace(/\D/g, '') } : { name: '', mobile: '' },
  };
}

function syncLegacyStopKeys(waypoints: BookingStopWaypoint[]): void {
  try {
    const first = waypoints[0];
    if (first && savedLocationHasAddress(first.location)) {
      window.sessionStorage?.setItem(STORAGE_KEYS.STOP_LOCATION, JSON.stringify(first.location));
      window.sessionStorage?.setItem(STORAGE_KEYS.STOP_DETAILS, JSON.stringify(first.contact));
    } else {
      window.sessionStorage?.removeItem(STORAGE_KEYS.STOP_LOCATION);
      window.sessionStorage?.removeItem(STORAGE_KEYS.STOP_DETAILS);
    }
  } catch {
    // ignore
  }
}

/** All intermediate stops in order; migrates legacy single `stop_location` + `stop_details` on first read. */
export function getStopWaypoints(): BookingStopWaypoint[] {
  if (typeof window === 'undefined') return [];
  let list = parseStopWaypointsFromStorage(window.sessionStorage.getItem(STORAGE_KEYS.STOP_WAYPOINTS));
  if (list.length > 0) return list;
  const legacy = buildLegacyWaypointFromKeys();
  if (!legacy) return [];
  try {
    list = [legacy];
    window.sessionStorage.setItem(STORAGE_KEYS.STOP_WAYPOINTS, JSON.stringify(list));
    syncLegacyStopKeys(list);
  } catch {
    return [legacy];
  }
  return list;
}

export function setStopWaypoints(waypoints: BookingStopWaypoint[]): void {
  try {
    const normalized = waypoints
      .filter((w) => savedLocationHasAddress(w.location))
      .map((w) => normalizeWaypoint(w));
    if (normalized.length === 0) {
      window?.sessionStorage?.removeItem(STORAGE_KEYS.STOP_WAYPOINTS);
      syncLegacyStopKeys([]);
    } else {
      window?.sessionStorage?.setItem(STORAGE_KEYS.STOP_WAYPOINTS, JSON.stringify(normalized));
      syncLegacyStopKeys(normalized);
    }
  } catch {
    // ignore
  }
}

/** New intermediate stop id (stable UUID when available). */
export function makeBookingStopId(): string {
  return makeStopId();
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
    const raw = JSON.parse(window.sessionStorage.getItem(STORAGE_KEYS.CUSTOM_DEFAULT_TRIPS) || 'null') as unknown;
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
    window?.sessionStorage?.setItem(
      STORAGE_KEYS.CUSTOM_DEFAULT_TRIPS,
      JSON.stringify([nextItem, ...deduped].slice(0, 20))
    );
  } catch {
    // ignore
  }
}

export function getPickupLocation(): SavedLocation | null {
  if (typeof window === 'undefined') return null;
  const raw = safeParse(window.sessionStorage.getItem(STORAGE_KEYS.PICKUP_LOCATION), isSavedLocation);
  return raw ? normalizeSavedLocation(raw) : null;
}

export function getDropLocation(): SavedLocation | null {
  if (typeof window === 'undefined') return null;
  const raw = safeParse(window.sessionStorage.getItem(STORAGE_KEYS.DROP_LOCATION), isSavedLocation);
  return raw ? normalizeSavedLocation(raw) : null;
}

export function getStopLocation(): SavedLocation | null {
  const w = getStopWaypoints();
  const loc = w[0]?.location;
  return savedLocationHasAddress(loc) ? loc : null;
}

export function getSenderDetails(): PersonDetails | null {
  if (typeof window === 'undefined') return null;
  return safeParse(window.sessionStorage.getItem(STORAGE_KEYS.SENDER_DETAILS), isPersonDetails);
}

export function getReceiverDetails(): PersonDetails | null {
  if (typeof window === 'undefined') return null;
  return safeParse(window.sessionStorage.getItem(STORAGE_KEYS.RECEIVER_DETAILS), isPersonDetails);
}

export function getStopDetails(): PersonDetails | null {
  if (typeof window === 'undefined') return null;
  const w = getStopWaypoints();
  if (w[0]) return w[0].contact;
  return safeParse(window.sessionStorage.getItem(STORAGE_KEYS.STOP_DETAILS), isPersonDetails);
}

export function getLandingPickupLocation(): string | null {
  if (typeof window === 'undefined') return null;
  const v = window.sessionStorage.getItem(STORAGE_KEYS.LANDING_PICKUP_LOCATION);
  return v && v.trim() ? v.trim() : null;
}

export function getStoredPhone(): string {
  if (typeof window === 'undefined') return '';
  return window.sessionStorage.getItem(STORAGE_KEYS.PHONE) || '';
}

export function setStoredPhone(phone: string): void {
  try {
    if (phone?.trim()) window?.sessionStorage?.setItem(STORAGE_KEYS.PHONE, phone.trim());
    else window?.sessionStorage?.removeItem(STORAGE_KEYS.PHONE);
  } catch {
    // ignore
  }
}

export function setLoggedIn(value: boolean): void {
  try {
    if (value) window?.sessionStorage?.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
    else window?.sessionStorage?.removeItem(STORAGE_KEYS.LOGGED_IN);
  } catch {
    // ignore
  }
}

/** Returns whether the user is logged in (client-only). */
export function getLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true';
}

/** True if user has session (logged-in flag or auth token). Used for My Details / protected menu items. */
export function isUserAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return getLoggedIn() || Boolean(getAuthToken());
}

/** Temporary dummy auth token set after OTP verification (client-only). */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const t = window.sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return t && t.trim() ? t.trim() : null;
}

export function setAuthToken(token: string): void {
  try {
    if (token?.trim()) window?.sessionStorage?.setItem(STORAGE_KEYS.AUTH_TOKEN, token.trim());
    else window?.sessionStorage?.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch {
    // ignore
  }
}

export function clearAuthToken(): void {
  try {
    window?.sessionStorage?.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch {
    // ignore
  }
}

export function getSelectedService(): ServiceId | null {
  if (typeof window === 'undefined') return null;
  const v = window.sessionStorage.getItem(STORAGE_KEYS.SELECTED_SERVICE);
  if (v === 'walk' || v === 'twoWheeler' || v === 'threeWheeler' || v === 'fourWheeler') return v;
  return null;
}

export function setSelectedService(id: ServiceId): void {
  try {
    window?.sessionStorage?.setItem(STORAGE_KEYS.SELECTED_SERVICE, id);
  } catch {
    // ignore
  }
}

export function setPickupLocation(loc: SavedLocation): void {
  try {
    window?.sessionStorage?.setItem(STORAGE_KEYS.PICKUP_LOCATION, JSON.stringify(loc));
  } catch {
    // ignore
  }
}

export function clearPickupLocation(): void {
  try {
    window?.sessionStorage?.removeItem(STORAGE_KEYS.PICKUP_LOCATION);
  } catch {
    // ignore
  }
}

export function clearDropLocation(): void {
  try {
    window?.sessionStorage?.removeItem(STORAGE_KEYS.DROP_LOCATION);
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
    window?.sessionStorage?.setItem(STORAGE_KEYS.DROP_LOCATION, JSON.stringify(loc));
  } catch {
    // ignore
  }
}

export function setStopLocation(loc: SavedLocation | null): void {
  if (typeof window === 'undefined') return;
  if (!loc) {
    setStopWaypoints([]);
    return;
  }
  const norm = normalizeSavedLocation(loc as SavedLocation & { contact?: string });
  const w = getStopWaypoints();
  if (w.length === 0) {
    const orphan = safeParse(window.sessionStorage.getItem(STORAGE_KEYS.STOP_DETAILS), isPersonDetails);
    setStopWaypoints([
      {
        id: makeStopId(),
        location: norm,
        contact: orphan ? { name: orphan.name, mobile: orphan.mobile.replace(/\D/g, '') } : { name: '', mobile: '' },
      },
    ]);
    return;
  }
  setStopWaypoints(w.map((item, i) => (i === 0 ? { ...item, location: norm } : item)));
}

export function setSenderDetails(d: PersonDetails): void {
  try {
    window?.sessionStorage?.setItem(STORAGE_KEYS.SENDER_DETAILS, JSON.stringify(d));
  } catch {
    // ignore
  }
}

export function setReceiverDetails(d: PersonDetails): void {
  try {
    window?.sessionStorage?.setItem(STORAGE_KEYS.RECEIVER_DETAILS, JSON.stringify(d));
  } catch {
    // ignore
  }
}

export function clearReceiverDetails(): void {
  try {
    window?.sessionStorage?.removeItem(STORAGE_KEYS.RECEIVER_DETAILS);
  } catch {
    // ignore
  }
}

export function setStopDetails(d: PersonDetails): void {
  if (typeof window === 'undefined') return;
  const w = getStopWaypoints();
  const nextContact: PersonDetails = { name: d.name.trim(), mobile: d.mobile.replace(/\D/g, '') };
  if (w.length === 0) {
    try {
      window.sessionStorage.setItem(STORAGE_KEYS.STOP_DETAILS, JSON.stringify(nextContact));
    } catch {
      // ignore
    }
    return;
  }
  setStopWaypoints(w.map((item, i) => (i === 0 ? { ...item, contact: nextContact } : item)));
}

/** Clear stop details (call when stop location is removed to keep storage consistent). */
export function clearStopDetails(): void {
  try {
    const w = getStopWaypoints();
    window?.sessionStorage?.removeItem(STORAGE_KEYS.STOP_DETAILS);
    if (w.length > 0) {
      setStopWaypoints(w.map((item, i) => (i === 0 ? { ...item, contact: { name: '', mobile: '' } } : item)));
    }
  } catch {
    // ignore
  }
}

export function setLandingPickupLocation(value: string | null): void {
  try {
    if (value?.trim()) window?.sessionStorage?.setItem(STORAGE_KEYS.LANDING_PICKUP_LOCATION, value.trim());
    else window?.sessionStorage?.removeItem(STORAGE_KEYS.LANDING_PICKUP_LOCATION);
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

/** Restaurant / marketplace order for delivery — cleared on standard bookings and trip complete. */
export interface DeliveryGoodsDescription {
  /** Restaurant or shop display name */
  restaurantName: string;
  items: { name: string; quantity: number; price: string }[];
  /** Omit or `restaurant` = Find Restaurant; `marketplace` = Khatu marketplace shop. */
  source?: 'restaurant' | 'marketplace';
  /** Drop / customer details collected at food checkout (before Razorpay). */
  dropContactName?: string;
  dropContactPhone?: string;
  dropAddress?: string;
}

function isDeliveryGoodsDescription(v: unknown): v is DeliveryGoodsDescription {
  const o = v as DeliveryGoodsDescription;
  if (
    typeof v !== 'object' ||
    v === null ||
    !('restaurantName' in o) ||
    !('items' in o) ||
    typeof o.restaurantName !== 'string' ||
    !Array.isArray(o.items)
  ) {
    return false;
  }
  if (
    'source' in o &&
    o.source !== undefined &&
    o.source !== 'restaurant' &&
    o.source !== 'marketplace'
  ) {
    return false;
  }
  if ('dropContactName' in o && o.dropContactName !== undefined && typeof o.dropContactName !== 'string') {
    return false;
  }
  if ('dropContactPhone' in o && o.dropContactPhone !== undefined && typeof o.dropContactPhone !== 'string') {
    return false;
  }
  if ('dropAddress' in o && o.dropAddress !== undefined && typeof o.dropAddress !== 'string') {
    return false;
  }
  return o.items.every(
    (i) =>
      typeof i === 'object' &&
      i !== null &&
      'name' in i &&
      'quantity' in i &&
      'price' in i &&
      typeof (i as { name: string; quantity: number; price: string }).name === 'string' &&
      typeof (i as { name: string; quantity: number; price: string }).quantity === 'number' &&
      typeof (i as { name: string; quantity: number; price: string }).price === 'string'
  );
}

export function getDeliveryGoodsDescription(): DeliveryGoodsDescription | null {
  if (typeof window === 'undefined') return null;
  const raw = safeParse(window.sessionStorage.getItem(STORAGE_KEYS.DELIVERY_GOODS_DESCRIPTION), isDeliveryGoodsDescription);
  return raw;
}

export function setDeliveryGoodsDescription(data: DeliveryGoodsDescription): void {
  try {
    window?.sessionStorage?.setItem(STORAGE_KEYS.DELIVERY_GOODS_DESCRIPTION, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function clearDeliveryGoodsDescription(): void {
  try {
    window?.sessionStorage?.removeItem(STORAGE_KEYS.DELIVERY_GOODS_DESCRIPTION);
  } catch {
    // ignore
  }
}

function isHotelAvailabilityValue(s: unknown): s is HotelBookingDraft['availability'] {
  return s === 'available' || s === 'few' || s === 'full';
}

function isHotelBookingDraft(v: unknown): v is HotelBookingDraft {
  const o = v as HotelBookingDraft;
  if (typeof v !== 'object' || v === null) return false;
  if (typeof o.hotelId !== 'string' || typeof o.hotelName !== 'string' || typeof o.addressLine !== 'string')
    return false;
  if (typeof o.distanceKmFromTemple !== 'number' || typeof o.pricePerNight !== 'number') return false;
  if (!isHotelAvailabilityValue(o.availability)) return false;
  if (typeof o.parking !== 'boolean' || typeof o.ac !== 'boolean' || typeof o.familyRooms !== 'boolean') return false;
  if (!(o.rating === null || typeof o.rating === 'number')) return false;
  if (typeof o.liftngoVerified !== 'boolean') return false;
  if (typeof o.checkIn !== 'string' || typeof o.checkOut !== 'string') return false;
  if (typeof o.guests !== 'number' || typeof o.guestNote !== 'string') return false;
  if (typeof o.nights !== 'number' || typeof o.estimatedTotalInr !== 'number') return false;
  if (typeof o.ownerWhatsAppDigits !== 'string') return false;
  return true;
}

function isHotelHistoryItem(v: unknown): v is HotelHistoryItem {
  const o = v as HotelHistoryItem;
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof o.id === 'string' &&
    typeof o.hotelId === 'string' &&
    typeof o.hotelName === 'string' &&
    typeof o.addressLine === 'string' &&
    typeof o.checkIn === 'string' &&
    typeof o.checkOut === 'string' &&
    typeof o.guests === 'number' &&
    typeof o.nights === 'number' &&
    typeof o.amount === 'string' &&
    (o.status === 'confirmed' || o.status === 'cancelled') &&
    typeof o.bookedAtLabel === 'string' &&
    (o.guestNote === undefined || typeof o.guestNote === 'string')
  );
}

export function getHotelBookingDraft(): HotelBookingDraft | null {
  if (typeof window === 'undefined') return null;
  return safeParse(window.sessionStorage.getItem(STORAGE_KEYS.HOTEL_BOOKING_DRAFT), isHotelBookingDraft);
}

export function setHotelBookingDraft(data: HotelBookingDraft): void {
  try {
    window?.sessionStorage?.setItem(STORAGE_KEYS.HOTEL_BOOKING_DRAFT, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function clearHotelBookingDraft(): void {
  try {
    window?.sessionStorage?.removeItem(STORAGE_KEYS.HOTEL_BOOKING_DRAFT);
  } catch {
    // ignore
  }
}

const HISTORY_MAX = 50;

export function getHotelBookingHistory(): HotelHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(STORAGE_KEYS.HOTEL_BOOKING_HISTORY) || 'null') as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter(isHotelHistoryItem);
  } catch {
    return [];
  }
}

/** Append a confirmed stay and return the row (max 50 in storage). */
export function appendHotelBookingHistoryFromDraft(draft: HotelBookingDraft): HotelHistoryItem {
  const bookedAt = new Date();
  const bookedAtLabel = bookedAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const item: HotelHistoryItem = {
    id: `stay-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    hotelId: draft.hotelId,
    hotelName: draft.hotelName,
    addressLine: draft.addressLine,
    checkIn: draft.checkIn,
    checkOut: draft.checkOut,
    guests: draft.guests,
    nights: draft.nights,
    amount: `₹${draft.estimatedTotalInr.toLocaleString('en-IN')}`,
    status: 'confirmed',
    bookedAtLabel,
    guestNote: draft.guestNote?.trim() ? draft.guestNote.trim() : undefined,
  };
  try {
    const prev = getHotelBookingHistory();
    window?.sessionStorage?.setItem(STORAGE_KEYS.HOTEL_BOOKING_HISTORY, JSON.stringify([item, ...prev].slice(0, HISTORY_MAX)));
  } catch {
    // ignore
  }
  return item;
}

/** Mark a hotel stay as cancelled by id; returns true when updated. */
export function markHotelBookingCancelled(bookingId: string): boolean {
  if (typeof window === 'undefined') return false;
  const id = bookingId.trim();
  if (!id) return false;
  try {
    const list = getHotelBookingHistory();
    let changed = false;
    const next = list.map((row) => {
      if (row.id !== id || row.status === 'cancelled') return row;
      changed = true;
      return { ...row, status: 'cancelled' as const };
    });
    if (!changed) return false;
    window.sessionStorage.setItem(STORAGE_KEYS.HOTEL_BOOKING_HISTORY, JSON.stringify(next.slice(0, HISTORY_MAX)));
    return true;
  } catch {
    return false;
  }
}

function isFoodDeliveryHistoryItem(v: unknown): v is FoodDeliveryHistoryItem {
  const o = v as FoodDeliveryHistoryItem;
  if (typeof v !== 'object' || v === null) return false;
  if (typeof o.id !== 'string' || typeof o.restaurantName !== 'string' || !Array.isArray(o.items)) return false;
  if (typeof o.amount !== 'string' || o.status !== 'confirmed' || typeof o.bookedAtLabel !== 'string') return false;
  return o.items.every(
    (i) =>
      typeof i === 'object' &&
      i !== null &&
      typeof (i as { name: string; quantity: number; price: string }).name === 'string' &&
      typeof (i as { name: string; quantity: number; price: string }).quantity === 'number' &&
      typeof (i as { name: string; quantity: number; price: string }).price === 'string'
  );
}

function isMarketplaceOrderHistoryItem(v: unknown): v is MarketplaceOrderHistoryItem {
  const o = v as MarketplaceOrderHistoryItem;
  if (typeof v !== 'object' || v === null) return false;
  if (typeof o.id !== 'string' || typeof o.orderRef !== 'string' || typeof o.shopName !== 'string') return false;
  if (!Array.isArray(o.summaryLines) || typeof o.totalDisplay !== 'string' || o.status !== 'confirmed') return false;
  if (typeof o.bookedAtLabel !== 'string') return false;
  return o.summaryLines.every(
    (i) =>
      typeof i === 'object' &&
      i !== null &&
      typeof (i as { name: string; quantity: number }).name === 'string' &&
      typeof (i as { name: string; quantity: number }).quantity === 'number'
  );
}

function isSalasarRideHistoryItem(v: unknown): v is SalasarRideHistoryItem {
  const o = v as SalasarRideHistoryItem;
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof o.id === 'string' &&
    typeof o.bookingRef === 'string' &&
    typeof o.routeLabel === 'string' &&
    typeof o.fromPlace === 'string' &&
    typeof o.toPlace === 'string' &&
    typeof o.vehicleLabel === 'string' &&
    typeof o.estimateInr === 'number' &&
    typeof o.distanceKm === 'number' &&
    typeof o.typicalMinutes === 'number' &&
    (o.status === 'quoted' || o.status === 'confirmed') &&
    typeof o.bookedAtLabel === 'string'
  );
}

export function getFoodDeliveryHistory(): FoodDeliveryHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(STORAGE_KEYS.FOOD_DELIVERY_HISTORY) || 'null') as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter(isFoodDeliveryHistoryItem);
  } catch {
    return [];
  }
}

export function getMarketplaceOrderHistory(): MarketplaceOrderHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(STORAGE_KEYS.MARKETPLACE_ORDER_HISTORY) || 'null') as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter(isMarketplaceOrderHistoryItem);
  } catch {
    return [];
  }
}

export function getSalasarRideHistory(): SalasarRideHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = JSON.parse(window.sessionStorage.getItem(STORAGE_KEYS.SALASAR_RIDE_HISTORY) || 'null') as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter(isSalasarRideHistoryItem);
  } catch {
    return [];
  }
}

/** Restaurant food only (`delivery_goods.source !== 'marketplace'`). */
export function appendFoodDeliveryHistory(
  goods: DeliveryGoodsDescription,
  amountDisplay: string,
  pickupName?: string | null
): void {
  if (goods.source === 'marketplace') return;
  const bookedAtLabel = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const item: FoodDeliveryHistoryItem = {
    id: `food-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    restaurantName: goods.restaurantName,
    items: goods.items.map((i) => ({ ...i })),
    amount: amountDisplay,
    status: 'confirmed',
    bookedAtLabel,
    pickupName: pickupName?.trim() || undefined,
  };
  try {
    const prev = getFoodDeliveryHistory();
    window?.sessionStorage?.setItem(STORAGE_KEYS.FOOD_DELIVERY_HISTORY, JSON.stringify([item, ...prev].slice(0, HISTORY_MAX)));
  } catch {
    // ignore
  }
}

/** Marketplace pay-after-delivery path (uses `restaurantName` + items on goods blob). */
export function appendMarketplaceHistoryFromDeliveryGoods(
  goods: DeliveryGoodsDescription,
  totalDisplay: string,
  deliveryAddressHint?: string | null
): void {
  if (goods.source !== 'marketplace') return;
  const bookedAtLabel = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const item: MarketplaceOrderHistoryItem = {
    id: `mp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    orderRef: `DEL-${Date.now().toString(36).toUpperCase()}`,
    shopName: goods.restaurantName,
    summaryLines: goods.items.map((i) => ({ name: i.name, quantity: i.quantity })),
    totalDisplay,
    status: 'confirmed',
    bookedAtLabel,
    deliveryAddress: deliveryAddressHint?.trim() || undefined,
  };
  try {
    const prev = getMarketplaceOrderHistory();
    window?.sessionStorage?.setItem(STORAGE_KEYS.MARKETPLACE_ORDER_HISTORY, JSON.stringify([item, ...prev].slice(0, HISTORY_MAX)));
  } catch {
    // ignore
  }
}

export function appendMarketplaceHistoryFromCheckout(entry: {
  orderRef: string;
  shopName: string;
  shopId: string;
  summaryLines: { name: string; quantity: number }[];
  totalDisplay: string;
  deliveryAddress?: string;
}): void {
  const bookedAtLabel = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const item: MarketplaceOrderHistoryItem = {
    id: `mp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    orderRef: entry.orderRef,
    shopName: entry.shopName,
    shopId: entry.shopId,
    summaryLines: entry.summaryLines,
    totalDisplay: entry.totalDisplay,
    status: 'confirmed',
    bookedAtLabel,
    deliveryAddress: entry.deliveryAddress?.trim() || undefined,
  };
  try {
    const prev = getMarketplaceOrderHistory();
    window?.sessionStorage?.setItem(STORAGE_KEYS.MARKETPLACE_ORDER_HISTORY, JSON.stringify([item, ...prev].slice(0, HISTORY_MAX)));
  } catch {
    // ignore
  }
}

/** When the user continues from `/booking/ride` into pickup flow (quote captured). */
export function appendSalasarRideHistoryFromQuote(booking: SavedKhatuRideBooking): void {
  const bookedAtLabel = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const item: SalasarRideHistoryItem = {
    id: `ride-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    bookingRef: booking.bookingRef,
    routeLabel: booking.route.label,
    fromPlace: booking.route.from,
    toPlace: booking.route.to,
    vehicleLabel: booking.vehicle.label,
    estimateInr: booking.estimateInr,
    distanceKm: booking.route.distanceKm,
    typicalMinutes: booking.route.typicalMinutes,
    status: 'quoted',
    bookedAtLabel,
  };
  try {
    const prev = getSalasarRideHistory();
    window?.sessionStorage?.setItem(STORAGE_KEYS.SALASAR_RIDE_HISTORY, JSON.stringify([item, ...prev].slice(0, HISTORY_MAX)));
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
  return safeParse(window.sessionStorage.getItem(STORAGE_KEYS.FOOD_ORDER_CART_DRAFT), isFoodOrderCartDraft);
}

export function setFoodOrderCartDraft(data: FoodOrderCartDraft): void {
  try {
    window?.sessionStorage?.setItem(STORAGE_KEYS.FOOD_ORDER_CART_DRAFT, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function clearFoodOrderCartDraft(): void {
  try {
    window?.sessionStorage?.removeItem(STORAGE_KEYS.FOOD_ORDER_CART_DRAFT);
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
  return safeParse(window.sessionStorage.getItem(STORAGE_KEYS.USER_PROFILE), isUserProfile);
}

export function setUserProfile(profile: UserProfile): void {
  try {
    window?.sessionStorage?.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

export function clearUserProfile(): void {
  try {
    window?.sessionStorage?.removeItem(STORAGE_KEYS.USER_PROFILE);
  } catch {
    // ignore
  }
}

/**
 * Deletes cookies readable via `document.cookie` (typically `path=/`, non-HttpOnly).
 * HttpOnly cookies set by the server cannot be cleared from JavaScript.
 */
function clearAccessibleCookies(): void {
  if (typeof document === 'undefined') return;
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const epoch = 'Thu, 01 Jan 1970 00:00:00 GMT';
  const pairs = document.cookie.split(';');
  const names = new Set<string>();
  for (const part of pairs) {
    const eq = part.indexOf('=');
    const name = (eq >= 0 ? part.slice(0, eq) : part).trim();
    if (name) names.add(name);
  }
  for (const name of names) {
    document.cookie = `${name}=;expires=${epoch};path=/`;
    if (hostname) {
      document.cookie = `${name}=;expires=${epoch};path=/;domain=${hostname}`;
      if (!hostname.startsWith('.')) {
        document.cookie = `${name}=;expires=${epoch};path=/;domain=.${hostname}`;
      }
    }
  }
}

/**
 * Full client logout: wipe sessionStorage, localStorage (legacy), and non-HttpOnly cookies.
 * Call from the Logout UI. Server HttpOnly session cookies require a server `Set-Cookie` /logout if used.
 */
export function performFullClientLogout(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.clear();
  } catch {
    /* private mode / blocked */
  }
  try {
    window.localStorage.clear();
  } catch {
    /* legacy cleanup */
  }
  clearAccessibleCookies();
}
