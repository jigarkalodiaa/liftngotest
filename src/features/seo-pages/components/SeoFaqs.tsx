import { ArrowRight } from 'lucide-react';
import { SeoPageFaq } from '../types';
import { Section, Heading } from '@/components/ui';

interface SeoFaqsProps {
  faqs: SeoPageFaq[];
}

export function SeoFaqs({ faqs }: SeoFaqsProps) {
  return (
    <Section>
      <Heading center>Frequently Asked Questions</Heading>
      <div className="mx-auto mt-8 max-w-4xl space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-xl border border-gray-200 bg-white"
          >
            <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900">
              {faq.question}
              <ArrowRight className="h-5 w-5 rotate-90 transition-transform group-open:rotate-[270deg]" />
            </summary>
            <div className="border-t border-gray-100 px-5 py-4 text-gray-600">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </Section>
  );
}
