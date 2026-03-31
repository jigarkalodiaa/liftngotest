import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, BRAND } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';
import Link from 'next/link';
import Image from '@/components/OptimizedImage';
import { indiaPhotoBangaloreLoadedTruck } from '@/config/indiaLogisticsImages';

export const metadata = generatePageMetadata({
  title: `4 Wheeler & mini truck delivery | ${SITE_NAME}`,
  description: `Book four-wheeler mini truck delivery for bulky goods, pallets, and higher payloads than three-wheel cargo. Intra-city goods transport with ${BRAND.name}. EV, CNG, diesel & petrol fleet where available.`,
  path: '/services/4-wheeler',
  keywords: [
    '4 wheeler delivery',
    'four wheeler goods transport',
    'mini truck booking',
    'mini truck delivery India',
    'local cargo truck',
    'intra city mini truck',
    'bulky goods delivery',
    'Liftngo 4 wheeler',
    'last mile mini truck',
    'commercial goods transport',
  ],
});

export default function FourWheelerServicePage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <Link
            href="/services"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All services
          </Link>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-12">
            <div className="w-full flex-shrink-0 sm:w-48">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src={indiaPhotoBangaloreLoadedTruck(800)}
                  alt="Loaded goods truck on an Indian city road — four-wheeler and mini truck logistics"
                  fill
                  className="object-contain p-4"
                  sizes="192px"
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">4 Wheeler &amp; mini truck delivery</h1>
              <p className="mb-6 text-lg leading-relaxed text-gray-600">
                When cartons turn into pallets—or you need a wider deck and higher payload than a three-wheeler—four-wheeler mini trucks are
                the right step up. {BRAND.name} uses compact four-wheel cargo for intra-city legs, with powertrain options that fit the lane
                (including electric, CNG, diesel, and petrol where available).
              </p>
              <ul className="mb-8 space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--landing-orange)]">•</span>
                  Bulky retail, wholesale, and event loads that need stable flooring and strap points
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--landing-orange)]">•</span>
                  Fewer round trips versus repeated three-wheel runs for the same tonnage
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-[var(--landing-orange)]">•</span>
                  Same booking experience: estimate upfront, cargo-first execution
                </li>
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/pickup-location"
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  Book 4 wheeler delivery
                </Link>
                <Link
                  href="/services/3-wheeler"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-800 hover:bg-gray-50"
                >
                  Compare 3 wheeler
                </Link>
              </div>
            </div>
          </div>

          <section
            className="mt-14 rounded-2xl border border-gray-200 bg-gray-50/80 p-6 sm:p-8"
            aria-labelledby="four-wheeler-detail"
          >
            <h2 id="four-wheeler-detail" className="text-xl font-semibold text-gray-900">
              Mini trucks when stacks, not slogans, drive the decision
            </h2>
            <div className="mt-4 space-y-4 text-gray-600 leading-relaxed">
              <p>
                Four-wheel cargo on {BRAND.name} is for intra-city legs where a wider deck, strap rails, and higher legal payload reduce the
                number of shuttles you pay for. Think wholesale fruit to a retail row, event sets with awkward dimensions, appliance bundles, or
                back-office furniture—loads where a three-wheeler becomes a game of Tetris and breakage risk rises fast.
              </p>
              <p>
                Powertrain availability depends on the lane: <strong className="text-gray-800">EV cargo</strong> slots help quieter corridors and
                clients with sustainability reporting, while CNG, diesel, and petrol vehicles still win on certain gradients and turnaround times.
                We do not pretend every postcode has identical fleet depth; booking surfaces what is realistically assignable with an upfront estimate
                instead of bait-and-switch tariffs after you have promised your customer a truck.
              </p>
              <p>
                For B2B programmes—fixed morning pulls from a warehouse, or evening returns from retail—pair mini-truck bookings with the ops
                contact on our <Link href="/b2b-transport" className="font-semibold text-[var(--color-primary)] hover:underline">B2B transport</Link>{' '}
                page so dispatch, proof of delivery, and escalation paths match your SLA. If today&apos;s shipment is only a few cartons, downshift to{' '}
                <Link href="/services/3-wheeler" className="font-semibold text-[var(--color-primary)] hover:underline">three-wheeler</Link>{' '}
                to avoid burning deck space you are not using.
              </p>
            </div>
          </section>
        </div>
      </main>
    </ContentLayout>
  );
}
