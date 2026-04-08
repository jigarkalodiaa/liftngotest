'use client';

import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import { Badge } from '@/components/ui';
import type { KhatuShop } from '@/types/khatu';

export default function ShopCard({ shop, imagePriority }: { shop: KhatuShop; imagePriority?: boolean }) {
  return (
    <li className="h-full">
      <Link
        href={`/khatu/marketplace/${shop.id}`}
        className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
      >
        <article className="flex h-full flex-col overflow-hidden rounded-[15px] border border-neutral-200/90 bg-white shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] transition-shadow duration-200 hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]">
        <div className="relative aspect-[16/9] bg-stone-100">
          <Image
            src={shop.bannerImage}
            alt={`${shop.name} — marketplace shop`}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            sizes="(max-width:640px) 100vw, 540px"
            priority={!!imagePriority}
          />
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            <Badge variant="verified">Verified</Badge>
            {shop.popular ? <Badge variant="popular">Popular</Badge> : null}
          </div>
        </div>
        <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-2.5 sm:px-4 sm:pb-4 sm:pt-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 flex-1 text-[15px] font-bold leading-snug tracking-tight text-neutral-900 sm:text-base">
              {shop.name}
            </h3>
          {typeof shop.rating === 'number' ? (
              <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-emerald-800 ring-1 ring-emerald-100">
                <Star className="h-3 w-3 fill-emerald-600 stroke-emerald-600" strokeWidth={0} aria-hidden />
              {shop.rating.toFixed(1)}
              </span>
          ) : null}
          </div>
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-neutral-500">
            <MapPin className="h-3.5 w-3.5 text-[var(--color-primary)]" strokeWidth={1.75} aria-hidden />~
            {shop.distanceKm.toFixed(1)} km · mandir zone
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">{shop.description}</p>
        </div>
        </article>
      </Link>
    </li>
  );
}
