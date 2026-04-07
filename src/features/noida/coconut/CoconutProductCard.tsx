'use client';

import { Minus, Plus } from 'lucide-react';
import { trackAddToCart, trackRemoveFromCart } from '@/lib/analytics';
import type { CoconutProduct } from './products';
import { useCoconutCartStore } from './coconutCartStore';

export default function CoconutProductCard({ product }: { product: CoconutProduct }) {
  const addOrIncrement = useCoconutCartStore((s) => s.addOrIncrement);
  const setQuantity = useCoconutCartStore((s) => s.setQuantity);
  const items = useCoconutCartStore((s) => s.items);
  const line = items.find((i) => i.productId === product.id);
  const qty = line?.quantity ?? 0;

  const addOne = () => {
    addOrIncrement({
      productId: product.id,
      name: product.name,
      price: product.priceInr,
      image: product.image,
    });
    trackAddToCart(product.id, product.name, product.priceInr, 1);
  };

  const isLargeVisual = product.visual.length > 6;

  return (
    <article className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:gap-4 sm:p-4">
      <div className="relative flex h-[90px] w-[90px] shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 sm:h-[100px] sm:w-[100px]">
        <span
          className={`select-none leading-none ${isLargeVisual ? 'text-2xl' : 'text-4xl'}`}
          role="img"
          aria-label={product.name}
        >
          {product.visual}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap gap-1">
          {product.popular && (
            <span className="rounded-md bg-green-100 px-2 py-0.5 text-[9px] font-bold uppercase text-green-700">Popular</span>
          )}
          {product.tag && (
            <span className="rounded-md bg-orange-100 px-2 py-0.5 text-[9px] font-bold uppercase text-orange-700">{product.tag}</span>
          )}
          {product.combo && !product.tag && (
            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[9px] font-bold uppercase text-blue-700">Combo</span>
          )}
        </div>
        <h3 className="mt-1 text-sm font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-gray-500">{product.shortDescription}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <p className="text-base font-semibold tabular-nums text-gray-900">₹{product.priceInr}</p>
          {qty === 0 ? (
            <button
              type="button"
              onClick={addOne}
              className="inline-flex min-h-[38px] items-center gap-1 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-0.5">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="grid h-8 w-8 place-items-center rounded-lg bg-white text-gray-700 shadow-sm"
                onClick={() => {
                  trackRemoveFromCart(product.id, 1, product.priceInr);
                  setQuantity(product.id, qty - 1);
                }}
              >
                <Minus className="h-4 w-4" strokeWidth={2} />
              </button>
              <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums text-gray-900">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="grid h-8 w-8 place-items-center rounded-lg bg-white text-gray-700 shadow-sm"
                onClick={addOne}
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
