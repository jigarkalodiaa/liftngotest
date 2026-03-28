import type { DashboardZone } from '@/config/khatuZone';
import {
  KHATU_CENTER,
  KHATU_RADIUS_KM,
  KHATU_LOCALITY_MATCH,
} from '@/config/khatuZone';

/** Haversine distance in km between two WGS84 points. */
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function extractAddressBlob(addr: Record<string, string | undefined> | undefined): string {
  if (!addr) return '';
  const parts = [
    addr.village,
    addr.town,
    addr.city,
    addr.county,
    addr.state_district,
    addr.region,
    addr.state,
  ].filter(Boolean) as string[];
  return parts.join(' ').toLowerCase();
}

/** Nominatim `reverse` JSON `address` + optional `display_name`. */
export function resolveZoneFromCoordinates(
  lat: number,
  lng: number,
  nominatimAddress?: Record<string, string | undefined>,
  displayName?: string,
): { zone: DashboardZone; city: string; state: string } {
  const dist = haversineKm(lat, lng, KHATU_CENTER.lat, KHATU_CENTER.lng);
  if (dist <= KHATU_RADIUS_KM) {
    const city =
      nominatimAddress?.town ||
      nominatimAddress?.village ||
      nominatimAddress?.city ||
      'Khatu area';
    const state = nominatimAddress?.state || 'Rajasthan';
    return { zone: 'khatu', city, state };
  }

  const blob = `${extractAddressBlob(nominatimAddress)} ${(displayName || '').toLowerCase()}`;
  const keywordHit = KHATU_LOCALITY_MATCH.some((k) => blob.includes(k.toLowerCase()));
  if (keywordHit) {
    const city =
      nominatimAddress?.town ||
      nominatimAddress?.village ||
      nominatimAddress?.city ||
      'Khatu corridor';
    const state = nominatimAddress?.state || 'Rajasthan';
    return { zone: 'khatu', city, state };
  }

  const city = nominatimAddress?.city || nominatimAddress?.town || nominatimAddress?.village || 'Unknown';
  const state = nominatimAddress?.state || '';
  return { zone: 'default', city, state };
}
