/**
 * Zone detection config for Khatu corridor and Noida / NCR business zone.
 * Tune radius and keywords with ops; admin/feature-flags can extend later.
 */

export type DashboardZone = 'khatu' | 'noida' | 'default';

/* ── Khatu ─────────────────────────────────────────────────── */

/** Approx. Khatu Shyam Ji — align with marketing / JSON-LD geo. */
export const KHATU_CENTER = { lat: 27.7486, lng: 75.3932 as number };

/** km — includes Ringas, Reengus, and typical temple-corridor trips. */
export const KHATU_RADIUS_KM = 38;

export const KHATU_LOCALITY_MATCH: readonly string[] = [
  'khatu',
  'khatu shyam',
  'shyam ji',
  'ringas',
  'ringus',
  'reengus',
  'ringer',
  'laxmangarh',
  'lackhu',
  'palsana',
  'sigdola',
];

/* ── Noida / NCR ───────────────────────────────────────────── */

/** Approx. Noida city centre (Sector 18). */
export const NOIDA_CENTER = { lat: 28.5707, lng: 77.3219 };

/** km — covers Noida, Greater Noida, parts of Ghaziabad, Faridabad, south Delhi, Gurugram fringe. */
export const NOIDA_RADIUS_KM = 55;

export const NOIDA_LOCALITY_MATCH: readonly string[] = [
  'noida',
  'greater noida',
  'gurugram',
  'gurgaon',
  'ghaziabad',
  'faridabad',
  'delhi',
  'new delhi',
  'ncr',
];
