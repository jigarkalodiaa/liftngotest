import { SeoPageProseSection } from '../types';
import { Section } from '@/components/ui';

interface SeoProseProps {
  sections: SeoPageProseSection[];
}

export function SeoProse({ sections }: SeoProseProps) {
  if (!sections || sections.length === 0) return null;

  return (
    <Section>
      <div className="prose prose-lg mx-auto max-w-4xl">
        {sections.map((section, index) => (
          <div key={index}>
            {section.headingLevel === 2 ? (
              <h2 className="text-2xl font-bold text-gray-900">{section.heading}</h2>
            ) : (
              <h3 className="text-xl font-bold text-gray-900">{section.heading}</h3>
            )}
            {section.content && <p>{section.content}</p>}
            {section.list && (
              <ul>
                {section.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
