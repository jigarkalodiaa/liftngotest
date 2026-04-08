'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { Building2, Car, Star, UtensilsCrossed, Waves } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { getStoredPhone, getUserProfile } from '@/lib/storage';
import { BookingForm, type BookingFormValues, BookingSuccess, upsertKhatuBooking } from '@/components/khatu/booking';
import type { KhatuBookingRecord } from '@/components/khatu/booking';
import KhatuScreenShell from '../common/KhatuScreenShell';
import KhatuPackageBuilder from './KhatuPackageBuilder';
import KhatuPackageTrackingCard from './KhatuPackageTrackingCard';
import { useKhatuPackageBuilder } from './useKhatuPackageBuilder';
import { useKhatuPackageTracking } from './useKhatuPackageTracking';
import type { KhatuServiceKey } from './types';

type PackageStep = 1 | 2 | 3 | 4;
const SERVICE_TEXT: Record<KhatuServiceKey, string> = {
  cab: 'Cab',
  hotel: 'Hotel',
  food: 'Food',
  guide: 'Guide',
  darshan: 'Darshan',
  waterPark: 'Water park',
  returnTrip: 'Return trip',
};
const VENDOR_WHATSAPP_PHONE = '918588808581';
const DEFAULT_EXPERT_PHONE = '8588808581';
const DEFAULT_EXPERT_NAME = 'Khatu Travel Expert';
const PACKAGE_PRESETS: Array<{
  id: string;
  title: string;
  subtitle: string;
  popular?: boolean;
  services: Record<KhatuServiceKey, boolean>;
}> = [
  {
    id: 'regular',
    title: 'Regular package',
    subtitle: 'Cab + Darshan + Return trip',
    services: {
      cab: true,
      hotel: false,
      food: false,
      guide: false,
      darshan: true,
      waterPark: false,
      returnTrip: true,
    },
  },
  {
    id: 'most_popular',
    title: 'Most popular',
    subtitle: 'Cab + Darshan + Return trip',
    popular: true,
    services: {
      cab: true,
      hotel: false,
      food: false,
      guide: false,
      darshan: true,
      waterPark: false,
      returnTrip: true,
    },
  },
  {
    id: 'family_plus',
    title: 'Family Plus',
    subtitle: 'Cab + Darshan + Water park + Return',
    services: {
      cab: true,
      hotel: false,
      food: false,
      guide: false,
      darshan: true,
      waterPark: true,
      returnTrip: true,
    },
  },
];

