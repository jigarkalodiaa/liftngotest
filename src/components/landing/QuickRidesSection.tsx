'use client';

import Link from 'next/link';
import { Zap, IndianRupee, MapPin, Clock, Shield, Truck } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    title: 'Quick Booking',
    description: 'Book a delivery in under 60 seconds. No waiting, no hassle.',
  },
  {
    icon: IndianRupee,
    title: 'Low & Transparent Fares',
    description: 'Upfront pricing with no hidden charges. Pay only what you see.',
  },
  {
    icon: MapPin,
    title: 'Real-Time Tracking',
    description: 'Track your goods live on map from pickup to delivery.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description: 'Our drivers are committed to delivering your goods on time, every time.',
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Verified drivers and insured deliveries for your peace of mind.',
  },
  {
    icon: Truck,
    title: 'Multi-Vehicle Options',
    description: '2-wheeler to 4-wheeler — choose the right vehicle for your cargo size.',
  },
];

/** Section: Why Choose Liftngo - Key features and benefits */
export default function QuickRidesSection() {
  return (
    <section
      id="why-liftngo"
      className="page-section w-full bg-[var(--landing-bg)]"
      aria-labelledby="why-liftngo-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="why-liftngo-heading" className="mb-2 text-center text-2xl font-bold text-gray-900 sm:mb-3 sm:text-3xl lg:text-4xl">
          Why Choose Liftngo?
        </h2>
        <p className="text-center text-gray-500 mb-8 sm:mb-10 text-sm sm:text-base max-w-2xl mx-auto">
          Fast, affordable, and reliable delivery service for all your logistics needs
        </p>

        {/* Features Grid */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex gap-4 p-4 sm:p-5 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--landing-orange)]/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-[var(--landing-orange)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-8 sm:mt-10">
          <Link
            href="/pickup-location"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Book Your First Delivery
          </Link>
        </div>
      </div>
    </section>
  );
}
