'use client';

import Image from 'next/image';
import Link from 'next/link';

/** Icons: scooter, rupee (INR), steering wheel — white on orange circle */
const ScooterIcon = () => (
  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M19 10c-.1 0-.2 0-.3-.1l-1.7-1.7-2.5 2.5-1.4-1.4 2.5-2.5-1.6-1.6c-.2-.2-.2-.5 0-.7s.5-.2.7 0l1.9 1.9 2.2-2.2 1.4 1.4-2.2 2.2 1.6 1.6c.2.2.2.5 0 .7-.1.1-.2.1-.4.1zM7 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-3c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1zm10 3c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-3c-.6 0-1 .4-1 1s.4 1 1 1 1-.4 1-1-.4-1-1-1z" />
  </svg>
);
const RupeeIcon = () => (
  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.35" />
    <text
      x="12"
      y="16.25"
      textAnchor="middle"
      fill="currentColor"
      fontSize="12"
      fontWeight="700"
      fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
    >
      ₹
    </text>
  </svg>
);
const SteeringWheelIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 6v4M12 14v4M6 12h4M14 12h4" />
  </svg>
);

const FEATURES = [
  {
    icon: <ScooterIcon />,
    text: 'Your dedicated advisor plans and manages all deliveries no coordination hassles.',
  },
  {
    icon: <RupeeIcon />,
    text: 'GST-compliant billing options for per-trip or monthly bulk payments.',
  },
  {
    icon: <SteeringWheelIcon />,
    text: 'Trained drivers with fleets pre-aligned for bulk orders smooth and on time.',
  },
];

/** Section matching Figma: "Get Quick Rides, Low Fares" — headline, 4-image collage (left portrait, middle 2 squares, right portrait), feature list, Find Restaurant CTA. */
export default function QuickRidesSection() {
  return (
    <section
      id="quick-rides"
      className="w-full py-12 lg:py-16 xl:py-20 bg-[var(--landing-bg)]"
      aria-labelledby="quick-rides-heading"
    >
      <div className="w-full mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <h2 id="quick-rides-heading" className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 lg:mb-12">
          Get Quick Rides,<br />
          Low Fares
        </h2>

        {/* 4-image collage: 3 columns — left tall portrait, middle 2 stacked squares, right tall portrait; max height 178px */}
        <div
          className="
            w-full max-w-4xl mx-auto mb-10 lg:mb-14 min-h-0
            grid grid-cols-3 grid-rows-2 gap-3 sm:gap-4
            aspect-[2.15/1] max-h-[min(52vw,17.5rem)] min-h-[7.5rem]
            sm:max-h-[min(42vw,19rem)] lg:max-h-[20rem]
          "
        >
          {/* Image 1: Large portrait (left) — delivery driver + van + boxes, full height */}
          <div className="relative col-start-1 row-span-2 min-h-0 rounded-2xl overflow-hidden bg-[#4A90E2] shadow-md">
            <Image
              src="/images/quickrides/quickrides-1.png"
              alt="Delivery driver with van and packages"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 33vw, 280px"
            />
          </div>

          {/* Image 2: Small square (top-middle) — scooter + map on phone */}
          <div className="relative col-start-2 row-start-1 min-h-0 rounded-2xl overflow-hidden bg-[#E8E4F4] shadow-md">
            <Image
              src="/images/quickrides/quickrides-2.png"
              alt="Track your ride on the app"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 33vw, 200px"
            />
          </div>

          {/* Image 3: Small square (bottom-middle) — food delivery app */}
          <div className="relative col-start-2 row-start-2 min-h-0 rounded-2xl overflow-hidden bg-[#F5F0F8] shadow-md">
            <Image
              src="/images/quickrides/quickrides-3.png"
              alt="Food delivery app"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 33vw, 200px"
            />
          </div>

          {/* Image 4: Medium portrait (right) — groceries stepping out of phone, full height */}
          <div className="relative col-start-3 row-span-2 min-h-0 rounded-2xl overflow-hidden bg-[#FEF9E7] shadow-md">
            <Image
              src="/images/quickrides/quickrides-4.png"
              alt="Fresh groceries delivery"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 33vw, 280px"
            />
          </div>
        </div>

        {/* Feature list: orange circle + dark grey text, block centered, text left-aligned with icon */}
        <ul className="w-full max-w-2xl mx-auto space-y-5 mb-10 lg:mb-12">
          {FEATURES.map((item, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span
                className="flex-shrink-0 w-11 h-11 rounded-full bg-[var(--landing-orange)] flex items-center justify-center"
                aria-hidden
              >
                {item.icon}
              </span>
              <p className="text-gray-800 text-sm sm:text-base leading-relaxed pt-2.5">
                {item.text}
              </p>
            </li>
          ))}
        </ul>

        {/* CTA: dark purple/indigo button, centered — Figma "Find Restaurant" */}
        <div className="flex justify-center">
          <Link
            href="/find-restaurant"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Find Restaurant
          </Link>
        </div>
      </div>
    </section>
  );
}
