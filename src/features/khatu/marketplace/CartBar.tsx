'use client';

import { ShoppingBag } from 'lucide-react';
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

type CartBarProps = {
  onOpenDrawer: () => void;
  onBookDeliveryClick: () => void;
  whatsappUrl: string | null;
  onWhatsAppClick: () => void;
  canBookDelivery: boolean;
};

export default function CartBar({
  onOpenDrawer,
  onBookDeliveryClick,
  whatsappUrl,
  onWhatsAppClick,
  canBookDelivery,
}: CartBarProps) {
  const items = useMarketplaceCartStore((s) => s.items);
  const shopName = useMarketplaceCartStore((s) => s.shopName);
  const whatsappOpened = useMarketplaceCartStore((s) => s.whatsappOpened);

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

        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsAppClick}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--whatsapp-green)] text-sm font-semibold text-white transition-opacity hover:opacity-95"
          >
            <IconWhatsApp className="h-5 w-5 shrink-0" />
            Send order via WhatsApp
          </a>
        ) : (
          <p className="rounded-xl border border-amber-200/80 bg-amber-50 px-3 py-2 text-center text-[11px] text-amber-900">
            Merchant WhatsApp is not set for this shop — use the cart drawer for your list, then contact the shop directly.
          </p>
        )}

        {!whatsappOpened && whatsappUrl ? (
          <p className="text-center text-[10px] text-[var(--khatu-stone-muted)]">
            Tap WhatsApp first to unlock delivery booking.
          </p>
        ) : null}

        <button
          type="button"
          onClick={() => {
            if (canBookDelivery) {
              onBookDeliveryClick();
              return;
            }
            onOpenDrawer();
          }}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-95 disabled:pointer-events-none disabled:opacity-45"
          disabled={!whatsappUrl}
        >
          <IconDelivery className="h-5 w-5 shrink-0" />
          {canBookDelivery ? 'Book delivery boy' : whatsappUrl ? 'Next: WhatsApp' : 'Review cart'}
        </button>
      </div>
    </div>
  );
}
