import type { ReactNode } from 'react';
import { FOOD_LISTING_MICRO_TRUST_LINE } from '@/features/food-delivery/constants';
import { IconClock, IconLocation, IconShield } from '@/features/food-delivery/components/FoodDeliveryListingIcons';

const PILLAR_ICONS: Record<'shield' | 'clock' | 'location', ReactNode> = {
  shield: <IconShield className="!h-5 !w-5 !min-h-5 !min-w-5 !max-h-5 !max-w-5 text-[var(--color-primary)]" />,
  clock: <IconClock className="!h-5 !w-5 !min-h-5 !min-w-5 !max-h-5 !max-w-5 text-[var(--color-primary)]" />,
  location: <IconLocation className="!h-5 !w-5 !min-h-5 !min-w-5 !max-h-5 !max-w-5 text-[var(--color-primary)]" />,
};

const TRUST_PILLARS: { key: string; icon: ReactNode; title: string; text: string }[] = [
  {
    key: 'verified',
    icon: PILLAR_ICONS.shield,
    title: 'Verified restaurant partners',
    text: 'Kitchens are checked and onboarded—so you know who you are ordering from.',
  },
  {
    key: 'delivery',
    icon: PILLAR_ICONS.clock,
    title: 'Reliable delivery system',
    text: 'The same Liftngo handoffs you trust for goods—fast, trackable pickup and drop.',
  },
  {
    key: 'local',
    icon: PILLAR_ICONS.location,
    title: 'Local vendor network',
    text: 'Riders and partners who know Khatu Shyam Ji routes around the temple area.',
  },
];

export function FoodDeliveryTrustSection() {
  return (
    <section
      className="mb-10 rounded-2xl border border-[var(--landing-primary)]/12 bg-gradient-to-br from-white via-[#FFFCF8] to-amber-50/40 px-4 py-8 shadow-sm sm:px-8"
      aria-labelledby="trust-heading"
    >
      <h2 id="trust-heading" className="text-center text-lg font-bold text-gray-900 sm:text-xl">
        Trusted Food Delivery in Khatu Shyam Ji
      </h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-5" role="list">
        {TRUST_PILLARS.map((row) => (
          <li key={row.key} className="flex gap-3 rounded-xl border border-gray-100 bg-[var(--landing-bg)]/80 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
              {row.icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{row.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm">{row.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 border-t border-gray-100 pt-6 text-center text-xs text-gray-600 sm:text-sm">
        {FOOD_LISTING_MICRO_TRUST_LINE}
      </p>
    </section>
  );
}
