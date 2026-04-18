import { SeoPageCoverageArea } from '../types';
import { Section, Heading } from '@/components/ui';

interface SeoCoverageProps {
  areas: SeoPageCoverageArea[];
  city?: string;
  primaryColor: string;
}

export function SeoCoverage({ areas, city, primaryColor }: SeoCoverageProps) {
  if (!areas || areas.length === 0) return null;

  return (
    <Section bg="gray">
      <div className="text-center">
        <Heading center>Coverage Areas</Heading>
        {city && <p className="mt-4 text-gray-600">Delivery times from {city}</p>}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <div
            key={area.area}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4"
          >
            <span className="font-medium text-gray-900">{area.area}</span>
            <span className={`rounded-full bg-${primaryColor}-100 px-3 py-1 text-sm font-bold text-${primaryColor}-700`}>
              {area.time}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}
