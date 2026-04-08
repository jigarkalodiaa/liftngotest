export type HotelAvailability = 'available' | 'few' | 'full';

export type DistanceBand = '0-1' | '1-3' | '3+';

export interface KhatuHotel {
  id: string;
  name: string;
  images: string[];
  distanceKmFromTemple: number;
  pricePerNight: number;
  availability: HotelAvailability;
  parking: boolean;
  ac: boolean;
  familyRooms: boolean;
  /** 1–5 or null if not enough reviews */
  rating: number | null;
  /** Liftngo on-ground verified */
  liftngoVerified: boolean;
  addressLine: string;
  /** E.164 digits (e.g. 91…) — hotel / front desk WhatsApp for booking requests. */
  ownerWhatsApp?: string;
}

/** Marketplace product categories — religious, prasad & temple-local retail only (no food service). */
export type MarketplaceCategory = 'prasad' | 'religious' | 'local';

export interface KhatuShop {
  id: string;
  name: string;
  bannerImage: string;
  description: string;
  /** Representative distance from mandir zone for display (km). */
  distanceKm: number;
  liftngoVerified: true;
  popular?: boolean;
  rating?: number;
  /** E.164 digits only (e.g. 91…) for `wa.me` order messages. */
  merchantWhatsApp?: string;
  /** Pickup point shown to riders (counter / shop address). */
  pickupAddressLine?: string;
}

export interface KhatuShopProduct {
  id: string;
  shopId: string;
  name: string;
  shortDescription: string;
  priceInr: number;
  image: string;
  category: MarketplaceCategory;
  popular?: boolean;
  fastSelling?: boolean;
}

/** @deprecated Legacy flat product shape — prefer {@link KhatuShop} + {@link KhatuShopProduct}. */
export interface KhatuProduct {
  id: string;
  name: string;
  priceInr: number;
  shopName: string;
  distanceKm: number;
  category: MarketplaceCategory;
  image: string;
  codAvailable: boolean;
  quickDelivery: boolean;
}

export type TravelRouteId = 'khatu-salasar' | 'salasar-khatu' | 'khatu-ringus' | 'ringus-khatu';

export interface KhatuTravelRoute {
  id: TravelRouteId;
  label: string;
  labelHi: string;
  from: string;
  to: string;
  distanceKm: number;
  typicalMinutes: number;
}

export type RideVehicleType = 'two_wheeler' | 'hatchback' | 'sedan' | 'suv';

export interface RideVehicleOption {
  type: RideVehicleType;
  label: string;
  seats: number;
  /** illustrative estimate in INR */
  baseFareEstimate: number;
  /** primary for tourists */
  recommendedTourist?: boolean;
  /** Short trust line, e.g. “Best for families”. */
  comfortTag?: string;
}

export interface KhatuNearbyPlace {
  id: string;
  name: string;
  distanceFromKhatuKm: number;
  shortDescription: string;
  image: string;
}
