import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import Image from 'next/image';
import Link from 'next/link';
import { khatuShyamImageFocus, khatuShyamLogisticsVisual } from '@/config/locationPageVisuals';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { buildKhatuShyamLogisticsGraph } from '@/lib/structuredData/locationPages';
import { KHATU_SHYAM_LANDING_FAQ } from '@/data/khatuShyamLandingFaq';
import LocationPageCtas from '@/components/marketing/LocationPageCtas';

const PATH = '/khatu-shyam-logistics';
const PAGE_URL = `${SITE_URL}${PATH}`;
const TITLE = 'Logistics Services in Khatu Shyam Ji | Delivery & Goods Transport — Liftngo';
const DESCRIPTION =
  'Logistics in Khatu Shyam Ji for shops, food vendors, and temple-area businesses: fast local delivery when crowds and narrow lanes slow everyone down. Reliable goods transport in Khatu—book cargo 2W–4W, not passenger autos. Liftngo.';

const BOOK_CTA = 'Book Delivery Now';

export const metadata = generatePageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    'logistics in khatu shyam ji',
    'delivery service khatu',
    'goods transport khatu',
    'local delivery khatu',
    'temple logistics khatu',
    'Khatu Shyam Ji courier',
    'temple town logistics',
    'hyperlocal delivery Khatu',
    'food delivery logistics Rajasthan',
  ],
});

const faqForSchema = [...KHATU_SHYAM_LANDING_FAQ].map((x) => ({
  question: x.question,
  answer: x.answer,
}));

const localProblems = [
  {
    title: 'Deliveries slip when the crowd swells',
    body:
      'Devotee footfall and festival days turn short trips into long waits. Informal “call someone” logistics breaks first—drivers ghost, lanes block, and your customer or next shop is left hanging.',
  },
  {
    title: 'Moving goods near the mandir is not like a highway haul',
    body:
      'Tight corners, parked two-wheelers, and sudden processions mean every handoff needs patience and the right-sized vehicle. Oversized vans where a compact cargo leg would do only add friction.',
  },
  {
    title: 'Reliable transport is fragmented',
    body:
      'Many shopkeepers still depend on manual labor for every carton or on a shrinking list of known riders. When one contact is busy, **local delivery in Khatu** stalls—and restock timelines slip.',
  },
  {
    title: 'Hidden cost of “we will manage somehow”',
    body:
      'Without an upfront fare and a clear vehicle class, you absorb surprise charges and lost sales. That hits daily vendor runs and restaurant supply hardest when demand spikes together.',
  },
];

const liftngoSolutions = [
  {
    title: 'Hyperlocal legs, built for temple-town density',
    body:
      'Liftngo focuses on short-haul **goods transport in Khatu**: pickup, drop, and completion—so you are not benchmarking us against interstate freight—we are your corridor partner.',
  },
  {
    title: 'One booking flow—app or web',
    body:
      'Enter addresses, pick 2-wheeler, 3-wheeler cargo, or 4-wheeler as the load demands, and lock an estimate before someone commits the vehicle. Less phone tag on your busiest days.',
  },
  {
    title: 'Cargo vehicles only',
    body:
      'The network is oriented to **delivery service in Khatu** for stock and packages—not passenger autos or cab-style rides. That keeps incentives aligned with showing up with space for your load.',
  },
  {
    title: 'Pricing you can plan around',
    body:
      'Transparent estimates tied to distance and vehicle class help shops and kitchens budget for peak evenings around Khatu Shyam Ji without opaque broker quotes.',
  },
];

const useCases = [
  {
    title: 'Food delivery for restaurants & kitchens',
    body:
      'Hot and cold runs, ingredient refills, and vendor-to-kitchen hops when the lane outside is packed—right-size the vehicle so thalis and sacks move without crushing margins.',
  },
  {
    title: 'Shop-to-shop goods transport',
    body:
      'Cartons, retail stock, and supplies between neighbouring retailers—especially when neither side has manpower to spare for a hand-pulled trip through congestion.',
  },
  {
    title: 'Temple vendor & corridor-adjacent supply',
    body:
      'Prasad inputs, event-day inventory, and guest-house or stall restocks tied to **temple logistics in Khatu**—scheduled legs that respect peak darshan timing.',
  },
  {
    title: 'Bulk item movement (when lanes allow)',
    body:
      'Heavier or higher-volume movement with 3-wheeler cargo or mini-truck class options—book when you know the window and the gate clearances along your route.',
  },
  {
    title: 'Daily vendor delivery rhythms',
    body:
      'Repeat morning and afternoon patterns for distributors and counters that need the same lane every day—coordinate recurring needs over WhatsApp after your first structured booking.',
  },
];

