'use client';

import Image from '@/components/OptimizedImage';

interface FeatureCardProps {
  illustration: string;
  illustrationAlt: string;
  title: string;
  description: string;
}

function FeatureCard({ illustration, illustrationAlt, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
      <div className="flex-shrink-0">
        <div
          className="relative w-20 h-20 sm:w-40 sm:h-40 lg:w-44 lg:h-44 flex items-center justify-center page-card bg-[var(--landing-orange)]/15"
          style={{
            borderRadius: '60% 40% 50% 50% / 50% 55% 45% 50%',
          }}
        >
          <Image
            src={illustration}
            alt={illustrationAlt}
            width={160}
            height={160}
            className="w-10 h-10 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain"
            loading="lazy"
          />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-3">
          {title}
        </h3>
        <p className="text-gray-600 text-xs sm:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    illustration: '/hero-delivery.svg',
    illustrationAlt: 'Goods delivery — book cargo trips with Liftngo logistics',
    title: 'Book goods deliveries',
    description:
      'Enter pickup and drop, choose 2W–4W cargo, and track handoffs. Built for boxes and commercial loads—not passenger rides.',
  },
  {
    illustration: '/icons/app.svg',
    illustrationAlt: 'Liftngo app for bookings and logistics',
    title: 'Get the Liftngo app',
    description:
      'Customers and driver partners use one platform tuned for goods: fares, vehicle class, and completion-first logistics.',
  },
  {
    illustration: '/icons/driver.svg',
    illustrationAlt: 'Driver partner — delivery and cargo trips',
    title: 'Partner as a driver',
    description:
      'Earn on delivery and cargo trips with transparent payouts. We optimise for completed goods movement, not cab-style ratings.',
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="page-section w-full bg-white"
      aria-labelledby="features-heading"
    >
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <h2 id="features-heading" className="mb-6 text-center text-2xl font-bold text-gray-900 sm:mb-8 sm:text-3xl xl:text-4xl">
          How it Works
        </h2>
        <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
