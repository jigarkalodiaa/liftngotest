'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { trackPlanSelected, trackViewPlan } from '@/lib/analytics';
import Link from 'next/link';
import {
  Check,
  ArrowRight,
  Phone,
  FileText,
  Download,
  Building2,
  Star,
  Sparkles,
  ListTree,
  Table2,
} from 'lucide-react';
import PlansSubPageShell from '../PlansSubPageShell';
import { INDICATIVE_PRICING_FOOTNOTE } from '@/lib/pricing/subscriptionDisclosures';
import { GST_FLAGSHIP_SAMPLE_PDF_PATH } from '@/lib/pdf/gstFlagshipSamplePdf';

const BILLING_CYCLES = [
  {
    name: 'Daily — per trip',
    desc: 'Ship on Liftngo and get a compliant GST invoice for every trip — your CA sees exactly what moved, when.',
    priceLabel: 'Included',
    priceSub: 'On qualifying bookings — no add-on invoicing software fee',
    bestFor: 'Shops, ad-hoc B2B, anyone who needs line-by-line proof',
    features: [
      'GSTIN & tax lines on each trip bill',
      'Trip ID ties back to your dashboard',
      'PDF by email or WhatsApp',
      'Stops “where is the bill for this trip?” follow-ups',
    ],
    cta: 'Set up daily GST',
    href: ROUTES.CONTACT,
    popular: false,
    business: false,
  },
  {
    name: 'Weekly — one pack',
    desc: 'One Monday file replaces a folder of attachments — finance closes the week with less back-and-forth.',
    priceLabel: 'From ₹499/mo',
    priceSub: 'Platform automation fee · GST on fee as applicable · confirm before switch-on',
    bestFor: 'Retail chains, regular lanes, growing finance teams',
    features: [
      'Weekly consolidated GST summary + trip table',
      'Auto-send to your accountant',
      'Fewer mismatches between trips and payouts',
      'Pause or change cadence with notice per policy',
    ],
    cta: 'Add weekly billing',
    href: ROUTES.CONTACT,
    popular: true,
    business: false,
  },
  {
    name: 'Monthly — Business',
    desc: 'Month-end that matches how enterprises work — HSN depth, PO tags, and pipes into the tools you already use.',
    priceLabel: 'From ₹1,999/mo',
    priceSub: 'API limits & custom fields quoted before go-live',
    bestFor: 'Enterprise, D2C ops, high trip volume',
    features: [
      'Month-close invoice with HSN-wise breakup',
      'Custom PO / cost-centre fields',
      'Exports & API hooks for ERP / Tally workflows',
      'Named billing contact & escalation',
    ],
    cta: 'Request Business quote',
    href: ROUTES.CONTACT,
    popular: false,
    business: true,
  },
] as const;

const USE_CASES = [
  { icon: '🏪', title: 'Retail & stores', desc: 'Match each delivery to GST input credit without drowning in PDFs.' },
  { icon: '🏭', title: 'Warehouses & hubs', desc: 'Align billing cadence with stock movement and branch closures.' },
  { icon: '📦', title: 'E-commerce & D2C', desc: 'Per-trip or consolidated batches that fit marketplace settlement cycles.' },
  { icon: '🏢', title: 'Finance & HQ', desc: 'Business tier keeps leadership audit-ready with less manual stitching.' },
];

