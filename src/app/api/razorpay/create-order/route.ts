import { NextRequest, NextResponse } from 'next/server';
import { getRazorpay } from '@/lib/razorpay/razorpayServer';

function extractError(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null) {
    const e = err as Record<string, unknown>;
    if (e.error && typeof e.error === 'object') {
      const inner = e.error as Record<string, unknown>;
      return (inner.description as string) || (inner.code as string) || JSON.stringify(inner);
    }
    if (typeof e.message === 'string') return e.message;
    return JSON.stringify(err);
  }
  return String(err);
}

export async function POST(req: NextRequest) {
  const secret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  const keyId = (process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim();

  if (!keyId || !secret || secret === 'YOUR_KEY_SECRET_HERE') {
    return NextResponse.json(
      {
        error:
          'Razorpay is not configured. Set RAZORPAY_KEY_ID (or NEXT_PUBLIC_RAZORPAY_KEY_ID) and RAZORPAY_KEY_SECRET in .env.local, then restart the dev server.',
      },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const { amount, currency = 'INR', receipt, notes } = body as {
      amount: number;
      currency?: string;
      receipt?: string;
      notes?: Record<string, string>;
    };

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const order = await getRazorpay().orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt ?? `rcpt_${Date.now()}`,
      notes: notes ?? {},
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err: unknown) {
    const msg = extractError(err);
    console.error('[Razorpay] create-order error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
