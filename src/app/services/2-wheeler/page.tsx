import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, BRAND } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';
import Link from 'next/link';
import Image from '@/components/OptimizedImage';

export const metadata = generatePageMetadata({
  title: `2 Wheeler Delivery | ${SITE_NAME}`,
  description: `Book 2 wheeler bike delivery for same-day goods transport with ${BRAND.name}. Also: walk, 3W cargo & 4W mini truck; cold chain & more soon.`,
  path: '/services/2-wheeler',
  keywords: [
    '2 wheeler delivery',
    'bike delivery',
    'scooter delivery',
    'same day delivery',
    'Liftngo two wheeler',
    'motorbike parcel delivery',
  ],
});

export default function TwoWheelerServicePage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-medium mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All services
          </Link>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-start">
            <div className="flex-shrink-0 w-full sm:w-48">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src="/dashboard/service-2wheeler.png"
                  alt="2 Wheeler delivery"
                  fill
                  className="object-contain p-4"
                  sizes="192px"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                2 Wheeler delivery
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Fast, nimble delivery by two-wheeler. Best for medium-sized packages, food, retail orders, and same-day delivery across the city. Our driver partners reach you quickly and reliably.
              </p>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--landing-orange)] mt-0.5">•</span>
                  Ideal for parcels, food delivery, and medium loads
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--landing-orange)] mt-0.5">•</span>
                  Quick pickup and delivery; real-time tracking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--landing-orange)] mt-0.5">•</span>
                  Transparent fares; pay per trip or use plans
                </li>
              </ul>
              <Link
                href="/pickup-location"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Book 2 wheeler delivery
              </Link>
            </div>
          </div>

          <section
            className="mt-14 rounded-2xl border border-gray-200 bg-gray-50/80 p-6 sm:p-8"
            aria-labelledby="two-wheeler-detail"
          >
            <h2 id="two-wheeler-detail" className="text-xl font-semibold text-gray-900">
              When two-wheeler goods delivery makes sense on {BRAND.name}
            </h2>
            <div className="mt-4 space-y-4 text-gray-600 leading-relaxed">
              <p>
                Scooters and motorcycles are not a universal substitute for vans—but they dominate certain lanes. Think medium envelopes,
                single-bag retail, pharma strips, short-run food handoffs, and laptop-sized electronics where parking near a booth matters more
                than deck area. We match those bookings with partners who run <strong className="text-gray-800">cargo-first routines</strong>: insulated
                boxes where needed, rain covers during monsoon bursts, and clear handoff notes so receivers are not guessing which packet belongs
                to which invoice.
              </p>
              <p>
                Dense micro-markets around <strong className="text-gray-800">Khatu Shyam Ji</strong> benefit from two-wheel pacing when cars cannot
                approach a stall; in <strong className="text-gray-800">Noida and Delhi NCR</strong>, offices often prefer a two-wheel slot for
                inter-building document shuttles instead of tying up security approvals for a four-wheeler. If weight, dimensions, or stacked
                cartons exceed what a safe saddle load allows, step up to{' '}
                <Link href="/services/3-wheeler" className="font-semibold text-[var(--color-primary)] hover:underline">
                  three-wheel cargo
                </Link>{' '}
                or{' '}
                <Link href="/services/4-wheeler" className="font-semibold text-[var(--color-primary)] hover:underline">
                  mini truck
                </Link>{' '}
                rather than forcing an unsafe trip.
              </p>
              <p>
                Fares stay visible before confirmation; if waiting time spikes because a counter is slow, that should surface in trip updates
                rather than as a mystery add-on. For recurring legs—same pickup cluster every Tuesday—ask our ops team about B2B pilots so
                incentives align with repeatability, not one-off surge chasing.
              </p>
            </div>
          </section>
        </div>
      </main>
    </ContentLayout>
  );
}
