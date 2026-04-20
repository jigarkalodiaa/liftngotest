import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import FaqAccordionList from '@/components/landing/FaqAccordionList';
import { FAQ_ITEMS } from '@/data/faq';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

const PATH = '/faq';
const PAGE_URL = `${SITE_URL}${PATH}`;

export const metadata = generatePageMetadata({
  title: 'Liftngo FAQ — Goods Transport, Delivery Charges, Home Shifting',
  description:
    'Frequently asked questions about Liftngo: goods transport services, delivery charges per km, home shifting, packers and movers, how to book, vehicle types, and customer support.',
  path: PATH,
  keywords: [
    'goods transport FAQ',
    'delivery charges per km',
    'how to book delivery',
    'home shifting services',
    'packers and movers FAQ',
    'same day delivery',
    'mini truck booking',
    'tempo booking',
    'delivery partner',
    'customer care number',
    'Liftngo FAQ',
    'goods transport noida',
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
    <ContentLayout breadcrumbs={[BREADCRUMB_HOME, { name: 'FAQs', path: PATH }]}>
      <JsonLd data={faqJsonLd} />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">
            Everything about booking, corridors (Khatu Shyam Ji · Noida / Delhi NCR), vehicles, food flows, and support—in one
            place.
          </p>
          <div className="mt-8 space-y-4 text-base leading-relaxed text-gray-600">
            <p>
              Liftngo serves two very different geographies with the same product principle:{' '}
              <strong className="text-gray-800">upfront fares, cargo-appropriate vehicles, and completions that protect your brand</strong>.
              Around <strong className="text-gray-800">Khatu Shyam Ji</strong>, we focus on temple-town vendors, restaurant partners, marketplace
              shops, and small businesses that need dependable short hops when footfall spikes. In <strong className="text-gray-800">Noida and Delhi NCR</strong>, we emphasise B2B
              lanes—warehouses, retail, offices—where two-wheeler documents, three-wheeler cartons, or four-wheel mini trucks each have a natural
              fit.
            </p>
            <p>
              Food partners list menus on Liftngo so devotees and travellers can order transparently; WhatsApp often confirms tweaks with the
              kitchen before a rider is booked. Hotel stays and Salasar-corridor rides have their own flows, but every path eventually needs
              accurate pickup and drop on the map. If your question is not covered below, email support with a booking reference so the right
              ops queue can respond. We would rather give a precise answer for your corridor than paste a generic script.
            </p>
          </div>
          <div className="mt-10 sm:mt-12">
            <FaqAccordionList items={FAQ_ITEMS} analyticsScope="faq_page" />
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
