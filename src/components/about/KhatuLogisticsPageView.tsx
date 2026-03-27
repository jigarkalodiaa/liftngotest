import Link from 'next/link';
import { BRAND } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { KHATU_SUPPLY_CHAIN_FAQ } from '@/data/khatuLogisticsSeo';

const BTN_PRIMARY =
  'inline-flex w-full min-h-[48px] items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 sm:w-auto';

const BTN_SECONDARY =
  'inline-flex w-full min-h-[48px] items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-800 shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 sm:w-auto';

const CARD =
  'rounded-2xl border border-gray-100/80 bg-white p-6 shadow-sm sm:p-7 transition-shadow hover:shadow-md hover:border-[var(--color-primary)]/15';

const textH1 =
  'text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-[2.5rem] lg:leading-tight';
const textH2 = 'text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl';
const textH3 = 'text-lg font-semibold text-gray-900';
const textLead = 'text-lg font-semibold leading-snug text-gray-900 sm:text-xl';
const textProse = 'text-base leading-relaxed text-gray-600 sm:text-lg';
const textBody = 'text-base leading-relaxed text-gray-600';

const PARTNERS = [
  {
    title: 'Guest houses & stays',
    body: 'Linens, provisions, drinking water, and amenity restocks—scheduled pickups so guests are never left waiting on ad-hoc transport.',
  },
  {
    title: 'Restaurants & kitchens',
    body: 'Daily kitchen input runs, dry goods, and rush replenishment during peak darshan and festival days.',
  },
  {
    title: 'Dharamshalas & community halls',
    body: 'Bulk staples, mats, utensils, and event-day supplies moved on time across short corridors.',
  },
  {
    title: 'Prasad shops & small retail',
    body: 'Cartons, sweets packaging, and shop-to-shop transfers without juggling unknown drivers at the gate.',
  },
  {
    title: 'Local traders & services',
    body: 'Hardware, event material, and construction inputs for lane upgrades or temporary structures—matched to the right vehicle mode.',
  },
] as const;

export default function KhatuLogisticsPageView() {
  return (
    <article className="flex-1">
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8 lg:pt-14">
        <nav className="mb-8 text-sm text-gray-500" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="font-medium text-[var(--color-primary)] hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-gray-300">
              /
            </li>
            <li>
              <Link href={ROUTES.ABOUT} className="font-medium text-[var(--color-primary)] hover:underline">
                About
              </Link>
            </li>
            <li aria-hidden className="text-gray-300">
              /
            </li>
            <li className="font-medium text-gray-800">Khatu supply chain</li>
          </ol>
        </nav>

        <header className="mb-12 max-w-4xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)] sm:text-sm">
            Khatu Shyam Ji · Rajasthan · Hyperlocal logistics
          </p>
          <h1 className={textH1}>
            <span className="text-[var(--color-primary)]">Khatu &amp; nearby:</span> supply chain for every business that serves the corridor
          </h1>
          <p className={`mt-5 max-w-3xl ${textLead}`}>
            {BRAND.name} is <strong className="font-semibold text-gray-900">launching with depth in Khatu</strong>—connecting the daily goods
            movement needs of businesses around <strong className="font-semibold text-gray-900">Khatu Shyam Ji</strong>, Rajasthan, through one
            dependable logistics layer.
          </p>
          <p className={`mt-4 max-w-3xl ${textProse}`}>
            We collaborate with <strong className="font-semibold text-gray-900">guest houses, restaurants, dharamshalas, prasad and retail shops,</strong>{' '}
            and <strong className="font-semibold text-gray-900">small businesses</strong> along the yatra ecosystem so stock, provisions, and
            materials flow on time—whether that is walk, two-wheel, or three-wheel cargo (including electric, CNG, diesel, and petrol units where
            needed).
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={ROUTES.PICKUP_LOCATION} className={BTN_PRIMARY}>
              Book delivery in Khatu
            </Link>
            <Link href={ROUTES.FIND_RESTAURANT} className={BTN_SECONDARY}>
              Explore trusted food &amp; shops
            </Link>
            <Link href="/khatu-goods-transport" className={BTN_SECONDARY}>
              Khatu goods transport
            </Link>
            <Link href={ROUTES.ABOUT} className={BTN_SECONDARY}>
              Back to About
            </Link>
          </div>
        </header>

        <section className="mb-14 sm:mb-16" aria-labelledby="ecosystem">
          <h2 id="ecosystem" className={`mb-4 ${textH2}`}>
            Who we connect across the local supply chain
          </h2>
          <p className={`mb-8 max-w-3xl ${textBody}`}>
            If your operation supports pilgrims, residents, or festival peaks, predictable goods transport is not optional—it is how you keep
            trust and margin intact.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNERS.map((item) => (
              <li key={item.title} className={CARD}>
                <h3 className={textH3}>{item.title}</h3>
                <p className={`mt-2 ${textBody}`}>{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-14 rounded-3xl border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/[0.04] p-6 sm:p-10" aria-labelledby="discover">
          <h2 id="discover" className={`mb-4 ${textH2}`}>
            Explore Khatu with clearer choices—less room for scams
          </h2>
          <div className={`max-w-3xl space-y-4 ${textProse}`}>
            <p>
              Visitors often struggle to tell which meal or shop is fair-priced and hygienic. Alongside delivery, {BRAND.name} points you toward{' '}
              <strong className="font-semibold text-gray-900">curated restaurants and shops</strong> we believe represent some of the{' '}
              <strong className="font-semibold text-gray-900">best local options</strong>—so you can plan meals and prasad purchases with more
              confidence.
            </p>
            <p>
              <strong className="font-semibold text-gray-900">No substitute for your own judgment:</strong> always confirm menus, rates, and
              packaging. Our goal is to reduce opaque street hustles and help you spend time in darshan—not arguing over unclear bills.
            </p>
            <p>
              <Link href={ROUTES.FIND_RESTAURANT} className="font-semibold text-[var(--color-primary)] hover:underline">
                Open Find Restaurant &amp; shops →
              </Link>
            </p>
          </div>
        </section>

        <section className="mb-14 sm:mb-16" aria-labelledby="faq-khatu">
          <h2 id="faq-khatu" className={`mb-6 ${textH2}`}>
            Frequently asked questions
          </h2>
          <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
            {KHATU_SUPPLY_CHAIN_FAQ.map((item) => (
              <li key={item.question} className="px-5 py-6 sm:px-8 sm:py-7">
                <h3 className={textH3}>{item.question}</h3>
                <p className={`mt-2 ${textBody}`}>{item.answer}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-12">
          <h2 className={textH2}>Serving Khatu Shyam Ji together</h2>
          <p className={`mx-auto mt-4 max-w-2xl ${textProse}`}>
            Whether you run a kitchen, a stay, or a counter—book goods transport the same way your guests book trust: clearly, upfront, and built
            for the corridor.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link href={ROUTES.PICKUP_LOCATION} className={BTN_PRIMARY}>
              Book now
            </Link>
            <Link href={ROUTES.ABOUT_B2B_LOGISTICS} className={BTN_SECONDARY}>
              B2B logistics detail
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
