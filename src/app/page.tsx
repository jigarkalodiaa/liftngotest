import JsonLd, { websiteJsonLd, organizationJsonLd } from "@/components/JsonLd";
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
} from "@/components/landing";

export default function Home() {
  return (
    <PageWrapper headerSlot={<Header />}>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <main className="w-full min-h-screen flex flex-col">
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
