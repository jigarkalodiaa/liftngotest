import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { B2B_OFFER_PHONE_DISPLAY } from '@/lib/b2bOffer';
import {
  BadgeIndianRupee,
  Building2,
  Clock3,
  Factory,
  Headphones,
  Package,
  ShieldCheck,
  ShoppingBag,
  Store,
  Truck,
} from 'lucide-react';

const WHY_CARDS = [
  {
    icon: Clock3,
    title: 'Fast Booking',
    description: 'Get vehicles quickly when you need them.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Real humans available to help.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Drivers',
    description: 'Professional and reliable fleet.',
  },
  {
    icon: BadgeIndianRupee,
    title: 'Transparent Pricing',
    description: 'No hidden surprises.',
  },
] as const;

const SEGMENTS = [
  { icon: Factory, label: 'Factories' },
  { icon: Store, label: 'Retailers' },
  { icon: Package, label: 'Distributors' },
  { icon: ShoppingBag, label: 'E-commerce' },
  { icon: Truck, label: 'Packers & Movers' },
] as const;

const cardClass =
  'rounded-xl border border-[var(--landing-primary)]/15 bg-[var(--landing-bg)] p-4 shadow-[0_2px_12px_-4px_rgba(44,45,91,0.08)]';

/** Crawlable B2B offer + Delhi NCR copy — matches homepage SEO section styling. */
export default function HomeB2bOfferSeo() {
  return (
    <section
      className="page-section border-y border-[var(--landing-primary)]/10 bg-white"
      aria-labelledby="b2b-offer-seo-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl border border-[var(--landing-primary)]/20 bg-[var(--landing-bg)]/60 p-6 sm:p-8"
          style={{ boxShadow: '0 4px 32px -8px rgba(44, 45, 91, 0.12)' }}
        >
          <p className="mb-2 text-center text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[var(--landing-primary)] sm:text-xs">
            Delhi NCR · B2B logistics
          </p>
          <h2
            id="b2b-offer-seo-heading"
            className="text-pretty text-center text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl"
          >
            First Business Delivery FREE for GST-Registered Companies
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed text-gray-700 sm:mt-5 sm:text-lg">
            LiftnGo helps <strong className="font-semibold text-gray-900">factories, manufacturers, distributors, retail chains, furniture businesses, e-commerce sellers, warehouses, and packers &amp; movers</strong> move goods across Delhi NCR with upfront pricing, verified drivers, GST-compliant invoicing, and dedicated business support. New GST-registered businesses can claim a{' '}
            <strong className="font-semibold text-gray-900">first business delivery free</strong> (subject to daily slot availability and route eligibility).
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-center text-sm leading-relaxed text-gray-600 sm:text-base">
            When promotional free slots are full, eligible first-time users may receive up to{' '}
            <strong className="font-semibold text-gray-900">70% off</strong> (maximum ₹250). GST verification is required; offer applies to first-time business users on eligible vehicle categories up to 7 km while slots last.
          </p>

          <h3 className="mt-10 text-center text-lg font-bold text-gray-900 sm:text-xl">
            Why Businesses Choose LiftnGo
          </h3>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {WHY_CARDS.map(({ icon: Icon, title, description }) => (
              <li key={title} className={cardClass}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--landing-primary)]/[0.08] text-[var(--landing-primary)]">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h4 className="mt-3 text-base font-bold text-gray-900">{title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{description}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-[var(--landing-primary)]/15 bg-white p-5 sm:p-6">
            <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-3">
              <Building2 className="h-7 w-7 text-[var(--landing-primary)]" aria-hidden />
              <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Built For Growing Businesses</h3>
            </div>
            <ul className="mt-5 flex flex-wrap justify-center gap-2.5 sm:gap-3">
              {SEGMENTS.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--landing-primary)]/15 bg-[var(--landing-primary)]/[0.04] px-3.5 py-2 text-sm font-semibold text-gray-800">
                    <Icon className="h-4 w-4 text-[var(--landing-primary)]" aria-hidden />
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Speak with our business desk on WhatsApp ({B2B_OFFER_PHONE_DISPLAY}) or explore{' '}
            <Link href={ROUTES.NOIDA_B2B_LOGISTICS} className="font-semibold text-[var(--landing-primary)] hover:underline">
              Noida B2B logistics
            </Link>
            ,{' '}
            <Link href={ROUTES.B2B_TRANSPORT} className="font-semibold text-[var(--landing-primary)] hover:underline">
              B2B transport
            </Link>
            , and{' '}
            <Link href={ROUTES.PLANS_GST} className="font-semibold text-[var(--landing-primary)] hover:underline">
              GST billing plans
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
