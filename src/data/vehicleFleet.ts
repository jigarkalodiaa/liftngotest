/**
 * Marketing + schema copy for fleet and roadmap.
 * Booking `ServiceId` lives in `@/types/booking`; keep naming aligned.
 */

import { SITE_NAME, SITE_URL } from '@/lib/site';

/** Vehicles live in the app today — maps to `/services/*` where applicable. */
export const LIVE_FLEET_SLUGS = ['walk', '2-wheeler', '3-wheeler', '4-wheeler'] as const;

export type ComingSoonVehicle = {
  name: string;
  summary: string;
  keywords: string;
};

export const COMING_SOON_VEHICLES: readonly ComingSoonVehicle[] = [
  {
    name: 'Refrigerated / cold chain',
    summary: 'Temperature-sensitive loads for food, medicine, and perishables—on request as we expand.',
    keywords: 'reefer truck, cold chain logistics, chilled delivery',
  },
  {
    name: 'Half-load & shared truck',
    summary: 'Cost-efficient legs when you do not need a full vehicle—book a slice of capacity.',
    keywords: 'part load, shared truck, LTL goods transport',
  },
  {
    name: 'Flatbed & oversized',
    summary: 'Frames, machinery, and odd dimensions that need open decking and strapping.',
    keywords: 'flatbed transport, oversized cargo, industrial delivery',
  },
  {
    name: 'Full-size truck & long haul',
    summary: 'Inter-city and heavy tonnage when hyperlocal three- and four-wheelers are not enough.',
    keywords: 'full truck load, long distance logistics, FTL India',
  },
] as const;

/** JSON-LD ItemList entries for live services (index pages). */
export function servicesIndexItemListSchema() {
  const base = SITE_URL;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SITE_NAME} vehicle booking options`,
    description: `Walk, two-wheeler, three-wheeler, and four-wheeler goods transport with ${SITE_NAME}. Additional vehicle classes coming soon.`,
    numberOfItems: 4,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Walk delivery',
        url: `${base}/services/walk`,
        description: 'Light parcels and short handoffs on foot.',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Two-wheeler goods delivery',
        url: `${base}/services/2-wheeler`,
        description: 'Fast compact cargo on motorbike or scooter.',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Three-wheeler cargo',
        url: `${base}/services/3-wheeler`,
        description: 'Heavier intra-city loads on three-wheel cargo vehicles.',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Four-wheeler mini truck',
        url: `${base}/services/4-wheeler`,
        description: 'Larger pallets and bulky goods on four-wheel mini trucks.',
      },
    ],
  };
}

export const SERVICES_INDEX_FAQ = [
  {
    question: 'What vehicle types can I book on Liftngo today?',
    answer:
      'You can book walk delivery for light handoffs, two-wheeler for compact parcels, three-wheeler cargo for heavier intra-city loads, and four-wheeler mini trucks for larger or bulkier goods. Availability may vary by lane and demand.',
  },
  {
    question: 'Are more vehicle options coming?',
    answer:
      'Yes. We are working toward refrigerated cold-chain units, half-load and shared-truck options, flatbed or oversized handling, and full-size long-haul trucks. Join the app or follow our services page for updates.',
  },
  {
    question: 'How do I choose between three-wheel and four-wheel cargo?',
    answer:
      'Use three-wheelers for typical cartons and urban last-mile legs. Choose four-wheelers when weight, volume, or palletisation needs a wider deck and higher payload than a three-wheeler can safely carry.',
  },
  {
    question: 'Does Liftngo offer goods transport in Noida and Delhi NCR?',
    answer:
      'Yes—structured B2B and commercial legs are a focus in Noida and wider Delhi NCR. Pick vehicle class to match dock access and payload; see the Noida B2B landing for positioning. Estimates still depend on live corridor demand.',
  },
  {
    question: 'Can I book the same modes for Khatu Shyam Ji hyperlocal delivery?',
    answer:
      'Walk, two-wheeler, three-wheeler cargo, and four-wheeler options apply when lanes and congestion allow. Festival peaks around Khatu Shyam Ji may narrow same-hour availability—book with realistic buffers and read the Khatu logistics page for context.',
  },
  {
    question: 'Where can I read about delivery pricing patterns in Noida?',
    answer:
      'Our blog guide on delivery cost in Noida walks through estimate drivers—distance, vehicle class, and demand—without promising fantasy tariffs. Always confirm in the booking flow for your exact pickup and drop.',
  },
] as const;
