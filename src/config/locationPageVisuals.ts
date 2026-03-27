/**
 * Location landing heroes — imagery aligned with page intent (see brand UI rules).
 *
 * Khatu Shyam Ji assets: real temple-town photography served from `/public/khatu/`
 * (Wikimedia Commons, CC BY-SA — see file page for author credits).
 */

import {
  indiaPhotoWarehouseLogistics,
  indiaPhotoLogisticsHubScale,
  indiaPhotoBangaloreLoadedTruck,
} from '@/config/indiaLogisticsImages';

/** Static paths (Next Image optimizes locally; `w` kept for call-site compatibility). */
function khatuStatic(path: string, _w: number): string {
  return path;
}

/**
 * `object-position` helpers for Next/Image + `object-cover`.
 * Temple photos are often tall: default `object-center` crops the top and loses the murti / gate deity row.
 */
export const khatuShyamImageFocus = {
  /** Darbar / garland-heavy crops — anchor tall idol detail into the hero (not clipped at top). */
  hero: 'object-[50%_18%]',
  /** Toran / entrance gate — align ornamental centre & upper panels toward the middle of the band. */
  gate: 'object-[50%_30%]',
  /** Re-use of darbar lower on page — slightly lower so band repeats don’t look identical. */
  darbarRepeat: 'object-[50%_36%]',
} as const;

export const khatuShyamLogisticsVisual = {
  /** Khatu Shyam temple darbar (Commons: Khatu_darbar.jpg). */
  hero: (w: number) => khatuStatic('/khatu/khatu-shyam-darbar-hero.jpg', w),
  heroAlt: 'Khatu Shyam Ji mandir darbar, Rajasthan — local logistics context for temple-area shops and vendors',
  /** Entrance gate between use-case cards (Commons: Khatu_Shyam_Ji_Entrance_Gate.jpg). */
  supporting: (w: number) => khatuStatic('/khatu/khatu-shyam-entrance-gate.jpg', w),
  supportingAlt: 'Entrance gate of Khatu Shyam Ji, Sikar district — landmark near lanes where goods and deliveries move daily',
  /** Mandir darbar again lower on page — vehicle choice + narrow-lane context (Commons: Khatu_darbar.jpg). */
  lastMileCargo: (w: number) => khatuStatic('/khatu/khatu-shyam-darbar-hero.jpg', w),
  lastMileCargoAlt:
    'Khatu Shyam Ji mandir darbar — temple-area density where 2W, 3W cargo, and 4W booking must match the lane, not a generic city grid',
  /** Falgun Mela footfall — peak crowd / congestion narrative (Commons: Khatu_shyam_ji_Falgun_Mela_2014_by_niks.jpg). */
  loadingHandoff: (w: number) => khatuStatic('/khatu/khatu-shyam-falgun-mela-crowds.jpg', w),
  loadingHandoffAlt:
    'Crowded festival day at Khatu Shyam Ji — when lane access and dwell times make structured logistics valuable for businesses',
} as const;

export const noidaB2bLogisticsVisual = {
  hero: (w: number) => indiaPhotoWarehouseLogistics(w),
  heroAlt: 'Warehouse and pallet operations — B2B logistics and corporate goods movement in Delhi NCR',
  supporting: (w: number) => indiaPhotoLogisticsHubScale(w),
  supportingAlt: 'Large-scale logistics hub — intermodal freight and scalable delivery systems',
  truck: (w: number) => indiaPhotoBangaloreLoadedTruck(w),
  truckAlt: 'Loaded goods truck — mini truck and four-wheeler cargo context',
} as const;
