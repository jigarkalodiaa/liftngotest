'use client';

import { useRouter } from 'next/navigation';
import { Building2, Car, UtensilsCrossed } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

type ServiceItem = {
  title: string;
  href: string;
  Icon: typeof Building2;
  /** Icon tint — taxi uses amber to echo reference */
  iconClassName?: string;
};

const ITEMS: ServiceItem[] = [
  {
    Icon: UtensilsCrossed,
    title: 'Order food online',
    href: ROUTES.FIND_RESTAURANT,
  },
  {
    Icon: Building2,
    title: 'Hotels & guest houses',
    href: ROUTES.KHATU_HOTELS,
  },
  {
    Icon: Car,
    title: 'Travel Salasar & Ringus',
    href: ROUTES.KHATU_TRAVEL,
    iconClassName: 'text-amber-500',
  },
  {
    Icon: Building2,
    title: 'Khatu marketplace',
    href: ROUTES.KHATU_MARKETPLACE,
  },
];

export default function KhatuServicesGrid() {
  const router = useRouter();

  return (
    <section className="mt-0">
      <h2 className="text-center text-base font-bold text-[var(--khatu-stone)] sm:text-lg">
        Everything for your Khatu visit
      </h2>

      <div className="mx-auto mt-3 grid max-w-3xl grid-cols-2 gap-3 sm:mt-4 sm:gap-3.5 lg:max-w-5xl lg:gap-4">
        {ITEMS.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => router.push(item.href)}
            className="group flex min-h-[132px] flex-col items-center rounded-xl border border-stone-100 bg-white p-4 text-center shadow-[0_2px_14px_-4px_rgba(28,25,23,0.08)] transition hover:border-stone-200/90 hover:shadow-[0_6px_24px_-8px_rgba(28,25,23,0.12)] sm:min-h-[144px] sm:rounded-2xl sm:p-5"
          >
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-stone-50 sm:h-11 sm:w-11"
              aria-hidden
            >
              <item.Icon
                className={`h-5 w-5 sm:h-6 sm:w-6 ${item.iconClassName ?? 'text-[var(--khatu-stone)]'}`}
                strokeWidth={1.75}
                aria-hidden
              />
            </span>
            <h3 className="mt-3 flex-1 text-balance text-sm font-bold leading-snug text-[var(--khatu-stone)] sm:mt-3.5 sm:text-base">
              {item.title}
            </h3>
            <span className="mt-2.5 text-xs text-stone-400 sm:mt-3 sm:text-sm">Explore Now &gt;</span>
          </button>
        ))}
      </div>
    </section>
  );
}
