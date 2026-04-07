/**
 * Liftngo bulk / pay-per-use quote engine (marketing-facing).
 *
 * Balance: **conversion** (competitive sticker, credible “savings”, soft demand lift) +
 * **profit** (fixed 20% platform margin on trip economics, per-trip floor vs internal unit).
 *
 * Model: base + distance×km → × platform margin → × light demand → charm rounding.
 * Volume rows: anchor list + savings; pay price already carries margin.
 */

export type VehicleClass = '2W' | '3W' | '4W';

const RATES: Record<VehicleClass, { baseLo: number; baseHi: number; kmLo: number; kmHi: number }> = {
  '2W': { baseLo: 49, baseHi: 59, kmLo: 6, kmHi: 8 },
  '3W': { baseLo: 129, baseHi: 149, kmLo: 12, kmHi: 16 },
  '4W': { baseLo: 249, baseHi: 299, kmLo: 18, kmHi: 25 },
};

/** ~lower-mid of published band: strong sticker vs market, margin applied after. */
function pickInBand(lo: number, hi: number): number {
  return lo + (hi - lo) * 0.38;
}

function baseFare(v: VehicleClass): number {
  const r = RATES[v];
  return pickInBand(r.baseLo, r.baseHi);
}

function perKm(v: VehicleClass): number {
  const r = RATES[v];
  return pickInBand(r.kmLo, r.kmHi);
}

/** Platform take on trip economics (hidden in UI). */
const PLATFORM_MARGIN = 1.2;

/**
 * Light utilization / lane-pressure lift — capped low so the calculator feels fair
 * (heavy surge kills trust; margin already protects unit economics).
 */
export function demandMultiplier(totalTrips: number): number {
  return 1 + Math.min(0.065, totalTrips / 520);
}

/** Raw trip before margin / demand (not exposed in UI). */
export function rawTripCost(vehicle: VehicleClass, distanceKm: number): number {
  const d = Math.max(1, distanceKm);
  return baseFare(vehicle) + perKm(vehicle) * d;
}

/** Per-trip INR after margin × demand, before charm. */
function tripUnitInternal(vehicle: VehicleClass, distanceKm: number, totalTrips: number): number {
  return rawTripCost(vehicle, distanceKm) * PLATFORM_MARGIN * demandMultiplier(totalTrips);
}

/**
 * Per-trip display: nearest “₹…9” style, with a small floor vs internal unit
 * so we don’t round down into unprofitable quotes.
 */
export function charmPerTrip(n: number): number {
  const v = Math.max(49, Math.round(n));
  const floor = Math.max(49, Math.floor(n * 0.968));
  let x = Math.round(v / 10) * 10 - 1;
  if (x < floor) x = Math.ceil(floor / 10) * 10 - 1;
  if (v >= 200 && x < v - 25) {
    const alt = Math.ceil(v / 50) * 50 - 1;
    if (alt >= floor && alt <= v + 35) x = alt;
  }
  return Math.max(floor, x);
}

/** List anchors: clean hundreds; slight upward bias so savings read credibly. */
export function charmTotalInr(n: number): number {
  const v = Math.max(100, Math.round(n));
  if (v < 2500) return Math.ceil(v / 100) * 100;
  return Math.ceil(v / 250) * 250;
}

/**
 * Display-only volume benefit (8–18%): strong enough to reward bulk,
 * tame enough that “list vs pay” doesn’t feel inflated (conversion).
 */
export function bulkDisplayPromoRate(totalTrips: number): number {
  if (totalTrips <= 30) return 0;
  if (totalTrips >= 120) return 0.18;
  if (totalTrips >= 90) return 0.16;
  if (totalTrips >= 60) return 0.14;
  if (totalTrips >= 45) return 0.11;
  return 0.08;
}

export type BulkQuoteLine = {
  vehicle: VehicleClass;
  trips: number;
  distanceKm: number;
  /** Rounded per-trip price customer sees for this line */
  perTripDisplay: number;
  /** perTripDisplay × trips */
  linePayTotal: number;
};

export type BulkPlanQuote = {
  lines: BulkQuoteLine[];
  totalTrips: number;
  demandMultiplier: number;
  /** What the customer pays (aggregate, rounded) */
  payTotal: number;
  /** Anchor list when bulk promo applies */
  listTotal: number | null;
  bulkDiscountPct: number;
  savings: number;
  avgPerTrip: number;
  showSubscriptionNudge: boolean;
};

export function computeBulkPlanQuote(
  configs: ReadonlyArray<{ vehicle: VehicleClass; trips: number; distanceKm: number }>
): BulkPlanQuote {
  const totalTrips = configs.reduce((s, c) => s + Math.max(1, c.trips), 0);
  const demand = demandMultiplier(totalTrips);

  const lines: BulkQuoteLine[] = configs.map((c) => {
    const trips = Math.max(1, c.trips);
    const dist = Math.max(1, c.distanceKm);
    const unit = tripUnitInternal(c.vehicle, dist, totalTrips);
    const perTripDisplay = charmPerTrip(unit);
    const linePayTotal = perTripDisplay * trips;
    return { vehicle: c.vehicle, trips, distanceKm: dist, perTripDisplay, linePayTotal };
  });

  const payTotal = lines.reduce((s, l) => s + l.linePayTotal, 0);
  const promo = bulkDisplayPromoRate(totalTrips);
  let listTotal: number | null = null;
  let savings = 0;

  if (promo > 0 && payTotal > 0) {
    const anchor = payTotal / (1 - promo);
    listTotal = charmTotalInr(anchor);
    if (listTotal <= payTotal) {
      listTotal = charmTotalInr(payTotal + Math.max(500, Math.round(payTotal * promo)));
    }
    savings = listTotal - payTotal;
  }

  const avgPerTrip = totalTrips > 0 ? Math.round(payTotal / totalTrips) : 0;
  const showSubscriptionNudge = totalTrips >= 35;

  return {
    lines,
    totalTrips,
    demandMultiplier: demand,
    payTotal,
    listTotal,
    bulkDiscountPct: promo,
    savings,
    avgPerTrip,
    showSubscriptionNudge,
  };
}
