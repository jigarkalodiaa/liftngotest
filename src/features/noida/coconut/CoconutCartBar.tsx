'use client';

import { ShoppingBag } from 'lucide-react';
import { trackCheckoutStarted, trackViewCart } from '@/lib/analytics';
import { useCoconutCartStore, coconutCartSubtotal } from './coconutCartStore';
import { COCONUT_VENDOR } from './products';

type CoconutCartBarProps = {
  onCheckout: () => void;
};

export default function CoconutCartBar({ onCheckout }: CoconutCartBarProps) {
  const items = useCoconutCartStore((s) => s.items);
  if (items.length === 0) return null;

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = coconutCartSubtotal(items);
  const grand = subtotal + COCONUT_VENDOR.deliveryFlatInr;

  const goCheckout = () => {
    trackViewCart(count, grand, 'noida_coconut_menu');
    trackCheckoutStarted('noida_coconut_checkout', grand);
    onCheckout();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/98 px-3 py-3 shadow-[0_-12px_40px_rgba(0,0,0,0.08)] backdrop-blur-md">
      <div className="mx-auto w-full max-w-xl sm:max-w-2xl">
        <button
          type="button"
          onClick={goCheckout}
          className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-left"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-200/80">
            <ShoppingBag className="h-5 w-5 text-[var(--color-primary)]" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-gray-900">{COCONUT_VENDOR.name}</p>
            <p className="text-[11px] text-gray-500">
              {count} item{count === 1 ? '' : 's'} · Subtotal ₹{subtotal}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold tabular-nums text-gray-900">₹{grand}</p>
            <p className="text-[10px] text-gray-500">incl. delivery</p>
          </div>
        </button>

        <button
          type="button"
          onClick={goCheckout}
          className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-95"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
