'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import {
  SUBSCRIPTION_PACK_BENEFITS,
  TOLL_CHARGES_SEPARATE_NOTE,
  SUBSCRIPTION_COMPLIANCE_BULLETS,
  INDICATIVE_PRICING_FOOTNOTE,
  SUBSCRIPTION_HUB_CARD_ESSENTIAL_SHORT,
  SUBSCRIPTION_HUB_ESSENTIAL_MODAL_BLOCKS,
} from '@/lib/pricing/subscriptionDisclosures';
import {
  SUBSCRIPTION_PACKS_3W,
  subscriptionPackByName,
  subscriptionPackLockHref,
  subscriptionPackToPlansHubCard,
} from '@/lib/pricing/subscriptionPacks';
import { GST_FLAGSHIP_SAMPLE_PDF_PATH } from '@/lib/pdf/gstFlagshipSamplePdf';
import { trackFileDownload, trackModalOpen, trackSelectContent, trackViewPlan } from '@/lib/analytics';
import { trackEvent } from '@/lib/posthogAnalytics';
import {
  Package, Truck, Key, Calculator, FileText,
  ArrowRight, Star, Check, CheckCircle2, Info, X, Shield, GitCompare,
  Download,
} from 'lucide-react';
import PlansCompareModal from './PlansCompareModal';
import ConsultantTrustCta from '@/components/plans/ConsultantTrustCta';

/* ── Tab types ────────────────────────────────────────────── */

type TabId = 'deliveries' | 'vehicle' | 'lease' | 'custom' | 'gst';

const TABS: { id: TabId; label: string; shortLabel: string; icon: typeof Package }[] = [
  { id: 'deliveries', label: 'Daily Deliveries', shortLabel: 'Deliveries', icon: Package },
  { id: 'vehicle', label: 'Dedicated Vehicle', shortLabel: 'Vehicle', icon: Truck },
  { id: 'lease', label: 'Long Term Lease', shortLabel: 'Lease', icon: Key },
  { id: 'custom', label: 'Custom Plan', shortLabel: 'Custom', icon: Calculator },
  { id: 'gst', label: 'GST Billing', shortLabel: 'GST', icon: FileText },
];

const PLANS_TAB_QUERY = 'tab';

function parsePlansTab(sp: ReturnType<typeof useSearchParams>): TabId {
  const raw = sp.get(PLANS_TAB_QUERY)?.trim().toLowerCase();
  if (
    raw === 'deliveries' ||
    raw === 'vehicle' ||
    raw === 'lease' ||
    raw === 'custom' ||
    raw === 'gst'
  ) {
    return raw;
  }
  return 'deliveries';
}

/* ── Plan data per tab ────────────────────────────────────── */

type PlanCard = {
  title: string;
  copy: string;
  price: string;
  priceNote: string;
  savings?: string;
  popular?: boolean;
  offer?: boolean;
  bestFor: string;
  features: string[];
  cta: string;
  href: string;
};

