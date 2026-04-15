'use client';

import { Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { trackAddToCart, trackRemoveFromCart } from '@/lib/analytics';
import { trackEvent as trackPosthogEvent } from '@/lib/posthogAnalytics';
import type { CoconutProduct } from './products';
import { useCoconutCartStore } from './coconutCartStore';

const REVIEWS = [
  { text: 'Ekdum fresh tha bhai, seedha counter jaisa!', name: 'Rahul', area: 'Sec 53', time: '2 hrs ago' },
  { text: 'Best nariyal pani in Noida. Will order again!', name: 'Priya', area: 'Sec 62', time: '1 hr ago' },
  { text: 'Bahut thanda aur meetha. Perfect for summer!', name: 'Amit', area: 'Sec 50', time: '45 min ago' },
  { text: 'Delivery was super fast. Coconut was fresh.', name: 'Sneha', area: 'Sec 44', time: '3 hrs ago' },
  { text: 'Same taste as roadside counter. Love it!', name: 'Vikram', area: 'Sec 51', time: '30 min ago' },
  { text: 'Ordered for office, everyone loved it!', name: 'Neha', area: 'Sec 63', time: '1 hr ago' },
  { text: 'Fresh and natural. No added sugar taste.', name: 'Arjun', area: 'Sec 52', time: '4 hrs ago' },
  { text: 'Ghar baithe fresh nariyal. What a time!', name: 'Kavita', area: 'Sec 45', time: '2 hrs ago' },
];

export interface CoconutProductCardProps {
  product: CoconutProduct;
  isFeatured?: boolean;
  isPack?: boolean;
  /** Live scarcity count for ×4 pack (from parent randomizer). */
  packStockLeft?: number;
  /** Live “viewing now” count for ×4 pack. */
  packViewers?: number;
}

export default function CoconutProductCard({
  product,
  isFeatured,
  isPack,
  packStockLeft,
  packViewers,
}: CoconutProductCardProps) {
  const addOrIncrement = useCoconutCartStore((s) => s.addOrIncrement);
  const setQuantity = useCoconutCartStore((s) => s.setQuantity);
  const items = useCoconutCartStore((s) => s.items);
  const line = items.find((i) => i.productId === product.id);
  const qty = line?.quantity ?? 0;

  const [review, setReview] = useState(REVIEWS[0]);
  useEffect(() => {
    const randomReview = REVIEWS[Math.floor(Math.random() * REVIEWS.length)];
    setReview(randomReview);
  }, []);

  const addOne = () => {
    addOrIncrement({
      productId: product.id,
      name: product.name,
      price: product.priceInr,
      image: product.image,
    });
    trackAddToCart(product.id, product.name, product.priceInr, 1);
    trackPosthogEvent('add_to_cart', {
      item_id: product.id,
      item_name: product.name,
      value: product.priceInr,
      quantity: 1,
      source: 'noida_coconut_menu',
    });
  };

  return (
    <article className="overflow-hidden rounded-[12px] border border-gray-200 bg-white shadow-sm">
      {isPack && (
        <div className="flex flex-nowrap items-center justify-center gap-2 bg-[#2E7D32] px-3 py-1.5 text-white">
          <span className="truncate text-[10px] font-bold tracking-tight sm:text-[11px]">Best Value · 4-pack</span>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-extrabold sm:px-2.5 sm:text-[10px]"
            style={{ background: '#66BB6A', color: '#fff', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}
          >
            Health choice
          </span>
        </div>
      )}

      {isFeatured && (
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-2 py-1 sm:gap-4 sm:px-3 sm:py-2">
          <span className="flex items-center gap-1 text-[8px] font-semibold text-green-700 sm:text-[9px]">Full of Water</span>
          <span className="flex items-center gap-1 text-[8px] font-semibold text-green-700 sm:text-[9px]">Freshness Guaranteed</span>
          <span className="hidden items-center gap-1 text-[9px] font-semibold text-green-700 sm:flex">Premium Quality</span>
        </div>
      )}

      <div className="flex flex-row gap-2 p-2.5 sm:gap-4 sm:p-4">
        <div className="relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-green-50 sm:h-24 sm:w-24 sm:rounded-[12px]">
          {isPack ? (
            <div className="grid grid-cols-2 gap-px p-0.5 sm:gap-0.5 sm:p-1">
              {[1, 2, 3, 4].map((i) => (
                <Image
                  key={i}
                  src={product.image}
                  alt={`${product.name} ${i}`}
                  width={32}
                  height={32}
                  className="object-contain sm:h-9 sm:w-9"
                />
              ))}
            </div>
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              width={72}
              height={72}
              className="h-[4.25rem] w-[4.25rem] object-contain sm:h-24 sm:w-24"
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {isFeatured && (
            <div className="mb-1 flex flex-wrap gap-1">
              <span
                className="rounded px-1.5 py-0.5 text-[8px] font-extrabold"
                style={{ background: '#FFF3E0', color: '#E65100', border: '1px solid #FFCC80' }}
              >
                🌡️ Most ordered on hot days
              </span>
              <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-orange-700">Popular</span>
            </div>
          )}

          <h3 className="text-[13px] font-bold leading-tight text-gray-900 sm:text-sm">{product.name}</h3>
          <p className="mt-0.5 line-clamp-2 text-[11px] text-gray-500 sm:text-xs">{product.shortDescription}</p>

          {isFeatured && (
            <p className="mt-0.5 text-[10px] leading-snug sm:mt-1 sm:text-[11px]" style={{ color: '#2E7D32', fontWeight: 700 }}>
              = 1 hour at the gym, in a coconut 🥥
            </p>
          )}
          {isPack && (
            <p className="mt-0.5 text-[10px] leading-snug sm:mt-1 sm:text-[11px]" style={{ color: '#2E7D32', fontWeight: 700 }}>
              Your family&apos;s daily hydration sorted
            </p>
          )}

          {isPack && packStockLeft != null && packViewers != null && (
            <div className="mt-1.5 flex flex-col gap-0.5 text-[9px] font-bold leading-tight sm:mt-2 sm:gap-1 sm:text-[10px] sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
              <span style={{ color: '#E65100' }}>🏃 {packStockLeft} packs left for today&apos;s delivery window</span>
              <span style={{ color: '#1565C0' }}>👥 {packViewers} people viewing this right now</span>
            </div>
          )}

          <div className="mt-2 flex flex-col gap-1.5 sm:mt-auto sm:gap-2">
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-base font-bold tabular-nums sm:text-lg" style={{ color: '#2E7D32' }}>
                  ₹{product.priceInr}
                </p>
                {isFeatured && (
                  <p className="text-[10px] font-semibold text-[#0d9488]">
                    Cools you down in 2 sips
                  </p>
                )}
                {isPack && (
                  <p className="text-[10px] font-semibold text-green-600">Save ₹17 vs buying 4 singles</p>
                )}
              </div>

              {qty === 0 ? null : (
                <div className="flex shrink-0 items-center gap-1 self-end rounded-[12px] border border-gray-200 bg-gray-50 p-0.5">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className="grid h-9 w-9 place-items-center rounded-[8px] bg-white text-gray-700 shadow-sm sm:h-8 sm:w-8"
                    onClick={() => {
                      trackRemoveFromCart(product.id, 1, product.priceInr);
                      trackPosthogEvent('remove_from_cart', {
                        item_id: product.id,
                        item_name: product.name,
                        value: product.priceInr,
                        quantity: 1,
                        source: 'noida_coconut_menu',
                      });
                      setQuantity(product.id, qty - 1);
                    }}
                  >
                    <Minus className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-bold tabular-nums text-gray-900">{qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className="grid h-9 w-9 place-items-center rounded-[8px] bg-white text-gray-700 shadow-sm sm:h-8 sm:w-8"
                    onClick={addOne}
                  >
                    <Plus className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              )}
            </div>

            {qty === 0 ? (
              <div className="w-full">
                <button
                  type="button"
                  onClick={addOne}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[12px] bg-[var(--color-primary)] px-3 py-2.5 text-[13px] font-extrabold text-white transition-transform hover:scale-[1.02] hover:bg-[var(--color-primary-hover)] active:scale-[0.99] sm:min-h-[48px] sm:px-4 sm:py-3 sm:text-sm"
                >
                  <Plus className="h-5 w-5" strokeWidth={2.5} />
                  Add
                </button>
                <p className="mt-1 text-center text-[10px] font-semibold text-gray-500">Usually 15–25 min</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {isFeatured && (
        <div className="border-t border-gray-100 bg-gray-50 px-2.5 py-1.5 sm:px-3 sm:py-2">
          <p className="line-clamp-2 text-[9px] leading-snug text-gray-600 sm:text-[10px]">
            💬 &quot;{review.text}&quot; — {review.name}, {review.area} · {review.time}
          </p>
        </div>
      )}
    </article>
  );
}
