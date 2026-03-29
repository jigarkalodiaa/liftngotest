'use client';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { SavedLocation, PersonDetails, BookingStopWaypoint } from '@/types/booking';
import {
  getPickupLocation,
  getDropLocation,
  getSenderDetails,
  getReceiverDetails,
  getSelectedService,
  getStopWaypoints,
  savedLocationHasAddress,
  setPickupLocation,
  setDropLocation,
  setSenderDetails,
  setReceiverDetails,
  setSelectedService,
  setStopWaypoints,
  clearDeliveryGoodsDescription,
} from '@/lib/storage';
import { ROUTES, TRIP_OPTIONS_FROM_KHATU_TRAVEL } from '@/lib/constants';
import { readKhatuRideBooking } from '@/lib/khatuSessionStorage';
import { getKhatuRouteDefaultLocations, KHATU_RIDE_VEHICLE_OPTIONS, khatuVehicleImage } from '@/data/khatuTravel';
import type { RideVehicleType, TravelRouteId } from '@/types/khatu';
import { theme } from '@/config/theme';

type KhatuQuoteVehicle = {
  type: RideVehicleType;
  label: string;
  estimateInr: number;
  comfortTag?: string;
};

type OptionId = 'walk' | 'two' | 'three' | 'four';

const SERVICE_TO_OPTION: Record<string, OptionId> = {
  walk: 'walk',
  twoWheeler: 'two',
  threeWheeler: 'three',
  fourWheeler: 'four',
};

const OPTION_TO_SERVICE: Record<OptionId, 'walk' | 'twoWheeler' | 'threeWheeler' | 'fourWheeler'> = {
  walk: 'walk',
  two: 'twoWheeler',
  three: 'threeWheeler',
  four: 'fourWheeler',
};

