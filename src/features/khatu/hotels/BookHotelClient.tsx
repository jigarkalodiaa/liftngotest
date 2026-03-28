'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { ROUTES } from '@/lib/constants';
import { SUPPORT_PHONE } from '@/config/env';
import type { KhatuHotel } from '@/types/khatu';

const SUPPORT_TEL = SUPPORT_PHONE
  ? `tel:+91${SUPPORT_PHONE.replace(/\D/g, '').slice(-10)}`
  : 'tel:+919065847341';

type BookHotelClientProps = {
  hotel: KhatuHotel;
};

export default function BookHotelClient({ hotel }: BookHotelClientProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [note, setNote] = useState('');

  const img = hotel.images[0] ?? '/globe.svg';

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/90 via-white to-white pb-28">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <PageHeader
          title="Confirm stay"
          onBack={() => router.push(ROUTES.KHATU_HOTELS)}
          titleClassName="text-lg font-bold text-amber-950"
        />

        <div className="relative mt-2 aspect-[16/9] overflow-hidden rounded-2xl bg-amber-100">
          <Image src={img} alt="" fill className="object-cover" sizes="512px" priority />
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-bold text-amber-950">{hotel.name}</h2>
          <p className="mt-1 text-sm text-amber-900/80">
            {hotel.distanceKmFromTemple.toFixed(1)} km from Khatu Mandir · Liftngo verified
          </p>
          <p className="mt-2 text-lg font-bold text-amber-950">
            ₹{hotel.pricePerNight}
            <span className="text-sm font-normal text-amber-900/70"> / night</span>
          </p>
        </div>

        <div className="mt-6 space-y-3 rounded-2xl border border-amber-200/80 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-amber-900" htmlFor="hk-in">
              Check-in
              <input
                id="hk-in"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="mt-1 w-full rounded-xl border border-amber-200 px-2 py-2 text-sm text-amber-950"
              />
            </label>
            <label className="text-xs font-semibold text-amber-900" htmlFor="hk-out">
              Check-out
              <input
                id="hk-out"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-1 w-full rounded-xl border border-amber-200 px-2 py-2 text-sm text-amber-950"
              />
            </label>
          </div>
          <label className="text-xs font-semibold text-amber-900" htmlFor="hk-guests">
            Guests
            <input
              id="hk-guests"
              inputMode="numeric"
              value={guests}
              onChange={(e) => setGuests(e.target.value.replace(/\D/g, '').slice(0, 2))}
              className="mt-1 w-full rounded-xl border border-amber-200 px-2 py-2 text-sm text-amber-950"
            />
          </label>
          <label className="text-xs font-semibold text-amber-900" htmlFor="hk-note">
            Notes for partner hotel
            <textarea
              id="hk-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. need ground floor, late check-in"
              className="mt-1 w-full rounded-xl border border-amber-200 px-2 py-2 text-sm text-amber-950 placeholder:text-amber-900/35"
            />
          </label>
        </div>

        <p className="mt-4 text-xs text-amber-900/70">
          Final confirmation is coordinated by Liftngo with the property. For instant help call{' '}
          <a href={SUPPORT_TEL} className="font-semibold text-[var(--color-primary)] underline">
            support
          </a>
          . You can also complete a structured delivery-style request from pickup flow for bespoke group bookings.
        </p>

        <p className="mt-3 text-center text-sm">
          <Link href={ROUTES.KHATU_TRAVEL} className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline">
            Book cab for corridor
          </Link>
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-amber-200/80 bg-white/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg gap-3">
          <a
            href={SUPPORT_TEL}
            className="min-h-[48px] flex-1 rounded-xl border border-amber-200 py-3 text-center text-sm font-semibold text-amber-950"
          >
            Call to hold
          </a>
          <Link
            href={`${ROUTES.PICKUP_LOCATION}?step=1&from=khatu_hotel&hotelId=${encodeURIComponent(hotel.id)}`}
            className="min-h-[48px] flex-1 rounded-xl bg-[var(--color-primary)] py-3 text-center text-sm font-semibold text-white"
          >
            Continue booking
          </Link>
        </div>
      </div>
    </div>
  );
}
