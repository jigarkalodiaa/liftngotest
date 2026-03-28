import { SESSION_KEYS } from '@/lib/constants';

export type BookRideApiResponse = {
  ok: true;
  bookingRef: string;
  estimateInr: number;
  route: {
    id: string;
    label: string;
    from: string;
    to: string;
    distanceKm: number;
    typicalMinutes: number;
  };
  vehicle: {
    type: string;
    label: string;
    seats: number;
  };
  receivedNote: string | null;
};

export type SavedKhatuRideBooking = BookRideApiResponse & { savedAt: string };

export function saveKhatuRideBooking(data: BookRideApiResponse): void {
  if (typeof window === 'undefined') return;
  const payload: SavedKhatuRideBooking = { ...data, savedAt: new Date().toISOString() };
  sessionStorage.setItem(SESSION_KEYS.KHATU_RIDE_BOOKING, JSON.stringify(payload));
}

export function readKhatuRideBooking(): SavedKhatuRideBooking | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(SESSION_KEYS.KHATU_RIDE_BOOKING);
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as SavedKhatuRideBooking;
    if (v && v.ok === true && typeof v.bookingRef === 'string') return v;
    return null;
  } catch {
    return null;
  }
}

export function clearKhatuRideBooking(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_KEYS.KHATU_RIDE_BOOKING);
}
