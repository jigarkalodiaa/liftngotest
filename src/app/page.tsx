import dynamic from 'next/dynamic';
import JsonLd from '@/components/JsonLd';
import { buildHomepageSeoGraph } from '@/lib/structuredData/homepageGraph';
import {
  Header,
  Hero,
  Footer,
  PageWrapper,
} from '@/components/landing';
import { generatePageMetadata } from '@/lib/seo';
import { META_TITLE, SITE_DESCRIPTION, SEO_KEYWORDS } from '@/lib/site';

const sectionLoading = (minH: string) => () => <div className={`${minH} w-full shrink-0`} aria-hidden />;

const HomeSeoContent = dynamic(() => import('@/components/landing/HomeSeoContent'), {
  loading: sectionLoading('min-h-48'),
});
const HomeDeepAuthoritySection = dynamic(() => import('@/components/landing/HomeDeepAuthoritySection'), {
  loading: sectionLoading('min-h-64'),
});
const Features = dynamic(() => import('@/components/landing/Features'), { loading: sectionLoading('min-h-40') });
const ServiceSection = dynamic(() => import('@/components/landing/ServiceSection'), {
  loading: sectionLoading('min-h-48'),
});
const QuickRidesSection = dynamic(() => import('@/components/landing/QuickRidesSection'), {
  loading: sectionLoading('min-h-36'),
});
const AppDownloadSection = dynamic(() => import('@/components/landing/AppDownloadSection'), {
  loading: sectionLoading('min-h-40'),
});
const BlogSection = dynamic(() => import('@/components/landing/BlogSection'), {
  loading: sectionLoading('min-h-56'),
});
const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'), {
  loading: sectionLoading('min-h-36'),
});
const FaqSection = dynamic(() => import('@/components/landing/FaqSection'), {
  loading: sectionLoading('min-h-48'),
});

export const metadata = generatePageMetadata({
  title: META_TITLE,
  description: SITE_DESCRIPTION,
  path: '',
  keywords: [...SEO_KEYWORDS],
  /** Root `title.template` would append `| Liftngo` twice otherwise. */
  useAbsoluteTitle: true,
});

export default function Home() {
  return (
    <PageWrapper headerSlot={<Header />}>
      <JsonLd data={buildHomepageSeoGraph()} />
      <main
        className="page-stack min-h-[100dvh] min-h-screen w-full overflow-x-clip"
        aria-label="LiftnGo home: logistics, delivery, and transport services"
      >
        <Hero />
        <HomeSeoContent />
        <HomeDeepAuthoritySection />
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
