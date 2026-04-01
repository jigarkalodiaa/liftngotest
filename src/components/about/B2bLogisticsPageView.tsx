import Link from 'next/link';
import { BRAND } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { B2B_LOGISTICS_FAQ } from '@/data/b2bLogisticsSeo';

const BTN_PRIMARY =
  'inline-flex w-full min-h-[48px] items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 sm:w-auto';

const BTN_SECONDARY =
  'inline-flex w-full min-h-[48px] items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-800 shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 sm:w-auto';

const CARD =
  'rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm sm:p-7 transition-shadow hover:shadow-md hover:border-[var(--color-primary)]/15';

const textH1 =
  'text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight';
const textH2 = 'text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl';
const textH3 = 'text-lg font-semibold text-gray-900';
const textLead = 'text-lg font-semibold leading-snug text-gray-900 sm:text-xl';
const textProse = 'text-base leading-relaxed text-gray-600 sm:text-lg';
const textBody = 'text-base leading-relaxed text-gray-600';

const SEGMENTS = [
  {
    title: 'Manufacturers & makers',
    body: 'Move finished goods, samples, or spares to distributors and retailers without turning your team into a dispatch desk.',
    terms: 'intra-city B2B transport, factory-to-market runs',
  },
  {
    title: 'Wholesalers & distributors',
    body: 'Cartons, crates, and bulk replenishment with clear ETAs—ideal for mandi-style lanes and stockist networks.',
    terms: 'wholesale goods delivery, distributor logistics',
  },
  {
    title: 'Shop & business owners',
    body: 'Kirana, specialty retail, and local commerce: inter-store transfers, rush stock, and customer-adjacent drops.',
    terms: 'shop-to-shop delivery, retail logistics',
  },
  {
    title: 'Household & daily supplies',
    body: 'Cleaning goods, packaged foods, personal care, and other household supply categories that need frequent short hauls.',
    terms: 'household supplies delivery, FMCG last mile',
  },
  {
    title: 'Construction & hardware',
    body: 'Bags, fixtures, and bundled material that fit compact electric cargo—without hiring a full-size truck for every hop.',
    terms: 'building material transport, hardware delivery',
  },
  {
    title: 'Events, mandirs & vendors',
    body: 'Temporary peaks—decor, catering inputs, and corridor logistics where reliability matters as much as price.',
    terms: 'event logistics, vendor goods transport',
  },
] as const;

