import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, BRAND } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';
import { BREADCRUMB_HOME, BREADCRUMB_SERVICES } from '@/lib/breadcrumbsNav';
import Link from 'next/link';
import Image from '@/components/OptimizedImage';

export const metadata = generatePageMetadata({
  title: `Walk Delivery | ${SITE_NAME}`,
  description: `Book walk delivery for small parcels and documents with ${BRAND.name}. Full fleet: 2W, 3W & 4W mini trucks; refrigerated & long-haul coming soon.`,
  path: '/services/walk',
  keywords: [
    'walk delivery',
    'foot delivery',
    'parcel delivery',
    'document delivery',
    'Liftngo walk',
    'goods transport walk',
  ],
});

export default function WalkServicePage() {
  return (
    <ContentLayout
      breadcrumbs={[
        BREADCRUMB_HOME,
        BREADCRUMB_SERVICES,
        { name: 'Walk delivery', path: '/services/walk' },
      ]}
    >
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
                  src="/dashboard/service-walk.png"
                  alt="Walk delivery"
                  fill
                  className="object-contain p-4"
                  sizes="192px"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Walk delivery
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Small parcels and documents delivered on foot. Ideal for short distances, same-building or same-area handoffs, and quick turnaround in dense urban areas.
              </p>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--landing-orange)] mt-0.5">•</span>
                  Best for documents, small packages, and lightweight items
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--landing-orange)] mt-0.5">•</span>
                  Same-day and on-demand booking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--landing-orange)] mt-0.5">•</span>
                  Transparent pricing; track in real time
                </li>
              </ul>
              <Link
                href="/pickup-location"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Book walk delivery
              </Link>
            </div>
          </div>

          <section
            className="mt-14 rounded-2xl border border-gray-200 bg-gray-50/80 p-6 sm:p-8"
            aria-labelledby="walk-delivery-detail"
          >
            <h2 id="walk-delivery-detail" className="text-xl font-semibold text-gray-900">
              Walk delivery for the last few hundred metres
            </h2>
            <div className="mt-4 space-y-4 text-gray-600 leading-relaxed">
              <p>
                Some handoffs never needed a motor at all: same-building notarisation drops, lobby-to-lobby documents inside a campus, or sealed
                envelopes between adjoining markets where kicking over an engine wastes more time than walking. {BRAND.name} lists walk delivery so
                ops teams can book <strong className="text-gray-800">predictable pedestrian legs</strong> with the same tracking hygiene as a
                two-wheel trip—without pretending a scooter improves a fifty-metre staircase climb.
              </p>
              <p>
                We still verify identity, limit payloads to what is safe to carry on foot, and capture proof at the receiver when your business
                requires it. Festival-week crowds near <strong className="text-gray-800">Khatu Shyam Ji</strong> sometimes make walk mode the fastest
                honest option; in <strong className="text-gray-800">Noida IT parks</strong>, security turnstiles favour foot couriers during peak badge
                queues. If the lane opens up later, upgrade the booking to{' '}
                <Link href="/services/2-wheeler" className="font-semibold text-[var(--color-primary)] hover:underline">
                  two-wheeler
                </Link>{' '}
                cargo rather than double-charging for redundant vehicles.
              </p>
              <p>
                Pricing stays small because distance and dwell time stay small—if your requirement actually spans multiple kilometres with
                heavy bags, choose a vehicle class that matches physics. Honest classification keeps customers from surprise cancellations and
                keeps partners from injury claims after optimistic “walk” requests that were really mini-truck work.
              </p>
            </div>
          </section>
        </div>
      </main>
    </ContentLayout>
  );
}
