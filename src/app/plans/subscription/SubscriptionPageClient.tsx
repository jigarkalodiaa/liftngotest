'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { subscriptionPackCheckoutHref } from '@/lib/pricing/subscriptionPacks';
import {
  INDICATIVE_PRICING_FOOTNOTE,
  SUBSCRIPTION_COMPLIANCE_BULLETS,
  SUBSCRIPTION_PACK_BENEFITS,
  TOLL_CHARGES_SEPARATE_NOTE,
} from '@/lib/pricing/subscriptionDisclosures';
import {
  SUBSCRIPTION_PACKS_3W,
  subscriptionPackByName,
  subscriptionPackToTierUI,
  type SubscriptionTierUI,
} from '@/lib/pricing/subscriptionPacks';
import PlansSubPageShell from '../PlansSubPageShell';
import { trackPlanSelected, trackCheckoutStarted, trackViewPlan } from '@/lib/analytics';
import { Check, Star, ArrowRight, Phone, Sparkles, Info, X, Shield } from 'lucide-react';

const TIERS: SubscriptionTierUI[] = SUBSCRIPTION_PACKS_3W.map(subscriptionPackToTierUI);

function tierByLockedParam(raw: string | null): SubscriptionTierUI | null {
  if (!raw) return null;
  const p = subscriptionPackByName(raw);
  if (!p || p.group !== '3w') return null;
  return subscriptionPackToTierUI(p);
}

type SubInfoOpen =
  | null
  | { kind: 'why_pack' }
  | { kind: 'tier'; tier: SubscriptionTierUI }
  | { kind: 'compliance' };

