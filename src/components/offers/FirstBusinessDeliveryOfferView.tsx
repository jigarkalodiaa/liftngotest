import ContentLayout from '@/components/layout/ContentLayout';
import OfferWhatsAppLink from '@/components/offers/OfferWhatsAppLink';
import { offerCtaWhatsapp } from '@/components/offers/offerCtaStyles';
import { B2B_OFFER_IMAGE_PATH, B2B_OFFER_LANDING_PATH } from '@/lib/b2bOffer';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';
import { SITE_NAME } from '@/lib/site';
import {
  BadgeCheck,
  Building2,
  CheckCircle2,
  Factory,
  IndianRupee,
  MessageCircle,
  Package,
  ShoppingBag,
  Store,
  Truck,
  Warehouse,
} from 'lucide-react';

const TRUST_ITEMS = [
  'Verified Drivers',
  'On-Time Delivery',
  'Dedicated Booking Support',
  'Transparent Pricing',
  'GST Invoicing',
  'Business-Focused Logistics',
] as const;

const WHO_CARDS = [
  { icon: Factory, label: 'Factories' },
  { icon: Store, label: 'Retailers' },
  { icon: Package, label: 'Distributors' },
  { icon: Warehouse, label: 'Warehouses' },
  { icon: ShoppingBag, label: 'E-commerce sellers' },
  { icon: Truck, label: 'Packers & Movers' },
] as const;

const STEPS = [
  'Contact LiftnGo on WhatsApp',
  'Share GST Number',
  'Get vehicle availability confirmation',
  'Book your trip',
  'Enjoy free delivery or promotional discount',
] as const;

const TERMS = [
  'Valid for GST registered businesses only',
  'Applicable for first-time customers only',
  'Free delivery valid for 3-wheeler category only',
  'Free delivery valid up to 7 KM',
  'Subject to vehicle availability',
  'Maximum 4 free bookings released daily',
  'If free slots are unavailable, users may claim 70% OFF up to ₹250',
  'Minimum order value ₹999 applies to discount offer',
  'LiftnGo reserves the right to modify or withdraw the offer',
] as const;

const sectionCard =
  'rounded-2xl border border-[var(--landing-primary)]/15 bg-white p-6 shadow-[0_4px_24px_-8px_rgba(44,45,91,0.1)] sm:p-8';

