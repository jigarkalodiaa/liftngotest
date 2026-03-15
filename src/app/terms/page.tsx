import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = generatePageMetadata({
  title: `Terms of Service | ${SITE_NAME}`,
  description: `Terms of service for using ${SITE_NAME} logistics and delivery platform. User agreement, booking terms, and acceptable use.`,
  path: '/terms',
  keywords: ['LiftnGo terms', 'terms of service', 'user agreement', 'delivery terms'],
});

const SECTIONS = [
  {
    title: 'Acceptance of terms',
    content: `By accessing or using the ${SITE_NAME} platform, website, or mobile applications, you agree to be bound by these Terms of Service. If you do not agree, do not use our services. We may update these terms from time to time; continued use after changes constitutes acceptance.`,
  },
  {
    title: 'Description of services',
    content: `${SITE_NAME} provides a technology platform that connects customers with driver partners for goods transportation and last-mile delivery. We do not provide transport ourselves; we facilitate bookings between users and drivers. Availability and pricing may vary by location and service type.`,
  },
  {
    title: 'User accounts and eligibility',
    content: 'You must be at least 18 years old and able to enter into a binding contract to use our services. You are responsible for maintaining the confidentiality of your account and for all activity under your account. You must provide accurate and complete information when registering or booking.',
  },
  {
    title: 'Bookings and payments',
    content: 'When you book a delivery, you agree to pay the fare and any applicable fees displayed at the time of booking. Payment may be collected in advance or after completion as per the chosen method. Cancellation and refund policies are disclosed at booking and in the app. We may use third-party payment processors; their terms may also apply.',
  },
  {
    title: 'Prohibited use',
    content: 'You may not use our platform for any illegal purpose, to transport prohibited or hazardous goods, or to harm others. You may not abuse, circumvent, or attempt to gain unauthorized access to our systems or other users’ accounts. We reserve the right to suspend or terminate accounts that violate these terms.',
  },
  {
    title: 'Driver partners',
    content: 'Driver partners are independent; they are not employees of LiftnGo. We do not guarantee the availability, conduct, or quality of any driver. Disputes regarding a delivery may be raised through our support channels; we will endeavour to assist in resolution in line with our policies.',
  },
  {
    title: 'Disclaimer of warranties',
    content: 'Our services are provided “as is” and “as available”. We do not warrant that the platform will be uninterrupted, error-free, or free of harmful components. To the fullest extent permitted by law, we disclaim all warranties, express or implied.',
  },
  {
    title: 'Limitation of liability',
    content: 'To the maximum extent permitted by applicable law, LiftnGo and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or use. Our total liability for any claim arising from your use of the services shall not exceed the amount you paid to us in the twelve months preceding the claim.',
  },
  {
    title: 'Governing law',
    content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India, unless otherwise required by applicable law.',
  },
  {
    title: 'Contact',
    content: `For questions about these terms, contact us at legal@liftngo.com or through the contact options on our website.`,
  },
];

export default function TermsPage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Terms of service
          </h1>
          <p className="text-gray-600 mb-10">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-gray max-w-none space-y-10">
            <p className="text-gray-600 leading-relaxed">
              Please read these Terms of Service (“Terms”) carefully before using the {SITE_NAME} platform. By using our services, you agree to these Terms.
            </p>
            {SECTIONS.map((s) => (
              <section key={s.title}>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">{s.title}</h2>
                <p className="text-gray-600 leading-relaxed">{s.content}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
    </ContentLayout>
  );
}
