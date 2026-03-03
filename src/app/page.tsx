import JsonLd, { websiteJsonLd, organizationJsonLd } from "@/components/JsonLd";
import { Header, Hero, Features, FoodDelivery, Footer, PageWrapper } from "@/components/landing";

export default function Home() {
  return (
    <PageWrapper>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={organizationJsonLd} />
      <Header />
      <main>
        <Hero />
        <Features />
        <FoodDelivery />
      </main>
      <Footer />
    </PageWrapper>
  );
}
