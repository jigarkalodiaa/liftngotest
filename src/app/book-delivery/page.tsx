import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import TrackedLink from '@/components/TrackedLink';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';

const PATH = ROUTES.BOOK_DELIVERY;
const PAGE_URL = `${SITE_URL}${PATH}`;
const PAGE_TITLE = 'Book Delivery | Goods Transport & Hyperlocal Logistics — Liftngo';
const PAGE_DESCRIPTION =
  'Book goods transport near me in minutes: enter pickup and drop on Liftngo, compare walk / 2W / 3W / 4W options, and lock an upfront estimate. Same day delivery when the lane allows—ideal for B2B logistics India and EV cargo delivery routes.';

export const metadata = generatePageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PATH,
  keywords: [
    'goods transport near me',
    'book mini truck online',
    'hyperlocal delivery service',
    'B2B logistics India',
    'EV cargo delivery',
    'same day delivery',
  ],
});

export default function BookDeliveryPage() {
  return (
    <ContentLayout>
      <JsonLd
        data={buildWebPageJsonLd({
          pageUrl: PAGE_URL,
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          breadcrumb: [
            { name: 'Home', url: SITE_URL },
            { name: 'Book delivery', url: PAGE_URL },
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
            <li className="text-gray-900 font-medium">Book delivery</li>
          </ol>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Book delivery in three steps</h1>
        <ol className="mt-8 space-y-6 list-decimal pl-5 text-gray-700">
          <li>
            <strong className="text-gray-900">Tell us where</strong> — pickup and drop (add stops if needed).
          </li>
          <li>
            <strong className="text-gray-900">Pick a vehicle</strong> — walk, bike, three-wheel cargo, or four-wheel mini truck; we
            surface <strong className="text-gray-900">EV cargo delivery</strong> when it fits the lane.
          </li>
          <li>
            <strong className="text-gray-900">Confirm the fare</strong> — pay as guided in-app; track handoff like a logistics partner,
            not a passenger ride.
          </li>
        </ol>
        <p className="mt-8 text-gray-600 leading-relaxed">
          Need context on <Link href={ROUTES.LOGISTICS_KHATU} className="font-medium text-[var(--color-primary)] hover:underline">logistics in Khatu</Link>
          {' '}or{' '}
          <Link href={ROUTES.B2B_TRANSPORT} className="font-medium text-[var(--color-primary)] hover:underline">B2B transport</Link>
          ? Those guides link back here when you&apos;re ready to book.
        </p>
        <h2 className="mt-12 text-xl font-semibold text-gray-900">Who books goods transport on Liftngo</h2>
        <p className="mt-3 text-gray-600 leading-relaxed">
          Shopkeepers near Khatu Mandir use us for restocks during peak darshan hours; guest-houses move provisions in fewer trips; offices in
          Noida consolidate documents and small electronics with a two-wheeler slot instead of dispatching staff. The platform is built for{' '}
          <strong className="text-gray-800">cargo handoffs</strong>, not commuter rides—so fares, incentives, and support scripts assume you care
          about weight, queue time, and proof of delivery.
        </p>
        <p className="mt-4 text-gray-600 leading-relaxed">
          You can book same-day when the lane has capacity, or line up pickup and drop addresses ahead of a festival weekend. Add intermediate
          stops if you are doing multi-point handoffs (for example, sweets to a counter and printed material to a back office). If your menu or
          catalogue came from our{' '}
          <Link href="/find-restaurant" className="font-medium text-[var(--color-primary)] hover:underline">
            restaurant partners
          </Link>
          , the flow still lands here so a rider matches the shipment your customer expects.
        </p>
        <h2 className="mt-10 text-xl font-semibold text-gray-900">Fair estimates and support</h2>
        <p className="mt-3 text-gray-600 leading-relaxed">
          We show an estimate before you confirm because surprise surcharges destroy trust in logistics. Waiting time, tolls, or oversized
          items may adjust the final amount—those exceptions should be rare and documented in trip notes. If something goes wrong, reach support
          with your booking reference; we route issues to the ops desk that owns the corridor, not a generic chatbot that pretends every city is
          identical.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <TrackedLink
            href={ROUTES.PICKUP_LOCATION}
            trackAs="book_now_click"
            trackSource="book_delivery_start_flow"
            className="inline-flex justify-center rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-sm font-bold text-white hover:opacity-90"
          >
            Start booking
          </TrackedLink>
          <Link
            href="/"
            className="inline-flex justify-center rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Enter pickup on home
          </Link>
        </div>
      </article>
    </ContentLayout>
  );
}
