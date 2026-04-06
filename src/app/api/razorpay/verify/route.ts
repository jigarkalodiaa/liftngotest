import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPostHogClient } from '@/lib/posthog-server';

/**
 * Verifies a Razorpay payment signature server-side.
 * @see https://razorpay.com/docs/payments/server-integration/nodejs/payment-verification/
 */
export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = (await req.json()) as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    };

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const expectedSig = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = expectedSig === razorpay_signature;

    if (!isValid) {
      return NextResponse.json({ verified: false, error: 'Signature mismatch' }, { status: 400 });
    }

    getPostHogClient().capture({
      distinctId: razorpay_payment_id,
      event: 'payment_verified',
      properties: {
        gateway: 'razorpay',
        signature_valid: true,
        razorpay_order_id,
        razorpay_payment_id,
      },
    });

    return NextResponse.json({ verified: true, paymentId: razorpay_payment_id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Razorpay] verify error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
