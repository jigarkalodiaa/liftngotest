'use client';

import Link from 'next/link';
import { ArrowRight, Truck, MapPin, Coins, Calendar } from 'lucide-react';
import { FleetBrandingVanPreview } from '@/components/fleet-branding/FleetBrandingVanPreview';
import { PRIMARY, ACCENT, FLEET_FEATURES } from './constants';

const ICON_MAP = {
  MapPin,
  Coins,
  Calendar,
} as const;

interface FleetVisualProps {
  whatsappBrandFleetHref: string;
}

export function FleetVisual({ whatsappBrandFleetHref }: FleetVisualProps) {
  return (
    <section id="fleet-visual" className="scroll-mt-20 bg-gray-50">
      <div className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider sm:px-4 sm:py-2 sm:text-[11px]" style={{ borderColor: `${ACCENT}30`, color: ACCENT }}>
              <Truck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Fleet Preview
            </span>
            
            <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-gray-900 sm:mt-6 sm:text-3xl md:text-4xl">
              Your Brand.
              <span className="block" style={{ color: PRIMARY }}>Everywhere We Ride.</span>
            </h2>
            
            <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:mt-4 sm:text-base">
              Brand our live fleet across{' '}
              <span className="font-medium text-gray-700">Delhi NCR</span>,{' '}
              <span className="font-medium text-gray-700">Noida</span>, and expanding routes.
            </p>

            {/* Features - Compact cards with left accent */}
            <div className="mt-6 space-y-3 sm:mt-8">
              {FLEET_FEATURES.map((item) => {
                const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];
                return (
                  <div 
                    key={item.title} 
                    className="feature-card flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md"
                    style={{ borderLeftWidth: '4px', borderLeftColor: ACCENT }}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg sm:h-11 sm:w-11" style={{ backgroundColor: `${ACCENT}10` }}>
                      <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: ACCENT }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 sm:text-base">{item.title}</h3>
                      <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href={whatsappBrandFleetHref}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-btn mt-6 inline-flex h-12 items-center gap-2 rounded-xl px-6 text-sm font-bold text-white sm:mt-8 sm:h-14 sm:rounded-full sm:px-8 sm:text-[15px]"
              style={{ backgroundColor: ACCENT }}
            >
              Brand My Business
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>

          {/* Preview */}
          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-lg sm:p-4">
              <FleetBrandingVanPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
