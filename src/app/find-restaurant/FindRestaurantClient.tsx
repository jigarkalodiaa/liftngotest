'use client';

import { useState } from 'react';
import Link from 'next/link';
import ContentLayout from '@/components/layout/ContentLayout';
import { RESTAURANTS_KHATUSHYAM, getRestaurantById } from '@/data/restaurantsKhatushyam';
import {
  FoodDeliveryFlowSteps,
  FoodDeliveryTrustSection,
  FoodListingCartDrawer,
  FoodListingHero,
  FoodListingStickyBar,
  RestaurantPartnerCard,
  countCartItems,
  getMenuHrefFromDraft,
  useFoodCartAddedToast,
  useFoodOrderCartDraft,
} from '@/features/food-delivery';

export default function FindRestaurantClient() {
  const { draft } = useFoodOrderCartDraft();
  const toastVisible = useFoodCartAddedToast();
  const [cartOpen, setCartOpen] = useState(false);

  const itemCount = countCartItems(draft);
  const hasItems = itemCount > 0;
  const menuHref = getMenuHrefFromDraft(draft?.restaurantId);
  const draftRestaurantName = draft?.restaurantId
    ? getRestaurantById(draft.restaurantId)?.name ?? 'Restaurant'
    : '';

  return (
    <ContentLayout>
      <main className="relative flex-1 min-h-screen bg-gradient-to-b from-[#FFF9F4] via-[var(--landing-bg)] to-white pb-28 sm:pb-32">
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none fixed left-1/2 top-20 z-[70] max-w-[min(90vw,20rem)] -translate-x-1/2 rounded-full border border-[var(--color-primary)]/20 bg-white px-4 py-3 text-center text-sm font-semibold text-[var(--color-primary)] shadow-md transition-[opacity,transform] duration-300 ease-out ${
            toastVisible ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-2 scale-95 opacity-0'
          }`}
        >
          Added to your delivery list
        </div>

        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-[var(--landing-primary)]/20 bg-white/90 px-4 py-2 text-sm font-semibold text-[var(--color-primary)] shadow-sm transition-colors hover:border-[var(--landing-primary)]/35"
              aria-label="Back to home"
            >
              <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </div>

          <FoodListingHero
            title="Delicious Food Delivered Fast in Khatu Shyam Ji"
            subtitle="Bright meals from trusted partners—Liftngo delivers with the same professional service you rely on here every day."
            ctaTargetId="restaurants"
          />

          <FoodDeliveryTrustSection />

          <FoodDeliveryFlowSteps hasItemsInCart={hasItems} />

          <section id="restaurants" className="scroll-mt-20" aria-labelledby="restaurants-heading">
            <div className="mb-8 text-center">
              <h2 id="restaurants-heading" className="text-xl font-bold text-gray-900 sm:text-2xl">
                Partner restaurants
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
                {RESTAURANTS_KHATUSHYAM.length} trusted partners · open a menu to build your order
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8" role="list">
              {RESTAURANTS_KHATUSHYAM.map((r) => (
                <RestaurantPartnerCard key={r.id} restaurant={r} />
              ))}
            </ul>
          </section>
        </div>

        <FoodListingCartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          hasItems={hasItems}
          restaurantLabel={draftRestaurantName}
          lines={draft?.items}
          menuHref={menuHref}
        />

        <FoodListingStickyBar
          itemCount={itemCount}
          hasItems={hasItems}
          menuHref={menuHref}
          onOpenCart={() => setCartOpen(true)}
        />
      </main>
    </ContentLayout>
  );
}
