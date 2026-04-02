'use client';

import Link from 'next/link';
import WhatsAppButton from '@/components/marketing/WhatsAppButton';
import { ROUTES } from '@/lib/constants';

const sectionShell = 'mx-auto max-w-7xl px-5 sm:px-6 lg:px-8';

export default function HomeConversionSections() {
  return (
    <>
      {/* How it works */}
      <section
        className="border-t border-gray-200/80 bg-white py-12 sm:py-16"
        aria-labelledby="how-it-works-heading"
      >
        <div className={sectionShell}>
          <h2
            id="how-it-works-heading"
            className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
          >
            How it works
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-600 sm:text-base">
            Khatu delivery and logistics in three simple steps — no app download required.
          </p>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Share pickup & drop on WhatsApp',
                body: 'Send addresses or pin locations — we confirm instantly.',
              },
              {
                step: '2',
                title: 'We assign a driver',
                body: 'Nearest verified partner is matched for your lane.',
              },
              {
                step: '3',
                title: 'Delivery in 15–25 minutes',
                body: 'Track handoff and pay as agreed — fixed ₹50 delivery where applicable.',
              },
            ].map((item) => (
              <li
                key={item.step}
                className="relative rounded-2xl border border-gray-100 bg-[var(--landing-bg)] p-6 text-center shadow-sm"
              >
                <span
                  className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white"
                  aria-hidden
                >
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* B2B positioning */}
      <section
        className="border-t border-gray-200/80 bg-gradient-to-b from-white to-[var(--landing-bg)] py-12 sm:py-16"
        aria-labelledby="b2b-heading"
      >
        <div className={sectionShell}>
          <h2
            id="b2b-heading"
            className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
          >
            For hotels, restaurants &amp; suppliers
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-600 sm:text-base">
            One Khatu logistics partner for food runs, laundry, supplies, and goods —{' '}
            <span className="font-medium text-gray-800">hotel delivery Khatu</span> and corridor B2B,
            without building an in-house fleet.
          </p>
          <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              'No need to hire full-time delivery staff',
              'One partner for food, laundry & supplies',
              'Priority support for recurring lanes',
            ].map((text) => (
              <li
                key={text}
                className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4 text-sm font-medium text-gray-800 shadow-sm"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  ✓
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={ROUTES.CONTACT}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
            >
              Partner with Liftngo
            </Link>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <Link
                href={ROUTES.FOR_HOTELS}
                className="rounded-lg px-3 py-2 font-medium text-[var(--color-primary)] underline-offset-2 hover:underline"
              >
                Hotels
              </Link>
              <span className="text-gray-300" aria-hidden>
                ·
              </span>
              <Link
                href={ROUTES.FOR_RESTAURANTS}
                className="rounded-lg px-3 py-2 font-medium text-[var(--color-primary)] underline-offset-2 hover:underline"
              >
                Restaurants
              </Link>
              <span className="text-gray-300" aria-hidden>
                ·
              </span>
              <Link
                href={ROUTES.FOR_SUPPLIERS}
                className="rounded-lg px-3 py-2 font-medium text-[var(--color-primary)] underline-offset-2 hover:underline"
              >
                Suppliers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services & pricing */}
      <section className="border-t border-gray-200/80 bg-white py-12 sm:py-16" aria-labelledby="pricing-heading">
        <div className={sectionShell}>
          <h2
            id="pricing-heading"
            className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
          >
            Clear pricing in Khatu
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-600">
            Indicative rates — final quote on WhatsApp or book online.
          </p>
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
            {[
              { name: 'Food delivery', price: '₹50', note: 'Fixed local delivery' },
              { name: 'Laundry', price: '₹80–₹120', note: 'Pickup & drop' },
              { name: 'Supplies', price: '₹100+', note: 'Shops & stockists' },
              { name: 'Goods / transport', price: '₹150+', note: 'Heavier or longer routes' },
            ].map((row) => (
              <div
                key={row.name}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-[var(--landing-bg)] px-5 py-4 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-900">{row.name}</p>
                  <p className="text-xs text-gray-500">{row.note}</p>
                </div>
                <p className="text-lg font-bold text-[var(--color-primary)] tabular-nums">{row.price}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-gray-400">*Subject to distance and vehicle type.</p>
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-gray-200/80 bg-[var(--landing-bg)] py-12 sm:py-16" aria-labelledby="trust-heading">
        <div className={sectionShell}>
          <h2
            id="trust-heading"
            className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl"
          >
            Trusted in Khatu
          </h2>
          <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/80 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm">
              <p className="text-3xl font-bold text-[var(--color-primary)] tabular-nums">1500+</p>
              <p className="mt-1 text-sm font-medium text-gray-800">Deliveries completed</p>
              <p className="mt-2 text-xs text-gray-500">Hyperlocal Khatu corridor &amp; partner routes</p>
            </div>
            <div className="rounded-2xl border border-white/80 bg-white/80 p-6 text-center shadow-sm backdrop-blur-sm">
              <p className="text-sm font-semibold text-gray-900">Trusted by local hotels</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-600">
                B2B onboarding for properties, kitchens, and suppliers — consistent SLAs and support.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-3">
            {['Hotel partners', 'Restaurant runs', 'Local suppliers'].map((label) => (
              <span
                key={label}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <WhatsAppButton
              trackSource="home_trust_whatsapp"
              prefillMessage="Hi Liftngo — I’d like to know more about Khatu delivery for my business."
              className="min-h-12 px-8"
            >
              Chat on WhatsApp
            </WhatsAppButton>
            <Link
              href={ROUTES.CONTACT}
              className="text-sm font-medium text-[var(--color-primary)] underline-offset-2 hover:underline"
            >
              Contact form →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
