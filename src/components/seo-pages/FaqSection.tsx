import { ArrowRight } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSectionProps {
  title?: string;
  faqs: FaqItem[];
  bgColor?: string;
}

export default function FaqSection({
  title = 'Frequently Asked Questions',
  faqs,
  bgColor = 'bg-white',
}: FaqSectionProps) {
  return (
    <section className={bgColor}>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          {title}
        </h2>
        <div className="space-y-4">
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
      </div>
    </section>
  );
}
