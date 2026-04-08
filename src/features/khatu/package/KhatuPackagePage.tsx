'use client';

import { useCallback, useMemo, useState } from 'react';
import { ROUTES } from '@/lib/constants';
import { getStoredPhone, getUserProfile } from '@/lib/storage';
import { BookingForm, type BookingFormValues, BookingSuccess, BookingSummary, upsertKhatuBooking } from '@/components/khatu/booking';
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

export default function KhatuPackagePage() {
  const [step, setStep] = useState<PackageStep>(1);
  const [submitting, setSubmitting] = useState(false);
  const [whatsappOpened, setWhatsappOpened] = useState(false);
  const [lastBooking, setLastBooking] = useState<KhatuBookingRecord | null>(null);

  const {
    services,
    toggleService,
    resetServices,
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
          </section>
        ) : null}

        {step === 2 ? (
          <>
            <BookingSummary services={services} basePrice={basePrice} addOnsTotal={addOnsTotal} totalPrice={totalPrice} sticky />
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
            <BookingSummary services={services} basePrice={basePrice} addOnsTotal={addOnsTotal} totalPrice={totalPrice} sticky />
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
              timeline={tracking.timeline}
              driver={tracking.driverDetails}
            />
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
