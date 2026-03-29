'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { PageContainer, IconButton, BackIcon } from '@/components/ui';
import { ROUTES } from '@/lib/constants';
import { RIDE_HISTORY } from '@/data/rideHistory';
import type {
  RideHistoryItem,
  HotelHistoryItem,
  FoodDeliveryHistoryItem,
  MarketplaceOrderHistoryItem,
  SalasarRideHistoryItem,
  HistoryTabId,
} from '@/types/booking';
import {
  getFoodDeliveryHistory,
  getHotelBookingHistory,
  getMarketplaceOrderHistory,
  getSalasarRideHistory,
} from '@/lib/storage';

const VALID_TABS: HistoryTabId[] = ['all', 'food', 'hotel', 'marketplace', 'salasar', 'rides'];

function parseTab(raw: string | null): HistoryTabId {
  if (raw && VALID_TABS.includes(raw as HistoryTabId)) return raw as HistoryTabId;
  return 'all';
}

function RideCard({ ride, onBookAgain }: { ride: RideHistoryItem; onBookAgain: () => void }) {
  const dateTime = ride.time ? `${ride.date}, ${ride.time}` : ride.date;

  return (
    <article className="rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[15px] font-semibold text-gray-900">
              {ride.vehicleSubtitle} {dateTime}
            </p>
            <div className="relative h-12 w-14 flex-shrink-0">
              <Image src={ride.vehicleImage} alt={ride.vehicleName} fill className="object-contain object-right" />
            </div>
          </div>
          <p
            className={`mt-1 text-[14px] font-bold ${
              ride.status === 'completed' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {ride.status === 'completed' ? 'Completed' : 'Cancelled'}
          </p>
          {ride.amount != null && <p className="mt-0.5 text-[14px] text-gray-700">{ride.amount}</p>}
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-gray-200 bg-gray-100/80 p-3">
        <div className="flex gap-3">
          <div className="flex flex-col items-center pt-0.5">
            <div className="h-2.5 w-2.5 rounded-full border-2 border-emerald-500 bg-white" />
            <div className="my-1 w-px flex-1 min-h-[16px] bg-gray-300" />
            <svg className="h-4 w-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <p className="text-[14px] font-bold text-gray-900">{ride.fromName}</p>
              <p className="text-[12px] text-gray-600 line-clamp-1">{ride.fromAddress}</p>
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-900">{ride.toName}</p>
              <p className="text-[12px] text-gray-600 line-clamp-2">{ride.toAddress}</p>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onBookAgain}
        className="mt-4 w-full rounded-xl border border-gray-300 bg-white py-3 text-[15px] font-semibold text-gray-800 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
      >
        Book Again
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </article>
  );
}

function HotelStayCard({ stay, onBookHotel }: { stay: HotelHistoryItem; onBookHotel: () => void }) {
  return (
    <article className="rounded-2xl border border-amber-200/90 bg-amber-50/50 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800/80">Hotel stay</p>
          <h3 className="mt-0.5 text-[16px] font-bold text-gray-900">{stay.hotelName}</h3>
          <p className="mt-1 text-[12px] text-gray-600 line-clamp-2">{stay.addressLine}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
            stay.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {stay.status === 'confirmed' ? 'Confirmed' : 'Cancelled'}
        </span>
      </div>
      <ul className="mt-3 space-y-1 text-[13px] text-gray-800">
        <li>
          <span className="text-gray-500">Check-in → out: </span>
          {stay.checkIn} · {stay.checkOut}
        </li>
        <li>
          <span className="text-gray-500">Nights / guests: </span>
          {stay.nights} · {stay.guests} guest{stay.guests === 1 ? '' : 's'}
        </li>
        <li>
          <span className="text-gray-500">Booked: </span>
          {stay.bookedAtLabel}
        </li>
        {stay.amount ? <li className="font-semibold text-[var(--color-primary)]">{stay.amount}</li> : null}
        {stay.guestNote ? (
          <li className="text-[12px] text-gray-600">
            <span className="text-gray-500">Note: </span>
            {stay.guestNote}
          </li>
        ) : null}
      </ul>
      <button
        type="button"
        onClick={onBookHotel}
        className="mt-4 w-full rounded-xl border border-amber-300 bg-white py-3 text-[14px] font-semibold text-amber-950 hover:bg-amber-50/80 transition-colors"
      >
        Find more hotels
      </button>
    </article>
  );
}

function FoodOrderCard({ item, onOrderAgain }: { item: FoodDeliveryHistoryItem; onOrderAgain: () => void }) {
  return (
    <article className="rounded-2xl border border-orange-200/90 bg-orange-50/40 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-900/70">Food delivery</p>
          <h3 className="mt-0.5 text-[16px] font-bold text-gray-900">{item.restaurantName}</h3>
          {item.pickupName ? (
            <p className="mt-1 text-[12px] text-gray-600">Pickup area: {item.pickupName}</p>
          ) : null}
        </div>
        <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-800">
          Confirmed
        </span>
      </div>
      <ul className="mt-3 space-y-1 text-[13px] text-gray-800">
        {item.items.map((line, idx) => (
          <li key={`${line.name}-${idx}`}>
            {line.name} × {line.quantity} · {line.price}
          </li>
        ))}
        <li className="font-semibold text-[var(--color-primary)]">{item.amount}</li>
        <li className="text-[12px] text-gray-500">Booked {item.bookedAtLabel}</li>
      </ul>
      <button
        type="button"
        onClick={onOrderAgain}
        className="mt-4 w-full rounded-xl border border-orange-300 bg-white py-3 text-[14px] font-semibold text-orange-950 hover:bg-orange-50/80 transition-colors"
      >
        Order again
      </button>
    </article>
  );
}

function MarketplaceOrderCard({ item }: { item: MarketplaceOrderHistoryItem }) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-600">Marketplace</p>
          <h3 className="mt-0.5 truncate text-[16px] font-bold text-gray-900">{item.shopName}</h3>
          <p className="mt-1 font-mono text-[12px] text-stone-700">{item.orderRef}</p>
        </div>
        <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-800">
          Confirmed
        </span>
      </div>
      <ul className="mt-3 space-y-1 text-[13px] text-gray-800">
        {item.summaryLines.map((line, idx) => (
          <li key={`${line.name}-${idx}`}>
            {line.name} × {line.quantity}
          </li>
        ))}
        <li className="font-semibold text-[var(--color-primary)]">{item.totalDisplay}</li>
        {item.deliveryAddress ? (
          <li className="text-[12px] text-gray-600 line-clamp-2">{item.deliveryAddress}</li>
        ) : null}
        <li className="text-[12px] text-gray-500">Booked {item.bookedAtLabel}</li>
      </ul>
      <Link
        href={ROUTES.KHATU_MARKETPLACE}
        className="mt-4 flex w-full items-center justify-center rounded-xl border border-stone-300 bg-white py-3 text-[14px] font-semibold text-stone-900 hover:bg-stone-50/80"
      >
        Back to marketplace
      </Link>
    </article>
  );
}

function SalasarRideCard({ item, onBookRoute }: { item: SalasarRideHistoryItem; onBookRoute: () => void }) {
  return (
    <article className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/90 to-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-900/70">Salasar & corridor ride</p>
          <h3 className="mt-0.5 text-[16px] font-bold text-gray-900">{item.routeLabel}</h3>
          <p className="mt-1 text-[13px] text-amber-950/85">
            {item.fromPlace} → {item.toPlace}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
            item.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'
          }`}
        >
          {item.status === 'confirmed' ? 'Confirmed' : 'Quoted'}
        </span>
      </div>
      <ul className="mt-3 space-y-1 text-[13px] text-gray-800">
        <li>
          <span className="text-gray-500">Ref: </span>
          <span className="font-mono font-semibold">{item.bookingRef}</span>
        </li>
        <li>
          {item.vehicleLabel} · {item.distanceKm} km · ~{item.typicalMinutes} min
        </li>
        <li className="font-semibold text-[var(--color-primary)]">Est. ₹{item.estimateInr.toLocaleString('en-IN')}</li>
        <li className="text-[12px] text-gray-500">{item.bookedAtLabel}</li>
      </ul>
      <button
        type="button"
        onClick={onBookRoute}
        className="mt-4 w-full rounded-xl border border-amber-300 bg-white py-3 text-[14px] font-semibold text-amber-950 hover:bg-amber-50/80 transition-colors"
      >
        Book a route
      </button>
    </article>
  );
}

