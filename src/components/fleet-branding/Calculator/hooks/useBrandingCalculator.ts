'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  computeFleetBrandingQuote,
  type BrandingPackage,
  type FleetVehicleKind,
  type PrintingTier4W,
  type FleetBrandingQuote,
} from '@/lib/branding/fleetBrandingPricing';
import {
  buildFleetBrandingInquiryMessage,
  buildFleetBrandingWhatsAppHref,
} from '@/lib/branding/fleetBrandingWhatsApp';

export interface UseBrandingCalculatorReturn {
  // State
  vehicleCount: number;
  vehicle: FleetVehicleKind;
  branding: BrandingPackage;
  effectiveBranding: BrandingPackage;
  durationMonths: number;
  printingTier4W: PrintingTier4W;
  quote: FleetBrandingQuote | null;
  
  // Progress values for sliders
  vehicleProgress: number;
  durationProgress: number;
  
  // Setters
  setVehicleCount: (count: number) => void;
  setVehicle: (vehicle: FleetVehicleKind) => void;
  setBranding: (branding: BrandingPackage) => void;
  setDurationMonths: (months: number) => void;
  setPrintingTier4W: (tier: PrintingTier4W) => void;
  
  // WhatsApp links
  whatsappStartCampaignHref: string;
  whatsappLockEstimateHref: string;
  whatsappContactSalesHref: string;
  whatsappBrandFleetHref: string;
  
  // Actions
  scrollToCalculator: () => void;
}

export function useBrandingCalculator(): UseBrandingCalculatorReturn {
  const [vehicleCount, setVehicleCount] = useState(2);
  const [vehicle, setVehicle] = useState<FleetVehicleKind>('4w');
  const [branding, setBranding] = useState<BrandingPackage>('double');
  const [durationMonths, setDurationMonths] = useState(3);
  const [printingTier4W, setPrintingTier4W] = useState<PrintingTier4W>('standard');

  // Auto-correct branding if 3W selected with fullWrap
  useEffect(() => {
    if (vehicle === '3w' && branding === 'fullWrap') {
      setBranding('double');
    }
  }, [vehicle, branding]);

  const effectiveBranding: BrandingPackage =
    vehicle === '3w' && branding === 'fullWrap' ? 'double' : branding;

  const quote = useMemo(
    () =>
      computeFleetBrandingQuote({
        vehicleCount,
        vehicle,
        branding: effectiveBranding,
        durationMonths,
        printingTier4W,
      }),
    [vehicleCount, vehicle, effectiveBranding, durationMonths, printingTier4W]
  );

  // Slider progress calculations
  const vehicleProgress = ((vehicleCount - 1) / 99) * 100;
  const durationProgress = ((durationMonths - 1) / 11) * 100;

  // WhatsApp links
  const whatsappStartCampaignHref = useMemo(
    () =>
      buildFleetBrandingWhatsAppHref(
        buildFleetBrandingInquiryMessage({
          headline: "Hi Liftngo, I'd like to start a fleet branding campaign.",
          vehicleCount,
          vehicle,
          branding: effectiveBranding,
          durationMonths,
          quote,
        })
      ),
    [vehicleCount, vehicle, effectiveBranding, durationMonths, quote]
  );

  const whatsappLockEstimateHref = useMemo(
    () =>
      buildFleetBrandingWhatsAppHref(
        buildFleetBrandingInquiryMessage({
          headline: "Hi Liftngo, I'd like to proceed with this fleet branding estimate.",
          vehicleCount,
          vehicle,
          branding: effectiveBranding,
          durationMonths,
          quote,
        })
      ),
    [vehicleCount, vehicle, effectiveBranding, durationMonths, quote]
  );

  const whatsappContactSalesHref = useMemo(
    () =>
      buildFleetBrandingWhatsAppHref(
        buildFleetBrandingInquiryMessage({
          headline: "Hi Liftngo, I'd like to speak with sales about fleet branding.",
          vehicleCount,
          vehicle,
          branding: effectiveBranding,
          durationMonths,
          quote,
        })
      ),
    [vehicleCount, vehicle, effectiveBranding, durationMonths, quote]
  );

  const whatsappBrandFleetHref = useMemo(
    () =>
      buildFleetBrandingWhatsAppHref(
        buildFleetBrandingInquiryMessage({
          headline: "Hi Liftngo, I'd like to brand vehicles on your fleet.",
          vehicleCount,
          vehicle,
          branding: effectiveBranding,
          durationMonths,
          quote,
        })
      ),
    [vehicleCount, vehicle, effectiveBranding, durationMonths, quote]
  );

  const scrollToCalculator = useCallback(() => {
    document.getElementById('quote-calculator')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Handle vehicle change with branding correction
  const handleSetVehicle = useCallback((newVehicle: FleetVehicleKind) => {
    setVehicle(newVehicle);
    if (newVehicle === '3w' && branding === 'fullWrap') {
      setBranding('double');
    }
  }, [branding]);

  return {
    vehicleCount,
    vehicle,
    branding,
    effectiveBranding,
    durationMonths,
    printingTier4W,
    quote,
    vehicleProgress,
    durationProgress,
    setVehicleCount,
    setVehicle: handleSetVehicle,
    setBranding,
    setDurationMonths,
    setPrintingTier4W,
    whatsappStartCampaignHref,
    whatsappLockEstimateHref,
    whatsappContactSalesHref,
    whatsappBrandFleetHref,
    scrollToCalculator,
  };
}
