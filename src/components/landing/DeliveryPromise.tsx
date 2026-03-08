'use client';

import ContentWithImage from './ContentWithImage';

/** Delivery promise blocks: "Everything you crave, We will delivered." with image + description. */
export default function DeliveryPromise() {
  return (
    <>
      <ContentWithImage
        imageSrc="/dashboard/hero-delivery.png"
        imageAlt="Delivery – everything you crave, delivered"
        title="Everything you crave, We will delivered."
        description="Your dedicated advisor plans and manages all deliveries—no coordination hurdles."
      />
      <ContentWithImage
        imageSrc="/hero-delivery.svg"
        imageAlt="LiftnGo delivery"
        title="Everything you crave, We will delivered."
        description="GST-compliant billing options for per-trip or monthly bulk payments."
      />
    </>
  );
}
