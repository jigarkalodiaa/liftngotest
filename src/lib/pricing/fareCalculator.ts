export type FareVehicleType = 'twoWheeler' | 'threeWheeler' | 'fourWheeler';

export type FareSlab = { upto: number; price: number };

type VehiclePricingConfig = {
  minimumBaseFare: number;
  longDistanceMarginMultiplier: number;
  slabs: FareSlab[];
};

/**
 * 4-Wheeler slabs serve as the BASE pricing reference.
 * 3-Wheeler slabs are derived at 95% of 4W prices for consistency.
 */
const FOUR_WHEELER_SLABS: FareSlab[] = [
  { upto: 3, price: 440 },
  { upto: 6, price: 489 },
  { upto: 10, price: 650 },
  { upto: 15, price: 755 },
  { upto: 20, price: 900 },
  { upto: 30, price: 1144 },
  { upto: 40, price: 1700 },
];

/** 3W pricing = 4W pricing * 0.95 (5% discount), rounded to nearest rupee */
const THREE_WHEELER_DISCOUNT = 0.95;
const THREE_WHEELER_SLABS: FareSlab[] = FOUR_WHEELER_SLABS.map((slab) => ({
  upto: slab.upto,
  price: Math.round(slab.price * THREE_WHEELER_DISCOUNT),
}));

/** 2-Wheeler slabs (independent pricing tier for light parcels) */
const TWO_WHEELER_SLABS: FareSlab[] = [
  { upto: 2, price: 120 },
  { upto: 5, price: 160 },
  { upto: 10, price: 220 },
  { upto: 15, price: 260 },
  { upto: 23, price: 207 },
  { upto: 25, price: 207 },
  { upto: 35, price: 400 },
];

export const FARE_PRICING_CONFIG: Record<FareVehicleType, VehiclePricingConfig> = {
  twoWheeler: {
    minimumBaseFare: 120,
    longDistanceMarginMultiplier: 1.2,
    slabs: TWO_WHEELER_SLABS,
  },
  threeWheeler: {
    minimumBaseFare: Math.round(440 * THREE_WHEELER_DISCOUNT), // 418 (95% of 4W base)
    longDistanceMarginMultiplier: 1.18,
    slabs: THREE_WHEELER_SLABS,
  },
  fourWheeler: {
    minimumBaseFare: 440,
    longDistanceMarginMultiplier: 1.15,
    slabs: FOUR_WHEELER_SLABS,
  },
};

export const FARE_SLABS: Record<FareVehicleType, FareSlab[]> = {
  twoWheeler: FARE_PRICING_CONFIG.twoWheeler.slabs,
  threeWheeler: FARE_PRICING_CONFIG.threeWheeler.slabs,
  fourWheeler: FARE_PRICING_CONFIG.fourWheeler.slabs,
};

export const INTERSTATE_TOLL_CHARGE = 100;
export const PEAK_HOUR_MULTIPLIER = 1.2;
/** Minimum long-distance extension rate safeguard (prevents underpricing beyond max slab). */
export const BEYOND_LAST_SLAB_PER_KM = 12;
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
  isInterstate: boolean;
  isPeakHour?: boolean;
};

export type FareBreakdown = {
  baseFare: number;
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

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function getLastTwoSlabs(slabs: FareSlab[]): [FareSlab, FareSlab] {
  const last = slabs[slabs.length - 1];
  const prev = slabs[slabs.length - 2];
  return [prev, last];
}

/** Derived per-km extension rate from the last slab transition, with margin uplift. */
export function getDerivedLongDistanceRate(vehicleType: FareVehicleType): number {
  const config = FARE_PRICING_CONFIG[vehicleType];
  const [prev, last] = getLastTwoSlabs(config.slabs);
  const distanceDelta = Math.max(1, last.upto - prev.upto);
  const priceDelta = Math.max(1, last.price - prev.price);
  const rawRate = priceDelta / distanceDelta;
  const marginAdjusted = rawRate * config.longDistanceMarginMultiplier;
  return Math.max(BEYOND_LAST_SLAB_PER_KM, Math.ceil(marginAdjusted));
}

/**
 * Curve-based slab pricing:
 * - First slab acts as floor/minimum protection
 * - Between slab points, fare is linearly interpolated for smooth transitions
 * - Beyond highest slab, adds linear tail at derived overage rate.
 */
export function getSlabPrice(distance: number, slabs: FareSlab[], overageRatePerKm: number): number {
  const safeDistance = Math.max(0, distance);
  if (slabs.length === 0) return 0;

  const first = slabs[0];
  if (safeDistance <= first.upto) return first.price;

  for (let i = 1; i < slabs.length; i += 1) {
    const prev = slabs[i - 1];
    const curr = slabs[i];
    if (safeDistance <= curr.upto) {
      const segmentDistance = Math.max(1, curr.upto - prev.upto);
      const progress = (safeDistance - prev.upto) / segmentDistance;
      return prev.price + progress * (curr.price - prev.price);
    }
  }

  const last = slabs[slabs.length - 1];
  return last.price + (safeDistance - last.upto) * overageRatePerKm;
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
  const config = FARE_PRICING_CONFIG[input.vehicleType];
  const slabs = config.slabs;
  const overageRatePerKm = getDerivedLongDistanceRate(input.vehicleType);
  const slabFareRaw = getSlabPrice(safeDistance, slabs, overageRatePerKm);
  const baseFare = Math.max(config.minimumBaseFare, slabFareRaw);
  const toll = input.isInterstate ? INTERSTATE_TOLL_CHARGE : 0;
  const subtotal = baseFare + toll;
  const surgeMultiplier = input.isPeakHour ? PEAK_HOUR_MULTIPLIER : 1;
  const surged = subtotal * surgeMultiplier;
  const totalFare = roundToRupee(surged);
  const lastSlab = slabs[slabs.length - 1];
  const matchedSlab = slabs.find((slab) => safeDistance <= slab.upto) ?? lastSlab;
  const overageKm = Math.max(0, safeDistance - lastSlab.upto);

  return {
    totalFare,
    breakdown: {
      baseFare: roundToRupee(baseFare),
      slabFare: roundToRupee(slabFareRaw),
      toll: roundToRupee(toll),
      subtotal: roundToRupee(subtotal),
      surgeMultiplier,
      surgeAmount: roundToRupee(surged - subtotal),
      distance: round2(safeDistance),
      slabUptoApplied: matchedSlab.upto,
      overageKm: round2(overageKm),
      overageRate: overageRatePerKm,
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

/** Bonus: quick view of derived long-distance per-km extension rates by vehicle. */
export function getLongDistanceDerivedPricing(): Record<FareVehicleType, number> {
  return {
    twoWheeler: getDerivedLongDistanceRate('twoWheeler'),
    threeWheeler: getDerivedLongDistanceRate('threeWheeler'),
    fourWheeler: getDerivedLongDistanceRate('fourWheeler'),
  };
}

/** Bonus: margin optimization suggestions for further iteration. */
export function getMarginImprovementSuggestions(): string[] {
  return [
    'Increase platform fee by corridor for high-congestion zones instead of global hike.',
    'Apply a heavier over-max slab multiplier (e.g. +5-10%) for same-day urgent jobs.',
    'Introduce return-load discount bands to preserve margin while improving fleet utilization.',
  ];
}
