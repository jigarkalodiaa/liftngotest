/**
 * Single source of truth for subscription trip-pack copy & numbers (3W + strip extensions).
 * Use across /plans hub, /plans/subscription, Noida dashboard, and pricing narratives.
 */

import { ROUTES } from '@/lib/constants';

export type SubscriptionPackGroup = '3w' | '4w';

export type SubscriptionPackId = 'starter' | 'growth' | 'scale' | '4w-growth';

export type SubscriptionPack = {
  id: SubscriptionPackId;
  group: SubscriptionPackGroup;
  name: string;
  /** Marketing one-liner — hub card & tooling */
  tagline: string;
  trips: number;
  perTrip: number;
  total: number;
  /** Ad-hoc anchor per trip (× trips = strikethrough “before savings”) */
  payPerUse: number;
  savings: number;
  popular?: boolean;
  offer?: boolean;
  /** Feature bullets — identical on hub ⓘ, subscription page, and exports */
  features: readonly string[];
  bestFor: string;
};

/** All packs in display order: standard 3W row, then extensions (e.g. 4W on dashboards). */
export const SUBSCRIPTION_PACKS: readonly SubscriptionPack[] = [
  {
    id: 'starter',
    group: '3w',
    name: 'Starter',
    tagline: 'For small shops & local sellers',
    trips: 30,
    perTrip: 500,
    total: 15000,
    payPerUse: 600,
    savings: 3000,
    features: [
      '3W with driver',
      '30-day validity (from activation)',
      'Basic tracking',
      'Email invoices',
      'In-pack: up to ~12 km/trip',
    ],
    bestFor: 'दुकानदार · local retail · small biz',
  },
  {
    id: 'growth',
    group: '3w',
    name: 'Growth',
    tagline: 'For growing businesses',
    trips: 50,
    perTrip: 440,
    total: 22000,
    payPerUse: 590,
    savings: 7500,
    popular: true,
    features: [
      '3W with driver',
      '30-day validity (from activation)',
      'Live GPS tracking',
      'Dedicated POC',
      'Priority dispatch',
      'GST invoicing',
      'In-pack: up to ~12 km/trip',
    ],
    bestFor: 'warehouse · ecommerce · retail chain',
  },
  {
    id: 'scale',
    group: '3w',
    name: 'Scale',
    tagline: 'For high-volume operations',
    trips: 100,
    perTrip: 390,
    total: 39000,
    payPerUse: 590,
    savings: 20000,
    offer: true,
    features: [
      '3W with driver',
      '30-day validity (from activation)',
      'Live GPS tracking',
      'Dedicated account manager',
      'Priority dispatch',
      'Custom SLA',
      'Weekly reports',
      'GST invoicing',
      'In-pack: up to ~12 km/trip',
    ],
    bestFor: 'enterprise · D2C brand · large warehouse',
  },
  {
    id: '4w-growth',
    group: '4w',
    name: '4W Growth',
    tagline: 'Pallet-friendly · mid-size cargo',
    trips: 50,
    perTrip: 640,
    total: 32000,
    payPerUse: 800,
    savings: 8000,
    features: [
      '4W with driver',
      '30-day validity (from activation)',
      'Live GPS tracking',
      'GST invoicing',
      'Dedicated POC',
      'In-pack limits per order confirmation',
    ],
    bestFor: 'stock transfers · mid bulk · distribution',
  },
];

/** Hub + /plans/subscription — 3W packs only */
export const SUBSCRIPTION_PACKS_3W: readonly SubscriptionPack[] = SUBSCRIPTION_PACKS.filter((p) => p.group === '3w');

export function formatSubscriptionRupee(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function subscriptionPackPriceNote(p: Pick<SubscriptionPack, 'perTrip' | 'trips'>): string {
  return `${formatSubscriptionRupee(p.perTrip)}/trip · ${p.trips} trips`;
}

export function subscriptionPackSavingsLabel(p: Pick<SubscriptionPack, 'savings'>): string {
  return `Save ${formatSubscriptionRupee(p.savings)}`;
}

export function subscriptionPackById(id: SubscriptionPackId): SubscriptionPack | undefined {
  return SUBSCRIPTION_PACKS.find((p) => p.id === id);
}

export function subscriptionPackByName(name: string): SubscriptionPack | undefined {
  const n = name.trim().toLowerCase();
  return SUBSCRIPTION_PACKS.find((p) => p.name.toLowerCase() === n);
}

/** Deep link for locking a pack; 4W / non–hub packs go to plans hub. */
export function subscriptionPackLockHref(p: SubscriptionPack): string {
  if (p.group === '3w') {
    return `${ROUTES.PLANS_SUBSCRIPTION}?locked=${encodeURIComponent(p.name)}`;
  }
  return ROUTES.PLANS;
}

/** Razorpay confirmation step — `tier` must match {@link subscriptionPackByName}. */
export function subscriptionPackCheckoutHref(packName: string): string {
  return `${ROUTES.PLANS_SUBSCRIPTION_CHECKOUT}?tier=${encodeURIComponent(packName)}`;
}

/** Plans hub `PlanCard` for Daily Deliveries tab */
export type SubscriptionPlansHubCard = {
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

export function subscriptionPackToPlansHubCard(p: SubscriptionPack): SubscriptionPlansHubCard {
  return {
    title: p.name,
    copy: p.tagline,
    price: formatSubscriptionRupee(p.total),
    priceNote: subscriptionPackPriceNote(p),
    savings: subscriptionPackSavingsLabel(p),
    popular: p.popular,
    bestFor: p.bestFor,
    features: [...p.features],
    cta: 'Lock this plan',
    href: ROUTES.PLANS_SUBSCRIPTION,
  };
}

export type SubscriptionTierUI = {
  name: string;
  trips: number;
  perTrip: number;
  total: number;
  payPerUse: number;
  savings: number;
  features: string[];
  popular?: boolean;
  offer?: boolean;
};

export function subscriptionPackToTierUI(p: SubscriptionPack): SubscriptionTierUI {
  return {
    name: p.name,
    trips: p.trips,
    perTrip: p.perTrip,
    total: p.total,
    payPerUse: p.payPerUse,
    savings: p.savings,
    features: [...p.features],
    popular: p.popular,
    offer: p.offer,
  };
}

/** Noida subscription strip — formatted row + deep link */
export type SubscriptionNoidaStripPlan = {
  name: string;
  trips: string;
  perTrip: string;
  price: string;
  savings?: string;
  popular?: boolean;
  offer?: boolean;
  lockHref: string;
};

export function subscriptionPackToNoidaStripPlan(p: SubscriptionPack): SubscriptionNoidaStripPlan {
  return {
    name: p.name,
    trips: `${p.trips} trips`,
    perTrip: `${formatSubscriptionRupee(p.perTrip)}/trip`,
    price: formatSubscriptionRupee(p.total),
    savings: subscriptionPackSavingsLabel(p),
    popular: p.popular,
    offer: p.offer,
    lockHref: subscriptionPackLockHref(p),
  };
}

export const SUBSCRIPTION_NOIDA_STRIP_PLANS: readonly SubscriptionNoidaStripPlan[] =
  SUBSCRIPTION_PACKS.map(subscriptionPackToNoidaStripPlan);

/** “Most popular” 3W pack for hero tiles (e.g. Growth). */
export function subscriptionHighlighted3WPack(): SubscriptionPack {
  return SUBSCRIPTION_PACKS_3W.find((p) => p.popular) ?? SUBSCRIPTION_PACKS_3W[1];
}
