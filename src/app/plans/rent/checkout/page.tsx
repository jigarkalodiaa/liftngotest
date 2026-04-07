import { Suspense } from 'react';
import RentCheckoutClient from './RentCheckoutClient';

export default function RentCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-gray-50 text-sm text-gray-600">Loading…</div>
      }
    >
      <RentCheckoutClient />
    </Suspense>
  );
}
