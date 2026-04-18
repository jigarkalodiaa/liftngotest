import { SeoPageUseCase } from '../types';
import { getIcon } from '../utils/iconMap';
import { Section, Heading, Grid } from '@/components/ui';

interface SeoUseCasesProps {
  useCases: SeoPageUseCase[];
  primaryColor: string;
}

export function SeoUseCases({ useCases, primaryColor }: SeoUseCasesProps) {
  if (!useCases || useCases.length === 0) return null;

  return (
    <Section bg="gray">
      <Heading center>Use Cases</Heading>
      <Grid cols={4} gap="md" className="mt-12">
        {useCases.map((useCase) => {
          const UseCaseIcon = getIcon(useCase.icon);
          return (
            <div
              key={useCase.title}
              className={`rounded-2xl border border-${primaryColor}-100 bg-white p-6 shadow-sm`}
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-${primaryColor}-100 text-${primaryColor}-600`}>
                <UseCaseIcon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{useCase.title}</h3>
              <p className="mt-2 text-gray-600">{useCase.description}</p>
            </div>
          );
        })}
      </Grid>
    </Section>
  );
}
