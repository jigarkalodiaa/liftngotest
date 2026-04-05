'use client';

import { useState, useMemo, useCallback, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { INDICATIVE_PRICING_FOOTNOTE, TOLL_CHARGES_SEPARATE_NOTE } from '@/lib/pricing/subscriptionDisclosures';
import { trackCalculatorUsed, trackPlanSelected, trackCheckoutStarted } from '@/lib/analytics';
import { computeBulkPlanQuote, type VehicleClass } from '@/lib/pricing/bulkPlanQuote';
import { saveCustomPlanSession } from '@/lib/customPlanCheckoutSession';
import { ArrowRight, Plus, Trash2, Copy, Bike, Truck, Phone, Zap, ChevronRight } from 'lucide-react';
import PlansSubPageShell from '../PlansSubPageShell';

/* ── Vehicle UI meta (rates live in @/lib/pricing/bulkPlanQuote) ─ */

type VehicleType = VehicleClass;

const ALL_VEHICLE_TYPES: VehicleType[] = ['2W', '3W', '4W'];

const VEHICLE_META: Record<
  VehicleType,
  { label: string; icon: typeof Bike; color: string; accent: string; cornerFrom: string; iconShadow: string }
> = {
  '2W': {
    label: '2-Wheeler',
    icon: Bike,
    color: 'bg-sky-500',
    accent: 'border-l-sky-500',
    cornerFrom: 'from-sky-500/[0.12]',
    iconShadow: 'shadow-sm shadow-sky-900/15 ring-1 ring-sky-900/10',
  },
  '3W': {
    label: '3-Wheeler',
    icon: Truck,
    color: 'bg-emerald-500',
    accent: 'border-l-emerald-500',
    cornerFrom: 'from-emerald-500/[0.12]',
    iconShadow: 'shadow-sm shadow-emerald-900/15 ring-1 ring-emerald-900/10',
  },
  '4W': {
    label: '4-Wheeler',
    icon: Truck,
    color: 'bg-violet-500',
    accent: 'border-l-violet-500',
    cornerFrom: 'from-violet-500/[0.12]',
    iconShadow: 'shadow-sm shadow-violet-900/15 ring-1 ring-violet-900/10',
  },
};

type Recommendation = { type: 'subscription' | 'lease' | 'hybrid'; label: string; detail: string; href: string };

function getRecommendation(totalTrips: number, configs: VehicleConfig[]): Recommendation | null {
  const has4W = configs.some((c) => c.vehicle === '4W' && c.trips >= 30);
  if (has4W && totalTrips >= 60) {
    return { type: 'lease', label: 'Lease + Subscription Hybrid', detail: 'Lease the 4W for dedicated routes, subscribe for lighter loads.', href: ROUTES.PLANS_LEASE };
  }
  if (totalTrips >= 80) {
    return { type: 'lease', label: 'Vehicle Lease', detail: 'At this volume, a dedicated leased vehicle is more cost-effective.', href: ROUTES.PLANS_LEASE };
  }
  if (totalTrips >= 20) {
    return { type: 'subscription', label: 'Subscription Plan', detail: 'Lock in predictable pricing and save on every trip.', href: ROUTES.PLANS_SUBSCRIPTION };
  }
  return null;
}

/* ── Types ────────────────────────────────────────────────── */

interface VehicleConfig {
  id: string;
  vehicle: VehicleType;
  trips: number;
  distanceKm: number;
}

const MAX_VEHICLE_CONFIGS = ALL_VEHICLE_TYPES.length;

function firstUnusedVehicle(used: Iterable<VehicleType>): VehicleType | null {
  const taken = used instanceof Set ? used : new Set(used);
  for (const v of ALL_VEHICLE_TYPES) {
    if (!taken.has(v)) return v;
  }
  return null;
}

function createInitialConfig(): VehicleConfig {
  return { id: crypto.randomUUID(), vehicle: '3W', trips: 30, distanceKm: 10 };
}

function newConfigRow(existing: VehicleConfig[]): VehicleConfig {
  const used = new Set(existing.map((c) => c.vehicle));
  const vehicle = firstUnusedVehicle(used) ?? '3W';
  return { id: crypto.randomUUID(), vehicle, trips: 30, distanceKm: 10 };
}

/** % along track for WebKit filled rail (`--range-fill` on `.custom-plan-range`). */
function sliderFillPercent(value: number, min: number, max: number): string {
  if (max <= min) return '0%';
  const clamped = Math.min(max, Math.max(min, value));
  return `${((clamped - min) / (max - min)) * 100}%`;
}

/* ── Page ─────────────────────────────────────────────────── */

export default function CustomTripPage() {
  const router = useRouter();
  const [configs, setConfigs] = useState<VehicleConfig[]>(() => [createInitialConfig()]);

  const updateConfig = useCallback((id: string, patch: Partial<VehicleConfig>) => {
    setConfigs((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const removeConfig = useCallback((id: string) => {
    setConfigs((prev) => (prev.length <= 1 ? prev : prev.filter((c) => c.id !== id)));
  }, []);

  const duplicateConfig = useCallback((id: string) => {
    setConfigs((prev) => {
      if (prev.length >= MAX_VEHICLE_CONFIGS) return prev;
      const source = prev.find((c) => c.id === id);
      if (!source) return prev;
      const used = new Set(prev.map((c) => c.vehicle));
      const nextVehicle = firstUnusedVehicle(used);
      if (nextVehicle === null) return prev;
      return [...prev, { ...source, id: crypto.randomUUID(), vehicle: nextVehicle }];
    });
  }, []);

  const addConfig = useCallback(() => {
    setConfigs((prev) => {
      if (prev.length >= MAX_VEHICLE_CONFIGS) return prev;
      return [...prev, newConfigRow(prev)];
    });
  }, []);

  /* ── Calculations ──────────────────────────────── */

  const summary = useMemo(() => {
    const quote = computeBulkPlanQuote(configs);
    const lines = configs.map((c, i) => {
      const q = quote.lines[i];
      return {
        id: c.id,
        vehicle: c.vehicle,
        trips: c.trips,
        distanceKm: c.distanceKm,
        perTripDisplay: q.perTripDisplay,
        linePayTotal: q.linePayTotal,
      };
    });
    const rec = getRecommendation(quote.totalTrips, configs);

    return {
      ...quote,
      lines,
      rec,
    };
  }, [configs]);

  const handleProceed = useCallback(() => {
    trackCalculatorUsed({
      configs: configs.length,
      total_trips: summary.totalTrips,
      total_cost: summary.payTotal,
      recommended: summary.rec?.type || 'none',
    });
    if (summary.rec) {
      trackPlanSelected(summary.rec.label, 'custom_calculator');
    }
    trackCheckoutStarted('custom_plan_checkout', summary.payTotal);
    saveCustomPlanSession(configs.map(({ id, vehicle, trips, distanceKm }) => ({ id, vehicle, trips, distanceKm })));
    router.push(ROUTES.PLANS_CUSTOM_CHECKOUT);
  }, [configs, summary, router]);

  return (
    <PlansSubPageShell
      title={
        <>
          Build your custom <span className="whitespace-nowrap">logistics plan</span>
        </>
      }
      subtitle="Add multiple vehicles, set trips and distance for each — get instant pricing and a smart plan recommendation."
      badge={
        <span className="inline-flex items-center gap-1.5 normal-case">
          <Zap className="h-3 w-3" aria-hidden />
          Interactive calculator
        </span>
      }
      contentClassName="-mt-6"
    >
      <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-start lg:gap-6">
        <div className="min-w-0 flex-1">
          <div className="space-y-3">
            {configs.map((cfg) => {
              const meta = VEHICLE_META[cfg.vehicle];
              const VIcon = meta.icon;
              const usedElsewhere = new Set(
                configs.filter((c) => c.id !== cfg.id).map((c) => c.vehicle)
              );
              const tripsSliderMax = 200;
              const distSliderMax = 50;
              const tripsFill = {
                '--range-fill': sliderFillPercent(Math.min(cfg.trips, tripsSliderMax), 1, tripsSliderMax),
              } as CSSProperties;
              const distFill = {
                '--range-fill': sliderFillPercent(Math.min(cfg.distanceKm, distSliderMax), 1, distSliderMax),
              } as CSSProperties;
              return (
                <div
                  key={cfg.id}
                  className={`relative min-w-0 overflow-hidden rounded-xl border border-slate-200/70 border-l-[3px] bg-gradient-to-br from-white via-white to-slate-50/50 shadow-[0_10px_40px_-16px_rgba(15,23,42,0.14)] ring-1 ring-slate-900/[0.035] ${meta.accent}`}
                >
                  <div
                    className={`pointer-events-none absolute -right-8 -top-14 h-32 w-32 rotate-[30deg] bg-gradient-to-br ${meta.cornerFrom} via-transparent to-transparent`}
                    aria-hidden
                  />
                  <div className="relative p-3 sm:p-4">
                  {/* Card header */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100/90 pb-2.5">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white ${meta.color} ${meta.iconShadow}`}
                      >
                        <VIcon className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <div className="min-w-0">
                        <span className="block truncate text-[0.8125rem] font-bold tracking-tight text-[#1e1f4b]">{meta.label}</span>
                        <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-slate-400">Vehicle lane</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => duplicateConfig(cfg.id)}
                        disabled={configs.length >= MAX_VEHICLE_CONFIGS}
                        className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                        aria-label={`Duplicate ${meta.label} row`}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      {configs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeConfig(cfg.id)}
                          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label={`Remove ${meta.label}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Vehicle selector */}
                  <div className="mt-3">
                    <label className="block text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500">Switch type</label>
                    <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                      {ALL_VEHICLE_TYPES.map((v) => {
                        const active = cfg.vehicle === v;
                        const takenByOther = usedElsewhere.has(v);
                        const disabled = !active && takenByOther;
                        const vm = VEHICLE_META[v];
                        const VI = vm.icon;
                        return (
                          <button
                            key={v}
                            type="button"
                            disabled={disabled}
                            title={disabled ? 'Already selected in another configuration' : vm.label}
                            onClick={() => {
                              if (!disabled) updateConfig(cfg.id, { vehicle: v });
                            }}
                            className={`flex min-h-9 items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-bold leading-tight transition-all duration-150 sm:text-xs ${
                              active
                                ? `${vm.color} text-white shadow-md ring-2 ring-white/90 ring-offset-1 ring-offset-slate-100/80`
                                : disabled
                                  ? 'cursor-not-allowed border border-slate-100 bg-slate-50 text-slate-300'
                                  : 'border border-slate-200/90 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <VI className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2} />
                            <span className="truncate px-0.5">{vm.label.replace('-Wheeler', 'W')}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-1.5 text-[9px] leading-snug text-slate-400">One type per row · up to 3 lanes.</p>
                  </div>

                  {/* Trips + distance — inset panel */}
                  <div className="mt-3 rounded-xl border border-slate-200/60 bg-gradient-to-b from-slate-50/95 to-slate-100/35 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] sm:p-3">
                    <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">Volume &amp; distance</p>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-4">
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <label htmlFor={`trips-${cfg.id}`} className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500">
                          Trips / mo
                        </label>
                        <input
                          id={`trips-${cfg.id}`}
                          type="number"
                          min={1}
                          max={500}
                          value={cfg.trips}
                          onChange={(e) => updateConfig(cfg.id, { trips: Math.max(1, Number(e.target.value) || 1) })}
                          className="h-8 w-[4.25rem] shrink-0 rounded-lg border border-slate-200/90 bg-white px-1.5 text-center text-xs font-bold tabular-nums text-[#1e1f4b] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/18"
                        />
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={tripsSliderMax}
                        step={1}
                        value={Math.min(cfg.trips, tripsSliderMax)}
                        onChange={(e) => updateConfig(cfg.id, { trips: Number(e.target.value) })}
                        className="custom-plan-range mt-1.5"
                        style={tripsFill}
                        aria-label={`Trips per month for ${meta.label}`}
                      />
                      <div className="mt-0.5 flex justify-between font-medium tabular-nums text-[9px] text-slate-400">
                        <span>1</span>
                        <span>{tripsSliderMax}+</span>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <label htmlFor={`km-${cfg.id}`} className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500">
                          Avg km
                        </label>
                        <input
                          id={`km-${cfg.id}`}
                          type="number"
                          min={1}
                          max={100}
                          value={cfg.distanceKm}
                          onChange={(e) => updateConfig(cfg.id, { distanceKm: Math.max(1, Number(e.target.value) || 1) })}
                          className="h-8 w-[4.25rem] shrink-0 rounded-lg border border-slate-200/90 bg-white px-1.5 text-center text-xs font-bold tabular-nums text-[#1e1f4b] shadow-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/18"
                        />
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={distSliderMax}
                        step={1}
                        value={Math.min(cfg.distanceKm, distSliderMax)}
                        onChange={(e) => updateConfig(cfg.id, { distanceKm: Number(e.target.value) })}
                        className="custom-plan-range mt-1.5"
                        style={distFill}
                        aria-label={`Average distance km for ${meta.label}`}
                      />
                      <div className="mt-0.5 flex justify-between font-medium tabular-nums text-[9px] text-slate-400">
                        <span>1</span>
                        <span>{distSliderMax}</span>
                      </div>
                    </div>
                  </div>
                  </div>

                  {/* Line cost preview */}
                  <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-100/90 bg-white/90 px-2.5 py-2 sm:px-3">
                    <span className="text-[11px] font-medium text-slate-500">Line estimate</span>
                    <span className="text-right">
                      <span className="text-xs font-extrabold tabular-nums text-[#1e1f4b] sm:text-sm">
                        ₹
                        {(summary.lines.find((l) => l.id === cfg.id)?.linePayTotal ?? 0).toLocaleString('en-IN')}
                      </span>
                      <span className="ml-1 text-[10px] font-semibold tabular-nums text-slate-400">
                        ₹{summary.lines.find((l) => l.id === cfg.id)?.perTripDisplay ?? 0}/trip
                      </span>
                    </span>
                  </div>
                  </div>
                </div>
              );
            })}

            {/* Add config */}
            <button
              type="button"
              onClick={addConfig}
              disabled={configs.length >= MAX_VEHICLE_CONFIGS}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300/90 bg-white/90 py-3 text-sm font-bold text-slate-500 shadow-sm transition-all duration-200 hover:border-[var(--color-primary)]/45 hover:bg-white hover:text-[var(--color-primary)] active:scale-[0.99] disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400 disabled:shadow-none disabled:hover:border-slate-200"
            >
              <Plus className="h-4 w-4" />
              {configs.length >= MAX_VEHICLE_CONFIGS ? 'All vehicle types in use' : 'Add Another Vehicle'}
            </button>
          </div>
        </div>

        <div className="min-w-0 lg:w-[min(100%,360px)] lg:shrink-0">
          <div className="lg:sticky lg:top-20">
            {/* Summary panel */}
            <div className="relative overflow-hidden rounded-xl border border-slate-200/70 bg-gradient-to-b from-white via-white to-slate-50/50 p-4 shadow-[0_10px_40px_-16px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.04] sm:p-4">
              <div
                className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/25 to-transparent"
                aria-hidden
              />
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Cost summary</h2>
              <p className="mt-1 text-[11px] leading-snug text-gray-500">
                All-in estimate · no line-item breakdown · fares follow distance &amp; demand bands
              </p>
              <p className="mt-1.5 text-[11px] leading-snug text-gray-500">{TOLL_CHARGES_SEPARATE_NOTE}</p>

              {/* Per-vehicle breakdown */}
              <div className="mt-4 space-y-2.5">
                {summary.lines.map((line, i) => {
                  const vm = VEHICLE_META[line.vehicle];
                  return (
                    <div key={line.id} className="flex items-center justify-between text-sm">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white ${vm.color}`}>
                          {i + 1}
                        </span>
                        <span className="truncate text-gray-600">
                          {vm.label} · {line.trips}×{line.distanceKm}km
                        </span>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="font-bold tabular-nums text-gray-900">₹{line.linePayTotal.toLocaleString('en-IN')}</span>
                        <p className="text-[10px] font-medium text-gray-400">₹{line.perTripDisplay}/trip</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total trips</span>
                  <span className="font-bold text-gray-900">{summary.totalTrips}</span>
                </div>
                <div className="mt-1 flex justify-between text-sm">
                  <span className="text-gray-500">Cost per trip (avg)</span>
                  <span className="font-bold tabular-nums text-gray-900">₹{summary.avgPerTrip}</span>
                </div>
                {summary.listTotal !== null && summary.bulkDiscountPct > 0 && (
                  <>
                    <div className="mt-1 flex justify-between text-sm">
                      <span className="text-gray-500">Volume benefit</span>
                      <span className="font-bold text-emerald-600">{Math.round(summary.bulkDiscountPct * 100)}% off list</span>
                    </div>
                    <div className="mt-1 flex justify-between text-sm">
                      <span className="text-gray-500">List reference</span>
                      <span className="font-bold tabular-nums text-gray-400 line-through">₹{summary.listTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-3 flex flex-col gap-1 border-t border-slate-100 pt-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">Total (this mix)</p>
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <p className="text-2xl font-extrabold tracking-tight text-[#1e1f4b]">₹{summary.payTotal.toLocaleString('en-IN')}</p>
                  {summary.savings > 0 && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      Save ₹{summary.savings.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <p className="mt-1 text-xs text-gray-400">
                {configs.length} vehicle{configs.length > 1 ? 's' : ''} · rounded for easy scanning
              </p>
              <p className="mt-2 text-[10px] leading-snug text-gray-400">{INDICATIVE_PRICING_FOOTNOTE}</p>

              {/* CTA */}
              <button
                type="button"
                onClick={handleProceed}
                className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1e1f4b] to-[#2C2D5B] py-3.5 text-sm font-bold text-white shadow-md shadow-slate-900/20 transition-all duration-200 hover:brightness-110 active:scale-[0.98] md:min-h-11 md:py-3"
              >
                Proceed with This Plan
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => router.push(ROUTES.CONTACT)}
                className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50 active:scale-[0.98] md:min-h-11"
              >
                <Phone className="h-4 w-4" />
                Talk to Expert
              </button>
            </div>

            {summary.showSubscriptionNudge && (
              <div className="mt-4 rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/95 to-white p-4 shadow-sm">
                <p className="text-sm font-bold text-amber-950">You can save more with subscription</p>
                <p className="mt-1 text-xs leading-snug text-amber-900/85">
                  Fixed packs smooth busy lanes and keep per-trip predictable — same ops, less variance than pay-per-use.
                </p>
                <button
                  type="button"
                  onClick={() => router.push(ROUTES.PLANS_SUBSCRIPTION)}
                  className="mt-3 flex items-center gap-1 text-xs font-bold text-amber-950 transition-colors hover:text-amber-800"
                >
                  View subscription packs
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            )}

            {/* Recommendation */}
            {summary.rec && (
              <div className="mt-4 rounded-2xl border-2 border-[var(--color-primary)]/30 bg-gradient-to-b from-blue-50 to-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
                    <Zap className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">Smart Recommendation</span>
                </div>
                <h3 className="mt-2 text-sm font-bold text-gray-900">{summary.rec.label}</h3>
                <p className="mt-1 text-xs text-gray-500">{summary.rec.detail}</p>
                <button
                  type="button"
                  onClick={() => router.push(summary.rec!.href)}
                  className="mt-3 flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary)]/80"
                >
                  Explore this option
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Lease upsell for high volume */}
            {summary.totalTrips >= 80 && !summary.rec?.type?.includes('lease') && (
              <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 p-4">
                <p className="text-xs font-bold text-violet-800">High volume detected</p>
                <p className="mt-1 text-xs text-violet-600">
                  At {summary.totalTrips} trips/month, a dedicated leased vehicle can save significantly more.
                </p>
                <button
                  type="button"
                  onClick={() => router.push(ROUTES.PLANS_LEASE)}
                  className="mt-2 flex items-center gap-1 text-xs font-bold text-violet-700 hover:text-violet-900"
                >
                  Explore vehicle lease <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PlansSubPageShell>
  );
}
