import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import TrackedLink from '@/components/TrackedLink';
import Link from 'next/link';
import FaqAccordionList from '@/components/landing/FaqAccordionList';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { B2B_TRANSPORT_PAGE_FAQS } from '@/data/marketingPageFaqs';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';
import { ArrowRight, Building2, MapPin, Truck, Zap } from 'lucide-react';

const PATH = ROUTES.B2B_TRANSPORT;
const PAGE_URL = `${SITE_URL}${PATH}`;

const PAGE_META_TITLE = 'B2B logistics India | Wholesale & commercial goods transport';
const PAGE_DESCRIPTION =
  'Liftngo B2B logistics for India: dependable goods transport for wholesalers, retailers, and ops teams. Hyperlocal delivery, walk-through 4W modes, EV cargo where efficient, upfront fares. Strong in Noida & Delhi NCR and Khatu Shyam Ji corridors.';

const PAGE_KEYWORDS = [
  'B2B logistics India',
  'commercial goods transport',
  'wholesale delivery platform',
  'hyperlocal delivery service B2B',
  'intra-city freight India',
  'EV cargo delivery business',
  'Noida B2B transport',
  'Delhi NCR goods transport',
  'Khatu Shyam Ji logistics',
  'corporate last mile India',
  'shop to shop delivery India',
  'Liftngo B2B',
  'book tempo for goods online',
] as const;

export const metadata = generatePageMetadata({
  title: PAGE_META_TITLE,
  description: PAGE_DESCRIPTION,
  path: PATH,
  keywords: [...PAGE_KEYWORDS],
});

const faqForLd = B2B_TRANSPORT_PAGE_FAQS.map(({ question, answer }) => ({ question, answer }));

const CARD =
  'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.05] sm:p-6';

