import Link from 'next/link';
import { BRAND } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { THREE_WHEEL_CARGO_FAQ } from '@/data/threeWheelCargoSeo';

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

const WHEN = [
  {
    title: 'Heavier or bulkier than bike-safe',
    body: 'Cartons, sacks, small appliances, bundled material—loads that need a stable bed and proper tie-down, not a pillion box.',
  },
  {
    title: 'Fewer trips, same day',
    body: 'Consolidate multiple two-wheeler runs into one three-wheel trip when the lane and unloading point allow.',
  },
  {
    title: 'Covered cargo & short hops',
    body: 'Last-mile and intra-city legs where electric cargo shines—and where CNG, diesel, or petrol units are dispatched when that is the better operational fit.',
  },
] as const;

export default function ThreeWheelCargoPageView() {
  return (
    <article className="flex-1">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8 lg:pt-14">
        <nav className="mb-8 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="font-medium text-[var(--color-primary)] hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-gray-300">
              /
            </li>
            <li>
              <Link href={ROUTES.ABOUT} className="font-medium text-[var(--color-primary)] hover:underline">
                About
              </Link>
            </li>
            <li aria-hidden className="text-gray-300">
              /
            </li>
            <li className="font-medium text-gray-800">Electric three-wheel cargo</li>
          </ol>
        </nav>

        <header className="mb-12 max-w-4xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)] sm:text-sm">
            Three-wheel cargo · Last mile · EV, CNG, diesel &amp; petrol
          </p>
          <h1 className={textH1}>
            <span className="text-[var(--color-primary)]">Electric three-wheel cargo</span> and fuel options for real-world lanes
          </h1>
          <p className={`mt-5 max-w-3xl ${textLead}`}>
            {BRAND.name} uses <strong className="font-semibold text-gray-900">compact three-wheel cargo</strong> as a workhorse for intra-city
            goods—especially where <strong className="font-semibold text-gray-900">B2B loads</strong> are too big for a two-wheeler but do not
            need a full truck.
          </p>
          <p className={`mt-4 max-w-3xl ${textProse}`}>
            <strong className="font-semibold text-gray-900">Electric cargo</strong> keeps running costs predictable and fits many temple-town and
            urban last-mile corridors. We also run <strong className="font-semibold text-gray-900">CNG, diesel, and petrol</strong> cargo
            three-wheelers when that matches distance, availability, or your lane—so logistics stays practical, not ideological.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/services/3-wheeler" className={BTN_PRIMARY}>
              Three-wheeler service
            </Link>
            <Link href={ROUTES.PICKUP_LOCATION} className={BTN_SECONDARY}>
              Book a load
            </Link>
            <Link href={ROUTES.ABOUT} className={BTN_SECONDARY}>
              Back to About
            </Link>
          </div>
        </header>

        <section className="mb-14 sm:mb-16" aria-labelledby="when-3w">
          <h2 id="when-3w" className={`mb-6 ${textH2}`}>
            When three-wheel cargo is the right call
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {WHEN.map((item) => (
              <li key={item.title} className={CARD}>
                <h3 className={textH3}>{item.title}</h3>
                <p className={`mt-2 ${textBody}`}>{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14 sm:mb-16" aria-labelledby="fleet-mix">
          <h2 id="fleet-mix" className={`mb-4 ${textH2}`}>
            Fleet mix: EV plus conventional fuels
          </h2>
          <div className={`max-w-3xl space-y-4 ${textProse}`}>
            <p>
              Our network is built for <strong className="font-semibold text-gray-900">utilisation and reliability</strong>. That means matching
              the right powertrain to the job: <strong className="font-semibold text-gray-900">electric three-wheel cargo</strong> where charging and
              mileage fit; <strong className="font-semibold text-gray-900">CNG or diesel or petrol</strong> units when the lane, payload, or
              turnaround demands it.
            </p>
            <p>
              You still get the same booking flow, upfront fare estimate, and cargo-first mindset—regardless of which three-wheel class is
              assigned for your trip.
            </p>
          </div>
        </section>

        <section className="mb-14 sm:mb-16" aria-labelledby="faq-3w">
          <h2 id="faq-3w" className={`mb-6 ${textH2}`}>
            Frequently asked questions
          </h2>
          <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
            {THREE_WHEEL_CARGO_FAQ.map((item) => (
              <li key={item.question} className="px-5 py-6 sm:px-8 sm:py-7">
                <h3 className={textH3}>{item.question}</h3>
                <p className={`mt-2 ${textBody}`}>{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-12">
          <h2 className={textH2}>Book three-wheel cargo today</h2>
          <p className={`mx-auto mt-4 max-w-2xl ${textProse}`}>
            Choose three-wheeler in services or jump straight to pickup—assistance is available if you are unsure which mode fits.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href={ROUTES.PICKUP_LOCATION} className={BTN_PRIMARY}>
              Start booking
            </Link>
            <Link href="/services" className={BTN_SECONDARY}>
              All vehicle modes
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
