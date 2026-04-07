import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import Link from 'next/link';
import { Clock, FileText, MapPin, Users } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';
import { WHY_LIFTNGO_POINTS, WHY_LIFTNGO_STATS_DISCLOSURE, WHY_LIFTNGO_TRUST_STATS } from '@/data/whyLiftngo';

const PATH = ROUTES.WHY_LIFTNGO;
const PAGE_URL = `${SITE_URL}${PATH}`;

const PAGE_META_TITLE = 'Why Liftngo | Trust, GST & same-day for businesses';
const PAGE_DESCRIPTION =
  'Why businesses choose Liftngo: GST-ready invoicing where supported, same-day targets inside zone and cutoffs, live tracking when the app is on, and dedicated contacts for eligible accounts — with clear terms context.';

const PAGE_KEYWORDS = [
  'why Liftngo',
  'Liftngo B2B trust',
  'GST invoice delivery Noida',
  'same day logistics Delhi NCR',
  'business delivery platform India',
] as const;

const ICONS = [FileText, Clock, MapPin, Users] as const;

export const metadata = generatePageMetadata({
  title: PAGE_META_TITLE,
  description: PAGE_DESCRIPTION,
  path: PATH,
  keywords: [...PAGE_KEYWORDS],
});

export default function WhyLiftngoPage() {
  return (
    <ContentLayout
      breadcrumbs={[BREADCRUMB_HOME, { name: 'Why Liftngo', path: PATH }]}
      breadcrumbNavVisible={false}
    >
      <JsonLd
        data={buildWebPageJsonLd({
          pageUrl: PAGE_URL,
          name: `${SITE_NAME} — ${PAGE_META_TITLE}`,
          description: PAGE_DESCRIPTION,
          keywords: [...PAGE_KEYWORDS],
          breadcrumb: [
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Why Liftngo', url: PAGE_URL },
          ],
        })}
      />
      <article className="flex-1">
        <MarketingPageShell
          badge="For businesses · Noida & beyond"
          title={<>Why businesses choose <span className="text-emerald-300">Liftngo</span></>}
          lead={PAGE_DESCRIPTION}
          chips={['GST where supported', 'Same-day targets', 'Live tracking', 'Account contacts when assigned']}
          links={[
            { href: ROUTES.NOIDA, label: 'Noida hub' },
            { href: ROUTES.BOOK_DELIVERY, label: 'Book delivery' },
            { href: ROUTES.PLANS, label: 'Plans' },
            { href: ROUTES.GROW_WITH_LIFTNGO_BUSINESS_ENQUIRY, label: 'Business enquiry' },
          ]}
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Why Liftngo' },
          ]}
        >
          <div className="w-full space-y-8 pb-8 pt-2 sm:space-y-10 sm:pb-12 sm:pt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {WHY_LIFTNGO_POINTS.map((item, i) => {
                const Icon = ICONS[i] ?? FileText;
                return (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.05] sm:p-6"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                      <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <h2 className="mt-4 text-base font-bold text-slate-900 sm:text-lg">{item.label}</h2>
                    <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{item.sub}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.detail}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.05] sm:p-6">
              <p className="text-center text-xs font-semibold uppercase tracking-wide text-slate-500">At a glance</p>
              <div className="mt-4 grid grid-cols-3 divide-x divide-slate-200/80">
                {WHY_LIFTNGO_TRUST_STATS.map((stat) => (
                  <div key={stat.label} className="px-2 text-center first:pl-0 last:pr-0">
                    <p className="text-lg font-bold tabular-nums text-slate-900 sm:text-xl">{stat.value}</p>
                    <p className="mt-1 text-[10px] leading-tight text-slate-500 sm:text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-xl border border-slate-100 bg-slate-50/90 px-3 py-2.5 text-center text-xs leading-relaxed text-slate-600 sm:text-sm">
                {WHY_LIFTNGO_STATS_DISCLOSURE}
              </p>
            </div>

            <div className="flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:px-6">
              <p className="text-sm text-slate-600">
                Commercial terms, cancellations, and liability limits are in our{' '}
                <Link href="/terms" className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline">
                  Terms of Service
                </Link>
                .
              </p>
              <Link
                href={ROUTES.NOIDA}
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Back to Noida hub
              </Link>
            </div>
          </div>
        </MarketingPageShell>
      </article>
    </ContentLayout>
  );
}
