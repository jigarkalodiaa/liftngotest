'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  BadgeCheck,
  FileText,
  Info,
  LayoutDashboard,
  PiggyBank,
  ShieldCheck,
  Truck,
  X,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { navigateToProductPath } from '@/lib/auth/productGate';
import { ROUTES } from '@/lib/constants';
import { NOIDA_QUICK_FARE_MODAL_ENTRIES } from '@/lib/pricing/noidaQuickFareCopy';
import { LEASE_PLANS } from '@/lib/pricing/leasePlans';
import {
  INDICATIVE_PRICING_FOOTNOTE,
  SUBSCRIPTION_HUB_CARD_ESSENTIAL_SHORT,
  TOLL_CHARGES_SEPARATE_NOTE,
} from '@/lib/pricing/subscriptionDisclosures';
import {
  SUBSCRIPTION_PACKS_3W,
  formatSubscriptionRupee,
  subscriptionHighlighted3WPack,
  subscriptionPackById,
} from '@/lib/pricing/subscriptionPacks';
import { trackBookNowClick } from '@/lib/analytics';

export const NOIDA_PRODUCT_TARGETS = {
  subscription: ROUTES.PLANS_SUBSCRIPTION,
  lease: ROUTES.PLANS_LEASE,
  withDriver: ROUTES.PICKUP_LOCATION,
  withoutDriver: ROUTES.PLANS_RENT,
  vendor: ROUTES.GROW_WITH_LIFTNGO,
} as const;

export type NoidaProductKey = keyof typeof NOIDA_PRODUCT_TARGETS;

type ServiceTile = {
  key: NoidaProductKey;
  title: string;
  bullets: readonly string[];
};

const HIGHLIGHT_3W = subscriptionHighlighted3WPack();
const PACK_4W = subscriptionPackById('4w-growth');

const SERVICE_TILES: ServiceTile[] = [
  {
    key: 'subscription',
    title: 'Subscription',
    bullets: ['Prepaid 3W trip packs · locked in-pack per-trip rates', 'Save vs ad hoc on recurring lanes'],
  },
  {
    key: 'lease',
    title: 'Lease',
    bullets: ['6 / 12 month dedicated vehicle', 'Monthly figures match /plans/lease checkout'],
  },
  {
    key: 'withDriver',
    title: 'With driver (on-demand)',
    bullets: ['Per-trip booking · 2W / 3W / 4W', 'Live quote before you pay'],
  },
  {
    key: 'withoutDriver',
    title: 'Without driver (rental)',
    bullets: ['Daily · weekly · monthly self-drive blocks', 'Toggle options on the rent page'],
  },
  {
    key: 'vendor',
    title: 'Vendor verified',
    bullets: ['Partner onboarding · verified network', 'For suppliers listing on Liftngo'],
  },
];

const USE_CASE_CHIPS: { id: string; label: string; suggest: NoidaProductKey }[] = [
  { id: 'daily', label: 'Daily deliveries', suggest: 'subscription' },
  { id: 'bulk', label: 'Bulk / transfers', suggest: 'lease' },
  { id: 'onetime', label: 'One-off load', suggest: 'withDriver' },
  { id: 'selfdrive', label: 'Self-drive block', suggest: 'withoutDriver' },
  { id: 'partner', label: 'Sell as partner', suggest: 'vendor' },
];

const BENEFITS: { icon: LucideIcon; title: string; line: string }[] = [
  { icon: PiggyBank, title: 'Cost control', line: 'Packs and leases cap unit economics vs pure ad hoc.' },
  { icon: ShieldCheck, title: 'Reliability', line: 'Verified drivers and clear vehicle class per booking.' },
  { icon: Zap, title: 'Speed', line: 'Same-day goods lanes · priority on higher subscription tiers.' },
];

const CARD =
  'rounded-2xl border border-gray-200/90 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/25 hover:shadow-md sm:p-6';

