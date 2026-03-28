import type { DashboardZone } from '@/config/khatuZone';

export interface LocationDetailsResponse {
  city: string;
  state: string;
  zone: DashboardZone;
}

export async function fetchLocationDetails(lat: number, lng: number): Promise<LocationDetailsResponse> {
  const res = await fetch('/api/get-location-details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lng }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Location service error (${res.status})`);
  }
  return res.json() as Promise<LocationDetailsResponse>;
}
