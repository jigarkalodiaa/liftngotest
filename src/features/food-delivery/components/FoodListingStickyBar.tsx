import { BookDeliveryBoyLink } from '@/features/food-delivery/components/FoodDeliveryAuthLinks';

type Props = {
  itemCount: number;
  hasItems: boolean;
  menuHref: string;
  onOpenCart: () => void;
};

export function FoodListingStickyBar({ itemCount, hasItems, menuHref, onOpenCart }: Props) {
  return (
    <div
      id="sticky-food-cta"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--landing-primary)]/12 bg-white/95 px-3 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md sm:px-4"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onOpenCart}
          className="flex min-h-[3.25rem] min-w-0 flex-1 flex-col items-center justify-center rounded-xl border border-[var(--landing-primary)]/20 bg-white px-2 text-center transition hover:bg-[var(--landing-bg)] sm:flex-row sm:gap-2"
        >
          <span className="text-xs font-semibold text-[var(--color-primary)] sm:text-sm">Your list</span>
          <span className="text-[0.6875rem] text-gray-600 sm:text-sm">
            {hasItems ? `${itemCount} item${itemCount === 1 ? '' : 's'}` : 'Empty'}
          </span>
        </button>
        <BookDeliveryBoyLink menuHref={menuHref} enabled={hasItems} />
      </div>
    </div>
  );
}
