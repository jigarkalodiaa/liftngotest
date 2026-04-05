import { Suspense } from 'react';
import LeaseCheckoutClient from './LeaseCheckoutClient';

export default function LeaseCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center bg-gray-50 text-sm text-gray-600">Loading…</div>
      }
    >
      <LeaseCheckoutClient />
    </Suspense>
  );
}