const TAB_LABELS: Record<HistoryTabId, string> = {
  all: 'All',
  food: 'Food',
  hotel: 'Hotels',
  marketplace: 'Marketplace',
  salasar: 'Salasar rides',
  rides: 'Deliveries',
};

function HistoryPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = useMemo(() => parseTab(searchParams.get('tab')), [searchParams]);

  const [stays, setStays] = useState<HotelHistoryItem[]>([]);
  const [foodRows, setFoodRows] = useState<FoodDeliveryHistoryItem[]>([]);
  const [mpRows, setMpRows] = useState<MarketplaceOrderHistoryItem[]>([]);
  const [salasarRows, setSalasarRows] = useState<SalasarRideHistoryItem[]>([]);

  const sync = useCallback(() => {
    setStays(getHotelBookingHistory());
    setFoodRows(getFoodDeliveryHistory());
    setMpRows(getMarketplaceOrderHistory());
    setSalasarRows(getSalasarRideHistory());
  }, []);

  useEffect(() => {
    sync();
  }, [sync]);

  useEffect(() => {
    window.addEventListener('focus', sync);
    return () => window.removeEventListener('focus', sync);
  }, [sync]);

  const setTab = useCallback(
    (next: HistoryTabId) => {
      const q = next === 'all' ? '' : `?tab=${next}`;
      router.replace(`${ROUTES.HISTORY}${q}`, { scroll: false });
    },
    [router]
  );

  const counts = useMemo(
    () => ({
      food: foodRows.length,
      hotel: stays.length,
      marketplace: mpRows.length,
      salasar: salasarRows.length,
      rides: RIDE_HISTORY.length,
    }),
    [foodRows.length, stays.length, mpRows.length, salasarRows.length]
  );

  const PREVIEW = 3;

  const handleBookAgainRide = () => router.push(ROUTES.DASHBOARD);
  const handleBookHotel = () => router.push(ROUTES.KHATU_HOTELS);
  const handleFoodAgain = () => router.push(`${ROUTES.TRIP_OPTIONS}?from=food`);
  const handleSalasar = () => router.push(ROUTES.KHATU_TRAVEL);

  const empty = (label: string, hint: string, cta: string, href: string) => (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center mt-3">
      <p className="text-[15px] font-medium text-gray-700">{label}</p>
      <p className="mt-2 text-[14px] text-gray-500">{hint}</p>
      <Link
        href={href}
        className="mt-4 inline-flex w-full min-h-[48px] items-center justify-center rounded-2xl bg-[var(--color-primary)] py-3.5 text-[16px] font-semibold text-white"
      >
        {cta}
      </Link>
    </div>
  );

  const sectionHeader = (id: HistoryTabId, title: string, count: number) => (
    <div className="mt-8 flex items-center justify-between gap-2 first:mt-2">
      <h2 className="text-[18px] font-bold text-gray-900">{title}</h2>
      {tab === 'all' && count > PREVIEW ? (
        <button
          type="button"
          onClick={() => setTab(id)}
          className="shrink-0 text-sm font-semibold text-[var(--color-primary)]"
        >
          View all ({count})
        </button>
      ) : null}
    </div>
  );

  const renderFoodList = (rows: FoodDeliveryHistoryItem[], limit?: number) => {
    const list = limit != null ? rows.slice(0, limit) : rows;
    if (rows.length === 0) {
      return empty(
        'No food orders yet',
        'Complete payment from Find Restaurant to see orders here.',
        'Find food',
        `${ROUTES.TRIP_OPTIONS}?from=food`
      );
    }
    return (
      <ul className="mt-3 space-y-4" aria-label="Food delivery history">
        {list.map((row) => (
          <li key={row.id}>
            <FoodOrderCard item={row} onOrderAgain={handleFoodAgain} />
          </li>
        ))}
      </ul>
    );
  };

  const renderHotelList = (rows: HotelHistoryItem[], limit?: number) => {
    const list = limit != null ? rows.slice(0, limit) : rows;
    if (rows.length === 0) {
      return (
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-6 text-center mt-3">
          <p className="text-[15px] font-medium text-gray-700">No hotel bookings yet</p>
          <p className="mt-2 text-[14px] text-gray-500">
            Complete payment after messaging the property on WhatsApp to see stays here.
          </p>
          <button
            type="button"
            onClick={handleBookHotel}
            className="mt-4 w-full rounded-2xl bg-[var(--color-primary)] py-3.5 text-[16px] font-semibold text-white"
          >
            Browse hotels
          </button>
        </div>
      );
    }
    return (
      <ul className="mt-3 space-y-4" aria-label="Hotel booking history">
        {list.map((stay) => (
          <li key={stay.id}>
            <HotelStayCard stay={stay} onBookHotel={handleBookHotel} />
          </li>
        ))}
      </ul>
    );
  };

  const renderMpList = (rows: MarketplaceOrderHistoryItem[], limit?: number) => {
    const list = limit != null ? rows.slice(0, limit) : rows;
    if (rows.length === 0) {
      return empty(
        'No marketplace orders yet',
        'Place an order from the Khatu marketplace to see it here.',
        'Open marketplace',
        ROUTES.KHATU_MARKETPLACE
      );
    }
    return (
      <ul className="mt-3 space-y-4" aria-label="Marketplace order history">
        {list.map((row) => (
          <li key={row.id}>
            <MarketplaceOrderCard item={row} />
          </li>
        ))}
      </ul>
    );
  };

  const renderSalasarList = (rows: SalasarRideHistoryItem[], limit?: number) => {
    const list = limit != null ? rows.slice(0, limit) : rows;
    if (rows.length === 0) {
      return empty(
        'No Salasar corridor rides yet',
        'Save a quote from Travel and continue to pickup to log a ride here.',
        'Book a route',
        ROUTES.KHATU_TRAVEL
      );
    }
    return (
      <ul className="mt-3 space-y-4" aria-label="Salasar ride history">
        {list.map((row) => (
          <li key={row.id}>
            <SalasarRideCard item={row} onBookRoute={handleSalasar} />
          </li>
        ))}
      </ul>
    );
  };

  const renderRidesList = (limit?: number) => {
    const rows = RIDE_HISTORY;
    const list = limit != null ? rows.slice(0, limit) : rows;
    if (rows.length === 0) {
      return empty(
        'No delivery rides yet',
        'Book a trip from the dashboard to see history here.',
        'Go to Dashboard',
        ROUTES.DASHBOARD
      );
    }
    return (
      <ul className="mt-3 space-y-4" aria-label="Delivery history">
        {list.map((ride) => (
          <li key={ride.id}>
            <RideCard ride={ride} onBookAgain={handleBookAgainRide} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <PageContainer className="pb-10">
        <header className="flex items-center gap-3 pt-6 pb-4 border-b border-gray-100">
          <IconButton aria-label="Back" onClick={() => router.back()} className="h-10 w-10">
            <BackIcon />
          </IconButton>
          <h1 className="text-[20px] font-bold text-gray-900">History</h1>
        </header>

        <div
          className="-mx-1 mt-4 flex gap-1 overflow-x-auto pb-1 scrollbar-thin"
          role="tablist"
          aria-label="History categories"
        >
          {VALID_TABS.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                tab === id
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {TAB_LABELS[id]}
              {id !== 'all' ? (
                <span className={`ml-1 tabular-nums ${tab === id ? 'text-white/90' : 'text-gray-500'}`}>
                  (
                  {id === 'food'
                    ? counts.food
                    : id === 'hotel'
                      ? counts.hotel
                      : id === 'marketplace'
                        ? counts.marketplace
                        : id === 'salasar'
                          ? counts.salasar
                          : counts.rides}
                  )
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {tab === 'all' ? (
          <>
            <p className="mt-4 text-[14px] text-gray-600">
              Tap a category to see only that activity, or scroll sections below for a quick overview.
            </p>
            {sectionHeader('food', 'Food delivery', counts.food)}
            {renderFoodList(foodRows, PREVIEW)}
            {sectionHeader('hotel', 'Hotel stays', counts.hotel)}
            {renderHotelList(stays, PREVIEW)}
            {sectionHeader('marketplace', 'Marketplace orders', counts.marketplace)}
            {renderMpList(mpRows, PREVIEW)}
            {sectionHeader('salasar', 'Salasar & corridor rides', counts.salasar)}
            {renderSalasarList(salasarRows, PREVIEW)}
            {sectionHeader('rides', 'Delivery rides (fleet)', counts.rides)}
            {renderRidesList(PREVIEW)}
          </>
        ) : null}

        {tab === 'food' ? (
          <>
            <h2 className="mt-6 text-[18px] font-bold text-gray-900">Food delivery</h2>
            {renderFoodList(foodRows)}
          </>
        ) : null}

        {tab === 'hotel' ? (
          <>
            <h2 className="mt-6 text-[18px] font-bold text-gray-900">Hotel stays</h2>
            {renderHotelList(stays)}
          </>
        ) : null}

        {tab === 'marketplace' ? (
          <>
            <h2 className="mt-6 text-[18px] font-bold text-gray-900">Marketplace</h2>
            {renderMpList(mpRows)}
          </>
        ) : null}

        {tab === 'salasar' ? (
          <>
            <h2 className="mt-6 text-[18px] font-bold text-gray-900">Salasar & corridor rides</h2>
            {renderSalasarList(salasarRows)}
          </>
        ) : null}

        {tab === 'rides' ? (
          <>
            <h2 className="mt-6 text-[18px] font-bold text-gray-900">Delivery rides</h2>
            <p className="mt-1 text-[13px] text-gray-500">Recent trips on the main delivery network (demo data).</p>
            {renderRidesList()}
          </>
        ) : null}
      </PageContainer>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <PageContainer className="py-10">
            <p className="text-center text-sm text-gray-500">Loading history…</p>
          </PageContainer>
        </div>
      }
    >
      <HistoryPageInner />
    </Suspense>
  );
}
