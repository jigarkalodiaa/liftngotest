import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import { Inter, Merriweather } from 'next/font/google';
import {
  Check,
  Clock,
  FileText,
  Headphones,
  MessageCircle,
  Package,
  Phone,
  RefreshCw,
  Shield,
  Truck,
  X,
} from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { NOIDA_B2B_LANDING_FAQ } from '@/data/noidaB2bLandingFaq';
import {
  SUBSCRIPTION_PACKS_3W,
  formatSubscriptionRupee,
  subscriptionPackLockHref,
  subscriptionPackSavingsLabel,
} from '@/lib/pricing/subscriptionPacks';
import BlogCaseStudyFaq from '@/components/blog/BlogCaseStudyFaq';
import BlogCaseStudyAnchorNav from '@/components/blog/BlogCaseStudyAnchorNav';

const caseStudySans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const caseStudySerif = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

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

function HeroHeadline({ title }: { title: string }) {
  const chunks = title.split(/(30%)/);
  return (
    <h1 className="text-balance text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl md:text-[2.65rem] lg:text-[2.8rem]">
      {chunks.map((part, i) =>
        part === '30%' ? (
          <span key={i} className="text-amber-300">
            {part}
          </span>
        ) : (
          <span key={i} className="text-white">
            {part}
          </span>
        ),
      )}
    </h1>
  );
}

export type BlogNoidaCaseStudyShellProps = {
  title: string;
  description: string;
  minutes: number;
  authorLabel: string;
  whatsappHref: string | null;
  /** Optional author / brand mark for hero meta (e.g. post featured asset). */
  authorAvatarSrc?: string | null;
  expertTelHref?: string | null;
};

