import Image from 'next/image';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  iconBg?: string;
}

function FeatureCard({ icon, title, description, iconBg = 'bg-orange-100' }: FeatureCardProps) {
  return (
    <div className="flex gap-4 p-6 rounded-2xl hover:bg-gray-50 transition-colors">
      <div className={`flex-shrink-0 w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center`}>
        <Image src={icon} alt={title} width={40} height={40} className="object-contain" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

const features = [
  {
    icon: '/icons/driver.svg',
    title: 'Become a driver partner',
    description: 'Join Liftngo as a driver or fleet partner. Earn with flexible hours, verified bookings, and operational support through our driver network.',
    iconBg: 'bg-orange-100',
  },
  {
    icon: '/icons/experience.svg',
    title: 'Experience Liftngo',
    description: 'Book goods transport in seconds, track deliveries in real time, and get transparent upfront fares with verified drivers.',
    iconBg: 'bg-blue-100',
  },
  {
    icon: '/icons/app.svg',
    title: 'Get the Liftngo app',
    description: 'For customers and drivers. Book pickups, manage deliveries, and access the logistics platform built for local transport.',
    iconBg: 'bg-green-100',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <div className="grid gap-4 lg:gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
