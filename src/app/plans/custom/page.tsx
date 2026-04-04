'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { trackCalculatorUsed, trackPlanSelected, trackCheckoutStarted } from '@/lib/analytics';
import { ArrowRight, Plus, Trash2, Copy, Bike, Truck, Phone, Zap, ChevronRight } from 'lucide-react';
import PlansSubPageShell from '../PlansSubPageShell';

/* ── Pricing engine ──────────────────────────────────────── */

type VehicleType = '2W' | '3W' | '4W';

const ALL_VEHICLE_TYPES: VehicleType[] = ['2W', '3W', '4W'];

const VEHICLE_META: Record<VehicleType, { label: string; icon: typeof Bike; basePerKm: number; minFare: number; color: string }> = {
  '2W': { label: '2-Wheeler', icon: Bike,  basePerKm: 8,  minFare: 50,  color: 'bg-sky-500' },
  '3W': { label: '3-Wheeler', icon: Truck, basePerKm: 14, minFare: 80,  color: 'bg-emerald-500' },
  '4W': { label: '4-Wheeler', icon: Truck, basePerKm: 22, minFare: 150, color: 'bg-violet-500' },
};

function costPerTrip(vehicle: VehicleType, distanceKm: number): number {
  const m = VEHICLE_META[vehicle];
  return Math.max(m.basePerKm * distanceKm, m.minFare);
}

