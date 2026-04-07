/** Content for /why-liftngo and marketing references (trust, disclosures). */

export const WHY_LIFTNGO_TRUST_STATS = [
  { value: '500+', label: 'businesses trust Liftngo' },
  { value: '15 min', label: 'average pickup time' },
  { value: '4.8★', label: 'customer rating' },
] as const;

export const WHY_LIFTNGO_POINTS = [
  {
    label: 'GST Invoice',
    sub: 'GST invoice on qualifying trips',
    detail:
      'GST-compliant invoices are generated for completed trips when your billing profile and trip metadata support it. Invoice timelines and formats can vary by plan. This is general information only — not tax or legal advice. Commercial terms are in our Terms of Service.',
  },
  {
    label: 'Same-day SLA',
    sub: 'Same-day within cutoffs & zone',
    detail:
      '“Same-day” reflects our target operating model for eligible bookings inside the service zone and published cutoffs. Severe weather, road closures, partner capacity, or safety issues can delay dispatch. Your order screen and Terms of Service state what applies to your specific trip.',
  },
  {
    label: 'Live GPS',
    sub: 'Track when the driver app is on',
    detail:
      'Live location sharing depends on the driver app, device permissions, and network coverage. Gaps can occur without notice; the map is a convenience feature, not a warranty of uninterrupted tracking.',
  },
  {
    label: 'Dedicated POC',
    sub: 'Account contact when assigned',
    detail:
      'A named point of contact may be offered for eligible business accounts depending on volume, segment, and capacity — not every tier includes a dedicated manager. Support coverage and escalation paths are defined in your agreement and Terms of Service.',
  },
] as const;

export const WHY_LIFTNGO_STATS_DISCLOSURE =
  'Stats above (business count, pickup time, rating) are indicative highlights, not guarantees or audited figures.';
