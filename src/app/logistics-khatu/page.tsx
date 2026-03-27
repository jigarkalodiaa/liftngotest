import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import TrackedLink from '@/components/TrackedLink';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';

const PATH = ROUTES.LOGISTICS_KHATU;
const PAGE_URL = `${SITE_URL}${PATH}`;
const PAGE_TITLE = 'Logistics in Khatu | B2B Goods Transport & EV Cargo — Liftngo';
const PAGE_DESCRIPTION =
  'Liftngo offers logistics in Khatu, Rajasthan: hyperlocal B2B goods transport, affordable mini-truck and 3W cargo, EV delivery on suitable lanes, and same-day runs for shops and wholesalers near Khatu Shyam Ji.';

const LOCAL_FAQ = [
  {
    question: 'Do you operate logistics in Khatu for businesses?',
    answer:
      'Yes. Liftngo supports shops, guest houses, dharamshalas, and wholesalers around Khatu with recurring pickups and on-demand cargo—walk through 4W EV/fuel vehicles matched to your corridor.',
  },
  {
    question: 'Can I book goods transport near Khatu online?',
    answer:
      'Use our book flow on liftngo.com: enter pickup and drop, choose vehicle class, and confirm an upfront estimate before a driver is assigned.',
  },
];

export const metadata = generatePageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PATH,
  keywords: [
    'logistics in Khatu',
    'goods transport near me',
    'B2B logistics India',
    'hyperlocal delivery service',
    'EV cargo delivery',
    'Khatu Shyam Ji delivery',
    'same day delivery Rajasthan',
  ],
});

export default function LogisticsKhatuPage() {
  return (
    <ContentLayout>
      <JsonLd
        data={buildWebPageJsonLd({
          pageUrl: PAGE_URL,
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          breadcrumb: [
            { name: 'Home', url: SITE_URL },
            { name: 'Logistics in Khatu', url: PAGE_URL },
          ],
          faqMainEntity: LOCAL_FAQ,
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
            <li className="text-gray-900 font-medium">Logistics in Khatu</li>
          </ol>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          B2B logistics in Khatu &amp; hyperlocal goods transport
        </h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">{PAGE_DESCRIPTION}</p>
        <h2 className="mt-10 text-xl font-semibold text-gray-900">Why businesses use Liftngo here</h2>
        <ul className="mt-3 list-disc pl-5 text-gray-600 space-y-2">
          <li>
            <strong className="text-gray-800">Affordable goods transport</strong> with upfront pricing tied to distance and demand.
          </li>
          <li>
            <strong className="text-gray-800">EV cargo delivery</strong> and CNG/diesel/petrol options selected for the lane.
          </li>
          <li>
            <strong className="text-gray-800">Same day delivery</strong> on many intra-city and dense temple-zone corridors.
          </li>
        </ul>
        <h2 className="mt-10 text-xl font-semibold text-gray-900">Related pages</h2>
        <ul className="mt-3 space-y-2 text-[var(--color-primary)] font-medium">
          <li>
            <Link href={ROUTES.KHATU_SHYAM_LOGISTICS} className="hover:underline">
              Khatu Shyam Ji logistics (temple corridor &amp; vendors)
            </Link>
          </li>
          <li>
            <Link href={ROUTES.B2B_TRANSPORT} className="hover:underline">
              B2B transport overview
            </Link>
          </li>
          <li>
            <Link href={ROUTES.NOIDA_B2B_LOGISTICS} className="hover:underline">
              Noida &amp; Delhi NCR B2B logistics
            </Link>
          </li>
          <li>
            <Link href={ROUTES.BOOK_DELIVERY} className="hover:underline">
              Book delivery
            </Link>
          </li>
          <li>
            <Link href={ROUTES.ABOUT_KHATU_SUPPLY_CHAIN} className="hover:underline">
              Khatu supply chain (About)
            </Link>
          </li>
        </ul>
        <div className="mt-12 rounded-2xl bg-[var(--color-primary)] px-6 py-8 text-center text-white shadow-lg">
          <p className="font-semibold text-lg">Ready to move stock or supplies?</p>
          <TrackedLink
            href={ROUTES.BOOK_DELIVERY}
            trackAs="book_now_click"
            trackSource="logistics_khatu_cta"
            className="mt-4 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-bold text-[var(--color-primary)] hover:opacity-95"
          >
            Book delivery
          </TrackedLink>
        </div>
        <section className="mt-14 border-t border-gray-200 pt-10" aria-labelledby="local-faq">
          <h2 id="local-faq" className="text-xl font-semibold text-gray-900">
            FAQ — logistics in Khatu
          </h2>
          <dl className="mt-6 space-y-6">
            {LOCAL_FAQ.map((q) => (
              <div key={q.question}>
                <dt className="font-medium text-gray-900">{q.question}</dt>
                <dd className="mt-2 text-gray-600 text-sm leading-relaxed">{q.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </ContentLayout>
  );
}
