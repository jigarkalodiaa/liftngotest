import { Suspense } from 'react';
import CustomPlanCheckoutClient from './CustomPlanCheckoutClient';

export default function CustomPlanCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 text-sm text-gray-600">
          Loading checkout…
        </div>
      }
    >
      <CustomPlanCheckoutClient />
    </Suspense>
  );
}
