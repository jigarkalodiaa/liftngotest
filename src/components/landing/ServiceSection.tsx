'use client';

import Link from 'next/link';
import { Package, CalendarClock, RefreshCw, Building2, Users, Headphones } from 'lucide-react';

const SERVICES = [
  { 
    id: 'single', 
    label: 'Book Single Delivery', 
    description: 'One-time delivery for your goods',
    icon: Package,
    href: '/pickup-location',
  },
  { 
    id: 'rent', 
    label: 'Rent', 
    description: 'Rent vehicles for short-term use',
    icon: CalendarClock,
    href: '/plans/rent',
  },
  { 
    id: 'subscribe', 
    label: 'Subscribe', 
    description: 'Monthly subscription plans',
    icon: RefreshCw,
    href: '/plans/subscription',
  },
  { 
    id: 'lease', 
    label: 'Lease', 
    description: 'Long-term vehicle leasing',
    icon: Building2,
    href: '/plans/lease',
  },
  { 
    id: 'dedicated', 
    label: 'Dedicated Fleet', 
    description: 'Dedicated vehicles for your business',
    icon: Users,
    href: '/plans/custom',
  },
  { 
    id: 'expert', 
    label: 'Expert Support', 
    description: 'Get help from our logistics experts',
    icon: Headphones,
    href: '/contact',
  },
];

/** Service section: all service types - single delivery, rent, subscribe, lease, dedicated, expert */
export default function ServiceSection() {
  return (
    <section
      id="service"
      className="page-section w-full bg-gray-50"
      aria-labelledby="service-heading"
    >
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <h2 id="service-heading" className="mb-2 text-center text-xl font-bold text-gray-900 sm:mb-3 sm:text-2xl lg:text-3xl">
          Our Services
        </h2>
        <p className="text-center text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base">
          Choose the service that fits your needs
        </p>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-5">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.id}
                href={s.href}
                className="flex flex-col items-center p-4 sm:p-5 rounded-2xl bg-white shadow-sm border border-gray-100 text-center transition-all hover:shadow-md hover:border-[var(--color-primary)]/30 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--landing-orange)]/10 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--landing-orange)]" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                  {s.label}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-snug">
                  {s.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
