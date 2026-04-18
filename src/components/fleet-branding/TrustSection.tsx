'use client';

import { Shield, Truck, Globe, CheckCircle, Star } from 'lucide-react';
import { PRIMARY, ACCENT, TRUST_ITEMS } from './constants';

const ICON_MAP = {
  Truck,
  Shield,
  Globe,
} as const;

export function TrustSection() {
  return (
    <section className="bg-white">
      <div className="px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Trust Badges Row */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3 sm:mb-10 sm:gap-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-semibold text-green-700 sm:text-xs">
              <CheckCircle className="h-3.5 w-3.5" />
              Trusted by Local Businesses
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-semibold text-blue-700 sm:text-xs">
              <Truck className="h-3.5 w-3.5" />
              Active Fleet Network
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold sm:text-xs" style={{ backgroundColor: `${ACCENT}10`, color: ACCENT }}>
              <Star className="h-3.5 w-3.5" />
              Daily Active Deliveries
            </div>
          </div>

          {/* Section Header */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider sm:px-4 sm:py-2 sm:text-[11px]" style={{ borderColor: `${ACCENT}30`, color: ACCENT }}>
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Why Liftngo
            </span>
            <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-gray-900 sm:mt-6 sm:text-3xl md:text-4xl">
              Built for <span style={{ color: PRIMARY }}>Real Results</span>
            </h2>
          </div>

          {/* Trust Grid - With left accent */}
          <div className="mt-10 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3 lg:mt-16">
            {TRUST_ITEMS.map((item, index) => {
              const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP];
              const isHighlighted = index === 0;
              return (
                <div 
                  key={item.title} 
                  className="feature-card relative flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-lg sm:p-6"
                  style={{ borderLeftWidth: '4px', borderLeftColor: ACCENT }}
                >
                  {isHighlighted && (
                    <div className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide" style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}>
                      Key Benefit
                    </div>
                  )}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl sm:h-14 sm:w-14" style={{ backgroundColor: `${ACCENT}10` }}>
                    <IconComponent className="h-6 w-6 sm:h-7 sm:w-7" style={{ color: ACCENT }} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-gray-900 sm:text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
