import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { ArrowRight, Check, Headphones, Lock, MessageCircle, Receipt, Star, Zap } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { NOIDA_B2B_LANDING_FAQ } from '@/data/noidaB2bLandingFaq';
import {
  SUBSCRIPTION_PACKS_3W,
  formatSubscriptionRupee,
  subscriptionPackLockHref,
  subscriptionPackSavingsLabel,
} from '@/lib/pricing/subscriptionPacks';
import BlogCaseStudyFaq from '@/components/blog/BlogCaseStudyFaq';

const caseStudySans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

/** Deep navy — matches reference landing hero (#051937). */
const NAVY = '#051937';
const ROYAL = '#2563eb';

const FLEET = [
  {
    label: '2-Wheeler (EV)',
    sub: 'Max 20kg · documents & small boxes',
    price: '₹39',
    hint: 'Short-distance 2W base trip',
    img: '/dashboard/goods-two-wheeler.svg',
    highlight: false,
  },
  {
    label: '3-Wheeler (750kg)',
    sub: 'Standard industrial load · Sector 63 fav.',
    price: '₹310',
    hint: 'Most-used lane; pack locks lower in-pack rates',
    img: '/dashboard/goods-three-wheeler.svg',
    highlight: true,
  },
  {
    label: '4-Wheeler (1.5 Ton)',
    sub: 'Bulk shipments · distribution hubs',
    price: '₹650',
    hint: 'Heavier lanes — confirm in booking flow',
    img: '/dashboard/goods-four-wheeler.svg',
    highlight: false,
  },
] as const;

const EXTRA_FAQ = [
  {
    question: 'Is there a long-term commitment?',
    answer:
      'Trip packs run on a 30-day validity window from activation unless your order says otherwise. You choose when to renew or switch tiers—no multi-year lock-in on standard subscription SKUs shown on the dashboard.',
  },
  {
    question: 'How do you handle loading and unloading?',
    answer:
      'Standard handoffs at your premises include normal loading / unloading. Long dock waits, lift-only sites, or extra labour beyond a normal handoff may need a separate quote—see plan terms and your booking confirmation.',
  },
  {
    question: 'Can I track multiple vehicles at once?',
    answer:
      'Each live trip is visible in the app on supported tiers; higher subscription packs include live GPS. Basic tracking may apply on entry packs—match what you sell to customers to the tier you purchase.',
  },
  {
    question: 'Do you serve Greater Noida and Ghaziabad?',
    answer:
      'Liftngo operates across Delhi NCR where the product is enabled for your account. Pin your zone in the app and confirm the route in the booking flow—final serviceability follows live maps and dispatch rules.',
  },
  {
    question: 'What happens if a vehicle breaks down?',
    answer:
      'Escalate through support in-app; we work to substitute equivalent capacity where safety and availability allow. Precise remedies follow your order and the Terms of Service.',
  },
  {
    question: 'How is billing handled for extra trips?',
    answer:
      'Trips beyond your pack balance are quoted as ad hoc bookings before dispatch, or you can renew / upgrade packs. GST and pass-throughs (tolls, etc.) bill on actuals where applicable.',
  },
  {
    question: 'Is goods insurance included?',
    answer:
      'Default bookings follow the commercial terms in your confirmation. If you need declared-value cover, ask in Contact before dispatch so we can align on what’s available for your lane.',
  },
] as const;

const CASE_STUDY_FAQ = [...NOIDA_B2B_LANDING_FAQ.map((x) => ({ question: x.question, answer: x.answer })), ...EXTRA_FAQ];

export type BlogNoidaCaseStudyShellProps = {
  title: string;
  description: string;
  minutes: number;
  authorLabel: string;
  whatsappHref: string | null;
};

