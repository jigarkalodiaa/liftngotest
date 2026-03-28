import type { DistanceBand, HotelAvailability, KhatuHotel, KhatuShop, KhatuShopProduct } from '@/types/khatu';
import type { RideVehicleType, TravelRouteId } from '@/types/khatu';
import type { BookRideApiResponse } from '@/lib/khatuSessionStorage';

export type KhatuHotelListQuery = {
  distance?: DistanceBand | '';
  minPrice?: number;
  maxPrice?: number;
  availability?: HotelAvailability | 'all' | '';
  parking?: 'yes' | 'no' | '';
  ac?: 'yes' | 'no' | '';
  minRating?: number;
};

function appendHotelQuery(searchParams: URLSearchParams, q: KhatuHotelListQuery): void {
  if (q.distance) searchParams.set('distance', q.distance);
  if (typeof q.minPrice === 'number') searchParams.set('minPrice', String(q.minPrice));
  if (typeof q.maxPrice === 'number') searchParams.set('maxPrice', String(q.maxPrice));
  if (q.availability && q.availability !== 'all') searchParams.set('availability', q.availability);
  if (q.parking === 'yes' || q.parking === 'no') searchParams.set('parking', q.parking);
  if (q.ac === 'yes' || q.ac === 'no') searchParams.set('ac', q.ac);
  if (typeof q.minRating === 'number') searchParams.set('minRating', String(q.minRating));
}

export async function fetchKhatuHotels(query: KhatuHotelListQuery = {}): Promise<{ hotels: KhatuHotel[]; total: number }> {
  const searchParams = new URLSearchParams();
  appendHotelQuery(searchParams, query);
  const qs = searchParams.toString();
  const url = qs ? `/api/khatu/hotels?${qs}` : '/api/khatu/hotels';
  const res = await fetch(url, { credentials: 'same-origin' });
  if (!res.ok) throw new Error('Failed to load hotels');
  return res.json() as Promise<{ hotels: KhatuHotel[]; total: number }>;
}

export async function fetchKhatuHotelById(id: string): Promise<KhatuHotel> {
  const res = await fetch(`/api/khatu/hotels/${encodeURIComponent(id)}`, { credentials: 'same-origin' });
  if (!res.ok) throw new Error('Hotel not found');
  const data = (await res.json()) as { hotel: KhatuHotel };
  return data.hotel;
}

export async function fetchKhatuShops(): Promise<{ shops: KhatuShop[] }> {
  const res = await fetch('/api/khatu/shops', { credentials: 'same-origin' });
  if (!res.ok) throw new Error('Failed to load shops');
  return res.json() as Promise<{ shops: KhatuShop[] }>;
}

export async function fetchKhatuShopDetail(id: string): Promise<{ shop: KhatuShop; products: KhatuShopProduct[] }> {
  const res = await fetch(`/api/khatu/shops/${encodeURIComponent(id)}`, { credentials: 'same-origin' });
  if (!res.ok) throw new Error('Shop not found');
  return res.json() as Promise<{ shop: KhatuShop; products: KhatuShopProduct[] }>;
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
  const res = await fetch('/api/khatu/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as KhatuOrderResponse | { error?: string; expected?: number };
  if (!res.ok || !('ok' in data) || data.ok !== true) {
    const err = 'error' in data ? String(data.error) : 'Order failed';
    throw new Error(err);
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
  const res = await fetch('/api/book-ride', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as BookRideApiResponse | { error?: string };
  if (!res.ok || !('ok' in data) || data.ok !== true) {
    const err = 'error' in data ? String(data.error) : 'Booking failed';
    throw new Error(err);
  }
  return data;
}
