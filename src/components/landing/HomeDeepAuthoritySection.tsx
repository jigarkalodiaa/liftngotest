import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { SITE_NAME } from '@/lib/site';

/**
 * Crawlable authority copy for the homepage (sitelinks / topical depth).
 * Single section; H1 remains on Hero. Keeps existing layout import order stable.
 */
export default function HomeDeepAuthoritySection() {
  return (
    <section
      className="page-section border-y border-[var(--landing-primary)]/10 bg-white"
      aria-labelledby="home-authority-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 id="home-authority-heading" className="text-pretty text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Why businesses choose {SITE_NAME} for goods transport
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-700 sm:text-lg">
          {SITE_NAME} is built around <strong className="font-semibold text-gray-900">intra-city cargo</strong>, not passenger
          detours. Whether you restock a shop in{' '}
          <strong className="font-semibold text-gray-900">Khatu Shyam Ji</strong>, run documents between towers in{' '}
          <strong className="font-semibold text-gray-900">Noida</strong>, or coordinate wholesale drops across{' '}
          <strong className="font-semibold text-gray-900">Delhi NCR</strong>, the same idea applies: pick a vehicle class that matches
          weight and lane reality, see an estimate before you commit, and complete with handoff discipline your ops team can defend in an
          audit.
        </p>

        <h3 className="mt-10 text-lg font-semibold text-gray-900 sm:text-xl">Hyperlocal delivery service in Khatu</h3>
        <p className="mt-3 text-base leading-relaxed text-gray-700">
          Temple-town density means short trips still fail when everyone phones the same rider. A structured{' '}
          <Link href={ROUTES.KHATU_SHYAM_LOGISTICS} className="font-semibold text-[var(--color-primary)] hover:underline">
            delivery service in Khatu Shyam Ji
          </Link>{' '}
          needs patience at narrow gates, predictable vehicle choice, and transparent pricing when festival crowds spike—not a generic
          “national” ETA. Food partners, prasad supply, and retail stockists benefit when{' '}
          <Link href={ROUTES.BOOK_DELIVERY} className="font-semibold text-[var(--color-primary)] hover:underline">
            bookings for goods transport
          </Link>{' '}
          replace endless WhatsApp voice notes.
        </p>

        <h3 className="mt-10 text-lg font-semibold text-gray-900 sm:text-xl">B2B logistics and Noida manufacturing lanes in Delhi NCR</h3>
        <p className="mt-3 text-base leading-relaxed text-gray-700">
          In <strong className="font-semibold text-gray-900">Noida</strong> and the wider <strong className="font-semibold text-gray-900">Delhi NCR</strong> belt, B2B logistics often means supplier-park shuttles, retail backhaul, and dock windows that punish casual dispatch.
          Explore{' '}
          <Link href={ROUTES.NOIDA_B2B_LOGISTICS} className="font-semibold text-[var(--color-primary)] hover:underline">
            B2B logistics for Noida &amp; Delhi NCR
          </Link>{' '}
          and the{' '}
          <Link href={ROUTES.B2B_TRANSPORT} className="font-semibold text-[var(--color-primary)] hover:underline">
            India B2B transport overview
          </Link>{' '}
          before you pilot a lane—right-sizing two-wheel document sprints versus{' '}
          <Link href="/services/4-wheeler" className="font-semibold text-[var(--color-primary)] hover:underline">
            four-wheel mini trucks
          </Link>{' '}
          saves margin on every trip.
        </p>

        <h3 className="mt-10 text-lg font-semibold text-gray-900 sm:text-xl">EV cargo, mode choice, and honest corridors</h3>
        <p className="mt-3 text-base leading-relaxed text-gray-700">
          Electric three-wheel cargo appears when charging and turnaround fit; conventional fuel still wins on some gradients and peak
          loads. Read{' '}
          <Link href="/about/electric-three-wheel-cargo" className="font-semibold text-[var(--color-primary)] hover:underline">
            how we think about EV cargo
          </Link>{' '}
          and browse{' '}
          <Link href="/services" className="font-semibold text-[var(--color-primary)] hover:underline">
            all delivery services (walk through 4W)
          </Link>{' '}
          so your team books the mode the map actually supports—not the buzzword of the week.
        </p>

        <ul className="mt-6 list-disc space-y-4 border-t border-gray-100 pt-6 ps-5 text-gray-700 sm:mt-8 sm:space-y-6 sm:pt-8">
          <li>
            <strong className="text-gray-900">Partners &amp; drivers:</strong>{' '}
            <Link href={ROUTES.BECOME_DRIVER} className="font-semibold text-[var(--color-primary)] hover:underline">
              Become a driver partner
            </Link>{' '}
            or see{' '}
            <Link href="/careers" className="font-semibold text-[var(--color-primary)] hover:underline">
              careers
            </Link>
            .
          </li>
          <li>
            <strong className="text-gray-900">Support:</strong>{' '}
            <Link href={ROUTES.CONTACT} className="font-semibold text-[var(--color-primary)] hover:underline">
              Contact {SITE_NAME}
            </Link>{' '}
            after you skim{' '}
            <Link href="/faq" className="font-semibold text-[var(--color-primary)] hover:underline">
              FAQs
            </Link>
            .
          </li>
          <li>
            <strong className="text-gray-900">Guides:</strong>{' '}
            <Link href="/blog/b2b-delivery-noida" className="font-semibold text-[var(--color-primary)] hover:underline">
              B2B delivery Noida
            </Link>
            ,{' '}
            <Link href="/blog/logistics-khatu-shyam" className="font-semibold text-[var(--color-primary)] hover:underline">
              Khatu Shyam logistics
            </Link>
            ,{' '}
            <Link href="/blog/delivery-cost-noida" className="font-semibold text-[var(--color-primary)] hover:underline">
              delivery cost in Noida
            </Link>
            .
          </li>
        </ul>

        <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-6">
          <Link
            href={ROUTES.B2B_TRANSPORT}
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-center text-sm font-semibold text-white hover:opacity-90"
          >
            Explore B2B services in Noida &amp; NCR
          </Link>
          <Link
            href={ROUTES.KHATU_SHYAM_LOGISTICS}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/8 px-6 py-3 text-center text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/15"
          >
            Check Khatu Shyam Ji delivery
          </Link>
          <Link
            href={ROUTES.BECOME_DRIVER}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Become a driver
          </Link>
        </div>
      </div>
    </section>
  );
}
