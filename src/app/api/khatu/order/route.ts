import { NextResponse } from 'next/server';
import { z } from 'zod';
import { KHATU_SHOP_PRODUCTS } from '@/data/khatuShops';

const DELIVERY_INR = 49;

const bodySchema = z.object({
  shopId: z.string().min(1),
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().int().positive(),
    }),
  ).min(1),
  totalAmount: z.number().positive(),
  address: z.string().min(8),
  contactPhone: z.string().min(10).max(15),
});

function computeSubtotal(shopId: string, items: { id: string; quantity: number }[]): number | null {
  let sub = 0;
  for (const row of items) {
    const p = KHATU_SHOP_PRODUCTS.find((x) => x.id === row.id && x.shopId === shopId);
    if (!p) return null;
    sub += p.priceInr * row.quantity;
  }
  return sub;
}

function orderRef(): string {
  return `KMO-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
}

/**
 * Placeholder order intake — returns reference for ops / dispatch.
 * Wire to payment + driver assignment when production backend is ready.
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

  const { shopId, items, totalAmount, address, contactPhone } = parsed.data;

  const subtotal = computeSubtotal(shopId, items);
  if (subtotal === null) {
    return NextResponse.json({ error: 'Invalid product or shop mismatch' }, { status: 400 });
  }

  const grand = subtotal + DELIVERY_INR;
  if (Math.abs(grand - totalAmount) > 1) {
    return NextResponse.json(
      { error: 'Total mismatch', expected: grand },
      { status: 400 },
    );
  }

  const orderId = orderRef();

  return NextResponse.json({
    ok: true as const,
    orderId,
    deliveryMode: 'liftngo' as const,
    deliveryChargeInr: DELIVERY_INR,
    subtotalInr: subtotal,
    message:
      'Order received. A Liftngo rider will be assigned for doorstep delivery — you will receive updates on your registered number.',
    addressSummary: address.slice(0, 120),
    contactPhone: contactPhone.replace(/\s/g, ''),
  });
}
