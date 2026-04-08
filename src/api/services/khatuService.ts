/**
 * Khatu BFF + ride booking — same-origin `/api/*` (see `NEXT_API`).
 */

import apiClient from '@/api/client';
import { NEXT_API } from '@/api/endpoints';
import type { DistanceBand, HotelAvailability, KhatuHotel, KhatuShop, KhatuShopProduct } from '@/types/khatu';
import type { RideVehicleType, TravelRouteId } from '@/types/khatu';
import type { BookRideApiResponse } from '@/lib/khatuSessionStorage';
import { AppError } from '@/utils/error';

export type KhatuHotelListQuery = {
  distance?: DistanceBand | '';
  minPrice?: number;
  maxPrice?: number;
  availability?: HotelAvailability | 'all' | '';
  parking?: 'yes' | 'no' | '';
  ac?: 'yes' | 'no' | '';
  minRating?: number;
};

function hotelListParams(q: KhatuHotelListQuery): Record<string, string | number> {
  const p: Record<string, string | number> = {};
  if (q.distance) p.distance = q.distance;
  if (typeof q.minPrice === 'number') p.minPrice = q.minPrice;
  if (typeof q.maxPrice === 'number') p.maxPrice = q.maxPrice;
  if (q.availability && q.availability !== 'all') p.availability = q.availability;
  if (q.parking === 'yes' || q.parking === 'no') p.parking = q.parking;
  if (q.ac === 'yes' || q.ac === 'no') p.ac = q.ac;
  if (typeof q.minRating === 'number') p.minRating = q.minRating;
  return p;
}

export async function fetchKhatuHotels(query: KhatuHotelListQuery = {}): Promise<{ hotels: KhatuHotel[]; total: number }> {
  return apiClient.get<{ hotels: KhatuHotel[]; total: number }>(NEXT_API.khatuHotels, {
    params: hotelListParams(query),
  });
}

export async function fetchKhatuHotelById(id: string): Promise<KhatuHotel> {
  const result = await apiClient.get<{ hotel: KhatuHotel }>(NEXT_API.khatuHotelById(id));
  return result.hotel;
}

export async function fetchKhatuShops(): Promise<{ shops: KhatuShop[] }> {
  return apiClient.get<{ shops: KhatuShop[] }>(NEXT_API.khatuShops);
}

export async function fetchKhatuShopDetail(id: string): Promise<{ shop: KhatuShop; products: KhatuShopProduct[] }> {
  return apiClient.get<{ shop: KhatuShop; products: KhatuShopProduct[] }>(NEXT_API.khatuShopById(id));
}

export type KhatuOrderRequest = {
  shopId: string;
  items: { id: string; quantity: number }[];
  totalAmount: number;
  address: string;
  contactPhone: string;
};

export type KhatuOrderResponse = {
  ok: true;
  orderId: string;
  deliveryMode: 'liftngo';
  deliveryChargeInr: number;
  subtotalInr: number;
  message: string;
  addressSummary: string;
  contactPhone: string;
};

export async function postKhatuOrder(body: KhatuOrderRequest): Promise<KhatuOrderResponse> {
  const data = await apiClient.post<KhatuOrderResponse | { error?: string; expected?: number }>(
    NEXT_API.khatuOrder,
    body,
  );
  if (!data || typeof data !== 'object' || !('ok' in data) || data.ok !== true) {
    const err = 'error' in data && typeof data.error === 'string' ? data.error : 'Order failed';
    throw new AppError(err);
  }
  return data;
}

export type BookRideRequest = {
  routeId: TravelRouteId;
  vehicleType: RideVehicleType;
  passengerCount?: number;
  note?: string;
};

export async function postBookRide(body: BookRideRequest): Promise<BookRideApiResponse> {
  const data = await apiClient.post<BookRideApiResponse | { error?: string }>(NEXT_API.bookRide, body);
  if (!data || typeof data !== 'object' || !('ok' in data) || data.ok !== true) {
    const err = 'error' in data && typeof data.error === 'string' ? data.error : 'Booking failed';
    throw new AppError(err);
  }
  return data;
}
