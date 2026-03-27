import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import TrackedLink from '@/components/TrackedLink';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';

const PATH = ROUTES.B2B_TRANSPORT;
const PAGE_URL = `${SITE_URL}${PATH}`;
const PAGE_TITLE = 'B2B Logistics India | Wholesale & Commercial Goods Transport — Liftngo';
const PAGE_DESCRIPTION =
  'Liftngo is built for B2B logistics India: dependable goods transport for wholesalers, retailers, and ops teams. Hyperlocal delivery service with walk-through-4W modes, EV cargo delivery where efficient, and upfront fares for every leg.';

export const metadata = generatePageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PATH,
  keywords: [
    'B2B logistics India',
    'goods transport near me',
    'hyperlocal delivery service',
    'EV cargo delivery',
    'commercial cargo booking',
    'wholesale delivery platform',
    'intra-city freight India',
  ],
});

export default function B2bTransportPage() {
  return (
    <ContentLayout>
      <JsonLd
        data={buildWebPageJsonLd({
          pageUrl: PAGE_URL,
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          breadcrumb: [
            { name: 'Home', url: SITE_URL },
            { name: 'B2B transport', url: PAGE_URL },
          ],
        })}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <nav className="text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2">
            <li>
              <Link href="/" className="hover:text-[var(--color-primary)]">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-gray-900 font-medium">B2B transport</li>
          </ol>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          B2B logistics India &amp; affordable goods transport
        </h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">{PAGE_DESCRIPTION}</p>
        <h2 className="mt-10 text-xl font-semibold text-gray-900">Built for operations teams</h2>
        <p className="mt-3 text-gray-600 leading-relaxed">
          Repeat routes, predictable handoffs, and vehicle classes that match payload—from light documents on two-wheelers to{' '}
          <strong className="text-gray-800">EV cargo delivery</strong> and four-wheel mini trucks for denser loads.
        </p>
        <h2 className="mt-10 text-xl font-semibold text-gray-900">Explore more</h2>
        <ul className="mt-3 space-y-2 text-[var(--color-primary)] font-medium">
          <li>
            <Link href={ROUTES.ABOUT_B2B_LOGISTICS} className="hover:underline">
              Deep dive: B2B logistics (About)
            </Link>
          </li>
          <li>
            <Link href={ROUTES.LOGISTICS_KHATU} className="hover:underline">
              Logistics in Khatu
            </Link>
          </li>
          <li>
            <Link href={ROUTES.BOOK_DELIVERY} className="hover:underline">
              How to book delivery
            </Link>
          </li>
        </ul>
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white px-6 py-8 text-center shadow-sm">
          <p className="font-semibold text-gray-900">Move commercial goods this week?</p>
          <TrackedLink
            href={ROUTES.BOOK_DELIVERY}
            trackAs="book_now_click"
            trackSource="b2b_transport_cta"
            className="mt-4 inline-flex rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white hover:opacity-90"
          >
            Start a booking
          </TrackedLink>
        </div>
      </article>
    </ContentLayout>
  );
}