const vehicleCards = [
  {
    title: '2-wheeler — small, fast bags',
    body:
      'Documents, food parcels, light bags, and urgent shop samples through choked stretches—minimum footprint in narrow streets near the temple.',
    href: '/services/2-wheeler' as const,
  },
  {
    title: '3-wheeler cargo — volume without a full truck',
    body:
      'Electric or ICE **cargo** three-wheelers (goods decks)—not passenger auto framing—for cartons, crates, and mid-size vendor loads.',
    href: '/services/3-wheeler' as const,
  },
  {
    title: '4-wheeler — heavier cartons & bulk',
    body:
      'When payload or stack height rules out smaller classes—furniture-adjacent retail, appliance shops, and multi-carton restocks for **goods transport in Khatu**.',
    href: '/services/4-wheeler' as const,
  },
];

const benefits = [
  {
    title: 'Built for crowded lanes',
    body:
      'Drivers expect slowdowns near the mandir and market—not just open-road ETA math—so your expectations stay grounded in how Khatu actually moves.',
  },
  {
    title: 'Reliable, cargo-first mindset',
    body:
      'Completion and handoff discipline matter more than joyride ratings. The product nudges behaviour around showing up with load capacity, not passenger seating.',
  },
  {
    title: 'Cost-effective vs informal brokers',
    body:
      'See the estimate before you confirm. That helps food vendors and shops avoid festival-week “whatever they quote” surcharges on **local delivery in Khatu**.',
  },
  {
    title: 'Easy booking on mobile',
    body:
      'Thumb-friendly flow from pickup pin to vehicle choice—critical when you are behind the counter and the lane is noisy.',
  },
];

