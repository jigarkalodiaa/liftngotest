import type { DashboardZone } from '@/config/khatuZone';
import type { ServiceId } from '@/types/booking';

export interface DashboardZoneUiConfig {
  /** Hero / instant delivery card title */
  instantTitle: string;
  instantSubtitle: string;
  /** Promotional line under greeting area */
  zoneBanner: string | null;
  /** Show restaurant card */
  showFindRestaurant: boolean;
  /** Services visible in grid (subset of full list) */
  allowedServices: readonly ServiceId[];
  /** Extra note above service grid */
  incentivesNote: string | null;
}

export function getDashboardZoneUi(zone: DashboardZone): DashboardZoneUiConfig {
  if (zone === 'khatu') {
    return {
      instantTitle: 'Khatu Mandir ride services',
      instantSubtitle: 'Short-distance rides — 3 km corridor optimised for temple & bazaar legs',
      zoneBanner: 'You are in the Khatu–Ringas service zone. Hyperlocal pricing applies.',
      showFindRestaurant: true,
      allowedServices: ['walk', 'twoWheeler', 'threeWheeler'],
      incentivesNote: 'Partner incentives tuned for quick temple-corridor completions.',
    };
  }

  return {
    instantTitle: 'Instant Delivery',
    instantSubtitle: 'Book a vehicle in a second',
    zoneBanner: null,
    showFindRestaurant: true,
    allowedServices: ['walk', 'twoWheeler', 'threeWheeler', 'fourWheeler'],
    incentivesNote: null,
  };
}
