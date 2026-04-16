export type FareVehicleType = 'twoWheeler' | 'threeWheeler' | 'fourWheeler';

export type FareSlab = { upto: number; price: number };

export const FARE_SLABS: Record<FareVehicleType, FareSlab[]> = {
  twoWheeler: [
    { upto: 3, price: 79 },
    { upto: 5, price: 120 },
    { upto: 8, price: 160 },
    { upto: 10, price: 199 },
    { upto: 12, price: 230 },
    { upto: 15, price: 260 },
  ],
  threeWheeler: [
    { upto: 3, price: 350 },
    { upto: 5, price: 450 },
    { upto: 8, price: 650 },
    { upto: 10, price: 750 },
    { upto: 12, price: 999 },
    { upto: 14, price: 1200 },
    { upto: 16, price: 1350 },
    { upto: 18, price: 1400 },
  ],
  fourWheeler: [
    { upto: 3, price: 450 },
    { upto: 5, price: 650 },
    { upto: 8, price: 900 },
    { upto: 10, price: 1100 },
    { upto: 12, price: 1400 },
    { upto: 15, price: 1700 },
    { upto: 20, price: 2200 },
  ],
};

export const INTERSTATE_TOLL_CHARGE = 100;
export const PEAK_HOUR_MULTIPLIER = 1.2;
export const BEYOND_LAST_SLAB_PER_KM = 40;
export const PEAK_TRAFFIC_SPEED_FACTOR = 0.8;

/** Baseline urban operating speeds derived from India city traffic bands (~17-25 km/h). */
export const VEHICLE_AVG_SPEED_KMPH: Record<FareVehicleType, number> = {
  twoWheeler: 24,
  threeWheeler: 20,
  fourWheeler: 18,
};

/** Non-driving overhead (pickup confirmation + loading/unloading) by vehicle class. */
const VEHICLE_SERVICE_BUFFER_MIN: Record<FareVehicleType, number> = {
  twoWheeler: 4,
  threeWheeler: 6,
  fourWheeler: 8,
};

export type CalculateFareInput = {
  vehicleType: FareVehicleType;
  distance: number;
  time?: number;
  isInterstate: boolean;
  isPeakHour?: boolean;
};

export type FareBreakdown = {
  slabFare: number;
  toll: number;
  subtotal: number;
  surgeMultiplier: number;
  surgeAmount: number;
  distance: number;
  slabUptoApplied: number;
  overageKm: number;
  overageRate: number;
};

export type FareCalculationResult = {
  totalFare: number;
  breakdown: FareBreakdown;
};

/** Parse and sanitize user-entered km value. Returns 0 for invalid values. */
export function normalizeDistanceKm(rawDistance: string): number {
  const parsed = Number(rawDistance);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.round(parsed * 100) / 100;
}

/** Parse and sanitize user-entered trip time in minutes. Returns 0 for invalid values. */
export function normalizeTimeMinutes(rawTime: string): number {
  const parsed = Number(rawTime);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.round(parsed * 100) / 100;
}

/**
 * Slab-first pricing:
 * - Picks the first matching slab when `distance <= slab.upto`
 * - For distance beyond highest slab, adds linear tail at fixed overage rate.
 */
export function getSlabPrice(distance: number, slabs: FareSlab[]): number {
  const safeDistance = Math.max(0, distance);
  for (const slab of slabs) {
    if (safeDistance <= slab.upto) return slab.price;
  }

  const last = slabs[slabs.length - 1];
  return last.price + (safeDistance - last.upto) * BEYOND_LAST_SLAB_PER_KM;
}

export function estimateTripTimeMinutes(input: {
  vehicleType: FareVehicleType;
  distanceKm: number;
  isPeakHour?: boolean;
}): number {
  const safeDistance = Math.max(0, input.distanceKm);
  if (safeDistance <= 0) return 0;

  const baseSpeed = VEHICLE_AVG_SPEED_KMPH[input.vehicleType];
  const effectiveSpeed = (input.isPeakHour ? baseSpeed * PEAK_TRAFFIC_SPEED_FACTOR : baseSpeed) || 1;
  const travelMinutes = (safeDistance / effectiveSpeed) * 60;
  const serviceBuffer = VEHICLE_SERVICE_BUFFER_MIN[input.vehicleType];

  return Math.max(1, Math.round(travelMinutes + serviceBuffer));
}

function roundToRupee(value: number): number {
  return Math.round(value);
}

export function calculateFare(input: CalculateFareInput): FareCalculationResult {
  const safeDistance = Math.max(0, input.distance);
  const slabs = FARE_SLABS[input.vehicleType];
  const slabFare = getSlabPrice(safeDistance, slabs);
  const toll = input.isInterstate ? INTERSTATE_TOLL_CHARGE : 0;
  const subtotal = slabFare + toll;
  const surgeMultiplier = input.isPeakHour ? PEAK_HOUR_MULTIPLIER : 1;
  const surged = subtotal * surgeMultiplier;
  const totalFare = roundToRupee(surged);
  const lastSlab = slabs[slabs.length - 1];
  const matchedSlab = slabs.find((slab) => safeDistance <= slab.upto) ?? lastSlab;
  const overageKm = Math.max(0, safeDistance - lastSlab.upto);

  return {
    totalFare,
    breakdown: {
      slabFare: roundToRupee(slabFare),
      toll: roundToRupee(toll),
      subtotal: roundToRupee(subtotal),
      surgeMultiplier,
      surgeAmount: roundToRupee(surged - subtotal),
      distance: safeDistance,
      slabUptoApplied: matchedSlab.upto,
      overageKm: Math.round(overageKm * 100) / 100,
      overageRate: BEYOND_LAST_SLAB_PER_KM,
    },
  };
}

/** Backward compatible wrapper for older callers. */
export function computeFareBreakdown(input: {
  vehicleType: FareVehicleType;
  distanceKm: number;
  isInterstate: boolean;
}): FareBreakdown {
  return calculateFare({
    vehicleType: input.vehicleType,
    distance: input.distanceKm,
    isInterstate: input.isInterstate,
    isPeakHour: false,
  }).breakdown;
}

/** Backward compatible shape for older UI callers. */
export function computeFareTotal(input: {
  vehicleType: FareVehicleType;
  distanceKm: number;
  isInterstate: boolean;
}): number {
  return calculateFare({
    vehicleType: input.vehicleType,
    distance: input.distanceKm,
    isInterstate: input.isInterstate,
    isPeakHour: false,
  }).totalFare;
}
