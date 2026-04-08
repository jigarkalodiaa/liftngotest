'use client';

import type { KhatuBookingRecord } from './types';

export const KHATU_BOOKINGS_STORAGE_KEY = 'khatu_bookings';

function safeParse(raw: string | null): KhatuBookingRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item === 'object') as KhatuBookingRecord[];
  } catch {
    return [];
  }
}

export function getKhatuBookings(): KhatuBookingRecord[] {
  if (typeof window === 'undefined') return [];
  return safeParse(window.localStorage.getItem(KHATU_BOOKINGS_STORAGE_KEY));
}

export function setKhatuBookings(bookings: KhatuBookingRecord[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KHATU_BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}

export function upsertKhatuBooking(next: KhatuBookingRecord): KhatuBookingRecord {
  const existing = getKhatuBookings();
  const updated = [next, ...existing].slice(0, 30);
  setKhatuBookings(updated);
  return next;
}