export default function B2bTransportPage() {
  return (
    <ContentLayout breadcrumbs={[BREADCRUMB_HOME, { name: 'B2B transport', path: PATH }]} breadcrumbNavVisible={false}>
      <JsonLd
        data={buildWebPageJsonLd({
          pageUrl: PAGE_URL,
          name: `${SITE_NAME} — ${PAGE_META_TITLE}`,
          description: PAGE_DESCRIPTION,
          keywords: [...PAGE_KEYWORDS],
          faqMainEntity: faqForLd,
          breadcrumb: [
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'B2B transport', url: PAGE_URL },
          ],
        })}
      />
      <article className="flex-1">
        <MarketingPageShell
          badge="B2B logistics · Commercial goods · India"
          title={<>Wholesale &amp; ops-first <span className="text-emerald-300">goods transport</span></>}
          lead={PAGE_DESCRIPTION}
          chips={['Upfront fares', 'Noida & NCR depth', 'Khatu corridor expertise', 'EV cargo where it fits']}
          links={[
            { href: ROUTES.BOOK_DELIVERY, label: 'Book delivery' },
            { href: ROUTES.NOIDA_B2B_LOGISTICS, label: 'Noida B2B' },
            { href: ROUTES.KHATU_SHYAM_LOGISTICS, label: 'Khatu corridor' },
            { href: ROUTES.ABOUT_B2B_LOGISTICS, label: 'B2B deep dive' },
            { href: '/contact', label: 'Contact' },
          ]}
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'B2B transport' },
          ]}
        >
          <div className="w-full space-y-8 pb-8 pt-2 sm:space-y-10 sm:pb-12 sm:pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className={CARD}>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Building2 className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h2 className="mt-4 text-base font-bold text-slate-900 sm:text-lg">Built for operations teams</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Repeat routes, predictable handoffs, and vehicle classes from light 2W document runs to{' '}
                  <strong className="font-semibold text-slate-800">EV cargo</strong> and four-wheel mini trucks—without passenger-app
                  confusion.
                </p>
              </div>
              <div className={CARD}>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700">
                  <Zap className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h2 className="mt-4 text-base font-bold text-slate-900 sm:text-lg">Why teams switch from phone tempos</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  One place to request a vehicle, see an estimate, and track completion—with proof-oriented handoffs instead of endless
                  ‘where is my load?’ loops.
                </p>
              </div>
            </div>

            <div className={`${CARD} md:flex md:items-start md:gap-8`}>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-700">
                <MapPin className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-slate-900 sm:text-lg">Lanes we invest in</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  <strong className="text-slate-800">Khatu Shyam Ji</strong> and dense temple-town vendors, plus{' '}
                  <strong className="text-slate-800">Noida &amp; Delhi NCR</strong> wholesale and warehouse rhythms. Electric cargo appears
                  where it genuinely fits; reliability beats buzzwords.
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  Pilot a predictable route—measure punctuality, damage, and dispute rate before you scale. Then use{' '}
                  <Link href={ROUTES.BOOK_DELIVERY} className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline">
                    Book delivery
                  </Link>{' '}
                  to turn estimates into live jobs.
                </p>
              </div>
            </div>

            <section aria-labelledby="b2b-noida">
              <h2 id="b2b-noida" className="text-base font-bold text-slate-900 sm:text-lg">
                Noida &amp; Delhi NCR B2B
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                Missed gate slots cascade to stock-outs—we frame{' '}
                <Link href={ROUTES.NOIDA_B2B_LOGISTICS} className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline">
                  Noida B2B logistics
                </Link>{' '}
                around punctuality and docs. Pair with our{' '}
                <Link href="/blog/b2b-delivery-noida" className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline">
                  B2B delivery guide for Noida
                </Link>{' '}
                when you brief finance.
              </p>
            </section>

            <section aria-labelledby="b2b-khatu">
              <h2 id="b2b-khatu" className="text-base font-bold text-slate-900 sm:text-lg">
                Khatu Shyam Ji hyperlocal
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                Festival demand and narrow corridors need the{' '}
                <Link href={ROUTES.KHATU_SHYAM_LOGISTICS} className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline">
                  dedicated Khatu delivery page
                </Link>
                —same upfront fare discipline, lane-appropriate empathy.
              </p>
            </section>

            <section className={CARD} aria-labelledby="b2b-explore">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[var(--color-primary)]" strokeWidth={1.75} aria-hidden />
                <h2 id="b2b-explore" className="text-base font-bold text-slate-900 sm:text-lg">
                  Explore positioning &amp; services
                </h2>
              </div>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {[
                  { href: ROUTES.ABOUT_B2B_LOGISTICS, label: 'About: B2B logistics', desc: 'Segments & use cases' },
                  { href: ROUTES.LOGISTICS_KHATU, label: 'Logistics in Khatu', desc: 'Corridor overview' },
                  { href: '/services', label: 'Goods transport services', desc: 'Walk through 4W' },
                  { href: ROUTES.BOOK_DELIVERY, label: 'Book delivery', desc: 'Start a trip' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-3 py-3 transition-colors hover:border-[var(--color-primary)]/20 hover:bg-white"
                    >
                      <span>
                        <span className="block text-xs font-bold text-slate-900 sm:text-sm">{item.label}</span>
                        <span className="mt-0.5 block text-[10px] text-slate-500 sm:text-[11px]">{item.desc}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="b2b-faq-heading">
              <h2 id="b2b-faq-heading" className="text-base font-bold text-slate-900 sm:text-lg">
                B2B logistics FAQs
              </h2>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">Structured data on this page mirrors these answers for Google.</p>
              <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
                <FaqAccordionList items={B2B_TRANSPORT_PAGE_FAQS} analyticsScope="b2b_transport_page" />
              </div>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              <TrackedLink
                href={ROUTES.BOOK_DELIVERY}
                trackAs="book_now_click"
                trackSource="b2b_transport_cta_primary"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:opacity-[0.98] active:scale-[0.99] sm:flex-initial sm:min-w-[200px]"
              >
                Start a booking
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
              </TrackedLink>
              <Link
                href={ROUTES.NOIDA_B2B_LOGISTICS}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-slate-200/90 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-md ring-1 ring-slate-900/[0.04] transition-colors hover:bg-slate-50 sm:flex-initial sm:min-w-[200px]"
              >
                Noida &amp; Delhi NCR B2B
              </Link>
              <Link
                href={ROUTES.KHATU_SHYAM_LOGISTICS}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border-2 border-[var(--color-primary)]/30 bg-[var(--color-primary)]/[0.07] px-6 py-3 text-sm font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/12 sm:flex-initial sm:min-w-[200px]"
              >
                Khatu Shyam Ji
              </Link>
              <Link
                href={ROUTES.BECOME_DRIVER}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:flex-initial"
              >
                Become a driver
              </Link>
            </div>
          </div>
        </MarketingPageShell>
      </article>
    </ContentLayout>
  );
}
