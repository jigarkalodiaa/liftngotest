/**
 * Legal / ops disclaimers for pack & trip pricing (keep in sync across surfaces).
 * Edit here first, then mirror only where a short UI line is required.
 */

/** Tolls are not included in shown pack or estimate totals. */
export const TOLL_CHARGES_SEPARATE_NOTE =
  'Toll charges are calculated and billed separately where they apply — including intra-state tolled highways and inter-state routes.';

/**
 * Upfront pack benefits for subscription UI. Keep aligned with SOW / order confirmation.
 * Loading / unloading at client premises — no separate “waiting at dock” line item for standard handoffs.
 */
export const SUBSCRIPTION_PACK_BENEFITS: readonly string[] = [
  'No surge pricing on included pack trips — entry 3W pack base fare from ₹299/trip where offered; higher tiers (e.g. Growth) lock ₹440/trip for included 3W runs. The same lanes often see ad hoc booking land higher before tolls (30-day validity & ~12 km in-pack cap apply).',
  'No demand multipliers on pack trips — we don’t stack busy-hour bumps on top of your locked pack rate (within plan limits).',
  '30-day pack validity from activation — use your trip balance without daily repricing',
  'GST-compliant tax invoices on applicable charges',
  'Priority dispatch over casual bookings when capacity is tight (per tier)',
  'Live GPS & digital proof of delivery on supported trips (per tier)',
];

/**
 * Compact card line: billing & extras only (put **30-day validity** in the main spec line to avoid repeat).
 */
export const GST_AND_PASS_THROUGH_SHORT =
  'GST-compliant invoicing · Tolls, permits & similar pass-throughs billed on actuals where applicable (incl. intra-state tolled highways & inter-state routes)';

/**
 * Full validity wording (subscription / compliance blocks).
 * “Activation” = start date defined in order confirmation or first eligible booking, whichever your contract states.
 */
export const PACK_VALIDITY_FULL =
  'Each trip pack runs on a 30-day validity window from activation (or the start date in your order / agreement). Unused trips generally do not roll over unless explicitly agreed in writing.';

/** Short footnote under calculators / packs. */
export const INDICATIVE_PRICING_FOOTNOTE =
  'Indicative pricing on this page is not a binding quote. Final amounts, taxes, and commercial terms follow your order confirmation, GST invoice, and the Liftngo Terms of Service.';

/**
 * Compliance & risk points for subscription / B2B packs (review with counsel periodically).
 * Shown in expandable section on subscription page; not a substitute for full Terms.
 */
export const SUBSCRIPTION_COMPLIANCE_BULLETS: readonly string[] = [
  PACK_VALIDITY_FULL,
  "GST: tax invoices issued as per applicable law; GSTIN, HSN/SAC, and place of supply as on Liftngo's issuance.",
  'Distance & vehicle class limits apply as published (e.g. in-pack km cap). Extra-long routes, multi-stop extras, special handling, or loading/unloading patterns outside an agreed scope may be quoted as add-ons.',
  TOLL_CHARGES_SEPARATE_NOTE,
  'Parking, state permits, inter-state compliance costs, and similar statutory or third-party charges may be billed separately on actuals where applicable.',
  'Dispatch depends on fleet capacity, driver availability, road and weather conditions, and safety checks — specific time slots are best-effort unless a custom SLA says otherwise.',
  'Excluded or illegal cargo may be refused; repeated route abuse, misdeclaration, or policy breaches may affect service or account status.',
  'Pack prices and inclusions may change for new purchases; an active pack is governed by the terms and confirmation at the time you bought it.',
  'For disputes, escalation, liability caps, and governing law, see the Terms of Service.',
];
