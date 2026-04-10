'use client';

import { useCallback, useState } from 'react';
import { BarChart3, Loader2 } from 'lucide-react';
import { trackFormSubmit } from '@/lib/analytics';
import { normalizeLeadPhoneInput, parseIndianMobile } from '@/lib/validations';
import { apiClient } from '@/lib/api';

const LEAD_SOURCE = 'route_optimization_grow_with_liftngo';

type Props = {
  /** Section id for #route-analysis deep links */
  id?: string;
  className?: string;
};

/**
 * Compact intake: mobile + submit → /api/leads (same pipeline as enquiries).
 * Copy emphasises autonomous report delivery vs manual back-and-forth.
 */
export default function RouteOptimizationIntake({ id = 'route-analysis', className = '' }: Props) {
  const [phone, setPhone] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const reset = useCallback(() => {
    setPhone('');
    setConsent(false);
    setError(null);
    setServerMessage(null);
    setStatus('idle');
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setServerMessage(null);

    const phoneParsed = parseIndianMobile(phone);
    if (!phoneParsed.ok) {
      setError(phoneParsed.message);
      return;
    }
    const digits = phoneParsed.digits;
    if (!consent) {
      setError('Please confirm we may send the report to this number.');
      return;
    }

    setStatus('loading');
    try {
      await apiClient.post('/api/leads', {
        name: '',
        phone: digits,
        query:
          'Autonomous route optimization request — subscriber requested savings-oriented lane report via grow-with-liftngo; share report on this number when ready.',
        source: LEAD_SOURCE,
        company: '',
        email: '',
        city: '',
        website: honeypot,
      });

      trackFormSubmit(LEAD_SOURCE);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      const error = err as { status?: number; message?: string };
      if (error.status === 503) {
        setServerMessage(
          'Online intake is unavailable. Please use the business enquiry form or contact channels.',
        );
      } else {
        setServerMessage(error.message ?? 'Something went wrong. Try again shortly.');
      }
    }
  };

  if (status === 'success') {
    return (
      <section
        id={id}
        className={`scroll-mt-28 rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/70 to-white p-4 shadow-sm ring-1 ring-emerald-100/50 sm:p-5 ${className}`}
      >
        <p className="text-sm font-bold text-emerald-900">You&apos;re in the queue.</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
          We&apos;ll share a savings-oriented route report on your number soon — built from your lane pattern where data allows. No need to chase us; we only reach out if something is blocked.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-3 text-xs font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
        >
          Submit another number
        </button>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={`scroll-mt-28 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-lg shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.05] sm:p-5 ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 sm:h-10 sm:w-10">
          <BarChart3 className="h-4 w-4 sm:h-[1.15rem] sm:w-[1.15rem]" strokeWidth={1.75} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`${id}-title`} className="text-base font-bold text-slate-900 sm:text-lg">
            Route optimization
          </h2>
          <p className="mt-0.5 text-[11px] leading-snug text-slate-500 sm:text-xs">
            Autonomous intake · report on your number
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
        Enter your mobile — our team prepares a compact lane view and shares it with you. Designed to skip manual ping-pong;
        we only message if we need one missing detail.
      </p>

      <form className="mt-3 space-y-2.5" onSubmit={onSubmit} noValidate>
        <label className="sr-only" htmlFor={`${id}-hp`}>
          Leave blank
        </label>
        <input
          id={`${id}-hp`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
          aria-hidden
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <label className="sr-only" htmlFor={`${id}-phone`}>
            Mobile number
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(normalizeLeadPhoneInput(e.target.value))}
            placeholder="10-digit mobile (same as login)"
            className="min-h-10 w-full flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[var(--color-primary)]/35 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/12 sm:min-h-11"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 text-xs font-bold text-white shadow-sm transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70 sm:min-h-11 sm:px-5 sm:text-sm"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Sending…
              </>
            ) : (
              'Route optimization'
            )}
          </button>
        </div>

        <label className="flex cursor-pointer items-start gap-2 rounded-lg bg-slate-50/50 px-2 py-1.5">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-slate-300 text-[var(--color-primary)]"
          />
          <span className="text-[10px] leading-snug text-slate-600 sm:text-[11px]">
            I agree Liftngo may WhatsApp or SMS this number with the route report and essential follow-ups.
          </span>
        </label>

        {error || serverMessage ? (
          <p className="rounded-lg border border-amber-200/80 bg-amber-50/90 px-2.5 py-1.5 text-[11px] text-amber-950">
            {error ?? serverMessage}
          </p>
        ) : null}
      </form>
    </section>
  );
}
