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

interface CoconutProductCardProps {
  product: CoconutProduct;
  isFeatured?: boolean;
  isPack?: boolean;
}

export default function CoconutProductCard({ product, isFeatured, isPack }: CoconutProductCardProps) {
  const addOrIncrement = useCoconutCartStore((s) => s.addOrIncrement);
  const setQuantity = useCoconutCartStore((s) => s.setQuantity);
  const items = useCoconutCartStore((s) => s.items);
  const line = items.find((i) => i.productId === product.id);
  const qty = line?.quantity ?? 0;

  // Random review that changes
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
      {/* Pack highlight */}
      {isPack && (
        <div className="bg-green-500 px-3 py-1.5 text-center text-xs font-bold text-white">
          Best Value · Free Delivery
        </div>
      )}

      {/* Freshness Guarantee for featured */}
      {isFeatured && (
        <div className="flex items-center justify-center gap-4 bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2">
          <span className="flex items-center gap-1 text-[9px] font-semibold text-green-700">
            Full of Water
          </span>
          <span className="flex items-center gap-1 text-[9px] font-semibold text-green-700">
            Freshness Guaranteed
          </span>
          <span className="flex items-center gap-1 text-[9px] font-semibold text-green-700">
            Premium Quality
          </span>
        </div>
      )}

      <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
        {/* Product Image */}
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-green-50 sm:h-24 sm:w-24">
          {isPack ? (
            <div className="grid grid-cols-2 gap-0.5 p-1">
              {[1, 2, 3, 4].map((i) => (
                <Image
                  key={i}
                  src={product.image}
                  alt={`${product.name} ${i}`}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              ))}
            </div>
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              width={80}
              height={80}
              className="object-contain"
            />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Badges */}
          {isFeatured && (
            <div className="mb-1 flex flex-wrap gap-1">
              <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-orange-700">Popular</span>
              <span className="rounded bg-yellow-100 px-1.5 py-0.5 text-[9px] font-bold text-yellow-700">Free delivery</span>
              <span className="rounded bg-green-100 px-1.5 py-0.5 text-[9px] font-bold text-green-700">Counter price</span>
            </div>
          )}

          <h3 className="text-sm font-bold text-gray-900">{product.name}</h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-gray-500">{product.shortDescription}</p>

          {/* Price & Add */}
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <div>
              <p className="text-lg font-bold tabular-nums text-[var(--color-primary)]">₹{product.priceInr}</p>
              {isPack && (
                <p className="text-[10px] font-semibold text-green-600">
                  Save ₹17 vs buying 4 singles
                </p>
              )}
            </div>

            {qty === 0 ? (
              <button
                type="button"
                onClick={addOne}
                className="inline-flex min-h-[36px] items-center gap-1 rounded-[12px] bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-white"
              >
                <Plus className="h-4 w-4" strokeWidth={2} />
                Add
              </button>
            ) : (
              <div className="flex items-center gap-1 rounded-[12px] border border-gray-200 bg-gray-50 p-0.5">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="grid h-8 w-8 place-items-center rounded-[8px] bg-white text-gray-700 shadow-sm"
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
                  className="grid h-8 w-8 place-items-center rounded-[8px] bg-white text-gray-700 shadow-sm"
                  onClick={addOne}
                >
                  <Plus className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review for featured */}
      {isFeatured && (
        <div className="border-t border-gray-100 bg-gray-50 px-3 py-2">
          <p className="text-[10px] text-gray-600">
            💬 &quot;{review.text}&quot; — {review.name}, {review.area} · {review.time}
          </p>
        </div>
      )}
    </article>
  );
}
