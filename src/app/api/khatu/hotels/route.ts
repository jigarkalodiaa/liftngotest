import { NextResponse } from 'next/server';
import { KHATU_HOTELS } from '@/data/khatuHotels';
import type { HotelAvailability, KhatuHotel } from '@/types/khatu';

function bandFromKm(km: number): string {
  if (km < 1) return '0-1';
  if (km < 3) return '1-3';
  return '3+';
}

function matchesDistanceFilter(hotel: KhatuHotel, raw: string | null): boolean {
  if (!raw) return true;
  return bandFromKm(hotel.distanceKmFromTemple) === raw;
}

function parseAvailability(raw: string | null): HotelAvailability[] | null {
  if (!raw || raw === 'all') return null;
  const parts = raw.split(',').map((s) => s.trim()) as HotelAvailability[];
  const ok: HotelAvailability[] = [];
  for (const p of parts) {
    if (p === 'available' || p === 'few' || p === 'full') ok.push(p);
  }
  return ok.length ? ok : null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const distance = searchParams.get('distance');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const availabilityRaw = searchParams.get('availability');
  const parking = searchParams.get('parking');
  const ac = searchParams.get('ac');
  const minRating = searchParams.get('minRating');

  const minP = minPrice ? Number(minPrice) : NaN;
  const maxP = maxPrice ? Number(maxPrice) : NaN;
  const minR = minRating ? Number(minRating) : NaN;

  const availabilitySet = parseAvailability(availabilityRaw);

  let list = KHATU_HOTELS.filter((h) => h.liftngoVerified);

  list = list.filter((h) => matchesDistanceFilter(h, distance));

  if (Number.isFinite(minP)) list = list.filter((h) => h.pricePerNight >= minP);
  if (Number.isFinite(maxP)) list = list.filter((h) => h.pricePerNight <= maxP);

  if (availabilitySet) {
    list = list.filter((h) => availabilitySet.includes(h.availability));
  }

  if (parking === 'yes') list = list.filter((h) => h.parking);
  if (parking === 'no') list = list.filter((h) => !h.parking);

  if (ac === 'yes') list = list.filter((h) => h.ac);
  if (ac === 'no') list = list.filter((h) => !h.ac);

  if (Number.isFinite(minR)) {
    list = list.filter((h) => h.rating !== null && h.rating >= minR);
  }

  return NextResponse.json({ hotels: list, total: list.length });
}
