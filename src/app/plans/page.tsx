'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { trackViewPlan } from '@/lib/analytics';
import {
  Package, Truck, Key, Calculator, FileText,
  ArrowRight, Star, Check, Phone, ChevronRight, CheckCircle2,
} from 'lucide-react';

/* ── Tab types ────────────────────────────────────────────── */

type TabId = 'deliveries' | 'vehicle' | 'lease' | 'custom' | 'gst';

const TABS: { id: TabId; label: string; shortLabel: string; icon: typeof Package }[] = [
  { id: 'deliveries', label: 'Daily Deliveries', shortLabel: 'Deliveries', icon: Package },
  { id: 'vehicle', label: 'Dedicated Vehicle', shortLabel: 'Vehicle', icon: Truck },
  { id: 'lease', label: 'Long Term Lease', shortLabel: 'Lease', icon: Key },
  { id: 'custom', label: 'Custom Plan', shortLabel: 'Custom', icon: Calculator },
  { id: 'gst', label: 'GST Billing', shortLabel: 'GST', icon: FileText },
];

/* ── Plan data per tab ────────────────────────────────────── */

type PlanCard = {
  title: string;
  copy: string;
  price: string;
  priceNote: string;
  savings?: string;
  popular?: boolean;
  bestFor: string;
  features: string[];
  cta: string;
  href: string;
};

