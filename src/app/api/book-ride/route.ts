import { NextResponse } from 'next/server';
import { z } from 'zod';
import { estimateKhatuRideFareInr, getKhatuRoute, KHATU_RIDE_VEHICLE_OPTIONS } from '@/data/khatuTravel';
import type { RideVehicleType, TravelRouteId } from '@/types/khatu';

const travelRouteIds = z.enum(['khatu-salasar', 'khatu-ringus', 'ringus-khatu']);
const vehicleTypes = z.enum(['two_wheeler', 'hatchback', 'sedan', 'suv']);

const bodySchema = z.object({
  routeId: travelRouteIds,
  vehicleType: vehicleTypes,
  passengerCount: z.number().int().min(1).max(8).optional(),
  note: z.string().max(500).optional(),
});

function bookingRef(): string {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 8);
  return `KNR-${t}-${r}`.toUpperCase();
}

/**
 * Creates a provisional Khatu corridor ride request (quote + reference).
 * Wire to dispatch / payments when backend is ready.
 */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid body', details: parsed.error.flatten() }, { status: 400 });
  }

  const { routeId, vehicleType, passengerCount, note } = parsed.data;

  const route = getKhatuRoute(routeId as TravelRouteId);
  if (!route) {
    return NextResponse.json({ error: 'Unknown route' }, { status: 400 });
  }

  const vehicle = KHATU_RIDE_VEHICLE_OPTIONS.find((v) => v.type === vehicleType);
  if (!vehicle) {
    return NextResponse.json({ error: 'Unknown vehicle' }, { status: 400 });
  }

  if (passengerCount !== undefined && passengerCount > vehicle.seats) {
    return NextResponse.json(
      { error: `This vehicle seats up to ${vehicle.seats}.` },
      { status: 400 },
    );
  }

  const estimateInr = estimateKhatuRideFareInr(route, vehicleType as RideVehicleType);

  return NextResponse.json({
    ok: true as const,
    bookingRef: bookingRef(),
    estimateInr,
    route: {
      id: route.id,
      label: route.label,
      from: route.from,
      to: route.to,
      distanceKm: route.distanceKm,
      typicalMinutes: route.typicalMinutes,
    },
    vehicle: {
      type: vehicle.type,
      label: vehicle.label,
      seats: vehicle.seats,
    },
    receivedNote: note ?? null,
  });
}
