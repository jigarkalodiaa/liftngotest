export enum CustomerTripStatus {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  ASSIGNED = 'ASSIGNED',
  ARRIVING = 'ARRIVING',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export type Location = {
  latitude: number;
  longitude: number;
  heading?: number | null;
  speed?: number | null;
  accuracy?: number | null;
  updatedAt?: string;
};

export type Driver = {
  id: string;
  name?: string | null;
  mobile?: string | null;
  rating?: number | null;
  vehicleNumber?: string | null;
  vehicleType?: string | null;
};

export type Trip = {
  id: string;
  status: CustomerTripStatus | string;
  tripCode?: string;
  createdAt?: string;
  updatedAt?: string;
  driverId?: string | null;
  [key: string]: unknown;
};

export type CustomerSocketEventPayload = {
  eventId?: string;
  tripId: string;
  timestamp?: number | string;
  status?: CustomerTripStatus | string;
  driver?: Driver | null;
  location?: Location | null;
  [key: string]: unknown;
};
