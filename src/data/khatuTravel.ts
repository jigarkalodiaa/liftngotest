import type { KhatuTravelRoute, RideVehicleOption, RideVehicleType, TravelRouteId } from '@/types/khatu';

export const KHATU_TRAVEL_ROUTES: KhatuTravelRoute[] = [
  {
    id: 'khatu-salasar',
    label: 'Khatu → Salasar',
    labelHi: 'खाटू → सालासर',
    from: 'Khatu Shyam Ji',
    to: 'Salasar Balaji',
    distanceKm: 28,
    typicalMinutes: 52,
  },
  {
    id: 'khatu-ringus',
    label: 'Khatu → Ringus',
    labelHi: 'खाटू → रिंगस',
    from: 'Khatu Shyam Ji',
    to: 'Ringus (railway & corridor)',
    distanceKm: 18,
    typicalMinutes: 36,
  },
  {
    id: 'ringus-khatu',
    label: 'Ringus → Khatu',
    labelHi: 'रिंगस → खाटू',
    from: 'Ringus (station area)',
    to: 'Khatu Shyam Ji',
    distanceKm: 18,
    typicalMinutes: 36,
  },
];

const PER_KM_INR: Record<RideVehicleType, number> = {
  two_wheeler: 9,
  hatchback: 19,
  sedan: 24,
  suv: 29,
};

/** Curated Liftngo fleet options — 4W emphasised for yātrā groups. */
export const KHATU_RIDE_VEHICLE_OPTIONS: RideVehicleOption[] = [
  {
    type: 'two_wheeler',
    label: 'Bike (solo)',
    seats: 1,
    baseFareEstimate: 149,
  },
  {
    type: 'hatchback',
    label: 'Hatchback',
    seats: 4,
    baseFareEstimate: 799,
    recommendedTourist: true,
    comfortTag: 'Smart value',
  },
  {
    type: 'sedan',
    label: 'Sedan',
    seats: 4,
    baseFareEstimate: 999,
    recommendedTourist: true,
    comfortTag: 'Most booked',
  },
  {
    type: 'suv',
    label: 'SUV',
    seats: 6,
    baseFareEstimate: 1299,
    recommendedTourist: true,
    comfortTag: 'Best for families',
  },
];

export function getKhatuRoute(id: TravelRouteId): KhatuTravelRoute | undefined {
  return KHATU_TRAVEL_ROUTES.find((r) => r.id === id);
}

export function estimateKhatuRideFareInr(route: KhatuTravelRoute, vehicleType: RideVehicleType): number {
  const opt = KHATU_RIDE_VEHICLE_OPTIONS.find((v) => v.type === vehicleType);
  if (!opt) return 0;
  const perKm = PER_KM_INR[vehicleType];
  return Math.round(opt.baseFareEstimate + route.distanceKm * perKm);
}

export function khatuVehicleImage(type: RideVehicleType): string {
  if (type === 'two_wheeler') return '/services/two-wheeler.svg';
  return '/services/four-wheeler.svg';
}