const TAB_DATA: Record<TabId, { headline: string; sub: string; cards: PlanCard[] }> = {
  deliveries: {
    headline: 'Save more on daily deliveries',
    sub: 'Fixed-trip plans — no surge, ever.',
    cards: [
      {
        title: 'Starter',
        copy: 'For small shops & local sellers',
        price: '₹13,500',
        priceNote: '₹450/trip · 30 trips',
        savings: 'Save ₹3,000',
        bestFor: 'दुकानदार · local retail · small biz',
        features: ['3W with driver', '30-day validity', 'Basic tracking', 'Email invoices'],
        cta: 'Get This Plan',
        href: ROUTES.PLANS_SUBSCRIPTION,
      },
      {
        title: 'Growth',
        copy: 'For growing businesses',
        price: '₹20,000',
        priceNote: '₹400/trip · 50 trips',
        savings: 'Save ₹7,500',
        popular: true,
        bestFor: 'warehouse · ecommerce · retail chain',
        features: ['3W with driver', 'Live GPS', 'Dedicated POC', 'Priority dispatch'],
        cta: 'Get This Plan',
        href: ROUTES.PLANS_SUBSCRIPTION,
      },
      {
        title: 'Scale',
        copy: 'For high-volume operations',
        price: '₹36,000',
        priceNote: '₹360/trip · 100 trips',
        savings: 'Save ₹19,000',
        bestFor: 'enterprise · D2C brand · large warehouse',
        features: ['Dedicated account mgr', 'Custom SLA', 'Weekly reports', 'GST invoicing'],
        cta: 'Get This Plan',
        href: ROUTES.PLANS_SUBSCRIPTION,
      },
    ],
  },
  vehicle: {
    headline: 'Flexible vehicle access, anytime',
    sub: 'Daily, weekly, or monthly — with or without driver.',
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
    headline: 'Own-like control, long-term savings',
    sub: 'Earn ₹35k–₹85k/month. Zero upfront cost.',
    cards: [
      {
        title: '2W EV Lease',
        copy: 'Low-cost electric two-wheeler',
        price: '₹15,000/mo',
        priceNote: '12-month · ₹18k for 6-month',
        savings: 'Earn ₹35k/mo',
        bestFor: 'gig workers · last-mile delivery',
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
    headline: 'Build your exact logistics plan',
    sub: 'Add multiple vehicles — get instant pricing.',
    cards: [
      {
        title: 'Multi-Vehicle Builder',
        copy: 'Configure any combination of 2W, 3W, 4W',
        price: 'From ₹40/trip',
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
    headline: 'Automated GST billing for businesses',
    sub: 'Compliant invoices from day 1.',
    cards: [
      {
        title: 'Daily Billing',
        copy: 'Invoice per trip — ad-hoc bookings',
        price: 'Free',
        priceNote: 'Included with every booking',
        bestFor: 'small biz · individual bookings',
        features: ['Per-trip GST invoice', 'GSTIN on every bill', 'Digital copy via email'],
        cta: 'Enable Now',
        href: ROUTES.PLANS_GST,
      },
      {
        title: 'Weekly Billing',
        copy: 'Consolidated summary — Monday',
        price: 'Free',
        priceNote: 'For regular shippers',
        popular: true,
        bestFor: 'retail stores · regular shippers',
        features: ['Weekly summary', 'Trip-wise breakdown', 'Auto-email to CA', 'Accounts-friendly'],
        cta: 'Enable Now',
        href: ROUTES.PLANS_GST,
      },
      {
        title: 'Monthly Billing',
        copy: 'Enterprise-grade — ERP-ready',
        price: 'Free',
        priceNote: 'Subscription & enterprise users',
        bestFor: 'enterprise · warehouse · subscription',
        features: ['Monthly consolidated', 'HSN-wise breakup', 'Custom PO support', 'API for ERP'],
        cta: 'Enable Now',
        href: ROUTES.PLANS_GST,
      },
    ],
  },
};

/* ── Component ────────────────────────────────────────────── */

export default function PlansHubPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>('deliveries');

  const tabData = useMemo(() => TAB_DATA[activeTab], [activeTab]);

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 pb-24 pt-3 md:px-6 lg:px-8">
      <div className="page-stack">
      {/* ── HERO — compact, matches dashboard hero style ─── */}
      <section className="page-section rounded-2xl bg-gradient-to-br from-[#1e1f4b] via-[#2C2D5B] to-[#3d3f7a] px-4 text-white shadow-lg md:rounded-3xl md:px-6 lg:px-8">
        <h1 className="text-lg font-extrabold leading-[1.15] tracking-tight md:text-2xl lg:text-3xl">
          Choose the right plan
          <span className="text-blue-300"> for your logistics</span>
        </h1>
        <p className="mt-1 text-xs text-white/60 sm:text-sm">From daily deliveries to full fleet control</p>
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1">
          {[
            '500+ businesses trust us',
            'Starting ₹40/trip',
            'GST billing included',
          ].map((t) => (
            <span key={t} className="inline-flex items-center gap-1 text-[10px] font-medium text-white/70">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" /> {t}
            </span>
          ))}
        </div>
        <div className="mt-3.5 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={() => {
              trackViewPlan('best_plan', 'hero');
              const el = document.getElementById('plan-cards');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex min-h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-3 text-xs font-bold text-[#2C2D5B] shadow-lg shadow-black/20 transition-all duration-200 hover:shadow-xl active:scale-[0.98] sm:w-auto sm:min-h-11 sm:inline-flex sm:py-2.5"
          >
            <Star className="h-3.5 w-3.5" /> Get Best Plan
          </button>
          <button
            type="button"
            onClick={() => {
              trackViewPlan('custom', 'hero');
              router.push(ROUTES.PLANS_CUSTOM);
            }}
            className="flex min-h-12 w-full items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 active:scale-[0.98] sm:w-auto sm:min-h-11 sm:inline-flex sm:py-2.5"
          >
            <Calculator className="h-3.5 w-3.5" /> Calculate Cost
          </button>
        </div>
      </section>

      {/* ── TAB SELECTOR — matches dashboard pill style ──── */}
      <div className="flex gap-4 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1 sm:gap-6">
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
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
      <div id="plan-cards" className="scroll-mt-20">

        {/* Tab headline */}
        <div className="mb-3">
          <h2 className="text-sm font-bold text-gray-900">{tabData.headline}</h2>
          <p className="text-[11px] text-gray-500">{tabData.sub}</p>
        </div>

        {/* Cards */}
        <div className={`grid min-w-0 gap-4 sm:gap-6 ${tabData.cards.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
          {tabData.cards.map((card) => (
            <div
              key={card.title}
              className={`group relative flex flex-col rounded-xl border bg-white page-card shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                card.popular
                  ? 'border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/10'
                  : 'border-gray-100'
              }`}
            >
              {card.popular && (
                <div className="absolute -top-2.5 left-3 inline-flex items-center gap-0.5 rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-white shadow-sm">
                  <Star className="h-2 w-2 fill-white" /> Most Popular
                </div>
              )}

              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{card.title}</h3>
                  <p className="text-[10px] text-gray-500">{card.copy}</p>
                </div>
                {card.savings && (
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">{card.savings}</span>
                )}
              </div>

              <div className="mt-2.5 flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-gray-900">{card.price}</span>
                <span className="text-[10px] text-gray-400">{card.priceNote}</span>
              </div>

              <p className="mt-2 rounded-lg bg-gray-50 px-2 py-1 text-[9px] font-semibold text-gray-500">
                Best for: {card.bestFor}
              </p>

              <ul className="mt-2 flex-1 space-y-1">
                {card.features.map((f) => (
                  <li key={f} className="flex items-center gap-1.5 text-[10px] text-gray-600">
                    <Check className="h-3 w-3 shrink-0 text-emerald-500" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    trackViewPlan(card.title.toLowerCase().replace(/\s/g, '_'), 'plans_hub');
                    router.push(card.href);
                  }}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 active:scale-[0.97] ${
                    card.popular
                      ? 'bg-[var(--color-primary)] text-white hover:opacity-90'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {card.cta} <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => router.push(card.href)}
                  className="flex items-center gap-0.5 rounded-xl border border-gray-200 px-3 py-2 text-[10px] font-semibold text-gray-600 transition-all hover:bg-gray-50"
                >
                  Details <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── TRUST — inline badges (matches dashboard style) */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 sm:gap-x-6 sm:gap-y-3">
          {[
            { icon: CheckCircle2, label: '500+ businesses' },
            { icon: CheckCircle2, label: '15 min avg pickup' },
            { icon: CheckCircle2, label: 'GST billing' },
            { icon: CheckCircle2, label: 'Transparent pricing' },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <span key={t.label} className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500">
                <Icon className="h-3 w-3 text-emerald-500" strokeWidth={2} />
                {t.label}
              </span>
            );
          })}
        </div>

        {/* ── BOTTOM CTA — matches dashboard dark card ────── */}
        <div className="mt-5 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 page-card text-white">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold">Not sure which plan fits?</p>
              <p className="mt-0.5 text-[10px] text-white/50">Calculator finds the cheapest option</p>
            </div>
            <button
              type="button"
              onClick={() => {
                trackViewPlan('custom', 'bottom_cta');
                router.push(ROUTES.PLANS_CUSTOM);
              }}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-gray-900 shadow transition-all hover:shadow-md active:scale-[0.98]"
            >
              <Calculator className="h-3.5 w-3.5" /> Calculate
            </button>
          </div>
        </div>

        {/* ── Talk to Expert — simple link row ────────────── */}
        <div className="mt-3 flex w-full min-w-0 justify-center px-0">
          <button
            type="button"
            onClick={() => router.push(ROUTES.CONTACT)}
            className="flex min-h-12 w-full max-w-md items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-3 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md active:scale-[0.98] sm:w-auto sm:min-h-11 sm:py-2.5"
          >
            <Phone className="h-3.5 w-3.5 text-gray-400" /> Talk to Expert
          </button>
        </div>
      </div>
      </div>

      {/* ── STICKY MOBILE CTA — matches dashboard bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-100 bg-white/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl sm:hidden">
        <div className="mx-auto flex min-w-0 max-w-6xl flex-col gap-2 px-4 md:px-6">
          <button
            type="button"
            onClick={() => {
              const popular = tabData.cards.find((c) => c.popular) ?? tabData.cards[0];
              trackViewPlan(popular.title.toLowerCase().replace(/\s/g, '_'), 'sticky_cta');
              router.push(popular.href);
            }}
            className="flex min-h-[52px] w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--color-primary)] py-3.5 text-xs font-bold text-white shadow-lg shadow-[var(--color-primary)]/20 transition-all active:scale-[0.98]"
          >
            <Star className="h-3.5 w-3.5" /> Get Best Plan
          </button>
          <button
            type="button"
            onClick={() => {
              trackViewPlan('custom', 'sticky_cta');
              router.push(ROUTES.PLANS_CUSTOM);
            }}
            className="flex min-h-[48px] w-full items-center justify-center gap-1 rounded-xl border border-[var(--color-primary)]/30 bg-blue-50 px-4 py-3 text-xs font-bold text-[var(--color-primary)] transition-all active:scale-[0.98]"
          >
            <Calculator className="h-3.5 w-3.5" /> Calculator
          </button>
        </div>
      </div>
    </div>
  );
}
