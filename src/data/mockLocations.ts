import type { SavedLocation } from '@/types/booking';

/** Mock recent search locations for pickup/drop/stop selection. */
export const RECENT_SEARCHES: (SavedLocation & { id: string })[] = [
  { id: '1', name: 'Shyam Restaurant', address: 'Zaildar Enclave Hastal, Vaibhav khand New Delhi', contact: 'Prateek Jha | 9065847341' },
  { id: '2', name: 'Indira Gandhi Airport', address: 'Terminal 3, IGI Airport, New Delhi', contact: 'Airport Info | 0124-3376000' },
  { id: '3', name: 'Connaught Place', address: 'Block C, Connaught Place, New Delhi', contact: 'CP Office | 9876543210' },
];
