'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, MapPin, Star } from 'lucide-react';
import { Badge, Card } from '@/components/ui';
import type { KhatuShop } from '@/types/khatu';

export default function ShopCard({ shop, imagePriority }: { shop: KhatuShop; imagePriority?: boolean }) {
  return (
    <Card className="overflow-hidden transition hover:border-stone-300 hover:shadow-md">
      <Link href={`/khatu/marketplace/${shop.id}`} className="block text-left">
        <div className="relative aspect-[16/9] bg-stone-100">
          <Image
            src={shop.bannerImage}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width:640px) 100vw, 540px"
            priority={!!imagePriority}
          />
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            <Badge variant="verified">Verified</Badge>
            {shop.popular ? <Badge variant="popular">Popular</Badge> : null}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-base font-semibold text-[var(--khatu-stone)]">{shop.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[var(--khatu-stone-muted)]">
            <MapPin className="h-3.5 w-3.5 text-[var(--khatu-saffron)]" strokeWidth={1.75} aria-hidden />~
            {shop.distanceKm.toFixed(1)} km · mandir zone
          </p>
          {typeof shop.rating === 'number' ? (
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[var(--khatu-stone)]">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
              {shop.rating.toFixed(1)}
            </p>
          ) : null}
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--khatu-stone-muted)]">{shop.description}</p>
          <span className="mt-3 flex min-h-[44px] items-center justify-center gap-1 rounded-xl bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white">
            View shop
            <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
        </div>
      </Link>
    </Card>
  );
}
