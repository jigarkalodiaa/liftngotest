'use client';

import { DashboardLocationProvider } from '@/features/location';
import LocationModal from '@/components/location/LocationModal';
import { DashboardPageClient } from './DashboardPageClient';

export default function DashboardPage() {
  return (
    <DashboardLocationProvider>
      <DashboardPageClient />
      <LocationModal />
    </DashboardLocationProvider>
  );
}
