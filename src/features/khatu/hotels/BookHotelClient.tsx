'use client';

import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { ROUTES } from '@/lib/constants';
import { SUPPORT_PHONE } from '@/config/env';
import type { KhatuHotel } from '@/types/khatu';
import type { HotelBookingDraft } from '@/types/booking';
import { setHotelBookingDraft, setPickupLocation } from '@/lib/storage';
import { buildHotelOwnerWhatsAppMessage, hotelOwnerWhatsAppHref } from '@/features/khatu/hotels/hotelBookingWhatsApp';
import { trackWhatsAppClick } from '@/lib/analytics';

const SUPPORT_TEL = SUPPORT_PHONE
  ? `tel:+91${SUPPORT_PHONE.replace(/\D/g, '').slice(-10)}`
  : 'tel:+919065847341';

const IconWhatsApp = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

type BookHotelClientProps = {
  hotel: KhatuHotel;
};

function countNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(`${checkIn}T12:00:00`);
  const b = new Date(`${checkOut}T12:00:00`);
  const ms = b.getTime() - a.getTime();
  if (ms <= 0) return 0;
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

export default function BookHotelClient({ hotel }: BookHotelClientProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [note, setNote] = useState('');
  const [whatsappOpened, setWhatsappOpened] = useState(false);

  const img = hotel.images[0] ?? '/globe.svg';
  const ownerDigits = (hotel.ownerWhatsApp ?? '').replace(/\D/g, '');

  const nights = useMemo(() => countNights(checkIn, checkOut), [checkIn, checkOut]);
  const guestsNum = Math.max(0, parseInt(guests, 10) || 0);
  const estimatedTotalInr = nights > 0 ? nights * hotel.pricePerNight : 0;

  const validationError = useMemo(() => {
    if (!checkIn || !checkOut) return 'Select check-in and check-out dates.';
    if (nights <= 0) return 'Check-out must be after check-in.';
    if (guestsNum < 1) return 'Enter at least 1 guest.';
    return '';
  }, [checkIn, checkOut, nights, guestsNum]);

  const waMessage = useMemo(
    () =>
      validationError
        ? ''
        : buildHotelOwnerWhatsAppMessage(hotel, {
            checkIn,
            checkOut,
            guests: guestsNum,
            note,
            nights,
            estimatedTotalInr,
          }),
    [hotel, checkIn, checkOut, guestsNum, note, nights, estimatedTotalInr, validationError]
  );

  const whatsappUrl = useMemo(() => hotelOwnerWhatsAppHref(ownerDigits, waMessage), [ownerDigits, waMessage]);

  const canContinue =
    !validationError && whatsappOpened && Boolean(whatsappUrl) && estimatedTotalInr > 0;

  const persistAndGoPayment = () => {
    if (!canContinue || validationError) return;
    const draft: HotelBookingDraft = {
      hotelId: hotel.id,
      hotelName: hotel.name,
      addressLine: hotel.addressLine,
      distanceKmFromTemple: hotel.distanceKmFromTemple,
      pricePerNight: hotel.pricePerNight,
      availability: hotel.availability,
      parking: hotel.parking,
      ac: hotel.ac,
      familyRooms: hotel.familyRooms,
      rating: hotel.rating,
      liftngoVerified: hotel.liftngoVerified,
      checkIn,
      checkOut,
      guests: guestsNum,
      guestNote: note.trim(),
      nights,
      estimatedTotalInr,
      ownerWhatsAppDigits: ownerDigits,
    };
    setHotelBookingDraft(draft);
    setPickupLocation({
      name: hotel.name,
      address: `${hotel.name} — ${hotel.addressLine}`,
      contact: '',
    });
    router.push(`${ROUTES.PAYMENT}?from=khatu_hotel`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/90 via-white to-white pb-44">
      <div className="mx-auto max-w-lg px-4 pt-4">
        <PageHeader
          title="Confirm stay"
          onBack={() => router.push(ROUTES.KHATU_HOTELS)}
          titleClassName="text-lg font-bold text-amber-950"
        />

        <div className="relative mt-2 aspect-[16/9] overflow-hidden rounded-2xl bg-amber-100">
          <Image
            src={img}
            alt={`${hotel.name} — property photo`}
            fill
            className="object-cover"
            sizes="512px"
            priority
          />
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
          <p className="mt-1 text-xs text-amber-900/65">{hotel.addressLine}</p>
        </div>

        <div className="mt-6 space-y-3 rounded-2xl border border-amber-200/80 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs font-semibold text-amber-900" htmlFor="hk-in">
              Check-in
              <input
                id="hk-in"
                type="date"
                value={checkIn}
                onChange={(e) => {
                  setCheckIn(e.target.value);
                  setWhatsappOpened(false);
                }}
                className="mt-1 w-full rounded-xl border border-amber-200 px-2 py-2 text-sm text-amber-950"
              />
            </label>
            <label className="text-xs font-semibold text-amber-900" htmlFor="hk-out">
              Check-out
              <input
                id="hk-out"
                type="date"
                value={checkOut}
                onChange={(e) => {
                  setCheckOut(e.target.value);
                  setWhatsappOpened(false);
                }}
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
              onChange={(e) => {
                setGuests(e.target.value.replace(/\D/g, '').slice(0, 2));
                setWhatsappOpened(false);
              }}
              className="mt-1 w-full rounded-xl border border-amber-200 px-2 py-2 text-sm text-amber-950"
            />
          </label>
          <label className="text-xs font-semibold text-amber-900" htmlFor="hk-note">
            Notes for partner hotel
            <textarea
              id="hk-note"
              rows={3}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setWhatsappOpened(false);
              }}
              placeholder="e.g. need ground floor, late check-in"
              className="mt-1 w-full rounded-xl border border-amber-200 px-2 py-2 text-sm text-amber-950 placeholder:text-amber-900/35"
            />
          </label>
          {nights > 0 && (
            <p className="text-xs font-medium text-amber-900">
              {nights} night{nights === 1 ? '' : 's'} · Est. total ₹{estimatedTotalInr.toLocaleString('en-IN')}
            </p>
          )}
          {validationError ? <p className="text-xs text-red-600">{validationError}</p> : null}
        </div>

        <p className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-xs leading-relaxed text-amber-950">
          <strong>1.</strong> Send your full request to the property on <strong>WhatsApp</strong> (includes dates, guest
          count, amenities, and price). <strong>2.</strong> After you&apos;ve messaged them, continue to{' '}
          <strong>payment</strong> on Liftngo to confirm your booking — it will appear in <strong>History</strong>.
        </p>

        <p className="mt-4 text-xs text-amber-900/70">
          Final room confirmation is with the hotel. For urgent help call{' '}
          <a href={SUPPORT_TEL} className="font-semibold text-[var(--color-primary)] underline">
            support
          </a>
          .
        </p>

        <p className="mt-3 text-center text-sm">
          <Link href={ROUTES.KHATU_TRAVEL} className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline">
            Book cab for corridor
          </Link>
        </p>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-amber-200/80 bg-white/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg flex-col gap-2">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                trackWhatsAppClick('khatu_hotel_booking');
                setWhatsappOpened(true);
              }}
              className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--whatsapp-green)] text-sm font-semibold text-white"
            >
              <IconWhatsApp className="h-5 w-5 shrink-0" />
              Send request to hotel (WhatsApp)
            </a>
          ) : (
            <p className="rounded-xl bg-amber-100 px-3 py-2 text-center text-[11px] text-amber-900">
              Fill valid dates and guest count to generate WhatsApp.
            </p>
          )}
          {!whatsappOpened && whatsappUrl && !validationError ? (
            <p className="text-center text-[10px] text-amber-800/80">Open WhatsApp above, then continue to payment.</p>
          ) : null}
          <div className="flex gap-2">
            <a
              href={SUPPORT_TEL}
              className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-amber-200 text-center text-sm font-semibold text-amber-950"
            >
              Call support
            </a>
            <button
              type="button"
              disabled={!canContinue}
              onClick={persistAndGoPayment}
              className="flex min-h-[48px] flex-[1.2] items-center justify-center rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              Continue to payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
