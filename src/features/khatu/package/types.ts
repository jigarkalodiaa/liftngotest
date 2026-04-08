export type KhatuPackageServices = {
  cab: boolean;
  hotel: boolean;
  food: boolean;
  guide: boolean;
  darshan: boolean;
  waterPark: boolean;
  returnTrip: boolean;
};

export type KhatuServiceKey = keyof KhatuPackageServices;

export type KhatuTrackingStatus =
  | 'BOOKING_CONFIRMED'
  | 'DRIVER_ASSIGNED'
  | 'EN_ROUTE_PICKUP'
  | 'ARRIVED_PICKUP_RINGAS'
  | 'PICKUP_COMPLETED'
  | 'ON_THE_WAY_KHATU'
  | 'DARSHAN_ONGOING'
  | 'RETURN_TRIP'
  | 'TRIP_COMPLETED';

export type KhatuDriverDetails = {
  name: string;
  phone: string;
  vehicle: string;
  etaMinutes: number | null;
};
