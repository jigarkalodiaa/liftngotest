import Image from 'next/image';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = generatePageMetadata({
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Privacy policy for ${SITE_NAME}. How we collect, use, and protect your data when you use our logistics and delivery services.`,
  path: '/privacy',
  keywords: ['LiftnGo privacy', 'privacy policy', 'data protection', 'logistics privacy'],
});

const SECTIONS = [
  {
    title: 'Information we collect',
    content: 'We collect information you provide when you register, book a delivery, or contact us—such as name, phone number, email, and pickup/drop addresses. We also collect device and location data when you use our app or website to provide and improve our services.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    alt: 'Data and analytics',
  },
  {
    title: 'How we use your information',
    content: 'We use your information to facilitate bookings, connect you with drivers, process payments, send updates and support, and improve our platform. We may use aggregated data for analytics and to enhance safety and quality of service.',
    image: 'https://images.unsplash.com/photo-1551431009-a802eeec77b1?w=600&q=80',
    alt: 'How we use data',
  },
  {
    title: 'Sharing of information',
    content: 'We share information with driver partners necessary to complete your delivery. We may share data with service providers who assist our operations (e.g. payments, cloud hosting) under strict agreements. We do not sell your personal information to third parties.',
    image: 'https://images.unsplash.com/photo-1522071820081-009b0126c71f?w=600&q=80',
    alt: 'Sharing with partners',
  },
  {
    title: 'Data security',
    content: 'We use industry-standard measures to protect your data, including encryption and access controls. Despite our efforts, no method of transmission or storage is 100% secure; we encourage you to use strong passwords and keep your account details safe.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80',
    alt: 'Security and protection',
  },
  {
    title: 'Your rights',
    content: 'You may access, correct, or delete your personal information through your account settings or by contacting us. You may also object to or restrict certain processing where applicable law allows. We will respond to requests in accordance with applicable data protection laws.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
    alt: 'Your rights',
  },
  {
    title: 'Cookies and similar technologies',
    content: 'We use cookies and similar technologies to operate our website, remember your preferences, and analyse usage. You can manage cookie settings in your browser.',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80',
    alt: 'Cookies',
  },
  {
    title: 'Updates',
    content: 'We may update this privacy policy from time to time. We will notify you of material changes via the app, email, or a notice on our website. Continued use of our services after changes constitutes acceptance of the updated policy.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    alt: 'Policy updates',
  },
  {
    title: 'Contact us',
    content: `For privacy-related questions or requests, contact us at privacy@liftngo.com or through the contact options on our website. ${SITE_NAME} is committed to handling your data responsibly and in line with applicable laws.`,
    image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600&q=80',
    alt: 'Contact us',
  },
];

export default function PrivacyPage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gray-900">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&q=80"
              alt="Privacy and security"
              fill
              className="object-cover opacity-60"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Privacy Policy
            </h1>
            <p className="text-gray-200">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="text-gray-600 leading-relaxed mb-12">
            {SITE_NAME} (“we”, “us”, “our”) is committed to protecting your privacy. This policy describes how we collect, use, and safeguard your information when you use our logistics and delivery platform, website, and mobile applications.
          </p>

          <div className="space-y-12">
            {SECTIONS.map((s) => (
              <section key={s.title} className="rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm">
                <div className="relative h-44 sm:h-52">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 672px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 drop-shadow-sm">
                      {s.title}
                    </h2>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-gray-600 leading-relaxed">{s.content}</p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </ContentLayout>
  );
}
