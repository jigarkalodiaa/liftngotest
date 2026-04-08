'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import type { FocusEvent } from 'react';
import { useForm } from 'react-hook-form';
import type { SavedLocation } from '@/types/booking';
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
  setDropLocation,
  setSenderDetails,
  setReceiverDetails,
  addCustomDefaultTrip,
} from '@/lib/storage';
import { ROUTES, PICKUP_LOCATION_MODE_DEFAULTS, TRIP_OPTIONS_FROM_KHATU_TRAVEL } from '@/lib/constants';
import { senderDetailsSchema, receiverDetailsSchema, validatePersonName } from '@/lib/validations';
import { trackPickupLocationEntered, trackDropLocationEntered } from '@/lib/analytics';
import { trackEvent } from '@/lib/posthogAnalytics';
import { inferCityFromLocationText } from '@/lib/posthog/locationMeta';
import { geocodeAddress } from '@/utils/geocode';

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
  const fromFood = searchParams.get('from') === 'food';
  const fromKhatuTravel = searchParams.get('from') === TRIP_OPTIONS_FROM_KHATU_TRAVEL;
  const addDefaults = searchParams.get('mode') === PICKUP_LOCATION_MODE_DEFAULTS;
  const editedDefaultsType = searchParams.get('edited');

  const wizardBookingStartedRef = useRef(false);
  const onWizardPickupFieldFocus = useCallback((e: FocusEvent<HTMLElement>) => {
    if (!e.nativeEvent.isTrusted || wizardBookingStartedRef.current) return;
    wizardBookingStartedRef.current = true;
    trackEvent('booking_started', { source: 'landing' });
  }, []);

  /** Add-defaults flow: first paint clears pickup/drop; skip one pathname hydrate so storage does not immediately refill. After /edit, hydrate runs normally. */
  const skipNextPickupDropHydrateRef = useRef(false);
  const buildPickupLocationReturnTo = (s: 1 | 2) => {
    const p = new URLSearchParams();
    p.set('step', String(s));
    if (fromFood) p.set('from', 'food');
    else if (fromKhatuTravel) p.set('from', TRIP_OPTIONS_FROM_KHATU_TRAVEL);
    if (addDefaults) p.set('mode', PICKUP_LOCATION_MODE_DEFAULTS);
    return `${ROUTES.PICKUP_LOCATION}?${p.toString()}`;
  };

  const tripOptionsAfterPickupHref = fromFood
    ? `${ROUTES.TRIP_OPTIONS}?from=food`
    : fromKhatuTravel
      ? `${ROUTES.TRIP_OPTIONS}?from=${TRIP_OPTIONS_FROM_KHATU_TRAVEL}`
      : ROUTES.TRIP_OPTIONS;

  const returnToStep2 = buildPickupLocationReturnTo(2);

  const deliveryHighlightRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<1 | 2>(() =>
    searchParams.get('step') === '2' ? 2 : 1
  );
  const [pickup, setPickup] = useState<SavedLocation | null>(null);
  const [drop, setDrop] = useState<SavedLocation | null>(null);
  const [useCurrentMobile, setUseCurrentMobile] = useState(false);
  const [useReceiverCurrentMobile, setUseReceiverCurrentMobile] = useState(false);
  const [currentMobile, setCurrentMobile] = useState('');
  /** Quick-entry pickup (step 1, non–restaurant flows) */
  const [addrDraft, setAddrDraft] = useState('');
  const [landmarkDraft, setLandmarkDraft] = useState('');
  const [pickupAddressError, setPickupAddressError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pickupAddressRef = useRef<HTMLTextAreaElement>(null);
  /** Quick-entry drop (step 2) — mirrors pickup step UX */
  const [dropAddrDraft, setDropAddrDraft] = useState('');
  const [dropLandmarkDraft, setDropLandmarkDraft] = useState('');
  const [dropAddressError, setDropAddressError] = useState('');
  const dropAddressRef = useRef<HTMLTextAreaElement>(null);

  const buildEditLocationUrl = (kind: 'pickup' | 'drop') => {
    const params = new URLSearchParams();
    params.set('type', kind);
    const returnParams = new URLSearchParams();
    returnParams.set('step', kind === 'pickup' ? '1' : '2');
    if (fromFood) returnParams.set('from', 'food');
    else if (fromKhatuTravel) returnParams.set('from', TRIP_OPTIONS_FROM_KHATU_TRAVEL);
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

  /** Keep address draft in sync when pickup is set from map / saved list */
  useEffect(() => {
    if (fromFood || step !== 1) return;
    if (savedLocationHasAddress(pickup)) {
      setAddrDraft(pickup.address);
      setPickupAddressError('');
    } else if (!pickup) {
      setAddrDraft('');
      setLandmarkDraft('');
    }
  }, [fromFood, step, pickup]);

  /** Autofocus first field for fast completion */
  useEffect(() => {
    if (step !== 1) return;
    const id = window.setTimeout(() => {
      if (fromFood) document.getElementById('pickup-contact-name')?.focus();
      else pickupAddressRef.current?.focus();
    }, 80);
    return () => clearTimeout(id);
  }, [step, fromFood]);

  /** Keep drop address draft in sync when drop is set from /edit */
  useEffect(() => {
    if (step !== 2) return;
    if (savedLocationHasAddress(drop)) {
      setDropAddrDraft(drop.address);
      setDropAddressError('');
    } else if (!drop) {
      setDropAddrDraft('');
      setDropLandmarkDraft('');
    }
  }, [step, drop]);

  useEffect(() => {
    if (step !== 2) return;
    const id = window.setTimeout(() => dropAddressRef.current?.focus(), 80);
    return () => clearTimeout(id);
  }, [step]);

  const needsFoodDeliveryAddress = fromFood && step === 2 && dropAddrDraft.trim().length < 5;

  useEffect(() => {
    if (!needsFoodDeliveryAddress) return;
    const id = window.setTimeout(() => {
      deliveryHighlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      dropAddressRef.current?.focus({ preventScroll: true });
    }, 150);
    return () => window.clearTimeout(id);
  }, [needsFoodDeliveryAddress]);

  const onStep1Submit = async () => {
    clearErrors();
    setPickupAddressError('');
    setIsSubmitting(true);
    try {
      if (!fromFood) {
        const addr = addrDraft.trim();
        if (addr.length < 5) {
          setPickupAddressError('Please enter a pickup address (at least 5 characters).');
          return;
        }
        const name = addr.split(/[,\n]/)[0]?.trim().slice(0, 80) || 'Pickup location';
        const full = landmarkDraft.trim() ? `${addr} · Near ${landmarkDraft.trim()}` : addr;
        const coords = await geocodeAddress(full);
        const loc: SavedLocation = { name, address: full, contact: '', ...coords };
        setPickup(loc);
        setPickupLocation(loc);
      } else if (!savedLocationHasAddress(pickup)) {
        setPickupAddressError('Restaurant pickup is required. Go back and choose Book delivery from the menu.');
        return;
      }

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
      const flow = fromFood ? 'food_flow' : fromKhatuTravel ? 'khatu_flow' : 'standard';
      const pickupLocationSummary = fromFood
        ? (pickup?.address?.trim() ?? '')
        : landmarkDraft.trim()
          ? `${addrDraft.trim()} · Near ${landmarkDraft.trim()}`
          : addrDraft.trim();
      trackEvent('enter_pickup', {
        location: pickupLocationSummary,
        city: inferCityFromLocationText(pickupLocationSummary),
        flow,
        source: 'pickup_wizard',
      });
      trackPickupLocationEntered(flow);
      setStep(2);
      router.replace(buildPickupLocationReturnTo(2));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onStep2Submit = async () => {
    clearErrors();
    setDropAddressError('');
    setIsSubmitting(true);
    try {
      const addr = dropAddrDraft.trim();
      if (addr.length < 5) {
        setDropAddressError('Please enter a drop address (at least 5 characters).');
        return;
      }
      const dropName = addr.split(/[,\n]/)[0]?.trim().slice(0, 80) || 'Drop location';
      const dropFull = dropLandmarkDraft.trim() ? `${addr} · Near ${dropLandmarkDraft.trim()}` : addr;
      const coords = await geocodeAddress(dropFull);
      const dropLoc: SavedLocation = { name: dropName, address: dropFull, contact: '', ...coords };
      setDrop(dropLoc);
      setDropLocation(dropLoc);

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
      const flow = fromFood ? 'food_flow' : fromKhatuTravel ? 'khatu_flow' : 'standard';
      const dropLocationSummary = dropLandmarkDraft.trim()
        ? `${addr.trim()} · Near ${dropLandmarkDraft.trim()}`
        : addr.trim();
      trackEvent('enter_drop', {
        location: dropLocationSummary,
        city: inferCityFromLocationText(dropLocationSummary),
        flow,
        source: 'pickup_wizard',
      });
      trackDropLocationEntered(flow);
      if (addDefaults) {
        const savedPickup = getPickupLocation();
        const effectivePickup = savedLocationHasAddress(pickup) ? pickup : savedPickup;
        const effectiveDrop = dropLoc;
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
      router.push(tripOptionsAfterPickupHref);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pickupAddressOk =
    fromFood ? Boolean(pickup && savedLocationHasAddress(pickup)) : addrDraft.trim().length >= 5;
  const isStep1Valid =
    pickupAddressOk &&
    validatePersonName((senderName ?? '').trim()).success &&
    (senderMobile ?? '').trim().replace(/\D/g, '').replace(/\s/g, '').length === 10;
  const isStep2Valid =
    dropAddrDraft.trim().length >= 5 &&
    validatePersonName((receiverName ?? '').trim()).success &&
    (receiverMobile ?? '').trim().replace(/\D/g, '').replace(/\s/g, '').length === 10;
  const isFormValid = step === 1 ? isStep1Valid : isStep2Valid;

  return (
    <div className="relative flex min-h-dvh flex-col bg-gradient-to-b from-[var(--color-primary)]/[0.06] via-white to-white">
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
              if (fromKhatuTravel) {
                if (step === 2) {
                  router.push(buildPickupLocationReturnTo(1));
                  return;
                }
                router.push(tripOptionsAfterPickupHref);
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
                : fromKhatuTravel
                  ? step === 2
                    ? 'Back to pickup step'
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
          <div className="flex-1 text-center px-1">
            <div className="text-[18px] font-semibold leading-snug text-gray-900 sm:text-[20px]">
              {fromFood && step === 2
                ? 'Food delivery'
                : addDefaults
                  ? 'Save a default trip'
                  : step === 1 && !fromFood
                    ? 'Pickup location'
                    : step === 1
                      ? 'Pickup details'
                      : 'Drop location'}
            </div>
            <div className="mt-1 text-[12px] leading-snug text-gray-500">
              {fromFood && step === 2
                ? 'Where should we deliver?'
                : addDefaults
                  ? step === 1
                    ? 'Step 1 of 2 — pickup point and contact there'
                    : 'Step 2 of 2 — usual drop-off and receiver'
                  : step === 1 && !fromFood
                    ? 'Where should we pick up?'
                    : step === 1
                      ? 'Sender details for this order'
                      : 'Where should we deliver?'}
            </div>
          </div>
          <div className="w-9" />
        </header>

        {addDefaults ? (
          <div className="mb-4 shrink-0 sm:mb-5">
            <div className="flex h-2 gap-1.5">
              <div
                className={`h-full flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-primary)]/20'}`}
              />
              <div
                className={`h-full flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-primary)]/20'}`}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] font-semibold">
              <span className={step === 1 ? 'text-gray-900' : 'text-[var(--color-primary)]'}>1 · Pickup</span>
              <span className={step === 2 ? 'text-gray-900' : 'text-gray-400'}>2 · Drop-off</span>
            </div>
          </div>
        ) : (
          <div className="mb-4 flex h-1.5 shrink-0 overflow-hidden rounded-full bg-[var(--color-primary)]/15 sm:mb-5">
            {fromFood && step === 2 ? (
              <div className="w-full bg-[var(--color-primary)]" />
            ) : (
              <>
                <div
                  className={`w-1/2 transition-colors ${step >= 1 ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-primary)]/25'}`}
                />
                <div
                  className={`flex-1 transition-colors ${step >= 2 ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-primary)]/25'}`}
                />
              </>
            )}
          </div>
        )}

        {addDefaults ? (
          <div className="mb-4 shrink-0 rounded-xl border border-blue-100 bg-blue-50/95 px-3 py-2.5 text-left text-[11px] leading-relaxed text-blue-950 sm:text-xs">
            <span className="font-semibold text-blue-900">Saved route for your dashboard.</span> After both steps, this pickup →
            drop pair appears in &quot;Choose trip&quot; for quick booking. Map search is optional if you already have the full
            address.
          </div>
        ) : null}

        <div
          className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/60 shadow-[0_8px_40px_rgba(15,23,42,0.1)] backdrop-blur-md max-lg:min-h-0 lg:max-h-[min(640px,calc(100dvh-10rem))] lg:flex-none lg:self-stretch"
        >
          {step === 1 ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 pt-4 pb-2 sm:px-5 sm:pt-5">
                  {!fromFood ? (
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                        <div className="min-w-0">
                          <h2 className="text-[15px] font-bold text-gray-900">
                            {addDefaults ? 'Usual pickup point' : 'Pickup address'}
                          </h2>
                          <p className="mt-1 text-[11px] leading-snug text-gray-500 sm:text-xs">
                            {addDefaults
                              ? 'Either type the address or use map search to pick the place. One method is enough — you don’t have to do both.'
                              : 'Enter the address below, or refine the pin with map search.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => router.push(buildEditLocationUrl('pickup'))}
                          className="flex h-11 shrink-0 items-center justify-center gap-2 self-stretch rounded-xl border border-[var(--color-primary)]/35 bg-white px-4 text-[13px] font-semibold text-[var(--color-primary)] shadow-sm transition hover:bg-[var(--color-primary)]/[0.06] active:scale-[0.99] sm:self-auto"
                        >
                          <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Map / search
                        </button>
                      </div>

                      <div className="mt-4">
                        <label htmlFor="pickup-address-main" className="mb-1.5 block text-[12px] font-medium text-gray-700">
                          Address <span className="font-normal text-red-500">*</span>
                        </label>
                        <textarea
                          ref={pickupAddressRef}
                          id="pickup-address-main"
                          autoComplete="street-address"
                          placeholder={
                            addDefaults
                              ? 'House / shop no., street, area, city (same as you’d share on WhatsApp)'
                              : 'Street, area, landmark, city…'
                          }
                          value={addrDraft}
                          onFocus={onWizardPickupFieldFocus}
                          onChange={(e) => {
                            setAddrDraft(e.target.value);
                            setPickupAddressError('');
                          }}
                          rows={4}
                          className={`min-h-[108px] w-full resize-y rounded-xl border bg-white px-3 py-3 text-[15px] leading-relaxed text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 sm:text-[14px] ${
                            pickupAddressError ? 'border-red-400' : 'border-gray-200'
                          }`}
                        />
                        {pickupAddressError ? (
                          <p className="mt-1.5 text-[11px] text-red-500">{pickupAddressError}</p>
                        ) : (
                          <p className="mt-1.5 text-[11px] text-gray-400">Minimum 5 characters.</p>
                        )}
                      </div>

                      <div className="mt-3">
                        <label htmlFor="pickup-landmark" className="mb-1.5 block text-[12px] font-medium text-gray-600">
                          Landmark <span className="font-normal text-gray-400">(optional)</span>
                        </label>
                        <input
                          id="pickup-landmark"
                          type="text"
                          autoComplete="off"
                          placeholder="e.g. Opposite metro gate 2"
                          value={landmarkDraft}
                          onChange={(e) => setLandmarkDraft(e.target.value)}
                          className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                        />
                      </div>
                    </div>
                  ) : pickup ? (
                    <div className="rounded-2xl border border-white/80 bg-white/50 p-4 shadow-[0_4px_24px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-5">
                      <div className="text-[12px] font-semibold uppercase tracking-wide text-gray-500">Restaurant pickup</div>
                      <div className="mt-2 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 text-left">
                        <div className="text-[14px] font-semibold text-gray-900">{pickup.name}</div>
                        <div className="mt-1 text-[12px] text-gray-500">{pickup.address}</div>
                        <p className="mt-2 text-[11px] text-gray-400">Not editable — from your food order</p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white/40 p-4 text-[13px] text-gray-600 backdrop-blur-sm">
                      Restaurant pickup is missing. Go back and use{' '}
                      <strong className="text-gray-800">Book delivery</strong> from the restaurant menu.
                      {pickupAddressError ? (
                        <p className="mt-2 text-[11px] text-red-500">{pickupAddressError}</p>
                      ) : null}
                    </div>
                  )}

                  <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                    <h3 className="text-[13px] font-bold text-gray-900">
                      {addDefaults ? 'Who meets us at pickup?' : 'Sender / pickup contact'}
                    </h3>
                    <p className="mb-3 mt-1 text-[11px] leading-snug text-gray-500">
                      {addDefaults
                        ? 'We use this if the driver needs to call about this pickup point.'
                        : 'Details for the person at the pickup location.'}
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="pickup-contact-name" className="mb-1 block text-[12px] font-medium text-gray-600">
                          Name
                        </label>
                        <input
                          id="pickup-contact-name"
                          type="text"
                          placeholder="Full name (min. 3 letters)"
                          {...register('senderName', {
                            onBlur: (e) => setValue('senderName', e.target.value.trim()),
                          })}
                          onFocus={onWizardPickupFieldFocus}
                          className={`w-full min-h-[48px] rounded-xl border bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 ${
                            errors.senderName ? 'border-red-400' : 'border-gray-200'
                          }`}
                        />
                        {errors.senderName && (
                          <p className="mt-1 text-[11px] text-red-500">{errors.senderName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-[12px] font-medium text-gray-600">Mobile</label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          placeholder="10-digit mobile number"
                          {...register('senderMobile', {
                            onChange: (e) => {
                              const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setValue('senderMobile', digits);
                              if (digits !== currentMobile) setUseCurrentMobile(false);
                            },
                          })}
                          className={`w-full min-h-[48px] rounded-xl border bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 ${
                            errors.senderMobile || (senderMobile && senderMobile.replace(/\D/g, '').length !== 10)
                              ? 'border-red-400'
                              : 'border-gray-200'
                          }`}
                        />
                        {(errors.senderMobile || (senderMobile && senderMobile.replace(/\D/g, '').length !== 10)) && (
                          <p className="mt-1 text-[11px] text-red-500">
                            {errors.senderMobile?.message ?? 'Enter a valid 10-digit mobile number.'}
                          </p>
                        )}
                      </div>

                      <label className="flex min-h-[44px] cursor-pointer items-center gap-2.5 text-[12px] text-gray-600">
                        <input
                          type="checkbox"
                          checked={useCurrentMobile}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setUseCurrentMobile(checked);
                            if (!checked) setValue('senderMobile', '');
                          }}
                          className="h-4 w-4 shrink-0 rounded border-gray-300 text-[var(--color-primary)]"
                        />
                        <span>
                          Use my account number:{' '}
                          <span className="font-semibold text-gray-800">{currentMobile || '—'}</span>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="min-h-6 flex-1" aria-hidden />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-4 pt-4 pb-2 sm:px-5 sm:pt-5">
                  <div
                    ref={deliveryHighlightRef}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
                    aria-describedby={needsFoodDeliveryAddress ? 'food-delivery-address-hint' : undefined}
                  >
                    {fromFood && pickup ? (
                      <p className="mb-3 text-[12px] leading-relaxed text-gray-600">
                        Pickup: <strong className="text-gray-800">{pickup.name}</strong> — add where to deliver below.
                      </p>
                    ) : null}
                    {addDefaults ? (
                      <p className="mb-3 rounded-lg bg-gray-50 px-3 py-2 text-[11px] leading-relaxed text-gray-600">
                        Almost done — this is the <strong className="text-gray-800">usual drop-off</strong> for the route you
                        started in step 1.
                      </p>
                    ) : null}
                    {needsFoodDeliveryAddress ? (
                      <p id="food-delivery-address-hint" className="mb-3 text-[12px] text-gray-500 leading-relaxed">
                        Type your full delivery address or open search to pick on map.
                      </p>
                    ) : null}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <h2 className="text-[15px] font-bold text-gray-900">
                          {fromFood ? 'Delivery address' : addDefaults ? 'Usual drop-off point' : 'Drop-off address'}
                        </h2>
                        <p className="mt-1 text-[11px] leading-snug text-gray-500 sm:text-xs">
                          {addDefaults
                            ? 'Same rule as pickup: type the address or use map search — one method is enough.'
                            : fromFood
                              ? 'Where the order should arrive.'
                              : 'Enter below or refine with map search.'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => router.push(buildEditLocationUrl('drop'))}
                        className="flex h-11 shrink-0 items-center justify-center gap-2 self-stretch rounded-xl border border-[var(--color-primary)]/35 bg-white px-4 text-[13px] font-semibold text-[var(--color-primary)] shadow-sm transition hover:bg-[var(--color-primary)]/[0.06] active:scale-[0.99] sm:self-auto"
                      >
                        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Map / search
                      </button>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="drop-address-main" className="mb-1.5 block text-[12px] font-medium text-gray-700">
                        Address <span className="font-normal text-red-500">*</span>
                      </label>
                      <textarea
                        ref={dropAddressRef}
                        id="drop-address-main"
                        autoComplete="street-address"
                        placeholder={
                          addDefaults
                            ? 'Full drop-off address (building, street, area, city…)'
                            : fromFood
                              ? 'Full delivery address'
                              : 'Street, area, landmark, city…'
                        }
                        value={dropAddrDraft}
                        onChange={(e) => {
                          setDropAddrDraft(e.target.value);
                          setDropAddressError('');
                        }}
                        rows={4}
                        className={`min-h-[108px] w-full resize-y rounded-xl border bg-white px-3 py-3 text-[15px] leading-relaxed text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 sm:text-[14px] ${
                          dropAddressError ? 'border-red-400' : 'border-gray-200'
                        }`}
                      />
                      {dropAddressError ? (
                        <p className="mt-1.5 text-[11px] text-red-500">{dropAddressError}</p>
                      ) : (
                        <p className="mt-1.5 text-[11px] text-gray-400">Minimum 5 characters.</p>
                      )}
                    </div>

                    <div className="mt-3">
                      <label htmlFor="drop-landmark" className="mb-1.5 block text-[12px] font-medium text-gray-600">
                        Landmark <span className="font-normal text-gray-400">(optional)</span>
                      </label>
                      <input
                        id="drop-landmark"
                        type="text"
                        autoComplete="off"
                        placeholder="e.g. Building lobby, gate code"
                        value={dropLandmarkDraft}
                        onChange={(e) => setDropLandmarkDraft(e.target.value)}
                        className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15"
                      />
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                    <h3 className="text-[13px] font-bold text-gray-900">
                      {addDefaults ? 'Who receives at drop-off?' : fromFood ? 'Delivery contact' : 'Receiver / drop contact'}
                    </h3>
                    <p className="mb-3 mt-1 text-[11px] leading-snug text-gray-500">
                      {addDefaults
                        ? 'Shown on your saved trip; we may call if the driver needs help finding the door.'
                        : 'Person we can reach at the delivery point.'}
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="receiver-contact-name" className="mb-1 block text-[12px] font-medium text-gray-600">
                          Name
                        </label>
                        <input
                          id="receiver-contact-name"
                          type="text"
                          placeholder={
                            addDefaults
                              ? 'Receiver name (min. 3 letters)'
                              : fromFood
                                ? 'Your name (min. 3 letters)'
                                : "Receiver's name (min. 3 letters)"
                          }
                          {...register('receiverName', {
                            onBlur: (e) => setValue('receiverName', e.target.value.trim()),
                          })}
                          className={`w-full min-h-[48px] rounded-xl border bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 ${
                            errors.receiverName ? 'border-red-400' : 'border-gray-200'
                          }`}
                        />
                        {errors.receiverName && (
                          <p className="mt-1 text-[11px] text-red-500">{errors.receiverName.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-[12px] font-medium text-gray-600">Mobile</label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          placeholder="10-digit mobile number"
                          {...register('receiverMobile', {
                            onChange: (e) => {
                              const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setValue('receiverMobile', digits);
                              if (digits !== currentMobile) setUseReceiverCurrentMobile(false);
                            },
                          })}
                          className={`w-full min-h-[48px] rounded-xl border bg-white px-3 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/15 ${
                            errors.receiverMobile || (receiverMobile && receiverMobile.replace(/\D/g, '').length !== 10)
                              ? 'border-red-400'
                              : 'border-gray-200'
                          }`}
                        />
                        {(errors.receiverMobile || (receiverMobile && receiverMobile.replace(/\D/g, '').length !== 10)) && (
                          <p className="mt-1 text-[11px] text-red-500">
                            {errors.receiverMobile?.message ?? 'Enter a valid 10-digit mobile number.'}
                          </p>
                        )}
                      </div>

                      <label className="flex min-h-[44px] cursor-pointer items-center gap-2.5 text-[12px] text-gray-600">
                        <input
                          type="checkbox"
                          checked={useReceiverCurrentMobile}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setUseReceiverCurrentMobile(checked);
                            if (!checked) setValue('receiverMobile', '');
                          }}
                          className="h-4 w-4 shrink-0 rounded border-gray-300 text-[var(--color-primary)]"
                        />
                        <span>
                          Use my account number:{' '}
                          <span className="font-semibold text-gray-800">{currentMobile || '—'}</span>
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="min-h-6 flex-1" aria-hidden />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/60 bg-white/85 shadow-[0_-8px_32px_rgba(15,23,42,0.08)] backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto w-full max-w-[520px] px-4 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] pt-3 sm:px-5">
          <button
            type="button"
            disabled={!isFormValid || isSubmitting}
            onClick={step === 1 ? onStep1Submit : onStep2Submit}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-[16px] font-semibold text-white shadow-[0_4px_16px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span
                  className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white"
                  aria-hidden
                />
                <span>Please wait…</span>
              </>
            ) : (
              <>
                {step === 1
                  ? addDefaults
                    ? 'Continue to drop-off'
                    : 'Confirm pickup'
                  : addDefaults
                    ? 'Save default trip'
                    : fromFood
                      ? 'Continue to book delivery'
                      : 'Confirm drop-off'}
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
