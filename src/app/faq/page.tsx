import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import FaqAccordionList from '@/components/landing/FaqAccordionList';
import { FAQ_ITEMS } from '@/data/faq';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

const PATH = '/faq';
const PAGE_URL = `${SITE_URL}${PATH}`;

export const metadata = generatePageMetadata({
  title: `Frequently asked questions | ${SITE_NAME}`,
  description: `Answers about Liftngo hyperlocal logistics, B2B delivery in Noida & Delhi NCR, Khatu Shyam Ji, booking, vehicles, EV cargo, food orders, billing, and support.`,
  path: PATH,
  keywords: [
    'Liftngo FAQ',
    'Liftngo help',
    'B2B logistics questions',
    'Khatu delivery FAQ',
    'Noida cargo booking help',
    'goods transport India FAQ',
  ],
});

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${PAGE_URL}#faqpage`,
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <ContentLayout>
      <JsonLd data={faqJsonLd} />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <nav className="mb-6 text-sm text-gray-600">
            <Link href="/" className="font-medium text-[var(--landing-primary)] hover:underline">
              Home
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-gray-900">FAQs</span>
          </nav>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Everything about booking, corridors (Khatu Shyam Ji · Noida / Delhi NCR), vehicles, food flows, and support—in one
            place.
          </p>
          <div className="mt-10 sm:mt-12">
            <FaqAccordionList items={FAQ_ITEMS} />
          </div>
          <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-[var(--landing-primary)]/15 bg-[var(--landing-bg)]/80 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-gray-800">Ready to move goods or food?</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={ROUTES.BOOK_DELIVERY}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Book delivery
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    </ContentLayout>
  );
}
