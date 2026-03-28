'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import BottomSheet from '@/components/ui/BottomSheet';
import {
  MARKETPLACE_DELIVERY_FLAT_INR,
  marketplaceCartSubtotal,
  useMarketplaceCartStore,
} from '@/features/khatu/marketplace/cartStore';

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
};

export default function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const shopName = useMarketplaceCartStore((s) => s.shopName);
  const items = useMarketplaceCartStore((s) => s.items);
  const setQuantity = useMarketplaceCartStore((s) => s.setQuantity);
  const removeLine = useMarketplaceCartStore((s) => s.removeLine);
  const clear = useMarketplaceCartStore((s) => s.clear);

  const subtotal = marketplaceCartSubtotal(items);
  const grand = subtotal + MARKETPLACE_DELIVERY_FLAT_INR;

  return (
    <BottomSheet
      isOpen={open}
      onClose={onClose}
      title="Your cart"
      titleId="khatu-cart-drawer-title"
      footer={
        items.length > 0 ? (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-[var(--khatu-stone-muted)]">
              <span>Subtotal</span>
              <span className="font-medium tabular-nums text-[var(--khatu-stone)]">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-[var(--khatu-stone-muted)]">
              <span>Delivery (Liftngo)</span>
              <span className="font-medium tabular-nums text-[var(--khatu-stone)]">₹{MARKETPLACE_DELIVERY_FLAT_INR}</span>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-semibold text-[var(--khatu-stone)]">
              <span>Total</span>
              <span className="tabular-nums">₹{grand}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white"
            >
              Proceed to checkout
            </button>
          </div>
        ) : undefined
      }
    >
      {shopName ? (
        <p className="px-5 pt-2 text-xs font-semibold text-[var(--khatu-stone-muted)]">{shopName}</p>
      ) : null}
      <div className="space-y-3 px-5 py-4">
        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-[var(--khatu-stone-muted)]">Your cart is empty.</p>
        ) : (
          items.map((line) => (
            <div key={line.productId} className="flex gap-3 rounded-xl border border-stone-200 bg-white p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-stone-50">
                <Image src={line.image} alt="" fill className="object-cover" sizes="56px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--khatu-stone)]">{line.name}</p>
                <p className="text-xs text-[var(--khatu-stone-muted)]">₹{line.price} each</p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 rounded-lg border border-stone-200 bg-[var(--khatu-cream)] p-0.5">
                    <button
                      type="button"
                      className="grid h-8 w-8 place-items-center rounded-md bg-white"
                      onClick={() => setQuantity(line.productId, line.quantity - 1)}
                      aria-label="Decrease"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold tabular-nums">{line.quantity}</span>
                    <button
                      type="button"
                      className="grid h-8 w-8 place-items-center rounded-md bg-white"
                      onClick={() => setQuantity(line.productId, line.quantity + 1)}
                      aria-label="Increase"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-rose-600"
                    aria-label="Remove item"
                    onClick={() => removeLine(line.productId)}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        {items.length > 0 ? (
          <button
            type="button"
            onClick={() => clear()}
            className="w-full py-2 text-center text-xs font-semibold text-[var(--khatu-stone-muted)] underline"
          >
            Clear cart
          </button>
        ) : null}
      </div>
    </BottomSheet>
  );
}
