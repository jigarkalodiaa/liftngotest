'use client';

import { ArrowRight, ChevronDown, Eye, MapPin, Truck, Clock, Shield } from 'lucide-react';
import { PRIMARY, ACCENT } from './constants';

interface HeroProps {
  mounted: boolean;
  scrollToCalculator: () => void;
}

const HERO_STATS = [
  { icon: Eye, value: '70K+', label: 'Daily Impressions' },
  { icon: MapPin, value: '50+', label: 'Locations Covered' },
  { icon: Truck, value: '3W & 4W', label: 'Vehicle Fleet' },
  { icon: Clock, value: '24/7', label: 'Brand Visibility' },
];

export function Hero({ mounted, scrollToCalculator }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-gray-50/80 to-white" aria-hidden />
      <div
        className="pointer-events-none absolute right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full opacity-20 blur-[100px]"
        style={{ background: `linear-gradient(135deg, ${PRIMARY}30, transparent)` }}
        aria-hidden
      />

      {/* Content Container - Consistent padding */}
      <div className="relative z-[1] px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
        <div className={`mx-auto max-w-6xl text-center ${mounted ? 'fade-in-up' : 'opacity-0'}`}>
          {/* Premium Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-wider sm:mb-8"
            style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}08`, color: ACCENT }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ backgroundColor: ACCENT }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
            </span>
            City-Scale Advertising
          </div>

          {/* Hero Headline - Responsive sizing */}
          <h1 className="mx-auto max-w-3xl text-3xl font-black leading-[1.1] tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
            Your Brand Across
            <br />
            <span style={{ color: PRIMARY }}>The Entire City</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-500 sm:mt-6 sm:text-lg md:max-w-2xl">
            Turn every delivery into a moving billboard. Reach thousands daily across{' '}
            <span className="font-medium text-gray-700">Delhi NCR</span> and{' '}
            <span className="font-medium text-gray-700">beyond</span>.
          </p>

          {/* CTA Buttons - Consistent sizing */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <button
              type="button"
              onClick={scrollToCalculator}
              className="premium-btn inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white shadow-lg sm:h-14 sm:w-auto sm:rounded-full sm:px-8 sm:text-[15px]"
              style={{ backgroundColor: PRIMARY }}
            >
              Start Your Campaign
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={scrollToCalculator}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 sm:h-14 sm:w-auto sm:rounded-full sm:px-8 sm:text-[15px]"
            >
              See Pricing
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
            </button>
          </div>

          {/* Stats Grid - Symmetric 2x2 on mobile, 4 on desktop */}
          <div className={`mx-auto mt-12 max-w-3xl sm:mt-16 ${mounted ? 'fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {HERO_STATS.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="feature-card relative flex flex-col items-center rounded-2xl border border-gray-100 bg-white/90 p-4 text-center shadow-sm backdrop-blur-sm hover:shadow-lg sm:p-5"
                  style={{ borderTopWidth: '3px', borderTopColor: ACCENT }}
                >
                  {index === 0 && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase" style={{ backgroundColor: ACCENT, color: 'white' }}>
                      Top
                    </div>
                  )}
                  <div 
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl sm:h-12 sm:w-12" 
                    style={{ backgroundColor: `${ACCENT}10` }}
                  >
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: ACCENT }} />
                  </div>
                  <p className="text-xl font-black sm:text-2xl" style={{ color: PRIMARY }}>{stat.value}</p>
                  <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:text-[11px]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-10 flex justify-center sm:mt-12">
            <button
              type="button"
              onClick={() => document.getElementById('why-branding')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex flex-col items-center gap-1.5 text-gray-400 transition hover:text-gray-600"
            >
              <span className="text-[10px] font-medium uppercase tracking-wider sm:text-[11px]">Discover More</span>
              <ChevronDown className="h-4 w-4 animate-bounce sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