export default function KhatuPackagePage() {
  const [step, setStep] = useState<PackageStep>(1);
  const [submitting, setSubmitting] = useState(false);
  const [whatsappOpened, setWhatsappOpened] = useState(false);
  const [lastBooking, setLastBooking] = useState<KhatuBookingRecord | null>(null);

  const {
    services,
    toggleService,
    resetServices,
    applyServices,
    selectedServiceKeys,
    hasSelection,
    basePrice,
    addOnsTotal,
    totalPrice,
    servicePriceMap,
  } = useKhatuPackageBuilder();
  const tracking = useKhatuPackageTracking();
  const profile = getUserProfile();
  const initialName = profile?.fullName ?? '';
  const initialPhone = profile?.alternatePhone || getStoredPhone() || '';

  const addOnsBreakdown = useMemo(
    () => selectedServiceKeys.map((key) => ({ key, amount: servicePriceMap[key] })),
    [selectedServiceKeys, servicePriceMap],
  );
  const presetCards = useMemo(
    () =>
      PACKAGE_PRESETS.map((preset) => {
        const addOns = (Object.keys(preset.services) as KhatuServiceKey[]).reduce(
          (sum, key) => sum + (preset.services[key] ? servicePriceMap[key] : 0),
          0,
        );
        return { ...preset, total: basePrice + addOns };
      }),
    [basePrice, servicePriceMap],
  );

  const createWhatsAppUrl = useCallback(
    (booking: KhatuBookingRecord) => {
      const selectedLines = (Object.keys(booking.services) as KhatuServiceKey[])
        .map((key) => `- ${SERVICE_TEXT[key]}: ${booking.services[key] ? 'Yes' : 'No'}`)
        .join('\n');
      const message = `New Khatu Yatra Booking

Name: ${booking.name}
Phone: ${booking.phone}

Selected Services:
${selectedLines}

Total Price: ₹${booking.totalPrice}

Please confirm and assign expert.`;
      return `https://wa.me/${VENDOR_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    },
    [],
  );

  const openWhatsappForBooking = useCallback(
    (booking: KhatuBookingRecord) => {
      const url = createWhatsAppUrl(booking);
      if (typeof window === 'undefined') return;
      const opened = window.open(url, '_blank', 'noopener,noreferrer');
      setWhatsappOpened(Boolean(opened));
    },
    [createWhatsAppUrl],
  );

  const onConfirmBooking = useCallback(
    (values: BookingFormValues) => {
      if (!hasSelection || submitting) return;
      setSubmitting(true);
      const booking: KhatuBookingRecord = {
        id: `khatu_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        name: values.name.trim(),
        phone: values.phone,
        services,
        totalPrice,
        date: new Date().toISOString(),
        status: 'PENDING',
        expert: {
          name: DEFAULT_EXPERT_NAME,
          phone: DEFAULT_EXPERT_PHONE,
        },
      };
      const saved = upsertKhatuBooking(booking);
      setLastBooking(saved);
      openWhatsappForBooking(saved);
      setStep(4);
      setSubmitting(false);
    },
    [hasSelection, openWhatsappForBooking, services, submitting, totalPrice],
  );

  return (
    <KhatuScreenShell title="Khatu Yatra Package" eyebrow="Plan and track in one flow" backHref={ROUTES.DASHBOARD}>
      <div className="space-y-4">
        <div className="rounded-2xl border border-stone-200/80 bg-white p-3 shadow-sm sm:p-4">
          <div className="flex items-center gap-2">
            {[
              { n: 1, label: 'Select' },
              { n: 2, label: 'Customize' },
              { n: 3, label: 'Confirm' },
              { n: 4, label: 'Done' },
            ].map((item) => {
              const index = item.n;
              const active = step === index;
              const done = step > index;
              return (
                <div key={index} className="flex items-center gap-1.5">
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition-colors ${
                      done
                        ? 'bg-emerald-600 text-white'
                        : active
                          ? 'bg-[var(--khatu-saffron)] text-white'
                          : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {index}
                  </span>
                  <span className={`hidden text-[11px] font-semibold sm:inline ${active ? 'text-stone-900' : 'text-stone-500'}`}>
                    {item.label}
                  </span>
                </div>
              );
            })}
            <span className="ml-1 text-xs font-medium text-stone-500">Step {step} of 4</span>
          </div>
        </div>

        {step === 1 ? (
          <section className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--khatu-saffron)]">Khatu Yatra</p>
            <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[var(--khatu-stone)]">Build your own temple package</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Choose only the services you need, get transparent pricing, and track trip progress from pickup to return.
            </p>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-4 w-full rounded-xl bg-[var(--khatu-saffron)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-95 active:scale-[0.99] sm:w-auto"
            >
              Plan your trip
            </button>

            <div className="mt-5 border-t border-stone-200 pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-600">Quick default packages</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {presetCards.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      applyServices(preset.services);
                      setStep(2);
                    }}
                    className="group relative flex min-h-[160px] flex-col items-center rounded-xl border border-stone-100 bg-white p-3 text-center shadow-[0_2px_14px_-4px_rgba(28,25,23,0.08)] transition-all hover:border-stone-200/90 hover:shadow-[0_6px_24px_-8px_rgba(28,25,23,0.12)] sm:min-h-[172px]"
                  >
                    <span className="absolute right-2 top-2 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-700">
                      ₹{preset.total}
                    </span>
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-lg ${
                        preset.id === 'regular'
                          ? 'bg-amber-50 text-amber-600'
                          : preset.id === 'most_popular'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-sky-50 text-sky-600'
                      }`}
                      aria-hidden
                    >
                        {preset.id === 'regular' ? (
                          <Car className="h-5 w-5" strokeWidth={1.9} />
                      ) : preset.id === 'most_popular' ? (
                        <Star className="h-5 w-5" strokeWidth={1.9} />
                      ) : (
                        <Waves className="h-5 w-5" strokeWidth={1.9} />
                      )}
                    </span>
                    <p className="mt-3 text-base font-bold leading-snug text-[var(--khatu-stone)]">{preset.title}</p>
                    {preset.popular ? (
                      <span className="mt-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        Most popular
                      </span>
                    ) : null}
                    <p className="mt-2 line-clamp-2 text-xs text-stone-500">{preset.subtitle}</p>
                    <span className="mt-auto pt-2 text-xs text-stone-400">Apply Package &gt;</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/80 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">Terms &amp; compliance</p>
              <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-amber-950/90">
                <li>Khatu package operations are managed by a verified partner agent.</li>
                <li>Vehicle type and final assignment are confirmed by the agent over call.</li>
                <li>Darshan support is free; no fixed darshan service fee is charged here.</li>
                <li>Food pricing is dynamic based on restaurant/menu and can be booked via Liftngo.</li>
                <li>Any service-level dispute is directly between user and assigned partner agent, subject to applicable law.</li>
              </ul>
            </div>

            <div className="mt-4 rounded-xl border border-stone-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-700">Explore Liftngo Khatu features</p>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Link
                  href={ROUTES.KHATU_MARKETPLACE}
                  className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-left text-xs font-semibold text-stone-800 transition-colors hover:bg-stone-100"
                >
                  Khatu marketplace
                </Link>
                <Link
                  href={ROUTES.FIND_RESTAURANT}
                  className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-left text-xs font-semibold text-stone-800 transition-colors hover:bg-stone-100"
                >
                  Liftngo Food
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        {step === 2 ? (
          <>
            <KhatuPackageBuilder services={services} servicePriceMap={servicePriceMap} onToggle={toggleService} />

            <section className="rounded-2xl border border-stone-200/80 bg-white p-3.5 shadow-sm sm:p-4">
              <p className="text-xs font-semibold text-stone-600">Price summary</p>
              <div className="mt-2 space-y-1.5 text-sm">
                <div className="flex items-center justify-between text-stone-700">
                  <span>Base package</span>
                  <span className="font-semibold">₹{basePrice}</span>
                </div>
                <div className="flex items-center justify-between text-stone-700">
                  <span>Add-ons</span>
                  <span className="font-semibold">₹{addOnsTotal}</span>
                </div>
                <div className="mt-2 border-t border-stone-200 pt-2">
                  <div className="flex items-center justify-between text-base font-bold text-[var(--khatu-stone)]">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              {addOnsBreakdown.length > 0 ? (
                <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {addOnsBreakdown.map((item) => (
                    <li key={item.key} className="rounded-lg bg-stone-50 px-2.5 py-1.5 text-xs text-stone-600">
                      {SERVICE_TEXT[item.key]} +₹{item.amount}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  No services selected yet. Please select at least one service to continue.
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={resetServices}
                  className="flex-1 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-50"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!hasSelection}
                  className="flex-1 rounded-lg bg-[var(--khatu-saffron)] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:brightness-95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </section>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <BookingForm initialName={initialName} initialPhone={initialPhone} loading={submitting} onSubmit={onConfirmBooking} />
          </>
        ) : null}

        {step === 4 ? (
          <>
            {lastBooking ? (
              <BookingSuccess
                phone={lastBooking.phone}
                whatsappOpened={whatsappOpened}
                onRetryWhatsApp={() => openWhatsappForBooking(lastBooking)}
              />
            ) : null}
            <KhatuPackageTrackingCard
              driver={tracking.driverDetails}
            />
            <section className="rounded-2xl border border-stone-200/80 bg-white p-3.5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-700">Explore Liftngo Khatu features</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Link
                  href={ROUTES.KHATU_MARKETPLACE}
                  className="group flex min-h-[126px] flex-col items-center rounded-xl border border-stone-100 bg-white p-3 text-center shadow-[0_2px_14px_-4px_rgba(28,25,23,0.08)] transition hover:border-stone-200/90 hover:shadow-[0_6px_24px_-8px_rgba(28,25,23,0.12)]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-stone-50" aria-hidden>
                    <Building2 className="h-5 w-5 text-[var(--khatu-stone)]" strokeWidth={1.75} />
                  </span>
                  <span className="mt-3 text-sm font-bold text-[var(--khatu-stone)]">Khatu marketplace</span>
                  <span className="mt-2 text-xs text-stone-400">Explore Now &gt;</span>
                </Link>
                <Link
                  href={ROUTES.FIND_RESTAURANT}
                  className="group flex min-h-[126px] flex-col items-center rounded-xl border border-stone-100 bg-white p-3 text-center shadow-[0_2px_14px_-4px_rgba(28,25,23,0.08)] transition hover:border-stone-200/90 hover:shadow-[0_6px_24px_-8px_rgba(28,25,23,0.12)]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-stone-50" aria-hidden>
                    <UtensilsCrossed className="h-5 w-5 text-[var(--khatu-stone)]" strokeWidth={1.75} />
                  </span>
                  <span className="mt-3 text-sm font-bold text-[var(--khatu-stone)]">Liftngo Food</span>
                  <span className="mt-2 text-xs text-stone-400">Explore Now &gt;</span>
                </Link>
              </div>
            </section>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-semibold text-stone-700 transition-colors hover:bg-stone-50"
            >
              Plan another package
            </button>
          </>
        ) : null}
      </div>
    </KhatuScreenShell>
  );
}
