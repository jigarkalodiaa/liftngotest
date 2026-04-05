import type { ReactNode } from 'react';

export type LeasePrepayConsentSummaryProps = {
  vehicle: string;
  termMonths: 6 | 12;
  monthlyExclGst: number;
  termSubtotalExclGst: number;
  gst: number;
  totalInclGst: number;
};

function inr(n: number): string {
  return `₹${n.toLocaleString('en-IN')}`;
}

/**
 * Lease prepay consent middle clause — keep in sync with {@link LeaseCheckoutClient} totals and Razorpay notes.
 */
export function LeasePrepayConsentSummary({
  vehicle,
  termMonths,
  monthlyExclGst,
  termSubtotalExclGst,
  gst,
  totalInclGst,
}: LeasePrepayConsentSummaryProps): ReactNode {
  return (
    <>
      I confirm this payment is toward a <strong className="font-semibold">vehicle lease</strong> for{' '}
      <strong className="font-semibold">{vehicle}</strong> for the full{' '}
      <strong className="font-semibold">{termMonths}-month</strong> commitment:{' '}
      <strong className="font-semibold">{inr(monthlyExclGst)}/month excl. GST</strong> ×{' '}
      <strong className="font-semibold">{termMonths}</strong> ={' '}
      <strong className="font-semibold">{inr(termSubtotalExclGst)} excl. GST</strong>, plus{' '}
      <strong className="font-semibold">18% GST ({inr(gst)})</strong>, total{' '}
      <strong className="font-semibold">{inr(totalInclGst)} incl. GST</strong>. Full lease agreement and activation follow
      order confirmation and the Terms.
    </>
  );
}

/** Plain-text snapshot for Razorpay notes / support (no HTML). Truncated for typical gateway note limits. */
export function leasePrepayConsentPlainText(p: LeasePrepayConsentSummaryProps): string {
  const { vehicle, termMonths, monthlyExclGst, termSubtotalExclGst, gst, totalInclGst } = p;
  const s =
    `Lease ${vehicle} ${termMonths}mo: ${inr(monthlyExclGst)}/mo×${termMonths}=${inr(termSubtotalExclGst)} ex-GST; ` +
    `GST ${inr(gst)}; total ${inr(totalInclGst)} incl GST.`;
  return s.length > 240 ? `${s.slice(0, 237)}...` : s;
}
