/**
 * Rental plan copy — keep aligned with order confirmations and Terms of Service.
 * Marketing page: short bullets on cards; full text lives in expandable sections.
 */

import { INDICATIVE_PRICING_FOOTNOTE, TOLL_CHARGES_SEPARATE_NOTE } from './subscriptionDisclosures';

/** Compact strip under toggles. */
export const RENT_PAGE_SUMMARY_STRIP =
  'Indicative rates for planning only. Final price, inclusions, taxes, and deposit follow your signed rental / booking confirmation and Liftngo Terms of Service.';

export const RENT_CARD_FEATURES_WITH_DRIVER: readonly string[] = [
  'Driver & vehicle class as confirmed — standard duty hours apply; extended shifts or night duty only if agreed in writing',
  'Fuel for normal use within the agreed route / city scope — abnormal idling, unplanned inter-city, or off-route use may be quoted separately',
  'Vehicle insurance as per Liftngo / owner policy — does not cover your cargo; declare value / buy cargo cover if needed',
];

export const RENT_CARD_FEATURES_SELF_DRIVE: readonly string[] = [
  'Self-drive only with valid DL, identity / KYC, and eligibility rules in force at booking',
  'Fuel, tolls, parking, inter-state permits, and similar charges are on you unless explicitly included in your confirmation',
  'Security deposit, pre- and post-rent inspection, and damage / violation charges per agreement',
];

/** Structured blocks for the expandable “full conditions” panel. */
export const RENT_CONDITION_SECTIONS: readonly { title: string; lines: readonly string[] }[] = [
  {
    title: 'Pricing, taxes & what is binding',
    lines: [
      INDICATIVE_PRICING_FOOTNOTE,
      'Published daily, weekly, and monthly amounts exclude GST and other statutory taxes unless a line explicitly says they are inclusive.',
      TOLL_CHARGES_SEPARATE_NOTE,
      'Parking, state / national permits, FASTag shortfalls, challans tied to the rental period, and similar statutory or third-party amounts may be billed on actuals.',
      'Promotions, corridor pricing, and fleet availability can change quotes — the version in your confirmation overrides this page.',
    ],
  },
  {
    title: 'What “daily”, “weekly”, and “monthly” mean',
    lines: [
      'Calendar definition (e.g. calendar day vs rolling 24 hours, week start, month boundaries) is fixed only in your rental agreement or booking confirmation — not on this marketing page.',
      'Partial days, rounded billing, minimum billing blocks, and grace windows apply as stated in confirmation.',
      'Unused time generally does not entitle to a pro-rata refund unless the agreement explicitly allows it.',
    ],
  },
  {
    title: 'With-driver rentals — scope & limits',
    lines: [
      'The driver follows lawful instructions and approved routes; refused loads, unsafe requests, or breaches of policy may end the job without refund for abuse.',
      'Reasonable loading / unloading handoff at the gate or dock is included; dedicated labour, multi-floor manual handling without lift, or long waiting onsite may need a separate quote.',
      'Odometer / fair-use km limits, if any, are in the confirmation — excess distance, extra stops, or wait-time beyond agreed free minutes may be billed as add-ons.',
      'Vehicle substitution to an equivalent or better capacity may occur for safety, compliance, or availability.',
    ],
  },
  {
    title: 'Self-drive — eligibility, deposit & compliance',
    lines: [
      'You must hold a valid driving licence for the vehicle class, meet minimum age, and complete KYC / verification steps requested at booking.',
      'A refundable security deposit (and any documentation hold) is collected as per policy; damages, violations, fuel shortfall, or contract breaches may be adjusted against it with supporting evidence.',
      'You are responsible for lawful use, seat belts, overload limits, and all fines / challans during the rental window unless proven otherwise.',
      'Return in the same condition as inspection (ordinary wear excepted) and by the agreed time; late return may attract additional day charges or inconvenience fees per agreement.',
    ],
  },
  {
    title: 'Insurance, loss & cargo',
    lines: [
      'Vehicle cover follows the insurer / owner policy on file — typically including statutory third-party coverage; own-damage, theft, and deductibles follow that policy and your agreement.',
      'Cargo loss, spoilage, or consequential business loss is not covered by default vehicle rental — arrange cargo insurance or declared-value handling if required.',
      'Theft, reckless use, drunk driving, unauthorised drivers, or illegal cargo void protections where the law and policy allow.',
    ],
  },
  {
    title: 'Cancellation, no-show & extension',
    lines: [
      'Cancellation, rescheduling, and refund rules (including cut-off hours and fees) are only those in your confirmation — not inferred from this page.',
      'No-show when the vehicle or driver has been deployed may incur full or partial charges.',
      'Extensions require prior approval, availability, and may be at revised rates; early return does not automatically reduce charges unless the agreement says so.',
    ],
  },
  {
    title: 'Cargo, safety & prohibited use',
    lines: [
      'Hazmat, cash / bullion (unless expressly agreed), contraband, and illegally declared goods are prohibited — Liftngo or the driver may refuse carriage.',
      'Overloading beyond legal axle / GVW limits is not allowed.',
      'Personal / non-commercial misuse, sub-letting without consent, or racing / stunts may terminate the rental and trigger penalties.',
    ],
  },
  {
    title: 'Force majeure, disputes & governing terms',
    lines: [
      'Service may be delayed or impossible due to weather, roadblocks, strikes, government orders, epidemics, or other events outside reasonable control — remedies follow your agreement.',
      'For limitation of liability, indemnities, dispute resolution, governing law, and all legal rights and obligations, the Liftngo Terms of Service and your rental / order documents control over general marketing copy.',
      'Keep written confirmations and inspection photos to prevent avoidable disagreements about condition, time, or scope.',
    ],
  },
];
