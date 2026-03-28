'use client';

import { useRouter } from 'next/navigation';
import { BookOpen, Building2, Car, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { Card } from '@/components/ui';
import { ROUTES } from '@/lib/constants';

type ServiceItem = {
  title: string;
  description: string;
  cta: string;
  href: string;
  Icon: typeof Building2;
};

const ITEMS: ServiceItem[] = [
  {
    Icon: UtensilsCrossed,
    title: 'Order food online',
    description: 'Trusted restaurant partners around Khatu — browse menus and order like always.',
    cta: 'Explore food',
    href: ROUTES.FIND_RESTAURANT,
  },
  {
    Icon: Building2,
    title: 'Hotels & guest houses',
    description: 'Verified stays near Khatu Temple — clear distance, honest photos.',
    cta: 'View stays',
    href: ROUTES.KHATU_HOTELS,
  },
  {
    Icon: Car,
    title: 'Travel: Salasar & Ringus',
    description: 'Comfortable cab options for corridor darshan — sedans & SUVs for families.',
    cta: 'Plan a ride',
    href: ROUTES.KHATU_TRAVEL,
  },
  {
    Icon: ShoppingBag,
    title: 'Khatu marketplace',
    description: 'Prasad, pūjā supplies & local shops — verified vendors, Liftngo delivery.',
    cta: 'Browse shops',
    href: ROUTES.KHATU_MARKETPLACE,
  },
  {
    Icon: BookOpen,
    title: 'Khatu guide',
    description: 'History, nearby teerths, and practical travel tips — dincharya-friendly.',
    cta: 'Read guide',
    href: ROUTES.KHATU_GUIDE,
  },
];

export default function KhatuServicesGrid() {
  const router = useRouter();

  return (
    <section className="mt-10">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-[var(--khatu-stone)] sm:text-xl">
          Everything for your Khatu visit
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--khatu-stone-muted)]">
          One app for rides, stays, and temple-town essentials —{' '}
          <span className="font-medium text-[var(--khatu-stone)]">English-first, light Hindi cues</span> where it helps.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ITEMS.map((item) => (
          <Card
            key={item.title}
            variant="default"
            className="flex flex-col p-4 transition hover:border-stone-300/90 hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--khatu-cream)] ring-1 ring-stone-200/80">
                <item.Icon className="h-5 w-5 text-[var(--khatu-saffron)]" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-[var(--khatu-stone)]">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--khatu-stone-muted)]">{item.description}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push(item.href)}
              className="mt-4 min-h-[44px] w-full rounded-xl bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition hover:opacity-[0.96]"
            >
              {item.cta}
            </button>
          </Card>
        ))}
      </div>
    </section>
  );
}
