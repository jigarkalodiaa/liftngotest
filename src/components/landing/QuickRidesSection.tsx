'use client';

import Image from 'next/image';
import Link from 'next/link';

const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    text: 'Your dedicated advisor plans and manages all deliveries—no coordination hassles.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      </svg>
    ),
    text: 'GST-compliant billing options for per-trip or monthly bulk payments.',
  },
  {
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4-4m-4 4l4 4" />
      </svg>
    ),
    text: 'Trained drivers with fleets pre-aligned for bulk orders—smooth and on time.',
  },
];

/** Section: "Get Quick Rides, Low Fares" – image collage (1 large + 3 stacked), feature list, Find Restaurant CTA. */
export default function QuickRidesSection() {
  return (
    <section id="quick-rides" className="w-full py-12 lg:py-16 xl:py-20 bg-[var(--landing-bg)]">
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <h2 className="text-center text-2xl sm:text-3xl xl:text-4xl font-bold text-gray-900 mb-8 lg:mb-10">
          <span className="text-gray-800">Get Quick Rides,</span>{' '}
          <span className="text-[var(--landing-orange)]">Low Fares</span>
        </h2>

        {/* Image collage: 1 large left + 3 stacked right — responsive grid */}
        <div
          className="
            w-full max-w-5xl mx-auto mb-10 lg:mb-12
            grid grid-cols-1 md:grid-cols-2 md:grid-rows-3
            gap-3 sm:gap-4
            min-h-[320px] md:min-h-[380px] lg:min-h-[420px]
          "
        >
          {/* Large left image — full height on md+ */}
          <div className="relative w-full aspect-[3/4] md:aspect-auto md:row-span-3 md:min-h-0 rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
            <Image
              src="/dashboard/hero-delivery.png"
              alt="Quick rides delivery"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Right column: 3 stacked images */}
          <div className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-auto md:min-h-0 rounded-2xl overflow-hidden bg-[#E8F4FC] shadow-sm">
            <Image
              src="/icons/quickrides.png"
              alt="Track your ride"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-auto md:min-h-0 rounded-2xl overflow-hidden bg-[#F3E8FC] shadow-sm">
            <Image
              src="/icons/quickrides1.png"
              alt="Quick rides app"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="relative w-full aspect-[4/3] sm:aspect-[3/4] md:aspect-auto md:min-h-0 rounded-2xl overflow-hidden bg-[#FEF9E7] shadow-sm">
            <Image
              src="/icons/fooddelivery.png"
              alt="Food delivery"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Feature list: orange circle icons + dark grey text */}
        <ul className="max-w-2xl mx-auto space-y-4 mb-10">
          {FEATURES.map((item, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--landing-orange)] flex items-center justify-center text-white">
                {item.icon}
              </span>
              <p className="text-gray-800 text-sm sm:text-base leading-relaxed pt-2">{item.text}</p>
            </li>
          ))}
        </ul>

        {/* CTA: dark purple button, centered */}
        <div className="flex justify-center">
          <Link
            href="/pickup-location"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Find Routes!
          </Link>
        </div>
      </div>
    </section>
  );
}