export default function KhatuShyamLogisticsPage() {
  return (
    <ContentLayout>
      <JsonLd
        data={buildKhatuShyamLogisticsGraph({
          pageUrl: PAGE_URL,
          title: TITLE,
          description: DESCRIPTION,
          faq: faqForSchema,
        })}
      />
      <main className="flex-1">
        <header className="liftngo-brand-mesh relative min-h-[420px] overflow-hidden text-white sm:min-h-[480px]">
          <Image
            src={khatuShyamLogisticsVisual.hero(1920)}
            alt={khatuShyamLogisticsVisual.heroAlt}
            fill
            className={`object-cover ${khatuShyamImageFocus.hero}`}
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-[#1A1D3A]/93 via-[#2C2D5B]/78 to-[#2C2D5B]/45"
            aria-hidden
          />
          <div
            className="absolute -left-24 top-8 h-64 w-64 rounded-full bg-[#FF8C00]/30 blur-3xl pointer-events-none"
            aria-hidden
          />
          <div
            className="absolute -right-20 bottom-12 h-56 w-56 rounded-full bg-[#2C2D5B]/35 blur-3xl pointer-events-none"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 pointer-events-none"
            aria-hidden
          />
          <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-20">
            <nav className="mb-6 text-left text-sm text-white/80" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li aria-hidden className="text-white/50">
                  /
                </li>
                <li className="text-white">Khatu Shyam Ji logistics</li>
              </ol>
            </nav>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#FFB547]">Serving Khatu Shyam Ji · Rajasthan</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.75rem]">Logistics Services in Khatu Shyam Ji</h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
              <strong className="font-semibold text-white">Fast, reliable delivery</strong> when devotees, festivals, and narrow streets squeeze every minute—food vendors,
              shops, and temple-area businesses get predictable <strong className="font-semibold text-white">goods transport in Khatu</strong> with Liftngo (cargo vehicles
              only—not passenger autos).
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
              <LocationPageCtas
                whatsappSource="khatu_shyam_hero"
                whatsappPrefill="Hi Liftngo, I need delivery in Khatu Shyam Ji (shop / vendor)."
                bookTrackSource="khatu_shyam_hero_book"
                bookLabel={BOOK_CTA}
              />
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <section className="scroll-mt-20" aria-labelledby="local-challenges-khatu">
            <h2 id="local-challenges-khatu" className="text-2xl font-bold text-gray-900 sm:text-[1.65rem]">
              Why logistics in Khatu Shyam Ji is genuinely hard
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Khatu is not a spreadsheet grid—it is a living temple town. Crowds, processions, and lane width change the economics of every carton. When{' '}
              <strong className="font-semibold text-gray-800">delivery service in Khatu</strong> fails, shops lose the day—not just a single trip.
            </p>
            <ul className="mt-8 space-y-5">
              {localProblems.map((item) => (
                <li key={item.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-[0.9375rem]">{item.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <div className="relative mt-10 aspect-[16/9] w-full max-h-56 overflow-hidden rounded-2xl border border-gray-100 shadow-md sm:mt-12 sm:max-h-64">
            <Image
              src={khatuShyamLogisticsVisual.loadingHandoff(1400)}
              alt={khatuShyamLogisticsVisual.loadingHandoffAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width: 896px) 100vw, 896px"
              loading="lazy"
            />
          </div>

          <section className="mt-14 scroll-mt-20" aria-labelledby="liftngo-solution-khatu">
            <h2 id="liftngo-solution-khatu" className="text-2xl font-bold text-gray-900 sm:text-[1.65rem]">
              How Liftngo solves it for local businesses
            </h2>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              We are building the default <strong className="font-semibold text-gray-800">logistics in Khatu Shyam Ji</strong> layer—where booking, vehicle class, and driver
              behaviour line up with goods handoffs, not joyrides.
            </p>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {liftngoSolutions.map((item) => (
                <li key={item.title} className="rounded-2xl border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/[0.04] p-5 sm:p-6">
                  <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-center sm:justify-start">
              <LocationPageCtas
                whatsappSource="khatu_shyam_after_solution"
                whatsappPrefill="Hi Liftngo, we run a shop / kitchen in Khatu and want to try your logistics."
                bookTrackSource="khatu_shyam_solution_book"
                bookLabel={BOOK_CTA}
              />
            </div>
          </section>

          <section className="mt-16 scroll-mt-20" aria-labelledby="use-cases-khatu">
            <h2 id="use-cases-khatu" className="text-2xl font-bold text-gray-900 sm:text-[1.65rem]">
              Khatu-specific use cases we support
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
              If your load is legal goods—not passengers—these are the jobs Liftngo is shaped for around the mandir and market lanes.
            </p>
            <div className="relative mt-6 aspect-[2/1] w-full max-h-56 overflow-hidden rounded-2xl border border-gray-100 shadow-md sm:max-h-64">
              <Image
                src={khatuShyamLogisticsVisual.supporting(1400)}
                alt={khatuShyamLogisticsVisual.supportingAlt}
                fill
                className={`object-cover ${khatuShyamImageFocus.gate}`}
                sizes="(max-width: 896px) 100vw, 896px"
                loading="lazy"
              />
            </div>
            <ul className="mt-8 grid gap-5 sm:grid-cols-2">
              {useCases.map((item) => (
                <li key={item.title} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <h3 className="text-base font-semibold text-gray-900 sm:text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16 scroll-mt-20" aria-labelledby="vehicles-khatu">
            <h2 id="vehicles-khatu" className="text-2xl font-bold text-gray-900 sm:text-[1.65rem]">
              Pick the right cargo vehicle for your lane
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
              Match payload to vehicle—especially when turning radius and parking pinch points matter near the temple corridor.
            </p>
            <div className="relative mt-6 aspect-[16/9] w-full max-h-52 overflow-hidden rounded-2xl border border-gray-100 shadow-md sm:max-h-60">
              <Image
                src={khatuShyamLogisticsVisual.lastMileCargo(1400)}
                alt={khatuShyamLogisticsVisual.lastMileCargoAlt}
                fill
                className={`object-cover ${khatuShyamImageFocus.darbarRepeat}`}
                sizes="(max-width: 896px) 100vw, 896px"
                loading="lazy"
              />
            </div>
            <ul className="mt-8 grid gap-5 lg:grid-cols-3">
              {vehicleCards.map((v) => (
                <li key={v.title} className="flex flex-col rounded-2xl border border-gray-100 bg-gray-50/90 p-5 shadow-sm sm:p-6">
                  <h3 className="text-base font-semibold text-gray-900">{v.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{v.body}</p>
                  <Link
                    href={v.href}
                    className="mt-4 inline-flex text-sm font-semibold text-[var(--color-primary)] hover:underline"
                  >
                    View {v.title.split('—')[0].trim()} details
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16 scroll-mt-20" aria-labelledby="benefits-khatu">
            <h2 id="benefits-khatu" className="text-2xl font-bold text-gray-900 sm:text-[1.65rem]">
              Why vendors and shops choose Liftngo here
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {benefits.map((b, i) => (
                <li key={b.title} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4 sm:p-5">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/15 text-sm font-bold text-[var(--color-primary)]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{b.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{b.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14 rounded-2xl border border-[var(--color-primary)]/25 bg-gradient-to-b from-[var(--color-primary)]/8 to-transparent p-8 text-center sm:p-10">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Ready for dependable delivery in Khatu?</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-600 sm:text-base">
              Book a cargo vehicle in minutes—or message us on WhatsApp with your lane and load. Same-day options depend on demand and how tight the corridor is.
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <LocationPageCtas
                whatsappSource="khatu_shyam_mid"
                bookTrackSource="khatu_shyam_mid_book"
                bookLabel={BOOK_CTA}
              />
            </div>
          </section>

          <section className="mt-16 scroll-mt-20" aria-labelledby="faq-khatu">
            <h2 id="faq-khatu" className="text-2xl font-bold text-gray-900 sm:text-[1.65rem]">
              FAQ — logistics &amp; delivery service in Khatu Shyam Ji
            </h2>
            <p className="mt-3 text-sm text-gray-600 sm:text-[0.9375rem]">
              Straight answers for shops, food outlets, and temple-area vendors—also reflected in structured data for search.
            </p>
            <dl className="mt-8 space-y-4 sm:space-y-5">
              {KHATU_SHYAM_LANDING_FAQ.map((item) => (
                <div key={item.question} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <dt className="font-semibold text-gray-900">{item.question}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-gray-600">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-16 border-t border-gray-200 pt-12" aria-labelledby="explore-more-khatu">
            <h2 id="explore-more-khatu" className="text-lg font-semibold text-gray-900 sm:text-xl">
              Explore Liftngo
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Internal links help you book faster and read how we think about Khatu logistics.
            </p>
            <ul className="mt-6 grid gap-3 text-[var(--color-primary)] sm:grid-cols-2">
              <li>
                <Link href="/" className="inline-flex text-sm font-medium hover:underline">
                  Liftngo homepage
                </Link>
              </li>
              <li>
                <Link href={ROUTES.BOOK_DELIVERY} className="inline-flex text-sm font-medium hover:underline">
                  Book delivery (step-by-step)
                </Link>
              </li>
              <li>
                <Link href="/delivery-khatu" className="inline-flex text-sm font-medium hover:underline">
                  Short link: delivery Khatu
                </Link>
              </li>
              <li>
                <Link href={ROUTES.LOGISTICS_KHATU} className="inline-flex text-sm font-medium hover:underline">
                  Logistics in Khatu (overview)
                </Link>
              </li>
              <li>
                <Link href="/noida-b2b-logistics" className="inline-flex text-sm font-medium hover:underline">
                  B2B logistics — Noida &amp; Delhi NCR
                </Link>
              </li>
              <li>
                <Link href="/blog/how-logistics-works-khatu-shyam-ji-local-businesses" className="inline-flex text-sm font-medium hover:underline">
                  Blog: How logistics works for Khatu businesses
                </Link>
              </li>
              <li>
                <Link href="/blog/hyperlocal-logistics-temple-towns" className="inline-flex text-sm font-medium hover:underline">
                  Blog: Hyperlocal logistics in temple towns
                </Link>
              </li>
              <li>
                <Link href="/blog/future-logistics-ev-ai-automation" className="inline-flex text-sm font-medium hover:underline">
                  Blog: EV, AI &amp; logistics automation
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </main>
    </ContentLayout>
  );
}
