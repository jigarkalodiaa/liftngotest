import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import TrackedLink from '@/components/TrackedLink';
import Link from 'next/link';
import FaqAccordionList from '@/components/landing/FaqAccordionList';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { B2B_TRANSPORT_PAGE_FAQS } from '@/data/marketingPageFaqs';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

const PATH = ROUTES.B2B_TRANSPORT;
const PAGE_URL = `${SITE_URL}${PATH}`;
/** Document title base; layout template appends `| ${SITE_NAME}` (~60 chars total). */
const PAGE_META_TITLE = 'B2B logistics India | Wholesale & commercial transport';
const PAGE_DESCRIPTION =
  'Liftngo is built for B2B logistics India: dependable goods transport for wholesalers, retailers, and ops teams. Hyperlocal delivery service with walk-through-4W modes, EV cargo delivery where efficient, and upfront fares for every leg.';

export const metadata = generatePageMetadata({
  title: PAGE_META_TITLE,
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

const faqForLd = B2B_TRANSPORT_PAGE_FAQS.map(({ question, answer }) => ({ question, answer }));

export default function B2bTransportPage() {
  return (
    <ContentLayout
      breadcrumbs={[BREADCRUMB_HOME, { name: 'B2B transport', path: PATH }]}
    >
      <JsonLd
        data={buildWebPageJsonLd({
          pageUrl: PAGE_URL,
          name: `${PAGE_META_TITLE} | ${SITE_NAME}`,
          description: PAGE_DESCRIPTION,
          faqMainEntity: faqForLd,
        })}
      />
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          B2B logistics India &amp; affordable goods transport
        </h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">{PAGE_DESCRIPTION}</p>
        <h2 className="mt-10 text-xl font-semibold text-gray-900">Built for operations teams</h2>
        <p className="mt-3 text-gray-600 leading-relaxed">
          Repeat routes, predictable handoffs, and vehicle classes that match payload—from light documents on two-wheelers to{' '}
          <strong className="text-gray-800">EV cargo delivery</strong> and four-wheel mini trucks for denser loads.
        </p>
        <h2 className="mt-10 text-xl font-semibold text-gray-900">Why teams choose Liftngo for B2B legs</h2>
        <p className="mt-3 text-gray-600 leading-relaxed">
          Wholesale and retail chains often move dozens of small trips every week. Phone-based “tempo booking” breaks down when contacts
          are busy, lanes are congested, or proof of delivery is missing. Liftngo standardises the same flow your ops desk already wants:
          a single place to request a vehicle, see an estimate, and track completion—without mixing passenger-style ride jargon with cargo
          work.
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed">
          We focus on two dense geographies today: <strong className="text-gray-800">hyperlocal goods corridors around Khatu Shyam Ji</strong>{' '}
          (temple-town vendors, prasad partners, food outlets, and small businesses) and{' '}
          <strong className="text-gray-800">B2B-oriented logistics in Noida and wider Delhi NCR</strong>, where multi-stop and recurring lanes
          matter more than nationwide coverage claims. Electric three- and four-wheel cargo appears on routes where it genuinely fits;
          otherwise we prioritise reliability and clear communication over buzzwords.
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed">
          If you are evaluating a partner for pilot lanes, start with a predictable route—same pickup cluster, same drop window—and measure
          punctuality, damage rates, and how often you re-book without disputes. Those metrics matter more than a glossy tariff grid that
          hides surge or waiting charges. When you are ready, use{' '}
          <Link href={ROUTES.BOOK_DELIVERY} className="font-medium text-[var(--color-primary)] hover:underline">
            Book delivery
          </Link>{' '}
          to turn the estimate into a live job, or read our about pages for deeper positioning on EV cargo and supply-chain realities.
        </p>
        <h2 className="mt-12 text-xl font-semibold text-gray-900">Planning lanes in Noida and Delhi NCR</h2>
        <p className="mt-3 text-gray-600 leading-relaxed">
          Warehouse-to-store rhythms in <strong className="text-gray-800">Noida</strong> and the broader{' '}
          <strong className="text-gray-800">Delhi NCR</strong> market punish vague dispatch: a missed gate slot ripples into stock-outs and
          customer apologies. Liftngo prioritises{' '}
          <Link href={ROUTES.NOIDA_B2B_LOGISTICS} className="font-medium text-[var(--color-primary)] hover:underline">
            corporate and wholesale delivery positioning for Noida B2B logistics
          </Link>
          —so your team benchmarks punctuality and documentation, not just “cheapest tempo quote of the day.” Pair that with{' '}
          <Link href="/blog/b2b-delivery-noida" className="font-medium text-[var(--color-primary)] hover:underline">
            our guide to B2B delivery patterns around Noida
          </Link>{' '}
          when you brief finance.
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Hyperlocal <strong className="text-gray-800">Khatu Shyam Ji</strong> runs differ: festival demand, narrow corridors, and food
          supply peaks need a{' '}
          <Link href={ROUTES.KHATU_SHYAM_LOGISTICS} className="font-medium text-[var(--color-primary)] hover:underline">
            dedicated Khatu delivery and goods transport page
          </Link>
          , not a copy-pasted metro script. The product still rewards completion and upfront fares—only the lane empathy changes.
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
              Logistics in Khatu overview
            </Link>
          </li>
          <li>
            <Link href="/services" className="hover:underline">
              View goods transport services (walk through 4W)
            </Link>
          </li>
          <li>
            <Link href={ROUTES.BOOK_DELIVERY} className="hover:underline">
              Step-by-step book delivery
            </Link>
          </li>
        </ul>

        <section className="mt-14" aria-labelledby="b2b-faq-heading">
          <h2 id="b2b-faq-heading" className="text-xl font-semibold text-gray-900">
            B2B logistics FAQs
          </h2>
          <p className="mt-2 text-sm text-gray-600">Also included as FAQ structured data on this page for search.</p>
          <div className="mt-6 max-w-2xl">
            <FaqAccordionList items={B2B_TRANSPORT_PAGE_FAQS} />
          </div>
        </section>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          <TrackedLink
            href={ROUTES.BOOK_DELIVERY}
            trackAs="book_now_click"
            trackSource="b2b_transport_cta_primary"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white hover:opacity-90"
          >
            Start a booking
          </TrackedLink>
          <Link
            href={ROUTES.NOIDA_B2B_LOGISTICS}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            View B2B logistics in Noida &amp; Delhi NCR
          </Link>
          <Link
            href={ROUTES.KHATU_SHYAM_LOGISTICS}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--color-primary)]/35 bg-[var(--color-primary)]/8 px-6 py-3 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/15"
          >
            Check Khatu Shyam Ji delivery
          </Link>
          <Link
            href={ROUTES.BECOME_DRIVER}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Become a driver
          </Link>
        </div>
      </article>
    </ContentLayout>
  );
}
