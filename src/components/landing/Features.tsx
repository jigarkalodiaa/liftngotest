import Image from 'next/image';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  iconBg?: string;
}

function FeatureCard({ icon, title, description, iconBg = 'bg-gray-100' }: FeatureCardProps) {
  return (
    <div className="flex gap-4 p-0">
      <div
        className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 ${iconBg} rounded-2xl flex items-center justify-center`}
      >
        <Image src={icon} alt={title} width={32} height={32} className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

const features = [
  {
    icon: '/icons/driver.svg',
    title: 'Become a driver',
    description: 'Join Liftngo as a driver or fleet partner. Earn with flexible hours and verified bookings.',
    iconBg: 'bg-blue-100',
  },
  {
    icon: '/icons/experience.svg',
    title: 'Experience the Liftngo',
    description: 'Book goods transport in seconds, track in real time, and get transparent upfront fares.',
    iconBg: 'bg-amber-50',
  },
  {
    icon: '/icons/app.svg',
    title: 'Get the Liftngo App',
    description: 'For customers and drivers. Book pickups, manage deliveries, all in one place.',
    iconBg: 'bg-blue-50',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-12 lg:py-16 bg-[var(--landing-bg)]">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none space-y-8 lg:space-y-10">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
