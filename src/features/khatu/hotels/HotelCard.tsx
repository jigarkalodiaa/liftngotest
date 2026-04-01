'use client';

import Image from '@/components/OptimizedImage';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { Badge } from '@/components/ui';
import type { HotelAvailability, KhatuHotel } from '@/types/khatu';

function availabilityVariant(a: HotelAvailability): 'success' | 'warning' | 'danger' {
  if (a === 'available') return 'success';
  if (a === 'few') return 'warning';
  return 'danger';
}

function availabilityLabel(a: HotelAvailability): string {
  if (a === 'available') return 'Available';
  if (a === 'few') return 'Limited';
  return 'Full';
}

type HotelCardProps = {
  hotel: KhatuHotel;
  imagePriority?: boolean;
};

export default function HotelCard({ hotel, imagePriority }: HotelCardProps) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const imgs = hotel.images.length ? hotel.images : ['/globe.svg'];
  const safe = ((idx % imgs.length) + imgs.length) % imgs.length;

  const next = useCallback(() => setIdx((i) => (i + 1) % imgs.length), [imgs.length]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + imgs.length) % imgs.length), [imgs.length]);

  const walking = hotel.distanceKmFromTemple <= 1;

  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200/90 bg-white shadow-sm transition hover:border-stone-300 hover:shadow-md">
      <div className="relative aspect-[16/10] bg-stone-100">
        <Image
          src={imgs[safe]}
          alt={`${hotel.name} — stay near Khatu Shyam Ji`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 640px"
          priority={!!imagePriority && safe === 0}
        />
        {imgs.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={prev}
              className="absolute left-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-sm text-white backdrop-blur-sm"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={next}
              className="absolute right-2 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-sm text-white backdrop-blur-sm"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1">
              {imgs.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === safe ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        ) : null}
        <div className="absolute left-2 top-2 z-10 flex flex-wrap gap-1">
          <Badge variant={availabilityVariant(hotel.availability)}>{availabilityLabel(hotel.availability)}</Badge>
          {hotel.liftngoVerified ? <Badge variant="verified">Verified</Badge> : null}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-snug text-[var(--khatu-stone)]">{hotel.name}</h3>
            {hotel.rating != null ? (
              <p className="mt-1 flex items-center gap-1 text-sm font-medium text-[var(--khatu-stone)]">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                {hotel.rating.toFixed(1)}
                <span className="text-xs font-normal text-[var(--khatu-stone-muted)]">guest rating</span>
              </p>
            ) : (
              <p className="mt-1 text-xs text-[var(--khatu-stone-muted)]">New on Liftngo</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-lg font-semibold tabular-nums text-[var(--khatu-stone)]">₹{hotel.pricePerNight}</p>
            <p className="text-[11px] text-[var(--khatu-stone-muted)]">per night</p>
          </div>
        </div>

        <p className="text-sm text-[var(--khatu-stone-muted)]">
          {hotel.distanceKmFromTemple.toFixed(1)} km from Khatu Temple
        </p>
        <p className="text-xs leading-relaxed text-[var(--khatu-stone-muted)]">{hotel.addressLine}</p>

        <div className="flex flex-wrap gap-1.5">
          {hotel.parking ? (
            <span className="rounded-lg bg-[var(--khatu-cream)] px-2 py-1 text-[11px] font-medium text-[var(--khatu-stone)] ring-1 ring-stone-200/80">
              Parking available
            </span>
          ) : null}
          {hotel.familyRooms ? (
            <span className="rounded-lg bg-[var(--khatu-cream)] px-2 py-1 text-[11px] font-medium text-[var(--khatu-stone)] ring-1 ring-stone-200/80">
              Family friendly
            </span>
          ) : null}
          {hotel.ac ? (
            <span className="rounded-lg bg-[var(--khatu-cream)] px-2 py-1 text-[11px] font-medium text-[var(--khatu-stone)] ring-1 ring-stone-200/80">
              AC rooms
            </span>
          ) : (
            <span className="rounded-lg bg-[var(--khatu-cream)] px-2 py-1 text-[11px] font-medium text-[var(--khatu-stone)] ring-1 ring-stone-200/80">
              Non-AC
            </span>
          )}
          {walking ? (
            <span className="rounded-lg bg-[var(--khatu-cream)] px-2 py-1 text-[11px] font-medium text-[var(--khatu-stone)] ring-1 ring-stone-200/80">
              Walking distance
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => router.push(`/khatu/hotels/${hotel.id}`)}
          className="flex min-h-[46px] w-full items-center justify-center gap-1 rounded-xl bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition hover:opacity-[0.96]"
        >
          View details
          <ChevronRight className="h-4 w-4" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </article>
  );
}
