import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import BusinessEnquiryForm from '@/components/marketing/BusinessEnquiryForm';
import RouteOptimizationIntake from '@/components/marketing/RouteOptimizationIntake';
import Link from 'next/link';
import { Check, Package, Shield } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';
import {
  PARTNER_APPLY_NOTE,
  PARTNER_COMPLIANCE_BULLETS,
  PARTNER_EARNINGS_CALLOUT,
  PARTNER_HIGHLIGHT_BULLETS,
  PARTNER_MARKETPLACE_INTRO,
  PARTNER_VALUE_PROPS,
} from '@/data/growWithLiftngo';

const PATH = ROUTES.GROW_WITH_LIFTNGO;
const PAGE_URL = `${SITE_URL}${PATH}`;

const PAGE_META_TITLE = 'Grow with Liftngo | Partners & verified sellers';
const PAGE_DESCRIPTION =
  'Sell on Liftngo as a verified partner: storefront reach, payouts, logistics support where offered, and clear terms. Application-based onboarding for Noida & NCR — submit a business enquiry on this page and we will reach out shortly.';

const PAGE_KEYWORDS = [
  'Liftngo partners',
  'sell on Liftngo',
  'Noida marketplace vendor',
  'verified seller Liftngo',
  'B2B logistics partnership Delhi NCR',
] as const;

const CARD =
  'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.05] sm:p-6';

export const metadata = generatePageMetadata({
  title: PAGE_META_TITLE,
  description: PAGE_DESCRIPTION,
  path: PATH,
  keywords: [...PAGE_KEYWORDS],
});

export default function GrowWithLiftngoPage() {
  return (
    <ContentLayout
      breadcrumbs={[BREADCRUMB_HOME, { name: 'Grow with Liftngo', path: PATH }]}
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
            { name: 'Grow with Liftngo', url: PAGE_URL },
          ],
        })}
      />
      <article className="flex-1">
        <MarketingPageShell
          badge="Partners · Verified sellers"
          title={<>Grow with <span className="text-violet-300">Liftngo</span></>}
          lead={PAGE_DESCRIPTION}
          chips={['Verified onboarding', 'Noida & NCR', 'Storefront & delivery', 'Clear terms']}
          links={[
            { href: ROUTES.GROW_WITH_LIFTNGO_BUSINESS_ENQUIRY, label: 'Business enquiry' },
            { href: ROUTES.NOIDA, label: 'Noida hub' },
            { href: ROUTES.WHY_LIFTNGO, label: 'Why Liftngo' },
            { href: ROUTES.PLANS, label: 'Plans' },
            { href: ROUTES.CONTACT, label: 'Contact' },
          ]}
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Grow with Liftngo' },
          ]}
        >
          <div className="w-full space-y-8 pb-8 pt-2 sm:space-y-10 sm:pb-12 sm:pt-4">
            <BusinessEnquiryForm id="business-enquiry" leadSource="business_enquiry_grow_with_liftngo" />

            <div className={CARD}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/15">
                  <Package className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Sell on Liftngo</h2>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700 sm:text-xs">
                      Verified only
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">Products · Noida &amp; NCR reach</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{PARTNER_MARKETPLACE_INTRO}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PARTNER_VALUE_PROPS.map((v) => (
                  <div key={v.label} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${v.tile}`}>
                    <span className="text-lg" aria-hidden>
                      {v.icon}
                    </span>
                    <span className="text-sm font-medium text-slate-800">{v.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50/90 to-emerald-50/50 px-3 py-2.5 ring-1 ring-emerald-100/50">
                <span className="text-base leading-none" aria-hidden>
                  📈
                </span>
                <p className="text-sm font-semibold text-emerald-950">{PARTNER_EARNINGS_CALLOUT}</p>
              </div>
            </div>

            <div className={`${CARD} border-emerald-100/80 bg-gradient-to-b from-emerald-50/35 to-white shadow-[0_8px_30px_-12px_rgba(5,150,105,0.1)]`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-900/80">What we mean on the dashboard</p>
              <ul className="mt-4 space-y-3">
                {PARTNER_HIGHLIGHT_BULLETS.map((item) => (
                  <li key={item.title} className="flex gap-2 text-sm leading-relaxed text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                    <span>
                      <strong className="font-semibold text-slate-900">{item.title}</strong> — {item.body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={CARD}>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                  <Shield className="h-4 w-4" strokeWidth={2} aria-hidden />
                </span>
                Compliance &amp; policy
              </div>
              <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-slate-600">
                {PARTNER_COMPLIANCE_BULLETS.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400/80" aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2.5 text-sm leading-relaxed text-slate-600">{PARTNER_APPLY_NOTE}</p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link
                  href={ROUTES.GROW_WITH_LIFTNGO_BUSINESS_ENQUIRY}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:opacity-95"
                >
                  Business enquiry
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-center text-sm font-semibold text-slate-800 hover:bg-slate-50"
                >
                  Terms of Service
                </Link>
              </div>
            </div>

            <RouteOptimizationIntake />

            <div className="flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:px-6">
              <p className="text-sm text-slate-600">
                Back to the Noida hub for bookings, plans, and tools.
              </p>
              <Link
                href={ROUTES.NOIDA}
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white px-5 py-2.5 text-center text-sm font-semibold text-[var(--color-primary)] shadow-sm hover:bg-slate-50"
              >
                Noida hub
              </Link>
            </div>
          </div>
        </MarketingPageShell>
      </article>
    </ContentLayout>
  );
}