const DASHBOARD_EXTRAS: { label: string; hint: string; href: string; icon: LucideIcon }[] = [
  { label: 'GST billing', hint: 'Tax-ready invoices', href: ROUTES.PLANS_GST, icon: FileText },
  { label: 'Noida dashboard', hint: 'Same home as /noida', href: ROUTES.NOIDA, icon: LayoutDashboard },
  { label: 'Own fleet', hint: 'Assign & track', href: ROUTES.NOIDA_FLEET_TECH, icon: Truck },
];

export function NoidaB2bProductHeroActions() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        onClick={() => navigateToProductPath(router, ROUTES.PLANS)}
        className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-white/50 bg-white/10 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-white/15 active:scale-[0.99]"
      >
        Choose plan
      </button>
      <button
        type="button"
        onClick={() => {
          trackBookNowClick('noida_b2b_product_hero_book');
          navigateToProductPath(router, ROUTES.PICKUP_LOCATION);
        }}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90 active:scale-[0.99]"
      >
        Book ride
      </button>
      <button
        type="button"
        onClick={() => navigateToProductPath(router, ROUTES.CONTACT)}
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/35 bg-transparent px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10 active:scale-[0.99]"
      >
        Contact
      </button>
    </div>
  );
}

function goService(router: ReturnType<typeof useRouter>, key: NoidaProductKey) {
  if (key === 'withDriver') trackBookNowClick(`noida_b2b_product_${key}`);
  navigateToProductPath(router, NOIDA_PRODUCT_TARGETS[key]);
}

