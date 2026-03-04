/**
 * Shared booking & logistics types.
 * Single source of truth for location, person, and trip data.
 */

export interface SavedLocation {
  name: string;
  address: string;
  contact: string;
}

export interface PersonDetails {
  name: string;
  mobile: string;
}

export type ServiceId = 'walk' | 'twoWheeler' | 'threeWheeler';

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
