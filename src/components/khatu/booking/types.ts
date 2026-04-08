import type { KhatuPackageServices } from '@/features/khatu/package/types';

export type KhatuBookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED';

export type KhatuBookingExpert = {
  name: string;
  phone: string;
};

export type KhatuBookingRecord = {
  id: string;
  name: string;
  phone: string;
  services: KhatuPackageServices;
  totalPrice: number;
  date: string;
  status: KhatuBookingStatus;
  expert: KhatuBookingExpert;
};
