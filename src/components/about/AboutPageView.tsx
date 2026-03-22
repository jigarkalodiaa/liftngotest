import Image from 'next/image';
import Link from 'next/link';
import { ABOUT_FLEET_IMAGES, ABOUT_HERO_IMAGE } from '@/config/aboutImages';
import { BRAND, MISSION, VISION } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import {
  IconHeadset,
  IconInvoice,
  IconLayers,
  IconReceive,
  IconRoute,
  IconSenders,
  IconService,
  IconShield,
} from './AboutIcons';

/** Matches app-wide CTAs (services, promotions, QuickRidesSection, careers). */
const BTN_PRIMARY =
  'inline-flex w-full min-h-[48px] items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 sm:w-auto';

const BTN_PRIMARY_SM =
  'inline-flex w-full min-h-[48px] items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 sm:w-auto';

/** Matches Button.tsx secondary + Faq-style outline. */
const BTN_SECONDARY =
  'inline-flex w-full min-h-[48px] items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-800 hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 sm:w-auto';

const CARD =
  'rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md';

/** Typography scale — consistent across About (matches /services + /careers rhythm). */
const textEyebrow = 'text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)] sm:text-sm';
const textH1 = 'text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl';
const textH2 = 'text-2xl font-semibold text-gray-900 sm:text-3xl';
const textH3 = 'text-lg font-semibold text-gray-900';
const textLead = 'text-lg font-semibold leading-snug text-gray-900 sm:text-xl max-sm:leading-normal';
/** Slightly smaller on very narrow screens so the hero doesn’t feel like a solid text wall. */
const textProse = 'text-base leading-relaxed text-gray-600 sm:text-lg';
const textBody = 'text-base leading-relaxed text-gray-600';
const textAside = 'text-base leading-relaxed text-gray-800 sm:text-lg';
const textMutedBox = 'text-base leading-relaxed text-gray-700';

const AUDIENCE = [
  {
    title: 'Senders & growing brands',
    body: 'Ship inventory, samples, and B2B loads without losing sleep over pickup windows. Your dispatch shouldn’t feel like a side project—when a shipment leaves your door, your reputation rides with it.',
    Icon: IconSenders,
  },
  {
    title: 'Stores, hubs & receiving teams',
    body: 'Warehouses, outlets, and field crews that need clear ETAs and fewer “where is it?” calls. Every minute at the dock costs money—we help you protect both time and trust.',
    Icon: IconReceive,
  },
  {
    title: 'Liftngo in the middle',
    body: 'We’re not background noise in a crowded marketplace. We coordinate verified drivers, fair upfront pricing, and one booking flow—so you sell and serve instead of chasing drivers all day.',
    Icon: IconService,
  },
] as const;

const PILLARS = [
  {
    title: 'Built for cargo, not commutes',
    body: 'Passenger apps retrofit “delivery.” We don’t. Pickup → route → handoff is the spine of the product—because your ops team already thinks in shipments, not star ratings.',
    Icon: IconRoute,
  },
  {
    title: 'Fares your finance team can defend',
    body: 'See what you’ll pay before wheels turn—structured charges, fewer surprises. Plan budgets and margins with numbers you can stand behind in a meeting.',
    Icon: IconInvoice,
  },
  {
    title: 'Partners on the network—not random gigs',
    body: 'Drivers and fleet partners are vetted to meet our bar. Your consignment deserves accountability, not whoever tapped “accept” fastest.',
    Icon: IconShield,
  },
  {
    title: 'Less coordination theater',
    body: 'Digital booking, live tracking, and clear status cut the WhatsApp ping-pong. Spend energy on customers—not on chasing proof of where the truck is.',
    Icon: IconLayers,
  },
  {
    title: 'Humans when it matters',
    body: 'Stuck on a stop, a handoff, or an exception? Support is part of the experience—not a buried link next to the copyright.',
    Icon: IconHeadset,
  },
] as const;

const FLOW = [
  {
    step: '01',
    title: 'Book in one flow',
    desc: 'Pickup, drop, and what you’re moving—captured once, clearly, so nothing gets lost in translation.',
  },
  {
    step: '02',
    title: 'We match real capacity',
    desc: 'The right vehicle and partner for your lane and window—not the cheapest warm body.',
  },
  {
    step: '03',
    title: 'Track without the chase',
    desc: 'Live updates you can share inward. Fewer “call the driver” loops, more confidence on the floor.',
  },
  {
    step: '04',
    title: 'Close with proof',
    desc: 'A clean handoff your chain can audit—so “delivered” means delivered, not “probably.”',
  },
] as const;

