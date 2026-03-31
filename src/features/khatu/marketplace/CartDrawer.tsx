'use client';

import Image from '@/components/OptimizedImage';
import { Minus, Plus, Trash2 } from 'lucide-react';
import BottomSheet from '@/components/ui/BottomSheet';
import {
  MARKETPLACE_DELIVERY_FLAT_INR,
  marketplaceCartSubtotal,
  useMarketplaceCartStore,
} from '@/features/khatu/marketplace/cartStore';

const IconWhatsApp = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const IconDelivery = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  onBookDeliveryClick: () => void;
  whatsappUrl: string | null;
  onWhatsAppClick: () => void;
  canBookDelivery: boolean;
};

export default function CartDrawer({
  open,
  onClose,
  onBookDeliveryClick,
  whatsappUrl,
  onWhatsAppClick,
  canBookDelivery,
}: CartDrawerProps) {
  const shopName = useMarketplaceCartStore((s) => s.shopName);
  const items = useMarketplaceCartStore((s) => s.items);
  const whatsappOpened = useMarketplaceCartStore((s) => s.whatsappOpened);
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

            <p className="rounded-xl border border-[var(--khatu-saffron)]/20 bg-[var(--khatu-cream)] px-3 py-2 text-[11px] leading-relaxed text-[var(--khatu-stone)]">
              <strong className="text-[var(--khatu-stone)]">Next:</strong> Send your list on{' '}
              <strong className="text-[var(--color-primary)]">WhatsApp</strong> so the shop can confirm. Then{' '}
              <strong className="text-[var(--color-primary)]">Book delivery boy</strong> for pickup at the shop.
            </p>

            {whatsappUrl ? (
              <>
                {!whatsappOpened ? (
                  <p className="text-center text-[11px] text-amber-900">
                    Tap <strong>Send order via WhatsApp</strong> below to unlock booking.
                  </p>
                ) : null}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    onWhatsAppClick();
                  }}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--whatsapp-green)] text-sm font-semibold text-white transition-opacity hover:opacity-95"
                >
                  <IconWhatsApp className="h-5 w-5 shrink-0" />
                  Send order via WhatsApp
                </a>
              </>
            ) : (
              <p className="rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2 text-center text-[11px] text-amber-900">
                WhatsApp is not configured for this listing.
              </p>
            )}

            <button
              type="button"
              disabled={!canBookDelivery || !whatsappUrl}
              onClick={() => {
                onClose();
                onBookDeliveryClick();
              }}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              <IconDelivery className="h-5 w-5 shrink-0" />
              Book delivery boy
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
