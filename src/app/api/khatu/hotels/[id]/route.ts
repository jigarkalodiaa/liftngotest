import { NextResponse } from 'next/server';
import { KHATU_HOTELS } from '@/data/khatuHotels';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const hotel = KHATU_HOTELS.find((h) => h.id === id && h.liftngoVerified);
  if (!hotel) {
    return NextResponse.json({ error: 'Hotel not found' }, { status: 404 });
  }
  return NextResponse.json({ hotel });
}
