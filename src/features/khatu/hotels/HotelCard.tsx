'use client';

import Image from '@/components/OptimizedImage';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import type { KhatuHotel } from '@/types/khatu';

type HotelCardProps = {
  hotel: KhatuHotel;
  imagePriority?: boolean;
};

export default function HotelCard({ hotel, imagePriority }: HotelCardProps) {
  const router = useRouter();
  const hero = hotel.images[0] || '/globe.svg';
  const nearTemple = hotel.distanceKmFromTemple <= 2;
  const oldPrice = Math.round(hotel.pricePerNight * 1.42);
  const review = hotel.rating != null ? hotel.rating.toFixed(1) : '4.8';

  return (
    <article
      onClick={() => router.push(`/khatu/hotels/${hotel.id}`)}
      className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm transition hover:border-stone-300 hover:shadow-md"
    >
      <div className="relative aspect-[16/9] bg-stone-100">
        <Image
          src={hero}
          alt={`${hotel.name} — stay near Khatu Shyam Ji`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 640px"
          priority={!!imagePriority}
        />
      </div>

      <div className="space-y-2.5 p-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-[1.05rem] font-semibold leading-snug text-[var(--khatu-stone)]">{hotel.name}</h3>
            <p className="mt-1 text-xs text-emerald-700">✓ Free room upgrade / Subject to availability</p>
          </div>
          <div className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
              {review}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-800">
              Limited Time offer
            </span>
            {nearTemple ? (
              <span className="rounded-full border border-amber-100 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-800">
                Near Temple
              </span>
            ) : null}
          </div>
          <div className="text-right">
            <p className="text-xs font-medium tabular-nums text-stone-400 line-through">₹{oldPrice}</p>
            <p className="text-[2rem] font-bold tabular-nums leading-none text-[var(--khatu-stone)]">₹{hotel.pricePerNight}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
