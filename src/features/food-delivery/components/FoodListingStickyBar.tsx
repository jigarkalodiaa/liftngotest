'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

type Props = {
  itemCount: number;
  hasItems: boolean;
  onOpenCart: () => void;
};

export function FoodListingStickyBar({ itemCount, hasItems, onOpenCart }: Props) {
  const router = useRouter();
  const checkoutClass =
    'inline-flex min-h-[3.25rem] flex-[1.4] items-center justify-center rounded-xl bg-[#1A1D3A] px-4 text-center text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1D3A] focus-visible:ring-offset-2 active:opacity-90 sm:text-base';

  return (
    <div
      id="sticky-food-cta"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--landing-primary)]/12 bg-white/95 px-3 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md sm:px-4"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => {
            if (hasItems) router.push(ROUTES.FIND_RESTAURANT_CART);
            else onOpenCart();
          }}
          className="flex min-h-[3.25rem] min-w-0 flex-1 flex-col items-center justify-center rounded-xl border border-[var(--landing-primary)]/20 bg-white px-2 text-center transition hover:bg-[var(--landing-bg)] sm:flex-row sm:gap-2"
        >
          <span className="text-xs font-semibold text-[var(--color-primary)] sm:text-sm">Your list</span>
          <span className="text-[0.6875rem] text-gray-600 sm:text-sm">
            {hasItems ? `${itemCount} item${itemCount === 1 ? '' : 's'}` : 'Empty'}
          </span>
        </button>
        {hasItems ? (
          <button type="button" onClick={() => router.push(ROUTES.FIND_RESTAURANT_CART)} className={checkoutClass}>
            Cart &amp; pay
          </button>
        ) : (
          <span
            className={`${checkoutClass} cursor-not-allowed bg-gray-300 text-gray-600 opacity-100 shadow-none hover:opacity-100`}
            aria-disabled="true"
          >
            Cart &amp; pay
          </span>
        )}
      </div>
    </div>
  );
}
