export type RentDuration = 'daily' | 'weekly' | 'monthly';
export type RentMode = 'withDriver' | 'withoutDriver';

export type RentOption = {
  vehicle: string;
  withDriver: { daily: number; weekly: number; monthly: number };
  withoutDriver: { daily: number; weekly: number; monthly: number };
  bestFor: string;
};

export const RENT_CATALOG: readonly RentOption[] = [
  {
    vehicle: '2-Wheeler',
    withDriver: { daily: 1200, weekly: 7000, monthly: 25000 },
    withoutDriver: { daily: 600, weekly: 3500, monthly: 12000 },
    bestFor: 'Documents, parcels, small packages',
  },
  {
    vehicle: '3-Wheeler',
    withDriver: { daily: 1800, weekly: 11000, monthly: 38000 },
    withoutDriver: { daily: 900, weekly: 5500, monthly: 18000 },
    bestFor: 'Medium cargo, retail, e-commerce',
  },
  {
    vehicle: '4-Wheeler',
    withDriver: { daily: 3500, weekly: 22000, monthly: 55000 },
    withoutDriver: { daily: 2000, weekly: 12000, monthly: 35000 },
    bestFor: 'Heavy cargo, warehouse transfers, bulk goods',
  },
];

export function rentPriceFor(
  vehicle: string,
  mode: RentMode,
  duration: RentDuration,
): { opt: RentOption; price: number } | undefined {
  const v = decodeURIComponent(vehicle).trim();
  const opt = RENT_CATALOG.find((r) => r.vehicle === v || r.vehicle.toLowerCase() === v.toLowerCase());
  if (!opt) return undefined;
  return { opt, price: opt[mode][duration] };
}
