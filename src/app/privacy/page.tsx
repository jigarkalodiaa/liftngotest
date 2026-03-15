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
  },
  {
    title: 'How we use your information',
    content: 'We use your information to facilitate bookings, connect you with drivers, process payments, send updates and support, and improve our platform. We may use aggregated data for analytics and to enhance safety and quality of service.',
  },
  {
    title: 'Sharing of information',
    content: 'We share information with driver partners necessary to complete your delivery. We may share data with service providers who assist our operations (e.g. payments, cloud hosting) under strict agreements. We do not sell your personal information to third parties.',
  },
  {
    title: 'Data security',
    content: 'We use industry-standard measures to protect your data, including encryption and access controls. Despite our efforts, no method of transmission or storage is 100% secure; we encourage you to use strong passwords and keep your account details safe.',
  },
  {
    title: 'Your rights',
    content: 'You may access, correct, or delete your personal information through your account settings or by contacting us. You may also object to or restrict certain processing where applicable law allows. We will respond to requests in accordance with applicable data protection laws.',
  },
  {
    title: 'Cookies and similar technologies',
    content: 'We use cookies and similar technologies to operate our website, remember your preferences, and analyse usage. You can manage cookie settings in your browser.',
  },
  {
    title: 'Updates',
    content: 'We may update this privacy policy from time to time. We will notify you of material changes via the app, email, or a notice on our website. Continued use of our services after changes constitutes acceptance of the updated policy.',
  },
  {
    title: 'Contact us',
    content: `For privacy-related questions or requests, contact us at privacy@liftngo.com or through the contact options on our website. ${SITE_NAME} is committed to handling your data responsibly and in line with applicable laws.`,
  },
];

export default function PrivacyPage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Privacy policy
          </h1>
          <p className="text-gray-600 mb-10">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="prose prose-gray max-w-none space-y-10">
            <p className="text-gray-600 leading-relaxed">
              {SITE_NAME} (“we”, “us”, “our”) is committed to protecting your privacy. This policy describes how we collect, use, and safeguard your information when you use our logistics and delivery platform, website, and mobile applications.
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
