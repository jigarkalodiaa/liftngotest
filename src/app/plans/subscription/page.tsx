import { Suspense } from 'react';
import SubscriptionPageClient from './SubscriptionPageClient';

export default function SubscriptionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 text-sm text-gray-600">Loading plans…</div>
      }
    >
      <SubscriptionPageClient />
    </Suspense>
  );
}