export default function FirstBusinessDeliveryOfferView() {
  return (
    <ContentLayout
      breadcrumbs={[
        BREADCRUMB_HOME,
        { name: 'First Business Delivery FREE', path: B2B_OFFER_LANDING_PATH },
      ]}
    >
      <article className="flex-1 bg-[var(--landing-bg)]">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1e1f4b] via-[#2C2D5B] to-[#151632] text-white">
          <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" aria-hidden />
          <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-amber-200">
              Delhi NCR · B2B Logistics
            </p>
            <h1 className="mt-5 text-pretty text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[2.65rem]">
              <span aria-hidden className="me-1">
                🚚
              </span>
              First Business Delivery FREE*
            </h1>
            <p className="mt-3 text-lg font-semibold text-white/90 sm:text-xl">
              For GST Registered Businesses in Delhi NCR
            </p>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/75">
              Try {SITE_NAME}&apos;s logistics service risk-free.
            </p>
            <div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-white shadow-[0_16px_48px_-12px_rgba(0,0,0,0.35)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={B2B_OFFER_IMAGE_PATH}
                alt="LiftnGo First Delivery FREE — up to 7 KM, 70% off up to ₹250, Delhi Noida Gurgaon"
                width={840}
                height={1050}
                className="block h-auto w-full object-contain"
                decoding="async"
                fetchPriority="high"
              />
            </div>
            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
              {['Trusted Drivers', 'Dedicated Support', 'Fast Booking', 'GST Invoice Available'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-medium text-white/90">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-amber-300" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <OfferWhatsAppLink
                trackSource="b2b_offer_landing_hero_whatsapp"
                className={`${offerCtaWhatsapp} w-full sm:w-auto sm:min-w-[240px]`}
              >
                <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
                Claim Free Delivery
              </OfferWhatsAppLink>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {/* Primary offer */}
          <section className={sectionCard} aria-labelledby="offer-primary-heading">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-700">
                <BadgeCheck className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--landing-primary)]">
                  Primary offer
                </p>
                <h2 id="offer-primary-heading" className="mt-1 text-2xl font-extrabold text-gray-900">
                  FREE DELIVERY
                </h2>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-gray-700">Applicable only for:</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              {[
                'First-time business customers',
                'GST registered businesses',
                '3-wheeler category',
                'Up to 7 KM distance',
                'Subject to vehicle availability',
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--landing-primary)]" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </section>

          {/* Fallback offer */}
          <section className={sectionCard} aria-labelledby="offer-fallback-heading">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
              If free delivery is not available
            </p>
            <h2 id="offer-fallback-heading" className="mt-2 text-2xl font-extrabold text-gray-900">
              70% OFF
            </h2>
            <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-[var(--landing-primary)]">
              <IndianRupee className="h-5 w-5" aria-hidden />
              Maximum Discount: ₹250
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" aria-hidden />
                Minimum order value ₹999
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" aria-hidden />
                Applicable on first booking
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" aria-hidden />
                Subject to availability
              </li>
            </ul>
          </section>

          {/* How it works */}
          <section aria-labelledby="how-it-works-heading">
            <h2 id="how-it-works-heading" className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
              How It Works
            </h2>
            <ol className="mt-8 space-y-4">
              {STEPS.map((step, i) => (
                <li
                  key={step}
                  className="flex gap-4 rounded-2xl border border-[var(--landing-primary)]/12 bg-white p-4 shadow-sm sm:p-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="pt-2 text-base font-semibold text-gray-900">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Who can use */}
          <section aria-labelledby="who-heading">
            <h2 id="who-heading" className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
              Who Can Use This Offer
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {WHO_CARDS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--landing-primary)]/12 bg-white p-4 shadow-sm"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--landing-primary)]/[0.08] text-[var(--landing-primary)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="font-semibold text-gray-900">{label}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Trust */}
          <section className={sectionCard} aria-labelledby="trust-heading">
            <div className="flex items-center gap-2">
              <Building2 className="h-7 w-7 text-[var(--landing-primary)]" aria-hidden />
              <h2 id="trust-heading" className="text-xl font-bold text-gray-900 sm:text-2xl">
                Why Businesses Choose LiftnGo
              </h2>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {TRUST_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Terms */}
          <section className="rounded-2xl border border-gray-200 bg-white/80 p-6 sm:p-8" aria-labelledby="terms-heading">
            <h2 id="terms-heading" className="text-lg font-bold text-gray-900">
              Terms &amp; Conditions
            </h2>
            <ul className="mt-4 list-disc space-y-2 ps-5 text-sm leading-relaxed text-gray-600">
              {TERMS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>

          {/* Bottom CTA */}
          <section className="rounded-2xl bg-gradient-to-br from-[#2C2D5B] to-[#1e1f4b] p-6 text-center text-white sm:p-10">
            <h2 className="text-xl font-bold sm:text-2xl">Ready to claim your business offer?</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/75">
              Message us on WhatsApp with your GST details — our team confirms slot availability for 3W delivery
              up to 7 KM in Delhi NCR.
            </p>
            <OfferWhatsAppLink
              trackSource="b2b_offer_landing_footer_whatsapp"
              className={`${offerCtaWhatsapp} mt-6 w-full sm:mx-auto sm:w-auto sm:min-w-[260px]`}
            >
              <MessageCircle className="h-5 w-5 shrink-0" aria-hidden />
              Claim Free Delivery on WhatsApp
            </OfferWhatsAppLink>
          </section>
        </div>
      </article>
    </ContentLayout>
  );
}
