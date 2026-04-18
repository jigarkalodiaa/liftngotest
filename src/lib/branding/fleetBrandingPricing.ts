export type FleetVehicleKind = '3w' | '4w';

export type BrandingPackage = 'single' | 'double' | 'fullWrap';

/** Monthly rent per vehicle by vehicle + package (Liftngo fleet branding). */
export const MONTHLY_RENT_PER_VEHICLE: Record<
  FleetVehicleKind,
  Partial<Record<BrandingPackage, number>>
> = {
  '3w': {
    single: 1000,
    double: 1500,
  },
  '4w': {
    single: 3000,
    double: 4500,
    fullWrap: 7000,
  },
};

/** One-time vinyl / printing baseline per vehicle install. */
export const PRINTING_COST_FIXED: Record<FleetVehicleKind, number> = {
  '3w': 1500,
  '4w': 4500, // midpoint of ₹3000–₹6000 unless overridden
};

export type PrintingTier4W = 'budget' | 'standard' | 'premium';

export const PRINTING_COST_4W_BY_TIER: Record<PrintingTier4W, number> = {
  budget: 3000,
  standard: 4500,
  premium: 6000,
};

export type FleetBrandingQuoteInput = {
  vehicleCount: number;
  vehicle: FleetVehicleKind;
  branding: BrandingPackage;
  durationMonths: number;
  /** Used when vehicle === '4w' to pick printing within ₹3000–₹6000 band. */
  printingTier4W?: PrintingTier4W;
};

export type FleetBrandingQuote = {
  monthlyRatePerVehicle: number;
  monthlyFleetCost: number;
  printingCost: number;
  durationMonths: number;
  totalCampaignCost: number;
};

export function getMonthlyRatePerVehicle(
  vehicle: FleetVehicleKind,
  branding: BrandingPackage
): number | null {
  const row = MONTHLY_RENT_PER_VEHICLE[vehicle];
  const rate = row[branding];
  return typeof rate === 'number' ? rate : null;
}

export function computeFleetBrandingQuote(input: FleetBrandingQuoteInput): FleetBrandingQuote | null {
  const count = Math.max(0, Math.floor(input.vehicleCount));
  const months = Math.max(0, Math.floor(input.durationMonths));
  const rate = getMonthlyRatePerVehicle(input.vehicle, input.branding);
  if (rate === null || count <= 0 || months <= 0) return null;

  const monthlyFleetCost = count * rate;
  const printingCost =
    input.vehicle === '4w'
      ? PRINTING_COST_4W_BY_TIER[input.printingTier4W ?? 'standard'] * count
      : PRINTING_COST_FIXED['3w'] * count;

  const totalCampaignCost = monthlyFleetCost * months + printingCost;

  return {
    monthlyRatePerVehicle: rate,
    monthlyFleetCost,
    printingCost,
    durationMonths: months,
    totalCampaignCost,
  };
}
