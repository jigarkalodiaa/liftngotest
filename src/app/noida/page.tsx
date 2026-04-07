'use client';

import { DashboardLocationProvider } from '@/features/location';
import LocationModal from '@/components/location/LocationModal';
import { DashboardPageClient } from '@/app/dashboard/DashboardPageClient';
import { ROUTES } from '@/lib/constants';

export default function NoidaDashboardPage() {
  return (
    <DashboardLocationProvider pinZone="noida">
      <DashboardPageClient dashboardPath={ROUTES.NOIDA} />
      <LocationModal />
    </DashboardLocationProvider>
  );
}
