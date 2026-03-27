import type { DefaultTrip } from '@/types/booking';

/** Default/saved trips for the Choose trip modal on dashboard. */
export const DEFAULT_TRIPS: DefaultTrip[] = [
  {
    id: 't1',
    fromName: 'Shipra Mall',
    fromAddress: 'Vaibhav Khand, Indirapuram, Ghaziabad, Uttar',
    toName: 'HRC Professionals Hub,',
    toAddress: 'Middle Circle, Vaibhav Khand, Indirapuram, Ghaziabad, Uttar Pradesh 201014',
    /** Empty so quick-book does not overwrite the user’s real name in storage; they enter details in pickup flow. */
    contactName: '',
    contactPhone: '',
  },
  {
    id: 't2',
    fromName: 'Shipra Mall',
    fromAddress: 'Vaibhav Khand, Indirapuram, Ghaziabad, Uttar',
    toName: 'HRC Professionals Hub,',
    toAddress: 'Middle Circle, Vaibhav Khand, Indirapuram, Ghaziabad, Uttar Pradesh 201014',
    contactName: '',
    contactPhone: '',
  },
];
