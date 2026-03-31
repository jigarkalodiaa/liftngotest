'use client';

import Image from '@/components/OptimizedImage';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { getPickupLocation, getDropLocation, getSenderDetails } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import { SUPPORT_PHONE } from '@/config/env';
import { IconButton, BackIcon, Button, CloseIcon } from '@/components/ui';

/** E.164-style tel link for driver/support (uses NEXT_PUBLIC_SUPPORT_PHONE when set). */
const SUPPORT_TEL = SUPPORT_PHONE
  ? `tel:+91${SUPPORT_PHONE.replace(/\D/g, '').slice(-10)}`
  : 'tel:+919065847341';
import CancelReasonSheet from './components/CancelReasonSheet';
import SorrySheet from './components/SorrySheet';

const PRICE_ANIMATION_MS = 300;

export default function BookingPage() {
  const router = useRouter();
  const [pickup, setPickup] = useState(getPickupLocation());
  const [drop, setDrop] = useState(getDropLocation());
  const [showPriceBreakup, setShowPriceBreakup] = useState(false);
  const [priceBreakupOpen, setPriceBreakupOpen] = useState(false);
  const [cancelButtonVisible, setCancelButtonVisible] = useState(false);
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);
  const [showSorryModal, setShowSorryModal] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState<string | null>(null);
  const [driverAssigned, setDriverAssigned] = useState(false);
  const [driverArrived, setDriverArrived] = useState(false);
  const [arrivalCountdown, setArrivalCountdown] = useState(5 * 60);

  const userName = getSenderDetails()?.name || 'there';

  useEffect(() => { const t = setTimeout(() => setDriverAssigned(true), 5000); return () => clearTimeout(t); }, []);
  useEffect(() => { if (!driverAssigned) return; const t = setTimeout(() => setDriverArrived(true), 5000); return () => clearTimeout(t); }, [driverAssigned]);
  useEffect(() => {
    if (!driverArrived) return;
    const interval = setInterval(() => setArrivalCountdown((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, [driverArrived]);

  useEffect(() => { setPickup(getPickupLocation()); setDrop(getDropLocation()); }, []);
  useEffect(() => { const t = requestAnimationFrame(() => setCancelButtonVisible(true)); return () => cancelAnimationFrame(t); }, []);
  useEffect(() => {
    if (showPriceBreakup) { const t = requestAnimationFrame(() => setPriceBreakupOpen(true)); return () => cancelAnimationFrame(t); }
    setPriceBreakupOpen(false);
  }, [showPriceBreakup]);

  const closePriceBreakup = useCallback(() => {
    setPriceBreakupOpen(false);
    setTimeout(() => setShowPriceBreakup(false), PRICE_ANIMATION_MS);
  }, []);

  const goToDashboard = useCallback(() => {
    setShowCancelReasonModal(false);
    setShowSorryModal(false);
    setSelectedCancelReason(null);
    router.push(ROUTES.DASHBOARD);
  }, [router]);

  useEffect(() => {
    if (!showPriceBreakup) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); closePriceBreakup(); } };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showPriceBreakup, closePriceBreakup]);

  const amountPayable = 400;
  const tripFare = 522;
  const gst = 8;
  const platformFee = 10;
  const totalAmount = 540;
  const countdownDisplay = `${String(Math.floor(arrivalCountdown / 60)).padStart(2, '0')} : ${String(arrivalCountdown % 60).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="relative flex min-h-screen flex-col">
        {/* Map area - placeholder */}
        <div className="relative h-[45vh] min-h-[280px] bg-slate-200">
          <div className="absolute inset-0 bg-[url('/globe.svg')] bg-cover bg-center opacity-30" />
          <div className="absolute inset-0 bg-slate-300/80" />
          {/* Route line placeholder */}
          <div className="absolute left-[15%] top-1/2 h-1 w-[70%] -translate-y-1/2 rounded-full bg-[var(--color-primary)] opacity-60" style={{ transform: 'translateY(-50%) rotate(-8deg)' }} />
          <div className="absolute left-[20%] top-[35%] h-4 w-4 rounded-full border-2 border-[var(--color-primary)] bg-white" />
          <div className="absolute right-[22%] top-[55%] h-5 w-5">
            <svg className="h-full w-full text-[var(--color-primary)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>

          <div className="absolute left-4 top-4 z-10">
            <IconButton
              aria-label="Back to dashboard"
              onClick={() => router.push(ROUTES.DASHBOARD)}
              className="h-10 w-10 bg-white/95 shadow-md"
            >
              <BackIcon />
            </IconButton>
          </div>

        </div>

        {/* Status banner (Captain on the way vs Driver arrived) */}
        {(driverAssigned || driverArrived) && (
          <div className="relative z-10 flex items-center justify-between bg-[var(--color-primary)] px-4 py-3 mb-12">
            <div>
              {driverArrived ? (
                <p className="text-[16px] font-bold text-white">Driver arrived</p>
              ) : (
                <>
                  <p className="text-[16px] font-bold text-white">Captain is on the way</p>
                  <p className="text-[13px] text-white/80">600 M</p>
                </>
              )}
            </div>

            {driverArrived ? (
              <span className="rounded-lg bg-emerald-500 px-3 py-1.5 text-[14px] font-bold text-white tabular-nums">
                {countdownDisplay}
              </span>
            ) : (
              <div className="flex gap-1">
                {[8, 8, 8, 8].map((n, i) => (
                  <span
                    key={i}
                    className="flex h-8 w-8 items-center justify-center rounded bg-white/20 text-sm font-bold text-white"
                  >
                    {n}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom card */}
        <div className="relative z-10 -mt-6 flex-1 rounded-t-3xl bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="mx-auto w-full max-w-[520px] px-4 pt-4 pb-8">
            {/* Drag handle */}
            <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-gray-300" />

            {!driverAssigned ? (
              <>
                {/* Finding driver */}
                <p className="text-center text-[18px] font-semibold text-gray-900">Finding driver nearby</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-1000"
                    style={{ width: '45%' }}
                  />
                </div>
              </>
            ) : (
              <>
                {/* Vehicle details */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[16px] font-bold text-gray-900">UP20CK1433</p>
                    <p className="mt-0.5 text-[14px] text-gray-500">2 wheeler • Bike</p>
                  </div>
                  <div className="relative h-14 w-14 flex-shrink-0">
                    <Image src="/services/two-wheeler.svg" alt="Bike" fill className="object-contain" />
                  </div>
                </div>

                {/* Driver details */}
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                  <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-lg font-semibold text-white">
                    RP
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded bg-amber-400 px-1 text-[10px] font-bold text-gray-900">4.2</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] text-gray-500">UP20CK1433</p>
                    <p className="text-[15px] font-semibold text-gray-900">Rakesh Patel</p>
                  </div>
                  <a
                    href={SUPPORT_TEL}
                    className="flex h-10 items-center gap-1.5 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-[14px] font-medium text-white"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call
                  </a>
                </div>

                {/* Location section */}
                <p className="mt-4 text-[13px] font-semibold text-gray-500">Location</p>
              </>
            )}

            {/* Pick up */}
            <div className={`flex gap-3 ${driverAssigned ? 'mt-2' : 'mt-5'}`}>
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-gray-500">Pick up</p>
                <p className="mt-0.5 text-[14px] font-medium text-gray-900">
                  {pickup?.address || pickup?.name || 'Pickup address'}
                </p>
              </div>
            </div>

            {/* Drop */}
            <div className="mt-3 flex gap-3">
              <svg className="h-6 w-6 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-gray-500">Drop</p>
                <p className="mt-0.5 text-[14px] font-medium text-gray-900">
                  {drop?.address || drop?.name || 'Drop address'}
                </p>
              </div>
            </div>

            {/* Amount payable */}
            <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-gray-900">Amount Payable</p>
                    <p className="mt-0.5 text-[13px] text-gray-600">Cash</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[20px] font-bold text-gray-900">₹{amountPayable}</p>
                  <button
                    type="button"
                    onClick={() => setShowPriceBreakup(true)}
                    className="mt-1 text-[13px] font-medium text-[var(--color-primary)]"
                  >
                    View breakup
                  </button>
                </div>
              </div>
            </div>

            {/* Complete trip – when driver arrived */}
            {driverArrived && (
              <div className="mt-6">
                <Button fullWidth onClick={() => router.push(ROUTES.TRIP_COMPLETE)}>
                  Complete trip
                </Button>
              </div>
            )}

            {/* Cancel ride – hidden once driver arrived / trip ready to complete */}
            {!driverArrived && (
              <div
                className="mt-6 transition-all duration-400 ease-out"
                style={{ transform: cancelButtonVisible ? 'translateY(0)' : 'translateY(24px)', opacity: cancelButtonVisible ? 1 : 0 }}
              >
                <button
                  type="button"
                  onClick={() => setShowCancelReasonModal(true)}
                  className="w-full rounded-2xl border-2 border-red-500 bg-white py-3.5 text-[16px] font-semibold text-red-500 hover:bg-red-50 transition-colors"
                >
                  Cancel ride
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Price Details – bottom sheet with slide-up animation */}
      {showPriceBreakup && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 ease-out"
            style={{ opacity: priceBreakupOpen ? 1 : 0 }}
            aria-hidden="true"
            onClick={closePriceBreakup}
          />
          <div
            className="fixed inset-x-0 bottom-0 z-[100] rounded-t-3xl bg-white p-5 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out"
            style={{ transform: priceBreakupOpen ? 'translateY(0)' : 'translateY(100%)' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="price-details-title"
          >
            <div className="mx-auto max-w-[400px]">
              <div className="flex items-center justify-between mb-4">
                <h2 id="price-details-title" className="text-[18px] font-bold text-gray-900">
                  Price Details
                </h2>
                <button
                  type="button"
                  onClick={closePriceBreakup}
                  aria-label="Close"
                  className="h-9 w-9 rounded-full bg-gray-100 grid place-items-center text-gray-600 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[14px]">
                  <span className="text-gray-600">Trip fare</span>
                  <span className="font-medium text-gray-900">₹{tripFare}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-gray-600">GST</span>
                  <span className="font-medium text-gray-900">₹{gst}</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-gray-600">Platform fee</span>
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">₹{platformFee}</span>
                    <button type="button" className="text-[var(--color-primary)] text-[13px]">Know more</button>
                  </span>
                </div>
              </div>
              <div className="mt-4 border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-[15px] font-bold text-gray-900">Total Amount</span>
                <span className="text-[15px] font-bold text-gray-900">₹{totalAmount}</span>
              </div>
              <Button fullWidth className="mt-5 !rounded-xl" onClick={closePriceBreakup}>
                Done
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Cancel reason – bottom sheet */}
      <CancelReasonSheet
        isOpen={showCancelReasonModal}
        onClose={() => setShowCancelReasonModal(false)}
        selectedReason={selectedCancelReason}
        onSelectReason={setSelectedCancelReason}
        onSubmit={() => { setShowCancelReasonModal(false); setShowSorryModal(true); }}
      />

      {/* Sorry to hear – bottom sheet */}
      <SorrySheet
        isOpen={showSorryModal}
        onClose={goToDashboard}
        userName={userName}
        onDone={goToDashboard}
      />
    </div>
  );
}
