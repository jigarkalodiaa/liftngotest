import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import ContentLayout from '@/components/layout/ContentLayout';
import Link from 'next/link';
import Image from '@/components/OptimizedImage';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import { indiaPhotoBangaloreLoadedTruck } from '@/config/indiaLogisticsImages';
import { COMING_SOON_VEHICLES, SERVICES_INDEX_FAQ, servicesIndexItemListSchema } from '@/data/vehicleFleet';
import { BREADCRUMB_HOME, BREADCRUMB_SERVICES } from '@/lib/breadcrumbsNav';

const PAGE_PATH = '/services';
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

/** No trailing `| Liftngo` — layout template adds brand once (~58 chars total). */
const PAGE_META_TITLE = 'Goods transport: walk, 2W, 3W & 4W booking';

const PAGE_DESCRIPTION =
  'Walk, two-wheeler, three-wheeler cargo, and mini truck booking for intra-city goods in India. Cold chain, half-load, flatbed, and long-haul—see roadmap below.';

const PAGE_SCHEMA_NAME = `Goods transport services — walk through 4W | ${SITE_NAME}`;

export const metadata = generatePageMetadata({
  title: PAGE_META_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [
    'Liftngo services',
    'walk delivery India',
    'two wheeler goods delivery',
    'three wheeler cargo booking',
    'four wheeler mini truck',
    'last mile logistics',
    'intra city goods transport',
    'hyperlocal cargo booking',
    'B2B mini truck',
    'coming soon refrigerated delivery',
    'part load truck coming soon',
    `${SITE_NAME} fleet`,
  ],
});

const SERVICES = [
  {
    slug: 'walk',
    name: 'Walk',
    description: 'Small parcels and documents on foot—ideal for short distances and dense lanes.',
    image: '/dashboard/service-walk.png',
    href: '/services/walk',
  },
  {
    slug: '2-wheeler',
    name: '2 Wheeler',
    description: 'Fast motorbike or scooter delivery for compact packages and same-day city runs.',
    image: '/dashboard/service-2wheeler.png',
    href: '/services/2-wheeler',
  },
  {
    slug: '3-wheeler',
    name: '3 Wheeler',
    description: 'Heavier cartons and bulk on three-wheel cargo—EV or conventional fuel matched to the lane.',
    image: '/dashboard/service-3wheeler.png',
    href: '/services/3-wheeler',
  },
  {
    slug: '4-wheeler',
    name: '4 Wheeler',
    description: 'Mini truck capacity for bulky goods, pallets, and higher payloads than 3W—book today.',
    image: indiaPhotoBangaloreLoadedTruck(560),
    href: '/services/4-wheeler',
  },
] as const;

const faqForLd = SERVICES_INDEX_FAQ.map((item) => ({
  question: item.question,
  answer: item.answer,
}));

