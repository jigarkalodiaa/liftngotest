'use client';

import { ShoppingBag } from 'lucide-react';
import {
  MARKETPLACE_DELIVERY_FLAT_INR,
  marketplaceCartSubtotal,
  useMarketplaceCartStore,
} from '@/features/khatu/marketplace/cartStore';

type CartBarProps = {
  onOpenDrawer: () => void;
  onCheckoutClick: () => void;
};

export default function CartBar({ onOpenDrawer, onCheckoutClick }: CartBarProps) {
  const items = useMarketplaceCartStore((s) => s.items);
  const shopName = useMarketplaceCartStore((s) => s.shopName);

  if (items.length === 0) return null;

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = marketplaceCartSubtotal(items);
  const grand = subtotal + MARKETPLACE_DELIVERY_FLAT_INR;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/98 px-3 py-3 shadow-[0_-12px_40px_rgba(28,25,23,0.08)] backdrop-blur-md">
      <div className="mx-auto w-full max-w-xl space-y-2 sm:max-w-2xl">
        <button
          type="button"
          onClick={onOpenDrawer}
          className="flex w-full items-center gap-3 rounded-2xl border border-stone-200 bg-[var(--khatu-cream)] px-3 py-2.5 text-left"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-stone-200/80">
            <ShoppingBag className="h-5 w-5 text-[var(--khatu-saffron)]" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[var(--khatu-stone)]">{shopName}</p>
            <p className="text-[11px] text-[var(--khatu-stone-muted)]">
              {count} item{count === 1 ? '' : 's'} · Subtotal ₹{subtotal}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-sm font-semibold tabular-nums text-[var(--khatu-stone)]">₹{grand}</p>
            <p className="text-[10px] text-[var(--khatu-stone-muted)]">incl. delivery</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            onCheckoutClick();
          }}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-95 disabled:pointer-events-none disabled:opacity-45"
        >
          Cart &amp; pay
        </button>
      </div>
    </div>
  );
}
