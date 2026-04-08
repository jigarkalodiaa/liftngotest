/**
 * Shared booking & logistics types.
 * Single source of truth for location, person, and trip data.
 */

export interface SavedLocation {
  name: string;
  address: string;
  contact: string;
  latitude?: number;
  longitude?: number;
}

export interface PersonDetails {
  name: string;
  mobile: string;
}

/** Intermediate stop with its own contact (multi-stop delivery). */
export type BookingStopWaypoint = {
  id: string;
  location: SavedLocation;
  contact: PersonDetails;
};

export type ServiceId = 'walk' | 'twoWheeler' | 'threeWheeler' | 'fourWheeler';

export interface DefaultTrip {
  id: string;
  fromName: string;
  fromAddress: string;
  toName: string;
  toAddress: string;
  contactName: string;
  contactPhone: string;
}

export type BookingStep = 1 | 2;

/** Past ride for History page */
export interface RideHistoryItem {
  id: string;
  vehicleName: string;
  vehicleSubtitle: string;
  vehicleImage: string;
  date: string;
  time?: string;
  status: 'completed' | 'cancelled';
  /** Display amount e.g. "₹0", "₹60" */
  amount?: string;
  fromName: string;
  fromAddress: string;
  toName: string;
  toAddress: string;
}

/** Confirmed hotel stay — shown under History → Your stays */
export interface HotelHistoryItem {
  id: string;
  hotelId: string;
  hotelName: string;
  addressLine: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  amount: string;
  status: 'confirmed' | 'cancelled';
  /** e.g. "29 Mar 2026" */
  bookedAtLabel: string;
  guestNote?: string;
}

/** In-flight Khatu hotel request — set after guest confirms WhatsApp to property, cleared after payment or other flows. */
export interface HotelBookingDraft {
  hotelId: string;
  hotelName: string;
  addressLine: string;
  distanceKmFromTemple: number;
  pricePerNight: number;
  availability: 'available' | 'few' | 'full';
  parking: boolean;
  ac: boolean;
  familyRooms: boolean;
  rating: number | null;
  liftngoVerified: boolean;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestNote: string;
  nights: number;
  estimatedTotalInr: number;
  ownerWhatsAppDigits: string;
}

/** Restaurant / cloud-kitchen food delivery payment (Find Restaurant flow). */
export interface FoodDeliveryHistoryItem {
  id: string;
  restaurantName: string;
  items: { name: string; quantity: number; price: string }[];
  amount: string;
  status: 'confirmed';
  bookedAtLabel: string;
  pickupName?: string;
}

/** Khatu marketplace — checkout API or pay-after-WhatsApp delivery flow. */
export interface MarketplaceOrderHistoryItem {
  id: string;
  orderRef: string;
  shopName: string;
  shopId?: string;
  summaryLines: { name: string; quantity: number }[];
  totalDisplay: string;
  status: 'confirmed';
  bookedAtLabel: string;
  deliveryAddress?: string;
}

/** Khatu–Salasar–Ringus corridor ride quote / continued booking (from Travel). */
export interface SalasarRideHistoryItem {
  id: string;
  bookingRef: string;
  routeLabel: string;
  fromPlace: string;
  toPlace: string;
  vehicleLabel: string;
  estimateInr: number;
  distanceKm: number;
  typicalMinutes: number;
  status: 'quoted' | 'confirmed';
  bookedAtLabel: string;
}

export type HistoryTabId = 'all' | 'food' | 'hotel' | 'marketplace' | 'salasar' | 'rides';
