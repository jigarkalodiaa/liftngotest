/**
 * Short fare explainer copy for Noida surfaces (dashboard hero modals + /noida-b2b-logistics product mirror).
 * Numbers align with subscription packs and booking calculators.
 */

import { formatSubscriptionRupee, subscriptionHighlighted3WPack } from '@/lib/pricing/subscriptionPacks';

const NOIDA_HIGHLIGHT_3W_PACK = subscriptionHighlighted3WPack();

export const NOIDA_QUICK_FARE_MODAL_ENTRIES = [
  {
    title: '2W — ad hoc',
    kicker: 'From ₹39/trip',
    body:
      'Two-wheel goods billed per trip with no pack. ₹39 reflects a short-distance base fare on typical 2W lanes; final amount adds distance, stops, time, and taxes/tolls as applicable. You confirm a live quote before payment.',
  },
  {
    title: '3W — prepaid packs',
    kicker: 'From ₹299/trip',
    body:
      `Three-wheel pack pricing starts from a ₹299/trip base fare on qualifying entry tiers before tolls and add-ons. Higher tiers (e.g. ${NOIDA_HIGHLIGHT_3W_PACK.name} at ${formatSubscriptionRupee(NOIDA_HIGHLIGHT_3W_PACK.perTrip)}/trip) bundle more capacity and perks. One-off 3W ad hoc is usually higher — see calculators and plan pages.`,
  },
] as const;
