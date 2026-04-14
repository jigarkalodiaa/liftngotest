'use client';

import { MapPin, Truck, Package, Navigation, CheckCircle } from 'lucide-react';

interface StepProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  isLast?: boolean;
}

function Step({ step, icon, title, description, isLast }: StepProps) {
  return (
    <div className="flex gap-4">
      {/* Step number and line */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--landing-primary)] text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg">
          {step}
        </div>
        {!isLast && (
          <div className="w-0.5 h-full min-h-[40px] bg-gradient-to-b from-[var(--landing-primary)] to-[var(--landing-primary)]/20 my-2" />
        )}
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[var(--landing-orange)]/15 flex items-center justify-center text-[var(--landing-orange)]">
            {icon}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            {title}
          </h3>
        </div>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed pl-13">
          {description}
        </p>
      </div>
    </div>
  );
}

const STEPS = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: 'Enter Pickup & Drop Location',
    description: 'Open the app, enter your pickup address and drop destination. Select the type of goods you want to deliver.',
  },
  {
    icon: <Truck className="w-5 h-5" />,
    title: 'Choose Vehicle & Book',
    description: 'Select from 2-wheeler, 3-wheeler, or 4-wheeler based on your cargo size. Confirm booking and make payment.',
  },
  {
    icon: <Package className="w-5 h-5" />,
    title: 'Driver Picks Up Goods',
    description: 'A nearby driver accepts your request and arrives at pickup location. Hand over your goods securely.',
  },
  {
    icon: <Navigation className="w-5 h-5" />,
    title: 'Track in Real-Time',
    description: 'Track your delivery live on the map. Get updates as driver heads to the drop location.',
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: 'Goods Delivered!',
    description: 'Driver delivers goods at destination. You get confirmation and can rate your delivery experience.',
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
        <h2 id="features-heading" className="mb-2 text-center text-2xl font-bold text-gray-900 sm:mb-3 sm:text-3xl xl:text-4xl">
          How it Works
        </h2>
        <p className="text-center text-gray-500 mb-8 sm:mb-10 text-sm sm:text-base">
          Book your delivery in 5 simple steps
        </p>
        <div className="mx-auto max-w-2xl">
          {STEPS.map((s, i) => (
            <Step 
              key={s.title} 
              step={i + 1} 
              icon={s.icon}
              title={s.title}
              description={s.description}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