export default function ServicesPage() {
  return (
    <ContentLayout breadcrumbs={[BREADCRUMB_HOME, BREADCRUMB_SERVICES]}>
      <JsonLd data={servicesIndexItemListSchema()} />
      <JsonLd
        data={buildWebPageJsonLd({
          pageUrl: PAGE_URL,
          name: PAGE_SCHEMA_NAME,
          description: PAGE_DESCRIPTION,
          faqMainEntity: faqForLd,
        })}
      />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-12 sm:mb-16">
            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">Our services &amp; fleet</h1>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
              Book the vehicle that fits your load: walk, two-wheeler, three-wheeler cargo, or four-wheeler mini truck—all focused on{' '}
              <strong className="font-semibold text-gray-800">goods transport</strong>, not passenger rides. Larger and specialist vehicle classes
              are on the roadmap below.
            </p>
          </div>

          <section className="mb-14 rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm" aria-labelledby="services-corridors-heading">
            <h2 id="services-corridors-heading" className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Where these services matter most
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              The same vehicle menu behaves differently by geography. Around <strong className="text-gray-800">Khatu Shyam Ji</strong>, narrow
              streets and festival surges mean you often choose compact modes first; in <strong className="text-gray-800">Noida</strong> and{' '}
              <strong className="text-gray-800">Delhi NCR</strong>, loading bays and B2B paperwork favour planned slots and occasionally{' '}
              <Link href="/services/4-wheeler" className="font-semibold text-[var(--color-primary)] hover:underline">
                mini-truck deck space
              </Link>
              . Liftngo stays <strong className="text-gray-800">goods-first</strong> in both: no passenger framing, transparent estimates where
              the product supports them, and corridor pages that explain real constraints.
            </p>
            <h3 className="mt-8 text-lg font-semibold text-gray-900">Khatu Shyam Ji hyperlocal delivery</h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Food vendors, shops, and temple-adjacent businesses use walk and two-wheel slots for light bags, then step up to{' '}
              <Link href="/services/3-wheeler" className="font-semibold text-[var(--color-primary)] hover:underline">
                three-wheeler cargo
              </Link>{' '}
              when cartons multiply. Read{' '}
              <Link href="/blog/logistics-khatu-shyam" className="font-semibold text-[var(--color-primary)] hover:underline">
                logistics notes for Khatu Shyam Ji
              </Link>{' '}
              or open the{' '}
              <Link href={ROUTES.KHATU_SHYAM_LOGISTICS} className="font-semibold text-[var(--color-primary)] hover:underline">
                Khatu delivery landing
              </Link>{' '}
              before peak season.
            </p>
            <h3 className="mt-8 text-lg font-semibold text-gray-900">Noida &amp; Delhi NCR B2B lanes</h3>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Supplier shuttles and retail drops reward repeatability. Start from{' '}
              <Link href={ROUTES.NOIDA_B2B_LOGISTICS} className="font-semibold text-[var(--color-primary)] hover:underline">
                B2B logistics for Noida &amp; Delhi NCR
              </Link>
              , then align vehicle class with your dock—and read{' '}
              <Link href="/blog/b2b-delivery-noida" className="font-semibold text-[var(--color-primary)] hover:underline">
                B2B delivery in Noida
              </Link>{' '}
              for operational detail.
            </p>
          </section>

          <h2 id="vehicle-types-heading" className="text-2xl font-semibold text-gray-900">
            Book by vehicle type
          </h2>
          <p className="mt-2 max-w-2xl text-base text-gray-600">
            Choose a mode that matches payload and lane—each page lists ideal use cases and how to book.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2" aria-labelledby="vehicle-types-heading">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={s.href}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
              >
                <div className="relative mx-auto mb-4 aspect-square w-full max-w-[140px] overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={s.image}
                    alt={`${s.name} delivery — ${SITE_NAME}`}
                    fill
                    loading="lazy"
                    className="object-contain p-4 transition-transform group-hover:scale-105"
                    sizes="140px"
                  />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">{s.name}</h3>
                <p className="flex-1 text-sm leading-relaxed text-gray-600">{s.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] transition-all group-hover:gap-2">
                  View {s.name} service
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

          <section id="fleet-roadmap" className="mt-16 scroll-mt-24 rounded-3xl border border-dashed border-gray-200 bg-gray-50/80 p-6 sm:p-10" aria-labelledby="roadmap-heading">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 id="roadmap-heading" className="text-2xl font-semibold text-gray-900">
                More vehicles — <span className="text-[var(--color-primary)]">coming soon</span>
              </h2>
              <span className="inline-flex w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900">
                Roadmap
              </span>
            </div>
            <p className="mb-8 max-w-2xl text-gray-600">
              We are expanding beyond walk, 2W, 3W, and 4W so you can book specialist capacity in one place. Timelines depend on lane demand and
              partner onboarding—we will announce each launch on this page and in the app.
            </p>
            <ul className="grid gap-4 sm:grid-cols-2">
              {COMING_SOON_VEHICLES.map((v) => (
                <li key={v.name} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{v.name}</h3>
                    <span className="shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase text-gray-600">Soon</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{v.summary}</p>
                  <p className="mt-3 text-xs text-gray-500">
                    <span className="sr-only">SEO topics: </span>
                    {v.keywords}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14" aria-labelledby="faq-services">
            <h2 id="faq-services" className="mb-6 text-2xl font-semibold text-gray-900">
              Frequently asked questions
            </h2>
            <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
              {SERVICES_INDEX_FAQ.map((item) => (
                <li key={item.question} className="px-5 py-6 sm:px-8 sm:py-7">
                  <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                  <p className="mt-2 text-base leading-relaxed text-gray-600">{item.answer}</p>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-14 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Link
              href="/pickup-location"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Book a delivery
            </Link>
            <Link
              href={ROUTES.B2B_TRANSPORT}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-800 hover:bg-gray-50"
            >
              Explore B2B logistics services
            </Link>
            <Link
              href={ROUTES.KHATU_SHYAM_LOGISTICS}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--color-primary)]/35 bg-[var(--color-primary)]/8 px-8 py-3.5 text-base font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/15"
            >
              Check Khatu delivery
            </Link>
            <Link
              href={ROUTES.BECOME_DRIVER}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-800 hover:bg-gray-50"
            >
              Become a driver
            </Link>
          </div>
        </div>
      </main>
    </ContentLayout>
  );
}
