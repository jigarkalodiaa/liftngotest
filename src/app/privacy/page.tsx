import Image from '@/components/OptimizedImage';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';
import {
  indiaPhotoBangaloreLoadedTruck,
  indiaPhotoMumbaiLoading,
  indiaPhotoWarehouseLogistics,
} from '@/config/indiaLogisticsImages';

export const metadata = generatePageMetadata({
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Privacy policy for ${SITE_NAME}. How we collect, use, and protect your data when you use our logistics and delivery services.`,
  path: '/privacy',
  keywords: ['LiftnGo privacy', 'privacy policy', 'data protection', 'logistics privacy'],
});

/** Only 3 Unsplash assets — hero + 2 accent bands (fast, cohesive UI). */
const IMAGES = {
  hero: indiaPhotoBangaloreLoadedTruck(1920),
  security: indiaPhotoMumbaiLoading(1400),
  trust: indiaPhotoWarehouseLogistics(1400),
} as const;

const SECTIONS: { title: string; content: string }[] = [
  {
    title: 'Information we collect',
    content:
      'We collect information you provide when you register, book a delivery, or contact us—such as name, phone number, email, and pickup/drop addresses. We also collect device and location data when you use our app or website to provide and improve our services.',
  },
  {
    title: 'How we use your information',
    content:
      'We use your information to facilitate bookings, connect you with drivers, process payments, send updates and support, and improve our platform. We may use aggregated data for analytics and to enhance safety and quality of service.',
  },
  {
    title: 'Sharing of information',
    content:
      'We share information with driver partners necessary to complete your delivery. We may share data with service providers who assist our operations (e.g. payments, cloud hosting) under strict agreements. We do not sell your personal information to third parties.',
  },
  {
    title: 'Data security',
    content:
      'We use industry-standard measures to protect your data, including encryption and access controls. Despite our efforts, no method of transmission or storage is 100% secure; we encourage you to use strong passwords and keep your account details safe.',
  },
  {
    title: 'Your rights',
    content:
      'You may access, correct, or delete your personal information through your account settings or by contacting us. You may also object to or restrict certain processing where applicable law allows. We will respond to requests in accordance with applicable data protection laws.',
  },
  {
    title: 'Cookies and similar technologies',
    content:
      'We use cookies and similar technologies to operate our website, remember your preferences, and analyse usage. You can manage cookie settings in your browser.',
  },
  {
    title: 'Updates',
    content:
      'We may update this privacy policy from time to time. We will notify you of material changes via the app, email, or a notice on our website. Continued use of our services after changes constitutes acceptance of the updated policy.',
  },
  {
    title: 'Contact us',
    content: `For privacy-related questions or requests, contact us at privacy@liftngo.com or through the contact options on our website. ${SITE_NAME} is committed to handling your data responsibly and in line with applicable laws.`,
  },
];

export default function PrivacyPage() {
  return (
    <ContentLayout breadcrumbs={[BREADCRUMB_HOME, { name: 'Privacy', path: '/privacy' }]}>
      <main className="flex-1 bg-gray-50/80">
        {/* ① Hero */}
        <section className="relative min-h-[220px] overflow-hidden sm:min-h-[280px]">
          <Image
            src={IMAGES.hero}
            alt="Goods truck in Bengaluru, India — Liftngo privacy commitment for Indian customers"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/85 via-gray-900/70 to-gray-900/90" />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
            <span className="mb-3 rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white/95 backdrop-blur-sm">
              Legal
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">Privacy Policy</h1>
            <p className="mt-4 text-sm text-white/85 sm:text-base">
              Last updated:{' '}
              {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="rounded-2xl border border-gray-100 bg-white p-5 text-base leading-relaxed text-gray-600 shadow-sm sm:p-6">
            {SITE_NAME} (“we”, “us”, “our”) is committed to protecting your privacy. This policy describes how we collect, use, and safeguard
            your information when you use our logistics and delivery platform, website, and mobile applications.
          </p>

          {/* ② Accent — security / data protection */}
          <div className="relative mt-10 overflow-hidden rounded-2xl shadow-md ring-1 ring-gray-200/80">
            <div className="relative aspect-[2/1] w-full sm:aspect-[2.2/1]">
              <Image
                src={IMAGES.security}
                alt="Goods loading in Mumbai — secure handling of your booking data in India"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/75 via-gray-900/35 to-transparent" />
              <div className="absolute bottom-0 left-0 max-w-md p-5 sm:p-7">
                <p className="text-lg font-semibold text-white sm:text-xl">Security built in</p>
                <p className="mt-1 text-sm leading-relaxed text-white/90">
                  We treat your booking and account data with the same care as our logistics operations—structured, monitored, and protected.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-5">
            {SECTIONS.map((s, i) => (
              <section
                key={s.title}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
              >
                <div className="mb-2 flex items-baseline gap-3">
                  <span className="text-xs font-bold tabular-nums text-[var(--color-primary)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">{s.title}</h2>
                </div>
                <p className="border-t border-gray-50 pt-3 text-gray-600 leading-relaxed">{s.content}</p>
              </section>
            ))}
          </div>

          {/* ③ Closing visual — trust / people */}
          <div className="relative mt-12 overflow-hidden rounded-2xl shadow-md ring-1 ring-gray-200/80">
            <div className="relative aspect-[2.4/1] w-full min-h-[140px]">
              <Image
                src={IMAGES.trust}
                alt="Warehouse operations — secure handling of logistics data and trustworthy goods network"
                fill
                className="object-cover object-[center_30%]"
                sizes="(max-width: 768px) 100vw, 768px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)]/90 via-gray-900/25 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-center text-sm font-medium text-white drop-shadow sm:bottom-6 sm:text-base">
                Questions? We’re here to help — <span className="whitespace-nowrap">privacy@liftngo.com</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </ContentLayout>
  );
}
