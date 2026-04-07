'use client';

import { useCallback, useRef } from 'react';
import { RAZORPAY_KEY_ID } from '@/config/env';
import { trackEvent } from '@/lib/posthogAnalytics';
import { paymentContextFromNotes } from '@/lib/posthog/paymentAnalyticsContext';

/* ------------------------------------------------------------------ */
/*  Razorpay Checkout type (from checkout.js loaded in <head>)        */
/* ------------------------------------------------------------------ */

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckout {
  open(): void;
  close(): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayCheckout;
  }
}

/* ------------------------------------------------------------------ */
/*  Script loader                                                      */
/* ------------------------------------------------------------------ */

let scriptPromise: Promise<void> | null = null;

function loadRazorpayScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('SSR'));
    if (window.Razorpay) return resolve();
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error('Failed to load Razorpay SDK'));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export interface OpenPaymentArgs {
  /** Amount in INR (rupees, not paise). */
  amountInr: number;
  /** Receipt id for your records (optional). */
  receipt?: string;
  /** Extra notes attached to the Razorpay order. */
  notes?: Record<string, string>;
  /** Pre-fill customer details in Razorpay modal. */
  prefill?: { name?: string; email?: string; contact?: string };
  /** Product description shown in Razorpay modal. */
  description?: string;
  /** Called after payment is verified server-side. */
  onSuccess: (data: { paymentId: string; orderId: string }) => void;
  /** Called when payment fails or is dismissed. */
  onError: (error: string) => void;
}

export function useRazorpay() {
  const busyRef = useRef(false);

  const openPayment = useCallback(async (args: OpenPaymentArgs) => {
    if (busyRef.current) return;
    busyRef.current = true;

    const payCtx = () => paymentContextFromNotes(args.notes);
    const fail = (reason: string) => {
      busyRef.current = false;
      trackEvent('payment_failed', {
        gateway: 'razorpay',
        reason: reason.slice(0, 240),
        ...payCtx(),
      });
      args.onError(reason);
    };

    try {
      await loadRazorpayScript();

      // 1. Create order on server
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: args.amountInr,
          receipt: args.receipt,
          notes: args.notes,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Server error' }));
        throw new Error(err.error ?? 'Could not create order');
      }

      const { orderId, currency } = (await res.json()) as {
        orderId: string;
        amount: number;
        currency: string;
      };

      trackEvent('payment_initiated', {
        gateway: 'razorpay',
        amount_inr: args.amountInr,
        razorpay_order_id: orderId,
        ...payCtx(),
      });

      // 2. Open Razorpay Checkout modal
      if (!window.Razorpay) throw new Error('Razorpay SDK not loaded');

      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        amount: Math.round(args.amountInr * 100),
        currency,
        name: 'Liftngo',
        description: args.description ?? 'Payment',
        image: '/favicon.png',
        order_id: orderId,
        prefill: args.prefill,
        theme: { color: '#2C2D5B' },
        handler: async (response: RazorpaySuccessResponse) => {
          // 3. Verify signature on server
          try {
            const vRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            const vData = await vRes.json();

            if (vData.verified) {
              trackEvent('payment_success', {
                gateway: 'razorpay',
                amount_inr: args.amountInr,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                ...payCtx(),
              });
              args.onSuccess({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              });
            } else {
              fail(vData.error ?? 'Payment verification failed');
            }
          } catch {
            fail('Payment verification request failed');
          } finally {
            busyRef.current = false;
          }
        },
        modal: {
          ondismiss: () => {
            busyRef.current = false;
            fail('Payment cancelled');
          },
        },
      });

      rzp.open();
    } catch (err) {
      fail(err instanceof Error ? err.message : 'Payment failed');
    }
  }, []);

  return { openPayment };
}
