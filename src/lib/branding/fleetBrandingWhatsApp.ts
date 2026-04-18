import type {
  BrandingPackage,
  FleetBrandingQuote,
  FleetVehicleKind,
} from '@/lib/branding/fleetBrandingPricing';
import { FLEET_BRANDING_WHATSAPP_DIGITS } from '@/lib/constants';

export function buildFleetBrandingWhatsAppHref(message: string): string {
  return `https://wa.me/${FLEET_BRANDING_WHATSAPP_DIGITS}?text=${encodeURIComponent(message)}`;
}

export function buildFleetBrandingInquiryMessage(opts: {
  headline: string;
  vehicleCount: number;
  vehicle: FleetVehicleKind;
  branding: BrandingPackage;
  durationMonths: number;
  quote: FleetBrandingQuote | null;
}): string {
  const vLabel = opts.vehicle === '3w' ? '3 Wheeler (EV)' : '4 Wheeler';
  const bLabel =
    opts.branding === 'single' ? 'Single side' : opts.branding === 'double' ? 'Double side' : 'Full wrap';

  let msg = `${opts.headline}\n\n`;
  msg += `Vehicle type: ${vLabel}\n`;
  msg += `Branding: ${bLabel}\n`;
  msg += `Vehicles: ${opts.vehicleCount}\n`;
  msg += `Duration: ${opts.durationMonths} month(s)\n`;

  if (opts.quote) {
    msg += `\nEstimate:\n`;
    msg += `• Rent / vehicle / month: ₹${opts.quote.monthlyRatePerVehicle.toLocaleString('en-IN')}\n`;
    msg += `• Monthly fleet cost: ₹${opts.quote.monthlyFleetCost.toLocaleString('en-IN')}\n`;
    msg += `• One-time printing: ₹${opts.quote.printingCost.toLocaleString('en-IN')}\n`;
    msg += `• Total campaign: ₹${opts.quote.totalCampaignCost.toLocaleString('en-IN')}\n`;
  }

  msg += `\nPlease confirm availability and next steps.`;
  return msg;
}
