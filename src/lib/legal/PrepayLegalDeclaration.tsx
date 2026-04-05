'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { ScrollText } from 'lucide-react';

/** Append to Razorpay `notes` when user has ticked the combined declaration. */
export function buildPrepayLegalRazorpayNotes(consentVersion: string): {
  legal_consents_version: string;
  legal_consents: string;
  legal_consents_at: string;
} {
  return {
    legal_consents_version: consentVersion,
    legal_consents: 'combined_terms_privacy_product_payment_electronic',
    legal_consents_at: new Date().toISOString(),
  };
}

type PrepayLegalDeclarationProps = {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  /** Flow-specific text (amounts, product name) inserted after Terms/Privacy links. */
  productSummary: ReactNode;
  /** Optional class on outer wrapper */
  className?: string;
};

/**
 * Single checkbox covering Terms, Privacy, product acknowledgement, payment authority, and electronic records.
 * Use with {@link buildPrepayLegalRazorpayNotes} on successful intent to pay.
 */
export function PrepayLegalDeclaration({
  checked,
  onCheckedChange,
  productSummary,
  className = '',
}: PrepayLegalDeclarationProps) {
  return (
    <div className={`rounded-xl border-2 border-slate-200 bg-slate-50/50 p-3 sm:p-4 ${className}`}>
      <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-700">
        <ScrollText className="h-3.5 w-3.5 text-slate-500" aria-hidden />
        Declaration required to pay
      </div>
      <label className="flex cursor-pointer gap-2.5 text-[11px] leading-snug text-slate-800 sm:text-xs">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-400"
        />
        <span>
          I have read and agree to the{' '}
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--color-primary)] underline underline-offset-2"
          >
            Terms of Service
          </Link>{' '}
          and the{' '}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--color-primary)] underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          . {productSummary} I am authorised to pay this amount; the Razorpay method used is legitimately available for this
          transaction; refunds and disputes follow the Terms and bank / Razorpay rules. I consent to electronic invoices,
          receipts, trip summaries, and notices (email, SMS, WhatsApp if used, app) as described in the Terms and Privacy
          Policy.
        </span>
      </label>
    </div>
  );
}
