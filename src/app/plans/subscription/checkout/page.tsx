import { Suspense } from 'react';
import SubscriptionCheckoutClient from './SubscriptionCheckoutClient';

export default function SubscriptionCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 text-sm text-gray-600">
          Loading checkout…
        </div>
      }
    >
      <SubscriptionCheckoutClient />
    </Suspense>
  );
}