export function NoidaB2bProductMirrorBody() {
  const router = useRouter();
  const [useCase, setUseCase] = useState<string | null>(null);
  const suggested = useMemo(() => USE_CASE_CHIPS.find((c) => c.id === useCase)?.suggest ?? null, [useCase]);

  return (
    <>
      <section className="scroll-mt-24" aria-labelledby="benefits-heading">
        <h2 id="benefits-heading" className="text-lg font-bold text-gray-900 sm:text-xl">
          Why Noida teams use Liftngo
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-3 text-sm font-bold text-gray-900 sm:text-base">{b.title}</h3>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">{b.line}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500 sm:text-sm">
          <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
          Verified partners · GST invoicing on applicable charges · Noida zone in the app
        </p>
      </section>

      <section id="services" aria-labelledby="selector-heading" className="scroll-mt-24 pt-10">
        <h2 id="selector-heading" className="text-lg font-bold text-gray-900 sm:text-xl">
          Pick how you want to move goods
        </h2>
        <p className="mt-1 text-sm text-gray-600">Same destinations as the Noida dashboard—sign in if prompted.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {SERVICE_TILES.map((s) => {
            const active = suggested === s.key;
            return (
              <div
                key={s.key}
                role="button"
                tabIndex={0}
                onClick={() => goService(router, s.key)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goService(router, s.key);
                  }
                }}
                className={`${CARD} cursor-pointer ${active ? 'ring-2 ring-[var(--funnel-action)] ring-offset-2' : ''}`}
              >
                <h3 className="font-semibold text-gray-900">{s.title}</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-gray-700">
                  {s.bullets.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)]">
                  Continue
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50/90 p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Also in your dashboard</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {DASHBOARD_EXTRAS.map((x) => {
              const Icon = x.icon;
              return (
                <button
                  key={x.href}
                  type="button"
                  onClick={() => navigateToProductPath(router, x.href)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-xs font-semibold text-gray-900 shadow-sm transition-all hover:border-[var(--color-primary)]/30 hover:shadow md:text-sm"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-700">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span>
                    {x.label}
                    <span className="mt-0.5 block text-[10px] font-normal text-gray-500 sm:text-xs">{x.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-14 scroll-mt-24" aria-labelledby="plans-data-heading">
        <h2 id="plans-data-heading" className="text-lg font-bold text-gray-900 sm:text-xl">
          Real plan numbers (in-app)
        </h2>
        <p className="mt-1 text-sm text-gray-600">Pulled from live configs—what you see on /plans.</p>

        <h3 className="mt-8 text-xs font-bold uppercase tracking-wide text-gray-500">Subscription · 3W packs</h3>
        <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-3 py-2 font-semibold text-gray-900">Pack</th>
                <th className="px-3 py-2 font-semibold text-gray-900">Trips</th>
                <th className="px-3 py-2 font-semibold text-gray-900">/ trip</th>
                <th className="px-3 py-2 font-semibold text-gray-900">Pack total</th>
              </tr>
            </thead>
            <tbody>
              {SUBSCRIPTION_PACKS_3W.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-3 py-2 font-medium text-gray-900">
                    {p.name}
                    {p.popular ? <span className="ml-1 text-xs font-normal text-emerald-600">· popular</span> : null}
                  </td>
                  <td className="px-3 py-2 text-gray-700">{p.trips}</td>
                  <td className="px-3 py-2 text-gray-700">{formatSubscriptionRupee(p.perTrip)}</td>
                  <td className="px-3 py-2 text-gray-700">{formatSubscriptionRupee(p.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          Highlights: 4W Growth pack (
          {PACK_4W ? `${formatSubscriptionRupee(PACK_4W.perTrip)}/trip × ${PACK_4W.trips} trips` : 'see subscription'}) lives on{' '}
          <button
            type="button"
            onClick={() => navigateToProductPath(router, ROUTES.PLANS_SUBSCRIPTION)}
            className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
          >
            subscription
          </button>
          . Entry 3W tiers reference ~₹299/trip before add-ons; Growth locks {formatSubscriptionRupee(HIGHLIGHT_3W.perTrip)}/trip in-pack.
        </p>
        <button
          type="button"
          onClick={() => navigateToProductPath(router, ROUTES.PLANS_SUBSCRIPTION)}
          className="mt-4 text-sm font-bold text-[var(--color-primary)] underline-offset-2 hover:underline"
        >
          Open subscription →
        </button>

        <h3 className="mt-10 text-xs font-bold uppercase tracking-wide text-gray-500">Lease · monthly</h3>
        <p className="mt-2 text-xs text-gray-500">6 or 12 month terms · prepay + GST at checkout (same as lease page).</p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-3 py-2 font-semibold text-gray-900">Vehicle</th>
                <th className="px-3 py-2 font-semibold text-gray-900">12 mo / mo</th>
                <th className="px-3 py-2 font-semibold text-gray-900">6 mo / mo</th>
              </tr>
            </thead>
            <tbody>
              {LEASE_PLANS.map((row) => (
                <tr key={row.vehicle} className="border-b border-gray-50 last:border-0">
                  <td className="px-3 py-2 font-medium text-gray-900">{row.vehicle}</td>
                  <td className="px-3 py-2 text-gray-700">{formatSubscriptionRupee(row.term12)}</td>
                  <td className="px-3 py-2 text-gray-700">{formatSubscriptionRupee(row.term6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={() => navigateToProductPath(router, ROUTES.PLANS_LEASE)}
          className="mt-4 text-sm font-bold text-[var(--color-primary)] underline-offset-2 hover:underline"
        >
          Open lease →
        </button>
      </section>

      <section className="mt-14 scroll-mt-24" aria-labelledby="use-case-heading">
        <h2 id="use-case-heading" className="text-lg font-bold text-gray-900 sm:text-xl">
          What are you solving?
        </h2>
        <p className="mt-1 text-sm text-gray-600">Highlights the matching model above.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {USE_CASE_CHIPS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setUseCase(c.id)}
              className={`min-h-10 rounded-full border px-4 py-2 text-xs font-bold transition-all sm:text-sm ${
                useCase === c.id
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        {suggested ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-950">
            <span className="font-semibold">Suggested:</span>{' '}
            {SERVICE_TILES.find((t) => t.key === suggested)?.title ?? suggested}
            <button
              type="button"
              onClick={() => goService(router, suggested)}
              className="ml-2 font-bold text-[var(--color-primary)] underline underline-offset-2 hover:opacity-80"
            >
              Continue →
            </button>
          </div>
        ) : null}
      </section>

      <section className="mt-14 scroll-mt-24" aria-labelledby="pricing-heading">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="pricing-heading" className="text-lg font-bold text-gray-900 sm:text-xl">
            Pricing snapshot
          </h2>
          <PricingFareModal />
        </div>
        <p className="mt-1 text-sm text-gray-600">Indicative anchors—confirm live quote in flow.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {NOIDA_QUICK_FARE_MODAL_ENTRIES.map((e) => (
            <span
              key={e.title}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm sm:text-sm"
            >
              <span className="text-gray-500">{e.title.split('—')[0].trim()}:</span>
              <span className="ml-1.5 text-[var(--color-primary)]">{e.kicker}</span>
            </span>
          ))}
          <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm sm:text-sm">
            <span className="text-gray-500">3W Growth (ex.):</span>
            <span className="ml-1.5 text-[var(--color-primary)]">{formatSubscriptionRupee(HIGHLIGHT_3W.perTrip)}/trip in-pack</span>
          </span>
        </div>
        <p className="mt-3 text-xs text-gray-500">{INDICATIVE_PRICING_FOOTNOTE}</p>
      </section>

      <section className="mt-14 rounded-2xl bg-[#1A1D3A] px-6 py-10 text-center text-white" aria-labelledby="final-cta-heading">
        <h2 id="final-cta-heading" className="text-xl font-bold sm:text-2xl">
          Start in Noida on Liftngo
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/80">Book a ride, lock a pack, or talk to us for lane design.</p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => {
              trackBookNowClick('noida_b2b_product_footer_book');
              navigateToProductPath(router, ROUTES.PICKUP_LOCATION);
            }}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[#1A1D3A] transition-colors hover:bg-gray-100 active:scale-[0.99]"
          >
            Book ride
          </button>
          <button
            type="button"
            onClick={() => navigateToProductPath(router, ROUTES.PLANS)}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border-2 border-white/60 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10 active:scale-[0.99]"
          >
            Choose plan
          </button>
          <button
            type="button"
            onClick={() => navigateToProductPath(router, ROUTES.CONTACT)}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/15 active:scale-[0.99]"
          >
            Contact
          </button>
        </div>
      </section>
    </>
  );
}

function PricingFareModal() {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClose = () => {};
    d.addEventListener('close', onClose);
    return () => d.removeEventListener('close', onClose);
  }, []);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 active:scale-95"
        aria-label="Fare and distance details"
        onClick={() => ref.current?.showModal()}
      >
        <Info className="h-4 w-4" aria-hidden />
      </button>
      <dialog
        ref={ref}
        className="w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-gray-200 bg-white p-0 text-gray-900 shadow-2xl backdrop:bg-black/40 open:flex open:flex-col"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-5">
          <h3 className="text-base font-bold">How fares work</h3>
          <button
            type="button"
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
            aria-label="Close"
            onClick={() => ref.current?.close()}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="max-h-[min(75vh,32rem)] overflow-y-auto px-4 py-4 text-sm leading-relaxed text-gray-700 sm:px-5">
          <ul className="list-inside list-disc space-y-2">
            {NOIDA_QUICK_FARE_MODAL_ENTRIES.map((e) => (
              <li key={e.title}>
                <strong className="text-gray-900">{e.kicker}</strong> — {e.body}
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-900">Pack distance (3W)</p>
            <ul className="mt-2 space-y-1 text-xs text-gray-600">
              {SUBSCRIPTION_HUB_CARD_ESSENTIAL_SHORT.map((row) => (
                <li key={row.label}>
                  <span className="font-medium text-gray-800">{row.label}:</span> {row.value}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs text-gray-600">{TOLL_CHARGES_SEPARATE_NOTE}</p>
          <p className="mt-2 text-xs text-gray-600">
            Standard loading / unloading at your premises is included; long waits or extra labour may need a separate quote (plan terms).
          </p>
          <p className="mt-4 text-xs text-gray-500">{INDICATIVE_PRICING_FOOTNOTE}</p>
        </div>
      </dialog>
    </>
  );
}
