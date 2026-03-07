import JsonLd, { websiteJsonLd, organizationJsonLd } from "@/components/JsonLd";
import {
  Header,
  Hero,
  Features,
  ServiceSection,
  EnterpriseSection,
  DeliveryPromise,
  Footer,
  PageWrapper,
} from "@/components/landing";

export default function Home() {
  return (
    <PageWrapper headerSlot={<Header />}>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <main>
        <Hero />
        <Features />
        <ServiceSection />
        <EnterpriseSection />
        <DeliveryPromise />
      </main>
      <Footer />
    </PageWrapper>
  );
}
