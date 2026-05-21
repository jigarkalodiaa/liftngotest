import { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  FileText,
  Globe,
  Mail,
  MapPin,
  ShieldCheck,
  BadgeCheck,
  Layers,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import JsonLd from '@/components/JsonLd';
import ContentLayout from '@/components/layout/ContentLayout';

export const metadata: Metadata = {
  title: 'Legal & Company Information — LiftnGo Logistics | Maalvahak Mobility',
  description:
    'Official legal and company information for LiftnGo Logistics. Brand operated by Maalvahak Mobility, a business unit of Puran Chand HUF. GSTIN, Udyam registration, business address, and compliance details.',
  alternates: { canonical: `${SITE_URL}/legal-company-information` },
  keywords: [
    'LiftnGo Logistics legal information',
    'Maalvahak Mobility',
    'Puran Chand HUF',
    'GSTIN 07AAVHP9623B1ZT',
    'Udyam UDYAM-DL-10-0108269',
    'DLT verification LiftnGo',
    'LiftnGo registered business',
    'goliftngo company details',
  ],
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LiftnGo Logistics',
  alternateName: ['Liftngo', 'Maalvahak Mobility'],
  legalName: 'Puran Chand HUF',
  url: 'https://www.goliftngo.com',
  logo: `${SITE_URL}/logo.png`,
  email: 'liftngohuf@gmail.com',
  description:
    'LiftnGo Logistics is a brand operated by Maalvahak Mobility, a business unit of Puran Chand HUF. Provider of logistics, transportation, and delivery services.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressRegion: 'Delhi',
  },
  identifier: [
    {
      '@type': 'PropertyValue',
      name: 'GSTIN',
      value: '07AAVHP9623B1ZT',
    },
    {
      '@type': 'PropertyValue',
      name: 'Udyam Registration Number',
      value: 'UDYAM-DL-10-0108269',
    },
  ],
  parentOrganization: {
    '@type': 'Organization',
    name: 'Maalvahak Mobility',
    legalName: 'Puran Chand HUF',
  },
  knowsAbout: [
    'Logistics',
    'Transportation',
    'Delivery Services',
    'Goods Transport',
    'Home Shifting',
  ],
};

const INFO_ROWS = [
  { label: 'Brand Name', value: 'LiftnGo Logistics', mono: false },
  { label: 'Trade / Operating Name', value: 'Maalvahak Mobility', mono: false },
  { label: 'Legal Entity', value: 'Puran Chand HUF', mono: false },
  { label: 'GSTIN', value: '07AAVHP9623B1ZT', mono: true },
  { label: 'Udyam Registration No.', value: 'UDYAM-DL-10-0108269', mono: true },
  { label: 'Business Type', value: 'Logistics, Transportation & Delivery Services', mono: false },
  { label: 'Official Email', value: 'liftngohuf@gmail.com', mono: false },
  { label: 'Website', value: 'www.goliftngo.com', mono: false },
  { label: 'Registered State', value: 'Delhi, India', mono: false },
];

