import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import { noidaB2bLogisticsVisual } from '@/config/locationPageVisuals';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { buildNoidaB2bLogisticsGraph } from '@/lib/structuredData/locationPages';
import { NOIDA_B2B_LANDING_FAQ } from '@/data/noidaB2bLandingFaq';
import LocationPageCtas from '@/components/marketing/LocationPageCtas';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

const PATH = '/noida-b2b-logistics';
const PAGE_URL = `${SITE_URL}${PATH}`;
const TITLE = 'B2B Logistics in Noida & Delhi NCR | Corporate Delivery — Liftngo';
const DESCRIPTION =
  'B2B logistics Noida and Delhi NCR: dedicated delivery experts, verified vendor network, multi-vehicle booking (2W, 3W, 4W). Corporate delivery solutions for electronics retail, warehousing, and offices. Logistics company Delhi NCR—start on Liftngo.';

export const metadata = generatePageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    'b2b logistics noida',
    'logistics company delhi ncr',
    'corporate delivery solutions',
    'bulk delivery services noida',
    'warehouse logistics delhi ncr',
    'B2B transport Noida',
    'electronics retailer delivery',
    'multi vehicle logistics booking',
    'hyperlocal logistics india',
    'last mile delivery solutions',
    'business logistics platform',
  ],
});

const faqForSchema = [...NOIDA_B2B_LANDING_FAQ].map((x) => ({
  question: x.question,
  answer: x.answer,
}));

