'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import type { SavedLocation, PersonDetails } from '@/types/booking';
import {
  clearDropLocation,
  clearPickupLocation,
  clearReceiverDetails,
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
  addCustomDefaultTrip,
} from '@/lib/storage';
import { ROUTES, PICKUP_LOCATION_MODE_DEFAULTS } from '@/lib/constants';
import { senderDetailsSchema, receiverDetailsSchema, validatePersonName } from '@/lib/validations';

type PersonalForm = {
  senderName: string;
  senderMobile: string;
  receiverName: string;
  receiverMobile: string;
};

const IconPencil = ({ className = 'h-4 w-4' }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

export default function EditPickupContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromFood = searchParams.get('from') === 'food';
  const addDefaults = searchParams.get('mode') === PICKUP_LOCATION_MODE_DEFAULTS;
  const editedDefaultsType = searchParams.get('edited');

  /** Add-defaults flow: first paint clears pickup/drop; skip one pathname hydrate so storage does not immediately refill. After /edit, hydrate runs normally. */
  const skipNextPickupDropHydrateRef = useRef(false);
  const buildPickupLocationReturnTo = (s: 1 | 2) => {
    const p = new URLSearchParams();
    p.set('step', String(s));
    if (fromFood) p.set('from', 'food');
    if (addDefaults) p.set('mode', PICKUP_LOCATION_MODE_DEFAULTS);
    return `${ROUTES.PICKUP_LOCATION}?${p.toString()}`;
  };

  const returnToStep2 = buildPickupLocationReturnTo(2);

  const deliveryHighlightRef = useRef<HTMLDivElement>(null);
  const deliveryAddressButtonRef = useRef<HTMLButtonElement>(null);

  const [step, setStep] = useState<1 | 2>(() =>
    searchParams.get('step') === '2' ? 2 : 1
  );
  const [pickup, setPickup] = useState<SavedLocation | null>(null);
  const [drop, setDrop] = useState<SavedLocation | null>(null);
  const [useCurrentMobile, setUseCurrentMobile] = useState(false);
  const [useReceiverCurrentMobile, setUseReceiverCurrentMobile] = useState(false);
  const [currentMobile, setCurrentMobile] = useState('');

  const buildEditLocationUrl = (kind: 'pickup' | 'drop') => {
    const params = new URLSearchParams();
    params.set('type', kind);
    const returnParams = new URLSearchParams();
    returnParams.set('step', kind === 'pickup' ? '1' : '2');
    if (fromFood) returnParams.set('from', 'food');
    if (addDefaults) {
      returnParams.set('mode', PICKUP_LOCATION_MODE_DEFAULTS);
      returnParams.set('edited', kind);
    }
    params.set('returnTo', `${ROUTES.PICKUP_LOCATION}?${returnParams.toString()}`);
    if (addDefaults && (kind === 'pickup' ? !pickup : !drop)) params.set('empty', '1');
    return `${ROUTES.PICKUP_LOCATION_EDIT}?${params.toString()}`;
  };

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

  /** Only when coming from Book delivery (fresh=1). Returning from /edit must not clear the drop just saved. */
  useEffect(() => {
    if (searchParams.get('from') !== 'food' || searchParams.get('step') !== '2') return;
    if (searchParams.get('fresh') !== '1') return;
    clearDropLocation();
    clearReceiverDetails();
    setDrop(null);
    setValue('receiverName', '');
    setValue('receiverMobile', '');
    setUseReceiverCurrentMobile(false);
    router.replace(`${ROUTES.PICKUP_LOCATION}?step=2&from=food`, { scroll: false });
  }, [searchParams, setValue, router]);

  useEffect(() => {
    const storedPhone = getStoredPhone();
    setCurrentMobile(storedPhone);

    if (addDefaults) {
      const savedPickup = getPickupLocation();
      const savedDrop = getDropLocation();
      if (editedDefaultsType) {
        setPickup(savedLocationHasAddress(savedPickup) ? savedPickup : null);
        setDrop(savedLocationHasAddress(savedDrop) ? savedDrop : null);
      } else {
        setPickup(null);
        setDrop(null);
      }
      skipNextPickupDropHydrateRef.current = true;
    } else {
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
    }

    if (addDefaults) {
      setValue('senderName', '');
      setValue('senderMobile', '');
      setValue('receiverName', '');
      setValue('receiverMobile', '');
      setUseCurrentMobile(false);
      setUseReceiverCurrentMobile(false);
    } else {
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
    }
  }, [setValue, addDefaults, editedDefaultsType]);

  useEffect(() => {
    if (pathname !== ROUTES.PICKUP_LOCATION) return;
    if (skipNextPickupDropHydrateRef.current) {
      skipNextPickupDropHydrateRef.current = false;
      return;
    }
    const savedPickup = getPickupLocation();
    const savedDrop = getDropLocation();
    if (addDefaults) {
      if (savedLocationHasAddress(savedPickup)) {
        setPickup(savedPickup);
      } else if (savedPickup) {
        clearPickupLocation();
      }
      if (savedLocationHasAddress(savedDrop)) {
        setDrop(savedDrop);
      } else if (savedDrop) {
        clearDropLocation();
      }
    } else {
      if (savedLocationHasAddress(savedPickup)) setPickup(savedPickup);
      else if (savedPickup) clearPickupLocation();
      if (savedLocationHasAddress(savedDrop)) setDrop(savedDrop);
      else if (savedDrop) clearDropLocation();
    }

    if (addDefaults) {
      setValue('senderName', '');
      setValue('senderMobile', '');
      setValue('receiverName', '');
      setValue('receiverMobile', '');
      setUseCurrentMobile(false);
      setUseReceiverCurrentMobile(false);
      return;
    }

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
  }, [pathname, setValue, addDefaults]);

  useEffect(() => {
    const stepParam = searchParams.get('step');
    if (stepParam === '2') setStep(2);
    else if (stepParam === '1') setStep(1);
  }, [searchParams]);

  useEffect(() => {
    if (useCurrentMobile) setValue('senderMobile', currentMobile);
  }, [useCurrentMobile, currentMobile, setValue]);

  useEffect(() => {
    if (useReceiverCurrentMobile) setValue('receiverMobile', currentMobile);
  }, [useReceiverCurrentMobile, currentMobile, setValue]);

  const needsFoodDeliveryAddress = fromFood && step === 2 && !savedLocationHasAddress(drop);

  useEffect(() => {
    if (!needsFoodDeliveryAddress) return;
    const id = window.setTimeout(() => {
      deliveryHighlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      deliveryAddressButtonRef.current?.focus({ preventScroll: true });
    }, 150);
    return () => window.clearTimeout(id);
  }, [needsFoodDeliveryAddress]);

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
    router.replace(buildPickupLocationReturnTo(2));
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
    if (addDefaults) {
      const savedPickup = getPickupLocation();
      const savedDrop = getDropLocation();
      const effectivePickup = savedLocationHasAddress(pickup) ? pickup : savedPickup;
      const effectiveDrop = savedLocationHasAddress(drop) ? drop : savedDrop;
      const fromName = effectivePickup?.name?.trim() || 'Pickup location';
      const fromAddress = effectivePickup?.address?.trim() || '';
      const toName = effectiveDrop?.name?.trim() || 'Drop location';
      const toAddress = effectiveDrop?.address?.trim() || '';
      const contactName = (senderName ?? '').trim() || (receiverName ?? '').trim();
      const contactPhone =
        (senderMobile ?? '').trim().replace(/\D/g, '').slice(0, 10) ||
        (receiverMobile ?? '').trim().replace(/\D/g, '').slice(0, 10);
      if (fromAddress && toAddress) {
        addCustomDefaultTrip({
          fromName,
          fromAddress,
          toName,
          toAddress,
          contactName,
          contactPhone,
        });
      }
      router.push(`${ROUTES.DASHBOARD}?defaultAdded=1`);
      return;
    }
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
            onClick={() => {
              if (fromFood) {
                if (step === 2) {
                  router.push(`${ROUTES.PICKUP_LOCATION}?step=2&from=food`);
                  return;
                }
                router.push(`${ROUTES.TRIP_OPTIONS}?from=food`);
                return;
              }
              if (addDefaults) {
                if (step === 2) {
                  router.push(buildPickupLocationReturnTo(1));
                  return;
                }
                router.push(ROUTES.DASHBOARD);
                return;
              }
              router.push(ROUTES.DASHBOARD);
            }}
            aria-label={
              fromFood
                ? step === 2
                  ? 'Back to delivery details'
                  : 'Back to trip options'
                : addDefaults
                  ? step === 2
                    ? 'Back to pickup step'
                    : 'Back to dashboard'
                  : 'Back to dashboard'
            }
            className="h-9 w-9 rounded-full border border-gray-200 bg-white grid place-items-center"
          >
            <svg className="h-5 w-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 text-center">
            <div className="text-[20px] font-semibold text-gray-900">
              {fromFood && step === 2
                ? 'Food delivery'
                : addDefaults
                  ? 'Add default location'
                  : 'Add Default Details'}
            </div>
            <div className="mt-1 text-[12px] text-gray-500">
              {fromFood && step === 2
                ? 'Where to deliver your food?'
                : addDefaults
                  ? step === 1
                    ? 'Step 1 of 2 · Pickup & sender'
                    : 'Step 2 of 2 · Drop & receiver'
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
          className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.08)] max-lg:min-h-0 lg:max-h-[min(640px,calc(100dvh-10rem))] lg:flex-none lg:self-stretch"
        >
          {step === 1 ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="bg-[#F5F7FF] px-4 py-3 sm:px-5 sm:py-4 flex shrink-0">
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-gray-800">Pick up Location</div>
                  {pickup ? (
                    fromFood ? (
                      <div className="mt-2 rounded-xl bg-white px-3 py-2.5 text-left border border-gray-100">
                        <div className="text-[14px] font-semibold text-gray-900">{pickup.name}</div>
                        <div className="mt-1 text-[12px] text-gray-500">{pickup.address}</div>
                        <p className="mt-2 text-[11px] text-gray-400">Restaurant pickup — not editable</p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        aria-label="Edit pickup location"
                        onClick={() => router.push(buildEditLocationUrl('pickup'))}
                        className="mt-2 flex w-full items-start gap-3 rounded-xl bg-white px-3 py-2.5 text-left"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-[14px] font-semibold text-gray-900">{pickup.name}</div>
                          <div className="mt-1 text-[12px] text-gray-500">{pickup.address}</div>
                        </div>
                        <span className="shrink-0 text-gray-400 pt-0.5" title="Edit">
                          <IconPencil />
                        </span>
                      </button>
                    )
                  ) : fromFood ? (
                    <div className="mt-2 rounded-xl border border-dashed border-gray-300 bg-white px-3 py-2.5 text-left text-[13px] text-gray-500">
                      Restaurant pickup is missing. Go back and use <strong className="text-gray-700">Book delivery</strong> from the restaurant menu.
                    </div>
                  ) : (
                    <button
                      type="button"
                      aria-label="Select or edit pickup location"
                      onClick={() => router.push(buildEditLocationUrl('pickup'))}
                      className="mt-2 flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-gray-400 bg-white px-3 py-2.5 text-left text-[14px] text-gray-500"
                    >
                      <span>Select pickup location</span>
                      <span className="shrink-0 text-gray-400" title="Edit">
                        <IconPencil />
                      </span>
                    </button>
                  )}
                </div>
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
              <div
                ref={deliveryHighlightRef}
                className="bg-[#F5F7FF] px-4 py-4 sm:px-5 sm:py-5 flex shrink-0"
                aria-describedby={needsFoodDeliveryAddress ? 'food-delivery-address-hint' : undefined}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[14px] font-semibold text-gray-900">
                    {fromFood ? 'Your delivery address' : 'Drop Location'}
                  </div>
                  {needsFoodDeliveryAddress && (
                    <p id="food-delivery-address-hint" className="mt-1 text-[12px] text-gray-500 leading-relaxed">
                      Tap below and add where you want your food delivered.
                    </p>
                  )}
                  {drop ? (
                    <button
                      type="button"
                      aria-label="Edit delivery address"
                      onClick={() => router.push(buildEditLocationUrl('drop'))}
                      className="mt-2 flex w-full items-start gap-3 rounded-xl bg-white px-3 py-2.5 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-semibold text-gray-900">{drop.name}</div>
                        <div className="mt-1 text-[12px] text-gray-500">{drop.address}</div>
                      </div>
                      <span className="shrink-0 text-gray-400 pt-0.5" title="Edit">
                        <IconPencil />
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      ref={deliveryAddressButtonRef}
                      aria-label={
                        fromFood ? 'Add or edit delivery address' : 'Select or edit drop location'
                      }
                      onClick={() => router.push(buildEditLocationUrl('drop'))}
                      className={`mt-2 flex w-full min-h-[52px] items-center justify-between gap-3 rounded-xl border border-dashed bg-white px-3 py-3 text-left text-[14px] outline-none transition-colors focus-visible:border-gray-400 focus-visible:ring-1 focus-visible:ring-gray-300 ${
                        needsFoodDeliveryAddress
                          ? 'border-gray-600 text-gray-800'
                          : 'border-gray-300 text-gray-500'
                      }`}
                    >
                      <span>{fromFood ? 'Enter your delivery address' : 'Enter drop location'}</span>
                      <span className="shrink-0 text-gray-400" title="Edit">
                        <IconPencil />
                      </span>
                    </button>
                  )}
                </div>
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