export default function BlogNoidaCaseStudyShell({
  title,
  description,
  minutes,
  authorLabel,
  whatsappHref,
  authorAvatarSrc,
  expertTelHref,
}: BlogNoidaCaseStudyShellProps) {
  const growthPack = SUBSCRIPTION_PACKS_3W.find((p) => p.popular) ?? SUBSCRIPTION_PACKS_3W[1];

  return (
    <div className={`noida-case-study-surface space-y-0 ${caseStudySans.className}`}>
      {/* Hero + anchor bar — reference layout (nav outside hero overflow so sticky works) */}
      <div className="rounded-3xl shadow-[0_24px_64px_-14px_rgba(5,25,55,0.32)] ring-1 ring-slate-900/12">
        <section
          className="relative overflow-hidden rounded-t-3xl"
          style={{ background: `linear-gradient(155deg, ${NAVY} 0%, #0d2d52 45%, #061526 100%)` }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_80%_-10%,rgba(37,99,235,0.18),transparent_55%)]" aria-hidden />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_0%_100%,rgba(255,255,255,0.06),transparent_50%)]" aria-hidden />
          <div className="relative grid gap-10 px-5 py-12 sm:px-8 sm:py-14 lg:grid-cols-[1fr_minmax(240px,300px)] lg:items-center lg:gap-14 lg:px-12 lg:py-16">
            <div className="min-w-0">
              <span className="inline-flex items-center rounded-full border border-amber-700/50 bg-amber-950/40 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-100/95 sm:text-[11px]">
                Case study
              </span>
              <div className="mt-5">
                <HeroHeadline title={title} />
              </div>
              <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-sky-100/95 sm:text-lg">{description}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {authorAvatarSrc ? (
                  <Image
                    src={authorAvatarSrc}
                    alt=""
                    width={44}
                    height={44}
                    className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white/30"
                    unoptimized={authorAvatarSrc.endsWith('.svg')}
                  />
                ) : (
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-white/25"
                    style={{ backgroundColor: ROYAL }}
                    aria-hidden
                  >
                    L
                  </span>
                )}
                <div className="min-w-0 text-xs leading-snug text-white/85 sm:text-sm">
                  <p className="font-semibold text-white">{authorLabel}</p>
                  <p className="text-white/60">{minutes} min read · Noida B2B</p>
                </div>
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
                  href={ROUTES.CONTACT}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
                  style={{ backgroundColor: ROYAL }}
                >
                  <Headphones className="h-5 w-5" aria-hidden />
                  Talk to expert
                </Link>
                {expertTelHref ? (
                  <a
                    href={expertTelHref}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-white/40 bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    <Phone className="h-5 w-5" aria-hidden />
                    Call expert
                  </a>
                ) : null}
              </div>
            </div>
            <div className="mx-auto flex w-full max-w-[300px] flex-col items-center justify-center lg:mx-0 lg:justify-self-end">
              <div
                className="relative flex aspect-square w-full max-w-[280px] items-center justify-center rounded-3xl bg-gradient-to-br from-slate-500 via-slate-700 to-slate-950 shadow-2xl ring-1 ring-white/20"
                style={{ boxShadow: '0 28px 56px -12px rgba(0,0,0,0.52)' }}
              >
                <div
                  className="absolute inset-3 rounded-[1.35rem] border border-white/10 bg-gradient-to-br from-slate-300/20 via-slate-600/25 to-slate-950/80"
                  aria-hidden
                />
                <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
                  <div className="h-24 w-24 rounded-full border-2 border-white/15 bg-gradient-to-br from-slate-400/40 to-slate-800/60 shadow-inner" />
                </div>
                <span className="relative text-5xl font-black tabular-nums tracking-tighter text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)] sm:text-6xl md:text-7xl">
                  3W
                </span>
              </div>
              <p className="mt-3 text-center text-[10px] font-medium uppercase tracking-widest text-sky-200/70 sm:text-[11px]">
                Product visual · not stock photography
              </p>
            </div>
          </div>
        </section>
        <BlogCaseStudyAnchorNav />
      </div>

      <div className="-mx-4 space-y-20 bg-[#fdfbf4] px-4 pt-16 text-[#051937] sm:-mx-6 sm:space-y-24 sm:px-6 sm:pt-20 lg:-mx-10 lg:px-10">
        {/* Overview */}
        <section id="overview" className="mx-auto max-w-3xl scroll-mt-28 pt-2 sm:scroll-mt-32">
          <h2
            className={`${caseStudySerif.className} text-2xl font-bold leading-snug tracking-tight text-[#051937] sm:text-3xl md:text-[2rem]`}
          >
            The story of Noida&apos;s logistics problem
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-slate-700 sm:text-base">
            Corridors like <strong className="text-[#051937]">Sector 18</strong>, <strong className="text-[#051937]">Sector 63</strong>, and{' '}
            <strong className="text-[#051937]">Sector 62</strong> move huge volume—but teams still run on phone trees, surge multipliers, and
            receipts finance cannot reconcile. The cost rarely shows up as a single line item; it leaks as delay, rework, and &quot;misc
            transport.&quot;
          </p>
        </section>

        {/* Problem callout */}
        <section id="problem" className="mx-auto max-w-3xl scroll-mt-28 sm:scroll-mt-32">
          <div className="rounded-2xl border border-amber-200/70 bg-[#faf6ef] py-6 pl-5 pr-5 shadow-sm sm:pl-7 sm:pr-8 sm:py-8" style={{ borderLeftWidth: '4px', borderLeftColor: '#92400e' }}>
            <h3 className={`${caseStudySerif.className} text-lg font-bold text-[#051937] sm:text-xl`}>Key challenges highlighted</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-800 sm:text-base">
              {[
                'Surge and “busy hour” stacking on pure on-demand lanes',
                'Wait-time and loading variance that never matches the approved quote',
                'Cash and UPI rounds booked as “misc” instead of auditable GST lines',
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-800/80" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Solution: case highlight + architecture */}
        <section id="solution" className="mx-auto max-w-5xl scroll-mt-28 space-y-14 sm:scroll-mt-32">
          <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_12px_40px_-12px_rgba(5,25,55,0.12)] lg:grid lg:grid-cols-2 lg:gap-0">
            <div className="flex min-h-[260px] items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-white p-10 lg:min-h-[320px]">
              <div className="relative flex h-44 w-56 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 shadow-xl ring-1 ring-white/20">
                <Package className="h-20 w-20 text-white/90" strokeWidth={1.25} aria-hidden />
                <span className="absolute bottom-3 right-3 rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  Noida
                </span>
              </div>
            </div>
            <div className="border-t border-slate-100 p-8 sm:p-10 lg:border-l lg:border-t-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">Case study</p>
              <h2 className={`${caseStudySerif.className} mt-3 text-xl font-bold text-[#051937] sm:text-2xl`}>
                How Sunlight Electronics stabilised Sector 63 dispatch
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                One booking surface, GST-ready invoices on applicable trips, and priority handling when lanes get tight—so the ops lead stops
                acting as a full-time transport desk.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Dispatch reliability</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-600">70.8%</p>
                  <p className="text-[11px] text-slate-500">fewer same-day cancellations vs prior broker mix</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Invoice cycle time</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-blue-600">−12%</p>
                  <p className="text-[11px] text-slate-500">finance close on supported tiers</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className={`${caseStudySerif.className} text-xl font-bold text-[#051937] sm:text-2xl md:text-3xl`}>
              The priority dispatch architecture
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              We don&apos;t just move goods—we engineer routes, paperwork, and accountability.
            </p>
            <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#051937] text-white">
                  <Truck className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#051937]">Dedicated capacity</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Pack-based 3W lanes with named SLAs on higher tiers—so repeat routes are not re-brokered every morning.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#051937] text-white">
                  <FileText className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-4 text-lg font-bold text-[#051937]">Invoice-grade handoffs</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  GST-ready flows on applicable charges—cleaner ITC alignment than fragmented cash slips from ad hoc markets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tech stack: table → field benefits → then/now → fleet → icons */}
        <section id="tech" className="mx-auto max-w-5xl scroll-mt-28 space-y-20 sm:scroll-mt-32">
          <div>
            <h2 className={`${caseStudySerif.className} text-center text-xl font-bold text-[#051937] sm:text-2xl md:text-3xl`}>
              Economical breakthrough
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-600">
              Illustrative comparison—your live quote always wins. &quot;Competitors&quot; = typical fragmented on-demand / broker behaviour, not
              a named brand.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 shadow-md">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#051937] text-white">
                    <th className="px-4 py-3.5 font-semibold sm:px-5">Service</th>
                    <th className="px-4 py-3.5 font-semibold text-sky-200 sm:px-5">Liftngo</th>
                    <th className="px-4 py-3.5 font-semibold sm:px-5">Competitors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {(
                    [
                      ['Delivery time', '~15 min avg pickup (zone-dependent)', 'Highly variable · broker queues'],
                      ['Fuel efficiency', 'Routed packs · fewer empty legs', 'Fragmented returns · idle waiting'],
                      ['Reliability', 'GST invoices + POC on higher tiers', 'Last-minute swaps · thin traceability'],
                      [
                        'Pricing',
                        `Locked in-pack (e.g. ${formatSubscriptionRupee(growthPack.perTrip)}/trip Growth)`,
                        'Surge stacks · hidden loading / weather add-ons',
                      ],
                    ] as const
                  ).map(([a, b, c]) => (
                    <tr key={a}>
                      <td className="px-4 py-3.5 font-medium text-slate-800 sm:px-5">{a}</td>
                      <td className="px-4 py-3.5 font-semibold sm:px-5" style={{ color: ROYAL }}>
                        {b}
                      </td>
                      <td className="px-4 py-3.5 italic text-slate-500 sm:px-5">{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className={`${caseStudySerif.className} text-center text-xl font-bold text-[#051937] sm:text-2xl md:text-3xl`}>
              Real on-the-field benefits
            </h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ['Reduced waste', 'Fewer failed dispatches when lanes are pre-structured and accountable.'],
                  ['GPS tracking', 'Live visibility on supported packs—customers see professionalism, not excuses.'],
                  ['GST-ready billing', 'Cleaner ITC paths than “misc transport” lines from cash trips.'],
                  ['Predictable SLAs', 'Priority handling callouts on higher tiers when the network is tight.'],
                ] as const
              ).map(([t, b]) => (
                <div key={t} className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_4px_14px_-4px_rgba(5,25,55,0.08)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#051937] text-white">
                    <Check className="h-5 w-5" strokeWidth={2.5} aria-hidden />
                  </div>
                  <h3 className="mt-4 font-bold text-[#051937]">{t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{b}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Then vs now */}
          <div>
            <h2 className={`${caseStudySerif.className} text-center text-xl font-bold text-[#051937] sm:text-2xl`}>Then vs. now</h2>
            <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-start">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-b from-slate-300 to-slate-600 shadow-md ring-1 ring-slate-900/10" />
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-b from-slate-600 to-slate-900 shadow-md ring-1 ring-slate-900/10" />
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-red-100 bg-red-50/90 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-red-800">1990s playbook</p>
                  <ul className="mt-3 space-y-2 text-sm text-red-900/90">
                    {['Ten calls before the first pickup', 'Receipts that never match finance', 'Friday afternoon “no drivers”'].map((x) => (
                      <li key={x} className="flex gap-2">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/90 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-900">Liftngo today</p>
                  <ul className="mt-3 space-y-2 text-sm text-emerald-900/90">
                    {['One booking flow · quotes before pay', 'GST artefacts finance can audit', 'Priority lanes when it matters'].map((x) => (
                      <li key={x} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-blue-400/30 bg-[#051937] px-5 py-5 text-center text-white shadow-lg sm:py-6">
                  <p className="text-lg font-bold tracking-tight sm:text-xl">Fast. Reliable. Better.</p>
                  <p className="mt-2 text-sm text-blue-100/90">Built for Noida teams that outgrew WhatsApp logistics.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fleet */}
          <div>
            <h2 className={`${caseStudySerif.className} text-center text-xl font-bold text-[#051937] sm:text-2xl`}>Precision fleet</h2>
            <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-600">
              Same silhouettes as the live product—anchors only; checkout applies your route.
            </p>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {FLEET.map((v) => (
                <div
                  key={v.label}
                  className={`relative flex flex-col overflow-hidden rounded-2xl border bg-white p-5 shadow-md ${
                    v.highlight ? 'border-[#2563eb] ring-2 ring-[#2563eb]/35' : 'border-slate-200'
                  }`}
                >
                  {v.highlight ? (
                    <span className="absolute right-3 top-3 rounded-full bg-[#051937] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                      Best choice
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
          </div>

          {/* Icon strip */}
          <div className="rounded-2xl border border-slate-200/90 bg-white px-4 py-8 shadow-sm sm:px-8">
            <div className="flex flex-wrap items-start justify-center gap-10 sm:gap-14 md:gap-16">
              {(
                [
                  { Icon: Package, label: 'Packages' },
                  { Icon: Clock, label: 'On time' },
                  { Icon: Shield, label: 'Trust' },
                  { Icon: RefreshCw, label: 'Renew' },
                ] as const
              ).map(({ Icon, label }) => (
                <div key={label} className="flex w-[72px] flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#051937] text-white">
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </div>
                  <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#051937]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-5xl scroll-mt-28 pb-4 sm:scroll-mt-32">
          <h2 className={`${caseStudySerif.className} text-center text-xl font-bold text-[#051937] sm:text-2xl md:text-3xl`}>
            Subscription packages
          </h2>
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
                      className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-md"
                      style={{ backgroundColor: ROYAL }}
                    >
                      Best value
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
                        <Check className={`mt-0.5 h-4 w-4 shrink-0 ${popular ? 'text-sky-300' : 'text-[#2563eb]'}`} aria-hidden />
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
                    Book now
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-slate-500">
            Indicative pack totals — final amount at checkout.{' '}
            <Link href={ROUTES.PLANS_SUBSCRIPTION} className="font-semibold underline decoration-blue-600/40 underline-offset-2" style={{ color: ROYAL }}>
              Full subscription page
            </Link>
          </p>
        </section>

        <BlogCaseStudyFaq items={CASE_STUDY_FAQ} className="mx-auto max-w-5xl" toggleStyle="plus" />

        {/* Closing CTA */}
        <section
          className="mx-auto max-w-5xl overflow-hidden rounded-3xl px-5 py-10 text-center sm:px-8 sm:py-12"
          style={{ background: `linear-gradient(145deg, ${NAVY} 0%, #132a45 100%)` }}
        >
          <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">Cut your Noida logistics cost by 30% this month</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-blue-100/90 sm:text-base">
            Join teams running predictable packs, transparent quotes, and GST-ready flows.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white hover:brightness-95"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                WhatsApp
              </a>
            ) : null}
            <Link
              href={ROUTES.CONTACT}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
              style={{ backgroundColor: ROYAL }}
            >
              <Headphones className="h-5 w-5" aria-hidden />
              Talk to expert
            </Link>
            {expertTelHref ? (
              <a
                href={expertTelHref}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border-2 border-white/45 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                <Phone className="h-5 w-5" aria-hidden />
                Call expert
              </a>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
