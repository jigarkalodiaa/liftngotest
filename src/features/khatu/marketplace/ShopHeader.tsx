'use client';

import Image from '@/components/OptimizedImage';
import { MapPin, Star } from 'lucide-react';
import { Badge } from '@/components/ui';
import type { KhatuShop } from '@/types/khatu';

export default function ShopHeader({ shop }: { shop: KhatuShop }) {
  return (
    <header className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="relative aspect-[21/9] min-h-[140px] bg-stone-100 sm:aspect-[24/9]">
        <Image
          src={shop.bannerImage}
          alt={`${shop.name} — shop banner`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
          <Badge variant="verified" className="border-0 bg-white/95 text-[var(--color-primary)] shadow-sm">
            Verified by Liftngo
          </Badge>
          {shop.popular ? (
            <Badge variant="popular" className="border-0 bg-white/95 shadow-sm">
              Popular
            </Badge>
          ) : null}
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--khatu-stone-muted)]">
          <span className="inline-flex items-center gap-1 font-medium">
            <MapPin className="h-4 w-4 text-[var(--khatu-saffron)]" strokeWidth={1.75} aria-hidden />~
            {shop.distanceKm.toFixed(1)} km from mandir approach
          </span>
          {typeof shop.rating === 'number' ? (
            <span className="inline-flex items-center gap-1 font-medium text-[var(--khatu-stone)]">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
              {shop.rating.toFixed(1)}
            </span>
          ) : null}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-[var(--khatu-stone-muted)]">{shop.description}</p>
      </div>
    </header>
  );
}
