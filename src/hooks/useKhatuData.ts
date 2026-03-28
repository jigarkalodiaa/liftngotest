import { useMutation, useQuery } from '@tanstack/react-query';
import {
  fetchKhatuHotels,
  fetchKhatuShopDetail,
  fetchKhatuShops,
  postBookRide,
  postKhatuOrder,
  type BookRideRequest,
  type KhatuHotelListQuery,
  type KhatuOrderRequest,
} from '@/lib/api/khatu';

export const khatuQueryKeys = {
  hotels: (q: KhatuHotelListQuery) => ['khatu', 'hotels', q] as const,
  shops: () => ['khatu', 'shops'] as const,
  shop: (id: string) => ['khatu', 'shop', id] as const,
};

export function useKhatuHotels(query: KhatuHotelListQuery) {
  return useQuery({
    queryKey: khatuQueryKeys.hotels(query),
    queryFn: () => fetchKhatuHotels(query),
    staleTime: 60_000,
  });
}

export function useKhatuShops() {
  return useQuery({
    queryKey: khatuQueryKeys.shops(),
    queryFn: () => fetchKhatuShops(),
    staleTime: 60_000,
  });
}

export function useKhatuShop(shopId: string) {
  return useQuery({
    queryKey: khatuQueryKeys.shop(shopId),
    queryFn: () => fetchKhatuShopDetail(shopId),
    enabled: Boolean(shopId),
    staleTime: 60_000,
  });
}

export function useBookRideMutation() {
  return useMutation({
    mutationFn: (body: BookRideRequest) => postBookRide(body),
  });
}

export function useKhatuOrderMutation() {
  return useMutation({
    mutationFn: (body: KhatuOrderRequest) => postKhatuOrder(body),
  });
}
