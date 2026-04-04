import { NextResponse } from 'next/server';
import { z } from 'zod';
import { resolveZoneFromCoordinates } from '@/features/location/zoneResolver';

const bodySchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

/**
 * POST { lat, lng } → { city, state, zone: 'khatu' | 'noida' | 'default' }
 * Uses Nominatim reverse geocoding + distance/keyword rules.
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

  const { lat, lng } = parsed.data;

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`;
    const r = await fetch(url, {
      headers: {
        'User-Agent': 'LiftngoDashboard/1.0 (contact: support@goliftngo.com)',
      },
      next: { revalidate: 0 },
    });

    if (!r.ok) {
      const { zone, city, state } = resolveZoneFromCoordinates(lat, lng, undefined, undefined);
      return NextResponse.json({ city, state, zone });
    }

    const data = (await r.json()) as {
      address?: Record<string, string>;
      display_name?: string;
    };

    const { zone, city, state } = resolveZoneFromCoordinates(
      lat,
      lng,
      data.address,
      data.display_name,
    );

    return NextResponse.json({ city, state, zone });
  } catch {
    const { zone, city, state } = resolveZoneFromCoordinates(lat, lng, undefined, undefined);
    return NextResponse.json({ city, state, zone });
  }
}
