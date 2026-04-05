'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import {
  INDICATIVE_PRICING_FOOTNOTE,
  SUBSCRIPTION_COMPLIANCE_BULLETS,
  SUBSCRIPTION_PACK_BENEFITS,
  TOLL_CHARGES_SEPARATE_NOTE,
} from '@/lib/pricing/subscriptionDisclosures';
import PlansSubPageShell from '../PlansSubPageShell';
import { trackPlanSelected, trackCheckoutStarted, trackViewPlan } from '@/lib/analytics';
import { Check, Star, ArrowRight, Phone } from 'lucide-react';

type Tier = { name: string; trips: number; perTrip: number; total: number; payPerUse: number; savings: number; features: string[]; popular?: boolean; offer?: boolean };

/** Packs priced for margin; payPerUse × trips = credible ad-hoc anchor (no breakdown in UI). */
const TIERS: Tier[] = [
  {
    name: 'Starter',
    trips: 30,
    perTrip: 500,
    total: 15000,
    payPerUse: 600,
    savings: 3000,
    features: ['3W with driver', '30-day validity (from activation)', 'Basic tracking', 'Email invoices', 'In-pack: up to ~12 km/trip'],
  },
  {
    name: 'Growth',
    trips: 50,
    perTrip: 440,
    total: 22000,
    payPerUse: 590,
    savings: 7500,
    popular: true,
    features: ['3W with driver', '30-day validity (from activation)', 'Live GPS tracking', 'Dedicated POC', 'Priority dispatch', 'GST invoicing', 'In-pack: up to ~12 km/trip'],
  },
  {
    name: 'Scale',
    trips: 100,
    perTrip: 390,
    total: 39000,
    payPerUse: 590,
    savings: 20000,
    offer: true,
    features: ['3W with driver', '30-day validity (from activation)', 'Live GPS tracking', 'Dedicated account manager', 'Priority dispatch', 'Custom SLA', 'Weekly reports', 'GST invoicing', 'In-pack: up to ~12 km/trip'],
  },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>('Growth');

  return (
    <PlansSubPageShell
      title="Subscription plans"
      subtitle="Fixed trips, no surge or waiting-time add-ons in the standard window — full benefits below."
      badge="Trip bundles"
      contentClassName="-mt-6"
    >
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm md:p-5">
          <p className="text-center text-sm font-bold text-emerald-900">
            What you get upfront with every pack
          </p>
          <p className="mx-auto mt-1 max-w-xl text-center text-xs text-emerald-700">
            Busy ad-hoc lanes often run ~₹590–₹650/trip · Subscription locks from ~₹390/trip with the protections below
          </p>
          <ul className="mx-auto mt-3 max-w-3xl space-y-2 text-left">
            {SUBSCRIPTION_PACK_BENEFITS.map((line, i) => (
              <li key={i} className="flex gap-2 text-[11px] leading-snug text-emerald-900/95 md:text-xs">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={2.5} aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mx-auto mt-3 max-w-lg border-t border-emerald-200/80 pt-3 text-center text-[11px] leading-snug text-emerald-800/90">
            {TOLL_CHARGES_SEPARATE_NOTE} Parking, permits &amp; similar statutory pass-throughs may also apply on actuals.
          </p>
        </div>

        <div className="mt-8 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {TIERS.map((tier) => {
            const isSelected = selected === tier.name;
            return (
              <div
                key={tier.name}
                className={`relative flex min-w-0 flex-col overflow-x-clip rounded-2xl border-2 p-4 transition-all duration-200 md:p-5 ${
                  isSelected
                    ? 'border-[var(--color-primary)] bg-white shadow-lg shadow-blue-900/10'
                    : 'border-gray-100 bg-white shadow-sm hover:shadow-md'
                }`}
              >
                {tier.popular && (
                  <span className="absolute right-0 top-0 flex items-center gap-1 rounded-bl-xl bg-[var(--color-primary)] px-3 py-1 text-[10px] font-bold uppercase text-white">
                    <Star className="h-3 w-3 fill-white" /> Most Popular
                  </span>
                )}
                {tier.offer && (
                  <span className="absolute right-0 top-0 rounded-bl-xl bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase text-white">
                    Best Value
                  </span>
                )}

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{tier.name}</h2>
                    <p className="text-sm text-gray-500">{tier.trips} trips/month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-[var(--color-primary)]">₹{tier.total.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-400 line-through">₹{(tier.payPerUse * tier.trips).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">₹{tier.perTrip}/trip</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600">Save ₹{tier.savings.toLocaleString('en-IN')}</span>
                </div>

                <ul className="mt-4 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(tier.name);
                      trackPlanSelected(tier.name, 'subscription');
                      trackCheckoutStarted('subscription', tier.total);
                      router.push(ROUTES.CONTACT);
                    }}
                    className={`flex min-h-12 w-full flex-1 items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-200 active:scale-[0.98] md:min-h-11 md:py-3 ${
                      isSelected
                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                        : 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    Lock this plan
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <details className="group mt-8 rounded-2xl border border-gray-200 bg-slate-50/90 p-4 shadow-sm open:bg-slate-50 md:p-5">
          <summary className="cursor-pointer list-none text-sm font-bold text-gray-900 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-2">
              Pack validity, compliance &amp; legal summary
              <span className="text-xs font-semibold text-gray-500 group-open:hidden">Show</span>
              <span className="hidden text-xs font-semibold text-gray-500 group-open:inline">Hide</span>
            </span>
          </summary>
          <div className="mt-3 space-y-3 border-t border-gray-200/80 pt-3 text-left">
            <ul className="space-y-2 text-[11px] leading-relaxed text-gray-600 md:text-xs">
              {SUBSCRIPTION_COMPLIANCE_BULLETS.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-400" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] leading-relaxed text-gray-500 md:text-xs">{INDICATIVE_PRICING_FOOTNOTE}</p>
            <p>
              <Link
                href="/terms"
                className="text-[11px] font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline md:text-xs"
              >
                Full Terms of Service
              </Link>
            </p>
          </div>
        </details>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm md:p-6">
          <p className="text-sm font-bold text-gray-900 md:text-base">Need a custom plan?</p>
          <p className="mt-1 text-xs text-gray-500 md:text-sm">Our logistics experts will design a plan tailored to your routes.</p>
          <button
            type="button"
            onClick={() => {
              trackViewPlan('subscription_expert', 'subscription_page');
              router.push(ROUTES.CONTACT);
            }}
            className="mt-4 inline-flex min-h-12 w-full max-w-xs items-center justify-center gap-2 rounded-xl border border-[var(--color-primary)] bg-white px-5 py-3 text-sm font-bold text-[var(--color-primary)] transition-all duration-200 hover:bg-blue-50 active:scale-[0.98] sm:w-auto sm:min-h-11 sm:py-2.5"
          >
            <Phone className="h-4 w-4 shrink-0" />
            Talk to expert
          </button>
        </div>
    </PlansSubPageShell>
  );
}
