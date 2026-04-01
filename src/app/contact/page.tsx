import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd, { buildContactPageJsonLd } from '@/components/JsonLd';
import Link from 'next/link';
import FaqAccordionList from '@/components/landing/FaqAccordionList';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { SUPPORT_PHONE, SUPPORT_EMAIL, SOCIAL_LINKS } from '@/config/env';
import { supportTelephoneE164 } from '@/lib/structuredData/organizationShared';
import { CONTACT_PAGE_FAQS } from '@/data/marketingPageFaqs';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';

const PATH = ROUTES.CONTACT;
const PAGE_URL = `${SITE_URL}${PATH}`;
const PAGE_TITLE = 'Contact us';
const PAGE_DESCRIPTION =
  'Contact Liftngo for bookings, B2B logistics in Noida & Delhi NCR, and Khatu Shyam Ji corridor support. Phone, email, social links, and FAQs.';

export const metadata = generatePageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PATH,
  keywords: [
    'contact Liftngo',
    'Liftngo support',
    'goods transport help',
    'B2B logistics contact Noida',
    'Khatu delivery support',
  ],
});

const faqForLd = CONTACT_PAGE_FAQS.map(({ question, answer }) => ({ question, answer }));

export default function ContactPage() {
  const tel = supportTelephoneE164();
  const telDisplay = SUPPORT_PHONE.replace(/\D/g, '').length >= 10 ? SUPPORT_PHONE : null;

  return (
    <ContentLayout
      breadcrumbs={[BREADCRUMB_HOME, { name: 'Contact', path: PATH }]}
    >
      <JsonLd
        data={buildContactPageJsonLd({
          pageUrl: PAGE_URL,
          name: `${PAGE_TITLE} — ${SITE_NAME}`,
          description: PAGE_DESCRIPTION,
          faqMainEntity: faqForLd,
        })}
      />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact {SITE_NAME}</h1>
          <p className="mt-4 text-lg text-gray-600 leading-relaxed">
            Reach us for booking help, corridor-specific questions (Khatu Shyam Ji hyperlocal or Noida &amp; Delhi NCR B2B), and
            partnership enquiries. For fastest answers to common topics, start with{' '}
            <Link href="/faq" className="font-medium text-[var(--color-primary)] hover:underline">
              FAQs
            </Link>
            .
          </p>

          <section className="mt-12" aria-labelledby="contact-channels">
            <h2 id="contact-channels" className="text-xl font-semibold text-gray-900">
              Direct channels
            </h2>
            <ul className="mt-4 space-y-4 text-gray-700">
              {telDisplay && tel ? (
                <li>
                  <span className="font-semibold text-gray-900">Phone: </span>
                  <a href={`tel:${tel}`} className="text-[var(--color-primary)] hover:underline">
                    {telDisplay}
                  </a>
                </li>
              ) : (
                <li className="text-gray-600">
                  <span className="font-semibold text-gray-900">Phone: </span>
                  Use the number in your booking confirmation or in-app support when logged in.
                </li>
              )}
              {SUPPORT_EMAIL ? (
                <li>
                  <span className="font-semibold text-gray-900">Email: </span>
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[var(--color-primary)] hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                </li>
              ) : (
                <li className="text-gray-600">
                  <span className="font-semibold text-gray-900">Email: </span>
                  Set <code className="rounded bg-gray-100 px-1 text-sm">NEXT_PUBLIC_SUPPORT_EMAIL</code> for production, or use
                  phone / social below.
                </li>
              )}
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="contact-social">
            <h2 id="contact-social" className="text-xl font-semibold text-gray-900">
              Social
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Updates and brand-verified handles (opens in a new tab).
            </p>
            <ul className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-[var(--color-primary)]">
              <li>
                <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  Instagram
                </a>
              </li>
              <li>
                <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  X (Twitter)
                </a>
              </li>
              <li>
                <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  YouTube
                </a>
              </li>
            </ul>
          </section>

          <section className="mt-10" aria-labelledby="contact-corridors">
            <h2 id="contact-corridors" className="text-xl font-semibold text-gray-900">
              Service corridors
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Browse corridor landings before you message support—they explain vehicles, booking flows, and realistic ETAs.
            </p>
            <ul className="mt-4 space-y-2 text-[var(--color-primary)] font-medium">
              <li>
                <Link href={ROUTES.KHATU_SHYAM_LOGISTICS} className="hover:underline">
                  Khatu Shyam Ji logistics
                </Link>
              </li>
              <li>
                <Link href={ROUTES.NOIDA_B2B_LOGISTICS} className="hover:underline">
                  Noida &amp; Delhi NCR B2B
                </Link>
              </li>
              <li>
                <Link href={ROUTES.B2B_TRANSPORT} className="hover:underline">
                  B2B transport overview
                </Link>
              </li>
              <li>
                <Link href={ROUTES.BOOK_DELIVERY} className="hover:underline">
                  Book delivery
                </Link>
              </li>
            </ul>
          </section>

          <section className="mt-14 border-t border-gray-200 pt-12" aria-labelledby="contact-self-serve">
            <h2 id="contact-self-serve" className="text-xl font-semibold text-gray-900">
              When self-serve booking beats waiting on a thread
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Many questions—vehicle class, estimate range, same-day feasibility—resolve faster through the{' '}
              <Link href={ROUTES.BOOK_DELIVERY} className="font-semibold text-[var(--color-primary)] hover:underline">
                book delivery flow
              </Link>{' '}
              with pickup and drop pins. That keeps support free for exceptions: damaged crates, disputes, or pilot contracts that need a
              human. Teams in <strong className="text-gray-800">Noida</strong> and across{' '}
              <strong className="text-gray-800">Delhi NCR</strong> often route procurement through{' '}
              <Link href={ROUTES.B2B_TRANSPORT} className="font-semibold text-[var(--color-primary)] hover:underline">
                B2B logistics positioning
              </Link>
              ; temple-town vendors near <strong className="text-gray-800">Khatu Shyam Ji</strong> start with{' '}
              <Link href={ROUTES.KHATU_SHYAM_LOGISTICS} className="font-semibold text-[var(--color-primary)] hover:underline">
                hyperlocal delivery context
              </Link>{' '}
              so expectations match lane physics.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Drivers exploring the network should read{' '}
              <Link href={ROUTES.BECOME_DRIVER} className="font-semibold text-[var(--color-primary)] hover:underline">
                Become a driver partner
              </Link>{' '}
              before emailing—onboarding requirements and corridor assignment are easier once you know the cargo-first model.
            </p>
          </section>

          <section className="mt-14" aria-labelledby="contact-faq-heading">
            <h2 id="contact-faq-heading" className="text-xl font-semibold text-gray-900">
              Contact &amp; support FAQs
            </h2>
            <p className="mt-2 text-sm text-gray-600">Structured data mirrors these answers for Google.</p>
            <div className="mt-6 max-w-2xl">
              <FaqAccordionList items={CONTACT_PAGE_FAQS} />
            </div>
          </section>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={ROUTES.B2B_TRANSPORT}
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Explore B2B services
            </Link>
            <Link
              href={ROUTES.KHATU_SHYAM_LOGISTICS}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Check Khatu delivery
            </Link>
            <Link
              href={ROUTES.BECOME_DRIVER}
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--color-primary)]/35 bg-[var(--color-primary)]/8 px-6 py-3 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/15"
            >
              Become a driver
            </Link>
          </div>
        </div>
      </main>
    </ContentLayout>
  );
}
