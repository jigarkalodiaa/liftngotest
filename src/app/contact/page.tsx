import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd, { buildContactPageJsonLd } from '@/components/JsonLd';
import Link from 'next/link';
import FaqAccordionList from '@/components/landing/FaqAccordionList';
import {
  TrackedMailtoAnchor,
  TrackedOutboundAnchor,
  TrackedTelAnchor,
} from '@/components/analytics/TrackedContactAnchors';
import BusinessEnquiryForm from '@/components/marketing/BusinessEnquiryForm';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { SUPPORT_PHONE, SUPPORT_EMAIL, SOCIAL_LINKS } from '@/config/env';
import {
  GRIEVANCE_OFFICER_DESIGNATION,
  GRIEVANCE_OFFICER_NAME,
  PRIVACY_EMAIL,
  grievanceMailtoHref,
} from '@/lib/legalContacts';
import { supportTelephoneE164 } from '@/lib/structuredData/organizationShared';
import { CONTACT_PAGE_FAQS } from '@/data/marketingPageFaqs';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Headphones,
  Mail,
  MapPin,
  Phone,
  Scale,
  Shield,
} from 'lucide-react';

const PATH = ROUTES.CONTACT;
const PAGE_URL = `${SITE_URL}${PATH}`;
const PAGE_TITLE = 'Liftngo Customer Care | Helpline Number & Support';
const PAGE_DESCRIPTION =
  'Contact Liftngo customer support for goods transport, home shifting, and delivery services. Helpline number, WhatsApp support, office address in Noida. 24/7 customer care.';

export const metadata = generatePageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PATH,
  keywords: [
    'customer care number',
    'helpline number',
    'customer support',
    'contact number',
    'head office',
    'office address noida',
    'customer service',
    'support helpline',
    'whatsapp support',
    'Liftngo contact',
    'goods transport support',
    'delivery service helpline',
  ],
});

const faqForLd = CONTACT_PAGE_FAQS.map(({ question, answer }) => ({ question, answer }));

const TRUST_CHIPS = [
  'Published grievance officer',
  'Privacy & legal policies',
  'B2B & corridor specialists',
] as const;

