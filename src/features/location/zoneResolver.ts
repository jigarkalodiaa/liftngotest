import type { DashboardZone } from '@/config/khatuZone';
import {
  KHATU_CENTER,
  KHATU_RADIUS_KM,
  KHATU_LOCALITY_MATCH,
  NOIDA_CENTER,
  NOIDA_RADIUS_KM,
  NOIDA_LOCALITY_MATCH,
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

function resolveCity(addr?: Record<string, string | undefined>, fallback = 'Unknown'): string {
  return addr?.city || addr?.town || addr?.village || fallback;
}

/** Nominatim `reverse` JSON `address` + optional `display_name`. */
export function resolveZoneFromCoordinates(
  lat: number,
  lng: number,
  nominatimAddress?: Record<string, string | undefined>,
  displayName?: string,
): { zone: DashboardZone; city: string; state: string } {
  const blob = `${extractAddressBlob(nominatimAddress)} ${(displayName || '').toLowerCase()}`;

  // Khatu — radius check first (more specific zone wins)
  if (haversineKm(lat, lng, KHATU_CENTER.lat, KHATU_CENTER.lng) <= KHATU_RADIUS_KM) {
    return { zone: 'khatu', city: resolveCity(nominatimAddress, 'Khatu area'), state: nominatimAddress?.state || 'Rajasthan' };
  }
  if (KHATU_LOCALITY_MATCH.some((k) => blob.includes(k.toLowerCase()))) {
    return { zone: 'khatu', city: resolveCity(nominatimAddress, 'Khatu corridor'), state: nominatimAddress?.state || 'Rajasthan' };
  }

  // Noida / NCR
  if (haversineKm(lat, lng, NOIDA_CENTER.lat, NOIDA_CENTER.lng) <= NOIDA_RADIUS_KM) {
    return { zone: 'noida', city: resolveCity(nominatimAddress, 'Noida'), state: nominatimAddress?.state || 'Uttar Pradesh' };
  }
  if (NOIDA_LOCALITY_MATCH.some((k) => blob.includes(k.toLowerCase()))) {
    return { zone: 'noida', city: resolveCity(nominatimAddress, 'NCR'), state: nominatimAddress?.state || '' };
  }

  return { zone: 'default', city: resolveCity(nominatimAddress), state: nominatimAddress?.state || '' };
}
