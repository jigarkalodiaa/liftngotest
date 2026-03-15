import Image from 'next/image';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = generatePageMetadata({
  title: `Terms & Conditions | ${SITE_NAME}`,
  description: `Terms of service for using ${SITE_NAME} logistics and delivery platform. User agreement, booking terms, and acceptable use.`,
  path: '/terms',
  keywords: ['LiftnGo terms', 'terms of service', 'user agreement', 'delivery terms'],
});

const SECTIONS = [
  {
    title: 'Acceptance of terms',
    content: `By accessing or using the ${SITE_NAME} platform, website, or mobile applications, you agree to be bound by these Terms of Service. If you do not agree, do not use our services. We may update these terms from time to time; continued use after changes constitutes acceptance.`,
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80',
    alt: 'Agreement and terms',
  },
  {
    title: 'Description of services',
    content: `${SITE_NAME} provides a technology platform that connects customers with driver partners for goods transportation and last-mile delivery. We do not provide transport ourselves; we facilitate bookings between users and drivers. Availability and pricing may vary by location and service type.`,
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80',
    alt: 'Delivery services',
  },
  {
    title: 'User accounts and eligibility',
    content: 'You must be at least 18 years old and able to enter into a binding contract to use our services. You are responsible for maintaining the confidentiality of your account and for all activity under your account. You must provide accurate and complete information when registering or booking.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
    alt: 'User account',
  },
  {
    title: 'Bookings and payments',
    content: 'When you book a delivery, you agree to pay the fare and any applicable fees displayed at the time of booking. Payment may be collected in advance or after completion as per the chosen method. Cancellation and refund policies are disclosed at booking and in the app. We may use third-party payment processors; their terms may also apply.',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=600&q=80',
    alt: 'Payment and booking',
  },
  {
    title: 'Prohibited use',
    content: 'You may not use our platform for any illegal purpose, to transport prohibited or hazardous goods, or to harm others. You may not abuse, circumvent, or attempt to gain unauthorized access to our systems or other users' accounts. We reserve the right to suspend or terminate accounts that violate these terms.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
    alt: 'Security and compliance',
  },
  {
    title: 'Driver partners',
    content: 'Driver partners are independent; they are not employees of LiftnGo. We do not guarantee the availability, conduct, or quality of any driver. Disputes regarding a delivery may be raised through our support channels; we will endeavour to assist in resolution in line with our policies.',
    image: 'https://images.unsplash.com/photo-1522071820081-009b0126c71f?w=600&q=80',
    alt: 'Driver partners',
  },
  {
    title: 'Disclaimer of warranties',
    content: 'Our services are provided "as is" and "as available". We do not warrant that the platform will be uninterrupted, error-free, or free of harmful components. To the fullest extent permitted by law, we disclaim all warranties, express or implied.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    alt: 'Legal notice',
  },
  {
    title: 'Limitation of liability',
    content: 'To the maximum extent permitted by applicable law, LiftnGo and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or use. Our total liability for any claim arising from your use of the services shall not exceed the amount you paid to us in the twelve months preceding the claim.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
    alt: 'Liability',
  },
  {
    title: 'Governing law',
    content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India, unless otherwise required by applicable law.',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80',
    alt: 'Law and jurisdiction',
  },
  {
    title: 'Contact',
    content: `For questions about these terms, contact us at legal@liftngo.com or through the contact options on our website.`,
    image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600&q=80',
    alt: 'Contact us',
  },
];

export default function TermsPage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gray-900">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&q=80"
              alt="Terms and agreement"
              fill
              className="object-cover opacity-60"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Terms & Conditions
            </h1>
            <p className="text-gray-200">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <p className="text-gray-600 leading-relaxed mb-12">
            Please read these Terms of Service (“Terms”) carefully before using the {SITE_NAME} platform. By using our services, you agree to these Terms.
          </p>

          <div className="space-y-12">
            {SECTIONS.map((s, i) => (
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
