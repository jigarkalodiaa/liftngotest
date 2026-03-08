'use client';

import Image from 'next/image';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  iconBg?: string;
}

function FeatureCard({ icon, title, description, iconBg = 'bg-gray-100' }: FeatureCardProps) {
  return (
    <div className="flex gap-4 p-0 lg:items-center">
      <div className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center`} style={{ height: 64 }}>
        <Image src={icon} alt="" width={70} height={70} className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    icon: '/icons/scooter.png',
    title: 'Become a driver',
    description:
      'Join LiftnGo as a driver partner and start earning with flexible hours, instant payouts, and complete ride control.',
    iconBg: 'bg-blue-100',
  },
  {
    icon: '/icons/parcel.png',
    title: 'Experience the Liftngo',
    description:
      'Book rides in seconds, track in real time, and travel comfortably with verified drivers at affordable fares.',
    iconBg: 'bg-amber-50',
  },
  {
    icon: '/icons/phone.png',
    title: 'Get the Liftngo App',
    description:
      'Available for customers and drivers. Install the app today and unlock seamless rides and smart earnings.',  
  },
];
export default function Features() {
  return (
    <section id="features" className="py-12 lg:py-16 lg:flex bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none space-y-8 lg:space-y-10">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
