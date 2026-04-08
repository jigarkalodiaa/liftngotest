'use client';

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
import { ROUTES, TRIP_OPTIONS_FROM_KHATU_TRAVEL } from '@/lib/constants';
import { setPickupLocation, setDropLocation } from '@/lib/storage';
import { saveKhatuRideBooking } from '@/lib/khatuSessionStorage';
import type { RideVehicleType, TravelRouteId } from '@/types/khatu';
import Image from '@/components/OptimizedImage';
import PageHeader from '@/components/ui/PageHeader';

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

  const vehicleOptions = useMemo(
    () => KHATU_RIDE_VEHICLE_OPTIONS.map((v) => ({ ...v, fareInr: estimateKhatuRideFareInr(route, v.type), imageSrc: khatuVehicleImage(v.type) })),
    [route]
  );

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
    <div className="min-h-screen bg-[#f3f4f6] pb-6">
      <div className="mx-auto max-w-xl">
        <div className="bg-white px-3 pt-3 pb-2 shadow-sm">
          <PageHeader
            title="Travel Salasar & Ringus"
            onBack={() => router.push(ROUTES.DASHBOARD)}
            titleClassName="text-base font-semibold text-stone-800"
          />
        </div>

        <div className="px-3 pt-4">
          <p className="text-[13px] font-medium text-stone-800">Where Do You Want Go?</p>
          <button
            type="button"
            onClick={() => router.push(ROUTES.PICKUP_LOCATION)}
            className="mt-2 flex w-full items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-3 text-left text-[13px] text-stone-500"
          >
            <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
            </svg>
            Enter Pickup Location
          </button>

          <p className="mt-4 text-[13px] font-medium text-stone-800">Corridors</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {KHATU_TRAVEL_ROUTES.map((r) => {
              const selected = r.id === routeId;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRouteId(r.id)}
                  className={`rounded-xl border px-2.5 py-2 text-left ${selected ? 'border-[var(--color-primary)] bg-white shadow-sm' : 'border-stone-200 bg-white'}`}
                >
                  <p className="text-[13px] font-medium text-stone-800">{r.label}</p>
                  <p className="mt-0.5 text-[11px] text-stone-500">◷ {r.typicalMinutes} min • {r.distanceKm} Km</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-3 mt-4 rounded-t-3xl border border-stone-200 bg-white p-3.5 shadow-[0_-8px_28px_rgba(0,0,0,0.08)]">
          <div className="mx-auto mb-3 h-1 w-14 rounded-full bg-stone-200" />
          <div className="space-y-2.5">
            {vehicleOptions.map((opt) => {
              const selected = vehicleType === opt.type;
              const oldFare = Math.round(opt.fareInr * 1.22);
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setVehicleType(opt.type)}
                  className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left ${selected ? 'border-[var(--color-primary)] bg-indigo-50/30 shadow-sm ring-1 ring-[var(--color-primary)]/30' : 'border-stone-200 bg-white'}`}
                >
                  <div className="relative h-10 w-14 shrink-0">
                    <Image src={opt.imageSrc} alt={opt.label} fill className="object-contain" sizes="56px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold leading-none text-stone-800">{opt.label}</p>
                    <p className="mt-1 text-[13px] text-stone-500">Up to {opt.seats} seat (incl. driver)</p>
                    {selected && opt.type === 'two_wheeler' ? (
                      <p className="mt-1 text-xs font-medium text-blue-600">ⓘ Upto to 1 seat (incl. driver)</p>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-bold tabular-nums text-stone-800">₹{opt.fareInr}</p>
                    <p className="text-[11px] tabular-nums text-stone-400 line-through">₹{oldFare}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {mutation.isError ? (
            <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-900 ring-1 ring-rose-200">
              {mutation.error instanceof Error ? mutation.error.message : 'Could not create booking.'}
            </p>
          ) : null}

          <div className="mt-4 flex gap-2.5">
            <button
              type="button"
              onClick={() => router.push(ROUTES.SCHEDULE_LATER)}
              className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border border-[var(--color-primary)]/50 bg-white text-sm font-semibold text-[var(--color-primary)]"
            >
              Schedule later
            </button>
            <button
              type="button"
              disabled={mutation.isPending}
              onClick={() => void bookRide()}
              className="flex min-h-[48px] flex-1 items-center justify-center gap-1 rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white disabled:opacity-60"
            >
              {mutation.isPending ? 'Booking…' : 'Book Now'}
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
