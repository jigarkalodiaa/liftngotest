'use client';

import { Suspense } from 'react';
import EditPickupContent from './EditPickupContent';

export default function PickupLocationPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <EditPickupContent />
    </Suspense>
  );
}