const TAB_DATA: Record<TabId, { headline: string; sub: string; cards: PlanCard[] }> = {
  deliveries: {
    headline: 'Subscription trip packs',
    sub: 'Committed volume = sharper per-trip rates · packs vs ad hoc in ⓘ',
    cards: SUBSCRIPTION_PACKS_3W.map(subscriptionPackToPlansHubCard),
  },
  vehicle: {
    headline: 'Rent a vehicle',
    sub: '2W · 3W · 4W — day/week/month · quotes at checkout',
    cards: [
      {
        title: '2-Wheeler',
        copy: 'Small parcels & documents',
        price: '₹600/day',
        priceNote: 'From ₹1,200 with driver',
        bestFor: 'courier · docs · pharma delivery',
        features: ['Insurance covered', 'Flexible extensions', 'Verified driver option', 'CNG/Petrol/EV'],
        cta: 'Rent Now',
        href: ROUTES.PLANS_RENT,
      },
      {
        title: '3-Wheeler',
        copy: 'Medium cargo & retail',
        price: '₹900/day',
        priceNote: 'From ₹1,800 with driver',
        popular: true,
        bestFor: 'retail · ecommerce · daily supplies',
        features: ['Insurance covered', 'Fuel included (w/ driver)', 'Flexible extensions', 'Verified driver'],
        cta: 'Rent Now',
        href: ROUTES.PLANS_RENT,
      },
      {
        title: '4-Wheeler',
        copy: 'Bulk & heavy cargo',
        price: '₹2,000/day',
        priceNote: 'From ₹3,500 with driver',
        bestFor: 'warehouse · factory · bulk transfer',
        features: ['Insurance covered', 'Roadside assist', 'Fuel included (w/ driver)', 'Verified driver'],
        cta: 'Rent Now',
        href: ROUTES.PLANS_RENT,
      },
    ],
  },
  lease: {
    headline: 'Long-term lease',
    sub: 'Asset + maintenance scope in agreement · earning examples in ⓘ',
    cards: [
      {
        title: '2W EV Lease',
        copy: 'Low-cost electric two-wheeler',
        price: '₹15,000/mo',
        priceNote: '12-month · ₹18k for 6-month',
        savings: 'Earn ₹35k/mo',
        bestFor: 'SMEs · branch runs · light B2B & sample dispatch',
        features: ['Insurance by Liftngo', 'Minor maintenance', 'Platform earning access', 'EV charging support'],
        cta: 'Lease Now',
        href: ROUTES.PLANS_LEASE,
      },
      {
        title: '3W Cargo Lease',
        copy: 'Business delivery workhorse',
        price: '₹24,000/mo',
        priceNote: '12-month · ₹28k for 6-month',
        savings: 'Earn ₹55k/mo',
        popular: true,
        bestFor: 'delivery business · retail logistics',
        features: ['Insurance covered', 'Routine maintenance', 'Major repairs covered', 'Platform earning'],
        cta: 'Lease Now',
        href: ROUTES.PLANS_LEASE,
      },
      {
        title: '4W Mini Truck',
        copy: 'Heavy cargo & warehouse ops',
        price: '₹38,000/mo',
        priceNote: '12-month · ₹45k for 6-month',
        savings: 'Earn ₹85k/mo',
        bestFor: 'warehouse · distributor · factory',
        features: ['Insurance covered', 'Maintenance included', 'Roadside assistance', 'Platform earning'],
        cta: 'Lease Now',
        href: ROUTES.PLANS_LEASE,
      },
    ],
  },
  custom: {
    headline: 'Custom mix & calculator',
    sub: 'Blend 2W/3W/4W — live estimate before you book',
    cards: [
      {
        title: 'Multi-Vehicle Builder',
        copy: 'Configure any combination of 2W, 3W, 4W',
        price: 'From ₹39/trip · 2W',
        priceNote: 'Bulk discounts up to 30%',
        savings: 'Save up to 30%',
        popular: true,
        bestFor: 'mixed fleet · seasonal ops · irregular',
        features: ['2W, 3W & 4W — one each', 'Live calculator', 'Bulk discounts', 'Smart recommendations'],
        cta: 'Open Calculator',
        href: ROUTES.PLANS_CUSTOM,
      },
    ],
  },
  gst: {
    headline: 'GST-ready billing',
    sub: 'Fewer CA follow-ups · clean books · optional automation tiers · full detail in ⓘ',
    cards: [
      {
        title: 'Daily — per trip',
        copy: 'Every delivery gets its own GST bill — instant proof for audits & customers',
        price: 'Included',
        priceNote: 'On qualifying Liftngo trips — no separate invoicing software fee',
        bestFor: 'shops · ad-hoc B2B · tight compliance',
        features: [
          'GSTIN & line items on each trip invoice',
          'Email / WhatsApp PDF share',
          'Trip ID on bill — matches your dashboard',
          'Ideal when every dispatch must be traceable',
        ],
        cta: 'Ship & auto-invoice',
        href: ROUTES.PLANS_GST,
      },
      {
        title: 'Weekly — one pack',
        copy: 'Monday morning, one file: ten trips become one clear summary for your CA',
        price: 'From ₹499/mo',
        priceNote: 'Billed with your account · pause anytime',
        savings: 'Less spreadsheet pain',
        popular: true,
        bestFor: 'retail chains · regular lanes · finance teams',
        features: [
          'Single weekly GST summary + trip table',
          'Auto-send to your accountant',
          'Reconcile payouts without opening dozens of PDFs',
          'Liftngo platform fee — not a government charge',
        ],
        cta: 'Add weekly billing',
        href: ROUTES.PLANS_GST,
      },
      {
        title: 'Monthly — Business',
        copy: 'Month-end close without chasing drivers — HSN, PO tags, and ERP hooks',
        price: 'From ₹1,999/mo',
        priceNote: 'Volume & API limits quoted before you go live',
        savings: 'Built for scale',
        offer: true,
        bestFor: 'enterprise · D2C ops · subscription logistics',
        features: [
          'Consolidated invoice with HSN-wise breakup',
          'Custom PO / cost-centre fields',
          'API & file exports for ERP / Tally workflows',
          'Named billing contact & escalation path',
        ],
        cta: 'Request Business quote',
        href: ROUTES.CONTACT,
      },
    ],
  },
};