export default function GstPage() {
  const router = useRouter();

  return (
    <PlansSubPageShell
      title="GST-ready billing"
      subtitle="Pick how often you reconcile — daily is built into trips; weekly and Business tiers add automation Liftngo can bill for."
      badge="Invoicing"
      contentClassName="-mt-6"
    >
      <div
        id="gst-sample-pdf"
        className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-br from-blue-50 via-white to-indigo-50/60 p-4 shadow-[0_14px_44px_-18px_rgba(37,99,235,0.35)] ring-1 ring-blue-100/80 md:p-6"
      >
        <div
          className="pointer-events-none absolute -right-16 top-0 h-40 w-40 rounded-full bg-blue-400/15 blur-3xl"
          aria-hidden
        />
        <div className="relative flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-1 rounded-full border border-blue-200/80 bg-white/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-900 shadow-sm">
              <Sparkles className="h-3 w-3 text-amber-500" strokeWidth={2} aria-hidden /> Flagship report
            </p>
            <h2 className="mt-2 text-base font-extrabold leading-tight tracking-tight text-blue-950 md:text-lg">
              Download a sample of our monthly bulk GST pack
            </h2>
            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-blue-900/80 md:text-sm">
              This is the <strong className="text-blue-950">super-detailed, month-close PDF</strong> finance teams use when
              they outgrow one invoice per trip — one file, hundreds of trips, structured for auditors and ERPs.
            </p>

            {/* Primary download — above the fold on mobile (was easy to miss below the tile grid). */}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href={GST_FLAGSHIP_SAMPLE_PDF_PATH}
                download="liftngo-flagship-monthly-bulk-gst-report-sample.pdf"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-bold text-white shadow-[0_10px_28px_-8px_rgba(37,99,235,0.55)] ring-2 ring-white/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 active:scale-[0.98] sm:w-auto sm:min-w-[240px]"
                onClick={() => trackViewPlan('gst_sample', 'gst_page')}
              >
                <Download className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                Download sample PDF
              </a>
              <Link
                href={ROUTES.CONTACT}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-blue-200 bg-white px-4 py-2.5 text-center text-xs font-bold text-blue-900 shadow-sm transition-colors hover:bg-blue-50/90 sm:min-h-0"
                onClick={() => trackViewPlan('gst_sample_print_ready', 'gst_page')}
              >
                Print-ready brand sample — contact
              </Link>
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                {
                  icon: FileText,
                  t: 'Cover & compliance block',
                  d: 'Legal name, GSTIN, period, place of supply, unique report ID.',
                },
                {
                  icon: Table2,
                  t: 'HSN / SAC summary matrix',
                  d: 'Rate slabs, taxable values, CGST / SGST / IGST columns — not just a single total.',
                },
                {
                  icon: ListTree,
                  t: 'Trip annex (line-level)',
                  d: 'Each trip ID, date, lane, vehicle class, taxable amount — matches your dashboard.',
                },
                {
                  icon: Building2,
                  t: 'Business extras',
                  d: 'PO tags, cost centres, and notes column when you turn on Business mapping.',
                },
              ].map(({ icon: Icon, t, d }) => (
                <li
                  key={t}
                  className="flex gap-2.5 rounded-xl border border-blue-100/90 bg-white/85 px-3 py-2.5 shadow-sm"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-600/10 text-blue-700">
                    <Icon className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-bold text-blue-950 md:text-xs">{t}</span>
                    <span className="mt-0.5 block text-[10px] leading-snug text-blue-900/75 md:text-[11px]">{d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[10px] leading-snug text-blue-900/65 md:text-[11px]">
              The download is an <strong className="text-blue-950">illustrative layout</strong> so CAs know what to expect;
              your live file carries your branding rules, real GSTIN, and production trip lines.
            </p>
          </div>
          <div className="hidden w-full shrink-0 flex-col gap-2 lg:flex lg:w-auto lg:min-w-[200px]">
            <a
              href={GST_FLAGSHIP_SAMPLE_PDF_PATH}
              download="liftngo-flagship-monthly-bulk-gst-report-sample.pdf"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-xs font-bold text-white shadow-md transition-all hover:bg-blue-700"
              onClick={() => trackViewPlan('gst_sample_sidebar', 'gst_page')}
            >
              <Download className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              Download PDF
            </a>
            <p className="text-center text-[9px] font-medium text-blue-900/55">Opens in any PDF viewer</p>
          </div>
        </div>
      </div>

      <p className="mt-6 rounded-xl border border-stone-200/80 bg-stone-50/80 px-3 py-2 text-[11px] leading-snug text-stone-600">
        {INDICATIVE_PRICING_FOOTNOTE} Weekly and Business amounts here are entry tiers; your order or activation sets the binding fee.
      </p>

      <h2 className="mt-8 text-xs font-bold uppercase tracking-wider text-gray-400 md:text-sm">Choose your billing rhythm</h2>
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {BILLING_CYCLES.map((cycle) => (
          <div
            key={cycle.name}
            className={`relative flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md md:p-5 ${
              cycle.popular
                ? 'border-[var(--color-primary)]/35 ring-2 ring-[var(--color-primary)]/12'
                : cycle.business
                  ? 'border-amber-300/45 ring-2 ring-amber-200/18'
                  : 'border-gray-100'
            }`}
          >
            {cycle.popular ? (
              <div className="absolute -top-px left-1/2 z-[1] -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--color-primary)] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
                <Star className="mb-px inline h-2.5 w-2.5 fill-white" strokeWidth={2} aria-hidden /> Most picked
              </div>
            ) : null}
            {cycle.business && !cycle.popular ? (
              <div className="absolute -top-px left-1/2 z-[1] -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-500 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow-sm">
                Business
              </div>
            ) : null}

            <h3 className={`text-base font-bold text-gray-900 md:text-lg ${cycle.popular || cycle.business ? 'mt-3' : ''}`}>
              {cycle.name}
            </h3>
            <p className="mt-1 text-xs leading-snug text-gray-600">{cycle.desc}</p>
            <div className="mt-3 rounded-xl bg-gray-50/90 px-2.5 py-2 ring-1 ring-gray-100/90">
              <p className="text-lg font-extrabold tabular-nums text-gray-900">{cycle.priceLabel}</p>
              <p className="mt-0.5 text-[10px] font-medium leading-snug text-gray-500">{cycle.priceSub}</p>
            </div>
            <p className="mt-2 inline-block w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
              Fit: {cycle.bestFor}
            </p>
            <ul className="mt-3 flex-1 space-y-1.5">
              {cycle.features.map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                trackPlanSelected(cycle.name, 'gst');
                router.push(cycle.href);
              }}
              className={`mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold shadow-sm transition-all duration-200 active:scale-[0.98] md:min-h-11 md:py-3 ${
                cycle.popular
                  ? 'bg-[var(--color-primary)] text-white hover:opacity-95'
                  : cycle.business
                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                    : 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              {cycle.cta}
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xs font-bold uppercase tracking-wider text-gray-400 md:text-sm">Who uses this</h2>
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {USE_CASES.map((uc) => (
          <div key={uc.title} className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
            <span className="text-2xl" aria-hidden>
              {uc.icon}
            </span>
            <h3 className="mt-2 text-sm font-bold text-gray-900">{uc.title}</h3>
            <p className="mt-1 text-[11px] leading-snug text-gray-500 md:text-xs">{uc.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-br from-[#1e1f4b] via-[#2C2D5B] to-[#3d3f7a] p-5 text-center text-white shadow-lg md:p-8">
        <Building2 className="mx-auto h-8 w-8 text-white/50" />
        <h2 className="mt-3 text-base font-bold md:text-lg">Custom finance &amp; ERP programs</h2>
        <p className="mt-1 text-xs text-white/75 md:text-sm">
          Multi-GSTIN, subsidiary mapping, or SLA-backed invoice delivery — we scope and price with your team.
        </p>
        <button
          type="button"
          onClick={() => {
            trackViewPlan('gst_enterprise', 'gst_page');
            router.push(ROUTES.CONTACT);
          }}
          className="mx-auto mt-4 flex min-h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-gray-900 shadow-lg transition-all duration-200 active:scale-[0.98] sm:w-auto sm:min-h-11 sm:py-3"
        >
          <Phone className="h-4 w-4 shrink-0" />
          Talk to billing specialist
        </button>
      </div>
    </PlansSubPageShell>
  );
}
