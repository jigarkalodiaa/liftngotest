import { SeoPageStat } from '../types';
import { Container } from '@/components/ui';

interface SeoStatsProps {
  stats: SeoPageStat[];
  accentColor: string;
}

export function SeoStats({ stats, accentColor }: SeoStatsProps) {
  return (
    <section className="border-b border-gray-100 bg-white">
      <Container size="lg" className="py-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`text-3xl font-black ${accentColor} sm:text-4xl`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
