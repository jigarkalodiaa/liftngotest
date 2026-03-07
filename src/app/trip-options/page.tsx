'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { SavedLocation, PersonDetails } from '@/types/booking';
import {
  getPickupLocation,
  getDropLocation,
  getStopLocation,
  getSenderDetails,
  getReceiverDetails,
  getStopDetails,
  getSelectedService,
  setPickupLocation,
  setDropLocation,
  setSenderDetails,
  setReceiverDetails,
  setStopLocation,
  setSelectedService,
  clearStopDetails,
} from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import { theme } from '@/config/theme';

type OptionId = 'walk' | 'two' | 'three';

const SERVICE_TO_OPTION: Record<string, OptionId> = {
  walk: 'walk',
  twoWheeler: 'two',
  threeWheeler: 'three',
};

const OPTION_TO_SERVICE: Record<OptionId, 'walk' | 'twoWheeler' | 'threeWheeler'> = {
  walk: 'walk',
  two: 'twoWheeler',
  three: 'threeWheeler',
};

export default function TripOptionsPage() {
  const router = useRouter();
  const [pickup, setPickup] = useState<SavedLocation | null>(null);
  const [drop, setDrop] = useState<SavedLocation | null>(null);
  const [stop, setStop] = useState<SavedLocation | null>(null);
  const [sender, setSender] = useState<PersonDetails | null>(null);
  const [receiver, setReceiver] = useState<PersonDetails | null>(null);
  const [stopDetails, setStopDetails] = useState<PersonDetails | null>(null);
  const [selected, setSelected] = useState<OptionId>('two');

  useEffect(() => {
    setPickup(getPickupLocation());
    setDrop(getDropLocation());
    setStop(getStopLocation());
    setSender(getSenderDetails());
    setReceiver(getReceiverDetails());
    setStopDetails(getStopDetails());
    const saved = getSelectedService();
    if (saved) setSelected(SERVICE_TO_OPTION[saved] ?? 'two');
  }, []);

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
              aria-label="Back to dashboard"
              onClick={() => router.push(ROUTES.DASHBOARD)}
              className="h-10 w-10 rounded-full grid place-items-center"
              style={{ backgroundColor: theme.colors.white, color: theme.colors.gray700 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* Location card – white, rounded, shadow */}
          <div className="relative z-10 mx-4 mt-4">
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
                            <div className="mt-1" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray400 }}>
                              {sender ? `${sender.name} | ${sender.mobile}` : pickup.contact}
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label="Edit pickup"
                        onClick={() => router.push(`${ROUTES.PICKUP_LOCATION}?step=1`)}
                        className="h-9 w-9 flex-shrink-0 rounded-full grid place-items-center hover:bg-gray-100 transition-colors"
                        style={{ color: theme.colors.textMuted }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z" />
                        </svg>
                      </button>
                    </div>

                    {/* Swap button */}
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

                    {/* Optional Stop */}
                    {stop && (
                      <>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="font-bold" style={{ fontSize: theme.fontSizes.lg, color: theme.colors.gray900 }}>{stop.name}</div>
                            <div className="mt-0.5" style={{ fontSize: theme.fontSizes.base, color: theme.colors.gray500 }}>{stop.address}</div>
                            <div className="mt-1" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray400 }}>
                              {stopDetails ? `${stopDetails.name} | ${stopDetails.mobile}` : stop.contact}
                            </div>
                          </div>
                          <button
                            type="button"
                            aria-label="Remove stop"
                            onClick={() => {
                              setStop(null);
                              setStopDetails(null);
                              setStopLocation(null);
                              clearStopDetails();
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
                      </>
                    )}

                    {/* Drop */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-bold" style={{ fontSize: theme.fontSizes.lg, color: theme.colors.gray900 }}>
                          {drop?.name || 'Drop not set'}
                        </div>
                        {drop && (
                          <>
                            <div className="mt-0.5" style={{ fontSize: theme.fontSizes.base, color: theme.colors.gray500 }}>{drop.address}</div>
                            <div className="mt-1" style={{ fontSize: theme.fontSizes.sm, color: theme.colors.gray400 }}>
                              {receiver ? `${receiver.name} | ${receiver.mobile}` : drop.contact}
                            </div>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label="Edit drop"
                        onClick={() => router.push(`${ROUTES.PICKUP_LOCATION}?step=2`)}
                        className="h-9 w-9 flex-shrink-0 rounded-full grid place-items-center hover:bg-gray-100 transition-colors"
                        style={{ color: theme.colors.textMuted }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.213 3 21l1.787-4.5L16.862 3.487z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Stop */}
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
            </div>
          </div>
        </div>

        {/* Trip options list + bottom buttons */}
        <div className="flex-1 px-4 pt-4 pb-6" style={{ backgroundColor: theme.colors.white }}>
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
          <OptionCard
            id="two"
            selected={selected}
            setSelected={(id) => {
              setSelected(id);
              setSelectedService(OPTION_TO_SERVICE[id]);
            }}
            title="Faster to your door"
            subtitle="Two wheeler / 40kg"
            price="₹160"
            oldPrice="₹195"
            image="/dashboard/service-2wheeler.png"
            note="Orders can be picked up within 1 km only."
          />
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

          {/* Bottom: Book Now (outline) + Schedule later (filled) */}
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-xl border py-3.5 font-semibold transition-opacity hover:opacity-90"
              style={{
                backgroundColor: theme.colors.white,
                borderColor: theme.colors.primary,
                color: theme.colors.primary,
                fontSize: theme.fontSizes.xl,
              }}
              onClick={() => router.push(ROUTES.PAYMENT)}
            >
              Book Now
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl py-3.5 font-semibold text-white transition-opacity hover:opacity-95"
              style={{
                backgroundColor: theme.colors.primary,
                fontSize: theme.fontSizes.xl,
              }}
            >
              Schedule later
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
  oldPrice: string;
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
            <div className="mt-0.5 line-through" style={{ fontSize: theme.fontSizes.xs, color: theme.colors.gray400 }}>{oldPrice}</div>
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
