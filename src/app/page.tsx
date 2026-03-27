import dynamic from 'next/dynamic';
import JsonLd from '@/components/JsonLd';
import { buildHomepageSeoGraph } from '@/lib/structuredData/homepageGraph';
import {
  Header,
  Hero,
  Footer,
  PageWrapper,
} from '@/components/landing';
import HomeSeoContent from '@/components/landing/HomeSeoContent';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import { generatePageMetadata } from '@/lib/seo';
import { META_TITLE, SITE_DESCRIPTION, SEO_KEYWORDS } from '@/lib/site';

const Features = dynamic(() => import('@/components/landing/Features'));
const ServiceSection = dynamic(() => import('@/components/landing/ServiceSection'));
const QuickRidesSection = dynamic(() => import('@/components/landing/QuickRidesSection'));
const AppDownloadSection = dynamic(() => import('@/components/landing/AppDownloadSection'));
const BlogSection = dynamic(() => import('@/components/landing/BlogSection'));
const FaqSection = dynamic(() => import('@/components/landing/FaqSection'));

export const metadata = generatePageMetadata({
  title: META_TITLE,
  description: SITE_DESCRIPTION,
  path: '',
  keywords: [...SEO_KEYWORDS],
});

export default function Home() {
  return (
    <PageWrapper headerSlot={<Header />}>
      <JsonLd data={buildHomepageSeoGraph()} />
      <main
        className="flex min-h-[100dvh] min-h-screen w-full flex-col overflow-x-clip"
        aria-label="LiftnGo home: logistics, delivery, and transport services"
      >
        <Hero />
        <HomeSeoContent />
        <Features />
        <ServiceSection />
        <QuickRidesSection />
        <AppDownloadSection />
        <BlogSection />
        <TestimonialsSection />
        <FaqSection />
      </main>
      <Footer />
    </PageWrapper>
  );
}