export default function BlogNoidaCaseStudyShell({ title, description, minutes, authorLabel, whatsappHref }: BlogNoidaCaseStudyShellProps) {
  const growthPack = SUBSCRIPTION_PACKS_3W.find((p) => p.popular) ?? SUBSCRIPTION_PACKS_3W[1];

  return (
    <div className={`noida-case-study-surface space-y-0 ${caseStudySans.className}`}>
      {/* Hero + stats ribbon — one elevated card like reference */}
      <div className="overflow-hidden rounded-3xl shadow-[0_24px_64px_-14px_rgba(5,25,55,0.32)] ring-1 ring-slate-900/12">
        <section
          className="relative overflow-hidden rounded-none"
          style={{ background: `linear-gradient(155deg, ${NAVY} 0%, #0d2d52 45%, #061526 100%)` }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_80%_-10%,rgba(37,99,235,0.18),transparent_55%)]" aria-hidden />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_0%_100%,rgba(255,255,255,0.06),transparent_50%)]" aria-hidden />
          <div className="relative grid gap-10 px-5 py-12 sm:px-8 sm:py-14 lg:grid-cols-[1fr_minmax(240px,280px)] lg:items-center lg:gap-12 lg:px-12 lg:py-16">
            <div className="min-w-0">
              <span className="inline-flex items-center rounded-full border border-amber-700/50 bg-amber-950/40 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-100/95 sm:text-[11px]">
                Case study
              </span>
              <h1 className="mt-5 text-balance text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-[2.75rem] lg:text-[2.85rem]">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-sky-100/95 sm:text-lg">{description}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-white/75 sm:text-sm">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-md"
                  style={{ backgroundColor: ROYAL }}
                  aria-hidden
                >
                  L
                </span>
                <span className="font-medium">
                  {authorLabel}
                  <span className="text-white/55"> · </span>
                  {minutes} min read
                </span>
              </div>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/25 transition hover:brightness-95"
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden />
                    WhatsApp us
                  </a>
                ) : null}
                <Link
                  href={ROUTES.PLANS_SUBSCRIPTION}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
                  style={{ backgroundColor: ROYAL }}
                >
                  View subscriptions
                </Link>
                <Link
                  href={ROUTES.PLANS_CUSTOM}
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-white/40 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Cost calculator
                </Link>
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-[280px] flex-col items-center justify-center lg:mx-0 lg:justify-self-end">
              <div
                className="relative flex aspect-square w-full max-w-[268px] items-center justify-center rounded-3xl bg-gradient-to-br from-slate-600 via-slate-800 to-slate-950 shadow-2xl ring-1 ring-white/15"
                style={{ boxShadow: '0 28px 56px -12px rgba(0,0,0,0.52)' }}
              >
                <div
                  className="absolute inset-[14px] rounded-2xl bg-gradient-to-br from-slate-400/25 via-slate-700/15 to-slate-950/70"
                  aria-hidden
                />
                <span className="relative text-5xl font-black tabular-nums tracking-tighter text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] sm:text-6xl md:text-7xl">
                  3W
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 divide-x divide-slate-200 bg-white sm:grid-cols-5">
          {(
            [
              ['500+', 'Businesses'],
              ['15 min', 'Avg pickup'],
              ['4.8★', 'Satisfaction'],
              ['₹39', 'Base trip'],
              ['100%', 'GST ready'],
            ] as const
          ).map(([n, l]) => (
            <div key={l} className="px-2 py-5 text-center sm:px-3 sm:py-6">
              <p className="text-lg font-bold tabular-nums tracking-tight sm:text-xl" style={{ color: NAVY }}>
                {n}
              </p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-[10px]">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-20 pt-16 sm:space-y-24 sm:pt-20" style={{ color: NAVY }}>
        {/* Narrative */}
        <section className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-[#051937] sm:text-2xl md:text-3xl">The Sector 63 efficiency paradox</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
            Dense corridors like <strong className="text-[#051937]">Sector 18</strong>, <strong className="text-[#051937]">Sector 63</strong>,
            and <strong className="text-[#051937]">Sector 62</strong> reward repeatability—but ad hoc booking breaks the math. Teams default to
            calling multiple <strong className="text-[#051937]">“naka”</strong> drivers, absorbing surge, wait-time, and opaque cash rounds that
            never hit the P&amp;L as a line item.
          </p>
        </section>

        {/* Callout */}
        <section className="mx-auto max-w-3xl rounded-2xl border border-amber-200/60 bg-gradient-to-b from-amber-50/90 to-amber-50/40 px-5 py-6 shadow-sm ring-1 ring-amber-100/50 sm:px-8 sm:py-8">
          <h3 className="text-lg font-bold text-[#051937] sm:text-xl">The &quot;invisible&quot; logistics tax</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-800 sm:text-base">
            {[
              'Surge and “busy hour” multipliers on pure on-demand lanes',
              'Wait-time and loading charges that vary by driver',
              'Cash reconciliations that finance sees as “misc transport”',
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-200 bg-red-50 text-[10px] font-bold text-red-600">
                  ×
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Client story */}
        <section className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-white p-8 shadow-md">
            <div className="rounded-2xl border border-blue-200/60 bg-white px-8 py-6 shadow-lg">
              <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Noida</p>
              <p className="mt-2 text-center text-lg font-bold text-[#051937]">B2B corridor</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">Client story</p>
            <h2 className="mt-2 text-xl font-bold text-[#051937] sm:text-2xl">Sunlight Electronics, Sector 63</h2>
            <blockquote className="mt-4 border-l-4 border-blue-500 pl-4 text-sm italic leading-relaxed text-slate-700 sm:text-base">
              We stopped chasing five different drivers for the same lane. One booking flow, GST invoices that match finance&apos;s template, and
              dispatch that doesn&apos;t vanish on Fridays.
            </blockquote>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pack savings</p>
                <p className="mt-1 text-lg font-bold text-blue-600">~28% monthly savings</p>
                <p className="text-[10px] text-slate-500">vs typical on-demand on repeat lanes</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Damage rate</p>
                <p className="mt-1 text-lg font-bold text-[#051937]">0% target</p>
                <p className="text-[10px] text-slate-500">Structured handoffs &amp; POD on supported trips</p>
              </div>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="mx-auto max-w-4xl text-center">
          <h2 className="text-xl font-bold text-[#051937] sm:text-2xl md:text-3xl">The priority dispatch architecture</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
            We don&apos;t just move goods; we engineer routes and lock in value.
          </p>
          <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#051937] text-white">
                <Lock className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#051937]">Locked rates</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Subscription packs freeze in-pack per-trip pricing for included 3W runs (within plan limits)—so ops can budget without renegotiating
                every Monday.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#051937] text-white">
                <Zap className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#051937]">Priority dispatch</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Higher tiers call out priority handling when capacity tightens—pair that with live GPS on supported packs so your customers see
                professionalism, not excuses.
              </p>
            </div>
          </div>
        </section>

        {/* Economic table */}
        <section className="mx-auto max-w-4xl">
          <h2 className="text-center text-xl font-bold text-[#051937] sm:text-2xl">Economic breakdown</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-600">
            Illustrative comparison—your live quote always wins. On-demand column describes typical ad hoc pain, not a named competitor.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 shadow-md">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#051937] text-white">
                  <th className="px-4 py-3 font-semibold sm:px-5">Feature</th>
                  <th className="px-4 py-3 font-semibold text-sky-200 sm:px-5">LiftNGo sub</th>
                  <th className="px-4 py-3 font-semibold sm:px-5">On-demand</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {(
                  [
                    ['Per-trip pricing', 'Fixed / locked in-pack', 'Surge stacks (often 1.5×–3×)'],
                    ['GST & ITC', 'Automated invoicing · ITC-aligned', 'Fragmented receipts'],
                    ['Fleet consistency', 'Dedicated pack lanes', 'Random market matching'],
                    [
                      'Illustrative 3W avg',
                      `${formatSubscriptionRupee(growthPack.perTrip)} in-pack (Growth)`,
                      '₹450+ before add-ons · tolls',
                    ],
                  ] as const
                ).map(([a, b, c]) => (
                  <tr key={a}>
                    <td className="px-4 py-3 font-medium text-slate-800 sm:px-5">{a}</td>
                    <td className="px-4 py-3 font-semibold sm:px-5" style={{ color: ROYAL }}>
                      {b}
                    </td>
                    <td className="px-4 py-3 italic text-slate-500 sm:px-5">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="mx-auto max-w-5xl">
          <h2 className="text-center text-xl font-bold text-[#051937] sm:text-2xl">Plans that match Noida volume</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {SUBSCRIPTION_PACKS_3W.map((pack) => {
              const popular = pack.popular === true;
              return (
                <div
                  key={pack.id}
                  className={`relative flex flex-col rounded-2xl border p-6 shadow-md ${
                    popular
                      ? 'border-blue-500/50 bg-[#051937] text-white shadow-[0_20px_40px_-12px_rgba(37,99,235,0.35)] ring-2 ring-blue-400/35'
                      : 'border-slate-200/90 bg-white text-[#051937] shadow-sm'
                  }`}
                >
                  {popular ? (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-md"
                      style={{ backgroundColor: ROYAL }}
                    >
                      Most popular
                    </span>
                  ) : null}
                  <p className={`text-sm font-semibold ${popular ? 'text-sky-200/95' : 'text-slate-500'}`}>{pack.name}</p>
                  <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
                    <span className="text-3xl font-bold tabular-nums tracking-tight">{formatSubscriptionRupee(pack.total)}</span>
                    <span className={`text-base font-semibold ${popular ? 'text-blue-100/90' : 'text-slate-500'}`}>/month</span>
                  </p>
                  <p className={`mt-1 text-xs ${popular ? 'text-blue-100/75' : 'text-slate-500'}`}>
                    {pack.trips} trips · 30-day pack validity
                  </p>
                  <p className={`mt-3 inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${popular ? 'bg-emerald-500/25 text-emerald-100' : 'bg-amber-50 text-amber-900'}`}>
                    {subscriptionPackSavingsLabel(pack)}/mo
                  </p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm">
                    {pack.features.slice(0, 5).map((f) => (
                      <li key={f} className={`flex gap-2 ${popular ? 'text-blue-50/95' : 'text-slate-600'}`}>
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${popular ? 'text-sky-300' : 'text-[#2563eb]'}`}
                          aria-hidden
                        />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={subscriptionPackLockHref(pack)}
                    className={`mt-6 inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-3 text-center text-sm font-semibold transition ${
                      popular ? 'text-white hover:opacity-95' : 'bg-[#051937] text-white hover:opacity-90'
                    }`}
                    style={popular ? { backgroundColor: ROYAL } : undefined}
                  >
                    {popular ? 'Boost growth' : pack.id === 'starter' ? 'Choose starter' : 'Contact for scale'}
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">
            Indicative pack totals — final amount at checkout.{' '}
            <Link href={ROUTES.PLANS_SUBSCRIPTION} className="font-semibold text-blue-600 underline underline-offset-2">
              Full subscription page
            </Link>
          </p>
        </section>

        {/* Ecosystem */}
        <section className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-[#051937] sm:text-2xl md:text-3xl">Built for Noida&apos;s ecosystem</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ['Manufacturers', 'Industrial parts and raw materials from Sector 80 clusters.'],
                ['D2C brands', 'Apparel and electronics moving from Noida to Delhi-NCR.'],
                ['Distributors', 'FMCG and pharma distribution across Noida West.'],
                ['E-commerce', 'Last-mile fulfillment for regional hubs and dark stores.'],
              ] as const
            ).map(([t, b]) => (
              <div key={t} className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_4px_14px_-4px_rgba(5,25,55,0.08)]">
                <h3 className="font-bold text-[#051937]">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Chaos vs calm */}
        <section className="mx-auto max-w-5xl">
          <h2 className="text-center text-xl font-bold text-[#051937] sm:text-2xl md:text-3xl">
            The market chaos vs. the LiftNGo calm
          </h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="rounded-2xl border border-red-100 bg-red-50/80 p-4 shadow-sm">
                <p className="text-sm font-bold text-red-900">Market fatigue</p>
                <p className="mt-1 text-sm text-red-900/85">
                  <span aria-hidden className="mr-1.5 inline-block">
                    😠
                  </span>
                  Calling many drivers each morning—confirmations that evaporate when the lane gets busy.
                </p>
              </div>
              <div className="rounded-2xl border border-red-100 bg-red-50/80 p-4 shadow-sm">
                <p className="text-sm font-bold text-red-900">Hidden inflation</p>
                <p className="mt-1 text-sm text-red-900/85">
                  <span aria-hidden className="mr-1.5 inline-block">
                    💵
                  </span>
                  Loading fees and weather add-ons that never match the receipt finance approved.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-2xl border border-blue-300/40 bg-[#051937] p-6 text-white shadow-xl sm:p-8">
              <p className="flex items-center gap-2 text-sm font-bold text-emerald-300">
                <span aria-hidden className="text-base leading-none">
                  ✅
                </span>
                The Liftngo resolution
              </p>
              <p className="mt-3 text-sm leading-relaxed text-blue-50/95 sm:text-base">
                One accountable booking surface, quotes before you pay, and GST-ready invoices on applicable trips—so ops scales without becoming a
                full-time transport desk.
              </p>
            </div>
          </div>
        </section>

        {/* Precision fleet */}
        <section className="mx-auto max-w-5xl">
          <h2 className="text-center text-xl font-bold text-[#051937] sm:text-2xl">Precision fleet</h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-600">
            Product silhouettes — same assets as the Noida dashboard. Prices are entry anchors; live quotes include route specifics.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {FLEET.map((v) => (
              <div
                key={v.label}
                className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white p-5 shadow-md ${
                  v.highlight ? 'border-[#2563eb] ring-2 ring-[#2563eb]/35 shadow-md' : 'border-slate-200'
                }`}
              >
                {v.highlight ? (
                  <span className="absolute right-3 top-3 rounded-full bg-[#051937] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                    Most used
                  </span>
                ) : null}
                <div className="relative mx-auto mt-2 h-24 w-full max-w-[140px]">
                  <Image src={v.img} alt="" fill className="object-contain" unoptimized sizes="140px" />
                </div>
                <h3 className="mt-4 text-base font-bold text-[#051937]">{v.label}</h3>
                <p className="mt-1 text-xs text-slate-600">{v.sub}</p>
                <p className="mt-3 text-lg font-bold text-[#051937]">From {v.price}</p>
                <p className="text-[11px] text-slate-500">{v.hint}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature grid */}
        <section className="mx-auto max-w-5xl rounded-2xl border border-slate-200/90 bg-white px-5 py-10 shadow-[0_4px_24px_-8px_rgba(5,25,55,0.1)] sm:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                {
                  icon: Receipt,
                  t: 'Full GST compliance',
                  b: 'GST-ready invoicing on applicable trips—cleaner ITC alignment than fragmented cash slips.',
                },
                {
                  icon: ArrowRight,
                  t: 'No surge, ever',
                  b: 'Pack trips lock your rate for the validity window—no demand multipliers on included runs (per plan terms).',
                },
                {
                  icon: Star,
                  t: 'Priority dispatch',
                  b: 'Higher tiers advertise priority handling when the network is tight—check your pack card.',
                },
                {
                  icon: Headphones,
                  t: 'Dedicated POC',
                  b: 'One logistics architect assigned to your account for routes and optimisation—not a generic call centre script.',
                },
              ] as const
            ).map(({ icon: Icon, t, b }) => (
              <div key={t} className="text-left">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm"
                  style={{ backgroundColor: ROYAL }}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#051937] sm:text-base">{t}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{b}</p>
              </div>
            ))}
          </div>
        </section>

        <BlogCaseStudyFaq items={CASE_STUDY_FAQ} className="mx-auto max-w-5xl pb-4" />

        {/* Closing CTA — navy */}
        <section
          className="mx-auto max-w-5xl overflow-hidden rounded-2xl px-5 py-10 text-center sm:px-8 sm:py-12"
          style={{ background: `linear-gradient(145deg, ${NAVY} 0%, #132a45 100%)` }}
        >
          <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">Cut Noida logistics cost this month</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-blue-100/90 sm:text-base">
            Predictable packs, transparent quotes, and GST-ready flows—built for teams that outgrew WhatsApp coordination.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:brightness-95"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                WhatsApp us
              </a>
            ) : null}
            <Link
              href={ROUTES.PLANS_SUBSCRIPTION}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              style={{ backgroundColor: ROYAL }}
            >
              View subscriptions
            </Link>
            <Link
              href={ROUTES.PLANS_CUSTOM}
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border-2 border-white/45 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Cost calculator
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
