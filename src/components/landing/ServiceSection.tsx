'use client';

import Image from 'next/image';
import Link from 'next/link';

const SERVICES = [
  { id: 'walk', label: 'Walk', image: '/dashboard/service-walk.png', href: '/services/walk' },
  { id: 'two', label: '2 Wheeler', image: '/dashboard/service-2wheeler.png', href: '/services/2-wheeler' },
  { id: 'three', label: '3 Wheeler', image: '/dashboard/service-3wheeler.png', href: '/services/3-wheeler' },
];

/** Service section: title + three cards (Walk, 2 Wheeler, 3 Wheeler) linking to service pages. */
export default function ServiceSection() {
  return (
    <section
      id="service"
      className="w-full py-12 lg:py-16 xl:py-20 bg-white"
      aria-labelledby="service-heading"
    >
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <h2 id="service-heading" className="text-left text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Our Service</h2>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {SERVICES.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              className="rounded-2xl p-4 sm:p-5 text-center hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl flex items-center justify-center overflow-hidden bg-indigo-100">
                <Image
                  src={s.image}
                  alt={s.label}
                  fill
                  className="object-contain"
                  sizes="96px"
                  style={{ padding: '12px' }}
                />
              </div>
              <p className="mt-3 font-semibold text-gray-900 text-sm sm:text-base">{s.label}</p>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-center">
          <Link
            href="/services"
            className="text-[var(--color-primary)] font-medium hover:underline text-sm sm:text-base"
          >
            View all services →
          </Link>
        </p>
      </div>
    </section>
  );
}