export default function LegalCompanyInformationPage() {
  return (
    <ContentLayout
      breadcrumbs={[
        { name: 'Home', path: '/' },
        { name: 'Legal & Company Information', path: '/legal-company-information' },
      ]}
    >
      <JsonLd data={organizationSchema} />

      <main className="flex-1 bg-[#f6f5f2]">
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-14 pt-8 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-white/50">
                <li><Link href="/" className="transition-colors hover:text-white">Home</Link></li>
                <li className="text-white/30" aria-hidden>/</li>
                <li className="text-white/80">Legal &amp; Company Information</li>
              </ol>
            </nav>
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                <ShieldCheck className="h-6 w-6 text-emerald-300" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Compliance &amp; Transparency
                </p>
                <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Legal &amp; Company Information
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-300">
                  Official registration details for LiftnGo Logistics. This page is maintained for DLT
                  auditors, SMS providers, banks, government agencies, and any verification team that
                  needs to confirm the legal identity behind the LiftnGo brand.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
          {/* Brand Identity Card */}
          <section aria-labelledby="brand-identity-heading" className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
              <Layers className="h-5 w-5 text-indigo-600" strokeWidth={1.75} />
              <h2 id="brand-identity-heading" className="text-base font-bold text-gray-900">
                Brand Identity &amp; Registration Details
              </h2>
            </div>
            <div className="divide-y divide-gray-50">
              {INFO_ROWS.map(({ label, value, mono }) => (
                <div key={label} className="flex flex-col gap-1 px-6 py-3.5 sm:flex-row sm:gap-0">
                  <dt className="w-full text-xs font-semibold text-gray-500 sm:w-56 sm:shrink-0">{label}</dt>
                  <dd className={`text-sm text-gray-900 ${mono ? 'font-mono tracking-wide' : 'font-medium'}`}>
                    {value}
                  </dd>
                </div>
              ))}
            </div>
          </section>

          {/* Relationship Explanation */}
          <section aria-labelledby="relationship-heading" className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
              <Building2 className="h-5 w-5 text-indigo-600" strokeWidth={1.75} />
              <h2 id="relationship-heading" className="text-base font-bold text-gray-900">
                Relationship Between LiftnGo and Maalvahak Mobility
              </h2>
            </div>
            <div className="space-y-4 px-6 py-5 text-sm leading-relaxed text-gray-700">
              <p>
                <strong className="text-gray-900">LiftnGo Logistics</strong> is the publicly used brand name and consumer-facing
                identity for all logistics, transportation, and delivery services offered on this platform.
              </p>
              <p>
                The underlying business is operated by <strong className="text-gray-900">Maalvahak Mobility</strong>, which is a
                business unit / trade name of the registered legal entity{' '}
                <strong className="text-gray-900">Puran Chand HUF</strong> (Hindu Undivided Family).
              </p>
              <p>
                All legally binding documents — including service invoices, GST tax invoices, contracts,
                driver partner agreements, and official communications — are issued under the registered
                entity Puran Chand HUF (GSTIN: 07AAVHP9623B1ZT).
              </p>

              {/* Visual hierarchy diagram */}
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-600">
                  Entity Structure
                </p>
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 shadow-sm ring-1 ring-indigo-100">
                    <BadgeCheck className="h-4 w-4 text-indigo-600" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500">Registered Legal Entity</p>
                      <p className="text-sm font-bold text-gray-900">Puran Chand HUF</p>
                    </div>
                  </div>
                  <div className="ml-6 h-4 w-px bg-indigo-200" aria-hidden />
                  <div className="ml-6 flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 shadow-sm ring-1 ring-indigo-100">
                    <Building2 className="h-4 w-4 text-indigo-500" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500">Business Unit / Trade Name</p>
                      <p className="text-sm font-bold text-gray-900">Maalvahak Mobility</p>
                    </div>
                  </div>
                  <div className="ml-12 h-4 w-px bg-indigo-200" aria-hidden />
                  <div className="ml-12 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 shadow-sm">
                    <Globe className="h-4 w-4 text-white" />
                    <div>
                      <p className="text-xs font-semibold text-indigo-200">Public Brand</p>
                      <p className="text-sm font-bold text-white">LiftnGo Logistics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* DLT & Compliance */}
          <section aria-labelledby="compliance-heading" className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
              <FileText className="h-5 w-5 text-emerald-600" strokeWidth={1.75} />
              <h2 id="compliance-heading" className="text-base font-bold text-gray-900">
                DLT, SMS &amp; Regulatory Compliance
              </h2>
            </div>
            <div className="space-y-4 px-6 py-5 text-sm leading-relaxed text-gray-700">
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                <p className="font-semibold text-emerald-900">DLT Verification Statement</p>
                <p className="mt-1 text-emerald-800">
                  For DLT (Distributed Ledger Technology), SMS, regulatory, and business verification
                  purposes: <strong>LiftnGo Logistics</strong> is the publicly used brand name of{' '}
                  <strong>Maalvahak Mobility</strong> (registered under Puran Chand HUF).
                </p>
              </div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    All SMS communications are sent under the registered entity and brand{' '}
                    <strong className="text-gray-900">LiftnGo Logistics</strong>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    GSTIN <strong className="font-mono text-gray-900">07AAVHP9623B1ZT</strong> is
                    the valid GST number for all commercial transactions.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    Udyam Registration{' '}
                    <strong className="font-mono text-gray-900">UDYAM-DL-10-0108269</strong> confirms
                    MSME status under the Ministry of MSME, Government of India.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    Any bank, agency, or authority may contact us at{' '}
                    <a
                      href="mailto:liftngohuf@gmail.com"
                      className="font-semibold text-indigo-600 hover:underline"
                    >
                      liftngohuf@gmail.com
                    </a>{' '}
                    for verification.
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Details */}
          <section aria-labelledby="contact-details-heading" className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
              <Mail className="h-5 w-5 text-indigo-600" strokeWidth={1.75} />
              <h2 id="contact-details-heading" className="text-base font-bold text-gray-900">
                Contact Details
              </h2>
            </div>
            <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">Official Email</p>
                  <a
                    href="mailto:liftngohuf@gmail.com"
                    className="text-sm font-medium text-indigo-600 hover:underline"
                  >
                    liftngohuf@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">Website</p>
                  <a
                    href="https://www.goliftngo.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline"
                  >
                    www.goliftngo.com
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">Registered Jurisdiction</p>
                  <p className="text-sm font-medium text-gray-900">Delhi, India</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <div>
                  <p className="text-xs font-semibold text-gray-500">Business Operations</p>
                  <p className="text-sm font-medium text-gray-900">Pan-India (Primary: Delhi NCR, Noida, Rajasthan)</p>
                </div>
              </div>
            </div>
          </section>

          {/* Disclaimer */}
          <div className="rounded-xl border border-amber-200/70 bg-amber-50/60 px-5 py-4 text-sm leading-relaxed text-amber-900">
            <p className="font-semibold">Legal Disclaimer</p>
            <p className="mt-1">
              LiftnGo Logistics is a brand operated by Maalvahak Mobility, a business unit of Puran Chand HUF.
              All services, invoices, contracts, and communications are provided under the registered business
              entity. Any legal notices, compliance queries, or formal correspondence must be addressed to
              Puran Chand HUF at the email above.
            </p>
          </div>

          {/* Bottom CTAs */}
          <div className="flex flex-wrap gap-3 pb-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </main>
    </ContentLayout>
  );
}