function bulkDiscount(totalTrips: number): number {
  if (totalTrips >= 100) return 0.30;
  if (totalTrips >= 50) return 0.22;
  if (totalTrips >= 30) return 0.15;
  if (totalTrips >= 20) return 0.08;
  return 0;
}

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
    const lines = configs.map((c) => {
      const perTrip = costPerTrip(c.vehicle, c.distanceKm);
      const lineCost = perTrip * c.trips;
      return { id: c.id, vehicle: c.vehicle, trips: c.trips, distanceKm: c.distanceKm, perTrip, lineCost };
    });

    const totalTrips = lines.reduce((s, l) => s + l.trips, 0);
    const totalPayPerUse = lines.reduce((s, l) => s + l.lineCost, 0);
    const discount = bulkDiscount(totalTrips);
    const discountedTotal = Math.round(totalPayPerUse * (1 - discount));
    const savings = totalPayPerUse - discountedTotal;
    const avgPerTrip = totalTrips > 0 ? Math.round(discountedTotal / totalTrips) : 0;
    const rec = getRecommendation(totalTrips, configs);

    return { lines, totalTrips, totalPayPerUse, discount, discountedTotal, savings, avgPerTrip, rec };
  }, [configs]);

  const handleProceed = useCallback(() => {
    trackCalculatorUsed({
      configs: configs.length,
      total_trips: summary.totalTrips,
      total_cost: summary.discountedTotal,
      recommended: summary.rec?.type || 'none',
    });
    if (summary.rec) {
      trackPlanSelected(summary.rec.label, 'custom_calculator');
      trackCheckoutStarted('custom_calculator', summary.discountedTotal);
      router.push(summary.rec.href);
    } else {
      router.push(ROUTES.PLANS_SUBSCRIPTION);
    }
  }, [configs.length, summary, router]);

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
      <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="min-w-0 flex-1">
          <div className="space-y-4">
            {configs.map((cfg, idx) => {
              const meta = VEHICLE_META[cfg.vehicle];
              const VIcon = meta.icon;
              const usedElsewhere = new Set(
                configs.filter((c) => c.id !== cfg.id).map((c) => c.vehicle)
              );
              return (
                <div
                  key={cfg.id}
                  className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-md transition-all duration-200 md:p-5 lg:p-6"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-white ${meta.color}`}>
                        <VIcon className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <span className="text-sm font-bold text-gray-900">Config {idx + 1}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => duplicateConfig(cfg.id)}
                        disabled={configs.length >= MAX_VEHICLE_CONFIGS}
                        className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                        aria-label="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      {configs.length > 1 && (
                        <button type="button" onClick={() => removeConfig(cfg.id)} className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500" aria-label="Remove">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Vehicle selector */}
                  <div className="mt-4">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Vehicle Type</label>
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
                            title={disabled ? 'Already selected in another configuration' : undefined}
                            onClick={() => {
                              if (!disabled) updateConfig(cfg.id, { vehicle: v });
                            }}
                            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all duration-150 ${
                              active
                                ? `${vm.color} text-white shadow-sm`
                                : disabled
                                  ? 'cursor-not-allowed border border-gray-100 bg-gray-50 text-gray-300'
                                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <VI className="h-3.5 w-3.5" strokeWidth={2} />
                            {vm.label}
                          </button>
                        );
                      })}
                    </div>
                    <p className="mt-1.5 text-[10px] text-gray-400">Each vehicle type can be used in one configuration only (up to 3).</p>
                  </div>

                  {/* Trips slider */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Trips / month</label>
                      <input
                        type="number"
                        min={1}
                        max={500}
                        value={cfg.trips}
                        onChange={(e) => updateConfig(cfg.id, { trips: Math.max(1, Number(e.target.value) || 1) })}
                        className="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-center text-sm font-bold text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/30"
                      />
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={200}
                      step={1}
                      value={cfg.trips}
                      onChange={(e) => updateConfig(cfg.id, { trips: Number(e.target.value) })}
                      className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[var(--color-primary)]"
                    />
                  </div>

                  {/* Distance slider */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Avg distance (km)</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={cfg.distanceKm}
                        onChange={(e) => updateConfig(cfg.id, { distanceKm: Math.max(1, Number(e.target.value) || 1) })}
                        className="w-16 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-center text-sm font-bold text-gray-900 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/30"
                      />
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      step={1}
                      value={cfg.distanceKm}
                      onChange={(e) => updateConfig(cfg.id, { distanceKm: Number(e.target.value) })}
                      className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[var(--color-primary)]"
                    />
                  </div>

                  {/* Line cost preview */}
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2">
                    <span className="text-xs text-gray-500">Estimated cost</span>
                    <span className="text-sm font-extrabold text-gray-900">
                      ₹{(costPerTrip(cfg.vehicle, cfg.distanceKm) * cfg.trips).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Add config */}
            <button
              type="button"
              onClick={addConfig}
              disabled={configs.length >= MAX_VEHICLE_CONFIGS}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 bg-white py-4 text-sm font-bold text-gray-500 transition-all duration-200 hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] active:scale-[0.99] disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:hover:border-gray-200 disabled:hover:text-gray-400"
            >
              <Plus className="h-4 w-4" />
              {configs.length >= MAX_VEHICLE_CONFIGS ? 'All vehicle types in use' : 'Add Another Vehicle'}
            </button>
          </div>
        </div>

        <div className="min-w-0 lg:w-[min(100%,380px)] lg:shrink-0">
          <div className="lg:sticky lg:top-24">
            {/* Summary panel */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg md:p-5 lg:p-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">Cost Summary</h2>

              {/* Per-vehicle breakdown */}
              <div className="mt-4 space-y-2.5">
                {summary.lines.map((line, i) => {
                  const vm = VEHICLE_META[line.vehicle];
                  return (
                    <div key={line.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white text-[10px] font-bold ${vm.color}`}>
                          {i + 1}
                        </span>
                        <span className="truncate text-gray-600">
                          {vm.label} · {line.trips}×{line.distanceKm}km
                        </span>
                      </div>
                      <span className="shrink-0 font-bold tabular-nums text-gray-900">₹{line.lineCost.toLocaleString('en-IN')}</span>
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
                  <span className="text-gray-500">Pay-per-use</span>
                  <span className="font-bold tabular-nums text-gray-400 line-through">₹{summary.totalPayPerUse.toLocaleString('en-IN')}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="mt-1 flex justify-between text-sm">
                    <span className="text-emerald-600">Bulk discount</span>
                    <span className="font-bold text-emerald-600">-{Math.round(summary.discount * 100)}%</span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-end justify-between border-t border-gray-100 pt-3">
                <div>
                  <p className="text-[10px] font-bold uppercase text-gray-400">Estimated Total</p>
                  <p className="text-2xl font-extrabold text-[var(--color-primary)]">₹{summary.discountedTotal.toLocaleString('en-IN')}</p>
                </div>
                {summary.savings > 0 && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600">
                    Save ₹{summary.savings.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <p className="mt-1 text-xs text-gray-400">
                ₹{summary.avgPerTrip}/trip avg · {configs.length} vehicle{configs.length > 1 ? 's' : ''}
              </p>

              {/* CTA */}
              <button
                type="button"
                onClick={handleProceed}
                className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] md:min-h-11 md:py-3"
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
