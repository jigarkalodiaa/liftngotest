'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { SUPPORT_EMAIL } from '@/config/env';
import { trackFormSubmit } from '@/lib/analytics';
import { normalizeLeadPhoneInput, parseIndianMobile } from '@/lib/validations';

const WHATSAPP_NUMBER = '918580584898';

type Props = {
  id?: string;
  className?: string;
  /** POST /api/leads `source` + analytics form name. */
  leadSource?: string;
};

export default function BusinessEnquiryForm({
  id = 'business-enquiry',
  className = '',
  leadSource = 'business_enquiry_contact',
}: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [consent, setConsent] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const reset = useCallback(() => {
    setName('');
    setPhone('');
    setCompany('');
    setEmail('');
    setCity('');
    setMessage('');
    setConsent(false);
    setClientError(null);
    setStatus('idle');
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setClientError('Please enter your name (at least 2 characters).');
      return;
    }

    const phoneParsed = parseIndianMobile(phone);
    if (!phoneParsed.ok) {
      setClientError(phoneParsed.message);
      return;
    }
    const digits = phoneParsed.digits;

    const em = email.trim();
    if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setClientError('Enter a valid work email, or leave it blank.');
      return;
    }

    if (!consent) {
      setClientError('Please confirm we may contact you about this enquiry.');
      return;
    }

    // Build WhatsApp message with all form data
    const whatsappMessage = [
      `📋 *New Business Enquiry*`,
      ``,
      `👤 *Name:* ${trimmedName}`,
      `📱 *Phone:* ${digits}`,
      company.trim() ? `🏢 *Company:* ${company.trim()}` : '',
      em ? `📧 *Email:* ${em}` : '',
      city.trim() ? `📍 *City:* ${city.trim()}` : '',
      message.trim() ? `\n💬 *Message:*\n${message.trim()}` : '',
      ``,
      `📌 *Source:* ${leadSource}`,
    ]
      .filter(Boolean)
      .join('\n');

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

    trackFormSubmit(leadSource);
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div
        id={id}
        className={`rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/60 to-white p-6 shadow-sm ring-1 ring-emerald-100/50 sm:p-8 ${className}`}
      >
        <p className="text-sm font-bold text-emerald-900 sm:text-base">Thank you — we&apos;ll reach out shortly.</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Your business enquiry has been submitted. The Liftngo team typically responds within one to two working days for
          partnership and B2B questions.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-5 text-sm font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <section
      id={id}
      className={`scroll-mt-28 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-lg shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.05] sm:p-7 ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`} className="text-base font-bold text-slate-900 sm:text-lg">
        Business enquiry
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-sm">
        Share a few details and we&apos;ll get back to you soon — bookings, B2B lanes, partnerships, or route reviews.
      </p>

      <form className="mt-5 space-y-3.5" onSubmit={onSubmit} noValidate>
        {/* Honeypot */}
        <label className="sr-only" htmlFor={`${id}-website`}>
          Leave blank
        </label>
        <input
          id={`${id}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
          aria-hidden
        />

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label htmlFor={`${id}-name`} className="mb-1 block text-[11px] font-semibold text-slate-700 sm:text-xs">
              Your name <span className="text-red-600">*</span>
            </label>
            <input
              id={`${id}-name`}
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--color-primary)]/35 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/15"
              placeholder="Full name"
            />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor={`${id}-phone`} className="mb-1 block text-[11px] font-semibold text-slate-700 sm:text-xs">
              Mobile <span className="text-red-600">*</span>
            </label>
            <input
              id={`${id}-phone`}
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              required
              value={phone}
              onChange={(e) => setPhone(normalizeLeadPhoneInput(e.target.value))}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--color-primary)]/35 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/15"
              placeholder="10-digit mobile (same rules as login)"
            />
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-company`} className="mb-1 block text-[11px] font-semibold text-slate-700 sm:text-xs">
              Company / business
            </label>
            <input
              id={`${id}-company`}
              name="company"
              type="text"
              autoComplete="organization"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--color-primary)]/35 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/15"
              placeholder="Optional"
            />
          </div>
          <div>
            <label htmlFor={`${id}-email`} className="mb-1 block text-[11px] font-semibold text-slate-700 sm:text-xs">
              Work email
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--color-primary)]/35 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/15"
              placeholder="Optional"
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${id}-city`} className="mb-1 block text-[11px] font-semibold text-slate-700 sm:text-xs">
            City / area
          </label>
          <input
            id={`${id}-city`}
            name="city"
            type="text"
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--color-primary)]/35 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/15"
            placeholder="e.g. Noida, Delhi NCR"
          />
        </div>

        <div>
          <label htmlFor={`${id}-message`} className="mb-1 block text-[11px] font-semibold text-slate-700 sm:text-xs">
            How can we help?
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={4}
            maxLength={1500}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--color-primary)]/35 focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/15"
            placeholder="Lanes, volumes, partnership type, or timing — short context helps us respond faster."
          />
          <p className="mt-1 text-[10px] text-slate-400">{message.length}/1500</p>
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50/40 px-3 py-2.5">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]/30"
          />
          <span className="text-[11px] leading-snug text-slate-600 sm:text-xs">
            I agree that Liftngo may call or email me about this enquiry.{' '}
            <Link href="/privacy" className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline">
              Privacy
            </Link>
            .
          </span>
        </label>

        {clientError ? (
          <p className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-xs leading-relaxed text-amber-950">
            {clientError}
          </p>
        ) : null}

        <button
          type="submit"
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-bold text-white shadow-sm transition-opacity hover:bg-[#20bd5a] sm:min-h-12 sm:w-auto sm:px-8"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2} aria-hidden />
          Send via WhatsApp
        </button>

        {SUPPORT_EMAIL ? (
          <p className="text-[10px] leading-relaxed text-slate-500 sm:text-xs">
            Prefer email? Reach us at{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[var(--color-primary)] hover:underline">
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        ) : null}
      </form>
    </section>
  );
}
