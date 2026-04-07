import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import { ABOUT_FLEET_IMAGES, ABOUT_HERO_IMAGE } from '@/config/aboutImages';
import { BRAND, MISSION, VISION } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import {
  IconEv,
  IconHeadset,
  IconInvoice,
  IconLayers,
  IconReceive,
  IconRoute,
  IconSenders,
  IconService,
  IconShield,
} from './AboutIcons';

const BTN_PRIMARY =
  'inline-flex w-full min-h-[48px] items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 sm:w-auto';

const BTN_SECONDARY =
  'inline-flex w-full min-h-[48px] items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-800 shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 sm:w-auto';

const CARD =
  'rounded-2xl border border-gray-100/80 bg-white shadow-sm transition-shadow hover:shadow-md hover:border-[var(--color-primary)]/20';

const textH2 = 'text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl';
const textH3 = 'text-lg font-semibold text-gray-900';
const textLead = 'text-lg font-semibold leading-snug text-gray-900 sm:text-xl';
const textProse = 'text-base leading-relaxed text-gray-600 sm:text-lg';
const textBody = 'text-base leading-relaxed text-gray-600';

type HighlightItem = {
  label: string;
  value: string;
  detail: string;
  /** When set, the whole tile links to a detail page (SEO + depth). */
  href?: string;
  linkCta?: string;
};

const HIGHLIGHTS: HighlightItem[] = [
  {
    label: 'Built for B2B',
    value: 'Every business that moves goods',
    detail:
      'Manufacturers, wholesalers, distributors, shop owners, household supplies, and all kinds of B2B delivery—from daily stock runs to urgent handoffs.',
    href: ROUTES.ABOUT_B2B_LOGISTICS,
    linkCta: 'Read more about B2B logistics',
  },
  {
    label: 'EV & fuel cargo',
    value: 'Electric three-wheel cargo',
    detail:
      'Compact loaders for intra city loads—electric where it wins, plus CNG, diesel, and petrol three-wheelers when that fits the lane.',
    href: ROUTES.ABOUT_THREE_WHEEL_CARGO,
    linkCta: 'Read more about three-wheel cargo',
  },
  {
    label: 'Hyperlocal depth',
    value: 'Khatu & nearby',
    detail:
      'Launching with Khatu Shyam Ji, Rajasthan: guest houses, restaurants, dharamshalas, shops, and supply runs—plus trusted ways to explore local food and retail.',
    href: ROUTES.ABOUT_KHATU_SUPPLY_CHAIN,
    linkCta: 'Read more about Khatu & supply chain',
  },
];

const AUDIENCE = [
  {
    title: 'Retail & kirana',
    body: 'Stock transfers, shop-to-shop runs, and rush replenishment without chasing drivers on phone.',
    Icon: IconSenders,
  },
  {
    title: 'Wholesalers & vendors',
    body: 'Predictable handoffs for crates, cartons, and event material with upfront fares.',
    Icon: IconReceive,
  },
  {
    title: 'Liftngo in the middle',
    body: 'One booking flow, vetted driver partners, and visibility geared to cargo—not passenger star ratings.',
    Icon: IconService,
  },
] as const;

const PILLARS = [
  {
    title: 'Goods-first, not cab-second',
    body: 'We move consignments and timelines—not commuters. Your ops team thinks in pickups and proof of delivery; so do we.',
    Icon: IconRoute,
  },
  {
    title: 'Fares you can plan around',
    body: 'Distance- and demand-aware pricing, quoted before the vehicle rolls—healthier for margins and driver utilisation.',
    Icon: IconInvoice,
  },
  {
    title: 'Right power for the lane',
    body: 'Electric three-wheel cargo where charging and mileage fit; CNG, diesel, or petrol units when the job demands it—same booking flow either way.',
    Icon: IconEv,
  },
  {
    title: 'Accountable partners',
    body: 'Drivers are on salary-plus-incentive models with performance gates—so reliability is built into the network, not hoped for.',
    Icon: IconShield,
  },
  {
    title: 'Less coordination noise',
    body: 'Structured status and support when a stop or handoff goes sideways—fewer “where is my load?” loops.',
    Icon: IconLayers,
  },
  {
    title: 'Humans in the loop',
    body: 'Real help for exceptions—support is part of the service, not an afterthought below the footer.',
    Icon: IconHeadset,
  },
] as const;

