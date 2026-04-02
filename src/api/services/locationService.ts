/**
 * Location zone resolution via Next.js Route Handler.
 */

import apiClient from '@/api/client';
import { NEXT_API } from '@/api/endpoints';
import type { DashboardZone } from '@/config/khatuZone';

export interface LocationDetailsResponse {
  city: string;
  state: string;
  zone: DashboardZone;
}

export async function fetchLocationDetails(lat: number, lng: number): Promise<LocationDetailsResponse> {
  return apiClient.post<LocationDetailsResponse>(NEXT_API.getLocationDetails, { lat, lng });
}
