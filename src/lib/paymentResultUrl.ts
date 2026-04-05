import { ROUTES } from '@/lib/constants';

export type PaymentResultFlow =
  | 'subscription'
  | 'rent'
  | 'lease'
  | 'custom'
  | 'delivery'
  | 'food'
  | 'hotel'
  | 'coconut';

const LINE_SEP = '||';

function joinLines(lines: string[] | undefined): string | undefined {
  if (!lines?.length) return undefined;
  return lines.map((l) => l.replaceAll(LINE_SEP, ' ')).join(LINE_SEP);
}

function splitLines(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(LINE_SEP).map((s) => s.trim()).filter(Boolean);
}

export function parseResultLinesParam(raw: string | null): string[] {
  return splitLines(raw);
}

/**
 * Build `/payment/result` for a verified payment. `retryPath` should be a root-relative path
 * (e.g. `/plans/subscription/checkout?tier=Growth`) so the user can edit and pay again.
 */
export function paymentResultSuccessHref(args: {
  flow: PaymentResultFlow;
  paymentId: string;
  amountInr: number;
  title: string;
  subtitle?: string;
  lines?: string[];
  retryPath: string;
  /** Root-relative next step after success (e.g. `/booking`, `/history?tab=hotel`). */
  continuePath?: string;
}): string {
  const q = new URLSearchParams();
  q.set('status', 'success');
  q.set('flow', args.flow);
  q.set('payment', args.paymentId);
  q.set('amount', String(Math.round(args.amountInr)));
  q.set('title', args.title);
  if (args.subtitle) q.set('subtitle', args.subtitle);
  const packed = joinLines(args.lines);
  if (packed) q.set('lines', packed);
  q.set('retry', args.retryPath);
  if (args.continuePath) q.set('continue', args.continuePath);
  return `${ROUTES.PAYMENT_RESULT}?${q.toString()}`;
}

export function paymentResultFailureHref(args: {
  flow: PaymentResultFlow;
  title: string;
  message: string;
  amountInr?: number;
  retryPath: string;
}): string {
  const q = new URLSearchParams();
  q.set('status', 'failed');
  q.set('flow', args.flow);
  q.set('title', args.title);
  q.set('message', args.message);
  if (args.amountInr != null) q.set('amount', String(Math.round(args.amountInr)));
  q.set('retry', args.retryPath);
  return `${ROUTES.PAYMENT_RESULT}?${q.toString()}`;
}
