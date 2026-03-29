'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  estimateKhatuRideFareInr,
  getKhatuRouteDefaultLocations,
  khatuVehicleImage,
  KHATU_RIDE_VEHICLE_OPTIONS,
  KHATU_TRAVEL_ROUTES,
} from '@/data/khatuTravel';
import { useBookRideMutation } from '@/hooks/useKhatuData';
import { SectionHeader } from '@/components/ui';
import { ROUTES, TRIP_OPTIONS_FROM_KHATU_TRAVEL } from '@/lib/constants';
import { setPickupLocation, setDropLocation } from '@/lib/storage';
import { saveKhatuRideBooking } from '@/lib/khatuSessionStorage';
import type { RideVehicleType, TravelRouteId } from '@/types/khatu';
import KhatuScreenShell from '@/features/khatu/common/KhatuScreenShell';
import RouteSelector from '@/features/khatu/travel/RouteSelector';
import VehicleCard, { type VehicleCardOption } from '@/features/khatu/travel/VehicleCard';

export default function KhatuTravelPage() {
  const router = useRouter();
  const [routeId, setRouteId] = useState<TravelRouteId>('khatu-salasar');
  const [vehicleType, setVehicleType] = useState<RideVehicleType>('suv');
  const [note, setNote] = useState('');
  const mutation = useBookRideMutation();

  const route = useMemo(
    () => KHATU_TRAVEL_ROUTES.find((r) => r.id === routeId)!,
    [routeId],
  );

  const vehicleOptions: VehicleCardOption[] = useMemo(
    () =>
      KHATU_RIDE_VEHICLE_OPTIONS.map((v) => ({
        type: v.type,
        label: v.label,
        seats: v.seats,
        fareInr: estimateKhatuRideFareInr(route, v.type),
        imageSrc: khatuVehicleImage(v.type),
        comfortTag: v.comfortTag,
      })),
    [route],
  );

  const selectedFare = estimateKhatuRideFareInr(route, vehicleType);

  const bookRide = async () => {
    try {
      const res = await mutation.mutateAsync({
        routeId,
        vehicleType,
        note: note.trim() || undefined,
      });
      const { pickup, drop } = getKhatuRouteDefaultLocations(routeId);
      setPickupLocation(pickup);
      setDropLocation(drop);
      saveKhatuRideBooking(res);
      router.push(`${ROUTES.TRIP_OPTIONS}?from=${TRIP_OPTIONS_FROM_KHATU_TRAVEL}`);
    } catch {
      /* surfaced below */
    }
  };

  return (
    <>
      <KhatuScreenShell title="Intercity & corridor rides" eyebrow="Salasar · Ringus">
        <SectionHeader
          title="Book comfort for mandir yātrā"
          description="Sedans and SUVs for families; hatchbacks for lean groups. Estimates are upfront — final fare may vary with tolls and traffic."
        />

        <div className="mt-6">
          <RouteSelector routes={KHATU_TRAVEL_ROUTES} value={routeId} onChange={setRouteId} />
        </div>

        <div className="mt-8">
          <SectionHeader
            eyebrow="Fleet"
            title="Choose vehicle"
            description="Four-wheelers are our primary focus for tourists. Two-wheelers for quick solo hops only."
          />
          <div className="mt-4 flex flex-col gap-2.5">
            {vehicleOptions.map((opt) => (
              <VehicleCard
                key={opt.type}
                option={opt}
                selected={vehicleType === opt.type}
                onSelect={() => setVehicleType(opt.type)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--khatu-stone-muted)]">Trip summary</p>
          <p className="mt-1 text-sm font-medium text-[var(--khatu-stone)]">
            {route.from} → {route.to}
          </p>
          <p className="mt-2 text-base font-semibold tabular-nums text-[var(--khatu-stone)]">
            From ₹{selectedFare}{' '}
            <span className="text-sm font-normal text-[var(--khatu-stone-muted)]">
              · {route.distanceKm} km · ~{route.typicalMinutes} min
            </span>
          </p>
        </div>

        <label className="mt-5 block" htmlFor="khatu-ride-note">
          <span className="text-xs font-semibold text-[var(--khatu-stone)]">Notes for dispatch (optional)</span>
          <textarea
            id="khatu-ride-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. 4 passengers with luggage, pickup at Ringus east gate"
            className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-[var(--khatu-stone)] placeholder:text-stone-400 focus:border-[var(--khatu-saffron)] focus:outline-none focus:ring-2 focus:ring-[var(--khatu-saffron)]/20"
          />
        </label>

        {mutation.isError ? (
          <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-900 ring-1 ring-rose-200">
            {mutation.error instanceof Error ? mutation.error.message : 'Could not create booking.'}
          </p>
        ) : null}

        <p className="mt-6 text-center text-sm text-[var(--khatu-stone-muted)]">
          <Link href={ROUTES.KHATU_HOTELS} className="font-semibold text-[var(--khatu-saffron)] underline-offset-2 hover:underline">
            Verified hotels
          </Link>
          {' · '}
          <Link
            href={ROUTES.KHATU_MARKETPLACE}
            className="font-semibold text-[var(--khatu-saffron)] underline-offset-2 hover:underline"
          >
            Prasad & shops
          </Link>
        </p>
      </KhatuScreenShell>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center gap-3 sm:max-w-2xl">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-[var(--khatu-stone-muted)]">Selected</p>
            <p className="truncate text-sm font-semibold text-[var(--khatu-stone)]">
              {KHATU_RIDE_VEHICLE_OPTIONS.find((v) => v.type === vehicleType)?.label} · ₹{selectedFare}
            </p>
          </div>
          <button
            type="button"
            disabled={mutation.isPending}
            onClick={() => void bookRide()}
            className="min-h-[50px] shrink-0 rounded-xl bg-[var(--khatu-saffron)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {mutation.isPending ? 'Booking…' : 'Book ride'}
          </button>
        </div>
      </div>
    </>
  );
}
