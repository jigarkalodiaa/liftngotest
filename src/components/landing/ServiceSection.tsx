'use client';

import Image from 'next/image';
import Link from 'next/link';

const SERVICES = [
  { id: 'walk', label: 'Walk', image: '/dashboard/service-walk.png', href: '/services/walk' },
  { id: 'two', label: '2 Wheeler', image: '/dashboard/service-2wheeler.png', href: '/services/2-wheeler' },
  { id: 'three', label: '3 Wheeler', image: '/dashboard/service-3wheeler.png', href: '/services/3-wheeler' },
  { id: 'four', label: '4 Wheeler', image: '/services/four-wheeler.svg', href: '/services/4-wheeler' },
];

/** Service section: walk through 4W with link to full fleet & roadmap. */
export default function ServiceSection() {
  return (
    <section
      id="service"
      className="w-full py-12 lg:py-16 xl:py-20 bg-white"
      aria-labelledby="service-heading"
    >
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <h2 id="service-heading" className="text-center text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-5 sm:mb-8">
          Our Service
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4 sm:gap-6 lg:gap-8">
          {SERVICES.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="flex min-h-0 flex-col items-center rounded-2xl py-4 px-2 text-center transition-colors hover:bg-gray-50/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 sm:p-5 lg:p-6"
            >
              <div className="relative mx-auto h-[min(7.25rem,42vw)] w-[min(7.25rem,42vw)] shrink-0 rounded-2xl bg-[var(--color-primary)]/10 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
                <div className="absolute inset-0 p-1.5 sm:p-2 md:p-2.5 lg:p-3">
                  <div className="relative h-full w-full">
                    <Image
                      src={s.image}
                      alt={s.label}
                      fill
                      className="object-contain object-center"
                      sizes="(max-width: 640px) 116px, (max-width: 1024px) 96px, 128px"
                    />
                  </div>
                </div>
              </div>
              <p className="mt-3 max-w-[9rem] text-sm font-semibold leading-snug text-gray-900 sm:mt-3 sm:max-w-none sm:text-base lg:text-base">
                {s.label}
              </p>
            </Link>
          ))}
        </div>
        <p className="mt-5 text-center text-sm text-gray-600 sm:mt-6">
          <Link href="/services#fleet-roadmap" className="text-[var(--color-primary)] font-medium hover:underline">
            Refrigerated, long haul &amp; more — coming soon
          </Link>
          <span className="mx-2 text-gray-300" aria-hidden>
            ·
          </span>
          <Link href="/services" className="text-[var(--color-primary)] font-medium hover:underline">
            All services &amp; fleet
          </Link>
        </p>
      </div>
    </section>
  );
}
