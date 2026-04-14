'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui';
import { COCONUT_PRODUCTS, COCONUT_VENDOR } from '@/features/noida/coconut/products';
import CoconutProductCard from '@/features/noida/coconut/CoconutProductCard';
import CoconutCartBar from '@/features/noida/coconut/CoconutCartBar';

export default function CoconutMenuPage() {
  const router = useRouter();

  const singles = COCONUT_PRODUCTS.filter((p) => !p.combo);
  const combos = COCONUT_PRODUCTS.filter((p) => p.combo);

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      <div className="mx-auto max-w-xl px-4 pt-4 sm:max-w-2xl sm:px-6">
        <PageHeader title={COCONUT_VENDOR.name} onBack={() => router.push('/dashboard')} />

        <div className="mt-2 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2">
          <span className="text-lg" aria-hidden>📍</span>
          <div>
            <p className="text-xs font-semibold text-gray-900">{COCONUT_VENDOR.area}</p>
            <p className="text-[11px] text-gray-600">{COCONUT_VENDOR.pickupAddress}</p>
            <p className="text-[11px] text-gray-500">
              Delivery in {COCONUT_VENDOR.estimatedMinutes} min · {COCONUT_VENDOR.deliveryFlatInr === 0 ? (
                <span className="font-semibold text-green-600">FREE Delivery</span>
              ) : (
                `₹${COCONUT_VENDOR.deliveryFlatInr} delivery`
              )}
            </p>
          </div>
        </div>

        <h2 className="mt-6 text-xs font-bold uppercase tracking-widest text-gray-400">Single Items</h2>
        <div className="mt-3 space-y-3">
          {singles.map((p) => (
            <CoconutProductCard key={p.id} product={p} />
          ))}
        </div>

        {combos.length > 0 && (
          <>
            <h2 className="mt-8 text-xs font-bold uppercase tracking-widest text-gray-400">Combos &amp; Packs</h2>
            <div className="mt-3 space-y-3">
              {combos.map((p) => (
                <CoconutProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}
      </div>

      <CoconutCartBar onCheckout={() => router.push('/noida/coconut/checkout')} />
    </div>
  );
}
