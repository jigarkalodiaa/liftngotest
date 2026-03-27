'use client';

import { IconCartPlus, IconScooter, IconStore } from '@/features/food-delivery/components/FoodDeliveryListingIcons';
import { scrollToElementId } from '@/features/food-delivery/utils/scrollToElementId';

const STICKY_CTA_ID = 'sticky-food-cta';
const RESTAURANTS_ID = 'restaurants';

type StepIcon = typeof IconStore;

type Props = {
  hasItemsInCart: boolean;
};

export function FoodDeliveryFlowSteps({ hasItemsInCart }: Props) {
  const steps: { Icon: StepIcon; label: string; onActivate: () => void }[] = [
    { Icon: IconStore, label: 'Choose Restaurant', onActivate: () => scrollToElementId(RESTAURANTS_ID) },
    { Icon: IconCartPlus, label: 'Add Items', onActivate: () => scrollToElementId(RESTAURANTS_ID) },
    {
      Icon: IconScooter,
      label: 'Book Delivery',
      onActivate: () =>
        hasItemsInCart
          ? document.getElementById(STICKY_CTA_ID)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          : scrollToElementId(RESTAURANTS_ID),
    },
  ];

  return (
    <section className="mb-12" aria-label="Steps">
      <h2 className="sr-only">How it works</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {steps.map(({ Icon, label, onActivate }) => (
          <button
            key={label}
            type="button"
            onClick={onActivate}
            className="flex flex-row items-center gap-3 rounded-2xl border border-[var(--landing-primary)]/12 bg-white p-4 text-left shadow-sm transition hover:border-[var(--color-primary)]/25 hover:shadow-md sm:flex-col sm:items-center sm:p-5 sm:text-center"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
              <Icon className="text-[var(--color-primary)]" />
            </span>
            <span className="text-sm font-semibold text-gray-900">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
