'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ChevronLeft, Star } from 'lucide-react';
import { Badge, Card } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { SUPPORT_PHONE } from '@/config/env';
import type { HotelAvailability, KhatuHotel } from '@/types/khatu';

const SUPPORT_TEL = SUPPORT_PHONE
  ? `tel:+91${SUPPORT_PHONE.replace(/\D/g, '').slice(-10)}`
  : 'tel:+919065847341';

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

export default function KhatuHotelDetailPage({ hotel }: { hotel: KhatuHotel }) {
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const imgs = hotel.images.length ? hotel.images : ['/globe.svg'];
  const safe = ((idx % imgs.length) + imgs.length) % imgs.length;
  const walking = hotel.distanceKmFromTemple <= 1;

  const next = useCallback(() => setIdx((i) => (i + 1) % imgs.length), [imgs.length]);
  const prev = useCallback(() => setIdx((i) => (i - 1 + imgs.length) % imgs.length), [imgs.length]);

  return (
    <div className="min-h-screen bg-[var(--khatu-cream)] pb-32">
      <div className="mx-auto max-w-xl sm:max-w-2xl">
        <div className="relative aspect-[16/10] bg-stone-200">
          <Image
            src={imgs[safe]}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <button
            type="button"
            aria-label="Back"
            onClick={() => router.push(ROUTES.KHATU_HOTELS)}
            className="absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[var(--khatu-stone)] shadow-md"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </button>
          {imgs.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous"
                onClick={prev}
                className="absolute left-3 top-1/2 z-10 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next"
                onClick={next}
                className="absolute right-3 top-1/2 z-10 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white"
              >
                ›
              </button>
            </>
          ) : null}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            <Badge variant={availabilityVariant(hotel.availability)}>{availabilityLabel(hotel.availability)}</Badge>
            {hotel.liftngoVerified ? <Badge variant="verified">Verified by Liftngo</Badge> : null}
          </div>
        </div>

        <div className="px-4 pt-6">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--khatu-stone)]">{hotel.name}</h1>
          {hotel.rating != null ? (
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[var(--khatu-stone)]">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
              {hotel.rating.toFixed(1)} · Guest rated
            </p>
          ) : null}
          <p className="mt-3 text-sm text-[var(--khatu-stone-muted)]">
            {hotel.distanceKmFromTemple.toFixed(1)} km from Khatu Temple · {hotel.addressLine}
          </p>

          <Card className="mt-6 p-4">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--khatu-stone-muted)]">
                  From
                </p>
                <p className="text-2xl font-semibold tabular-nums text-[var(--khatu-stone)]">
                  ₹{hotel.pricePerNight}
                  <span className="text-base font-normal text-[var(--khatu-stone-muted)]"> / night</span>
                </p>
              </div>
              <a
                href={SUPPORT_TEL}
                className="text-sm font-semibold text-[var(--khatu-saffron)] underline-offset-2 hover:underline"
              >
                Enquire by phone
              </a>
            </div>
          </Card>

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-[var(--khatu-stone)]">Amenities</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {hotel.parking ? <Badge variant="neutral">Parking available</Badge> : null}
              {hotel.familyRooms ? <Badge variant="neutral">Family friendly</Badge> : null}
              {hotel.ac ? <Badge variant="neutral">AC rooms</Badge> : <Badge variant="neutral">Non-AC</Badge>}
              {walking ? <Badge variant="neutral">Walking distance</Badge> : null}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-relaxed text-[var(--khatu-stone-muted)]">
            <p>
              This property is part of the Liftngo verified programme — we check basics like location accuracy and safety
              standards. Final allocation is confirmed with the partner hotel; our team can help with group bookings or late
              arrivals.
            </p>
          </div>

          <p className="mt-6 text-center text-sm">
            <Link href={ROUTES.KHATU_TRAVEL} className="font-semibold text-[var(--khatu-saffron)] underline-offset-2 hover:underline">
              Book a cab for Salasar / Ringus
            </Link>
          </p>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl gap-3 sm:max-w-2xl">
          <Link
            href={`${ROUTES.BOOKING_HOTEL}/${hotel.id}`}
            className="flex min-h-[50px] flex-1 items-center justify-center rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white"
          >
            Continue to book
          </Link>
        </div>
      </div>
    </div>
  );
}
