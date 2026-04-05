'use client';

import { Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { parseResultLinesParam, type PaymentResultFlow } from '@/lib/paymentResultUrl';
import { PageContainer } from '@/components/ui';
import { CheckCircle2, XCircle, LayoutDashboard, ChevronRight } from 'lucide-react';

const FLOW_HEADLINE: Record<PaymentResultFlow, string> = {
  subscription: 'Trip subscription',
  rent: 'Vehicle rent',
  lease: 'Vehicle lease',
  delivery: 'Goods delivery',
  food: 'Food delivery',
  hotel: 'Hotel stay',
  coconut: 'Store order',
};

function isPaymentResultFlow(s: string | null): s is PaymentResultFlow {
  return (
    s === 'subscription' ||
    s === 'rent' ||
    s === 'lease' ||
    s === 'delivery' ||
    s === 'food' ||
    s === 'hotel' ||
    s === 'coconut'
  );
}

function PaymentResultInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const parsed = useMemo(() => {
    const status = searchParams.get('status');
    const flowRaw = searchParams.get('flow');
    const flow = isPaymentResultFlow(flowRaw) ? flowRaw : null;
    const title = searchParams.get('title')?.trim() || '';
    const subtitle = searchParams.get('subtitle')?.trim() || '';
    const paymentId = searchParams.get('payment')?.trim() || '';
    const amountRaw = searchParams.get('amount');
    const amount = amountRaw != null && amountRaw !== '' ? Number(amountRaw) : NaN;
    const lines = parseResultLinesParam(searchParams.get('lines'));
    const retry = searchParams.get('retry')?.trim() || '';
    const message = searchParams.get('message')?.trim() || '';
    const continuePath = searchParams.get('continue')?.trim() || '';
    return {
      status,
      flow,
      title,
      subtitle,
      paymentId,
      amount,
      lines,
      retry,
      message,
      continuePath,
      valid: status === 'success' || status === 'failed',
      isSuccess: status === 'success',
    };
  }, [searchParams]);

  if (!parsed.valid || !parsed.flow || !parsed.title) {
    return (
      <PageContainer className="py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-700">This payment status link is incomplete or expired.</p>
          <Link
            href={ROUTES.DASHBOARD}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-bold text-white"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden />
            Go to dashboard
          </Link>
        </div>
      </PageContainer>
    );
  }

  const flowLabel = FLOW_HEADLINE[parsed.flow];
  const amountOk = Number.isFinite(parsed.amount) && parsed.amount >= 0;
  const retrySafe =
    parsed.retry.startsWith('/') && !parsed.retry.startsWith('//') ? parsed.retry : ROUTES.PLANS;
  const continueSafe =
    parsed.continuePath.startsWith('/') && !parsed.continuePath.startsWith('//')
      ? parsed.continuePath
      : '';

  const continueLabel =
    parsed.flow === 'hotel'
      ? 'View booking history'
      : parsed.flow === 'delivery' || parsed.flow === 'food'
        ? 'Open trip confirmation'
        : 'Next step';

  return (
    <PageContainer className="py-10 pb-16 sm:py-14">
      <div className="mx-auto max-w-lg">
        <div
          className={`rounded-2xl border p-6 shadow-sm sm:p-8 ${
            parsed.isSuccess
              ? 'border-emerald-200/80 bg-emerald-50/90'
              : 'border-red-200/80 bg-red-50/90'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            {parsed.isSuccess ? (
              <CheckCircle2 className="h-14 w-14 text-emerald-600" strokeWidth={2} aria-hidden />
            ) : (
              <XCircle className="h-14 w-14 text-red-600" strokeWidth={2} aria-hidden />
            )}
            <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-gray-500">{flowLabel}</p>
            <h1 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
              {parsed.isSuccess ? 'Payment successful' : 'Payment not completed'}
            </h1>
            <p className="mt-2 text-base font-semibold text-gray-800">{parsed.title}</p>
            {parsed.subtitle ? (
              <p className="mt-1 text-sm text-gray-600">{parsed.subtitle}</p>
            ) : null}
          </div>

          {parsed.isSuccess && parsed.paymentId ? (
            <p className="mt-6 rounded-xl border border-emerald-200/60 bg-white/80 px-4 py-3 text-center font-mono text-xs text-gray-700">
              Razorpay payment ID
              <br />
              <span className="break-all text-sm font-semibold text-emerald-900">{parsed.paymentId}</span>
            </p>
          ) : null}

          {!parsed.isSuccess && parsed.message ? (
            <p className="mt-6 rounded-xl border border-red-200/60 bg-white/80 px-4 py-3 text-sm text-red-900" role="alert">
              {parsed.message}
            </p>
          ) : null}

          {amountOk ? (
            <p className="mt-4 text-center text-sm text-gray-700">
              Amount:{' '}
              <span className="text-lg font-bold tabular-nums text-[var(--color-primary)]">
                ₹{parsed.amount.toLocaleString('en-IN')}
              </span>
            </p>
          ) : null}

          {parsed.lines.length > 0 ? (
            <ul className="mt-5 space-y-2 rounded-xl border border-gray-200/80 bg-white/90 p-4 text-left text-sm text-gray-800">
              {parsed.lines.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-primary)]" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            {parsed.isSuccess ? (
              <>
                <button
                  type="button"
                  onClick={() => router.push(ROUTES.DASHBOARD)}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 text-sm font-bold text-white shadow-sm transition hover:opacity-95 sm:flex-initial sm:min-w-[200px]"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden />
                  Go to dashboard
                  <ChevronRight className="h-4 w-4 opacity-90" aria-hidden />
                </button>
                {continueSafe ? (
                  <Link
                    href={continueSafe}
                    className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 sm:flex-initial sm:min-w-[180px]"
                  >
                    {continueLabel}
                  </Link>
                ) : (
                  <Link
                    href={retrySafe}
                    className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 sm:flex-initial"
                  >
                    Change selection
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href={retrySafe}
                  className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 text-sm font-bold text-white shadow-sm transition hover:opacity-95 sm:min-w-[160px]"
                >
                  Try again
                </Link>
                <button
                  type="button"
                  onClick={() => router.push(ROUTES.DASHBOARD)}
                  className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 sm:flex-initial"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden />
                  Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function PaymentResultFallback() {
  return (
    <PageContainer className="py-16">
      <div className="mx-auto h-40 max-w-lg animate-pulse rounded-2xl bg-gray-100" aria-hidden />
    </PageContainer>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<PaymentResultFallback />}>
      <PaymentResultInner />
    </Suspense>
  );
}
