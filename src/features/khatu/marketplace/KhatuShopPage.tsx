'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import { trackBookNowClick } from '@/lib/analytics';

export default function KhatuShopPage({ shopId }: { shopId: string }) {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useKhatuShop(shopId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [switchModal, setSwitchModal] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<KhatuShopProduct | null>(null);

  const replaceShopAndAdd = useMarketplaceCartStore((s) => s.replaceShopAndAdd);
  const items = useMarketplaceCartStore((s) => s.items);

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

  const handleCheckoutClick = () => {
    if (items.length === 0) {
      setDrawerOpen(true);
      return;
    }
    trackBookNowClick('khatu_marketplace_checkout_click');
    router.push(ROUTES.KHATU_MARKETPLACE_CHECKOUT);
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
      <div className="pb-[11rem] sm:pb-[12rem]">
        <KhatuScreenShell title={shop.name} backHref={ROUTES.KHATU_MARKETPLACE}>
          <ShopHeader shop={shop} />

          <p className="mt-4 rounded-2xl border border-[var(--khatu-saffron)]/25 bg-[var(--khatu-cream)] px-4 py-3 text-xs leading-relaxed text-[var(--khatu-stone)] sm:text-sm">
            Add products to cart and continue with <strong className="text-[var(--color-primary)]">Cart &amp; pay</strong>{' '}
            for a direct checkout flow, same as food delivery.
          </p>

          <div className="mt-6">
            <SectionHeader title="Products" description="Add items and adjust quantity before checkout." />
            <div className="mt-4 flex flex-col gap-3">
              {products.map((p) => (
                <MarketplaceProductCard
                  key={p.id}
                  product={p}
                  shopId={shop.id}
                  shopName={shop.name}
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
        onCheckoutClick={handleCheckoutClick}
      />

      <CartDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCheckoutClick={handleCheckoutClick}
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

    </>
  );
}
