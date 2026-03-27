import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import JsonLd from '@/components/JsonLd';
import { buildHomepageSeoGraph } from '@/lib/structuredData/homepageGraph';
import { Header, Hero, PageWrapper } from '@/components/landing';
import { generatePageMetadata } from '@/lib/seo';
import { META_TITLE, SITE_DESCRIPTION, SEO_KEYWORDS } from '@/lib/site';

const sectionLoading = (minH: string) => () => <div className={`${minH} w-full shrink-0`} aria-hidden />;

/** Client-only chunks — smaller main-thread work before hydration. */
const dynamicClient = (
  importer: () => Promise<{ default: ComponentType<object> }>,
  minH: string,
) => dynamic(importer, { ssr: false, loading: sectionLoading(minH) });

/** Server components — keep SSR for SEO; still code-split the chunk. */
const dynamicSsr = (
  importer: () => Promise<{ default: ComponentType<object> }>,
  minH: string,
) => dynamic(importer, { loading: sectionLoading(minH) });

const HomeSeoContent = dynamicSsr(() => import('@/components/landing/HomeSeoContent'), 'min-h-48');
const Features = dynamicClient(() => import('@/components/landing/Features'), 'min-h-40');
const ServiceSection = dynamicClient(() => import('@/components/landing/ServiceSection'), 'min-h-48');
const QuickRidesSection = dynamicClient(() => import('@/components/landing/QuickRidesSection'), 'min-h-36');
const AppDownloadSection = dynamicClient(() => import('@/components/landing/AppDownloadSection'), 'min-h-40');
const BlogSection = dynamicSsr(() => import('@/components/landing/BlogSection'), 'min-h-56');
const TestimonialsSection = dynamicSsr(() => import('@/components/landing/TestimonialsSection'), 'min-h-36');
const FaqSection = dynamicClient(() => import('@/components/landing/FaqSection'), 'min-h-48');
const Footer = dynamic(() => import('@/components/landing/Footer'), { ssr: false, loading: () => <div className="min-h-32 bg-gray-900" aria-hidden /> });

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
