'use client';

import { Sparkles, TrendingUp, Award } from 'lucide-react';
import { PRIMARY } from '../constants';
import { VehicleSlider } from './VehicleSlider';
import { VehicleTypeSelector } from './VehicleTypeSelector';
import { BrandingSelector } from './BrandingSelector';
import { DurationSlider } from './DurationSlider';
import { PrintingSelector } from './PrintingSelector';
import { PriceSummary } from './PriceSummary';
import { useBrandingCalculator } from './hooks/useBrandingCalculator';

export function CalculatorContainer() {
  const {
    vehicleCount,
    vehicle,
    effectiveBranding,
    durationMonths,
    printingTier4W,
    quote,
    vehicleProgress,
    durationProgress,
    setVehicleCount,
    setVehicle,
    setBranding,
    setDurationMonths,
    setPrintingTier4W,
    whatsappLockEstimateHref,
  } = useBrandingCalculator();

  return (
    <section id="quote-calculator" className="scroll-mt-20 bg-gray-50">
      <div className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-10 lg:mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider sm:px-4 sm:py-2 sm:text-[11px]" style={{ borderColor: `${PRIMARY}20`, color: PRIMARY }}>
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Live Pricing
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-gray-900 sm:mt-6 sm:text-3xl md:text-4xl">
              Configure Your Campaign
            </h2>
            <p className="mt-2 text-sm text-gray-500 sm:mt-3 sm:text-base">
              Customize your fleet branding package
            </p>
          </div>

          {/* Calculator Grid - Responsive */}
          <div className="grid gap-6 lg:grid-cols-[1fr,340px] lg:items-start xl:grid-cols-[1fr,380px]">
            {/* CONFIGURATOR CARD */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="space-y-6 p-4 sm:space-y-8 sm:p-6">
                <VehicleSlider 
                  value={vehicleCount} 
                  onChange={setVehicleCount} 
                  progress={vehicleProgress} 
                />
                
                <VehicleTypeSelector 
                  value={vehicle} 
                  onChange={setVehicle} 
                />
                
                <BrandingSelector 
                  value={effectiveBranding} 
                  vehicleType={vehicle} 
                  onChange={setBranding} 
                />
                
                <DurationSlider 
                  value={durationMonths} 
                  onChange={setDurationMonths} 
                  progress={durationProgress} 
                />
                
                <PrintingSelector 
                  value={printingTier4W} 
                  vehicleType={vehicle} 
                  onChange={setPrintingTier4W} 
                />
              </div>

              {/* Psychology Tips */}
              <div className="border-t border-gray-100 bg-gray-50/80 px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-gray-500 sm:gap-6 sm:text-xs">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: PRIMARY }} />
                    Most brands start with 3–5 vehicles
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Award className="h-3 w-3 sm:h-3.5 sm:w-3.5" style={{ color: PRIMARY }} />
                    Recommended: Double side branding
                  </span>
                </div>
              </div>
            </div>

            {/* LIVE PRICE PANEL */}
            <PriceSummary 
              quote={quote} 
              durationMonths={durationMonths} 
              whatsappLockEstimateHref={whatsappLockEstimateHref} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
