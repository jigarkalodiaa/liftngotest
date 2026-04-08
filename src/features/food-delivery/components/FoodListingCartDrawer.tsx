import Link from 'next/link';
import type { FoodOrderCartDraft } from '@/lib/storage';
import { parsePrice } from '@/data/restaurantsKhatushyam';
import { ROUTES } from '@/lib/constants';

type CartLine = FoodOrderCartDraft['items'][number];

type Props = {
  open: boolean;
  onClose: () => void;
  hasItems: boolean;
  restaurantLabel: string;
  lines: CartLine[] | undefined;
  menuHref: string;
};

export function FoodListingCartDrawer({
  open,
  onClose,
  hasItems,
  restaurantLabel,
  lines,
  menuHref,
}: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
        onClick={onClose}
      />
      <div
        className={`fixed inset-x-0 bottom-0 z-[65] max-h-[min(70vh,28rem)] rounded-t-2xl border border-[var(--landing-primary)]/10 bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Your delivery list"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <span className="font-semibold text-gray-900">Your order</span>
          <button
            type="button"
            className="min-h-11 min-w-11 rounded-full text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>
        <div className="max-h-[45vh] overflow-y-auto px-4 py-3">
          {!hasItems ? (
            <p className="py-8 text-center text-sm text-gray-600">
              Nothing here yet—choose a restaurant and add items from the menu.
            </p>
          ) : (
            <ul className="space-y-2">
              <li className="mb-2 text-xs font-semibold text-[var(--color-primary)]">{restaurantLabel}</li>
              {lines?.map((line) => (
                <li key={line.name} className="flex justify-between gap-2 text-sm">
                  <span className="text-gray-800">
                    {line.name} × {line.quantity}
                  </span>
                  <span className="shrink-0 font-medium text-gray-900">
                    ₹{parsePrice(line.price) * line.quantity}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {hasItems && (
          <div className="space-y-2 border-t border-gray-100 p-4">
            <Link
              href={ROUTES.FIND_RESTAURANT_CART}
              onClick={onClose}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#1A1D3A] text-sm font-semibold text-white hover:opacity-95"
            >
              View cart &amp; pay
            </Link>
            <Link
              href={menuHref}
              onClick={onClose}
              className="flex min-h-11 w-full items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Back to menu
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