export default function NoidaB2bLogisticsPage() {
  return (
    <ContentLayout
      breadcrumbNavVisible={false}
      breadcrumbs={[BREADCRUMB_HOME, { name: 'Noida B2B logistics', path: PATH }]}
    >
      <JsonLd
        data={buildNoidaB2bLogisticsGraph({
          pageUrl: PAGE_URL,
          title: TITLE,
          description: DESCRIPTION,
          faq: faqForSchema,
        })}
      />
      <main className="flex-1">
        <header className="liftngo-brand-mesh relative min-h-[420px] overflow-hidden text-white sm:min-h-[480px]">
          <Image
            src={noidaB2bLogisticsVisual.hero(1920)}
            alt={noidaB2bLogisticsVisual.heroAlt}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/95 via-[#1A1D3A]/82 to-[#2C2D5B]/55"
            aria-hidden
          />
          <div
            className="absolute left-1/4 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-[#2C2D5B]/35 blur-3xl pointer-events-none"
            aria-hidden
          />
          <div
            className="absolute right-0 bottom-0 h-64 w-64 translate-x-1/4 rounded-full bg-[#FF8C00]/25 blur-3xl pointer-events-none"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px] opacity-50 pointer-events-none" aria-hidden />
          <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
            <nav className="mb-6 text-sm text-white/75" aria-label="Breadcrumb">
              <ol className="flex flex-wrap gap-2">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li className="font-medium text-white">Noida B2B logistics</li>
              </ol>
            </nav>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#FFB547]">
              Delhi NCR · Starting from Noida
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem] leading-tight">
              B2B Logistics Solutions in Noida &amp; Delhi NCR
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/88">
              A complete logistics layer for businesses built for your region. Liftngo is growing a{' '}
              <strong className="font-semibold text-white">verified ecosystem</strong> in the National Capital Region: dedicated
              delivery coordination, trusted partners, and one platform for 2-wheeler through 4-wheeler cargo.
            </p>
            <div className="mt-8">
              <LocationPageCtas
                whatsappSource="noida_b2b_hero"
                whatsappPrefill="Hi Liftngo, we need B2B logistics support in Noida / Delhi NCR."
                bookTrackSource="noida_b2b_get_started"
                bookLabel="Get started with Liftngo"
              />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-16">
          <section aria-labelledby="core-offerings">
            <h2 id="core-offerings" className="text-2xl font-bold text-gray-900">
              Core offerings
            </h2>
            <div className="relative mt-6 aspect-[2/1] max-h-64 w-full overflow-hidden rounded-2xl border border-gray-100 shadow-md sm:max-h-72">
              <Image
                src={noidaB2bLogisticsVisual.supporting(1400)}
                alt={noidaB2bLogisticsVisual.supportingAlt}
                fill
                className="object-cover object-center"
                sizes="(max-width: 896px) 100vw, 896px"
                loading="lazy"
              />
            </div>
            <ol className="mt-8 space-y-6">
              <li className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">1. Dedicated delivery expert</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  An accountable coordination layer for recurring lanes—so your team is not chasing ad-hoc drivers on chat during
                  surge.
                </p>
              </li>
              <li className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">2. Verified vendors (Delhi NCR)</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  A curated network of logistics partners appropriate for commercial handoffs—not anonymous gig-only behaviour for
                  heavy cartons.
                </p>
              </li>
              <li className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">3. Community of trusted partners</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Built for repeat routes between warehouses, stores, and offices—the economics that actually work for{' '}
                  <strong className="text-gray-800">corporate delivery solutions</strong>.
                </p>
              </li>
              <li className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">4. Multi-vehicle booking platform</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Book{' '}
                  <Link href="/services/2-wheeler" className="font-medium text-[var(--color-primary)] hover:underline">
                    2-wheeler
                  </Link>
                  ,{' '}
                  <Link href="/services/3-wheeler" className="font-medium text-[var(--color-primary)] hover:underline">
                    3-wheeler cargo
                  </Link>
                  , or{' '}
                  <Link href="/services/4-wheeler" className="font-medium text-[var(--color-primary)] hover:underline">
                    4-wheeler
                  </Link>{' '}
                  from one flow—right-size the vehicle to payload and lane.
                </p>
              </li>
            </ol>
          </section>

          <section className="mt-14" aria-labelledby="use-cases-b2b">
            <h2 id="use-cases-b2b" className="text-2xl font-bold text-gray-900">
              Use cases
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                'Bulk delivery programmes',
                'Daily logistics rhythms',
                'Inventory movement between sites',
                'Store-to-customer handoffs for large items',
              ].map((t) => (
                <li key={t} className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3 text-sm font-medium text-gray-800">
                  {t}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14" aria-labelledby="industries">
            <h2 id="industries" className="text-2xl font-bold text-gray-900">
              Industries we speak fluently
            </h2>
            <ul className="mt-6 space-y-4 text-gray-700">
              <li>
                <strong className="text-gray-900">Electronics &amp; appliance retail</strong>
                <p className="mt-1 text-sm leading-relaxed">
                  Sensitive handoffs, proof-of-delivery discipline, and scheduled runs that match store ops—not consumer food SLAs.
                </p>
              </li>
              <li>
                <strong className="text-gray-900">Retail &amp; distribution</strong>
                <p className="mt-1 text-sm leading-relaxed">
                  Carton-forward thinking: 3W/4W when the lane allows, clear estimates before dispatch.
                </p>
              </li>
              <li>
                <strong className="text-gray-900">Warehousing &amp; offices</strong>
                <p className="mt-1 text-sm leading-relaxed">
                  Internal transfers and last-mile legs from hub to branch, framed as B2B logistics in Noida and the wider NCR.
                </p>
              </li>
            </ul>
          </section>

          <section className="mt-14" aria-labelledby="faq-noida">
            <h2 id="faq-noida" className="text-2xl font-bold text-gray-900">
              FAQ — B2B logistics Noida &amp; Delhi NCR
            </h2>
            <dl className="mt-8 space-y-6">
              {NOIDA_B2B_LANDING_FAQ.map((item) => (
                <div key={item.question} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <dt className="font-semibold text-gray-900">{item.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-gray-600">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-14 rounded-2xl bg-[#1A1D3A] px-6 py-10 text-center text-white">
            <h2 className="text-xl font-bold sm:text-2xl">Ready for a logistics partner—not a one-off tempo?</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/80 sm:text-base">
              Tell us your lane pattern on WhatsApp or start a structured booking online.
            </p>
            <div className="mt-6 flex justify-center">
              <LocationPageCtas
                whatsappSource="noida_b2b_footer"
                whatsappPrefill="We are a business in Noida / Delhi NCR and want to explore Liftngo B2B logistics."
                bookTrackSource="noida_b2b_footer_book"
                bookLabel="Get started with Liftngo"
              />
            </div>
          </section>

          <section className="mt-14 border-t border-gray-200 pt-10">
            <h2 className="text-lg font-semibold text-gray-900">Internal links</h2>
            <ul className="mt-4 space-y-2 text-[var(--color-primary)] font-medium">
              <li>
                <Link href={ROUTES.B2B_TRANSPORT} className="hover:underline">
                  B2B transport overview
                </Link>
              </li>
              <li>
                <Link href="/blog/b2b-logistics-noida-complete-guide-companies" className="hover:underline">
                  Blog: B2B logistics in Noida — complete guide
                </Link>
              </li>
              <li>
                <Link href="/blog/liftngo-logistics-ecosystem-delhi-ncr" className="hover:underline">
                  Blog: Liftngo ecosystem in Delhi NCR
                </Link>
              </li>
              <li>
                <Link href={ROUTES.KHATU_SHYAM_LOGISTICS} className="hover:underline">
                  Khatu Shyam Ji logistics (hyperlocal)
                </Link>
              </li>
              <li>
                <Link href={ROUTES.BOOK_DELIVERY} className="hover:underline">
                  Book delivery
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </ContentLayout>
  );
}
