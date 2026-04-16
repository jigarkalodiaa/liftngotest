'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Calculator, ChevronRight, GlassWater } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

const QUICK_SERVICES = [
  {
    id: 'fresh-nariyal-pani',
    title: 'Order Fresh Nariyal Pani',
    description: 'Get fresh and chilled nariyal pani delivered quickly.',
    icon: GlassWater,
    logo: '/images/coconut/nariyal-pani.png',
    href: '/noida/coconut',
  },
  {
    id: 'fare-calculator',
    title: 'Fare Calculator',
    description: 'Check estimated delivery fare before booking.',
    icon: Calculator,
    href: ROUTES.FARE_CALCULATOR,
  },
];

export default function QuickServicesSection() {
  const router = useRouter();

  return (
    <section
      id="quick-services"
      className="page-section w-full bg-gradient-to-b from-white via-slate-50/60 to-white"
      aria-labelledby="quick-services-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          id="quick-services-heading"
          className="mb-2 text-center text-2xl font-bold text-gray-900 sm:mb-3 sm:text-3xl"
        >
          Quick Services
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-gray-500 sm:mb-10 sm:text-base">
          Use these quick actions to access our most-used services.
        </p>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {QUICK_SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                href={service.href}
                onClick={(event) => {
                  if (service.id !== 'fare-calculator') return;
                  event.preventDefault();
                  router.push(ROUTES.FARE_CALCULATOR);
                }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50 p-5 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.45)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 motion-reduce:transform-none"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[var(--color-primary)]/10 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-90 motion-safe:animate-pulse" />
                <div className="pointer-events-none absolute -bottom-14 -left-10 h-28 w-28 rounded-full bg-[var(--landing-orange)]/10 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-90" />

                <div className="relative flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--landing-orange)]/20 bg-[var(--landing-orange)]/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 motion-reduce:transform-none">
                    {service.logo ? (
                      <Image
                        src={service.logo}
                        alt={`${service.title} logo`}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-xl object-cover"
                      />
                    ) : (
                      <Icon className="h-7 w-7 text-[var(--landing-orange)]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{service.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{service.description}</p>
                    <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                      Tap to open
                      <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
