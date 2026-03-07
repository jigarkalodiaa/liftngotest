'use client';

import Image from 'next/image';

const SERVICES = [
  { id: 'walk', label: 'Walk', image: '/dashboard/service-walk.png' },
  { id: 'two', label: '2 Wheeler', image: '/dashboard/service-2wheeler.png' },
  { id: 'three', label: '3 Wheeler', image: '/dashboard/service-3wheeler.png' },
];

/** Service section: title + three cards (Walk, 2 Wheeler, 3 Wheeler). */
export default function ServiceSection() {
  return (
    <section id="service" className="py-12 lg:py-16 bg-[var(--landing-bg)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Service</h2>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {SERVICES.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border-2 border-[var(--landing-orange)]/40 bg-[var(--landing-bg)] p-4 sm:p-5 text-center shadow-sm"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
                <Image
                  src={s.image}
                  alt={s.label}
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
              <p className="mt-3 font-semibold text-gray-900 text-sm sm:text-base">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
