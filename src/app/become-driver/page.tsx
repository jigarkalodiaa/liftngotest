import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd, { buildWebPageJsonLd } from '@/components/JsonLd';
import Link from 'next/link';
import FaqAccordionList from '@/components/landing/FaqAccordionList';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { BECOME_DRIVER_PAGE_FAQS } from '@/data/marketingPageFaqs';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

const PATH = ROUTES.BECOME_DRIVER;
const PAGE_URL = `${SITE_URL}${PATH}`;
const PAGE_TITLE = 'Become a driver partner';
const PAGE_DESCRIPTION =
  'Drive with Liftngo: cargo-first logistics around Khatu Shyam Ji and Delhi NCR—requirements, safety, earnings context, and how to apply via careers.';

export const metadata = generatePageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PATH,
  keywords: [
    'Liftngo driver partner',
    'become delivery partner India',
    'goods transport driver',
    'cargo driver Noida',
    'Khatu logistics jobs',
  ],
});

const faqForLd = BECOME_DRIVER_PAGE_FAQS.map(({ question, answer }) => ({ question, answer }));

export default function BecomeDriverPage() {
  return (
    <ContentLayout
      breadcrumbs={[BREADCRUMB_HOME, { name: 'Become a driver', path: PATH }]}
    >
      <JsonLd
        data={buildWebPageJsonLd({
          pageUrl: PAGE_URL,
          name: `${PAGE_TITLE} — ${SITE_NAME}`,
          description: PAGE_DESCRIPTION,
          faqMainEntity: faqForLd,
        })}
      />
      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Become a driver partner with {SITE_NAME}</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            {SITE_NAME} is built for <strong className="text-gray-800">goods transport</strong>—walk, two-wheel, three-wheel cargo, and
            four-wheel mini trucks—not passenger joyrides. If you prefer predictable handoffs, clear vehicle classes, and corridor depth
            over spray-and-pray nationwide claims, you are in the right place.
          </p>

          <h2 className="mt-12 text-xl font-semibold text-gray-900">What we optimise for</h2>
          <ul className="mt-4 list-disc space-y-2 ps-5 text-gray-700 leading-relaxed">
            <li>
              <strong className="text-gray-900">Cargo mindset:</strong> space for cartons, straps where needed, and completion proof—not
              only star ratings.
            </li>
            <li>
              <strong className="text-gray-900">Dense corridors:</strong> serious work in{' '}
              <Link href={ROUTES.KHATU_SHYAM_LOGISTICS} className="text-[var(--color-primary)] hover:underline">
                Khatu Shyam Ji
              </Link>{' '}
              and structured{' '}
              <Link href={ROUTES.NOIDA_B2B_LOGISTICS} className="text-[var(--color-primary)] hover:underline">
                Noida / Delhi NCR B2B
              </Link>
              .
            </li>
            <li>
              <strong className="text-gray-900">Upfront estimates</strong> for shippers reduce argument-heavy corners; your time at gate and
              loading bay should be reflected honestly.
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-semibold text-gray-900">How to apply</h2>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Open roles and driver-success programmes are listed on our{' '}
            <Link href="/careers" className="font-medium text-[var(--color-primary)] hover:underline">
              Careers
            </Link>{' '}
            page. Promotions such as referral bonuses are summarised on{' '}
            <Link href="/promotions" className="font-medium text-[var(--color-primary)] hover:underline">
              Promotions &amp; offers
            </Link>
            . For booking or support questions before you join, use{' '}
            <Link href={ROUTES.CONTACT} className="font-medium text-[var(--color-primary)] hover:underline">
              Contact
            </Link>{' '}
            or{' '}
            <Link href="/faq" className="font-medium text-[var(--color-primary)] hover:underline">
              FAQs
            </Link>
            .
          </p>

          <h2 className="mt-10 text-xl font-semibold text-gray-900">Vehicle and compliance snapshot</h2>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Expect identity checks, vehicle fitness aligned to the class you run, and insurance context appropriate for commercial goods.
            Exact rules evolve by city—your onboarding packet from driver success is authoritative.
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed">
            Review public service pages for what shippers book:{' '}
            <Link href="/services" className="text-[var(--color-primary)] hover:underline">
              Services overview
            </Link>
            ,{' '}
            <Link href="/services/2-wheeler" className="text-[var(--color-primary)] hover:underline">
              2-wheeler
            </Link>
            ,{' '}
            <Link href="/services/3-wheeler" className="text-[var(--color-primary)] hover:underline">
              3-wheeler cargo
            </Link>
            ,{' '}
            <Link href="/services/4-wheeler" className="text-[var(--color-primary)] hover:underline">
              4-wheeler / mini truck
            </Link>
            .
          </p>

          <h2 className="mt-12 text-xl font-semibold text-gray-900">Corridor reality: Khatu versus NCR</h2>
          <p className="mt-4 text-gray-700 leading-relaxed">
            In <strong className="text-gray-900">Khatu Shyam Ji</strong>, you earn trust by surviving procession slowdowns and tight handoffs
            without drama—read{' '}
            <Link href="/blog/logistics-khatu-shyam" className="font-semibold text-[var(--color-primary)] hover:underline">
              logistics context for Khatu Shyam Ji
            </Link>{' '}
            before your first peak weekend. In <strong className="text-gray-900">Noida</strong> and{' '}
            <strong className="text-gray-900">Delhi NCR</strong>, dock etiquette and document clarity matter as much as speed; shippers compare
            you to formal{' '}
            <Link href={ROUTES.NOIDA_B2B_LOGISTICS} className="font-semibold text-[var(--color-primary)] hover:underline">
              B2B delivery programmes
            </Link>
            , not hobby couriers.
          </p>

          <section className="mt-12" aria-labelledby="driver-faq-heading">
            <h2 id="driver-faq-heading" className="text-xl font-semibold text-gray-900">
              Driver partner FAQs
            </h2>
            <div className="mt-6 max-w-2xl">
              <FaqAccordionList items={BECOME_DRIVER_PAGE_FAQS} analyticsScope="become_driver_page" />
            </div>
          </section>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/careers"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              View careers and open roles
            </Link>
            <Link
              href={ROUTES.B2B_TRANSPORT}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Explore B2B logistics services
            </Link>
            <Link
              href={ROUTES.KHATU_SHYAM_LOGISTICS}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--color-primary)]/35 bg-[var(--color-primary)]/8 px-6 py-3 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/15"
            >
              Check Khatu corridor delivery
            </Link>
          </div>
        </article>
      </main>
    </ContentLayout>
  );
}
