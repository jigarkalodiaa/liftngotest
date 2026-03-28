/**
 * Khatu corridor + nearby towns (Ringas/Ringus, etc.) for zone detection.
 * Tune radius and keywords with ops; admin/feature-flags can extend later.
 */

export type DashboardZone = 'khatu' | 'default';

/** Approx. Khatu Shyam Ji — align with marketing / JSON-LD geo. */
export const KHATU_CENTER = { lat: 27.7486, lng: 75.3932 as number };

/** km — includes Ringas, Reengus, and typical temple-corridor trips. */
export const KHATU_RADIUS_KM = 38;

/**
 * Locality tokens (lowercase) from Nominatim address fields / display_name.
 */
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
