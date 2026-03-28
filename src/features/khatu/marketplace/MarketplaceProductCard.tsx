'use client';

import Image from 'next/image';
import { Minus, Plus } from 'lucide-react';
import { Badge } from '@/components/ui';
import type { KhatuShopProduct } from '@/types/khatu';
import { useMarketplaceCartStore } from '@/features/khatu/marketplace/cartStore';

type MarketplaceProductCardProps = {
  product: KhatuShopProduct;
  shopId: string;
  shopName: string;
  onWrongShop: () => void;
};

export default function MarketplaceProductCard({
  product,
  shopId,
  shopName,
  onWrongShop,
}: MarketplaceProductCardProps) {
  const addOrIncrement = useMarketplaceCartStore((s) => s.addOrIncrement);
  const setQuantity = useMarketplaceCartStore((s) => s.setQuantity);
  const items = useMarketplaceCartStore((s) => s.items);
  const line = items.find((i) => i.productId === product.id);
  const qty = line?.quantity ?? 0;

  const addOne = () => {
    const r = addOrIncrement(shopId, shopName, {
      productId: product.id,
      name: product.name,
      price: product.priceInr,
      image: product.image,
    });
    if (r === 'different_shop') onWrongShop();
  };

  return (
    <article className="flex gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-sm sm:gap-4 sm:p-4">
      <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-xl bg-stone-50 sm:h-[110px] sm:w-[110px]">
        <Image src={product.image} alt="" fill className="object-cover" sizes="110px" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap gap-1">
          {product.popular ? (
            <Badge variant="popular" className="normal-case tracking-normal">
              Popular
            </Badge>
          ) : null}
          {product.fastSelling ? (
            <Badge variant="warning" className="normal-case tracking-normal">
              Fast selling
            </Badge>
          ) : null}
        </div>
        <h3 className="mt-1 font-semibold text-[var(--khatu-stone)]">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--khatu-stone-muted)]">
          {product.shortDescription}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
          <p className="text-base font-semibold tabular-nums text-[var(--khatu-stone)]">₹{product.priceInr}</p>
          {qty === 0 ? (
            <button
              type="button"
              onClick={addOne}
              className="inline-flex min-h-[40px] items-center gap-1 rounded-xl bg-[var(--khatu-saffron)] px-4 py-2 text-xs font-semibold text-white"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-xl border border-stone-200 bg-[var(--khatu-cream)] p-0.5">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[var(--khatu-stone)] shadow-sm"
                onClick={() => setQuantity(product.id, qty - 1)}
              >
                <Minus className="h-4 w-4" strokeWidth={2} />
              </button>
              <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums text-[var(--khatu-stone)]">
                {qty}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="grid h-9 w-9 place-items-center rounded-lg bg-white text-[var(--khatu-stone)] shadow-sm"
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
