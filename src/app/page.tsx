import JsonLd, {
  websiteJsonLd,
  organizationJsonLd,
  localBusinessJsonLd,
  faqPageJsonLd,
} from '@/components/JsonLd';
import {
  Header,
  Hero,
  Features,
  ServiceSection,
  QuickRidesSection,
  AppDownloadSection,
  BlogSection,
  FaqSection,
  Footer,
  PageWrapper,
} from '@/components/landing';
import { META_TITLE, SITE_DESCRIPTION, SITE_URL } from '@/lib/site';

export const metadata = {
  title: META_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    url: SITE_URL,
    type: 'website' as const,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function Home() {
  return (
    <PageWrapper headerSlot={<Header />}>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={localBusinessJsonLd} />
      <JsonLd data={faqPageJsonLd} />
      <main
        className="w-full min-h-screen flex flex-col"
        aria-label="LiftnGo home: logistics, delivery, and transport services"
      >
        <Hero />
        <Features />
        <ServiceSection />
        <QuickRidesSection />
        <AppDownloadSection />
        <BlogSection />
        <FaqSection />
      </main>
      <Footer />
    </PageWrapper>
  );
}