const FLOW = [
  {
    step: '01',
    title: 'Book pickup → drop',
    desc: 'Tell us what moves, from where to where. Estimate shows before you confirm.',
  },
  {
    step: '02',
    title: 'Match capacity',
    desc: 'Walk, two-wheeler, or three-wheeler (EV or CNG/diesel/petrol)—matched to lane, load, and window.',
  },
  {
    step: '03',
    title: 'Track progress',
    desc: 'Share status inward; cut down on ad-hoc calls to the driver.',
  },
  {
    step: '04',
    title: 'Close with clarity',
    desc: 'Handoff and completion anchored so “delivered” is auditable for your team.',
  },
] as const;

export default function AboutPageView() {
  const heroAside = (
    <div>
      <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl ring-1 ring-white/10 backdrop-blur-sm">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={ABOUT_HERO_IMAGE.src}
            alt={ABOUT_HERO_IMAGE.alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 400px"
            priority
          />
        </div>
      </div>
      <p className="mt-3 text-center text-xs text-white/65 sm:text-left">
        Walk, two-wheeler, and three-wheeler cargo—EV or fuel matched to your lane.
      </p>
    </div>
  );

  return (
    <article className="flex-1">
      <MarketingPageShell
        badge="Hyperlocal logistics · EV & fuel cargo"
        title={<>About {BRAND.name}</>}
        lead={`${BRAND.name} is your intra-city goods transport partner for B2B—three-wheel cargo (electric, CNG, diesel, petrol as the lane demands), upfront pricing, and depth in Khatu Shyam Ji and dense markets. We are not a passenger cab app: deliveries, wholesale drops, and corridor logistics with POD-friendly handoffs.`}
        chips={['B2B & wholesale first', '3W EV + fuel', 'Khatu · NCR lanes']}
        links={[
          { href: ROUTES.PICKUP_LOCATION, label: 'Book a delivery' },
          { href: '/services', label: 'Services' },
          { href: '/faq', label: 'FAQs' },
          { href: '/contact', label: 'Contact' },
        ]}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'About' },
        ]}
        heroAside={heroAside}
      >
        <div className="w-full pb-8 pt-2 sm:pb-12 sm:pt-4">
        {/* Quick facts */}
        <section className="mb-14 sm:mb-16" aria-label="Liftngo at a glance">
          <ul className="grid gap-4 sm:grid-cols-3">
            {HIGHLIGHTS.map((item) => {
              const inner = (
                <>
                  <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
                    {item.label}
                  </span>
                  <span className="mt-2 text-xl font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">
                    {item.value}
                  </span>
                  <p className={`mt-2 flex-1 ${textBody}`}>{item.detail}</p>
                  {item.href ? (
                    <span className="mt-4 text-sm font-semibold text-[var(--color-primary)] group-hover:underline">
                      {item.linkCta ?? 'Learn more'} →
                    </span>
                  ) : null}
                </>
              );

              if (item.href) {
                return (
                  <li key={item.label} className="h-full">
                    <Link
                      href={item.href}
                      className={`group flex h-full flex-col px-6 py-6 sm:px-7 sm:py-7 ${CARD} focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2`}
                    >
                      {inner}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.label} className={`flex flex-col px-6 py-6 sm:px-7 sm:py-7 ${CARD}`}>
                  {inner}
                </li>
              );
            })}
          </ul>
        </section>

        <aside
          className="mb-14 rounded-2xl border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/[0.04] p-6 sm:mb-16 sm:p-8"
          aria-label="Positioning"
        >
          <p className={`max-w-3xl text-base leading-relaxed text-gray-800 sm:text-lg`}>
            <span className="font-semibold text-gray-900">Why teams choose us:</span> we optimise for{' '}
            <strong className="text-[var(--color-primary)]">cargo utilisation</strong>,{' '}
            <strong className="text-[var(--color-primary)]">repeat bookings</strong>, and{' '}
            <strong className="text-[var(--color-primary)]">trust at the handoff</strong>—the three things that decide
            whether hyperlocal logistics actually scales.
          </p>
        </aside>

        {/* Fleet modes */}
        <section className="mb-14 sm:mb-16" aria-labelledby="fleet-heading">
          <div className="rounded-3xl border border-gray-100 bg-gradient-to-b from-[#F8FAFC] to-white px-5 py-10 shadow-sm sm:px-10 sm:py-12">
            <h2 id="fleet-heading" className={`mb-2 text-center ${textH2}`}>
              How your load moves
            </h2>
            <p className={`mx-auto mb-10 max-w-2xl text-center ${textBody}`}>
              Pick the vehicle class that fits the lane—{BRAND.name} stays focused on short, city-scale movement rather than
              long-haul freight.
            </p>
            <ul className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-3 sm:gap-6">
              {ABOUT_FLEET_IMAGES.map(({ src, label, alt }) => (
                <li key={src} className="flex flex-col gap-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm ring-1 ring-gray-200/70">
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 100vw, 280px"
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-14 sm:mb-16">
          <h2 className={`mb-4 ${textH2}`}>Our story on the ground</h2>
          <p className={`max-w-3xl ${textProse}`}>
            Local logistics still runs on fragmented calls and guesswork. {BRAND.name} exists to give{' '}
            <strong className="font-semibold text-gray-900">small and mid-sized businesses</strong> the same clarity larger
            players expect: a real booking system, transparent pricing, and drivers who earn through{' '}
            <strong className="font-semibold text-gray-900">salary plus duty-based incentives</strong>—so when utilisation
            dips, the product and commercial model push together toward more rides per vehicle, not one-off gambles.
          </p>
        </section>

        <section className="mb-14 sm:mb-16">
          <h2 className={`mb-3 ${textH2}`}>Who we built this for</h2>
          <p className={`mb-8 max-w-2xl ${textProse}`}>
            If your day depends on goods arriving on time—whether to a counter, a mandir corridor, or an event gate—we are
            built for you.
          </p>
          <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
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
            Practical promises—so finance, ops, and your customer-facing team stay aligned.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
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
          <h2 className={`mb-3 ${textH2}`}>From booking to delivered</h2>
          <p className={`mb-8 max-w-2xl ${textProse}`}>
            A simple chain you can repeat daily—whether you run three rides or thirty across your fleet over time.
          </p>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {FLOW.map((item) => (
              <li key={item.step}>
                <div className={`flex h-full flex-col p-6 ${CARD}`}>
                  <span className="text-xs font-bold tabular-nums text-[var(--color-primary)]">{item.step}</span>
                  <h3 className={`mt-2 ${textH3}`}>{item.title}</h3>
                  <p className={`mt-2 flex-1 ${textBody}`}>{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-14 sm:mb-16" aria-labelledby="mission-vision-heading">
          <h2 id="mission-vision-heading" className="sr-only">
            Mission and vision
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-[var(--landing-primary)]/25 bg-[var(--landing-primary)]/[0.07] p-6 sm:p-8">
              <h3 className={textH3}>Mission</h3>
              <p className={`mt-3 ${textBody} text-gray-800`}>{MISSION}</p>
            </div>
            <div className="rounded-3xl border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/[0.06] p-6 sm:p-8">
              <h3 className={textH3}>Vision</h3>
              <p className={`mt-3 ${textBody} text-gray-800`}>{VISION}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-12">
          <h2 className={textH2}>Ship with a partner that thinks in loads, not trips wasted</h2>
          <p className={`mx-auto mt-4 max-w-2xl ${textProse}`}>
            Try a booking today—or talk to us about recurring lanes for your shop or warehouse. We also hire operators who
            want predictable, incentive-clear work: see open roles on our careers page.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link href={ROUTES.PICKUP_LOCATION} className={BTN_PRIMARY}>
              Start a booking
            </Link>
            <Link href="/careers" className={BTN_SECONDARY}>
              Careers
            </Link>
          </div>
        </section>
        </div>
      </MarketingPageShell>
    </article>
  );
}
