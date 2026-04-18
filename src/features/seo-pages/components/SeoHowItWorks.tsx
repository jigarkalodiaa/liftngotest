import { SeoPageStep } from '../types';
import { Section, Heading } from '@/components/ui';

interface SeoHowItWorksProps {
  steps: SeoPageStep[];
  accentColor: string;
}

export function SeoHowItWorks({ steps, accentColor }: SeoHowItWorksProps) {
  return (
    <Section bg="gray">
      <Heading center>How It Works</Heading>
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.step} className="relative text-center">
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${accentColor} text-2xl font-bold text-white`}>
              {step.step}
            </div>
            <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
            <p className="mt-2 text-gray-600">{step.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
