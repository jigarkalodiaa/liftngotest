'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { trackSelectContent } from '@/lib/analytics';

const DEFAULT_FAQS = [
  {
    id: 'what-is-liftngo',
    question: 'What is Liftngo?',
    answer:
      'Liftngo is a logistics and delivery platform that connects customers with reliable riders and vehicles for same-day and scheduled deliveries across cities. Businesses and individuals use it for parcels, food, and multi-stop trips, with transparent pricing and coordinated handoffs.',
  },
  {
    id: 'noida',
    question: 'Is Liftngo available in Noida?',
    answer:
      'Yes. Liftngo serves Noida and nearby NCR areas where partners are active, subject to operational zones. Enter your pickup and drop at checkout to confirm live coverage.',
  },
  {
    id: 'pricing',
    question: 'How much does Liftngo charge?',
    answer:
      'Fares depend on distance, vehicle type, and route factors such as tolls or waiting, all summarized in your quote before you book. You see the full breakdown upfront so there are no surprise platform fees beyond what is shown.',
  },
  {
    id: 'porter',
    question: 'Is Liftngo cheaper than Porter?',
    answer:
      'Rates differ by route, vehicle, and timing, so compare the live quote in each app for your exact pickup and drop. Liftngo emphasizes competitive pricing with a clear fare breakdown so you can choose what fits your shipment.',
  },
  {
    id: 'how-to-book',
    question: 'How to book a delivery on Liftngo?',
    answer:
      'Open the app or site, add pickup and delivery addresses, pick a vehicle, then confirm after reviewing the fare. You can add intermediate stops, schedule a time, and share tracking; complete payment using the method you select at checkout.',
  },
];

function buildFaqJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer.replace(/\s+/g, ' ').trim(),
      },
    })),
  };
}

/**
 * Reusable FAQ accordion with FAQPage JSON-LD (same data source).
 * @param {{ items?: typeof DEFAULT_FAQS, className?: string, id?: string }} props
 */
export default function FAQSection({ items = DEFAULT_FAQS, className = '', id = 'faq-section' }) {
  const [openId, setOpenId] = useState(null);

  const faqJsonLd = useMemo(() => JSON.stringify(buildFaqJsonLd(items)), [items]);

  const toggle = (faqId) => {
    setOpenId((current) => {
      const next = current === faqId ? null : faqId;
      if (next) {
        trackSelectContent('faq_accordion', faqId, { page: id });
      }
      return next;
    });
  };

  return (
    <section id={id} className={`w-full ${className}`.trim()} aria-labelledby={`${id}-heading`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 text-center sm:mb-10">
          <h2 id={`${id}-heading`} className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-sm text-gray-600 sm:text-base">Quick answers about Liftngo deliveries and coverage.</p>
        </header>

        <ul className="flex flex-col gap-3" role="list">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <li key={item.id}>
                <div
                  className={`rounded-2xl border border-gray-200/80 bg-white/80 shadow-sm shadow-gray-200/50 backdrop-blur-sm transition-shadow duration-200 hover:shadow-md hover:shadow-gray-200/60 ${
                    isOpen ? 'ring-1 ring-gray-200' : ''
                  }`}
                >
                  <button
                    type="button"
                    id={`${id}-trigger-${item.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-panel-${item.id}`}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5 sm:py-5 min-h-[52px]"
                    onClick={() => toggle(item.id)}
                  >
                    <span className="text-[15px] font-semibold text-gray-900 sm:text-base">{item.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-gray-500 transition-transform duration-300 ease-out ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                      aria-hidden
                    />
                  </button>
                  <div
                    id={`${id}-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`${id}-trigger-${item.id}`}
                    className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="min-h-0">
                      <p className="border-t border-gray-100 px-4 pb-4 pt-0 text-sm leading-relaxed text-gray-600 sm:px-5 sm:pb-5 sm:text-[15px]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export { DEFAULT_FAQS, buildFaqJsonLd };
