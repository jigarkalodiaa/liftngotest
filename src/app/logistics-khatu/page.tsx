import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import LocationPageCtas from '@/components/marketing/LocationPageCtas';
import TrackedLink from '@/components/TrackedLink';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

const PATH = ROUTES.LOGISTICS_KHATU;
const PAGE_URL = `${SITE_URL}${PATH}`;
const PAGE_TITLE = 'Logistics in Khatu | B2B Goods Transport & EV Cargo — Liftngo';
const PAGE_DESCRIPTION =
  'Liftngo offers logistics in Khatu, Rajasthan: hyperlocal B2B goods transport, affordable mini-truck and 3W cargo, EV delivery on suitable lanes, and same-day runs for shops and wholesalers near Khatu Shyam Ji.';

const PAGE_KEYWORDS = [
  'logistics in Khatu',
  'goods transport near me',
  'B2B logistics India',
  'hyperlocal delivery service',
  'EV cargo delivery',
  'Khatu Shyam Ji delivery',
  'same day delivery Rajasthan',
] as const;

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
  keywords: [...PAGE_KEYWORDS],
});

export default function LogisticsKhatuPage() {
  return (
    <ContentLayout
      breadcrumbs={[BREADCRUMB_HOME, { name: 'Logistics in Khatu', path: PATH }]}
      breadcrumbNavVisible={false}
    >
      <JsonLd
        data={buildWebPageJsonLd({
          pageUrl: PAGE_URL,
          name: `${SITE_NAME} — ${PAGE_TITLE}`,
          description: PAGE_DESCRIPTION,
          keywords: [...PAGE_KEYWORDS],
          faqMainEntity: LOCAL_FAQ,
          breadcrumb: [
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Logistics in Khatu', url: PAGE_URL },
          ],
        })}
      />
      <article className="flex-1">
        <MarketingPageShell
          badge="Khatu · Rajasthan · B2B goods"
          title={<>B2B logistics in Khatu &amp; hyperlocal goods transport</>}
          lead={PAGE_DESCRIPTION}
          chips={['EV & fuel 4W', '3W cargo', 'Same-day on many legs', 'Near Khatu Shyam Ji']}
          links={[
            { href: ROUTES.BOOK_DELIVERY, label: 'Book delivery' },
            { href: ROUTES.KHATU_SHYAM_LOGISTICS, label: 'Khatu Shyam Ji corridor' },
            { href: ROUTES.NOIDA_B2B_LOGISTICS, label: 'Noida B2B' },
            { href: ROUTES.B2B_TRANSPORT, label: 'B2B transport' },
            { href: '/contact', label: 'Contact' },
          ]}
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Logistics in Khatu' },
          ]}
          heroActions={
            <LocationPageCtas
              bookTrackSource="logistics_khatu_hero_book"
              contactTrackSource="logistics_khatu_hero_contact"
              secondaryOnDark
            />
          }
        >
          <div className="w-full space-y-10 pb-8 pt-2 sm:space-y-12 sm:pb-12 sm:pt-4">
            <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.05] sm:p-8">
              <h2 className="text-xl font-bold text-slate-900">Why businesses use Liftngo here</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600 sm:text-[0.9375rem]">
                <li>
                  <strong className="font-semibold text-slate-800">Affordable goods transport</strong> with upfront pricing tied to distance and demand.
                </li>
                <li>
                  <strong className="font-semibold text-slate-800">EV cargo delivery</strong> and CNG/diesel/petrol options selected for the lane.
                </li>
                <li>
                  <strong className="font-semibold text-slate-800">Same day delivery</strong> on many intra-city and dense temple-zone corridors.
                </li>
              </ul>
              <h2 className="mt-10 text-lg font-bold text-slate-900">Related pages</h2>
              <ul className="mt-4 space-y-2 text-sm font-medium text-[var(--color-primary)]">
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
                  <Link href={ROUTES.ABOUT_KHATU_SUPPLY_CHAIN} className="hover:underline">
                    Khatu supply chain (About)
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mx-auto max-w-3xl rounded-2xl bg-[var(--color-primary)] px-6 py-8 text-center text-white shadow-lg">
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

            <section className="mx-auto max-w-3xl border-t border-slate-200 pt-10" aria-labelledby="local-faq">
              <h2 id="local-faq" className="text-xl font-bold text-slate-900">
                FAQ — logistics in Khatu
              </h2>
              <dl className="mt-6 space-y-6">
                {LOCAL_FAQ.map((q) => (
                  <div key={q.question}>
                    <dt className="font-medium text-slate-900">{q.question}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-slate-600">{q.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </MarketingPageShell>
      </article>
    </ContentLayout>
  );
}
