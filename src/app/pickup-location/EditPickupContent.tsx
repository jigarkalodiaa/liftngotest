'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { SavedLocation, PersonDetails } from '@/types/booking';
import {
  getPickupLocation,
  getDropLocation,
  getLandingPickupLocation,
  getStoredPhone,
  setPickupLocation,
  setSenderDetails,
  setReceiverDetails,
} from '@/lib/storage';
import { ROUTES, MOBILE_LENGTH } from '@/lib/constants';

export default function PickupLocationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2>(1);
  const [pickup, setPickup] = useState<SavedLocation | null>(null);
  const [drop, setDrop] = useState<SavedLocation | null>(null);
  const [senderName, setSenderName] = useState('');
  const [senderMobile, setSenderMobile] = useState('');
  const [useCurrentMobile, setUseCurrentMobile] = useState(false);
  const [receiverName, setReceiverName] = useState('');
  const [receiverMobile, setReceiverMobile] = useState('');
  const [useReceiverCurrentMobile, setUseReceiverCurrentMobile] = useState(false);
  const [currentMobile, setCurrentMobile] = useState('');

  useEffect(() => {
    const storedPhone = getStoredPhone();
    setCurrentMobile(storedPhone);

    const savedPickup = getPickupLocation();
    if (savedPickup) {
      setPickup(savedPickup);
    } else {
      const landingPickup = getLandingPickupLocation();
      if (landingPickup?.trim()) {
        const name = landingPickup.split(',')[0]?.trim() || 'Pickup location';
        const derived: SavedLocation = { name, address: landingPickup, contact: '' };
        setPickup(derived);
        setPickupLocation(derived);
      }
    }

    const savedDrop = getDropLocation();
    if (savedDrop) setDrop(savedDrop);

    // Do not pre-fill sender or receiver – user enters them manually (or uses "Use my current mobile")
  }, []);

  // Re-sync pickup/drop from storage when returning (e.g. after editing location); do not re-fill sender/receiver
  useEffect(() => {
    if (pathname !== ROUTES.PICKUP_LOCATION) return;
    const savedPickup = getPickupLocation();
    const savedDrop = getDropLocation();
    if (savedPickup) setPickup(savedPickup);
    if (savedDrop) setDrop(savedDrop);
  }, [pathname]);

  // Initialize step from query (?step=2)
  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam === '2') {
      setStep(2);
    } else if (stepParam === '1') {
      setStep(1);
    }
  }, [searchParams]);

  // When toggling "use my current number"
  useEffect(() => {
    if (useCurrentMobile) {
      setSenderMobile(currentMobile);
    }
  }, [useCurrentMobile]);

  useEffect(() => {
    if (useReceiverCurrentMobile) {
      setReceiverMobile(currentMobile);
    }
  }, [useReceiverCurrentMobile]);

  const isMobileValid = useMemo(() => {
    const digits = senderMobile.replace(/\D/g, '');
    return digits.length === MOBILE_LENGTH;
  }, [senderMobile]);

  const isReceiverMobileValid = useMemo(() => {
    const digits = receiverMobile.replace(/\D/g, '');
    return digits.length === MOBILE_LENGTH;
  }, [receiverMobile]);

  const isPickupFormValid = useMemo(
    () => Boolean(pickup && senderName.trim() && isMobileValid),
    [pickup, senderName, isMobileValid]
  );

  const isDropFormValid = useMemo(
    () => Boolean(drop && receiverName.trim() && isReceiverMobileValid),
    [drop, receiverName, isReceiverMobileValid]
  );

  const isFormValid = step === 1 ? isPickupFormValid : isDropFormValid;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[520px] px-4 pb-8 pt-6">
        {/* Header */}
        <header className="flex items-center gap-3 pt-4 pb-5">
          <button
            type="button"
            onClick={() => router.push(ROUTES.DASHBOARD)}
            aria-label="Back to dashboard"
            className="h-9 w-9 rounded-full border border-gray-200 bg-white grid place-items-center"
          >
            <svg className="h-5 w-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 text-center">
            <div className="text-[20px] font-semibold text-gray-900">Personal Details</div>
            <div className="mt-1 text-[12px] text-gray-500">
              {step === 1 ? 'Step 1 of 2 : Sender Details' : 'Step 2 of 2 : Receiver Details'}
            </div>
          </div>
          <div className="w-9" />
        </header>

        {/* Progress bar */}
        <div className="mt-1 mb-5 flex h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div className={`w-1/2 ${step >= 1 ? 'bg-emerald-500' : 'bg-emerald-100'}`} />
          <div className={`flex-1 ${step >= 2 ? 'bg-emerald-500' : 'bg-emerald-100'}`} />
        </div>

        {/* Card */}
        <div className="rounded-[22px] border border-gray-200 bg-white shadow-sm overflow-hidden">
          {step === 1 ? (
            <>
              <div className="bg-[#F5F7FF] px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-semibold text-gray-800">Pick up Location</div>
                  {pickup ? (
                    <button
                      type="button"
                      onClick={() => router.push(`${ROUTES.PICKUP_LOCATION_EDIT}?type=pickup`)}
                      className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-left"
                    >
                      <div className="text-[14px] font-semibold text-gray-900">{pickup.name}</div>
                      <div className="mt-1 text-[12px] text-gray-500">{pickup.address}</div>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => router.push(`${ROUTES.PICKUP_LOCATION_EDIT}?type=pickup`)}
                      className="mt-2 w-full rounded-xl border border-dashed border-gray-400 bg-white px-3 py-2 text-left text-[14px] text-gray-400"
                    >
                      Enter pickup location
                    </button>
                  )}
                </div>
                <div className="h-9 w-9" />
              </div>

              <div className="px-4 pt-4 pb-5 space-y-4">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-gray-600">Sender name</label>
                  <input
                    type="text"
                    placeholder="Sender name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[12px] font-medium text-gray-600">Sender Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="Sender Mobile Number"
                    value={senderMobile}
                    onChange={(e) => {
                      const val = e.target.value;
                      const digits = val.replace(/\D/g, '').slice(0, 10);
                      setSenderMobile(digits);
                      if (digits !== currentMobile) {
                        setUseCurrentMobile(false);
                      }
                    }}
                    className={`w-full rounded-xl border bg-white px-3 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none ${
                      senderMobile && !isMobileValid ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {senderMobile && !isMobileValid && (
                    <p className="mt-1 text-[11px] text-red-500">Enter a valid 10-digit mobile number.</p>
                  )}
                </div>

                <label className="mt-1 flex items-center gap-2 text-[12px] text-gray-600">
                  <input
                    type="checkbox"
                    checked={useCurrentMobile}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setUseCurrentMobile(checked);
                      if (!checked) {
                        setSenderMobile('');
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)]"
                  />
                  <span>
                    Use My current Mobile number : <span className="font-semibold text-gray-800">{currentMobile}</span>
                  </span>
                </label>

                <div className="mt-4 flex justify-center gap-1.5">
  <span className="h-2 w-2 rounded-full bg-gray-300" />
  <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
</div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-[#F5F7FF] px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-semibold text-gray-800">Drop Location</div>
                  {drop ? (
                    <button
                      type="button"
                      onClick={() => router.push(`${ROUTES.PICKUP_LOCATION_EDIT}?type=drop`)}
                      className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-left"
                    >
                      <div className="text-[14px] font-semibold text-gray-900">{drop.name}</div>
                      <div className="mt-1 text-[12px] text-gray-500">{drop.address}</div>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => router.push(`${ROUTES.PICKUP_LOCATION_EDIT}?type=drop`)}
                      className="mt-2 w-full rounded-xl border border-dashed border-gray-400 bg-white px-3 py-2 text-left text-[14px] text-gray-400"
                    >
                      Enter drop location
                    </button>
                  )}
                </div>
                <div className="h-9 w-9" />
              </div>

              <div className="px-4 pt-4 pb-5 space-y-4">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-gray-600">Receiver&apos;s name</label>
                  <input
                    type="text"
                    placeholder="Receiver's name"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[12px] font-medium text-gray-600">Receiver Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="Receiver Mobile Number"
                    value={receiverMobile}
                    onChange={(e) => {
                      const val = e.target.value;
                      const digits = val.replace(/\D/g, '').slice(0, 10);
                      setReceiverMobile(digits);
                      if (digits !== currentMobile) {
                        setUseReceiverCurrentMobile(false);
                      }
                    }}
                    className={`w-full rounded-xl border bg-white px-3 py-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none ${
                      receiverMobile && !isReceiverMobileValid ? 'border-red-400' : 'border-gray-300'
                    }`}
                  />
                  {receiverMobile && !isReceiverMobileValid && (
                    <p className="mt-1 text-[11px] text-red-500">Enter a valid 10-digit mobile number.</p>
                  )}
                </div>

                <label className="mt-1 flex items-center gap-2 text-[12px] text-gray-600">
                  <input
                    type="checkbox"
                    checked={useReceiverCurrentMobile}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setUseReceiverCurrentMobile(checked);
                      if (!checked) {
                        setReceiverMobile('');
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)]"
                  />
                  <span>
                    Use My current Mobile number : <span className="font-semibold text-gray-800">{currentMobile}</span>
                  </span>
                </label>

                <div className="mt-4 flex justify-center gap-1.5">
  <span className="h-2 w-2 rounded-full bg-gray-300" />
  <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
</div>
              </div>
            </>
          )}
        </div>

        {/* Bottom button */}
        <div className="fixed inset-x-0 bottom-0">
          <div className="mx-auto w-full max-w-[520px] bg-white px-4 pb-7 pt-3 shadow-[0_-8px_20px_rgba(15,23,42,0.12)]">
            <button
              type="button"
              disabled={!isFormValid}
              onClick={() => {
                if (!isFormValid) return;
                if (step === 1) {
                  const sender: PersonDetails = { name: senderName.trim(), mobile: senderMobile };
                  setSenderDetails(sender);
                  setStep(2);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  const receiver: PersonDetails = { name: receiverName.trim(), mobile: receiverMobile };
                  setReceiverDetails(receiver);
                  router.push(ROUTES.TRIP_OPTIONS);
                }
              }}
              className="w-full rounded-2xl bg-[var(--color-primary)] py-3.5 text-[16px] font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 1 ? 'Confirm pick location' : 'Confirm drop location'}
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


