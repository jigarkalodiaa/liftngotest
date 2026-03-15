'use client';

import Image from 'next/image';

interface FeatureCardProps {
  illustration: string;
  illustrationAlt: string;
  title: string;
  description: string;
}

function FeatureCard({ illustration, illustrationAlt, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-row gap-3 sm:gap-8 lg:gap-10 items-center text-left">
      {/* Left: illustration on light peach/orange organic blob */}
      <div className="flex-shrink-0">
        <div
          className="relative w-20 h-20 sm:w-40 sm:h-40 lg:w-44 lg:h-44 flex items-center justify-center p-2 sm:p-4 bg-[var(--landing-orange)]/15"
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

      {/* Right: heading + description, left-aligned */}
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
    illustration: '/icons/parcel.png',
    illustrationAlt: 'Parcel delivery – book and track rides with LiftnGo',
    title: 'Experience the Liftngo',
    description:
      'Book rides in seconds, track in real-time, and travel comfortably with verified drivers at affordable fares.',
  },
  {
    illustration: '/icons/phone.png',
    illustrationAlt: 'LiftnGo app for customers and drivers',
    title: 'Get the Liftngo App',
    description:
      'Seamless for customers & drivers. Install the app today and unlock smart earnings.',
  },
  {
    illustration: '/icons/scooter.png',
    illustrationAlt: 'Become a driver partner with LiftnGo',
    title: 'Become a driver',
    description:
      'Start earning with Liftngo. Flexible hours, instant payouts, and complete ride control.',
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="w-full py-12 lg:py-16 xl:py-20 bg-white"
      aria-labelledby="features-heading"
    >
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-10">
        <h2 id="features-heading" className="text-center text-2xl sm:text-3xl xl:text-4xl font-bold text-gray-900 mb-10 lg:mb-14">
          How it Works
        </h2>
        <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 lg:space-y-14">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
