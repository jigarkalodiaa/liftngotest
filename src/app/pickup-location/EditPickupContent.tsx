'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SavedLocation, PersonDetails } from '@/types/booking';
import {
  clearDropLocation,
  clearPickupLocation,
  getPickupLocation,
  getDropLocation,
  getLandingPickupLocation,
  getStoredPhone,
  getSenderDetails,
  getReceiverDetails,
  savedLocationHasAddress,
  setPickupLocation,
  setSenderDetails,
  setReceiverDetails,
} from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import { senderDetailsSchema, receiverDetailsSchema, validatePersonName } from '@/lib/validations';

type PersonalForm = {
  senderName: string;
  senderMobile: string;
  receiverName: string;
  receiverMobile: string;
};

export default function EditPickupContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2>(() =>
    searchParams.get('step') === '2' ? 2 : 1
  );
  const [pickup, setPickup] = useState<SavedLocation | null>(null);
  const [drop, setDrop] = useState<SavedLocation | null>(null);
  const [useCurrentMobile, setUseCurrentMobile] = useState(false);
  const [useReceiverCurrentMobile, setUseReceiverCurrentMobile] = useState(false);
  const [currentMobile, setCurrentMobile] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<PersonalForm>({
    defaultValues: {
      senderName: '',
      senderMobile: '',
      receiverName: '',
      receiverMobile: '',
    },
  });

  const senderName = watch('senderName');
  const senderMobile = watch('senderMobile');
  const receiverName = watch('receiverName');
  const receiverMobile = watch('receiverMobile');

  useEffect(() => {
    const storedPhone = getStoredPhone();
    setCurrentMobile(storedPhone);

    const savedPickup = getPickupLocation();
    if (savedLocationHasAddress(savedPickup)) {
      setPickup(savedPickup);
    } else {
      if (savedPickup) clearPickupLocation();
      const landingPickup = getLandingPickupLocation();
      if (landingPickup?.trim()) {
        const name = landingPickup.split(',')[0]?.trim() || 'Pickup location';
        const derived: SavedLocation = { name, address: landingPickup, contact: '' };
        setPickup(derived);
        setPickupLocation(derived);
      }
    }

    const savedDrop = getDropLocation();
    if (savedLocationHasAddress(savedDrop)) setDrop(savedDrop);
    else if (savedDrop) clearDropLocation();

    const sender = getSenderDetails();
    if (sender?.name) setValue('senderName', sender.name);
    if (sender?.mobile) {
      const digits = sender.mobile.replace(/\D/g, '').slice(0, 10);
      setValue('senderMobile', digits);
      if (digits === storedPhone) setUseCurrentMobile(true);
    }
    const receiver = getReceiverDetails();
    if (receiver?.name) setValue('receiverName', receiver.name);
    if (receiver?.mobile) {
      const digits = receiver.mobile.replace(/\D/g, '').slice(0, 10);
      setValue('receiverMobile', digits);
      if (digits === storedPhone) setUseReceiverCurrentMobile(true);
    }
  }, [setValue]);

  useEffect(() => {
    if (pathname !== ROUTES.PICKUP_LOCATION) return;
    const savedPickup = getPickupLocation();
    const savedDrop = getDropLocation();
    if (savedLocationHasAddress(savedPickup)) setPickup(savedPickup);
    else if (savedPickup) clearPickupLocation();
    if (savedLocationHasAddress(savedDrop)) setDrop(savedDrop);
    else if (savedDrop) clearDropLocation();

    const sender = getSenderDetails();
    if (sender?.name) setValue('senderName', sender.name);
    if (sender?.mobile) {
      const digits = sender.mobile.replace(/\D/g, '').slice(0, 10);
      setValue('senderMobile', digits);
      if (digits === getStoredPhone()) setUseCurrentMobile(true);
    }
    const receiver = getReceiverDetails();
    if (receiver?.name) setValue('receiverName', receiver.name);
    if (receiver?.mobile) {
      const digits = receiver.mobile.replace(/\D/g, '').slice(0, 10);
      setValue('receiverMobile', digits);
      if (digits === getStoredPhone()) setUseReceiverCurrentMobile(true);
    }
  }, [pathname, setValue]);

  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam === '2') setStep(2);
    else if (stepParam === '1') setStep(1);
  }, [searchParams]);

  const fromFood = searchParams.get('from') === 'food';
  const returnToStep2 = `${ROUTES.PICKUP_LOCATION}?step=2${fromFood ? '&from=food' : ''}`;

  useEffect(() => {
    if (useCurrentMobile) setValue('senderMobile', currentMobile);
  }, [useCurrentMobile, currentMobile, setValue]);

  useEffect(() => {
    if (useReceiverCurrentMobile) setValue('receiverMobile', currentMobile);
  }, [useReceiverCurrentMobile, currentMobile, setValue]);

  const onStep1Submit = () => {
    clearErrors();
    const result = senderDetailsSchema.safeParse({
      senderName: (senderName ?? '').trim(),
      senderMobile: (senderMobile ?? '').trim().replace(/\D/g, '').replace(/\s/g, ''),
    });
    if (!result.success) {
      const err = result.error.flatten().fieldErrors;
      if (err.senderName?.[0]) setError('senderName', { message: err.senderName[0] });
      if (err.senderMobile?.[0]) setError('senderMobile', { message: err.senderMobile[0] });
      return;
    }
    setSenderDetails({ name: result.data.senderName, mobile: result.data.senderMobile });
    setStep(2);
    router.replace(`${ROUTES.PICKUP_LOCATION}?step=2`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onStep2Submit = () => {
    clearErrors();
    const result = receiverDetailsSchema.safeParse({
      receiverName: (receiverName ?? '').trim(),
      receiverMobile: (receiverMobile ?? '').trim().replace(/\D/g, '').replace(/\s/g, ''),
    });
    if (!result.success) {
      const err = result.error.flatten().fieldErrors;
      if (err.receiverName?.[0]) setError('receiverName', { message: err.receiverName[0] });
      if (err.receiverMobile?.[0]) setError('receiverMobile', { message: err.receiverMobile[0] });
      return;
    }
    setReceiverDetails({ name: result.data.receiverName, mobile: result.data.receiverMobile });
    router.push(fromFood ? `${ROUTES.TRIP_OPTIONS}?from=food` : ROUTES.TRIP_OPTIONS);
  };

  const isStep1Valid =
    Boolean(pickup) &&
    validatePersonName((senderName ?? '').trim()).success &&
    (senderMobile ?? '').trim().replace(/\D/g, '').replace(/\s/g, '').length === 10;
  const isStep2Valid =
    Boolean(drop) &&
    validatePersonName((receiverName ?? '').trim()).success &&
    (receiverMobile ?? '').trim().replace(/\D/g, '').replace(/\s/g, '').length === 10;
  const isFormValid = step === 1 ? isStep1Valid : isStep2Valid;

  return (
    <div className="relative flex min-h-dvh flex-col bg-white">
      {/* Flex column + flex-1 card fills space to the CTA (like design); inner form scrolls if content is tall (e.g. SE). CTA stays outside this column. */}
      <div className="mx-auto flex min-h-0 w-full max-w-[520px] flex-1 flex-col overflow-x-hidden px-4 pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-[calc(6.75rem+env(safe-area-inset-bottom,0px))] sm:px-5 sm:pb-[calc(7rem+env(safe-area-inset-bottom,0px))] lg:pb-10">
        <header className="flex shrink-0 items-center gap-3 pb-4 pt-3 sm:pt-4 sm:pb-5">
          <button
            type="button"
            onClick={() => router.push(fromFood ? ROUTES.FIND_RESTAURANT : ROUTES.DASHBOARD)}
            aria-label={fromFood ? 'Back to Find Restaurant' : 'Back to dashboard'}
            className="h-9 w-9 rounded-full border border-gray-200 bg-white grid place-items-center"
          >
            <svg className="h-5 w-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 text-center">
            <div className="text-[20px] font-semibold text-gray-900">
              {fromFood && step === 2 ? 'Food delivery' : 'Add Default Details'}
            </div>
            <div className="mt-1 text-[12px] text-gray-500">
              {fromFood && step === 2
                ? 'Where to deliver your food?'
                : step === 1
                  ? 'Step 1 of 2 : Sender Details'
                  : 'Step 2 of 2 : Receiver Details'}
            </div>
          </div>
          <div className="w-9" />
        </header>

        <div className="mb-4 flex h-1.5 shrink-0 overflow-hidden rounded-full bg-gray-100 sm:mb-5">
          {fromFood && step === 2 ? (
            <div className="w-full bg-emerald-500" />
          ) : (
            <>
              <div className={`w-1/2 ${step >= 1 ? 'bg-emerald-500' : 'bg-emerald-100'}`} />
              <div className={`flex-1 ${step >= 2 ? 'bg-emerald-500' : 'bg-emerald-100'}`} />
            </>
          )}
        </div>

        <div
          className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[22px] border border-gray-200 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.08)] max-lg:min-h-0 lg:max-h-[min(640px,calc(100dvh-10rem))] lg:flex-none lg:self-stretch"
        >
          {step === 1 ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="bg-[#F5F7FF] px-4 py-3 sm:px-5 sm:py-4 flex shrink-0 items-center justify-between">
                <div>
                  <div className="text-[14px] font-semibold text-gray-800">Pick up Location</div>
                  {pickup ? (
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `${ROUTES.PICKUP_LOCATION_EDIT}?type=pickup&returnTo=${encodeURIComponent(`${ROUTES.PICKUP_LOCATION}?step=1`)}`
                        )
                      }
                      className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-left"
                    >
                      <div className="text-[14px] font-semibold text-gray-900">{pickup.name}</div>
                      <div className="mt-1 text-[12px] text-gray-500">{pickup.address}</div>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `${ROUTES.PICKUP_LOCATION_EDIT}?type=pickup&returnTo=${encodeURIComponent(`${ROUTES.PICKUP_LOCATION}?step=1`)}`
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-dashed border-gray-400 bg-white px-3 py-2 text-left text-[14px] text-gray-500"
                    >
                      Select pickup location
                    </button>
                  )}
                </div>
                <div className="h-9 w-9" />
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 pt-4 pb-2 sm:px-5 sm:pt-5">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-[12px] font-medium text-gray-600">Sender name</label>
                      <input
                        type="text"
                        placeholder="Sender name (min. 3 letters)"
                        {...register('senderName', {
                          onBlur: (e) => setValue('senderName', e.target.value.trim()),
                        })}
                        className={`w-full h-14 rounded-xl border bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] ${
                          errors.senderName ? 'border-red-400' : 'border-gray-300'
                        }`}
                      />
                      {errors.senderName && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.senderName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-[12px] font-medium text-gray-600">Sender Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="Sender Mobile Number"
                        {...register('senderMobile', {
                          onChange: (e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setValue('senderMobile', digits);
                            if (digits !== currentMobile) setUseCurrentMobile(false);
                          },
                        })}
                        className={`w-full h-14 rounded-xl border bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] ${
                          errors.senderMobile || (senderMobile && senderMobile.replace(/\D/g, '').length !== 10)
                            ? 'border-red-400'
                            : 'border-gray-300'
                        }`}
                      />
                      {(errors.senderMobile || (senderMobile && senderMobile.replace(/\D/g, '').length !== 10)) && (
                        <p className="mt-1 text-[11px] text-red-500">
                          {errors.senderMobile?.message ?? 'Enter a valid 10-digit mobile number.'}
                        </p>
                      )}
                    </div>

                    <label className="mt-1 flex items-center gap-2 text-[12px] text-gray-600">
                      <input
                        type="checkbox"
                        checked={useCurrentMobile}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setUseCurrentMobile(checked);
                          if (!checked) setValue('senderMobile', '');
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)]"
                      />
                      <span>
                        Use My current Mobile number : <span className="font-semibold text-gray-800">{currentMobile}</span>
                      </span>
                    </label>
                  </div>

                  <div className="min-h-6 flex-1" aria-hidden />

                  <div className="flex shrink-0 justify-center gap-1.5 pb-4 pt-6" aria-hidden>
                    <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                    <span className="h-2 w-2 rounded-full bg-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              {fromFood && pickup && (
                <div className="px-4 pt-2 pb-1 text-[12px] text-gray-500">
                  Pickup: <strong className="text-gray-700">{pickup.name}</strong> — Enter where to deliver your food.
                </div>
              )}
              <div className="bg-[#F5F7FF] px-4 py-3 sm:px-5 sm:py-4 flex shrink-0 items-center justify-between">
                <div>
                  <div className="text-[14px] font-semibold text-gray-800">{fromFood ? 'Your delivery address' : 'Drop Location'}</div>
                  {drop ? (
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `${ROUTES.PICKUP_LOCATION_EDIT}?type=drop&returnTo=${encodeURIComponent(returnToStep2)}`
                        )
                      }
                      className="mt-2 w-full rounded-xl bg-white px-3 py-2 text-left"
                    >
                      <div className="text-[14px] font-semibold text-gray-900">{drop.name}</div>
                      <div className="mt-1 text-[12px] text-gray-500">{drop.address}</div>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          `${ROUTES.PICKUP_LOCATION_EDIT}?type=drop&returnTo=${encodeURIComponent(returnToStep2)}`
                        )
                      }
                      className="mt-2 w-full rounded-xl border border-dashed border-gray-400 bg-white px-3 py-2 text-left text-[14px] text-gray-400"
                    >
                      {fromFood ? 'Enter your delivery address' : 'Enter drop location'}
                    </button>
                  )}
                </div>
                <div className="h-9 w-9" />
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 pt-4 pb-2 sm:px-5 sm:pt-5">
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-[12px] font-medium text-gray-600">{fromFood ? 'Your name' : "Receiver's name"}</label>
                      <input
                        type="text"
                        placeholder={fromFood ? 'Your name (min. 3 letters)' : "Receiver's name (min. 3 letters)"}
                        {...register('receiverName', {
                          onBlur: (e) => setValue('receiverName', e.target.value.trim()),
                        })}
                        className={`w-full h-14 rounded-xl border bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] ${
                          errors.receiverName ? 'border-red-400' : 'border-gray-300'
                        }`}
                      />
                      {errors.receiverName && (
                        <p className="mt-1 text-[11px] text-red-500">{errors.receiverName.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-[12px] font-medium text-gray-600">{fromFood ? 'Your mobile number' : 'Receiver Mobile Number'}</label>
                      <input
                        type="tel"
                        placeholder={fromFood ? 'Your mobile number' : 'Receiver Mobile Number'}
                        {...register('receiverMobile', {
                          onChange: (e) => {
                            const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setValue('receiverMobile', digits);
                            if (digits !== currentMobile) setUseReceiverCurrentMobile(false);
                          },
                        })}
                        className={`w-full h-14 rounded-xl border bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] ${
                          errors.receiverMobile || (receiverMobile && receiverMobile.replace(/\D/g, '').length !== 10)
                            ? 'border-red-400'
                            : 'border-gray-300'
                        }`}
                      />
                      {(errors.receiverMobile || (receiverMobile && receiverMobile.replace(/\D/g, '').length !== 10)) && (
                        <p className="mt-1 text-[11px] text-red-500">
                          {errors.receiverMobile?.message ?? 'Enter a valid 10-digit mobile number.'}
                        </p>
                      )}
                    </div>

                    <label className="mt-1 flex items-center gap-2 text-[12px] text-gray-600">
                      <input
                        type="checkbox"
                        checked={useReceiverCurrentMobile}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setUseReceiverCurrentMobile(checked);
                          if (!checked) setValue('receiverMobile', '');
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)]"
                      />
                      <span>
                        Use My current Mobile number : <span className="font-semibold text-gray-800">{currentMobile}</span>
                      </span>
                    </label>
                  </div>

                  <div className="min-h-6 flex-1" aria-hidden />

                  <div className="flex shrink-0 justify-center gap-1.5 pb-4 pt-6" aria-hidden>
                    <span className="h-2 w-2 rounded-full bg-gray-300" />
                    <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-100 bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto w-full max-w-[520px] px-4 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] pt-3 sm:px-5">
          <button
            type="button"
            disabled={!isFormValid}
            onClick={step === 1 ? onStep1Submit : onStep2Submit}
            className="w-full rounded-2xl bg-[var(--color-primary)] py-3.5 text-[16px] font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 1 ? 'Confirm pick location' : fromFood ? 'Continue to book delivery' : 'Confirm drop location'}
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
