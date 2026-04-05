import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';
import { indiaPhotoBangaloreLoadedTruck } from '@/config/indiaLogisticsImages';
import { PRIVACY_LAST_UPDATED_ISO, PRIVACY_SECTIONS } from '@/data/privacyPolicy';

const LAST_UPDATED_DISPLAY = new Date(PRIVACY_LAST_UPDATED_ISO).toLocaleDateString('en-IN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export const metadata = generatePageMetadata({
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `${SITE_NAME} Privacy Policy — personal data collection, trips and lease checkout, Razorpay payments, partners and subprocessors, retention, security, India DPDP-oriented rights, cookies, and contact.`,
  path: '/privacy',
  keywords: [
    `${SITE_NAME} privacy`,
    'privacy policy India',
    'DPDP privacy logistics',
    'delivery data protection',
    'GST booking data',
    'Razorpay data processing',
    'WhatsApp business privacy logistics',
  ],
});

export default function PrivacyPage() {
  return (
    <ContentLayout breadcrumbs={[BREADCRUMB_HOME, { name: 'Privacy Policy', path: '/privacy' }]}>
      <main className="flex-1 bg-stone-50/80">
        <section className="relative overflow-hidden bg-[#12152a]">
          <div className="absolute inset-0">
            <Image
              src={indiaPhotoBangaloreLoadedTruck(1600)}
              alt="Indian logistics — Liftngo privacy policy"
              fill
              className="object-cover opacity-45"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12152a]/95 via-[#12152a]/65 to-[#12152a]/40" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">Legal</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.5rem]">
              Privacy Policy
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
              How {SITE_NAME} collects, uses, stores, and protects personal data across trips, subscriptions, rental &amp;
              lease flows, payments, and partner logistics — with India-first compliance framing.
            </p>
            <p className="mt-4 text-sm font-medium text-white/85">
              Last updated:{' '}
              <time dateTime={PRIVACY_LAST_UPDATED_ISO}>{LAST_UPDATED_DISPLAY}</time>
            </p>
            <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-2 text-[11px] text-white/80 sm:text-xs">
              <Link
                href="/terms"
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-semibold backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact#grievance-officer"
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-semibold backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                Contact &amp; grievance officer
              </Link>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:flex lg:gap-10 lg:px-8 lg:py-14">
          <nav
            aria-label="Privacy policy sections"
            className="mb-10 lg:sticky lg:top-28 lg:mb-0 lg:h-fit lg:w-64 lg:shrink-0 lg:self-start"
          >
            <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">On this page</p>
              <ol className="mt-3 max-h-[min(70vh,560px)] space-y-1.5 overflow-y-auto overscroll-contain pr-1 text-[11px] leading-snug sm:text-xs">
                {PRIVACY_SECTIONS.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block rounded-lg px-2 py-1 text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900"
                    >
                      <span className="tabular-nums text-stone-400">{i + 1}.</span> {s.title.replace(/^\d+\.\s*/, '')}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <div className="min-w-0 flex-1">
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-[12px] leading-relaxed text-emerald-950 shadow-sm sm:px-5 sm:text-[13px]">
              <strong className="font-semibold">Summary:</strong> We use personal data to run logistics, billing, and
              safety. We share with Partners and vetted vendors only as needed. You have rights under Indian law (including
              the DPDP framework as applicable). Read alongside our{' '}
              <Link href="/terms" className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline">
                Terms of Service
              </Link>
              .
            </div>

            <article className="prose prose-gray prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:text-stone-900 prose-p:text-stone-600 prose-p:leading-relaxed prose-li:text-stone-600 prose-strong:text-stone-800 mt-8 max-w-none">
              {PRIVACY_SECTIONS.map((section) => (
                <section key={section.id} id={section.id} className="border-b border-stone-200/70 pb-10 pt-2 last:border-0 last:pb-2">
                  <h2 className="text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">{section.title}</h2>
                  {section.intro?.map((p, idx) => (
                    <p key={`${section.id}-intro-${idx}`}>{p}</p>
                  ))}
                  {section.body?.map((p, idx) => (
                    <p key={`${section.id}-body-${idx}`}>{p}</p>
                  ))}
                  {section.subsections?.map((sub) => (
                    <div key={sub.heading} className="mt-6">
                      <h3 className="!mt-0 text-base font-semibold text-stone-900 sm:text-lg">{sub.heading}</h3>
                      {sub.body.map((p, idx) => (
                        <p key={`${section.id}-${sub.heading}-${idx}`}>{p}</p>
                      ))}
                    </div>
                  ))}
                </section>
              ))}
            </article>

            <p className="mt-10 rounded-xl border border-stone-200 bg-white px-4 py-3 text-[11px] leading-relaxed text-stone-500 sm:text-xs">
              This Policy is provided for transparency. It does not constitute legal advice. Specific enterprise or
              high-volume data-processing arrangements may be governed by additional data processing agreements. The
              contracting {SITE_NAME} entity for your services may be identified on invoices or order confirmations.
            </p>
          </div>
        </div>
      </main>
    </ContentLayout>
  );
}
