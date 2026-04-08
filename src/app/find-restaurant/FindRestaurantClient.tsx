'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import ContentLayout from '@/components/layout/ContentLayout';
import { RESTAURANTS_KHATUSHYAM, getRestaurantById } from '@/data/restaurantsKhatushyam';
import { getUserLocation } from '@/lib/utils/locationStorage';
import { BREADCRUMB_HOME, BREADCRUMB_FIND_RESTAURANT } from '@/lib/breadcrumbsNav';
import {
  FoodListingCartDrawer,
  FoodListingStickyBar,
  RestaurantPartnerCard,
  countCartItems,
  getMenuHrefFromDraft,
  useFoodCartAddedToast,
  useFoodOrderCartDraft,
} from '@/features/food-delivery';
import { ROUTES } from '@/lib/constants';

export default function FindRestaurantClient() {
  const { draft } = useFoodOrderCartDraft();
  const toastVisible = useFoodCartAddedToast();
  const [cartOpen, setCartOpen] = useState(false);
  const [areaLabel, setAreaLabel] = useState<string>('Khatu Shyam Ji');

  useEffect(() => {
    const loc = getUserLocation();
    const city = loc?.city?.trim();
    if (city) setAreaLabel(city);
    else setAreaLabel('Khatu Shyam Ji');
  }, []);

  const itemCount = countCartItems(draft);
  const hasItems = itemCount > 0;
  const menuHref = getMenuHrefFromDraft(draft?.restaurantId);
  const draftRestaurantName = draft?.restaurantId
    ? getRestaurantById(draft.restaurantId)?.name ?? 'Restaurant'
    : '';

  const subtitle = `Trusted Food Delivery in ${areaLabel}.`;

  return (
    <ContentLayout breadcrumbs={[BREADCRUMB_HOME, BREADCRUMB_FIND_RESTAURANT]} variant="app">
      <main className="relative flex min-h-0 flex-1 flex-col pb-24 sm:pb-28">
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-none fixed left-1/2 top-[4.5rem] z-[70] max-w-[min(90vw,20rem)] -translate-x-1/2 rounded-full border border-emerald-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-emerald-800 shadow-md transition-[opacity,transform] duration-300 ease-out ${
            toastVisible ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-2 scale-95 opacity-0'
          }`}
        >
          Added to your delivery list
        </div>

        <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3 sm:max-w-6xl sm:px-6">
            <Link
              href="/"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-sm transition-colors hover:bg-neutral-50"
              aria-label="Back to home"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold tracking-tight text-neutral-900 sm:text-xl">Food</h1>
            </div>
            <Link
              href={ROUTES.DASHBOARD}
              className="flex max-w-[45%] items-center gap-1 rounded-full border border-neutral-200/90 bg-neutral-50/90 px-2.5 py-1.5 text-[11px] font-medium text-neutral-800 shadow-sm transition-colors hover:bg-neutral-100 sm:max-w-[12rem] sm:text-xs"
              title="Service area — tap to open dashboard and change"
            >
              <Building2 className="h-3.5 w-3.5 shrink-0 text-neutral-500" strokeWidth={1.5} aria-hidden />
              <span className="truncate">{areaLabel}</span>
            </Link>
          </div>
        </header>

        <div className="mx-auto w-full max-w-2xl flex-1 px-4 pt-4 sm:max-w-6xl sm:px-6 sm:pt-5">
          <section id="restaurants" className="scroll-mt-4" aria-labelledby="restaurants-heading">
            <h2 id="restaurants-heading" className="text-lg font-bold text-neutral-900 sm:text-xl">
              All restaurants
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-snug text-neutral-500">{subtitle}</p>

            <ul className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4" role="list">
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

        <FoodListingStickyBar itemCount={itemCount} hasItems={hasItems} onOpenCart={() => setCartOpen(true)} />
      </main>
    </ContentLayout>
  );
}