export default function AboutPageView() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-10 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8 lg:py-20">
        {/*
          Mobile: eyebrow → title → graphic (visible above the fold) → copy → full-width CTAs.
          sm+: classic column with graphic after CTAs.
        */}
        <section className="mb-12 flex flex-col sm:mb-16">
          <p className={`order-1 mb-3 ${textEyebrow}`}>Goods-first · Not another ride app</p>
          <h1 className={`order-2 mb-4 ${textH1}`}>About {BRAND.name}</h1>

          <div className="order-3 mb-5 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100 shadow-sm sm:order-6 sm:mb-0 sm:mt-10">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-2xl">
              <Image
                src={ABOUT_HERO_IMAGE.src}
                alt={`${ABOUT_HERO_IMAGE.alt} — ${BRAND.name}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
            </div>
          </div>

          <p className={`order-4 mt-1 max-w-2xl sm:order-3 sm:mt-0 ${textLead}`}>
            We help businesses move goods with clarity—so every shipment feels{' '}
            <span className="text-[var(--color-primary)]">dependable</span>, not improvised.
          </p>
          <p className={`order-5 mt-4 max-w-2xl sm:order-4 sm:mt-5 ${textProse}`}>
            Your customers rarely care which vehicle shows up—they care that the{' '}
            <strong className="font-semibold text-gray-900">right goods arrive intact, on time, with proof</strong>. {BRAND.name} is the layer
            where senders, receivers, and drivers finally share the same story: one booking, one chain of custody, from pickup to handoff.
          </p>
          <div className="order-6 mt-8 flex flex-col gap-3 sm:order-5 sm:flex-row sm:flex-wrap">
            <Link href={ROUTES.PICKUP_LOCATION} className={BTN_PRIMARY_SM}>
              Book a shipment
            </Link>
            <Link href="/services" className={BTN_SECONDARY}>
              See how we deliver
            </Link>
          </div>
        </section>

        <aside
          className="mb-14 border-l-4 border-[var(--color-primary)] bg-[var(--color-primary)]/5 py-5 pl-5 pr-4 sm:mb-16 sm:py-6 sm:pl-6"
          aria-label="What makes us different"
        >
          <p className={textAside}>
            <span className="font-semibold text-gray-900">Our difference, in one line:</span> most platforms optimize for passengers. We
            optimize for <strong className="font-semibold text-[var(--color-primary)]">your cargo</strong>,{' '}
            <strong className="font-semibold text-[var(--color-primary)]">your timeline</strong>, and{' '}
            <strong className="font-semibold text-[var(--color-primary)]">your reputation</strong> at every handoff.
          </p>
        </aside>

        <section className="mb-14 sm:mb-16" aria-label="Ways we move your cargo">
          <div className="rounded-2xl border border-gray-100 bg-[#F7FAFF] px-5 py-8 shadow-sm sm:px-8 sm:py-10">
            <p className={`mb-6 text-center ${textH3}`}>How your shipment travels with {BRAND.name}</p>
            <p className={`mx-auto mb-8 max-w-2xl text-center ${textBody}`}>
              Same vehicle modes you see when you book—walk, two wheeler, and three wheeler—matched to your lane and load.
            </p>
            <ul className="mx-auto flex max-w-lg flex-col gap-6">
              {ABOUT_FLEET_IMAGES.map(({ src, label, alt }) => (
                <li key={src} className="flex flex-col gap-2">
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm ring-1 ring-gray-200/80">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 512px"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-14 sm:mb-16">
          <h2 className={`mb-3 ${textH2}`}>Why we’re here</h2>
          <p className={`max-w-2xl ${textProse}`}>
            Too many teams still run local logistics through ad-hoc calls, screenshots, and crossed fingers. That’s not a strategy—it’s stress
            with a spreadsheet. {BRAND.name} exists because{' '}
            <strong className="font-semibold text-gray-900">your shipment deserves a system</strong>: structured booking, honest pricing,
            and visibility that holds up when a client asks, “Where’s our order?”
          </p>
        </section>

        <section className="mb-14 sm:mb-16">
          <h2 className={`mb-3 ${textH2}`}>Who we built this for</h2>
          <p className={`mb-8 max-w-2xl ${textProse}`}>
            Whether you’re filling a shelf or closing a B2B deal, <strong className="font-semibold text-gray-900">every delivery is a promise</strong>.
            Here’s how we stand behind yours.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            {AUDIENCE.map(({ title, body, Icon }) => (
              <li key={title} className={`flex flex-col p-6 sm:p-7 ${CARD}`}>
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className={textH3}>{title}</h3>
                <p className={`mt-2 flex-1 ${textBody}`}>{body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14 sm:mb-16">
          <h2 className={`mb-3 ${textH2}`}>What you can count on</h2>
          <p className={`mb-8 max-w-2xl ${textProse}`}>
            Not buzzwords—behaviours we bake into the product so{' '}
            <strong className="font-semibold text-gray-900">you sound sharp in front of customers and colleagues</strong>.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {PILLARS.map(({ title, body, Icon }) => (
              <li key={title} className={`p-6 sm:p-7 ${CARD}`}>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className={`mt-4 ${textH3}`}>{title}</h3>
                <p className={`mt-2 ${textBody}`}>{body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14 sm:mb-16">
          <h2 className={`mb-3 ${textH2}`}>From booking to “delivered”</h2>
          <p className={`mb-8 max-w-2xl ${textProse}`}>
            The same journey your team already imagines—just finally <strong className="font-semibold text-gray-900">visible and repeatable</strong>.
          </p>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {FLOW.map((item) => (
              <li key={item.step}>
                <div className={`h-full p-6 ${CARD}`}>
                  <span className="text-xs font-bold tabular-nums text-[var(--color-primary)]">{item.step}</span>
                  <h3 className={`mt-2 ${textH3}`}>{item.title}</h3>
                  <p className={`mt-2 ${textBody}`}>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-14 sm:mb-16">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-[var(--landing-primary)]/20 bg-[var(--landing-primary)]/10 p-6 sm:p-8">
              <h2 className={textH3}>Our mission</h2>
              <p className={`mt-3 ${textMutedBox}`}>{MISSION}</p>
            </div>
            <div className="rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 p-6 sm:p-8">
              <h2 className={textH3}>Our vision</h2>
              <p className={`mt-3 ${textMutedBox}`}>{VISION}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-10">
          <h2 className={textH2}>Ready to ship with clarity?</h2>
          <p className={`mx-auto mt-3 max-w-lg ${textProse}`}>
            One urgent parcel or a lane you run every week—start with a booking and feel what it’s like when{' '}
            <strong className="font-semibold text-gray-900">logistics finally works for you</strong>, not against you.
          </p>
          <Link href={ROUTES.PICKUP_LOCATION} className={`${BTN_PRIMARY} mt-8`}>
            Start a booking
          </Link>
        </section>
      </div>
    </main>
  );
}