export default function ContactPage() {
  const tel = supportTelephoneE164();
  const telDisplay = SUPPORT_PHONE.replace(/\D/g, '').length >= 10 ? SUPPORT_PHONE : null;

  return (
    <ContentLayout
      breadcrumbs={[BREADCRUMB_HOME, { name: 'Contact', path: PATH }]}
      breadcrumbNavVisible={false}
    >
      <JsonLd
        data={buildContactPageJsonLd({
          pageUrl: PAGE_URL,
          name: `${PAGE_TITLE} — ${SITE_NAME}`,
          description: PAGE_DESCRIPTION,
          faqMainEntity: faqForLd,
        })}
      />
      <main className="flex-1 bg-[#f6f5f2]">
        {/* Hero — aligned with /plans premium strip */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1e1f4b] via-[#2C2D5B] to-[#151632] pb-16 pt-6 text-white sm:pb-20 sm:pt-8">
          <div
            className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-[var(--color-primary)]/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-white/55 sm:text-xs">
                <li>
                  <Link href="/" className="transition-colors hover:text-white">
                    Home
                  </Link>
                </li>
                <li className="text-white/35" aria-hidden>
                  /
                </li>
                <li className="text-white/90">Contact</li>
              </ol>
            </nav>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <div className="min-w-0 max-w-2xl">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85 ring-1 ring-white/15 backdrop-blur-sm sm:text-[11px]">
                  <Headphones className="h-3.5 w-3.5 text-emerald-300 sm:h-4 sm:w-4" strokeWidth={2} aria-hidden />
                  Support &amp; partnerships
                </p>
                <h1 className="mt-4 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
                  Talk to {SITE_NAME}
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/72 sm:text-base">
                  Booking help, corridor-specific guidance (Khatu Shyam Ji or Noida &amp; Delhi NCR B2B), leases, and
                  partnership enquiries. We respond with the same discipline we apply to your loads—clear, documented, and
                  respectful of your time.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {TRUST_CHIPS.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-white/88 shadow-sm backdrop-blur-sm sm:text-[11px]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400/90" strokeWidth={2} aria-hidden />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                <Link
                  href="/faq"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/15 sm:text-sm"
                >
                  <BookOpen className="h-4 w-4 shrink-0 opacity-90" strokeWidth={2} aria-hidden />
                  FAQs
                </Link>
                <Link
                  href="/terms"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white/95 backdrop-blur-sm transition-colors hover:bg-white/15 sm:text-sm"
                >
                  Terms
                </Link>
                <Link
                  href="/privacy"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white/95 backdrop-blur-sm transition-colors hover:bg-white/15 sm:text-sm"
                >
                  Privacy
                </Link>
                <Link
                  href="#business-enquiry"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-4 py-2.5 text-xs font-semibold text-emerald-100 backdrop-blur-sm transition-colors hover:bg-emerald-500/25 sm:text-sm"
                >
                  Business enquiry
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="relative z-10 mx-auto -mt-8 max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          {/* Primary channel cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {telDisplay && tel ? (
              <TrackedTelAnchor
                href={`tel:${tel}`}
                analyticsSource="contact_phone_card"
                className="group relative flex flex-col rounded-2xl bg-white p-5 shadow-[0_12px_40px_-16px_rgba(25,26,70,0.35)] ring-1 ring-slate-900/[0.06] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_16px_48px_-14px_rgba(25,26,70,0.38)] sm:p-6"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Phone className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <h2 className="mt-4 text-sm font-bold text-slate-900 sm:text-base">Phone</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                  Fastest for active trips and time-sensitive corridors.
                </p>
                <span className="mt-3 text-lg font-bold tabular-nums tracking-tight text-[var(--color-primary)] group-hover:underline">
                  {telDisplay}
                </span>
              </TrackedTelAnchor>
            ) : (
              <div className="relative flex flex-col rounded-2xl border border-dashed border-slate-200 bg-white/90 p-5 sm:p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
                  <Phone className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <h2 className="mt-4 text-sm font-bold text-slate-900 sm:text-base">Phone</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                  Configure <code className="font-mono text-[10px]">NEXT_PUBLIC_SUPPORT_PHONE</code> for a clickable number.
                </p>
                <p className="mt-3 text-sm font-medium text-slate-600">
                  Otherwise use the number in your booking confirmation or in-app support when logged in.
                </p>
              </div>
            )}

            {SUPPORT_EMAIL ? (
              <TrackedMailtoAnchor
                href={`mailto:${SUPPORT_EMAIL}`}
                analyticsSource="contact_email_card"
                className="group relative flex flex-col rounded-2xl bg-white p-5 shadow-[0_12px_40px_-16px_rgba(25,26,70,0.35)] ring-1 ring-slate-900/[0.06] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_16px_48px_-14px_rgba(25,26,70,0.38)] sm:p-6"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-100/90 text-violet-700">
                  <Mail className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <h2 className="mt-4 text-sm font-bold text-slate-900 sm:text-base">Team email</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                  Quotes, B2B procurement, and detailed written context.
                </p>
                <span className="mt-3 break-all text-sm font-bold text-[var(--color-primary)] sm:text-base group-hover:underline">
                  {SUPPORT_EMAIL}
                </span>
              </TrackedMailtoAnchor>
            ) : (
              <div className="relative flex flex-col rounded-2xl border border-dashed border-slate-200 bg-white/90 p-5 sm:p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-100/60 text-violet-600/80">
                  <Mail className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <h2 className="mt-4 text-sm font-bold text-slate-900 sm:text-base">Team email</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                  Set <code className="font-mono text-[10px]">info@goliftngo.com</code> for a clickable team inbox.
                </p>
              </div>
            )}

            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-50/90 to-white p-5 ring-1 ring-slate-100 sm:p-6 lg:col-span-1">
              <div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-200/80 text-slate-600">
                  <MapPin className="h-5 w-5" strokeWidth={2} aria-hidden />
                </span>
                <h2 className="mt-4 text-sm font-bold text-slate-900 sm:text-base">Corridors we know well</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
                  Read the lane before you message—fewer round-trips, sharper answers.
                </p>
              </div>
              <ul className="mt-4 space-y-2 border-t border-slate-200/80 pt-4">
                {[
                  { href: ROUTES.KHATU_SHYAM_LOGISTICS, label: 'Khatu Shyam Ji' },
                  { href: ROUTES.NOIDA_B2B_LOGISTICS, label: 'Noida & NCR B2B' },
                  { href: ROUTES.BOOK_DELIVERY, label: 'Book delivery' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center justify-between gap-2 text-xs font-semibold text-[var(--color-primary)] transition-colors hover:text-[#1e40af] sm:text-sm"
                    >
                      {item.label}
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={2} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Business enquiry */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <BusinessEnquiryForm />
            </div>
            <aside className="flex flex-col justify-center rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 ring-1 ring-slate-100 sm:p-6 lg:col-span-5">
              <h3 className="text-sm font-bold text-slate-900 sm:text-base">What happens next</h3>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />
                  <span>We use your details only to follow up on this enquiry.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />
                  <span>Typical reply: within one to two working days for B2B and partnerships.</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2} aria-hidden />
                  <span>For urgent active trips, call the support number above.</span>
                </li>
              </ul>
            </aside>
          </div>

          {/* Grievance — formal trust band */}
          <section
            id="grievance-officer"
            className="relative mt-6 scroll-mt-28 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950/95 via-[#0f2922] to-[#134e4a] p-5 text-white shadow-[0_20px_50px_-20px_rgba(6,78,59,0.65)] ring-1 ring-emerald-400/20 sm:p-8"
            aria-labelledby="contact-grievance"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_80%_60%_at_70%_-20%,black,transparent)]"
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
              <div className="flex min-w-0 flex-1 gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                  <Shield className="h-6 w-6 text-emerald-300" strokeWidth={1.75} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h2 id="contact-grievance" className="text-lg font-bold tracking-tight sm:text-xl">
                    Grievance officer &amp; nodal contact
                  </h2>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-200/90 sm:text-xs">
                    Legal · data protection · compliance
                  </p>
                  <p className="mt-3 text-sm font-medium text-white/90">{GRIEVANCE_OFFICER_DESIGNATION}</p>
                  <p className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">{GRIEVANCE_OFFICER_NAME}</p>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-emerald-50/90">
                    Privacy grievances, personal-data requests, and statutory escalations under applicable Indian law—write
                    with your registered details, order or trip IDs, and a short factual summary. We route operational tickets and
                    formal grievances with clear ownership.
                  </p>
                  <a
                    href={grievanceMailtoHref}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-200 underline decoration-emerald-400/50 underline-offset-4 transition-colors hover:text-white hover:decoration-white"
                  >
                    <Mail className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
                    {PRIVACY_EMAIL}
                  </a>
                  <p className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-emerald-100/85">
                    <Link href="/privacy" className="hover:text-white hover:underline">
                      Privacy Policy
                    </Link>
                    <span className="text-emerald-600/80" aria-hidden>
                      ·
                    </span>
                    <Link href="/terms" className="hover:text-white hover:underline">
                      Terms of Service
                    </Link>
                  </p>
                </div>
              </div>
              <div className="shrink-0 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center backdrop-blur-sm sm:px-5 sm:text-left">
                <Scale className="mx-auto h-5 w-5 text-emerald-200 sm:mx-0" strokeWidth={1.75} aria-hidden />
                <p className="mt-2 text-[11px] font-semibold leading-snug text-emerald-100/95">
                  For regulatory or formal notices, use the email above with a clear subject line. Physical registered address
                  appears on tax invoices and corporate disclosures where required.
                </p>
              </div>
            </div>
          </section>

          {/* Social + more corridors */}
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <section
              className="rounded-2xl bg-white p-5 shadow-lg shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.06] sm:p-6 lg:col-span-5"
              aria-labelledby="contact-social"
            >
              <h2 id="contact-social" className="text-sm font-bold text-slate-900 sm:text-base">
                Verified social
              </h2>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">Official brand channels (new tab).</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {[
                  { href: SOCIAL_LINKS.linkedin, label: 'LinkedIn', Icon: LinkedInGlyph },
                  { href: SOCIAL_LINKS.instagram, label: 'Instagram', Icon: InstagramIcon },
                  { href: SOCIAL_LINKS.x, label: 'X', Icon: XIcon },
                  { href: SOCIAL_LINKS.youtube, label: 'YouTube', Icon: YoutubeGlyph },
                ].map(({ href, label, Icon }) => (
                  <li key={label}>
                    <TrackedOutboundAnchor
                      href={href}
                      label={label}
                      analyticsSource="contact_social"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/50 px-3 py-2.5 text-xs font-bold text-slate-800 transition-colors hover:border-[var(--color-primary)]/25 hover:bg-[var(--color-primary)]/[0.06] hover:text-[var(--color-primary)]"
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      {label}
                    </TrackedOutboundAnchor>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="rounded-2xl bg-white p-5 shadow-lg shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.06] sm:p-6 lg:col-span-7"
              aria-labelledby="contact-corridors"
            >
              <h2 id="contact-corridors" className="text-sm font-bold text-slate-900 sm:text-base">
                Service &amp; positioning pages
              </h2>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                Context first—then a sharper conversation with our team.
              </p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {[
                  { href: ROUTES.B2B_TRANSPORT, label: 'B2B transport overview', desc: 'Fleet framing & lanes' },
                  { href: ROUTES.KHATU_SHYAM_LOGISTICS, label: 'Khatu Shyam Ji', desc: 'Hyperlocal temple-town' },
                  { href: ROUTES.NOIDA_B2B_LOGISTICS, label: 'Noida B2B logistics', desc: 'NCR procurement' },
                  { href: ROUTES.BOOK_DELIVERY, label: 'Book delivery', desc: 'Start a trip' },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/40 px-3 py-3 transition-colors hover:border-[var(--color-primary)]/20 hover:bg-white"
                    >
                      <span>
                        <span className="block text-xs font-bold text-slate-900 sm:text-sm">{item.label}</span>
                        <span className="mt-0.5 block text-[10px] text-slate-500 sm:text-[11px]">{item.desc}</span>
                      </span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Self-serve */}
          <section
            className="mt-10 rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8"
            aria-labelledby="contact-self-serve"
          >
            <h2 id="contact-self-serve" className="text-base font-bold text-slate-900 sm:text-lg">
              When self-serve beats waiting on a thread
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              Vehicle class, estimate range, and same-day feasibility often resolve faster in the{' '}
              <Link
                href={ROUTES.BOOK_DELIVERY}
                className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
              >
                book delivery flow
              </Link>{' '}
              with pickup and drop pins—so we can reserve human time for damaged goods, disputes, or pilot contracts. Teams in{' '}
              <strong className="font-semibold text-slate-800">Noida</strong> and{' '}
              <strong className="font-semibold text-slate-800">Delhi NCR</strong> often start from{' '}
              <Link
                href={ROUTES.B2B_TRANSPORT}
                className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
              >
                B2B logistics
              </Link>
              ; Khatu-area vendors start with{' '}
              <Link
                href={ROUTES.KHATU_SHYAM_LOGISTICS}
                className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
              >
                hyperlocal context
              </Link>
              .
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
              Driver partners: read{' '}
              <Link
                href={ROUTES.BECOME_DRIVER}
                className="font-semibold text-[var(--color-primary)] underline-offset-2 hover:underline"
              >
                Become a driver partner
              </Link>{' '}
              before emailing—onboarding is smoother when the cargo-first model is clear.
            </p>
          </section>

          {/* FAQ */}
          <section className="mt-12" aria-labelledby="contact-faq-heading">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 id="contact-faq-heading" className="text-base font-bold text-slate-900 sm:text-lg">
                  Support FAQs
                </h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Structured for search clarity—same answers inform Google rich results.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
              <FaqAccordionList items={CONTACT_PAGE_FAQS} analyticsScope="contact_page" />
            </div>
          </section>

          {/* Closing CTAs */}
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
            <Link
              href={ROUTES.B2B_TRANSPORT}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/25 transition-all hover:opacity-[0.98] active:scale-[0.99] sm:flex-initial sm:min-w-[200px]"
            >
              Explore B2B
              <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
            </Link>
            <Link
              href={ROUTES.KHATU_SHYAM_LOGISTICS}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border border-slate-200/90 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-md ring-1 ring-slate-900/[0.04] transition-colors hover:border-slate-300 hover:bg-slate-50 sm:flex-initial sm:min-w-[200px]"
            >
              Khatu corridor
            </Link>
            <Link
              href={ROUTES.BECOME_DRIVER}
              className="inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl border-2 border-[var(--color-primary)]/30 bg-[var(--color-primary)]/[0.07] px-6 py-3 text-sm font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/12 sm:flex-initial sm:min-w-[200px]"
            >
              Become a driver
            </Link>
          </div>
        </div>
      </main>
    </ContentLayout>
  );
}

/** X (Twitter) glyph */
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YoutubeGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
