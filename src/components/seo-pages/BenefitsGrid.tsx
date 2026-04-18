import { LucideIcon } from 'lucide-react';

export interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface BenefitsGridProps {
  title: string;
  subtitle?: string;
  benefits: BenefitItem[];
  columns?: 2 | 3 | 4;
  accentColor?: string;
  bgColor?: string;
}

export default function BenefitsGrid({
  title,
  subtitle,
  benefits,
  columns = 3,
  accentColor = 'bg-purple-100 text-purple-600',
  bgColor = 'bg-white',
}: BenefitsGridProps) {
  const gridCols = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className={bgColor}>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-4 text-gray-600">{subtitle}</p>}
        </div>
        <div className={`mt-12 grid gap-8 ${gridCols[columns]}`}>
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${accentColor}`}>
                <benefit.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{benefit.title}</h3>
              <p className="mt-2 text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
