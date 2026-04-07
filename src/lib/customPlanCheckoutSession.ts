/**
 * Session payload for /plans/custom → /plans/custom/checkout (tab-scoped, not persisted across tabs).
 */

import type { VehicleClass } from '@/lib/pricing/bulkPlanQuote';

export const CUSTOM_PLAN_SESSION_KEY = 'liftngo_custom_plan_checkout_v1';

export type CustomPlanConfigSnapshot = {
  id: string;
  vehicle: VehicleClass;
  trips: number;
  distanceKm: number;
};

type SessionPayload = {
  v: 1;
  configs: CustomPlanConfigSnapshot[];
};

function isVehicleClass(v: unknown): v is VehicleClass {
  return v === '2W' || v === '3W' || v === '4W';
}

function isSnapshot(o: unknown): o is CustomPlanConfigSnapshot {
  if (typeof o !== 'object' || o === null) return false;
  const r = o as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    isVehicleClass(r.vehicle) &&
    typeof r.trips === 'number' &&
    Number.isFinite(r.trips) &&
    typeof r.distanceKm === 'number' &&
    Number.isFinite(r.distanceKm)
  );
}

function isPayload(x: unknown): x is SessionPayload {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as Record<string, unknown>;
  if (o.v !== 1 || !Array.isArray(o.configs)) return false;
  if (o.configs.length < 1 || o.configs.length > 3) return false;
  return o.configs.every(isSnapshot);
}

export function saveCustomPlanSession(configs: CustomPlanConfigSnapshot[]): void {
  if (typeof window === 'undefined') return;
  const payload: SessionPayload = { v: 1, configs };
  sessionStorage.setItem(CUSTOM_PLAN_SESSION_KEY, JSON.stringify(payload));
}

export function loadCustomPlanSession(): SessionPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CUSTOM_PLAN_SESSION_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isPayload(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearCustomPlanSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(CUSTOM_PLAN_SESSION_KEY);
}
