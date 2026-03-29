'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useKhatuShop } from '@/hooks/useKhatuData';
import { ROUTES } from '@/lib/constants';
import { SectionHeader } from '@/components/ui';
import Modal from '@/components/ui/Modal';
import type { KhatuShopProduct } from '@/types/khatu';
import KhatuScreenShell from '@/features/khatu/common/KhatuScreenShell';
import ShopHeader from '@/features/khatu/marketplace/ShopHeader';
import MarketplaceProductCard from '@/features/khatu/marketplace/MarketplaceProductCard';
import CartBar from '@/features/khatu/marketplace/CartBar';
import CartDrawer from '@/features/khatu/marketplace/CartDrawer';
import { useMarketplaceCartStore } from '@/features/khatu/marketplace/cartStore';
import { buildMarketplaceWhatsAppMessage, marketplaceWhatsAppHref } from '@/features/khatu/marketplace/marketplaceWhatsApp';
import {
  isUserAuthenticated,
  setDeliveryGoodsDescription,
  setLoginContinuationMessage,
  setPickupLocation,
  setPostLoginRedirect,
} from '@/lib/storage';
import { trackBookNowClick, trackWhatsAppClick } from '@/lib/analytics';

export default function KhatuShopPage({ shopId }: { shopId: string }) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useKhatuShop(shopId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [switchModal, setSwitchModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<KhatuShopProduct | null>(null);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);

  const replaceShopAndAdd = useMarketplaceCartStore((s) => s.replaceShopAndAdd);
  const cartShopId = useMarketplaceCartStore((s) => s.shopId);
  const items = useMarketplaceCartStore((s) => s.items);
  const shopName = useMarketplaceCartStore((s) => s.shopName);
  const merchantWhatsApp = useMarketplaceCartStore((s) => s.merchantWhatsApp);
  const whatsappOpened = useMarketplaceCartStore((s) => s.whatsappOpened);
  const setWhatsappOpened = useMarketplaceCartStore((s) => s.setWhatsappOpened);

  const waMessage = useMemo(() => buildMarketplaceWhatsAppMessage(shopName || '', items), [shopName, items]);
  const whatsappUrl = useMemo(
    () => marketplaceWhatsAppHref(merchantWhatsApp || '', waMessage),
    [merchantWhatsApp, waMessage]
  );
  const canBookDelivery = items.length > 0 && Boolean(whatsappUrl) && whatsappOpened;

  useEffect(() => {
    if (!data?.shop) return;
    if (cartShopId !== data.shop.id) return;
    const st = useMarketplaceCartStore.getState();
    const digits = data.shop.merchantWhatsApp?.replace(/\D/g, '') ?? null;
    if (digits && (!st.merchantWhatsApp || !st.pickupAddressLine)) {
      useMarketplaceCartStore.setState({
        merchantWhatsApp: st.merchantWhatsApp || digits,
        pickupAddressLine: st.pickupAddressLine || data.shop.pickupAddressLine?.trim() || null,
      });
    }
  }, [data?.shop, cartShopId]);

  const onWrongShop = (p: KhatuShopProduct) => {
    setPendingProduct(p);
    setSwitchModal(true);
  };

  const confirmSwitch = () => {
    if (!data?.shop || !pendingProduct) return;
    replaceShopAndAdd(
      data.shop.id,
      data.shop.name,
      {
        productId: pendingProduct.id,
        name: pendingProduct.name,
        price: pendingProduct.priceInr,
        image: pendingProduct.image,
        quantity: 1,
      },
      {
        merchantWhatsApp: data.shop.merchantWhatsApp?.replace(/\D/g, '') ?? null,
        pickupAddressLine: data.shop.pickupAddressLine?.trim() || null,
      }
    );
    setSwitchModal(false);
    setPendingProduct(null);
  };

  const handleBookDeliveryClick = () => {
    trackBookNowClick('khatu_marketplace_book_delivery');
    setShowPaymentConfirm(true);
  };

  const pickupUrl = `${ROUTES.PICKUP_LOCATION}?step=2&from=food&fresh=1`;

  const handlePaymentConfirmed = () => {
    trackBookNowClick('khatu_marketplace_after_payment');
    const st = useMarketplaceCartStore.getState();
    const name = st.shopName || 'Shop';
    const addr = st.pickupAddressLine?.trim() || name;
    setPickupLocation({
      name,
      address: addr,
      contact: '',
    });
    setDeliveryGoodsDescription({
      restaurantName: name,
      items: st.items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: `₹${i.price}`,
      })),
      source: 'marketplace',
    });

    if (!isUserAuthenticated()) {
      setPostLoginRedirect(pickupUrl);
      setLoginContinuationMessage('Please login to continue your booking.');
      setShowPaymentConfirm(false);
      router.push(`${ROUTES.LOGIN}?from=food`);
      return;
    }

    setShowPaymentConfirm(false);
    router.push(pickupUrl);
  };

  if (isLoading) {
    return (
      <KhatuScreenShell title="Shop" backHref={ROUTES.KHATU_MARKETPLACE}>
        <p className="py-12 text-center text-sm text-[var(--khatu-stone-muted)]">Loading shop…</p>
      </KhatuScreenShell>
    );
  }

  if (isError || !data) {
    return (
      <KhatuScreenShell title="Shop" backHref={ROUTES.KHATU_MARKETPLACE}>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center text-sm text-rose-900">
          Shop not found.
          <button
            type="button"
            className="mt-2 block w-full rounded-xl bg-rose-700 py-2 font-semibold text-white"
            onClick={() => refetch()}
          >
            Retry
          </button>
          <Link href={ROUTES.KHATU_MARKETPLACE} className="mt-2 block text-[var(--khatu-saffron)] underline">
            All shops
          </Link>
        </div>
      </KhatuScreenShell>
    );
  }

  const { shop, products } = data;

  return (
    <>
      <div className="pb-[19rem] sm:pb-[20rem]">
        <KhatuScreenShell title={shop.name} backHref={ROUTES.KHATU_MARKETPLACE}>
          <ShopHeader shop={shop} />

          <p className="mt-4 rounded-2xl border border-[var(--khatu-saffron)]/25 bg-[var(--khatu-cream)] px-4 py-3 text-xs leading-relaxed text-[var(--khatu-stone)] sm:text-sm">
            <strong className="text-[var(--khatu-stone)]">How it works:</strong> add items to your cart →{' '}
            <strong className="text-[var(--color-primary)]">Send order via WhatsApp</strong> to the shop → pay them as
            they confirm → <strong className="text-[var(--color-primary)]">Book delivery boy</strong> for Liftngo
            pickup here.
          </p>

          <div className="mt-6">
            <SectionHeader title="Products" description="Add items — quantity can be adjusted before you message the shop." />
            <div className="mt-4 flex flex-col gap-3">
              {products.map((p) => (
                <MarketplaceProductCard
                  key={p.id}
                  product={p}
                  shopId={shop.id}
                  shopName={shop.name}
                  merchantWhatsApp={shop.merchantWhatsApp}
                  pickupAddressLine={shop.pickupAddressLine}
                  onWrongShop={() => onWrongShop(p)}
                />
              ))}
            </div>
          </div>

          <p className="mt-8 text-center text-xs leading-relaxed text-[var(--khatu-stone-muted)]">
            Delivery is booked like restaurant orders: rider picks up at this shop and brings to your address.
          </p>
        </KhatuScreenShell>
      </div>

      <CartBar
        onOpenDrawer={() => setDrawerOpen(true)}
        onBookDeliveryClick={handleBookDeliveryClick}
        whatsappUrl={whatsappUrl}
        onWhatsAppClick={() => {
          trackWhatsAppClick('khatu_marketplace_cart_bar');
          setWhatsappOpened(true);
        }}
        canBookDelivery={canBookDelivery}
      />

      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onBookDeliveryClick={handleBookDeliveryClick}
        whatsappUrl={whatsappUrl}
        onWhatsAppClick={() => {
          trackWhatsAppClick('khatu_marketplace_drawer');
          setWhatsappOpened(true);
        }}
        canBookDelivery={canBookDelivery}
      />

      <Modal
        isOpen={switchModal}
        onClose={() => {
          setSwitchModal(false);
          setPendingProduct(null);
        }}
        titleId="khatu-marketplace-switch-shop"
        title="Switch shop?"
      >
        <p className="text-sm leading-relaxed text-[var(--khatu-stone-muted)]">
          Your cart has items from another Liftngo-verified shop. To add from <strong>{shop.name}</strong>, we&apos;ll
          clear the current cart. This keeps pricing and handoff accurate for partners.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setSwitchModal(false);
              setPendingProduct(null);
            }}
            className="flex h-11 flex-1 items-center justify-center rounded-xl border border-stone-200 text-sm font-semibold text-[var(--khatu-stone)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmSwitch}
            className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[var(--khatu-saffron)] text-sm font-semibold text-white"
          >
            Clear & continue
          </button>
        </div>
      </Modal>

      {showPaymentConfirm ? (
        <>
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-[1px]" onClick={() => setShowPaymentConfirm(false)} aria-hidden />
          <div
            className="fixed left-1/2 top-1/2 z-[101] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="khatu-mp-payment-title"
            aria-describedby="khatu-mp-payment-desc"
          >
            <h2 id="khatu-mp-payment-title" className="mb-1 text-lg font-bold text-gray-900">
              Confirm with shop
            </h2>
            <p id="khatu-mp-payment-desc" className="mb-5 text-sm leading-relaxed text-gray-600">
              Have you confirmed and paid <strong className="text-gray-900">{shop.name}</strong> for this order?
              We&apos;ll then ask for your <strong>delivery address</strong> and complete the booking.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handlePaymentConfirmed}
                className="w-full rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95"
              >
                Yes — book delivery
              </button>
              <button
                type="button"
                onClick={() => setShowPaymentConfirm(false)}
                className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Not yet
              </button>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
