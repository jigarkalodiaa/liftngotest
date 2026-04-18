import { SeoPageBenefit } from '../types';
import { getIcon } from '../utils/iconMap';
import { Section, Heading, Grid } from '@/components/ui';

interface SeoBenefitsProps {
  benefits: SeoPageBenefit[];
  primaryColor: string;
}

export function SeoBenefits({ benefits, primaryColor }: SeoBenefitsProps) {
  return (
    <Section>
      <Heading center>Key Benefits</Heading>
      <Grid cols={3} gap="lg" className="mt-12">
        {benefits.map((benefit) => {
          const BenefitIcon = getIcon(benefit.icon);
          return (
            <div
              key={benefit.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-${primaryColor}-100 text-${primaryColor}-600`}>
                <BenefitIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{benefit.title}</h3>
              <p className="mt-2 text-gray-600">{benefit.description}</p>
            </div>
          );
        })}
      </Grid>
    </Section>
  );
}
