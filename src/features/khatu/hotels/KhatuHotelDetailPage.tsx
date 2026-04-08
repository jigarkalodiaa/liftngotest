'use client';

import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Star, Wifi, Building2, Car, UtensilsCrossed, ConciergeBell, MapPin, Share2, HelpCircle, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import type { KhatuHotel } from '@/types/khatu';

export default function KhatuHotelDetailPage({ hotel }: { hotel: KhatuHotel }) {
  const router = useRouter();
  const [shareHint, setShareHint] = useState<string | null>(null);
  const imgs = hotel.images.length ? hotel.images : ['/globe.svg', '/globe.svg', '/globe.svg', '/globe.svg'];
  const oldPrice = Math.round(hotel.pricePerNight * 1.42);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestName, setGuestName] = useState('');
  const [rooms, setRooms] = useState('1');
  const [guests, setGuests] = useState('2');
  const [comment, setComment] = useState('');

  const detailError = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 'Select check-in and check-out dates.';
    const inDate = new Date(`${checkInDate}T12:00:00`);
    const outDate = new Date(`${checkOutDate}T12:00:00`);
    if (outDate.getTime() <= inDate.getTime()) return 'Check-out must be after check-in.';
    if (guestName.trim().length < 2) return 'Enter guest name.';
    const roomCount = Number.parseInt(rooms, 10) || 0;
    const guestCount = Number.parseInt(guests, 10) || 0;
    if (roomCount < 1) return 'At least 1 room is required.';
    if (guestCount < 1) return 'At least 1 guest is required.';
    return '';
  }, [checkInDate, checkOutDate, guestName, rooms, guests]);

  const bookingHref = useMemo(() => {
    const params = new URLSearchParams();
    if (checkInDate) params.set('checkIn', checkInDate);
    if (checkOutDate) params.set('checkOut', checkOutDate);
    if (guestName.trim()) params.set('guestName', guestName.trim());
    if (rooms) params.set('rooms', rooms);
    if (guests) params.set('guests', guests);
    if (comment.trim()) params.set('note', comment.trim());
    const query = params.toString();
    return `${ROUTES.BOOKING_HOTEL}/${hotel.id}${query ? `?${query}` : ''}`;
  }, [checkInDate, checkOutDate, guestName, rooms, guests, comment, hotel.id]);

  const payLaterHref = `${bookingHref}${bookingHref.includes('?') ? '&' : '?'}mode=pay_later`;

  const shareHotel = async () => {
    const path = `${ROUTES.KHATU_HOTELS}/${hotel.id}`;
    const url = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;
    const payload = {
      title: hotel.name,
      text: `${hotel.name} · From ₹${hotel.pricePerNight} per night`,
      url,
    };

    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        await navigator.share(payload);
        return;
      }
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareHint('Link copied');
        window.setTimeout(() => setShareHint(null), 1800);
      }
    } catch {
      // User cancelled share sheet or clipboard failed — no hard error UI needed.
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] pb-28">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center gap-3 px-3 py-3 sm:max-w-2xl">
          <button
            type="button"
            onClick={() => router.push(ROUTES.KHATU_HOTELS)}
            className="grid h-8 w-8 place-items-center rounded-full border border-stone-200 bg-white text-stone-700"
            aria-label="Back"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="min-w-0 flex-1 truncate text-lg font-semibold text-stone-800">{hotel.name}</h1>
          <button type="button" onClick={() => void shareHotel()} className="grid h-8 w-8 place-items-center rounded-full text-stone-500" aria-label="Share hotel">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </header>
      {shareHint ? (
        <p className="mx-auto mt-2 max-w-xl px-3 text-right text-xs font-medium text-emerald-700 sm:max-w-2xl">{shareHint}</p>
      ) : null}

      <div className="mx-auto max-w-xl px-3 pt-3 sm:max-w-2xl">
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="grid grid-cols-2 gap-1 p-1">
            {imgs.slice(0, 4).map((src, i) => (
              <div key={`${src}-${i}`} className={`relative overflow-hidden rounded-lg ${i === 0 ? 'col-span-2 aspect-[16/8.5]' : 'aspect-[4/3]'}`}>
                <Image src={src} alt={`${hotel.name} photo ${i + 1}`} fill className="object-cover" sizes="(max-width: 640px) 100vw, 640px" priority={i === 0} />
                {i === 3 && imgs.length > 4 ? (
                  <span className="absolute inset-0 grid place-items-center bg-black/35 text-sm font-semibold text-white">+{imgs.length - 4}</span>
                ) : null}
              </div>
            ))}
          </div>
          <div className="space-y-3 px-3.5 pb-3.5 pt-2.5">
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-800">Limited Time offer</span>
              <span className="rounded-full border border-amber-100 bg-amber-50 px-2 py-1 text-[11px] font-medium text-amber-800">Near Temple</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-[2rem] font-semibold leading-tight tracking-tight text-stone-800">{hotel.name}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                <Star className="h-3 w-3 fill-emerald-400 text-emerald-400" />
                {hotel.rating?.toFixed(1) ?? '4.8'}
              </span>
            </div>
            <p className="text-xs font-medium text-emerald-700">✓ Free room upgrade/Subject to availability</p>
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
              <p className="text-sm font-semibold text-stone-800">Enter stay details</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="text-xs font-medium text-stone-700" htmlFor="detail-checkin">
                  Check-in
                  <input
                    id="detail-checkin"
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-2 py-2 text-[13px] text-stone-800"
                  />
                </label>
                <label className="text-xs font-medium text-stone-700" htmlFor="detail-checkout">
                  Check-out
                  <input
                    id="detail-checkout"
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-2 py-2 text-[13px] text-stone-800"
                  />
                </label>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="text-xs font-medium text-stone-700" htmlFor="detail-rooms">
                  Rooms
                  <input
                    id="detail-rooms"
                    inputMode="numeric"
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-2 py-2 text-[13px] text-stone-800"
                    placeholder="1"
                  />
                </label>
                <label className="text-xs font-medium text-stone-700" htmlFor="detail-guests">
                  Guests
                  <input
                    id="detail-guests"
                    inputMode="numeric"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value.replace(/\D/g, '').slice(0, 2))}
                    className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-2 py-2 text-[13px] text-stone-800"
                    placeholder="2"
                  />
                </label>
              </div>
              <label className="mt-2 block text-xs font-medium text-stone-700" htmlFor="detail-name">
                Guest name
                <input
                  id="detail-name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-2 py-2 text-[13px] text-stone-800"
                  placeholder="Enter name"
                />
              </label>
              <label className="mt-2 block text-xs font-medium text-stone-700" htmlFor="detail-comment">
                Comments
                <textarea
                  id="detail-comment"
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-300 bg-white px-2 py-2 text-[13px] text-stone-800"
                  placeholder="Any special request"
                />
              </label>
              {detailError ? <p className="mt-2 text-xs text-red-600">{detailError}</p> : null}
              {!detailError && checkInDate && checkOutDate ? (
                <p className="mt-2 text-xs text-emerald-700">
                  Stay details captured for booking.
                </p>
              ) : null}
            </div>
            <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
              <div className="h-36 bg-[linear-gradient(135deg,#eceff3_0%,#e7eaef_45%,#dfe5ec_100%)]" />
              <div className="flex items-center gap-2 border-t border-stone-200 bg-white px-3 py-2 text-sm text-stone-600">
                <MapPin className="h-4 w-4 text-stone-400" />
                <span>{hotel.addressLine}</span>
              </div>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white px-3 py-3">
              <p className="text-sm font-semibold text-stone-800">Property facilities</p>
              <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-stone-600">
                <div className="flex flex-col items-center gap-1"><span className="grid h-7 w-7 place-items-center rounded-full bg-stone-100"><Wifi className="h-4 w-4" /></span>Free Wifi</div>
                <div className="flex flex-col items-center gap-1"><span className="grid h-7 w-7 place-items-center rounded-full bg-stone-100"><Building2 className="h-4 w-4" /></span>Balcony</div>
                <div className="flex flex-col items-center gap-1"><span className="grid h-7 w-7 place-items-center rounded-full bg-stone-100"><Car className="h-4 w-4" /></span>Parking</div>
                <div className="flex flex-col items-center gap-1"><span className="grid h-7 w-7 place-items-center rounded-full bg-stone-100"><UtensilsCrossed className="h-4 w-4" /></span>Restaurant</div>
                <div className="flex flex-col items-center gap-1"><span className="grid h-7 w-7 place-items-center rounded-full bg-stone-100"><ConciergeBell className="h-4 w-4" /></span>Room service</div>
              </div>
            </div>
            <button type="button" onClick={() => router.push(ROUTES.KHATU_TRAVEL)} className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-white px-3 py-3 text-left">
              <div className="flex items-start gap-2">
                <HelpCircle className="mt-0.5 h-4 w-4 text-stone-500" />
                <div>
                  <p className="text-sm font-semibold text-stone-700">Do you need cab for Salasar/Ringus?</p>
                  <p className="text-xs text-sky-500">We would love to make trip simple</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-stone-500" />
            </button>
            <p className="text-right">
              <span className="text-xs text-stone-400 line-through">₹{oldPrice}</span>{' '}
              <span className="text-3xl font-bold tabular-nums text-stone-800">₹{hotel.pricePerNight}</span>
            </p>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200 bg-white/95 px-3 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl gap-2 sm:max-w-2xl">
          <Link
            href={payLaterHref}
            className={`flex min-h-[50px] flex-1 items-center justify-center rounded-xl border text-sm font-semibold ${
              detailError
                ? 'pointer-events-none border-stone-200 bg-stone-100 text-stone-400'
                : 'border-stone-300 bg-white text-stone-700'
            }`}
          >
            Book Now &amp; pay at hotel
          </Link>
          <Link
            href={bookingHref}
            className={`flex min-h-[50px] flex-1 items-center justify-center gap-1 rounded-xl text-sm font-semibold ${
              detailError ? 'pointer-events-none bg-stone-300 text-white' : 'bg-[var(--color-primary)] text-white'
            }`}
          >
            Pay ₹{hotel.pricePerNight}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