export default function TripOptionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fromFood = searchParams.get('from') === 'food';
  const fromKhatuTravel = searchParams.get('from') === TRIP_OPTIONS_FROM_KHATU_TRAVEL;
  /** Walk + 2W only (no 3W / 4W cargo) — same list as food delivery. */
  const passengerFleetsOnly = fromFood || fromKhatuTravel;
  const [pickup, setPickup] = useState<SavedLocation | null>(null);
  const [drop, setDrop] = useState<SavedLocation | null>(null);
  const [stops, setStops] = useState<BookingStopWaypoint[]>([]);
  const [sender, setSender] = useState<PersonDetails | null>(null);
  const [receiver, setReceiver] = useState<PersonDetails | null>(null);
  const [selected, setSelected] = useState<OptionId>('two');

  const khatuQuoteVehicle = useMemo((): KhatuQuoteVehicle | null => {
    if (!fromKhatuTravel || typeof window === 'undefined') return null;
    const booking = readKhatuRideBooking();
    if (!booking?.vehicle?.type) return null;
    const type = booking.vehicle.type as RideVehicleType;
    if (type !== 'two_wheeler' && type !== 'hatchback' && type !== 'sedan' && type !== 'suv') return null;
    const opt = KHATU_RIDE_VEHICLE_OPTIONS.find((v) => v.type === type);
    return {
      type,
      label: opt?.label ?? booking.vehicle.label,
      estimateInr: booking.estimateInr,
      comfortTag: opt?.comfortTag,
    };
  }, [fromKhatuTravel]);

  useEffect(() => {
    setPickup(getPickupLocation());
    setDrop(getDropLocation());
    setSender(getSenderDetails());
    setReceiver(getReceiverDetails());
    if (fromFood) {
      setStops([]);
      setStopWaypoints([]);
    } else {
      clearDeliveryGoodsDescription();
      setStops(getStopWaypoints());
    }
  }, [fromFood]);

  useEffect(() => {
    if (pathname !== ROUTES.TRIP_OPTIONS || fromFood) return;
    setStops(getStopWaypoints());
  }, [pathname, fromFood]);

  useEffect(() => {
    if (!fromKhatuTravel) return;
    const booking = readKhatuRideBooking();
    const routeId = booking?.route?.id as TravelRouteId | undefined;
    if (routeId !== 'khatu-salasar' && routeId !== 'khatu-ringus' && routeId !== 'ringus-khatu') return;
    const defaults = getKhatuRouteDefaultLocations(routeId);
    const pickupSaved = getPickupLocation();
    const dropSaved = getDropLocation();
    if (!savedLocationHasAddress(pickupSaved)) {
      setPickupLocation(defaults.pickup);
      setPickup(defaults.pickup);
    }
    if (!savedLocationHasAddress(dropSaved)) {
      setDropLocation(defaults.drop);
      setDrop(defaults.drop);
    }
  }, [fromKhatuTravel]);

  useEffect(() => {
    if (fromKhatuTravel && khatuQuoteVehicle) {
      if (khatuQuoteVehicle.type === 'two_wheeler') {
        setSelected('two');
        setSelectedService('twoWheeler');
      } else {
        setSelected('four');
        setSelectedService('fourWheeler');
      }
      return;
    }
    const saved = getSelectedService();
    if (passengerFleetsOnly) {
      if (saved === 'walk' || saved === 'twoWheeler') {
        const id = SERVICE_TO_OPTION[saved];
        setSelected(id);
        setSelectedService(OPTION_TO_SERVICE[id]);
      } else {
        setSelected('two');
        setSelectedService('twoWheeler');
      }
    } else if (saved) {
      setSelected(SERVICE_TO_OPTION[saved] ?? 'two');
    }
  }, [passengerFleetsOnly, fromKhatuTravel, khatuQuoteVehicle]);

  const khatuBikeMatch = Boolean(fromKhatuTravel && khatuQuoteVehicle?.type === 'two_wheeler');
  const showKhatuCarOption = Boolean(
    fromKhatuTravel && khatuQuoteVehicle && khatuQuoteVehicle.type !== 'two_wheeler',
  );
  /** Khatu corridor passenger quote: hide walking / courier options so only the booked vehicle class shows. */
  const hideKhatuWalkAndCourier = fromKhatuTravel && Boolean(khatuQuoteVehicle);

  const twoCardTitle = khatuBikeMatch && khatuQuoteVehicle ? khatuQuoteVehicle.label : 'Faster to your door';
  const twoCardSubtitle = khatuBikeMatch
    ? 'Two wheeler · matches your Khatu travel quote'
    : 'Two wheeler / 40kg';
  const twoCardPrice =
    khatuBikeMatch && khatuQuoteVehicle ? `₹${khatuQuoteVehicle.estimateInr}` : '₹160';
  const twoCardOldPrice =
    khatuBikeMatch && khatuQuoteVehicle
      ? `₹${Math.round(khatuQuoteVehicle.estimateInr * 1.1)}`
      : '₹195';
  const twoCardImage = khatuBikeMatch ? khatuVehicleImage('two_wheeler') : '/dashboard/service-2wheeler.png';
  const twoCardNote = fromFood
    ? 'Orders can be picked up within 1 km only.'
    : khatuBikeMatch
      ? 'Same vehicle as on Khatu travel.'
      : undefined;

  const handleSwapLocations = () => {
    if (!pickup || !drop) return;
    setPickupLocation(drop);
    setDropLocation(pickup);
    if (sender && receiver) {
      setSenderDetails(receiver);
      setReceiverDetails(sender);
    }
    setPickup(drop);
    setDrop(pickup);
    setSender(receiver);
    setReceiver(sender);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.colors.gray100 }}>
      <div className="mx-auto w-full max-w-[520px] flex flex-col flex-1">
        {/* Map area + header */}
        <div className="relative flex-shrink-0" style={{ minHeight: 180 }}>
          {/* Map-style background: light grey with subtle grid feel */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: theme.colors.gray200 }}
          />
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          </div>

          {/* Header: back only */}
          <div className="relative z-10 flex items-center px-4 pt-6 pb-2">
            <button
              type="button"
              aria-label={
                fromFood
                  ? 'Back to delivery address'
                  : fromKhatuTravel
                    ? 'Back to Khatu travel'
                    : 'Back to dashboard'
              }
              onClick={() => {
                if (fromFood) {
                  router.push(`${ROUTES.PICKUP_LOCATION}?step=2&from=food`);
                  return;
                }
                if (fromKhatuTravel) {
                  router.push(ROUTES.KHATU_TRAVEL);
                  return;
                }
                router.push(ROUTES.DASHBOARD);
              }}
              className="h-10 w-10 rounded-full grid place-items-center"
              style={{ backgroundColor: theme.colors.white, color: theme.colors.gray700 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Location card – white, rounded, shadow */}
          <div className="relative z-10 mx-4 m-4">
            <div
              className="rounded-3xl overflow-hidden border"
              style={{
                backgroundColor: theme.colors.white,
                borderColor: theme.colors.borderLight,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              }}
            >
              <div className="px-5 pt-5 pb-4">
                <div className="flex gap-3">
                  {/* Timeline: green dot, line, red pin */}
                  <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
                    <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: theme.colors.success }} />
                    <div className="w-px flex-1 min-h-[20px] my-1 flex-shrink-0" style={{ backgroundColor: theme.colors.border }} />
                    <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" style={{ color: theme.colors.error }}>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0 space-y-4">
                    {/* Pickup */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-bold" style={{ fontSize: theme.fontSizes.lg, color: theme.colors.gray900 }}>
                          {pickup?.name || 'Pickup not set'}
                        </div>
                        {pickup && (
                          <>
                            <div className="mt-0.5" style={{ fontSize: theme.fontSizes.base, color: theme.colors.gray500 }}>{pickup.address}</div>
                            {!fromKhatuTravel ? (
                              <div className="mt-1" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray400 }}>
                                {sender ? `${sender.name} | ${sender.mobile}` : pickup.contact}
                              </div>
                            ) : null}
                          </>
                        )}
                        {fromFood && pickup && (
                          <p className="mt-1.5 text-[11px] text-gray-400">Restaurant pickup — not editable</p>
                        )}
                      </div>
                      {!fromFood && (
                        <button
                          type="button"
                          aria-label="Edit pickup"
                          onClick={() => {
                            const q = new URLSearchParams({ step: '1' });
                            if (fromFood) q.set('from', 'food');
                            else if (fromKhatuTravel) q.set('from', TRIP_OPTIONS_FROM_KHATU_TRAVEL);
                            router.push(`${ROUTES.PICKUP_LOCATION}?${q.toString()}`);
                          }}
                          className="h-9 w-9 flex-shrink-0 rounded-full grid place-items-center hover:bg-gray-100 transition-colors"
                          style={{ color: theme.colors.textMuted }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {!fromFood && (
                      <div className="flex justify-end py-0.5">
                        <button
                          type="button"
                          aria-label="Swap locations"
                          onClick={handleSwapLocations}
                          className="h-9 w-9 rounded-full grid place-items-center text-white flex-shrink-0"
                          style={{ backgroundColor: theme.colors.primary }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Intermediate stops */}
                    {!fromFood &&
                      stops.map((wp, stopIndex) => (
                        <div key={wp.id} className="transition-opacity duration-200">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="font-bold" style={{ fontSize: theme.fontSizes.lg, color: theme.colors.gray900 }}>
                                {wp.location.name}
                                <span className="ms-2 align-middle text-[11px] font-semibold text-gray-400">
                                  · Stop {stopIndex + 1}
                                </span>
                              </div>
                              <div className="mt-0.5" style={{ fontSize: theme.fontSizes.base, color: theme.colors.gray500 }}>
                                {wp.location.address}
                              </div>
                              {!fromKhatuTravel ? (
                                <div className="mt-1" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray400 }}>
                                  {wp.contact?.name || wp.contact?.mobile
                                    ? `${wp.contact.name} | ${wp.contact.mobile}`
                                    : wp.location.contact}
                                </div>
                              ) : null}
                            </div>
                            <button
                              type="button"
                              aria-label={`Remove stop ${stopIndex + 1}`}
                              onClick={() => {
                                const next = stops.filter((s) => s.id !== wp.id);
                                setStops(next);
                                setStopWaypoints(next);
                              }}
                              className="h-8 w-8 rounded-full border grid place-items-center flex-shrink-0"
                              style={{ borderColor: theme.colors.border, color: theme.colors.gray500 }}
                            >
                              ×
                            </button>
                          </div>
                          <div className="flex justify-end py-0.5">
                            <div className="h-9 w-9" />
                          </div>
                        </div>
                      ))}

                    {/* Drop */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-bold" style={{ fontSize: theme.fontSizes.lg, color: theme.colors.gray900 }}>
                          {drop?.name || 'Drop not set'}
                        </div>
                        {drop && (
                          <>
                            <div className="mt-0.5" style={{ fontSize: theme.fontSizes.base, color: theme.colors.gray500 }}>{drop.address}</div>
                            {!fromKhatuTravel ? (
                              <div className="mt-1" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray400 }}>
                                {receiver ? `${receiver.name} | ${receiver.mobile}` : drop.contact}
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label="Edit drop"
                        onClick={() => {
                          const q = new URLSearchParams({ step: '2' });
                          if (fromFood) q.set('from', 'food');
                          else if (fromKhatuTravel) q.set('from', TRIP_OPTIONS_FROM_KHATU_TRAVEL);
                          router.push(`${ROUTES.PICKUP_LOCATION}?${q.toString()}`);
                        }}
                        className="h-9 w-9 flex-shrink-0 rounded-full grid place-items-center hover:bg-gray-100 transition-colors"
                        style={{ color: theme.colors.textMuted }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z" />
                        </svg>
                      </button>
                    </div>
                    {fromKhatuTravel && pickup && drop ? (
                      <p className="text-[11px] leading-snug" style={{ color: theme.colors.gray500 }}>
                        Default corridor pickup & drop for this route (Khatu · Ringus · Salasar). Tap edit to
                        refine the exact point.
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {!fromFood && (
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 py-3.5 border-t transition-colors hover:bg-gray-50"
                  style={{ borderColor: theme.colors.borderLight }}
                  onClick={() => router.push(ROUTES.ADD_STOP)}
                >
                  <span
                    className="h-7 w-7 rounded-full grid place-items-center flex-shrink-0 font-medium"
                    style={{ borderWidth: 1.5, borderStyle: 'solid', borderColor: theme.colors.border, color: theme.colors.gray500 }}
                  >
                    +
                  </span>
                  <span className="font-semibold" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray800 }}>Add Stop</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trip options list + bottom buttons */}
        <div className="flex-1 px-4 pt-4 pb-6" style={{ backgroundColor: theme.colors.white }}>
          {!hideKhatuWalkAndCourier ? (
            <OptionCard
              id="walk"
              selected={selected}
              setSelected={(id) => {
                setSelected(id);
                setSelectedService(OPTION_TO_SERVICE[id]);
              }}
              title="Big Saver"
              subtitle="Walking"
              price="₹75"
              oldPrice="₹105"
              image="/dashboard/service-walk.png"
            />
          ) : null}
          {!showKhatuCarOption ? (
            <OptionCard
              id="two"
              selected={selected}
              setSelected={(id) => {
                setSelected(id);
                setSelectedService(OPTION_TO_SERVICE[id]);
              }}
              title={twoCardTitle}
              subtitle={twoCardSubtitle}
              price={twoCardPrice}
              oldPrice={twoCardOldPrice}
              image={twoCardImage}
              note={twoCardNote}
            />
          ) : null}
          {showKhatuCarOption && khatuQuoteVehicle ? (
            <OptionCard
              id="four"
              selected={selected}
              setSelected={(id) => {
                setSelected(id);
                setSelectedService(OPTION_TO_SERVICE[id]);
              }}
              title={khatuQuoteVehicle.label}
              subtitle={
                khatuQuoteVehicle.comfortTag
                  ? `${khatuQuoteVehicle.comfortTag} · passenger car`
                  : 'Passenger car · matches your Khatu travel quote'
              }
              price={`₹${khatuQuoteVehicle.estimateInr}`}
              oldPrice={`₹${Math.round(khatuQuoteVehicle.estimateInr * 1.08)}`}
              image={khatuVehicleImage(khatuQuoteVehicle.type)}
            />
          ) : null}
          {!passengerFleetsOnly && (
            <>
              <OptionCard
                id="three"
                selected={selected}
                setSelected={(id) => {
                  setSelected(id);
                  setSelectedService(OPTION_TO_SERVICE[id]);
                }}
                title="Faster to your door"
                subtitle="Three wheeler / 500 kg"
                price="₹450"
                oldPrice="₹495"
                image="/dashboard/service-3wheeler.png"
              />
              <OptionCard
                id="four"
                selected={selected}
                setSelected={(id) => {
                  setSelected(id);
                  setSelectedService(OPTION_TO_SERVICE[id]);
                }}
                title="Room for bulky loads"
                subtitle="Four wheeler / mini truck"
                price="₹720"
                oldPrice="₹799"
                image="/services/four-wheeler.svg"
              />
            </>
          )}

          <div className={`mt-5 flex gap-3 ${fromFood ? 'flex-col' : ''}`}>
            {!fromFood && (
              <button
                type="button"
                className="flex-1 rounded-xl py-3.5 font-semibold text-white transition-opacity hover:opacity-95"
                style={{
                  backgroundColor: theme.colors.primary,
                  fontSize: theme.fontSizes.xl,
                }}
                onClick={() => router.push(ROUTES.SCHEDULE_LATER)}
              >
                Schedule later
              </button>
            )}
            <button
              type="button"
              className={`rounded-xl py-3.5 font-semibold transition-opacity hover:opacity-95 ${fromFood ? 'w-full text-white' : 'flex-1 border'}`}
              style={{
                backgroundColor: fromFood ? theme.colors.primary : theme.colors.white,
                borderColor: fromFood ? undefined : theme.colors.primary,
                color: fromFood ? theme.colors.white : theme.colors.primary,
                fontSize: theme.fontSizes.xl,
                ...(fromFood ? {} : { borderWidth: 1, borderStyle: 'solid' as const }),
              }}
              onClick={() =>
                router.push(fromFood ? `${ROUTES.PAYMENT}?from=food` : ROUTES.PAYMENT)
              }
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type OptionCardProps = {
  id: OptionId;
  selected: OptionId;
  setSelected: (id: OptionId) => void;
  title: string;
  subtitle: string;
  price: string;
  oldPrice?: string;
  image: string;
  note?: string;
};

function OptionCard({
  id,
  selected,
  setSelected,
  title,
  subtitle,
  price,
  oldPrice,
  image,
  note,
}: OptionCardProps) {
  const isActive = id === selected;
  return (
    <button
      type="button"
      onClick={() => setSelected(id)}
      className="mt-3 w-full rounded-2xl border px-3 py-3.5 text-left flex gap-3 transition-colors first:mt-0"
      style={{
        borderColor: isActive ? theme.colors.primary : theme.colors.border,
        backgroundColor: isActive ? theme.colors.primaryTint : theme.colors.white,
      }}
    >
      <div className="relative h-14 w-16 flex-shrink-0">
        <Image src={image} alt={title} fill className="object-contain" sizes="64px" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold" style={{ fontSize: theme.fontSizes.lg, color: theme.colors.gray900 }}>{title}</div>
            <div className="mt-0.5" style={{ fontSize: theme.fontSizes.base, color: theme.colors.gray500 }}>{subtitle}</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-semibold" style={{ fontSize: theme.fontSizes.xl, color: theme.colors.gray900 }}>{price}</div>
            {oldPrice ? (
              <div className="mt-0.5 line-through" style={{ fontSize: theme.fontSizes.xs, color: theme.colors.gray400 }}>
                {oldPrice}
              </div>
            ) : null}
          </div>
        </div>
        {note && (
          <div
            className="mt-2 rounded-xl px-3 py-1.5 flex items-center gap-2"
            style={{
              fontSize: theme.fontSizes.sm,
              color: theme.colors.primary,
              backgroundColor: theme.colors.primaryTint,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: theme.colors.primaryTint,
            }}
          >
            <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full font-bold" style={{ backgroundColor: theme.colors.primary, color: theme.colors.white, fontSize: 10 }}>i</span>
            {note}
          </div>
        )}
      </div>
    </button>
  );
}