const PLANS_TAB_DISCLOSURES: Record<Exclude<TabId, 'deliveries'>, string[]> = {
  vehicle: [
    'Day and week rates are indicative “from” amounts. Driver option, fuel policy, insurance, and distance bands change your confirmed quote at checkout.',
    'Extensions, security deposit, and damage / liability follow your rental agreement and the Liftngo Terms of Service.',
  ],
  lease: [
    'Earning callouts (e.g. ₹35k–₹85k/mo) are illustrative peer ranges, not a guarantee. Actual outcomes depend on utilization, zone, and program rules.',
    'Lease fee, tenure, maintenance, insurance, and buy-out (if any) are fixed in your lease document — not on this marketing page.',
  ],
  custom: [
    'Calculator totals are estimates until you confirm route, stops, vehicle class, and pack rules in the booking flow.',
    'Discounts apply within published parameters; out-of-scope handling, long detours, or special equipment may be quoted separately so we can keep base pricing fair for everyone.',
  ],
  gst: [
    'Daily per-trip GST is included in standard Liftngo trip economics on eligible products — you are not sold a separate “billing-only” login for that mode.',
    'Weekly (From ₹499/mo) and Business monthly (From ₹1,999/mo) figures are indicative platform fees for automation & consolidated files. Your activation email or order summary states the binding amount, discounts on bundle volume, and tax on the fee itself.',
    'GST on logistics remains as per law; Liftngo issues tax invoices for its own charges. Your GSTIN, HSN/SAC, and place of supply must be complete in your profile.',
    'ERP API, custom fields, and minimum commits may apply on Business — we quote before switch-on so finance can sign off cleanly.',
  ],
};

type PlansInfoOpen =
  | null
  | { kind: 'hub' }
  | { kind: 'subscription' }
  | { kind: 'tab'; tab: Exclude<TabId, 'deliveries'> }
  | { kind: 'card'; card: PlanCard };

/* ── Component ────────────────────────────────────────────── */

function PlansHubPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = useMemo(() => parsePlansTab(searchParams), [searchParams]);

  const setPlansTab = (tab: TabId) => {
    if (tab !== activeTab) {
      trackSelectContent('plans_hub_tab', tab, { from_tab: activeTab });
      trackEvent('tab_switched', { tab, context: 'plans_hub', from_tab: activeTab });
    }
    const params = new URLSearchParams(searchParams.toString());
    if (tab === 'deliveries') {
      params.delete(PLANS_TAB_QUERY);
    } else {
      params.set(PLANS_TAB_QUERY, tab);
    }
    const qs = params.toString();
    router.replace(qs ? `${ROUTES.PLANS}?${qs}` : ROUTES.PLANS, { scroll: false });
  };

  const [infoOpen, setInfoOpen] = useState<PlansInfoOpen>(null);
  const [compareOpen, setCompareOpen] = useState(false);

  const tabData = useMemo(() => TAB_DATA[activeTab], [activeTab]);

  useEffect(() => {
    if (!infoOpen && !compareOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setInfoOpen(null);
      setCompareOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [infoOpen, compareOpen]);

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 pb-24 pt-3 md:px-6 lg:px-8">
      <div className="page-stack">
      {/* ── HERO — sales strip; detail in ⓘ (dashboard-style) ─── */}
      <section className="page-section rounded-2xl bg-gradient-to-br from-[#1e1f4b] via-[#2C2D5B] to-[#3d3f7a] px-4 py-4 text-white shadow-lg md:rounded-3xl md:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-extrabold leading-[1.15] tracking-tight md:text-2xl lg:text-3xl">
              Logistics plans
              <span className="text-blue-300"> that scale with you</span>
            </h1>
            <p className="mt-1 text-[11px] text-white/65 sm:text-xs">
              Pick a path below — numbers here are directional; binding terms at checkout.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              trackModalOpen('plans_page_intro', 'hero_info');
              setInfoOpen({ kind: 'hub' });
            }}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/15 sm:h-10 sm:w-10"
            aria-label="How this plans page works and how Liftngo prices fairly"
          >
            <Info className="h-4 w-4" strokeWidth={2} aria-hidden />
          </button>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
          {['GST-ready ops', 'Packs reward committed trips', 'Tolls & pass-throughs on actuals'].map((t) => (
            <span key={t} className="inline-flex items-center gap-1 text-[10px] font-medium text-white/75">
              <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-400" strokeWidth={2} aria-hidden /> {t}
            </span>
          ))}
        </div>
        <div className="mt-3.5 flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={() => {
              trackViewPlan('compare_plans', 'hero');
              trackModalOpen('plans_compare_modal', 'hero');
              setPlansTab('deliveries');
              setCompareOpen(true);
            }}
            className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#2C2D5B] shadow-lg shadow-black/20 transition-all hover:shadow-xl active:scale-[0.98] sm:w-auto"
          >
            <GitCompare className="h-3.5 w-3.5" strokeWidth={2} aria-hidden /> Compare plans
          </button>
          <button
            type="button"
            onClick={() => {
              trackViewPlan('custom', 'hero');
              router.push(ROUTES.PLANS_CUSTOM);
            }}
            className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 active:scale-[0.98] sm:w-auto"
          >
            <Calculator className="h-3.5 w-3.5" strokeWidth={2} aria-hidden /> Calculator
          </button>
        </div>
      </section>

      {/* ── TAB SELECTOR — matches dashboard pill style ──── */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 -mx-1 px-1 pb-1 sm:gap-x-6 sm:gap-y-2">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setPlansTab(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all duration-200 ${
                active
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <Icon className="h-3 w-3" strokeWidth={2} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB CONTENT ──────────────────────────────────── */}
      <div id="plan-cards" className="scroll-mt-24 md:scroll-mt-[5.5rem]">

        {/* Tab headline — tab-level ⓘ */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm font-bold tracking-tight text-stone-900">{tabData.headline}</h2>
            <p className="text-[11px] text-stone-500">{tabData.sub}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            {activeTab === 'deliveries' ? (
              <button
                type="button"
                onClick={() => {
                  trackViewPlan('compare_plans', 'tab_header');
                  trackModalOpen('plans_compare_modal', 'tab_header');
                  setCompareOpen(true);
                }}
                className="flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[10px] font-bold text-stone-800 shadow-sm transition-colors hover:border-teal-200/90 hover:bg-teal-50/40 sm:gap-1.5 sm:px-3 sm:text-[11px]"
              >
                <GitCompare className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2} aria-hidden />
                Compare
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'deliveries') {
                  trackModalOpen('plans_subscription_disclosure', 'tab_head');
                  setInfoOpen({ kind: 'subscription' });
                } else {
                  trackModalOpen('plans_tab_disclosure', activeTab);
                  setInfoOpen({ kind: 'tab', tab: activeTab });
                }
              }}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-stone-200 bg-white text-stone-500 shadow-sm transition-colors hover:bg-stone-50 hover:text-stone-800"
              aria-label={`${tabData.headline}: definitions and fine print`}
            >
              <Info className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>

        {activeTab === 'gst' ? (
          <div className="mb-3 flex flex-col gap-2 rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50/90 to-indigo-50/50 px-3 py-2.5 shadow-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3">
            <p className="min-w-0 text-[10px] font-medium leading-snug text-blue-950/90 sm:max-w-md sm:text-[11px]">
              <strong className="font-bold">Monthly bulk GST report:</strong> download an illustrative PDF (flagship layout) or open the full GST page.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={GST_FLAGSHIP_SAMPLE_PDF_PATH}
                download="liftngo-flagship-monthly-bulk-gst-report-sample.pdf"
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-[11px] font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.98] sm:flex-initial"
                onClick={() => {
                  trackViewPlan('gst_sample', 'plans_hub_gst_tab');
                  trackFileDownload('gst_flagship_sample_pdf', 'plans_hub_gst_tab');
                }}
              >
                <Download className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
                Download sample PDF
              </a>
              <Link
                href={`${ROUTES.PLANS_GST}#gst-sample-pdf`}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-blue-200 bg-white px-3 py-2 text-[10px] font-semibold text-blue-900 shadow-sm transition-colors hover:bg-blue-50/80"
                onClick={() => trackViewPlan('gst_full_page', 'plans_hub_gst_tab')}
              >
                Full GST page
              </Link>
            </div>
          </div>
        ) : null}

        {/* Cards — scannable; inclusions in card ⓘ */}
        <div
          className={`grid min-w-0 gap-2.5 sm:gap-3 ${tabData.cards.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}
        >
          {tabData.cards.map((card) => (
            <div
              key={card.title}
              className={`relative flex flex-col rounded-2xl border bg-white/95 p-3 shadow-sm transition-all duration-200 hover:-translate-y-px hover:shadow-md sm:p-3.5 ${
                card.popular
                  ? 'border-[var(--color-primary)]/35 ring-2 ring-[var(--color-primary)]/15'
                  : card.offer
                    ? 'border-amber-300/45 ring-2 ring-amber-200/20'
                    : 'border-stone-200/80 ring-1 ring-stone-100/70'
              }`}
            >
              {card.popular ? (
                <div className="absolute -top-2 left-1/2 z-[1] -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white shadow-sm">
                  <Star className="mb-px inline h-2 w-2 fill-white" strokeWidth={2} aria-hidden /> Popular
                </div>
              ) : card.offer ? (
                <div className="absolute -top-2 left-1/2 z-[1] -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-500 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-white shadow-sm">
                  Business
                </div>
              ) : null}

              <div className={`flex items-start justify-between gap-2 ${card.popular || card.offer ? 'mt-2' : ''}`}>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-stone-900">{card.title}</h3>
                  <p className="text-[10px] text-stone-500">{card.copy}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {card.savings ? (
                    <span className="rounded-full border border-emerald-100 bg-emerald-50/90 px-1.5 py-px text-[8px] font-bold text-emerald-800 sm:text-[9px]">
                      {card.savings}
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setInfoOpen({ kind: 'card', card })}
                    className="grid h-7 w-7 place-items-center rounded-full border border-stone-200/90 bg-white text-stone-500 shadow-sm transition-colors hover:bg-stone-50"
                    aria-label={
                      card.href === ROUTES.PLANS_SUBSCRIPTION
                        ? `${card.title}: vehicle, distance, validity, terms, and legal summary`
                        : `${card.title}: full inclusions and notes`
                    }
                  >
                    <Info className="h-3 w-3" strokeWidth={2} aria-hidden />
                  </button>
                </div>
              </div>

              <div className="mt-2.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
                <span className="text-xl font-extrabold tabular-nums tracking-tight text-stone-900">{card.price}</span>
                <span className="text-[10px] text-stone-500">{card.priceNote}</span>
              </div>

              <p className="mt-2 line-clamp-2 rounded-lg bg-stone-50/90 px-2 py-1 text-[9px] font-medium leading-snug text-stone-600 ring-1 ring-stone-100/80">
                <span className="font-semibold text-stone-700">Fit:</span> {card.bestFor}
              </p>

              {card.href === ROUTES.PLANS_SUBSCRIPTION ? (
                <div className="mt-2 rounded-xl border border-amber-200/75 bg-gradient-to-b from-amber-50/65 to-amber-50/20 px-2 py-1.5 ring-1 ring-amber-100/60">
                  <p className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wide text-amber-950/80 sm:text-[9px]">
                    <Truck className="h-3 w-3 shrink-0 opacity-90" strokeWidth={2} aria-hidden /> Essentials
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {SUBSCRIPTION_HUB_CARD_ESSENTIAL_SHORT.map(({ label, value }) => (
                      <li key={label} className="text-[8px] leading-snug text-stone-800 sm:text-[9px]">
                        <span className="font-semibold text-stone-900">{label}:</span> {value}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1 text-[7px] leading-snug text-amber-950/70 sm:text-[8px]">
                    Full vehicle, distance, T&amp;C &amp; liability notes in ⓘ — this page is not a binding contract.
                  </p>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  trackViewPlan(card.title.toLowerCase().replace(/\s/g, '_'), 'plans_hub');
                  const href =
                    card.href === ROUTES.PLANS_SUBSCRIPTION
                      ? `${ROUTES.PLANS_SUBSCRIPTION}?locked=${encodeURIComponent(card.title)}`
                      : card.href;
                  router.push(href);
                }}
                className={`mt-3 flex min-h-10 w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition-all active:scale-[0.98] ${
                  card.popular
                    ? 'bg-[var(--color-primary)] text-white shadow-sm hover:opacity-95'
                    : card.offer
                      ? 'bg-amber-500 text-white shadow-sm hover:bg-amber-600'
                      : 'border border-stone-200/90 bg-white text-stone-800 shadow-sm hover:border-teal-200/80 hover:bg-teal-50/25'
                }`}
              >
                {card.cta} <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 rounded-xl border border-stone-200/60 bg-stone-50/50 px-2.5 py-2 sm:gap-x-4">
          {['500+ businesses', '~15 min pickup zone avg', 'GST workflows'].map((t) => (
            <span key={t} className="inline-flex items-center gap-1 text-[9px] font-medium text-stone-600">
              <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />
              {t}
            </span>
          ))}
        </div>

        <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e1f4b] via-[#2C2D5B] to-[#151632] p-4 text-white shadow-[0_14px_44px_-14px_rgba(25,26,70,0.55)] ring-1 ring-white/[0.12] transition-[box-shadow,transform] duration-300 hover:shadow-[0_18px_50px_-12px_rgba(25,26,70,0.6)] sm:p-5">
          <div
            className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-[var(--color-primary)]/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0">
              <p className="text-sm font-extrabold leading-tight tracking-tight md:text-base">
                Don&apos;t see a plan that fits exactly?
              </p>
              <p className="mt-1.5 max-w-md text-[11px] font-medium leading-snug text-white/72 sm:text-xs">
                That&apos;s normal — most ops aren&apos;t one-size-fits-all. Build your own mix (2W / 3W / 4W, stops, volume) in the
                calculator and get numbers that match how you actually ship.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                trackViewPlan('custom', 'bottom_cta');
                router.push(ROUTES.PLANS_CUSTOM);
              }}
              className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#1e1f4b] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.35)] ring-2 ring-white/90 transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-50 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.4)] active:translate-y-0 active:scale-[0.98] sm:w-auto sm:min-w-[210px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2C2D5B]"
            >
              <Calculator className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
              Open calculator
              <ArrowRight className="h-4 w-4 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>

        <ConsultantTrustCta layout="hub" analyticsSource="plans_hub_bottom" />
      </div>
      </div>

      {infoOpen ? (
        <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
          <button
            type="button"
            className="absolute inset-0 z-0 bg-slate-900/45 backdrop-blur-[2px] transition-opacity"
            aria-label="Close details"
            onClick={() => setInfoOpen(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="plans-info-title"
            className="relative z-10 flex max-h-[min(88vh,100dvh)] w-full max-w-md flex-col overflow-hidden rounded-t-[1.35rem] bg-white shadow-2xl ring-1 ring-slate-900/[0.06] sm:max-h-[min(92vh,880px)] sm:rounded-2xl"
          >
            <div className="flex shrink-0 justify-center pt-2.5 sm:hidden" aria-hidden>
              <div className="h-1 w-11 rounded-full bg-slate-200/90" />
            </div>
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-br from-slate-50 via-white to-[var(--color-primary)]/[0.04] px-4 pb-3 pt-2 sm:px-5 sm:pb-4 sm:pt-4">
              <div className="min-w-0 pt-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">Liftngo plans</p>
                <h2 id="plans-info-title" className="mt-0.5 text-lg font-bold tracking-tight text-slate-900">
                  {infoOpen.kind === 'hub' && 'How this page works'}
                  {infoOpen.kind === 'subscription' && 'Subscription packs — detail'}
                  {infoOpen.kind === 'tab' && `${TAB_DATA[infoOpen.tab].headline}`}
                  {infoOpen.kind === 'card' && infoOpen.card.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setInfoOpen(null)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-slate-50/90 to-white px-3 py-3 sm:px-4 sm:py-4">
              <div className="space-y-3">
                {infoOpen.kind === 'hub' ? (
                  <>
                    <p className="text-[13px] leading-relaxed text-slate-700">
                      This hub is a <strong className="text-slate-900">sales guide</strong>, not a price list. Figures show typical entry points so you can pick the right next step — checkout and your order confirmation set the binding amount, taxes, and inclusions.
                    </p>
                    <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-b from-emerald-50/40 to-white p-3.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-900/75">Why packs exist</p>
                      <ul className="mt-2 space-y-2 text-[12px] leading-relaxed text-slate-700">
                        <li className="flex gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                          <span>
                            <strong className="text-slate-900">Committed trips</strong> let us plan capacity — so we can offer sharper in-pack rates than most one-off lanes (still before tolls and add-ons).
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                          <span>
                            <strong className="text-slate-900">Ad hoc stays available</strong> but often prices higher for the same vehicle class when you have not locked volume — that keeps the network sustainable.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                          <span>{TOLL_CHARGES_SEPARATE_NOTE}</span>
                        </li>
                      </ul>
                    </div>
                    <p className="rounded-xl bg-slate-100/80 px-3 py-2.5 text-[11px] leading-snug text-slate-600">{INDICATIVE_PRICING_FOOTNOTE}</p>
                  </>
                ) : null}

                {infoOpen.kind === 'subscription' ? (
                  <>
                    <p className="text-[12px] leading-relaxed text-slate-600">
                      {TOLL_CHARGES_SEPARATE_NOTE} Pack validity and km caps apply as in your confirmation.
                    </p>
                    <div className="rounded-2xl border border-emerald-100/80 bg-gradient-to-b from-emerald-50/40 to-white p-3.5 shadow-[0_8px_30px_-12px_rgba(5,150,105,0.12)]">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-900/75">Pack benefits</p>
                      <ul className="mt-2 space-y-2 text-[12px] leading-relaxed text-slate-700">
                        {SUBSCRIPTION_PACK_BENEFITS.map((line, i) => (
                          <li key={i} className="flex gap-2">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
                      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                          <FileText className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                        </span>
                        Compliance (packs)
                      </div>
                      <ul className="mt-3 max-h-[40vh] space-y-2 overflow-y-auto pr-1 text-[11px] leading-snug text-slate-600 sm:max-h-none">
                        {SUBSCRIPTION_COMPLIANCE_BULLETS.map((line, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400/80" aria-hidden />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="rounded-xl bg-slate-100/80 px-3 py-2.5 text-[11px] leading-snug text-slate-600">{INDICATIVE_PRICING_FOOTNOTE}</p>
                  </>
                ) : null}

                {infoOpen.kind === 'tab' ? (
                  <ul className="space-y-2.5 text-[13px] leading-relaxed text-slate-700">
                    {PLANS_TAB_DISCLOSURES[infoOpen.tab].map((line) => (
                      <li key={line} className="flex gap-2">
                        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" strokeWidth={2} aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {infoOpen.kind === 'card' ? (
                  <>
                    <p className="text-[12px] text-slate-600">
                      <span className="font-semibold text-slate-800">{infoOpen.card.price}</span>
                      <span className="text-slate-500"> · {infoOpen.card.priceNote}</span>
                    </p>
                    <p className="text-[12px] leading-relaxed text-slate-700">
                      <strong className="text-slate-900">Best fit:</strong> {infoOpen.card.bestFor}
                    </p>

                    {infoOpen.card.href === ROUTES.PLANS_SUBSCRIPTION ? (
                      <>
                        <div className="rounded-xl border border-amber-200/85 bg-gradient-to-br from-amber-50/70 to-white px-3 py-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-amber-950/85">
                            Essential info — all subscription packs
                          </p>
                          <p className="mt-1 text-[11px] leading-snug text-slate-700">
                            Same vehicle, distance, and legal framework for Starter, Growth, and Scale unless your{' '}
                            <strong className="text-slate-900">order confirmation</strong> says otherwise.
                          </p>
                        </div>
                        {SUBSCRIPTION_HUB_ESSENTIAL_MODAL_BLOCKS.map((block) => (
                          <div
                            key={block.title}
                            className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm"
                          >
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                              {block.title}
                            </p>
                            <ul className="mt-2 space-y-2">
                              {block.lines.map((line) => (
                                <li key={line} className="flex gap-2 text-[11px] leading-snug text-slate-700">
                                  <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" strokeWidth={2} aria-hidden />
                                  <span>{line}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </>
                    ) : null}

                    <div className="rounded-2xl border border-slate-200/70 bg-white p-3.5 shadow-sm">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Inclusions &amp; specs</p>
                      <ul className="mt-2 space-y-1.5">
                        {infoOpen.card.features.map((f) => (
                          <li key={f} className="flex gap-2 text-[12px] leading-snug text-slate-700">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="rounded-xl bg-slate-100/80 px-3 py-2.5 text-[11px] leading-snug text-slate-600">{INDICATIVE_PRICING_FOOTNOTE}</p>
                  </>
                ) : null}

                <div className="flex flex-col gap-2 pb-1 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => setInfoOpen(null)}
                    className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
                  >
                    Got it
                  </button>
                  <Link
                    href="/terms"
                    onClick={() => setInfoOpen(null)}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <PlansCompareModal
        open={compareOpen}
        onClose={() => setCompareOpen(false)}
        onLockPlan={(name) => {
          setCompareOpen(false);
          const pack = subscriptionPackByName(name);
          if (pack?.group === '3w') {
            trackViewPlan(name.toLowerCase().replace(/\s/g, '_'), 'compare_modal');
            router.push(subscriptionPackLockHref(pack));
          }
        }}
      />

      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-100 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl sm:hidden">
        <div className="mx-auto flex max-w-6xl justify-center gap-2 px-4">
          <button
            type="button"
            onClick={() => {
              const pick = tabData.cards.find((c) => c.popular) ?? tabData.cards[0];
              trackViewPlan(pick.title.toLowerCase().replace(/\s/g, '_'), 'sticky_cta');
              const pack = subscriptionPackByName(pick.title);
              const href =
                pick.href === ROUTES.PLANS_SUBSCRIPTION && pack?.group === '3w'
                  ? subscriptionPackLockHref(pack)
                  : pick.href;
              router.push(href);
            }}
            className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1 rounded-xl bg-[var(--color-primary)] px-3 py-2.5 text-[11px] font-bold text-white shadow-sm transition-all active:scale-[0.98]"
          >
            <Star className="h-3.5 w-3.5" strokeWidth={2} aria-hidden /> Top pick
          </button>
          <button
            type="button"
            onClick={() => {
              trackViewPlan('custom', 'sticky_cta');
              router.push(ROUTES.PLANS_CUSTOM);
            }}
            className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-[11px] font-bold text-stone-800 shadow-sm transition-all active:scale-[0.98]"
          >
            <Calculator className="h-3.5 w-3.5" strokeWidth={2} aria-hidden /> Calculator
          </button>
        </div>
      </div>
    </div>
  );
}

function PlansHubPageFallback() {
  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 pb-24 pt-3 md:px-6 lg:px-8">
      <div className="page-stack">
        <div className="h-40 animate-pulse rounded-2xl bg-stone-200/70 md:h-44 md:rounded-3xl" aria-hidden />
        <div className="mt-4 flex gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-24 shrink-0 animate-pulse rounded-full bg-stone-200/70" aria-hidden />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PlansHubPage() {
  return (
    <Suspense fallback={<PlansHubPageFallback />}>
      <PlansHubPageContent />
    </Suspense>
  );
}