export default function SubscriptionPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lockedTier = useMemo(() => tierByLockedParam(searchParams.get('locked')), [searchParams]);
  const [infoOpen, setInfoOpen] = useState<SubInfoOpen>(null);

  const [selected, setSelected] = useState<string>(() => lockedTier?.name ?? 'Growth');

  useEffect(() => {
    if (lockedTier) setSelected(lockedTier.name);
  }, [lockedTier]);

  useEffect(() => {
    if (!infoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setInfoOpen(null);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [infoOpen]);

  const lockedIndex = lockedTier ? TIERS.findIndex((t) => t.name === lockedTier.name) : -1;
  const nextTier = lockedIndex >= 0 && lockedIndex < TIERS.length - 1 ? TIERS[lockedIndex + 1] : null;
  const bestTier = TIERS.find((t) => t.offer) ?? TIERS.find((t) => t.popular) ?? null;
  const showBestUpsell =
    lockedTier && bestTier && bestTier.name !== lockedTier.name && bestTier.name !== nextTier?.name;

  const clearLockedHref = ROUTES.PLANS_SUBSCRIPTION;

  const shellSubtitle = lockedTier
    ? `You chose ${lockedTier.name}. Lock it below or step up to a bigger pack in one tap.`
    : 'Fixed trips in the standard window — tap ⓘ anytime for full benefits and fine print.';

  return (
    <PlansSubPageShell
      title="Subscription plans"
      subtitle={shellSubtitle}
      badge="Trip bundles"
      contentClassName="-mt-6"
    >
      {lockedTier ? (
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-2.5 py-1 text-[10px] font-semibold text-emerald-900 md:px-3 md:text-[11px]">
            <Check className="h-3 w-3 shrink-0 text-emerald-600 md:h-3.5 md:w-3.5" strokeWidth={2.5} aria-hidden />
            Selected: {lockedTier.name}
          </p>
          <Link
            href={clearLockedHref}
            className="text-center text-[10px] font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline sm:text-left md:text-xs"
          >
            See all packs
          </Link>
        </div>
      ) : null}

      {/* Compact strip — long lists live behind ⓘ */}
      <div className="flex items-start justify-between gap-3 rounded-xl border border-emerald-200/90 bg-emerald-50/80 px-3 py-2.5 shadow-sm md:items-center md:px-4 md:py-3">
        <p className="min-w-0 text-[10px] leading-snug text-emerald-900 md:text-[11px]">
          <span className="font-bold text-emerald-950">Why packs:</span>{' '}
          predictable per-trip rates, 30-day validity, GST-ready basics — full list in ⓘ.
        </p>
        <button
          type="button"
          onClick={() => setInfoOpen({ kind: 'why_pack' })}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-emerald-300/60 bg-white text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
          aria-label="Subscription pack benefits and what’s included"
        >
          <Info className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
        </button>
      </div>

      {lockedTier ? (
        <>
          <div className="mx-auto mt-5 max-w-lg md:mt-6">
            <TierCard
              tier={lockedTier}
              isSelected={selected === lockedTier.name}
              emphasis="primary"
              compact
              onTierInfo={() => setInfoOpen({ kind: 'tier', tier: lockedTier })}
              onLock={() => {
                setSelected(lockedTier.name);
                trackPlanSelected(lockedTier.name, 'subscription_locked');
                trackCheckoutStarted('subscription', lockedTier.total);
                router.push(subscriptionPackCheckoutHref(lockedTier.name));
              }}
            />
          </div>

          {(nextTier || showBestUpsell) && (
            <div className="mt-6 md:mt-7">
              <div className="mb-2 flex items-center gap-2 md:mb-3">
                <Sparkles className="h-3.5 w-3.5 text-amber-500 md:h-4 md:w-4" strokeWidth={2} aria-hidden />
                <h2 className="text-xs font-bold text-gray-900 md:text-sm">Upgrade — more trips, lower per-trip</h2>
              </div>
              <div className={`grid min-w-0 gap-3 md:gap-4 ${nextTier && showBestUpsell ? 'md:grid-cols-2' : 'md:max-w-lg'}`}>
                {nextTier ? (
                  <TierCard
                    tier={nextTier}
                    isSelected={selected === nextTier.name}
                    emphasis="upsell"
                    upsellLabel="Next pack"
                    compact
                    compactFeatureCount={2}
                    onTierInfo={() => setInfoOpen({ kind: 'tier', tier: nextTier })}
                    onLock={() => {
                      setSelected(nextTier.name);
                      trackPlanSelected(nextTier.name, 'subscription_upgrade_next');
                      trackCheckoutStarted('subscription', nextTier.total);
                      router.push(subscriptionPackCheckoutHref(nextTier.name));
                    }}
                  />
                ) : null}
                {showBestUpsell && bestTier ? (
                  <TierCard
                    tier={bestTier}
                    isSelected={selected === bestTier.name}
                    emphasis="upsell"
                    upsellLabel="Best value"
                    compact
                    compactFeatureCount={2}
                    onTierInfo={() => setInfoOpen({ kind: 'tier', tier: bestTier })}
                    onLock={() => {
                      setSelected(bestTier.name);
                      trackPlanSelected(bestTier.name, 'subscription_upgrade_best');
                      trackCheckoutStarted('subscription', bestTier.total);
                      router.push(subscriptionPackCheckoutHref(bestTier.name));
                    }}
                  />
                ) : null}
              </div>
            </div>
          )}

          {!nextTier && lockedTier.offer ? (
            <p className="mx-auto mt-6 max-w-lg rounded-2xl border border-gray-200 bg-white p-3 text-center text-[11px] text-gray-600 shadow-sm md:mt-7 md:p-4 md:text-sm">
              You&apos;re on our largest standard pack. Need custom volume?{' '}
              <button
                type="button"
                className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
                onClick={() => router.push(ROUTES.CONTACT)}
              >
                Talk to sales
              </button>
            </p>
          ) : null}
        </>
      ) : (
        <div className="mt-6 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 xl:grid-cols-3">
          {TIERS.map((tier) => (
            <TierCard
              key={tier.name}
              tier={tier}
              isSelected={selected === tier.name}
              emphasis="grid"
              onTierInfo={() => setInfoOpen({ kind: 'tier', tier })}
              onLock={() => {
                setSelected(tier.name);
                trackPlanSelected(tier.name, 'subscription');
                trackCheckoutStarted('subscription', tier.total);
                router.push(subscriptionPackCheckoutHref(tier.name));
              }}
            />
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:mt-7">
        <button
          type="button"
          onClick={() => setInfoOpen({ kind: 'compliance' })}
          className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-[11px] font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-50"
        >
          <Shield className="h-3.5 w-3.5 text-gray-500" strokeWidth={2} aria-hidden />
          Validity, compliance &amp; legal
        </button>
        <Link
          href="/terms"
          className="inline-flex min-h-10 items-center rounded-xl px-3 py-2 text-[11px] font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
        >
          Terms
        </Link>
      </div>

      <div className="mt-6 rounded-xl border border-gray-100 bg-white p-3 text-center shadow-sm md:mt-7 md:p-5">
        <p className="text-xs font-bold text-gray-900 md:text-sm">Custom plan — or uneasy before you pay?</p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-gray-600 md:text-xs">
          Trip packs are real money upfront. A consultant clarifies pack fit, GST invoices, and what happens after checkout — same-day callback, no obligation.
        </p>
        <button
          type="button"
          onClick={() => {
            trackViewPlan('consultant_trust_cta', 'subscription_page');
            router.push(ROUTES.CONTACT);
          }}
          className="mt-3 inline-flex min-h-10 w-full max-w-xs items-center justify-center gap-1.5 rounded-xl border-2 border-[var(--color-primary)]/45 bg-white px-4 py-2 text-xs font-bold text-[var(--color-primary)] shadow-sm transition-all hover:bg-blue-50 active:scale-[0.98] sm:w-auto"
        >
          <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Talk to a consultant
        </button>
      </div>

      {infoOpen ? (
        <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-4" role="presentation">
          <button
            type="button"
            className="absolute inset-0 z-0 bg-slate-900/45 backdrop-blur-[2px]"
            aria-label="Close"
            onClick={() => setInfoOpen(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sub-info-title"
            className="relative z-10 flex max-h-[min(88vh,100dvh)] w-full max-w-md flex-col overflow-hidden rounded-t-[1.35rem] bg-white shadow-2xl ring-1 ring-slate-900/[0.06] sm:max-h-[min(92vh,820px)] sm:rounded-2xl"
          >
            <div className="flex shrink-0 justify-center pt-2.5 sm:hidden" aria-hidden>
              <div className="h-1 w-11 rounded-full bg-slate-200/90" />
            </div>
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-4 pb-3 pt-2 sm:px-5 sm:pb-4 sm:pt-4">
              <h2 id="sub-info-title" className="pr-2 text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                {infoOpen.kind === 'why_pack' && 'Why subscription packs'}
                {infoOpen.kind === 'tier' && `${infoOpen.tier.name} — inclusions`}
                {infoOpen.kind === 'compliance' && 'Validity, compliance & legal'}
              </h2>
              <button
                type="button"
                onClick={() => setInfoOpen(null)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-sm hover:bg-slate-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 sm:px-5 sm:py-4">
              {infoOpen.kind === 'why_pack' ? (
                <div className="space-y-3">
                  <p className="text-[11px] leading-relaxed text-slate-600 sm:text-xs">{TOLL_CHARGES_SEPARATE_NOTE}</p>
                  <ul className="space-y-2">
                    {SUBSCRIPTION_PACK_BENEFITS.map((line, i) => (
                      <li key={i} className="flex gap-2 text-[12px] leading-snug text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="rounded-lg bg-slate-100/90 px-2.5 py-2 text-[10px] leading-snug text-slate-600 sm:text-[11px]">
                    {INDICATIVE_PRICING_FOOTNOTE}
                  </p>
                </div>
              ) : null}

              {infoOpen.kind === 'tier' ? (
                <div className="space-y-3">
                  <p className="text-[12px] text-slate-600">
                    <strong className="text-slate-900">₹{infoOpen.tier.total.toLocaleString('en-IN')}</strong>
                    <span className="text-slate-500">
                      {' '}
                      · ₹{infoOpen.tier.perTrip}/trip · {infoOpen.tier.trips} trips
                    </span>
                  </p>
                  <ul className="space-y-1.5">
                    {infoOpen.tier.features.map((f) => (
                      <li key={f} className="flex gap-2 text-[12px] leading-snug text-slate-700">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] leading-snug text-slate-500 sm:text-[11px]">{INDICATIVE_PRICING_FOOTNOTE}</p>
                </div>
              ) : null}

              {infoOpen.kind === 'compliance' ? (
                <div className="space-y-3">
                  <ul className="space-y-2">
                    {SUBSCRIPTION_COMPLIANCE_BULLETS.map((line, i) => (
                      <li key={i} className="flex gap-2 text-[11px] leading-relaxed text-slate-700 sm:text-xs">
                        <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" strokeWidth={2} aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] leading-snug text-slate-500 sm:text-[11px]">{INDICATIVE_PRICING_FOOTNOTE}</p>
                  <Link
                    href="/terms"
                    onClick={() => setInfoOpen(null)}
                    className="inline-block text-[11px] font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
                  >
                    Full Terms of Service
                  </Link>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => setInfoOpen(null)}
                className="mt-4 w-full rounded-xl bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </PlansSubPageShell>
  );
}

function TierCard({
  tier,
  isSelected,
  emphasis,
  upsellLabel,
  compact,
  compactFeatureCount = 3,
  onTierInfo,
  onLock,
}: {
  tier: SubscriptionTierUI;
  isSelected: boolean;
  emphasis: 'primary' | 'upsell' | 'grid';
  upsellLabel?: string;
  compact?: boolean;
  compactFeatureCount?: number;
  onTierInfo?: () => void;
  onLock: () => void;
}) {
  const borderClass =
    emphasis === 'primary'
      ? 'border-2 border-[var(--color-primary)] bg-white shadow-lg shadow-blue-900/10 ring-2 ring-[var(--color-primary)]/15'
      : emphasis === 'upsell'
        ? 'border-2 border-amber-200/90 bg-gradient-to-b from-amber-50/40 to-white shadow-md'
        : isSelected
          ? 'border-2 border-[var(--color-primary)] bg-white shadow-lg shadow-blue-900/10'
          : 'border-2 border-gray-100 bg-white shadow-sm hover:shadow-md';

  const showCompact = Boolean(compact);
  const visibleFeatures = showCompact ? tier.features.slice(0, compactFeatureCount) : tier.features;
  const hiddenCount = showCompact ? Math.max(0, tier.features.length - compactFeatureCount) : 0;

  return (
    <div
      className={`relative flex min-w-0 flex-col overflow-x-clip rounded-2xl p-3 transition-all duration-200 md:p-4 ${borderClass}`}
    >
      {upsellLabel ? (
        <span className="absolute right-0 top-0 rounded-bl-xl bg-amber-500 px-2.5 py-0.5 text-[9px] font-bold uppercase text-white md:px-3 md:text-[10px]">
          {upsellLabel}
        </span>
      ) : null}
      {!upsellLabel && tier.popular ? (
        <span className="absolute right-0 top-0 flex items-center gap-0.5 rounded-bl-xl bg-[var(--color-primary)] px-2.5 py-0.5 text-[9px] font-bold uppercase text-white md:text-[10px]">
          <Star className="h-2.5 w-2.5 fill-white md:h-3 md:w-3" /> Popular
        </span>
      ) : null}
      {!upsellLabel && tier.offer ? (
        <span className="absolute right-0 top-0 rounded-bl-xl bg-orange-500 px-2.5 py-0.5 text-[9px] font-bold uppercase text-white md:text-[10px]">
          Best value
        </span>
      ) : null}

      <div className={`flex items-start justify-between gap-3 ${upsellLabel || tier.popular || tier.offer ? 'pt-1' : ''}`}>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <h2 className="text-base font-bold text-gray-900 md:text-lg">{tier.name}</h2>
            {onTierInfo ? (
              <button
                type="button"
                onClick={onTierInfo}
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition-colors hover:bg-gray-50"
                aria-label={`${tier.name}: full inclusions and notes`}
              >
                <Info className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
              </button>
            ) : null}
          </div>
          <p className="text-xs text-gray-500 md:text-sm">{tier.trips} trips / window</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xl font-extrabold tabular-nums text-[var(--color-primary)] md:text-2xl">
            ₹{tier.total.toLocaleString('en-IN')}
          </p>
          <p className="text-[10px] text-gray-400 line-through md:text-xs">
            ₹{(tier.payPerUse * tier.trips).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5 md:mt-3 md:gap-2">
        <span className="rounded-full bg-blue-50 px-2 py-px text-[10px] font-bold text-blue-700 md:px-2.5 md:text-[11px]">
          ₹{tier.perTrip}/trip
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-px text-[10px] font-bold text-emerald-600 md:px-2.5 md:text-[11px]">
          Save ₹{tier.savings.toLocaleString('en-IN')}
        </span>
      </div>

      <ul className="mt-2.5 grid grid-cols-1 gap-y-1 sm:grid-cols-2 md:mt-3 md:gap-x-3 md:gap-y-1.5">
        {visibleFeatures.map((f) => (
          <li key={f} className="flex items-start gap-1.5 text-[11px] leading-snug text-gray-600 md:text-xs">
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500 md:h-3.5 md:w-3.5" strokeWidth={2.5} />
            {f}
          </li>
        ))}
      </ul>
      {hiddenCount > 0 && onTierInfo ? (
        <button
          type="button"
          onClick={onTierInfo}
          className="mt-1.5 w-fit text-[10px] font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline md:text-[11px]"
        >
          +{hiddenCount} more in ⓘ
        </button>
      ) : null}

      <div className="mt-3 flex min-w-0 md:mt-4">
        <button
          type="button"
          onClick={onLock}
          className={`flex min-h-11 w-full flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all active:scale-[0.98] md:min-h-12 md:py-3 md:text-sm ${
            emphasis === 'primary' || (emphasis === 'grid' && isSelected)
              ? 'bg-[var(--color-primary)] text-white shadow-sm'
              : emphasis === 'upsell'
                ? 'bg-amber-500 text-white shadow-sm hover:bg-amber-600'
                : 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
          }`}
        >
          {emphasis === 'upsell' ? `Choose ${tier.name}` : 'Lock this plan'}
          <ArrowRight className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" />
        </button>
      </div>
    </div>
  );
}