export default function B2bLogisticsPageView() {
  return (
    <article className="flex-1">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8 lg:pt-14">
        <header className="mb-12 max-w-4xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)] sm:text-sm">
            B2B goods transport · Last-mile delivery · Hyperlocal
          </p>
          <h1 className={textH1}>
            B2B logistics &amp; goods delivery for <span className="text-[var(--color-primary)]">every business</span> that moves stock
          </h1>
          <p className={`mt-5 max-w-3xl ${textLead}`}>
            Whether you are a manufacturer, wholesaler, distributor, kirana owner, or a seller of daily household supplies—if you need{' '}
            <strong className="font-semibold text-gray-900">dependable intra-city transport</strong>, you belong on {BRAND.name}.
          </p>
          <p className={`mt-4 max-w-3xl ${textProse}`}>
            {BRAND.name} is built for <strong className="font-semibold text-gray-900">commercial goods movement</strong>: recurring{' '}
            <strong className="font-semibold text-gray-900">B2B delivery</strong>, shop transfers, wholesale drops, and light industrial
            handoffs—not passenger cabs. We combine electric three-wheel cargo and lighter modes with upfront pricing tied to distance and
            demand, so finance and ops can plan—not guess.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={ROUTES.PICKUP_LOCATION} className={BTN_PRIMARY}>
              Book a B2B delivery
            </Link>
            <Link href={ROUTES.ABOUT} className={BTN_SECONDARY}>
              Back to About {BRAND.name}
            </Link>
          </div>
        </header>

        <section className="mb-14 sm:mb-16" aria-labelledby="segments-heading">
          <h2 id="segments-heading" className={`mb-3 ${textH2}`}>
            Who we serve: the full spectrum of B2B
          </h2>
          <p className={`mb-8 max-w-3xl ${textBody}`}>
            Your category is not an edge case—it is the core job. Hyperlocal{' '}
            <strong className="font-semibold text-gray-900">business-to-business delivery</strong> works when every consignment gets the same
            clarity: pickup, route, handoff, proof.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SEGMENTS.map(({ title, body, terms }) => (
              <li key={title} className={CARD}>
                <h3 className={textH3}>{title}</h3>
                <p className={`mt-2 ${textBody}`}>{body}</p>
                <p className="mt-3 text-xs text-gray-500 sm:mt-4">
                  <span className="sr-only">Related terms: </span>
                  {terms}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14 sm:mb-16" aria-labelledby="usecases-heading">
          <h2 id="usecases-heading" className={`mb-6 ${textH2}`}>
            Common B2B use cases we support
          </h2>
          <div className={`grid gap-6 lg:grid-cols-2 ${textBody}`}>
            <ul className="list-inside list-disc space-y-3 rounded-2xl border border-gray-100 bg-[#F8FAFC] p-6 sm:p-8">
              <li>Daily or weekly replenishment between warehouse and outlets</li>
              <li>Manufacturer-to-distributor and distributor-to-retailer runs</li>
              <li>Inter-store stock balancing for retail chains and franchises</li>
              <li>Urgent spare parts, samples, or promotional material</li>
            </ul>
            <ul className="list-inside list-disc space-y-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              <li>Household supply and FMCG cartons on short intra-city legs</li>
              <li>Event and seasonal spikes without committing full-time fleet</li>
              <li>Corridor-heavy zones—markets, mandis, and dense commercial lanes</li>
              <li>Light construction inputs where a compact EV cargo unit is enough</li>
            </ul>
          </div>
        </section>

        <section className="mb-14 sm:mb-16" aria-labelledby="why-heading">
          <h2 id="why-heading" className={`mb-4 ${textH2}`}>
            Why B2B teams choose {BRAND.name}
          </h2>
          <div className={`max-w-3xl space-y-4 ${textProse}`}>
            <p>
              <strong className="font-semibold text-gray-900">Goods-first operations:</strong> bookings are built around what you move and
              when it must arrive—not star ratings for riders.
            </p>
            <p>
              <strong className="font-semibold text-gray-900">Transparent economics:</strong> fares before vehicles roll help you protect
              margin on <strong className="font-semibold text-gray-900">B2B logistics</strong> and wholesale delivery.
            </p>
            <p>
              <strong className="font-semibold text-gray-900">Hyperlocal depth:</strong> we are growing from corridors we understand deeply—
              including <strong className="font-semibold text-gray-900">Khatu and nearby markets</strong>—so repeat lanes feel familiar, not
              experimental.
            </p>
            <p>
              <strong className="font-semibold text-gray-900">Electric cargo where it fits:</strong> right-sized three-wheel EV cargo and
              lighter modes for urban hops and last-mile goods delivery.
            </p>
          </div>
        </section>

        <section className="mb-14 sm:mb-16" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className={`mb-6 ${textH2}`}>
            Frequently asked questions
          </h2>
          <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
            {B2B_LOGISTICS_FAQ.map((item) => (
              <li key={item.question} className="px-5 py-6 sm:px-8 sm:py-7">
                <h3 className={`${textH3}`}>{item.question}</h3>
                <p className={`mt-2 ${textBody}`}>{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-12">
          <h2 className={textH2}>Ready to run your next B2B lane?</h2>
          <p className={`mx-auto mt-4 max-w-2xl ${textProse}`}>
            Start with a single booking or share your recurring pattern—we will meet you where your operations already live.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={ROUTES.PICKUP_LOCATION} className={BTN_PRIMARY}>
              Book now
            </Link>
            <Link href="/services" className={BTN_SECONDARY}>
              Vehicle options
            </Link>
          </div>
        </section>

      </div>
    </article>
  );
}
