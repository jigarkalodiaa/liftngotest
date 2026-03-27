'use client';

import ContentWithImage from './ContentWithImage';

/** Delivery promise blocks: "Everything you crave, We will delivered." with image + description. */
export default function DeliveryPromise() {
  return (
    <>
      <ContentWithImage
        imageSrc="/hero-delivery.svg"
        imageAlt="Liftngo goods logistics — packages and delivery operations"
        title="Goods delivered with clear coordination"
        description="Your operations team gets predictable handoffs—pickup, vehicle class, and proof-oriented delivery—not ad-hoc ride hail."
      />
      <ContentWithImage
        imageSrc="/services/three-wheeler.svg"
        imageAlt="Three-wheeler cargo — compact goods transport"
        title="Billing that fits B2B"
        description="GST-aware options for per-trip or recurring lanes—aligned with how shops and warehouses actually pay."
      />
    </>
  );
}
