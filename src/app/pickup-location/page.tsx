'use client';

import { Suspense } from 'react';
import PickupAuthGuard from '@/components/auth/PickupAuthGuard';
import EditPickupContent from './EditPickupContent';

export default function PickupLocationPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <PickupAuthGuard>
        <EditPickupContent />
      </PickupAuthGuard>
    </Suspense>
  );
}